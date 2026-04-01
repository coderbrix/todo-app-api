import { Request, Response } from "express";
import { z } from "zod";
import { WorkspaceService, type WorkspaceSort } from "@/services/workspace.service";

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  icon: z.string().max(255).optional(),
  color: z.string().max(255).optional(),
});

const listWorkspacesQuerySchema = z.object({
  sort: z.enum(["latest", "oldest"]).optional(),
});

const ICON_FALLBACKS = ["workspace", "folder", "notes", "inbox", "tasks"];
const COLOR_FALLBACKS = ["#2563EB", "#F43F5E", "#10B981", "#F59E0B", "#8B5CF6", "#14B8A6"];

const getFallbackIcon = (name: string): string => {
  const total = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return ICON_FALLBACKS[total % ICON_FALLBACKS.length];
};

const getFallbackColor = (name: string): string => {
  const total = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return COLOR_FALLBACKS[total % COLOR_FALLBACKS.length];
};

export class WorkspaceController {
  private readonly workspaceService: WorkspaceService;

  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  onCreateWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = createWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, description, icon, color } = parsed.data;

    const created = await this.workspaceService.createWorkspace({
      userId,
      name,
      description: description ?? null,
      icon: icon ?? getFallbackIcon(name),
      color: color ?? getFallbackColor(name),
    });

    return res.status(201).json({ workspace: created });
  };

  onGetWorkspaces = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = listWorkspacesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid query",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const sort: WorkspaceSort = (parsed.data.sort ?? "latest") as WorkspaceSort;
    const workspaces = await this.workspaceService.getWorkspacesByUser(userId, sort);

    return res.status(200).json({ workspaces });
  };

  onDeleteWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const workspaceId = String(req.params.id ?? "").trim();
    if (!workspaceId) return res.status(400).json({ message: "Invalid workspace id" });

    const deleted = await this.workspaceService.deleteWorkspace(workspaceId, userId);
    if (!deleted) return res.status(404).json({ message: "Workspace not found" });

    return res.status(200).json({ deleted: true });
  };
}

