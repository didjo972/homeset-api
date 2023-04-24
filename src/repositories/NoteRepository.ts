import {Brackets} from 'typeorm';
import {UniqueIdentifierType} from './BaseRepository';
import {Note} from '../entity/notes/Note';
import {dataSource} from '../../ormconfig';

export const NoteRepository = dataSource.getRepository(Note).extend({
  getOneById(
    id: UniqueIdentifierType,
    idUser: UniqueIdentifierType,
  ): Promise<Note> {
    return this.createQueryBuilder('note')
      .leftJoinAndSelect('note.owner', 'owner')
      .leftJoinAndSelect('note.group', 'group')
      .leftJoin('group.users', 'users')
      .select([
        'note.id',
        'note.name',
        'note.data',
        'note.createdAt',
        'note.updatedAt',
        'owner.id',
        'owner.email',
        'owner.username',
        'group.id',
        'group.name',
      ])
      .where('note.id = :id', {id})
      .andWhere(
        new Brackets(qb => {
          qb.where('owner.id = :idUser', {idUser});
          qb.orWhere('users.id = :idUser', {idUser});
        }),
      )
      .getOneOrFail();
  },
  findAll(idUser: UniqueIdentifierType): Promise<Note[]> {
    return this.createQueryBuilder('note')
      .leftJoinAndSelect('note.owner', 'owner')
      .leftJoinAndSelect('note.group', 'group')
      .leftJoin('group.users', 'users')
      .select([
        'note.id',
        'note.name',
        'note.data',
        'note.createdAt',
        'note.updatedAt',
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
