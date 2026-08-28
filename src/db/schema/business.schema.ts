import { pgTable, uuid, text, timestamp, boolean, pgEnum, index, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { villages } from "./master.schema";

export const businessScaleEnum = pgEnum("business_scale_enum", [
  "MIKRO",
  "KECIL",
  "MENENGAH",
  "BESAR",
]);

export const businessTypeEnum = pgEnum("business_type_enum", [
  "PERSEORANGAN",
  "PT",
  "CV",
  "KOPERASI",
  "FIRMA",
  "YAYASAN",
  "LAINNYA",
]);

export const addressTypeEnum = pgEnum("address_type_enum", [
  "HEADQUARTERS",
  "FACTORY",
  "OUTLET",
]);

export const documentVerificationStatusEnum = pgEnum("doc_verification_status_enum", [
  "PENDING",
  "VALID",
  "NEED_CORRECTION",
  "REJECTED",
]);

export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  name: text("name").notNull(),
  brandName: text("brand_name").notNull(),
  businessType: businessTypeEnum("business_type").notNull(),
  businessScale: businessScaleEnum("business_scale").notNull(),
  nib: text("nib").notNull().unique(), // 13 digit NIB
  npwp: text("npwp"),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  website: text("website"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  userIdIdx: index("businesses_user_id_idx").on(table.userId),
  nibIdx: uniqueIndex("businesses_nib_idx").on(table.nib),
  nameIdx: index("businesses_name_idx").on(table.name),
}));

export const businessAddresses = pgTable("business_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  addressType: addressTypeEnum("address_type").default("HEADQUARTERS").notNull(),
  addressLine: text("address_line").notNull(),
  villageId: text("village_id").references(() => villages.id, { onDelete: "restrict" }).notNull(),
  postalCode: text("postal_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isPrimary: boolean("is_primary").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  businessIdIdx: index("business_addresses_business_id_idx").on(table.businessId),
  villageIdIdx: index("business_addresses_village_id_idx").on(table.villageId),
}));

export const businessDocuments = pgTable("business_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  documentType: text("document_type").notNull(), // NIB_FILE, KTP_OWNER, FACILITY_PHOTO, HALAL_COMMITMENT
  fileName: text("file_name").notNull(),
  fileKey: text("file_key").notNull(), // Object Storage Key
  fileSize: integer("file_size").notNull(), // in bytes
  mimeType: text("mime_type").notNull(),
  verificationStatus: documentVerificationStatusEnum("verification_status").default("PENDING").notNull(),
  notes: text("notes"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  businessIdIdx: index("business_documents_business_id_idx").on(table.businessId),
}));

export const businessSupervisors = pgTable("business_supervisors", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  idCardNumber: text("id_card_number").notNull(), // NIK
  phoneNumber: text("phone_number").notNull(),
  religion: text("religion").default("ISLAM").notNull(),
  skNumber: text("sk_number").notNull(), // SK Penetapan Penyelia Halal
  certificateNumber: text("certificate_number"), // Sertifikat Pelatihan
  certificateFileKey: text("certificate_file_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  businessIdIdx: index("business_supervisors_business_id_idx").on(table.businessId),
}));

// Relations
export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, { fields: [businesses.userId], references: [users.id] }),
  addresses: many(businessAddresses),
  documents: many(businessDocuments),
  supervisors: many(businessSupervisors),
}));

export const businessAddressesRelations = relations(businessAddresses, ({ one }) => ({
  business: one(businesses, { fields: [businessAddresses.businessId], references: [businesses.id] }),
  village: one(villages, { fields: [businessAddresses.villageId], references: [villages.id] }),
}));

export const businessDocumentsRelations = relations(businessDocuments, ({ one }) => ({
  business: one(businesses, { fields: [businessDocuments.businessId], references: [businesses.id] }),
}));

export const businessSupervisorsRelations = relations(businessSupervisors, ({ one }) => ({
  business: one(businesses, { fields: [businessSupervisors.businessId], references: [businesses.id] }),
}));
