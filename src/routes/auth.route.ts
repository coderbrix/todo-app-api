import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { AuthController } from "@/controllers/auth.controller";
import { validation } from "@/middlewares/validation.middleware";
import { forgotPasswordSchema, resetPassword, signInSchema, signUpSchema } from "@/validation/auth.schema";

const router = Router();
const controller = new AuthController();

router.post("/sign-up", controller.onUserSignUp.bind(controller));
router.post("/sign-in", controller.onUserSignIn.bind(controller));

router.get("/profile", auth, controller.onGetProfile.bind(controller));
router.post("/change-password", auth, controller.onChangePassword.bind(controller));
router.post("/logout", auth, controller.onLogout.bind(controller));

router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.post("/reset-password", controller.resetPassword.bind(controller));

export default router;
