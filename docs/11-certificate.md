# MODUL SERTIFIKAT DIGITAL, QR CODE & PUBLIC VERIFICATION
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Verified |
| **Output** | Digital Halal Certificate, Dynamic High-Error-Correction QR Code, SHA-256 Checksum Signature, Deep-Link Verification |

---

## 1. STRUKTUR & KEAMANAN SERTIFIKAT DIGITAL

1. **Format Penomoran Sertifikat:**
   - Format: `HALAL-YYYY-XXXXXX` (Contoh: `HALAL-2026-104928`).
2. **Dynamic QR Code Engine:**
   - Dihasilkan dengan level koreksi kesalahan tertinggi (*Error Correction Level H*) menggunakan palet warna resmi Emerald (`#064e3b`).
   - QR Code menunjuk langsung ke URL verifikasi publik: `${APP_URL}/verify/${certificateNumber}`.
3. **Integritas Digital Signature (SHA-256):**
   - Dihitung dari kombinasi string kanonikal data usaha, nomor keputusan fatwa, dan timestamp penerbitan untuk mencegah pemalsuan dokumen.

---

## 2. PORTAL & ANTARMUKA TERKAIT

- **Sertifikat Pelaku Usaha (`/dashboard/sertifikat`):**
  - Pelaku usaha dapat melihat dan mencetak dokumen sertifikat halal digital resmi yang memuat daftar seluruh produk terlampir.
- **Persetujuan Akhir Komite Fatwa (`/admin/sertifikat`):**
  - Panel persetujuan sidang fatwa pimpinan untuk menerbitkan sertifikat halal resmi.
- **Layanan Verifikasi Publik Bebas Login (`/verify`):**
  - Portal pencarian publik untuk memvalidasi nomor register sertifikat halal.
- **Deep-Link Hasil Scan QR Code (`/verify/[certificateNumber]`):**
  - Halaman hasil scan kamera ponsel yang menampilkan badge validitas resmi secara real-time.

---

## 3. HASIL PENGUJIAN OTOMATIS

Semua pengujian pada `src/lib/certificate/__tests__/certificate.test.ts` berhasil:
- ✅ **Test 1:** Validasi Base64 PNG QR Code Data URL lolos.
- ✅ **Test 2:** Validasi format XML SVG QR Code lolos.
- ✅ **Test 3:** Validasi 64-karakter SHA-256 Digital Checksum signature lolos.
- ✅ **TypeScript Check:** `npm run typecheck` lolos 0 error.
