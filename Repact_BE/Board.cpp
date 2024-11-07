#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <Servo.h>  // Include the Servo library

// WiFi and MQTT settings
// const char* ssid = "BlueCandle";
// const char* password = "blazingeyes";
// const char* mqtt_server = "192.168.40.102";

const char* ssid = "Herae";
const char* password = "khongcopass";
const char* mqtt_server = "192.168.1.219";

const int mqtt_port = 1883;
const char* mqtt_user = "khiem";
const char* mqtt_password = "123";

// Sensor pins
#define DHTPIN 27
#define DHTTYPE DHT22
#define LDR_PIN_ANALOG 34
#define LDR_PIN_DIGITAL 35

// LED pins
#define LED_1_PIN 13
#define LED_2_PIN 12
#define LED_3_PIN 14
#define LED_WIFI 2

// Servo pins
#define SERVO_1_PIN 25
#define SERVO_2_PIN 26
#define SERVO_3_PIN 33

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);
Servo servo1, servo2, servo3;  // Servo objects

// MQTT message handler
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);

  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload, length);

  if (String(topic) == "control/led") {
    if (doc.containsKey("1")) digitalWrite(LED_1_PIN, doc["1"] == 1 ? HIGH : LOW);
    if (doc.containsKey("2")) digitalWrite(LED_2_PIN, doc["2"] == 1 ? HIGH : LOW);
    if (doc.containsKey("3")) digitalWrite(LED_3_PIN, doc["3"] == 1 ? HIGH : LOW);

    doc["1"] = digitalRead(LED_1_PIN);
    doc["2"] = digitalRead(LED_2_PIN);
    doc["3"] = digitalRead(LED_3_PIN);
    char buffer[100];
    serializeJson(doc, buffer);
    client.publish("data/led", buffer);
  } 
  
  else if (String(topic) == "control/servo") {
    if (doc.containsKey("1")) servo1.write(doc["1"]);
    if (doc.containsKey("2")) servo2.write(doc["2"]);
    if (doc.containsKey("3")) servo3.write(doc["3"]);

    doc["1"] = servo1.read();
    doc["2"] = servo2.read();
    doc["3"] = servo3.read();
    char buffer[100];
    serializeJson(doc, buffer);
    client.publish("data/servo", buffer);
  }
}

// WiFi setup
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

// MQTT connection setup
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client_Khiem", mqtt_user, mqtt_password)) {
      client.subscribe("control/led");
      client.subscribe("control/servo");
      Serial.println("connected");

      client.publish("control/led", "");
      client.publish("control/servo", "");
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

  servo1.attach(SERVO_1_PIN);
  servo2.attach(SERVO_2_PIN);
  servo3.attach(SERVO_3_PIN);

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

  // Read DHT sensor data
  float nhiet_do = dht.readTemperature();
  float do_am = dht.readHumidity();
  float cuong_do_anh_sang = (4095.00 - analogRead(LDR_PIN_ANALOG)) * 100 / 4095.00;
  int anh_sang = 1 - digitalRead(LDR_PIN_DIGITAL);

  StaticJsonDocument<200> doc;
  char buffer[50];

  // Check DHT data validity
  if (isnan(nhiet_do) || isnan(do_am)) {
    Serial.println("DHT sensor error");
    digitalWrite(LED_WIFI, HIGH);
    return;
  }
  doc["t"] = round(nhiet_do * 100) / 100.0;
  doc["h"] = do_am;
  doc["l"] = round(cuong_do_anh_sang * 100) / 100.00;
  doc["hasL"] = anh_sang;

  // Send sensor data via MQTT
  serializeJson(doc, buffer);
  client.publish("data/sensor", buffer);
  Serial.println(buffer);

  digitalWrite(LED_WIFI, HIGH);
  delay(100);
  digitalWrite(LED_WIFI, LOW);
  delay(1900);
}
