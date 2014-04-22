CC=avr-gcc
CFLAGS=-Wall -Os -mcall-prologues -mmcu=atmega328 -fshort-enums 
#CFLAGS=-Wall -O3 -mmcu=atmega328
LDFLAGS=-mmcu=atmega328 
SOURCES=main.c comm.c step.c sqrt32.s
OBJECTS=main.o comm.o step.o sqrt32.o
EXECUTABLE=code

all: $(EXECUTABLE)
	
$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@
	avr-size $@

%.o:%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.o:%.S Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.s:%.c Makefile
	$(CC) $(CFLAGS) -S $< -o $@

%.ass:%.s
	less $<

clean :
	rm *.o *.s $(EXECUTABLE)
