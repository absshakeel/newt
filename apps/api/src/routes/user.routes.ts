import { Router } from 'express';
import { getAllUsers, getUserById, deleteUser, updateUserStatus } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router: Router = Router();

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.patch('/:id/status', authenticate, authorize('admin'), updateUserStatus);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;