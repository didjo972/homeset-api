import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {User} from '../User';
import {Task} from './Task';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public status: boolean;

  @OneToMany(() => Task, task => task.todo, {
    cascade: true,
  })
  public tasks: Task[];

  @ManyToOne(() => User, owner => owner.todos)
  public owner: User;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
