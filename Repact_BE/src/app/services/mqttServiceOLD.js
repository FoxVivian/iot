const Data_Sensor = require('../models/Data_Sensor');
const Data_Device = require('../models/Data_Device');
const checkToken = require('../middlewares/checkToken');
const Device = require('../models/Device');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const mqttClient = require('../../config/mqttOLD');

var data = {
    "data/sensor": null,
    "data/led": null,
    "control/led": null,
}

eventEmitter.on('control', ({ _controlData, requestId }) => {
    data["control/led"] = _controlData;
    let controlData = { ..._controlData, requestId };

    console.log("hehehe", JSON.stringify(controlData));
    mqttClient.publish('control/led', JSON.stringify(controlData));
});

mqttClient.on('message', async (topic, message) => {
    console.log(message.toString());
    const { requestId, ...messageData } = JSON.parse(message.toString());

    data[topic] = {
        ...data[topic],
        ...messageData,
    };

    if (topic === "data/led") {
        try {
            // Update device statuses in MongoDB
            await Promise.all(Object.keys(data['data/led']).map(async (id) => {
                await Device.findByIdAndUpdate(id, { status: data['data/led'][id] });
            }));

            // Log control actions in Data_Device
            if (data['control/led']) {
                await Promise.all(Object.keys(data['control/led']).map(async (key) => {
                    await Data_Device.create({
                        device_id: key, // Device ID
                        action: data['control/led'][key], // Corresponding action
                        user_id: 1
                    });
                }));
                data['control/led'] = null;
            }
            eventEmitter.emit(`data/${requestId}`, data['data/led']); // Emit for real-time API
        } catch (error) {
            console.error('Error updating device status or logging action:', error);
        }
    }

    if (!data["data/led"]) {
        mqttClient.publish('control/led', null); // Initial request for LED data
    }

    console.log(data);
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
