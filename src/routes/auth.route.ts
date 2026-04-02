import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();
const controller = new AuthController();

router.post("/sign-up", (req, res, next) => controller.onUserSignUp(req, res, next));
router.post("/sign-in", (req, res, next) => controller.onUserSignIn(req, res, next));

router.get("/profile", authMiddleware, (req, res, next) =>
  controller.onGetProfile(req, res, next)
);

router.post("/change-password", authMiddleware, (req, res, next) =>
  controller.onChangePassword(req, res, next)
);

router.post("/logout", (req, res) => controller.onLogout(req, res));

export default router;