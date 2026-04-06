import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().max(100),
  password: z.string().max(20),
});

export const signUpSchema = z.object({
  name: z.string().min(3).max(150),
  email: z.email().max(100),
  password: z.string().max(20),
});

export const forgotPasswordSchema = z.object({
  email: z.email().max(100),
});

export const resetPassword = z.object({
  password: z.string().min(8).max(20),
  token: z.string(),
});
