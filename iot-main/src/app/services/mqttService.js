const Data_Sensor = require('../models/Data_Sensor');
const Data_Device = require('../models/Data_Device');
const Device = require('../models/Device');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const mqttClient = require('../../config/mqtt');
var data = {
    "data/sensor": null,
    "data/led": null,
    "control/led": null,
};

eventEmitter.on('control', ({ _controlData, requestId }) => {
    data["control/led"] = _controlData;
    let controlData = {};

    Object.keys(_controlData).forEach((key) => {
        controlData[key] = _controlData[key];
    });
    controlData["requestId"] = requestId;

    console.log("Sending control data:", JSON.stringify(controlData));
    mqttClient.publish('control/led', JSON.stringify(controlData));
});

mqttClient.on('message', (topic, message) => {
    console.log("Received message:", message.toString());
    const { requestId, ...messageData } = JSON.parse(message.toString());

    data[topic] = {
        ...data[topic],
        ...messageData,
    };

    if (topic === "data/led") {
        // Update device statuses
        Object.keys(data['data/led']).forEach((id) => {
            Device.update({ status: data['data/led'][id] }, { where: { id: id } });
        });

        // Save control actions to Data_Device and reset control data
        if (data['control/led']) {
            Object.keys(data['control/led']).forEach((key) => {
                Data_Device.create({
                    device_id: key,
                    action: data['control/led'][key],
                    user_id: 1,
                });
            });
            data['control/led'] = null;
        }

        // Emit data back to RealTimeApiController
        if (requestId) {
            eventEmitter.emit(`data/${requestId}`, data['data/led']);
        }
    }

    // Initialize `data/led` if null
    if (!data["data/led"]) {
        mqttClient.publish('control/led', null);
    }

    console.log("Current data state:", data);
});

setInterval(() => {
    if (data["data/sensor"]) {
        Data_Sensor.create({
            temperature: data["data/sensor"].t,
            humidity: data["data/sensor"].h,
            light: data["data/sensor"].l,
        });
        console.log("Saved sensor data to DB");
    }
}, 60000);

module.exports = { data, eventEmitter };
