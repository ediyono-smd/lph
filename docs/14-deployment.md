# PANDUAN DEPLOYMENT & PRODUCTION RUNBOOK
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Production Ready |
| **Target Runtime** | Node.js 18+ / Next.js Vercel / Docker Container |

---

## 1. ENVIRONMENT VARIABLES (`.env`)

```env
# Neon PostgreSQL Connection Pooler URL
DATABASE_URL=postgresql://neondb_owner:npg_PJ8oncWlXtD0@ep-polished-boat-auf3h0r5-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require

# JWT Secret Key (Minimal 32 karakter acak)
JWT_SECRET=sip_halal_production_jwt_secret_key_super_secure_2026

# App Host URL for QR Code deep linking
NEXT_PUBLIC_APP_URL=https://halal.go.id

# Environment Mode
NODE_ENV=production
```

---

## 2. PROSEDUR DEPLOYMENT

### A. Migrasi & Seeding Database
```bash
# 1. Generate & Run DB Migrations
npm run db:generate
npm run db:migrate

# 2. Seed Master Data & User Akun Pengujian
npm run db:seed
```

### B. Build & Run Application
```bash
# 1. Typecheck validation
npm run typecheck

# 2. Build Production Bundle
npm run build

# 3. Start Production Server
npm run start
```

---

## 3. AKUN DEFAULT SISTEM UNTUK TESTING

| Role | Email Login | Kata Sandi |
|---|---|---|
| Super Admin | `superadmin@halal.go.id` | `Admin123!` |
| Administrator | `admin@halal.go.id` | `Admin123!` |
| Verifikator Dokumen | `verifier@halal.go.id` | `Admin123!` |
| Auditor Halal LPH | `auditor@halal.go.id` | `Admin123!` |
| Pendamping PPH | `mentor@halal.go.id` | `Admin123!` |
| Pimpinan / Komite Fatwa | `leader@halal.go.id` | `Admin123!` |
| Pelaku Usaha UMKM | `pelakuusaha@demo.com` | `Admin123!` |
