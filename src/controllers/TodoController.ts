import {validate} from 'class-validator';
import {Request, Response} from 'express';
import {Task} from '../entity/todolist/Task';
import {Todo} from '../entity/todolist/Todo';
import TodoRepository from '../repositories/TodoRepository';
import {ICreateTodoRequest, IUpdateTodoRequest} from '../shared/interfaces';
import Utils from './Utils';

class TodoController {
    public static newTodo = async (req: Request, res: Response) => {
        // Get parameters from the body
        const {name, tasks = []} = req.body as ICreateTodoRequest;
        const todo = new Todo();
        todo.name = name;
        todo.tasks = tasks.map(task => new Task(task));
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

        const todoRepository = new TodoRepository();
        try {
            await todoRepository.save(todo);
        } catch (e) {
            res.status(400).send('Missing param');
            return;
        }

        // If all ok, send 201 response
        res.status(201).send('Todo created');
    };

    public static editTodo = async (req: Request, res: Response) => {
        console.info('Edit Todo endpoint has been called with: ' + req.body.toString() + ' and path param ' + req.params.id);

        // Get values from the body
        const {name, status, tasks = []} = req.body as IUpdateTodoRequest;

        // Get the ID from the url
        const id = req.params.id;

        // Get the todos from database
        const todoRepository = new TodoRepository();
        let todo: Todo;
        try {
            todo = await todoRepository.getOneById(id);
        } catch (error) {
            // If not found, send a 404 response
            res.status(404).send('Todo not found');
            return;
        }

        console.info('A todo has been found: ' + todo.id);

        // Validate the new values on model
        if (name) {
            todo.name = name;
        }

        if (status !== undefined) {
            todo.status = status;
        }

        if (tasks && tasks.length > 0) {
            const updatedTasks = tasks.map(taskReq => {
                if (taskReq.id) {
                    const taskFound = todo.tasks.find(task => task.id === taskReq.id);
                    if (taskFound) {
                        if (taskReq.description) {
                            taskFound.description = taskReq.description;
                        }
                        if (taskReq.status !== undefined) {
                            taskFound.status = taskReq.status;
                        }
                        return taskFound;
                    } else {
                        console.error(`No task with id: ${taskReq.id} found.`);
                    }
                }
                
                if (taskReq.description) {
                    return new Task(taskReq);
                }
            });
            todo.tasks = updatedTasks;
        }

        const errors = await validate(todo);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        await todoRepository.save(todo);
        // After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    public static listAll = async (req: Request, res: Response) => {
        // Get todos from database
        const todoRepository = new TodoRepository();
        const todos = await todoRepository.findAll();

        // Send the todos object
        res.send(todos);
    };

    public static getOneById = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id: number = +req.params.id;

        // Get the todos from database
        const todoRepository = new TodoRepository();
        try {
            const todo = await todoRepository.getOneById(id);
            res.send(todo);
        } catch (error) {
            console.error(error);
            res.status(404).send('Todo not found');
        }
    };

    public static deleteTodo = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id = req.params.id;

        const todoRepository = new TodoRepository();
        let todo: Todo;
        try {
            todo = await todoRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send('Todo not found');
            return;
        }
        await todoRepository.delete(todo.id);

        // After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default TodoController;
