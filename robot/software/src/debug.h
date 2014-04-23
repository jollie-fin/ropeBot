#ifndef DEBUG_H
#define DEBUG_H

#define DEBUG_IN (*((volatile char *)0x22))
#define DEBUG_OUT (*((volatile char *)0x20))

void debug_init();

#endif
