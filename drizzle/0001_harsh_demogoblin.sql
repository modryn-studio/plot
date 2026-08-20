CREATE TABLE "build_gate" (
	"project_id" uuid NOT NULL,
	"step_key" text NOT NULL,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "build_gate_project_id_step_key_pk" PRIMARY KEY("project_id","step_key")
);
--> statement-breakpoint
CREATE TABLE "generation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"asset_name" text,
	"prompt" text NOT NULL,
	"params" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"kind" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"look" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"drawing" jsonb DEFAULT '{"shapes":[]}'::jsonb NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"address" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"derived" jsonb NOT NULL,
	"confirmed" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"existing" jsonb DEFAULT '{"shapes":[]}'::jsonb NOT NULL,
	"captured_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "property_asset" (
	"property_id" uuid NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"bytes" "bytea" NOT NULL,
	"content_type" text NOT NULL,
	"etag" text NOT NULL,
	"captured_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_asset_property_id_name_pk" PRIMARY KEY("property_id","name")
);
--> statement-breakpoint
ALTER TABLE "build_gate" ADD CONSTRAINT "build_gate_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_asset" ADD CONSTRAINT "property_asset_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "generation_project_idx" ON "generation" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "project_property_slug_idx" ON "project" USING btree ("property_id","slug");--> statement-breakpoint
CREATE INDEX "project_property_status_idx" ON "project" USING btree ("property_id","status");--> statement-breakpoint
CREATE INDEX "property_asset_kind_idx" ON "property_asset" USING btree ("property_id","kind");