// Đây là source trống cho người dùng tự build trên board do Nuke Dashboard phát triển
// Để có thể sử dụng source code này bạn cần cài danh sách các thư viện sau: 
// + thư viện Adafruit NeoPixel by Adafruit
// + thư viện Firebase ESP32 Client by Mobizt
// + thư viện Adafruit GFX libraray by Adafruit
// + thư viện Adafruit SSD1306 by Adafruit
// Tác giả MinhDuc
// 07/03/2026
// Led RGB được cấu hình chân DIN ở GPIO9
// BME280 SDA chân 8
// BME280 SCL chân 18
// Oled tft SDA chân 13
// Oled tft SCL chân 12
// Nếu bạn cắm công COM thì serial0.begin(115200);
// Nếu bạn cắm công USB thì serial.begin(115200);

#include <Wire.h>
#include <FirebaseESP32.h>
#include <WiFi.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

const char* ssid = "........";
const char* pass = "........";

#define LED_PIN   9
#define LED_COUNT 1
Adafruit_NeoPixel led(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

#define LED 2

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


void setup() {
  /*
    Người dùng build code tại đây
  */
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
  display.setCursor(0, 0);
  display.printf("He thong dang \nkhoi dong...");
  display.display();
  delay(1000);
  pinMode(LED,OUTPUT);
  digitalWrite(LED,0);
  Serial.begin(115200);
  Serial.println("He thong dang khoi dong...");
  display.display();
  display.clearDisplay();
  WiFi.begin(ssid,pass);
  while (WiFi.status() != WL_CONNECTED) {
    led.setPixelColor(0, led.Color(255, 0, 255));
    led.show();
    Serial.println("dang khoi dong WiFi...");
    display.setCursor(0,0);
    display.print("Conecting WiFi");
    if(demwf < 80) {
      display.setCursor(demwf,10);
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
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1);
  digitalWrite(LED,0);
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(512, 512);
  Firebase.begin(&config, &auth);
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 30);
  display.println("XIN CHAO CAC BAN");
  display.display();
  delay(300);
  display.clearDisplay();
  led.setPixelColor(0, led.Color(0, 255, 0));
  led.show();
}

void loop() {
  /*
    Xây dựng cơ chế xử lý của bạn tại đây
  */
}
