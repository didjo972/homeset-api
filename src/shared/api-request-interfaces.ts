/****************************************************************************************************
 * COMMON REQUEST INTERFACES
 ****************************************************************************************************/
export interface IMultiDeleteRequest {
  id: number;
}

/****************************************************************************************************
 * ACCOUNT REQUEST INTERFACES
 ****************************************************************************************************/

export interface IUserRequest {
  id: number;
}

export interface IEditUserRequest {
  username?: string;
  role?: string;
  phone?: string;
}

export interface IUpsertUserRequest {
  idMember: number;
}

export interface ICreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface IResetPasswordRequest {
  email: string;
}

/****************************************************************************************************
 * AUTHENTICATION REQUEST INTERFACES
 ****************************************************************************************************/
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/****************************************************************************************************
 * GROUP REQUEST INTERFACES
 ****************************************************************************************************/
export interface IUpsertGroupRequest {
  id?: number;
  name?: string;
}

export interface IUpdateGroupRequest {
  name?: string;
  users?: IUserRequest[];
  owner?: IUserRequest;
}

/****************************************************************************************************
 * TODO REQUEST INTERFACES
 ****************************************************************************************************/
export interface ITaskRequest {
  id?: number;
  description?: string;
  status?: boolean;
}

export interface ITodoRequest {
  id?: number;
  name?: string;
  tasks?: ITaskRequest[];
  group?: number;
}

export interface INoteRequest {
  id?: number;
  name?: string;
  data?: string;
  group?: number;
}

/****************************************************************************************************
 * RECIPE REQUEST INTERFACES
 ****************************************************************************************************/
export interface ICookingRecipeRequest {
  id?: number;
  name?: string;
  description?: string;
  preparationTime?: number;
  nbPerson?: number;
  recipe?: string;
  groups?: number[];
}

/****************************************************************************************************
 * VEHICLE REQUEST INTERFACES
 ****************************************************************************************************/
export interface IVehicleRequest {
  id?: number;
  brand?: string;
  model?: string;
  identification?: string;
  group?: number;
  servicings?: IServicingRequest[];
}

export interface IServicingRequest {
  id?: number;
  kilometer?: number;
  acts?: IActRequest[];
}

export interface IActRequest {
  id?: number;
  description?: string;
  comment?: string;
}
