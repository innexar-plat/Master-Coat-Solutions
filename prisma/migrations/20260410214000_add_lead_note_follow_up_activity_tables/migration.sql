CREATE TABLE "lead_notes" (
  "id" UUID NOT NULL,
  "lead_id" UUID NOT NULL,
  "note" VARCHAR(1200) NOT NULL,
  "created_by" VARCHAR(254) NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lead_follow_ups" (
  "lead_id" UUID NOT NULL,
  "follow_up_at" TIMESTAMPTZ(6),
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "lead_follow_ups_pkey" PRIMARY KEY ("lead_id")
);

CREATE TABLE "lead_activities" (
  "id" UUID NOT NULL,
  "lead_id" UUID NOT NULL,
  "type" VARCHAR(40) NOT NULL,
  "description" VARCHAR(300) NOT NULL,
  "created_by" VARCHAR(254) NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_lead_notes_lead_id_created_at" ON "lead_notes"("lead_id", "created_at" DESC);
CREATE INDEX "idx_lead_follow_ups_follow_up_at" ON "lead_follow_ups"("follow_up_at");
CREATE INDEX "idx_lead_activities_lead_id_created_at" ON "lead_activities"("lead_id", "created_at" DESC);

ALTER TABLE "lead_notes"
ADD CONSTRAINT "fk_lead_notes_lead_id"
FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lead_follow_ups"
ADD CONSTRAINT "fk_lead_follow_ups_lead_id"
FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lead_activities"
ADD CONSTRAINT "fk_lead_activities_lead_id"
FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
