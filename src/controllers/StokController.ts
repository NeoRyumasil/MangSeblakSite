import { Elysia, t } from "elysia";
import { StokModel } from "../models/Stok";
import { StokView } from "../views/pages/AdminPage";

// Controller untuk manajemen stok barang
export const StokController = new Elysia({ prefix: "/admin/stok" })

  // Ambil semua stok barang
  .get("/", async () => {
    const barang = await StokModel.getAll();
    return StokView.HalamanStok(barang);
  })

  // Ambil data stok berdasarkan ID untuk edit
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

  // Tambah barang baru
  .post(
    "/tambah",
    async ({ body }) => {
      await StokModel.create(body.nama, Number(body.harga), Number(body.stok));

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

  // Update barang yang ada
  .post(
    "/update/:id",
    async ({ params, body }) => {
      const id = Number(params.id);
      
      if (!Number.isNaN(id)) {
        await StokModel.update(id, body.nama, Number(body.harga), Number(body.stok));
      }

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

  // Hapus barang
  .post("/hapus/:id", async ({ params }) => {
    const id = Number(params.id);
    
    if (!Number.isNaN(id)) {
      await StokModel.delete(id);
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/stok",
        "HX-Redirect": "/admin/stok",
      },
    });
  });