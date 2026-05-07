// file: index.ts
import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/pages/LandingPage";
import { MenuView } from "./views/pages/MenuPage";
import { LoginView } from "./views/pages/LoginPage";
import { AdminView } from "./views/pages/AdminPage";
import { StokController } from "./controllers/StokController";
import { AuthController } from "./controllers/Auth/AuthController";
import { StaffController } from "./controllers/StaffController";
import { MenuController } from "./controllers/MenuController";
import { PesananController } from "./controllers/PesananController";
import { MenuModel } from "./models/Menu";

// Models Tambahan Untuk Backend Dashboard Admin
import { StokModel } from "./models/Stok";
import { PesananModel } from "./models/Pesanan";
import { db } from "./models/Database";

// ============================================================
// App
// ============================================================

const app = new Elysia()
  .use(html())

  // ----------------------------------------------------------
  // MIDDLEWARE GLOBAL: Wajib Login
  // ----------------------------------------------------------
  .onBeforeHandle(({ cookie: { session }, path }) => {
    const publicPaths = [
      "/", "/menu", "/login", "/auth/login", "/logout", "/auth/logout", "/proses-pesanan"
    ];

    if (publicPaths.includes(path)) return; 

    if (!session?.value) {
      return new Response(null, { status: 302, headers: { Location: "/login", "HX-Redirect": "/login" } });
    }
  })

  // ----------------------------------------------------------
  // CONTROLLERS (Terkoneksi ke DB)
  // ----------------------------------------------------------
  .use(AuthController)
  .use(StaffController)
  .use(StokController)
  .use(MenuController)
  .use(PesananController) // Mengatur endpoint /proses-pesanan dan /pesanan

  // ----------------------------------------------------------
  // HALAMAN PUBLIK
  // ----------------------------------------------------------
  .get("/", () => LandingView.HalamanUtama())
  
  .get("/login", () => LoginView.HalamanLogin())
  .get("/logout", () => new Response(null, { status: 302, headers: { Location: "/auth/logout", "HX-Redirect": "/auth/logout" } }))

  // ----------------------------------------------------------
  // HALAMAN MENU (Tampilan Saja)
  // ----------------------------------------------------------
  .get("/menu", async () => {
    const menusDb = await MenuModel.getAll();
    const formattedMenus = menusDb.map((menu) => ({
      id_barang: menu.id_makanan, nama: menu.nama_makanan, harga: menu.harga,
    }));
    return MenuView.HalamanMenu(formattedMenus);
  })

  // ----------------------------------------------------------
  // ADMIN DASHBOARD (TERKONEKSI KE DB)
  // ----------------------------------------------------------
  .get("/admin", async () => {
    // 1. Fetch data stok asli
    const stokDb = await StokModel.getAll();

    // 2. Fetch data pesanan asli
    const pesananDb = await PesananModel.getAll();

    // 3. Fetch data staff (users) menggunakan query DB
    const staffQuery = await db.execute("SELECT id, nama, username, role, no_hp, tanggal_bergabung, aktif FROM users ORDER BY tanggal_bergabung DESC");
    const staffDb = staffQuery.rows.map(row => ({
      id: row.id as number,
      nama: row.nama as string,
      username: row.username as string,
      role: row.role as "admin" | "kasir" | "dapur" | "kurir",
      no_hp: row.no_hp as string,
      tanggal_bergabung: row.tanggal_bergabung as string,
      aktif: row.aktif === 1
    }));

    return AdminView.HalamanDashboard({ 
      stok: stokDb, 
      pesanan: pesananDb, 
      staff: staffDb 
    });
  })

  // ----------------------------------------------------------
  // JALANKAN SERVER
  // ----------------------------------------------------------
  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);