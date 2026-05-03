import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/pages/LandingPage";
import { MenuView } from "./views/pages/MenuPage";
import { PesananView } from "./views/pages/PesananPage";
import { PreorderView } from "./views/pages/PreOrderPage";
import { KeuanganView } from "./views/pages/KeuanganPage";
import { LoginView } from "./views/pages/LoginPage";
import { AdminView, StokView, KeuanganAdminView, StaffView } from "./views/pages/AdminPage";
import { StokController } from "./controllers/StokController";
import { AuthController } from "./controllers/Auth/AuthController";
import { StaffController } from "./controllers/StaffController";

// ============================================================
// Dummy Data
// ============================================================

const dummyStok = [
  { id: 1, nama: "Gochujang", satuan: "kg", stok_sekarang: 5, stok_minimum: 3, harga_per_satuan: 85000, terakhir_diperbarui: "2026-04-28" },
  { id: 2, nama: "Kerupuk Seblak", satuan: "kg", stok_sekarang: 2, stok_minimum: 5, harga_per_satuan: 30000, terakhir_diperbarui: "2026-04-29" },
  { id: 3, nama: "Tteokbokki", satuan: "kg", stok_sekarang: 0, stok_minimum: 2, harga_per_satuan: 120000, terakhir_diperbarui: "2026-04-27" },
  { id: 4, nama: "Odeng (Fishcake)", satuan: "pcs", stok_sekarang: 40, stok_minimum: 20, harga_per_satuan: 3500, terakhir_diperbarui: "2026-04-30" },
  { id: 5, nama: "Mozarella", satuan: "kg", stok_sekarang: 1, stok_minimum: 1, harga_per_satuan: 95000, terakhir_diperbarui: "2026-04-28" },
  { id: 6, nama: "Kencur", satuan: "kg", stok_sekarang: 3, stok_minimum: 1, harga_per_satuan: 25000, terakhir_diperbarui: "2026-04-29" },
  { id: 7, nama: "Gochugaru", satuan: "kg", stok_sekarang: 4, stok_minimum: 2, harga_per_satuan: 70000, terakhir_diperbarui: "2026-04-30" },
  { id: 8, nama: "Minyak Goreng", satuan: "liter", stok_sekarang: 10, stok_minimum: 5, harga_per_satuan: 18000, terakhir_diperbarui: "2026-04-30" },
];

const dummyKeuangan = [
  { bulan: "Mei 2026", total_pendapatan: 0, total_pengeluaran: 0, total_keuntungan: 0, total_pesanan: 0 },
  { bulan: "April 2026", total_pendapatan: 7200000, total_pengeluaran: 4100000, total_keuntungan: 3100000, total_pesanan: 268 },
  { bulan: "Maret 2026", total_pendapatan: 6800000, total_pengeluaran: 3950000, total_keuntungan: 2850000, total_pesanan: 251 },
  { bulan: "Februari 2026", total_pendapatan: 5500000, total_pengeluaran: 3200000, total_keuntungan: 2300000, total_pesanan: 204 },
  { bulan: "Januari 2026", total_pendapatan: 6100000, total_pengeluaran: 3600000, total_keuntungan: 2500000, total_pesanan: 226 },
];

const dummyStaff = [
  { id: 1, nama: "Mang Jay", username: "mangjay", role: "admin" as const, no_hp: "081234567890", tanggal_bergabung: "2025-01-01", aktif: true },
  { id: 2, nama: "Asep Kurnia", username: "asep_kasir", role: "kasir" as const, no_hp: "081298765432", tanggal_bergabung: "2025-03-15", aktif: true },
  { id: 3, nama: "Dewi Rahayu", username: "dewi_dapur", role: "dapur" as const, no_hp: "081311122233", tanggal_bergabung: "2025-04-01", aktif: true },
  { id: 4, nama: "Rizky Anwar", username: "rizky_kurir", role: "kurir" as const, no_hp: "081355544466", tanggal_bergabung: "2025-06-10", aktif: false },
  { id: 5, nama: "Siti Nurhaliza", username: "siti_kasir2", role: "kasir" as const, no_hp: "081377788899", tanggal_bergabung: "2025-08-20", aktif: true },
];

// ============================================================
// App
// ============================================================

