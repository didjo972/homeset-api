import {RequestHandler, Router} from 'express';
import UnauthController from '../usescases/UnauthController';

/**
 * @swagger
 * tags:
 *   name: Unauth
 *   description: API available to unauthorized user.
 */
const router = Router();

/**
 * @swagger
 * path:
 * /public:
 *    get:
 *      summary: Hello world
 *      tags: [Unauth]
 *      responses:
 *        "200":
 *          description: Hello world
 */
// Get hello world
router.get('/', UnauthController.helloWorld as RequestHandler);

/**
 * @swagger
 * path:
 * /public/ping:
 *    get:
 *      summary: Ping
 *      tags: [Unauth]
 *      responses:
 *        "200":
 *          description: Ping
 */
// Ping
router.get('/ping', UnauthController.ping as RequestHandler);

/**
 * @swagger
 * path:
 * /public/createAccount:
 *    post:
 *      summary: Create a new account
 *      tags: [Unauth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/User"
 *
 *      responses:
 *        "201":
 *          description: The created account
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/User"
 */
// Create an account
router.post('/createAccount', UnauthController.newUser as RequestHandler);

/**
 * @swagger
 * path:
 * /public/resetPassword:
 *    post:
 *      summary: Reset the password
 *      tags: [Unauth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *      responses:
 *        "200":
 *          description: The request to reset the mail has been sent
 */
// Reset password
router.post('/resetPassword', UnauthController.resetPassword as RequestHandler);

export default router;
