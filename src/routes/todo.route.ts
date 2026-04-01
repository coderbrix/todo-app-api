import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';

const router = Router();

router.post('/todos', TodoController.createTodo);
router.get('/workspaces/:workspaceId/todos', TodoController.getWorkspaceTodos);
router.get('/todos/:id', TodoController.getTodoById);
router.patch('/todos/:id', TodoController.updateTodo); // Handles both Update & Complete
router.delete('/todos/:id', TodoController.deleteTodo);
router.patch('/todos/:id/reorder', TodoController.reorderTodo);

export default router;