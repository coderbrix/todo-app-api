import { AppException } from "@/core/exceptions/app.exception";

export class UserNotFound extends AppException {
  constructor(message: string = "User not found") {
    super({ message, error: "USER_NOT_FOUND", statusCode: 400 });
  }
}
