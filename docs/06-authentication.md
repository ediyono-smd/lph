# AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Implemented & Verified |
| **Security Standard** | OWASP Top 10, Stateless Encrypted Session Cookie, PBKDF2/Bcrypt Salt 12, Server-side RBAC Guard |

---

## 1. MEKANISME AUTENTIKASI & SESI

Sistem mengadopsi pola **Stateless Encrypted/Signed JWT Session Cookie**:
- **Cookie Key:** `sip_halal_session`
- **Enkripsi:** Ditandatangani dan diverifikasi menggunakan HMAC-SHA256 (`jose` SignJWT/jwtVerify) dengan secret key berentropi tinggi.
- **Atribut Keamanan:** `HttpOnly: true`, `Secure: production`, `SameSite: "lax"`, `Path: "/"`, `Max-Age: 7 Hari`.
- **Password Hashing:** `bcryptjs` dengan *salt rounds 12* dan proteksi *timing attack*.

---

## 2. ROLE & ROUTE AUTHORIZATION MATRIX

| Role Code | Role Name | Allowed Root Area | Redirect Target Default |
|---|---|---|---|
| `SUPER_ADMIN` | Super Administrator | Semua area (`/admin`, `/dashboard`, `/mentor`, `/auditor`) | `/admin` |
| `ADMIN` | Admin Operasional | `/admin/*` | `/admin` |
| `VERIFIER` | Verifikator Dokumen | `/admin/*` (Verifikasi & Antrean) | `/admin` |
| `LEADER` | Pimpinan / Komite Fatwa | `/admin/*` (Approval & Laporan) | `/admin` |
| `MENTOR` | Pendamping PPH | `/mentor/*` | `/mentor` |
| `AUDITOR` | Auditor Halal LPH | `/auditor/*` | `/auditor` |
| `BUSINESS_OWNER` | Pelaku Usaha (UMKM/Korporat) | `/dashboard/*` | `/dashboard` |

---

## 3. IMPLEMENTASI SERVER ACTIONS & API

1. **`registerAction(RegisterInput)`**
   - Validasi nama, format email, nomor WhatsApp Indonesia (`08xxxx`), dan standar password.
   - Pengecekan duplikasi email.
   - Pembuatan record `users`, penugasan role `BUSINESS_OWNER`, dan pembuatan sesi otomatis.
   - Pencatatan log `USER_REGISTER` pada tabel `audit_logs`.

2. **`loginAction(LoginInput)`**
   - Autentikasi email dan verifikasi hash password.
   - Mengambil peran aktif pengguna dan memetakan ID profil usaha jika ada.
   - Menyetel HTTP-Only Cookie dan mengembalikan target rute redirect yang sesuai perannya.
   - Pencatatan log `USER_LOGIN`.

3. **`logoutAction()`**
   - Menghapus cookie `sip_halal_session` dan mencatat log `USER_LOGOUT`.

4. **`changePasswordAction(ChangePasswordInput)`**
   - Memvalidasi password lama sebelum menyimpan hash password baru.

---

## 4. HASIL PENGUJIAN UNIT (AUTOMATED TEST)

Seluruh pengujian unit pada `src/lib/auth/__tests__/auth.test.ts` berhasil:
- ✅ **Test 1:** Password Hashing & Bcrypt Comparison lolos.
- ✅ **Test 2:** JWT Session Token Sign & Verification lolos.
- ✅ **Test 3:** Zod Schema Input Validation lolos.
- ✅ **TypeScript Check:** `npm run typecheck` lolos 0 error.
