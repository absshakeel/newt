import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getAllLocations, getLocationById, createLocation, updateLocation, deleteLocation } from '../controllers/location.controller';

const router: Router = Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.post('/', authenticate, authorize('admin'), createLocation);
router.put('/:id', authenticate, authorize('admin'), updateLocation);
router.delete('/:id', authenticate, authorize('admin'), deleteLocation);

export default router;
