import { Layout } from "./components/Layout";

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
            <h2 class="text-xl font-bold">Antrian Pesanan Aktif</h2>
            <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">${pesananAktif.length} Antrian</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th class="px-6 py-4">No</th>
                  <th class="px-6 py-4">Pemesan</th>
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

                  return `
                    <tr class="hover:bg-gray-50 transition">
                      <td class="px-6 py-4 font-bold text-blue-600">#${p.no_antrian}</td>
                      <td class="px-6 py-4">
                        <p class="font-bold">${p.nama_pelanggan}</p>
                        <p class="text-xs text-gray-400">${p.catatan}</p>
                      </td>
                      <td class="px-6 py-4 text-sm">
                        <p class="text-gray-700 font-medium">${detailItem}</p>
                        <p class="text-xs text-gray-400 font-bold">${totalQty} Barang</p>
                      </td>
                      <td class="px-6 py-4 font-bold text-red-600">Rp ${p.total_harga.toLocaleString('id-ID')}</td>
                      <td class="px-6 py-4">
                        <button hx-post="/admin/selesaikan/${p.id}" hx-target="body" class="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition text-sm">
                          Selesaikan
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            ${pesananAktif.length === 0 ? '<p class="p-10 text-center text-gray-400 italic">Tidak ada antrian aktif saat ini.</p>' : ''}
          </div>
        </div>
      </div>
    `; 

    return Layout("Dashboard Admin - Mang Jay", content);
  }
};