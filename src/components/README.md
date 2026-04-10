# Component Architecture

## Purpose
This directory stores all UI components with strict separation between reusable and module-specific usage.

## Structure
- ui/: reusable primitives and composable UI building blocks.
- shared/: reusable cross-domain components.
- public/: components specific to the public website.
- admin/: components specific to the admin panel.

## Rules
- If a component is reused in 2+ places, extract to ui/ or shared/.
- New components must include tests and documentation.
- Keep business logic out of primitive ui components.
