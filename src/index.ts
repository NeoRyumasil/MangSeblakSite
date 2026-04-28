import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/LandingPage"; 
import { MenuView } from "./views/MenuPage";
import { PesananView } from "./views/PesananPage";

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

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);