#include <avr/interrupt.h>
#include <avr/cpufunc.h>
#include <stdint.h>
#include "def.h"
#include "step.h"

//length[i] is the final length of string i measure in motor step
static int16_t _length[4];
//offset[i] is the offset that is added to length[i] to obtain the motor curviline coordinate (actually, we just need the value modulo 4, but it is easier to debug this way)
static int16_t _offset[4];

//physical coordinates of motor-i
static int16_t _coor_motor[4][2];

static int16_t _coor_robot[2];
static int16_t _coor_robot_dest[2];

//dt, dcoor and error_coor are use for bresenham line algorithm
static int16_t _dcoor[2];
static int16_t _dt;
static int16_t _error[2];

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

  _delay--;

  uint8_t i;

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
    int16_t dx = _coor_robot[0] - _coor_motor[i][0];
    int16_t dy = _coor_robot[1] - _coor_motor[i][1];
    int32_t hypsq = dx*dx+dy*dy;
    int16_t len = (_length[i]+1);
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

inline uint32_t get_timestamp()
{
  return _timestamp;  
}


inline uint8_t is_moving()
{
  return _moving;  
}

void begin_movement(uint16_t xdest, uint16_t ydest, uint16_t duration)
{
  while (is_moving());

  _coor_robot_dest[0] = xdest;
  _coor_robot_dest[1] = ydest;
  _delay = duration;
  _error[0] = _delay;
  _error[1] = _delay;
  _dt = _delay * 2;
  _dcoor[0] = 2 * _coor_robot_dest[0] - _coor_robot[0];
  _dcoor[1] = 2 * _coor_robot_dest[1] - _coor_robot[1];
  _moving = 1;
}

