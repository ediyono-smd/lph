import { db, pool } from "../index";
import {
  roles,
  users,
  userRoles,
  provinces,
  cities,
  productCategories,
  materialCategories,
} from "../schema";
import bcrypt from "bcryptjs";

async function runSeed() {
  console.log("🌱 Memulai seeding master data & default users ke Neon PostgreSQL...");

  try {
    // 1. Seed Roles
    console.log("1. Seeding Roles...");
    const roleList = [
      { name: "SUPER_ADMIN" as const, description: "Super Administrator Sistem" },
      { name: "ADMIN" as const, description: "Administrator Operasional" },
      { name: "VERIFIER" as const, description: "Verifikator Dokumen Pengajuan" },
      { name: "MENTOR" as const, description: "Pendamping Proses Produk Halal (PPH)" },
      { name: "AUDITOR" as const, description: "Auditor Halal Lembaga Pemeriksa Halal (LPH)" },
      { name: "LEADER" as const, description: "Pimpinan / Komite Fatwa Halal" },
      { name: "BUSINESS_OWNER" as const, description: "Pelaku Usaha / Pemohon Sertifikasi" },
    ];

    const insertedRoles: Record<string, string> = {};
    for (const r of roleList) {
      const [inserted] = await db
        .insert(roles)
        .values({
          name: r.name,
          description: r.description,
        })
        .onConflictDoNothing()
        .returning();

      if (inserted) {
        insertedRoles[r.name] = inserted.id;
      } else {
        const existing = await db.query.roles.findFirst({
          where: (f, { eq }) => eq(f.name, r.name),
        });
        if (existing) insertedRoles[r.name] = existing.id;
      }
    }

    // 2. Seed Default Users (Password: Admin123!)
    console.log("2. Seeding Default Accounts...");
    const defaultPasswordHash = await bcrypt.hash("Admin123!", 10);

    const defaultUsers = [
      {
        email: "superadmin@halal.go.id",
        fullName: "Super Administrator Halal",
        phoneNumber: "081100000001",
        role: "SUPER_ADMIN",
      },
      {
        email: "admin@halal.go.id",
        fullName: "Admin Operasional SIP-HALAL",
        phoneNumber: "081100000002",
        role: "ADMIN",
      },
      {
        email: "verifier@halal.go.id",
        fullName: "Ahmad Verifikator M.Si",
        phoneNumber: "081100000003",
        role: "VERIFIER",
      },
      {
        email: "mentor@halal.go.id",
        fullName: "Siti Pendamping PPH",
        phoneNumber: "081100000004",
        role: "MENTOR",
      },
      {
        email: "auditor@halal.go.id",
        fullName: "Dr. Ir. Budi Auditor Halal",
        phoneNumber: "081100000005",
        role: "AUDITOR",
      },
      {
        email: "leader@halal.go.id",
        fullName: "Prof. Dr. KH. Mahmud Pimpinan",
        phoneNumber: "081100000006",
        role: "LEADER",
      },
      {
        email: "pelakuusaha@demo.com",
        fullName: "Siti Rahma (Demo UMKM)",
        phoneNumber: "081234567890",
        role: "BUSINESS_OWNER",
      },
    ];

    for (const u of defaultUsers) {
      const [user] = await db
        .insert(users)
        .values({
          email: u.email,
          fullName: u.fullName,
          phoneNumber: u.phoneNumber,
          passwordHash: defaultPasswordHash,
          isActive: true,
          emailVerifiedAt: new Date(),
        })
        .onConflictDoNothing()
        .returning();

      const userId =
        user?.id ||
        (
          await db.query.users.findFirst({
            where: (f, { eq }) => eq(f.email, u.email),
          })
        )?.id;

      if (userId && insertedRoles[u.role]) {
        await db
          .insert(userRoles)
          .values({
            userId,
            roleId: insertedRoles[u.role],
          })
          .onConflictDoNothing();
      }
    }

    // 3. Seed Master Wilayah (Sample 5 Provinsi Utama & Kota)
    console.log("3. Seeding Master Wilayah...");
    const sampleProvinces = [
      { id: "31", name: "DKI JAKARTA" },
      { id: "32", name: "JAWA BARAT" },
      { id: "33", name: "JAWA TENGAH" },
      { id: "35", name: "JAWA TIMUR" },
      { id: "51", name: "BALI" },
    ];

    for (const p of sampleProvinces) {
      await db.insert(provinces).values(p).onConflictDoNothing();
    }

    const sampleCities = [
      { id: "3171", provinceId: "31", name: "JAKARTA PUSAT", type: "KOTA" },
      { id: "3173", provinceId: "31", name: "JAKARTA BARAT", type: "KOTA" },
      { id: "3174", provinceId: "31", name: "JAKARTA SELATAN", type: "KOTA" },
      { id: "3273", provinceId: "32", name: "BANDUNG", type: "KOTA" },
      { id: "3204", provinceId: "32", name: "BANDUNG", type: "KABUPATEN" },
      { id: "3271", provinceId: "32", name: "BOGOR", type: "KOTA" },
      { id: "3374", provinceId: "33", name: "SEMARANG", type: "KOTA" },
      { id: "3578", provinceId: "35", name: "SURABAYA", type: "KOTA" },
      { id: "5171", provinceId: "51", name: "DENPASAR", type: "KOTA" },
    ];

    for (const c of sampleCities) {
      await db.insert(cities).values(c).onConflictDoNothing();
    }

    // 4. Seed Product Categories
    console.log("4. Seeding Master Kategori Produk...");
    const sampleCategories = [
      { code: "MAKANAN_OLAHAN", name: "Makanan Olahan & Kudapan", description: "Produk olahan pangan siap konsumsi atau setengah jadi" },
      { code: "MINUMAN", name: "Minuman & Konsentrat", description: "Minuman kemasan, serbuk, dan jus buah" },
      { code: "KULINER_RESTO", name: "Restoran & Katering", description: "Layanan penyedia makanan dan minuman saji" },
      { code: "DAGING_UNGGAS", name: "Daging, Unggas & Hasil Sembelihan", description: "Daging segar dan olahan sembelihan halal" },
      { code: "KOSMETIK_SKINCARE", name: "Kosmetik & Perawatan Kulit", description: "Produk perawatan tubuh dan kecantikan" },
      { code: "OBAT_HERBAL", name: "Obat Tradisional & Suplemen", description: "Jamu, herbal, dan suplemen kesehatan" },
    ];

    for (const cat of sampleCategories) {
      await db.insert(productCategories).values(cat).onConflictDoNothing();
    }

    // 5. Seed Material Categories
    console.log("5. Seeding Master Kategori Bahan...");
    const sampleMaterialCategories = [
      { code: "NABATI", name: "Bahan Nabati (Tumbuh-tumbuhan)", description: "Bahan dari tanaman/tumbuhan non-kritis", isCritical: false },
      { code: "HEWANI", name: "Bahan Hewani & Turunannya", description: "Daging, gelatin, lemak, kolagen (Bahan Kritis Wajib Sertifikat)", isCritical: true },
      { code: "MIKROBIAL", name: "Bahan Mikrobial & Fermentasi", description: "Ragi, enzim, kultur bakteri (Bahan Kritis)", isCritical: true },
      { code: "KIMIA_SINTETIK", name: "Bahan Kimia, Sintetik & Tambahan Pangan", description: "Perisa, pewarna sintetis, pengawet, emulsifier", isCritical: true },
      { code: "TAMBANG_MINERAL", name: "Bahan Tambang & Mineral Alami", description: "Garam, air, kalsium karbonat non-kritis", isCritical: false },
    ];

    for (const mat of sampleMaterialCategories) {
      await db.insert(materialCategories).values(mat).onConflictDoNothing();
    }

    console.log("✅ Seeding database berhasil selesai 100%!");
  } catch (error) {
    console.error("❌ Error saat seeding:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
