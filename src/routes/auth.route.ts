import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/sing-up", controller.onUserSignIn);
router.post("/email-verification", controller.onEmailVerification);
router.post("/sign-in", controller.onUserSignIn);
router.post("/forgot-password", controller.onForgotPassword);
router.get("/forgot-password-verification", controller.onForgotPassswordVerification);
router.post("/reset-password", controller.onResetPassword);
router.post("/change-password", controller.onChangePassword);
router.get("/profile", controller.onGetProfile);

export default router;
