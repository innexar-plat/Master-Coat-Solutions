# PixelScripts

## Purpose
Loads configured marketing pixel scripts into the root app layout.

## Data Source
- readPixelSettings from pixels module

## Behavior
- No scripts when settings are disabled
- Injects GTM, GA4, Meta, Google Ads and TikTok scripts when configured

## Tests
- PixelScripts.test.tsx
