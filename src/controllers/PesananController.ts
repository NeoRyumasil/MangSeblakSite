import { Elysia } from "elysia";
import { PesananModel } from "../models/Pesanan";
import { MenuModel } from "../models/Menu";
import { StokModel } from "../models/Stok"; // Import StokModel untuk mengelola stok
import { PesananView } from "../views/pages/AdminPage";

// Variable untuk nomor antrian
let counterAntrian = 0;

// Controller untuk manajemen pesanan
export const PesananController = new Elysia()

  // Proses pembuatan pesanan baru dari form di halaman menu
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

    // Naikkan counter antrian setiap kali ada pesanan baru
    counterAntrian += 1;
    const noAntrianBaru = counterAntrian;

    // Simpan pesanan baru ke database
    await PesananModel.create({
      no_antrian: noAntrianBaru, 
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
        <p class="text-lg text-gray-700">No. Antrian Anda: <strong class="text-green-800 text-2xl">${noAntrianBaru}</strong></p>
        <p class="mt-4 text-gray-600">Pesanan telah masuk ke sistem kami. Mohon tunggu panggilan dari Mang Jay ya!</p>
        <a href="/menu" class="inline-block mt-8 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition">Kembali ke Menu</a>
      </div>
    `;
  })

  // Ambil semua pesanan untuk ditampilkan di halaman admin
  .get("/pesanan", async () => {
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
      status: p.status, 
      items: p.items,
      total_harga: p.total_harga
    }));

    return PesananView.HalamanPesanan(stats, formattedPesanan);
  })

  // reset nomor antrian
  .post("/admin/reset-antrian", () => {
    counterAntrian = 0; 
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/pesanan",
        "HX-Redirect": "/pesanan",
      },
    });
  })
  
  // Selesaikan pesanan dan potong stok
  .post("/admin/selesaikan/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) {
      
      const pesanan = await PesananModel.getById(id);
      
      if (pesanan && pesanan.status !== 'Selesai') {
        try {
          const items = JSON.parse(pesanan.items);
          
          for (const item of items) {
            await StokModel.kurangiStokByNama(item.nama, item.qty);
          }
        } catch (error) {
          console.error("Gagal mengurangi stok:", error);
        }

        await PesananModel.updateStatus(id, 'Selesai');
      }
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/pesanan",
        "HX-Redirect": "/pesanan",
      },
    });
  })
  
  // Batalkan penyelesaian pesanan
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