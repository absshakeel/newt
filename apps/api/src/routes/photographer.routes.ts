import { Router } from 'express';
import { getAllPhotographers, getPhotographerById, createPhotographer, updatePhotographer, deletePhotographer } from '../controllers/photographer.controller';

const router: Router = Router();

router.get('/', getAllPhotographers);
router.get('/:id', getPhotographerById);
router.post('/', createPhotographer);
router.put('/:id', updatePhotographer);
router.delete('/:id', deletePhotographer);

export default router;