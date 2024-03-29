import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';
import {Task} from '../entity/todolist/Task';
import {Todo} from '../entity/todolist/Todo';
import {TodoRepository} from '../repositories/TodoRepository';
import Utils from './Utils';
import {User} from '../entity/user/User';
import {
  ITaskRequest,
  IMultiDeleteRequest,
  ITodoRequest,
} from '../shared/api-request-interfaces';
import {toTodoResponse} from '../transformers/transformers';
import {In} from 'typeorm';
import {matchRequestSubItemsInItemEntity, selectGroup} from './Helpers';

class TodoController {
  private static matchTask = async (
    todo: Todo,
    taskReq: Task,
  ): Promise<Task> => {
    if (taskReq.id) {
      const taskFound = todo.tasks.find(item => item.id === taskReq.id);
      if (taskFound) {
        if (taskReq.description) {
          taskFound.description = taskReq.description;
        }
        if (taskReq.status !== undefined) {
          taskFound.status = taskReq.status;
        }
        return taskFound;
      }
    }

    if (taskReq.description) {
      const newTask = new Task(taskReq);
      const errors = await validate(newTask);
      if (errors.length > 0) {
        throw new Error(errors.toLocaleString());
      }
      return newTask;
    }
  };

  public static upsertTodo = async (
    req: Request<any, any, ITodoRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Create or Update Todo endpoint has been called with: %s',
        req.body.toString(),
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get parameters from the body
      const {id, name, group, tasks = []} = req.body;

      if (id) {
        // Get the todos from database
        let todoToUpdate: Todo;
        try {
          todoToUpdate = await TodoRepository.getOneById(id, connectedUser.id);
        } catch (e) {
          console.error(e);
          res.status(404).send('Todo not found');
          return;
        }

        if (todoToUpdate) {
          console.info('A todo has been found: %d', todoToUpdate.id);

          // Check if the user can edit this todo
          if (!Utils.hasGrantAccess<Todo>(connectedUser, todoToUpdate)) {
            console.error(
              'The connected user has no grant access on this todo.',
            );
            res.status(403).send();
            return;
          }

          // Validate the new values on model
          if (name) {
            todoToUpdate.name = name;
          }

          if (group !== undefined) {
            try {
              todoToUpdate.group = await selectGroup(group, connectedUser.id);
            } catch (error) {
              console.error(error);
              res.status(404).send('Group not found');
              return;
            }
          }

          if (tasks && tasks.length > 0) {
            todoToUpdate.tasks = await Promise.all(
              matchRequestSubItemsInItemEntity<Todo, ITaskRequest, Task>(
                todoToUpdate,
                tasks,
                TodoController.matchTask,
              ),
            );
          }

          const errors = await validate(todoToUpdate);
          if (errors.length > 0) {
            res.status(400).send(errors);
            return;
          }

          await TodoRepository.save(todoToUpdate);
          res.status(200).send(toTodoResponse(todoToUpdate));
          return;
        }
      }

      const todoToCreate = new Todo();
      todoToCreate.name = name;
      todoToCreate.tasks = tasks.map(task => new Task(task));
      todoToCreate.status = false;
      todoToCreate.owner = connectedUser;

      // Validade if the parameters are ok
      const errors = await validate(todoToCreate);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      try {
        await TodoRepository.save(todoToCreate);
      } catch (e) {
        res.status(400).send('Missing param');
        return;
      }

      // If all ok, send 201 response
      res.status(201).send(toTodoResponse(todoToCreate));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static editTodo = async (
    req: Request<{id: number}, any, ITodoRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Edit Todo endpoint has been called with: %s and path param %d',
        req.body.toString(),
        req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get values from the body
      const {name, tasks, group} = req.body;

      // Get the ID from the url
      const id = req.params.id;

      // Get the todos from database
      let todoFound: Todo;
      try {
        todoFound = await TodoRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('Todo not found');
        return;
      }

      console.info('A todo has been found: %d', todoFound.id);

      // Check if the user can edit this todo
      if (!Utils.hasGrantAccess<Todo>(connectedUser, todoFound)) {
        console.error('The connected user has no grant access on this todo.');
        res.status(403).send();
        return;
      }

      // Validate the new values on model
      if (name && name.length > 5) {
        todoFound.name = name;
      }

      if (group !== undefined) {
        try {
          todoFound.group = await selectGroup(group, connectedUser.id);
        } catch (error) {
          console.error(error);
          res.status(404).send('Group not found');
          return;
        }
      }

      if (tasks && tasks.length >= 0) {
        todoFound.tasks = await Promise.all(
          matchRequestSubItemsInItemEntity<Todo, ITaskRequest, Task>(
            todoFound,
            tasks,
            TodoController.matchTask,
          ),
        );
      }

      const errors = await validate(todoFound);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      await TodoRepository.save(todoFound);
      res.status(200).send(toTodoResponse(todoFound));
    } catch (e) {
      next(e);
    }
  };

  public static listAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Get all Todos endpoint has been called');

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get todos from database
      try {
        const todos = await TodoRepository.findAll(connectedUser.id);
        // Send the todos object
        res.send(todos.map(toTodoResponse));
        return;
      } catch (e) {
        console.error(e);
        res.status(404).send('Not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };

  public static getOneById = async (
    req: Request<{id: number}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Get one Todo endpoint has been called with: path param = %d',
        req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get the ID from the url
      const id = req.params.id;

      // Get the todos from database
      let todoFound;
      try {
        todoFound = await TodoRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        console.error(error);
        res.status(404).send('Todo not found');
      }

      // Check if the user can edit this todo
      if (!Utils.hasGrantAccess<Todo>(connectedUser, todoFound)) {
        console.error('The connected user has no grant access on this todo.');
        res.status(403).send();
        return;
      }

      res.send(toTodoResponse(todoFound));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static deleteTodo = async (
    req: Request<{id: number}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Delete a Todo endpoint has been called with: path param = %d',
        req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get the ID from the url
      const id = req.params.id;

      let todoFound: Todo;
      try {
        todoFound = await TodoRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        res.status(404).send('Todo not found');
        return;
      }

      // Check if the user can delete this todo
      if (!Utils.hasGrantAccess<Todo>(connectedUser, todoFound, true)) {
        console.error('The connected user has no grant access on this todo.');
        res.status(403).send();
        return;
      }

      await TodoRepository.softDelete(todoFound.id);

      // After all send a 204 (no content, but accepted) response
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  public static multiDelete = async (
    req: Request<any, any, IMultiDeleteRequest[]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Delete Todos endpoint has been called');

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get values from the body
      const idsReq = req.body;

      const ids = idsReq.map(item => item.id);

      // Get the todos from database
      let todosFound: Todo[];
      try {
        todosFound = await TodoRepository.findBy([
          {
            id: In(ids),
            owner: {id: connectedUser.id},
          },
          {
            id: In(ids),
            group: {users: {id: connectedUser.id}},
          },
        ]);
        await TodoRepository.softDelete(todosFound.map(todo => todo.id));
        res.status(204).send();
        return;
      } catch (error) {
        console.error(error);
        // If not found, send a 404 response
        res.status(404).send('Todo not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };
}

export default TodoController;
