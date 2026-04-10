# 🗄️ VINI PAINTING — Database Schema (Prisma)

## Diagrama de Relacionamentos

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│   User   │     │   Setting    │     │  AuditLog    │
│──────────│     │──────────────│     │──────────────│
│ id       │────▶│ updatedById  │     │ userId       │
│ email    │     │ key          │     │ action       │
│ role     │     │ value        │     │ entity       │
└──────────┘     └──────────────┘     └──────────────┘
      │
      │ createdBy
      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Lead      │     │   LeadNote   │     │   LeadTag    │
│──────────────│     │──────────────│     │──────────────│
│ id           │────▶│ leadId       │     │ name         │
│ name         │     │ content      │     │ color        │
│ email        │     │ authorId     │     │              │
│ phone        │     └──────────────┘     └──────────────┘
│ status       │           │                     │
│ source       │           │              ┌──────┘
│ serviceId    │     ┌─────▼──────────────▼─────┐
│ utmSource    │     │     _LeadToLeadTag       │
│ utmMedium    │     │     (many-to-many)       │
│ utmCampaign  │     └─────────────────────────-┘
└──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Service    │     │   Gallery    │     │ GalleryImage │
│──────────────│     │  Project     │     │──────────────│
│ id           │     │──────────────│────▶│ projectId    │
│ title        │     │ id           │     │ url          │
│ slug         │     │ title        │     │ isBefore     │
│ description  │     │ slug         │     │ isAfter      │
│ icon         │     │ serviceId    │     │ order        │
│ order        │     │ city         │     └──────────────┘
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   BlogPost   │     │  Category    │     │     Tag      │
│──────────────│     │──────────────│     │──────────────│
│ id           │────▶│ id           │     │ id           │
│ title        │     │ name         │     │ name         │
│ slug         │     │ slug         │     │ slug         │
│ content      │     └──────────────┘     └──────────────┘
│ categoryId   │           │                     │
│ authorId     │     ┌─────┘               ┌─────┘
│ status       │     │              ┌──────▼──────────────┐
└──────────────┘     │              │  _BlogPostToTag     │
                     │              │  (many-to-many)     │
                     │              └─────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Testimonial  │     │  CityPage    │     │ LandingPage  │
│──────────────│     │──────────────│     │──────────────│
│ id           │     │ id           │     │ id           │
│ name         │     │ city         │     │ title        │
│ city         │     │ slug         │     │ slug         │
│ rating       │     │ state        │     │ sections     │
│ text         │     │ content      │     │ status       │
│ featured     │     │ seoTitle     │     │ formId       │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PageSEO    │     │ PixelConfig  │     │  Analytics   │
│──────────────│     │──────────────│     │   Event      │
│ id           │     │ id           │     │──────────────│
│ path         │     │ type         │     │ id           │
│ title        │     │ pixelId      │     │ type         │
│ description  │     │ enabled      │     │ page         │
│ ogImage      │     │ config       │     │ data         │
│ noIndex      │     └──────────────┘     │ sessionId    │
└──────────────┘                          │ timestamp    │
                                          └──────────────┘
