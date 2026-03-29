import { UserService } from "@/services/user.service";

export class AuthService {
  private readonly userService;

  constructor() {
    this.userService = new UserService();
  }

  async signInUser(email: string, password: string) {}
}
