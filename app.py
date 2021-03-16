#!/usr/bin/env python3
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

from flask import Flask, request, jsonify
from datetime import date
import time

app = Flask(__name__)

# These support the Adafruit 128x64 display with hardware I2C:
#import Adafruit_GPIO.SPI as SPI
#import Adafruit_SSD1306
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

from gpiozero import LED 

import logging
import json

# Pins and GPIO 
RELAYS = [
            {'gpio':  2, 'relay': LED(2), 'pin':  3, 'state': False, 'use' : 'valve', 'name': 'sprinkler0'},
            {'gpio':  3, 'relay': LED(3), 'pin':  5, 'state': False, 'use' : 'valve', 'name': 'sprinkler1'},
            {'gpio':  4, 'relay': LED(4), 'pin':  7, 'state': False, 'use' : 'valve', 'name': 'sprinkler2'},
            {'gpio':  5, 'relay': LED(5), 'pin': 29, 'state': False, 'use' : 'valve', 'name': 'sprinkler3'},
            {'gpio':  6, 'relay': LED(6), 'pin': 31, 'state': False, 'use' : '', 'notes': ''},
            {'gpio':  7, 'relay': LED(7), 'pin': 26, 'state': False, 'use' : '', 'notes': ''},
            {'gpio':  8, 'relay': LED(8), 'pin': 24, 'state': False, 'use' : '', 'notes': ''},
            {'gpio':  9, 'relay': LED(9), 'pin': 21, 'state': False, 'use' : '', 'notes': ''}
          ]

def get_state(relay):
    return RELAYS[int(relay)]['state']

def set_state(relay, state):

    if relay >= len(RELAYS):
        return 0


    print('Valve {} state is {} : next is {}'.format( relay, VALVES[relay]['state'], state))
    if state != RELAYS[relay]['state']:
        print('relay % %' % (relay, state) )
        if state:
            state = True
            RELAYS[relay]['relay'].on()
        else:
            state = False
            RELAYS[relay]['relay'].off()
        RELAYS[relay]['state'] = state
    return state

def setup_gpio():
    # Raspberry Pi pin configuration:
    RST = None  # on the PiOLED this pin isn't used

    for i in range(0, len(RELAYS)):
        print('Relay %d configured as GPIO %d (pin %d)' % (i, RELAYS[i]['gpio'], RELAYS[i]['pin']))

    # 128x64 display with hardware I2C:
    #disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)
    disp = None

    # Initialize library.
    if disp:
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
    
@app.route('/status')
def get_status():
    return jsonify(RELAYS)


@app.route('/config')
def get_config():
    return jsonify(RELAYS)


@app.route('/relay', methods=['GET'])
def query_relay():
    relay = request.args.get('relay')
    state = request.args.get('state')

    if not relay:
        return jsonify({'error': 'data not found'})
    else:
        if state:  # Set the state of the relay
           set_state(int(relay), int(state))
           return jsonify({'relay': relay, 'state': state, 'ts': date.today()})
        else:  # return the state of the relay
           return jsonify({'relay': relay, 'state': get_state(relay), 'ts': date.today()})

if __name__ == '__main__':
    log_format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=log_format, level=logging.INFO, datefmt="%H:%M:%S")
    setup_gpio()
    app.run(port=6000)

