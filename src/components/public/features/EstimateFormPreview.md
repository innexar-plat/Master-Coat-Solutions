# EstimateFormPreview

## Purpose
Provides a premium estimate section that embeds the interactive lead capture form.

## Props
- title: string
- ctaLabel: string
- locale: "en" | "pt" | "es"
- placeholders: { name, phone, email, service, details }
- feedback: { success, error }

## Integration
- Uses `EstimateLeadForm` for POST submission to `/api/leads`.

## Tests
- Validates heading, connected form rendering and CTA button.
