#include <avr/interrupt.h>
#include <avr/cpufunc.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include "def.h"
#include "step.h"
#include "sqrt32.h"


//length[i] is the current length of string i measure in motor step
static int16_t _length[4];
//offset[i] is the offset that is added to length[i] to obtain the motor curviline coordinate (actually, we just need the value modulo 4, but it is easier to debug this way)
static int16_t _offset[4];

//physical coordinates of motor-i
static int16_t _coor_motor[4][2];

//physical coordinates of robot
static int16_t _coor_robot[2];

//destination of robot
static int16_t _coor_robot_dest[2];

//dt, dcoor and error_coor are use for bresenham line algorithm
static int16_t _dcoor[2];
static int16_t _dt;
static int16_t _error[2];
static int16_t _width;

//t is a timestamp
uint32_t _timestamp;

//_delay is the minimal time of the movement of the robot
static uint16_t _delay;
//_moving = true if the movement is finished
static volatile uint8_t _moving;


__attribute__((optimize("O3"))) 
ISR(TIMER0_COMPA_vect)
{
  _timestamp++;

  if (!_moving)
  {
    return;
  }
  uint8_t moving = _coor_robot[0] != _coor_robot_dest[0] || _coor_robot[1] != _coor_robot_dest[1] || _delay > 0;
  if (!moving)
  {
    _moving = moving;
    return;
  }

  if (_delay > 0)
    _delay--;

  int i;

  for (i = 0; i < 2; i++)
  {
    _error[i] -= _dcoor[i];
    if (_error[i] < 0)
    {
      _error[i] += _dt;
      if (_coor_robot[i] < _coor_robot_dest[i])
        _coor_robot[i]++;
      if (_coor_robot[i] > _coor_robot_dest[i])
        _coor_robot[i]--;
    }
  }
  
  uint8_t out = 0;

  for (i = 0; i < 4; i++)
  {
    int32_t dx = _coor_robot[0] - _coor_motor[i][0];
    int32_t dy = _coor_robot[1] - _coor_motor[i][1];
    int32_t hypsq = dx*dx+dy*dy;
    int32_t len = (_length[i]+1);
    int32_t lensq = len*len;
    if (lensq <= hypsq)
      _length[i]++;
    len = (_length[i]-1);
    lensq = len*len;
    if (lensq >= hypsq)
      _length[i]--;
    out |= (uint8_t) ((_length[i]+_offset[i]) % 4) << (i * 2);
  }

  STEP_OUT = out;
}

inline uint32_t S_timestamp()
{
  return _timestamp;  
}


inline uint8_t S_is_moving()
{
  return _moving;  
}

inline uint16_t S_width()
{
  return _width;  
}

void S_init()
{
  while (_moving);

  int16_t x = 458; //half size of table
  int16_t m = 500;
  _coor_motor[0][0] = -m;
  _coor_motor[0][1] = -m;
  _coor_motor[1][0] = m;
  _coor_motor[1][1] = -m;
  _coor_motor[2][0] = -m;
  _coor_motor[2][1] = m;
  _coor_motor[3][0] = m;
  _coor_motor[3][1] = m;
  _width = x*2;
  _length[0] = 707;
  _length[1] = 707;
  _length[2] = 707;
  _length[3] = 707;

  _offset[0] = 0;
  _offset[1] = 0;
  _offset[2] = 0;
  _offset[3] = 0;

  _coor_robot[0] = 0;
  _coor_robot[1] = 0;
}

void S_move_to_abs(int16_t xdest, int16_t ydest, uint16_t duration)
{
  while (_moving);

  _coor_robot_dest[0] = xdest;
  _coor_robot_dest[1] = ydest;
  _delay = duration;
  _error[0] = _delay;
  _error[1] = _delay;
  _dt = _delay * 2;
  _dcoor[0] = 2 * abs(_coor_robot_dest[0] - _coor_robot[0]);
  _dcoor[1] = 2 * abs(_coor_robot_dest[1] - _coor_robot[1]);
  _moving = 1;
}

void S_move_to(int16_t x, int16_t y, uint16_t duration)
{
  x *= 2;
  y *= 2;
  x -= 11;
  y -= 11;
  x *= _width;
  y *= _width;
  x /= 22;
  y /= 22;
  S_move_to_abs(x, y, duration);
}

