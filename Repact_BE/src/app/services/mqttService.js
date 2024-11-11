const Data_Sensor = require('../models/Data_Sensor');
const Data_Device = require('../models/Data_Device');
const checkToken = require('../middlewares/checkToken');
const Device = require('../models/Device');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// const mqttClient = require('../../config/mqtt');
const mqttClient = require('../../config/mqtt');

var data = {
    "data/sensor": null,
    "data/led": null,
    "control/led": null,
    "data/servo": null,
    "control/servo": null,
}

eventEmitter.on('control', ({ _controlData, requestId }) => {
    // Separate LED and Servo control data
    const ledControlData = {};
    const servoControlData = {};

    // Distribute control data to either LED or Servo
    Object.keys(_controlData).forEach((key) => {
        if (key.startsWith('led/')) {
            ledControlData[key.replace('led/', '')] = _controlData[key];
        } else if (key.startsWith('servo/')) {
            servoControlData[key.replace('servo/', '')] = _controlData[key];
        }
    });

    // Store the control data for LEDs and Servos separately
    data["control/led"] = ledControlData;
    data["control/servo"] = servoControlData;

    // Publish control data for LEDs
    if (Object.keys(ledControlData).length > 0) {
        const controlData = { ...ledControlData, requestId };
        console.log("LED Control Data:", JSON.stringify(controlData));
        mqttClient.publish('control/led', JSON.stringify(controlData));
    }

    // Publish control data for Servos
    if (Object.keys(servoControlData).length > 0) {
        const controlData = { ...servoControlData, requestId };
        console.log("Servo Control Data:", JSON.stringify(controlData));
        mqttClient.publish('control/servo', JSON.stringify(controlData));
    }
});

mqttClient.on('message', async (topic, message) => {
    console.log("Message received on topic:", topic);
    const { requestId, ...messageData } = JSON.parse(message.toString());

    data[topic] = {
        ...data[topic],
        ...messageData,
    };

    // Update devices and log actions based on topic
    if (topic === "data/led" || topic === "data/servo") {
        try {
            const deviceData = data[topic];
            const deviceType = topic === "data/led" ? "LED" : "Servo";

            // Update device statuses in MongoDB
            await Promise.all(Object.keys(deviceData).map(async (id) => {
                await Device.findByIdAndUpdate(id, { status: deviceData[id] });
            }));

            // Log control actions in Data_Device
            const controlKey = topic === "data/led" ? "control/led" : "control/servo";
            if (data[controlKey]) {
                await Promise.all(Object.keys(data[controlKey]).map(async (key) => {
                    await Data_Device.create({
                        device_id: key, // Device ID
                        action: data[controlKey][key], // Corresponding action
                        user_id: 1
                    });
                }));
                data[controlKey] = null;
            }
            eventEmitter.emit(`data/${requestId}`, deviceData); // Emit for real-time API
        } catch (error) {
            // console.error(`Error updating ${deviceType} status or logging action:`, error);
        }
    }

    if (!data["data/led"]) {
        mqttClient.publish('control/led', null); // Initial request for LED data
    }
    if (!data["data/servo"]) {
        mqttClient.publish('control/servo', null); // Initial request for Servo data
    }

    console.log("Current Data:", data);
});

setInterval(async () => {
    if (data["data/sensor"]) {
        try {
            await Data_Sensor.create({
                temperature: data["data/sensor"].t,
                humidity: data["data/sensor"].h,
                light: data["data/sensor"].l,
            });
            console.log("Saved data sensor to DB");
        } catch (error) {
            console.error('Error saving data sensor to DB:', error);
        }
    }
}, 60000);

module.exports = { data, eventEmitter };
