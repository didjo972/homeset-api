import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {Act} from './Act';
import {Vehicle} from './Vehicle';
import AbstractEntity from '../abstract/AbstractEntity';
import {IServicingRequest} from '../../shared/api-request-interfaces';

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicing:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           readOnly: true
 *           description: The servicing ID in DB.
 *           example: "76538276"
 *         kilometer:
 *           type: number
 *           description: The kilometer number.
 *           example: "198657"
 *         vehicle:
 *           $ref: '#/components/schemas/Vehicle'
 *         acts:
 *           readOnly: true
 *           type: "array"
 *           items:
 *              $ref: '#/components/schemas/Act'
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The servicing's creation date
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *           description: The servicing's update date
 */
@Entity()
export class Servicing extends AbstractEntity {
  @Column()
  public kilometer: number;

  @Column({type: 'timestamptz'})
  public servicingDate: Date;

  @ManyToOne(() => Vehicle, vehicle => vehicle.servicings)
  public vehicle: Vehicle;

  @OneToMany(() => Act, act => act.servicing, {
    cascade: true,
  })
  public acts: Act[];

  constructor(servicingRequest?: IServicingRequest) {
    if (servicingRequest) {
      super(servicingRequest.id);
      this.kilometer = servicingRequest.kilometer;
      this.servicingDate = servicingRequest.servicingDate
        ? servicingRequest.servicingDate
        : new Date();
      this.acts = servicingRequest.acts.map(item => new Act(item));
    } else {
      super();
    }
  }
}
