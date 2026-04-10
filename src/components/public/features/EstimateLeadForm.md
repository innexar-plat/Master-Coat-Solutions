# EstimateLeadForm

## Purpose
Production-ready client form for capturing free estimate leads through /api/leads.

## Props
- ctaLabel: string
- locale: "en" | "pt" | "es"
- placeholders: { name, phone, email, service, details }
- feedback: { success, error }

## Behavior
- Sends POST request to /api/leads
- Shows loading state
- Shows success/error feedback

## Tests
- Verifies submit flow and success feedback.
