# AdminLoginForm

## Purpose
Client login form for admin access using `/api/admin/login`.

## Props
- title: string
- submitLabel: string
- emailLabel: string
- passwordLabel: string
- errorLabel: string

## Behavior
- Sends POST request to `/api/admin/login`.
- Shows validation error feedback when credentials are invalid.
- Redirects to `/admin` on success.

## Tests
- `AdminLoginForm.test.tsx`
