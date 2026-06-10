// - Đây là source điều khiển ngoại vi như động cơ, đèn led, máy bơm,... với mức điện áp 12V thông qua giao diện trên trang web ở kênh 1
// hoặc sử dụng trực tiếp các nút bấm sw8 để bật và sw11 để tắt trên board do Nuke Dashboard phát triển.
// - Để có thể sử dụng source code này bạn cần cài danh sách các thư viện sau: 
// + thư viện Adafruit NeoPixel by Adafruit
// + thư viện Firebase ESP32 Client by Mobizt
// + thư viện Adafruit GFX libraray by Adafruit
// + thư viện Adafruit SSD1306 by Adafruit
// - Tác giả MinhDuc
// - 07/03/2026
// - Led RGB được cấu hình chân DIN ở GPIO9
// - Chân SDA OLED kết nối với GPIO13
// - Chân SCL OLED kết nối với GPIO12
// - Nút nhấn SW8 kết nối với GPIO10
// - Nút nhấn SW11 kết nối với GPIO14
// - Chân điện áp dương là chân OUT1
// - Chân gnd là chân out2

#include <Adafruit_NeoPixel.h>
#include <FirebaseESP32.h>
#include <WiFi.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

const char* ssid = "........";
const char* pass = "........";

#define LED_PIN   9
#define LED_COUNT 1
Adafruit_NeoPixel led(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

#define DATABASE_URL "https://doantn-885dc-default-rtdb.firebaseio.com/"
#define DATABASE_SECRET "rPb2lv5DjHze997hD9pxnzTzWJsir4wwdP1poStt"
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

#define i2c_Address 0x3c
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display = Adafruit_SSD1306(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);


#define LED 2
#define in1 16
#define in2 15
#define btnOn 10
#define btnOff 14

volatile int state = 0;
int laststate = 1;
int demwf = 0;
int stateled = 0;
int laststateled = 0;
void IRAM_ATTR ON() {
  if (digitalRead(btnOn) == 0) {
    state = 1;
  }
}
void IRAM_ATTR OFF() {
  if (digitalRead(btnOff) == 0) {
    state = 0;
  }
}
void setup() {
  Wire.begin(13,12);
  led.begin();
  led.setBrightness(50);
  led.setPixelColor(0, led.Color(255, 0, 255));
  led.show();  
  if (!display.begin(SSD1306_SWITCHCAPVCC, i2c_Address)) {
    while (1);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(25, 30);
  display.print("NUKEDASHBOARD");
  display.display();
  pinMode(LED,OUTPUT);
  digitalWrite(LED,0);
  Serial.begin(115200);
  display.display();
  pinMode(LED,OUTPUT);
  pinMode(in1,OUTPUT);
  pinMode(in2,OUTPUT);
  pinMode(btnOn, INPUT);
  pinMode(btnOff, INPUT);
  attachInterrupt(digitalPinToInterrupt(btnOn), ON, FALLING);
  attachInterrupt(digitalPinToInterrupt(btnOff), OFF, FALLING);
  delay(1000);
  WiFi.begin(ssid,pass);
  display.clearDisplay();
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
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(512, 512);
  Firebase.begin(&config, &auth);
  if(Firebase.getInt(fbdo, "/users/{user}/In/In1")) {
    state = fbdo.intData();
  }
  Firebase.setInt(fbdo,"users/{user}/Out/Out1",stateled);
  if(!Firebase.beginStream(fbdo, "/users/{user}/In/In1"))
    Serial.printf("stream data begin error, %s\n\n", fbdo.errorReason().c_str());
  led.setPixelColor(0, led.Color(255, 0, 255));
  led.show();
  delay(1000);
  Serial.println(state);
}

void loop() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.print("DIEU KHIEN THIET BI");
  if (!Firebase.readStream(fbdo)) {
    Serial.printf("Stream data begin error: %s\n", fbdo.errorReason().c_str());
  }
  if (fbdo.streamAvailable()) {
    if(Firebase.getInt(fbdo, "/users/{user}/In/In1")) {
      state = fbdo.intData();
    }
  }
  if(state == 0) {
    led.setPixelColor(0, led.Color(255,0,0));
    delay(1000);
    digitalWrite(LED, 0);
    digitalWrite(in1, 0);
    digitalWrite(in2, 0);
  }
  else if(state == 1) {
    led.setPixelColor(0, led.Color(0,255,0));
    delay(1000);
    digitalWrite(LED,1);
    delay(100);
    digitalWrite(LED,0);
    delay(100);
    digitalWrite(in1, 1);
    digitalWrite(in2, 0);
  }
  if(state != laststate) {
    Serial.println(state);
    laststate = state;
    Firebase.setInt(fbdo,"users/{user}/Out/Out1",state);
  }
  display.setCursor(0,20);
  display.printf("Trang thai: %s", state ? "Bat":"Tat");
  long rssi = WiFi.RSSI();
  display.setCursor(0, 30);
  display.printf("RSSI WiFi: %ld dbm", rssi);
  led.show();
  display.display();
}
