
import { Router } from 'express';
import { register, login, logout, getProfile} from '../controllers/captain.controller';
import {captainAuth} from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',captainAuth, logout);
router.get('/getProfile',captainAuth, getProfile);

export default router;
