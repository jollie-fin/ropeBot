CC=avr-gcc
CFLAGS=-Wall -Os -mcall-prologues -mmcu=atmega328
#CFLAGS=-Wall -O3 -mmcu=atmega328
LDFLAGS=
OBJECTS=main.o comm.o step.o
EXECUTABLE=code

all: $(EXECUTABLE)
	
$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@

%.o:%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.s:%.c Makefile
	$(CC) $(CFLAGS) -S $< -o $@

%.ass:%.s
	less $<

clean :
	rm *.o *.s $(EXECUTABLE)
