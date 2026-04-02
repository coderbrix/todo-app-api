import { NextFunction, Request, Response } from "express";
import { AppException } from "@/core/exceptions/app.exception";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppException) {
    res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
      errors: error.errors ?? null,
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error",
    error: "Internal Server Error",
  });
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppException) {
    return res.status(err.statusCode).json({ error: err.error, message: err.message, details: err.errors });
  }

  console.error(err);
  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: err.message || "Something went wrong" });
};
