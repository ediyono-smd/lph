# PRODUCT REQUIREMENT DOCUMENT (PRD)
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Approved for System Design |
| **Author** | Senior Product Manager & Senior Business Analyst |
| **Target Launch (MVP)** | Q4 2026 |
| **Target Database & Stack** | Neon PostgreSQL, Next.js App Router, TypeScript, Drizzle ORM |

---

## 1. PRODUCT OVERVIEW
Platform Sertifikasi Halal adalah sistem informasi terintegrasi berbasis web yang memfasilitasi, mengotomatisasi, dan mendigitalkan seluruh siklus hidup pengajuan sertifikasi halal bagi Pelaku Usaha (khususnya UMKM dan Korporasi) sesuai dengan standar regulasi Jaminan Produk Halal (JPH).

Sistem ini menghubungkan Pelaku Usaha (Business Owner), Lembaga Pendamping Halal (Mentor), Auditor/Lembaga Pemeriksa Halal (LPH), Tim Verifikator, Komite Fatwa/Pimpinan, Admin Operasional, serta Publik secara transparan, akuntabel, dan realtime melalui satu pintu.

---

## 2. PROBLEM STATEMENT
1. **Fragmentasi Data & Inefisiensi Proses:** Proses pendaftaran sertifikasi halal manual/semi-digital seringkali melibatkan dokumen fisik yang tercecer, validasi bahan baku yang berulang, serta alur penugasan auditor yang lambat.
2. **Keterbatasan Pelacakan Status (Tracking Blind-spot):** Pelaku Usaha kesulitan mengetahui status detail tahapan sertifikasinya dan rincian dokumen yang memerlukan revisi/koreksi.
3. **Integritas & Verifikasi Sertifikat:** Maraknya pemalsuan nomor sertifikat dan klaim logo halal yang memerlukan kanal validasi publik instan berbasis QR Code yang aman dan anti-tamper.
4. **Ketiadaan Audit Trail:** Perubahan data formulir, catatan audit lapangan, dan persetujuan bertingkat rentan terhadap ketidaksesuaian tata kelola tanpa adanya catatan log sistem yang ketat.

---

## 3. PRODUCT GOALS
- **Efisiensi Waktu (SLA):** Memangkas Service Level Agreement (SLA) penerbitan sertifikasi halal dari pendaftaran hingga persetujuan hingga 50% lebih cepat melalui otomatisasi checklist dan workflow engine.
- **Data Integrity & Traceability:** 100% data bahan, produk, dokumen legalitas, dan status riwayat audit tercatat secara immutable pada database terstruktur dengan audit log terperinci.
- **User-Friendly Experience:** Menyediakan portal mandiri (self-service) yang intuitif bagi Pelaku Usaha dari berbagai skala bisnis dengan antarmuka responsif dan panduan interaktif.
- **Public Trust & Transparansi:** Memberikan portal publik terbuka untuk pencarian dan pemindaian sertifikat halal secara instan dan akurat.

---

## 4. TARGET USERS & ROLES

| No | Role Name | Kode Role | Deskripsi Singkat |
|---|---|---|---|
| 1 | **Public / Masyarakat** | `PUBLIC` | Pengunjung umum tanpa login yang mengakses profil layanan, panduan, FAQ, dan verifikasi sertifikat. |
| 2 | **Pelaku Usaha** | `BUSINESS_OWNER` | Pemilik bisnis/penanggung jawab halal yang mendaftarkan usaha, produk, bahan, dokumen, dan mengajukan sertifikasi. |
| 3 | **Admin Operasional** | `ADMIN` | Pengelola master data, manajemen akun, penugasan awal, dan supervisi pengajuan. |
| 4 | **Verifikator Dokumen** | `VERIFIER` | Pemeriksa kelengkapan administrasi dan legalitas dokumen pengajuan (desk audit). |
| 5 | **Pendamping PPH** | `MENTOR` | Pendamping Proses Produk Halal (khusus skema self-declare/UMKM) yang memvalidasi data dan mendampingi usaha. |
| 6 | **Auditor Halal / LPH** | `AUDITOR` | Pemeriksa teknis dan auditor lapangan (skema reguler) yang melakukan audit fasilitas, bahan baku, dan matriks halal. |
| 7 | **Pimpinan / Komite** | `LEADER` | Pengambil keputusan akhir/sidang fatwa yang memberikan persetujuan penerbitan sertifikat halal. |
| 8 | **Super Admin** | `SUPER_ADMIN` | Administrator tertinggi pengelola konfigurasi sistem, peran, hak akses, integrasi, dan audit log sistem. |

