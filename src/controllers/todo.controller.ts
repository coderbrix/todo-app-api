import { Request, Response } from "express";
import { TodoService } from "@/services/todo.service";
import { getUserIdOrThrow } from "@/middlewares/auth.middleware";

export class TodoController {
  private readonly todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }
  async createTodo(req: Request, res: Response) {
    const userId = getUserIdOrThrow(req);
    const todo = await this.todoService.createTodo(req.body, userId);
    res.status(201).json(todo);
  }

  async getWorkspaceTodos(req: Request, res: Response) {
    const userId = getUserIdOrThrow(req);
    const { workspaceId } = req.params;
    const todos = await this.todoService.getWorkspaceTodos(workspaceId as string, userId, req.query);
    res.json(todos);
  }

  async getTodoById(req: Request, res: Response) {
    const userId = getUserIdOrThrow(req);
    const { id } = req.params;
    const todo = await this.todoService.getTodoById(id as string, userId);
    res.json(todo);
  }

  async updateTodo(req: Request, res: Response) {
    const userId = getUserIdOrThrow(req);
    const { id } = req.params;
    const todo = await this.todoService.updateTodo(id as string, req.body, userId);
    res.json(todo);
  }

  async deleteTodo(req: Request, res: Response) {
    const userId = getUserIdOrThrow(req);
    const { id } = req.params;
    await this.todoService.deleteTodo(id as string, userId);
    res.status(204).send();
  }

  async reorderTodo(req: Request, res: Response) {
    const userId = getUserIdOrThrow(req);
    const { id } = req.params;
    const { newPosition } = req.body;

    if (typeof newPosition !== "number") {
      return res.status(400).json({ error: "newPosition must be a number" });
    }

    await this.todoService.reorderTodo(id as string, newPosition, userId);
    res.json({ success: true });
  }
}
