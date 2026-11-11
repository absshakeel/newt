import { Router } from 'express';
import { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, getVehicleAvailability, createVehicleAvailability } from '../controllers/vehicle.controller';

const router: Router = Router();

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.get('/:id/availability', getVehicleAvailability);
router.post('/:id/availability', createVehicleAvailability);

export default router;