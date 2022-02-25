import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import { Ingredient } from "./Ingredient";

@Entity()
@Unique(["name"])
export class Element {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.element)
    public ingredient: Ingredient;

    @Column()
    public amount: number;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
