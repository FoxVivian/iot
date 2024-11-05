// import Data_Sensor from '../../models/Data_Sensor.js';
import Data_Sensor from '../app/models/Data_Sensor.js';
import Data_Device from '../app/models/Data_Device.js';
// import checkToken from '../controllers/middlewares/checkToken.js';
import checkToken from '../app/controllers/middlewares/checkToken.js';
import Device from '../app/models/Device.js';

import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

import mqttClient from '../config/mqtt.js';

const data = {
    "data/sensor": null,
    "data/led": null,
    "control/led": null,
    "data/servo": null,
    "control/servo": null,
};

eventEmitter.on('control', ({ _controlData, requestId }) => {
    // Separate control data for LEDs and Servos
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

mqttClient.on('message', (topic, message) => {
    console.log("Message received on topic:", topic);
    const { requestId, ...messageData } = JSON.parse(message.toString());

    data[topic] = {
        ...data[topic],
        ...messageData,
    };

    if (topic === "data/led" || topic === "data/servo") {
        const deviceType = topic === "data/led" ? "LED" : "Servo";

        Object.keys(data[topic]).forEach((id) => {
            Device.update({
                status: data[topic][id],
            },
            { where: { id: id } });
        });

        const controlKey = topic === "data/led" ? "control/led" : "control/servo";
        if (data[controlKey]) {
            Object.keys(data[controlKey]).forEach((key) => {
                Data_Device.create({
                    device_id: key,
                    action: data[controlKey][key],
                    user_id: 1
                });
            });
            data[controlKey] = null;
        }
        eventEmitter.emit(`data/${requestId}`, data[topic]);
    }

    if (!data["data/led"]) {
        mqttClient.publish('control/led', null);
    }
    if (!data["data/servo"]) {
        mqttClient.publish('control/servo', null);
    }

    console.log("Current Data:", data);
});

setInterval(() => {
    if (data["data/sensor"]) {
        Data_Sensor.create({
            temperature: data["data/sensor"].t,
            humidity: data["data/sensor"].h,
            light: data["data/sensor"].l,
        });
        console.log("Saved data sensor to DB");
    }
}, 60000);

export { data, eventEmitter };
