const { v4: uuidv4 } = require('uuid');
const { data, eventEmitter } = require('../services/mqttService');

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
        const requestId = uuidv4(); // Generate a unique request ID

        Object.keys(controlData).forEach((key) => {
            if (controlData[key] !== currentLedData[key] && currentLedData[key] !== undefined) {
                _controlData[key] = controlData[key];
            }
        });

        if (Object.keys(_controlData).length > 0) {
            // Emit control event with data and request ID
            eventEmitter.emit('control', { _controlData, requestId });

            // Define the response handler
            const handleResponse = (dataDevices) => {
                if (!res.headersSent) {
                    currentLedData = { ...dataDevices };
                    res.status(200).json(currentLedData);
                }
                // Remove listener after the response
                eventEmitter.off(`data/${requestId}`, handleResponse);
            };

            // Register a one-time listener with handleResponse
            eventEmitter.once(`data/${requestId}`, handleResponse);
        } else {
            return res.status(200).json(currentLedData);
        }
    }
}

module.exports = new RealTimeApiController();
