# Auth Module

## Scope
Minimal authentication layer for admin access.

## Components
- Session service: services/admin-session.service.ts
- Request auth service: services/admin-request-auth.service.ts
- Login endpoint: src/app/api/admin/login/route.ts
- Logout endpoint: src/app/api/admin/logout/route.ts
- Admin middleware protection: middleware.ts

## Security model
- Cookie-based session (`admin_session`)
- HMAC signature validation for token integrity
- Expiring session token (default 12h)
- Role-based claims in session token (`SUPER_ADMIN`, `ADMIN`, `VIEWER`)
- Route protection for `/admin` via middleware
- API-level authorization helper with explicit 401 vs 403 outcomes

## Role policy (current)
- `VIEWER`: read-only endpoints (`GET /api/admin/leads`, `GET /api/admin/analytics/summary`, `GET /api/admin/pixels`)
- `ADMIN`: CRM write actions (`PATCH /api/admin/leads/:id/status`)
- `SUPER_ADMIN`: sensitive settings write (`PATCH /api/admin/pixels`)

## Environment variables
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_ROLE
- ADMIN_SESSION_SECRET

## Tests
- src/modules/auth/tests/admin-session.service.test.ts
- src/modules/auth/tests/admin-request-auth.service.test.ts
- src/components/admin/features/AdminLoginForm.test.tsx
