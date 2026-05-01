import { Footer } from "../components/Footer";

type ItemMenu = {
  id_barang: number;
  nama: string;
  harga: number;
};

type ItemKeranjang = {
  id_barang: number;
  nama: string;
  harga: number;
  qty: number;
};

const MenuLayout = (title: string, content: string) => `
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
              korean: '#facc15'
            }
          }
        }
      }
    </script>
  </head>
  <body class="bg-orange-50 text-gray-800 font-sans antialiased min-h-screen flex flex-col pt-20">

    <nav class="bg-white shadow-md fixed w-full z-10 top-0">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <a href="/" class="text-2xl font-bold text-red-600 hover:text-red-700 transition">
            🍜 Seblak Korea Mang Jay
          </a>
          <div class="hidden md:flex space-x-6">
            <a href="/#tentang" class="hover:text-red-500 font-medium transition">Tentang</a>
            <a href="/menu" class="text-red-600 font-bold transition">Menu</a>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      ${content}
    </main>

    ${Footer()}
  </body>
  </html>
`;

export const MenuView = {
  HalamanMenu: (items: ItemMenu[]) => MenuLayout(
    "Menu - Seblak Korea Mang Jay",
    `
    <div class="max-w-6xl mx-auto p-6 py-10">
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-red-600">Menu Kami 🍜</h1>
        <p class="text-gray-500 mt-1">Pilih menu favoritmu dan tambahkan ke keranjang</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Grid Menu -->
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
                  hx-vals='{"id": "${item.id_barang}"}'
                  hx-target="#keranjang-side"
                  hx-swap="innerHTML"
                  hx-indicator="#loading-${item.id_barang}"
                  class="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-2 rounded-xl transition"
                >
                  <span id="loading-${item.id_barang}" class="htmx-indicator text-sm">⏳</span>
                  + Tambah ke Keranjang
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Keranjang Sidebar -->
        <div class="lg:w-1/3">
          <div
            id="keranjang-side"
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24"
            hx-get="/keranjang"
            hx-trigger="load"
            hx-swap="innerHTML"
          >
            <h2 class="text-xl font-bold mb-4">🛒 Keranjang Anda</h2>
            <p class="text-gray-400 italic text-sm">Memuat keranjang...</p>
          </div>
        </div>

      </div>
    </div>

    <style>
      .htmx-indicator { display: none; }
      .htmx-request .htmx-indicator { display: inline; }
    </style>
    `
  ),

  // Fragment HTML untuk isi keranjang — di-swap oleh HTMX
  IsiKeranjang: (keranjang: ItemKeranjang[], total: number) => {
    if (keranjang.length === 0) {
      return `
        <h2 class="text-xl font-bold mb-4">🛒 Keranjang Anda</h2>
        <div class="text-center py-8">
          <p class="text-4xl mb-3">🛒</p>
          <p class="text-gray-400 italic text-sm">Keranjang masih kosong...</p>
          <p class="text-gray-400 text-xs mt-1">Tambahkan menu favoritmu!</p>
        </div>
      `;
    }

    return `
      <h2 class="text-xl font-bold mb-4">🛒 Keranjang Anda</h2>

      <div class="space-y-3 mb-6">
        ${keranjang.map(k => `
          <div class="border-b pb-3">
            <div class="flex justify-between items-start mb-2">
              <p class="font-semibold text-sm flex-1 pr-2">${k.nama}</p>
              <p class="font-bold text-sm text-red-600 whitespace-nowrap">
                Rp ${(k.qty * k.harga).toLocaleString('id-ID')}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-400">Rp ${k.harga.toLocaleString('id-ID')} / porsi</p>
              <div class="flex items-center gap-2">
                <button
                  hx-post="/keranjang/kurang"
                  hx-vals='{"id": "${k.id_barang}"}'
                  hx-target="#keranjang-side"
                  hx-swap="innerHTML"
                  class="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold text-sm transition flex items-center justify-center"
                >−</button>
                <span class="font-bold text-sm w-4 text-center">${k.qty}</span>
                <button
                  hx-post="/keranjang/tambah"
                  hx-vals='{"id": "${k.id_barang}"}'
                  hx-target="#keranjang-side"
                  hx-swap="innerHTML"
                  class="w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold text-sm transition flex items-center justify-center"
                >+</button>
                <button
                  hx-post="/keranjang/hapus"
                  hx-vals='{"id": "${k.id_barang}"}'
                  hx-target="#keranjang-side"
                  hx-swap="innerHTML"
                  class="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 text-xs transition flex items-center justify-center"
                  title="Hapus"
                >🗑</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-between items-center mb-6 pt-2 border-t-2 border-gray-100">
        <span class="font-bold text-lg">Total</span>
        <span class="font-bold text-xl text-red-600">Rp ${total.toLocaleString('id-ID')}</span>
      </div>

      <button
        hx-post="/checkout"
        hx-target="body"
        class="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg transition"
      >
        ✅ Konfirmasi Pesanan
      </button>
    `;
  }
};