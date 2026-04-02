import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";

const router = Router();

router.post("/", TodoController.createTodo);
router.get("/workspace/:workspaceId", TodoController.getWorkspaceTodos);
router.get("/:id", TodoController.getTodoById);
router.patch("/:id", TodoController.updateTodo);
router.delete("/:id", TodoController.deleteTodo);
router.patch("/:id/reorder", TodoController.reorderTodo);

export default router;