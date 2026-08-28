import {
  applicationDraftSchema,
  correctionResponseSchema,
} from "../../validation/application.validation";

async function runApplicationTests() {
  console.log("🧪 Memulai Application Workflow & State Machine Tests...");

  // Test 1: Application Draft Validation
  console.log("Test 1: Application Draft Schema Validation...");
  const validDraft = applicationDraftSchema.safeParse({
    schemeType: "SELF_DECLARE",
    productIds: ["11111111-1111-1111-1111-111111111111"],
    notes: "Pengajuan produk keripik singkong UMKM",
  });
  if (!validDraft.success) {
    throw new Error("❌ Test 1 Gagal: Valid application draft ditolak");
  }

  const emptyProductsDraft = applicationDraftSchema.safeParse({
    schemeType: "REGULER",
    productIds: [], // Empty
  });
  if (emptyProductsDraft.success) {
    throw new Error("❌ Test 1 Gagal: Pengajuan tanpa produk terpilih seharusnya ditolak");
  }
  console.log("✅ Test 1 Lolos: Application draft validation schema valid.");

  // Test 2: Correction Response Validation
  console.log("Test 2: Correction Response Schema Validation...");
  const validCorrection = correctionResponseSchema.safeParse({
    applicationId: "22222222-2222-2222-2222-222222222222",
    correctionNotes: "Dokumen NIB telah diperbarui dengan file resolusi tinggi.",
  });
  if (!validCorrection.success) {
    throw new Error("❌ Test 2 Gagal: Valid correction response ditolak");
  }

  const shortCorrection = correctionResponseSchema.safeParse({
    applicationId: "22222222-2222-2222-2222-222222222222",
    correctionNotes: "ok", // Too short
  });
  if (shortCorrection.success) {
    throw new Error("❌ Test 2 Gagal: Catatan koreksi < 10 karakter seharusnya ditolak");
  }
  console.log("✅ Test 2 Lolos: Correction response schema constraints valid.");

  console.log("🎉 SEMUA TEST APPLICATION WORKFLOW BERHASIL 100%!");
}

runApplicationTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
