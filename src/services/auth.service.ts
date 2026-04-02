import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "@/services/user.service";
import { UserNotFound } from "@/core/exceptions/user-not-found.exception";
import { InvalidCredential } from "@/core/exceptions/invalid-credential.exception";
import { appConfig } from "@/config/app.config";
import { MailService } from "./mail.service";

export class AuthService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  private generateToken(user: { id: number; name: string; email: string }) {
    return jwt.sign(user, appConfig.JWT.SECRET, {
      expiresIn: appConfig.JWT.EXPIRES_IN as string | number,
    });
  }

  async signUpUser(name: string, email: string, password: string) {
    if (!name || !email || !password) 
      throw new InvalidCredential("Name, email and password are required");

    const existing = await this.userService.findUserByEmail(email);
    if (existing) 
      throw new InvalidCredential("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return {
      user: safeUser,
      token,
    };
  }

  async signInUser(email: string, password: string) {
    if (!email || !password) {
      throw new InvalidCredential("Email and password are required");
    }

    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new InvalidCredential("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new InvalidCredential("Invalid email or password");

    const token = this.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      user: { ...user, password: undefined },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UserNotFound();

    return { ...user, password: undefined };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) 
      throw new InvalidCredential("Both current and new password are required");
    

    const user = await this.userService.findUserById(userId.toString());
    if (!user) throw new UserNotFound();

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new InvalidCredential("Current password is incorrect");
    

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(Number(userId), hashedPassword);

    return { message: "Password changed successfully" };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new InvalidCredential("Email not found");

    const token = jwt.sign({ id: user.id }, appConfig.JWT.SECRET as string, { expiresIn: "10m" });

    const resetLink = ``;

    await new MailService().sendResetPasswordEmail(email, resetLink);

    return { message: "Reset link sent to email" };
  }
}
