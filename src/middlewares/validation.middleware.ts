import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppException } from "@/core/exceptions/app.exception";

type ValidationSource = "body" | "query" | "params";

export const validation = <T extends z.ZodTypeAny>(schema: T, source: ValidationSource) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      const flattenedErrors = parsed.error.flatten().fieldErrors;
      const errors = Object.fromEntries(
        Object.entries(flattenedErrors).filter(([, value]) => Array.isArray(value))
      ) as Record<string, string[]>;

      next(
        new AppException({
          statusCode: 400,
          message: "Validation failed",
          error: "Bad Request",
          errors,
        })
      );
      return;
    }

    (req as Request & { [key in ValidationSource]?: unknown })[source] = parsed.data;
    next();
  };
};
