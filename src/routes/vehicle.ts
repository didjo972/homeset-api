import {RequestHandler, Router} from 'express';
import {checkJwt} from '../middlewares/jwt';
import VehicleController from '../usescases/VehicleController';

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: API to manage your vehicles.
 */
const router = Router();

// Create or Update note
router.post(
  '/',
  [checkJwt],
  VehicleController.upsertVehicule as RequestHandler,
);

// Get all notes
router.get('/', [checkJwt], VehicleController.listAll as RequestHandler);

// Get one note
router.get(
  '/:id([0-9]+)',
  [checkJwt],
  VehicleController.getOneById as RequestHandler,
);

// Edit one note
router.patch(
  '/:id([0-9]+)',
  [checkJwt],
  VehicleController.editVehicle as RequestHandler,
);

// Delete one note
router.delete(
  '/:id([0-9]+)',
  [checkJwt],
  VehicleController.deleteVehicle as RequestHandler,
);

// Delete multiple notes
router.delete('/', [checkJwt], VehicleController.multiDelete as RequestHandler);

export default router;
