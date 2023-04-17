import {RequestHandler, Router} from 'express';
import NoteController from '../controllers/NoteController';
import {checkJwt} from '../middlewares/jwt';

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API to manage your notes.
 */
const router = Router();

/**
 * @swagger
 * path:
 * /notes:
 *    post:
 *      summary: Create or Edit a note
 *      tags: [Notes]
 *      security:
 *        - jwt: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Note'
 *      responses:
 *        "200":
 *          description: Create or Update was successful
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Note"
 *        "201":
 *          description: The created note
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Note"
 *        "400":
 *          description: Incorrect data format.
 *        "401":
 *          description: User not authenticated.
 */
// Create or Update note
router.post('/', [checkJwt], NoteController.upsertNote as RequestHandler);

/**
 * @swagger
 * path:
 * /notes:
 *    get:
 *      summary: Get all notes
 *      tags: [Notes]
 *      security:
 *        - jwt: []
 *      responses:
 *        "200":
 *          description: All the notes
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Note"
 */
// Get all notes
router.get('/', [checkJwt], NoteController.listAll as RequestHandler);

/**
 * @swagger
 * path:
 * /notes/{id}:
 *    get:
 *      summary: Get a note by id
 *      tags: [Notes]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The note id
 *      responses:
 *        "200":
 *          description: A note
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Note"
 *        "404":
 *          description: Note not found.
 */
// Get one note
router.get(
  '/:id([0-9]+)',
  [checkJwt],
  NoteController.getOneById as RequestHandler,
);

/**
 * @swagger
 * path:
 * /notes/{id}:
 *    patch:
 *      summary: Edit a note
 *      tags: [Notes]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The note id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Note'
 *      responses:
 *        "204":
 *          description: Update was successful
 *        "404":
 *          description: Note not found.
 */
// Edit one note
router.patch(
  '/:id([0-9]+)',
  [checkJwt],
  NoteController.editNote as RequestHandler,
);

/**
 * @swagger
 * path:
 * /notes/{id}:
 *    delete:
 *      summary: Delete a note by id
 *      tags: [Notes]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: number
 *          required: true
 *          description: The note id
 *      responses:
 *        "204":
 *          description: Delete was successful
 *        "404":
 *          description: Note not found.
 */
// Delete one note
router.delete(
  '/:id([0-9]+)',
  [checkJwt],
  NoteController.deleteNote as RequestHandler,
);

export default router;
