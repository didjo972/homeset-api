import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {Servicing} from './Servicing';
import AbstractBusiness from '../abstract/AbstractBusiness';
import {Group} from '../user/Group';

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The vehicle ID in DB.
 *           example: "76538276"
 *         brand:
 *           type: string
 *           description: The brand.
 *           example: "Opel"
 *         model:
 *           type: string
 *           description: The model.
 *           example: "Insignia"
 *         identification:
 *           type: string
 *           description: The identification number.
 *           example: "DP-675-VX"
 *         servicings:
 *           readOnly: true
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/Servicing'
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The vehicle's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The vehicle's update date
 */
@Entity()
export class Vehicle extends AbstractBusiness {
  @Column()
  public brand: string;

  @Column()
  public model: string;

  @Column()
  public identification: string;

  @OneToMany(() => Servicing, servicing => servicing.vehicle, {
    cascade: true,
  })
  public servicings: Servicing[];

  @ManyToOne(() => Group, group => group.todos, {nullable: true})
  public group: Group;
}
