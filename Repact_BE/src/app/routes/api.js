import { Router } from 'express';
import apiController from '../controllers/ApiController.js';

const router = Router();

router.get('/test', apiController.test);
router.post('/login', apiController.login);
router.get('/data/users', apiController.users);
router.get('/data/devices', apiController.devices);
router.get('/data/sensors', apiController.sensors);
router.get('/data/data_sensors', apiController.data_sensors);
router.get('/data/data_devices', apiController.data_devices);

export default router;
