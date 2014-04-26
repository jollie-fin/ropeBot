#include <avr/interrupt.h>
#include <avr/cpufunc.h>
#include <util/atomic.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include "debug.h"
#include "comm.h"

#define TIME_THRESHOLD 3
#define BUFFER_SIZE 50

#define ZERO 0
#define ONE 1
#define HIZ 3
#define UNKNOWN 2

static uint8_t _last_read_value = UNKNOWN;
static uint8_t _last_valid_value = UNKNOWN;
static uint8_t _last_seen_value = UNKNOWN;
static uint8_t _consecutive;
static uint8_t _value_threshold[4] = {'2','3','5','6'};
static uint32_t volatile _timestamp;
static uint16_t _time_passed;
static uint16_t _data;
static uint8_t _no_bit;
static uint16_t _thres;
static uint8_t _parity;

void C_decode(uint8_t last_index);

void C_init()
{
  _thres = 12u;
}



__attribute__((optimize("O3")))
ISR(TIMER2_COMPA_vect)
{
/*  uint8_t adc = ADCL;
  if (ADCSRA & _BV(ADSC))
    adc = _last_read_value;
  else
  {
    adc = ADCL;
    ADCSRA |= ADSC; //start again a conversion
    _last_read_value = adc;
  }*/
  uint8_t adc;
  adc = DEBUG_IN;
  if (adc == ' ')
  {
    exit(0);
  }
  _last_read_value = adc;

  _timestamp++;
  if (_time_passed < 65535u)
    _time_passed++;

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


  if (value_read == UNKNOWN)
    return;

  if (_consecutive == TIME_THRESHOLD)
    return;

  _consecutive++;
  
  if (_consecutive < TIME_THRESHOLD)
    return;
  
  //this point, value_read correspond to the input value with strong guarantee
  
  if (value_read != _last_valid_value)
  {
    uint8_t orig = _last_valid_value;
    uint8_t dest = value_read;

    if (orig == UNKNOWN)
    {
    }
    if (orig == HIZ)
    {
      _no_bit = 0;
      _thres = 0;
      _data = 0u;
      _parity = 0u;
    }
    else if (_no_bit < 4)
    {
      _thres+=_time_passed;
      _no_bit++;
    }
    else
    {
      if (_no_bit == 4)
      {
        _thres *= 3;
        _thres /= 8;
      }

      uint8_t bit = HIZ;
      if (_time_passed > _thres)
      {
        //BMC : http://en.wikipedia.org/wiki/Differential_Manchester_encoding
        //zero
        _no_bit+=2;
        bit = 0;
      }
      else
      {
        _no_bit++;
        if (_no_bit %2 == 0)
          bit = 1;
      }
      if (bit != HIZ)
      {
        _parity ^= bit;
        if (_no_bit <= 36)
        {
          _data <<= 1;
          _data |= bit;
        }
      }
    }
    if (dest == HIZ && orig != UNKNOWN)
    {
      if (_parity == 0 && _no_bit == 38)
      {
        DEBUG_OUT = 'K';
        print_hex(_data);
      }

      if (_parity != 0 && _no_bit == 38)
        DEBUG_OUT = 'P';

      if (_no_bit < 38)
        DEBUG_OUT = 'L';

      if (_no_bit > 38)
        DEBUG_OUT = 'H';

      DEBUG_OUT = ' ';
    }
    _last_valid_value = value_read;

    _time_passed = 0u;
  }
}

uint32_t C_timestamp()
{
  uint32_t ret;
  ATOMIC_BLOCK(ATOMIC_RESTORESTATE)
  {
    ret = _timestamp;
  }
  return ret;  
}

