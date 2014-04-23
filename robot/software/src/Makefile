CC=avr-gcc
CFLAGS=-Wall -Wextra -Os -mcall-prologues -mmcu=atmega328 -fshort-enums  -g -fuse-linker-plugin
LDFLAGS=-mmcu=atmega328 -g -Os -fuse-linker-plugin
OBJECTS=main.o comm.o step.o sqrt32.o
EXECUTABLE=code

all: $(EXECUTABLE)
	
doc:
	okular ../doc/*pdf* 2> /dev/null > /dev/null &

$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@ -flto
	avr-size $@

%.o:%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@ -flto

%.o:%.S Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.s:%.c Makefile
	$(CC) $(CFLAGS) -S $< -o $@

%.ass:%.s
	less $<

clean :
	rm *.o *.s $(EXECUTABLE)
