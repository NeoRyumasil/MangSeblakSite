import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/LandingPage"; 
import { MenuView } from "./views/MenuPage";
import { PesananView } from "./views/PesananPage";
import { PreorderView } from "./views/PreOrderPage";
import { KeuanganView } from "./views/KeuanganPage";

const app = new Elysia()
  .use(html())
  
  .get("/", () => LandingView.HalamanUtama())

  .get("/menu", () => MenuView.HalamanMenu([
    { id_barang: 1, nama: "Seblak Original", harga: 16000 },
    { id_barang: 2, nama: "Seblak Frozen", harga: 16000 },
  ]))

  .get("/pesanan", () => PesananView.HalamanPesanan(
    { total: 120, belum: 5, untung: 1500000, stok: 30 },
    [
      { id: 1, no_antrian: 1, nama_pelanggan: "Seele My Bini Gwehj", catatan: "Tanpa bawang", items: '[{"nama": "Seblak Original", "qty": 2}]', total_harga: 32000 },
      { id: 2, no_antrian: 2, nama_pelanggan: "Rice Shower My Anak Gwehj", catatan: "Extra pedas", items: '[{"nama": "Seblak Frozen", "qty": 1}]', total_harga: 16000 }
    ]
  ))

  .get("/preorder", () => PreorderView.HalamanPreorder([
    {
      id: 1,
      no_antrian: "001",
      nama_pemesan: "Seele My Bini Gwehj",
      nomor_pemesan: "+628123456789",
      alamat_pemesan: "Jl. Kebon Kacang No. 10, Bandung",
      lat_pemesan: -6.914744,
      lng_pemesan: 107.609810,
      items: [
        { nama: "Seblak Original", qty: 2, harga: 16000 },
        { nama: "Seblak Frozen", qty: 1, harga: 16000 }
      ],
      total_harga: 48000,
      status_pembayaran: "lunas",
      status_pengantaran: "dikirim",
    },
    {
      id: 2,
      no_antrian: "002",
      nama_pemesan: "Rice Shower My Anak Gwehj",
      nomor_pemesan: "+628987654321",
      alamat_pemesan: "Komplek Sakura Blok B2, Bandung",
      lat_pemesan: -6.917464,
      lng_pemesan: 107.619123,
      items: [
        { nama: "Seblak Pedas", qty: 1, harga: 17000 },
        { nama: "Seblak Cheese", qty: 2, harga: 18000 }
      ],
      total_harga: 53000,
      status_pembayaran: "belum_lunas",
      status_pengantaran: "diproses",
    }
  ]))

  .get("/keuangan", () => KeuanganView.HalamanKeuangan({
    bulan: "Juli 2026",
    total_pendapatan: 8450000,
    total_pengeluaran: 4920000,
    total_keuntungan: 3530000,
    total_pesanan: 312,
    rata_per_hari: 281667,
    item_terlaris: "Seblak Original",
    item_terlaris_qty: 148,
    data_mingguan: [
      {
        minggu: "Minggu 1",
        pendapatan: 1850000,
        pengeluaran: 1080000,
        keuntungan: 770000,
        jumlah_pesanan: 68,
      },
      {
        minggu: "Minggu 2",
        pendapatan: 2200000,
        pengeluaran: 1250000,
        keuntungan: 950000,
        jumlah_pesanan: 81,
      },
      {
        minggu: "Minggu 3",
        pendapatan: 2100000,
        pengeluaran: 1260000,
        keuntungan: 840000,
        jumlah_pesanan: 79,
      },
      {
        minggu: "Minggu 4",
        pendapatan: 2300000,
        pengeluaran: 1330000,
        keuntungan: 970000,
        jumlah_pesanan: 84,
      },
    ],
  }))

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);