// Model Barang
type Barang = {
  id_barang: number;
  nama: string;
  harga: number;
  stok: number;
};

// Model Pesanan
type Pesanan = {
  id_pesanan: number;
  no_antrian: number;
  nama: string;
  items: string;
  total_harga: number;
  status: string;
  status_bayar: number;
  no_hp: string;
};

// Model Staff
type Staff = {
  id: number;
  nama: string;
  username: string;
  role: "admin" | "kasir" | "dapur" | "kurir";
  no_hp: string;
  tanggal_bergabung: string;
  aktif: boolean;
};

// Model User
export type AdminDashboardData = {
  stok: Barang[];
  pesanan: Pesanan[];
  staff: Staff[];
};

// Sidebar Admin
const Sidebar = (activeTab: string) => `
  <aside class="w-64 shrink-0 hidden lg:flex flex-col bg-[#1e3a5f] min-h-screen fixed top-0 left-0 z-20 pt-0">
    <div class="px-6 py-5 border-b border-white/10">
      <a href="/" class="flex items-center gap-3 hover:opacity-90 transition">
        <img src="/Logo/Logo.png" alt="Mang Jay" class="w-10 h-10 object-contain">
        <div>
          <span class="text-xl font-black text-white block leading-none">Mang Jay</span>
          <span class="text-xs text-white/40 font-medium">Panel Admin</span>
        </div>
      </a>
    </div>
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      ${[
        { href: "/admin", icon: "📊", label: "Dashboard", key: "dashboard" },
        { href: "/pesanan", icon: "🧾", label: "Pesanan", key: "pesanan" },
        { href: "/admin/stok", icon: "🥬", label: "Stok Bahan", key: "stok" },
        { href: "/admin/staff", icon: "👥", label: "Manajemen Staff", key: "staff" },
      ].map(item => `
        <a href="${item.href}"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition
            ${activeTab === item.key
              ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
              : "text-white/60 hover:bg-white/10 hover:text-white"
            }"
        >
          <span class="text-base">${item.icon}</span>
          ${item.label}
        </a>
      `).join("")}
    </nav>
    <div class="px-3 py-4 border-t border-white/10">
      <a href="/logout"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:bg-red-900/40 hover:text-red-400 transition">
        <span>🚪</span> Keluar
      </a>
    </div>
  </aside>
`;

// TopBar untuk tampilan mobile
const TopBar = (title: string, activeTab: string) => `
  <header class="lg:hidden bg-[#1e3a5f] text-white sticky top-0 z-30 shadow-md">
    <div class="px-5 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 hover:opacity-90 transition">
        <img src="/Logo/Logo.png" alt="Mang Jay" class="w-8 h-8 object-contain">
        <span class="font-black text-lg">Mang Jay Admin</span>
      </a>
      <span class="font-bold text-sm text-white/60 truncate ml-2">${title}</span>
    </div>
    <div class="border-t border-white/10 px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
      ${[
        { href: "/admin", label: "📊 Dashboard", key: "dashboard" },
        { href: "/pesanan", label: "🧾 Pesanan", key: "pesanan" },
        { href: "/admin/stok", label: "🥬 Stok", key: "stok" },
        { href: "/admin/staff", label: "👥 Staff", key: "staff" },
      ].map(item => `
        <a href="${item.href}" class="whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === item.key ? "bg-red-600 text-white shadow-md" : "text-white/60 hover:bg-white/10"}">
          ${item.label}
        </a>
      `).join("")}
    </div>
  </header>
`;

// Layout utama untuk halaman admin
const AdminLayout = (title: string, activeTab: string, content: string) => `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Mang Jay Admin</title>
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
      aside::-webkit-scrollbar { width: 4px; }
      aside::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen">
    ${Sidebar(activeTab)}
    ${TopBar(title, activeTab)}
    <div class="lg:pl-64 min-h-screen flex flex-col">
      <main class="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        ${content}
      </main>
    </div>
  </body>
  </html>
`;

// Badge untuk status stok
const badgeStok = (stok: number) => {
  if (stok === 0)
    return `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">Habis</span>`;
  if (stok <= 5)
    return `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-100 text-yellow-700 whitespace-nowrap">Hampir Habis</span>`;
  return `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-100 text-green-700 whitespace-nowrap">Aman</span>`;
};

