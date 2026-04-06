import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/services/auth.service";
import { appConfig } from "@/config/app.config";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async onUserSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const { user, token } = await this.authService.signUpUser(name, email, password);

      res.cookie("accessToken", token, { httpOnly: true });

      return res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }

  async onUserSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.authService.signInUser(email, password);

      res.cookie("accessToken", token, { httpOnly: true });

      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  async onGetProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const profile = await this.authService.getProfile((user.id));
      return res.status(200).json({ profile });
    } catch (err) {
      next(err);
    }
  }

  async onChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const { currentPassword, newPassword } = req.body;

      const result = await this.authService.changePassword(user.id, currentPassword, newPassword);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async onLogout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Logged out" });
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      const result = await this.authService.resetPassword(token, newPassword);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
  
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      return res.status(200).json({message: result.message});
    } catch (err) {
      next(err);
    }
  }

  async onVerifyResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, callbackUrl } = req.query as {
        token: string;
        callbackUrl?: string;
      };

      await this.authService.verifyResetToken(token);

      const redirectUrl = callbackUrl || `http://localhost:3000/reset-password?token=${token}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  }
}
