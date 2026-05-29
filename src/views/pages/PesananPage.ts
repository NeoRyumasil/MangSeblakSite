// Layout dan View untuk halaman menu pemesanan
const PesananLayout = (title: string, content: string) => `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/htmx.org@1.9.11"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              spicy: { 500: '#ef4444', 600: '#dc2626', 900: '#7f1d1d' },
              navy: { 800: '#1e3a5f', 900: '#152d4a' }
            }
          }
        }
      }
    </script>
    <style>
      .htmx-indicator { display: none; }
      .htmx-request .htmx-indicator { display: inline; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen flex flex-col">
    
    <nav class="bg-[#1e3a5f] text-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <a href="/" class="flex items-center gap-3 hover:opacity-90 transition">
              <img src="/Logo/Logo.png" alt="Mang Jay" class="w-9 h-9 object-contain">
              <span class="text-lg sm:text-xl font-black text-white">Mang Jay</span>
            </a>
            
            <div class="hidden md:flex space-x-2">
              <a href="/admin" class="text-white/60 hover:bg-white/10 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2">
                📊 Dashboard Admin
              </a>
              <a href="/pesanan" class="bg-red-600 text-white shadow-lg shadow-red-900/30 px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2">
                🧾 Kelola Pesanan
              </a>
            </div>
          </div>
          
          <div>
            <a href="/logout" class="text-white/50 hover:text-red-400 text-sm font-semibold transition flex items-center gap-2">
              <span>🚪</span> Keluar
            </a>
          </div>
        </div>
      </div>

      <div class="md:hidden border-t border-white/10 px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
        <a href="/admin" class="whitespace-nowrap text-white/60 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-semibold">📊 Dashboard</a>
        <a href="/pesanan" class="whitespace-nowrap bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md">🧾 Pesanan</a>
        <a href="/admin/stok" class="whitespace-nowrap text-white/60 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-semibold">🥬 Stok</a>
        <a href="/admin/staff" class="whitespace-nowrap text-white/60 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-semibold">👥 Staff</a>
      </div>
    </nav>

    <main class="flex-1 w-full">
      ${content}
    </main>
  </body>
  </html>
`;

// View untuk halaman manajemen pesanan di admin
export const PesananView = {
  HalamanPesanan: (stats: any, pesananAktif: any[]) => {
    const content = `
      <div class="max-w-7xl mx-auto p-4 sm:p-6">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Riwayat Pesanan</h1>
          <button hx-post="/admin/reset-antrian" hx-target="body" hx-confirm="Apakah Anda yakin ingin mereset urutan nomor antrian kembali ke 1?" class="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm sm:text-base font-bold hover:bg-red-100 transition shadow-sm flex items-center gap-2 w-full md:w-auto justify-center">
            🔄 Reset No. Antrian
          </button>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-l-4 border-[#1e3a5f]">
            <p class="text-[10px] sm:text-sm text-gray-500 font-bold uppercase">Total Pesanan</p>
            <p class="text-xl sm:text-2xl font-black">${stats.total}</p>
          </div>
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500">
            <p class="text-[10px] sm:text-sm text-gray-500 font-bold uppercase">Belum Selesai</p>
            <p class="text-xl sm:text-2xl font-black">${stats.belum}</p>
          </div>
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
            <p class="text-[10px] sm:text-sm text-gray-500 font-bold uppercase">Keuntungan</p>
            <p class="text-lg sm:text-2xl font-black text-green-600 truncate">Rp ${stats.untung.toLocaleString('id-ID')}</p>
          </div>
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-l-4 border-red-600">
            <p class="text-[10px] sm:text-sm text-gray-500 font-bold uppercase">Sisa Stok</p>
            <p class="text-xl sm:text-2xl font-black">${stats.stok} Porsi</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div class="p-4 sm:p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-lg sm:text-xl font-bold">Daftar Antrian</h2>
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">${pesananAktif.length} Antrian</span>
          </div>
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left min-w-[700px]">
              <thead class="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase">
                <tr>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">No</th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4">Nama Pemesan</th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4">No. Telepon</th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4">Pesanan</th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Total Harga</th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-sm">
                ${pesananAktif.map((p: any) => {
                  let detailItem = p.items;
                  let totalQty = 0;
                  try {
                    const items = JSON.parse(p.items);
                    detailItem = items.map((i: any) => `${i.nama} (x${i.qty})`).join(", ");
                    totalQty = items.reduce((sum: number, i: any) => sum + i.qty, 0);
                  } catch (e) {
                    // Fallback apabila JSON gagal di-parse
                  }
                  
                  const isSelesai = p.status === 'Selesai';
                  const rowClass = isSelesai ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50 transition bg-white';
                  const badgeStatus = isSelesai 
                    ? '<span class="inline-block mt-1 bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-1 rounded">Selesai</span>' 
                    : '<span class="inline-block mt-1 bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold px-2 py-1 rounded">Menunggu</span>';

                  const noHpBersih = p.catatan ? p.catatan.replace('HP: ', '').trim() : '-';

                  const tombolAksi = isSelesai 
                    ? `<button hx-post="/admin/batal-selesaikan/${p.id}" hx-target="body" class="bg-gray-200 text-gray-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold hover:bg-gray-300 hover:text-gray-800 transition text-xs sm:text-sm shadow-sm whitespace-nowrap">
                        Batalkan Selesai
                      </button>`
                    : `<button hx-post="/admin/selesaikan/${p.id}" hx-target="body" class="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold hover:bg-green-600 transition text-xs sm:text-sm shadow-sm whitespace-nowrap">
                        Selesaikan
                      </button>`;

                  return `
                    <tr class="${rowClass}">
                      <td class="px-4 sm:px-6 py-3 sm:py-4 font-black text-lg sm:text-xl ${isSelesai ? 'text-gray-400' : 'text-[#1e3a5f]'}">#${p.no_antrian}</td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4">
                        <p class="font-bold text-base sm:text-lg whitespace-nowrap">${p.nama_pelanggan}</p>
                        ${badgeStatus}
                      </td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4">
                        <p class="text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg inline-block whitespace-nowrap">${noHpBersih}</p>
                      </td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        <p class="text-gray-700 font-medium ${isSelesai ? 'line-through decoration-2 decoration-gray-400' : ''}">${detailItem}</p>
                        <p class="text-[10px] sm:text-xs text-gray-400 font-bold mt-1">${totalQty > 0 ? `${totalQty} Barang` : ''}</p>
                      </td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4 font-bold ${isSelesai ? 'text-gray-500' : 'text-red-600'} text-base sm:text-lg whitespace-nowrap">Rp ${p.total_harga.toLocaleString('id-ID')}</td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4">
                        ${tombolAksi}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            ${pesananAktif.length === 0 ? '<p class="p-10 text-center text-gray-400 italic font-medium">Belum ada pesanan yang masuk.</p>' : ''}
          </div>
        </div>
      </div>
    `; 

    return PesananLayout("Kelola Pesanan — Mang Jay Admin", content);
  }
};