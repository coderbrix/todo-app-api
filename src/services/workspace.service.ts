import { db } from "@/infrastructure/database";
import { Todo, Workspace } from "@/types";

export type WorkspaceSort = "latest" | "oldest";

export class WorkspaceService {
  async createWorkspace(input: {
    userId: number;
    name: string;
    description?: string | null;
    icon: string;
    color?: string | null;
  }): Promise<Workspace> {
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
      [input.name, input.description ?? null, input.icon, input.color ?? null, input.userId]
    );

    return result.rows[0];
  }

  async getWorkspacesByUser(
    userId: number,
    sort: WorkspaceSort
  ): Promise<Array<Workspace & { todos: Todo[] }>> {
    const dir = sort === "oldest" ? "ASC" : "DESC";

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

    const result = await db.query<WorkspaceTodoRow>(
      `
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
        WHERE w.user_id = $1
        ORDER BY w.created_at ${dir}, t.created_at ${dir}
      `,
      [userId]
    );

    const byId = new Map<string, Workspace & { todos: Todo[] }>();

    for (const row of result.rows) {
      const existing = byId.get(row.id);
      if (!existing) {
        byId.set(row.id, {
          id: row.id,
          name: row.name,
          description: row.description,
          icon: row.icon,
          color: row.color,
          userId,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          todos: [],
        });
      }

      if (row.todo_id) {
        byId.get(row.id)!.todos.push({
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
        });
      }
    }

    return Array.from(byId.values());
  }

  /**
   * Deletes a workspace owned by `userId`.
   * Note:  schema already defines `ON DELETE CASCADE` for `todos.workspace_id`,
   * so deleting a workspace will cascade-delete its todos.
   */
  async deleteWorkspace(workspaceId: string, userId: number): Promise<boolean> {
    const result = await db.query<{ id: string }>(
      `
        DELETE FROM workspaces
        WHERE id = $1 AND user_id = $2
        RETURNING id::text as id
      `,
      [workspaceId, userId]
    );

    return (result.rowCount ?? 0) > 0;
  }
}

