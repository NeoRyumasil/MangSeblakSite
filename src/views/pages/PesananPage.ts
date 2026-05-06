// file: views/pages/PesananPage.ts
import { Layout } from "../components/Layout";

export const PesananView = {
  HalamanPesanan: (stats: any, pesananAktif: any[]) => {
    const content = `
      <div class="max-w-7xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">Riwayat Pesanan</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <p class="text-sm text-gray-500 font-bold uppercase">Total Pesanan</p>
            <p class="text-2xl font-black">${stats.total}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500">
            <p class="text-sm text-gray-500 font-bold uppercase">Belum Selesai</p>
            <p class="text-2xl font-black">${stats.belum}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
            <p class="text-sm text-gray-500 font-bold uppercase">Keuntungan</p>
            <p class="text-2xl font-black text-green-600">Rp ${stats.untung.toLocaleString('id-ID')}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
            <p class="text-sm text-gray-500 font-bold uppercase">Sisa Stok</p>
            <p class="text-2xl font-black">${stats.stok} Porsi</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div class="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-xl font-bold">Daftar Antrian</h2>
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">${pesananAktif.length} Total Antrian</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th class="px-6 py-4">No</th>
                  <th class="px-6 py-4">Nama Pemesan</th>
                  <th class="px-6 py-4">No. Telepon</th>
                  <th class="px-6 py-4">Pesanan</th>
                  <th class="px-6 py-4">Total Harga</th>
                  <th class="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${pesananAktif.map((p: any) => {
                  const items = JSON.parse(p.items);
                  const detailItem = items.map((i: any) => `${i.nama} (x${i.qty})`).join(", ");
                  const totalQty = items.reduce((sum: number, i: any) => sum + i.qty, 0);
                  
                  // Variabel untuk mengecek apakah pesanan sudah selesai
                  const isSelesai = p.status === 'Selesai';
                  
                  // Perubahan visual jika statusnya Selesai
                  const rowClass = isSelesai ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50 transition bg-white';
                  const badgeStatus = isSelesai 
                    ? '<span class="inline-block mt-1 bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-1 rounded">Selesai</span>' 
                    : '<span class="inline-block mt-1 bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold px-2 py-1 rounded">Menunggu</span>';

                  // Membersihkan string "HP: " dari data catatan
                  const noHpBersih = p.catatan.replace('HP: ', '').trim();

                  // Tombol aksi bergantung pada status
                  const tombolAksi = isSelesai 
                    ? `<button hx-post="/admin/batal-selesaikan/${p.id}" hx-target="body" class="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 hover:text-gray-800 transition text-sm shadow-sm whitespace-nowrap">
                        Batalkan Selesai
                      </button>`
                    : `<button hx-post="/admin/selesaikan/${p.id}" hx-target="body" class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition text-sm shadow-sm whitespace-nowrap">
                        Selesaikan
                      </button>`;

                  return `
                    <tr class="${rowClass}">
                      <td class="px-6 py-4 font-black text-xl ${isSelesai ? 'text-gray-400' : 'text-blue-600'}">#${p.no_antrian}</td>
                      <td class="px-6 py-4">
                        <p class="font-bold text-lg">${p.nama_pelanggan}</p>
                        ${badgeStatus}
                      </td>
                      <td class="px-6 py-4">
                        <p class="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg inline-block">${noHpBersih}</p>
                      </td>
                      <td class="px-6 py-4 text-sm">
                        <p class="text-gray-700 font-medium ${isSelesai ? 'line-through decoration-2 decoration-gray-400' : ''}">${detailItem}</p>
                        <p class="text-xs text-gray-400 font-bold mt-1">${totalQty} Barang</p>
                      </td>
                      <td class="px-6 py-4 font-bold ${isSelesai ? 'text-gray-500' : 'text-red-600'} text-lg whitespace-nowrap">Rp ${p.total_harga.toLocaleString('id-ID')}</td>
                      <td class="px-6 py-4">
                        ${tombolAksi}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            ${pesananAktif.length === 0 ? '<p class="p-10 text-center text-gray-400 italic">Tidak ada pesanan sama sekali.</p>' : ''}
          </div>
        </div>
      </div>
    `; 

    return Layout("Dashboard Admin - Mang Jay", content);
  }
};