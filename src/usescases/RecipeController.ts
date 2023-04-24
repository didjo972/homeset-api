import {NextFunction, Request, Response} from 'express';
import {User} from '../entity/user/User';
import Utils from './Utils';
import {
  IMultiDeleteRequest,
  ICookingRecipeRequest,
} from '../shared/api-request-interfaces';
import {CookingRecipe} from '../entity/cookingbook/CookingRecipe';
import {CookingRecipeRepository} from '../repositories/CookingRecipeRepository';
import {validate} from 'class-validator';
import {GroupRepository} from '../repositories/GroupRepository';
import {In} from 'typeorm';
import {toRecipeResponse} from '../transformers/transformers';

class CookingRecipeController {
  public static upsertRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Create or Update Recipe endpoint has been called with: ' +
          req.body.toString(),
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get parameters from the body
      const {id, name, description, preparationTime, nbPerson, recipe, groups} =
        req.body as ICookingRecipeRequest;

      if (id) {
        // Get the cooking recipes from database
        let recipeToUpdate: CookingRecipe;
        try {
          recipeToUpdate = await CookingRecipeRepository.getOneById(
            id,
            connectedUser.id,
          );
        } catch (error) {
          console.error(error);
          res.status(404).send('Recipe not found');
        }

        if (recipeToUpdate) {
          console.info('A recipe has been found: ' + recipeToUpdate.id);

          // Check if the user can edit this group
          if (
            !Utils.hasGrantAccess<CookingRecipe>(connectedUser, recipeToUpdate)
          ) {
            console.error(
              'The connected user has no grant access on this recipe.',
            );
            res.status(403).send();
            return;
          }

          // Validate the new values on model
          if (name) {
            recipeToUpdate.name = name;
          }

          if (description) {
            recipeToUpdate.description = description;
          }

          if (preparationTime) {
            recipeToUpdate.preparationTime = preparationTime;
          }

          if (nbPerson) {
            recipeToUpdate.nbPerson = nbPerson;
          }

          if (recipe) {
            recipeToUpdate.recipe = recipe;
          }

          if (groups !== undefined) {
            if (groups === null || groups.length <= 0) {
              recipeToUpdate.groups = null;
            } else {
              let groupsFound = null;
              try {
                groupsFound = await GroupRepository.findBy([
                  {
                    id: In(groups),
                    owner: {id: connectedUser.id},
                  },
                  {
                    id: In(groups),
                    users: {id: connectedUser.id},
                  },
                ]);
              } catch (error) {
                console.error(error);
                res.status(404).send('Groups not found');
                return;
              }
              recipeToUpdate.groups = groupsFound;
            }
          }

          const errors = await validate(recipeToUpdate);
          if (errors.length > 0) {
            res.status(400).send(errors);
            return;
          }
          try {
            await CookingRecipeRepository.save(recipeToUpdate);
          } catch (e) {
            console.error(e);
            res.status(400).send('Missing param');
            return;
          }
          res.status(200).send(toRecipeResponse(recipeToUpdate));
          return;
        }
      }

      const recipeToCreate = new CookingRecipe();
      recipeToCreate.name = name;
      recipeToCreate.description = description;
      recipeToCreate.preparationTime = preparationTime;
      recipeToCreate.nbPerson = nbPerson;
      recipeToCreate.recipe = recipe;
      if (groups !== undefined) {
        if (groups === null || groups.length <= 0) {
          recipeToCreate.groups = null;
        } else {
          let groupsFound = null;
          try {
            groupsFound = await GroupRepository.findBy([
              {
                id: In(groups),
                owner: {id: connectedUser.id},
              },
              {
                id: In(groups),
                users: {id: connectedUser.id},
              },
            ]);
          } catch (error) {
            console.error(error);
            res.status(404).send('Groups not found');
            return;
          }
          recipeToCreate.groups = groupsFound;
        }
      }
      recipeToCreate.owner = connectedUser;

      // Validade if the parameters are ok
      const errors = await validate(recipeToCreate);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      try {
        await CookingRecipeRepository.save(recipeToCreate);
      } catch (e) {
        console.error(e);
        res.status(400).send('Missing param');
        return;
      }

      // If all ok, send 201 response
      res.status(201).send(toRecipeResponse(recipeToCreate));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static editRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Edit Recipe endpoint has been called with: ' +
          req.body.toString() +
          ' and path param ' +
          req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get values from the body
      const {name, description, preparationTime, nbPerson, recipe, groups} =
        req.body as ICookingRecipeRequest;