const app = new Elysia()
  .use(html()) // Pastikan plugin HTML terpasang di atas

  // ----------------------------------------------------------
  // MIDDLEWARE GLOBAL: Wajib Login
  // Mencegat semua request yang tidak masuk dalam daftar publik
  // ----------------------------------------------------------
  .onBeforeHandle(({ cookie: { session }, path }) => {
    // Daftar path yang boleh diakses TANPA harus login
    const publicPaths = [
      "/",            // Landing Page utama
      "/menu",        // Menu Katalog
      "/login",       // Form Halaman Login
      "/auth/login",  // Endpoint proses verifikasi Login (POST)
      "/logout",      // Rute Bantuan Logout
      "/auth/logout",  // Endpoint Hapus Sesi Logout (GET)
      "/keranjang",       // Halaman Keranjang
      "/keranjang/tambah", // Endpoint tambah item ke keranjang (POST)
      "/keranjang/kurang", // Endpoint kurang item di keranjang (POST)
      "/keranjang/hapus",  // Endpoint hapus item dari keranjang (POST)
      "/checkout",         // Endpoint checkout pesanan (POST)
    ];

    // Jika user sedang mencoba mengakses path publik, biarkan lewat
    if (publicPaths.includes(path)) {
      return; 
    }

    // Jika user mengakses path selain di atas, dan TIDAK memiliki session (belum login)
    // Lempar kembali ke halaman login tanpa mengeksekusi controller yang dituju
    if (!session?.value) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login",
          "HX-Redirect": "/login"
        }
      });
    }
  })

  // Controllers real (DB-connected)
  .use(AuthController)   // POST /auth/login, GET /auth/logout, POST /auth/register
  .use(StaffController)  // CRUD /admin/staff/*
  .use(StokController)   // CRUD /admin/stok/*

  // ----------------------------------------------------------
  // Public
  // ----------------------------------------------------------

  .get("/", () => LandingView.HalamanUtama())

  .get("/menu", () => MenuView.HalamanMenu([
    { id_barang: 1, nama: "Seblak Original", harga: 16000 },
    { id_barang: 2, nama: "Seblak Frozen", harga: 16000 },
    { id_barang: 3, nama: "Seblak Cheese", harga: 18000 },
    { id_barang: 4, nama: "Seblak Pedas Level 5", harga: 17000 },
    { id_barang: 5, nama: "Es Teh Korea", harga: 8000 },
    { id_barang: 6, nama: "Es Boba Gochujang", harga: 12000 },
  ]))

  // Menampilkan UI halaman login
  .get("/login", () => LoginView.HalamanLogin())
  
  // Rute bantuan untuk memanggil controller logout
  .get("/logout", ({ set }) => { 
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth/logout",
        "HX-Redirect": "/auth/logout",
      },
    });
  })

  // ----------------------------------------------------------
  // Pesanan & Preorder
  // ----------------------------------------------------------

  .get("/pesanan", () => PesananView.HalamanPesanan(
    { total: 120, belum: 5, untung: 1500000, stok: 30 },
    [
      { id: 1, no_antrian: 1, nama_pelanggan: "Seele My Bini Gwehj", catatan: "Tanpa bawang", items: '[{"nama":"Seblak Original","qty":2}]', total_harga: 32000 },
      { id: 2, no_antrian: 2, nama_pelanggan: "Rice Shower My Anak Gwehj", catatan: "Extra pedas", items: '[{"nama":"Seblak Frozen","qty":1}]', total_harga: 16000 },
    ]
  ))

  .get("/preorder", () => PreorderView.HalamanPreorder([
    {
      id: 1, no_antrian: "001",
      nama_pemesan: "Seele My Bini Gwehj", nomor_pemesan: "+628123456789",
      alamat_pemesan: "Jl. Kebon Kacang No. 10, Bandung",
      lat_pemesan: -6.914744, lng_pemesan: 107.609810,
      items: [{ nama: "Seblak Original", qty: 2, harga: 16000 }, { nama: "Seblak Frozen", qty: 1, harga: 16000 }],
      total_harga: 48000, status_pembayaran: "lunas", status_pengantaran: "dikirim",
    },
    {
      id: 2, no_antrian: "002",
      nama_pemesan: "Rice Shower My Anak Gwehj", nomor_pemesan: "+628987654321",
      alamat_pemesan: "Komplek Sakura Blok B2, Bandung",
      lat_pemesan: -6.917464, lng_pemesan: 107.619123,
      items: [{ nama: "Seblak Pedas", qty: 1, harga: 17000 }, { nama: "Seblak Cheese", qty: 2, harga: 18000 }],
      total_harga: 53000, status_pembayaran: "belum_lunas", status_pengantaran: "diproses",
    },
  ]))

  .get("/keuangan", () => KeuanganView.HalamanKeuangan({
    bulan: "Juli 2026",
    total_pendapatan: 8450000, total_pengeluaran: 4920000, total_keuntungan: 3530000,
    total_pesanan: 312, rata_per_hari: 281667,
    item_terlaris: "Seblak Original", item_terlaris_qty: 148,
    data_mingguan: [
      { minggu: "Minggu 1", pendapatan: 1850000, pengeluaran: 1080000, keuntungan: 770000, jumlah_pesanan: 68 },
      { minggu: "Minggu 2", pendapatan: 2200000, pengeluaran: 1250000, keuntungan: 950000, jumlah_pesanan: 81 },
      { minggu: "Minggu 3", pendapatan: 2100000, pengeluaran: 1260000, keuntungan: 840000, jumlah_pesanan: 79 },
      { minggu: "Minggu 4", pendapatan: 2300000, pengeluaran: 1330000, keuntungan: 970000, jumlah_pesanan: 84 },
    ],
  }))

  // ----------------------------------------------------------
  // Admin: Dashboard (gabungan stok + keuangan + staff)
  // ----------------------------------------------------------

  .get("/admin", () => AdminView.HalamanDashboard({
    stok: dummyStok,
    keuangan: dummyKeuangan,
    staff: dummyStaff,
  }))

  // ----------------------------------------------------------
  // Admin: Keuangan
  // ----------------------------------------------------------

  .get("/admin/keuangan", () => KeuanganAdminView.HalamanKeuangan(dummyKeuangan))

  .get("/admin/keuangan/:bulan", ({ params }) => KeuanganView.HalamanKeuangan({
    bulan: decodeURIComponent(params.bulan),
    total_pendapatan: 7200000, total_pengeluaran: 4100000, total_keuntungan: 3100000,
    total_pesanan: 268, rata_per_hari: 240000,
    item_terlaris: "Seblak Original", item_terlaris_qty: 132,
    data_mingguan: [
      { minggu: "Minggu 1", pendapatan: 1650000, pengeluaran: 950000, keuntungan: 700000, jumlah_pesanan: 61 },
      { minggu: "Minggu 2", pendapatan: 1900000, pengeluaran: 1100000, keuntungan: 800000, jumlah_pesanan: 71 },
      { minggu: "Minggu 3", pendapatan: 1850000, pengeluaran: 1050000, keuntungan: 800000, jumlah_pesanan: 68 },
      { minggu: "Minggu 4", pendapatan: 1800000, pengeluaran: 1000000, keuntungan: 800000, jumlah_pesanan: 68 },
    ],
  }))

  // ----------------------------------------------------------
  // Keranjang (HTMX partials)
  // ----------------------------------------------------------

  .get("/keranjang", () => MenuView.IsiKeranjang([], 0))

  .post("/keranjang/tambah", ({ set }) => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/keranjang",
        "HX-Redirect": "/keranjang",
      },
    });
  })

  .post("/keranjang/kurang", ({ set }) => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/keranjang",
        "HX-Redirect": "/keranjang",
      },
    });
  })

  .post("/keranjang/hapus", ({ set }) => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/keranjang",
        "HX-Redirect": "/keranjang",
      },
    });
  })

  .post("/checkout", ({ set }) => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/pesanan",
        "HX-Redirect": "/pesanan",
      },
    });
  })

  // ----------------------------------------------------------
  // Pesanan admin actions
  // ----------------------------------------------------------

  .post("/admin/selesaikan/:id", ({ params, set }) => {
    console.log(`Selesaikan pesanan id ${params.id}`);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/pesanan",
        "HX-Redirect": "/pesanan",
      },
    });
  })

  .post("/admin/preorder/selesaikan/:id", ({ params, set }) => {
    console.log(`Selesaikan preorder id ${params.id}`);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/preorder",
        "HX-Redirect": "/preorder",
      },
    });
  })

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);