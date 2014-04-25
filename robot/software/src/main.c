#include <stdlib.h>
#include <stdio.h>
#include <avr/interrupt.h>
#include <util/atomic.h>
#include "def.h"
#include "step.h"
#include "main.h"
#include "comm.h"
#include "debug.h"

static void initio(void)
{
  STEP_DDR = STEP_MASK;
  LED_DDR = LED_MASK;
  TCCR0A = _BV(WGM01);
  TCCR0B = _BV(CS00) | _BV(CS01); //1000 move/s
  OCR0A = 250;
  TCCR1A = 0;
  TCCR1B = _BV(CS10);

  TCCR2A = _BV(WGM21); 
  TCCR2B = _BV(CS21);//20000 samples/s
  OCR2A = 100;

  TIMSK2 = _BV(OCIE2A);
  TIMSK0 = _BV(OCIE0A);
  sei();
}

int main(void)
{
  debug_init();
  S_init();
  C_init();
  initio();

  while (S_timestamp() < 5lu)
  {

  }
  ATOMIC_BLOCK(ATOMIC_RESTORESTATE)
  {
    uint8_t i;
    for (i = 0; i < 50; i++)
    {
      printf("%u -> %u : %u\n", C_buffer_orig(i), C_buffer_dest(i), C_buffer_delay(i));
    }
  }
  exit(0);
} 
