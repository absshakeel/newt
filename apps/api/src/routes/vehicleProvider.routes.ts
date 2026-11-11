import { Router } from 'express';
import { getAllProviders, getProviderById, createVehicleProvider, updateVehicleProvider, deleteVehicleProvider } from '../controllers/vehicleProvider.controller';

const router: Router = Router();

router.get('/', getAllProviders);
router.get('/:id', getProviderById);
router.post('/', createVehicleProvider);
router.put('/:id', updateVehicleProvider);
router.delete('/:id', deleteVehicleProvider);

export default router;