---

## 5. USER PERSONAS

### Persona 1: Siti Rahma (Pelaku Usaha Kuliner - UMKM)
- **Usia:** 34 tahun
- **Karakter:** Mengelola usaha keripik singkong rumahan, terbiasa menggunakan smartphone daripada laptop.
- **Kebutuhan:** Antarmuka pendaftaran yang mudah dipahami, instruksi upload dokumen yang jelas (format & ukuran file), notifikasi jika ada bahan baku atau dokumen yang perlu diperbaiki.
- **Pain Point:** Bingung menentukan klasifikasi bahan baku dan sering terlambat mengetahui bahwa dokumen NIB-nya ditolak.

### Persona 2: Budi Santoso (Auditor Halal Senior)
- **Usia:** 42 tahun
- **Karakter:** Ahli teknologi pangan, teliti, bekerja secara mobile saat audit on-site di pabrik.
- **Kebutuhan:** Checklist audit digital yang cepat diisi di lapangan, kemampuan melampirkan foto temuan (findings), dan form rekomendasi langsung.
- **Pain Point:** Repot mengisi laporan kertas berkas tebal dan harus mengetik ulang di kantor.

### Persona 3: Hendra Wijaya (Admin & Verifikator Pusat)
- **Usia:** 29 tahun
- **Karakter:** Fokus pada throughput verifikasi harian, efisiensi workflow, dan validasi keabsahan nomor izin.
- **Kebutuhan:** Antarmuka split-screen/preview dokumen instan tanpa download manual, shortcut aksi koreksi/approval, dan dashboard monitoring SLA.
- **Pain Point:** Sering memeriksa dokumen dobel karena tidak adanya riwayat revisi yang terstruktur.

---

## 6. USER STORIES

### A. Pelaku Usaha (Business Owner)
- *Sebagai Pelaku Usaha*, saya ingin mendaftar dan memverifikasi akun email saya agar memiliki akses aman ke portal sertifikasi.
- *Sebagai Pelaku Usaha*, saya ingin melengkapi profil legalitas usaha (NIB, NPWP, alamat fasilitas produksi) sekali saja agar bisa digunakan untuk berbagai pengajuan produk.
- *Sebagai Pelaku Usaha*, saya ingin mengelola master bahan baku (lengkap dengan sertifikat halal supplier & masa berlaku) agar bisa dipetakan ke resep produk.
- *Sebagai Pelaku Usaha*, saya ingin membuat pengajuan sertifikasi baru dengan memilih produk, melampirkan alur produksi, dan mengirimkannya ke verifikator.
- *Sebagai Pelaku Usaha*, saya ingin melihat timeline progres pengajuan dan memperbaiki berkas yang diminta revisi (Need Correction) dengan feedback yang jelas.
- *Sebagai Pelaku Usaha*, saya ingin mengunduh sertifikat halal digital resmi ber-QR Code setelah disetujui.

### B. Verifikator & Admin
- *Sebagai Verifikator*, saya ingin melihat antrean pengajuan yang masuk dan memfilter berdasarkan prioritas/tanggal kirim.
- *Sebagai Verifikator*, saya ingin memeriksa kelengkapan berkas satu per satu dengan checklist digital dan menandai berkas "Valid" atau "Perlu Perbaikan" beserta alasannya.
- *Sebagai Admin*, saya ingin menugaskan Pendamping PPH atau Auditor Halal ke pengajuan yang telah lolos verifikasi berkas.
- *Sebagai Admin*, saya ingin mengelola master kategori produk, standar bahan, dan data wilayah (provinsi hingga kelurahan).

### C. Pendamping & Auditor
- *Sebagai Pendamping/Auditor*, saya ingin melihat jadwal penugasan dan mengunduh berkas teknis pengajuan yang ditugaskan kepada saya.
- *Sebagai Pendamping/Auditor*, saya ingin mengisi lembar kerja checklist audit, mencatat ketidaksesuaian (temuan), dan memberikan rekomendasi kelayakan halal.

