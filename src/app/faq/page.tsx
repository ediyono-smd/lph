import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";
import { StarDivider } from "@/components/warm/star-divider";

export default function FaqPage() {
  const faqs = [
    {
      q: "Apa perbedaan skema Self-Declare dengan Reguler?",
      a: "Skema Self-Declare diperuntukkan bagi Usaha Mikro dan Kecil (UMK) dengan produk berisiko rendah dan bahan baku yang sudah bersertifikat halal (didampingi Pendamping PPH). Skema Reguler berlaku bagi usaha Menengah & Besar atau produk berproses kompleks yang memerlukan audit fasilitas dan uji laboratorium oleh Auditor LPH.",
    },
    {
      q: "Berapa lama masa berlaku Sertifikat Halal yang diterbitkan?",
      a: "Sesuai dengan regulasi terbaru UU Cipta Kerja dan ketentuan BPJPH, Sertifikat Halal yang diterbitkan berlaku seumur hidup sepanjang tidak ada perubahan komposisi bahan baku atau proses produksi yang dilakukan oleh pelaku usaha.",
    },
    {
      q: "Apa syarat menjadi Penyelia Halal internal di perusahaan?",
      a: "Penyelia halal wajib beragama Islam, memiliki wawasan syariat halal, ditunjuk secara resmi melalui Surat Keputusan (SK) Direksi/Pimpinan Usaha, dan diutamakan telah mengikuti pelatihan sertifikasi Penyelia Halal.",
    },
    {
      q: "Bagaimana cara memverifikasi keaslian Sertifikat Halal?",
      a: "Masyarakat umum dan konsumen dapat memverifikasi keaslian sertifikat dengan memindai QR Code yang tertera pada sertifikat fisik/digital, atau dengan memasukkan nomor register sertifikat pada halaman /verify di portal SIP-HALAL.",
    },
    {
      q: "Apa yang harus dilakukan jika pengajuan berstatus 'Need Correction'?",
      a: "Pelaku usaha dapat membuka menu 'Kotak Masuk Perbaikan' di dashboard, membaca catatan revisi dari verifikator/auditor, memperbarui data atau mengunggah ulang dokumen yang diminta, dan mengirimkan kembali penjelasan revisi.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900">
      <PublicNavbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <StarDivider
          subtitle="Pusat Bantuan & FAQ"
          title="Pertanyaan yang Sering Diajukan"
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 bg-white rounded-3xl border border-[#ebd7ba] shadow-sm hover:shadow-md hover:border-[#e5a952] transition-all space-y-2"
            >
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-[#b87d28] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-7 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
