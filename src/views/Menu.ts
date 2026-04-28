export const MenuView = {
  HalamanMenu: (items: any[]) => `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Menu - Seblak Korea Mang Jay</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org@1.9.11"></script>
    </head>
    <body class="bg-gray-50 font-sans">
      <div class="max-w-6xl mx-auto p-6">
        <header class="flex justify-between items-center mb-10">
          <h1 class="text-3xl font-bold text-red-600">Menu Mang Jay 🍜</h1>
          <a href="/" class="text-gray-600 hover:underline"> Kembali ke Beranda</a>
        </header>

        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            ${items.map(item => `
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div class="h-48 bg-orange-100 flex items-center justify-center text-5xl">
                   ${item.nama.includes('Es') ? '🥤' : '🍲'}
                </div>
                <div class="p-5">
                  <h3 class="text-xl font-bold mb-1">${item.nama}</h3>
                  <p class="text-red-600 font-bold text-lg mb-4">Rp ${item.harga.toLocaleString('id-ID')}</p>
                  <button 
                    hx-post="/keranjang/tambah" 
                    hx-vals='{"id": ${item.id_barang}}' 
                    hx-target="#keranjang-side"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl transition"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="lg:w-1/3">
            <div id="keranjang-side" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                🛒 Keranjang Anda
              </h2>
              <p class="text-gray-500 italic">Keranjang masih kosong...</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  // Komponen Kecil untuk Update Isi Keranjang (Hanya HTML Fragment)
  IsiKeranjang: (keranjang: any[], total: number) => `
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      🛒 Keranjang Anda
    </h2>
    <div class="space-y-4 mb-6">
      ${keranjang.map(k => `
        <div class="flex justify-between items-center border-b pb-2">
          <div>
            <p class="font-bold text-sm">${k.nama}</p>
            <p class="text-xs text-gray-500">${k.qty} x Rp ${k.harga.toLocaleString('id-ID')}</p>
          </div>
          <p class="font-bold text-sm">Rp ${(k.qty * k.harga).toLocaleString('id-ID')}</p>
        </div>
      `).join('')}
    </div>
    <div class="flex justify-between items-center mb-6">
      <span class="font-bold text-lg">Total</span>
      <span class="font-bold text-xl text-red-600">Rp ${total.toLocaleString('id-ID')}</span>
    </div>
    <button 
      hx-post="/checkout" 
      class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
    >
      Konfirmasi Pesanan
    </button>
  `
};