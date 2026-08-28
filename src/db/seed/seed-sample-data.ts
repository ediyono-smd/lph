import { db, pool } from "../index";
import {
  roles,
  users,
  userRoles,
  businesses,
  businessSupervisors,
  materials,
  products,
  productMaterials,
  applications,
  applicationProducts,
  applicationStatusHistories,
  auditors,
  mentors,
  auditorAssignments,
  mentorAssignments,
  inspectionSchedules,
  certificates,
  certificateProducts,
  productCategories,
  materialCategories,
} from "../schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const AUDITOR_NAMES = [
  "Dr. Ir. Hendra Prasetyo, M.Si.",
  "Ir. Dewi Sartika, M.Sc.",
  "Dr. Bambang Kusumo, S.Pt., M.Si.",
  "Ahmad Fauzi, S.T., M.T.",
  "Dr. Rina Marlina, M.P.",
  "Ir. H. Gunawan Wibisono, M.M.",
  "Dr. Ratna Juwita, M.Biotech.",
  "Agus Supriyadi, S.Si., M.Sc.",
  "Dr. Siti Aminah, S.Pt., M.P.",
  "Ir. Eko Wahyudi, M.App.Sc.",
  "Dr. M. Ridwan Hakim, M.Si.",
  "Sri Wahyuni, S.TP., M.Sc.",
  "Dr. Taufik Hidayat, M.Si.",
  "Ir. Nurul Hidayati, M.Eng.",
  "Dr. Arif Rachman, S.Si., M.Biomed.",
  "Endang Susilowati, S.Pt., M.Si.",
  "Dr. Hendro Siswanto, M.T.",
  "Ir. Anisa Rahmawati, M.P.",
  "Dr. Fahmi Idris, M.Sc.",
  "Dra. Yulia Hartati, M.Si.",
];

const LPH_INSTITUTIONS = [
  "LPH LPPOM MUI",
  "LPH PT Sucofindo (Persero)",
  "LPH PT Surveyor Indonesia",
  "LPH Balai Besar Standardisasi dan Pelayanan Jasa Industri Agro",
  "LPH Universitas Indonesia (Halal Center UI)",
  "LPH IPB University (Halal Science Center)",
  "LPH Universitas Gadjah Mada",
  "LPH Universitas Brawijaya",
  "LPH UIN Sunan Kalijaga Yogyakarta",
  "LPH UIN Syarif Hidayatullah Jakarta",
];

const COMPETENCY_FIELDS = [
  "Pangan Olahan dan Minuman",
  "Daging, Unggas dan RPH Halal",
  "Bahan Kimia dan Bahan Tambahan Pangan",
  "Kosmetik dan Produk Perawatan Kulit",
  "Obat Tradisional dan Farmasi",
  "Jasa Boga, Restoran dan Katering",
];

const MENTOR_NAMES = [
  "Siti Nurhaliza, S.Pd.",
  "Rahmat Hidayat, S.Kom.",
  "Aisyah Wulandari, S.Farm.",
  "Muhammad Yusuf, S.E.",
  "Fitriani Astuti, S.Si.",
  "Dedi Kusuma, S.Sos.",
  "Nur Hasanah, S.Ag.",
  "Irfan Maulana, S.T.",
  "Lestari Handayani, S.Pd.I.",
  "Bambang Hermanto, S.E.",
  "Khadijah Azzahra, S.Sos.",
  "Zulkifli Anwar, S.Pd.",
  "Wardah Syarifah, S.Si.",
  "Faris Al-Fatih, S.Kom.",
  "Hani Nur Latifah, S.Ak.",
  "Dani Firmansyah, S.T.",
  "Salma Mutia, S.Farm.",
  "Ridho Pratama, S.E.",
  "Umi Kalsum, S.Pd.",
  "Tegar Setiawan, S.Si.",
];

