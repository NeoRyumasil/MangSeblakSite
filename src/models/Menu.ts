import { db } from "./Database";

// Model Menu
export type Menu = {
  id_makanan: number;
  nama_makanan: string;
  harga: number;
  ImagePath: string;
};

// SQL untuk Model Menu
export const MenuModel = {
  
  // Ambil semua data menu
  getAll: async (): Promise<Menu[]> => {
    const result = await db.execute(`
      SELECT id_makanan, nama_makanan, harga, ImagePath 
      FROM menu 
      ORDER BY 
        CASE 
          WHEN LOWER(nama_makanan) LIKE '%bundling%' THEN 1
          WHEN LOWER(nama_makanan) LIKE '%seblak%' THEN 2
          WHEN LOWER(nama_makanan) LIKE '%air%' OR LOWER(nama_makanan) LIKE '%minum%' OR LOWER(nama_makanan) LIKE '%es%' THEN 3
          ELSE 4
        END ASC,
        nama_makanan ASC
    `);
    return result.rows as unknown as Menu[];
  },

  // Ambil data berdasarkan ID
  getById: async (id: number): Promise<Menu | undefined> => {
    const result = await db.execute({
      sql: "SELECT id_makanan, nama_makanan, harga, ImagePath FROM menu WHERE id_makanan = ?",
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