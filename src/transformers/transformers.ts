import {
  IGroupResponse,
  ITaskResponse,
  ITodoResponse,
  IUserResponse,
} from '../shared/api-response-interfaces';
import {Todo} from '../entity/todolist/Todo';
import {Task} from '../entity/todolist/Task';
import {User} from '../entity/user/User';
import {Group} from '../entity/user/Group';

export const toUserResponse = (user: User, withDate = false): IUserResponse => {
  const userReponse: IUserResponse = {
    id: user.id,
    email: user.email,
    username: user.username,
    phone: user.phone,
  };
  if (withDate) {
    userReponse.createdAt = user.createdAt;
    userReponse.updatedAt = user.updatedAt;
  }

  return userReponse;
};

export const toTaskResponse = (task: Task, withDate = false): ITaskResponse => {
  const toTaskResponse: ITaskResponse = {
    id: task.id,
    description: task.description,
    status: task.status,
  };
  if (withDate) {
    toTaskResponse.createdAt = task.createdAt;
    toTaskResponse.updatedAt = task.updatedAt;
  }

  return toTaskResponse;
};

export const toGroupResponse = (group: Group): IGroupResponse => {
  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    admin: group.owner ? toUserResponse(group.owner) : undefined,
    users: group.users
      ? group.users.map(user => toUserResponse(user))
      : undefined,
  };
};

export const toTodoResponse = (todo: Todo): ITodoResponse => {
  return {
    id: todo.id,
    name: todo.name,
    status: todo.status,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    owner: todo.owner ? toUserResponse(todo.owner) : undefined,
    tasks: todo.tasks
      ? todo.tasks.map(task => toTaskResponse(task))
      : undefined,
    group: todo.group ? toGroupResponse(todo.group) : undefined,
  };
};
