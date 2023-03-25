import {Router} from 'express';
// import UserController from "../controllers/UserController";
import {checkJwt, checkRole} from '../middlewares/jwt';

/**
 * @swagger
 * tags:
 *   name: Receips
 *   description: API to manage your receips.
 */
const router = Router();

export default router;
