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
    const result = await db.execute({
      sql: "SELECT id_barang, nama, harga, stok FROM barang WHERE id_barang = ?",
      args: [id]
    });
    // Menggunakan optional chaining (?.) untuk mencegah error undefined
    return result.rows?.[0] as unknown as Barang | undefined; 
  },

  // Tambah barang baru
  create: async (nama: string, harga: number, stok: number): Promise<void> => {
    await db.execute({
      sql: "INSERT INTO barang (nama, harga, stok) VALUES (?, ?, ?)",
      args: [nama, harga, stok]
    });
  },

  // Update barang yang ada
  update: async (id: number, nama: string, harga: number, stok: number): Promise<void> => {
    await db.execute({
      sql: "UPDATE barang SET nama = ?, harga = ?, stok = ? WHERE id_barang = ?",
      args: [nama, harga, stok, id]
    });
  },

  // Hapus barang
  delete: async (id: number): Promise<void> => {
    await db.execute({
      sql: "DELETE FROM barang WHERE id_barang = ?",
      args: [id]
    });
  },

  // Fungsi baru: Kurangi stok berdasarkan nama item dari menu
  // Fungsi baru: Kurangi stok berdasarkan nama item dari menu
  kurangiStokByNama: async (namaMenu: string, qty: number): Promise<void> => {
    
    let keyword = namaMenu;

    // Aturan Khusus: Jika nama menu mengandung kata "seblak" (huruf besar/kecil bebas),
    // maka kita paksa pencarian untuk memotong stok barang yang namanya ada kata "seblak"
    if (namaMenu.toLowerCase().includes("seblak")) {
      keyword = "seblak";
    }

    // Mencari barang menggunakan LOWER() agar tidak sensitif huruf besar/kecil
    const result = await db.execute({
      sql: "SELECT id_barang FROM barang WHERE LOWER(nama) LIKE '%' || ? || '%'",
      args: [keyword.toLowerCase()],
    });

    // Pastikan rows ada dan tidak kosong
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as any; 
      const id_barang = row.id_barang as number;
      
      // Kurangi stok sesuai quantity pesanan
      await db.execute({
        sql: "UPDATE barang SET stok = stok - ? WHERE id_barang = ?",
        args: [qty, id_barang],
      });
    }
  },
};