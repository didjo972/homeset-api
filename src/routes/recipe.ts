import {RequestHandler, Router} from 'express';
import {checkJwt} from '../middlewares/jwt';
import CookingRecipeController from '../usescases/RecipeController';

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API to manage your recipes.
 */
const router = Router();

// Create or Update note
router.post(
  '/',
  [checkJwt],
  CookingRecipeController.upsertRecipe as RequestHandler,
);

// Get all notes
router.get('/', [checkJwt], CookingRecipeController.listAll as RequestHandler);

// Get one note
router.get(
  '/:id([0-9]+)',
  [checkJwt],
  CookingRecipeController.getOneById as RequestHandler,
);

// Edit one note
router.patch(
  '/:id([0-9]+)',
  [checkJwt],
  CookingRecipeController.editRecipe as RequestHandler,
);

// Delete one note
router.delete(
  '/:id([0-9]+)',
  [checkJwt],
  CookingRecipeController.deleteRecipe as RequestHandler,
);

// Delete multiple notes
router.delete(
  '/',
  [checkJwt],
  CookingRecipeController.multiDelete as RequestHandler,
);

export default router;
