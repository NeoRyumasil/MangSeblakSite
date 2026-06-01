import { db } from "./Database";

// Model Pesanan
export type Pesanan = {
  id_pesanan: number;
  no_antrian: number;
  nama: string;
  items: string;       
  total_harga: number;
  status: string;      
  status_bayar: string; 
  no_hp: string;
  alamat?: string;    
  status_makanan?: string; 
};

// Model DTO Pesanan Baru
export type CreatePesananDTO = {
  no_antrian: number;
  nama: string;
  no_hp: string;
  items: string;
  total_harga: number;
  alamat?: string; 
};

// SQL untuk Model Pesanan
export const PesananModel = {

  // Tambah pesanan baru
  create: async (data: CreatePesananDTO): Promise<void> => {
    await db.execute({
      sql: `INSERT INTO pesanan (no_antrian, nama, no_hp, items, total_harga, status, status_bayar, alamat, status_makanan) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.no_antrian, 
        data.nama, 
        data.no_hp, 
        data.items, 
        data.total_harga, 
        "Menunggu",  
        "Belum",    
        data.alamat || null,
        "Belum"      
      ],
    });
  },

  // Ambil semua pesanan dengan urutan terbaru
  getAll: async (): Promise<Pesanan[]> => {
    const result = await db.execute(
      "SELECT id_pesanan, no_antrian, nama, items, total_harga, status, status_bayar, no_hp, alamat, status_makanan FROM pesanan ORDER BY id_pesanan DESC"
    );
    return result.rows as unknown as Pesanan[];
  },

  // Ambil pesanan berdasarkan ID
  getById: async (id: number): Promise<Pesanan | undefined> => {
    const result = await db.execute({
      sql: "SELECT * FROM pesanan WHERE id_pesanan = ?",
      args: [id],
    });
    return result.rows[0] as unknown as Pesanan | undefined;
  },

  // Update status pesanan
  updateStatus: async (id: number, statusBaru: string): Promise<void> => {
    await db.execute({
      sql: "UPDATE pesanan SET status = ? WHERE id_pesanan = ?",
      args: [statusBaru, id],
    });
  },

  // Update status bayar pesanan
  updateStatusBayar: async (id: number, statusBayarBaru: string): Promise<void> => {
    await db.execute({
      sql: "UPDATE pesanan SET status_bayar = ? WHERE id_pesanan = ?",
      args: [statusBayarBaru, id],
    });
  },

  // Update Status makanan
  updateStatusMakanan: async (id: number, statusBaru: string): Promise<void> => {
    await db.execute({
      sql: "UPDATE pesanan SET status_makanan = ? WHERE id_pesanan = ?",
      args: [statusBaru, id],
    });
  },

   // Hapus pesanan
  delete: async (id: number): Promise<void> => {
    await db.execute({
      sql: "DELETE FROM pesanan WHERE id_pesanan = ?",
      args: [id],
    });
  },
};