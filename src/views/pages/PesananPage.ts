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
              <img src="https://raw.githubusercontent.com/NeoRyumasil/MangSeblakSite/main/public/Logo/Logo.png" alt="Mang Jay" class="w-9 h-9 object-contain">
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

    <main class="flex-1 w-full pb-10">
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

        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Daftar Antrian</h2>
          <span class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">${pesananAktif.length} Antrian</span>
        </div>

        <div class="flex flex-col gap-6">
          ${pesananAktif.length === 0 ? '<div class="bg-white p-10 rounded-2xl text-center text-gray-400 italic font-medium border border-gray-100 shadow-sm">Belum ada pesanan yang masuk.</div>' : ''}
          
          ${pesananAktif.map((p: any) => {
            let detailItem = p.items;
            let totalQty = 0;
            try {
              const items = JSON.parse(p.items);
              detailItem = items.map((i: any) => `${i.nama} <strong class="text-red-500">(x${i.qty})</strong>`).join("<br/>");
              totalQty = items.reduce((sum: number, i: any) => sum + i.qty, 0);
            } catch (e) {
              console.error("Error: ", e)
            }
            
            const isSelesai = p.status === 'Selesai';
            const isBayarLunas = p.status_bayar === 'Lunas' || p.status_bayar === 1;
            const isMakananSiap = p.status_makanan === 'Selesai';
            const noHpBersih = p.catatan ? p.catatan.replace('HP: ', '').trim() : '-';

            return `
              <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${isSelesai ? 'opacity-70 bg-gray-50' : 'hover:shadow-md transition'}">
                
                <div class="bg-gray-50 border-b border-gray-100 p-4 sm:p-5 flex justify-between items-center">
                   <div class="flex items-center gap-4">
                      <div class="bg-[#1e3a5f] text-white w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl shadow-inner">
                         ${p.no_antrian}
                      </div>
                      <div>
                         <h3 class="font-bold text-xl text-gray-800">${p.nama_pelanggan}</h3>
                         <p class="text-sm text-gray-500 font-medium mt-0.5">📞 ${noHpBersih}</p>
                      </div>
                   </div>
                   ${isSelesai 
                     ? `<span class="bg-green-100 text-green-800 border border-green-200 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">✅ Selesai</span>` 
                     : `<span class="bg-yellow-100 text-yellow-800 border border-yellow-200 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">⏳ Sedang Diproses</span>`
                   }
                </div>

                <div class="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
                   
                   <div class="flex-1 flex flex-col gap-4">
                      
                      ${p.alamat ? `
                      <div>
                         <span class="block text-xs font-bold text-gray-400 uppercase mb-1.5">Alamat Pengiriman (Preorder)</span>
                         <div class="bg-blue-50 text-blue-900 border border-blue-100 p-3.5 rounded-xl text-sm font-medium leading-relaxed">
                            📍 ${p.alamat}
                         </div>
                      </div>
                      ` : ''}

                      <div>
                         <span class="block text-xs font-bold text-gray-400 uppercase mb-1.5">Daftar Makanan yang Dipesan</span>
                         <div class="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                            <p class="text-gray-800 font-medium leading-relaxed ${isSelesai ? 'line-through text-gray-500' : ''}">${detailItem}</p>
                            <div class="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                               <span class="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">${totalQty} Total Barang</span>
                               <div class="text-left sm:text-right w-full sm:w-auto">
                                  <span class="block text-[10px] font-bold text-gray-400 uppercase">Total Tagihan</span>
                                  <span class="text-2xl font-black text-red-600 block mt-0.5">Rp ${p.total_harga.toLocaleString('id-ID')}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div class="w-full md:w-80 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-6">
                      <span class="block text-xs font-bold text-gray-400 uppercase">Kontrol Status (Aksi)</span>
                      
                      <div class="bg-orange-50 border border-orange-100 p-3.5 rounded-xl flex flex-col gap-2.5 shadow-sm">
                         <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-orange-900">Dapur / Makanan:</span>
                            ${isMakananSiap 
                               ? '<span class="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">Siap</span>' 
                               : '<span class="bg-orange-200 text-orange-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-orange-300">Dimasak</span>'}
                         </div>
                         ${isMakananSiap 
                            ? `<button hx-post="/admin/batal-makanan/${p.id}" hx-target="body" class="w-full bg-white text-orange-600 border border-orange-200 px-3 py-2.5 rounded-lg font-bold hover:bg-orange-100 transition text-xs text-center flex items-center justify-center gap-1.5">🔄 Batal (Makanan)</button>`
                            : `<button hx-post="/admin/selesaikan-makanan/${p.id}" hx-target="body" class="w-full bg-orange-500 text-white px-3 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition text-xs shadow text-center flex items-center justify-center gap-1.5">🍳 Tandai Makanan Siap</button>`}
                      </div>

                      <div class="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex flex-col gap-2.5 shadow-sm">
                         <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-blue-900">Pembayaran:</span>
                            ${isBayarLunas 
                               ? '<span class="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">Lunas</span>' 
                               : '<span class="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">Belum Bayar</span>'}
                         </div>
                         ${isBayarLunas
                            ? `<button hx-post="/admin/batal-bayar/${p.id}" hx-target="body" class="w-full bg-white text-blue-600 border border-blue-200 px-3 py-2.5 rounded-lg font-bold hover:bg-blue-100 transition text-xs text-center flex items-center justify-center gap-1.5">🔄 Batal (Bayar)</button>`
                            : `<button hx-post="/admin/selesaikan-bayar/${p.id}" hx-target="body" class="w-full bg-blue-600 text-white px-3 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition text-xs shadow text-center flex items-center justify-center gap-1.5">💵 Tandai Lunas</button>`}
                      </div>

                      <div class="mt-auto pt-3 border-t border-gray-100">
                         ${isSelesai
                            ? `<button hx-post="/admin/batal-selesaikan/${p.id}" hx-target="body" class="w-full bg-gray-200 text-gray-700 border border-gray-300 px-4 py-3.5 rounded-xl font-bold hover:bg-gray-300 transition text-sm text-center">Batalkan Selesai Semua</button>`
                            : `<button hx-post="/admin/selesaikan/${p.id}" hx-target="body" class="w-full bg-green-600 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-green-700 shadow-md shadow-green-900/20 transition text-sm text-center">✅ Selesaikan Pesanan</button>`}
                      </div>

                   </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `; 

    return PesananLayout("Kelola Pesanan — Mang Jay Admin", content);
  }
};