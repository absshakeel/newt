import { Router } from 'express';
import { getAllHotels, getHotelById, searchHotels, createHotel, updateHotel, deleteHotel } from '../controllers/hotel.controller';

const router: Router = Router();

router.get('/', getAllHotels);
router.get('/search', searchHotels);
router.get('/:id', getHotelById);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);

export default router;