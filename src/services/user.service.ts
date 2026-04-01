import { db } from "@/infrastructure/database";
import { User } from "@/types";

export class UserService {
  constructor() {}

  async createUser() {
    throw new Error("Not implemented");
  }

  async findUserById(userId: string): Promise<User | null> {
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
      [Number(userId)]
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
}
