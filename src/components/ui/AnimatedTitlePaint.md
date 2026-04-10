# AnimatedTitlePaint

## Purpose
Creates a hero/title effect that feels like text is being painted on screen.

## Props
- title: string (required)
- subtitle: string (optional)
- align: "left" | "center" (optional, default: "left")
- className: string (optional)

## Usage
```tsx
<AnimatedTitlePaint
  title="Professional House Painters in Orlando"
  subtitle="High-end finishes with clean prep and fast turnaround"
  align="left"
/>
```

## Accessibility
- Uses semantic H1 heading.
- Subtitle is rendered as paragraph text.

## Test coverage
- Renders title and subtitle.
- Applies alignment classes.
