import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Act} from './Act';
import {Vehicle} from './Vehicle';

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
export class Servicing {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public kilometer: number;

    @ManyToOne(() => Vehicle, vehicle => vehicle.servicings)
    public vehicle: Vehicle;

    @OneToMany(() => Act, act => act.servicing)
    public acts: Act[];

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
