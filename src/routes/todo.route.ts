import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { auth } from "@/middlewares/auth.middleware";
import { validation } from "@/middlewares/validation.middleware";
import {
  createTodoSchema,
  updateTodoSchema,
  reorderTodoSchema,
  todoIdParamSchema,
  workspaceIdParamSchema,
  listTodosQuerySchema,
} from "@/validation/todo.schema";

const router = Router();
const controller = new TodoController();

router.post("/", auth, validation(createTodoSchema), controller.createTodo.bind(controller));
router.get("/workspace/:workspaceId", auth, validation(workspaceIdParamSchema, "params"), validation(listTodosQuerySchema, "query"), controller.getWorkspaceTodos.bind(controller));
router.get("/:id", auth, validation(todoIdParamSchema, "params"), controller.getTodoById.bind(controller));
router.patch("/:id", auth, validation(todoIdParamSchema, "params"), validation(updateTodoSchema), controller.updateTodo.bind(controller));
router.delete("/:id", auth, validation(todoIdParamSchema, "params"), controller.deleteTodo.bind(controller));
router.patch("/:id/reorder", auth, validation(todoIdParamSchema, "params"), validation(reorderTodoSchema), controller.reorderTodo.bind(controller));

export default router;