### D. Pimpinan (Leader)
- *Sebagai Pimpinan*, saya ingin meninjau ringkasan laporan hasil audit/pendampingan dan menandatangani persetujuan akhir (Final Approval).
- *Sebagai Pimpinan*, saya ingin memantau dashboard performa penerbitan sertifikat, distribusi wilayah, dan efisiensi waktu pemrosesan.

### E. Publik
- *Sebagai Masyarakat*, saya ingin memverifikasi keabsahan sertifikat halal melalui input nomor sertifikat atau scan QR Code tanpa harus membuat akun.
- *Sebagai Masyarakat*, saya ingin membaca panduan alur, syarat dokumen, dan FAQ seputar sertifikasi halal.

---

## 7. FUNCTIONAL REQUIREMENTS

### 7.1 Modul Public Portal
1. **Public Information Pages:** Halaman profil, tentang lembaga/platform, daftar layanan skema sertifikasi (Self-Declare & Reguler), alur 10 langkah sertifikasi, FAQ dinamis, artikel/berita edukasi halal, kontak dukungan.
2. **Public Certificate Verification:**
   - Input field nomor sertifikat (format masking/autocomplete).
   - QR Code deep-link handler (`/verify/{certificate_number}`).
   - Tampilan status sertifikat: Valid/Aktif, Kedaluwarsa, Dicabut/Suspended.
   - Detail non-sensitif: Nama Usaha, Merek Dagang, Daftar Produk Tercover, Tanggal Terbit, Masa Berlaku, Nomor Sertifikat. (Mencegah paparan NIK/kontak pribadi).

### 7.2 Modul Autentikasi & Akun
1. **Registrasi Pelaku Usaha:** Form nama penanggung jawab, email aktif, nomor WhatsApp/ponsel, password (standar kuat), konfirmasi kata sandi.
2. **Login & Session Management:** Autentikasi berbasis session cookie (HttpOnly, Secure, SameSite=Lax), token refresh aman, CSRF protection.
3. **Forgot & Reset Password:** Token sekali pakai dengan limitasi waktu (15 menit) dan pengiriman email reset.
4. **Profil Akun & Keamanan:** Ubah nama, avatar, ganti password, riwayat sesi login aktif.

### 7.3 Modul Profil Usaha (Business Profile)
1. **Data Identitas Usaha:** Nama Badan Usaha / Usaha Dagang, Jenis Badan Usaha (PT, CV, Perorangan, Koperasi, dll.), Skala Usaha (Mikro, Kecil, Menengah, Besar).
2. **Legalitas:** Nomor Induk Berusaha (NIB), NPWP Usaha/Pribadi, Izin Edar (P-IRT/BPOM jika ada).
3. **Alamat & Fasilitas Produksi:** Multi-alamat (Kantor Pusat, Pabrik/Dapur Produksi, Outlet) terhubung master data Wilayah (Provinsi, Kota/Kabupaten, Kecamatan, Kelurahan, Kode Pos).
4. **Penanggung Jawab & Penyelia Halal:** Nama penyelia halal, nomor SK penetapan penyelia halal, nomor kontak, sertifikat pelatihan halal penyelia.
5. **Dokumen Legalitas Usaha:** Upload & preview file NIB, KTP Penanggung Jawab, Foto Fasilitas Produksi.

### 7.4 Modul Manajemen Bahan (Material Management)
1. **Katalog Bahan Baku/Bahan Tambahan/Bahan Penolong:** Nama bahan, nama dagang, nama produsen/supplier, kelompok bahan (nabati, hewani, mikrobial, kimia, tambang).
2. **Status Kehalalan Bahan:** Bersertifikat Halal, Bahan Tidak Kritis (White list / Positif List).
3. **Dokumen Pendukung Bahan:** Nomor sertifikat halal bahan, lembaga penerbit (MUI, BPJPH, Lembaga Halal Luar Negeri yang diakui), masa berlaku sertifikat, file lampiran PDF sertifikat halal bahan.
4. **Masa Berlaku Tracking:** Alert/indikator bahan dengan sertifikat yang akan segera kedaluwarsa (<30 hari).

