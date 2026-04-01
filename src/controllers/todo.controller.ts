// controllers/todo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';

const userId = "user_id"; // later from auth middleware

export const TodoController = {
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await TodoService.createTodo(req.body, userId);
      res.status(201).json(todo);
    } catch (err) {
      next(err);
    }
  },

  async getWorkspaceTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await TodoService.getWorkspaceTodos(
        req.params.workspaceId as string,
        userId,
        req.query
      );
      res.json(todos);
    } catch (err) {
      next(err);
    }
  },

  async getTodoById(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await TodoService.getTodoById(req.params.id as string, userId);
      res.json(todo);
    } catch (err) {
      next(err);
    }
  },

  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await TodoService.updateTodo(
        req.params.id as string,
        req.body,
        userId
      );
      res.json(todo);
    } catch (err) {
      next(err);
    }
  },

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      await TodoService.deleteTodo(req.params.id as string, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async reorderTodo(req: Request, res: Response, next: NextFunction) {
    try {
      await TodoService.reorderTodo(
        req.params.id as string,
        req.body.newPosition,
        userId
      );
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};