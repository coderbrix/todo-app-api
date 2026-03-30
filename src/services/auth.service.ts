import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "@/services/user.service";
import { UserNotFound } from "@/core/exceptions/user-not-found.exception";
import { InvalidCredential } from "@/core/exceptions/invalid-credential.exception";
import { appConfig } from "@/config/app.config";

export class AuthService {
  private readonly userService;

  constructor() {
    this.userService = new UserService();
  }

  async signInUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new InvalidCredential("Invalid email address");

    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) throw new InvalidCredential("Invalid email or password");

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, appConfig.JWT.SECRET, { expiresIn: appConfig.JWT.EXPIRES_IN });

    return { user, token };
  }
}