### 7.5 Modul Manajemen Produk (Product Management)
1. **Katalog Produk:** Nama produk, merek/brand dagang, kategori produk (Makanan, Minuman, Kosmetik, Obat, Barang Gunaan), deskripsi produk, foto produk kemasan.
2. **Formulasi & Matriks Bahan (BOM - Bill of Materials):** Relasi Many-to-Many antara Produk dan Bahan Baku (`product_materials`).
3. **Alur & Narasi Proses Produksi:** Penjelasan langkah pembuatan produk dari penerimaan bahan, penimbangan, pencampuran, pemasakan/pengolahan, pengemasan, hingga penyimpanan produk jadi.
4. **Dokumen Produk:** Foto produk, layout kemasan dengan klaim halal, sertifikat izin edar produk.

### 7.6 Modul Pengajuan Sertifikasi (Application Lifecycle)
1. **Pembuatan Pengajuan:**
   - Pemilihan skema sertifikasi: *Self-Declare* (UMKM tanpa biaya/subsidi) atau *Reguler* (Pemeriksaan LPH).
   - Pemilihan daftar produk yang diajukan (dapat memilih 1 atau banyak produk dari katalog).
   - Otomasi konsolidasi bahan baku dari produk terpilih.
   - Upload dokumen manual SJPH (Sistem Jaminan Produk Halal) / Manual Halal sederhana.
2. **Validasi Pra-Submit (Pre-flight Validation):** Sistem memvalidasi kelengkapan profil usaha, penyelia halal, matriks bahan tiap produk terpilih, dan ketersediaan dokumen wajib sebelum tombol Submit aktif.
3. **Timeline & Tracking Status:** Visualisasi status tahapan pengajuan, estimasi waktu, dan log riwayat status.
4. **Resubmit & Koreksi Berkas:** Form revisi khusus untuk dokumen/data yang ditandai *Need Correction*, dengan rekam jejak catatan auditor.

### 7.7 Modul Verifikasi & Penugasan (Admin / Verifier)
1. **Inbox & Filter Pengajuan:** Filter berdasarkan skema, tanggal pengajuan, status, dan provinsi.
2. **Review Dokumen Interaktif:** Checklist verifikasi item per item (NIB, KTP, Penyelia Halal, Manual SJPH, Matriks Bahan).
3. **Action Per Item:** `Valid`, `Invalid / Need Correction` (dengan input catatan mandatori).
4. **Status Decision:**
   - *Lolos Verifikasi Dokumen* -> Siap dialokasikan ke Pendamping/Auditor.
   - *Perlu Perbaikan* -> Mengirim notifikasi dan membuka hak edit bagi Pelaku Usaha.
   - *Ditolak (Rejected)* -> Pengajuan ditolak dengan alasan fundamental.
5. **Penugasan Petugas (Assignment Engine):**
   - Penugasan Pendamping PPH untuk skema Self-Declare.
   - Penugasan Auditor Halal / Lembaga Pemeriksa Halal (LPH) untuk skema Reguler.

### 7.8 Modul Pemeriksaan & Audit Lapangan (Pendamping & Auditor)
1. **Daftar Tugas Audit:** Daftar pengajuan yang ditugaskan ke auditor yang sedang login.
2. **Jadwal Pemeriksaan:** Penentuan tanggal audit on-site / visitasi lapangan dan koordinasi dengan pelaku usaha.
3. **Checklist Audit SJPH & Lapangan:**
   - Komitmen dan Tanggung Jawab.
   - Bahan Baku & Penyimpanan (Bebas Kontaminasi Najis).
   - Proses Produksi & Pencucian Fasilitas.
   - Pengemasan & Pelabelan.
4. **Pencatatan Temuan (Audit Findings):** Formulir temuan ketidaksesuaian minor/mayor dengan tenggat waktu perbaikan (Car / Corrective Action Request).
5. **Laporan Hasil Pemeriksaan (LHP) & Rekomendasi:** Kesimpulan kelayakan halal (Layak / Tidak Layak / Perlu Sidang Khusus) yang dikirim ke Pimpinan/Komite Fatwa.

