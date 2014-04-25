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

#define ZERO 1
#define ONE 2
#define HIZ 3
#define UNKNOWN 0

static uint8_t _last_read_value;
static uint8_t _last_valid_value;
static uint8_t _last_seen_value;
static uint8_t _consecutive;
static uint8_t _value_threshold[4] = {'2','3','5','6'};
static uint32_t volatile _timestamp;
static uint16_t _time_passed;
static transition_t _buffer[BUFFER_SIZE];
static uint8_t _buffer_index;

void C_decode(uint8_t last_index);

void C_init()
{
}

uint8_t C_buffer_orig(uint8_t i)
{
  return _buffer[i].orig;
}

uint8_t C_buffer_dest(uint8_t i)
{
  return _buffer[i].dest;
}

uint16_t C_buffer_delay(uint8_t i)
{
  uint16_t delay;
  ATOMIC_BLOCK(ATOMIC_RESTORESTATE)
  {
    delay = _buffer[i].delay;
  }
  return delay;
}



__attribute__((optimize("O3")))
ISR(TIMER2_COMPA_vect)
{
//    debug_print("2\n");

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
    _buffer[_buffer_index].orig = _last_valid_value;
    _buffer[_buffer_index].dest = value_read;
    _buffer[_buffer_index].delay = _time_passed;

    _last_valid_value = value_read;

    _buffer_index++;
    _buffer_index %= BUFFER_SIZE;
    _time_passed = 0u;
    if (value_read == HIZ)
    {
      C_decode(_buffer_index);
    }
  }
}



void C_decode(uint8_t last_index)
{


}

