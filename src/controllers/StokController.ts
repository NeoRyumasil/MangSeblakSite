import { Elysia, t } from "elysia";
import { db } from "../models/Database";
import { StokView } from "../views/pages/AdminPage";

// ============================================================
// Types — disesuaikan dengan skema tabel `barang` di Turso
// ============================================================

export type Barang = {
  id_barang: number;
  nama: string;
  harga: number;
  stok: number;
};

// ============================================================
// Helper: ambil semua barang dari DB
// ============================================================

const getAllBarang = async (): Promise<Barang[]> => {
  const result = await db.execute(
    "SELECT id_barang, nama, harga, stok FROM barang ORDER BY nama ASC"
  );
  return result.rows as unknown as Barang[];
};

// ============================================================
// Controller
// ============================================================

export const StokController = new Elysia({ prefix: "/admin/stok" })

  // ----------------------------------------------------------
  // GET /admin/stok — halaman utama stok (render dari DB)
  // ----------------------------------------------------------
  .get("/", async () => {
    const barang = await getAllBarang();
    return StokView.HalamanStok(barang);
  })

  // ----------------------------------------------------------
  // GET /admin/stok/edit/:id — partial form edit (untuk HTMX)
  // ----------------------------------------------------------
  .get("/edit/:id", async ({ params }) => {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return `<p class="text-red-500 text-sm font-medium">ID tidak valid.</p>`;
    }

    const result = await db.execute(
      "SELECT id_barang, nama, harga, stok FROM barang WHERE id_barang = ?",
      [id]
    );

    const item = result.rows[0] as unknown as Barang | undefined;
    if (!item) {
      return `<p class="text-red-500 text-sm font-medium">Barang tidak ditemukan.</p>`;
    }

    return StokView.FormEditStok(item);
  })

  // ----------------------------------------------------------
  // POST /admin/stok/tambah — insert barang baru
  // ----------------------------------------------------------
  .post(
    "/tambah",
    async ({ body, set }) => {
      await db.execute(
        `INSERT INTO barang (nama, harga, stok) VALUES (?, ?, ?)`,
        [body.nama, Number(body.harga), Number(body.stok)]
      );

      set.redirect = "/admin/stok";
    },
    {
      body: t.Object({
        nama:  t.String({ minLength: 1 }),
        harga: t.Numeric(),
        stok:  t.Numeric(),
      }),
    }
  )

  // ----------------------------------------------------------
  // POST /admin/stok/update/:id — update barang
  // ----------------------------------------------------------
  .post(
    "/update/:id",
    async ({ params, body, set }) => {
      const id = Number(params.id);
      if (Number.isNaN(id)) {
        set.redirect = "/admin/stok";
        return;
      }

      await db.execute(
        `UPDATE barang SET nama = ?, harga = ?, stok = ? WHERE id_barang = ?`,
        [body.nama, Number(body.harga), Number(body.stok), id]
      );

      set.redirect = "/admin/stok";
    },
    {
      body: t.Object({
        nama:  t.String({ minLength: 1 }),
        harga: t.Numeric(),
        stok:  t.Numeric(),
      }),
    }
  )

  // ----------------------------------------------------------
  // POST /admin/stok/hapus/:id — hapus barang
  // ----------------------------------------------------------
  .post("/hapus/:id", async ({ params, set }) => {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      set.redirect = "/admin/stok";
      return;
    }

    await db.execute("DELETE FROM barang WHERE id_barang = ?", [id]);
    set.redirect = "/admin/stok";
  });