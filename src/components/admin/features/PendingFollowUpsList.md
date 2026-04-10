# PendingFollowUpsList

## Purpose
Shows an operational queue of follow-up reminders that are already due.

## Data Source
- GET /api/admin/follow-ups/pending
- PATCH /api/admin/leads/:id/follow-up (set `followUpAt` to `null`)

## Actions
- Mark Done: clears the current reminder and removes the row from the pending queue.

## Tests
- PendingFollowUpsList.test.tsx
