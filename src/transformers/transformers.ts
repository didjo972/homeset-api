import {
  IActResponse,
  IGroupResponse,
  INoteResponse,
  IRecipeResponse,
  IServicingResponse,
  ITaskResponse,
  ITodoResponse,
  IUserResponse,
  IVehicleResponse,
} from '../shared/api-response-interfaces';
import {Todo} from '../entity/todolist/Todo';
import {Task} from '../entity/todolist/Task';
import {User} from '../entity/user/User';
import {Group} from '../entity/user/Group';
import {Note} from '../entity/notes/Note';
import {CookingRecipe} from '../entity/cookingbook/CookingRecipe';
import {Vehicle} from '../entity/garage/Vehicle';
import {Servicing} from '../entity/garage/Servicing';
import {Act} from '../entity/garage/Act';

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
  const taskResponse: ITaskResponse = {
    id: task.id,
    description: task.description,
    status: task.status,
  };
  if (withDate) {
    taskResponse.createdAt = task.createdAt;
    taskResponse.updatedAt = task.updatedAt;
  }

  return taskResponse;
};

export const toGroupResponse = (
  group: Group,
  partial = false,
): IGroupResponse | number => {
  if (partial) {
    return group.id;
  }
  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    owner: group.owner ? toUserResponse(group.owner) : undefined,
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
    group: todo.group ? toGroupResponse(todo.group, true) : undefined,
  };
};

export const toNoteResponse = (note: Note): INoteResponse => {
  return {
    id: note.id,
    name: note.name,
    data: note.data,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    owner: note.owner ? toUserResponse(note.owner) : undefined,
    group: note.group ? toGroupResponse(note.group, true) : undefined,
  };
};

export const toRecipeResponse = (recipe: CookingRecipe): IRecipeResponse => {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    preparationTime: recipe.preparationTime,
    nbPerson: recipe.nbPerson,
    recipe: recipe.recipe,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    owner: recipe.owner ? toUserResponse(recipe.owner) : undefined,
    groups: recipe.groups
      ? recipe.groups.map(item => toGroupResponse(item, true))
      : undefined,
  };
};

export const toActResponse = (act: Act, withDate = false): IActResponse => {
  const actResponse: IActResponse = {
    id: act.id,
    description: act.description,
    comment: act.comment,
  };
  if (withDate) {
    actResponse.createdAt = act.createdAt;
    actResponse.updatedAt = act.updatedAt;
  }
  return actResponse;
};

export const toServicingResponse = (
  servicing: Servicing,
): IServicingResponse => {
  return {
    id: servicing.id,
    kilometer: servicing.kilometer,
    acts: servicing.acts
      ? servicing.acts.map(item => toActResponse(item))
      : undefined,
    createdAt: servicing.createdAt,
    updatedAt: servicing.updatedAt,
  };
};

export const toVehicleResponse = (vehicle: Vehicle): IVehicleResponse => {
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    identification: vehicle.identification,
    servicings: vehicle.servicings
      ? vehicle.servicings.map(toServicingResponse)
      : undefined,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
    owner: vehicle.owner ? toUserResponse(vehicle.owner) : undefined,
    group: vehicle.group ? toGroupResponse(vehicle.group, true) : undefined,
  };
};
