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
#define LED 2
#define in1 16
#define in2 15

volatile int state = 0;
int laststate = 1;
volatile unsigned long lastInterrupt = 0;

void IRAM_ATTR ISR() {
  if(millis() - lastInterrupt > 200){
    state = 1;
    lastInterrupt = millis();
  }
}

void IRAM_ATTR ISR2() {
  if(millis() - lastInterrupt > 200){
    state = 0;
    lastInterrupt = millis();
  }
}

void setup() {
  Serial.begin(115200);
  led.begin();
  led.setBrightness(50);
  led.setPixelColor(0, led.Color(0, 255, 255));
  led.show();
  delay(1000);
  pinMode(LED,OUTPUT);
  pinMode(in1,OUTPUT);
  pinMode(in2,OUTPUT);
  pinMode(btnup, INPUT_PULLUP);
  pinMode(btndown, INPUT_PULLUP);
  attachInterrupt(btnup, ISR, FALLING);
  attachInterrupt(btndown, ISR2, FALLING);
  led.setPixelColor(0, led.Color(255, 0, 255));
  led.show();
  delay(1000);
  Serial.println(state);
}

uint32_t randomColor() {
  uint8_t r = random(0, 256);
  uint8_t g = random(0, 256);
  uint8_t b = random(0, 256);
  return led.Color(r, g, b);
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
    digitalWrite(LED, 0);
    digitalWrite(in1, 0);
    digitalWrite(in2, 0);
  }
  else if(state == 1) {
    led.setPixelColor(0, randomColor());
    led.show();
    digitalWrite(LED,1);
    delay(100);
    digitalWrite(LED,0);
    delay(100);
    digitalWrite(in1, 1);
    digitalWrite(in2, 1);
  }
}

