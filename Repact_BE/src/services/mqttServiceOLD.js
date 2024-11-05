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
};

eventEmitter.on('control', ({ _controlData, requestId }) => {
    data["control/led"] = _controlData;
    let controlData = {};

    Object.keys(_controlData).forEach((key) => {
        controlData[key] = _controlData[key]; // lưu controlData vào bản sao
    });
    controlData["requestId"] = requestId;

    console.log("hehehe", JSON.stringify(controlData));
    mqttClient.publish('control/led', JSON.stringify(controlData));
});

mqttClient.on('message', (topic, message) => {
    console.log(message.toString());
    const { requestId, ...messageData } = JSON.parse(message.toString());

    data[topic] = {
        ...data[topic],
        ...messageData,
    };

    if (topic === "data/led") {
        Object.keys(data['data/led']).forEach((id) => { // Lưu trạng thái devices
            Device.update({
                status: data['data/led'][id],
            },
            { where: { id: id } });
        });

        if (data['control/led']) {
            Object.keys(data['control/led']).forEach((key) => {
                Data_Device.create({
                    device_id: key, // id của thiết bị
                    action: data['control/led'][key], // action tương ứng với id
                    user_id: 1
                });
            });
            data['control/led'] = null;
        }
        eventEmitter.emit(`data/${requestId}`, data['data/led']); // truyền sang kênh data cho realtimeAPI 
    }

    if (!data["data/led"]) {
        mqttClient.publish('control/led', null); // gọi để lấy led data ban đầu 
    }

    console.log(data);
});

setInterval(() => {
    if (data["data/sensor"]) {
        Data_Sensor.create({
            temperature: data["data/sensor"].t,
            humidity: data["data/sensor"].h,
            light: data["data/sensor"].l,
        });
        console.log("saved data sensor to DB");
    }
}, 60000);

export { data, eventEmitter };
