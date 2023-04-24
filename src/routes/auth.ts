import {RequestHandler, Router} from 'express';
import AuthController from '../usescases/AuthController';
import {checkJwt} from '../middlewares/jwt';

const router = Router();
// Login route
router.post('/login', AuthController.login as RequestHandler<any>);

// Change my password
router.post(
  '/change-password',
  [checkJwt],
  AuthController.changePassword as RequestHandler<any>,
);

export default router;
