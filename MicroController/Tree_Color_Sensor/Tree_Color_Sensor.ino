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


byte neopix_gamma[] = {
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
    1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
    2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
    5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
   10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
   17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
   25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
   37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
   51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
   69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
   90, 92, 93, 95, 96, 98, 99,101,102,104,105,107,109,110,112,114,
  115,117,119,120,122,124,126,127,129,131,133,135,137,138,140,142,
  144,146,148,150,152,154,156,158,160,162,164,167,169,171,173,175,
  177,180,182,184,186,189,191,193,196,198,200,203,205,208,210,213,
  215,218,220,223,225,228,231,233,236,239,241,244,247,249,252,255 };


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
  connect();
  
}

void connect(){
  WiFi.mode(WIFI_OFF);
  delay(1000);
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
  
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("Disconnected from WiFi");
    connect();
  }
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
  patchColor(neopix_gamma[(int)r], neopix_gamma[(int)g], neopix_gamma[(int)b]);
// Set the interval for updates.
  delay(3000);
}

void patchColor(int r, int g, int b){
// Build the JSON object
  DynamicJsonBuffer jsonBuffer(bufferSize);
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
