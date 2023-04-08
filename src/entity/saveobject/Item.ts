import {Length} from 'class-validator';
import {Column, Entity, ManyToOne, Unique} from 'typeorm';
import AbstractBusiness from '../abstract/AbstractBusiness';
import {Group} from '../user/Group';

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The item ID in DB.
 *           example: "76538276"
 *         name:
 *           type: string
 *           description: The item name.
 *           example: "Drill"
 *         description:
 *           type: string
 *           description: The item location.
 *           example: "In garage"
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         group:
 *           $ref: '#/components/schemas/Group'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The item's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The item's update date
 */
@Entity()
@Unique(['name'])
export class Item extends AbstractBusiness {
  @Column()
  @Length(4, 20)
  public name: string;

  @Column()
  public description: string;

  @ManyToOne(() => Group)
  public group: Group;

  constructor() {
    super();
  }
}
