import jwt from "jsonwebtoken";
import { appConfig } from "@/config/app.config";
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "@/core/exceptions/unauthorized.exception";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, appConfig.JWT.SECRET) as unknown as {
      id?: number | string;
      name?: string;
      email?: string;
    };

    const userIdRaw = payload?.id;
    const userId = typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;
    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: userId,
      name: payload?.name,
      email: payload?.email,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const getAccessToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  // Fallback: support cookie named `accessToken` without adding `cookie-parser`.
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const parts = cookieHeader.split(";").map((p) => p.trim());
  const accessTokenPart = parts.find((p) => p.startsWith("accessToken="));
  if (!accessTokenPart) return undefined;

  const rawValue = accessTokenPart.slice("accessToken=".length);
  return decodeURIComponent(rawValue);
};

export const getUserIdOrThrow = (req: Request): number => {
  if (!req.user?.id) throw new Unauthorized();
  return req.user.id;
};
