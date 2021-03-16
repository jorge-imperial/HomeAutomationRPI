from gpiozero import LED 
from time import sleep 


# 3 5 7 29
relay0  = LED(2) 
relay1  = LED(3) 
relay2  = LED(4) 
relay3  = LED(5) 
 
while True: 
    relay0.on()    #turn led on 
    relay1.on()    #turn led on 
    relay2.on()    #turn led on 
    relay3.on()    #turn led on 
    print('On')
    sleep(5)    #delay for 1 second 
    relay0.off()    #turn led on 
    relay1.off()    #turn led on 
    relay2.off()    #turn led on 
    relay3.off()    #turn led on 
    print('Off')
    sleep(5)    #delay for 1 second 

