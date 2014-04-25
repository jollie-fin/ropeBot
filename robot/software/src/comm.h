#ifndef COMM_H
#define COMM_H

typedef struct
{
  uint8_t orig;
  uint8_t dest;
  uint16_t delay;
} transition_t;

uint8_t C_buffer_orig(uint8_t i);
uint8_t C_buffer_dest(uint8_t i);
uint16_t C_buffer_delay(uint8_t i);
void C_init(void);


#endif 
