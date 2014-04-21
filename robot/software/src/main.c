#include "def.h"
#include <stdlib.h>

void initio(void)
{
  STEP_DDR |= STEP_MASK;
  LED_DDR |= LED_MASK;
}

int main(void)
{
  initio();

  while(1);
} 
