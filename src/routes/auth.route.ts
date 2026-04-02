import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { AuthController } from "@/controllers/auth.controller";
import { validation } from "@/middlewares/validation.middleware";
import { forgotPasswordSchema, resetPassword, signInSchema, signUpSchema } from "@/validation/auth.schema";

const router = Router();
const controller = new AuthController();

router.post("/sign-up", controller.onUserSignUp.bind(controller));
router.post("/sign-in",  controller.onUserSignIn.bind(controller));
router.post("/logout",  controller.onLogout.bind(controller));
router.post("/forgot-password",authMiddleware, controller.forgotPassword.bind(controller));
router.post("/reset-password", controller.resetPassword.bind(controller));
router.post("/change-password", authMiddleware,controller.onChangePassword.bind(controller));
router.get("/profile", authMiddleware, controller.onGetProfile.bind(controller));

export default router;
