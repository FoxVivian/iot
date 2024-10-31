import { Router } from 'express';
import realTimeApiController from '../controllers/RealTimeApiController.js';
import checkToken from '../controllers/middlewares/checkToken.js';

const router = Router();

router.get('/data/data_sensors', realTimeApiController.data_sensors);
router.get('/data/data_devices', realTimeApiController.data_devices);
router.post('/control/device', checkToken, realTimeApiController.control_device);

export default router;
