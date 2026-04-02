import { AppException } from "@/core/exceptions/app.exception";

export class NotFoundException extends AppException {
  constructor(message: string = "Not found!") {
    super({ message, error: "NOT_FOUND", statusCode: 404 });
  }
}
