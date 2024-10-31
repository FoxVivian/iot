// import User from '../models/User';  // Model User
// import Device from '../models/Device';  // Model Device
// import Sensor from '../models/Sensor';  // Model Sensor
// import Data_Sensor from '../models/Data_Sensor'; // Model Data Sensor
// import Data_Device from '../models/Data_Device'; // Model Data Device
// import jwt from 'jsonwebtoken';
import { Sequelize, Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { data, eventEmitter } from '../../services/mqttService.js';

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
            eventEmitter.emit('control', { _controlData, requestId });
    
            eventEmitter.once(`data/${requestId}`, (dataDevices) => {
                currentLedData = { ...dataDevices };  // Bản sao mới của dataDevices
                return res.status(200).json(currentLedData);
            });
        } else {
            return res.status(200).json(currentLedData);
        }
    }
}

export default new RealTimeApiController();
