
import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/user.controller';
import {userAuth} from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout',userAuth, logout);
router.get('/getProfile',userAuth, getProfile);

export default router;
