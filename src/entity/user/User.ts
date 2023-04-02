import * as bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid';

import {IsEmail, IsNotEmpty, IsOptional, Length} from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import {CookingRecipe} from '../cookingbook/CookingRecipe';
import {Vehicle} from '../garage/Vehicle';
import {Item} from '../saveobject/Item';
import {Todo} from '../todolist/Todo';
import {Group} from "./Group";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The user ID in DB.
 *           example: "76538276"
 *         email:
 *           type: string
 *           description: The user email.
 *           example: "toto@mail.com"
 *         username:
 *           type: string
 *           description: The username.
 *           example: "toto"
 *         password:
 *           type: string
 *           writeOnly: true
 *           description: The password.
 *           example: "T0to35tl3plu5b0"
 *         role:
 *           type: string
 *           description: The user's role.
 *           example: "ADMIN"
 *         phone:
 *           type: string
 *           description: The user's phone
 *           example: "0780000000"
 *         cookingRecipes:
 *           type: "array"
 *           readOnly: true
 *           items:
 *              $ref: '#/components/schemas/CookingRecipe'
 *         items:
 *           type: "array"
 *           readOnly: true
 *           items:
 *              $ref: '#/components/schemas/Item'
 *         todos:
 *           type: "array"
 *           readOnly: true
 *           items:
 *              $ref: '#/components/schemas/Todo'
 *         vehicles:
 *           type: "array"
 *           readOnly: true
 *           items:
 *              $ref: '#/components/schemas/Vehicle'
 *         groups:
 *           type: "array"
 *           readOnly: true
 *           items:
 *              $ref: '#/components/schemas/Group'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The user's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The user's update date
 */
@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsEmail()
    public email: string;

    @Column()
    @Length(4, 20)
    public username: string;

    @Column()
    @Length(4, 100)
    public password: string;

    @Column()
    public refreshSecret: string;

    @Column()
    @IsNotEmpty()
    public role: string;

    @Column({nullable: true})
    @IsOptional()
    public phone: string;

    @OneToMany(() => CookingRecipe, cookingRecipe => cookingRecipe.owner)
    public cookingRecipes: CookingRecipe[];

    @OneToMany(() => Item, item => item.owner)
    public items: Item[];

    @OneToMany(() => Todo, todo => todo.owner)
    public todos: Todo[];

    @OneToMany(() => Vehicle, vehicle => vehicle.owner)
    public vehicles: Vehicle[];

    @ManyToMany(() => Group, group => group.users)
    public groups: Group[];

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public createOrUpdateRefreshSecret() {
        this.refreshSecret = uuidv4();
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
