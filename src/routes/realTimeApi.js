var router = require('express').Router();

const realTimeApiController = require('../app/controllers/RealTimeApiController');
const checkToken = require('../app/middlewares/checkToken');

router.get('/data/data_sensors', realTimeApiController.data_sensors);
router.get('/data/data_devices', realTimeApiController.data_devices);
router.post('/control/device', checkToken, realTimeApiController.control_device);

module.exports = router;