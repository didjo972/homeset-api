import {Router} from 'express';
// import UserController from "../controllers/UserController";
import {checkJwt, checkRole} from '../middlewares/jwt';

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: API to manage your vehicles.
 */
const router = Router();

export default router;
