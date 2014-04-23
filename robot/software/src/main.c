#include <stdlib.h>
#include <avr/interrupt.h>
#include "def.h"
#include "step.h"
#include "main.h"

static void initio(void)
{
  STEP_DDR = STEP_MASK;
  LED_DDR = LED_MASK;
  TCCR0A = _BV(WGM01);
  TCCR0B = _BV(CS00) | _BV(CS01);
  OCR0A = 250;
  TIMSK0 = _BV(OCIE0A);
  sei();
}

int main(void)
{
  S_init();
  initio();
  S_move_to(2,2,5);
  S_move_to(2,2,5);
  while (1);
} 
