# I18N AND LOCALIZATION SPECIFICATION

## 1) Language Requirements

Mandatory public site languages:
- English (en) - default
- Portuguese (pt)
- Spanish (es)

Behavior requirements:
- Default language is always English.
- On first visit, detect browser language.
- If browser language is supported (en/pt/es), open site in that language.
- If browser language is not supported, fallback to English.
- Provide a visible language switcher button on all public pages.
- Manual language selection must persist via cookie/local preference.

Admin panel language:
- Keep English/Portuguese support for admins.
- Public-site localization is priority for MVP.

---

## 2) URL and Routing Strategy

Recommended approach with locale prefixes:
- /en
- /pt
- /es

Examples:
- /en/services/interior-painting
- /pt/servicos/pintura-interna (or keep stable slugs if preferred)
- /es/servicios/pintura-interior

MVP simplification option:
- Keep slugs stable in English across locales to reduce complexity.
- Translate UI labels, headings, body text, CTA text, metadata.

---

## 3) Technical Implementation (Next.js + next-intl)

Core setup:
- next-intl for dictionaries and locale-aware rendering.
- Middleware inspects Accept-Language and existing locale cookie.
- Priority resolution:
  1. Manual locale cookie (if set)
  2. URL locale segment
  3. Browser language (Accept-Language)
  4. Default en

Persistence:
- Cookie key: NEXT_LOCALE
- Expiration: 1 year
- HttpOnly not required for language preference cookie

---

## 4) Language Switcher UX

Requirements:
- Always visible in header desktop and mobile menu.
- Label style examples:
  - EN | PT | ES
  - Or dropdown: English / Portugues / Espanol
- Switching language should:
  - Keep user on equivalent page when possible.
  - Preserve important query params (especially UTM in campaigns).
  - Update cookie preference.

Accessibility:
- Keyboard accessible.
- aria-label: "Change language"
- Focus state visible.

---

## 5) Content Localization Scope

Must be translated:
- Navigation labels
- Hero titles/subtitles
- Service descriptions
- CTA buttons
- Contact and estimate form labels/errors/success messages
- Footer and legal links
- FAQ content
- Localized metadata (title/description)

Can stay shared in MVP (phase 1):
- Gallery image assets
- Non-critical long blog backlog (new posts should be localized by priority)

---

## 6) SEO Localization Rules

For each locale page:
- Localized title/description.
- Canonical per locale URL.
- hreflang tags for en, pt, es (+ x-default = en).
- Localized Open Graph where applicable.

Example hreflang set:
- en-US -> https://domain.com/en/...
- pt-BR -> https://domain.com/pt/...
- es-US -> https://domain.com/es/...
- x-default -> https://domain.com/en/...

Important:
- Avoid duplicate content with incorrect canonicalization.
- Keep consistent page mapping across locales.

---

## 7) Data Model Considerations

Option A (MVP fast):
- Store translations in JSON fields for key entities.
- Example: titleI18n { en, pt, es }

Option B (scalable):
- Translation tables by entity and locale.
- Example: page_translations, service_translations, blog_post_translations.

Recommendation:
- Start with Option A for speed.
- Migrate to Option B when content scale increases.

---

## 8) QA Acceptance Criteria

Functional:
- Browser in Portuguese opens /pt on first visit.
- Browser in Spanish opens /es on first visit.
- Browser in unsupported language opens /en.
- Language button changes language and persists after refresh.

UX:
- Switcher visible on desktop and mobile.
- No broken layout for longer translated strings.

SEO:
- hreflang present and valid.
- Localized metadata rendered server-side.
- Sitemap includes all locales for key pages.

Performance:
- No significant regression in CWV after i18n rollout.

---

## 9) Rollout Plan (i18n)

Phase 1 (Week 1):
- Middleware + locale routing + switcher component.
- Translate global UI shell (header/footer/forms).

Phase 2 (Week 2):
- Translate homepage, services, contact, estimate pages.
- Add localized metadata and hreflang.

Phase 3 (Week 3):
- Translate city pages top 10 and highest-converting landing pages.
- Add QA automation for locale routing and switcher.

Phase 4 (continuous):
- Blog and long-tail page localization based on traffic/conversion.

---

## 10) Business Impact

Expected gains with EN/PT/ES support:
- Better conversion for multilingual households.
- Improved ad relevance and landing page quality score.
- Higher engagement in Hispanic and Brazilian communities in Florida.
- Better trust and lower bounce on first visit.
