import {Length} from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['name'])
export class Place {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Length(4, 20)
    public name: string;

    @Column()
    public description: string;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
