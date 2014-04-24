#include <stdarg.h>
#include <stdio.h>
#include "debug.h"

static int out_debug(char c, FILE *stream __attribute__((__unused__)))
{
  DEBUG_OUT = c;
  return 0;
}

static FILE debug_out = FDEV_SETUP_STREAM(out_debug, NULL, _FDEV_SETUP_WRITE);

void debug_print(const char *s)
{
  char c;
  while(c=*s++)
  {
    DEBUG_OUT = c;
  }
}

void debug_init()
{
  stdout = &debug_out;
}

