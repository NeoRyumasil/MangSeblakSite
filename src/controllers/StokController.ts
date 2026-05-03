import { Elysia, t } from "elysia";
import { db } from "../models/Database";
import { StokView } from "../views/pages/AdminPage";

// ============================================================
// Types
// ============================================================

type StokBahan = {
  id: number;
  nama: string;
  satuan: string;
  stok_sekarang: number;
  stok_minimum: number;
  harga_per_satuan: number;
  terakhir_diperbarui: string;
};

// ============================================================
// Helper: ambil semua stok dari DB
// ============================================================

const getAllStok = async (): Promise<StokBahan[]> => {
  const result = await db.execute("SELECT * FROM stok_bahan ORDER BY nama ASC");
  return result.rows as unknown as StokBahan[];
};

// ============================================================
// Controller
// ============================================================

export const StokController = new Elysia({ prefix: "/admin/stok" })

  // GET /admin/stok — halaman utama stok
  .get("/", async () => {
    const stok = await getAllStok();
    return StokView.HalamanStok(stok);
  })

  // GET /admin/stok/edit/:id — partial form edit (untuk HTMX)
  .get("/edit/:id", async ({ params }) => {
    const result = await db.execute(
      "SELECT * FROM stok_bahan WHERE id = ?",
      [Number(params.id)]
    );
    const item = result.rows[0] as unknown as StokBahan | undefined;
    if (!item) return `<p class="text-red-500 text-sm">Bahan tidak ditemukan.</p>`;
    return StokView.FormEditStok(item);
  })

  // POST /admin/stok/tambah — insert bahan baru
  .post(
    "/tambah",
    async ({ body, set }) => {
      const tanggal = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      await db.execute(
        `INSERT INTO stok_bahan (nama, satuan, stok_sekarang, stok_minimum, harga_per_satuan, terakhir_diperbarui)
              VALUES (?, ?, ?, ?, ?, ?)`,
        [
          body.nama,
          body.satuan,
          Number(body.stok_sekarang),
          Number(body.stok_minimum),
          Number(body.harga_per_satuan),
          tanggal,
        ]
      );

      set.redirect = "/admin/stok";
    },
    {
      body: t.Object({
        nama:            t.String({ minLength: 1 }),
        satuan:          t.String({ minLength: 1 }),
        stok_sekarang:   t.Numeric(),
        stok_minimum:    t.Numeric(),
        harga_per_satuan: t.Numeric(),
      }),
    }
  )

  // POST /admin/stok/update/:id — update bahan
  .post(
    "/update/:id",
    async ({ params, body, set }) => {
      const tanggal = new Date().toISOString().slice(0, 10);
      const id = Number(params.id);
      if (Number.isNaN(id)) {
        set.redirect = "/admin/stok";
        return;
      }

      await db.execute(
        `UPDATE stok_bahan
              SET nama = ?, satuan = ?, stok_sekarang = ?, stok_minimum = ?, harga_per_satuan = ?, terakhir_diperbarui = ?
              WHERE id = ?`,
        [
          body.nama,
          body.satuan,
          Number(body.stok_sekarang),
          Number(body.stok_minimum),
          Number(body.harga_per_satuan),
          tanggal,
          id,
        ]
      );

      set.redirect = "/admin/stok";
    },
    {
      body: t.Object({
        nama:            t.String({ minLength: 1 }),
        satuan:          t.String({ minLength: 1 }),
        stok_sekarang:   t.Numeric(),
        stok_minimum:    t.Numeric(),
        harga_per_satuan: t.Numeric(),
      }),
    }
  )

  // POST /admin/stok/hapus/:id — hapus bahan
  .post("/hapus/:id", async ({ params, set }) => {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      set.redirect = "/admin/stok";
      return;
    }

    await db.execute(
      "DELETE FROM stok_bahan WHERE id = ?",
      [id]
    );
    set.redirect = "/admin/stok";
  });