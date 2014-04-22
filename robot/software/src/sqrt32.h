//http://www.mikrocontroller.net/articles/AVR_Arithmetik#avr-gcc_Implementierung_.2832_Bit.29
//based on http://members.chello.nl/j.beentjes3/Ruud/sqrt32avr.htm
//licence unknown
#ifndef SQRT32_H
#define SQRT32_H

#include <stdint.h>
 
extern uint16_t sqrt32_round (uint32_t);
extern uint16_t sqrt32_floor (uint32_t);

#endif
