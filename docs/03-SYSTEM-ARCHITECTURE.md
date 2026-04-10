# 🏗️ VINI PAINTING — System Architecture

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / CDN                           │
│                      (Vercel Edge Network)                      │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
    ┌──────────▼──────────┐            ┌──────────▼──────────┐
    │   SITE PÚBLICO      │            │   PAINEL ADMIN      │
    │   (SSR/SSG)         │            │   (CSR + API)       │
    │                     │            │                     │
    │  Next.js App Router │            │  Next.js App Router │
    │  /(public) routes   │            │  /(admin) routes    │
    │                     │            │  🔒 Auth Required   │
    └──────────┬──────────┘            └──────────┬──────────┘
               │                                  │
               └──────────────┬───────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │     API LAYER       │
                   │     (tRPC)          │
                   │                     │
                   │  - Auth Router      │
                   │  - Leads Router     │
                   │  - Gallery Router   │
                   │  - Blog Router      │
                   │  - Settings Router  │
                   │  - Analytics Router │
                   │  - Pages Router     │
                   │  - Services Router  │
                   └──────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐   ┌────────▼────────┐   ┌───────▼───────┐
│  PostgreSQL   │   │  Redis/Upstash  │   │  Cloudinary   │
│  (Neon.tech)  │   │                 │   │               │
│               │   │  - Cache        │   │  - Images     │
│  - Users      │   │  - Sessions     │   │  - Gallery    │
│  - Leads      │   │  - Rate Limit   │   │  - Thumbnails │
│  - Gallery    │   │  - Analytics    │   │  - Blog       │
│  - Blog       │   │    buffer       │   │  - Before/    │
│  - Settings   │   │                 │   │    After      │
│  - Analytics  │   │                 │   │               │
│  - Pages      │   │                 │   │               │
└───────────────┘   └─────────────────┘   └───────────────┘
```

---

## Fluxo de Request

### Site Público (SSR/SSG)
```
User → Vercel CDN → Next.js Server
                         │
                         ├── Static Page (ISR cache hit) → Return cached HTML
                         │
                         └── Dynamic Page → Prisma → PostgreSQL → Render → Cache → Return
```

### Painel Admin
```
Admin → Vercel → Next.js → Auth Check (NextAuth)
                                │
                                ├── ❌ Not authenticated → Redirect /login
                                │
                                └── ✅ Authenticated → tRPC API → Prisma → PostgreSQL
```

### Formulário de Lead
```
Visitor fills form → API Route /api/trpc/leads.create
                         │
                         ├── Validate (Zod)
                         ├── Save to PostgreSQL
                         ├── Send email notification (Resend)
                         ├── Track conversion event
                         └── Return success
```

---

## Rendering Strategy

| Página | Estratégia | Revalidação | Motivo |
|--------|-----------|-------------|--------|
| Homepage | ISR | 60min | Conteúdo semi-estático |
| Serviços | SSG | Build time | Muda raramente |
| Galeria | ISR | 30min | Atualiza com novos trabalhos |
| Blog Post | ISR | 60min | Atualiza com novos posts |
| Blog List | ISR | 30min | Lista de posts |
| Contato | SSG | Build time | Estático |
| Landing Pages | ISR | 60min | Pode mudar via admin |
| City Pages | SSG | Build time | SEO estático |
| Admin/* | CSR | N/A | Sempre dinâmico |

---

## Arquitetura de Autenticação

```
┌─────────────────────────────────────────────┐
│              NextAuth.js v5                  │
│                                             │
│  Provider: Credentials (email + password)   │
│  Session Strategy: JWT (stateless)          │
│  Token Storage: HTTP-only cookie            │
│                                             │
│  Roles:                                     │
│  ├── SUPER_ADMIN → Full access              │
│  ├── ADMIN → Content management             │
│  └── VIEWER → Read-only dashboard           │
│                                             │
│  Security:                                  │
│  ├── bcrypt password hashing (12 rounds)    │
│  ├── CSRF protection (built-in)             │
│  ├── Rate limiting on login (5 attempts)    │
│  ├── 2FA with TOTP (optional)               │
│  ├── Session expiry (24h / 30d remember)    │
│  └── Audit log for all admin actions        │
└─────────────────────────────────────────────┘
```

---

## Middleware Chain

```
Request
  │
  ├── 1. Rate Limiter (Upstash)
  ├── 2. Security Headers (CSP, HSTS, etc.)
  ├── 3. Locale Detection (next-intl + Accept-Language)
  ├── 4. Auth Check (admin routes only)
  ├── 5. Role-based Access Control
  └── 6. Route Handler / Page Render

