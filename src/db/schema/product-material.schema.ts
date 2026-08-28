import { pgTable, uuid, text, timestamp, boolean, integer, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { businesses } from "./business.schema";
import { productCategories, productTypes, materialCategories } from "./master.schema";

export const materials = pgTable("materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => materialCategories.id, { onDelete: "restrict" }).notNull(),
  name: text("name").notNull(),
  tradeName: text("trade_name"),
  manufacturer: text("manufacturer").notNull(),
  supplier: text("supplier"),
  isHalalCertified: boolean("is_halal_certified").default(true).notNull(),
  halalCertNumber: text("halal_cert_number"),
  certIssuer: text("cert_issuer"), // MUI, BPJPH, LPPOM, etc.
  certValidUntil: timestamp("cert_valid_until", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  businessIdIdx: index("materials_business_id_idx").on(table.businessId),
  categoryIdIdx: index("materials_category_id_idx").on(table.categoryId),
  nameIdx: index("materials_name_idx").on(table.name),
}));

export const materialDocuments = pgTable("material_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  materialId: uuid("material_id").references(() => materials.id, { onDelete: "cascade" }).notNull(),
  documentType: text("document_type").default("HALAL_CERTIFICATE").notNull(),
  fileName: text("file_name").notNull(),
  fileKey: text("file_key").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  materialIdIdx: index("material_documents_material_id_idx").on(table.materialId),
}));

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => productCategories.id, { onDelete: "restrict" }).notNull(),
  productTypeId: uuid("product_type_id").references(() => productTypes.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  brandName: text("brand_name").notNull(),
  description: text("description"),
  photoKey: text("photo_key"),
  servingType: text("serving_type"), // DINGIN, PANAS, KEMASAN, SIAP SAJI
  shelfLife: text("shelf_life"), // e.g. "6 Bulan"
  productionProcessDescription: text("production_process_description"), // Narasi alur pembuatan
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  businessIdIdx: index("products_business_id_idx").on(table.businessId),
  categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
  nameIdx: index("products_name_idx").on(table.name),
}));

export const productMaterials = pgTable("product_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  materialId: uuid("material_id").references(() => materials.id, { onDelete: "restrict" }).notNull(),
  usageDescription: text("usage_description"), // e.g. "Bahan Utama", "Topping", "Pengemulsi"
  isAlternativeMaterial: boolean("is_alternative_material").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  productMaterialIdx: uniqueIndex("product_material_unique_idx").on(table.productId, table.materialId),
  productIdIdx: index("product_materials_product_id_idx").on(table.productId),
  materialIdIdx: index("product_materials_material_id_idx").on(table.materialId),
}));

export const productDocuments = pgTable("product_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  documentType: text("document_type").notNull(), // PACKAGING_PHOTO, FLOWCHART_PRODUCTION, LAB_REPORT
  fileName: text("file_name").notNull(),
  fileKey: text("file_key").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index("product_documents_product_id_idx").on(table.productId),
}));

// Relations
export const materialsRelations = relations(materials, ({ one, many }) => ({
  business: one(businesses, { fields: [materials.businessId], references: [businesses.id] }),
  category: one(materialCategories, { fields: [materials.categoryId], references: [materialCategories.id] }),
  documents: many(materialDocuments),
  productMaterials: many(productMaterials),
}));

export const materialDocumentsRelations = relations(materialDocuments, ({ one }) => ({
  material: one(materials, { fields: [materialDocuments.materialId], references: [materials.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  business: one(businesses, { fields: [products.businessId], references: [businesses.id] }),
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
  productType: one(productTypes, { fields: [products.productTypeId], references: [productTypes.id] }),
  documents: many(productDocuments),
  productMaterials: many(productMaterials),
}));

export const productMaterialsRelations = relations(productMaterials, ({ one }) => ({
  product: one(products, { fields: [productMaterials.productId], references: [products.id] }),
  material: one(materials, { fields: [productMaterials.materialId], references: [materials.id] }),
}));

export const productDocumentsRelations = relations(productDocuments, ({ one }) => ({
  product: one(products, { fields: [productDocuments.productId], references: [products.id] }),
}));
