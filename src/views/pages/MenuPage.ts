// file: views/pages/MenuPage.ts
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

type ItemMenu = {
  id_barang: number;
  nama: string;
  harga: number;
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
    ${Header("menu")}
    <main class="flex-grow">
      ${content}
    </main>
    ${Footer()}
  </body>
  </html>
`;

export const MenuView = {
  HalamanMenu: (items: ItemMenu[]) => MenuLayout(
    "Pesan Menu - Seblak Korea Mang Jay",
    `
    <div class="max-w-4xl mx-auto p-6 py-10">
      
      <!-- Banner Selamat Datang -->
      <div class="bg-red-600 text-white rounded-2xl p-8 mb-8 text-center shadow-lg">
        <h1 class="text-3xl font-bold mb-2">Selamat Datang di Seblak Korea Mang Jay! 🍜</h1>
        <p class="text-red-100">Silakan pilih menu favoritmu dan lengkapi data pesanan di bawah ini.</p>
      </div>

      <!-- Form Utama Pemesanan -->
      <form hx-post="/proses-pesanan" hx-swap="outerHTML" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <!-- No Antrian (Otomatis) -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">No. Antrian</label>
            <input type="text" name="no_antrian" id="no_antrian" readonly
              class="w-full bg-gray-200 border border-gray-300 text-gray-600 rounded-xl px-4 py-3 font-bold cursor-not-allowed">
            <p class="text-xs text-gray-400 mt-1">*Dibuat otomatis oleh sistem</p>
          </div>

          <!-- Nama Pembeli -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nama Pembeli <span class="text-red-500">*</span></label>
            <input type="text" name="nama_pembeli" required placeholder="Masukkan nama Anda..."
              class="w-full bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition">
          </div>

          <!-- Nomor Telepon Pembeli -->
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon (WhatsApp) <span class="text-red-500">*</span></label>
            <input type="tel" name="no_hp" required placeholder="Contoh: 08123456789"
              class="w-full bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition">
          </div>
        </div>

        <hr class="mb-8 border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Pilih Menu</h2>

        <!-- Card Menu -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          ${items.map(item => `
            <div class="bg-orange-50 rounded-2xl border border-orange-100 overflow-hidden flex flex-col">
              <div class="h-32 bg-orange-100 flex items-center justify-center text-5xl">
                ${item.nama.toLowerCase().includes('es') || item.nama.toLowerCase().includes('minum') ? '🥤' : '🍲'}
              </div>
              <div class="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 class="text-xl font-bold mb-1">${item.nama}</h3>
                  <p class="text-red-600 font-bold text-lg mb-4">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>

                <!-- Kontrol Menambah Item -->
                <div class="flex items-center justify-between bg-white rounded-xl p-2 border border-gray-200">
                  <button type="button" onclick="updateQty(${item.id_barang}, -1)" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold text-xl transition flex items-center justify-center">−</button>
                  <input type="number" name="qty_${item.id_barang}" id="qty_${item.id_barang}" value="0" min="0" readonly class="w-12 text-center font-bold text-lg bg-transparent border-none outline-none">
                  <button type="button" onclick="updateQty(${item.id_barang}, 1)" class="w-10 h-10 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold text-xl transition flex items-center justify-center">+</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Tombol Submit -->
        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg">
          ✅ Buat Pesanan
        </button>
      </form>
    </div>

    <!-- Script untuk Generate Antrian dan Mengubah Kuantitas -->
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        // Generate No Antrian: Angka Acak 1 - 999 (Format Integer untuk Database)
        const antrianInt = Math.floor(1 + Math.random() * 999);
        document.getElementById("no_antrian").value = antrianInt;
      });

      // Fungsi mengubah nilai di input saat tombol +/- diklik
      function updateQty(id, delta) {
        const input = document.getElementById('qty_' + id);
        let currentVal = parseInt(input.value) || 0;
        let newVal = currentVal + delta;
        if (newVal < 0) newVal = 0; // Tidak boleh minus
        input.value = newVal;
      }
    </script>
    `
  )
};