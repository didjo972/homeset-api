import {Brackets} from 'typeorm';
import {dataSource} from '../../ormconfig';
import {CookingRecipe} from '../entity/cookingbook/CookingRecipe';
import {UniqueIdentifierType} from './BaseRepository';

export const CookingRecipeRepository = dataSource
  .getRepository(CookingRecipe)
  .extend({
    getOneById(
      id: UniqueIdentifierType,
      idUser: UniqueIdentifierType,
    ): CookingRecipe {
      return this.createQueryBuilder('cookingRecipe')
        .leftJoinAndSelect('cookingRecipe.owner', 'owner')
        .leftJoinAndSelect('cookingRecipe.groups', 'group')
        .leftJoin('group.users', 'users')
        .select([
          'cookingRecipe.id',
          'cookingRecipe.name',
          'cookingRecipe.description',
          'cookingRecipe.preparationTime',
          'cookingRecipe.nbPerson',
          'cookingRecipe.recipe',
          'cookingRecipe.createdAt',
          'cookingRecipe.updatedAt',
          'owner.id',
          'owner.email',
          'owner.username',
          'group.id',
          'group.name',
        ])
        .where('cookingRecipe.id = :id', {id})
        .andWhere(
          new Brackets(qb => {
            qb.where('owner.id = :idUser', {idUser});
            qb.orWhere('users.id = :idUser', {idUser});
          }),
        )
        .getOneOrFail();
    },
    findAll(idUser: UniqueIdentifierType): CookingRecipe[] {
      return this.createQueryBuilder('cookingRecipe')
        .leftJoinAndSelect('cookingRecipe.owner', 'owner')
        .leftJoinAndSelect('cookingRecipe.groups', 'group')
        .leftJoin('group.users', 'users')
        .select([
          'cookingRecipe.id',
          'cookingRecipe.name',
          'cookingRecipe.description',
          'cookingRecipe.preparationTime',
          'cookingRecipe.nbPerson',
          'cookingRecipe.recipe',
          'cookingRecipe.createdAt',
          'cookingRecipe.updatedAt',
          'owner.id',
          'owner.email',
          'owner.username',
          'group.id',
          'group.name',
        ])
        .where('owner.id = :idUser', {idUser})
        .orWhere('users.id = :idUser', {idUser})
        .orderBy('note.updatedAt', 'DESC')
        .getMany();
    },
  });
