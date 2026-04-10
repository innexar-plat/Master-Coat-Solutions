-- CreateTable
CREATE TABLE "public"."pixel_settings" (
    "id" VARCHAR(50) NOT NULL DEFAULT 'default',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "ga4_measurement_id" VARCHAR(80) NOT NULL DEFAULT '',
    "gtm_id" VARCHAR(80) NOT NULL DEFAULT '',
    "meta_pixel_id" VARCHAR(80) NOT NULL DEFAULT '',
    "google_ads_id" VARCHAR(80) NOT NULL DEFAULT '',
    "tiktok_pixel_id" VARCHAR(80) NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pixel_settings_pkey" PRIMARY KEY ("id")
);
