import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {User} from '../user/User';
import {Task} from './Task';
import {Group} from "../user/Group";

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The todo ID in DB.
 *           example: "76538276"
 *         name:
 *           type: string
 *           description: The name task.
 *           example: "Holidays 03.2023"
 *         status:
 *           type: boolean
 *           description: The todo status.
 *           example: "true"
 *         tasks:
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/Task'
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         group:
 *           $ref: '#/components/schemas/Group'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The todo's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The todo's update date
 */
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

    @ManyToOne(() => Group, group => group.todos)
    public group: Group;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
