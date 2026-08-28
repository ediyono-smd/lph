<div align="center">

  <img src="public/images/halal-indonesia-logo.png" alt="Logo Halal Indonesia" width="120" />

  # 🌟 SIP-HALAL INDONESIA
  ### Sistem Informasi Terpadu & Digitalisasi Sertifikasi Halal Republik Indonesia

  [![Next.js 16](https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.33-c5f74f?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169e1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

  <p align="center">
    Platform digital modern berstandar enterprise untuk otomatisasi proses sertifikasi halal terintegrasi — menghubungkan <strong>Pelaku Usaha (UMKM)</strong>, <strong>Pendamping PPH (LP3H)</strong>, <strong>Auditor Halal (LPH)</strong>, <strong>Verifikator Administrasi</strong>, hingga <strong>Komite Fatwa Halal</strong>.
  </p>

  <p align="center">
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-alur-sertifikasi-halal-6-tahapan">Alur Alur 6 Tahap</a> •
    <a href="#-arsitektur-dan-role-pengguna">Multi-Role RBAC</a> •
    <a href="#-teknologi--stack">Tech Stack</a> •
    <a href="#-panduan-instalasi--menjalankan">Panduan Instalasi</a> •
    <a href="#-kredensial-dan-data-sampel">Data Sampel</a> •
    <a href="#-lisensi">Lisensi</a>
  </p>
</div>

---

## 📋 Daftar Isi
1. [Tentang SIP-HALAL](#-tentang-sip-halal)
2. [Fitur Utama](#-fitur-utama)
3. [Alur Sertifikasi Halal 6 Tahapan](#-alur-sertifikasi-halal-6-tahapan)
4. [Arsitektur & Multi-Role RBAC](#-arsitektur-dan-role-pengguna)
5. [Teknologi & Stack](#-teknologi--stack)
6. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
7. [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
8. [Kredensial & Akun Sampel](#-kredensial-dan-data-sampel)
9. [Standar Keamanan & Keaslian Dokumen](#-standar-keamanan--keaslian-dokumen)

---

## 🕌 Tentang SIP-HALAL

**SIP-HALAL** adalah platform perangkat lunak generasi terbaru berbasis web yang dirancang untuk mendukung implementasi amanat Undang-Undang Jaminan Produk Halal (UU JPH) di Indonesia. Sistem ini mengeliminasi proses birokrasi manual yang rumit dan menggantinya dengan alur kerja digital yang transparan, terukur, dan aman.

Dokumen sertifikat yang diterbitkan dilengkapi dengan **QR Code Vektor Beresolusi Tinggi** yang dapat dipindai langsung oleh masyarakat maupun instansi pemeriksa untuk memvalidasi keabsahan data secara *real-time* langsung dari pangkalan data resmi.

---

## ⚡ Fitur Utama

### 🏢 1. Portal Mandiri Pelaku Usaha (UMKM)
- **Profil Usaha & Validasi NIB:** Manajemen legalitas usaha dengan Nomor Induk Berusaha (NIB) 13-digit dan data Penyelia Halal.
- **Katalog Bahan Baku Halal:** Manajemen daftar bahan mentah, nomor sertifikat halal bahan, produsen, dan masa berlaku.
- **Katalog Produk & Bill of Materials (BOM):** Pembuatan formula resep produk halal dengan relasi bahan baku otomatis.
- **Pengajuan Permohonan:** Pengajuan mandiri untuk skema **Self-Declare** (UMKM) maupun **Skema Reguler** (Pemeriksaan LPH).
- **Kotak Perbaikan Interaktif:** Menerima catatan revisi dari verifikator/auditor dan mengunggah perbaikan secara langsung.
- **Sertifikat Halal Digital:** Pratinjau dan cetak dokumen sertifikat resmi format **A4 Portrait** langsung dari aplikasi.

### 🛡️ 2. Panel Administrasi & Verifikator
- **Executive Dashboard:** Ringkasan statistik permohonan, sertifikat aktif, grafik pertumbuhan UMKM, dan audit trail log.
- **Antrean Verifikasi Dokumen:** Tabel pengajuan terintegrasi dengan filter status, skema, pencarian instan, dan paginasi server-side (10, 25, 50, 100 data).
- **Alokasi Penugasan Petugas:** Penugasan terpadu Pendamping PPH untuk skema Self-Declare dan Auditor LPH untuk skema Reguler.
- **Penerbitan Sertifikat & Keputusan Fatwa:** Penetapan nomor keputusan SK Sidang Fatwa dan penandatanganan sertifikat elektronik.
- **Manajemen Master Data:** Kelola Master Kategori Produk, Kategori Bahan Baku, dan Master Wilayah Indonesia.
- **Manajemen Pengguna (RBAC):** Direktori akun berbasis tab peran (*Pelaku Usaha, Auditor, Pendamping, Verifikator, Admin*).

### 👥 3. Panel Pendamping Proses Produk Halal (LP3H)
- **Daftar Penugasan UMKM:** Monitoring UMKM binaan yang ditugaskan kepada pendamping.
- **Verifikasi & Validasi Lapangan:** Pengecekan kriteria *Self-Declare* dan pemberian rekomendasi ke sidang komite fatwa.

### 🔬 4. Panel Auditor Lembaga Pemeriksa Halal (LPH)
- **Pemeriksaan Teknis & Audit Pabrik:** Pelaksanaan audit kehalalan fasilitas produksi, peralatan, dan ketertelusuran bahan baku.
- **Laporan Hasil Pemeriksaan (LHP):** Penyusunan dan penyerahan LHP resmi sebagai dasar penetapan fatwa kehalalan.

### 🔍 5. Portal Publik & Validasi QR Code Real-Time
- **Landing Page Informatif:** Panduan 6 tahapan sertifikasi, direktori komite fatwa, FAQ interaktif, dan panduan SJPH.
- **Validasi QR Code Cepat (`/verify/[certificateNumber]`):** Validasi keaslian dokumen sertifikat halal hanya dengan memindai kamera smartphone.
- **Cetak Standar Kertas A4:** Sistem cetak dokumen terisolasi (*Direct Clean Print*) presisi A4 tanpa gangguan tampilan dialog modal.

---

## 🔄 Alur Sertifikasi Halal 6 Tahapan

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   TAHAP 1    │ ───► │   TAHAP 2    │ ───► │   TAHAP 3    │
│ Pendaftaran  │      │  Verifikasi  │      │  Penugasan   │
│ Pelaku Usaha │      │ Administrasi │      │  Pendamping/ │
│ (NIB & BOM)  │      │  Verifikator │      │  Auditor LPH │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   │
                                                   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   TAHAP 6    │ ◄─── │   TAHAP 5    │ ◄─── │   TAHAP 4    │
│  Penerbitan  │      │ Sidang Komite│      │ Pemeriksaan  │
│  Sertifikat  │      │ Fatwa Halal  │      │   Teknis &   │
│   (QR Code)  │      │  (Nomor SK)  │      │ Laporan LHP  │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 👥 Arsitektur dan Role Pengguna

Sistem menerapkan **Role-Based Access Control (RBAC)** ketat yang diamankan di sisi server (*Server Actions & Middleware Guard*):

| Role Code | Nama Peran | Hak Akses Utama |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | **Super Administrator** | Akses penuh seluruh sistem, audit trail, hak akses pengguna, dan master data. |
| `ADMIN` | **Administrator LPH** | Manajemen antrean permohonan, alokasi penugasan, dan manajemen master data. |
| `VERIFIER` | **Verifikator Dokumen** | Pemeriksaan kelengkapan administrasi NIB, surat permohonan, dan bahan baku. |
| `LEADER` | **Pimpinan Komite Fatwa** | Penetapan nomor SK Keputusan Fatwa dan persetujuan penerbitan sertifikat. |
| `AUDITOR` | **Auditor Halal LPH** | Pemeriksaan teknis lapangan, audit fasilitas usaha reguler, dan penyusunan LHP. |
| `MENTOR` | **Pendamping PPH** | Pendampingan dan verifikasi lapangan untuk UMKM skema *Self-Declare*. |
| `BUSINESS_OWNER`| **Pelaku Usaha (UMKM)** | Input profil NIB, katalog bahan, resep produk (BOM), dan unduh sertifikat halal. |

---

## 💻 Teknologi & Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.3 (Webpack) | App Router, Server Components, Server Actions |
| **Frontend Core** | React 19.0.0 & TypeScript 5.5 | Typed Component Architecture |
| **Styling & Design** | Tailwind CSS 3.4 & Radix UI | Warm Gold & Deep Pine Green Theme Palette |
| **Database** | PostgreSQL on Neon Serverless | Cloud-native Serverless Database with Connection Pooling |
| **ORM** | Drizzle ORM 0.33.0 & Drizzle Kit | Type-safe SQL Query Builder & Schema Migrations |
| **Authentication** | Jose JWT & Bcryptjs | HttpOnly Secure Cookie-based Session Engine |
| **QR Code & Crypto**| QRCode & Node.js Crypto | Vector SVG Generation & SHA-256 Digital Checksum |
| **Icons & Alerts** | Lucide React & Sonner | High-DPI UI Icons & Smooth Toast Notifications |

---

## 📂 Struktur Direktori Proyek

```
sip-halal/
├── src/
│   ├── actions/               # Server Actions (Mutations & Queries)
│   │   ├── admin.actions.ts         # User list, system stats, audit log
│   │   ├── application.actions.ts   # Application CRUD & submission
│   │   ├── auth.actions.ts          # Login, register, session management
│   │   ├── business.actions.ts      # Profile NIB, materials, products, BOM
│   │   ├── certificate.actions.ts   # Issue, verify, print certificate
│   │   └── verification.actions.ts  # Verifier decisions, officer assignments
│   ├── app/                   # Next.js App Router (Pages & Layouts)
│   │   ├── (public)/                # Landing, layanan, alur, faq, tentang
│   │   ├── admin/                   # Portal Admin, Antrean, Users, Master Data
│   │   ├── auditor/                 # Portal Auditor LPH (Pemeriksaan & LHP)
│   │   ├── dashboard/               # Portal UMKM (NIB, Bahan, Produk, Sertifikat)
│   │   ├── mentor/                  # Portal Pendamping PPH (Penugasan UMKM)
│   │   ├── sertifikat/print/        # Dedicated Clean Print Route
│   │   └── verify/                  # Public QR Code Verification Portal
│   ├── components/            # UI Components & Design System
│   │   ├── brand/                   # Official Halal Indonesia Logo Component
│   │   ├── certificate/             # Certificate Card & Official Seal
│   │   ├── dashboard/               # Sidebars, Headers, Account Dropdown
│   │   ├── tables/                  # Striped DataTable with Unified Controls
│   │   └── ui/                      # Radix UI Wrappers (Dialog, Dropdown, Table)
│   ├── db/                    # Drizzle Database Schema & Migrations
│   │   ├── schema/                  # Auth, Business, Application, Certificate
│   │   └── seed/                    # Bulk sample data seeding script
│   └── lib/                   # Utilities, Validation, RBAC, & Print Engine
│       ├── permissions/             # Role guards & RBAC authorization
│       ├── print.ts                 # Isolated Clean Print Engine
│       ├── qr/                      # Vector QR Code Generation
│       └── validation/              # Zod Schemas
├── public/                    # Static Assets (Logos, Icons)
│   └── images/                      # Halal Indonesia official high-res logo
└── package.json
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
* **Node.js:** Versi `>= 20.x`
* **NPM / PNPM / Yarn**
* **Koneksi Database PostgreSQL** (atau akun Neon Database)

### 2. Clone Repositori
```bash
git clone https://github.com/username/sip-halal.git
cd sip-halal
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Buat file `.env` di direktori utama:
```env
DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Migrasi & Push Database Schema
```bash
npm run db:push
```

### 6. Seeding Data Sampel (20 Auditor, 20 Pendamping, 50 UMKM)
```bash
npm run db:seed
```

### 7. Jalankan Server Development
```bash
npm run dev
```
Buka peramban Anda di **`http://localhost:3000`**.

---

## 🔑 Kredensial dan Data Sampel

Seluruh akun sampel hasil *seed* menggunakan password default yang seragam:

> **Password Default untuk Semua Akun:** `Admin123!`

| Role | Email Contoh | URL Portal | Deskripsi Akun |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@halal.go.id` | `/admin` | Administrator Utama Sistem & RBAC |
| **Verifikator** | `verifikator@halal.go.id` | `/admin/pengajuan` | Staf Verifikasi Dokumen & Administrasi |
| **Pimpinan Fatwa**| `pimpinan@halal.go.id` | `/admin/sertifikat` | Pimpinan Komite Fatwa Halal |
| **Auditor Halal** | `auditor01@halal.go.id`<br>*(s/d `auditor20@...`)* | `/auditor` | 20 Auditor Lembaga Pemeriksa Halal (LPH) |
| **Pendamping PPH**| `pendamping01@halal.go.id`<br>*(s/d `pendamping20@...`)* | `/mentor` | 20 Pendamping Proses Produk Halal (LP3H) |
| **Pelaku Usaha** | `umkm01@halal.go.id`<br>*(s/d `umkm50@...`)* | `/dashboard` | 50 Pelaku Usaha dengan NIB, Bahan, & Produk |

---

## 🛡️ Standar Keamanan & Keaslian Dokumen

Dokumen sertifikat halal pada sistem **SIP-HALAL** dilengkapi dengan pengamanan berlapis:
1. **QR Code Vektor Dinamis:** Terhubung langsung ke rute verifikasi publik `/verify/[NOMOR_SERTIFIKAT]`.
2. **SHA-256 Checksum Signature:** Hash digital unik yang menggabungkan Nomor Sertifikat, Nama Usaha, NIB, Nomor SK Fatwa, dan Tanggal Penetapan.
3. **Format Standar Kertas A4:** Sistem cetak presisi A4 Portrait dengan watermark resmi Halal Indonesia untuk mencegah pemalsuan dokumen fisik.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

<div align="center">
  <p>Dibuat dengan dedikasi untuk mendukung ekosistem Jaminan Produk Halal Indonesia yang akuntabel dan berdaya saing global.</p>
  <strong>&copy; 2026 SIP-HALAL Republik Indonesia. All Rights Reserved.</strong>
</div>
