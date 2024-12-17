import { Router } from 'express';
import { getAddressCoordinates, getDistanceTime, getAutoSuggestions} from '../controllers/maps.controller';
import {userAuth} from '../middleware/auth';

const router = Router();

router.get('/getAddressCoordinates',userAuth, getAddressCoordinates);
router.get('/getDistanceTime',userAuth, getDistanceTime );
router.get('/getAutoSuggestions',userAuth, getAutoSuggestions );

export default router;