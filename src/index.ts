// file: index.ts
import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/pages/LandingPage";
import { MenuView } from "./views/pages/MenuPage";
import { PreorderView } from "./views/pages/PreOrderPage";
import { KeuanganView } from "./views/pages/KeuanganPage";
import { LoginView } from "./views/pages/LoginPage";
import { AdminView, KeuanganAdminView } from "./views/pages/AdminPage";
import { StokController } from "./controllers/StokController";
import { AuthController } from "./controllers/Auth/AuthController";
import { StaffController } from "./controllers/StaffController";
import { MenuController } from "./controllers/MenuController";
import { PesananController } from "./controllers/PesananController";
import { MenuModel } from "./models/Menu";

// ============================================================
// Dummy Data Admin
// ============================================================
const dummyStok = [ { id_barang: 1, nama: "Gochujang", stok: 5, harga: 85000 } ];
const dummyKeuangan = [ { bulan: "April 2026", total_pendapatan: 7200000, total_pengeluaran: 4100000, total_keuntungan: 3100000, total_pesanan: 268 } ];
const dummyStaff = [ { id: 1, nama: "Mang Jay", username: "mangjay", role: "admin" as const, no_hp: "081234", tanggal_bergabung: "2025", aktif: true } ];

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
  .use(PesananController) // Mengatur endpoint proses-pesanan dan pesanan

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
  // HALAMAN PREORDER & ADMIN (DUMMY SEMENTARA)
  // ----------------------------------------------------------
  .get("/preorder", () => PreorderView.HalamanPreorder([
    {
      id: 1, no_antrian: "001",
      nama_pemesan: "Budi", nomor_pemesan: "0812",
      alamat_pemesan: "Bandung", lat_pemesan: -6.9, lng_pemesan: 107.6,
      items: [{ nama: "Seblak", qty: 2, harga: 16000 }],
      total_harga: 32000, status_pembayaran: "lunas", status_pengantaran: "dikirim",
    }
  ]))

  .get("/admin", () => AdminView.HalamanDashboard({ stok: dummyStok, keuangan: dummyKeuangan, staff: dummyStaff }))
  .get("/admin/keuangan", () => KeuanganAdminView.HalamanKeuangan(dummyKeuangan))

  // ----------------------------------------------------------
  // JALANKAN SERVER
  // ----------------------------------------------------------
  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);