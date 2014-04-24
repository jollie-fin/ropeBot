#include <avr/interrupt.h>
#include <avr/cpufunc.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>

#define MAJORITY 5
#define MAJORITY_THRES 3
#define BUFFER_SIZE 50

#define ZERO 1
#define ONE 2
#define HIZ 3
#define UNKNOWN 0

static uint8_t _majority[MAJORITY];
static uint8_t _majority_index;
static uint8_t _last_value;
static uint8_t _threshold[4] = {12,30,50,70};
static uint32_t _timestamp;
static uint32_t _last_timestamp;
static uint8_t _buffer[BUFFER_SIZE];
static uint16_t _buffer_delay[BUFFER_SIZE];
static uint8_t _buffer_index;

void acquisition(uint8_t val)
{
  _timestamp++;
  uint8_t val_bit = UNKNOWN;
  if (val <= _threshold[0])
    val_bit = ZERO;
  else if (val >= _threshold[1] && val <= _threshold[2])
    val_bit = HIZ;
  else if (val >= _threshold[3])
    val_bit = ONE;

  if (val_bit)
  {
    _majority[_majority_index] = val_bit;
    _majority_index = (_majority_index+1)%MAJORITY;
  }

  uint8_t rank[4] = {0, 0, 0, 0};
  uint8_t i;
  for (i = 0; i < MAJORITY; i++)
  {
    rank[_majority[i]]++;
  }
  if (rank[UNKNOWN])
    return;
  
  val_bit = _last_value;
  for (i = 0; i <= 2; i++)
  {
    if (rank[i] >= MAJORITY_THRES)
      val_bit = i;
  }
  if (!val_bit)
    return;

  if (val_bit != _last_value)
  {
    _buffer[_buffer_index] = val_bit;
    _last_value = val_bit;
    uint32_t dt = _timestamp - _last_timestamp;
    if (dt > 65535)
      dt = 65535;

    _buffer_delay[_buffer_index] = dt;
    _last_timestamp = _timestamp;
  }
}



