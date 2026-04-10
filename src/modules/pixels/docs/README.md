# Pixels Module

## Purpose
Store and manage marketing pixel settings used by client-side script injection.

## Components
- DTO validation: dtos/pixel-settings.dto.ts
- Settings persistence: services/pixel-settings.service.ts
- Admin settings endpoint: src/app/api/admin/pixels/route.ts
- Script renderer: src/components/shared/PixelScripts.tsx

## Providers Covered
- Google Analytics 4
- Google Tag Manager
- Meta Pixel
- Google Ads
- TikTok Pixel
