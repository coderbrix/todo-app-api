import { db } from "@/infrastructure/database";
import { CreateTodoInput } from "../types";

export class TodoService {
  // 1. Create Todo
  async createTodo(data: CreateTodoInput, userId: string) {
    const { title, description, dueDate, priority, workspaceId } = data;

    // Workspace Ownership Check (Uses 'workspaces' and 'user_id' from SQL)
    const workspaceCheck = await db.query(
      'SELECT id FROM workspaces WHERE id = $1 AND user_id = $2', 
      [workspaceId, userId]
    );

    if (workspaceCheck.rowCount === 0) {
      throw new Error("Unauthorized or Workspace not found");
    }

    // Calculate Position 
    const posResult = await db.query(
      'SELECT COALESCE(MAX(position), 0) + 1000 as next_pos FROM todos WHERE workspace_id = $1',
      [workspaceId]
    );
    const position = posResult.rows[0].next_pos;

    // Insert into 'todos' 
    const result = await db.query(
      `INSERT INTO todos (id, title, description, due_date, priority, workspace_id, user_id, position)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, dueDate, priority || "medium", workspaceId, userId, position]
    );

    return result.rows[0];
  }

  // 2. Get Workspace Todos (Filtering & Sorting)
  async getWorkspaceTodos(workspaceId: string, userId: string, queryParams: any) {
    const { status, sort } = queryParams;

    let query = `SELECT * FROM todos WHERE workspace_id = $1 AND user_id = $2`;
    const params: any[] = [workspaceId, userId];

    if (status === "completed") query += ` AND is_completed = true`;
    if (status === "pending") query += ` AND is_completed = false`;

    if (sort === "dueDate") {
      query += ` ORDER BY due_date ASC NULLS LAST`;
    } else if (sort === "priority") {
      query += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ASC`;
    } else {
      query += ` ORDER BY position ASC`;
    }

    const result = await db.query(query, params);
    return result.rows;
  }

  // 3. Get Single Todo
  async getTodoById(id: string, userId: string) {
    const result = await db.query('SELECT * FROM todos WHERE id = $1 AND user_id = $2', [id, userId]);

    if (result.rowCount === 0) throw new Error("Not found");
    return result.rows[0];
  }

  // 4. Update Todo / Toggle Status
  async updateTodo(id: string, updates: any, userId: string) {
    const keys = Object.keys(updates);
    const values = Object.values(updates);

    if (keys.length === 0) throw new Error("No updates provided");

    const keyMap: Record<string, string> = {
      isCompleted: "is_completed",
      dueDate: "due_date",
      workspaceId: "workspace_id"
    };

    const setClause = keys
      .map((key, i) => `"${keyMap[key] || key}" = $${i + 1}`)
      .join(", ");

    const result = await db.query(
      `UPDATE todos SET ${setClause}, updated_at = NOW()
       WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2}
       RETURNING *`,
      [...values, id, userId]
    );

    if (result.rowCount === 0) throw new Error("Todo not found or unauthorized");
    return result.rows[0];
  }

  // 5. Delete Todo
  async deleteTodo(id: string, userId: string) {
    const result = await db.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [id, userId]);

    if (result.rowCount === 0) throw new Error("Todo not found or unauthorized");
  }

  // 6. Reorder Todo
  async reorderTodo(id: string, newPosition: number, userId: string) {
    const result = await db.query(
      'UPDATE todos SET position = $1 WHERE id = $2 AND user_id = $3 RETURNING id', 
      [newPosition, id, userId]
    );

    if (result.rowCount === 0) throw new Error("Todo not found or unauthorized");
  }
}