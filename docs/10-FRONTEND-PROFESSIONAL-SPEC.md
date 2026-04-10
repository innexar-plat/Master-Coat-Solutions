# FRONTEND PROFESSIONAL SPEC - REUSABILITY, TESTS, DOCS, PREMIUM UI

## 1) Non-Negotiable Frontend Rules

Every new module/component must ship with:
- Implementation
- Automated tests
- Technical documentation

No exceptions for production code.

---

## 2) Component Architecture and Folder Organization

Recommended structure:

src/
- components/
  - ui/                    # reusable primitives (button, card, input, modal)
  - shared/                # reusable cross-domain blocks
  - public/
    - sections/            # homepage/service sections
    - features/            # gallery, testimonials, forms
    - templates/           # page layout compositions
  - admin/
    - sections/            # dashboard/CRM sections
    - features/            # lead table, kanban, editors
    - templates/           # admin page compositions
- modules/
  - leads/
    - components/
    - hooks/
    - services/
    - tests/
    - docs/
  - gallery/
  - blog/
  - settings/
  - analytics/

Separation principles:
- Reusable = independent from business context.
- Individual = tied to a feature/module and cannot be broadly reused.
- Never place business logic in primitive ui components.

---

## 3) Naming and Design System Conventions

Naming:
- Reusable components: PascalCase (PaintCard.tsx, AnimatedTitle.tsx)
- Hooks: camelCase with use prefix (useLeadPipeline.ts)
- Test files: ComponentName.test.tsx
- Docs per component/module: COMPONENT.md or README.md

Design tokens (mandatory):
- colors
- spacing scale
- radius scale
- shadow presets
- motion durations/easings

No hard-coded color values in multiple places.

---

## 4) Testing Standards by Component Type

### 4.1 Reusable UI Components
Minimum:
- Render test
- Props behavior test
- Accessibility checks (roles, labels, keyboard)
- Interaction test for clickable/input components

### 4.2 Feature Components
Minimum:
- State transitions
- API/loading/error states
- Empty state and edge states
- Critical user actions

### 4.3 Page Templates
Minimum:
- Section composition
- Responsive behavior checks
- Core CTA visibility and functionality

Coverage target for changed scope:
- 90% minimum (lines/branches for modified modules)

---

## 5) Documentation Standards

For every new component/module, include:
- Purpose
- Props contract (types and defaults)
- Variants and states
- Accessibility notes
- Usage example
- Testing notes

Documentation locations:
- Reusable components: src/components/.../COMPONENT.md
- Feature modules: src/modules/<module>/docs/README.md

---

## 6) Premium Visual Direction for Painting Brand

Visual language goals:
- Professional, trustworthy, high-end craftsmanship.
- Rich cards with depth and subtle textures.
- Motion inspired by brush strokes and paint reveal.

Mandatory UI elements:
- Elevated service cards with hover depth transitions.
- Before/after media cards with smooth reveal interaction.
- Distinct CTA cards for estimate actions.

Color direction:
- Clean neutral base + strong accent inspired by paint tones.
- Avoid generic purple-first default look.
- Keep contrast AA compliant.

Typography direction:
- Confident display font for headings.
- Highly readable body font for service details and forms.

---

## 7) Animation System (Paint-Inspired)

Title animation requirement:
- Headline should animate like being painted on screen.
- Implementation options:
  - SVG path stroke draw animation
  - Mask reveal with brush texture
  - Clip-path progressive reveal

Motion guidelines:
- Use meaningful motion, not decorative overload.
- Duration guidance:
  - Micro interactions: 120-220ms
  - Section reveals: 300-600ms
  - Hero title paint reveal: 700-1200ms
- Respect reduced-motion preferences.

Performance:
- Prefer transform/opacity animations.
- Avoid layout thrashing animations.
- Target smooth 60fps on modern mobile devices.

---

## 8) UX Requirements for Conversion

- CTA always visible above fold on primary pages.
- Sticky estimate action on mobile.
- Fast-contact options (call, form, WhatsApp if enabled).
- Trust indicators near CTA (licensed/insured/reviews).
- Form friction minimized with clear validation feedback.

---

## 9) Delivery Checklist (Per Component/Module)

- Component created in correct folder type (reusable or individual).
- Test file created and passing.
- Documentation file created/updated.
- Accessibility validated.
- Responsive behavior checked.
- Animation performance validated if motion included.

---

## 10) Suggested Initial Premium Components

Reusable:
- AnimatedTitlePaint
- ServiceShowcaseCard
- ProjectBeforeAfterCard
- TestimonialTrustCard
- CTAEstimateBanner
- SectionRevealWrapper

Module-specific:
- LeadPipelineKanbanBoard
- GalleryProjectComposer
- LandingPageHeroBuilder
- AnalyticsConversionPanel

These components should be implemented with strict separation, tests, and docs from day one.
