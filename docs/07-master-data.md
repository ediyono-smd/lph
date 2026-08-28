# MASTER DATA ARCHITECTURE & MANAGEMENT
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Verified |
| **Security & Access** | RBAC Protected: `SUPER_ADMIN` & `ADMIN` Only Mutation Guard |

---

## 1. STRUKTUR MASTER DATA

Sistem mengelola tiga domain master data utama:
1. **Master Kategori Produk (`product_categories`):**
   - Kode Unik (contoh: `MAKANAN_OLAHAN`, `MINUMAN`, `DAGING_UNGGAS`).
   - Nama Kategori, Deskripsi, dan Status Aktif.
2. **Master Kategori Bahan (`material_categories`):**
   - Kode Unik (contoh: `NABATI`, `HEWANI`, `MIKROBIAL`, `KIMIA_SINTETIK`).
   - **Tingkat Kritis (`is_critical`):** Menentukan apakah bahan baku wajib melampirkan sertifikat halal supplier saat pendaftaran produk.
3. **Master Wilayah Indonesia (`provinces` & `cities`):**
   - Data hierarkis berstandar kode BPS/Kemendagri untuk sinkronisasi alamat fasilitas produksi UMKM.

---

## 2. REUSABLE DATA TABLE & UI FEATURES

- **`DataTable` Component (`src/components/tables/data-table.tsx`):**
  - Search input debounced dengan filter server-side.
  - State penanganan komprehensif (Loading Shimmer, Empty State, Error Alert).
  - Kontrol navigasi pagination terintegrasi.
- **Admin Layout & Navigation (`src/app/admin/layout.tsx`):**
  - Dilindungi Server-Side RBAC Guard (`requireRole(["SUPER_ADMIN", "ADMIN"])`).
  - Halaman UI khusus:
    - `/admin/master/kategori-produk`
    - `/admin/master/kategori-bahan`
    - `/admin/master/wilayah`

---

## 3. HASIL PENGUJIAN OTOMATIS

Semua pengujian pada `src/lib/master/__tests__/master.test.ts` berhasil:
- ✅ **Test 1:** Validasi Zod Schema untuk Kategori Produk & Bahan Kritis lolos.
- ✅ **Test 2:** Query database langsung ke Neon PostgreSQL lolos.
- ✅ **TypeScript Check:** `npm run typecheck` lolos 0 error.
