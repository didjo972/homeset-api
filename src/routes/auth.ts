import {RequestHandler, Router} from 'express';
import AuthController from '../controllers/AuthController';
import {checkJwt} from '../middlewares/jwt';

const router = Router();
// Login route
router.post('/login', AuthController.login as RequestHandler);

// Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword as RequestHandler);

export default router;
