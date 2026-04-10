# Analytics Module

## Purpose
Capture client analytics events and expose aggregate data for admin monitoring.

## Components
- DTO validation: dtos/track-event.dto.ts
- Capture orchestrator: services/analytics-capture.service.ts
- Persistence and aggregation: services/analytics-storage.service.ts
- Public tracking endpoint: src/app/api/analytics/track/route.ts
- Admin summary endpoint: src/app/api/admin/analytics/summary/route.ts

## Events
- PAGE_VIEW
- CTA_CLICK
- PHONE_CLICK
- LEAD_SUBMIT
