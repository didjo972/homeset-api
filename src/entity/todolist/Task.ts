import { ITaskRequest } from "../../shared/interfaces";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Todo } from "./Todo";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public description: string;

    @Column()
    public status: boolean;

    @ManyToOne(() => Todo, (todo) => todo.tasks)
    public todo: Todo;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    constructor(taskRequest?: ITaskRequest) {
        this.description = taskRequest && taskRequest.description ? taskRequest.description : undefined;
        this.status = taskRequest && taskRequest.status ? taskRequest.status : false;
        this.id = taskRequest && taskRequest.id ? taskRequest.id : undefined;
    }
}
