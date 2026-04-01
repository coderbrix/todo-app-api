import { Router } from "express";
import { WorkspaceController } from "@/controllers/workspace.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validation } from "@/middlewares/validation.middleware";
import {
  createWorkspaceSchema,
  listWorkspacesQuerySchema,
  workspaceIdParamSchema,
} from "@/middlewares/workspace.validation";

const router = Router();

const controller = new WorkspaceController();

router.post("/", authMiddleware, validation(createWorkspaceSchema, "body"), controller.onCreateWorkspace);
router.get("/", authMiddleware, validation(listWorkspacesQuerySchema, "query"), controller.onGetWorkspaces);
router.get(
  "/:id",
  authMiddleware,
  validation(workspaceIdParamSchema, "params"),
  controller.onGetWorkspaceById
);
router.delete(
  "/:id",
  authMiddleware,
  validation(workspaceIdParamSchema, "params"),
  controller.onDeleteWorkspace
);

export default router;
