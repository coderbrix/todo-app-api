import { Request, Response, NextFunction } from "express";
import { UserService } from "@/services/user.service";

export class UserController {
  private userService = new UserService();

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const data = await this.userService.findUserById(user.id);

      return res.json({
        id: data?.id,
        name: data?.name,
        email: data?.email,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const updated = await this.userService.updateProfile(user.id, name);

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      await this.userService.deleteUser(user.id);

      return res.json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}