import {Connection, ObjectType, Repository} from 'typeorm';

class BaseRepository<T> extends Repository<T> {
  private connection: Connection;
  private entity: ObjectType<T>;

  constructor(entity: ObjectType<T>, connection: Connection) {
    super();
    this.entity = entity;
    this.connection = connection;
    Object.assign(this, {
      manager: connection.manager,
      metadata: connection.getMetadata(entity),
      queryRunner: connection.manager.queryRunner,
    });
  }
}

export default BaseRepository;
