export interface ITaskResponse {
  id: number;
  description: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  id: number;
  email: string;
  username: string;
  phone: string;
  todos?: ITodoResponse[];
  groups?: IGroupResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGroupResponse {
  id: number;
  name: string;
  users?: IUserResponse[];
  admin?: IUserResponse;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITodoResponse {
  id: number;
  name: string;
  status: boolean;
  tasks: ITaskResponse[];
  owner: IUserResponse;
  group: IGroupResponse;
  createdAt: Date;
  updatedAt: Date;
}
