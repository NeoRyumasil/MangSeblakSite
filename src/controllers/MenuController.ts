import { Elysia, t } from "elysia";
import { MenuModel } from "../models/Menu"; 
import { MenuView } from "../views/pages/MenuPage"; 

// ============================================================
// Controller: MenuController
// ============================================================

export const MenuController = new Elysia({ prefix: "/admin/menu" })

  // ----------------------------------------------------------
  // GET /admin/menu — halaman utama menu
  // ----------------------------------------------------------
  .get("/", async () => {
    // menus sudah memiliki struktur: id_makanan, nama_makanan, harga, ImagePath
    const menus = await MenuModel.getAll();
    
    // Langsung passing 'menus' ke View, tidak perlu di-map lagi!
    return MenuView.HalamanMenu(menus);
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

    return item;
  })

  // ----------------------------------------------------------
  // POST /admin/menu/tambah — insert menu baru
  // ----------------------------------------------------------
  .post(
    "/tambah",
    async ({ body }) => {
      await MenuModel.create(body.nama_makanan, Number(body.harga));

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
        await MenuModel.update(id, body.nama_makanan, Number(body.harga));
      }

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
      await MenuModel.delete(id);
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/menu",
        "HX-Redirect": "/admin/menu",
      },
    });
  });