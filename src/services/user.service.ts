import { db } from "@/infrastructure/database";
import { CreateUserInput, User } from "@/types";

export class UserService {
  async createUser({ name, email, password }: CreateUserInput): Promise<User> {
    const result = await db.query<User>(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, email, password]
    );

    return result.rows[0];
  }

  async findUserById(userId: number): Promise<User | null> {
    const result = await db.query<User>(
      `
      SELECT
        id::int as "id",
        name,
        email,
        password,
        email_verified as "emailVerified",
        email_verified_at as "emailVerifiedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [userId]
    );

    return result.rows[0] ?? null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await db.query<User>(
      `
      SELECT
        id::int as "id",
        name,
        email,
        password,
        email_verified as "emailVerified",
        email_verified_at as "emailVerifiedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email]
    );

    return result.rows[0] ?? null;
  }

  async updateProfile(userId: number, name: string) {
    const result = await db.query(
      `
      UPDATE users
      SET name = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email
      `,
      [name, userId]
    );

    return result.rows[0];
  }

  async deleteUser(userId: number) {
    await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [userId]
    );
  }
  async updatePassword(userId: number, hashedPassword: string) {
    await db.query(
      `
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [hashedPassword, userId]
    );  
  }  
}