import { AppException } from "@/core/exceptions/app.exception";

export class InvalidCredential extends AppException {
  constructor(message: string = "Invalid Credentials") {
    super({ message, error: "INVALID_CREDENTIALS", statusCode: 400 });
  }
}
