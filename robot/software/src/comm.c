#include <avr/interrupt.h>
#include <avr/cpufunc.h>
#include <util/atomic.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include "debug.h"
#include "comm.h"

#define TIME_THRESHOLD 3
#define BUFFER_SIZE 64 //(3.2ms at 20000smp/s)

#define ZERO 0
#define ONE 1
#define HIZ 3
#define UNKNOWN 2

static uint8_t _fifo_first;
static volatile uint8_t _fifo_last;
static volatile uint8_t _buffer[BUFFER_SIZE];
static uint8_t _value_threshold[4] = {'2','3','5','6'};

void C_decode();
static void do_something_with_data(uint16_t);
void C_init()
{
}

#define ADC_vect_C 1
#ifdef ADC_vect_C
__attribute__((optimize("O3")))
//ISR(ADC_vect)
ISR(TIMER2_COMPA_vect)
{
  uint8_t next_fifo_last = (uint8_t) (_fifo_last+1)%BUFFER_SIZE;
  if (next_fifo_last == _fifo_first)
    return;
  _fifo_last=next_fifo_last;   
  _buffer[_fifo_last] = DEBUG_IN;
}
#else
//36 cycles vs 50cycles
ISR(TIMER2_COMPA_vect, ISR_NAKED)
//ISR(ADC_vect, ISR_NAKED)
{
#if BUFFER_SIZE != 64
#error "ISR(ADC_vect) was designed to work with BUFFER_SIZE == 64"
#endif

  asm volatile(
	"push r0\n"
  "/*save SREG*/\n\t"
  "in r0,__SREG__\n\t"
	"push r25\n\t"
	"push r30\n"
  "/*end of prologue*/\n\t"
	"push r31\n\t"
	"lds r30,_fifo_last\n"
  "/*save _fifo_last for later*/\n\t"
  "mov r31,r30\n"
  "/*increment r31*/\n\t" 
	"inc r31\n"
  "/*modulo 64*/\n\t"
	"andi r31,lo8(63)\n\t"
	"lds r25,_fifo_first\n"
  "/*if the fifo is full*/\n\t"
	"cp r31,r25\n\t"
	"breq 1f\n"
  "/*save the new end of the fifo*/\n\t"
  "sts _fifo_last,r31\n"
  "/*read the ADC*/\n\t"
	"lds r25,%0\n"
  "/*compute _buffer[_fifo_last]*/\n\t"
	"clr r31\n\t"
	"subi r30,lo8(-(_buffer))\n\t"
	"sbci r31,hi8(-(_buffer))\n"
  "/*store the value read on ADC*/\n\t"
	"st Z,r25\n"
  "/*start of epilogue*/\n"
  "1:\n\t"
  "pop r31\n\t"
	"pop r30\n\t"
	"pop r25\n"
  "/*restore SREG*/\n\t"
	"out __SREG__,r0\n\t"
	"pop r0\n\t"
	"reti\n\t"
//  ::"M" (_SFR_MEM_ADDR(ADCL)));
  ::"M" (0x22));
}
#endif

void C_decode()
{
  static uint16_t _thres;
  static uint8_t _consecutive;
  static uint16_t _time_passed;
  static uint16_t _data;
  static uint8_t _no_bit;
  static uint8_t _parity;
  static uint8_t _last_valid_value = UNKNOWN;
  static uint8_t _last_seen_value = UNKNOWN;
  while (_fifo_first != _fifo_last)
  {
    uint8_t adc;
    adc = _buffer[_fifo_first];
    _fifo_first = (_fifo_first+1) % BUFFER_SIZE;

    if (adc == ' ')
    {
      exit(0);
    }

#if 1

    if (_time_passed < 65535u) /*time passed since last reset*/
      _time_passed++;

    uint8_t value_read = UNKNOWN;
    if (adc <= _value_threshold[0]) /*detection of value in respect to threshold*/
      value_read = ZERO;
    else if (adc >= _value_threshold[1] && adc <= _value_threshold[2])
      value_read = HIZ;
    else if (adc >= _value_threshold[3])
      value_read = ONE;

    if (value_read != _last_seen_value) /*value not stabilized*/
    {
      _last_seen_value = value_read;
      _consecutive = 0;
      continue;
    }

    if (value_read == UNKNOWN) /*value out of confidence limit*/
      continue;

    if (_consecutive < TIME_THRESHOLD) /*increment _consecutive*/
      _consecutive++;
  
    if (_consecutive < TIME_THRESHOLD) /*not enough coherent value*/
      continue;
  
    /*at this point, value_read correspond to the input value with strong guarantee*/
  
    if (value_read != _last_valid_value && _last_valid_value != UNKNOWN) /*it is a meaningful transition*/
    {
      uint8_t orig = _last_valid_value;
      uint8_t dest = value_read;

      if (orig == HIZ) /*begining of a new pulsetrain*/
      {
        _no_bit = 0;
        _thres = 0;
        _data = 0u;
        _parity = 0u;
      }
      else if (_no_bit < 4) /*synchronisation*/
      {
        _thres+=_time_passed;
        _no_bit++;
      }
      else
      {
        /*BMC : http://en.wikipedia.org/wiki/Differential_Manchester_encoding*/
        if (_no_bit == 4) /*computing time threshold for bit detection*/
        {
          _thres *= 3;
          _thres /= 8;
        }

        uint8_t bit = HIZ;
        if (_time_passed > _thres)
        {
          /*zero*/
          _no_bit+=2;
          bit = 0;
        }
        else
        {
          /*one*/
          _no_bit++;
          if (_no_bit %2 == 0)
            bit = 1;
        }

        _parity ^= bit;
        if (_no_bit <= 36) /*if it isn't the parity bit, add bit to value*/
        {
          _data <<= 1;
          _data |= bit;
        }
      }
      if (dest == HIZ && orig != UNKNOWN)
      {
        if (_parity == 0 && _no_bit == 38) /*correct value*/
        {
          DEBUG_OUT = 'K';
          print_hex(_data);
          do_something_with_data(_data);
        }

        if (_parity != 0 && _no_bit == 38) /*bad parity bit (inversion 0 and 1?)*/
          DEBUG_OUT = 'P';

        if (_no_bit < 38) /*pulse train too short*/
          DEBUG_OUT = 'L';

        if (_no_bit > 38)
          DEBUG_OUT = 'H';/*pulse train too long*/

        DEBUG_OUT = ' ';
      }
      _time_passed = 0u;
    }
    _last_valid_value = value_read;
  }
#endif

}


uint32_t C_timestamp()
{
  uint32_t ret;
  ATOMIC_BLOCK(ATOMIC_RESTORESTATE)
  {
    ret = 0;
  }
  return ret;  
}

static void do_something_with_data(uint16_t data)
{

}
