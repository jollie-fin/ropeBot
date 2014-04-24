#include <avr/interrupt.h>
#include <avr/cpufunc.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include "debug.h"

#define TIME_THRESHOLD 3
#define BUFFER_SIZE 50

#define ZERO 1
#define ONE 2
#define HIZ 3
#define UNKNOWN 0

static uint8_t _last_read_value;
static uint8_t _last_valid_value;
static uint8_t _last_seen_value;
static uint8_t _consecutive;
static uint8_t _value_threshold[4] = {10,30,50,70};
static uint32_t _timestamp;
static uint32_t _last_timestamp;
static uint8_t _buffer[BUFFER_SIZE];
static uint16_t _buffer_delay[BUFFER_SIZE];
static uint8_t _buffer_index;



void C_init()
{
}

inline void C_stop_interrupt()
{
  asm volatile("sts %0,__zero_reg__\n\t"::"M" (_SFR_MEM_ADDR(TIMSK2)));
}

inline void C_start_interrupt()
{
  asm volatile("sts %0,%1\n\t"::"M" (_SFR_MEM_ADDR(TIMSK2)), "r" ((uint8_t) _BV(OCIE2A)));
}



__attribute__((optimize("O3")))
ISR(TIMER2_COMPA_vect)
{
    debug_print("2\n");
  uint8_t adc = ADCL;

  if (ADCSRA & _BV(ADSC))
    adc = _last_read_value;
  else
  {
    adc = ADCL;
    ADCSRA |= ADSC; //start again a conversion
    _last_read_value = adc;
  }

  _timestamp++;
  uint8_t value_read = UNKNOWN;
  if (adc <= _value_threshold[0])
    value_read = ZERO;
  else if (adc >= _value_threshold[1] && adc <= _value_threshold[2])
    value_read = HIZ;
  else if (adc >= _value_threshold[3])
    value_read = ONE;

  if (value_read != _last_seen_value)
  {
    _last_seen_value = value_read;
    _consecutive = 0;
    return;
  }


  if (!value_read)
    return;

  if (_consecutive == TIME_THRESHOLD)
    return;

  _consecutive++;
  
  if (_consecutive < TIME_THRESHOLD)
    return;
  
  //this point, value_read correspond to the input value with strong guarantee
  
  if (value_read != _last_valid_value)
  {
    _last_valid_value = value_read;
    _buffer[_buffer_index] = value_read;

    uint32_t dt = _timestamp - _last_timestamp;
    if (dt > 65535)
      dt = 65535;
    _buffer_delay[_buffer_index] = dt;

    _buffer_index++;
    _buffer_index %= BUFFER_SIZE;


    _last_timestamp = _timestamp;
  }
}



