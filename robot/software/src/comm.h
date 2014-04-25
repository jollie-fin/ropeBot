#ifndef COMM_H
#define COMM_H

typedef struct
{
  uint8_t orig;
  uint8_t dest;
  uint16_t delay;
} transition_t;

void C_init(void);
uint32_t C_timestamp();

#endif 
