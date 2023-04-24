import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Servicing} from './Servicing';
import AbstractEntity from '../abstract/AbstractEntity';
import {IActRequest} from '../../shared/api-request-interfaces';

/**
 * @swagger
 * components:
 *   schemas:
 *     Act:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The act ID in DB.
 *           example: "76538276"
 *         description:
 *           type: string
 *           description: The act description.
 *           example: "The description"
 *         servicing:
 *           $ref: '#/components/schemas/Servicing'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The act's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The act's update date
 */
@Entity()
export class Act extends AbstractEntity {
  @Column()
  public description: string;

  @Column({nullable: true})
  public comment: string;

  @ManyToOne(() => Servicing, servicing => servicing.acts, {lazy: true})
  public servicing: Servicing;

  constructor(actRequest?: IActRequest) {
    if (actRequest) {
      super(actRequest.id);
      this.description = actRequest.description;
      this.comment = actRequest.comment;
    } else {
      super();
    }
  }
}
