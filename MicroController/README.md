# DropTree Hardware 
This section covers the hardware used along with the firmware needed. 

## Structure
---
[dataflow diagram](media/DataFlow.png "Data Flow Diagram")
---

## Schematics
---
---
## Notes
---
- For actually handling the lighting of the tree a NodeMCU was initially chosen but the RGB array for the lights turn out to be too much the microcontroller to handle. Especially to keep up with music timings as well as maintain the wifi connection. As a proof we left the code in this repo but we would not recommend running more than 300 pixels with it. 
- The raspberry pi requires some config outside of this repo. We'd recommend following this guide for installing the prerequisites and testing the light strip out: [Adafruit Learning System Neopixel RasPi](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview)
---


## Firmware Libraries
---
We'd love to thank the contributions of these wonderful libraries, please support them. 
* [Adafruit Neopixel Library](https://github.com/adafruit/Adafruit_NeoPixel)
* [Wire](https://www.arduino.cc/en/Reference/Wire)
* [ESP8266 WIFI](https://github.com/esp8266/Arduino/tree/master/libraries/ESP8266WiFi)
* [ESP8266 HTTPClient](https://github.com/esp8266/Arduino/tree/master/libraries/ESP8266HTTPClient)
* [Arduino JSON](https://arduinojson.org/)
* [Adafruit TCS34725](https://github.com/adafruit/Adafruit_TCS34725)
---

