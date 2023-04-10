import {Brackets, EntityRepository, getConnectionManager} from 'typeorm';
import {Group} from '../entity/user/Group';
import BaseRepository, {UniqueIdentifierType} from './BaseRepository';

@EntityRepository(Group)
class GroupRepository extends BaseRepository<Group> {
  constructor() {
    super(Group, getConnectionManager().get('default'));
  }

  public getOneById(
    id: UniqueIdentifierType,
    idUser: UniqueIdentifierType,
  ): Promise<Group> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.users', 'users')
      .leftJoin('group.users', 'user')
      .select([
        'group.id',
        'group.name',
        'owner.id',
        'owner.username',
        'users.id',
        'users.username',
      ])
      .where('group.id = :id', {id})
      .andWhere(
        new Brackets(qb => {
          qb.where('user.id = :idUser', {idUser});
          qb.orWhere('owner.id = :idUser', {idUser});
        }),
      )
      .getOneOrFail();
  }

  public findAll(idUser: string | number): Promise<Group[]> {
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
      .where('owner.id = :idUser', {idUser})
      .orWhere('users.id = :idUser', {idUser})
      .addOrderBy('group.name', 'DESC')
      .getMany();
  }
}

export default GroupRepository;
