export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
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
