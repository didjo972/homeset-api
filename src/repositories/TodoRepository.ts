import {EntityRepository, getConnectionManager} from 'typeorm';
import {Todo} from '../entity/todolist/Todo';
import BaseRepository from './BaseRepository';

@EntityRepository(Todo)
class TodoRepository extends BaseRepository<Todo> {
  constructor() {
    super(Todo, getConnectionManager().get('default'));
  }

  public getOneById(id: string | number): Promise<Todo> {
    return this.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tasks', 'task')
      .leftJoinAndSelect('todo.owner', 'owner')
      .leftJoinAndSelect('todo.group', 'group')
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
      .getOneOrFail();
  }

  public findAll(id: string | number): Promise<Todo[]> {
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
      .where('owner.id = :id', {id})
      .orWhere('users.id = :id', {id})
      .getMany();
  }
}

export default TodoRepository;
