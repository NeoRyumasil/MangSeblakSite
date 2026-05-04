import { Elysia, t } from "elysia";
import { StokModel } from "../models/Stok";
import { StokView } from "../views/pages/AdminPage";

// ============================================================
// Controller: StokController
// ============================================================

export const StokController = new Elysia({ prefix: "/admin/stok" })

  // ----------------------------------------------------------
  // GET /admin/stok — halaman utama stok
  // ----------------------------------------------------------
  .get("/", async () => {
    const barang = await StokModel.getAll();
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

    const item = await StokModel.getById(id);
    
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
    async ({ body }) => {
      // Panggil operasi database lewat Model
      await StokModel.create(body.nama, Number(body.harga), Number(body.stok));

      // Redirect via HTMX agar tabel ter-refresh dan tidak whitescreen
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin/stok",
          "HX-Redirect": "/admin/stok",
        },
      });
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
    async ({ params, body }) => {
      const id = Number(params.id);
      
      if (!Number.isNaN(id)) {
        // Panggil operasi database lewat Model
        await StokModel.update(id, body.nama, Number(body.harga), Number(body.stok));
      }

      // Selalu redirect via HTMX baik id valid maupun tidak
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin/stok",
          "HX-Redirect": "/admin/stok",
        },
      });
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
  .post("/hapus/:id", async ({ params }) => {
    const id = Number(params.id);
    
    if (!Number.isNaN(id)) {
      // Panggil operasi database lewat Model
      await StokModel.delete(id);
    }
    
    // Redirect via HTMX
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/stok",
        "HX-Redirect": "/admin/stok",
      },
    });
  });