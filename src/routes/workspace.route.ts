import { Router } from "express";
import { WorkspaceController } from "@/controllers/workspace.controller";
import { auth } from "@/middlewares/auth.middleware";
import { validation } from "@/middlewares/validation.middleware";
import {
  createWorkspaceSchema,
  listWorkspacesQuerySchema,
  workspaceIdParamSchema,
} from "@/validation/workspace.schema";

const router = Router();

const controller = new WorkspaceController();

router.post("/", auth, validation(createWorkspaceSchema), controller.onCreateWorkspace);
router.get("/", auth, validation(listWorkspacesQuerySchema, "query"), controller.onGetWorkspaces);
router.get("/:id", auth, validation(workspaceIdParamSchema, "params"), controller.onGetWorkspaceById);
router.delete("/:id", auth, validation(workspaceIdParamSchema, "params"), controller.onDeleteWorkspace);

export default router;
