import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional(),
  icon: z.string().trim().max(255).optional(),
  color: z.string().trim().max(255).optional(),
});

export const listWorkspacesQuerySchema = z.object({
  sort: z.enum(["latest", "oldest"]).optional(),
  createdFilter: z.enum(["all", "today", "week", "month", "year"]).optional(),
});

export const workspaceIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

export type CreateWorkspaceBody = z.infer<typeof createWorkspaceSchema>;
export type ListWorkspacesQuery = z.infer<typeof listWorkspacesQuerySchema>;
export type WorkspaceIdParams = z.infer<typeof workspaceIdParamSchema>;
