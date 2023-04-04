import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {ICreateTaskRequest} from '../../shared/interfaces';
import {Todo} from './Todo';

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The task ID in DB.
 *           example: "76538276"
 *         description:
 *           type: string
 *           description: The description task.
 *           example: "Do the dishes"
 *         status:
 *           type: boolean
 *           description: The task status.
 *           example: "true"
 *         todo:
 *           $ref: '#/components/schemas/CookingRecipe'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The task's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The task's update date
 */
@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public description: string;

    @Column()
    public status: boolean;

    @ManyToOne(() => Todo, todo => todo.tasks)
    public todo: Todo;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    constructor(taskRequest?: ICreateTaskRequest) {
        if (taskRequest) {
            this.id = taskRequest.id;
            this.description = taskRequest.description;
            this.status = taskRequest.status !== undefined ? this.status : false;
        }
    }
}