Regras de locale:
- Locales suportados: `en`, `pt`, `es`
- Locale padrão: `en`
- Primeiro acesso: detectar idioma do navegador
- Se suportado, redirecionar para locale correspondente
- Se não suportado, usar `en`
- Seleção manual via botão de idioma salva cookie `NEXT_LOCALE`
```

---

## Arquitetura de Analytics (Custom)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Client-side │     │  API Route   │     │  PostgreSQL  │
│  Event Track ├────►│  /api/track  ├────►│  analytics   │
│              │     │              │     │  table       │
│  - pageview  │     │  - validate  │     │              │
│  - click     │     │  - enrich    │     │  Aggregated  │
│  - form      │     │  - store     │     │  hourly via  │
│  - scroll    │     │              │     │  cron job    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                          ┌─────▼──────┐
                                          │  Admin     │
                                          │  Dashboard │
                                          │  (Recharts)│
                                          └────────────┘
```

### Eventos Trackeados
- `pageview` — URL, referrer, UTM params, device, geo
- `click` — element ID, element text, page URL
- `form_start` — form ID, page URL
- `form_submit` — form ID, page URL, success/fail
- `cta_click` — CTA type, page URL, position
- `phone_click` — phone number clicked
- `scroll_depth` — 25%, 50%, 75%, 100%

---

## Pixel Management Architecture

```
┌─────────────────────────────────────────────┐
│           Google Tag Manager (GTM)          │
│                                             │
│  Configured via Admin Panel:                │
│  ├── GTM Container ID                       │
│  ├── GA4 Measurement ID                     │
│  ├── Meta Pixel ID                          │
│  ├── Google Ads Conversion ID               │
│  ├── TikTok Pixel ID                        │
│  └── Custom scripts                         │
│                                             │
│  Events fired:                              │
│  ├── page_view (all pages)                  │
│  ├── generate_lead (form submit)            │
│  ├── contact (phone/email click)            │
│  └── view_gallery (gallery interaction)     │
└─────────────────────────────────────────────┘
```

**Admin configura os IDs dos pixels no painel → salva no DB → Next.js injeta no `<head>` via Server Component.**

---

## Estratégia de Cache

| Recurso | Cache Layer | TTL | Invalidação |
|---------|------------|-----|-------------|
| Páginas públicas | Vercel CDN (ISR) | 30-60min | On-demand revalidation |
| Imagens galeria | Cloudinary CDN | 1 ano | URL-based versioning |
| Settings do site | Redis | 5min | Admin update trigger |
| Lista de serviços | Redis | 1h | Admin update trigger |
| Blog posts | Redis | 15min | Admin update trigger |
| API responses (admin) | TanStack Query | 5min | Mutation invalidation |

---

## Segurança

### Headers de Segurança
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ...
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### OWASP Top 10 Proteções
| Vulnerabilidade | Proteção |
|----------------|----------|
| Injection | Prisma ORM (parameterized queries) |
| Broken Auth | NextAuth + bcrypt + rate limiting |
| XSS | React auto-escape + CSP headers |
| CSRF | NextAuth CSRF tokens |
| Security Misconfiguration | Security headers + env validation |
| Sensitive Data Exposure | HTTPS only + encrypted passwords |
| Broken Access Control | Middleware RBAC + server-side checks |
| SSRF | Input validation + URL allowlisting |

