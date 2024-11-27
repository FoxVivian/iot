#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>  // Use ESP32Servo library instead of Servo

// WiFi and MQTT settings
const char* ssid = "Herae";
const char* password = "khongcopass";
const char* mqtt_server = "192.168.1.219";

const int mqtt_port = 1883;
const char* mqtt_user = "khiem";
const char* mqtt_password = "123";

// Sensor pins
#define DHTPIN 27
#define DHTTYPE DHT11
#define LDR_PIN_ANALOG 34
#define LDR_PIN_DIGITAL 35

// LED pins
#define LED_1_PIN 13
#define LED_2_PIN 12
#define LED_3_PIN 14
#define LED_WIFI 2

// Servo pin for door control
#define SERVO_DOOR_PIN 25

// Motor pins for L298
#define MOTOR1_IN1 16
#define MOTOR1_IN2 17
#define MOTOR2_IN1 18
#define MOTOR2_IN2 19

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);
Servo doorServo;  // Servo object for door using ESP32Servo

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
  
  else if (String(topic) == "control/door") {
    if (doc.containsKey("open")) {
      doorServo.write(90);  // Open door to 90 degrees
    } else if (doc.containsKey("close")) {
      doorServo.write(0);  // Close door to 0 degrees
    }

    // Control motors with L298 for other movements
    if (doc.containsKey("motor1")) {
      digitalWrite(MOTOR1_IN1, doc["motor1"] == 1 ? HIGH : LOW);
      digitalWrite(MOTOR1_IN2, doc["motor1"] == 2 ? HIGH : LOW);
    }
    if (doc.containsKey("motor2")) {
      digitalWrite(MOTOR2_IN1, doc["motor2"] == 1 ? HIGH : LOW);
      digitalWrite(MOTOR2_IN2, doc["motor2"] == 2 ? HIGH : LOW);
    }
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
      client.subscribe("control/door");
      Serial.println("connected");

      client.publish("control/led", "");
      client.publish("control/door", "");
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

  pinMode(MOTOR1_IN1, OUTPUT);
  pinMode(MOTOR1_IN2, OUTPUT);
  pinMode(MOTOR2_IN1, OUTPUT);
  pinMode(MOTOR2_IN2, OUTPUT);

  doorServo.attach(SERVO_DOOR_PIN);  // Initialize servo for door control

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
  float nhiet_do = 37;
  float do_am = 50;

  float cuong_do_anh_sang = (4095.00 - analogRead(LDR_PIN_ANALOG)) * 100 / 4095.00;
  int anh_sang = 1 - digitalRead(LDR_PIN_DIGITAL);

  StaticJsonDocument<200> doc;
  char buffer[50];

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
