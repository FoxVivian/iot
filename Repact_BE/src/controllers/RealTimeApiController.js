// const User = require('../models/User');  // Model User
// const Device = require('../models/Device');  // Model Device
// const Sensor = require('../models/Sensor');  // Model Sensor
// const Data_Sensor = require('../models/Data_Sensor'); // Model Data Sensor
// const Data_Device = require('../models/Data_Device'); // Model Data Device
// const jwt = require('jsonwebtoken');
// const { Sequelize, Op } = require('sequelize'); // Model
const { v4: uuidv4 } = require('uuid');
const { data, eventEmitter } = require('../app/services/mqttService');
class RealTimeApiController {
    // [GET] /api/data/data_sensors
    data_sensors(req, res, next) {
        return res.status(200).json(data["data/sensor"]);
    }

    data_devices(req, res, next) {
        return res.status(200).json(data["data/led"]);
    }

    // [POST] /api/control/data_sensors
    async control_device(req, res, next) {
        const controlData = req.body;
        let _controlData = {};
        let currentLedData = { ...data["data/led"] };
        const requestId = uuidv4(); // Tạo ID duy nhất cho mỗi request
    
        Object.keys(controlData).forEach((key) => {
            if (controlData[key] !== currentLedData[key] && currentLedData[key] !== undefined) {
                _controlData[key] = controlData[key];
            }
        });
    
        if (Object.keys(_controlData).length > 0) {
            eventEmitter.emit('control', { _controlData, requestId});
    
            eventEmitter.once(`data/${requestId}`, (dataDevices) => {
                currentLedData = { ...dataDevices };  // Bản sao mới của dataDevices
                return res.status(200).json(currentLedData);
            });
        } 
        else {
            return res.status(200).json(currentLedData);
        }
    }
}

module.exports = new RealTimeApiController();