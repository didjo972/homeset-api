export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ICreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface IResetPasswordRequest {
  email: string;
}

export interface IUpsertTodoRequest {
  id?: number;
  name: string;
  // status?: boolean;
  group?: number;
  tasks?: ICreateTaskRequest[];
}

export interface ICreateTaskRequest {
  id?: number;
  description?: string;
  status?: boolean;
}

export interface IUpdateTodoRequest {
  name?: string;
  // status?: boolean;
  tasks?: ICreateTaskRequest[];
  group?: number;
}

export interface IEditUserRequest {
  username?: string;
  role?: string;
  phone?: string;
}

export interface IUpsertUserRequest {
  idMember: number;
}

export interface IUpsertGroupRequest {
  id?: number;
  name: string;
}

export interface IUserRequest {
  id: number;
}

export interface IUpdateGroupRequest {
  name?: string;
  users?: IUserRequest[];
  owner?: IUserRequest;
}
