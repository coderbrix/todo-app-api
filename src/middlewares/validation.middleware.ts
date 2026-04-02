import { z } from "zod";
import { ValidationSource } from "@/types";
import { NextFunction, Request, Response } from "express";
import { ValidationException } from "@/core/exceptions/validation.exception";

export const validation = <T extends z.ZodTypeAny>(schema: T, source: ValidationSource = "body") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      const flattenedErrors = parsed.error.flatten().fieldErrors;
      const errors = Object.fromEntries(
        Object.entries(flattenedErrors).filter(([, value]) => Array.isArray(value)),
      ) as Record<string, string[]>;

      next(new ValidationException(errors));
      return;
    }

    (req as Request & { [key in ValidationSource]?: unknown })[source] = parsed.data;
    next();
  };
};
