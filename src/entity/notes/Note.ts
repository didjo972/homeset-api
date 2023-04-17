import {Column, Entity, ManyToOne} from 'typeorm';
import AbstractBusiness from '../abstract/AbstractBusiness';
import {Group} from '../user/Group';

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The note ID in DB.
 *           example: "76538276"
 *         name:
 *           type: string
 *           description: The name note.
 *           example: "Holidays 03.2023"
 *         data:
 *           type: string
 *           description: The data note.
 *           example: "Holidays 03.2023"
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         group:
 *           $ref: '#/components/schemas/Group'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The note's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The note's update date
 */
@Entity()
export class Note extends AbstractBusiness {
  @Column()
  public name: string;

  @Column()
  public data: string;

  @ManyToOne(() => Group, group => group.notes, {nullable: true})
  public group: Group;

  constructor() {
    super();
  }
}
