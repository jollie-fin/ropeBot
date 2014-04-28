#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

void wave(unsigned length, unsigned jitter, unsigned noise, char c)
{
  unsigned jit = rand()/(RAND_MAX/(2*jitter+1))-1;
  for (unsigned i = 0; i < length+jit; i++)
  {
    unsigned n = rand()/(RAND_MAX/100);
    if (n < noise)
    {
      unsigned val = rand()/(RAND_MAX/6);
      putchar('1' + val);
    }
    else
    {
      putchar(c);
    }
  }
}

int main(int argc, char **argv)
{
  srand(time(NULL));

  if (argc != 6)
    return 1;

  unsigned period = atoi(argv[1]);
  unsigned sleep = atoi(argv[2]);
  unsigned jitter = (atoi(argv[4])*period)/100u;
  unsigned noise = atoi(argv[5]);
  
  wave(sleep, 0, noise, '4');

  int len = strlen(argv[3])/4;

  for (int i = 0; i < len; i++)
  {
    wave(period, jitter, noise, '1');
    wave(period, jitter, noise, '7');
    wave(period, jitter, noise, '1');
    wave(period, jitter, noise, '7');
    unsigned byte = 0;
    for (int j = i*4; j < i*4+4; j++)
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
    for (int j = 15; j >= 0; j--)
    {
      unsigned bit = (byte>>j) & 1;
      if (bit == 0)
      {
        last_bit = 1-last_bit;
        wave(period*2, jitter*2, noise, (last_bit) ? '7' : '1');
      }
      else
      {
        parity = 1-parity;
         wave(period, jitter, noise, (last_bit) ? '1' : '7');
         wave(period, jitter, noise, (last_bit) ? '7' : '1');
      }
    }
    if (parity == 0)
    {
      last_bit = 1-last_bit;
      wave(period*2, jitter*2, noise, (last_bit) ? '7' : '1');
    }
    else
    {
      parity = 1-parity;
       wave(period, jitter, noise, (last_bit) ? '1' : '7');
       wave(period, jitter, noise, (last_bit) ? '7' : '1');
    }

    wave(sleep, 0, noise, '4');
  }
  putchar(' ');
  wave(150, 0, 0, '4');
  return 0;
}

