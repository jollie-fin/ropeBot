#include <stdlib.h>
#include "def.h"

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
