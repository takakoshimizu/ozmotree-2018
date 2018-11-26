//  ******************************************************************
//  ██████╗*██████╗**██████╗*██████╗*████████╗██████╗*███████╗███████╗
//  ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██╔════╝
//  ██║**██║██████╔╝██║***██║██████╔╝***██║***██████╔╝█████╗**█████╗**
//  ██║**██║██╔══██╗██║***██║██╔═══╝****██║***██╔══██╗██╔══╝**██╔══╝**
//  ██████╔╝██║**██║╚██████╔╝██║********██║***██║**██║███████╗███████╗
//  ╚═════╝*╚═╝**╚═╝*╚═════╝*╚═╝********╚═╝***╚═╝**╚═╝╚══════╝╚══════╝
//  Tree strip parser
//  Author: David Bates
//  Date: 11/20/2018
//  ******************************************************************

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_NeoPixel.h>
//If you have ~300 lights you could use ArduinoJSON but at 900 there is not enough memory. 

#define PIN 14

#define NUM_LEDS 900

#define BRIGHTNESS 25

char ssid[] = "OzmoTree";       // your network SSID (name)
char password[] = "4Tree4Tree";

// Depending on your lights you might have to modify the colorspace or frequency
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

//One type of gamma correction, depends on lights
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

//For building a different gamma table
byte gammatable[256];

void setup() {
  Serial.begin(115200);
//  Set the brightness of the LEDs (May vary depending on your type)
  strip.setBrightness(BRIGHTNESS);
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
//   Connect to wifi:
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  // Attempt to connect to Wifi network:
  Serial.print("Connecting Wifi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    // Might as well show pretty colors while we wait
    rainbowCycle(20);
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  IPAddress ip = WiFi.localIP();
  Serial.println(ip);

}
// Should have a delay of less that 500ms total in order to keep up with song timing
void loop() {
  Serial.println("Starting Request");
  String json = getStripColorArray();
  parseLights(json);
  strip.show();
  // This is for the watchdog timer in ESP8266
  delay(0);
}

void parseLights(String lights){
int pixel =0;
bool parsing = true;
lights.remove(0, 2);
while (parsing) {
  int openBrack = lights.indexOf("]");
  if(openBrack == -1){
    parsing = false;
    Serial.println("FinishedParsing");
    return;
  }
  String curval = getValue(lights, ']', 0);
    int red = getValue(lights, ',', 0).toInt();
    int green = getValue(lights, ',', 1).toInt();
    int blue = getValue(lights, ',', 2).toInt();
    strip.setPixelColor(pixel, strip.Color(red, green, blue));
//    Watchdog
    delay(0);
  lights.remove(0, openBrack + 3);
  pixel++;
  //    Watchdog
}
 delay(0);
}

String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

String getStripColorArray(){
  HTTPClient http;

  Serial.print("[HTTP] begin...\n");
  http.begin("http://10.20.0.100:3000/lights/"); //HTTP
  
  Serial.print("[HTTP] GET...\n");
  int httpCode = http.GET();
  
  // httpCode will be negative on error
  if(httpCode > 0) {
  // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] GET... code: %d\n", httpCode);
  
    // file found at server
    if(httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.print("Color Array Received: ");
      Serial.println(payload);
      delay(25);
      http.end();
      return payload;
    }
  } else {
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  
  http.end();
  return "";
}

void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}
