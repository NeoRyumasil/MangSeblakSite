import { db } from "../models/Database";
import type { InValue } from "@libsql/client";

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "admin" | "kasir" | "dapur" | "kurir";
};

export type CreateUserInput = Omit<User, "id">;

export const UserModel = {

  // Ambil semua user
  findAll: async (): Promise<User[]> => {
    const result = await db.execute("SELECT * FROM users");
    return result.rows as unknown as User[];
  },

  // Cari user by ID
  findById: async (id: number): Promise<User | null> => {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id],
    });
    return (result.rows[0] as unknown as User) ?? null;
  },

  // Cari user by email
  findByEmail: async (email: string): Promise<User | null> => {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    return (result.rows[0] as unknown as User) ?? null;
  },

  // Buat user baru
  create: async (input: CreateUserInput): Promise<void> => {
    await db.execute({
      sql: "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      args: [input.username, input.email, input.password, input.role],
    });
  },

  // Update user
  update: async (id: number, input: Partial<Omit<User, "id">>): Promise<void> => {
    const fields: string[] = [];
    const args: InValue[] = [];

    if (input.username !== undefined) { fields.push("username = ?"); args.push(input.username); }
    if (input.email    !== undefined) { fields.push("email = ?");    args.push(input.email); }
    if (input.password !== undefined) { fields.push("password = ?"); args.push(input.password); }
    if (input.role     !== undefined) { fields.push("role = ?");     args.push(input.role); }

    if (fields.length === 0) return;

    args.push(id);
    await db.execute({
      sql: `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });
  },

  // Hapus user
  delete: async (id: number): Promise<void> => {
    await db.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    });
  },
};