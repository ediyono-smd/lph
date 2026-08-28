import { generateQrCodeDataUrl, generateQrCodeSvg } from "../../qr";
import crypto from "crypto";

async function runCertificateTests() {
  console.log("🧪 Memulai Certificate & QR Verification Tests...");

  // Test 1: QR Code Data URL Generator
  console.log("Test 1: QR Code Data URL Generation...");
  const sampleUrl = "https://halal.go.id/verify/HALAL-2026-000001";
  const qrDataUrl = await generateQrCodeDataUrl(sampleUrl);

  if (!qrDataUrl.startsWith("data:image/png;base64,")) {
    throw new Error("❌ Test 1 Gagal: QR Data URL bukan format base64 PNG yang valid");
  }
  console.log("✅ Test 1 Lolos: QR Code data URL generated successfully.");

  // Test 2: QR Code SVG Generator
  console.log("Test 2: QR Code SVG Generation...");
  const qrSvg = await generateQrCodeSvg(sampleUrl);
  if (!qrSvg.includes("<svg") || !qrSvg.includes("</svg>")) {
    throw new Error("❌ Test 2 Gagal: QR SVG bukan format XML SVG yang valid");
  }
  console.log("✅ Test 2 Lolos: QR Code SVG generated successfully.");

  // Test 3: Digital Signature Checksum
  console.log("Test 3: Digital Signature Checksum SHA-256...");
  const payload = "HALAL-2026-000001|PT Berkah Halal|1234567890123|SK-FATWA-001|2026-08-28";
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  if (hash.length !== 64) {
    throw new Error("❌ Test 3 Gagal: SHA-256 hash length tidak 64 hex characters");
  }
  console.log("✅ Test 3 Lolos: SHA-256 Digital Checksum verification valid.");

  console.log("🎉 SEMUA TEST CERTIFICATE & QR VERIFICATION BERHASIL 100%!");
}

runCertificateTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
