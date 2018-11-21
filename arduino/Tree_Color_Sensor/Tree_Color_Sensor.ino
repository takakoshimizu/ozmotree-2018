//  ******************************************************************
//  ██████╗*██████╗**██████╗*██████╗*████████╗██████╗*███████╗███████╗
//  ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██╔════╝
//  ██║**██║██████╔╝██║***██║██████╔╝***██║***██████╔╝█████╗**█████╗**
//  ██║**██║██╔══██╗██║***██║██╔═══╝****██║***██╔══██╗██╔══╝**██╔══╝**
//  ██████╔╝██║**██║╚██████╔╝██║********██║***██║**██║███████╗███████╗
//  ╚═════╝*╚═╝**╚═╝*╚═════╝*╚═╝********╚═╝***╚═╝**╚═╝╚══════╝╚══════╝
//  Color sensor to light server
//  Author: David Bates
//  Date: 11/20/2018
//  ******************************************************************

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "Adafruit_TCS34725.h"

char ssid[] = "OzmoTree";       // your network SSID (name)
char password[] = "4Tree4Tree";

const size_t bufferSize = JSON_OBJECT_SIZE(3);
DynamicJsonBuffer jsonBuffer(bufferSize);

//We found 700ms and 4X gain to be ideal for our application of laying a card on top of the sensor. 
Adafruit_TCS34725 colorSensor = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_700MS, TCS34725_GAIN_4X);

void setup() {
  Serial.begin(115200);
  if (colorSensor.begin()) {
      Serial.println("Found sensor");
  } else {
      Serial.println("No TCS34725 found ... check your connections");
      while (1);
  }
   //Connect to wifi:
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  // Attempt to connect to Wifi network:
  Serial.print("Connecting Wifi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  IPAddress ip = WiFi.localIP();
  Serial.println(ip);
}

void loop() {
  uint16_t clear, red, green, blue, colorTemp, lux;
  colorSensor.setInterrupt(false); //Turn on the LED
  delay(710);  // takes 700ms to read 
  colorSensor.getRawData(&red, &green, &blue, &clear);
  colorTemp = colorSensor.calculateColorTemperature(red, green, blue);
  lux = colorSensor.calculateLux(red, green, blue);
  colorSensor.setInterrupt(true); //Turn off the LED


// Tree Math 
  uint32_t sum = red+green+blue;
  float r, g, b;
// Simply dividing by 256 give a good enough approximation of the color. 
// When displaying on LEDs you might want to use a gamma table to boost certain colors. 
  r = red / 256;
  b = blue / 256;
  g = green / 256;
  if (r > 255) r = 255;
  if (g > 255) g = 255;
  if (b > 255) b = 255;

// Useful for troubleshooting
  Serial.print((int)r) ;
  Serial.print(", ") ;
  Serial.print((int)g);
  Serial.print(", ") ;
  Serial.println((int)b);
  Serial.print((int)red) ;
  Serial.print(", ") ;
  Serial.print((int)green);
  Serial.print(", ") ;
  Serial.print((int)blue);
  Serial.print(", ") ;
  Serial.print(colorTemp);
  Serial.print(", ") ;
  Serial.println(lux);
// The server need a patch request to update the values. 
  patchColor((int)r, (int)g, (int)b);
// Set the interval for updates.
  delay(3000);
}

void patchColor(int r, int g, int b){
// Build the JSON object
  JsonObject& root = jsonBuffer.createObject();
  root["r"] = r;
  root["g"] = g;
  root["b"] = b;

// Convert to String for transmitting to server
  String patchData;
  root.printTo(patchData); 
  HTTPClient http;

  Serial.print("[HTTP] begin...\n");
//  Change this to reflect which sensor 
  http.begin("http://10.20.0.100:3000/lights/1"); //HTTP

  Serial.print("[HTTP] PATCH...\n");
// Log out for troubleshooting. 
  // root.printTo(Serial);
// Server expects JSON
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.sendRequest("PATCH", patchData);

// httpCode will be negative on error
  if(httpCode > 0) {
    Serial.printf("[HTTP] PATCH... code: %d\n", httpCode);
    if(httpCode == HTTP_CODE_OK) {
      Serial.println("Patch Complete ");
      delay(500);
    }
  } else {
    Serial.printf("[HTTP] PATCH... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}
