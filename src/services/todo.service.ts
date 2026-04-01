// services/todo.service.ts
import pool from '../config/db';
import { CreateTodoInput } from '../types';

export const TodoService = {
  async createTodo(data: CreateTodoInput, userId: string) {
    const { title, description, dueDate, priority, workspaceId } = data;

    const workspaceCheck = await pool.query(
      'SELECT id FROM "Workspace" WHERE id = $1 AND "userId" = $2',
      [workspaceId, userId]
    );

    if (workspaceCheck.rowCount === 0) {
      throw new Error("Unauthorized or Workspace not found");
    }

    const posResult = await pool.query(
      'SELECT COALESCE(MAX(position), 0) + 1000 as next_pos FROM "Todo" WHERE "workspaceId" = $1',
      [workspaceId]
    );

    const position = posResult.rows[0].next_pos;

    const result = await pool.query(
      `INSERT INTO "Todo" (id, title, description, "dueDate", priority, "workspaceId", "userId", position)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, dueDate, priority || 'medium', workspaceId, userId, position]
    );

    return result.rows[0];
  },

  async getWorkspaceTodos(workspaceId: string, userId: string, queryParams: any) {
    const { status, sort } = queryParams;

    let query = `SELECT * FROM "Todo" WHERE "workspaceId" = $1 AND "userId" = $2`;
    const params: any[] = [workspaceId, userId];

    if (status === 'completed') query += ` AND "isCompleted" = true`;
    if (status === 'pending') query += ` AND "isCompleted" = false`;

    if (sort === 'dueDate') query += ` ORDER BY "dueDate" ASC NULLS LAST`;
    else if (sort === 'priority') {
      query += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ASC`;
    } else {
      query += ` ORDER BY position ASC`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getTodoById(id: string, userId: string) {
    const result = await pool.query(
      'SELECT * FROM "Todo" WHERE id = $1 AND "userId" = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("Not found");
    }

    return result.rows[0];
  },

  async updateTodo(id: string, updates: any, userId: string) {
    const keys = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE "Todo" SET ${setClause}, "updatedAt" = NOW()
       WHERE id = $${keys.length + 1} AND "userId" = $${keys.length + 2}
       RETURNING *`,
      [...values, id, userId]
    );

    return result.rows[0];
  },

  async deleteTodo(id: string, userId: string) {
    await pool.query(
      'DELETE FROM "Todo" WHERE id = $1 AND "userId" = $2',
      [id, userId]
    );
  },

  async reorderTodo(id: string, newPosition: number, userId: string) {
    await pool.query(
      'UPDATE "Todo" SET position = $1 WHERE id = $2 AND "userId" = $3',
      [newPosition, id, userId]
    );
  }
};