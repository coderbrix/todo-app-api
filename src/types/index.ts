export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  isCompleted: boolean;
  workspaceId: string;
  userId: string;
  position: number;
  createdAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  workspaceId: string;
}
