CC=avr-gcc
CFLAGS=-Wall -Os -mcall-prologues -mmcu=atmega328
#CFLAGS=-Wall -O3 -mmcu=atmega328
LDFLAGS=
OBJECTS=main.o comm.o step.o sqrt32.o
EXECUTABLE=code

all: $(EXECUTABLE)
	
$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@

%.o:%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.o:%.S Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.s:%.c Makefile
	$(CC) $(CFLAGS) -S $< -o $@


clean :
	rm *.o *.s $(EXECUTABLE)
