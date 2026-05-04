// ============================================================
// Types
// ============================================================

type Barang = {
  id_barang: number;
  nama: string;
  harga: number;
  stok: number;
};

type RekapKeuanganRingkas = {
  bulan: string;
  total_pendapatan: number;
  total_pengeluaran: number;
  total_keuntungan: number;
  total_pesanan: number;
};

type Staff = {
  id: number;
  nama: string;
  username: string;
  role: "admin" | "kasir" | "dapur" | "kurir";
  no_hp: string;
  tanggal_bergabung: string;
  aktif: boolean;
};

export type AdminDashboardData = {
  stok: Barang[];
  keuangan: RekapKeuanganRingkas[];
  staff: Staff[];
};

// ============================================================
// Helper: Sidebar Nav
// ============================================================

const Sidebar = (activeTab: string) => `
  <aside class="w-64 shrink-0 hidden lg:flex flex-col bg-gray-900 min-h-screen fixed top-0 left-0 z-20 pt-0">
    <div class="px-6 py-5 border-b border-white/10">
      <a href="/" class="text-xl font-black text-white flex items-center gap-2">🍜 Mang Jay</a>
      <p class="text-xs text-white/40 mt-0.5 font-medium">Panel Admin</p>
    </div>
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      ${[
        { href: "/admin", icon: "📊", label: "Dashboard", key: "dashboard" },
        { href: "/pesanan", icon: "🧾", label: "Pesanan", key: "pesanan" },
        { href: "/preorder", icon: "📦", label: "Preorder", key: "preorder" },
        { href: "/admin/stok", icon: "🥬", label: "Stok Bahan", key: "stok" },
        { href: "/admin/keuangan", icon: "💰", label: "Keuangan", key: "keuangan" },
        { href: "/admin/staff", icon: "👥", label: "Manajemen Staff", key: "staff" },
        { href: "/menu", icon: "🍲", label: "Halaman Menu", key: "menu" },
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

const TopBar = (title: string) => `
  <header class="lg:hidden bg-gray-900 text-white px-5 py-4 flex items-center justify-between sticky top-0 z-10">
    <span class="font-black text-lg">🍜 Mang Jay Admin</span>
    <span class="font-bold text-sm text-white/60">${title}</span>
  </header>
`;

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
        theme: { extend: { colors: { spicy: { 500: '#ef4444', 600: '#dc2626', 900: '#7f1d1d' } } } }
      }
    </script>
    <style>
      .htmx-indicator { display: none; }
      .htmx-request .htmx-indicator { display: inline; }
      aside::-webkit-scrollbar { width: 4px; }
      aside::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen">
    ${Sidebar(activeTab)}
    ${TopBar(title)}
    <div class="lg:pl-64 min-h-screen flex flex-col">
      <main class="flex-1 p-6 max-w-7xl mx-auto w-full">
        ${content}
      </main>
    </div>
  </body>
  </html>
`;

// ============================================================
// Helpers: Badges
// ============================================================

const badgeStok = (stok: number) => {
  if (stok === 0)
    return `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Habis</span>`;
  if (stok <= 5)
    return `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Hampir Habis</span>`;
  return `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Aman</span>`;
};

const badgeRole: Record<Staff["role"], string> = {
  admin: `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Admin</span>`,
  kasir: `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Kasir</span>`,
  dapur: `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Dapur</span>`,
  kurir: `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Kurir</span>`,
};

// ============================================================
// ADMIN DASHBOARD — /admin (gabungan stok, keuangan, staff)
// ============================================================

