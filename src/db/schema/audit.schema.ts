import { pgTable, uuid, text, timestamp, boolean, pgEnum, index, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { applications } from "./application.schema";

export const assignmentStatusEnum = pgEnum("assignment_status_enum", [
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
]);

export const inspectionRecommendationEnum = pgEnum("inspection_recommendation_enum", [
  "LAYAK",
  "PERLU_PERBAIKAN",
  "TIDAK_LAYAK",
]);

export const mentors = pgTable("mentors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  registrationNumber: text("registration_number").notNull().unique(), // Nomor Registrasi Pendamping Halal
  institutionName: text("institution_name").notNull(), // LP3H / Lembaga Pendamping
  skNumber: text("sk_number"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("mentors_user_id_idx").on(table.userId),
  regNumIdx: uniqueIndex("mentors_reg_num_idx").on(table.registrationNumber),
}));

export const mentorAssignments = pgTable("mentor_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  mentorId: uuid("mentor_id").references(() => mentors.id, { onDelete: "restrict" }).notNull(),
  assignedById: uuid("assigned_by_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  status: assignmentStatusEnum("status").default("ASSIGNED").notNull(),
  notes: text("notes"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => ({
  appMentorIdx: uniqueIndex("mentor_assignment_app_unique_idx").on(table.applicationId, table.mentorId),
  applicationIdIdx: index("mentor_assignments_application_id_idx").on(table.applicationId),
  mentorIdIdx: index("mentor_assignments_mentor_id_idx").on(table.mentorId),
}));

export const auditors = pgTable("auditors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  auditorRegNumber: text("auditor_reg_number").notNull().unique(), // Nomor Registrasi Auditor Halal
  lphName: text("lph_name").notNull(), // Lembaga Pemeriksa Halal (LPH)
  competencyField: text("competency_field"), // Bidang Pangan/Kimia/dll.
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("auditors_user_id_idx").on(table.userId),
  regNumIdx: uniqueIndex("auditors_reg_num_idx").on(table.auditorRegNumber),
}));

export const auditorAssignments = pgTable("auditor_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  auditorId: uuid("auditor_id").references(() => auditors.id, { onDelete: "restrict" }).notNull(),
  assignedById: uuid("assigned_by_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  isLeadAuditor: boolean("is_lead_auditor").default(true).notNull(),
  status: assignmentStatusEnum("status").default("ASSIGNED").notNull(),
  notes: text("notes"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => ({
  appAuditorIdx: uniqueIndex("auditor_assignment_app_unique_idx").on(table.applicationId, table.auditorId),
  applicationIdIdx: index("auditor_assignments_application_id_idx").on(table.applicationId),
  auditorIdIdx: index("auditor_assignments_auditor_id_idx").on(table.auditorId),
}));

export const inspectionSchedules = pgTable("inspection_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
  locationAddress: text("location_address").notNull(),
  contactPerson: text("contact_person").notNull(),
  contactPhone: text("contact_phone").notNull(),
  status: text("status").default("SCHEDULED").notNull(), // SCHEDULED, IN_PROGRESS, COMPLETED, RESCHEDULED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  applicationIdIdx: index("inspection_schedules_application_id_idx").on(table.applicationId),
}));

export const inspectionResults = pgTable("inspection_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull().unique(),
  evaluatorUserId: uuid("evaluator_user_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  recommendation: inspectionRecommendationEnum("recommendation").notNull(),
  summaryNotes: text("summary_notes").notNull(),
  sjphScore: integer("sjph_score"), // Nilai Pemenuhan Kriteria SJPH (0-100)
  reportFileKey: text("report_file_key"), // LHP PDF file
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  applicationIdIdx: uniqueIndex("inspection_results_app_idx").on(table.applicationId),
}));

export const inspectionFindings = pgTable("inspection_findings", {
  id: uuid("id").defaultRandom().primaryKey(),
  inspectionResultId: uuid("inspection_result_id").references(() => inspectionResults.id, { onDelete: "cascade" }).notNull(),
  findingType: text("finding_type").default("MINOR").notNull(), // MINOR, MAYOR, KRITIS
  clauseReference: text("clause_reference"), // Referensi Klausul Kriteria SJPH
  description: text("description").notNull(),
  correctiveActionRequired: text("corrective_action_required").notNull(),
  photoKey: text("photo_key"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  isResolved: boolean("is_resolved").default(false).notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  resultIdIdx: index("inspection_findings_result_id_idx").on(table.inspectionResultId),
}));

// Relations
export const mentorsRelations = relations(mentors, ({ one, many }) => ({
  user: one(users, { fields: [mentors.userId], references: [users.id] }),
  assignments: many(mentorAssignments),
}));

export const mentorAssignmentsRelations = relations(mentorAssignments, ({ one }) => ({
  application: one(applications, { fields: [mentorAssignments.applicationId], references: [applications.id] }),
  mentor: one(mentors, { fields: [mentorAssignments.mentorId], references: [mentors.id] }),
  assignedBy: one(users, { fields: [mentorAssignments.assignedById], references: [users.id] }),
}));

export const auditorsRelations = relations(auditors, ({ one, many }) => ({
  user: one(users, { fields: [auditors.userId], references: [users.id] }),
  assignments: many(auditorAssignments),
}));

export const auditorAssignmentsRelations = relations(auditorAssignments, ({ one }) => ({
  application: one(applications, { fields: [auditorAssignments.applicationId], references: [applications.id] }),
  auditor: one(auditors, { fields: [auditorAssignments.auditorId], references: [auditors.id] }),
  assignedBy: one(users, { fields: [auditorAssignments.assignedById], references: [users.id] }),
}));

export const inspectionResultsRelations = relations(inspectionResults, ({ one, many }) => ({
  application: one(applications, { fields: [inspectionResults.applicationId], references: [applications.id] }),
  evaluator: one(users, { fields: [inspectionResults.evaluatorUserId], references: [users.id] }),
  findings: many(inspectionFindings),
}));

export const inspectionFindingsRelations = relations(inspectionFindings, ({ one }) => ({
  inspectionResult: one(inspectionResults, { fields: [inspectionFindings.inspectionResultId], references: [inspectionResults.id] }),
}));
