// const User = require('../models/User');  // Model User
// const Device = require('../models/Device');  // Model Device
// const Sensor = require('../models/Sensor');  // Model Sensor
// const Data_Sensor = require('../models/Data_Sensor'); // Model Data Sensor
// const Data_Device = require('../models/Data_Device'); // Model Data Device
// const jwt = require('jsonwebtoken');
// const { Sequelize, Op } = require('sequelize'); // Model
const { v4: uuidv4 } = require('uuid');
const { data, eventEmitter } = require('../services/mqttServiceOLD');

class RealTimeApiController {
    // [GET] /api/data/data_sensors
    data_sensors(req, res, next) {
        return res.status(200).json(data["data/sensor"]);
    }

    data_devices(req, res, next) {
        return res.status(200).json({
            led: data["data/led"],
            servo: data["data/servo"]
        });
    }

    // [POST] /api/control/data_sensors
    async control_device(req, res, next) {
        const controlData = req.body;
        let _controlData = {};
        let currentLedData = { ...data["data/led"] };
        let currentServoData = { ...data["data/servo"] };
        const requestId = uuidv4(); // Generate a unique ID for each request
    
        // Check for LED control data
        Object.keys(controlData.led || {}).forEach((key) => {
            if (controlData.led[key] !== currentLedData[key] && currentLedData[key] !== undefined) {
                _controlData[`led/${key}`] = controlData.led[key];
            }
        });

        // Check for Servo control data
        Object.keys(controlData.servo || {}).forEach((key) => {
            if (controlData.servo[key] !== currentServoData[key] && currentServoData[key] !== undefined) {
                _controlData[`servo/${key}`] = controlData.servo[key];
            }
        });
    
        if (Object.keys(_controlData).length > 0) {
            eventEmitter.emit('control', { _controlData, requestId });
    
            eventEmitter.once(`data/${requestId}`, (dataDevices) => {
                currentLedData = { ...dataDevices.led };  // New copy of LED data
                currentServoData = { ...dataDevices.servo };  // New copy of Servo data
                return res.status(200).json({
                    led: currentLedData,
                    servo: currentServoData
                });
            });
        } 
        else {
            return res.status(200).json({
                led: currentLedData,
                servo: currentServoData
            });
        }
    }
}

module.exports = new RealTimeApiController();
