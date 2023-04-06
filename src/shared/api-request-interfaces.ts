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
  status?: boolean;
  tasks?: ICreateTaskRequest[];
}

export interface ICreateTaskRequest {
  id?: number;
  description?: string;
  status?: boolean;
}

export interface IUpdateTodoRequest {
  name?: string;
  status?: boolean;
  tasks?: ICreateTaskRequest[];
}

export interface IEditUserRequest {
  username?: string;
  role?: string;
  phone?: string;
}
