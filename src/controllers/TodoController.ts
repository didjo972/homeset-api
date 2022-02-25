import { validate } from "class-validator";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import { Task } from "../entity/todolist/Task";
import { Todo } from "../entity/todolist/Todo";
import { ICreateTodoRequest, IUpdateTodoRequest } from "../shared/interfaces";
import Utils from "./Utils";

class TodoController {

    public static newTodo = async (req: Request, res: Response) => {
        // Get parameters from the body
        const { name, tasks = [] }: ICreateTodoRequest = req.body;
        const todo = new Todo();
        todo.name = name;
        todo.tasks = tasks.map((task) => new Task(task));
        todo.status = false;
        try {
            todo.owner = await Utils.getUserConnected(res);
        } catch (e) {
            res.status(401).send();
            return;
        }

        // Validade if the parameters are ok
        const errors = await validate(todo);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const todoRepository = getRepository(Todo);
        try {
            await todoRepository.save(todo);
        } catch (e) {
            res.status(400).send("Missing param");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send("Todo created");
    }

    public static editTodo = async (req: Request, res: Response) => {
        // Get values from the body
        const {name, status, tasks = []}: IUpdateTodoRequest = req.body;

        // Get the ID from the url
        const id = req.params.id;

        // Get the todo from database
        const todoRepository = getRepository(Todo);
        let todo: Todo;
        try {
            todo = await todoRepository.createQueryBuilder('todo')
                .leftJoinAndSelect("todo.tasks", "task")
                .leftJoinAndSelect("todo.owner", "owner")
                .select(["todo.id", "todo.name", "todo.updatedAt", "task.id", "task.description", "owner.id", "owner.email", "owner.username"])
                .where("todo.id = :id", { id: id })
                .getOneOrFail();
        } catch (error) {
            // If not found, send a 404 response
            res.status(404).send("Todo not found");
            return;
        }

        // Validate the new values on model
        if (name) {
            todo.name = name;
        }

        if (status) {
            todo.status = status;
        }

        if (tasks) {
            const updatedTasks = todo.tasks.map(task => {
                const tskFound = tasks.find(tsk => tsk.id === task.id);
                if (tskFound && tskFound.description !== undefined && tskFound.status !== undefined) {
                    return new Task(tskFound);
                }
                return task;
            });
            console.log(updatedTasks);
            todo.tasks = updatedTasks;
        }

        const errors = await validate(todo);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const ret = await todoRepository.save(todo);
        console.log(ret);
        // After all send a 204 (no content, but accepted) response
        res.status(204).send();
    }

    public static listAll = async (req: Request, res: Response) => {
        // Get todos from database
        const todoRepository = getRepository(Todo);
        const todos = await todoRepository.createQueryBuilder('todo')
            .leftJoinAndSelect("todo.tasks", "task")
            .leftJoinAndSelect("todo.owner", "owner")
            .select(["todo.id", "todo.name", "todo.updatedAt", "task.id", "task.description", "owner.id", "owner.email", "owner.username"])
            .getMany();

        // Send the todos object
        res.send(todos);
    }

    public static getOneById = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id: number = +req.params.id;

        // Get the todo from database
        const todoRepository = getRepository(Todo);
        try {
            const todo = await todoRepository.createQueryBuilder('todo')
                .leftJoinAndSelect("todo.tasks", "task")
                .leftJoinAndSelect("todo.owner", "owner")
                .select(["todo.id", "todo.name", "todo.updatedAt", "todo.status", "task.id", "task.description", "task.status", "owner.id", "owner.email", "owner.username"])
                .where("todo.id = :id", { id: id })
                .getOneOrFail();
            res.send(todo);
        } catch (error) {
            res.status(404).send("Todo not found");
        }
    }

    public static deleteTodo = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        const todoRepository = getRepository(Todo);
        let todo: Todo;
        try {
            todo = await todoRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("Todo not found");
            return;
        }
        await todoRepository.delete(id);

        // After all send a 204 (no content, but accepted) response
        res.status(204).send();
    }

}

export default TodoController;
