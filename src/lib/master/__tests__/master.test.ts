import {
  productCategorySchema,
  materialCategorySchema,
  provinceSchema,
} from "../../validation/master.validation";
import { db, pool } from "../../../db";
import { productCategories, materialCategories, provinces } from "../../../db/schema";

async function runMasterDataTests() {
  console.log("🧪 Memulai Master Data Module Tests...");

  // Test 1: Validation Schemas
  console.log("Test 1: Master Data Validation Schemas...");
  const validProductCat = productCategorySchema.safeParse({
    code: "FARMASI_HERBAL",
    name: "Produk Farmasi & Herbal",
    description: "Obat dan jamu herbal",
    isActive: true,
  });
  if (!validProductCat.success) {
    throw new Error("❌ Test 1 Gagal: ProductCategorySchema error");
  }

  const validMaterialCat = materialCategorySchema.safeParse({
    code: "ENZIM_MIKRO",
    name: "Enzim & Kultur Mikrobial",
    isCritical: true,
    isActive: true,
  });
  if (!validMaterialCat.success) {
    throw new Error("❌ Test 1 Gagal: MaterialCategorySchema error");
  }
  console.log("✅ Test 1 Lolos: Validation Schemas valid.");

  // Test 2: Database Query Test
  console.log("Test 2: Database Query Master Data...");
  const categories = await db.select().from(productCategories).limit(5);
  const materials = await db.select().from(materialCategories).limit(5);
  const provList = await db.select().from(provinces).limit(5);

  if (categories.length === 0 || materials.length === 0 || provList.length === 0) {
    throw new Error("❌ Test 2 Gagal: Master data belum ter-seed di database");
  }
  console.log(`✅ Test 2 Lolos: Ditemukan ${categories.length} Kategori Produk, ${materials.length} Kategori Bahan, dan ${provList.length} Provinsi di database.`);

  console.log("🎉 SEMUA TEST MASTER DATA BERHASIL 100%!");
}

runMasterDataTests()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
