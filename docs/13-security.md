# KEBIJAKAN KEAMANAN & RBAC PERMISSION MATRIX
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Production-Ready |
| **Security Standards** | OWASP Top 10, Signed JWT Session Cookies, Bcrypt Hashing, Immutable Audit Trail |

---

## 1. PENGELOLAAN SESI & AUTENTIKASI
1. **Password Hashing:**
   - Seluruh kata sandi pengguna di-hash menggunakan algoritma `bcryptjs` dengan salt round 10.
2. **HTTP-only JWT Cookies:**
   - Token sesi disimpan pada cookie dengan atribut `HttpOnly`, `SameSite: Lax`, dan `Secure` pada mode *production* untuk mencegah serangan XSS (*Cross-Site Scripting*).

---

## 2. RBAC (ROLE-BASED ACCESS CONTROL) MATRIX

| Role | Akses Portal | Wewenang Modul |
|---|---|---|
| `SUPER_ADMIN` | `/admin/*`, `/dashboard/*` | Kontrol penuh seluruh sistem, user management, audit logs. |
| `ADMIN` | `/admin/*` | Verifikasi dokumen, alokasi penugasan, kelola master data. |
| `VERIFIER` | `/admin/pengajuan/*` | Desk audit dokumen, checklist berkas, pengembalian revisi (*Need Correction*). |
| `AUDITOR` | `/auditor/*` | Pemeriksaan lapangan (skema Reguler), input temuan & LHP. |
| `MENTOR` | `/mentor/*` | Pendampingan PPH (skema Self-Declare), input LHP. |
| `LEADER` | `/admin/sertifikat` | Persetujuan sidang fatwa dan penerbitan sertifikat halal resmi. |
| `BUSINESS_OWNER` | `/dashboard/*` | Pengelolaan profil usaha, bahan baku, produk BOM, pengajuan mandiri. |

---

## 3. AUDIT TRAIL IMMUTABLE
Setiap aktivitas penting (Login, Pengajuan, Koreksi, Penugasan, Rekomendasi LHP, dan Penerbitan Sertifikat) dicatat ke tabel `audit_logs` dengan menyimpan ID pengguna, aksi, tipe entitas, ID entitas, dan payload snapshot nilai baru.
