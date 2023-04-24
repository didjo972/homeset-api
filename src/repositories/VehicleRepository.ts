import {Vehicle} from '../entity/garage/Vehicle';
import {dataSource} from '../../ormconfig';
import {UniqueIdentifierType} from './BaseRepository';
import {Brackets} from 'typeorm';

export const VehicleRepository = dataSource.getRepository(Vehicle).extend({
  getOneById(
    id: UniqueIdentifierType,
    idUser: UniqueIdentifierType,
  ): Promise<Vehicle> {
    return this.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner')
      .leftJoinAndSelect('vehicle.servicings', 'servicings')
      .leftJoinAndSelect('servicings.acts', 'acts')
      .leftJoinAndSelect('vehicle.group', 'group')
      .leftJoin('group.users', 'users')
      .select([
        'vehicle.id',
        'vehicle.brand',
        'vehicle.model',
        'vehicle.identification',
        'servicings.id',
        'servicings.kilometer',
        'servicings.createdAt',
        'servicings.updatedAt',
        'acts.id',
        'acts.description',
        'acts.comment',
        'owner.id',
        'owner.username',
        'group.id',
        'group.name',
      ])
      .where('vehicle.id = :id', {id})
      .andWhere(
        new Brackets(qb => {
          qb.where('owner.id = :idUser', {idUser});
          qb.orWhere('users.id = :idUser', {idUser});
        }),
      )
      .getOneOrFail();
  },
  findAll(idUser: string | number): Promise<Vehicle[]> {
    return this.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner')
      .leftJoinAndSelect('vehicle.servicings', 'servicings')
      .leftJoinAndSelect('vehicle.group', 'group')
      .leftJoin('group.users', 'users')
      .select([
        'vehicle.id',
        'vehicle.brand',
        'vehicle.model',
        'vehicle.identification',
        'servicings.id',
        'servicings.kilometer',
        'servicings.createdAt',
        'servicings.updatedAt',
        'owner.id',
        'owner.username',
        'group.id',
        'group.name',
      ])
      .where('owner.id = :idUser', {idUser})
      .orWhere('users.id = :idUser', {idUser})
      .orderBy('vehicle.updatedAt', 'DESC')
      .getMany();
  },
});
