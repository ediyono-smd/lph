import { pgTable, uuid, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const provinces = pgTable("provinces", {
  id: text("id").primaryKey(), // BPS Code e.g. "31", "32"
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cities = pgTable("cities", {
  id: text("id").primaryKey(), // BPS Code e.g. "3171"
  provinceId: text("province_id").references(() => provinces.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // KOTA / KABUPATEN
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  provinceIdx: index("cities_province_id_idx").on(table.provinceId),
}));

export const districts = pgTable("districts", {
  id: text("id").primaryKey(), // BPS Code e.g. "3171010"
  cityId: text("city_id").references(() => cities.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  cityIdx: index("districts_city_id_idx").on(table.cityId),
}));

export const villages = pgTable("villages", {
  id: text("id").primaryKey(), // BPS Code e.g. "3171010001"
  districtId: text("district_id").references(() => districts.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  postalCode: text("postal_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  districtIdx: index("villages_district_id_idx").on(table.districtId),
}));

export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(), // e.g. "MAKANAN_OLAHAN", "MINUMAN"
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productTypes = pgTable("product_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => productCategories.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("product_types_category_id_idx").on(table.categoryId),
}));

export const materialCategories = pgTable("material_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(), // e.g. "NABATI", "HEWANI", "KIMIA", "MIKROBIAL"
  name: text("name").notNull(),
  description: text("description"),
  isCritical: boolean("is_critical").default(false).notNull(), // Kritis / Non-Kritis
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const provincesRelations = relations(provinces, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  province: one(provinces, { fields: [cities.provinceId], references: [provinces.id] }),
  districts: many(districts),
}));

export const districtsRelations = relations(districts, ({ one, many }) => ({
  city: one(cities, { fields: [districts.cityId], references: [cities.id] }),
  villages: many(villages),
}));

export const villagesRelations = relations(villages, ({ one }) => ({
  district: one(districts, { fields: [villages.districtId], references: [districts.id] }),
}));

export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  productTypes: many(productTypes),
}));

export const productTypesRelations = relations(productTypes, ({ one }) => ({
  category: one(productCategories, { fields: [productTypes.categoryId], references: [productCategories.id] }),
}));
