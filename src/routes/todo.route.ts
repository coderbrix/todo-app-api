import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { auth } from "@/middlewares/auth.middleware";
import { validation } from "@/middlewares/validation.middleware";
import { createTodoScheam } from "@/validation/todo.schema";

const router = Router();
const controller = new TodoController();

router.post("/", validation(createTodoScheam), auth, controller.createTodo.bind(controller));
router.get("/workspace/:workspaceId", auth, controller.getWorkspaceTodos.bind(controller));
router.get("/:id", auth, controller.getTodoById.bind(controller));
router.patch("/:id", auth, controller.updateTodo.bind(controller));
router.delete("/:id", auth, controller.deleteTodo.bind(controller));
router.patch("/:id/reorder", auth, controller.reorderTodo.bind(controller));

export default router;
