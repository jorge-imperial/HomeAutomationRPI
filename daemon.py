#!/usr/bin/env python3
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
import time

# These support the Adafruit 128x64 display with hardware I2C:
import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

#
import RPi.GPIO as GPIO
import subprocess
import threading
import logging
import socketserver
import json

STATES = [GPIO.LOW, GPIO.LOW, GPIO.LOW, GPIO.LOW, GPIO.LOW]

# Pins were chosen because they were close in the header.
RELAYS = [{'gpio': 4, 'pin': 7, 'state': GPIO.LOW},
          {'gpio': 17, 'pin': 11, 'state': GPIO.LOW},
          {'gpio': 27, 'pin': 13, 'state': GPIO.LOW},
          {'gpio': 22, 'pin': 15, 'state': GPIO.LOW}
          ]


# commands supported
# { set: { relay: n, state:  }}      Set relay state to 0 or 1. The effect will depende on how the relay
#                                    is wired (normally open or normally closed)
# { get: { "relay" : n }}            Get the current state of the relay.
# { get:  "status" }                 Get the status and configuration of the device.
# { get:  "config" }


class TCPHandler(socketserver.BaseRequestHandler):
    """
    The RequestHandler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(1024).strip()
        logging.info('{} wrote:'.format(self.client_address[0]))

        try:
            command = json.loads(self.data.lower())
            logging.info('Command: {}'.format(json.dumps(command)))
            if 'set' in command:
                sub_command = command['set']
                logging.info('Sub-command: {}'.format(json.dumps(sub_command)))
                if 'relay' in sub_command:
                    relay = sub_command['relay']
                    if relay in range(0, len(RELAYS)) and 'state' in sub_command:
                        state = int(sub_command['state'])
                        if state:
                            STATES[relay] = GPIO.HIGH
                        else:
                            STATES[relay] = GPIO.LOW
                        logging.info('Valve {} changes state to {}'.format(relay, STATES[relay]))

            if 'get' in command:
                sub_command = command['get']
                logging.info('Sub-command: {}'.format(json.dumps(sub_command)))
                s = 'xxx'
                if 'relay' in sub_command:
                    relay = sub_command['relay']
                    s = json.dumps(RELAYS[relay])
                if 'config' in sub_command:
                    ret = {'relays': [{'relay': 0, 'state': RELAYS[0]['state']},
                                      {'relay': 1, 'state': RELAYS[1]['state']},
                                      {'relay': 2, 'state': RELAYS[2]['state']},
                                      {'relay': 3, 'state': RELAYS[3]['state']}
                                      ]
                           }
                    s = json.dumps(ret)
                logging.info('Return: {}'.format(s))

                self.request.sendall(bytes(s, 'utf-8'))

        except json.JSONDecodeError as json_err:
            logging.error(json_err.msg)
            pass
        except:
            logging.error('Exception!')


def thread_function(name):
    HOST, PORT = "0.0.0.0", 9000
    logging.info("Thread {}  starting: {} {}".format(name, HOST, PORT))

    # Create the server, binding to localhost on port 9000
    server = socketserver.TCPServer((HOST, PORT), TCPHandler)

    # Activate the server; this will keep running until you
    # interrupt the program with Ctrl-C
    server.serve_forever()
    logging.info("Thread %s: finishing", name)


def get_state(relay):
    return STATES[relay]


def main():
    # Raspberry Pi pin configuration:
    RST = None  # on the PiOLED this pin isn't used

    GPIO.setmode(GPIO.BCM)

    # They might be already configured
    GPIO.setwarnings(False)

    for i in range(0, len(RELAYS)):
        GPIO.setup(RELAYS[i]['gpio'], GPIO.OUT)
        GPIO.output(RELAYS[i]['gpio'], GPIO.OUT)

    # 128x64 display with hardware I2C:
    disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)

    # Initialize library.
    disp.begin()

    # Clear display.
    disp.clear()
    disp.display()

    # Create blank image for drawing.
    # Make sure to create image with mode '1' for 1-bit color.
    width = disp.width
    height = disp.height
    image = Image.new('1', (width, height))

    # Get drawing object to draw on image.
    draw = ImageDraw.Draw(image)

    # Draw a black filled box to clear the image.
    draw.rectangle((0, 0, width, height), outline=0, fill=0)

    # Draw some shapes.
    # First define some constants to allow easy resizing of shapes.
    padding = -2
    top = padding

    # Move left to right keeping track of the current x position for drawing shapes.
    x = 0

    # Load default font.
    font = ImageFont.load_default()
    time_waiting = 3

    while True:
        for relay in range(0, len(RELAYS)):
            state = get_state(relay)  # where state is either GPIO.LOW or GPIO.HIGH
            # logging.info('Valve {} state is {} : next is {}'.format( relay, VALVES[relay]['state'], state))
            if state != RELAYS[relay]['state']:
                GPIO.output(RELAYS[relay]['gpio'], state)
                RELAYS[relay]['state'] = state

        # Draw a black filled box to clear the image.
        draw.rectangle((0, 0, width, height), outline=0, fill=0)

        # Shell scripts for system monitoring from here :
        # https://unix.stackexchange.com/questions/119126/command-to-display-memory-usage-disk-usage-and-cpu-load
        cmd = "hostname -I | cut -d\' \' -f1"
        ip_address = subprocess.check_output(cmd, shell=True)
        ip_address = str(ip_address).replace("\\n", "")

        cmd = "top -bn1 | grep load | awk '{printf \"CPU Load: %.2f\", $(NF-2)}'"
        cpu_usage = subprocess.check_output(cmd, shell=True)
        cpu_usage = str(cpu_usage).replace("\\n", "")

        draw.text((x, top), "IP: " + str(ip_address), font=font, fill=255)
        draw.text((x, top + 8), str(cpu_usage), font=font, fill=255)

        # Display image.
        disp.image(image)
        disp.display()
        time.sleep(time_waiting)
        logging.info('...')

    GPIO.cleanup()
    logging.info("Main    : all done")


if __name__ == "__main__":
    log_format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=log_format, level=logging.INFO, datefmt="%H:%M:%S")
    logging.info("Main    : before creating thread")
    the_thread = threading.Thread(target=thread_function, args=(1,), daemon=True)
    logging.info("Main    : before running thread")
    the_thread.start()
    logging.info("Main    : wait for the thread to finish")
    main()
