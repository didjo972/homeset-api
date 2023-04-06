import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {Task} from './Task';
import AbstractBusiness from '../abstract/AbstractBusiness';
import AbstractEntity from '../abstract/AbstractEntity';
import {Group} from '../user/Group';
import {User} from '../user/User';

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
 *           readOnly: true
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
export class Todo extends AbstractBusiness {
  @Column()
  public name: string;

  @Column()
  public status: boolean;

  @OneToMany(() => Task, task => task.todo, {
    cascade: true,
  })
  public tasks: Task[];

  @ManyToOne(() => Group)
  public group: Group;

  constructor() {
    super();
  }
}
