interface AppErrorProps {
  message: string;
  error?: string;
  statusCode: number;
  errors?: null | Record<string, string[]>;
}

export class AppException extends Error {
  public readonly error?: string;
  public readonly message: string;
  public readonly statusCode: number;
  public readonly errors?: null | Record<string, string[]>;

  constructor({ message, error, statusCode, errors }: AppErrorProps) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this);
  }
}
