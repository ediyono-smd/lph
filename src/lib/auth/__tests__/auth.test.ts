import { hashPassword, comparePassword } from "../password";
import { signSessionToken, verifySessionToken } from "../session";
import { loginSchema, registerSchema } from "../../validation/auth.validation";

async function runAuthTests() {
  console.log("🧪 Memulai Auth & RBAC Module Tests...");

  // Test 1: Password hashing and comparison
  console.log("Test 1: Password Hashing...");
  const rawPassword = "SecurePassword123!";
  const hash = await hashPassword(rawPassword);
  const isMatch = await comparePassword(rawPassword, hash);
  const isWrongMatch = await comparePassword("WrongPassword!", hash);

  if (!isMatch || isWrongMatch) {
    throw new Error("❌ Test 1 Gagal: Password hash/compare tidak valid");
  }
  console.log("✅ Test 1 Lolos: Password hash & bcrypt comparison valid.");

  // Test 2: JWT Session Token Signing and Verification
  console.log("Test 2: Session Token Encrypt & Verify...");
  const payload = {
    userId: "11111111-2222-3333-4444-555555555555",
    email: "verifier@halal.go.id",
    fullName: "Ahmad Verifikator",
    roles: ["VERIFIER" as const],
    activeRole: "VERIFIER" as const,
  };

  const token = await signSessionToken(payload);
  const verified = await verifySessionToken(token);

  if (!verified || verified.userId !== payload.userId || verified.activeRole !== "VERIFIER") {
    throw new Error("❌ Test 2 Gagal: Session token verification mismatch");
  }
  console.log("✅ Test 2 Lolos: JWT Token stateless session valid.");

  // Test 3: Validation Schemas
  console.log("Test 3: Zod Validation Schemas...");
  const invalidLogin = loginSchema.safeParse({ email: "not-an-email", password: "" });
  if (invalidLogin.success) {
    throw new Error("❌ Test 3 Gagal: Invalid login lolos validasi");
  }

  const validRegister = registerSchema.safeParse({
    fullName: "Budi Santoso",
    email: "budi@example.com",
    phoneNumber: "081234567890",
    password: "Password123",
    confirmPassword: "Password123",
  });
  if (!validRegister.success) {
    throw new Error("❌ Test 3 Gagal: Valid register gagal validasi: " + JSON.stringify(validRegister.error));
  }
  console.log("✅ Test 3 Lolos: Zod input validation schemas valid.");

  console.log("🎉 SEMUA TEST AUTHENTICATION & SECURITY LOLOS 100%!");
}

runAuthTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
