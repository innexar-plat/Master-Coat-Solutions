-- CreateTable
CREATE TABLE "gallery_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "gallery_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "category_id" UUID NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" UUID NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "service" VARCHAR(120) NOT NULL,
    "location" VARCHAR(120) NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "category_id" UUID NOT NULL,
    "album_id" UUID NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_categories_slug_key" ON "gallery_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_albums_slug_key" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "idx_gallery_albums_category_id" ON "gallery_albums"("category_id");

-- CreateIndex
CREATE INDEX "idx_gallery_items_category_id" ON "gallery_items"("category_id");

-- CreateIndex
CREATE INDEX "idx_gallery_items_album_id" ON "gallery_items"("album_id");

-- CreateIndex
CREATE INDEX "idx_gallery_items_published_created" ON "gallery_items"("is_published", "created_at");

-- AddForeignKey
ALTER TABLE "gallery_albums" ADD CONSTRAINT "gallery_albums_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "gallery_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "gallery_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed: Default categories and albums for Master Coat Solutions
INSERT INTO "gallery_categories" ("id", "name", "slug", "created_at", "updated_at") VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Interior Painting', 'interior-painting', NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000002', 'Exterior Painting', 'exterior-painting', NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000003', 'Trim & Detail', 'trim-detail', NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000004', 'Commercial', 'commercial', NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000005', 'Cabinet Refinishing', 'cabinet-refinishing', NOW(), NOW());

INSERT INTO "gallery_albums" ("id", "name", "slug", "category_id", "is_published", "created_at", "updated_at") VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Living Rooms', 'living-rooms', 'a1000000-0000-0000-0000-000000000001', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000002', 'Bedrooms', 'bedrooms', 'a1000000-0000-0000-0000-000000000001', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000003', 'Kitchens', 'kitchens', 'a1000000-0000-0000-0000-000000000001', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000004', 'House Exterior', 'house-exterior', 'a1000000-0000-0000-0000-000000000002', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000005', 'Fence & Deck', 'fence-deck', 'a1000000-0000-0000-0000-000000000002', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000006', 'Crown Molding', 'crown-molding', 'a1000000-0000-0000-0000-000000000003', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000007', 'Doors & Windows', 'doors-windows', 'a1000000-0000-0000-0000-000000000003', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000008', 'Office & Retail', 'office-retail', 'a1000000-0000-0000-0000-000000000004', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000009', 'Kitchen Cabinets', 'kitchen-cabinets', 'a1000000-0000-0000-0000-000000000005', true, NOW(), NOW()),
  ('b1000000-0000-0000-0000-000000000010', 'Bathroom Vanities', 'bathroom-vanities', 'a1000000-0000-0000-0000-000000000005', true, NOW(), NOW());

-- Seed: Gallery items with placeholder images
INSERT INTO "gallery_items" ("id", "title", "service", "location", "image_url", "category_id", "album_id", "is_published", "created_at", "updated_at") VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Modern Living Room Refresh', 'Interior Painting', 'Orlando, FL', '/images/placeholders/interior-painting.jpg', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000002', 'Cozy Bedroom Makeover', 'Interior Painting', 'Winter Park, FL', '/images/placeholders/Interior Painting.jpg', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000003', 'Kitchen Accent Wall', 'Interior Painting', 'Kissimmee, FL', '/images/placeholders/interior-painting.jpg', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000004', 'Full House Exterior', 'Exterior Painting', 'Lake Nona, FL', '/images/placeholders/exterior-painting.jpeg', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000005', 'Deck & Fence Staining', 'Exterior Painting', 'Dr. Phillips, FL', '/images/placeholders/Exterior Painting.jpeg', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000006', 'Crown Molding Detail Work', 'Trim & Detail', 'Windermere, FL', '/images/placeholders/trim-detail-finishes.jpg', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000006', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000007', 'Front Door Refinish', 'Trim & Detail', 'Celebration, FL', '/images/placeholders/Trim and Detail Finishes.jpg', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000008', 'Retail Store Transformation', 'Commercial Painting', 'Orlando, FL', '/images/placeholders/exterior-painting.jpeg', 'a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000008', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000009', 'White Kitchen Cabinet Repaint', 'Cabinet Refinishing', 'Winter Garden, FL', '/images/placeholders/interior-painting.jpg', 'a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000009', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000010', 'Bathroom Vanity Refresh', 'Cabinet Refinishing', 'Maitland, FL', '/images/placeholders/Interior Painting.jpg', 'a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000010', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000011', 'Open Concept Living Area', 'Interior Painting', 'Altamonte Springs, FL', '/images/placeholders/hero-painting.webp', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', true, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000012', 'Two-Tone Exterior Repaint', 'Exterior Painting', 'Sanford, FL', '/images/placeholders/Exterior Painting.jpeg', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', true, NOW(), NOW());
