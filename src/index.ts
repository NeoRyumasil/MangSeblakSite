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
    set.headers["HX-Redirect"] = "/auth/logout"; 
    set.redirect = "/auth/logout"; 
    return;
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
    set.headers["HX-Redirect"] = "/keranjang";
    set.redirect = "/keranjang";
    return;
  })

  .post("/keranjang/kurang", ({ set }) => {
    set.headers["HX-Redirect"] = "/keranjang";
    set.redirect = "/keranjang";
    return;
  })

  .post("/keranjang/hapus", ({ set }) => {
    set.headers["HX-Redirect"] = "/keranjang";
    set.redirect = "/keranjang";
    return;
  })

  .post("/checkout", ({ set }) => {
    set.headers["HX-Redirect"] = "/pesanan";
    set.redirect = "/pesanan";
    return;
  })

  // ----------------------------------------------------------
  // Pesanan admin actions
  // ----------------------------------------------------------

  .post("/admin/selesaikan/:id", ({ params, set }) => {
    console.log(`Selesaikan pesanan id ${params.id}`);
    set.headers["HX-Redirect"] = "/pesanan";
    set.redirect = "/pesanan";
    return;
  })

  .post("/admin/preorder/selesaikan/:id", ({ params, set }) => {
    console.log(`Selesaikan preorder id ${params.id}`);
    set.headers["HX-Redirect"] = "/preorder";
    set.redirect = "/preorder";
    return;
  })

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);