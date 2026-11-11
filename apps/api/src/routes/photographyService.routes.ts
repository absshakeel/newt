import { Router } from 'express';
import { getAllServices, getServiceById, createPhotographyService, updatePhotographyService, deletePhotographyService } from '../controllers/photographyService.controller';

const router: Router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', createPhotographyService);
router.put('/:id', updatePhotographyService);
router.delete('/:id', deletePhotographyService);

export default router;