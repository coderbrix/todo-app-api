import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';

// Instantiate the service
const todoService = new TodoService();

export class TodoController {
  //create todo
  public static async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = "user_id"; // Placeholder for req.user.id
      const todo = await todoService.createTodo(req.body, userId);
      res.status(201).json(todo);
    } catch (err) {
      next(err);
    }
  }

  //get Workspace Todos (Filtering & Sorting)
  public static async getWorkspaceTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = "user_id";
      const { workspaceId } = req.params;
      const todos = await todoService.getWorkspaceTodos(
        workspaceId as string,
        userId,
        req.query
      );
      res.json(todos);
    } catch (err) {
      next(err);
    }
  }

  //get Single Todo
  public static async getTodoById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = "user_id";
      const { id } = req.params;
      const todo = await todoService.getTodoById(id as string, userId);
      res.json(todo);
    } catch (err) {
      next(err);
    }
  }

  //update Todo / Toggle
  public static async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = "user_id";
      const { id } = req.params;
      const todo = await todoService.updateTodo(id as string, req.body, userId);
      res.json(todo);
    } catch (err) {
      next(err);
    }
  }

  //delete Todo
  public static async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = "user_id";
      const { id } = req.params;
      await todoService.deleteTodo(id as string, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  //reorder Todo
  public static async reorderTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = "user_id";
      const { id } = req.params;
      const { newPosition } = req.body;

      if (typeof newPosition !== 'number') {
        return res.status(400).json({ error: "newPosition must be a number" });
      }

      await todoService.reorderTodo(id as string, newPosition, userId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}