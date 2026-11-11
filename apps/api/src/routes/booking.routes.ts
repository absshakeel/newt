import { Router } from 'express';
import { createBooking, getBookingById, getUserBookings, updateBooking, cancelBooking } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = Router();

router.post('/', authenticate, createBooking);
router.get('/user', authenticate, getUserBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', authenticate, updateBooking);
router.delete('/:id', authenticate, cancelBooking);

export default router;