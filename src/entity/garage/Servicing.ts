import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Act } from "./Act";
import { Vehicle } from "./Vehicle";

@Entity()
export class Servicing {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public kilometer: number;

    @ManyToOne(() => Vehicle, (vehicule) => vehicule.servicings)
    public vehicle: Vehicle;

    @OneToMany(() => Act, (act) => act.servicing)
    public acts: Act[];

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
