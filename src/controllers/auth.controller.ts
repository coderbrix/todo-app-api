import { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async onUserSignUp() {}
  async onEmailVerification() {}
  async onUserSignIn(req: Request, res: Response) {
    const { email, password } = req.body;
    await this.authService.signInUser(email, password);
  }
  async onForgotPassword() {}
  async onForgotPassswordVerification() {}
  async onResetPassword() {}
  async onChangePassword() {}
  async onGetProfile() {}
}
