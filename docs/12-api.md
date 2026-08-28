# ARSITEKTUR SERVER ACTIONS & ENDPOINTS
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Production-Ready |
| **Transport Layer** | Next.js Server Actions with strict RBAC Session Guard and Zod Contract Validation |

---

## 1. STRUKTUR SERVER ACTIONS UTAMA

### 1.1 Autentikasi (`src/actions/auth.actions.ts`)
* `loginAction(credentials)`: Memvalidasi kredensial bcrypt, menerbitkan JWT HTTP-only cookie, dan mencatat `audit_logs`.
* `registerAction(data)`: Registrasi pelaku usaha baru, pembuatan akun, dan *auto-login*.
* `logoutAction()`: Revokasi cookie sesi.

### 1.2 Profil Usaha & Bahan (`src/actions/business.actions.ts` & `material.actions.ts`)
* `upsertBusinessProfileAction(data)`: Validasi NIB 13 digit dan skala usaha.
* `upsertSupervisorAction(businessId, data)`: Validasi NIK 16 digit dan nomor SK penetapan Penyelia Halal Muslim.
* `createMaterialAction(data)`: Pendaftaran bahan baku beserta nomor sertifikat halal supplier dan tanggal kedaluwarsa.

### 1.3 Produk & Matriks Resep BOM (`src/actions/product.actions.ts`)
* `createProductAction(data)`: Penyimpanan produk dan relasi Many-to-Many ke tabel pivot `product_materials`.

### 1.4 Siklus Pengajuan (`src/actions/application.actions.ts`)
* `createAndSubmitApplicationAction(data)`: Pre-flight validation, penomoran `APP-YYYY-XXXXXX`, dan inisialisasi mutasi status ke `SUBMITTED`.
* `resubmitCorrectionAction(data)`: Pengiriman ulang revisi saat berstatus `NEED_CORRECTION`.

### 1.5 Verifikasi & Penugasan (`src/actions/verification.actions.ts`)
* `saveChecklistItemAction(data)`: Checklist administrasi per-item real-time.
* `submitVerificationDecisionAction(data)`: Eksekusi keputusan verifikator (`APPROVE_DOCUMENTS`, `REQUEST_CORRECTION`, `REJECT`).
* `assignOfficerAction(data)`: Alokasi Pendamping PPH / Auditor LPH.

### 1.6 Audit Lapangan & LHP (`src/actions/inspection.actions.ts`)
* `submitInspectionReportAction(data)`: Penginputan skor SJPH, catatan temuan, dan rekomendasi kelayakan.

### 1.7 Penerbitan & Verifikasi Publik (`src/actions/certificate.actions.ts`)
* `approveAndIssueCertificateAction(data)`: Penetapan fatwa dan penerbitan sertifikat `HALAL-YYYY-XXXXXX` ber-QR Code.
* `getPublicCertificateByNumberAction(certNum)`: Endpoint publik verifikasi sertifikat.
