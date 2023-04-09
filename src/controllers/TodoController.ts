import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';
import {Task} from '../entity/todolist/Task';
import {Todo} from '../entity/todolist/Todo';
import TodoRepository from '../repositories/TodoRepository';
import Utils from './Utils';
import {User} from '../entity/user/User';
import {
  IUpdateTodoRequest,
  IUpsertTodoRequest,
} from '../shared/api-request-interfaces';
import {toTodoResponse} from '../transformers/transformers';
import GroupRepository from '../repositories/GroupRepository';

class TodoController {
  public static upsertTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Create or Update Todo endpoint has been called with: ' +
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
      const {id, name, group, tasks = []} = req.body as IUpsertTodoRequest;

      if (id) {
        // Get the todos from database
        const todoRepository = new TodoRepository();
        let todoToUpdate: Todo;
        todoToUpdate = await todoRepository.getOneById(id);

        if (todoToUpdate) {
          console.info('A todo has been found: ' + todoToUpdate.id);

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

          // if (status !== undefined) {
          //   todoToUpdate.status = status;
          // }

          if (group === null || group <= 0) {
            todoToUpdate.group = null;
          } else {
            let groupFound = null;
            const groupRepository = new GroupRepository();
            try {
              groupFound = await groupRepository.getOneById(group);
            } catch (error) {
              console.error(error);
              res.status(404).send('Group not found');
              return;
            }
            todoToUpdate.group = groupFound;
          }

          if (tasks && tasks.length > 0) {
            const updatedTasks = tasks.map(taskReq => {
              if (taskReq.id) {
                const taskFound = todoToUpdate.tasks.find(
                  task => task.id === taskReq.id,
                );
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
            todoToUpdate.tasks = updatedTasks;
          }

          const errors = await validate(todoToUpdate);
          if (errors.length > 0) {
            res.status(400).send(errors);
            return;
          }

          await todoRepository.save(todoToUpdate);
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

      const todoRepository = new TodoRepository();
      try {
        await todoRepository.save(todoToCreate);
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
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Edit Todo endpoint has been called with: ' +
          req.body.toString() +
          ' and path param ' +
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
      const {name, tasks = [], group} = req.body as IUpdateTodoRequest;

      // Get the ID from the url
      const id = req.params.id;

      // Get the todos from database
      const todoRepository = new TodoRepository();
      let todoFound: Todo;
      try {
        todoFound = await todoRepository.getOneById(id);
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('Todo not found');
        return;
      }

      console.info('A todo has been found: ' + todoFound.id);

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
        if (group === null || group <= 0) {
          todoFound.group = null;
        } else {
          let groupFound = null;
          const groupRepository = new GroupRepository();
          try {
            groupFound = await groupRepository.getOneById(group);
          } catch (error) {
            console.error(error);
            res.status(404).send('Group not found');
            return;
          }
          todoFound.group = groupFound;
        }
      }

      if (tasks && tasks.length > 0) {
        const updatedTasks = tasks.map(taskReq => {
          if (taskReq.id) {
            const taskFound = todoFound.tasks.find(
              task => task.id === taskReq.id,
            );
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
        todoFound.tasks = updatedTasks;
      }

      const errors = await validate(todoFound);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      await todoRepository.save(todoFound);
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
      const todoRepository = new TodoRepository();
      const todos = await todoRepository.findAll(connectedUser.id);

      // Send the todos object
      res.send(todos.map(toTodoResponse));
    } catch (e) {
      next(e);
    }
  };

  public static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Get one Todo endpoint has been called with: ' +
          'path param ' +
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
      const id: number = +req.params.id;

      // Get the todos from database
      const todoRepository = new TodoRepository();

      let todoFound;
      try {
        todoFound = await todoRepository.getOneById(id);
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
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Delete a Todo endpoint has been called with: ' +
          'path param ' +
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

      const todoRepository = new TodoRepository();
      let todoFound: Todo;
      try {
        todoFound = await todoRepository.findOneOrFail(id);
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

      await todoRepository.delete(todoFound.id);

      // After all send a 204 (no content, but accepted) response
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}

export default TodoController;
