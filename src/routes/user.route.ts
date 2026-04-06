import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { auth } from "@/middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

router.get("/me", auth, controller.getMe.bind(controller));
router.patch("/me", auth, controller.updateMe.bind(controller));
router.delete("/me", auth, controller.deleteMe.bind(controller));

export default router;