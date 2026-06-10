// Đây là source test các nút bấm trên board do Nuke Dashboard phát triển
// Để có thể sử dụng source code này bạn cần cài danh sách các thư viện sau: 
// + thư viện Adafruit NeoPixel by Adafruit
// + thư viện DHT sensor libraray by Adafruit 
// + thư viện Firebase ESP32 Client by Mobizt
// + thư viện Adafruit GFX libraray by Adafruit
// + thư viện Adafruit SSD1306 by Adafruit
// Tác giả MinhDuc
// 07/03/2026
// Led RGB được cấu hình chân DIN ở GPIO9
// Chân Data DHT được kết nối với GPIO11
// Chân SDA OLED kết nối với GPIO13
// Chân SCL OLED kết nối với GPIO12

#include <Wire.h>
#include "DHT.h"
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

#define DHTTYPE DHT11
#define DHTPIN 11
DHT dht(DHTPIN, DHTTYPE);

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

float temp,hum,CBND,CBDA,lastemp,lasthum;
int demwf = 0;

void setup() {
  Wire.begin(13,12); // Khởi tạo i2c cho màn oled
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
  delay(1000);
  pinMode(LED,OUTPUT);
  digitalWrite(LED,0);
  Serial.begin(115200);
  Serial.println("He thong dang khoi dong...");
  display.display();
  dht.begin();
  lasthum = dht.readHumidity();
  lastemp = dht.readTemperature();
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
  Firebase.setFloat(fbdo,"/users/{user}/dht11/Temp",lastemp);
  Firebase.setFloat(fbdo,"/users/{user}/dht11/Humi",lasthum);  
  led.setPixelColor(0, led.Color(0, 255, 0));
  led.show();
}

void loop() {
  display.clearDisplay();
  if(Firebase.getFloat(fbdo,"/users/{user}/dht11/CBNDDht11")) CBND = fbdo.floatData();
  if(Firebase.getFloat(fbdo,"/users/{user}/dht11/CBDADht11")) CBDA = fbdo.floatData();
  hum = dht.readHumidity();
  temp = dht.readTemperature();
  display.setTextSize(1);
  display.setCursor(20, 0);
  display.print("CAM BIEN DHT11");
  display.setCursor(0, 20);
  display.printf("ND:%.2f",temp);
  display.setCursor(55, 20);
  display.printf("DA:%.2f",hum);
  display.setCursor(0, 30);
  display.printf("CBND:%.1f",CBND);
  display.setCursor(65, 30);
  display.printf("CBDA:%.1f",CBDA);
  if(temp > CBND || hum > CBDA) {
    led.setPixelColor(0, led.Color(255, 0, 0));
    led.show();
    Firebase.setInt(fbdo,"/users/{user}/dht11/leddht11",1);
    display.setTextSize(1);
    display.setCursor(0, 40);
    display.print("Den canh bao: Bat");
  }
  else {
    led.setPixelColor(0, led.Color(0, 255, 0));
    led.show();
    Firebase.setInt(fbdo,"/users/{user}/dht11/leddht11",0);
    display.setTextSize(1);
    display.setCursor(0, 40);
    display.print("Den canh bao: Tat");
  }
  if(temp != lastemp) {
    lastemp = temp;
    Firebase.setFloat(fbdo,"/users/{user}/dht11/Temp",temp);
  }
  if(hum != lasthum) {
    lasthum = hum;
    Firebase.setFloat(fbdo,"/users/{user}/dht11/Humi",hum);
  }
  led.show();
  long rssi = WiFi.RSSI();
  display.setCursor(0, 50);
  display.printf("RSSI WiFi: %ld dbm", rssi);
  display.display();
  delay(1000);
}
