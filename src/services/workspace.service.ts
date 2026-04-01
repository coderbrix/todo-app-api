import { db } from "@/infrastructure/database";
import { AppException } from "@/core/exceptions/app.exception";
import { Todo, Workspace } from "@/types";

export type WorkspaceSort = "latest" | "oldest";
export type WorkspaceCreatedFilter = "all" | "today" | "week" | "month" | "year";

const ICON_FALLBACKS = ["workspace", "folder", "notes", "inbox", "tasks"];
const COLOR_FALLBACKS = ["#2563EB", "#F43F5E", "#10B981", "#F59E0B", "#8B5CF6", "#14B8A6"];

const getNameHash = (name: string): number =>
  Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const pickFallbackByName = (name: string, values: string[]): string =>
  values[getNameHash(name) % values.length];

const getFallbackIcon = (name: string): string => pickFallbackByName(name, ICON_FALLBACKS);

const getFallbackColor = (name: string): string => pickFallbackByName(name, COLOR_FALLBACKS);

const getCreatedAtFilterSql = (createdFilter: WorkspaceCreatedFilter): string => {
  if (createdFilter === "today") return `AND w.created_at >= date_trunc('day', now())`;
  if (createdFilter === "week") return `AND w.created_at >= now() - interval '7 days'`;
  if (createdFilter === "month") return `AND w.created_at >= now() - interval '30 days'`;
  if (createdFilter === "year") return `AND w.created_at >= now() - interval '1 year'`;

  return "";
};

type WorkspaceWithTodos = Workspace & { todos: Todo[] };
type WorkspaceTodoRow = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  created_at: Date;
  updated_at: Date;
  todo_id: string | null;
  todo_title: string | null;
  todo_description: string | null;
  todo_is_completed: boolean | null;
  todo_start_date: Date | null;
  todo_due_date: Date | null;
  todo_created_at: Date | null;
  todo_updated_at: Date | null;
};

const createNotFoundError = () =>
  new AppException({
    statusCode: 404,
    message: "Workspace not found",
    error: "Not Found",
  });

const createDatabaseError = () =>
  new AppException({
    statusCode: 500,
    message: "Workspace operation failed",
    error: "Internal Server Error",
  });

const throwIfNotAppException = (error: unknown): never => {
  if (error instanceof AppException) throw error;
  throw createDatabaseError();
};

const buildWorkspaceTodoSelectQuery = (options?: {
  userId: number;
  workspaceId?: string;
  dir?: "ASC" | "DESC";
  createdFilterSql?: string;
}) => {
  const dir = options?.dir ?? "DESC";
  const createdFilterSql = options?.createdFilterSql ?? "";

  const whereParts = ["w.user_id = $1"];
  const values: Array<number | string> = [options?.userId ?? 0];

  if (options?.workspaceId) {
    whereParts.push("w.id = $2");
    values.push(options.workspaceId);
  }

  return {
    text: `
      SELECT
        w.id::text as id,
        w.name as name,
        w.description as description,
        w.icon as icon,
        w.color as color,
        w.created_at as created_at,
        w.updated_at as updated_at,
        t.id::text as todo_id,
        t.title as todo_title,
        t.description as todo_description,
        t.is_completed as todo_is_completed,
        t.start_date as todo_start_date,
        t.due_date as todo_due_date,
        t.created_at as todo_created_at,
        t.updated_at as todo_updated_at
      FROM workspaces w
      LEFT JOIN todos t
        ON t.workspace_id = w.id AND t.user_id = w.user_id
      WHERE ${whereParts.join(" AND ")}
      ${createdFilterSql}
      ORDER BY w.created_at ${dir}, t.created_at ${dir}
    `,
    values,
  };
};

const mapTodoFromRow = (row: WorkspaceTodoRow, userId: number): Todo | null => {
  if (!row.todo_id) return null;

  return {
    id: row.todo_id,
    title: row.todo_title ?? "",
    description: row.todo_description,
    isCompleted: Boolean(row.todo_is_completed),
    userId,
    workspaceId: row.id,
    startDate: row.todo_start_date,
    dueDate: row.todo_due_date,
    createdAt: row.todo_created_at!,
    updatedAt: row.todo_updated_at!,
  };
};

const mapRowsToWorkspaces = (rows: WorkspaceTodoRow[], userId: number): WorkspaceWithTodos[] => {
  const byId = new Map<string, WorkspaceWithTodos>();

  for (const row of rows) {
    let workspace = byId.get(row.id);
    if (!workspace) {
      workspace = {
        id: row.id,
        name: row.name,
        description: row.description,
        icon: row.icon,
        color: row.color,
        userId,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        todos: [],
      };
      byId.set(row.id, workspace);
    }

    const todo = mapTodoFromRow(row, userId);
    if (todo) workspace.todos.push(todo);
  }

  return Array.from(byId.values());
};

export class WorkspaceService {
  async createWorkspace(input: {
    userId: number;
    name: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
  }): Promise<Workspace> {
    try {
      const icon = input.icon?.trim() || getFallbackIcon(input.name);
      const color = input.color?.trim() || getFallbackColor(input.name);

      const result = await db.query<Workspace>(
        `
          INSERT INTO workspaces (name, description, icon, color, user_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING
            id::text,
            name,
            description,
            icon,
            color,
            user_id::int as "userId",
            created_at as "createdAt",
            updated_at as "updatedAt"
        `,
        [input.name, input.description ?? null, icon, color, input.userId]
      );

      return result.rows[0];
    } catch {
      throw createDatabaseError();
    }
  }

  async getWorkspacesByUser(
    userId: number,
    options: {
      sort: WorkspaceSort;
      createdFilter: WorkspaceCreatedFilter;
    }
  ): Promise<WorkspaceWithTodos[]> {
    const dir = options.sort === "oldest" ? "ASC" : "DESC";
    const createdFilterSql = getCreatedAtFilterSql(options.createdFilter);

    try {
      const query = buildWorkspaceTodoSelectQuery({ userId, dir, createdFilterSql });
      const result = await db.query<WorkspaceTodoRow>(query.text, query.values);

      return mapRowsToWorkspaces(result.rows, userId);
    } catch (error) {
      return throwIfNotAppException(error);
    }
  }

  async getWorkspaceById(workspaceId: string, userId: number): Promise<WorkspaceWithTodos> {
    try {
      const query = buildWorkspaceTodoSelectQuery({ userId, workspaceId, dir: "DESC" });
      const result = await db.query<WorkspaceTodoRow>(query.text, query.values);

      if (!result.rowCount) throw createNotFoundError();

      return mapRowsToWorkspaces(result.rows, userId)[0];
    } catch (error) {
      return throwIfNotAppException(error);
    }
  }

  /**
   * Deletes a workspace owned by `userId`.
   * Note:  schema already defines `ON DELETE CASCADE` for `todos.workspace_id`,
   * so deleting a workspace will cascade-delete its todos.
   */
  async deleteWorkspace(workspaceId: string, userId: number): Promise<void> {
    try {
      const result = await db.query<{ id: string }>(
        `
          DELETE FROM workspaces
          WHERE id = $1 AND user_id = $2
          RETURNING id::text as id
        `,
        [workspaceId, userId]
      );

      if (!result.rowCount) throw createNotFoundError();
    } catch (error) {
      return throwIfNotAppException(error);
    }
  }
}

