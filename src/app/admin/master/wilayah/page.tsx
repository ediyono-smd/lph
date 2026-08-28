"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getProvincesAction,
  getCitiesByProvinceAction,
  createProvinceAction,
  createCityAction,
} from "@/actions/master.actions";
import { DataTable, type ColumnDef } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, MapPin, Building, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  provinceSchema,
  citySchema,
  type ProvinceInput,
  type CityInput,
} from "@/lib/validation/master.validation";

interface ProvinceItem {
  id: string;
  name: string;
}

interface CityItem {
  id: string;
  provinceId: string;
  name: string;
  type: string;
}

export default function MasterWilayahPage() {
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceItem | null>(null);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Dialog State
  const [isProvinceDialogOpen, setIsProvinceDialogOpen] = useState(false);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const provinceForm = useForm<ProvinceInput>({
    resolver: zodResolver(provinceSchema),
    defaultValues: { id: "", name: "" },
  });

  const cityForm = useForm<CityInput>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      id: "",
      provinceId: "",
      name: "",
      type: "KOTA",
    },
  });

  const fetchProvinces = async () => {
    const res = await getProvincesAction();
    if (res.success && res.data) {
      setProvinces(res.data);
      if (!selectedProvince && res.data.length > 0) {
        setSelectedProvince(res.data[0]);
      }
    }
  };

  const fetchCities = async (provinceId: string) => {
    setIsLoadingCities(true);
    const res = await getCitiesByProvinceAction(provinceId);
    if (res.success && res.data) {
      setCities(res.data);
    }
    setIsLoadingCities(false);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince.id);
    }
  }, [selectedProvince]);

  const onSubmitProvince = (data: ProvinceInput) => {
    startTransition(async () => {
      const res = await createProvinceAction(data);
      if (res.success) {
        toast.success(res.message || "Provinsi berhasil ditambahkan.");
        setIsProvinceDialogOpen(false);
        fetchProvinces();
      } else {
        toast.error(res.error || "Gagal menambahkan provinsi.");
      }
    });
  };

  const onSubmitCity = (data: CityInput) => {
    startTransition(async () => {
      const res = await createCityAction(data);
      if (res.success) {
        toast.success(res.message || "Kota/Kabupaten berhasil ditambahkan.");
        setIsCityDialogOpen(false);
        if (selectedProvince) fetchCities(selectedProvince.id);
      } else {
        toast.error(res.error || "Gagal menambahkan kota.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary-700" />
            Master Wilayah Indonesia
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Data referensi hierarkis Provinsi dan Kabupaten/Kota resmi.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsProvinceDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Provinsi
          </Button>
          <Button
            className="bg-primary-800 hover:bg-primary-900"
            onClick={() => {
              if (selectedProvince) {
                cityForm.setValue("provinceId", selectedProvince.id);
                setIsCityDialogOpen(true);
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Kota/Kab
          </Button>
        </div>
      </div>

      {/* Grid: Provinces List (Left) & Cities Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Province Selector Box */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center justify-between">
            <span>Daftar Provinsi ({provinces.length})</span>
          </h3>
          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto pr-1">
            {provinces.map((prov) => {
              const isSelected = selectedProvince?.id === prov.id;
              return (
                <button
                  key={prov.id}
                  onClick={() => setSelectedProvince(prov)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary-800 text-white font-semibold shadow-sm"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono px-1.5 py-0.5 rounded text-[11px] ${
                        isSelected
                          ? "bg-primary-900 text-accent-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {prov.id}
                    </span>
                    <span>{prov.name}</span>
                  </div>
                  {isSelected && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cities Table (2 Columns Span) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Kota & Kabupaten di {selectedProvince?.name || "Provinsi Terpilih"}
                </h3>
                <p className="text-xs text-slate-500">
                  Kode Wilayah: {selectedProvince?.id}
                </p>
              </div>
              <Badge variant="secondary">
                {cities.length} Kota/Kab Terdaftar
              </Badge>
            </div>

            {isLoadingCities ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary-700" />
                Memuat data kota...
              </div>
            ) : cities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Belum ada data Kota/Kabupaten untuk provinsi ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cities.map((city) => (
                  <div
                    key={city.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 font-medium">
                        {city.id}
                      </span>
                      <span className="font-medium text-slate-900">
                        {city.name}
                      </span>
                    </div>
                    <Badge
                      variant={city.type === "KOTA" ? "info" : "outline"}
                      className="text-[10px]"
                    >
                      {city.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Province Dialog */}
      <Dialog open={isProvinceDialogOpen} onOpenChange={setIsProvinceDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Tambah Provinsi Baru</DialogTitle>
            <DialogDescription>
              Masukkan kode BPS (2 digit) dan nama resmi provinsi.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={provinceForm.handleSubmit(onSubmitProvince)}
            className="space-y-4 pt-2"
          >
            <div className="space-y-2">
              <Label htmlFor="provId">Kode Provinsi BPS</Label>
              <Input
                id="provId"
                placeholder="Contoh: 36 (Banten)"
                {...provinceForm.register("id")}
              />
              {provinceForm.formState.errors.id && (
                <p className="text-xs text-red-600">
                  {provinceForm.formState.errors.id.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="provName">Nama Provinsi</Label>
              <Input
                id="provName"
                placeholder="Contoh: BANTEN"
                {...provinceForm.register("name")}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProvinceDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-primary-800 hover:bg-primary-900">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add City Dialog */}
      <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Tambah Kota/Kabupaten</DialogTitle>
            <DialogDescription>
              Tambahkan data wilayah untuk {selectedProvince?.name}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={cityForm.handleSubmit(onSubmitCity)}
            className="space-y-4 pt-2"
          >
            <div className="space-y-2">
              <Label htmlFor="cityId">Kode Kota/Kabupaten (4 digit)</Label>
              <Input
                id="cityId"
                placeholder="Contoh: 3175"
                {...cityForm.register("id")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityName">Nama Kota/Kabupaten</Label>
              <Input
                id="cityName"
                placeholder="Contoh: JAKARTA TIMUR"
                {...cityForm.register("name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityType">Tipe Wilayah</Label>
              <select
                id="cityType"
                className="w-full h-10 px-3 rounded-md border border-input text-sm bg-background"
                {...cityForm.register("type")}
              >
                <option value="KOTA">KOTA</option>
                <option value="KABUPATEN">KABUPATEN</option>
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCityDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-primary-800 hover:bg-primary-900">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
