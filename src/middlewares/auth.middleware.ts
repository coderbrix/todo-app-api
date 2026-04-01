import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "@/config/app.config";

const jwtSecret = (appConfig.JWT.SECRET || "changeMe").toString();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken || null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      id: number;
      name: string;
      email: string;
    };

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};