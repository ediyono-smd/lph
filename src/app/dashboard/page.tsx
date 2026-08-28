import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { db } from "@/db";
import { businesses, products, materials, applications, certificates } from "@/db/schema";
import { eq, isNull, and, count } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Building2,
  Package,
  FlaskConical,
  FileSpreadsheet,
  Award,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  // 1. Fetch Business Profile
  const business = await db.query.businesses.findFirst({
    where: eq(businesses.userId, session.userId),
    with: {
      supervisors: true,
      addresses: true,
    },
  });

  let productCount = 0;
  let materialCount = 0;
  let activeAppCount = 0;
  let certCount = 0;

  if (business) {
    const [pRow] = await db
      .select({ total: count() })
      .from(products)
      .where(and(eq(products.businessId, business.id), isNull(products.deletedAt)));
    productCount = pRow?.total || 0;

    const [mRow] = await db
      .select({ total: count() })
      .from(materials)
      .where(and(eq(materials.businessId, business.id), isNull(materials.deletedAt)));
    materialCount = mRow?.total || 0;

    const [aRow] = await db
      .select({ total: count() })
      .from(applications)
      .where(eq(applications.businessId, business.id));
    activeAppCount = aRow?.total || 0;
  }

  const isProfileComplete =
    business && business.nib && business.supervisors?.length > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <Badge className="bg-accent-500 text-slate-950 hover:bg-accent-600 font-semibold mb-2">
            Selamat Datang di SIP-HALAL
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">
            Halo, {session.fullName}!
          </h1>
          <p className="text-sm text-primary-100 leading-relaxed">
            Kelola data usaha, resep produk, dan pengajuan sertifikasi halal
            secara mandiri dan terpantau real-time.
          </p>
        </div>
      </div>

      {/* Profile Incomplete Alert */}
      {!isProfileComplete && (
        <Alert variant="warning" className="border-amber-300 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-700" />
          <div className="ml-2">
            <AlertTitle className="font-semibold text-amber-900">
              Profil Usaha & Penyelia Halal Belum Lengkap
            </AlertTitle>
            <AlertDescription className="text-xs text-amber-800 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>
                Lengkapi identitas badan usaha, NIB (13 digit), dan data Penyelia
                Halal sebelum membuat pengajuan sertifikasi.
              </span>
              <Link href="/dashboard/profil-usaha">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
                  Lengkapi Profil Sekarang
                </Button>
              </Link>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Bahan Baku Terdaftar
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {materialCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Bahan bersertifikat & non-kritis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Katalog Produk
            </CardTitle>
            <Package className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {productCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Produk dengan formulasi (BOM)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Pengajuan Aktif
            </CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {activeAppCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dalam proses verifikasi/audit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              Sertifikat Terbit
            </CardTitle>
            <Award className="h-4 w-4 text-accent-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-slate-900">
              {certCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Sertifikat Halal Aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Step Workflow Checklist */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-semibold text-base text-slate-900">
          Langkah Memulai Sertifikasi Halal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-800">Langkah 1</span>
              {business ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <span className="text-[11px] text-slate-400">Belum Selesai</span>
              )}
            </div>
            <h4 className="font-semibold text-sm text-slate-900">Profil Usaha & Legalitas</h4>
            <p className="text-xs text-slate-500">
              Isi NIB 13 digit, nama merek, dan data Penyelia Halal.
            </p>
            <Link href="/dashboard/profil-usaha" className="inline-block pt-1">
              <Button variant="link" size="sm" className="p-0 h-auto text-primary-700">
                Kelola Profil <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-800">Langkah 2</span>
              {materialCount > 0 && productCount > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <span className="text-[11px] text-slate-400">Belum Selesai</span>
              )}
            </div>
            <h4 className="font-semibold text-sm text-slate-900">Katalog Bahan & Resep Produk</h4>
            <p className="text-xs text-slate-500">
              Daftarkan bahan baku dan petakan komposisi ke produk.
            </p>
            <div className="flex gap-2 pt-1">
              <Link href="/dashboard/bahan">
                <Button variant="link" size="sm" className="p-0 h-auto text-primary-700">
                  + Bahan
                </Button>
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/dashboard/produk">
                <Button variant="link" size="sm" className="p-0 h-auto text-primary-700">
                  + Produk
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-800">Langkah 3</span>
              {activeAppCount > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <span className="text-[11px] text-slate-400">Belum Selesai</span>
              )}
            </div>
            <h4 className="font-semibold text-sm text-slate-900">Kirim Pengajuan Sertifikasi</h4>
            <p className="text-xs text-slate-500">
              Pilih produk yang ingin diajukan untuk proses verifikasi.
            </p>
            <Link href="/dashboard/pengajuan" className="inline-block pt-1">
              <Button variant="link" size="sm" className="p-0 h-auto text-primary-700">
                Buat Pengajuan <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
