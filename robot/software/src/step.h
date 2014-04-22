#ifndef STEP_H
#define STEP_H
#include <stdint.h>

inline uint32_t get_timestamp();
inline uint8_t is_moving();
void begin_movement(uint16_t, uint16_t, uint16_t);
void init_movement(void);

#endif
