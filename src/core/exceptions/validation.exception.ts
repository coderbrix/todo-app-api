import { AppException } from "@/core/exceptions/app.exception";

export class ValidationException extends AppException {
  constructor(errors: null | Record<string, string[]>, message: string = "Validation failed") {
    super({ message, error: "VALIDATION_FAILED", errors: errors, statusCode: 400 });
  }
}