### 7.9 Modul Persetujuan & Sertifikat (Leader / Pimpinan)
1. **Review Laporan Hasil Audit:** Pimpinan membaca ringkasan LHP, checklist bahan, dan rekomendasi auditor.
2. **Persetujuan Akhir (Final Approval):** Tombol persetujuan resmi (Decision Date, Nomor Keputusan).
3. **Certificate Generator Engine:**
   - Otomasi pembentukan Nomor Sertifikat Unik dengan pola baku (contoh: `HALAL-YYYY-XXXXXX`).
   - Pembuatan data QR Code verifikasi.
   - Rendering file PDF Sertifikat Halal resmi (lengkap dengan lampiran daftar produk terlampir, watermark keamanan, tanda tangan digital/QR verifikasi).
   - Pengarsipan file PDF ke Object Storage dan pencatatan link ke database.

### 7.10 Modul Notifikasi & Activity Feed
1. **In-App Notification Center:** Notifikasi status perubahan pengajuan, penugasan baru, koreksi dokumen, dan penerbitan sertifikat.
2. **Activity / Audit Log:** Pencatatan log historis mutasi data (Siapa, Melakukan apa, Kapan, Data sebelum dan sesudah).

### 7.11 Modul Master Data (Admin / Super Admin)
1. **Master Wilayah:** Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan (Hierarki bertingkat).
2. **Master Kategori Produk & Tipe Produk:** Standar KBLI/Kategori Bahan Olahan Halal.
3. **Master Kategori Bahan:** Kelompok bahan baku halal standar.
4. **Master Checklist Standar:** Template pertanyaan audit & checklist verifikasi.

---

## 8. NON-FUNCTIONAL REQUIREMENTS (NFR)

| Aspek | Spesifikasi |
|---|---|
| **Performance** | - Core Web Vitals LCP < 2.0 detik pada koneksi standar 4G.<br>- API Response Time / Server Action response < 300ms untuk query transaksional standar.<br>- PDF Certificate generation < 3.0 detik. |
| **Scalability** | - Arsitektur stateless dengan Next.js Server Components & Neon Serverless PostgreSQL.<br>- Connection pooling terintegrasi untuk menangani lonjakan konkurensi (peak load). |
| **Security & Privacy** | - Enkripsi data at rest & in transit (TLS 1.3 / SSL mode require).<br>- Password hashing menggunakan bcrypt / argon2 (salt round 12).<br>- Proteksi OWASP Top 10: XSS sanitization, SQL Injection protection via ORM parameterized query, CSRF token, Rate limiting login & upload endpoint.<br>- Dokumen internal (KTP, NIB) bersifat private / presigned URL terbatas waktu. |
| **Reliability & Availability** | - Target Uptime 99.9% menggunakan infrastruktur cloud modern (Vercel Edge + Neon HA).<br>- Database automated snapshot & point-in-time recovery. |
| **Usability & Accessibility** | - Desain responsif sempurna di perangkat Mobile (360px) hingga Desktop (1920px).<br>- Standar kontras warna WCAG AA.<br>- Form dilengkapi validasi inline dan pesan error bahasa Indonesia yang jelas. |
| **Maintainability** | - 100% TypeScript Strict Mode tanpa `any`.<br>- Schema-first validation menggunakan Zod.<br>- Clean architecture modular per domain. |

---

## 9. BUSINESS RULES & LOGIC

1. **BR-001 (Kepemilikan Usaha):** 1 Akun Pelaku Usaha dapat memiliki 1 atau lebih Profil Usaha (Badan Usaha/Brand). Setiap pengajuan sertifikasi diikat pada 1 entitas Profil Usaha tertentu.
2. **BR-002 (Bahan Baku Wajib Terdata):** Setiap produk yang didaftarkan WAJIB memiliki minimal 1 bahan baku terdaftar di sistem.
3. **BR-003 (Status Bahan Kedaluwarsa):** Jika sertifikat halal bahan baku telah melewati tanggal kedaluwarsa, sistem akan memberikan peringatan (Warning), dan verifikator berhak menolak bahan tersebut sampai dokumen diperbarui.
4. **BR-004 (Immutable Submission):** Saat pengajuan berada pada status selain `DRAFT` atau `NEED_CORRECTION`, data profil usaha, produk, dan bahan yang terikat pada pengajuan tersebut dikunci (Read-Only) untuk mencegah perubahan sepihak selama proses audit.
5. **BR-005 (Koreksi Berkas Berbatas):** Pelaku usaha hanya dapat mengedit dokumen/data yang spesifik diberi status `NEED_CORRECTION` oleh verifikator/auditor.
6. **BR-006 (Aturan Penugasan):** Verifikator/Admin tidak boleh menugaskan dirinya sendiri sebagai Auditor/Pendamping untuk mencegah konflik kepentingan.
7. **BR-007 (Penerbitan Nomor Sertifikat):** Nomor sertifikat hanya dapat digenerate sekali saat status pengajuan resmi beralih ke `APPROVED` dan tidak boleh diubah/digunakan ulang untuk pengajuan lain.
8. **BR-008 (Masa Berlaku Sertifikat):** Sertifikat Halal yang diterbitkan berlaku seumur hidup selama tidak ada perubahan komposisi bahan dan proses produksi (sesuai regulasi UU JPH terkini di Indonesia), dengan status `ACTIVE`.
9. **BR-009 (Akses Dokumen Rahasia):** Dokumen legalitas pribadi (KTP Penanggung Jawab) hanya dapat diakses oleh Pelaku Usaha terkait, Verifikator, Auditor bertugas, dan Super Admin.

