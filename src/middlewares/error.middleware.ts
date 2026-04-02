import { NextFunction, Request, Response } from "express";
import { AppException } from "@/core/exceptions/app.exception";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppException) {
    res.status(error.statusCode).json(error);
    return;
  }

  res.status(500).json({
    message: "Internal server error",
    error: "Internal Server Error",
  })
};
