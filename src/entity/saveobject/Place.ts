import {Length} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {User} from '../User';
import {Item} from './Item';

@Entity()
@Unique(['name'])
export class Place {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Length(4, 20)
  public name: string;

  @Column()
  public description: string;

  @OneToMany(() => Item, item => item.place)
  public item: Item[];

  @ManyToOne(() => User, owner => owner.places)
  public owner: User;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
