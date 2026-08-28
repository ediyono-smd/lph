"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle, QrCode } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { HalalLogo } from "@/components/brand/halal-logo";
import QRCode from "qrcode";

interface CertificateCardProps {
  certificate: {
    certificateNumber: string;
    businessName: string;
    brandName: string;
    schemeType: string;
    status: string;
    issueDate: Date | string;
    validUntil?: Date | string | null;
    decisionNumber: string;
    qrCodeUrl?: string;
    digitalSignatureHash?: string;
    nib?: string;
    products?: {
      productName: string;
      brandName: string;
      categoryName: string;
      servingType?: string | null;
    }[];
  };
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const [qrSvg, setQrSvg] = useState<string>("");

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const verificationUrl = `${appUrl}/verify/${certificate.certificateNumber}`;

  useEffect(() => {
    QRCode.toString(verificationUrl, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#073b2d",
        light: "#ffffff",
      },
    })
      .then((svg) => {
        setQrSvg(svg);
      })
      .catch((err) => {
        console.error("Error generating QR code SVG:", err);
      });
  }, [verificationUrl]);

  const productList = certificate.products || [];
  const isMultiProduct = productList.length > 3;

  return (
    <div
      id="printable-certificate"
      className="w-full max-w-3xl mx-auto bg-white border-[10px] border-[#073b2d] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[960px] aspect-[1/1.414] print:border-[8px] print:border-[#073b2d] print:rounded-none print:shadow-none print:max-w-none print:w-full print:h-[285mm] print:min-h-[285mm] print:max-h-[285mm] print:p-6 print:m-0"
    >
      {/* Golden Corner Accents */}
      <div className="absolute top-2 left-2 w-14 h-14 border-t-4 border-l-4 border-[#e5a952] rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-2 right-2 w-14 h-14 border-t-4 border-r-4 border-[#e5a952] rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-14 h-14 border-b-4 border-l-4 border-[#e5a952] rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-14 h-14 border-b-4 border-r-4 border-[#e5a952] rounded-br-2xl pointer-events-none" />

      {/* Subtle Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <div className="w-[420px] h-[420px] relative flex items-center justify-center">
          <Image
            src="/images/halal-indonesia-logo.png"
            alt="Watermark Halal Indonesia"
            width={420}
            height={420}
            className="object-contain grayscale"
          />
        </div>
      </div>

      {/* TOP ZONE */}
      <div className="relative z-10 space-y-3.5 text-center shrink-0">
        {/* Certificate Header */}
        <div className="space-y-1 border-b-2 border-[#ebd7ba] pb-3">
          <div className="flex justify-center items-center">
            <div className="p-1.5 rounded-2xl bg-white border-2 border-[#ebd7ba] shadow-xs flex items-center justify-center">
              <HalalLogo size={60} />
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-[#073b2d]">
              REPUBLIK INDONESIA
            </p>
            <p className="text-[9.5px] uppercase tracking-[0.15em] font-bold text-[#b87d28]">
              BADAN PENYELENGGARA JAMINAN PRODUK HALAL (BPJPH)
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SERTIFIKAT HALAL
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              HALAL CERTIFICATE
            </p>
          </div>

          <div className="inline-block bg-[#fbf5eb] border border-[#ebd7ba] px-4 py-0.5 rounded-full mt-0.5">
            <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900">
              NOMOR: {certificate.certificateNumber}
            </span>
          </div>
        </div>

        {/* Certificate Intro & Business Info */}
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed max-w-xl mx-auto">
          <p className="text-justify sm:text-center text-[10.5px]">
            Berdasarkan pemeriksaan dan penetapan kehalalan produk sesuai syariat Islam
            serta pemenuhan standar Sistem Jaminan Produk Halal (SJPH), diterbitkan
            sertifikat halal resmi kepada:
          </p>

          <div className="py-2.5 px-5 bg-[#fcfaf6] rounded-2xl border border-[#ebd7ba] space-y-0.5 text-center shadow-xs">
            <span className="text-slate-500 text-[9.5px] font-bold uppercase tracking-wider block">
              Nama Pelaku Usaha / Badan Usaha:
            </span>
            <h2 className="font-heading text-base sm:text-lg font-extrabold text-[#073b2d]">
              {certificate.businessName}
            </h2>
            <p className="text-xs font-bold text-[#b87d28]">
              Merek Dagang: {certificate.brandName}
              {certificate.nib && (
                <span className="font-mono text-slate-600 font-normal ml-2">
                  (NIB: {certificate.nib})
                </span>
              )}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Skema: <strong className="text-slate-800">{certificate.schemeType === "SELF_DECLARE" ? "Self-Declare (UMKM)" : "Reguler (Pemeriksaan LPH)"}</strong>
            </p>
          </div>

          <p className="text-justify sm:text-center text-[10.5px]">
            Untuk kelompok produk dan daftar jenis olahan yang telah diverifikasi kehalalannya
            sebagaimana tercantum di bawah ini:
          </p>
        </div>
      </div>

      {/* MIDDLE ZONE: PRODUCT TABLE (Strictly bounded so it never pushes the footer) */}
      <div className="relative z-10 my-auto py-2 flex flex-col justify-center">
        <div className="max-w-xl w-full mx-auto rounded-xl border border-[#ebd7ba] overflow-hidden text-xs text-left shadow-xs flex flex-col">
          {/* Table Header */}
          <div className="bg-[#073b2d] text-white px-3.5 py-1.5 font-bold flex justify-between items-center text-[10.5px] shrink-0">
            <span>Daftar Produk Bersertifikat Halal</span>
            <span className="text-[9.5px] text-[#e5a952] font-extrabold">
              {productList.length} Item Terdaftar
            </span>
          </div>

          {/* Table Content */}
          <div className="bg-white max-h-[170px] overflow-y-auto">
            {productList.length === 0 ? (
              <div className="p-3 text-center text-slate-500 text-[11px]">
                Seluruh varian produk yang diajukan dalam permohonan.
              </div>
            ) : isMultiProduct ? (
              /* Multi-Product Compact Grid (for > 3 products) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 p-2">
                {productList.map((prod, idx) => (
                  <div
                    key={idx}
                    className="py-1 px-2.5 flex justify-between items-center text-[10px] bg-[#fcfaf6] rounded-lg border border-[#ebd7ba]/60"
                  >
                    <span className="font-bold text-slate-900 truncate mr-1">
                      {idx + 1}. {prod.productName}
                    </span>
                    <span className="text-slate-500 text-[9px] shrink-0 font-medium">
                      {prod.categoryName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* Formal Table for 1, 2, or 3 products */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#f7f2e8] border-b border-[#ebd7ba] text-slate-800 text-[10px] uppercase font-bold">
                      <th className="py-1.5 px-3 w-10 text-center">No.</th>
                      <th className="py-1.5 px-3">Nama Produk / Varian</th>
                      <th className="py-1.5 px-3">Kelompok / Kategori</th>
                      <th className="py-1.5 px-3 text-right">Kemasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productList.map((prod, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 1 ? "bg-[#fbf9f4]" : "bg-white"}
                      >
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-600 text-[10.5px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 text-[11px]">
                          {prod.productName}
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[10.5px]">
                          {prod.categoryName || "Makanan & Minuman"}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[9.5px] font-bold">
                            {prod.servingType || "KEMASAN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ZONE: FIXED AND LOCKED AT THE VERY BOTTOM OF THE A4 PAPER */}
      <div className="relative z-10 mt-auto pt-3 border-t-2 border-[#ebd7ba] shrink-0 space-y-2 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left">
          {/* Bottom Left: Prominent Vector QR Code */}
          <div className="flex items-center gap-3 bg-[#fcfaf6] p-2 rounded-2xl border border-[#ebd7ba] shadow-xs">
            <div className="h-20 w-20 border-2 border-[#ebd7ba] rounded-xl bg-white p-1 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
              {qrSvg ? (
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <QrCode className="h-8 w-8 text-[#073b2d]" />
                </div>
              )}
            </div>
            <div className="space-y-0.5 max-w-[195px]">
              <span className="text-[10px] font-extrabold uppercase text-[#073b2d] flex items-center gap-1">
                <QrCode className="h-3.5 w-3.5 text-[#b87d28]" />
                Pindai Keaslian Dokumen
              </span>
              <p className="text-[8.5px] text-slate-600 leading-snug">
                Pindai QR Code ini dengan kamera ponsel untuk validasi keaslian dokumen di database resmi SIP-HALAL.
              </p>
              <span className="text-[7.5px] font-mono text-slate-400 block truncate">
                {verificationUrl}
              </span>
            </div>
          </div>

          {/* Bottom Right: Diterbitkan di Jakarta, Ketetapan Halal & Official Seal */}
          <div className="text-right space-y-1 sm:max-w-[250px]">
            <p className="text-[10px] text-slate-600">
              Diterbitkan di Jakarta, <strong className="text-slate-950">{formatDate(certificate.issueDate)}</strong>
            </p>
            <p className="text-[10px] font-mono text-slate-800 font-bold">
              Ketetapan Halal: {certificate.decisionNumber}
            </p>
            <div className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle className="h-3 w-3 text-emerald-600" />
              STATUS: {certificate.status || "AKTIF & RESMI"}
            </div>
            <p className="text-[8.5px] text-slate-500 font-medium italic pt-0.5">
              Ditandatangani secara elektronik oleh Komite Fatwa Halal Republik Indonesia.
            </p>
          </div>
        </div>

        {/* Digital Signature SHA-256 Checksum */}
        {certificate.digitalSignatureHash && (
          <div className="pt-1 text-[7.5px] font-mono text-slate-400 break-all text-center border-t border-slate-100">
            Digital Signature SHA-256: {certificate.digitalSignatureHash}
          </div>
        )}
      </div>
    </div>
  );
}
