// file: models/Pesanan.ts
import { db } from "./Database";

export type Pesanan = {
  id_pesanan: number;
  no_antrian: number;
  nama: string;
  items: string;       // Disimpan dalam bentuk JSON string
  total_harga: number;
  status: string;      
  status_bayar: number; // 0 = Belum Lunas, 1 = Lunas 
  no_hp: string;
};

export type CreatePesananDTO = {
  no_antrian: number;
  nama: string;
  no_hp: string;
  items: string;
  total_harga: number;
};

export const PesananModel = {
  create: async (data: CreatePesananDTO): Promise<void> => {
    await db.execute({
      sql: `INSERT INTO pesanan (no_antrian, nama, no_hp, items, total_harga, status, status_bayar) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.no_antrian, 
        data.nama, 
        data.no_hp, 
        data.items, 
        data.total_harga, 
        "Menunggu",  // Default status masakan
        0            // Default status bayar (0 = Belum, 1 = Sudah)
      ],
    });
  },

  getAll: async (): Promise<Pesanan[]> => {
    const result = await db.execute(
      "SELECT id_pesanan, no_antrian, nama, items, total_harga, status, status_bayar, no_hp FROM pesanan ORDER BY id_pesanan DESC"
    );
    return result.rows as unknown as Pesanan[];
  },

  getById: async (id: number): Promise<Pesanan | undefined> => {
    const result = await db.execute({
      sql: "SELECT * FROM pesanan WHERE id_pesanan = ?",
      args: [id],
    });
    return result.rows[0] as unknown as Pesanan | undefined;
  },

  updateStatus: async (id: number, statusBaru: string): Promise<void> => {
    await db.execute({
      sql: "UPDATE pesanan SET status = ? WHERE id_pesanan = ?",
      args: [statusBaru, id],
    });
  },

  updateStatusBayar: async (id: number, statusBayarBaru: number): Promise<void> => {
    await db.execute({
      sql: "UPDATE pesanan SET status_bayar = ? WHERE id_pesanan = ?",
      args: [statusBayarBaru, id],
    });
  },

  delete: async (id: number): Promise<void> => {
    await db.execute({
      sql: "DELETE FROM pesanan WHERE id_pesanan = ?",
      args: [id],
    });
  },
};