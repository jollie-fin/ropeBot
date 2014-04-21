#include <avr/interrupt.h>
#include "def.h"

//length[i] is the final length of string i measure in motor step
static int length[4];

//dlength[i] are used for Bresenham's line algorithm
static int dlength[4];

//motor[i] is the real position of motor i. Since the position is only need modulo 4, a byte is enough
static unsigned char motor[4];
//dirmotor[i] is the direction in which the motor should move 
static unsigned char dirmotor[4];

//dt is the increment use for 
static int dt;

//t is the time left for the rotation
static int t;

void iteration(void)
{
  if (t == 0)
    reti();
  t--;
  int i;
  for (i = 0; i < 4; i++)
  {
    if (error[i] = error[i] - dlength[i])
    {
      motor[i] += dirmotor[i];
      error[i] += dt;
    }
  }
  
}
