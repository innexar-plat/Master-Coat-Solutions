# EXECUTION BLUEPRINT - BUSINESS, CORE, AUTH

## 1) Business Modules (Final)

Module A - Acquisition Engine
- SEO local pages (services + cities)
- Landing pages for paid campaigns
- Conversion-first forms (contact + estimate)
- Pixel and event tracking

Module B - Brand & Authority
- Portfolio gallery with before/after
- Testimonials and review integration
- Blog with local educational content

Module C - Lead Operations (Micro CRM)
- Lead inbox, filters, lifecycle stages
- Follow-up notes, reminders, tags
- Source and campaign attribution
- Export and reporting

Module D - Revenue Visibility
- Conversion dashboard
- Channel/source performance
- Pipeline volume and lead aging

Module E - Platform Governance
- RBAC, audit logs, settings management
- Backups, monitoring, release process

---

## 2) Core System Domains

Domain 1 - Identity and Access
- Auth service, session service, role enforcement.

Domain 2 - Content Management
- Services, blog, pages, landing pages, testimonials.

Domain 3 - Portfolio Management
- Projects, images, before/after pairing, categorization.

Domain 4 - CRM and Lead Management
- Lead capture, lifecycle transitions, lead activities.

Domain 5 - Analytics and Attribution
- Events, aggregations, dashboard metrics, UTM attribution.

Domain 6 - SEO and Discovery
- Metadata, schema, sitemap, local page strategy.

Domain 7 - Integrations
- Email (Resend), cloud media (Cloudinary), GTM/GA4/Meta/Ads.

---

## 3) Authentication Blueprint (Professional)

### 3.1 Auth Stack
- Auth.js (NextAuth v5) with credentials provider.
- Password hashing with bcrypt (cost 12).
- JWT session strategy with secure HTTP-only cookies.

### 3.2 Roles and Permissions
- SUPER_ADMIN:
  - Full access, users and security settings.
- ADMIN:
  - Content/CRM/analytics management.
- VIEWER:
  - Read-only dashboard and reports.

### 3.3 Access Model
- Route-level protection in middleware.
- Server-side permission checks in all admin procedures.
- Procedure-level authorization in API layer.

### 3.4 Security Controls
- Rate limit login (5 attempts / 15 min / IP).
- Account lock policy for brute-force patterns.
- CSRF protection via auth framework.
- Session expiration and idle timeout.
- Optional 2FA (TOTP) in phase 2.
- Security event logs in audit trail.

### 3.5 Audit Compliance
Track all privileged actions:
- Login success/failure
- User role changes
- Content publish/unpublish
- Lead status changes
- Pixel/script changes
- SEO critical edits

---

## 4) Operating Model

### 4.1 Team Roles
- Product owner: priorities and acceptance.
- Tech lead: architecture and quality.
- Frontend engineer: public site and admin UI.
- Backend engineer: API, data, integrations.
- SEO/content specialist: local pages and on-page quality.
- Sales/admin operator: CRM pipeline and follow-ups.

### 4.2 Weekly Rituals
- Monday: sprint planning and KPI review.
- Wednesday: content and SEO execution checkpoint.
- Friday: demo, QA, release and retro.

### 4.3 KPI Ownership
- Organic leads: SEO specialist.
- Lead response time: CRM operator.
- Conversion rate: product + growth.
- Site performance and uptime: engineering.

---

## 5) Quality Gates

Before deploying:
- Build passes with zero TypeScript errors.
- Critical e2e paths pass:
  - lead submission
  - admin login
  - lead status update
  - page publish
- Lighthouse mobile >= 90 on key pages.
- No critical security findings.
- Rollback strategy confirmed.

---

## 6) Risk Register (Top Risks)

Risk 1 - SEO pages with duplicate content
- Mitigation: strict city-template uniqueness checklist.

Risk 2 - Lead loss due to form/API failures
- Mitigation: retry queue + email alerts + health checks.

Risk 3 - Unauthorized admin actions
- Mitigation: RBAC + audit logs + session hardening.

Risk 4 - Slow pages hurting conversion
- Mitigation: image CDN, ISR cache, CWV monitoring.

Risk 5 - Ads spend without reliable attribution
- Mitigation: event QA and UTM governance policy.

---

## 7) 30-60-90 Day Execution View

Day 0-30
- Foundation, auth, admin shell, core pages, first forms.

Day 31-60
- CRM pipeline, blog, gallery, city pages wave 1, attribution.

Day 61-90
- Analytics dashboard, pixel manager, SEO expansion, launch hardening.

---

## 8) Launch Readiness Checklist

- Domain, SSL, production env vars configured.
- Robots/sitemap/schema validated.
- Form notifications tested.
- Pixel events validated with test tools.
- GBP profile aligned with website NAP.
- Backup and monitoring active.
- On-call owner defined for first 14 days post-launch.
