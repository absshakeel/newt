import { Router } from 'express';
import {
  getAllDestinations,
  getDestinationById,
  searchDestinations,
  getDestinationFilters,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destination.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router: Router = Router();

router.get('/', getAllDestinations);
router.get('/search', searchDestinations);
router.get('/filters', getDestinationFilters);
router.get('/:id', getDestinationById);
router.post('/', authenticate, authorize('admin'), createDestination);
router.put('/:id', authenticate, authorize('admin'), updateDestination);
router.delete('/:id', authenticate, authorize('admin'), deleteDestination);

export default router;