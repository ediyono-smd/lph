"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getMyBusinessAction,
  upsertBusinessProfileAction,
  upsertSupervisorAction,
} from "@/actions/business.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, UserCheck, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessProfileSchema,
  supervisorSchema,
  type BusinessProfileInput,
  type SupervisorInput,
} from "@/lib/validation/business.validation";

export default function ProfilUsahaPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingProfile, startTransitionProfile] = useTransition();
  const [isPendingSupervisor, startTransitionSupervisor] = useTransition();

  const profileForm = useForm<BusinessProfileInput>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: "",
      brandName: "",
      businessType: "PERSEORANGAN",
      businessScale: "MIKRO",
      nib: "",
      npwp: "",
      email: "",
      phoneNumber: "",
      website: "",
    },
  });

  const supervisorForm = useForm<SupervisorInput>({
    resolver: zodResolver(supervisorSchema),
    defaultValues: {
      name: "",
      idCardNumber: "",
      phoneNumber: "",
      religion: "ISLAM",
      skNumber: "",
      certificateNumber: "",
    },
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getMyBusinessAction();
      if (res.success && res.data) {
        const b = res.data;
        setBusinessId(b.id);
        profileForm.reset({
          name: b.name,
          brandName: b.brandName,
          businessType: b.businessType,
          businessScale: b.businessScale,
          nib: b.nib,
          npwp: b.npwp || "",
          email: b.email,
          phoneNumber: b.phoneNumber,
          website: b.website || "",
        });

        if (b.supervisors && b.supervisors.length > 0) {
          const s = b.supervisors[0];
          supervisorForm.reset({
            name: s.name,
            idCardNumber: s.idCardNumber,
            phoneNumber: s.phoneNumber,
            religion: "ISLAM",
            skNumber: s.skNumber,
            certificateNumber: s.certificateNumber || "",
          });
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const onSaveProfile = (data: BusinessProfileInput) => {
    startTransitionProfile(async () => {
      const res = await upsertBusinessProfileAction(data);
      if (res.success) {
        setBusinessId(res.data.id);
        toast.success(res.message || "Profil usaha berhasil disimpan!");
      } else {
        toast.error(res.error || "Gagal menyimpan profil usaha.");
      }
    });
  };

  const onSaveSupervisor = (data: SupervisorInput) => {
    if (!businessId) {
      toast.error("Simpan profil badan usaha terlebih dahulu.");
      return;
    }

    startTransitionSupervisor(async () => {
      const res = await upsertSupervisorAction(businessId, data);
      if (res.success) {
        toast.success(res.message || "Penyelia Halal berhasil disimpan!");
      } else {
        toast.error(res.error || "Gagal menyimpan data penyelia.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary-700" />
        Memuat profil usaha...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary-700" />
          Profil Usaha & Legalitas
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Lengkapi data identitas badan usaha dan Penyelia Halal yang bertanggung
          jawab atas proses produksi halal.
        </p>
      </div>

      {/* Form 1: Business Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-700" />
            1. Identitas Badan Usaha & Legalitas
          </CardTitle>
          <CardDescription>
            Informasi resmi perusahaan/usaha dagang sesuai dokumen NIB.
          </CardDescription>
        </CardHeader>

        <form onSubmit={profileForm.handleSubmit(onSaveProfile)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Badan Usaha / Perusahaan</Label>
                <Input
                  id="name"
                  placeholder="Contoh: PT Berkah Halal Nusantara"
                  disabled={isPendingProfile}
                  {...profileForm.register("name")}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-red-600">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName">Nama Merek / Brand Dagang</Label>
                <Input
                  id="brandName"
                  placeholder="Contoh: Keripik Berkah"
                  disabled={isPendingProfile}
                  {...profileForm.register("brandName")}
                />
                {profileForm.formState.errors.brandName && (
                  <p className="text-xs text-red-600">
                    {profileForm.formState.errors.brandName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Bentuk Badan Usaha</Label>
                <select
                  id="businessType"
                  className="w-full h-10 px-3 rounded-md border border-input text-sm bg-background"
                  disabled={isPendingProfile}
                  {...profileForm.register("businessType")}
                >
                  <option value="PERSEORANGAN">Perseorangan (UMKM)</option>
                  <option value="PT">PT (Perseroan Terbatas)</option>
                  <option value="CV">CV (Commanditaire Vennootschap)</option>
                  <option value="KOPERASI">Koperasi</option>
                  <option value="FIRMA">Firma</option>
                  <option value="YAYASAN">Yayasan</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessScale">Skala Usaha</Label>
                <select
                  id="businessScale"
                  className="w-full h-10 px-3 rounded-md border border-input text-sm bg-background"
                  disabled={isPendingProfile}
                  {...profileForm.register("businessScale")}
                >
                  <option value="MIKRO">Usaha Mikro (Omzet &lt; 2 Miliar)</option>
                  <option value="KECIL">Usaha Kecil (Omzet 2 - 15 Miliar)</option>
                  <option value="MENENGAH">Usaha Menengah</option>
                  <option value="BESAR">Usaha Besar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nib">Nomor Induk Berusaha (NIB 13 Digit)</Label>
                <Input
                  id="nib"
                  placeholder="Contoh: 1234567890123"
                  maxLength={13}
                  disabled={isPendingProfile}
                  {...profileForm.register("nib")}
                />
                {profileForm.formState.errors.nib && (
                  <p className="text-xs text-red-600">
                    {profileForm.formState.errors.nib.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="npwp">NPWP Badan / Pribadi (Opsional)</Label>
                <Input
                  id="npwp"
                  placeholder="Contoh: 01.234.567.8-901.000"
                  disabled={isPendingProfile}
                  {...profileForm.register("npwp")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Usaha</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="kontak@usaha.com"
                  disabled={isPendingProfile}
                  {...profileForm.register("email")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon / WhatsApp Usaha</Label>
                <Input
                  id="phoneNumber"
                  placeholder="08123456789"
                  disabled={isPendingProfile}
                  {...profileForm.register("phoneNumber")}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="bg-primary-800 hover:bg-primary-900"
                disabled={isPendingProfile}
              >
                {isPendingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Profil Usaha
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>

      {/* Form 2: Halal Supervisor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary-700" />
            2. Data Penyelia Halal
          </CardTitle>
          <CardDescription>
            Penyelia halal adalah penanggung jawab internal yang memastikan
            kehalalan proses produksi (Syarat UU JPH: Wajib Muslim & memiliki SK
            Penetapan).
          </CardDescription>
        </CardHeader>

        <form onSubmit={supervisorForm.handleSubmit(onSaveSupervisor)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sName">Nama Lengkap Penyelia Halal</Label>
                <Input
                  id="sName"
                  placeholder="Contoh: Muhammad Yusuf"
                  disabled={isPendingSupervisor}
                  {...supervisorForm.register("name")}
                />
                {supervisorForm.formState.errors.name && (
                  <p className="text-xs text-red-600">
                    {supervisorForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCardNumber">NIK KTP Penyelia (16 Digit)</Label>
                <Input
                  id="idCardNumber"
                  placeholder="3201xxxxxxxxxxxx"
                  maxLength={16}
                  disabled={isPendingSupervisor}
                  {...supervisorForm.register("idCardNumber")}
                />
                {supervisorForm.formState.errors.idCardNumber && (
                  <p className="text-xs text-red-600">
                    {supervisorForm.formState.errors.idCardNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sPhone">Nomor WhatsApp Penyelia</Label>
                <Input
                  id="sPhone"
                  placeholder="08123456789"
                  disabled={isPendingSupervisor}
                  {...supervisorForm.register("phoneNumber")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skNumber">Nomor SK Penetapan Internal</Label>
                <Input
                  id="skNumber"
                  placeholder="Contoh: SK-001/DIR/2026"
                  disabled={isPendingSupervisor}
                  {...supervisorForm.register("skNumber")}
                />
                {supervisorForm.formState.errors.skNumber && (
                  <p className="text-xs text-red-600">
                    {supervisorForm.formState.errors.skNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificateNumber">
                Nomor Sertifikat Pelatihan Halal (Opsional jika ada)
              </Label>
              <Input
                id="certificateNumber"
                placeholder="Contoh: SERT-PPH-2026-098"
                disabled={isPendingSupervisor}
                {...supervisorForm.register("certificateNumber")}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="bg-primary-800 hover:bg-primary-900"
                disabled={isPendingSupervisor}
              >
                {isPendingSupervisor ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Penyelia Halal
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
