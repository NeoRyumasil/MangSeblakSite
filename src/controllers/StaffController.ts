import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { db } from "../models/Database";
import { StaffView } from "../views/pages/AdminPage";
import type { InValue } from "@libsql/client";

// ============================================================
// Types
// ============================================================

type Staff = {
  id: number;
  nama: string;
  username: string;
  role: "admin" | "kasir" | "dapur" | "kurir";
  no_hp: string;
  tanggal_bergabung: string;
  aktif: boolean;
};

type StaffRaw = Omit<Staff, "aktif"> & { aktif: number };

// ============================================================
// Helper
// ============================================================

const rowToStaff = (row: StaffRaw): Staff => ({
  id: row.id,
  nama: row.nama,
  username: row.username,
  role: row.role,
  no_hp: row.no_hp,
  tanggal_bergabung: row.tanggal_bergabung,
  aktif: row.aktif === 1,
});

const getAllStaff = async (): Promise<Staff[]> => {
  const result = await db.execute("SELECT * FROM users ORDER BY tanggal_bergabung DESC");
  return (result.rows as unknown as StaffRaw[]).map(rowToStaff);
};

// Pastikan nilai selalu InValue (tidak pernah undefined)[cite: 2]
const str = (v: unknown): InValue => (v != null ? String(v) : "");
const num = (v: unknown): InValue => Number(v);

// ============================================================
// Controller
// ============================================================

export const StaffController = new Elysia({ prefix: "/admin/staff" })
  .use(html())

  // GET /admin/staff[cite: 2]
  .get("/", async () => {
    const staff = await getAllStaff();
    return StaffView.HalamanStaff(staff);
  })

  // GET /admin/staff/registrasi[cite: 2]
  .get("/registrasi", () => StaffView.HalamanRegistrasi())

  // POST /admin/staff/registrasi[cite: 2]
  .post(
    "/registrasi",
    async ({ body, set }) => {
      const username = str(body.username);
      const nama     = str(body.nama);
      const email    = str(body.email);   // Optional -> "" jika kosong[cite: 2]
      const role     = str(body.role);
      const password = str(body.password);

      // Cek username duplikat[cite: 2]
      const existing = await db.execute({
        sql: "SELECT id FROM users WHERE username = ?",
        args: [username],
      });
      if (existing.rows.length > 0) {
        return StaffView.HalamanRegistrasi("Username sudah digunakan, pilih yang lain.");
      }

      const hashedPassword: InValue = await Bun.password.hash(String(password), {
        algorithm: "bcrypt",
        cost: 10,
      });

      const tanggal: InValue = new Date().toISOString().slice(0, 10);
      const no_hp: InValue = str(body.no_hp);

      await db.execute({
        sql: `INSERT INTO users (nama, username, email, password, role, no_hp, tanggal_bergabung, aktif)
              VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [nama, username, email, hashedPassword, role, no_hp, tanggal],
      });

      set.headers["HX-Redirect"] = "/admin/staff"; // Dukungan HTMX
      set.redirect = "/admin/staff";
      return; // Wajib dihentikan di sini
    },
    {
      body: t.Object({
        nama:     t.String({ minLength: 2 }),
        username: t.String({ minLength: 3 }),
        email:    t.Optional(t.String()),
        password: t.String({ minLength: 8 }),
        no_hp:    t.String({ minLength: 8 }),
        role:     t.Union([
          t.Literal("admin"),
          t.Literal("kasir"),
          t.Literal("dapur"),
          t.Literal("kurir"),
        ]),
      }),
    }
  )

  // GET /admin/staff/edit/:id[cite: 2]
  .get("/edit/:id", async ({ params }) => {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [num(params.id)],
    });
    const raw = result.rows[0] as unknown as StaffRaw | undefined;
    if (!raw) return "Staff tidak ditemukan.";
    return StaffView.HalamanEditStaff(rowToStaff(raw));
  })

  // POST /admin/staff/update/:id[cite: 2]
  .post(
    "/update/:id",
    async ({ params, body, set }) => {
      const id       = num(params.id);
      const username = str(body.username);
      const nama     = str(body.nama);
      const no_hp    = str(body.no_hp);
      const role     = str(body.role);

      // Cek username duplikat (kecuali diri sendiri)[cite: 2]
      const existing = await db.execute({
        sql: "SELECT id FROM users WHERE username = ? AND id != ?",
        args: [username, id],
      });
      if (existing.rows.length > 0) {
        const result = await db.execute({
          sql: "SELECT * FROM users WHERE id = ?",
          args: [id],
        });
        const raw = result.rows[0] as unknown as StaffRaw;
        return StaffView.HalamanEditStaff(
          rowToStaff(raw),
          "Username sudah digunakan oleh staff lain."
        );
      }

      // Kalau password diisi, hash ulang[cite: 2]
      const newPassword = body.password?.trim();
      if (newPassword && newPassword.length > 0) {
        const hashed: InValue = await Bun.password.hash(newPassword, {
          algorithm: "bcrypt",
          cost: 10,
        });
        await db.execute({
          sql: `UPDATE users SET nama = ?, username = ?, no_hp = ?, role = ?, password = ? WHERE id = ?`,
          args: [nama, username, no_hp, role, hashed, id],
        });
      } else {
        await db.execute({
          sql: `UPDATE users SET nama = ?, username = ?, no_hp = ?, role = ? WHERE id = ?`,
          args: [nama, username, no_hp, role, id],
        });
      }

      set.headers["HX-Redirect"] = "/admin/staff"; // Dukungan HTMX
      set.redirect = "/admin/staff";
      return; // Wajib dihentikan di sini
    },
    {
      body: t.Object({
        nama:     t.String({ minLength: 2 }),
        username: t.String({ minLength: 3 }),
        no_hp:    t.String({ minLength: 8 }),
        password: t.Optional(t.String()),
        role:     t.Union([
          t.Literal("admin"),
          t.Literal("kasir"),
          t.Literal("dapur"),
          t.Literal("kurir"),
        ]),
      }),
    }
  )

  // POST /admin/staff/aktifkan/:id[cite: 2]
  .post("/aktifkan/:id", async ({ params, set }) => {
    await db.execute({
      sql: "UPDATE users SET aktif = 1 WHERE id = ?",
      args: [num(params.id)],
    });
    set.headers["HX-Redirect"] = "/admin/staff"; // Dukungan HTMX
    set.redirect = "/admin/staff";
    return;
  })

  // POST /admin/staff/nonaktifkan/:id[cite: 2]
  .post("/nonaktifkan/:id", async ({ params, set }) => {
    await db.execute({
      sql: "UPDATE users SET aktif = 0 WHERE id = ?",
      args: [num(params.id)],
    });
    set.headers["HX-Redirect"] = "/admin/staff"; // Dukungan HTMX
    set.redirect = "/admin/staff";
    return;
  });