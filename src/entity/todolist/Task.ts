import {Column, Entity, ManyToOne} from 'typeorm';
import {Todo} from './Todo';
import AbstractEntity from '../abstract/AbstractEntity';
import {User} from '../user/User';
import {ITaskRequest} from '../../shared/api-request-interfaces';

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
export class Task extends AbstractEntity {
  @Column()
  public description: string;

  @Column()
  public status: boolean;

  @ManyToOne(() => Todo, todo => todo.tasks)
  public todo: Todo;

  @ManyToOne(() => User, owner => owner.todos, {eager: true})
  public owner: User;

  constructor(taskRequest?: ITaskRequest) {
    if (taskRequest) {
      super(taskRequest.id);
      this.description = taskRequest.description;
      this.status =
        taskRequest.status !== undefined ? taskRequest.status : false;
    } else {
      super();
    }
  }
}
