# ServiceShowcaseCard

## Purpose
Reusable premium card for service highlights with optional image and CTA.

## Props
- title: string (required)
- description: string (required)
- imageUrl: string (optional)
- ctaLabel: string (optional, default: "Get Free Estimate")

## Usage
```tsx
<ServiceShowcaseCard
  title="Interior Painting"
  description="Premium wall and ceiling finishes with clean prep"
  imageUrl="/images/services/interior.jpg"
  ctaLabel="Request Estimate"
/>
```

## States
- with image
- without image
- hover interaction with depth and gradient overlay

## Test coverage
- content rendering
- default CTA label
- image rendering condition
