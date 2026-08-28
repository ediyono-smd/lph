import { pgTable, uuid, text, timestamp, boolean, pgEnum, index, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { businesses } from "./business.schema";
import { products } from "./product-material.schema";
import { users } from "./auth.schema";

export const applicationSchemeEnum = pgEnum("application_scheme_enum", [
  "SELF_DECLARE",
  "REGULER",
]);

export const applicationStatusEnum = pgEnum("application_status_enum", [
  "DRAFT",
  "SUBMITTED",
  "DOCUMENT_VERIFICATION",
  "NEED_CORRECTION",
  "AUDITOR_ASSIGNED",
  "MENTOR_ASSIGNED",
  "INSPECTION",
  "FINAL_REVIEW",
  "APPROVED",
  "REJECTED",
  "CERTIFICATE_ISSUED",
]);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "restrict" }).notNull(),
  applicationNumber: text("application_number").notNull().unique(), // e.g. "APP-2026-000001"
  schemeType: applicationSchemeEnum("scheme_type").default("SELF_DECLARE").notNull(),
  status: applicationStatusEnum("status").default("DRAFT").notNull(),
  submissionDate: timestamp("submission_date", { withTimezone: true }),
  completionDate: timestamp("completion_date", { withTimezone: true }),
  notes: text("notes"), // Catatan umum pengajuan
  rejectionReason: text("rejection_reason"),
  createdById: uuid("created_by_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  appNumberIdx: uniqueIndex("applications_number_idx").on(table.applicationNumber),
  businessIdIdx: index("applications_business_id_idx").on(table.businessId),
  statusIdx: index("applications_status_idx").on(table.status),
  createdByIdIdx: index("applications_created_by_id_idx").on(table.createdById),
}));

export const applicationProducts = pgTable("application_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  appProductIdx: uniqueIndex("application_product_unique_idx").on(table.applicationId, table.productId),
  applicationIdIdx: index("app_products_application_id_idx").on(table.applicationId),
  productIdIdx: index("app_products_product_id_idx").on(table.productId),
}));

export const applicationDocuments = pgTable("application_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  documentType: text("document_type").notNull(), // SJPH_MANUAL, APPLICATION_LETTER, HALAL_TRAINING_PROOF
  fileName: text("file_name").notNull(),
  fileKey: text("file_key").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  verificationStatus: text("verification_status").default("PENDING").notNull(), // PENDING, VALID, NEED_CORRECTION
  notes: text("notes"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  applicationIdIdx: index("app_documents_application_id_idx").on(table.applicationId),
}));

export const applicationStatusHistories = pgTable("application_status_histories", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  previousStatus: applicationStatusEnum("previous_status"),
  newStatus: applicationStatusEnum("new_status").notNull(),
  changedById: uuid("changed_by_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  applicationIdIdx: index("app_histories_application_id_idx").on(table.applicationId),
  changedByIdIdx: index("app_histories_changed_by_id_idx").on(table.changedById),
}));

export const applicationChecklists = pgTable("application_checklists", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  itemKey: text("item_key").notNull(), // NIB_VALID, KTP_MATCH, PRODUCT_BOM_COMPLETE, SJPH_MANUAL_VALID
  itemName: text("item_name").notNull(),
  isValid: boolean("is_valid").default(false).notNull(),
  notes: text("notes"),
  verifiedById: uuid("verified_by_id").references(() => users.id, { onDelete: "restrict" }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
}, (table) => ({
  appChecklistIdx: index("app_checklists_application_id_idx").on(table.applicationId),
}));

// Relations
export const applicationsRelations = relations(applications, ({ one, many }) => ({
  business: one(businesses, { fields: [applications.businessId], references: [businesses.id] }),
  createdBy: one(users, { fields: [applications.createdById], references: [users.id] }),
  products: many(applicationProducts),
  documents: many(applicationDocuments),
  statusHistories: many(applicationStatusHistories),
  checklists: many(applicationChecklists),
}));

export const applicationProductsRelations = relations(applicationProducts, ({ one }) => ({
  application: one(applications, { fields: [applicationProducts.applicationId], references: [applications.id] }),
  product: one(products, { fields: [applicationProducts.productId], references: [products.id] }),
}));

export const applicationDocumentsRelations = relations(applicationDocuments, ({ one }) => ({
  application: one(applications, { fields: [applicationDocuments.applicationId], references: [applications.id] }),
}));

export const applicationStatusHistoriesRelations = relations(applicationStatusHistories, ({ one }) => ({
  application: one(applications, { fields: [applicationStatusHistories.applicationId], references: [applications.id] }),
  changedBy: one(users, { fields: [applicationStatusHistories.changedById], references: [users.id] }),
}));

export const applicationChecklistsRelations = relations(applicationChecklists, ({ one }) => ({
  application: one(applications, { fields: [applicationChecklists.applicationId], references: [applications.id] }),
  verifiedBy: one(users, { fields: [applicationChecklists.verifiedById], references: [users.id] }),
}));
