import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/LandingPage"; 
import { MenuView } from "./views/MenuPage";
import { PesananView } from "./views/PesananPage";
import { PreorderView } from "./views/PreOrderPage";

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

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);