import { Router } from 'express';
import { getRoomsByHotel, getRoomById, createRoom, updateRoom, deleteRoom, getRoomAvailability, createRoomAvailability } from '../controllers/room.controller';

const router: Router = Router();

router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.get('/:id/availability', getRoomAvailability);
router.post('/:id/availability', createRoomAvailability);

export default router;