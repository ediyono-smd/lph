# PROJECT STRUCTURE SPECIFICATION
## PLATFORM SERTIFIKASI HALAL INDONESIA (SIP-HALAL)

| Metadata Document | Details |
|---|---|
| **Project Name** | Platform Sertifikasi Halal Terpadu |
| **Document Version** | 1.0.0 |
| **Status** | Approved for Implementation |
| **Framework & Engine** | Next.js (App Router), TypeScript (Strict), Tailwind CSS, Drizzle ORM, Neon PostgreSQL |

---

## 1. DIRECTORY STRUCTURE MAP

```text
d:\REACT\lph\
├── docs/                                   # Architectural & Engineering Specifications
│   ├── 01-prd.md                           # Product Requirement Document
│   ├── 02-system-design.md                 # System Architecture & Technical Blueprint
│   ├── 03-database-erd.md                  # Database Architecture & Entity Relationship
│   ├── 04-ui-ux.md                         # UI/UX Specification & Design System Tokens
│   └── 05-project-structure.md             # This Document
│
├── public/                                 # Static Assets
│   ├── images/                             # Logos, placeholders, halal seals
│   └── favicon.ico
│
├── src/                                    # Source Code Root
│   ├── app/                                # Next.js App Router (Pages, Layouts, Route Handlers)
│   │   ├── (public)/                       # Public Area
│   │   │   ├── layout.tsx                  # Public Navbar + Footer Layout
│   │   │   ├── page.tsx                    # Landing Page
│   │   │   ├── alur/page.tsx               # Alur Sertifikasi
│   │   │   ├── faq/page.tsx                # Pusat Bantuan & FAQ
│   │   │   └── verify/                     # Public Certificate Verification
│   │   │       ├── page.tsx                # Search by Certificate Number
│   │   │       └── [certificateNumber]/page.tsx # QR Code Direct Landing
│   │   ├── (auth)/                         # Authentication Area
│   │   │   ├── layout.tsx                  # Auth Centered Layout
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── dashboard/                      # Business Owner Portal
│   │   │   ├── layout.tsx                  # Business Sidebar & Header
│   │   │   ├── page.tsx                    # Executive Overview
│   │   │   ├── profil-usaha/page.tsx       # Legalities & Facilities
│   │   │   ├── produk/page.tsx             # Products & BOM Matrix
│   │   │   ├── bahan/page.tsx              # Materials & Halal Certs
│   │   │   ├── pengajuan/                  # Submissions
│   │   │   │   ├── page.tsx                # Application List
│   │   │   │   ├── new/page.tsx            # Multi-Step Application Wizard
│   │   │   │   └── [id]/page.tsx           # Detail & Timeline Tracker
│   │   │   ├── perbaikan/page.tsx          # Dedicated Corrections Inbox
│   │   │   ├── sertifikat/page.tsx         # Issued Certificates
│   │   │   └── notifikasi/page.tsx         # In-App Notifications
│   │   ├── admin/                          # Admin & Verifier Portal
│   │   │   ├── layout.tsx                  # Admin Emerald Sidebar & Topbar
│   │   │   ├── page.tsx                    # Admin Metrics & SLA Charts
│   │   │   ├── pengajuan/page.tsx          # Verification Workbench
│   │   │   ├── pengajuan/[id]/page.tsx     # Desk Audit Split-Screen
│   │   │   ├── penugasan/page.tsx          # Auditor / Mentor Assignment
│   │   │   ├── master/                     # Master Data Management
│   │   │   │   ├── wilayah/page.tsx
│   │   │   │   ├── kategori-produk/page.tsx
│   │   │   │   └── kategori-bahan/page.tsx
│   │   │   ├── users/page.tsx              # User & Role Management
│   │   │   └── audit-logs/page.tsx         # Immutable Security Audit Logs
│   │   ├── mentor/                         # Pendamping PPH Portal
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── penugasan/page.tsx
│   │   ├── auditor/                        # Auditor Halal / LPH Portal
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── jadwal/page.tsx
│   │   │   └── pemeriksaan/[id]/page.tsx   # SJPH Checklist & Findings
│   │   ├── api/                            # Route Handlers
│   │   │   ├── health/route.ts
│   │   │   └── certificates/[id]/pdf/route.ts # PDF Streamer
│   │   ├── globals.css                     # Tailwind CSS & Theme Tokens
│   │   └── layout.tsx                      # Root HTML Layout
│   │
│   ├── actions/                            # Next.js Server Actions (Mutations)
│   │   ├── auth.actions.ts                 # Login, Register, Logout, Reset
│   │   ├── business.actions.ts             # Business profile, address, supervisors
│   │   ├── product.actions.ts              # Product CRUD, BOM mapping
│   │   ├── material.actions.ts             # Material CRUD, supplier certs
│   │   ├── application.actions.ts          # Create application, submit, correction
│   │   ├── verification.actions.ts         # Document checklist, need-correction, approve
│   │   ├── inspection.actions.ts           # Audit schedule, checklist, findings, LHP
│   │   ├── certificate.actions.ts          # Certificate issuance, QR verification
│   │   └── master.actions.ts               # Master data maintenance
│   │
│   ├── db/                                 # Database Layer (Drizzle + Neon PG)
│   │   ├── schema/                         # Modular Drizzle Schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── master.schema.ts
│   │   │   ├── business.schema.ts
│   │   │   ├── product-material.schema.ts
│   │   │   ├── application.schema.ts
│   │   │   ├── audit.schema.ts
│   │   │   ├── certificate.schema.ts
│   │   │   ├── system.schema.ts
│   │   │   └── index.ts                    # Single Schema Export
│   │   ├── seed/                           # Database Seeder
│   │   │   ├── seed.ts                     # Master roles, admin, dummy master data
│   │   │   └── data/
│   │   └── index.ts                        # Drizzle Client with Neon Pooler
│   │
│   ├── components/                         # UI Components
│   │   ├── ui/                             # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   ├── forms/                          # Composite Forms with RHF + Zod
│   │   ├── tables/                         # Generic Reusable DataTable
│   │   ├── dashboard/                      # Stat cards, Chart widgets, Status badges
│   │   ├── shared/                         # Navbar, Footer, Timeline, EmptyState, Skeleton
│   │   └── certificate/                    # Certificate Preview & Visual QR
│   │
│   ├── lib/                                # Core Utilities & Services
│   │   ├── auth/                           # Password hashing, Session cookies, Auth Guards
│   │   ├── permissions/                    # RBAC & Action Ownership validation
│   │   ├── validation/                     # Zod Validation Schemas
│   │   │   ├── auth.validation.ts
│   │   │   ├── business.validation.ts
│   │   │   ├── product.validation.ts
│   │   │   ├── material.validation.ts
│   │   │   └── application.validation.ts
│   │   ├── storage/                        # Object Storage client (S3/Local fallback)
│   │   ├── qr/                             # QR Code generator service
│   │   └── utils.ts                        # Styling & Formatting Helpers (cn, formatDate, etc.)
│   │
│   ├── hooks/                              # Custom React Hooks
│   ├── types/                              # Global TypeScript Interfaces
│   └── config/                             # Site constants & navigation config
│
├── .env.example                            # Environment Variables Template
├── .env                                    # Local Environment (Protected)
├── drizzle.config.ts                       # Drizzle Kit Configuration
├── next.config.mjs                         # Next.js Configuration
├── package.json                            # Dependencies & Scripts
├── postcss.config.mjs                      # PostCSS Configuration
├── tailwind.config.ts                      # Tailwind CSS Configuration
└── tsconfig.json                           # Strict TypeScript Configuration
```

---
*Dokumen ini menjadi standar implementasi struktur file dan direktori pada project SIP-HALAL.*
