import {Brackets, EntityRepository, getConnectionManager} from 'typeorm';
import {Todo} from '../entity/todolist/Todo';
import BaseRepository, {UniqueIdentifierType} from './BaseRepository';

@EntityRepository(Todo)
class TodoRepository extends BaseRepository<Todo> {
  constructor() {
    super(Todo, getConnectionManager().get('default'));
  }

  public getOneById(
    id: UniqueIdentifierType,
    idUser: UniqueIdentifierType,
  ): Promise<Todo> {
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
  }

  public findAll(idUser: UniqueIdentifierType): Promise<Todo[]> {
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
  }
}

export default TodoRepository;
