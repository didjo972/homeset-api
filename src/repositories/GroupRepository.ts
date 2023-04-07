import {EntityRepository, getConnectionManager} from 'typeorm';
import {Group} from '../entity/user/Group';
import BaseRepository from './BaseRepository';

@EntityRepository(Group)
class GroupRepository extends BaseRepository<Group> {
  constructor() {
    super(Group, getConnectionManager().get('default'));
  }

  public getOneById(id: string | number): Promise<Group> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.users', 'users')
      .select(['group.id', 'group.name', 'owner.id', 'users.id'])
      .where('group.id = :id', {id})
      .getOneOrFail();
  }

  public findAll(id: string | number): Promise<Group[]> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.users', 'users')
      .select([
        'group.id',
        'group.name',
        'owner.id',
        'owner.email',
        'owner.phone',
        'owner.role',
        'users.id',
        'users.username',
      ])
      .where('owner.id = :id', {id})
      .orWhere('users.id = :id', {id})
      .getMany();
  }
}

export default GroupRepository;
