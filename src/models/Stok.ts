import { db } from "./Database";

// ============================================================
// Types
// ============================================================

export type Barang = {
  id_barang: number;
  nama: string;
  harga: number;
  stok: number;
};

// ============================================================
// Model: StokModel
// ============================================================

export const StokModel = {
  // Ambil semua data barang
  getAll: async (): Promise<Barang[]> => {
    const result = await db.execute(
      "SELECT id_barang, nama, harga, stok FROM barang ORDER BY nama ASC"
    );
    return result.rows as unknown as Barang[];
  },

  // Ambil satu data barang berdasarkan ID
  getById: async (id: number): Promise<Barang | undefined> => {
    const result = await db.execute(
      "SELECT id_barang, nama, harga, stok FROM barang WHERE id_barang = ?",
      [id]
    );
    return result.rows[0] as unknown as Barang | undefined;
  },

  // Tambah barang baru
  create: async (nama: string, harga: number, stok: number): Promise<void> => {
    await db.execute(
      `INSERT INTO barang (nama, harga, stok) VALUES (?, ?, ?)`,
      [nama, harga, stok]
    );
  },

  // Update barang yang ada
  update: async (id: number, nama: string, harga: number, stok: number): Promise<void> => {
    await db.execute(
      `UPDATE barang SET nama = ?, harga = ?, stok = ? WHERE id_barang = ?`,
      [nama, harga, stok, id]
    );
  },

  // Hapus barang
  delete: async (id: number): Promise<void> => {
    await db.execute("DELETE FROM barang WHERE id_barang = ?", [id]);
  },
};