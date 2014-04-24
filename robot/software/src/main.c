#include <stdlib.h>
#include <stdio.h>
#include <avr/interrupt.h>
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
  sei();
}

int main(void)
{
  debug_init();
  S_init();
  C_init();
  initio();
  C_start_interrupt();
  
  while (S_timestamp() < 5l)
  {

  }
  exit(0);
} 
