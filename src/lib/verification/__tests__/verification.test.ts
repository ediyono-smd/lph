import {
  checklistItemVerificationSchema,
  verificationDecisionSchema,
  assignOfficerSchema,
} from "../../validation/verification.validation";

async function runVerificationTests() {
  console.log("🧪 Memulai Verification & Assignment Module Tests...");

  // Test 1: Checklist item schema
  console.log("Test 1: Checklist Item Schema Validation...");
  const validChecklist = checklistItemVerificationSchema.safeParse({
    applicationId: "11111111-1111-1111-1111-111111111111",
    itemKey: "NIB_LEGALITY",
    itemName: "Dokumen NIB 13 Digit",
    isValid: true,
    notes: "NIB valid dan sesuai nama direktur",
  });
  if (!validChecklist.success) {
    throw new Error("❌ Test 1 Gagal: Valid checklist item ditolak");
  }
  console.log("✅ Test 1 Lolos: Checklist item schema valid.");

  // Test 2: Verification Decision Schema
  console.log("Test 2: Verification Decision Validation...");
  const validDecision = verificationDecisionSchema.safeParse({
    applicationId: "11111111-1111-1111-1111-111111111111",
    decision: "REQUEST_CORRECTION",
    notes: "Mohon perbaiki dokumen sertifikat halal supplier yang buram.",
  });
  if (!validDecision.success) {
    throw new Error("❌ Test 2 Gagal: Valid decision ditolak");
  }

  const shortDecisionNotes = verificationDecisionSchema.safeParse({
    applicationId: "11111111-1111-1111-1111-111111111111",
    decision: "REJECT",
    notes: "no", // Too short
  });
  if (shortDecisionNotes.success) {
    throw new Error("❌ Test 2 Gagal: Catatan keputusan verifikasi < 5 karakter harus ditolak");
  }
  console.log("✅ Test 2 Lolos: Verification decision schema constraints valid.");

  // Test 3: Officer Assignment Schema
  console.log("Test 3: Assign Officer Schema Validation...");
  const validAssignment = assignOfficerSchema.safeParse({
    applicationId: "11111111-1111-1111-1111-111111111111",
    officerUserId: "22222222-2222-2222-2222-222222222222",
    officerType: "AUDITOR",
    notes: "Tugaskan audit lapangan fasilitas produksi",
  });
  if (!validAssignment.success) {
    throw new Error("❌ Test 3 Gagal: Valid officer assignment ditolak");
  }
  console.log("✅ Test 3 Lolos: Officer assignment schema valid.");

  console.log("🎉 SEMUA TEST VERIFIKASI & PENUGASAN BERHASIL 100%!");
}

runVerificationTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
