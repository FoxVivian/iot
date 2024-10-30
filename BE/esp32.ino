#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Thông tin WiFi
const char* ssid = "Khiem's Wifi";
const char* password = "68036803";
const char* mqtt_server = "192.168.40.102";

// const char* ssid = "khiem4g";
// const char* password = "khiem6886";
// const char* mqtt_server = "192.168.187.29";

// const char* ssid = "PCOFFEE";
// const char* password = "68036803";
// const char* mqtt_server = "192.168.40.102";

// Thông tin MQTT Broker

const int mqtt_port = 1111;
const char* mqtt_user = "khiem";
const char* mqtt_password = "123";

// Chân cảm biến
#define DHTPIN 27      // Chân Data của DHT
#define DHTTYPE DHT22  // Hoặc DHT22

#define LDR_PIN_ANALOG 34   // Chân analog cho cảm biến ánh sáng
#define LDR_PIN_DIGITAL 35  // Chân digital cho cảm biến ánh sáng

#define LED_1_PIN 13
#define LED_2_PIN 12
#define LED_3_PIN 14

#define LED_WIFI 2

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

// Hàm nhận message từ broker
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);

  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload, length);

  // Kiểm tra tin nhắn đến từ topic control/led
  if (String(topic) == "control/led") {
    if (doc.containsKey("1")) {
      digitalWrite(LED_1_PIN, doc["1"] == 1 ? HIGH : LOW);
    }
    if (doc.containsKey("2")) {
      digitalWrite(LED_2_PIN, doc["2"] == 1 ? HIGH : LOW);
    }
    if (doc.containsKey("3")) {
      digitalWrite(LED_3_PIN, doc["3"] == 1 ? HIGH : LOW);
    }
    doc["1"] = digitalRead(LED_1_PIN);
    doc["2"] = digitalRead(LED_2_PIN);
    doc["3"] = digitalRead(LED_3_PIN);
    char buffer[100];

    serializeJson(doc, buffer);
    client.publish("data/led", buffer);
  }
}

// Hàm kết nối WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_WIFI, HIGH);
    delay(100);
    digitalWrite(LED_WIFI, LOW);
    delay(100);
    Serial.print(".");
  }

  Serial.println("WiFi connected");
}

// Hàm kết nối MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client_Khiem", mqtt_user, mqtt_password)) {
      client.subscribe("control/led");  // Đăng ký topic 'control/led'
      Serial.println("connected");

      // Gửi data led lần đầu
      client.publish("control/led", "");
      return;
    }

    Serial.print("failed, rc=");
    Serial.print(client.state());
    Serial.println(" try again in 5 seconds");

    digitalWrite(LED_WIFI, HIGH);
    delay(250);
    digitalWrite(LED_WIFI, LOW);
    delay(50);
    digitalWrite(LED_WIFI, HIGH);
    delay(250);
    digitalWrite(LED_WIFI, LOW);

    delay(2000);
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(LED_WIFI, OUTPUT);

  pinMode(LED_1_PIN, OUTPUT);
  pinMode(LED_2_PIN, OUTPUT);
  pinMode(LED_3_PIN, OUTPUT);

  // pinMode(LDR_PIN_DIGITAL, INPUT);

  setup_wifi();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Đọc dữ liệu từ cảm biến DHT
  float nhiet_do = dht.readTemperature();
  float do_am = dht.readHumidity();

  // Đọc dữ liệu từ cảm biến ánh sáng
  float cuong_do_anh_sang = (4095.00 - analogRead(LDR_PIN_ANALOG)) * 100 / 4095.00;
  int anh_sang = 1 - digitalRead(LDR_PIN_DIGITAL);

  StaticJsonDocument<200> doc;
  char buffer[50];

  // Kiểm tra dữ liệu
  if (isnan(nhiet_do) || isnan(do_am)) {
    Serial.println("Lỗi đọc cảm biến DHT");
    digitalWrite(LED_WIFI, HIGH);
    return;
  }
  doc["t"] = round(nhiet_do * 100) / 100.0;
  doc["h"] = do_am;
  doc["l"] = round(cuong_do_anh_sang * 100) / 100.00;
  doc["hasL"] = anh_sang;

  // Gửi dữ liệu qua MQTT
  serializeJson(doc, buffer);
  client.publish("data/sensor", buffer);

  Serial.println(buffer);

  digitalWrite(LED_WIFI, HIGH);
  delay(100);
  digitalWrite(LED_WIFI, LOW);
  delay(1900);  // Gửi mỗi 1 giây
}