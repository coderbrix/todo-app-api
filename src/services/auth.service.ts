import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "@/services/user.service";
import { UserNotFound } from "@/core/exceptions/user-not-found.exception";
import { InvalidCredential } from "@/core/exceptions/invalid-credential.exception";
import { appConfig } from "@/config/app.config";

const jwtSecret = (appConfig.JWT.SECRET || "changeMe").toString();
const jwtExpiry = appConfig.JWT.EXPIRES_IN || "1h";

export class AuthService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  private generateToken(user: { id: number; name: string; email: string }) {
    return jwt.sign(user, jwtSecret, {
      expiresIn: jwtExpiry as string | number,
    });
  }

  async signUpUser(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new InvalidCredential("Name, email and password are required");
    }

    const existing = await this.userService.findUserByEmail(email);
    if (existing) {
      throw new InvalidCredential("Email already registered");
    }

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

    return {
      user: { ...user, password: undefined },
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

  async getProfile(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UserNotFound();

    return { ...user, password: undefined };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UserNotFound();

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new InvalidCredential("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await this.userService.updatePassword(userId, hashedPassword);
    if (!updated) throw new UserNotFound();

    return { message: "Password changed successfully" };
  }
}
