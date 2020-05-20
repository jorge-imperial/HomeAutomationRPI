# HomeAutomationRPI
Home automation using a Raspberry PI.

This project uses a Raspberry PI 3 and a relay board to control devices by opening and closing a relay. I am using it to automate irrigation for my lawn.  I have also included a OLED Display for not other reason than I had one lying around.

Components:

- [Raspberry PI 3 Model B (Raspbian/Debian 10.3)](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
- [Four relay module (Keyestudio 4-channel 5V relay)](https://www.keyestudio.com/free-shipping-2016-new-keyestudio-4-channel-5v-relay-module-for-arduino-p0190.html)
- [Pemenol OLED Display module 128x64](https://www.amazon.com/PEMENOL-Display-0-96inch-Raspberry-Microcontroller/dp/B07F3KY8NF)

## Wiring
Soon


## Software installation

The project uses a daemonized python script to control the relays via GPIO. 

The python modules needed are:

sudo apt install -y python3-dev python-imaging python-smbus i2c-tools python3-setuptools python3-rpi.gpio


## Usage

The daemon.py script is controlled by control.service, a systemd module configuration.

To install, copy the file contro.service to _/etc/systemd/system_ and start the service.
```
sudo cp control.service /etc/systemd/system
sudo systemctl start control.service
```

you can verify the status (and look at the logs) using _status_
```
sudo systemctl status control.service
```
the service also recognizes _stop_ and _restart_.


To enable the service to run when the RPI is rebooted:
```
sudo systemctl enable control.service
```

Currently, the daemon opens a socket on port 9000 and listens for commands. These commands are JSON strings.


```
{ set: { relay: n, state:  }}      Set relay state to 0 or 1. The effect will depende on how the relay
                                    is wired (normally open or normally closed)
{ get: { "relay" : n }}            Get the current state of the relay.
{ get:  "status" }                 Get the status and configuration of the device.
{ get:  "config" }
```


