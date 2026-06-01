import { Elysia } from "elysia";
import { PesananModel } from "../models/Pesanan";
import { MenuModel } from "../models/Menu";
import { StokModel } from "../models/Stok";
import { PesananView } from "../views/pages/AdminPage"; 

let counterAntrian = 0;

export const PesananController = new Elysia()

  .post("/proses-pesanan", async ({ body }) => {
    const input = body as any;
    const menusDb = await MenuModel.getAll();
    
    let totalHarga = 0;
    let itemsSelected = [];

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

    counterAntrian += 1;
    const noAntrianBaru = counterAntrian;

    await PesananModel.create({
      no_antrian: noAntrianBaru, 
      nama: input.nama_pembeli,
      no_hp: input.no_hp,
      items: JSON.stringify(itemsSelected),
      total_harga: totalHarga,
      alamat: input.alamat || "",
      voucher: "Tidak" // Default tidak pakai voucher dari awal
    });

    return `
      <div class="text-center bg-green-50 text-green-700 p-6 md:p-10 rounded-2xl border border-green-200 max-w-2xl mx-auto mt-6 shadow-sm">
        <div class="text-5xl md:text-6xl mb-4">🎉</div>
        <h2 class="text-2xl md:text-3xl font-bold mb-2">Pesanan Berhasil Dibuat!</h2>
        <p class="text-sm md:text-base text-gray-700 mb-4">Atas nama <strong class="text-green-800">${input.nama_pembeli}</strong> (HP: ${input.no_hp})</p>
        
        <div class="bg-white rounded-xl p-4 inline-block mb-6 border border-green-100 shadow-sm">
           <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">No. Antrian Anda</p>
           <p class="text-green-800 text-4xl md:text-5xl font-black">#${noAntrianBaru}</p>
        </div>
        
        <hr class="border-green-200 mb-6 mx-8">
        
        <h3 class="text-lg md:text-xl font-black text-gray-800 mb-2">💳 Silakan Lakukan Pembayaran</h3>
        <p class="text-gray-600 mb-4 text-xs md:text-sm leading-relaxed">
          Total tagihan Anda adalah <strong class="text-red-600 text-base">Rp ${totalHarga.toLocaleString('id-ID')}</strong>.<br/>
          Scan QRIS di bawah ini untuk membayar pesanan Anda.
        </p>
        
        <div class="bg-white p-3 rounded-xl inline-block shadow border border-gray-200 mb-6">
           <img src="https://raw.githubusercontent.com/NeoRyumasil/MangSeblakSite/main/public/QR/QR.jpeg" alt="QRIS Mang Jay" class="w-48 md:w-64 h-auto mx-auto rounded-lg">
        </div>
        
        <div class="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-xs md:text-sm font-medium mb-8">
          ℹ️ Setelah melakukan pembayaran, silakan tunjukkan <strong>Bukti Transfer</strong> dan <strong>Nomor Antrian</strong> Anda kepada Kasir agar pesanan segera diproses.
        </div>
        
        <a href="/menu" class="inline-block px-6 py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition w-full md:w-auto">Pesan Menu Lainnya</a>
      </div>
    `;
  })

  .get("/pesanan", async () => {
    const semuaPesanan = await PesananModel.getAll();
    const pesananBelumSelesai = semuaPesanan.filter(p => p.status === 'Menunggu' || p.status === 'Diproses');
    const pesananLunas = semuaPesanan.filter(p => p.status_bayar === 'Lunas');
    
    const stats = {
      total: semuaPesanan.length,
      belum: pesananBelumSelesai.length,
      untung: pesananLunas.reduce((sum, p) => sum + p.total_harga, 0),
      stok: 0 
    };

    const formattedPesanan = semuaPesanan.map(p => ({
      id: p.id_pesanan,
      no_antrian: p.no_antrian,
      nama_pelanggan: p.nama,
      no_hp: p.no_hp,
      catatan: `HP: ${p.no_hp}`, 
      status: p.status, 
      status_bayar: p.status_bayar,
      status_makanan: p.status_makanan,
      alamat: p.alamat,
      voucher: p.voucher,
      items: p.items,
      total_harga: p.total_harga
    }));

    return PesananView.HalamanPesanan(stats, formattedPesanan);
  })

  .post("/admin/reset-antrian", () => {
    counterAntrian = 0; 
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })
  
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
        } catch (error) {}
        await PesananModel.updateStatus(id, 'Selesai');
        await PesananModel.updateStatusMakanan(id, 'Selesai');
        await PesananModel.updateStatusBayar(id, 'Lunas');
      }
    }
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })

  .post("/admin/batal-selesaikan/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) await PesananModel.updateStatus(id, 'Menunggu');
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })

  .post("/admin/selesaikan-makanan/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) await PesananModel.updateStatusMakanan(id, 'Selesai');
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })
  
  .post("/admin/batal-makanan/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) await PesananModel.updateStatusMakanan(id, 'Belum');
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })

  .post("/admin/selesaikan-bayar/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) await PesananModel.updateStatusBayar(id, 'Lunas'); 
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })
  
  .post("/admin/batal-bayar/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) await PesananModel.updateStatusBayar(id, 'Belum');
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  })

  .post("/admin/toggle-voucher/:id", async ({ params }) => {
    const id = Number(params.id);
    if (!isNaN(id)) {
      const pesanan = await PesananModel.getById(id);
      if (pesanan) {
        if (pesanan.voucher === 'Ya') {
          await PesananModel.updateVoucher(id, 'Tidak', pesanan.total_harga + 3000);
        } else {
          await PesananModel.updateVoucher(id, 'Ya', Math.max(0, pesanan.total_harga - 3000));
        }
      }
    }
    return new Response(null, { status: 302, headers: { Location: "/pesanan", "HX-Redirect": "/pesanan" } });
  });