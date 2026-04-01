import { NextFunction, Request, Response } from "express";
import { AppException } from "@/core/exceptions/app.exception";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppException) {
    return res.status(err.statusCode).json({ error: err.error, message: err.message, details: err.errors });
  }

  console.error(err);
  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: err.message || "Something went wrong" });
};