---

## 10. DETAILED WORKFLOW & STATE MACHINE

### 10.1 Alur Siklus Hidup Pengajuan (Application Lifecycle)

```
[1. DRAFT] 
    │ (Pelaku Usaha klik Submit & Lolos Validasi)
    ▼
[2. SUBMITTED] 
    │ (Verifikator membuka antrean & mulai review)
    ▼
[3. ADMIN_REVIEW / DOCUMENT_VERIFICATION]
    ├── (Dokumen belum sesuai) ──► [4. NEED_CORRECTION]
    │                                  │ (Pelaku usaha revisi & kirim ulang)
    │                                  ▼
    │                           [2. SUBMITTED] (Re-evaluated)
    │
    ├── (Dokumen tidak valid/ditolak total) ──► [REJECTED] (Terminal State)
    │
    ▼ (Dokumen lengkap & valid)
[5. MENTOR_ASSIGNED / AUDITOR_ASSIGNED]
    │ (Pendamping/Auditor menjadwalkan audit)
    ▼
[6. INSPECTION] (Pemeriksaan Lapangan / Audit SJPH)
    ├── (Ada temuan audit/perbaikan) ──► [4. NEED_CORRECTION]
    │
    ▼ (Laporan Hasil Pemeriksaan / LHP Selesai)
[7. FINAL_REVIEW] (Peninjauan oleh Pimpinan / Komite Fatwa)
    ├── (Tidak disetujui dalam sidang) ──► [REJECTED]
    │
    ▼ (Disetujui)
[8. APPROVED]
    │ (System trigger: Generate Certificate PDF & QR Code)
    ▼
[9. CERTIFICATE_ISSUED] (Terminal Active State)
    │
    ▼
[10. PUBLIC_VERIFIED] (Verifikasi Publik Kapan Saja)
```

### 10.2 Tabel Status, Aktor, dan Aksi Validasi

| Status Code | Label Tampilan | Actor yang Berhak Mengubah | Prasyarat & Validasi |
|---|---|---|---|
| `DRAFT` | Draf Pengajuan | `BUSINESS_OWNER` | Semua isian form, minimal 1 produk & bahan terhubung. |
| `SUBMITTED` | Telah Diajukan | `BUSINESS_OWNER` | Lolos validasi kelengkapan berkas wajib sistem. |
| `DOCUMENT_VERIFICATION` | Verifikasi Dokumen | `VERIFIER`, `ADMIN` | Verifikator mulai memeriksa checklist administrasi. |
| `NEED_CORRECTION` | Perlu Perbaikan | `VERIFIER`, `AUDITOR`, `ADMIN` | Wajib mengisi field catatan/alasan koreksi minimal 10 karakter. |
| `AUDITOR_ASSIGNED` | Auditor / Pendamping Ditugaskan | `ADMIN` | Petugas yang dipilih memiliki akun aktif & kompetensi sesuai. |
| `INSPECTION` | Proses Pemeriksaan Lapangan | `MENTOR`, `AUDITOR` | Jadwal audit telah ditentukan & disetujui. |
| `FINAL_REVIEW` | Sidang Fatwa / Peninjauan Akhir | `MENTOR`, `AUDITOR` | Laporan Hasil Pemeriksaan (LHP) & Checklist telah terisi lengkap. |
| `APPROVED` | Disetujui | `LEADER` | Persetujuan resmi pimpinan/komite dengan nomor ketetapan. |
| `REJECTED` | Ditolak | `VERIFIER`, `LEADER`, `ADMIN` | Wajib mengisi berita acara/alasan penolakan permanen. |
| `CERTIFICATE_ISSUED` | Sertifikat Diterbitkan | `SYSTEM (Automated)` | File PDF berhasil digenerate & QR Code terdaftar aktif. |

