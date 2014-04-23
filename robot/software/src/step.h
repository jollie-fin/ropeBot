#ifndef STEP_H
#define STEP_H
#include <stdint.h>

inline uint32_t S_get_timestamp();
inline uint8_t S_is_moving();
inline uint16_t S_width();
void S_init();
void S_move_to_abs(int16_t, int16_t, uint16_t);
void S_move_to(int16_t, int16_t, uint16_t);

#endif
