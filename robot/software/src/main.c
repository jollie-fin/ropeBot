#include <stdlib.h>
#include <stdio.h>
#include <avr/interrupt.h>
#include "def.h"
#include "step.h"
#include "main.h"
#include "debug.h"

static void initio(void)
{
  STEP_DDR = STEP_MASK;
  LED_DDR = LED_MASK;
  TCCR0A = _BV(WGM01);
  TCCR0B = _BV(CS00) | _BV(CS01);
  OCR0A = 250;
  sei();
}

int main(void)
{
  debug_init();
  S_init();
  initio();
  S_move_to(0,0,5000);
  while(S_is_moving());
  exit(0);
} 
