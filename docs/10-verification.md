# MODUL VERIFIKASI DOKUMEN & PENUGASAN PETUGAS
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Verified |
| **User Roles** | `SUPER_ADMIN`, `ADMIN`, `VERIFIER`, `LEADER` |

---

## 1. STRUKTUR & ALUR KERJA VERIFIKASI (DESK AUDIT)

1. **Antrean Terintegrasi (`/admin/pengajuan`):**
   - Menampilkan seluruh permohonan masuk dengan filter status (`SUBMITTED`, `DOCUMENT_VERIFICATION`, `NEED_CORRECTION`, dll.) dan filter skema (*Self-Declare* vs *Reguler*).
2. **Interactive Verification Workbench (`/admin/pengajuan/[id]`):**
   - **Tampilan Split:** Data Profil Badan Usaha & Penyelia Halal, Formulasi Resep BOM, dan Alur Produksi di sisi kiri.
   - **Digital Checklist Administrasi:** Item checklist terstandar (NIB 13 digit, KTP & SK Penyelia Halal, BOM Produk, Sertifikat Halal Bahan Kritis Supplier, dan Komitmen Manual SJPH) yang dapat di-checklist secara real-time.
3. **Keputusan Verifikator (Tri-State Decision Engine):**
   - `APPROVE_DOCUMENTS`: Dokumen lolos verifikasi administrasi dan siap dialokasikan ke petugas pemeriksa lapangan.
   - `REQUEST_CORRECTION`: Mengembalikan pengajuan ke status `NEED_CORRECTION` dengan catatan revisi spesifik yang memicu notifikasi otomatis ke akun Pelaku Usaha.
   - `REJECT`: Penolakan pengajuan permanen disertai berita acara penolakan.
4. **Assignment Engine Petugas (`/admin/penugasan`):**
   - Skema *Self-Declare* -> Alokasi Pendamping Proses Produk Halal (PPH).
   - Skema *Reguler* -> Alokasi Auditor Halal Lembaga Pemeriksa Halal (LPH).
   - Notifikasi otomatis terkirim ke dashboard petugas terpilih.

---

## 2. HASIL PENGUJIAN OTOMATIS

Semua pengujian pada `src/lib/verification/__tests__/verification.test.ts` berhasil:
- ✅ **Test 1:** Validasi Checklist Item Schema lolos.
- ✅ **Test 2:** Validasi Decision State Transition lolos.
- ✅ **Test 3:** Validasi Penugasan Petugas (Mentor/Auditor) lolos.
- ✅ **TypeScript Check:** `npm run typecheck` lolos 0 error.
