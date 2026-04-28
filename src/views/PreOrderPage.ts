import { Footer } from "./components/Footer";

type ItemPesanan = {
  nama: string;
  qty: number;
  harga: number;
};

type Preorder = {
  id: number;
  no_antrian: string;
  nama_pemesan: string;
  nomor_pemesan: string;
  alamat_pemesan: string;
  lat_pemesan: number;
  lng_pemesan: number;
  items: ItemPesanan[];
  total_harga: number;
  status_pembayaran: "lunas" | "belum_lunas" | "dp";
  status_pengantaran: "menunggu" | "diproses" | "dikirim" | "selesai";
};

const badgePembayaran: Record<Preorder["status_pembayaran"], string> = {
  lunas: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Lunas</span>`,
  belum_lunas: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Belum Lunas</span>`,
  dp: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">DP</span>`,
};

const badgePengantaran: Record<Preorder["status_pengantaran"], string> = {
  menunggu: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">Menunggu</span>`,
  diproses: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Diproses</span>`,
  dikirim: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Dikirim</span>`,
  selesai: `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Selesai</span>`,
};

export const PreorderView = {
  HalamanPreorder: (preorders: Preorder[]) => `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Monitor Preorder - Mang Jay</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org@1.9.11"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js"></script>
      <style>
        #map { height: 380px; width: 100%; border-radius: 1rem; z-index: 0; }
        /* Fix tile tidak muncul saat map di dalam modal */
        .leaflet-container { background: #e8e8e8; }
        .leaflet-routing-container { display: none !important; }
        .row-pesanan { cursor: pointer; transition: background 0.15s; }
        .row-pesanan:hover { background: #fff7ed; }
        .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; align-items: center; justify-content: center; }
        .modal-overlay.aktif { display: flex; }
      </style>
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
    <body class="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen flex flex-col pt-20">

      <!-- Navbar -->
      <nav class="bg-white shadow-md fixed w-full z-10 top-0">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <a href="/" class="text-2xl font-bold text-red-600 hover:text-red-700 transition">
              🍜 Seblak Korea Mang Jay
            </a>
            <div class="hidden md:flex space-x-6 text-sm">
              <a href="/admin" class="hover:text-red-500 font-medium transition">Dashboard</a>
              <a href="/admin/preorder" class="text-red-600 font-bold">Preorder</a>
              <a href="/menu" class="hover:text-red-500 font-medium transition">Menu</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-grow max-w-7xl mx-auto w-full p-6 py-10">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Monitor Preorder 📦</h1>
            <p class="text-gray-400 text-sm mt-1">Klik baris pesanan untuk melihat detail & rute pengantaran</p>
          </div>
          <span class="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
            ${preorders.length} Total Preorder
          </span>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-5 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Total</p>
            <p class="text-2xl font-black">${preorders.length}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Dikirim</p>
            <p class="text-2xl font-black text-orange-500">${preorders.filter(p => p.status_pengantaran === "dikirim").length}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Belum Lunas</p>
            <p class="text-2xl font-black text-red-500">${preorders.filter(p => p.status_pembayaran === "belum_lunas").length}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Selesai</p>
            <p class="text-2xl font-black text-green-500">${preorders.filter(p => p.status_pengantaran === "selesai").length}</p>
          </div>
        </div>

        <!-- Tabel Preorder -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-5 py-4">No. Antrian</th>
                  <th class="px-5 py-4">Pemesan</th>
                  <th class="px-5 py-4">Nomor HP</th>
                  <th class="px-5 py-4">Alamat</th>
                  <th class="px-5 py-4">Pesanan</th>
                  <th class="px-5 py-4">Total</th>
                  <th class="px-5 py-4">Pembayaran</th>
                  <th class="px-5 py-4">Pengantaran</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${preorders.map(p => `
                  <tr
                    class="row-pesanan"
                    onclick="bukaDetail(${JSON.stringify(p).replace(/'/g, "&#39;")})"
                  >
                    <td class="px-5 py-4 font-bold text-blue-600">#${p.no_antrian}</td>
                    <td class="px-5 py-4 font-semibold">${p.nama_pemesan}</td>
                    <td class="px-5 py-4 text-gray-500">${p.nomor_pemesan}</td>
                    <td class="px-5 py-4 text-gray-500 max-w-xs truncate">${p.alamat_pemesan}</td>
                    <td class="px-5 py-4">
                      <p class="text-gray-700">${p.items.map(i => `${i.nama} (x${i.qty})`).join(", ")}</p>
                      <p class="text-xs text-gray-400">${p.items.reduce((s, i) => s + i.qty, 0)} item</p>
                    </td>
                    <td class="px-5 py-4 font-bold text-red-600">Rp ${p.total_harga.toLocaleString('id-ID')}</td>
                    <td class="px-5 py-4">${badgePembayaran[p.status_pembayaran]}</td>
                    <td class="px-5 py-4">${badgePengantaran[p.status_pengantaran]}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            ${preorders.length === 0 ? `
              <div class="text-center py-16 text-gray-400">
                <p class="text-4xl mb-3">📭</p>
                <p class="font-medium">Belum ada preorder masuk</p>
              </div>
            ` : ''}
          </div>
        </div>
      </main>

      ${Footer()}

      <!-- Modal Detail + Map -->
      <div id="modal-overlay" class="modal-overlay" onclick="tutupModal(event)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-center px-6 py-5 border-b border-gray-100">
            <h2 class="text-xl font-bold" id="modal-judul">Detail Pesanan</h2>
            <button onclick="tutupModalDirect()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>

          <!-- Info Pesanan -->
          <div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-400 uppercase font-bold mb-1">Nama Pemesan</p>
              <p class="font-semibold" id="m-nama">-</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase font-bold mb-1">Nomor HP</p>
              <p class="font-semibold" id="m-nomor">-</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-gray-400 uppercase font-bold mb-1">Alamat Pengantaran</p>
              <p class="font-semibold" id="m-alamat">-</p>
            </div>
          </div>

          <!-- Detail Pesanan -->
          <div class="px-6 py-5 border-b border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-3">Barang Dipesan</p>
            <div id="m-items" class="space-y-2"></div>
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span class="font-bold text-gray-700">Total</span>
              <span class="font-black text-xl text-red-600" id="m-total">-</span>
            </div>
          </div>

          <!-- Status -->
          <div class="px-6 py-5 flex gap-4 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-400 uppercase font-bold mb-2">Status Pembayaran</p>
              <div id="m-status-bayar"></div>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase font-bold mb-2">Status Pengantaran</p>
              <div id="m-status-antar"></div>
            </div>
          </div>

          <!-- Map -->
          <div class="px-6 py-5">
            <p class="text-xs text-gray-400 uppercase font-bold mb-3">Rute Pengantaran</p>
            <div id="map"></div>
            <p class="text-xs text-gray-400 mt-2 text-center">📍 Merah = Pengantar (Warung) &nbsp;|&nbsp; 🔵 Biru = Penerima</p>
          </div>

          <!-- Aksi -->
          <div class="px-6 py-5 flex gap-3 border-t border-gray-100">
            <button
              id="btn-selesaikan"
              onclick="selesaikanPesanan()"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
            >
              ✅ Tandai Selesai
            </button>
            <button
              onclick="tutupModalDirect()"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>

      <script>
        // Koordinat warung Mang Jay (pengantar) — ganti sesuai lokasi asli
        const LAT_WARUNG = -6.9175;
        const LNG_WARUNG = 107.6191;

        let mapInstance = null;
        let routingControl = null;
        let pesananAktif = null;

        const badgePembayaran = {
          lunas: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Lunas</span>',
          belum_lunas: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Belum Lunas</span>',
          dp: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">DP</span>',
        };

        const badgePengantaran = {
          menunggu: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">Menunggu</span>',
          diproses: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Diproses</span>',
          dikirim: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Dikirim</span>',
          selesai: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Selesai</span>',
        };

        function bukaDetail(pesanan) {
          pesananAktif = pesanan;

          document.getElementById('modal-judul').textContent = 'Detail Pesanan #' + pesanan.no_antrian;
          document.getElementById('m-nama').textContent = pesanan.nama_pemesan;
          document.getElementById('m-nomor').textContent = pesanan.nomor_pemesan;
          document.getElementById('m-alamat').textContent = pesanan.alamat_pemesan;
          document.getElementById('m-total').textContent = 'Rp ' + pesanan.total_harga.toLocaleString('id-ID');
          document.getElementById('m-status-bayar').innerHTML = badgePembayaran[pesanan.status_pembayaran] || '-';
          document.getElementById('m-status-antar').innerHTML = badgePengantaran[pesanan.status_pengantaran] || '-';

          // Isi item
          const itemsEl = document.getElementById('m-items');
          itemsEl.innerHTML = pesanan.items.map(i => \`
            <div class="flex justify-between text-sm">
              <span class="text-gray-700">\${i.nama} <span class="text-gray-400">x\${i.qty}</span></span>
              <span class="font-semibold">Rp \${(i.harga * i.qty).toLocaleString('id-ID')}</span>
            </div>
          \`).join('');

          document.getElementById('modal-overlay').classList.add('aktif');

          // Tunggu modal visible + layout selesai, baru init map
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              geocodeLaluBukaMap(pesanan.alamat_pemesan, pesanan.lat_pemesan, pesanan.lng_pemesan);
            });
          });
        }

        async function geocodeLaluBukaMap(alamat, latDb, lngDb) {
          // Kalau sudah ada koordinat dari DB, langsung pakai
          if (latDb && lngDb && latDb !== 0 && lngDb !== 0) {
            inisialisasiMap(latDb, lngDb);
            return;
          }
          // Kalau tidak ada, geocode dari alamat teks via Nominatim
          try {
            const res = await fetch(
              'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(alamat) + '&format=json&limit=1',
              { headers: { 'User-Agent': 'SeblakMangJay/1.0' } }
            );
            const data = await res.json();
            if (!data.length) {
              document.getElementById('map').innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">📍 Alamat tidak ditemukan di peta</div>';
              return;
            }
            inisialisasiMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
          } catch(e) {
            document.getElementById('map').innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">⚠️ Gagal memuat peta</div>';
          }
        }

        function inisialisasiMap(latPenerima, lngPenerima) {
          // Destroy map lama jika ada
          if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
            routingControl = null;
          }

          mapInstance = L.map('map', { zoomControl: true }).setView([LAT_WARUNG, LNG_WARUNG], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
          }).addTo(mapInstance);

          // Penting: invalidateSize agar tile muncul di dalam modal
          mapInstance.invalidateSize();

          // Marker pengantar (warung) - merah
          const ikonMerah = L.icon({
            iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
            className: 'marker-merah'
          });

          const ikonBiru = L.icon({
            iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
          });

          L.marker([LAT_WARUNG, LNG_WARUNG], { icon: ikonMerah })
            .addTo(mapInstance)
            .bindPopup('<b>🍜 Warung Mang Jay</b><br>Titik keberangkatan')
            .openPopup();

          L.marker([latPenerima, lngPenerima], { icon: ikonBiru })
            .addTo(mapInstance)
            .bindPopup('<b>📦 Lokasi Penerima</b><br>' + document.getElementById('m-alamat').textContent);

          // Routing rute tercepat via OSRM
          if (typeof L.Routing !== 'undefined') {
            routingControl = L.Routing.control({
              waypoints: [
                L.latLng(LAT_WARUNG, LNG_WARUNG),
                L.latLng(latPenerima, lngPenerima),
              ],
              routeWhileDragging: false,
              show: false,
              addWaypoints: false,
              fitSelectedRoutes: true,
              lineOptions: {
                styles: [{ color: '#ef4444', weight: 5, opacity: 0.85 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0,
              },
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving',
              }),
            }).addTo(mapInstance);

            // Invalidate lagi setelah routing selesai
            routingControl.on('routesfound', () => mapInstance.invalidateSize());
          } else {
            // Fallback: gambar garis lurus jika routing tidak tersedia
            L.polyline([[LAT_WARUNG, LNG_WARUNG], [latPenerima, lngPenerima]], {
              color: '#ef4444', weight: 4, opacity: 0.7, dashArray: '8 6'
            }).addTo(mapInstance);
            mapInstance.fitBounds([[LAT_WARUNG, LNG_WARUNG], [latPenerima, lngPenerima]], { padding: [40, 40] });
          }
        }

        function tutupModal(event) {
          // Dipanggil dari tombol × atau tombol Tutup (tanpa event)
          // atau dari klik overlay (dengan event, cek target)
          if (event && event.target !== document.getElementById('modal-overlay')) return;
          document.getElementById('modal-overlay').classList.remove('aktif');
          if (mapInstance) { mapInstance.remove(); mapInstance = null; routingControl = null; }
          pesananAktif = null;
        }

        function tutupModalDirect() {
          document.getElementById('modal-overlay').classList.remove('aktif');
          if (mapInstance) { mapInstance.remove(); mapInstance = null; routingControl = null; }
          pesananAktif = null;
        }

        function selesaikanPesanan() {
          if (!pesananAktif) return;
          fetch('/admin/preorder/selesaikan/' + pesananAktif.id, { method: 'POST' })
            .then(res => {
              if (res.ok) {
                alert('Pesanan #' + pesananAktif.no_antrian + ' ditandai selesai!');
                tutupModal();
                location.reload();
              }
            })
            .catch(() => alert('Gagal update status. Coba lagi.'));
        }
      </script>

    </body>
    </html>
  `,
};