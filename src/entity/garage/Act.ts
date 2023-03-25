import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Servicing} from './Servicing';

@Entity()
export class Act {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public description: string;

  @ManyToOne(() => Servicing, servicing => servicing.acts)
  public servicing: Servicing;
}
