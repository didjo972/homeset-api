import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import {User} from '../user/User';
import {Group} from "../user/Group";

/**
 * @swagger
 * components:
 *   schemas:
 *     CookingRecipe:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The cooking recipe ID in DB.
 *           example: "76538276"
 *         name:
 *           type: string
 *           description: The cooking recipe name.
 *           example: "Bokit"
 *         description:
 *           type: string
 *           description: The cooking recipe description.
 *           example: "- 500 g flour\n- 0.5L water\n- pinch of salt\n..."
 *         nbPerson:
 *           type: number
 *           description: The number of people.
 *           example: "8"
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The cooking recipe's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The cooking recipe's update date
 */
@Entity()
@Unique(['name'])
export class CookingRecipe {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public nbPerson: number;

    @ManyToOne(() => User, owner => owner.cookingRecipes)
    public owner: User;

    @ManyToMany(() => Group, group => group.cookingRecipes)
    public groups: Group[];

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
