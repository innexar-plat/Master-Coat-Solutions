-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."LeadLocale" AS ENUM ('en', 'pt', 'es');

-- CreateEnum
CREATE TYPE "public"."LeadSource" AS ENUM ('free_estimate', 'contact', 'landing_page');

-- CreateTable
CREATE TABLE "public"."leads" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(254),
    "service" VARCHAR(120) NOT NULL,
    "message" TEXT,
    "locale" "public"."LeadLocale" NOT NULL DEFAULT 'en',
    "source" "public"."LeadSource" NOT NULL DEFAULT 'free_estimate',
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_leads_created_at" ON "public"."leads"("created_at");

-- CreateIndex
CREATE INDEX "idx_leads_status" ON "public"."leads"("status");
