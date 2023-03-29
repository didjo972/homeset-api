import {
    Column,
    CreateDateColumn,
    Entity, ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {User} from "./User";
import {CookingRecipe} from "../cookingbook/CookingRecipe";
import {Todo} from "../todolist/Todo";
import {Item} from "../saveobject/Item";

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The group ID in DB.
 *           example: "76538276"
 *         name:
 *           type: string
 *           description: The booking name.
 *           example: "Bokit"
 *         users:
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/User'
 *         cookingRecipes:
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/CookingRecipe'
 *         todos:
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/Todo'
 *         items:
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/Item'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The group's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The group's update date
 */
@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToMany(() => User, user => user.groups)
    public users: User[];

    @ManyToMany(() => CookingRecipe, cookingRecipe => cookingRecipe.groups)
    public cookingRecipes: CookingRecipe[];

    @OneToMany(() => Todo, todo => todo.group)
    public todos: Todo[];

    @OneToMany(() => Item, item => item.group)
    public items: Item[];

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
