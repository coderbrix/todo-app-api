import { AppException } from "@/core/exceptions/app.exception";

export class EmailNotFound extends AppException {
  constructor(message: string = "Email not found") {
    super({ message, error: "EMAIL_NOT_FOUND", statusCode: 400 });
  }
}
