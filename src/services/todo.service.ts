import { db } from "@/infrastructure/database";
import { CreateTodoInput } from "../types";

export class TodoService {
  //create todo
  async createTodo(data: CreateTodoInput, userId: string) {
    const { title, description, dueDate, priority, workspaceId } = data;

    // Workspace Ownership Check
    const workspaceCheck = await db.query('SELECT id FROM "Workspace" WHERE id = $1 AND "userId" = $2', [
      workspaceId,
      userId,
    ]);

    if (workspaceCheck.rowCount === 0) {
      throw new Error("Unauthorized or Workspace not found");
    }

    // Calculate Position for Re-ordering (Requirement 7)
    const posResult = await db.query(
      'SELECT COALESCE(MAX(position), 0) + 1000 as next_pos FROM "Todo" WHERE "workspaceId" = $1',
      [workspaceId],
    );

    const position = posResult.rows[0].next_pos;

    const result = await db.query(
      `INSERT INTO "Todo" (id, title, description, "dueDate", priority, "workspaceId", "userId", position)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, dueDate, priority || "medium", workspaceId, userId, position],
    );

    return result.rows[0];
  }

  // get Workspace Todos (Filtering & Sorting)
  async getWorkspaceTodos(workspaceId: string, userId: string, queryParams: any) {
    const { status, sort } = queryParams;

    let query = `SELECT * FROM "Todo" WHERE "workspaceId" = $1 AND "userId" = $2`;
    const params: any[] = [workspaceId, userId];

    // Requirement 2: Filtering
    if (status === "completed") query += ` AND "isCompleted" = true`;
    if (status === "pending") query += ` AND "isCompleted" = false`;

    // Requirement 2: Sorting
    if (sort === "dueDate") {
      query += ` ORDER BY "dueDate" ASC NULLS LAST`;
    } else if (sort === "priority") {
      query += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ASC`;
    } else {
      query += ` ORDER BY position ASC`;
    }

    const result = await db.query(query, params);
    return result.rows;
  }

  //get Single Todo
  async getTodoById(id: string, userId: string) {
    const result = await db.query('SELECT * FROM "Todo" WHERE id = $1 AND "userId" = $2', [id, userId]);

    if (result.rowCount === 0) {
      throw new Error("Not found");
    }

    return result.rows[0];
  }

  //update Todo / Toggle Status
  async updateTodo(id: string, updates: any, userId: string) {
    const keys = Object.keys(updates);
    const values = Object.values(updates);

    if (keys.length === 0) throw new Error("No updates provided");

    const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");

    const result = await db.query(
      `UPDATE "Todo" SET ${setClause}, "updatedAt" = NOW()
       WHERE id = $${keys.length + 1} AND "userId" = $${keys.length + 2}
       RETURNING *`,
      [...values, id, userId],
    );

    if (result.rowCount === 0) throw new Error("Todo not found or unauthorized");
    return result.rows[0];
  }

  //delete Todo
  async deleteTodo(id: string, userId: string) {
    const result = await db.query('DELETE FROM "Todo" WHERE id = $1 AND "userId" = $2', [id, userId]);

    if (result.rowCount === 0) throw new Error("Todo not found or unauthorized");
  }

  //reorder Todo
  async reorderTodo(id: string, newPosition: number, userId: string) {
    const result = await db.query('UPDATE "Todo" SET position = $1 WHERE id = $2 AND "userId" = $3 RETURNING id', [
      newPosition,
      id,
      userId,
    ]);

    if (result.rowCount === 0) throw new Error("Todo not found or unauthorized");
  }
}
