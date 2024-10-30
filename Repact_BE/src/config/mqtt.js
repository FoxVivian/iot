const mqtt = require('mqtt');

const mqttBrokerUrl = 'mqtt://localhost:1883';
const mqttUser = 'cong';
const mqttPassword = '184';

const mqttClient = mqtt.connect(mqttBrokerUrl, {
  username: mqttUser,
  password: mqttPassword
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  // Đăng ký chủ đề MQTT
  mqttClient.subscribe('data/sensor', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic: data/sensor');
    } else {
      console.log('Subscribed to topic: data/sensor');
    }
  });

  mqttClient.subscribe('data/led', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic: data/led');
    } else {
      console.log('Subscribed to topic: data/led');
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});

module.exports = mqttClient;
