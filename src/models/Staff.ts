// file: models/Staff.ts
import { db } from "./Database";

export type Staff = {
  id: number;
  nama: string;
  username: string;
  role: "admin" | "kasir" | "dapur" | "kurir";
  no_hp: string;
  tanggal_bergabung: string;
  aktif: boolean;
};

// Fungsi helper untuk mapping hasil database ke tipe Staff
const rowToStaff = (row: any): Staff => ({
  id: row.id as number,
  nama: row.nama as string,
  username: row.username as string,
  role: row.role as "admin" | "kasir" | "dapur" | "kurir",
  no_hp: row.no_hp as string,
  tanggal_bergabung: row.tanggal_bergabung as string,
  aktif: row.aktif === 1,
});

export const StaffModel = {
  // Ambil semua data staff (spesifik kolom yang dibutuhkan)
  getAll: async (): Promise<Staff[]> => {
    const result = await db.execute(
      "SELECT id, nama, username, role, no_hp, tanggal_bergabung, aktif FROM users ORDER BY tanggal_bergabung DESC"
    );
    return result.rows.map(rowToStaff);
  },

  // Ambil satu data staff berdasarkan ID
  getById: async (id: number): Promise<Staff | undefined> => {
    const result = await db.execute({
      sql: "SELECT id, nama, username, role, no_hp, tanggal_bergabung, aktif FROM users WHERE id = ?",
      args: [id],
    });
    if (result.rows.length === 0) return undefined;
    return rowToStaff(result.rows[0]);
  },

  // Cek apakah username sudah ada (untuk validasi registrasi/edit)
  checkUsernameExists: async (username: string, excludeId?: number): Promise<boolean> => {
    if (excludeId) {
      const result = await db.execute({
        sql: "SELECT id FROM users WHERE username = ? AND id != ?",
        args: [username, excludeId],
      });
      return result.rows.length > 0;
    }
    const result = await db.execute({
      sql: "SELECT id FROM users WHERE username = ?",
      args: [username],
    });
    return result.rows.length > 0;
  },

  // Tambah staff baru
  create: async (data: any): Promise<void> => {
    await db.execute({
      sql: `INSERT INTO users (nama, username, email, password, role, no_hp, tanggal_bergabung, aktif)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [data.nama, data.username, data.email || "", data.password, data.role, data.no_hp, data.tanggal_bergabung],
    });
  },

  // Update data staff (beserta pengecekan jika ada password baru)
  update: async (id: number, data: any): Promise<void> => {
    if (data.password) {
      await db.execute({
        sql: `UPDATE users SET nama = ?, username = ?, no_hp = ?, role = ?, password = ? WHERE id = ?`,
        args: [data.nama, data.username, data.no_hp, data.role, data.password, id],
      });
    } else {
      await db.execute({
        sql: `UPDATE users SET nama = ?, username = ?, no_hp = ?, role = ? WHERE id = ?`,
        args: [data.nama, data.username, data.no_hp, data.role, id],
      });
    }
  },

  // Update status keaktifan (1 = Aktif, 0 = Non-aktif)
  updateStatus: async (id: number, statusAktif: number): Promise<void> => {
    await db.execute({
      sql: "UPDATE users SET aktif = ? WHERE id = ?",
      args: [statusAktif, id],
    });
  },
};