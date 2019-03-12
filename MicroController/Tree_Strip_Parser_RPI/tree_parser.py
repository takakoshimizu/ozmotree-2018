#  ******************************************************************
#  ██████╗*██████╗**██████╗*██████╗*████████╗██████╗*███████╗███████╗
#  ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██╔════╝
#  ██║**██║██████╔╝██║***██║██████╔╝***██║***██████╔╝█████╗**█████╗**
#  ██║**██║██╔══██╗██║***██║██╔═══╝****██║***██╔══██╗██╔══╝**██╔══╝**
#  ██████╔╝██║**██║╚██████╔╝██║********██║***██║**██║███████╗███████╗
#  ╚═════╝*╚═╝**╚═╝*╚═════╝*╚═╝********╚═╝***╚═╝**╚═╝╚══════╝╚══════╝
#  Light Parser for Tree
#  Author: David Bates
#  Date: 11/24/2018
#  ******************************************************************

import time
import board
import neopixel
import urllib.request, json 

pix_pin = board.D18
num_pix = 900
pix_order = neopixel.GRB
pixels = neopixel.NeoPixel(pix_pin, num_pix, brightness=0.2, auto_write=False, pixel_order=pix_order)

def wheel(pos):
    # Input a value 0 to 255 to get a color value.
    # The colours are a transition r - g - b - back to r.
    if pos < 0 or pos > 255:
        r = g = b = 0
    elif pos < 85:
        r = int(pos * 3)
        g = int(255 - pos*3)
        b = 0
    elif pos < 170:
        pos -= 85
        r = int(255 - pos*3)
        g = 0
        b = int(pos*3)
    else:
        pos -= 170
        r = 0
        g = int(pos*3)
        b = int(255 - pos*3)
    return (r, g, b) if pix_order == neopixel.RGB or pix_order == neopixel.GRB else (r, g, b, 0)
 
 
def rainbow_cycle(wait):
    for j in range(255):
        for i in range(num_pix):
            pixel_index = (i * 256 // num_pix) + j
            pixels[i] = wheel(pixel_index & 255)
        pixels.show()
        time.sleep(wait)

# Show a rainbow to begin with. 
rainbow_cycle(0.001)


while True:
    try:
        with urllib.request.urlopen("http://10.20.0.100:3000/lights") as url:
            data = json.loads(url.read().decode())
            pixel_count = 0
            for pixel in data:
                pixels[pixel_count] = (int(pixel[0]), int(pixel[1]), int(pixel[2]))
                pixel_count += 1 
                # print('#%02x%02x%02x' % (int(pixel[0]), int(pixel[1]), int(pixel[2]))
            pixels.show()
            time.sleep(0.001)
    except:
        # if error we still need a pretty tree
        rainbow_cycle(0.001)