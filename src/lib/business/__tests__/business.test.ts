import {
  businessProfileSchema,
  supervisorSchema,
} from "../../validation/business.validation";
import { materialSchema } from "../../validation/material.validation";
import { productSchema } from "../../validation/product.validation";

async function runBusinessModuleTests() {
  console.log("🧪 Memulai Business, Product & Material Module Tests...");

  // Test 1: NIB 13 Digits Validation
  console.log("Test 1: NIB 13 Digits Validation...");
  const validBusiness = businessProfileSchema.safeParse({
    name: "PT Berkah Halal Sentosa",
    brandName: "Berkah Snack",
    businessType: "PT",
    businessScale: "MIKRO",
    nib: "1234567890123", // 13 digits
    email: "berkah@example.com",
    phoneNumber: "081234567890",
  });
  if (!validBusiness.success) {
    throw new Error("❌ Test 1 Gagal: Valid business profil ditolak: " + JSON.stringify(validBusiness.error));
  }

  const invalidNib = businessProfileSchema.safeParse({
    name: "PT Salah NIB",
    brandName: "Merek",
    businessType: "PT",
    businessScale: "MIKRO",
    nib: "12345", // invalid digits
    email: "salah@example.com",
    phoneNumber: "081234567890",
  });
  if (invalidNib.success) {
    throw new Error("❌ Test 1 Gagal: NIB < 13 digit seharusnya gagal");
  }
  console.log("✅ Test 1 Lolos: NIB 13 digit regex constraint valid.");

  // Test 2: Supervisor Validation (NIK 16 Digits)
  console.log("Test 2: Supervisor NIK Validation...");
  const validSupervisor = supervisorSchema.safeParse({
    name: "Ahmad Dahlan",
    idCardNumber: "3201234567890123", // 16 digits
    phoneNumber: "081234567890",
    religion: "ISLAM",
    skNumber: "SK-001/DIR/2026",
  });
  if (!validSupervisor.success) {
    throw new Error("❌ Test 2 Gagal: Valid supervisor ditolak");
  }
  console.log("✅ Test 2 Lolos: Supervisor NIK 16 digit & Islam requirement valid.");

  // Test 3: Product Recipe (BOM) Requirement (Must have >= 1 material)
  console.log("Test 3: Product BOM Requirement...");
  const emptyMaterialsProduct = productSchema.safeParse({
    categoryId: "11111111-1111-1111-1111-111111111111",
    name: "Keripik Singkong",
    brandName: "Berkah",
    productionProcessDescription: "Tahapan produksi mencuci, mengupas, menggoreng, dan mengemas keripik.",
    materials: [], // Empty BOM
  });
  if (emptyMaterialsProduct.success) {
    throw new Error("❌ Test 3 Gagal: Produk tanpa bahan baku seharusnya ditolak");
  }

  const validProduct = productSchema.safeParse({
    categoryId: "11111111-1111-1111-1111-111111111111",
    name: "Keripik Singkong Gurih",
    brandName: "Berkah",
    productionProcessDescription: "Tahapan produksi mencuci, mengupas, menggoreng dengan minyak halal, dan mengemas.",
    materials: [
      { materialId: "22222222-2222-2222-2222-222222222222", usageDescription: "Bahan Utama" },
      { materialId: "33333333-3333-3333-3333-333333333333", usageDescription: "Minyak Goreng" },
    ],
  });
  if (!validProduct.success) {
    throw new Error("❌ Test 3 Gagal: Valid product with BOM rejected");
  }
  console.log("✅ Test 3 Lolos: Product BOM Many-to-Many validation constraint valid.");

  console.log("🎉 SEMUA TEST MODUL PELAKU USAHA BERHASIL 100%!");
}

runBusinessModuleTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
