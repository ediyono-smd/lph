DO $$ BEGIN
 CREATE TYPE "public"."role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'VERIFIER', 'MENTOR', 'AUDITOR', 'LEADER', 'BUSINESS_OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."address_type_enum" AS ENUM('HEADQUARTERS', 'FACTORY', 'OUTLET');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."business_scale_enum" AS ENUM('MIKRO', 'KECIL', 'MENENGAH', 'BESAR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."business_type_enum" AS ENUM('PERSEORANGAN', 'PT', 'CV', 'KOPERASI', 'FIRMA', 'YAYASAN', 'LAINNYA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."doc_verification_status_enum" AS ENUM('PENDING', 'VALID', 'NEED_CORRECTION', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."application_scheme_enum" AS ENUM('SELF_DECLARE', 'REGULER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."application_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'DOCUMENT_VERIFICATION', 'NEED_CORRECTION', 'AUDITOR_ASSIGNED', 'MENTOR_ASSIGNED', 'INSPECTION', 'FINAL_REVIEW', 'APPROVED', 'REJECTED', 'CERTIFICATE_ISSUED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."assignment_status_enum" AS ENUM('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."inspection_recommendation_enum" AS ENUM('LAYAK', 'PERLU_PERBAIKAN', 'TIDAK_LAYAK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."certificate_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"module" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "role_enum" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"phone_number" text,
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cities" (
	"id" text PRIMARY KEY NOT NULL,
	"province_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "districts" (
	"id" text PRIMARY KEY NOT NULL,
	"city_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "material_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_critical" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "material_categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provinces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "villages" (
	"id" text PRIMARY KEY NOT NULL,
	"district_id" text NOT NULL,
	"name" text NOT NULL,
	"postal_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"address_type" "address_type_enum" DEFAULT 'HEADQUARTERS' NOT NULL,
	"address_line" text NOT NULL,
	"village_id" text NOT NULL,
	"postal_code" text,
	"latitude" text,
	"longitude" text,
	"is_primary" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_key" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"verification_status" "doc_verification_status_enum" DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_supervisors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"id_card_number" text NOT NULL,
	"phone_number" text NOT NULL,
	"religion" text DEFAULT 'ISLAM' NOT NULL,
	"sk_number" text NOT NULL,
	"certificate_number" text,
	"certificate_file_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"brand_name" text NOT NULL,
	"business_type" "business_type_enum" NOT NULL,
	"business_scale" "business_scale_enum" NOT NULL,
	"nib" text NOT NULL,
	"npwp" text,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"website" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "businesses_nib_unique" UNIQUE("nib")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "material_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_id" uuid NOT NULL,
	"document_type" text DEFAULT 'HALAL_CERTIFICATE' NOT NULL,
	"file_name" text NOT NULL,
	"file_key" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"trade_name" text,
	"manufacturer" text NOT NULL,
	"supplier" text,
	"is_halal_certified" boolean DEFAULT true NOT NULL,
	"halal_cert_number" text,
	"cert_issuer" text,
	"cert_valid_until" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_key" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"material_id" uuid NOT NULL,
	"usage_description" text,
	"is_alternative_material" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"product_type_id" uuid,
	"name" text NOT NULL,
	"brand_name" text NOT NULL,
	"description" text,
	"photo_key" text,
	"serving_type" text,
	"shelf_life" text,
	"production_process_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_checklists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"item_key" text NOT NULL,
	"item_name" text NOT NULL,
	"is_valid" boolean DEFAULT false NOT NULL,
	"notes" text,
	"verified_by_id" uuid,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_key" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"verification_status" text DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_status_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"previous_status" "application_status_enum",
	"new_status" "application_status_enum" NOT NULL,
	"changed_by_id" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"application_number" text NOT NULL,
	"scheme_type" "application_scheme_enum" DEFAULT 'SELF_DECLARE' NOT NULL,
	"status" "application_status_enum" DEFAULT 'DRAFT' NOT NULL,
	"submission_date" timestamp with time zone,
	"completion_date" timestamp with time zone,
	"notes" text,
	"rejection_reason" text,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "applications_application_number_unique" UNIQUE("application_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auditor_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"auditor_id" uuid NOT NULL,
	"assigned_by_id" uuid NOT NULL,
	"is_lead_auditor" boolean DEFAULT true NOT NULL,
	"status" "assignment_status_enum" DEFAULT 'ASSIGNED' NOT NULL,
	"notes" text,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auditors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"auditor_reg_number" text NOT NULL,
	"lph_name" text NOT NULL,
	"competency_field" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auditors_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "auditors_auditor_reg_number_unique" UNIQUE("auditor_reg_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspection_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inspection_result_id" uuid NOT NULL,
	"finding_type" text DEFAULT 'MINOR' NOT NULL,
	"clause_reference" text,
	"description" text NOT NULL,
	"corrective_action_required" text NOT NULL,
	"photo_key" text,
	"due_date" timestamp with time zone,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspection_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"evaluator_user_id" uuid NOT NULL,
	"recommendation" "inspection_recommendation_enum" NOT NULL,
	"summary_notes" text NOT NULL,
	"sjph_score" integer,
	"report_file_key" text,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inspection_results_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspection_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"scheduled_date" timestamp with time zone NOT NULL,
	"location_address" text NOT NULL,
	"contact_person" text NOT NULL,
	"contact_phone" text NOT NULL,
	"status" text DEFAULT 'SCHEDULED' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"mentor_id" uuid NOT NULL,
	"assigned_by_id" uuid NOT NULL,
	"status" "assignment_status_enum" DEFAULT 'ASSIGNED' NOT NULL,
	"notes" text,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"registration_number" text NOT NULL,
	"institution_name" text NOT NULL,
	"sk_number" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentors_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "mentors_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certificate_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certificate_id" uuid NOT NULL,
	"product_name" text NOT NULL,
	"brand_name" text NOT NULL,
	"category_name" text NOT NULL,
	"serving_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"certificate_number" text NOT NULL,
	"business_name" text NOT NULL,
	"brand_name" text NOT NULL,
	"business_address" text NOT NULL,
	"nib" text NOT NULL,
	"scheme_type" text NOT NULL,
	"status" "certificate_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"issue_date" timestamp with time zone DEFAULT now() NOT NULL,
	"valid_until" timestamp with time zone,
	"decision_number" text NOT NULL,
	"signed_by_leader_id" uuid NOT NULL,
	"qr_code_url" text NOT NULL,
	"pdf_file_key" text NOT NULL,
	"digital_signature_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_application_id_unique" UNIQUE("application_id"),
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"action_url" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cities" ADD CONSTRAINT "cities_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "districts" ADD CONSTRAINT "districts_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_types" ADD CONSTRAINT "product_types_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "villages" ADD CONSTRAINT "villages_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_addresses" ADD CONSTRAINT "business_addresses_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_addresses" ADD CONSTRAINT "business_addresses_village_id_villages_id_fk" FOREIGN KEY ("village_id") REFERENCES "public"."villages"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_supervisors" ADD CONSTRAINT "business_supervisors_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "material_documents" ADD CONSTRAINT "material_documents_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials" ADD CONSTRAINT "materials_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials" ADD CONSTRAINT "materials_category_id_material_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."material_categories"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_checklists" ADD CONSTRAINT "application_checklists_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_checklists" ADD CONSTRAINT "application_checklists_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_products" ADD CONSTRAINT "application_products_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_products" ADD CONSTRAINT "application_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_status_histories" ADD CONSTRAINT "application_status_histories_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_status_histories" ADD CONSTRAINT "application_status_histories_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditor_assignments" ADD CONSTRAINT "auditor_assignments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditor_assignments" ADD CONSTRAINT "auditor_assignments_auditor_id_auditors_id_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."auditors"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditor_assignments" ADD CONSTRAINT "auditor_assignments_assigned_by_id_users_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditors" ADD CONSTRAINT "auditors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_findings" ADD CONSTRAINT "inspection_findings_inspection_result_id_inspection_results_id_fk" FOREIGN KEY ("inspection_result_id") REFERENCES "public"."inspection_results"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_results" ADD CONSTRAINT "inspection_results_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_results" ADD CONSTRAINT "inspection_results_evaluator_user_id_users_id_fk" FOREIGN KEY ("evaluator_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_schedules" ADD CONSTRAINT "inspection_schedules_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_mentor_id_mentors_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentors"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_assigned_by_id_users_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentors" ADD CONSTRAINT "mentors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificate_products" ADD CONSTRAINT "certificate_products_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificates" ADD CONSTRAINT "certificates_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificates" ADD CONSTRAINT "certificates_signed_by_leader_id_users_id_fk" FOREIGN KEY ("signed_by_leader_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "role_permission_unique_idx" ON "role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_role_unique_idx" ON "user_roles" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_roles_user_id_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_sessions_token_idx" ON "user_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_sessions_user_id_idx" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_phone_idx" ON "users" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cities_province_id_idx" ON "cities" USING btree ("province_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "districts_city_id_idx" ON "districts" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_types_category_id_idx" ON "product_types" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "villages_district_id_idx" ON "villages" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "business_addresses_business_id_idx" ON "business_addresses" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "business_addresses_village_id_idx" ON "business_addresses" USING btree ("village_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "business_documents_business_id_idx" ON "business_documents" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "business_supervisors_business_id_idx" ON "business_supervisors" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "businesses_user_id_idx" ON "businesses" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "businesses_nib_idx" ON "businesses" USING btree ("nib");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "businesses_name_idx" ON "businesses" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "material_documents_material_id_idx" ON "material_documents" USING btree ("material_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "materials_business_id_idx" ON "materials" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "materials_category_id_idx" ON "materials" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "materials_name_idx" ON "materials" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_documents_product_id_idx" ON "product_documents" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_material_unique_idx" ON "product_materials" USING btree ("product_id","material_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_materials_product_id_idx" ON "product_materials" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_materials_material_id_idx" ON "product_materials" USING btree ("material_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_business_id_idx" ON "products" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_checklists_application_id_idx" ON "application_checklists" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_documents_application_id_idx" ON "application_documents" USING btree ("application_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "application_product_unique_idx" ON "application_products" USING btree ("application_id","product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_products_application_id_idx" ON "application_products" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_products_product_id_idx" ON "application_products" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_histories_application_id_idx" ON "application_status_histories" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "app_histories_changed_by_id_idx" ON "application_status_histories" USING btree ("changed_by_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "applications_number_idx" ON "applications" USING btree ("application_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "applications_business_id_idx" ON "applications" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "applications_status_idx" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "applications_created_by_id_idx" ON "applications" USING btree ("created_by_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auditor_assignment_app_unique_idx" ON "auditor_assignments" USING btree ("application_id","auditor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auditor_assignments_application_id_idx" ON "auditor_assignments" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auditor_assignments_auditor_id_idx" ON "auditor_assignments" USING btree ("auditor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auditors_user_id_idx" ON "auditors" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auditors_reg_num_idx" ON "auditors" USING btree ("auditor_reg_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inspection_findings_result_id_idx" ON "inspection_findings" USING btree ("inspection_result_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "inspection_results_app_idx" ON "inspection_results" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inspection_schedules_application_id_idx" ON "inspection_schedules" USING btree ("application_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mentor_assignment_app_unique_idx" ON "mentor_assignments" USING btree ("application_id","mentor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mentor_assignments_application_id_idx" ON "mentor_assignments" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mentor_assignments_mentor_id_idx" ON "mentor_assignments" USING btree ("mentor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mentors_user_id_idx" ON "mentors" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mentors_reg_num_idx" ON "mentors" USING btree ("registration_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "certificate_products_cert_id_idx" ON "certificate_products" USING btree ("certificate_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_number_idx" ON "certificates" USING btree ("certificate_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_application_id_idx" ON "certificates" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "certificates_status_idx" ON "certificates" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "certificates_nib_idx" ON "certificates" USING btree ("nib");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_is_read_idx" ON "notifications" USING btree ("is_read");