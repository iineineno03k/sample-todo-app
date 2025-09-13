export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TodoStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
}

export interface UpdateTodoStatusRequest {
  status: TodoStatus;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}
