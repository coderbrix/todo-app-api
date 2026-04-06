import { NextFunction, Request, Response } from "express";
import { AppException } from "@/core/exceptions/app.exception";
import { InternalServerException } from "@/core/exceptions/internal-server.exception";

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  console.log(error);
  if (error instanceof AppException) {
    res.status(error.statusCode).json(error);
    return;
  }

  res.status(500).json(new InternalServerException());
};
