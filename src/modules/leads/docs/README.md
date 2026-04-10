# Leads Module

## Scope
Handles lead capture from website forms.

## Components
- DTO validation: dtos/create-lead.dto.ts
- Leads query DTO: dtos/list-leads-query.dto.ts
- Lead note DTO: dtos/create-lead-note.dto.ts
- Lead follow-up DTO: dtos/lead-follow-up.dto.ts
- Capture orchestrator: services/lead-capture.service.ts
- Persistence adapter: services/lead-storage.service.ts
- Prisma adapter: services/lead-prisma-storage.service.ts
- Leads list service: services/list-leads.service.ts
- Lead notes service: services/lead-note.service.ts
- Lead notes storage: services/lead-note-storage.service.ts
- Lead follow-up service: services/lead-follow-up.service.ts
- Lead follow-up storage: services/lead-follow-up-storage.service.ts
- Lead activity service: services/lead-activity.service.ts
- Lead activity storage: services/lead-activity-storage.service.ts
- Dashboard metrics service: services/lead-dashboard-metrics.service.ts
- Notification adapter: services/lead-notification.service.ts
- API endpoint: src/app/api/leads/route.ts
- Admin API endpoint: src/app/api/admin/leads/route.ts
- Admin status endpoint: src/app/api/admin/leads/[id]/status/route.ts
- Admin notes endpoint: src/app/api/admin/leads/[id]/notes/route.ts
- Admin follow-up endpoint: src/app/api/admin/leads/[id]/follow-up/route.ts
- Admin follow-up list endpoint: src/app/api/admin/follow-ups/route.ts
- Admin pending follow-up count endpoint: src/app/api/admin/follow-ups/pending-count/route.ts
- Admin pending follow-up detailed endpoint: src/app/api/admin/follow-ups/pending/route.ts
- Admin lead activities endpoint: src/app/api/admin/leads/[id]/activities/route.ts
- Admin leads export endpoint: src/app/api/admin/leads/export/route.ts

## Flow
1. API receives POST /api/leads
2. Payload is validated by Zod DTO
3. Lead is normalized and assigned id + createdAt
4. Lead is persisted to Prisma (when DATABASE_URL is set)
5. Fallback persistence uses data/leads.json when Prisma is unavailable
6. Notification is triggered (Resend when env vars exist)

CRM lifecycle statuses:
- NEW
- CONTACTED
- QUOTED
- WON
- LOST

Follow-up reminders:
- One reminder datetime per lead (`followUpAt`, nullable)
- Pending reminders count excludes `WON` and `LOST` leads
- Pending reminders include reminders with datetime <= current time
- Dashboard queue allows quick completion by clearing `followUpAt` via PATCH endpoint

Lead activity timeline:
- Tracks status changes, note creation and follow-up updates
- Stores actor and timestamp for each event
- Exposed in CRM via `/api/admin/leads/:id/activities`

## Environment variables
- RESEND_API_KEY (optional)
- LEADS_NOTIFICATION_EMAIL (optional)
- DATABASE_URL (required for Prisma persistence)

## Tests
- create-lead.dto.test.ts
- list-leads-query.dto.test.ts
- list-leads.service.test.ts
- create-lead-note.dto.test.ts
- lead-note.service.test.ts
- lead-capture.service.test.ts
- lead-prisma-storage.service.test.ts
- lead-follow-up.dto.test.ts
- lead-follow-up.service.test.ts
- lead-activity.service.test.ts
