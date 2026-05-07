# Mang Seblak Site

Mang Seblak Site Adalah Web untuk Wirausaha Seblak Korea Mang Jay saat Market Day.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTMX |
| **Backend** | Bun, ElysiaJS |
| **Database** | Turso |

## Key Capabilities

- **Sistem Kasir & Antrian (POS)**: Pencatatan pesanan pelanggan dan manajemen nomor antrian secara *real-time* tanpa *page reload*.
- **Manajemen Inventaris (Stok)**: Pemantauan ketersediaan barang/bahan secara langsung dengan indikator status otomatis.
- **Manajemen SDM (Staff)**: Pendaftaran dan pengelolaan status karyawan dengan sistem.
- **Dashboard Admin Interaktif**: Menampilkan ringkasan operasional bisnis secara komprehensif, mulai dari pendapatan kotor, total pesanan, hingga data staff aktif.
- **Tampilan Menu Publik**: Halaman katalog menu yang responsif untuk memudahkan pelanggan melihat produk yang tersedia.
---

## Quick Start (Windows)

### 1. Install prerequisites

|Tool | Version | Link |
|------|---------|------|
| **Bun** | `v1.x` (Terbaru) | [bun.sh](https://bun.sh/) |
| **Git** | Terbaru | [git-scm.com](https://git-scm.com/) |
| **Turso CLI** *(Opsional)* | Terbaru | [docs.turso.tech/cli](https://docs.turso.tech/cli) |
| **VS Code** | Terbaru | [code.visualstudio.com](https://code.visualstudio.com/) |

### 2. Clone the repository

```bash
git clone https://github.com/NeoRyumasil/MangSeblakSite.git
cd src
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```env
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

### 4. Start AURA

```bash
bun --watch run index.ts
```

---

## Project Structure

```
src/             
├── controllers/            
├── models/             
├── views/  
└── index.ts      
```
