import { Request, Response } from "express";
import { getUserIdOrThrow } from "@/middlewares/auth.middleware";
import { WorkspaceService } from "@/services/workspace.service";
import {
  type CreateWorkspaceBody,
  type ListWorkspacesQuery,
  type WorkspaceIdParams,
} from "@/validation/workspace.schema";

export class WorkspaceController {
  private readonly workspaceService: WorkspaceService;

  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  onCreateWorkspace = async (req: Request<Record<string, never>, unknown, CreateWorkspaceBody>, res: Response) => {
    const userId = getUserIdOrThrow(req);

    const { name, description, icon, color } = req.body;

    const created = await this.workspaceService.createWorkspace({
      userId,
      name,
      description: description ?? null,
      icon,
      color,
    });

    return res.status(201).json({ workspace: created });
  };

  onGetWorkspaces = async (
    req: Request<Record<string, never>, unknown, unknown, ListWorkspacesQuery>,
    res: Response,
  ) => {
    const userId = getUserIdOrThrow(req);

    const { sort = "latest", createdFilter = "all" } = req.query;
    const workspaces = await this.workspaceService.getWorkspacesByUser(userId, {
      sort,
      createdFilter,
    });

    return res.status(200).json({ workspaces });
  };

  onGetWorkspaceById = async (req: Request<WorkspaceIdParams>, res: Response) => {
    const userId = getUserIdOrThrow(req);

    const { id: workspaceId } = req.params;
    const workspace = await this.workspaceService.getWorkspaceById(workspaceId, userId);

    return res.status(200).json({ workspace });
  };

  onDeleteWorkspace = async (req: Request<WorkspaceIdParams>, res: Response) => {
    const userId = getUserIdOrThrow(req);

    const { id: workspaceId } = req.params;
    await this.workspaceService.deleteWorkspace(workspaceId, userId);

    return res.status(200).json({ deleted: true });
  };
}
