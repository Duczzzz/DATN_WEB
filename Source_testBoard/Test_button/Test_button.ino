// Đây là source test các nút bấm trên board do Nuke Dashboard phát triển
// Để có thể sử dụng source code này bạn cần cài thư viện Adafruit NeoPixel by Adafruit
// Tác giả MinhDuc
// 07/03/2026
// Led RGB được cấu hình chân DIN ở GPIO9
#include <Adafruit_NeoPixel.h>

#define LED_PIN   9
#define LED_COUNT 1
Adafruit_NeoPixel led(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

#define btnup 10
#define btndown 12
#define btnreset 14
#define LED 2

volatile int state = 0;
int laststate = 0;
volatile unsigned long lastInterrupt = 0;

void IRAM_ATTR ISR() {
  if(millis() - lastInterrupt > 200){
    state++;
    if(state > 2) state = 0;
    lastInterrupt = millis();
  }
}

void IRAM_ATTR ISR2() {
  if(millis() - lastInterrupt > 200){
    state--;
    if(state < 0) state = 2;
    lastInterrupt = millis();
  }
}

void IRAM_ATTR ISR3() {
  state = 0;
}

uint32_t randomColor() {
  uint8_t r = random(0, 256);
  uint8_t g = random(0, 256);
  uint8_t b = random(0, 256);
  return led.Color(r, g, b);
}

void setup() {
  Serial.begin(115200);
  led.begin();
  led.setBrightness(50);
  led.setPixelColor(0, led.Color(0, 255, 255));
  led.show();
  delay(1000);
  pinMode(LED,OUTPUT);
  pinMode(btnup, INPUT_PULLUP);
  pinMode(btndown, INPUT_PULLUP);
  pinMode(btnreset, INPUT_PULLUP);
  attachInterrupt(btnup, ISR, FALLING);
  attachInterrupt(btndown, ISR2, FALLING);
  attachInterrupt(btnreset, ISR3, FALLING);
  led.setPixelColor(0, led.Color(255, 0, 255));
  led.show();
  delay(1000);
}

void loop() {
  if(state != laststate) {
    Serial.println(state);
    laststate = state;
  }
  if(state == 0) {
    led.setPixelColor(0, led.Color(255,0,0));
    led.show();
    delay(1000);

    led.setPixelColor(0, led.Color(0,255,0));
    led.show();
    delay(1000);

    led.setPixelColor(0, led.Color(0,0,255));
    led.show();
    delay(1000);
  }
  else if(state == 1) {
    led.setPixelColor(0, randomColor());
    led.show();
    digitalWrite(LED,1);
    delay(100);
    digitalWrite(LED,0);
    delay(100);
  }
  else if(state == 2) {
    led.setPixelColor(0, led.Color(255,255,255));
    led.show();
    digitalWrite(LED,1);
    delay(1000);
    digitalWrite(LED,0);
    delay(1000);
  }
}
