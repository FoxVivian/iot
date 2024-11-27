// const char *mqtt_user = "khiem";
// const char *mqtt_password = "123";
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

// // WiFi and MQTT settings
const char *ssid = "BlueCandle";
const char *password = "blazingeyes";
const char *mqtt_server = "192.168.96.205";
const int mqtt_port = 1883;
const char *mqtt_user = "cong";
const char *mqtt_password = "184";

// Sensor pins
#define DHTPIN 27
#define DHTTYPE DHT11
#define LDR_PIN_ANALOG 34
#define LDR_PIN_DIGITAL 35

// LED pins
#define LED_WIFI 2
#define LED_1_PIN 13
#define LED_2_PIN 12
#define LED_3_PIN 14

// #define CONTACT_PIN 33

// Servo pin for door control
#define SERVO_DOOR_PIN 25

#define ENA 21 // Motor speed control
#define IN1 23 // Motor direction
#define IN2 22

int isOpen = 0;

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

Servo doorServo;

int doorStat = 0;

void OpenServo()
{
    if (doorStat == 0)
    {
        doorServo.attach(SERVO_DOOR_PIN);
        doorServo.write(0);
        Serial.println("Door opened!!!");
        delay(175);
        doorServo.detach();
        doorStat = 1;
    }
}

void CloseServo()
{
    if (doorStat == 1)
    {
        doorServo.attach(SERVO_DOOR_PIN);
        doorServo.write(180);
        Serial.println("Door Closed!!!");
        delay(175);
        doorServo.detach();
        doorStat = 0;
    }
}
void moveCurtainsOpen()
{
    if (isOpen == 0)
    {
        digitalWrite(IN1, HIGH);
        digitalWrite(IN2, LOW);
        analogWrite(ENA, 50); // 50% speed
        delay(1000);
        digitalWrite(IN1, LOW);
        digitalWrite(IN2, LOW);
        analogWrite(ENA, 0);
    }
    isOpen = 1;
}
void moveCurtainsClose()
{
    if (isOpen == 1)
    {
        digitalWrite(IN1, LOW);
        digitalWrite(IN2, HIGH);
        analogWrite(ENA, 50); // 50% speed
        delay(1000);
        digitalWrite(IN1, LOW);
        digitalWrite(IN2, LOW);
        analogWrite(ENA, 0);
    }
    isOpen = 0;
}
void detatching()
{
    testServo.detach();
}

// Hàm nhận message từ broker
void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived on topic: ");
    Serial.println(topic);

    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload, length);

    // Kiểm tra tin nhắn đến từ topic control/led
    if (String(topic) == "control/led")
    {
        if (doc.containsKey("1"))
        {
            if (doc["1"] == 1)
            {
                OpenServo();
            }
            else
            {
                CloseServo();
            }

            digitalWrite(LED_1_PIN, doc["1"] == 1 ? HIGH : LOW);
        }
        if (doc.containsKey("2"))
        {
            if (doc["2"] == 1)
            {
                moveCurtainsOpen();
            }
            else
            {
                moveCurtainsClose();
            }

            digitalWrite(LED_2_PIN, doc["2"] == 1 ? HIGH : LOW);
        }
        if (doc.containsKey("3"))
        {
            if (doc.containsKey("Contact"))
            {
                digitalWrite(LED_3_PIN, doc["Contact"] == 1 ? HIGH : LOW);
            }
            else if (doc["Contact"] == 1)
            {
                digitalWrite(LED_3_PIN, doc["3"] == 1 ? HIGH : LOW);
            }
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
void setup_wifi()
{
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        digitalWrite(LED_WIFI, HIGH);
        delay(100);
        digitalWrite(LED_WIFI, LOW);
        delay(100);
        Serial.print(".");
    }

    Serial.println("WiFi connected");
}

// Hàm kết nối MQTT
void reconnect()
{
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP32Client_Khiem", mqtt_user, mqtt_password))
        {
            client.subscribe("control/led"); // Đăng ký topic 'control/led'
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

void setup()
{
    Serial.begin(115200);
    // Configure Motor A pins
    pinMode(ENA, OUTPUT);
    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);

    // Configure Motor B pins
    pinMode(ENB, OUTPUT);
    pinMode(IN3, OUTPUT);
    pinMode(IN4, OUTPUT);
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

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    // if(digitalRead(CONTACT_PIN)){
    //     digitalWrite(LED_3_PIN,HIGH);
    // }else{
    //     digitalWrite(LED_3_PIN,LOW);
    // }

    // Đọc dữ liệu từ cảm biến DHT
    float nhiet_do = dht.readTemperature();
    float do_am = dht.readHumidity();

    // Đọc dữ liệu từ cảm biến ánh sáng
    float cuong_do_anh_sang = (4095.00 - analogRead(LDR_PIN_ANALOG)) * 100 / 4095.00;
    int anh_sang = 1 - digitalRead(LDR_PIN_DIGITAL);

    StaticJsonDocument<200> doc;
    char buffer[50];

    // Kiểm tra dữ liệu
    if (isnan(nhiet_do) || isnan(do_am))
    {
        Serial.println("Lỗi đọc cảm biến DHT");
        digitalWrite(LED_WIFI, HIGH);
        return;
    }
    doc["t"] = round(nhiet_do * 100) / 100.0;
    doc["h"] = do_am;
    doc["l"] = round(cuong_do_anh_sang * 100) / 100.00;
    doc["hasL"] = anh_sang;
    // doc["Contact"] = digitalRead(CONTACT_PIN);

    // Gửi dữ liệu qua MQTT
    serializeJson(doc, buffer);
    client.publish("data/sensor", buffer);

    Serial.println(buffer);

    digitalWrite(LED_WIFI, HIGH);
    delay(100);
    digitalWrite(LED_WIFI, LOW);
    delay(1900); // Gửi mỗi 1 giây
}