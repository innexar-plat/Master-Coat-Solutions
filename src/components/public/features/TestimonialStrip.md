# TestimonialStrip

## Purpose
Displays social proof cards to increase trust and conversion.

## Props
- title: string
- items: Array<{ quote: string; author: string; city: string }>

## Usage
```tsx
<TestimonialStrip
  title="Client Reviews"
  items={[{ quote: "Great", author: "John", city: "Orlando" }]}
/>
```

## Tests
- Verifies title and testimonial content rendering.
