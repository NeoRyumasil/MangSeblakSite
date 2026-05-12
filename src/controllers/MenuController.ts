import { Elysia, t } from "elysia";
import { MenuModel } from "../models/Menu"; 
import { MenuView } from "../views/pages/MenuPage"; 


// Controller untuk manajemen menu 
export const MenuController = new Elysia({ prefix: "/admin/menu" })
  
  // Mengambil semua menu
  .get("/", async () => {
    const menus = await MenuModel.getAll();
    return MenuView.HalamanMenu(menus);
  })

  // Mengambil data menu berdasarkan ID untuk edit
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

  // Menambah menu baru
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

  // Update menu yang ada
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

  // Hapus menu
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