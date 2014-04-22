#include <avr/interrupt.h>
#include <stdint.h>
#include "def.h"
#include "step.h"

//length[i] is the final length of string i measure in motor step
static int16_t length[4];
//offset[i] is the offset that is added to length[i] to obtain the motor curviline coordinate (actually, we just need the value modulo 4, but it is easier to debug this way)
static int16_t offset[4];

//physical coordinates of motor-i
static int16_t coor_motor[4][2];

static int16_t coor_robot[2];
static int16_t coor_robot_dest[2];

//dt, dl and error_coor are use for bresenham line algorithm
static int16_t dcoor;
static int16_t dt;
static int16_t error_coor;

//t is a timestamp
uint32_t timestamp;

static uint16_t time_left;

void end_movement(void);

//__attribute__((optimize("O3")))
ISR(TIMER0_COMPA_vect)
{
  timestamp++;
  if (time_left == 0)
  {
    end_movement();
    return;
  }
  time_left--;

  error_coor -= dcoor;
  if (error_coor < 0)
  {
    error_coor += dt;
    if (coor_robot[0] < coor_robot_dest[0])
      coor_robot[0]++;
    if (coor_robot[0] > coor_robot_dest[0])
      coor_robot[0]--;
    if (coor_robot[1] < coor_robot_dest[1])
      coor_robot[1]++;
    if (coor_robot[1] > coor_robot_dest[1])
      coor_robot[1]--;
  }
  
  uint8_t i;
  uint8_t out = 0;

  for (i = 0; i < 4; i++)
  {
    int16_t dx = coor_robot[0] - coor_motor[i][0];
    int16_t dy = coor_robot[1] - coor_motor[i][1];
    int32_t hypsq = dx*dx+dy*dy;
    int16_t len = (length[i]+1);
    int32_t lensq = len*len;
    if (lensq <= hypsq)
      length[i]++;
    len = (length[i]-1);
    lensq = len*len;
    if (lensq >= hypsq)
      length[i]--;
    out |= (uint8_t) ((length[i]+offset[i]) % 4) << (i * 2);
  }

  STEP_OUT = out;
}


void end_movement(void)
{
  uint8_t i; 
  for (i = 0; i < 4; i++)
  {
    length[i]=2*i;
    offset[i]=2*i;
    coor_motor[i][0]=2*i;
    coor_motor[i][1]=2*i;
  }

  coor_robot[0]=timestamp;
  coor_robot[1]=timestamp;
  coor_robot_dest[0]=timestamp;
  coor_robot_dest[1]=timestamp;

  dcoor=timestamp;
  dt=timestamp;
  error_coor=timestamp;
}
