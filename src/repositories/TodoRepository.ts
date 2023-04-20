import {Brackets} from 'typeorm';
import {Todo} from '../entity/todolist/Todo';
import {UniqueIdentifierType} from './BaseRepository';
import {dataSource} from '../../ormconfig';

export const TodoRepository = dataSource.getRepository(Todo).extend({
  getOneById(id: UniqueIdentifierType, idUser: UniqueIdentifierType): Todo {
    return this.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tasks', 'task')
      .leftJoinAndSelect('todo.owner', 'owner')
      .leftJoinAndSelect('todo.group', 'group')
      .leftJoin('group.users', 'users')
      .select([
        'todo.id',
        'todo.name',
        'todo.createdAt',
        'todo.updatedAt',
        'todo.status',
        'task.id',
        'task.description',
        'task.status',
        'owner.id',
        'owner.email',
        'owner.username',
        'group.id',
        'group.name',
      ])
      .where('todo.id = :id', {id})
      .andWhere(
        new Brackets(qb => {
          qb.where('owner.id = :idUser', {idUser});
          qb.orWhere('users.id = :idUser', {idUser});
        }),
      )
      .addOrderBy('task.status', 'ASC')
      .getOneOrFail();
  },
  findAll(idUser: UniqueIdentifierType): Todo[] {
    return this.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tasks', 'task')
      .leftJoinAndSelect('todo.owner', 'owner')
      .leftJoinAndSelect('todo.group', 'group')
      .leftJoin('group.users', 'users')
      .select([
        'todo.id',
        'todo.name',
        'todo.createdAt',
        'todo.updatedAt',
        'todo.status',
        'task.id',
        'task.description',
        'task.status',
        'owner.id',
        'owner.email',
        'owner.username',
        'group.id',
        'group.name',
      ])
      .where('owner.id = :idUser', {idUser})
      .orWhere('users.id = :idUser', {idUser})
      .orderBy('todo.updatedAt', 'DESC')
      .addOrderBy('task.status', 'ASC')
      .getMany();
  },
});
