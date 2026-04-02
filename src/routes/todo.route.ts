import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";

const router = Router();
const controller = new TodoController();

router.post("/", controller.createTodo.bind(controller));
router.get("/workspace/:workspaceId", controller.getWorkspaceTodos.bind(controller));
router.get("/:id", controller.getTodoById.bind(controller));
router.patch("/:id", controller.updateTodo.bind(controller));
router.delete("/:id", controller.deleteTodo.bind(controller));
router.patch("/:id/reorder", controller.reorderTodo.bind(controller));

export default router;
