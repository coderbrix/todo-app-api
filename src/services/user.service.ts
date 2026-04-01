import { User } from "@/types";

const users: User[] = [];
let nextId = 1;

export class UserService {
  constructor() {}

  async createUser(data: { name: string; email: string; password: string }): Promise<User> {
    const found = users.find((user) => user.email.toLowerCase() === data.email.toLowerCase());
    if (found) {
      throw new Error("User already exists");
    }

    const user: User = {
      id: nextId++,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
    };

    users.push(user);
    return { ...user };
  }

  async findUserById(userId: string | number): Promise<User | null> {
    const id = Number(userId);
    const user = users.find((item) => item.id === id);
    return user ? { ...user } : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === normalized);
    return user ? { ...user } : null;
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<User | null> {
    const idx = users.findIndex((item) => item.id === userId);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], password: hashedPassword };
    return { ...users[idx] };
  }
}
