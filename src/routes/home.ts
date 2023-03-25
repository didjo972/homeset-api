import {Router} from 'express';
// import UserController from "../controllers/UserController";
import {checkJwt, checkRole} from '../middlewares/jwt';

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: API to manage your home.
 */
const router = Router();

export default router;
