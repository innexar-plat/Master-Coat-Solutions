# AdminLeadsWorkspace

## Purpose
Client workspace for CRM leads page, combining pipeline and inbox with API-driven updates.

## Behavior
- Loads leads from `/api/admin/leads` with pagination and sorting query params
- Applies status and text filters through `LeadFiltersBar`
- Updates status via `/api/admin/leads/:id/status`
- Allows selecting a lead to manage internal notes
- Loads and creates notes via `/api/admin/leads/:id/notes`
- Loads and updates reminders via `/api/admin/leads/:id/follow-up`
- Loads lead activity history via `/api/admin/leads/:id/activities`
- Exports filtered leads through `/api/admin/leads/export`

## Tests
- `AdminLeadsWorkspace.test.tsx`
