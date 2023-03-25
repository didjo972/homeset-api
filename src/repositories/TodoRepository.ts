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
      .select([
        'todo.id',
        'todo.name',
        'todo.updatedAt',
        'todo.status',
        'task.id',
        'task.description',
        'owner.id',
        'owner.email',
        'owner.username',
      ])
      .where('todo.id = :id', {id})
      .getOneOrFail();
  }

  public findAll(): Promise<Todo[]> {
    return this.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tasks', 'task')
      .leftJoinAndSelect('todo.owner', 'owner')
      .select([
        'todo.id',
        'todo.name',
        'todo.updatedAt',
        'todo.status',
        'task.id',
        'task.description',
        'owner.id',
        'owner.email',
        'owner.username',
      ])
      .getMany();
  }
}

export default TodoRepository;
