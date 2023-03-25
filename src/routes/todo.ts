import {Router} from 'express';
import TodoController from '../controllers/TodoController';
import {checkJwt, checkRole} from '../middlewares/jwt';

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: API to manage your todos.
 */
const router = Router();

/**
 * @swagger
 * path:
 * /todos:
 *    post:
 *      summary: Create a new account
 *      tags: [Todos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Todo"
 *
 *      responses:
 *        "201":
 *          description: The created todo
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Todo"
 */
// Create a todo
router.post('/', [checkJwt], TodoController.newTodo);

/**
 * @swagger
 * path:
 * /todos:
 *    get:
 *      summary: Get all todos
 *      tags: [Todos]
 *      security:
 *        - jwt: []
 *      responses:
 *        "200":
 *          description: All the todos
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Todo"
 */
// Get all todos
router.get('/', [checkJwt], TodoController.listAll);

/**
 * @swagger
 * path:
 * /todos/{id}:
 *    get:
 *      summary: Get a todo by id
 *      tags: [Todo]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The todo id
 *      responses:
 *        "200":
 *          description: A todo
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Todo"
 *        "404":
 *          description: Todo not found.
 */
// Get one todo
router.get('/:id([0-9]+)', [checkJwt], TodoController.getOneById);

/**
 * @swagger
 * path:
 * /todos/{id}:
 *    patch:
 *      summary: Edit a todo
 *      tags: [Todos]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The todo id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Todo'
 *      responses:
 *        "204":
 *          description: Update was successful
 *        "404":
 *          description: Todo not found.
 */
// Edit one todo
router.patch('/:id([0-9]+)', [checkJwt], TodoController.editTodo);

/**
 * @swagger
 * path:
 * /todos/{id}:
 *    delete:
 *      summary: Delete a todo by id
 *      tags: [Todos]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The todo id
 *      responses:
 *        "204":
 *          description: Delete was successful
 *        "404":
 *          description: Todo not found.
 */
// Delete one todo
router.delete('/:id([0-9]+)', [checkJwt], TodoController.deleteTodo);

export default router;