---

## Estrutura de Diretórios do Projeto

```
vini-painting/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + Test + Build
│       └── deploy.yml                # Auto-deploy on merge
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Initial data seed
│   └── migrations/                   # Auto-generated
├── public/
│   ├── images/                       # Static images
│   ├── icons/                        # Favicons, PWA icons
│   ├── robots.txt
│   └── manifest.json                 # PWA manifest
├── src/
│   ├── app/
│   │   ├── (public)/                 # 🌐 PUBLIC SITE
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── services/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── gallery/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── areas/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [city]/page.tsx   # City SEO pages
│   │   │   ├── free-estimate/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   └── lp/
│   │   │       └── [slug]/page.tsx   # Landing pages
│   │   ├── (admin)/                  # 🔒 ADMIN PANEL
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── leads/
│   │   │   │   │   ├── page.tsx      # CRM inbox
│   │   │   │   │   └── [id]/page.tsx # Lead detail
│   │   │   │   ├── gallery/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── services/page.tsx
│   │   │   │   ├── pages/page.tsx
│   │   │   │   ├── landing-pages/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── testimonials/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── seo/page.tsx
│   │   │   │   ├── pixels/page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx      # General settings
│   │   │   │   │   ├── users/page.tsx
│   │   │   │   │   └── appearance/page.tsx
│   │   │   │   └── audit-log/page.tsx
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/route.ts  # tRPC handler
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── track/route.ts        # Analytics tracking
│   │   │   ├── webhook/route.ts      # External webhooks
│   │   │   ├── sitemap.xml/route.ts  # Dynamic sitemap
│   │   │   └── revalidate/route.ts   # On-demand ISR
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── public/                   # Site components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── TestimonialSlider.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── EstimateForm.tsx
│   │   │   ├── BeforeAfterSlider.tsx
│   │   │   ├── GoogleReviews.tsx
│   │   │   ├── AreaMap.tsx
│   │   │   ├── CTABanner.tsx
│   │   │   └── FAQAccordion.tsx
│   │   ├── admin/                    # Admin components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── LeadPipeline.tsx
│   │   │   ├── LeadTable.tsx
│   │   │   ├── GalleryUploader.tsx
│   │   │   ├── BlogEditor.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   ├── PixelManager.tsx
│   │   │   └── SEOEditor.tsx
│   │   └── shared/                   # Shared components
│   │       ├── ImageOptimized.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Pagination.tsx
│   │       └── ConfirmDialog.tsx
│   ├── server/
│   │   ├── api/
│   │   │   ├── root.ts              # tRPC root router
│   │   │   ├── trpc.ts              # tRPC config
│   │   │   └── routers/
│   │   │       ├── auth.ts
│   │   │       ├── leads.ts
│   │   │       ├── gallery.ts
│   │   │       ├── blog.ts
│   │   │       ├── services.ts
│   │   │       ├── pages.ts
│   │   │       ├── settings.ts
│   │   │       ├── analytics.ts
│   │   │       ├── testimonials.ts
│   │   │       ├── landing-pages.ts
│   │   │       ├── seo.ts
│   │   │       └── pixels.ts
│   │   ├── auth.ts                   # NextAuth config
│   │   └── db.ts                     # Prisma client
│   ├── lib/
│   │   ├── utils.ts                  # Utility functions
│   │   ├── validations.ts            # Zod schemas
│   │   ├── constants.ts              # App constants
│   │   ├── seo.ts                    # SEO helper functions
│   │   ├── analytics.ts             # Analytics client helpers
│   │   └── email-templates/
│   │       ├── new-lead.tsx
│   │       └── welcome.tsx
│   ├── hooks/
│   │   ├── useTrackEvent.ts
│   │   ├── useLeads.ts
│   │   └── useSettings.ts
│   ├── styles/
│   │   └── globals.css               # Tailwind + custom styles
│   └── types/
│       └── index.ts                  # Shared types
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local                        # Local env (git ignored)
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