```

---

## Prisma Schema Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// AUTH & USERS
// ==========================================

enum UserRole {
  SUPER_ADMIN
  ADMIN
  VIEWER
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String
  passwordHash   String
  role           UserRole  @default(VIEWER)
  avatar         String?
  isActive       Boolean   @default(true)
  lastLoginAt    DateTime?
  twoFactorSecret String?
  twoFactorEnabled Boolean @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  blogPosts      BlogPost[]
  leadNotes      LeadNote[]
  auditLogs      AuditLog[]
  settingsUpdated Setting[]

  @@map("users")
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String   // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  entity    String   // lead, blog_post, service, etc.
  entityId  String?
  details   Json?    // { before: {}, after: {} }
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

// ==========================================
// SITE SETTINGS
// ==========================================

model Setting {
  id          String   @id @default(cuid())
  key         String   @unique
  value       Json
  group       String   // general, contact, social, appearance, header, footer, notifications
  description String?
  updatedById String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  updatedBy User? @relation(fields: [updatedById], references: [id])

  @@index([group])
  @@map("settings")
}

// ==========================================
// SERVICES
// ==========================================

model Service {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  shortDesc   String?  // for cards
  icon        String?  // icon name or URL
  image       String?  // hero image URL
  price       String?  // "Starting at $X" text
  features    Json?    // array of feature strings
  faq         Json?    // array of { question, answer }
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  seoTitle    String?
  seoDesc     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  galleryProjects GalleryProject[]
  leads           Lead[]

  @@map("services")
}

// ==========================================
// GALLERY / PORTFOLIO
// ==========================================

model GalleryProject {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?  @db.Text
  city        String?
  serviceId   String?
  isFeatured  Boolean  @default(false)
  order       Int      @default(0)
  isPublished Boolean  @default(true)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  service Service?       @relation(fields: [serviceId], references: [id])
  images  GalleryImage[]

  @@index([serviceId])
  @@index([city])
  @@map("gallery_projects")
}

model GalleryImage {
  id        String  @id @default(cuid())
  projectId String
  url       String
  thumbnail String?
  alt       String?
  width     Int?
  height    Int?
  isBefore  Boolean @default(false)
  isAfter   Boolean @default(false)
  order     Int     @default(0)
  createdAt DateTime @default(now())

  project GalleryProject @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@map("gallery_images")
}

// ==========================================
// BLOG
// ==========================================

enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}

model BlogPost {
  id           String     @id @default(cuid())
  title        String
  slug         String     @unique
  excerpt      String?
  content      String     @db.Text
  featuredImage String?
  categoryId   String?
  authorId     String
  status       PostStatus @default(DRAFT)
  publishedAt  DateTime?
  scheduledAt  DateTime?
  readingTime  Int?       // minutes
  seoTitle     String?
  seoDesc      String?
  ogImage      String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  // Relations
  category Category? @relation(fields: [categoryId], references: [id])
  author   User      @relation(fields: [authorId], references: [id])
  tags     Tag[]

  @@index([categoryId])
  @@index([authorId])
  @@index([status, publishedAt])
  @@index([slug])
  @@map("blog_posts")
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  description String?
  createdAt DateTime @default(now())

  posts BlogPost[]

  @@map("categories")
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  posts BlogPost[]

  @@map("tags")
}

// ==========================================
// LEADS / CRM
// ==========================================

enum LeadStatus {
  NEW
  CONTACTED
  QUOTED
  WON
  LOST
}

enum LeadSource {
  CONTACT_FORM
  ESTIMATE_FORM
  LANDING_PAGE
  PHONE
  EMAIL
  REFERRAL
  WALK_IN
  OTHER
}

model Lead {
  id            String     @id @default(cuid())
  name          String
  email         String?
  phone         String?
  address       String?
  city          String?
  zipCode       String?
  serviceId     String?
  message       String?    @db.Text
  status        LeadStatus @default(NEW)
  source        LeadSource @default(CONTACT_FORM)
  landingPageId String?
  estimatedValue Decimal?  @db.Decimal(10, 2)
  followUpDate  DateTime?
  
  // UTM Tracking
  utmSource     String?
  utmMedium     String?
  utmCampaign   String?
  utmTerm       String?
  utmContent    String?
  referrerUrl   String?
  landingUrl    String?
  
  // Device info
  deviceType    String?    // mobile, desktop, tablet
  browser       String?
  
  isArchived    Boolean    @default(false)
  convertedAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  service     Service?      @relation(fields: [serviceId], references: [id])
  landingPage LandingPage?  @relation(fields: [landingPageId], references: [id])
  notes       LeadNote[]
  tags        LeadTag[]
  activities  LeadActivity[]

  @@index([status])
  @@index([source])
  @@index([createdAt])
  @@index([serviceId])
  @@index([landingPageId])
  @@map("leads")
}

model LeadNote {
  id        String   @id @default(cuid())
  leadId    String
  authorId  String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lead   Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id])

  @@index([leadId])
  @@map("lead_notes")
}

model LeadActivity {
  id        String   @id @default(cuid())
  leadId    String
  type      String   // status_change, note_added, email_sent, call_made, follow_up_set
  details   Json?    // { from: "NEW", to: "CONTACTED" }
  createdAt DateTime @default(now())

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)

  @@index([leadId])
  @@index([createdAt])
  @@map("lead_activities")
}

model LeadTag {
  id    String @id @default(cuid())
  name  String @unique
  color String @default("#3B82F6") // hex color

  leads Lead[]

  @@map("lead_tags")
}

// ==========================================
// TESTIMONIALS
// ==========================================

model Testimonial {
  id          String   @id @default(cuid())
  name        String
  city        String?
  rating      Int      @default(5) // 1-5
  text        String   @db.Text
  photo       String?
  googleUrl   String?  // link to Google review
  isFeatured  Boolean  @default(false)
  isPublished Boolean  @default(true)
  serviceType String?
  reviewDate  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("testimonials")
}

// ==========================================
// CITY / AREA PAGES (SEO)
// ==========================================

model CityPage {
  id          String   @id @default(cuid())
  city        String
  state       String   @default("FL")
  slug        String   @unique
  zipCodes    String[] // array de zip codes
  content     String   @db.Text     // unique content per city
  heroImage   String?
  population  String?
  description String?  // short desc for cards
  seoTitle    String?
  seoDesc     String?
  ogImage     String?
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("city_pages")
}

// ==========================================
// LANDING PAGES
// ==========================================

model LandingPage {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  sections    Json       // array of section configs
  style       Json?      // custom colors, fonts
  status      PostStatus @default(DRAFT)
  seoTitle    String?
  seoDesc     String?
  ogImage     String?
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  leads Lead[]

  @@map("landing_pages")
}

// ==========================================
// SEO
// ==========================================

model PageSEO {
  id          String   @id @default(cuid())
  path        String   @unique  // /services/interior-painting
  title       String?
  description String?
  ogImage     String?
  canonical   String?
  noIndex     Boolean  @default(false)
  noFollow    Boolean  @default(false)
  schemaType  String?  // LocalBusiness, Service, BlogPosting, etc.
  schemaData  Json?    // custom schema JSON
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("page_seo")
}

// ==========================================
// PIXEL / TRACKING CONFIGURATION
// ==========================================

enum PixelType {
  GOOGLE_ANALYTICS
  GOOGLE_ADS
  META_PIXEL
  TIKTOK_PIXEL
  GTM
  CUSTOM
}

model PixelConfig {
  id        String    @id @default(cuid())
  type      PixelType
  name      String    // "Main GA4", "Facebook Retargeting"
  pixelId   String    // measurement ID, pixel ID, etc.
  config    Json?     // extra config (conversion label, etc.)
  enabled   Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("pixel_configs")
}

// ==========================================
// ANALYTICS (CUSTOM)
// ==========================================

model AnalyticsEvent {
  id        String   @id @default(cuid())
  sessionId String
  type      String   // pageview, click, form_start, form_submit, scroll, cta_click
  page      String   // URL path
  referrer  String?
  data      Json?    // { elementId, elementText, scrollDepth, formId, etc. }
  
  // UTM
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  
  // Device
  deviceType  String?
  browser     String?
  os          String?
  screenSize  String?
  
  // Geo (from IP — approximation only)
  country     String?
  region      String?
  city        String?
  
  createdAt DateTime @default(now())

  @@index([type, createdAt])
  @@index([page, createdAt])
  @@index([sessionId])
  @@index([createdAt])
  @@map("analytics_events")
}

model AnalyticsDaily {
  id         String   @id @default(cuid())
  date       DateTime @db.Date
  page       String
  pageviews  Int      @default(0)
  visitors   Int      @default(0)
  clicks     Int      @default(0)
  formStarts Int      @default(0)
  formSubmits Int     @default(0)
  avgScrollDepth Float? @default(0)
  
  createdAt DateTime @default(now())

  @@unique([date, page])
  @@index([date])
  @@map("analytics_daily")
}

// ==========================================
// PAGES (Custom)
// ==========================================

model Page {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  content     String     @db.Text
  template    String     @default("default") // default, full-width, sidebar
  status      PostStatus @default(DRAFT)
  order       Int        @default(0)
  showInMenu  Boolean    @default(false)
  showInFooter Boolean   @default(false)
  seoTitle    String?
  seoDesc     String?
  ogImage     String?
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("pages")
}

// ==========================================
// FAQ
// ==========================================

model FAQ {
  id          String   @id @default(cuid())
  question    String
  answer      String   @db.Text
  category    String?  // general, service-specific, pricing, etc.
  order       Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("faqs")
}
```

