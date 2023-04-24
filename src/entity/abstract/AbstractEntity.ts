import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @DeleteDateColumn({name: 'deleted_at', nullable: true})
  public deletedAt?: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }
}

export default AbstractEntity;
