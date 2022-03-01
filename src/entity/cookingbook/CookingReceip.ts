import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { User } from "../User";
import { Element } from "./Element";

@Entity()
@Unique(["name"])
export class CookingReceip {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public nbPersonne: number;

  @ManyToMany(() => Element)
  @JoinTable()
  public elements: Element[];

  @ManyToOne(
    () => User,
    (owner) => owner.cookingReceips
  )
  public owner: User;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
