import {RequestHandler, Router} from 'express';
import {checkJwt} from '../middlewares/jwt';
import GroupController from '../usescases/GroupController';

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API to manage your groups.
 */
const router = Router();

/**
 * @swagger
 * path:
 * /groups:
 *    post:
 *      summary: Create or Edit a group
 *      tags: [Groups]
 *      security:
 *        - jwt: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Group'
 *      responses:
 *        "200":
 *          description: Create or Update was successful
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Group"
 *        "201":
 *          description: The created group
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Group"
 *        "400":
 *          description: Incorrect data format.
 *        "401":
 *          description: User not authenticated.
 */
// Create or Update group
router.post('/', [checkJwt], GroupController.upsertGroup as RequestHandler);

/**
 * @swagger
 * path:
 * /groups:
 *    get:
 *      summary: Get all groups
 *      tags: [Group]
 *      security:
 *        - jwt: []
 *      responses:
 *        "200":
 *          description: All the groups
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Group"
 */
// Get all groups
router.get('/', [checkJwt], GroupController.listAll as RequestHandler);

/**
 * @swagger
 * path:
 * /groups/{id}:
 *    get:
 *      summary: Get a group by id
 *      tags: [Groups]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The group id
 *      responses:
 *        "200":
 *          description: A group
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Group"
 *        "404":
 *          description: Group not found.
 */
// Get one group
router.get(
  '/:id([0-9]+)',
  [checkJwt],
  GroupController.getOneById as RequestHandler,
);

/**
 * @swagger
 * path:
 * /groups/{id}:
 *    patch:
 *      summary: Edit a group
 *      tags: [Groups]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The group id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Group'
 *      responses:
 *        "204":
 *          description: Update was successful
 *        "404":
 *          description: Group not found.
 */
// Edit one group
router.patch(
  '/:id([0-9]+)',
  [checkJwt],
  GroupController.editGroup as RequestHandler,
);

// Delete one group
router.delete(
  '/:id([0-9]+)',
  [checkJwt],
  GroupController.deleteGroup as RequestHandler,
);

// Delete multiple groups
router.delete('/', [checkJwt], GroupController.multiDelete as RequestHandler);

export default router;
