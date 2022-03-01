import { Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { User } from "../User";
import { Servicing } from "./Servicing";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public brand: string;

  @Column()
  public model: string;

  @Column()
  public identification: string;

  @OneToMany(
    () => Servicing,
    (servicing) => servicing.vehicle
  )
  public servicings: Servicing[];

  @ManyToOne(
    () => User,
    (owner) => owner.vehicles
  )
  public owner: User;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
