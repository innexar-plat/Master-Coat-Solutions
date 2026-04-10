# AdminLogoutButton

## Purpose
Logs out current admin session and redirects to `/admin/login`.

## Behavior
- Sends POST request to `/api/admin/logout`.
- Redirects to login page after request completes.

## Tests
- `AdminLogoutButton.test.tsx`
