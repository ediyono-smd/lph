import { pgTable, uuid, text, timestamp, boolean, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role_enum", [
  "SUPER_ADMIN",
  "ADMIN",
  "VERIFIER",
  "MENTOR",
  "AUDITOR",
  "LEADER",
  "BUSINESS_OWNER",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
  phoneIdx: index("users_phone_idx").on(table.phoneNumber),
}));

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: roleEnum("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // e.g. "application:verify", "product:create"
  module: text("module").notNull(), // e.g. "APPLICATION", "PRODUCT"
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  rolePermissionIdx: uniqueIndex("role_permission_unique_idx").on(table.roleId, table.permissionId),
}));

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userRoleIdx: uniqueIndex("user_role_unique_idx").on(table.userId, table.roleId),
  userIdIdx: index("user_roles_user_id_idx").on(table.userId),
}));

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sessionTokenIdx: uniqueIndex("user_sessions_token_idx").on(table.token),
  userIdIdx: index("user_sessions_user_id_idx").on(table.userId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  sessions: many(userSessions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));
