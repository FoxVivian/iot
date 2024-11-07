const mqtt = require('mqtt');

const mqttBrokerUrl = 'mqtt://192.168.1.219:1883';
const mqttUser = 'khiem';
const mqttPassword = '123';

const mqttClient = mqtt.connect(mqttBrokerUrl, {
  username: mqttUser,
  password: mqttPassword
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  
  // Subscribe to sensor data topic
  mqttClient.subscribe('data/sensor', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic: data/sensor');
    } else {
      console.log('Subscribed to topic: data/sensor');
    }
  });

  // Subscribe to LED data topic
  mqttClient.subscribe('data/led', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic: data/led');
    } else {
      console.log('Subscribed to topic: data/led');
    }
  });

  // Subscribe to Servo data topic
  mqttClient.subscribe('data/servo', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic: data/servo');
    } else {
      console.log('Subscribed to topic: data/servo');
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});

module.exports = mqttClient;