---

## 11. ROLE & PERMISSION MATRIX

| Modul / Kapabilitas | PUBLIC | BUSINESS_OWNER | VERIFIER | MENTOR / AUDITOR | LEADER | ADMIN | SUPER_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Lihat Halaman Publik & FAQ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cek Verifikasi Sertifikat (QR) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register & Login Portal | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kelola Profil Usaha Sendiri | ❌ | ✅ (CRUD) | 👁️ (Read) | 👁️ (Assigned) | 👁️ (Read) | 👁️ (Read) | ✅ (Full) |
| Kelola Produk & Bahan Sendiri | ❌ | ✅ (CRUD) | 👁️ (Read) | 👁️ (Assigned) | 👁️ (Read) | 👁️ (Read) | ✅ (Full) |
| Buat & Submit Pengajuan | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Perbaiki Berkas (Correction) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Verifikasi Dokumen & Catatan | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Penugasan Auditor/Pendamping | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Isi Checklist Audit & LHP | ❌ | ❌ | ❌ | ✅ (Assigned) | ❌ | 👁️ (Read) | ✅ |
| Final Approval / Sidang | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Generate & Terbitkan Sertifikat | ❌ | ❌ | ❌ | ❌ | Triggered | 👁️ (Read) | ✅ (Manual) |
| Unduh Sertifikat Halal | ❌ | ✅ (Milik Sendiri)| 👁️ (Read) | 👁️ (Read) | ✅ (Read) | ✅ (Read) | ✅ (All) |
| Kelola Master Data (Wilayah/Kategori)| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| User Management & Role Setup | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Akses Audit Logs Sistem | ❌ | ❌ | ❌ | ❌ | ❌ | 👁️ (Read) | ✅ (Full) |

*Keterangan: ✅ = Penuh, 👁️ = Lihat saja, ❌ = Ditolak / Dilarang.*

---

## 12. MVP SCOPE (PHASE 1)
Fitur yang **WAJIB** ada dalam rilis Minimum Viable Product (MVP):
1. **Public Information & Verifikasi Sertifikat:** Portal landing page lengkap + halaman verifikasi pencarian nomor sertifikat & scanner QR link.
2. **Autentikasi & RBAC:** Registrasi Pelaku Usaha, Login untuk semua Role, Session management aman, Proteksi Server-side.
3. **Profil Usaha & Legalitas:** CRUD Data Profil Badan Usaha, NIB, Alamat terintegrasi wilayah, Upload berkas legalitas.
4. **Master Data Inti:** Kategori Produk, Kategori Bahan, Wilayah Indonesia (Provinsi & Kota/Kabupaten).
5. **Katalog Produk & Bahan Baku:** Manajemen Bahan (lengkap dokumen halal supplier), Manajemen Produk, Pemetaan Komposisi Produk (`product_materials`).
6. **Alur Pengajuan (Application Workflow):**
   - Create submission, link products, upload dokumen SJPH.
   - Verifikasi dokumen oleh Admin/Verifier dengan checklist & catatan koreksi.
   - Alur perbaikan (Need Correction) -> Re-submit oleh Pelaku Usaha.
   - Penugasan Auditor & Checklist hasil audit.
   - Persetujuan Pimpinan (Final Approval).
7. **Penerbitan Sertifikat Digital:**
   - Otomasi Nomor Sertifikat.
   - Dynamic PDF Certificate Generator dengan QR Code.
8. **Dashboard & Tracking Status:** Dashboard spesifik tiap role dan timeline visual pengajuan.
9. **Audit Trail & Notifikasi:** In-app notification center dan pencatatan audit log untuk setiap perubahan status.

---

