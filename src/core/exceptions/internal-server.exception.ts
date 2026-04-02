import { AppException } from "@/core/exceptions/app.exception";

export class InternalServerException extends AppException {
  constructor(message: string = "Internal Server Error") {
    super({ message, error: "INTERNAL_SERVER_ERROR", statusCode: 500 });
  }
}
