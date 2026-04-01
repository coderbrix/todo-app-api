import { Router } from "express";
import { WorkspaceController } from "@/controllers/workspace.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

const controller = new WorkspaceController();

router.post("/", authMiddleware, controller.onCreateWorkspace);
router.get("/", authMiddleware, controller.onGetWorkspaces);
router.delete("/:id", authMiddleware, controller.onDeleteWorkspace);

export default router;
