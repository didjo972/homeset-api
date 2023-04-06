import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }
}

export default AbstractEntity;
