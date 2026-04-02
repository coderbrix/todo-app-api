import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { AuthController } from "@/controllers/auth.controller";
import { validation } from "@/middlewares/validation.middleware";
import { forgotPasswordSchema, resetPassword, signInSchema, signUpSchema } from "@/validation/auth.schema";

const router = Router();
const controller = new AuthController();

router.post("/sign-up", validation(signUpSchema), controller.onUserSignUp.bind(controller));
router.post("/sign-in", validation(signInSchema), controller.onUserSignIn.bind(controller));
router.get("/profile", auth, controller.onGetProfile.bind(controller));
router.post("/change-password", auth, controller.onChangePassword.bind(controller));
router.post("/logout", auth, controller.onLogout.bind(controller));
router.post("/forgot-password", validation(forgotPasswordSchema), controller.resetPassword.bind(controller));
router.post("/reset-password", validation(resetPassword), controller.resetPassword.bind(controller));

export default router;
