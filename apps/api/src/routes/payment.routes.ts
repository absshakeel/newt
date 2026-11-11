import { Router } from 'express';
import { getPaymentByBooking, createPayment, updatePayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = Router();

router.get('/booking/:bookingId', authenticate, getPaymentByBooking);
router.post('/', authenticate, createPayment);
router.put('/booking/:bookingId', authenticate, updatePayment);

export default router;