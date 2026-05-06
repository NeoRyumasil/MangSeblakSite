// file: controllers/PesananController.ts
import { Elysia } from "elysia";
import { PesananModel } from "../models/Pesanan";
import { MenuModel } from "../models/Menu";
import { PesananView } from "../views/pages/PesananPage";

export const PesananController = new Elysia()

  // ----------------------------------------------------------
  // POST /proses-pesanan : Menyimpan pesanan dari MenuPage
  // ----------------------------------------------------------
  .post("/proses-pesanan", async ({ body }) => {
    const input = body as any;
    const menusDb = await MenuModel.getAll();
    
    let totalHarga = 0;
    let itemsSelected = [];

    // Kalkulasi harga dan kumpulkan item yang dibeli
    for (const menu of menusDb) {
      const qty = Number(input[`qty_${menu.id_makanan}`]) || 0;
      if (qty > 0) {
        totalHarga += menu.harga * qty;
        itemsSelected.push({
          id: menu.id_makanan,
          nama: menu.nama_makanan,
          qty: qty,
          harga: menu.harga
        });
      }
    }

    if (itemsSelected.length === 0) {
      return `<p class="text-red-500 font-bold text-center mt-10 p-5 bg-red-50 rounded-xl border border-red-200">Gagal. Anda belum menambahkan menu satupun ke pesanan.</p>`;
    }

    const noAntrianInt = parseInt(input.no_antrian) || 0;

    await PesananModel.create({
      no_antrian: noAntrianInt,
      nama: input.nama_pembeli,
      no_hp: input.no_hp,
      items: JSON.stringify(itemsSelected),
      total_harga: totalHarga
    });

    return `
      <div class="text-center bg-green-50 text-green-700 p-10 rounded-2xl border border-green-200 max-w-2xl mx-auto mt-10 shadow-sm">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold mb-2">Pesanan Berhasil Dibuat!</h2>
        <p class="text-lg text-gray-700">Atas nama <strong class="text-green-800">${input.nama_pembeli}</strong> (HP: ${input.no_hp})</p>
        <p class="text-lg text-gray-700">No. Antrian Anda: <strong class="text-green-800 text-2xl">${noAntrianInt}</strong></p>
        <p class="mt-4 text-gray-600">Pesanan telah masuk ke sistem kami. Mohon tunggu panggilan dari Mang Jay ya!</p>
        <a href="/menu" class="inline-block mt-8 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition">Kembali ke Menu</a>
      </div>
    `;
  })

  // ----------------------------------------------------------
  // GET /pesanan : Menampilkan halaman daftar pesanan (Admin/Dapur)
  // ----------------------------------------------------------
  .get("/pesanan", async () => {
    // Ambil SEMUA pesanan dari database agar yang "Selesai" tidak hilang
    const semuaPesanan = await PesananModel.getAll();
    
    const pesananBelumSelesai = semuaPesanan.filter(p => p.status === 'Menunggu' || p.status === 'Diproses');
    
    const stats = {
      total: semuaPesanan.length,
      belum: pesananBelumSelesai.length,
      untung: semuaPesanan.reduce((sum, p) => sum + p.total_harga, 0),
      stok: 0 
    };

    // Format data untuk dikirim ke view
    const formattedPesanan = semuaPesanan.map(p => ({
      id: p.id_pesanan,
      no_antrian: p.no_antrian,
      nama_pelanggan: p.nama,
      catatan: `HP: ${p.no_hp}`, 
      status: p.status, // Kirim status asli ke view
      items: p.items,
      total_harga: p.total_harga
    }));

    return PesananView.HalamanPesanan(stats, formattedPesanan);
  })
  
  // ----------------------------------------------------------
  // POST /admin/selesaikan/:id : Endpoint Selesaikan Pesanan
  // ----------------------------------------------------------
  .post("/admin/selesaikan/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) {
      await PesananModel.updateStatus(id, 'Selesai');
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/pesanan",
        "HX-Redirect": "/pesanan",
      },
    });
  })
  
  // ----------------------------------------------------------
  // POST /admin/batal-selesaikan/:id : Mengembalikan pesanan ke Menunggu
  // ----------------------------------------------------------
  .post("/admin/batal-selesaikan/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) {
      await PesananModel.updateStatus(id, 'Menunggu');
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/pesanan",
        "HX-Redirect": "/pesanan",
      },
    });
  });