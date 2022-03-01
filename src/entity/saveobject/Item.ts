import { Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { User } from "../User";
import { Place } from "./Place";

@Entity()
@Unique(["name"])
export class Item {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Length(4, 20)
  public name: string;

  @Column()
  public description: string;

  @ManyToOne(
    () => Place,
    (place) => place.item
  )
  public place: Place;

  @ManyToOne(
    () => User,
    (owner) => owner.items
  )
  public owner: User;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
