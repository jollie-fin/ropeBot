CC=avr-gcc
CFLAGS=-Wall -Os -mcall-prologues -mmcu=atmega328
LDFLAGS=
OBJECTS=main.o comm.o step.o
EXECUTABLE=code

all: $(EXECUTABLE)
	
$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@

%.o:%.c
	$(CC) $(CFLAGS) -c $< -o $@

%.s:%.c
	$(CC) $(CFLAGS) -S $< -o $@

%.ass:%.s
	cat $<

clean :
	rm *.o
	rm *.s
	rm $(EXECUTABLE)
