import { createClient } from "@libsql/client";

// Cek ENV
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL tidak ditemukan di .env");
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN tidak ditemukan di .env");
}

// Connect ke database
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});