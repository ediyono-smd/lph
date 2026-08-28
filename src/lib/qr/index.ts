import QRCode from "qrcode";

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 256,
      color: {
        dark: "#064e3b", // Deep emerald dark
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    throw new Error("Gagal meng-generate QR Code verifikasi.");
  }
}

export async function generateQrCodeSvg(text: string): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#064e3b",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("QR Code SVG Generation Error:", error);
    throw new Error("Gagal meng-generate QR Code SVG.");
  }
}
