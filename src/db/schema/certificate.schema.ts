import { pgTable, uuid, text, timestamp, boolean, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { applications } from "./application.schema";
import { users } from "./auth.schema";

export const certificateStatusEnum = pgEnum("certificate_status_enum", [
  "ACTIVE",
  "SUSPENDED",
  "REVOKED",
  "EXPIRED",
]);

export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "restrict" }).notNull().unique(),
  certificateNumber: text("certificate_number").notNull().unique(), // e.g. "HALAL-2026-000001"
  businessName: text("business_name").notNull(),
  brandName: text("brand_name").notNull(),
  businessAddress: text("business_address").notNull(),
  nib: text("nib").notNull(),
  schemeType: text("scheme_type").notNull(),
  status: certificateStatusEnum("status").default("ACTIVE").notNull(),
  issueDate: timestamp("issue_date", { withTimezone: true }).defaultNow().notNull(),
  validUntil: timestamp("valid_until", { withTimezone: true }), // Null = Selama tidak berubah komposisi & proses (UU JPH)
  decisionNumber: text("decision_number").notNull(), // Nomor Keputusan Penetapan Halal
  signedByLeaderId: uuid("signed_by_leader_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  qrCodeUrl: text("qr_code_url").notNull(),
  pdfFileKey: text("pdf_file_key").notNull(), // Key to Object Storage
  digitalSignatureHash: text("digital_signature_hash").notNull(), // SHA256 checksum
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  certNumIdx: uniqueIndex("certificates_number_idx").on(table.certificateNumber),
  appIdIdx: uniqueIndex("certificates_application_id_idx").on(table.applicationId),
  statusIdx: index("certificates_status_idx").on(table.status),
  nibIdx: index("certificates_nib_idx").on(table.nib),
}));

export const certificateProducts = pgTable("certificate_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificateId: uuid("certificate_id").references(() => certificates.id, { onDelete: "cascade" }).notNull(),
  productName: text("product_name").notNull(),
  brandName: text("brand_name").notNull(),
  categoryName: text("category_name").notNull(),
  servingType: text("serving_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  certIdIdx: index("certificate_products_cert_id_idx").on(table.certificateId),
}));

// Relations
export const certificatesRelations = relations(certificates, ({ one, many }) => ({
  application: one(applications, { fields: [certificates.applicationId], references: [applications.id] }),
  signedBy: one(users, { fields: [certificates.signedByLeaderId], references: [users.id] }),
  products: many(certificateProducts),
}));

export const certificateProductsRelations = relations(certificateProducts, ({ one }) => ({
  certificate: one(certificates, { fields: [certificateProducts.certificateId], references: [certificates.id] }),
}));