// Badge untuk role staff
const badgeRole: Record<Staff["role"], string> = {
  admin: `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">Admin</span>`,
  kasir: `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-700 whitespace-nowrap">Kasir</span>`,
  dapur: `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-orange-100 text-orange-700 whitespace-nowrap">Dapur</span>`,
  kurir: `<span class="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-100 text-green-700 whitespace-nowrap">Kurir</span>`,
};

// View untuk halaman dashboard admin
export const AdminView = {
  HalamanDashboard: (data: AdminDashboardData) => {
    const { stok, pesanan, staff } = data;
    const stokAktif = stok.filter(s => s.stok > 0).length;
    const totalPesananAll = pesanan.length;
    const totalPendapatanAll = pesanan.reduce((sum, p) => sum + p.total_harga, 0);
    const staffAktif = staff.filter(s => s.aktif).length;

    const content = `
      <div class="py-4 sm:py-6 space-y-8 sm:space-y-10">
        <div>
          <p class="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Panel Admin</p>
          <h1 class="text-2xl sm:text-3xl font-black text-gray-900">Dashboard</h1>
          <p class="text-xs sm:text-sm text-gray-400 mt-1">Ringkasan stok, pesanan, dan SDM Mang Jay.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm border-l-4 border-orange-500">
            <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Pesanan</p>
            <p class="text-2xl sm:text-3xl font-black text-gray-800">${totalPesananAll}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm border-l-4 border-green-500">
            <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Pendapatan Kotor</p>
            <p class="text-lg sm:text-2xl font-black text-gray-800 truncate">Rp ${totalPendapatanAll.toLocaleString("id-ID")}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm border-l-4 border-yellow-500">
            <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Barang Stok</p>
            <p class="text-2xl sm:text-3xl font-black text-gray-800">${stok.length}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm border-l-4 border-[#1e3a5f]">
            <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Staff Aktif</p>
            <p class="text-2xl sm:text-3xl font-black text-gray-800">${staffAktif}</p>
          </div>
        </div>

        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg sm:text-xl font-black text-gray-800">📦 Pesanan Terakhir</h2>
            <a href="/pesanan" class="text-red-600 font-bold text-xs sm:text-sm hover:underline">Lihat Semua →</a>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto w-full">
              <table class="w-full text-left text-sm min-w-[500px]">
                <thead class="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-4 py-3 sm:px-5 sm:py-3 whitespace-nowrap">No Antrian</th>
                    <th class="px-4 py-3 sm:px-5 sm:py-3">Nama Pembeli</th>
                    <th class="px-4 py-3 sm:px-5 sm:py-3">Total Harga</th>
                    <th class="px-4 py-3 sm:px-5 sm:py-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  ${pesanan.slice(0, 5).map(p => `
                    <tr class="hover:bg-orange-50/40 transition">
                      <td class="px-4 py-3 sm:px-5 sm:py-3 font-bold text-gray-800">#${p.no_antrian}</td>
                      <td class="px-4 py-3 sm:px-5 sm:py-3 font-semibold text-gray-800 whitespace-nowrap">${p.nama}</td>
                      <td class="px-4 py-3 sm:px-5 sm:py-3 font-bold text-green-600 whitespace-nowrap">Rp ${p.total_harga.toLocaleString("id-ID")}</td>
                      <td class="px-4 py-3 sm:px-5 sm:py-3">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${p.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                          ${p.status}
                        </span>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    `;
    return AdminLayout("Dashboard", "dashboard", content);
  }
};

// View untuk halaman manajemen pesanan
export const PesananView = {
  HalamanPesanan: (stats: any, pesananAktif: any[]) => {
    const content = `
      <div class="py-4 sm:py-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <p class="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Penjualan</p>
            <h1 class="text-2xl sm:text-3xl font-black text-gray-900">Kelola Pesanan</h1>
          </div>
          <button hx-post="/admin/reset-antrian" hx-target="body" hx-confirm="Reset urutan antrian ke 1?" class="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm sm:text-base font-bold hover:bg-red-100 transition shadow-sm flex items-center gap-2 w-full md:w-auto justify-center">
            🔄 Reset No. Antrian
          </button>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1e3a5f]">
            <p class="text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Total</p>
            <p class="text-xl sm:text-3xl font-black">${stats.total}</p>
          </div>
          <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
            <p class="text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Menunggu</p>
            <p class="text-xl sm:text-3xl font-black">${stats.belum}</p>
          </div>
          <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
            <p class="text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Pendapatan</p>
            <p class="text-lg sm:text-2xl font-black text-green-600 truncate">Rp ${stats.untung.toLocaleString('id-ID')}</p>
          </div>
          <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-600">
            <p class="text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Sisa Stok</p>
            <p class="text-xl sm:text-2xl font-black">${stats.stok} Porsi</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div class="p-4 sm:p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-base sm:text-lg font-black text-gray-800">Daftar Antrian</h2>
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">${pesananAktif.length} Antrian</span>
          </div>
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left min-w-[700px]">
              <thead class="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">No</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Pemesan</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Pesanan</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Total</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm">
                ${pesananAktif.map((p: any) => {
                  let detailItem = "-";
                  try {
                    const items = JSON.parse(p.items);
                    detailItem = items.map((i: any) => `${i.nama} (x${i.qty})`).join(", ");
                  } catch (e) {}
                  
                  const isSelesai = p.status === 'Selesai';
                  return `
                    <tr class="${isSelesai ? 'bg-gray-50 opacity-60' : 'hover:bg-orange-50/40 transition bg-white'}">
                      <td class="px-4 py-3 sm:px-5 sm:py-4 font-black text-base sm:text-lg ${isSelesai ? 'text-gray-400' : 'text-[#1e3a5f]'}">#${p.no_antrian}</td>
                      <td class="px-4 py-3 sm:px-5 sm:py-4">
                        <p class="font-bold text-gray-800 whitespace-nowrap">${p.nama_pelanggan}</p>
                        <p class="text-[10px] font-mono text-gray-400 uppercase">${p.catatan}</p>
                      </td>
                      <td class="px-4 py-3 sm:px-5 sm:py-4 text-[10px] sm:text-xs">
                        <p class="text-gray-700 font-semibold ${isSelesai ? 'line-through' : ''}">${detailItem}</p>
                      </td>
                      <td class="px-4 py-3 sm:px-5 sm:py-4 font-bold ${isSelesai ? 'text-gray-500' : 'text-green-600'} text-xs sm:text-sm whitespace-nowrap">Rp ${p.total_harga.toLocaleString('id-ID')}</td>
                      <td class="px-4 py-3 sm:px-5 sm:py-4">
                        ${isSelesai 
                          ? `<button hx-post="/admin/batal-selesaikan/${p.id}" hx-target="body" class="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition whitespace-nowrap">Batal</button>`
                          : `<button hx-post="/admin/selesaikan/${p.id}" hx-target="body" class="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm transition whitespace-nowrap">✅ Selesai</button>`
                        }
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `; 
    return AdminLayout("Kelola Pesanan", "pesanan", content);
  }
};

// View untuk halaman manajemen stok
export const StokView = {
  HalamanStok: (barang: Barang[]) => {
    const habis = barang.filter(b => b.stok === 0).length;
    const hampirHabis = barang.filter(b => b.stok > 0 && b.stok <= 5).length;
    const aman = barang.filter(b => b.stok > 5).length;
 
    const content = `
      <div class="py-4 sm:py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p class="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Inventaris</p>
            <h1 class="text-2xl sm:text-3xl font-black text-gray-900">Stok Barang</h1>
          </div>
          <button onclick="document.getElementById('modal-tambah-stok').classList.remove('hidden')" class="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg w-full md:w-auto">
            + Tambah Barang
          </button>
        </div>
 
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm text-center flex flex-row sm:flex-col justify-between items-center sm:items-stretch"><p class="text-[10px] sm:text-xs font-bold text-green-600 uppercase sm:mb-1">🟢 Aman</p><p class="text-xl sm:text-3xl font-black">${aman}</p></div>
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm text-center flex flex-row sm:flex-col justify-between items-center sm:items-stretch"><p class="text-[10px] sm:text-xs font-bold text-yellow-500 uppercase sm:mb-1">🟡 Menipis</p><p class="text-xl sm:text-3xl font-black">${hampirHabis}</p></div>
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm text-center flex flex-row sm:flex-col justify-between items-center sm:items-stretch"><p class="text-[10px] sm:text-xs font-bold text-red-600 uppercase sm:mb-1">🔴 Habis</p><p class="text-xl sm:text-3xl font-black">${habis}</p></div>
        </div>
 
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left text-sm min-w-[500px]">
              <thead class="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Nama Barang</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Harga</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Stok</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Status</th>
                  <th class="px-4 py-3 sm:px-5 sm:py-4">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${barang.map(b => `
                  <tr class="hover:bg-orange-50/40 transition">
                    <td class="px-4 py-3 sm:px-5 sm:py-4 font-bold text-gray-800 whitespace-nowrap">${b.nama}</td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4 text-gray-700 whitespace-nowrap">Rp ${b.harga.toLocaleString("id-ID")}</td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4 font-semibold ${b.stok <= 5 ? "text-red-600" : "text-gray-700"}">${b.stok}</td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4">${badgeStok(b.stok)}</td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4 flex gap-2">
                      <button hx-get="/admin/stok/edit/${b.id_barang}" hx-target="#modal-edit-stok-content" hx-swap="innerHTML" onclick="document.getElementById('modal-edit-stok').classList.remove('hidden')" class="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase">Edit</button>
                      <button hx-post="/admin/stok/hapus/${b.id_barang}" hx-target="body" hx-confirm="Hapus ${b.nama}?" class="text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg uppercase">Hapus</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="modal-tambah-stok" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-black">Tambah Barang Baru</h3>
            <button onclick="document.getElementById('modal-tambah-stok').classList.add('hidden')" class="text-gray-400 text-xl leading-none">×</button>
          </div>
          <form hx-post="/admin/stok/tambah" hx-target="body" class="space-y-4">
            <input type="text" name="nama" required placeholder="Nama Barang" class="w-full border rounded-xl px-4 py-2.5 text-sm focus:border-red-400 outline-none"/>
            <div class="grid grid-cols-2 gap-3">
              <input type="number" name="harga" required placeholder="Harga" class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"/>
              <input type="number" name="stok" required placeholder="Stok" class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"/>
            </div>
            <button type="submit" class="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl transition">Simpan Barang</button>
          </form>
        </div>
      </div>
      <div id="modal-edit-stok" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-black">Edit Stok</h3><button onclick="document.getElementById('modal-edit-stok').classList.add('hidden')" class="text-gray-400 text-xl">×</button></div>
          <div id="modal-edit-stok-content"><p class="text-center py-4 text-gray-400">Memuat...</p></div>
        </div>
      </div>
    `;
    return AdminLayout("Stok Barang", "stok", content);
  },
 
  FormEditStok: (b: Barang) => `
    <form hx-post="/admin/stok/update/${b.id_barang}" hx-target="body" class="space-y-4">
      <input type="text" name="nama" value="${b.nama}" required class="w-full border rounded-xl px-4 py-2.5 text-sm"/>
      <div class="grid grid-cols-2 gap-3">
        <input type="number" name="harga" value="${b.harga}" required class="w-full border rounded-xl px-4 py-2.5 text-sm"/>
        <input type="number" name="stok" value="${b.stok}" required class="w-full border rounded-xl px-4 py-2.5 text-sm"/>
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl">Update Stok</button>
    </form>
  `,
};

// View untuk halaman manajemen staff
export const StaffView = {
  HalamanStaff: (staff: Staff[]) => {
    const aktif = staff.filter(s => s.aktif).length;
    const content = `
      <div class="py-4 sm:py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div><p class="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-widest mb-1">SDM</p><h1 class="text-2xl sm:text-3xl font-black text-gray-900">Staff Mang Jay</h1></div>
          <a href="/admin/staff/registrasi" class="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-center text-xs sm:text-sm shadow-lg w-full md:w-auto">Tambah Staff</a>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left text-sm min-w-[500px]">
              <thead class="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wide">
                <tr><th class="px-4 py-3 sm:px-5 sm:py-4">Nama</th><th class="px-4 py-3 sm:px-5 sm:py-4">Role</th><th class="px-4 py-3 sm:px-5 sm:py-4">Status</th><th class="px-4 py-3 sm:px-5 sm:py-4">Aksi</th></tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${staff.map(s => `
                  <tr class="hover:bg-orange-50/40 transition">
                    <td class="px-4 py-3 sm:px-5 sm:py-4"><span class="font-bold text-gray-800 whitespace-nowrap">${s.nama}</span><br/><span class="text-[10px] text-gray-400 font-mono">${s.username}</span></td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4">${badgeRole[s.role]}</td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4">${s.aktif ? '<span class="text-green-600 font-bold text-xs sm:text-sm">Aktif</span>' : '<span class="text-gray-400 text-xs sm:text-sm">Non-aktif</span>'}</td>
                    <td class="px-4 py-3 sm:px-5 sm:py-4 flex gap-2">
                      <a href="/admin/staff/edit/${s.id}" class="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase">Edit</a>
                      <button hx-post="/admin/staff/${s.aktif ? "nonaktifkan" : "aktifkan"}/${s.id}" hx-target="body" class="text-[10px] font-bold ${s.aktif ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'} px-3 py-1.5 rounded-lg uppercase">${s.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    return AdminLayout("Manajemen Staff", "staff", content);
  },

  // View untuk halaman registrasi staff baru
  HalamanRegistrasi: (error?: string) => {
    const content = `
      <div class="py-4 sm:py-6 max-w-xl mx-auto w-full">
        <h1 class="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Tambah Staff Baru</h1>
        ${error ? `<p class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs sm:text-sm font-bold">⚠️ ${error}</p>` : ""}
        <form method="POST" action="/admin/staff/registrasi" class="bg-white p-5 sm:p-6 rounded-2xl border shadow-sm space-y-4">
          <input type="text" name="nama" required placeholder="Nama Lengkap" class="w-full border rounded-xl px-4 py-3 text-sm outline-none"/>
          <input type="text" name="username" required placeholder="Username" class="w-full border rounded-xl px-4 py-3 text-sm outline-none"/>
          <input type="password" name="password" required placeholder="Password" class="w-full border rounded-xl px-4 py-3 text-sm outline-none"/>
          <input type="tel" name="no_hp" required placeholder="No HP" class="w-full border rounded-xl px-4 py-3 text-sm outline-none"/>
          <select name="role" class="w-full border rounded-xl px-4 py-3 text-sm outline-none bg-white">
            <option value="kasir">Kasir</option><option value="dapur">Dapur</option><option value="kurir">Kurir</option><option value="admin">Admin</option>
          </select>
          <button type="submit" class="w-full bg-red-600 text-white font-black py-3 sm:py-3.5 rounded-xl text-sm shadow-lg">Daftarkan Staff</button>
        </form>
      </div>
    `;
    return AdminLayout("Registrasi Staff", "staff", content);
  },

  // View untuk halaman edit data staff
  HalamanEditStaff: (s: Staff, error?: string) => {
    const content = `
      <div class="py-4 sm:py-6 max-w-xl mx-auto w-full">
        <h1 class="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Edit Staff: ${s.nama}</h1>
        ${error ? `<p class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs sm:text-sm font-bold">⚠️ ${error}</p>` : ""}
        <form method="POST" action="/admin/staff/update/${s.id}" class="bg-white p-5 sm:p-6 rounded-2xl border shadow-sm space-y-4">
          <input type="text" name="nama" value="${s.nama}" required class="w-full border rounded-xl px-4 py-3 text-sm"/>
          <input type="text" name="username" value="${s.username}" required class="w-full border rounded-xl px-4 py-3 text-sm"/>
          <input type="password" name="password" placeholder="Password Baru (Kosongkan jika tidak ganti)" class="w-full border rounded-xl px-4 py-3 text-sm"/>
          <input type="tel" name="no_hp" value="${s.no_hp}" required class="w-full border rounded-xl px-4 py-3 text-sm"/>
          <select name="role" class="w-full border rounded-xl px-4 py-3 text-sm bg-white">
            <option value="kasir" ${s.role === 'kasir' ? 'selected' : ''}>Kasir</option>
            <option value="dapur" ${s.role === 'dapur' ? 'selected' : ''}>Dapur</option>
            <option value="kurir" ${s.role === 'kurir' ? 'selected' : ''}>Kurir</option>
            <option value="admin" ${s.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
          <button type="submit" class="w-full bg-red-600 text-white font-black py-3 sm:py-3.5 rounded-xl text-sm">Simpan Perubahan</button>
        </form>
      </div>
    `;
    return AdminLayout("Edit Staff", "staff", content);
  }
};