## 13. FUTURE SCOPE (PHASE 2 & 3)
Fitur tambahan yang akan dikembangkan setelah MVP stabil:
- Integrasi Gateway WhatsApp & Email SMTP (Notifikasi instan via WA/Email).
- Integrasi Single Sign-On (SSO) dengan Sistem OSS/BPJPH/Kemenag.
- Fitur Multi-Language (Bahasa Indonesia & English) untuk mendukung sertifikasi ekspor produk luar negeri.
- Modul Pembayaran / Payment Gateway terintegrasi untuk skema berbayar.
- Fitur OCR Dokumen otomatis untuk mengekstrak teks nomor NIB dan sertifikat supplier.
- Aplikasi Mobile Khusus Pendamping & Auditor (Offline-first inspection).

---

## 14. ACCEPTANCE CRITERIA
1. **AC-01 (Pendaftaran & Profil Usaha):** Pelaku usaha baru dapat mendaftar, mengonfirmasi data, dan mengisi profil badan usaha dengan validasi NIB 13 digit angka tanpa error.
2. **AC-02 (Pemetaan Produk & Bahan):** Pengguna dapat memasukkan 1 produk dengan 5 jenis bahan berbeda, dan sistem mampu menampilkan resep matriks bahan secara akurat.
3. **AC-03 (Workflow Koreksi):** Ketika Verifikator menandai 1 dokumen "Need Correction" dengan catatan "NIB buram", status pengajuan otomatis berubah menjadi `NEED_CORRECTION`, Pelaku Usaha menerima notifikasi, dan hanya field dokumen tersebut yang dapat diedit & diupload ulang.
4. **AC-04 (Penerbitan Sertifikat):** Saat Pimpinan menyetujui pengajuan, dalam waktu <3 detik record sertifikat terbuat, PDF ter-generate di server dengan watermark dan QR Code unik yang valid saat di-scan.
5. **AC-05 (Verifikasi Publik):** Mengakses URL `/verify/{certificate_number}` menampilkan status sertifikat "VALID", nama usaha, dan daftar produk yang sesuai tanpa memerlukan login.
6. **AC-06 (Keamanan Data):** Akses langsung ke URL dashboard role lain (misal: Pelaku Usaha mencoba mengakses `/admin` atau `/auditor`) wajib di-redirect ke halaman login/403 forbidden di tingkat Server Component/Middleware.

---

## 15. RISK ANALYSIS & MITIGATION STRATEGY

| Kategori Risiko | Identifikasi Risiko | Dampak | Tingkat Risiko | Strategi Mitigasi |
|---|---|---|---|---|
| **Security** | Upload file berbahaya (malicious script / web shell) pada modul dokumen. | Server compromise / data breach. | High | Validasi ketat Magic Bytes / MIME type di server, limitasi ukuran (maks 5MB), sanitasi nama file, dan simpan di Object Storage terisolasi (bukan executeable public web server). |
| **Integrity** | Pemalsuan sertifikat halal oleh pihak tidak bertanggung jawab. | Hilangnya reputasi & kepercayaan publik. | High | Penyematan Unique Hash / Signature pada data sertifikat, QR code dinamis yang memvalidasi langsung ke database real-time dengan status terkini. |
| **Performance** | Beban database tinggi saat audit massal dan query relasi produk-bahan yang kompleks. | Loading lambat / timeout pada dashboard. | Medium | Gunakan indexed foreign keys, optimized join queries via Drizzle ORM, caching data master, dan pagination server-side. |
| **UX / Adopsi** | Pelaku usaha UMKM kesulitan memahami istilah teknis JPH dan SJPH. | Drop rate pendaftaran tinggi / data salah. | Medium | Sediakan tooltip bantuan, panduan kontekstual di tiap form, checklist sederhana, serta dukungan tim Pendamping. |
| **Data Loss** | Kehilangan data pengajuan atau riwayat revisi saat terjadi kegagalan sistem. | Sengketa audit / pendaftaran ulang. | High | Neon PostgreSQL automatic backup, transaction rollback pada Server Actions multi-step, dan pencatatan `application_status_histories`. |

---
*Dokumen ini merupakan acuan tunggal dalam penyusunan System Design, Database Schema ERD, Desain UI/UX, dan Arsitektur Coding.*