---

## Seed Data (Dados Iniciais)

```typescript
// prisma/seed.ts — dados iniciais

const seedData = {
  // Admin user
  users: [
    { email: "admin@vinipainting.com", name: "Vini Admin", role: "SUPER_ADMIN" }
  ],
  
  // Settings
  settings: [
    { key: "company_name", value: "Vini Painting", group: "general" },
    { key: "company_phone", value: "(407) 000-0000", group: "contact" },
    { key: "company_email", value: "info@vinipainting.com", group: "contact" },
    { key: "company_address", value: "Orlando, FL", group: "contact" },
    { key: "primary_color", value: "#1E40AF", group: "appearance" },
    { key: "secondary_color", value: "#F59E0B", group: "appearance" },
  ],
  
  // Services
  services: [
    { title: "Interior Painting", slug: "interior-painting", order: 1 },
    { title: "Exterior Painting", slug: "exterior-painting", order: 2 },
    { title: "Commercial Painting", slug: "commercial-painting", order: 3 },
    { title: "Cabinet Painting", slug: "cabinet-painting", order: 4 },
    { title: "Pressure Washing", slug: "pressure-washing", order: 5 },
  ],
  
  // Categories
  categories: [
    { name: "Painting Tips", slug: "painting-tips" },
    { name: "Color Trends", slug: "color-trends" },
    { name: "Home Improvement", slug: "home-improvement" },
    { name: "Orlando Guide", slug: "orlando-guide" },
  ],
  
  // Cities
  cities: [
    "Orlando", "Kissimmee", "Winter Park", "Altamonte Springs",
    "Lake Mary", "Sanford", "Ocoee", "Winter Garden", "Clermont",
    "Daytona Beach", "Deltona", "St. Cloud", "Apopka", "Casselberry",
    "Longwood", "Maitland", "Windermere", "Celebration", "Lake Nona",
    "Dr. Phillips"
  ]
}
```

---

## Indexes Importantes

| Tabela | Index | Motivo |
|--------|-------|--------|
| leads | status, createdAt | Pipeline queries |
| leads | source | Source reports |
| analytics_events | type, createdAt | Dashboard queries |
| analytics_events | page, createdAt | Page reports |
| analytics_events | sessionId | Session grouping |
| blog_posts | status, publishedAt | Published posts listing |
| audit_logs | userId, createdAt | User activity |
| gallery_images | projectId | Project images |
