#ifndef DEF_H
#define DEF_H

#include <avr/io.h>
#define STEP_OUT PORTD
#define STEP_DDR DDRD
#define STEP_MASK 0xFF

#define LED_OUT PORTB
#define LED_DDR DDRB
#define LED_MASK 0x0F
#endif
