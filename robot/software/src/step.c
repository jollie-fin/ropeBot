#include <avr/interrupt.h>
#include "def.h"
#include "step.h"

//length[i] is the final length of string i measure in motor step
static int length[4];

//dlength[i] are used for Bresenham's line algorithm
static int dlength[4];

//error[i] are used for Bresenham's line algorithm
static int error[4];

//motor[i] is the real position of motor i. Since the position is only need modulo 4, a byte is enough
static unsigned char motor[4];
//dirmotor[i] is the direction in which the motor should move 
static char dirmotor[4];

//dt is the increment use for 
static int dt;

//t is the time left for the rotation
static int t;

__attribute__((optimize("O3")))
ISR(TIMER0_COMPA_vect)
{
  if (t == 0)
    next_destination();
  if (t == 0)
  {
    t = -1;
    return;
  }
  if (t == -1)
  {
    return;
  }

  t--;
  int i;
  for (i = 0; i < 4; i++)
  {
    error[i] -= dlength[i];
    if (error[i] < 0)
    {
      motor[i] += dirmotor[i];
      error[i] += dt;
    }
  }
  unsigned char out = 0;
  
  for (i = 0; i < 4; i++)
    out |= (motor[i] % 4) << (i*2);

  STEP_OUT = out;
}


void next_destination()
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
