import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Servicing} from './Servicing';

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
export class Act {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public description: string;

    @ManyToOne(() => Servicing, servicing => servicing.acts)
    public servicing: Servicing;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
