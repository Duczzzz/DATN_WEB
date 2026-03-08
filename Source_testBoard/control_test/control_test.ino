// Đây là source test điều khiển cổng động cơ tích hợp trên board do Nuke Dashboard phát triển
// Để có thể sử dụng source code này bạn cần cài thư viện Adafruit NeoPixel by Adafruit
// Tác giả MinhDuc
// 07/03/2026
// Các thư viện cần tải trước khi sử dụng code:
// + thư viện Firebase ESP32 Client by Mobizt
// + thư viện Adafruit GFX libraray by Adafruit
// + thư viện Adafruit SH110X by Adafruit
// Led RGB được cấu hình chân DIN ở GPIO9

//Version điều khiển nút bấm trên Board
// #include <Adafruit_NeoPixel.h>

// #define LED_PIN   9
// #define LED_COUNT 1
// Adafruit_NeoPixel led(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// #define btnup 10
// #define btndown 12
// #define LED 2
// #define in1 16
// #define in2 15

// volatile int state = 0;
// int laststate = 1;
// volatile unsigned long lastInterrupt = 0;

// void IRAM_ATTR ISR() {
//   if(millis() - lastInterrupt > 200){
//     state = 1;
//     lastInterrupt = millis();
//   }
// }

// void IRAM_ATTR ISR2() {
//   if(millis() - lastInterrupt > 200){
//     state = 0;
//     lastInterrupt = millis();
//   }
// }

// void setup() {
//   Serial.begin(115200);
//   led.begin();
//   led.setBrightness(50);
//   led.setPixelColor(0, led.Color(0, 255, 255));
//   led.show();
//   delay(1000);
//   pinMode(LED,OUTPUT);
//   pinMode(in1,OUTPUT);
//   pinMode(in2,OUTPUT);
//   pinMode(btnup, INPUT_PULLUP);
//   pinMode(btndown, INPUT_PULLUP);
//   attachInterrupt(btnup, ISR, FALLING);
//   attachInterrupt(btndown, ISR2, FALLING);
//   led.setPixelColor(0, led.Color(255, 0, 255));
//   led.show();
//   delay(1000);
//   Serial.println(state);
// }

// void loop() {
//   if(state != laststate) {
//     Serial.println(state);
//     laststate = state;
//   }
//   if(state == 0) {
//     led.setPixelColor(0, led.Color(255,0,0));
//     led.show();
//     delay(1000);
//     digitalWrite(LED, 0);
//     digitalWrite(in1, 0);
//     digitalWrite(in2, 0);
//   }
//   else if(state == 1) {
//     led.setPixelColor(0, led.Color(0,255,0));
//     led.show();
//     delay(1000);
//     digitalWrite(LED,1);
//     delay(100);
//     digitalWrite(LED,0);
//     delay(100);
//     digitalWrite(in1, 1);
//     digitalWrite(in2, 0);
//   }
// }

// Version điều khiển thông qua platform Nuke DashBoard
#include <Adafruit_NeoPixel.h>
#include <FirebaseESP32.h>
#include <WiFi.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

const char* ssid = "DUC";
const char* pass = "14042004";

#define LED_PIN   9
#define LED_COUNT 1
Adafruit_NeoPixel led(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

#define DATABASE_URL "https://doantn-885dc-default-rtdb.firebaseio.com/"
#define DATABASE_SECRET "rPb2lv5DjHze997hD9pxnzTzWJsir4wwdP1poStt"
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// #define i2c_Address 0x3c
// #define SCREEN_WIDTH 128
// #define SCREEN_HEIGHT 64
// #define OLED_RESET -1
// Adafruit_SH1106G display = Adafruit_SH1106G(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);


#define LED 2
#define in1 16
#define in2 15

volatile int state = 0;
int laststate = 1;
int demwf = 0;
int stateled = 0;
int laststateled = 0;
void setup() {
  // Wire.begin(12,13);
  // display.begin(i2c_Address, true);
  // display.clearDisplay();
  // display.setTextSize(1);
  // display.setTextColor(SH110X_WHITE);
  // display.setCursor(0, 0);
  // display.printf("He thong dang \nkhoi dong...");
  // display.display();
  // delay(1000);
  Serial.begin(115200);
  Serial.println("He thong dang khoi dong...");
  led.begin();
  led.setBrightness(50);
  led.setPixelColor(0, led.Color(0, 255, 255));
  led.show();
  delay(1000);
  pinMode(LED,OUTPUT);
  pinMode(in1,OUTPUT);
  pinMode(in2,OUTPUT);
  WiFi.begin(ssid,pass);
  // display.clearDisplay();
  while (WiFi.status() != WL_CONNECTED) {
    led.setPixelColor(0, led.Color(255, 0, 255));
    led.show();
    Serial.println("dang khoi dong WiFi...");
    // display.setCursor(0,0);
    // display.print("Conecting WiFi");
    if(demwf < 80) {
      // display.setCursor(demwf,10);
      // display.print(".");
      // Serial0.println(".");
    }
    else if(demwf > 80) {
      // display.clearDisplay();
      demwf = 0;
    }
    demwf+=5;
    // display.display();
    digitalWrite(LED,1);
    delay(300);
  }
  digitalWrite(LED,0);
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(512, 512);
  Firebase.begin(&config, &auth);
  if(Firebase.getInt(fbdo, "/users/{user}/In/In2")) {
    state = fbdo.intData();
  }
  Firebase.setInt(fbdo,"users/{user}/Out/Out1",stateled);
  if(!Firebase.beginStream(fbdo, "/users/{user}/In/In2"))
    Serial.printf("stream data begin error, %s\n\n", fbdo.errorReason().c_str());
  led.setPixelColor(0, led.Color(255, 0, 255));
  led.show();
  delay(1000);
  Serial.println(state);
}

void loop() {
  if (!Firebase.readStream(fbdo)) {
    Serial.printf("Stream data begin error: %s\n", fbdo.errorReason().c_str());
  }
  if (fbdo.streamAvailable()) {
    if(Firebase.getInt(fbdo, "/users/{user}/In/In2")) {
      state = fbdo.intData();
    }
  }
  if(state != laststate) {
    Serial.println(state);
    laststate = state;
  }
  if(state == 0) {
    led.setPixelColor(0, led.Color(255,0,0));
    led.show();
    delay(1000);
    digitalWrite(LED, 0);
    digitalWrite(in1, 0);
    digitalWrite(in2, 0);
    stateled = 0;
  }
  else if(state == 1) {
    led.setPixelColor(0, led.Color(0,255,0));
    led.show();
    delay(1000);
    digitalWrite(LED,1);
    delay(100);
    digitalWrite(LED,0);
    delay(100);
    digitalWrite(in1, 1);
    digitalWrite(in2, 0);
    stateled = 1;
  }
  if(stateled != laststateled) {
    laststateled = stateled;
    Firebase.setInt(fbdo,"users/{user}/Out/Out2",stateled);
  }
}
