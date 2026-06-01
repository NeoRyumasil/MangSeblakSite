import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

// Model untuk item menu yang akan ditampilkan 
export type ItemMenu = {
  id_makanan: number;
  nama_makanan: string;
  harga: number;
  ImagePath: string;
};

// Layout umum untuk halaman menu
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
              korean: '#facc15',
              navy: { 800: '#1e3a5f' }
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

// View untuk halaman menu pemesanan
export const MenuView = {
  HalamanMenu: (items: ItemMenu[]) => MenuLayout(
    "Pesan Menu - Seblak Korea Mang Jay",
    `
    <div class="max-w-4xl mx-auto px-4 py-6 md:py-10 relative">
      
      <div class="bg-red-600 text-white rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-center shadow-lg mx-2 md:mx-0">
        <h1 class="text-2xl md:text-3xl font-bold mb-2">Selamat Datang di Seblak Korea Mang Jay! 🍜</h1>
        <p class="text-sm md:text-base text-red-100">Silakan pilih menu favoritmu dan lengkapi data pesanan di bawah ini.</p>
      </div>

      <form id="form_pesanan" hx-post="/proses-pesanan" hx-swap="outerHTML" class="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 mx-2 md:mx-0">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">No. Antrian</label>
            <input type="text" name="no_antrian" id="no_antrian" value="Otomatis" readonly="readonly"
              class="w-full bg-gray-200 border border-gray-300 text-gray-600 rounded-xl px-4 py-3 font-bold cursor-not-allowed">
            <p class="text-xs text-gray-400 mt-1">*Diberikan setelah pesanan dibuat</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nama Pembeli <span class="text-red-500">*</span></label>
            <input type="text" name="nama_pembeli" id="nama_pembeli" required="required" placeholder="Masukkan nama Anda..."
              class="w-full bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition">
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon (WhatsApp) <span class="text-red-500">*</span></label>
            <input type="tel" name="no_hp" id="no_hp" required="required" placeholder="Contoh: 08123456789"
              class="w-full bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition">
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-2">Alamat Pengiriman <span class="text-xs text-gray-400 font-normal">(Opsional - Khusus Preorder/Delivery)</span></label>
            <textarea name="alamat" id="alamat" rows="2" placeholder="Masukkan alamat lengkap jika pesanan ini untuk Preorder / Diantar..."
              class="w-full bg-white border border-gray-300 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"></textarea>
          </div>
        </div>

        <hr class="mb-6 md:mb-8 border-gray-100">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Pilih Menu</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          ${items.map(item => {
            const itemDb = item as any;
            const pathDb = String(itemDb.ImagePath || itemDb.imagepath || itemDb.image_path || '');
            
            let imgSrc = '';
            
            if (pathDb.includes('MenuImages')) {
              const startIndex = pathDb.indexOf('MenuImages');
              
              imgSrc = 'https://raw.githubusercontent.com/NeoRyumasil/MangSeblakSite/main/public/' + pathDb.substring(startIndex);
            }

            let imgElement = '';
            if (imgSrc !== '') {
               imgElement = '<img src="' + imgSrc + '" alt="' + item.nama_makanan + '" class="w-full h-full object-contain object-center">';
            } else {
               const isDrink = item.nama_makanan.toLowerCase().includes('es') || item.nama_makanan.toLowerCase().includes('minum');
               const icon = isDrink ? '🥤' : '🍲';
               imgElement = '<div class="text-5xl">' + icon + '</div>';
            }

            return `
            <div class="bg-orange-50 rounded-2xl border border-orange-100 overflow-hidden flex flex-col">
              
              <div class="h-48 bg-orange-100 overflow-hidden relative flex items-center justify-center p-2">
                ${imgElement}
              </div>

              <div class="p-4 md:p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 class="text-lg md:text-xl font-bold mb-1">${item.nama_makanan}</h3>
                  <p class="text-red-600 font-bold text-base md:text-lg mb-4">Rp ${item.harga.toLocaleString('id-ID')}</p>
                </div>

                <div class="flex items-center justify-between bg-white rounded-xl p-2 border border-gray-200">
                  <button type="button" onclick="updateQty(${item.id_makanan}, -1)" class="w-12 h-10 md:w-10 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold text-xl transition flex items-center justify-center">−</button>
                  <input type="number" name="qty_${item.id_makanan}" id="qty_${item.id_makanan}" data-price="${item.harga}" data-name="${item.nama_makanan}" value="0" min="0" readonly="readonly" class="qty-input w-12 text-center font-bold text-lg bg-transparent border-none outline-none">
                  <button type="button" onclick="updateQty(${item.id_makanan}, 1)" class="w-12 h-10 md:w-10 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold text-xl transition flex items-center justify-center">+</button>
                </div>
              </div>
            </div>
            `;
          }).join('')}
        </div>

        <div class="bg-red-50 border border-red-200 p-4 md:p-6 rounded-2xl mb-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2 md:gap-0 shadow-sm">
          <span class="text-base md:text-lg font-bold text-gray-800">Total Pembayaran:</span>
          <span id="total_pembayaran" class="text-2xl md:text-3xl font-black text-red-600">Rp 0</span>
        </div>

        <button type="button" onclick="bukaModal()" class="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg transition text-base md:text-lg">
          ✅ Buat Pesanan
        </button>
      </form>

      <div id="modal_konfirmasi" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 transform scale-100 transition-transform max-h-[90vh] overflow-y-auto">
          <div class="text-center mb-6">
            <div class="text-5xl md:text-6xl mb-4">📝</div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-800">Konfirmasi Pesanan</h3>
            <p class="text-gray-500 mt-2 text-xs md:text-sm">Pastikan data dan pesanan Anda sudah benar.</p>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 text-xs md:text-sm">
            <div class="flex justify-between mb-2 border-b border-gray-200 pb-2">
              <span class="text-gray-500 font-medium">No. Antrian:</span>
              <span id="modal_no_antrian" class="font-bold text-gray-800"></span>
            </div>
            <div class="flex justify-between mb-2 border-b border-gray-200 pb-2">
              <span class="text-gray-500 font-medium">Nama:</span>
              <span id="modal_nama" class="font-bold text-gray-800 uppercase"></span>
            </div>
            <div class="flex justify-between mb-2 border-b border-gray-200 pb-2">
              <span class="text-gray-500 font-medium">No. Telepon:</span>
              <span id="modal_no_hp" class="font-bold text-gray-800"></span>
            </div>
            <div id="modal_alamat_container" class="hidden flex justify-between">
              <span class="text-gray-500 font-medium min-w-[60px]">Alamat:</span>
              <span id="modal_alamat" class="font-bold text-gray-800 text-right w-3/4 break-words"></span>
            </div>
          </div>

          <div class="mb-6">
            <p class="text-xs md:text-sm text-gray-500 font-medium mb-2">Menu yang dipesan:</p>
            <ul id="modal_list_menu" class="space-y-2 text-xs md:text-sm font-medium text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-200">
            </ul>
          </div>

          <div class="bg-red-50 rounded-2xl p-5 mb-8 border border-red-100 text-center">
            <p class="text-xs md:text-sm text-gray-600 mb-1 font-semibold">Total Harga:</p>
            <p id="modal_harga" class="text-2xl md:text-3xl font-black text-red-600">Rp 0</p>
          </div>

          <div class="flex gap-4">
            <button type="button" onclick="tutupModal()" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition text-sm md:text-base">
              Kembali Edit
            </button>
            <button type="button" onclick="prosesPesananHTMX()" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition text-sm md:text-base">
              Ya, Pesan
            </button>
          </div>
        </div>
      </div>

    </div>

    <script>
      // Fungsi Mengubah Kuantitas Menu
      function updateQty(id, delta) {
        const input = document.getElementById('qty_' + id);
        let currentVal = parseInt(input.value) || 0;
        let newVal = currentVal + delta;
        if (newVal < 0) newVal = 0; 
        
        input.value = newVal;
        hitungTotal(); 
      }

      // Fungsi Menghitung Total Harga Form
      function hitungTotal() {
        const inputs = document.querySelectorAll('.qty-input');
        let totalHarga = 0;

        inputs.forEach(input => {
          const qty = parseInt(input.value) || 0;
          const harga = parseInt(input.getAttribute('data-price')) || 0;
          totalHarga += (qty * harga);
        });

        document.getElementById('total_pembayaran').innerText = 'Rp ' + totalHarga.toLocaleString('id-ID');
        return totalHarga; 
      }

      // ==== FUNGSI MODAL KONFIRMASI ====

      function bukaModal() {
        const form = document.getElementById('form_pesanan');
        
        if (!form.checkValidity()) {
          form.reportValidity(); 
          return;
        }

        const totalBarang = hitungTotal();
        if (totalBarang === 0) {
          alert('Keranjang Anda kosong! Silakan pilih minimal 1 menu.');
          return;
        }

        document.getElementById('modal_no_antrian').innerText = document.getElementById('no_antrian').value;
        document.getElementById('modal_nama').innerText = document.getElementById('nama_pembeli').value;
        document.getElementById('modal_no_hp').innerText = document.getElementById('no_hp').value;

        // Tampilkan Alamat jika diisi
        const alamat = document.getElementById('alamat').value;
        const modalAlamatDiv = document.getElementById('modal_alamat_container');
        if(alamat.trim() !== "") {
            document.getElementById('modal_alamat').innerText = alamat;
            modalAlamatDiv.classList.remove('hidden');
        } else {
            modalAlamatDiv.classList.add('hidden');
        }

        const listMenuEl = document.getElementById('modal_list_menu');
        listMenuEl.innerHTML = ''; 
        
        const inputs = document.querySelectorAll('.qty-input');
        inputs.forEach(input => {
          const qty = parseInt(input.value) || 0;
          if (qty > 0) {
            const namaMenu = input.getAttribute('data-name');
            const harga = parseInt(input.getAttribute('data-price')) || 0;
            const subtotal = qty * harga;
            
            const li = document.createElement('li');
            li.className = "flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0";
            
            li.innerHTML = \`
              <span>\${namaMenu} <span class="text-red-500 font-bold ml-1">x\${qty}</span></span>
              <span class="text-gray-600 font-bold">Rp \${subtotal.toLocaleString('id-ID')}</span>
            \`;
            listMenuEl.appendChild(li);
          }
        });

        document.getElementById('modal_harga').innerText = 'Rp ' + totalBarang.toLocaleString('id-ID');
        document.getElementById('modal_konfirmasi').classList.remove('hidden');
      }

      function tutupModal() {
        document.getElementById('modal_konfirmasi').classList.add('hidden');
      }

      function prosesPesananHTMX() {
        tutupModal(); 
        document.getElementById('form_pesanan').requestSubmit();
      }
    </script>
    `
  )
};