export const AdminView = {
  HalamanDashboard: (data: AdminDashboardData) => {
    const { stok, keuangan, staff } = data;

    // Stok stats (Menggunakan threshold <= 5)
    const stokHabis   = stok.filter(s => s.stok === 0).length;
    const stokHampir  = stok.filter(s => s.stok > 0 && s.stok <= 5).length;
    const stokAman    = stok.filter(s => s.stok > 5).length;

    // Keuangan stats (bulan ini = index 0, bulan lalu = index 1)
    const bulanIni   = keuangan[0];
    const bulanLalu  = keuangan[1];
    const totalPendapatanAll = keuangan.reduce((s, r) => s + r.total_pendapatan, 0);
    const totalKeuntunganAll = keuangan.reduce((s, r) => s + r.total_keuntungan, 0);

    // Staff stats
    const staffAktif = staff.filter(s => s.aktif).length;

    const content = `
      <div class="py-6 space-y-10">

        <!-- ================================================== -->
        <!-- HEADER                                              -->
        <!-- ================================================== -->
        <div>
          <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Panel Admin</p>
          <h1 class="text-3xl font-black text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-400 mt-1">Ringkasan stok, keuangan, dan SDM Mang Jay.</p>
        </div>

        <!-- ================================================== -->
        <!-- SECTION: STOK BAHAN                                 -->
        <!-- ================================================== -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Inventaris</p>
              <h2 class="text-xl font-black text-gray-800">🥬 Stok Barang</h2>
            </div>
            <div class="flex gap-2">
              <button
                onclick="document.getElementById('modal-tambah-stok').classList.remove('hidden')"
                class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-red-200">
                + Tambah Barang
              </button>
              <a href="/admin/stok" class="flex items-center gap-1 border border-gray-200 hover:border-red-400 text-gray-500 hover:text-red-600 px-4 py-2 rounded-xl font-semibold text-sm transition">
                Lihat Semua →
              </a>
            </div>
          </div>

          <!-- Stat mini cards -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">🟢 Aman</p>
              <p class="text-2xl font-black text-green-600">${stokAman}</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">🟡 Hampir Habis</p>
              <p class="text-2xl font-black text-yellow-500">${stokHampir}</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">🔴 Habis</p>
              <p class="text-2xl font-black text-red-600">${stokHabis}</p>
            </div>
          </div>

          <!-- Tabel stok (max 5 baris, prioritas yang butuh perhatian) -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-5 py-3">Nama Barang</th>
                    <th class="px-5 py-3">Stok</th>
                    <th class="px-5 py-3">Harga</th>
                    <th class="px-5 py-3">Status</th>
                    <th class="px-5 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  ${[...stok]
                    .sort((a, b) => {
                      // Prioritaskan habis dulu, lalu hampir habis
                      const score = (s: Barang) =>
                        s.stok === 0 ? 0 : s.stok <= 5 ? 1 : 2;
                      return score(a) - score(b);
                    })
                    .slice(0, 5)
                    .map(s => `
                    <tr class="hover:bg-orange-50/40 transition">
                      <td class="px-5 py-3 font-bold text-gray-800">${s.nama}</td>
                      <td class="px-5 py-3 font-semibold ${s.stok <= 5 ? "text-red-600" : "text-gray-700"}">
                        ${s.stok}
                      </td>
                      <td class="px-5 py-3 text-gray-500 text-xs">Rp ${s.harga.toLocaleString("id-ID")}</td>
                      <td class="px-5 py-3">${badgeStok(s.stok)}</td>
                      <td class="px-5 py-3">
                        <button
                          hx-get="/admin/stok/edit/${s.id_barang}"
                          hx-target="#modal-edit-stok-content"
                          hx-swap="innerHTML"
                          onclick="document.getElementById('modal-edit-stok').classList.remove('hidden')"
                          class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ================================================== -->
        <!-- SECTION: KEUANGAN                                   -->
        <!-- ================================================== -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Laporan</p>
              <h2 class="text-xl font-black text-gray-800">💰 Keuangan</h2>
            </div>
            <div class="flex gap-2">
              <button onclick="window.print()" class="flex items-center gap-1 border border-gray-200 hover:border-gray-400 text-gray-500 px-4 py-2 rounded-xl font-semibold text-sm transition">
                🖨️ Cetak
              </button>
              <a href="/admin/keuangan" class="flex items-center gap-1 border border-gray-200 hover:border-red-400 text-gray-500 hover:text-red-600 px-4 py-2 rounded-xl font-semibold text-sm transition">
                Lihat Semua →
              </a>
            </div>
          </div>

          <!-- Stat mini cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">💰</div>
                <p class="text-xs font-bold text-gray-400 uppercase">Total Pendapatan</p>
              </div>
              <p class="text-xl font-black">Rp ${totalPendapatanAll.toLocaleString("id-ID")}</p>
              ${bulanIni ? `<p class="text-xs text-gray-400 mt-1">${bulanIni.bulan}: Rp ${bulanIni.total_pendapatan.toLocaleString("id-ID")}</p>` : ""}
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">📈</div>
                <p class="text-xs font-bold text-gray-400 uppercase">Total Keuntungan</p>
              </div>
              <p class="text-xl font-black text-green-600">Rp ${totalKeuntunganAll.toLocaleString("id-ID")}</p>
              <p class="text-xs text-green-500 mt-1 font-semibold">
                Margin ${totalPendapatanAll > 0 ? Math.round((totalKeuntunganAll / totalPendapatanAll) * 100) : 0}%
              </p>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">🍜</div>
                <p class="text-xs font-bold text-gray-400 uppercase">Total Pesanan</p>
              </div>
              <p class="text-xl font-black">${keuangan.reduce((s, r) => s + r.total_pesanan, 0)}</p>
              ${bulanIni ? `<p class="text-xs text-gray-400 mt-1">${bulanIni.bulan}: ${bulanIni.total_pesanan} pesanan</p>` : ""}
            </div>
          </div>

          <!-- Tabel ringkasan per bulan -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-5 py-3">Bulan</th>
                    <th class="px-5 py-3">Pesanan</th>
                    <th class="px-5 py-3">Pendapatan</th>
                    <th class="px-5 py-3">Pengeluaran</th>
                    <th class="px-5 py-3">Keuntungan</th>
                    <th class="px-5 py-3">Margin</th>
                    <th class="px-5 py-3">Detail</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  ${keuangan.map(r => {
                    const margin = r.total_pendapatan > 0 ? Math.round((r.total_keuntungan / r.total_pendapatan) * 100) : 0;
                    const mc = margin >= 40 ? "text-green-600 bg-green-50" : margin >= 25 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
                    return `
                      <tr class="hover:bg-orange-50/40 transition">
                        <td class="px-5 py-3 font-bold text-gray-800">${r.bulan}</td>
                        <td class="px-5 py-3"><span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">${r.total_pesanan}</span></td>
                        <td class="px-5 py-3 font-semibold text-gray-800">Rp ${r.total_pendapatan.toLocaleString("id-ID")}</td>
                        <td class="px-5 py-3 font-semibold text-red-600">Rp ${r.total_pengeluaran.toLocaleString("id-ID")}</td>
                        <td class="px-5 py-3 font-bold text-green-600">Rp ${r.total_keuntungan.toLocaleString("id-ID")}</td>
                        <td class="px-5 py-3"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${mc}">${margin}%</span></td>
                        <td class="px-5 py-3">
                          <a href="/admin/keuangan/${encodeURIComponent(r.bulan)}"
                            class="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                            Lihat →
                          </a>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
                <tfoot>
                  <tr class="bg-gray-900 text-white">
                    <td class="px-5 py-3 font-black">TOTAL</td>
                    <td class="px-5 py-3 font-bold">${keuangan.reduce((s, r) => s + r.total_pesanan, 0)}</td>
                    <td class="px-5 py-3 font-bold">Rp ${totalPendapatanAll.toLocaleString("id-ID")}</td>
                    <td class="px-5 py-3 font-bold text-red-300">Rp ${keuangan.reduce((s, r) => s + r.total_pengeluaran, 0).toLocaleString("id-ID")}</td>
                    <td class="px-5 py-3 font-bold text-green-400">Rp ${totalKeuntunganAll.toLocaleString("id-ID")}</td>
                    <td class="px-5 py-3">
                      <span class="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-black">
                        ${totalPendapatanAll > 0 ? Math.round((totalKeuntunganAll / totalPendapatanAll) * 100) : 0}%
                      </span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        <!-- ================================================== -->
        <!-- SECTION: STAFF                                      -->
        <!-- ================================================== -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">SDM</p>
              <h2 class="text-xl font-black text-gray-800">👥 Manajemen Staff</h2>
            </div>
            <div class="flex gap-2">
              <a href="/admin/staff/registrasi"
                class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-red-200">
                + Tambah Staff
              </a>
              <a href="/admin/staff" class="flex items-center gap-1 border border-gray-200 hover:border-red-400 text-gray-500 hover:text-red-600 px-4 py-2 rounded-xl font-semibold text-sm transition">
                Lihat Semua →
              </a>
            </div>
          </div>

          <!-- Stat mini cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">Total</p>
              <p class="text-2xl font-black">${staff.length}</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">✅ Aktif</p>
              <p class="text-2xl font-black text-green-600">${staffAktif}</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">⛔ Non-Aktif</p>
              <p class="text-2xl font-black text-gray-400">${staff.length - staffAktif}</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p class="text-xs font-bold text-gray-400 uppercase mb-1">🔑 Role</p>
              <div class="flex flex-wrap justify-center gap-1 mt-1">
                ${["admin","kasir","dapur","kurir"].map(r =>
                  `<span class="text-xs font-bold text-gray-600">${staff.filter(s => s.role === r && s.aktif).length} ${r}</span>`
                ).join(" · ")}
              </div>
            </div>
          </div>

          <!-- Tabel staff -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th class="px-5 py-3">Nama</th>
                    <th class="px-5 py-3">Username</th>
                    <th class="px-5 py-3">Role</th>
                    <th class="px-5 py-3">No. HP</th>
                    <th class="px-5 py-3">Bergabung</th>
                    <th class="px-5 py-3">Status</th>
                    <th class="px-5 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  ${staff.map(s => `
                    <tr class="hover:bg-orange-50/40 transition">
                      <td class="px-5 py-3">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-black text-red-600 text-sm">
                            ${s.nama.charAt(0).toUpperCase()}
                          </div>
                          <span class="font-bold text-gray-800">${s.nama}</span>
                        </div>
                      </td>
                      <td class="px-5 py-3 text-gray-500 font-mono text-xs">${s.username}</td>
                      <td class="px-5 py-3">${badgeRole[s.role]}</td>
                      <td class="px-5 py-3 text-gray-500">${s.no_hp}</td>
                      <td class="px-5 py-3 text-gray-400 text-xs">
                        ${new Date(s.tanggal_bergabung).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td class="px-5 py-3">
                        ${s.aktif
                          ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Aktif</span>`
                          : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Non-Aktif</span>`
                        }
                      </td>
                      <td class="px-5 py-3">
                        <div class="flex items-center gap-2">
                          <a href="/admin/staff/edit/${s.id}"
                            class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                            ✏️ Edit
                          </a>
                          <button
                            hx-post="/admin/staff/${s.aktif ? "nonaktifkan" : "aktifkan"}/${s.id}"
                            hx-target="body"
                            hx-confirm="${s.aktif ? `Non-aktifkan ${s.nama}?` : `Aktifkan kembali ${s.nama}?`}"
                            class="text-xs font-bold ${s.aktif ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-green-600 bg-green-50 hover:bg-green-100"} px-3 py-1.5 rounded-lg transition">
                            ${s.aktif ? "⛔ Non-aktifkan" : "✅ Aktifkan"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              ${staff.length === 0 ? `
                <div class="text-center py-12 text-gray-400">
                  <p class="text-3xl mb-2">👥</p>
                  <p class="font-medium">Belum ada staff terdaftar</p>
                </div>
              ` : ""}
            </div>
          </div>
        </section>

      </div>

      <!-- Modal Tambah Barang -->
      <div id="modal-tambah-stok" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-black">Tambah Barang Baru</h3>
            <button onclick="document.getElementById('modal-tambah-stok').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <form hx-post="/admin/stok/tambah" hx-target="body" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Barang</label>
              <input type="text" name="nama" required placeholder="cth: Seblak Original" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Harga (Rp)</label>
                <input type="number" name="harga" required min="0" placeholder="0" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Stok Awal</label>
                <input type="number" name="stok" required min="0" placeholder="0" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" onclick="document.getElementById('modal-tambah-stok').classList.add('hidden')" class="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">Batal</button>
              <button type="submit" class="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm transition">Simpan</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Edit Stok -->
      <div id="modal-edit-stok" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-black">Edit Barang</h3>
            <button onclick="document.getElementById('modal-edit-stok').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <div id="modal-edit-stok-content">
            <p class="text-gray-400 text-sm text-center py-4">Memuat data...</p>
          </div>
        </div>
      </div>
    `;

    return AdminLayout("Dashboard", "dashboard", content);
  }
};

// ============================================================
// STOK VIEW — /admin/stok
// ============================================================

export const StokView = {
 
  // ----------------------------------------------------------
  // Halaman utama /admin/stok
  // ----------------------------------------------------------
  HalamanStok: (barang: Barang[]) => {
    const habis       = barang.filter(b => b.stok === 0).length;
    const hampirHabis = barang.filter(b => b.stok > 0 && b.stok <= 5).length;  // threshold: ≤ 5
    const aman        = barang.filter(b => b.stok > 5).length;
 
    const badgeStok = (stok: number) => {
      if (stok === 0)
        return `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Habis</span>`;
      if (stok <= 5)
        return `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Hampir Habis</span>`;
      return `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Aman</span>`;
    };
 
    const content = `
      <div class="py-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Inventaris</p>
            <h1 class="text-3xl font-black text-gray-900">Stok Barang</h1>
          </div>
          <button
            onclick="document.getElementById('modal-tambah-stok').classList.remove('hidden')"
            class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-red-200">
            + Tambah Barang
          </button>
        </div>
 
        <!-- Stat cards -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🟢 Aman</p>
            <p class="text-3xl font-black text-green-600">${aman}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🟡 Hampir Habis</p>
            <p class="text-3xl font-black text-yellow-500">${hampirHabis}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🔴 Habis</p>
            <p class="text-3xl font-black text-red-600">${habis}</p>
          </div>
        </div>
 
        <!-- Tabel -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 class="font-black text-gray-800">Daftar Barang</h2>
            <span class="text-xs text-gray-400">${barang.length} barang terdaftar</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-5 py-4">#</th>
                  <th class="px-5 py-4">Nama Barang</th>
                  <th class="px-5 py-4">Harga</th>
                  <th class="px-5 py-4">Stok</th>
                  <th class="px-5 py-4">Status</th>
                  <th class="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${barang.map(b => `
                  <tr class="hover:bg-orange-50/40 transition">
                    <td class="px-5 py-4 text-gray-400 text-xs font-mono">${b.id_barang}</td>
                    <td class="px-5 py-4 font-bold text-gray-800">${b.nama}</td>
                    <td class="px-5 py-4 text-gray-700 font-semibold">
                      Rp ${b.harga.toLocaleString("id-ID")}
                    </td>
                    <td class="px-5 py-4 font-semibold ${b.stok <= 5 ? "text-red-600" : "text-gray-700"}">
                      ${b.stok}
                    </td>
                    <td class="px-5 py-4">${badgeStok(b.stok)}</td>
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-2">
                        <button
                          hx-get="/admin/stok/edit/${b.id_barang}"
                          hx-target="#modal-edit-stok-content"
                          hx-swap="innerHTML"
                          onclick="document.getElementById('modal-edit-stok').classList.remove('hidden')"
                          class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                          ✏️ Edit
                        </button>
                        <button
                          hx-post="/admin/stok/hapus/${b.id_barang}"
                          hx-target="body"
                          hx-confirm="Hapus ${b.nama}? Tindakan ini tidak bisa dibatalkan."
                          class="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            ${barang.length === 0 ? `
              <div class="text-center py-16 text-gray-400">
                <p class="text-4xl mb-3">📦</p>
                <p class="font-medium">Belum ada barang terdaftar</p>
              </div>
            ` : ""}
          </div>
        </div>
      </div>
 
      <!-- Modal Tambah -->
      <div id="modal-tambah-stok" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-black">Tambah Barang Baru</h3>
            <button onclick="document.getElementById('modal-tambah-stok').classList.add('hidden')"
              class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <form hx-post="/admin/stok/tambah" hx-target="body" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Barang</label>
              <input type="text" name="nama" required placeholder="cth: Seblak Original"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Harga (Rp)</label>
                <input type="number" name="harga" required min="0" placeholder="0"
                  class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Stok Awal</label>
                <input type="number" name="stok" required min="0" placeholder="0"
                  class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button"
                onclick="document.getElementById('modal-tambah-stok').classList.add('hidden')"
                class="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                Batal
              </button>
              <button type="submit"
                class="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm transition">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
 
      <!-- Modal Edit -->
      <div id="modal-edit-stok" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-black">Edit Stok Barang</h3>
            <button onclick="document.getElementById('modal-edit-stok').classList.add('hidden')"
              class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <div id="modal-edit-stok-content">
            <p class="text-gray-400 text-sm text-center py-4">Memuat data...</p>
          </div>
        </div>
      </div>
    `;
 
    return AdminLayout("Stok Barang", "stok", content);
  },
 
  // ----------------------------------------------------------
  // Partial: Form edit yang diload via HTMX ke dalam modal
  // ----------------------------------------------------------
  FormEditStok: (b: Barang) => `
    <form hx-post="/admin/stok/update/${b.id_barang}" hx-target="body" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Barang</label>
        <input type="text" name="nama" value="${b.nama}" required
          class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Harga (Rp)</label>
          <input type="number" name="harga" value="${b.harga}" required min="0"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Stok Sekarang</label>
          <input type="number" name="stok" value="${b.stok}" required min="0"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"/>
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button"
          onclick="document.getElementById('modal-edit-stok').classList.add('hidden')"
          class="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
          Batal
        </button>
        <button type="submit"
          class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition">
          Update
        </button>
      </div>
    </form>
  `,
};

// ============================================================
// KEUANGAN ADMIN VIEW — /admin/keuangan
// ============================================================

export const KeuanganAdminView = {
  HalamanKeuangan: (rekaps: RekapKeuanganRingkas[]) => {
    const totalPendapatan = rekaps.reduce((s, r) => s + r.total_pendapatan, 0);
    const totalKeuntungan = rekaps.reduce((s, r) => s + r.total_keuntungan, 0);
    const totalPesanan    = rekaps.reduce((s, r) => s + r.total_pesanan, 0);

    const content = `
      <div class="py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Laporan</p>
            <h1 class="text-3xl font-black text-gray-900">Rekapitulasi Keuangan</h1>
          </div>
          <button onclick="window.print()" class="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm">
            🖨️ Cetak
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">💰</div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pendapatan</p>
            </div>
            <p class="text-2xl font-black">Rp ${totalPendapatan.toLocaleString("id-ID")}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">📈</div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Keuntungan</p>
            </div>
            <p class="text-2xl font-black text-green-600">Rp ${totalKeuntungan.toLocaleString("id-ID")}</p>
            <p class="text-xs text-green-500 mt-1 font-semibold">
              Margin rata-rata ${totalPendapatan > 0 ? Math.round((totalKeuntungan / totalPendapatan) * 100) : 0}%
            </p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">🍜</div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pesanan</p>
            </div>
            <p class="text-2xl font-black">${totalPesanan}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50">
            <h2 class="font-black text-gray-800">Rincian Per Bulan</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-5 py-4">Bulan</th>
                  <th class="px-5 py-4">Pesanan</th>
                  <th class="px-5 py-4">Pendapatan</th>
                  <th class="px-5 py-4">Pengeluaran</th>
                  <th class="px-5 py-4">Keuntungan</th>
                  <th class="px-5 py-4">Margin</th>
                  <th class="px-5 py-4">Detail</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${rekaps.map(r => {
                  const margin = r.total_pendapatan > 0 ? Math.round((r.total_keuntungan / r.total_pendapatan) * 100) : 0;
                  const mc = margin >= 40 ? "text-green-600 bg-green-50" : margin >= 25 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
                  return `
                    <tr class="hover:bg-orange-50/40 transition">
                      <td class="px-5 py-4 font-bold text-gray-800">${r.bulan}</td>
                      <td class="px-5 py-4"><span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">${r.total_pesanan}</span></td>
                      <td class="px-5 py-4 font-semibold text-gray-800">Rp ${r.total_pendapatan.toLocaleString("id-ID")}</td>
                      <td class="px-5 py-4 font-semibold text-red-600">Rp ${r.total_pengeluaran.toLocaleString("id-ID")}</td>
                      <td class="px-5 py-4 font-bold text-green-600">Rp ${r.total_keuntungan.toLocaleString("id-ID")}</td>
                      <td class="px-5 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${mc}">${margin}%</span></td>
                      <td class="px-5 py-4">
                        <a href="/admin/keuangan/${encodeURIComponent(r.bulan)}"
                          class="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                          Lihat →
                        </a>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
              <tfoot>
                <tr class="bg-gray-900 text-white">
                  <td class="px-5 py-4 font-black">TOTAL</td>
                  <td class="px-5 py-4 font-bold">${totalPesanan}</td>
                  <td class="px-5 py-4 font-bold">Rp ${totalPendapatan.toLocaleString("id-ID")}</td>
                  <td class="px-5 py-4 font-bold text-red-300">Rp ${rekaps.reduce((s, r) => s + r.total_pengeluaran, 0).toLocaleString("id-ID")}</td>
                  <td class="px-5 py-4 font-bold text-green-400">Rp ${totalKeuntungan.toLocaleString("id-ID")}</td>
                  <td class="px-5 py-4">
                    <span class="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-black">
                      ${totalPendapatan > 0 ? Math.round((totalKeuntungan / totalPendapatan) * 100) : 0}%
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;

    return AdminLayout("Keuangan", "keuangan", content);
  }
};

// ============================================================
// STAFF VIEW — /admin/staff
// ============================================================

export const StaffView = {
  HalamanStaff: (staff: Staff[]) => {
    const aktif = staff.filter(s => s.aktif).length;

    const content = `
      <div class="py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Sumber Daya Manusia</p>
            <h1 class="text-3xl font-black text-gray-900">Manajemen Staff</h1>
          </div>
          <a href="/admin/staff/registrasi"
            class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-red-200">
            + Tambah Staff
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase mb-2">Total Staff</p>
            <p class="text-3xl font-black">${staff.length}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase mb-2">✅ Aktif</p>
            <p class="text-3xl font-black text-green-600">${aktif}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase mb-2">⛔ Non-Aktif</p>
            <p class="text-3xl font-black text-gray-400">${staff.length - aktif}</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p class="text-xs font-bold text-gray-400 uppercase mb-2">🔑 Role Aktif</p>
            <div class="flex flex-wrap gap-1 mt-1">
              ${["admin","kasir","dapur","kurir"].map(r =>
                `<span class="text-xs font-bold text-gray-600">${staff.filter(s => s.role === r && s.aktif).length} ${r}</span>`
              ).join(" · ")}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50">
            <h2 class="font-black text-gray-800">Daftar Staff</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-5 py-4">Nama</th>
                  <th class="px-5 py-4">Username</th>
                  <th class="px-5 py-4">Role</th>
                  <th class="px-5 py-4">No. HP</th>
                  <th class="px-5 py-4">Bergabung</th>
                  <th class="px-5 py-4">Status</th>
                  <th class="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${staff.map(s => `
                  <tr class="hover:bg-orange-50/40 transition">
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center font-black text-red-600 text-sm">
                          ${s.nama.charAt(0).toUpperCase()}
                        </div>
                        <span class="font-bold text-gray-800">${s.nama}</span>
                      </div>
                    </td>
                    <td class="px-5 py-4 text-gray-500 font-mono text-xs">${s.username}</td>
                    <td class="px-5 py-4">${badgeRole[s.role]}</td>
                    <td class="px-5 py-4 text-gray-500">${s.no_hp}</td>
                    <td class="px-5 py-4 text-gray-400 text-xs">
                      ${new Date(s.tanggal_bergabung).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td class="px-5 py-4">
                      ${s.aktif
                        ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Aktif</span>`
                        : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Non-Aktif</span>`
                      }
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-2">
                        <a href="/admin/staff/edit/${s.id}"
                          class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                          ✏️ Edit
                        </a>
                        <button
                          hx-post="/admin/staff/${s.aktif ? "nonaktifkan" : "aktifkan"}/${s.id}"
                          hx-target="body"
                          hx-confirm="${s.aktif ? `Non-aktifkan ${s.nama}?` : `Aktifkan kembali ${s.nama}?`}"
                          class="text-xs font-bold ${s.aktif ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-green-600 bg-green-50 hover:bg-green-100"} px-3 py-1.5 rounded-lg transition">
                          ${s.aktif ? "⛔ Non-aktifkan" : "✅ Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            ${staff.length === 0 ? `
              <div class="text-center py-16 text-gray-400">
                <p class="text-4xl mb-3">👥</p>
                <p class="font-medium">Belum ada staff terdaftar</p>
              </div>
            ` : ""}
          </div>
        </div>
      </div>
    `;

    return AdminLayout("Manajemen Staff", "staff", content);
  },

  HalamanRegistrasi: (error?: string) => {
    const content = `
      <div class="py-6 max-w-xl">
        <div class="mb-8">
          <a href="/admin/staff" class="text-sm text-gray-400 hover:text-red-500 font-medium transition mb-3 inline-block">← Kembali ke Staff</a>
          <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">SDM</p>
          <h1 class="text-3xl font-black text-gray-900">Tambah Staff Baru</h1>
          <p class="text-gray-500 text-sm mt-1">Isi data staff dan tentukan role aksesnya.</p>
        </div>

        ${error ? `
          <div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium flex items-center gap-2">
            ⚠️ ${error}
          </div>
        ` : ""}

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <form method="POST" action="/admin/staff/registrasi" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nama Lengkap</label>
              <input type="text" name="nama" required placeholder="cth: Budi Santoso"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Username</label>
              <input type="text" name="username" required placeholder="cth: budi_dapur" autocomplete="off"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
              <p class="text-xs text-gray-400 mt-1">Digunakan untuk login. Tidak boleh mengandung spasi.</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div class="relative">
                <input type="password" name="password" id="reg-password" required placeholder="Min. 8 karakter" autocomplete="new-password"
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition pr-12"/>
                <button type="button" onclick="toggleRegPassword()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm" id="reg-toggle">👁️</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">No. HP</label>
              <input type="tel" name="no_hp" required placeholder="cth: 081234567890"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Role / Jabatan</label>
              <div class="grid grid-cols-2 gap-3">
                ${[
                  { value: "admin", icon: "🔑", label: "Admin", desc: "Akses penuh ke semua fitur" },
                  { value: "kasir", icon: "🧾", label: "Kasir", desc: "Kelola pesanan & pembayaran" },
                  { value: "dapur", icon: "🍳", label: "Dapur", desc: "Lihat antrian & stok bahan" },
                  { value: "kurir", icon: "🛵", label: "Kurir", desc: "Kelola preorder & pengantaran" },
                ].map(role => `
                  <label class="cursor-pointer">
                    <input type="radio" name="role" value="${role.value}" class="peer sr-only" ${role.value === "kasir" ? "checked" : ""}/>
                    <div class="border-2 border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 rounded-xl p-4 transition hover:border-red-300">
                      <div class="text-2xl mb-1">${role.icon}</div>
                      <p class="font-bold text-sm text-gray-800">${role.label}</p>
                      <p class="text-xs text-gray-400 mt-0.5">${role.desc}</p>
                    </div>
                  </label>
                `).join("")}
              </div>
            </div>
            <div class="pt-2">
              <button type="submit"
                class="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl text-sm transition shadow-lg shadow-red-200">
                Daftarkan Staff →
              </button>
            </div>
          </form>
        </div>
      </div>

      <script>
        function toggleRegPassword() {
          const input = document.getElementById('reg-password');
          const btn = document.getElementById('reg-toggle');
          input.type = input.type === 'password' ? 'text' : 'password';
          btn.textContent = input.type === 'password' ? '👁️' : '🙈';
        }
      </script>
    `;

    return AdminLayout("Registrasi Staff", "staff", content);
  },

  HalamanEditStaff: (s: Staff, error?: string) => {
    const content = `
      <div class="py-6 max-w-xl">
        <div class="mb-8">
          <a href="/admin/staff" class="text-sm text-gray-400 hover:text-red-500 font-medium transition mb-3 inline-block">← Kembali ke Staff</a>
          <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">SDM</p>
          <h1 class="text-3xl font-black text-gray-900">Edit Staff</h1>
        </div>

        ${error ? `
          <div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium flex items-center gap-2">
            ⚠️ ${error}
          </div>
        ` : ""}

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form method="POST" action="/admin/staff/update/${s.id}" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nama Lengkap</label>
              <input type="text" name="nama" value="${s.nama}" required
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Username</label>
              <input type="text" name="username" value="${s.username}" required
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password Baru <span class="text-gray-300 font-normal">(kosongkan jika tidak diubah)</span></label>
              <input type="password" name="password" placeholder="••••••••" autocomplete="new-password"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">No. HP</label>
              <input type="tel" name="no_hp" value="${s.no_hp}" required
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Role / Jabatan</label>
              <div class="grid grid-cols-2 gap-3">
                ${[
                  { value: "admin", icon: "🔑", label: "Admin", desc: "Akses penuh ke semua fitur" },
                  { value: "kasir", icon: "🧾", label: "Kasir", desc: "Kelola pesanan & pembayaran" },
                  { value: "dapur", icon: "🍳", label: "Dapur", desc: "Lihat antrian & stok bahan" },
                  { value: "kurir", icon: "🛵", label: "Kurir", desc: "Kelola preorder & pengantaran" },
                ].map(role => `
                  <label class="cursor-pointer">
                    <input type="radio" name="role" value="${role.value}" class="peer sr-only" ${s.role === role.value ? "checked" : ""}/>
                    <div class="border-2 border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 rounded-xl p-4 transition hover:border-red-300">
                      <div class="text-2xl mb-1">${role.icon}</div>
                      <p class="font-bold text-sm text-gray-800">${role.label}</p>
                      <p class="text-xs text-gray-400 mt-0.5">${role.desc}</p>
                    </div>
                  </label>
                `).join("")}
              </div>
            </div>
            <div class="pt-2 flex gap-3">
              <a href="/admin/staff" class="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm text-center hover:bg-gray-50 transition">
                Batal
              </a>
              <button type="submit" class="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-sm transition">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    return AdminLayout("Edit Staff", "staff", content);
  }
};