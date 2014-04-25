CC=avr-gcc
#CFLAGS=-Wall -Wextra -Os -mcall-prologues -mmcu=atmega328 -fshort-enums  -g -fuse-linker-plugin
#LDFLAGS=-mmcu=atmega328 -g -Os -fuse-linker-plugin
CFLAGS=-Wall -Wextra -O3 -mmcu=atmega328 -fshort-enums  -g  -fuse-linker-plugin -flto -std=gnu99
LDFLAGS=-mmcu=atmega328 -g -O3 -fuse-linker-plugin -flto
OBJECTS=main.o comm.o step.o debug.o
EXECUTABLE=code

all: $(EXECUTABLE)
	
doc:
	okular ../doc/*pdf* 2> /dev/null > /dev/null &

debug: $(EXECUTABLE)
	simulavr -d atmega328 -f $< -W 0x20,- -R 0x22,adcin -T exit

$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@
	avr-size $@

%.o:%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.o:%.S Makefile
	$(CC) $(CFLAGS) -c $< -o $@

%.s:%.c Makefile
	$(CC) $(CFLAGS) -S $< -o $@

%.ass:%.c
	avr-gcc -c -g -Wa,-a,-ad -O3 -mmcu=atmega328  -std=gnu99 $< | less

clean :
	rm -f *.o *.s $(EXECUTABLE)
