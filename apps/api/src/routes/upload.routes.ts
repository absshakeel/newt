import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/upload.middleware';
import { uploadSingleImage } from '../controllers/upload.controller';

const router: Router = Router();

router.post('/image', authenticate, uploadImage.single('file'), uploadSingleImage);

export default router;
