#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

void wave(unsigned length, char c)
{
  for (unsigned i = 0; i < length; i++)
    putchar(c);
}

int main(int argc, char **argv)
{
  srand(time(NULL));

  if (argc != 4)
    return 1;

  unsigned period = atoi(argv[1]);
  unsigned sleep = atoi(argv[2]);
  
  wave(sleep, '4');

  for (unsigned i = 0; i < strlen(argv[3])/4; i++)
  {
    wave(period, '1');
    wave(period, '7');
    wave(period, '1');
    wave(period, '7');
    unsigned long byte = 0;
    for (unsigned j = i*4; j < i*4+4; i++)
    {
      if (argv[3][j] >= '0' && argv[3][j] <= '9')
        byte = (byte << 4) | (argv[3][j] - '0');
      else if (argv[3][j] >= 'a' && argv[3][j] <= 'f')
        byte = (byte << 4) | (argv[3][j] - 'a' + 10);
      else if (argv[3][j] >= 'A' && argv[3][j] <= 'F')
        byte = (byte << 4) | (argv[3][j] - 'A' + 10);
      else
        byte = 0;
    }
    int parity = 0;
    int last_bit = 1;
    for (unsigned j = 0; j < 16; j++)
    {
      unsigned bit = byte & (1 << j);
      if (bit == 0)
      {
        last_bit = 1-last_bit;
        wave(period*2, (last_bit) ? '7' : '1');
      }
      else
      {
        parity = 1-parity;
         wave(period, (last_bit) ? '1' : '7');
         wave(period, (last_bit) ? '7' : '1');
      }
    }
    if (parity == 0)
    {
      last_bit = 1-last_bit;
      wave(period*2, (last_bit) ? '7' : '1');
    }
    else
    {
      parity = 1-parity;
       wave(period, (last_bit) ? '1' : '7');
       wave(period, (last_bit) ? '7' : '1');
    }

    wave(sleep, '4');
  }
  putchar(' ');
  return 0;
}

