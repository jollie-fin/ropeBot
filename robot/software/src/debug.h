#ifndef DEBUG_H
#define DEBUG_H

#include <stdint.h>

#define DEBUG_IN (*((volatile char *)0x22))
#define DEBUG_OUT (*((volatile char *)0x20))

void debug_init();
void debug_print(const char *);
void print_hex(uint16_t);

#endif
