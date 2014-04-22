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

__attribute__((optimize("O3")))
ISR(TIMER0_COMPA_vect)
{
  t++;
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
  


  int i;
  for (i = 0; i < 4; i++)
    out |= (motor[i] % 4) << (i*2);

  STEP_OUT = out;
}


void end_movement(void)
{
  int i; 
  for (i = 0; i < 4; i++)
  {
    length[i] += 7*i;
    dlength[i] += 2*i;
    error[i] += 2*i;
    motor[i] -= i;
    dirmotor[i] += i;
    dt--;
    t++;
  }
}
