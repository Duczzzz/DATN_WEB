// Đây là source test các nút bấm trên board do Nuke Dashboard phát triển
// Để có thể sử dụng source code này bạn cần cài danh sách các thư viện sau: 
// + thư viện Adafruit NeoPixel by Adafruit
// + thư viện Firebase ESP32 Client by Mobizt
// + thư viện Adafruit GFX libraray by Adafruit
// + thư viện Adafruit SSD1306 by Adafruit
// + thư viện time by Michael Margolis
// Tác giả MinhDuc
// 07/03/2026
// Led RGB được cấu hình chân DIN ở GPIO9
// Ngõ ra động cơ được kết nối vào out1 là chân dương +12v 
//                              và out2 là chân gnd
// Chân in1 kết nối với GPIO16
// Chân in2 kết nối với GPIO15

#include <Wire.h>
#include <FirebaseESP32.h>
#include <WiFi.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <time.h>

const char* ssid = "........";
const char* pass = "........";

#define LED_PIN   9
#define LED_COUNT 1
Adafruit_NeoPixel led(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

#define LED 2
#define in1 16
#define in2 15

#define i2c_Address 0x3c
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display = Adafruit_SSD1306(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define DATABASE_URL "https://doantn-885dc-default-rtdb.firebaseio.com/"
#define DATABASE_SECRET "rPb2lv5DjHze997hD9pxnzTzWJsir4wwdP1poStt"
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

const char* ntpServer1 = "time.google.com";
const long  gmtOffset_sec = 25200;
const int   daylightOffset_sec = 0;

int currentHour = 0;
int currentMin = 0;
int hoursta = 0;
int minsta = 0;
int hoursto = 0;
int minsto = 0;
bool ledstate = 1;
bool state = 0;
int demwf = 0;

void setup() {
  Wire.begin(13,12);
  led.begin();
  led.setBrightness(50);
  led.setPixelColor(0, led.Color(255, 0, 255));
  led.show();  
  if (!display.begin(SSD1306_SWITCHCAPVCC, i2c_Address)) {
    led.setPixelColor(0, led.Color(255, 0, 0));
    led.show();
    Serial.println("OLED fail!");
    while (1);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(25, 30);
  display.print("NUKEDASHBOARD");
  display.display();
  pinMode(LED,OUTPUT);
  pinMode(in1,OUTPUT);
  pinMode(in2,OUTPUT);
  digitalWrite(in2,0);
  digitalWrite(LED,0);
  Serial.begin(115200);
  Serial.println("He thong dang khoi dong...");
  display.display();
  display.clearDisplay();
  delay(1000);
  WiFi.begin(ssid,pass);
  while (WiFi.status() != WL_CONNECTED) {
    led.setPixelColor(0, led.Color(255, 0, 255));
    led.show();
    Serial.println("dang khoi dong WiFi...");
    display.setCursor(10,0);
    display.print("Dang ket noi WiFi");
    display.setCursor(0,20);
    display.printf("SSID: %s",ssid);
    if(demwf < 80) {
      display.setCursor(demwf,30);
      display.print(".");
      Serial0.println(".");
    }
    else if(demwf > 80) {
      display.clearDisplay();
      demwf = 0;
    }
    demwf+=5;
    display.display();
    digitalWrite(LED,1);
    delay(300);
  }
  digitalWrite(LED,0);
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1);
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(512, 512);
  Firebase.begin(&config, &auth);
  led.setPixelColor(0, led.Color(0, 255, 0));
  led.show();
}

void loop() {
  display.clearDisplay();
  int rssi = WiFi.RSSI();
  display.setCursor(10, 0);
  display.print("DK THEO THOI GIAN");
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    currentHour = timeinfo.tm_hour;
    currentMin  = timeinfo.tm_min;
    display.setCursor(0, 20);
    display.printf("Tg ht:%d:%d || %d",currentHour,currentMin,rssi);
  }
  else {
    display.setCursor(0, 20);
    display.print("Loi ket noi server");
  }
  if (Firebase.getInt(fbdo, "/users/{user}/Card/timeControl/hourstart")) hoursta = fbdo.intData();
  if (Firebase.getInt(fbdo, "/users/{user}/Card/timeControl/minutestart")) minsta = fbdo.intData();
  if (Firebase.getInt(fbdo, "/users/{user}/Card/timeControl/hourend")) hoursto = fbdo.intData();
  if (Firebase.getInt(fbdo, "/users/{user}/Card/timeControl/minuteend")) minsto = fbdo.intData();

  display.setCursor(0, 30);
  display.printf("Tg bat: %d:%d",hoursta,minsta);
  display.setCursor(0, 40);
  display.printf("Tg tat: %d:%d",hoursto,minsto);
  if (
    (currentHour > hoursta || (currentHour == hoursta && currentMin >= minsta)) &&
    (currentHour < hoursto || (currentHour == hoursto && currentMin < minsto))
  ) {
    state = 1;
    digitalWrite(LED,1);
    led.setPixelColor(0, led.Color(0, 0, 255));
  } else {
    state = 0;
    digitalWrite(LED,0);
    led.setPixelColor(0, led.Color(255, 0, 0));
  }
  led.show();
  display.setCursor(0, 50);
  display.printf("Dong co: %s",state ? "On":"Off");
  if (state != ledstate) {
    ledstate = state;
    Firebase.setInt(fbdo, "/users/{user}/Card/timeControl/statusMotor",state);
  }
  if (state == 1) {
    digitalWrite(in1,1);
  }
  else {
    digitalWrite(in1,0);
  }
  display.display();
  delay(1000);
}
