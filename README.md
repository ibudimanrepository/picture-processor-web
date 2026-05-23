# SnapReport

Aplikasi **QA Testing Report Generator** berbasis web. Upload screenshot, beri judul & deskripsi tiap step, lalu generate PDF laporan testing — semuanya di browser, tanpa backend.

**Live Site:** https://ibudimanrepository.github.io/picture-processor-web/

---

## Daftar Isi

1. [Fungsional Sistem](#1-fungsional-sistem)
2. [Teknikal Sistem](#2-teknikal-sistem)
3. [Informasi Deployment](#3-informasi-deployment)
4. [Panduan Pengembangan](#4-panduan-pengembangan)

---

## 1. Fungsional Sistem

### 1.1 Alur Pengguna

```
Upload Screenshot → Edit Step → Generate PDF → Download / Share
```

### 1.2 Fitur Detail

| Fitur | Deskripsi |
|---|---|
| **Upload Screenshot** | Pilih 1 atau banyak file gambar dari device. Setiap file dikompres (max 600px width, JPEG quality 0.7) sebelum ditampilkan. |
| **Reorder Screenshot** | Atur ulang urutan screenshot dengan tombol ▲ (naik) dan ▼ (turun). |
| **Edit Step** | Klik screenshot untuk membuka modal editor. Isi `step title` (judul langkah) dan `description` (deskripsi yang harus diverifikasi tester). |
| **Generate PDF** | Tombol "Process N Steps" memproses semua screenshot menjadi PDF landscape dengan layout 4 kolom per halaman. |
| **Download PDF** | PDF langsung di-download ke perangkat. |
| **Share PDF** | Menggunakan Web Share API untuk berbagi file PDF via aplikasi lain (WhatsApp, Email, dll). Fallback ke download jika Web Share API tidak tersedia. |
| **New Report** | Reset semua data dan kembali ke halaman awal untuk membuat laporan baru. |

### 1.3 Tampilan (Screens)

**HomeScreen** — Halaman utama:
- Header: logo "SnapReport" + jumlah screenshot
- Empty state: ikon kamera + tombol upload (saat belum ada screenshot)
- Daftar screenshot: thumbnail, nomor step, judul, tombol urut/hapus
- Bottom bar: tombol Upload (secondary) + Process Steps (primary)
- Loading overlay: spinner saat PDF sedang digenerate

**PreviewScreen** — Halaman hasil:
- Ikon centang hijau + "Report Ready"
- Tombol Share, Download, New Report
- Tombol Back (kembali tanpa reset)

**StepEditor** — Modal edit:
- Input judul step
- Textarea deskripsi
- Tombol Delete Step

### 1.4 Privasi

Aplikasi ini **100% client-side**. Tidak ada data yang dikirim ke server:
- Foto hanya dibaca di memori browser lewat File API & Canvas API
- Kompresi gambar via Canvas API (off-screen)
- PDF di-generate via jsPDF di browser
- Hasil download/share langsung dari browser, tidak via server
- Semua data hilang saat halaman di-refresh

---

## 2. Teknikal Sistem

### 2.1 Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| **React** | 19.x | UI library |
| **TypeScript** | 6.x | Type safety |
| **Vite** | 8.x | Build tool & dev server |
| **jsPDF** | 4.x | PDF generation |
| **html2canvas** | 1.x | *(terinstall, belum dipakai langsung)* |

### 2.2 Struktur File

```
/
├── index.html                    # Entry HTML
├── vite.config.ts                # Konfigurasi Vite (base, plugin, outDir)
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # Root TS config
├── tsconfig.app.json             # TS config untuk src/
├── tsconfig.node.json            # TS config untuk vite.config.ts
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint config
│
├── src/
│   ├── main.tsx                  # Entry point React (createRoot)
│   ├── App.tsx                   # Root component + screen navigation
│   ├── index.css                 # Global stylesheet (~400 lines)
│   │
│   ├── types/
│   │   └── index.ts              # Type definitions (ScreenshotItem)
│   │
│   ├── hooks/
│   │   └── useScreenshots.ts     # State management hook
│   │
│   ├── utils/
│   │   └── imageUtils.ts         # Image compression utility
│   │
│   ├── services/
│   │   └── pdfGenerator.ts       # PDF generation service
│   │
│   ├── components/
│   │   ├── ActionButton.tsx      # Reusable button (primary/secondary/danger)
│   │   ├── EmptyState.tsx        # Empty state placeholder
│   │   ├── ScreenshotItem.tsx    # Screenshot card component
│   │   └── StepEditor.tsx        # Modal editor for step metadata
│   │
│   └── screens/
│       ├── HomeScreen.tsx        # Main upload & process screen
│       └── PreviewScreen.tsx     # Result screen (share/download)
│
└── docs/                         # Build output (auto-generated, di-deploy ke GitHub Pages)
    ├── index.html
    ├── favicon.svg
    ├── icons.svg
    └── assets/
        ├── index-*.js            # React app bundle
        ├── index-*.css           # Compiled styles
        ├── index.es-*.js         # jsPDF bundle
        ├── html2canvas-*.js      # html2canvas bundle
        └── purify.es-*.js        # DOM Purify (jsPDF dependency)
```

### 2.3 Arsitektur & Data Flow

```
User → HomeScreen
         ├── Pilih file → compressImage() → useScreenshots.addScreenshots()
         ├── Edit step → StepEditor → useScreenshots.updateScreenshot()
         ├── Urutkan → useScreenshots.moveUp() / moveDown()
         └── Process → generatePDF() → PreviewScreen
                                          ├── Share → Web Share API
                                          └── Download → <a> download
```

**State Management:** Semua state dikelola dalam satu custom hook `useScreenshots()` di `App.tsx`, lalu di-pass sebagai props ke screen dan component. Tidak ada global state library (Redux, Zustand, dll).

**Navigasi:** Tidak ada routing library. `useState<'home' | 'preview'>` di `App.tsx` digunakan untuk toggle screen.

**PDF Layout:**
- Orientation: landscape (letter, 792pt x 612pt)
- 4 kolom per halaman (masing-masing card berisi step number, title, description, dan gambar)
- Gambar mempertahankan aspect ratio asli, di-scale agar muat dalam card
- Setiap halaman punya header "QA Testing Report" + tanggal

### 2.4 Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "jspdf": "^4.2.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.x",
    "typescript": "~6.x",
    "vite": "^8.x",
    "eslint": "^10.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "typescript-eslint": "^8.x",
    "@eslint/js": "^9.x",
    "globals": "^16.x"
  }
}
```

### 2.5 Scripts

| Script | Command | Fungsi |
|---|---|---|
| `dev` | `vite` | Jalankan dev server (HMR) |
| `build` | `tsc -b && vite build` | Build produksi ke folder `docs/` |
| `preview` | `vite preview` | Preview hasil build lokal |
| `lint` | `eslint .` | Linting |

---

## 3. Informasi Deployment

### 3.1 Lokasi Kode

| Lokasi | URL / Path |
|---|---|
| **Lokal (komputer)** | `/Users/ibudiman/Documents/PictProcessorWeb/` |
| **GitHub Repository** | https://github.com/ibudimanrepository/picture-processor-web |
| **GitHub Pages (Live)** | https://ibudimanrepository.github.io/picture-processor-web/ |

### 3.2 Detail Repository

| Atribut | Nilai |
|---|---|
| Repo name | `ibudimanrepository/picture-processor-web` |
| Visibility | Public |
| Default branch | `main` |
| Language | TypeScript |
| Created | 19 Mei 2026 |

### 3.3 GitHub Pages Setup

- **Source:** Branch `main`, folder `/docs`
- **Build type:** Legacy (static files)
- **Custom domain:** Tidak ada
- **HTTPS:** Enabled (forced)

Cek status deployment:
```bash
gh api /repos/ibudimanrepository/picture-processor-web/pages/builds/latest
```

### 3.4 Proses Deployment

Build otomatis di-handle oleh Vite, output ke folder `docs/`, lalu di-commit dan push ke GitHub. GitHub Pages secara otomatis serve file dari folder `docs/` di branch `main`.

**Langkah deployment manual:**

```bash
# 1. Build
npm run build

# 2. Commit build output
git add docs/
git commit -m "Update build"

# 3. Push ke GitHub (Pages auto-deploy)
git push
```

**Vite config penting:**
```ts
export default defineConfig({
  base: '/picture-processor-web/',  // base URL sesuai repo name
  build: {
    outDir: 'docs',                  // output folder untuk GitHub Pages
  },
})
```

Perubahan pada `base` di `vite.config.ts` perlu diubah jika repo di-rename atau dipindahkan.

---

## 4. Panduan Pengembangan

### 4.1 Persiapan Lokal

```bash
git clone https://github.com/ibudimanrepository/picture-processor-web.git
cd picture-processor-web
npm install
npm run dev
```

Dev server akan berjalan di `http://localhost:5173`.

### 4.2 Build & Preview

```bash
npm run build     # build ke folder docs/
npm run preview   # preview hasil build lokal
```

### 4.3 Commit Convention

Commit message menggunakan format deskriptif Bahasa Inggris, misalnya:
- `"Add feature: ..."`
- `"Fix bug: ..."`
- `"Update style: ..."`
- `"PDF: horizontal layout with preserved aspect ratio"`

### 4.4 Catatan Penting

1. **html2canvas** terdaftar di package.json tapi tidak diimport di kode saat ini. Jika ada fitur baru yang membutuhkan DOM-to-image capture, library ini bisa dipakai langsung tanpa install ulang.
2. **Tidak ada test suite** — pengujian dilakukan manual di browser.
3. **Tidak ada backend** — semua proses client-side. If in the future there's a need to add a backend, the architecture is simple enough that the state hook (`useScreenshots`) can be extended to sync with an API.
4. **Chunk size warning** pada build (jsPDF bundle ~600KB) tidak mempengaruhi fungsionalitas. Untuk produksi, bisa di-split dengan dynamic import jika diperlukan.

---

*Dokumentasi ini diperbarui pada 20 Mei 2026.*
