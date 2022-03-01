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

export interface ICreateTodoRequest {
  name: string;
  tasks?: ITaskRequest[];
}

export interface ITaskRequest {
  id?: number;
  description?: string;
  status?: boolean;
}

export interface IUpdateTodoRequest {
  name?: string;
  status?: boolean;
  tasks?: ITaskRequest[];
}
