import { AppException } from "@/core/exceptions/app.exception";

export class Unauthorized extends AppException {
  constructor(message: string = "Unauthorized") {
    super({ message, error: "UNAUTHORIZED_USER", statusCode: 401 });
  }
}
