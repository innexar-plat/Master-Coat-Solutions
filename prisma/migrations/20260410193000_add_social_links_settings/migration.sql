-- CreateTable
CREATE TABLE "public"."social_links_settings" (
    "id" VARCHAR(32) NOT NULL DEFAULT 'default',
    "facebook_url" VARCHAR(200) NOT NULL DEFAULT '',
    "instagram_url" VARCHAR(200) NOT NULL DEFAULT '',
    "linkedin_url" VARCHAR(200) NOT NULL DEFAULT '',
    "youtube_url" VARCHAR(200) NOT NULL DEFAULT '',
    "tiktok_url" VARCHAR(200) NOT NULL DEFAULT '',
    "x_url" VARCHAR(200) NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_links_settings_pkey" PRIMARY KEY ("id")
);
