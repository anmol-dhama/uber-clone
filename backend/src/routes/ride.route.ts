import { Router } from 'express';
import {rideCreate,calculateFare,confirmRide,startRide,endRide} from '../controllers/ride.controller';
import {captainAuth, userAuth} from '../middleware/auth';

const router = Router();

router.post('/rideCreate',userAuth, rideCreate);
router.post('/calculateFare',userAuth, calculateFare);
router.post('/confirmRide',captainAuth, confirmRide );
router.get('/start-ride',captainAuth, startRide );
router.post('/end-ride',captainAuth, endRide );

export default router;