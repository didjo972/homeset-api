import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {User} from './User';
import {CookingRecipe} from '../cookingbook/CookingRecipe';
import {Todo} from '../todolist/Todo';
import {Item} from '../saveobject/Item';
import AbstractEntity from '../abstract/AbstractEntity';
import {Vehicle} from '../garage/Vehicle';

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
 *           readOnly: true
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/User'
 *         cookingRecipes:
 *           readOnly: true
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/CookingRecipe'
 *         todos:
 *           type: "array"
 *           readOnly: true
 *           items:
 *              $ref: '#/components/schemas/Todo'
 *         items:
 *           type: "array"
 *           readOnly: true
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
export class Group extends AbstractEntity {
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

  @OneToMany(() => Vehicle, vehicle => vehicle.group)
  public vehicles: Vehicle[];

  constructor(id?: number) {
    super(id);
  }
}
