#include <stdlib.h>
#include "def.h"
#include "step.h"
#include "main.h"

void initio(void)
{
  STEP_DDR |= STEP_MASK;
  LED_DDR |= LED_MASK;
}

int main(void)
{
  initio();
  init_movement();
  begin_movement(20,20,1000);
  while (1);
} 
