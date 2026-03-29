import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import workspaceRoutes from "./workspace.route";
import todoRoutes from "./todo.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/todos", todoRoutes);
router.get("/health", (req, res) => {
  res.send({ ok: 1 });
});

export default router;
