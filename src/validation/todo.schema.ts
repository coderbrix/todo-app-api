import * as z from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string(),
  dueDate: z.coerce.date(),
  priority: z.number(),
  workspaceId: z.string().nonempty(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  isCompleted: z.boolean().optional(),
});

export const reorderTodoSchema = z.object({
  newPosition: z.number().int().min(0),
});

export const todoIdParamSchema = z.object({
  id: z.string().nonempty(),
});

export const workspaceIdParamSchema = z.object({
  workspaceId: z.string().nonempty(),
});

export const listTodosQuerySchema = z.object({
  sort: z.enum(["latest", "oldest"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  isCompleted: z.enum(["true", "false"]).optional(),
});