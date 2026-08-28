# MODUL PELAKU USAHA, PRODUK, BAHAN & MATRIKS RESEP (BOM)
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Verified |
| **Data Scope** | Profil Usaha (NIB 13 Digit), Penyelia Halal, Katalog Bahan (Halal Supplier), Katalog Produk & BOM Matrix |

---

## 1. STRUKTUR DAN ATURAN BISNIS

1. **Profil Usaha & Legalitas (`businesses`):**
   - Wajib memiliki NIB berformat tepat 13 digit angka (`regex(/^[0-9]{13}$/)`).
   - Klasifikasi Skala Usaha (`MIKRO`, `KECIL`, `MENENGAH`, `BESAR`) dan Bentuk Usaha (`PERSEORANGAN`, `PT`, `CV`, dll.).
2. **Penyelia Halal (`business_supervisors`):**
   - Wajib beragama Islam, NIK 16 digit, dan memiliki nomor SK Penetapan Internal (Sesuai regulasi UU Jaminan Produk Halal).
3. **Katalog Bahan Baku (`materials`):**
   - Mendukung pencatatan status sertifikat halal supplier, nomor sertifikat, lembaga penerbit (BPJPH/MUI/LPHLN), dan masa berlaku.
   - Peringatan dini untuk sertifikat bahan kedaluwarsa.
4. **Katalog Produk & Resep BOM (`products` & `product_materials`):**
   - Hubungan Many-to-Many antara Produk dan Bahan Baku terdaftar melalui tabel pivot `product_materials`.
   - Wajib memetakan minimal 1 bahan baku pada setiap produk dan melampirkan narasi alur pembuatan produk.

---

## 2. KOMPONEN ANTARMUKA & DASHBOARD

- **Dashboard Layout (`src/app/dashboard/layout.tsx`):**
  - Dilengkapi sidebar modern dengan indikator menu aktif dan header profil user.
- **Halaman Overview (`/dashboard`):**
  - Kartu ringkasan metrik (Bahan terdaftar, Produk aktif, Pengajuan, Sertifikat terbit) dan panduan alur 3 langkah awal.
- **Halaman Profil Usaha (`/dashboard/profil-usaha`):**
  - Form dua tahap: Identitas Badan Usaha + Legalitas Penyelia Halal.
- **Halaman Bahan (`/dashboard/bahan`):**
  - DataTable bahan baku dengan modal Add/Edit dinamis terhubung master kategori bahan.
- **Halaman Produk (`/dashboard/produk`):**
  - DataTable produk dan form peracikan resep interaktif (BOM Matrix Selector) + Modal Detail Preview BOM.

---

## 3. HASIL PENGUJIAN OTOMATIS

Semua pengujian pada `src/lib/business/__tests__/business.test.ts` berhasil:
- ✅ **Test 1:** Validasi NIB 13 digit regex lolos.
- ✅ **Test 2:** Validasi NIK 16 digit Penyelia Halal & Agama Islam lolos.
- ✅ **Test 3:** Validasi Many-to-Many Recipe (BOM >= 1 Bahan) lolos.
- ✅ **TypeScript Check:** `npm run typecheck` lolos 0 error.
