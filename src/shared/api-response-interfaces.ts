/****************************************************************************************************
 * COMMON RESPONSE INTERFACES
 ****************************************************************************************************/
interface ICommon {
  createdAt?: Date;
  updatedAt?: Date;
}

/****************************************************************************************************
 * USER RESPONSE INTERFACES
 ****************************************************************************************************/
export interface IUserResponse extends ICommon {
  id: number;
  email: string;
  username: string;
  phone: string;
  todos?: ITodoResponse[];
  groups?: IGroupResponse[];
}

/****************************************************************************************************
 * GROUP RESPONSE INTERFACES
 ****************************************************************************************************/
export interface IGroupResponse extends ICommon {
  id: number;
  name: string;
  users?: IUserResponse[];
  owner?: IUserResponse;
}

/****************************************************************************************************
 * TODO RESPONSE INTERFACES
 ****************************************************************************************************/
export interface ITaskResponse extends ICommon {
  id: number;
  description: string;
  status: boolean;
}

export interface ITodoResponse extends ICommon {
  id: number;
  name: string;
  status: boolean;
  tasks: ITaskResponse[];
  owner: IUserResponse;
  group: IGroupResponse | number;
}

/****************************************************************************************************
 * NOTE RESPONSE INTERFACES
 ****************************************************************************************************/
export interface INoteResponse extends ICommon {
  id: number;
  name: string;
  data: string;
  owner: IUserResponse;
  group: IGroupResponse | number;
}

/****************************************************************************************************
 * RECIPE RESPONSE INTERFACES
 ****************************************************************************************************/
export interface IRecipeResponse extends ICommon {
  id: number;
  name: string;
  description: string;
  preparationTime: number;
  nbPerson: number;
  recipe: string;
  owner: IUserResponse;
  groups: (IGroupResponse | number)[];
}

/****************************************************************************************************
 * VEHICLE RESPONSE INTERFACES
 ****************************************************************************************************/
export interface IActResponse extends ICommon {
  id: number;
  description: string;
  comment: string;
}

export interface IServicingResponse extends ICommon {
  id: number;
  kilometer: number;
  acts?: IActResponse[];
}

export interface IVehicleResponse extends ICommon {
  id: number;
  brand: string;
  model: string;
  identification?: string;
  servicings: IServicingResponse[];
  owner: IUserResponse;
  group?: IGroupResponse | number;
}
