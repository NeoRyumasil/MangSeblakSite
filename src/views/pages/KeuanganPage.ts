import { Layout } from "../components/Layout";

// Tipe data untuk rekap keuangan per minggu
type DataMinggu = {
  minggu: string; 
  pendapatan: number;
  pengeluaran: number;
  keuntungan: number;
  jumlah_pesanan: number;
};

// Tipe data untuk rekap keuangan bulanan
type RekapKeuangan = {
  bulan: string; 
  total_pendapatan: number;
  total_pengeluaran: number;
  total_keuntungan: number;
  total_pesanan: number;
  rata_per_hari: number;
  item_terlaris: string;
  item_terlaris_qty: number;
  data_mingguan: DataMinggu[];
};

// View untuk halaman keuangan
export const KeuanganView = {
  HalamanKeuangan: (rekap: RekapKeuangan) => {
    const maxPendapatan = Math.max(...rekap.data_mingguan.map(d => d.pendapatan));

    const content = `
      <div class="max-w-7xl mx-auto px-4 py-6 md:p-6 md:py-10 w-full overflow-hidden">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <p class="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Laporan Keuangan</p>
            <h1 class="text-2xl sm:text-3xl font-black text-gray-900">${rekap.bulan}</h1>
          </div>
          <div class="flex gap-3">
            <button onclick="window.print()" class="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 px-4 py-2.5 sm:py-2 rounded-xl font-semibold text-sm transition shadow-sm">
              🖨️ Cetak Laporan
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">💰</div>
              <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pendapatan</p>
            </div>
            <p class="text-xl sm:text-2xl font-black text-gray-900 truncate">Rp ${rekap.total_pendapatan.toLocaleString('id-ID')}</p>
            <p class="text-[10px] sm:text-xs text-gray-400 mt-1">Rata-rata Rp ${rekap.rata_per_hari.toLocaleString('id-ID')} / hari</p>
          </div>

          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl">🧾</div>
              <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pengeluaran</p>
            </div>
            <p class="text-xl sm:text-2xl font-black text-red-600 truncate">Rp ${rekap.total_pengeluaran.toLocaleString('id-ID')}</p>
            <p class="text-[10px] sm:text-xs text-gray-400 mt-1">Bahan baku & operasional</p>
          </div>

          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">📈</div>
              <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Total Keuntungan</p>
            </div>
            <p class="text-xl sm:text-2xl font-black text-green-600 truncate">Rp ${rekap.total_keuntungan.toLocaleString('id-ID')}</p>
            <p class="text-[10px] sm:text-xs text-green-500 mt-1 font-semibold">
              Margin ${Math.round((rekap.total_keuntungan / rekap.total_pendapatan) * 100)}%
            </p>
          </div>

          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">🍜</div>
              <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pesanan</p>
            </div>
            <p class="text-xl sm:text-2xl font-black text-gray-900">${rekap.total_pesanan}</p>
            <p class="text-[10px] sm:text-xs text-gray-400 mt-1">Item terlaris: <span class="font-bold text-orange-500">${rekap.item_terlaris}</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 overflow-hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <h2 class="text-base sm:text-lg font-black text-gray-800">Grafik Keuangan Per Minggu</h2>
              <div class="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold">
                <span class="flex items-center gap-1 sm:gap-1.5"><span class="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-sm bg-[#1e3a5f] inline-block"></span>Pendapatan</span>
                <span class="flex items-center gap-1 sm:gap-1.5"><span class="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-sm bg-red-500 inline-block"></span>Pengeluaran</span>
                <span class="flex items-center gap-1 sm:gap-1.5"><span class="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-sm bg-green-400 inline-block"></span>Keuntungan</span>
              </div>
            </div>

            <div class="w-full overflow-x-auto pb-4 hide-scrollbar">
              <div class="min-w-[400px] relative">
                <div class="flex items-end gap-2 sm:gap-4 px-2" style="height:220px; padding-top:40px; overflow:visible">
                  ${rekap.data_mingguan.map((d, i) => {
                    const hPendapatan = Math.round((d.pendapatan / maxPendapatan) * 180);
                    const hPengeluaran = Math.round((d.pengeluaran / maxPendapatan) * 180);
                    const hKeuntungan = Math.round((d.keuntungan / maxPendapatan) * 180);
                    return `
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <div class="w-full flex items-end justify-center gap-0.5 sm:gap-1" style="height:180px; overflow:visible">
                        <div class="flex-1 rounded-t-lg bg-[#1e3a5f] transition-all duration-700 hover:opacity-80 relative group" style="height:${hPendapatan}px; min-width:6px">
                          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            Rp ${d.pendapatan.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div class="flex-1 rounded-t-lg bg-red-500 transition-all duration-700 hover:bg-red-600 relative group" style="height:${hPengeluaran}px; min-width:6px">
                          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            Rp ${d.pengeluaran.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div class="flex-1 rounded-t-lg bg-green-400 transition-all duration-700 hover:bg-green-500 relative group" style="height:${hKeuntungan}px; min-width:6px">
                          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            Rp ${d.keuntungan.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <p class="text-[10px] sm:text-xs font-bold text-gray-500 mt-2">${d.minggu.replace('Minggu ', 'Mgg ')}</p>
                      <p class="text-[10px] text-gray-400">${d.jumlah_pesanan} pesanan</p>
                    </div>
                  `}).join('')}
                </div>
                <div class="h-px bg-gray-100 mt-2"></div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div class="bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
              <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80 mb-2">⭐ Item Terlaris Bulan Ini</p>
              <p class="text-xl sm:text-2xl font-black mb-1">${rekap.item_terlaris}</p>
              <p class="text-xs sm:text-sm opacity-80">Terjual <span class="font-black text-yellow-300">${rekap.item_terlaris_qty} porsi</span> bulan ini</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col items-center">
              <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Komposisi Keuangan</p>
              <div class="relative w-24 h-24 sm:w-32 sm:h-32">
                <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" stroke-width="3.5"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" stroke-width="3.5"
                    stroke-dasharray="${Math.round((rekap.total_pengeluaran / rekap.total_pendapatan) * 100)} 100"
                    stroke-linecap="round"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4ade80" stroke-width="3.5"
                    stroke-dasharray="${Math.round((rekap.total_keuntungan / rekap.total_pendapatan) * 100)} 100"
                    stroke-dashoffset="-${Math.round((rekap.total_pengeluaran / rekap.total_pendapatan) * 100)}"
                    stroke-linecap="round"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <p class="text-lg sm:text-xl font-black text-gray-900">${Math.round((rekap.total_keuntungan / rekap.total_pendapatan) * 100)}%</p>
                  <p class="text-[10px] sm:text-xs text-gray-400 font-semibold">Margin</p>
                </div>
              </div>
              <div class="flex gap-4 mt-4 text-[10px] sm:text-xs">
                <span class="flex items-center gap-1"><span class="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-500 inline-block"></span>Pengeluaran</span>
                <span class="flex items-center gap-1"><span class="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-green-400 inline-block"></span>Keuntungan</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-4 sm:p-6 border-b border-gray-50">
            <h2 class="text-base sm:text-lg font-black text-gray-800">Rincian Per Minggu</h2>
          </div>
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left text-sm min-w-[700px]">
              <thead class="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-4 py-3 sm:px-6 sm:py-4">Periode</th>
                  <th class="px-4 py-3 sm:px-6 sm:py-4">Pesanan</th>
                  <th class="px-4 py-3 sm:px-6 sm:py-4">Pendapatan</th>
                  <th class="px-4 py-3 sm:px-6 sm:py-4">Pengeluaran</th>
                  <th class="px-4 py-3 sm:px-6 sm:py-4">Keuntungan</th>
                  <th class="px-4 py-3 sm:px-6 sm:py-4">Margin</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-xs sm:text-sm">
                ${rekap.data_mingguan.map((d, i) => {
                  const margin = Math.round((d.keuntungan / d.pendapatan) * 100);
                  const markerColor = margin >= 40 ? 'text-green-600 bg-green-50' : margin >= 25 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
                  return `
                  <tr class="hover:bg-orange-50/50 transition">
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <p class="font-bold text-gray-800">${d.minggu}</p>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <span class="bg-blue-50 text-[#1e3a5f] px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold">${d.jumlah_pesanan} Pesanan</span>
                    </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-gray-800 whitespace-nowrap">Rp ${d.pendapatan.toLocaleString('id-ID')}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-red-600 whitespace-nowrap">Rp ${d.pengeluaran.toLocaleString('id-ID')}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 font-bold text-green-600 whitespace-nowrap">Rp ${d.keuntungan.toLocaleString('id-ID')}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold ${markerColor}">${margin}%</span>
                    </td>
                  </tr>
                `}).join('')}
              </tbody>
              <tfoot class="text-xs sm:text-sm">
                <tr class="bg-[#1e3a5f] text-white">
                  <td class="px-4 py-3 sm:px-6 sm:py-4 font-black">TOTAL BULAN INI</td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4 font-bold whitespace-nowrap">${rekap.total_pesanan} Pesanan</td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4 font-bold whitespace-nowrap">Rp ${rekap.total_pendapatan.toLocaleString('id-ID')}</td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4 font-bold text-red-300 whitespace-nowrap">Rp ${rekap.total_pengeluaran.toLocaleString('id-ID')}</td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4 font-bold text-green-400 whitespace-nowrap">Rp ${rekap.total_keuntungan.toLocaleString('id-ID')}</td>
                  <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span class="bg-green-500 text-white px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black">
                      ${Math.round((rekap.total_keuntungan / rekap.total_pendapatan) * 100)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;

    return Layout("Rekapan Keuangan - Mang Jay", content);
  }
};