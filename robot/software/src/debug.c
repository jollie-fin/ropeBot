#include <stdarg.h>
#include <stdio.h>
#include <stdint.h>
#include "debug.h"

void print_hex(uint16_t hex)
{
  uint8_t i;
  for (i = 0; i < 4; i++)
  {
    uint8_t h = (hex >> (4*i)) & 0x0F;
    if (h < 10)
      DEBUG_OUT = h+'0';
    else
      DEBUG_OUT = h+'a'-10;
  }
}

static int out_debug(char c, FILE *stream __attribute__((__unused__)))
{
  DEBUG_OUT = c;
  return 0;
}

static FILE debug_out = FDEV_SETUP_STREAM(out_debug, NULL, _FDEV_SETUP_WRITE);

void debug_print(const char *s)
{
  while(*s)
  {
    DEBUG_OUT = *s;
    s++;
  }
}

void debug_init()
{
  stdout = &debug_out;
}