const LP3H_INSTITUTIONS = [
  "LP3H Halal Center Cendekia Muslim (HCCM)",
  "LP3H Halal Institute",
  "LP3H Mathla'ul Anwar",
  "LP3H Ikatan Sarjana Nahdlatul Ulama (ISNU)",
  "LP3H Muhammadiyah",
  "LP3H Universitas Islam Malang (UNISMA)",
  "LP3H Universitas Nahdlatul Ulama Surabaya",
  "LP3H Yayasan Rumah Halal Indonesia",
  "LP3H Pusat Kajian Sains Halal UGM",
  "LP3H Halal Center Universitas Airlangga",
];

const UMKM_BUSINESS_DATA = [
  { name: "Dapur Sambal Bu Maryam", brand: "Sambal Bu Maryam", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Sambal Bawang Roa Juara", cat: "MAKANAN_OLAHAN" },
  { name: "Keripik Singkong Barokah Mandiri", brand: "Keripik Barokah", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Keripik Singkong Renyah Balado", cat: "MAKANAN_OLAHAN" },
  { name: "Kopi Robusta Lereng Merapi", brand: "Merapi Beans", scale: "KECIL" as const, type: "CV" as const, prod: "Kopi Bubuk Robusta Premium", cat: "MINUMAN" },
  { name: "Bakso Sapi Asli Berkah", brand: "Bakso Berkah", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Bakso Sapi Urat Halal", cat: "DAGING_UNGGAS" },
  { name: "Roti Unyil Jasmine Bakery", brand: "Jasmine Bakery", scale: "KECIL" as const, type: "CV" as const, prod: "Roti Unyil Aneka Rasa", cat: "MAKANAN_OLAHAN" },
  { name: "Madu Hutan Sumbawa Murni", brand: "Madu Sumbawa Al-Barakah", scale: "KECIL" as const, type: "PERSEORANGAN" as const, prod: "Madu Randu Asli Botol", cat: "MINUMAN" },
  { name: "Rendang Daging Padang Asli Minang", brand: "Rendang Salero", scale: "KECIL" as const, type: "CV" as const, prod: "Rendang Daging Sapi Kemasan Steril", cat: "MAKANAN_OLAHAN" },
  { name: "Kerupuk Ikan Tenggiri Juara", brand: "Kerupuk Tenggiri Juara", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Kerupuk Ikan Gurih Asli Cilacap", cat: "MAKANAN_OLAHAN" },
  { name: "Ayam Ungkep Bumbu Kuning Mak Nyus", brand: "Ayam Mak Nyus", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Ayam Ungkep Frozen Siap Goreng", cat: "DAGING_UNGGAS" },
  { name: "Yogurt Probiotik Al-Falah", brand: "Al-Falah Yogurt", scale: "KECIL" as const, type: "CV" as const, prod: "Greek Yogurt Rasa Stroberi", cat: "MINUMAN" },
  { name: "Abon Sapi Gurih Barokah", brand: "Abon Barokah", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Abon Daging Sapi Asli 250g", cat: "MAKANAN_OLAHAN" },
  { name: "Cilok Kuah Pedas Mak Icih", brand: "Mak Icih Snacks", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Cilok Bumbu Kacang Pedas", cat: "MAKANAN_OLAHAN" },
  { name: "Susu Kambing Etawa Sehat Alami", brand: "Etawa Prima", scale: "KECIL" as const, type: "CV" as const, prod: "Bubuk Susu Etawa Plus Madu", cat: "MINUMAN" },
  { name: "Bumbu Pecel Madiun Bu Lastri", brand: "Pecel Bu Lastri", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Bumbu Pecel Sangrai Tradisional", cat: "MAKANAN_OLAHAN" },
  { name: "Keripik Tempe Sagu Renyah", brand: "Tempe Crispy Ny. Lia", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Keripik Tempe Bumbu Daun Jeruk", cat: "MAKANAN_OLAHAN" },
  { name: "Sirup Jahe Merah Nusantara", brand: "Jahe Merah Nusantara", scale: "KECIL" as const, type: "CV" as const, prod: "Konsentrat Jahe Merah Madu", cat: "MINUMAN" },
  { name: "Nugget Ayam Sehat Tanpa Pengawet", brand: "Nu-Sehat Kids", scale: "KECIL" as const, type: "CV" as const, prod: "Nugget Ayam Sayur Wortel", cat: "DAGING_UNGGAS" },
  { name: "Dodol Garut Asli Ibu Enin", brand: "Dodol Ibu Enin", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Dodol Wijen Ketan Hitam", cat: "MAKANAN_OLAHAN" },
  { name: "Teh Herbal Bunga Telang Alami", brand: "Telang Herbal Life", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Kantung Teh Celup Telang Segar", cat: "MINUMAN" },
  { name: "Kue Kering Nastar Wisman Berkah", brand: "Berkah Cookies", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Nastar Nanas Keju Spesial", cat: "MAKANAN_OLAHAN" },
  { name: "Kastengel Keju Renyah Barokah", brand: "Berkah Cookies", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Kastengel Edam Premium", cat: "MAKANAN_OLAHAN" },
  { name: "Kecap Manis Tradisional Cap Ikan Koki", brand: "Cap Ikan Koki", scale: "MENENGAH" as const, type: "PT" as const, prod: "Kecap Manis Kedelai Hitam Alami", cat: "MAKANAN_OLAHAN" },
  { name: "Saos Tomat & Sambal Buana", brand: "Buana Sauce", scale: "MENENGAH" as const, type: "PT" as const, prod: "Saus Sambal Ekstra Pedas Botol", cat: "MAKANAN_OLAHAN" },
  { name: "Restoran Dapoer Minang Saiyo", brand: "Dapoer Saiyo", scale: "KECIL" as const, type: "CV" as const, prod: "Paket Menu Nasi Padang Komplit", cat: "KULINER_RESTO" },
  { name: "Katering Sehat Berkah Aqiqah", brand: "Berkah Aqiqah", scale: "KECIL" as const, type: "CV" as const, prod: "Paket Nasi Kebuli Daging Kambing", cat: "KULINER_RESTO" },
  { name: "Keripik Jamur Tiram Crispy", brand: "Mushroom Crunch", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Keripik Jamur Original Gurih", cat: "MAKANAN_OLAHAN" },
  { name: "Minuman Sari Apel Asli Batu", brand: "Kusuma Apple Juice", scale: "KECIL" as const, type: "CV" as const, prod: "Sari Buah Apel Manalagi Cup 120ml", cat: "MINUMAN" },
  { name: "Cokelat Rempah Nusantara", brand: "Choco Spice ID", scale: "KECIL" as const, type: "CV" as const, prod: "Dark Chocolate 70% Kayu Manis", cat: "MAKANAN_OLAHAN" },
  { name: "Kopi Arabika Gayo Organik", brand: "Gayo Mountain Blend", scale: "KECIL" as const, type: "CV" as const, prod: "Biji Kopi Arabika Sangrai Medium", cat: "MINUMAN" },
  { name: "Sosis Sapi Halal Farm Fresh", brand: "Farm Fresh Sosis", scale: "MENENGAH" as const, type: "PT" as const, prod: "Sosis Sapi Cocktail Asap", cat: "DAGING_UNGGAS" },
  { name: "Kerupuk Kulit Sapi Renyah", brand: "Rambak Berkah", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Kerupuk Rambak Sapi Asli", cat: "MAKANAN_OLAHAN" },
  { name: "Pia Tradisional Kacang Hijau", brand: "Pia Barokah Pathok", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Bakpia Basah Kacang Hijau", cat: "MAKANAN_OLAHAN" },
  { name: "Minuman Lidah Buaya Segar", brand: "Aloe Fresh Pontianak", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Minuman Jelly Lidah Buaya", cat: "MINUMAN" },
  { name: "Dendeng Batokok Sapi Asli", brand: "Batokok Bukittinggi", scale: "KECIL" as const, type: "CV" as const, prod: "Dendeng Balado Basah Vacum", cat: "MAKANAN_OLAHAN" },
  { name: "Bawang Goreng Brebes Super", brand: "Bawang Mas", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Bawang Merah Goreng Renyah Toples", cat: "MAKANAN_OLAHAN" },
  { name: "Jamu Kunyit Asam Alami Ny. Sri", brand: "Jamu Ny. Sri", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Minuman Kunyit Asam Sirih Dingin", cat: "OBAT_HERBAL" },
  { name: "Minyak Kelapa Murni VCO Al-Afiat", brand: "VCO Al-Afiat", scale: "KECIL" as const, type: "CV" as const, prod: "Virgin Coconut Oil Cold Pressed", cat: "OBAT_HERBAL" },
  { name: "Sabun Herbal Bidara & Zaitun", brand: "Herba Botanica", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Sabun Mandi Batang Ekstrak Daun Bidara", cat: "KOSMETIK_SKINCARE" },
  { name: "Krim Pelembab Wajah Habbatus Sauda", brand: "Zahra Skincare", scale: "KECIL" as const, type: "CV" as const, prod: "Day Cream Habbatus Sauda Glow", cat: "KOSMETIK_SKINCARE" },
  { name: "Kue Lapis Legit Spesial Mentega", brand: "Lapis Legit Harum", scale: "KECIL" as const, type: "CV" as const, prod: "Lapis Legit Prunes Tradisional", cat: "MAKANAN_OLAHAN" },
  { name: "Keripik Brownies Crispy Almond", brand: "Brownies Crispy Choco", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Keripik Brownies Panggang Almond", cat: "MAKANAN_OLAHAN" },
  { name: "Sambal Cumi Asin Cabe Ijo", brand: "Sambal Mertua", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Sambal Cumi Asin Botol Kaca", cat: "MAKANAN_OLAHAN" },
  { name: "Siomay Ikan Bandung Frozen", brand: "Siomay Kang Asep", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Siomay Tenggiri Plus Bumbu Kacang", cat: "MAKANAN_OLAHAN" },
  { name: "Pempek Ikan Palembang Asli Cuko", brand: "Pempek Pak Raden", scale: "KECIL" as const, type: "CV" as const, prod: "Paket Pempek Kapal Selam & Lenjer", cat: "MAKANAN_OLAHAN" },
  { name: "Emping Melinjo Manis Pedas", brand: "Emping Barokah Limpung", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Emping Melinjo Balado Khas Jawa Tengah", cat: "MAKANAN_OLAHAN" },
  { name: "Kue Bika Ambon Medan Istimewa", brand: "Bika Ambon Zulaikha KW", scale: "KECIL" as const, type: "CV" as const, prod: "Bika Ambon Pandan Loyang", cat: "MAKANAN_OLAHAN" },
  { name: "Kerupuk Bawang Renyah Gurih", brand: "Bawang Crunchy", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Kerupuk Bawang Putih Curah 500g", cat: "MAKANAN_OLAHAN" },
  { name: "Nasi Uduk & Lauk Pauk Komplit", brand: "Dapur Uduk Kebon Kacang", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Nasi Uduk Betawi Semur Tahu Tempe", cat: "KULINER_RESTO" },
  { name: "Serundeng Kelapa Manis Gurih", brand: "Serundeng Mak Tinah", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Serundeng Kelapa Sangrai Daging", cat: "MAKANAN_OLAHAN" },
  { name: "Rambak Pisang Kepok Cokelat", brand: "Banana Crunchy Delight", scale: "MIKRO" as const, type: "PERSEORANGAN" as const, prod: "Keripik Pisang Lumer Cokelat Lampung", cat: "MAKANAN_OLAHAN" },
];

export async function runBulkSampleDataSeed() {
  console.log("🚀 Memulai seeding sampel data (20 Auditor, 20 Pendamping, 50 Pelaku Usaha)...");

  try {
    const passwordHash = await bcrypt.hash("Admin123!", 10);

    // Fetch Roles
    const allRoles = await db.query.roles.findMany();
    const roleMap = new Map(allRoles.map((r) => [r.name, r.id]));

    const auditorRoleId = roleMap.get("AUDITOR");
    const mentorRoleId = roleMap.get("MENTOR");
    const businessOwnerRoleId = roleMap.get("BUSINESS_OWNER");
    const leaderUser = await db.query.users.findFirst({
      where: (f, { eq }) => eq(f.email, "leader@halal.go.id"),
    });
    const adminUser = await db.query.users.findFirst({
      where: (f, { eq }) => eq(f.email, "admin@halal.go.id"),
    });

    if (!auditorRoleId || !mentorRoleId || !businessOwnerRoleId || !leaderUser || !adminUser) {
      throw new Error("Master roles or system users are missing. Please run base seed first.");
    }

    // Fetch Categories
    const pCats = await db.query.productCategories.findMany();
    const pCatMap = new Map(pCats.map((c) => [c.code, c.id]));

    const mCats = await db.query.materialCategories.findMany();
    const mCatMap = new Map(mCats.map((c) => [c.code, c.id]));

    const nabatiCatId = mCatMap.get("NABATI") || mCats[0].id;
    const mineralCatId = mCatMap.get("TAMBANG_MINERAL") || mCats[0].id;
    const defaultProductCatId = pCats[0].id;

    // ==========================================
    // 1. SEED 20 AUDITORS
    // ==========================================
    console.log("1. Seeding 20 Auditor Halal...");
    const createdAuditors: any[] = [];

    for (let i = 0; i < 20; i++) {
      const idx = String(i + 1).padStart(2, "0");
      const email = `auditor${idx}@halal.go.id`;
      const fullName = AUDITOR_NAMES[i];
      const phoneNumber = `0813100001${idx}`;
      const lphName = LPH_INSTITUTIONS[i % LPH_INSTITUTIONS.length];
      const competencyField = COMPETENCY_FIELDS[i % COMPETENCY_FIELDS.length];
      const auditorRegNumber = `REG-AUD-2026-${String(i + 1).padStart(4, "0")}`;

      const [userInserted] = await db
        .insert(users)
        .values({
          email,
          fullName,
          phoneNumber,
          passwordHash,
          isActive: true,
          emailVerifiedAt: new Date(),
        })
        .onConflictDoNothing()
        .returning();

      const user =
        userInserted ||
        (await db.query.users.findFirst({
          where: (f, { eq }) => eq(f.email, email),
        }));

      if (user) {
        await db
          .insert(userRoles)
          .values({
            userId: user.id,
            roleId: auditorRoleId,
          })
          .onConflictDoNothing();

        const [auditorInserted] = await db
          .insert(auditors)
          .values({
            userId: user.id,
            auditorRegNumber,
            lphName,
            competencyField,
            isActive: true,
          })
          .onConflictDoNothing()
          .returning();

        const auditor =
          auditorInserted ||
          (await db.query.auditors.findFirst({
            where: (f, { eq }) => eq(f.userId, user.id),
          }));

        if (auditor) createdAuditors.push(auditor);
      }
    }
    console.log(`✓ Berhasil membuat ${createdAuditors.length} Auditor Halal.`);

    // ==========================================
    // 2. SEED 20 PENDAMPING PPH (MENTORS)
    // ==========================================
    console.log("2. Seeding 20 Pendamping PPH...");
    const createdMentors: any[] = [];

    for (let i = 0; i < 20; i++) {
      const idx = String(i + 1).padStart(2, "0");
      const email = `pendamping${idx}@halal.go.id`;
      const fullName = MENTOR_NAMES[i];
      const phoneNumber = `0812200002${idx}`;
      const institutionName = LP3H_INSTITUTIONS[i % LP3H_INSTITUTIONS.length];
      const registrationNumber = `REG-PPH-2026-${String(i + 1).padStart(4, "0")}`;
      const skNumber = `SK-BPJPH-PPH-2026-${String(i + 1).padStart(4, "0")}`;

      const [userInserted] = await db
        .insert(users)
        .values({
          email,
          fullName,
          phoneNumber,
          passwordHash,
          isActive: true,
          emailVerifiedAt: new Date(),
        })
        .onConflictDoNothing()
        .returning();

      const user =
        userInserted ||
        (await db.query.users.findFirst({
          where: (f, { eq }) => eq(f.email, email),
        }));

      if (user) {
        await db
          .insert(userRoles)
          .values({
            userId: user.id,
            roleId: mentorRoleId,
          })
          .onConflictDoNothing();

        const [mentorInserted] = await db
          .insert(mentors)
          .values({
            userId: user.id,
            registrationNumber,
            institutionName,
            skNumber,
            isActive: true,
          })
          .onConflictDoNothing()
          .returning();

        const mentor =
          mentorInserted ||
          (await db.query.mentors.findFirst({
            where: (f, { eq }) => eq(f.userId, user.id),
          }));

        if (mentor) createdMentors.push(mentor);
      }
    }
    console.log(`✓ Berhasil membuat ${createdMentors.length} Pendamping PPH.`);

    // ==========================================
    // 3. SEED 50 PELAKU USAHA (BUSINESS OWNERS)
    // ==========================================
    console.log("3. Seeding 50 Pelaku Usaha lengkap dengan Bisnis, Bahan, Produk, dan Pengajuan...");

    for (let i = 0; i < 50; i++) {
      const idx = String(i + 1).padStart(2, "0");
      const sample = UMKM_BUSINESS_DATA[i];
      const email = `umkm${idx}@halal.go.id`;
      const fullName = `Owner ${sample.brand}`;
      const phoneNumber = `0812300005${idx}`;
      const nib = `91200000000${idx}`; // 13 digits
      const appNumber = `APP-2026-${String(i + 1).padStart(6, "0")}`;

      // 3.1 Create User
      const [userInserted] = await db
        .insert(users)
        .values({
          email,
          fullName,
          phoneNumber,
          passwordHash,
          isActive: true,
          emailVerifiedAt: new Date(),
        })
        .onConflictDoNothing()
        .returning();

      const user =
        userInserted ||
        (await db.query.users.findFirst({
          where: (f, { eq }) => eq(f.email, email),
        }));

      if (!user) continue;

      await db
        .insert(userRoles)
        .values({
          userId: user.id,
          roleId: businessOwnerRoleId,
        })
        .onConflictDoNothing();

      // 3.2 Create Business
      const [bizInserted] = await db
        .insert(businesses)
        .values({
          userId: user.id,
          name: sample.name,
          brandName: sample.brand,
          businessType: sample.type,
          businessScale: sample.scale,
          nib,
          email,
          phoneNumber,
          website: `https://${sample.brand.toLowerCase().replace(/[^a-z0-9]/g, "")}.id`,
          isActive: true,
        })
        .onConflictDoNothing()
        .returning();

      const business =
        bizInserted ||
        (await db.query.businesses.findFirst({
          where: (f, { eq }) => eq(f.nib, nib),
        }));

      if (!business) continue;

      // 3.3 Create Supervisor (Penyelia Halal)
      await db
        .insert(businessSupervisors)
        .values({
          businessId: business.id,
          name: `Penyelia Halal ${sample.brand}`,
          idCardNumber: `31740000000000${idx}`,
          phoneNumber,
          religion: "ISLAM",
          skNumber: `SK-PY-2026-${String(i + 1).padStart(4, "0")}`,
          certificateNumber: `SERT-PY-2026-${String(i + 1).padStart(4, "0")}`,
        })
        .onConflictDoNothing();

      // 3.4 Create Raw Materials (2-3 Bahan per usaha)
      const [mat1] = await db
        .insert(materials)
        .values({
          businessId: business.id,
          categoryId: nabatiCatId,
          name: "Tepung / Bumbu Nabati Alami",
          tradeName: "Bahan Nabati Pilihan",
          manufacturer: "PT Pangan Alami Sejahtera",
          supplier: "Distributor Bahan Halal",
          isHalalCertified: true,
          halalCertNumber: `ID0011000000001012${i % 9}`,
          certIssuer: "BPJPH",
          isActive: true,
        })
        .onConflictDoNothing()
        .returning();

      const [mat2] = await db
        .insert(materials)
        .values({
          businessId: business.id,
          categoryId: mineralCatId,
          name: "Garam & Mineral Alami",
          tradeName: "Garam Beryodium Halal",
          manufacturer: "PT Garam Nusantara",
          supplier: "Agen Resmi Garam",
          isHalalCertified: true,
          halalCertNumber: `ID0022000000002012${i % 9}`,
          certIssuer: "BPJPH",
          isActive: true,
        })
        .onConflictDoNothing()
        .returning();

      // 3.5 Create Product
      const prodCatId = pCatMap.get(sample.cat) || defaultProductCatId;
      const [prod] = await db
        .insert(products)
        .values({
          businessId: business.id,
          categoryId: prodCatId,
          name: sample.prod,
          brandName: sample.brand,
          description: `Produk ${sample.prod} dibuat dengan standar higienis dan bahan-bahan halal bersertifikat resmi.`,
          servingType: "KEMASAN",
          shelfLife: "6 Bulan",
          productionProcessDescription: "Penerimaan bahan baku halal, penimbangan, pencampuran, pengolahan higienis, pengemasan primer, dan penyimpanan pada ruang bersih.",
          isActive: true,
        })
        .onConflictDoNothing()
        .returning();

      // 3.6 Create BOM (Product Materials)
      if (prod && mat1) {
        await db
          .insert(productMaterials)
          .values({
            productId: prod.id,
            materialId: mat1.id,
            usageDescription: "Bahan Utama Pembuatan",
          })
          .onConflictDoNothing();
      }
      if (prod && mat2) {
        await db
          .insert(productMaterials)
          .values({
            productId: prod.id,
            materialId: mat2.id,
            usageDescription: "Bahan Tambahan Rasa",
          })
          .onConflictDoNothing();
      }

      // 3.7 Determine Status & Scheme
      const schemeType = sample.scale === "MIKRO" ? "SELF_DECLARE" : "REGULER";
      let status: any = "SUBMITTED";

      if (i < 15) {
        status = "CERTIFICATE_ISSUED";
      } else if (i < 23) {
        status = "FINAL_REVIEW";
      } else if (i < 33) {
        status = "INSPECTION";
      } else if (i < 40) {
        status = "DOCUMENT_VERIFICATION";
      } else if (i < 45) {
        status = "NEED_CORRECTION";
      } else {
        status = "SUBMITTED";
      }

      // 3.8 Create Application
      const [appInserted] = await db
        .insert(applications)
        .values({
          businessId: business.id,
          applicationNumber: appNumber,
          schemeType,
          status,
          submissionDate: new Date(Date.now() - (50 - i) * 86400000),
          completionDate: status === "CERTIFICATE_ISSUED" ? new Date() : null,
          notes: `Pengajuan sertifikasi halal resmi produk ${sample.brand}.`,
          createdById: user.id,
        })
        .onConflictDoNothing()
        .returning();

      const app =
        appInserted ||
        (await db.query.applications.findFirst({
          where: (f, { eq }) => eq(f.applicationNumber, appNumber),
        }));

      if (!app) continue;

      // 3.9 Link Product to Application
      if (prod) {
        await db
          .insert(applicationProducts)
          .values({
            applicationId: app.id,
            productId: prod.id,
          })
          .onConflictDoNothing();
      }

      // 3.10 Create Status History
      await db.insert(applicationStatusHistories).values({
        applicationId: app.id,
        previousStatus: null,
        newStatus: "DRAFT",
        changedById: user.id,
        notes: "Membuat draft pengajuan mandiri.",
      });

      await db.insert(applicationStatusHistories).values({
        applicationId: app.id,
        previousStatus: "DRAFT",
        newStatus: "SUBMITTED",
        changedById: user.id,
        notes: "Pelaku usaha mengirimkan pengajuan ke sistem.",
      });

      // 3.11 Create Assignments for In-Progress & Completed apps
      if (status === "INSPECTION" || status === "FINAL_REVIEW" || status === "CERTIFICATE_ISSUED") {
        if (schemeType === "SELF_DECLARE" && createdMentors.length > 0) {
          const mentor = createdMentors[i % createdMentors.length];
          await db
            .insert(mentorAssignments)
            .values({
              applicationId: app.id,
              mentorId: mentor.id,
              assignedById: adminUser.id,
              status: status === "CERTIFICATE_ISSUED" ? "COMPLETED" : "IN_PROGRESS",
              notes: "Penugasan pendampingan verifikasi lapangan PPH.",
            })
            .onConflictDoNothing();
        } else if (createdAuditors.length > 0) {
          const auditor = createdAuditors[i % createdAuditors.length];
          await db
            .insert(auditorAssignments)
            .values({
              applicationId: app.id,
              auditorId: auditor.id,
              assignedById: adminUser.id,
              isLeadAuditor: true,
              status: status === "CERTIFICATE_ISSUED" ? "COMPLETED" : "IN_PROGRESS",
              notes: "Penugasan audit kesesuaian SJPH dan pemeriksaan bahan.",
            })
            .onConflictDoNothing();

          await db
            .insert(inspectionSchedules)
            .values({
              applicationId: app.id,
              scheduledDate: new Date(),
              locationAddress: `Fasilitas Produksi ${sample.name}, Jakarta`,
              contactPerson: fullName,
              contactPhone: phoneNumber,
              status: status === "CERTIFICATE_ISSUED" ? "COMPLETED" : "SCHEDULED",
            })
            .onConflictDoNothing();
        }
      }

      // 3.12 Create Certificates for CERTIFICATE_ISSUED applications (15 certificates)
      if (status === "CERTIFICATE_ISSUED") {
        const certNumber = `ID3111000${String(i + 1).padStart(4, "0")}0126`;
        const decisionNumber = `KEP-FATWA-2026-${String(i + 1).padStart(5, "0")}`;
        const digitalHash = crypto
          .createHash("sha256")
          .update(`${certNumber}-${sample.name}-${nib}`)
          .digest("hex");

        const [certInserted] = await db
          .insert(certificates)
          .values({
            applicationId: app.id,
            certificateNumber: certNumber,
            businessName: sample.name,
            brandName: sample.brand,
            businessAddress: `Jl. Industri Halal Sejahtera No. ${i + 1}, Jakarta Timur`,
            nib,
            schemeType,
            status: "ACTIVE",
            issueDate: new Date(Date.now() - (15 - i) * 86400000),
            decisionNumber,
            signedByLeaderId: leaderUser.id,
            qrCodeUrl: `https://sip-halal.go.id/verify/${certNumber}`,
            pdfFileKey: `certificates/2026/${certNumber}.pdf`,
            digitalSignatureHash: digitalHash,
          })
          .onConflictDoNothing()
          .returning();

        const cert =
          certInserted ||
          (await db.query.certificates.findFirst({
            where: (f, { eq }) => eq(f.certificateNumber, certNumber),
          }));

        if (cert && prod) {
          await db
            .insert(certificateProducts)
            .values({
              certificateId: cert.id,
              productName: sample.prod,
              brandName: sample.brand,
              categoryName: sample.cat,
              servingType: "KEMASAN",
            })
            .onConflictDoNothing();
        }
      }
    }

    console.log("✓ Berhasil membuat 50 Pelaku Usaha lengkap dengan Bahan, Produk, dan 15 Sertifikat Halal Aktif!");
    console.log("🎉 Seeding bulk sampel data selesai dengan sukses 100%!");
  } catch (error) {
    console.error("❌ Error saat seeding bulk sample data:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
