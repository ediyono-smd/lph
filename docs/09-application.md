# MODUL PENGAJUAN SERTIFIKASI & WORKFLOW ENGINE
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Verified |
| **Workflow Engine** | State Machine, Pre-flight Validation, Timeline Tracking, dan Targeted Correction Lifecycle |

---

## 1. ATURAN BISNIS & PRE-FLIGHT VALIDATION

Sebelum pengajuan dapat dikirimkan ke tim verifikator (`SUBMITTED`), sistem menjalankan serangkaian validasi otomatis:
1. **Legalitas Usaha Terpenuhi:** Profil badan usaha wajib memiliki Nomor Induk Berusaha (NIB) tepat 13 digit angka.
2. **Penyelia Halal Terdaftar:** Badan usaha wajib memiliki minimal 1 orang Penyelia Halal terdaftar (Muslim ber-SK internal).
3. **Cakupan Produk & Resep BOM:**
   - Wajib memilih minimal 1 produk katalog.
   - Setiap produk yang dipilih **WAJIB** memiliki komposisi matriks bahan baku (`product_materials`) yang lengkap.
4. **Pernyataan Integritas SJPH:** Pemohon wajib menyetujui komitmen kepatuhan standar Sistem Jaminan Produk Halal.

---

## 2. STATUS STATE MACHINE & TRANSISI

```
[DRAFT] 
  │ (User click Submit & pass pre-flight)
  ▼
[SUBMITTED] 
  │ (Admin/Verifier review)
  ├──► [NEED_CORRECTION] ──► (Pelaku Usaha perbaiki & resubmit) ──► [SUBMITTED]
  │
  ▼
[DOCUMENT_VERIFICATION] 
  ▼
[MENTOR_ASSIGNED / AUDITOR_ASSIGNED] 
  ▼
[INSPECTION] 
  ▼
[FINAL_REVIEW] 
  ▼
[APPROVED] ──► [CERTIFICATE_ISSUED]
```

---

## 3. KOMPONEN ANTARMUKA PENGGUNA

- **Daftar Pengajuan (`/dashboard/pengajuan`):**
  - Penyajian status real-time, nomor pengajuan unik (`APP-YYYY-XXXXXX`), skema (*Self-Declare* vs *Reguler*), dan tombol aksi detail.
- **Wizard Multi-Langkah (`/dashboard/pengajuan/new`):**
  - Langkah 1: Pilih Skema Sertifikasi.
  - Langkah 2: Pilih Produk Katalog (dengan indikator jumlah bahan baku).
  - Langkah 3: Komitmen Kepatuhan SJPH & Catatan Operasional.
  - Langkah 4: Ringkasan Review & Submit.
- **Tracking Detail & Timeline (`/dashboard/pengajuan/[id]`):**
  - Pelacak 6 tahapan visual (Pengajuan -> Verifikasi -> Penugasan -> Pemeriksaan -> Fatwa -> Sertifikat).
  - Banner peringatan *Need Correction* interaktif beserta form resubmit penjelasan perbaikan.
  - Riwayat mutasi status lengkap dan tercatat immutable pada `application_status_histories`.
- **Kotak Masuk Perbaikan (`/dashboard/perbaikan`):**
  - Inbox terdedikasi untuk pengajuan yang membutuhkan revisi dari verifikator.

---

## 4. HASIL PENGUJIAN OTOMATIS

Semua pengujian pada `src/lib/application/__tests__/application.test.ts` berhasil:
- ✅ **Test 1:** Validasi Zod Schema Draft Pengajuan lolos.
- ✅ **Test 2:** Validasi Response Perbaikan (Need Correction) lolos.
- ✅ **TypeScript Check:** `npm run typecheck` lolos 0 error.
