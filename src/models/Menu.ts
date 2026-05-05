import { db } from "./Database";

// ============================================================
// Types
// ============================================================

export type Menu = {
  id_makanan: number;
  nama_makanan: string;
  harga: number;
};

// ============================================================
// Model: MenuModel
// ============================================================

export const MenuModel = {
  // Ambil semua data menu
  getAll: async (): Promise<Menu[]> => {
    const result = await db.execute(
      "SELECT id_makanan, nama_makanan, harga FROM menu ORDER BY nama_makanan ASC"
    );
    return result.rows as unknown as Menu[];
  },

  // Ambil satu data menu berdasarkan ID
  getById: async (id: number): Promise<Menu | undefined> => {
    const result = await db.execute({
      sql: "SELECT id_makanan, nama_makanan, harga FROM menu WHERE id_makanan = ?",
      args: [id],
    });
    return result.rows[0] as unknown as Menu | undefined;
  },

  // Tambah menu baru
  create: async (nama_makanan: string, harga: number): Promise<void> => {
    await db.execute({
      sql: "INSERT INTO menu (nama_makanan, harga) VALUES (?, ?)",
      args: [nama_makanan, harga],
    });
  },

  // Update menu yang ada
  update: async (id: number, nama_makanan: string, harga: number): Promise<void> => {
    await db.execute({
      sql: "UPDATE menu SET nama_makanan = ?, harga = ? WHERE id_makanan = ?",
      args: [nama_makanan, harga, id],
    });
  },

  // Hapus menu
  delete: async (id: number): Promise<void> => {
    await db.execute({
      sql: "DELETE FROM menu WHERE id_makanan = ?",
      args: [id],
    });
  },
};