      // Get the ID from the url
      const id = req.params.id;

      // Get the recipe from database
      let recipeFound: CookingRecipe;
      try {
        recipeFound = await CookingRecipeRepository.getOneById(
          id,
          connectedUser.id,
        );
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('Recipe not found');
        return;
      }

      console.info('A recipe has been found: ' + recipeFound.id);

      // Check if the user can edit this recipe
      if (!Utils.hasGrantAccess<CookingRecipe>(connectedUser, recipeFound)) {
        console.error('The connected user has no grant access on this recipe.');
        res.status(403).send();
        return;
      }

      // Validate the new values on model
      if (name && name.length > 3) {
        recipeFound.name = name;
      }

      if (description) {
        recipeFound.description = description;
      }

      if (preparationTime) {
        recipeFound.preparationTime = preparationTime;
      }

      if (nbPerson) {
        recipeFound.nbPerson = nbPerson;
      }

      if (recipe) {
        recipeFound.recipe = recipe;
      }

      if (groups !== undefined) {
        if (groups === null || groups.length <= 0) {
          recipeFound.groups = null;
        } else {
          let groupsFound = null;
          try {
            groupsFound = await GroupRepository.findBy([
              {
                id: In(groups),
                owner: {id: connectedUser.id},
              },
              {
                id: In(groups),
                users: {id: connectedUser.id},
              },
            ]);
          } catch (error) {
            console.error(error);
            res.status(404).send('Groups not found');
            return;
          }
          recipeFound.groups = groupsFound;
        }
      }

      const errors = await validate(recipeFound);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      await CookingRecipeRepository.save(recipeFound);
      res.status(200).send(toRecipeResponse(recipeFound));
    } catch (e) {
      next(e);
    }
  };

  public static listAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Get all Recipes endpoint has been called');

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get recipes from database
      try {
        const recipes = await CookingRecipeRepository.findAll(connectedUser.id);
        // Send the recipes object
        res.send(recipes.map(toRecipeResponse));
        return;
      } catch (e) {
        console.error(e);
        res.status(404).send('Not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };

  public static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Get one Recipe endpoint has been called with: ' +
          'path param ' +
          req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get the ID from the url
      const id: number = +req.params.id;

      // Get the recipes from database
      let recipeFound;
      try {
        recipeFound = await CookingRecipeRepository.getOneById(
          id,
          connectedUser.id,
        );
      } catch (error) {
        console.error(error);
        res.status(404).send('Recipe not found');
      }

      // Check if the user can edit this recipe
      if (!Utils.hasGrantAccess<CookingRecipe>(connectedUser, recipeFound)) {
        console.error('The connected user has no grant access on this recipe.');
        res.status(403).send();
        return;
      }

      res.send(toRecipeResponse(recipeFound));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static deleteRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Delete a Recipe endpoint has been called with: ' +
          'path param ' +
          req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get the ID from the url
      const id = req.params.id;

      let recipeFound: CookingRecipe;
      try {
        recipeFound = await CookingRecipeRepository.getOneById(
          id,
          connectedUser.id,
        );
      } catch (error) {
        res.status(404).send('Recipe not found');
        return;
      }

      // Check if the user can delete this recipe
      if (
        !Utils.hasGrantAccess<CookingRecipe>(connectedUser, recipeFound, true)
      ) {
        console.error('The connected user has no grant access on this recipe.');
        res.status(403).send();
        return;
      }

      await CookingRecipeRepository.softDelete(recipeFound.id);

      // After all send a 204 (no content, but accepted) response
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  public static multiDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Delete Recipes endpoint has been called');

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get values from the body
      const idsReq = req.body as IMultiDeleteRequest[];

      const ids = idsReq.map(item => item.id);

      // Get the recipes from database
      let recipesFound: CookingRecipe[];
      try {
        recipesFound = await CookingRecipeRepository.findBy([
          {
            id: In(ids),
            owner: {id: connectedUser.id},
          },
          {
            id: In(ids),
            groups: {users: {id: connectedUser.id}},
          },
        ]);
        // TODO Check if we should call hasGrantAccess
        await CookingRecipeRepository.softDelete(
          recipesFound.map(recipe => recipe.id),
        );
        res.status(204).send();
        return;
      } catch (error) {
        console.error(error);
        // If not found, send a 404 response
        res.status(404).send('Recipe not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };
}

export default CookingRecipeController;
