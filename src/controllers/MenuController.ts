import { Elysia, t } from "elysia";
import { MenuModel } from "../models/Menu"; // Sesuaikan dengan path file model yang dibuat sebelumnya
// import { MenuView } from "../views/pages/AdminPage"; // Uncomment dan sesuaikan jika Anda menggunakan View

// ============================================================
// Controller: MenuController
// ============================================================

export const MenuController = new Elysia({ prefix: "/admin/menu" })

  // ----------------------------------------------------------
  // GET /admin/menu — halaman utama menu
  // ----------------------------------------------------------
  .get("/", async () => {
    const menus = await MenuModel.getAll();
    // Return HTML View jika ada:
    // return MenuView.HalamanMenu(menus);
    
    // Atau return JSON sementara jika View belum dibuat:
    return menus;
  })

  // ----------------------------------------------------------
  // GET /admin/menu/edit/:id — partial form edit (untuk HTMX)
  // ----------------------------------------------------------
  .get("/edit/:id", async ({ params }) => {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return `<p class="text-red-500 text-sm font-medium">ID tidak valid.</p>`;
    }

    const item = await MenuModel.getById(id);
    
    if (!item) {
      return `<p class="text-red-500 text-sm font-medium">Menu tidak ditemukan.</p>`;
    }

    // Return HTML partial View jika ada:
    // return MenuView.FormEditMenu(item);

    return item;
  })

  // ----------------------------------------------------------
  // POST /admin/menu/tambah — insert menu baru
  // ----------------------------------------------------------
  .post(
    "/tambah",
    async ({ body }) => {
      // Panggil operasi database lewat Model
      await MenuModel.create(body.nama_makanan, Number(body.harga));

      // Redirect via HTMX agar tabel ter-refresh dan tidak whitescreen
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin/menu",
          "HX-Redirect": "/admin/menu",
        },
      });
    },
    {
      body: t.Object({
        nama_makanan: t.String({ minLength: 1 }),
        harga:        t.Numeric(),
      }),
    }
  )

  // ----------------------------------------------------------
  // POST /admin/menu/update/:id — update menu
  // ----------------------------------------------------------
  .post(
    "/update/:id",
    async ({ params, body }) => {
      const id = Number(params.id);
      
      if (!Number.isNaN(id)) {
        // Panggil operasi database lewat Model
        await MenuModel.update(id, body.nama_makanan, Number(body.harga));
      }

      // Selalu redirect via HTMX baik id valid maupun tidak
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin/menu",
          "HX-Redirect": "/admin/menu",
        },
      });
    },
    {
      body: t.Object({
        nama_makanan: t.String({ minLength: 1 }),
        harga:        t.Numeric(),
      }),
    }
  )

  // ----------------------------------------------------------
  // POST /admin/menu/hapus/:id — hapus menu
  // ----------------------------------------------------------
  .post("/hapus/:id", async ({ params }) => {
    const id = Number(params.id);
    
    if (!Number.isNaN(id)) {
      // Panggil operasi database lewat Model
      await MenuModel.delete(id);
    }
    
    // Redirect via HTMX
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/menu",
        "HX-Redirect": "/admin/menu",
      },
    });
  });