# CONTEXTO DO PROJETO - VINI PAINTING

Data de referencia: 2026-04-03
Status geral: Scaffold funcional concluido, paginas publicas MVP (incluindo blog, about, faq e areas/cidades iniciais), lead capture backend minimo, auth/admin shell v1, RBAC v1 com enforcement de API (401/403), CRM core v1, CRM v2 com filtros avancados, notas internas e follow-up reminders por lead, Analytics + Pixel Manager v1, dashboard com KPIs reais, timeline de atividades por lead, exportacao CSV de leads, stack completa em Docker (app + db) e persistencia de leads Prisma-first (com fallback local) implementados (frontend + i18n + testes + build valido).

---

## 1. Objetivo do Produto

Aplicacao/site para empresa de pintura na Florida com foco principal em Orlando e cidades vizinhas, com:
- Site publico de alta conversao
- Painel admin
- Micro CRM
- Analytics de cliques e conversao
- Gestao de pixels (ads)
- SEO local
- Suporte a idiomas EN/PT/ES

---

## 2. Regras de Produto e UX (Atuais)

- Idioma padrao do site: EN
- Idiomas suportados no site: EN, PT, ES
- Primeiro acesso: detectar idioma do navegador
- Idioma nao suportado: fallback para EN
- Botao de troca de idioma obrigatorio no site publico
- Frontend premium com identidade visual de pintura
- Componentes reutilizaveis e componentes de feature separados
- Todo novo modulo/componente deve ter testes e documentacao

---

## 3. Stack Tecnica Implementada

### Runtime e framework
- Next.js 14 (App Router)
- React 18
- TypeScript 5

### UI e estilos
- Tailwind CSS 3
- CSS custom para efeitos de animacao de titulo

### Internacionalizacao
- next-intl (routing + middleware + mensagens por locale)

### Qualidade
- ESLint (next/core-web-vitals)
- Vitest
- Testing Library
- JSDOM
- Cobertura com Vitest v8 (`npm run test:coverage`)

### Dados
- Prisma ORM 6
- @prisma/client 6

---

## 4. Integracoes Configuradas (Ja Ativas)

### Integracao 1 - next-intl plugin
- Arquivo: next.config.mjs
- Funcao: conecta Next.js ao arquivo de configuracao de i18n de request.

### Integracao 2 - Middleware de locale
- Arquivo: middleware.ts
- Funcao: aplica deteccao/roteamento de locale em rotas publicas.

### Integracao 3 - NextIntlClientProvider
- Arquivo: src/app/[locale]/layout.tsx
- Funcao: injeta mensagens traduzidas no contexto React para paginas daquele locale.

### Integracao 4 - Navegacao locale-aware
- Arquivo: src/i18n/navigation.ts
- Funcao: helpers de navegacao respeitando locale (Link/router/pathname).

### Integracao 5 - Test runner
- Arquivo: vitest.config.ts
- Funcao: executa testes TS/TSX com ambiente jsdom.

### Integracao 6 - Lead Capture API
- Arquivo: src/app/api/leads/route.ts
- Funcao: endpoint REST para capturar leads com validacao, persistencia e notificacao.

### Integracao 7 - Persistencia local de leads
- Arquivo: src/modules/leads/services/lead-storage.service.ts
- Funcao: camada de persistencia hibrida (Prisma-first com fallback em `data/leads.json`).

### Integracao 8 - Notificacao de novo lead
- Arquivo: src/modules/leads/services/lead-notification.service.ts
- Funcao: envia notificacao via Resend quando variaveis de ambiente estao configuradas.

### Integracao 9 - Admin auth middleware
- Arquivo: middleware.ts
- Funcao: protege rotas `/admin` por cookie de sessao e redireciona para login quando necessario.

### Integracao 10 - Admin session service
- Arquivo: src/modules/auth/services/admin-session.service.ts
- Funcao: cria e valida token de sessao com assinatura HMAC e expiracao.

### Integracao 11 - Analytics tracking endpoint
- Arquivo: src/app/api/analytics/track/route.ts
- Funcao: recebe eventos client-side e persiste no modulo de analytics.

### Integracao 12 - Analytics summary endpoint
- Arquivo: src/app/api/admin/analytics/summary/route.ts
- Funcao: retorna agregacao de eventos (30 dias por padrao) para dashboard admin.

### Integracao 13 - Pixel settings endpoint
- Arquivo: src/app/api/admin/pixels/route.ts
- Funcao: leitura/atualizacao autenticada das configuracoes de pixels.

### Integracao 14 - Pixel scripts injection
- Arquivo: src/components/shared/PixelScripts.tsx
- Funcao: injeta scripts GA4/GTM/Meta/Google Ads/TikTok quando habilitados no admin.

### Integracao 15 - Prisma schema e client
- Arquivos:
  - prisma/schema.prisma
  - src/lib/prisma.ts
- Funcao: modelagem de dados e client singleton para persistencia de leads em banco.

### Integracao 16 - Lead Prisma adapter
- Arquivo: src/modules/leads/services/lead-prisma-storage.service.ts
- Funcao: adapta `LeadRecord` para modelo Prisma e executa operacoes de create/list/update.

### Integracao 17 - Lead storage hybrid fallback
- Arquivo: src/modules/leads/services/lead-storage.service.ts
- Funcao: usa Prisma quando `DATABASE_URL` existe; fallback automatico para `data/leads.json` em indisponibilidade.

### Integracao 18 - RBAC claims na sessao admin
- Arquivos:
  - src/modules/auth/services/auth.constants.ts
  - src/modules/auth/services/admin-session.service.ts
  - src/modules/auth/services/admin-request-auth.service.ts
  - src/app/api/admin/login/route.ts
- Funcao: inclui `role` no token assinado e aplica autorizacao por hierarquia (`SUPER_ADMIN` > `ADMIN` > `VIEWER`).

### Integracao 19 - Docker Postgres local
- Arquivo: docker-compose.yml
- Funcao: provisiona banco PostgreSQL 16 para desenvolvimento e testes locais com Prisma.

### Integracao 20 - Prisma migration aplicada
- Arquivo: prisma/migrations/20260403150346_init_leads/migration.sql
- Funcao: cria estrutura inicial de leads no Postgres local.

### Integracao 21 - CRM filtros avancados
- Arquivos:
  - src/modules/leads/dtos/list-leads-query.dto.ts
  - src/modules/leads/services/list-leads.service.ts
  - src/app/api/admin/leads/route.ts
  - src/components/admin/features/LeadFiltersBar.tsx
  - src/components/admin/features/AdminLeadsWorkspace.tsx
- Funcao: filtrar leads por status e busca textual com resposta paginada na API admin.

### Integracao 22 - Testes de rotas API
- Arquivos (amostra principal):
  - src/app/api/leads/route.test.ts
  - src/app/api/admin/login/route.test.ts
  - src/app/api/admin/logout/route.test.ts
  - src/app/api/admin/pixels/route.test.ts
  - src/app/api/admin/analytics/summary/route.test.ts
  - src/app/api/analytics/track/route.test.ts
  - src/app/api/admin/leads/[id]/status/route.test.ts
- Funcao: valida fluxos de sucesso/erro das APIs criticas para elevar cobertura de backend.

### Integracao 23 - Role enforcement em APIs admin
- Arquivos:
  - src/modules/auth/services/admin-request-auth.service.ts
  - src/app/api/admin/leads/route.ts
  - src/app/api/admin/leads/[id]/status/route.ts
  - src/app/api/admin/analytics/summary/route.ts
  - src/app/api/admin/pixels/route.ts
- Funcao: autorizacao por role com respostas semanticas (401 nao autenticado, 403 sem permissao).

### Integracao 24 - Docker app service
- Arquivos:
  - Dockerfile
  - docker-compose.yml
  - .dockerignore
- Funcao: sobe aplicacao Next.js em container, aplica `prisma migrate deploy` no startup e publica porta 3000.

### Integracao 25 - CRM notas internas de lead
- Arquivos:
  - src/modules/leads/dtos/create-lead-note.dto.ts
  - src/modules/leads/services/lead-note.service.ts
  - src/modules/leads/services/lead-note-storage.service.ts
  - src/app/api/admin/leads/[id]/notes/route.ts
  - src/components/admin/features/LeadNotesPanel.tsx
- Funcao: permite visualizar e criar notas internas por lead no CRM admin.

### Integracao 26 - CRM follow-up reminders
- Arquivos:
  - src/modules/leads/dtos/lead-follow-up.dto.ts
  - src/modules/leads/services/lead-follow-up.service.ts
  - src/modules/leads/services/lead-follow-up-storage.service.ts
  - src/app/api/admin/follow-ups/route.ts
  - src/app/api/admin/follow-ups/pending/route.ts
  - src/app/api/admin/follow-ups/pending-count/route.ts
  - src/app/api/admin/leads/[id]/follow-up/route.ts
  - src/components/admin/features/LeadFollowUpPanel.tsx
  - src/components/admin/features/PendingFollowUpsCard.tsx
  - src/components/admin/features/PendingFollowUpsList.tsx
- Funcao: define lembrete de follow-up por lead, lista/consulta follow-ups e exibe contagem de pendencias no dashboard admin.
- Atualizacao recente: fila de follow-ups pendentes no dashboard com acao rapida "Mark Done" (limpa `followUpAt` via API).

### Integracao 27 - Blog publico localizado
- Arquivos:
  - src/modules/blog/data/blog-posts.data.ts
  - src/modules/blog/docs/README.md
  - src/app/[locale]/blog/page.tsx
  - src/app/[locale]/blog/[slug]/page.tsx
  - src/components/public/features/BlogPostGrid.tsx
  - src/components/public/features/BlogPostArticle.tsx
  - src/components/shared/SiteHeader.tsx
- Funcao: adiciona listagem e detalhe de blog no front publico com conteudo EN/PT/ES e navegacao pelo header.

### Integracao 28 - Dashboard real + timeline + export CSV
- Arquivos:
  - src/modules/leads/services/lead-dashboard-metrics.service.ts
  - src/modules/leads/services/lead-activity.service.ts
  - src/modules/leads/services/lead-activity-storage.service.ts
  - src/app/(admin)/admin/page.tsx
  - src/app/api/admin/leads/[id]/activities/route.ts
  - src/app/api/admin/leads/export/route.ts
  - src/components/admin/features/LeadActivityTimeline.tsx
  - src/components/admin/features/AdminLeadsWorkspace.tsx
- Funcao: calcula KPIs reais no dashboard (leads do dia e conversao), registra historico de atividades por lead e permite exportacao CSV de leads filtrados no CRM.

### Integracao 29 - Paginas publicas adicionais + areas locais
- Arquivos:
  - src/app/[locale]/about/page.tsx
  - src/app/[locale]/faq/page.tsx
  - src/app/[locale]/areas/page.tsx
  - src/app/[locale]/areas/[city]/page.tsx
  - src/modules/areas/data/service-areas.data.ts
  - src/modules/areas/docs/README.md
  - src/components/public/features/FaqList.tsx
  - src/components/public/features/ServiceAreasGrid.tsx
- Funcao: adiciona paginas de autoridade e SEO local com FAQs e primeiras paginas de cidade (cluster inicial).

### Integracao 30 - SEO tecnico (sitemap + robots)
- Arquivos:
  - src/modules/seo/services/seo-routes.service.ts
  - src/modules/seo/docs/README.md
  - src/app/sitemap.ts
  - src/app/robots.ts
- Funcao: gera sitemap dinamico com rotas localizadas e conteudo dinamico (blog e cidades), alem de policy robots para indexacao publica com bloqueio de area admin.

---

## 5. Estrutura de Pastas (Estado Atual)

- src/app
- src/components/ui
- src/components/shared
- src/components/public
- src/components/admin
- src/modules
- src/i18n
- src/styles
- messages
- docs
- tests
- prisma

---

## 6. Rotas Implementadas

### Publicas
- / -> redireciona para /en
- /[locale] -> homepage localizada
- /[locale]/about
- /[locale]/faq
- /[locale]/areas
- /[locale]/areas/[city]
- /[locale]/services
- /[locale]/gallery
- /[locale]/blog
- /[locale]/blog/[slug]
- /[locale]/contact
- /[locale]/free-estimate
- /[locale]/not-found

### Admin
- /admin/login
- /admin
- /admin/leads
- /admin/analytics
- /admin/pixels

### API
- /api/leads (POST)
- /api/admin/login (POST)
- /api/admin/logout (POST)
- /api/admin/leads (GET)
- /api/admin/leads/[id]/status (PATCH)
- /api/analytics/track (POST)
- /api/admin/analytics/summary (GET)
- /api/admin/pixels (GET, PATCH)
- /api/admin/follow-ups (GET)
- /api/admin/follow-ups/pending (GET)
- /api/admin/follow-ups/pending-count (GET)
- /api/admin/leads/[id]/follow-up (GET, PATCH)
- /api/admin/leads/[id]/activities (GET)
- /api/admin/leads/export (GET)

### SEO tecnico
- /sitemap.xml
- /robots.txt

### Locale suportado
- en
- pt
- es

---

## 7. Componentes Implementados

### Reutilizaveis (UI)
1. AnimatedTitlePaint
- Arquivo: src/components/ui/AnimatedTitlePaint.tsx
- Funcao: titulo com efeito visual de pintura (paint reveal)
- Props: title, subtitle, align, className
- Testes: src/components/ui/AnimatedTitlePaint.test.tsx
- Docs: src/components/ui/AnimatedTitlePaint.md

2. ServiceShowcaseCard
- Arquivo: src/components/ui/ServiceShowcaseCard.tsx
- Funcao: card premium para destacar servicos
- Props: title, description, imageUrl, ctaLabel
- Testes: src/components/ui/ServiceShowcaseCard.test.tsx
- Docs: src/components/ui/ServiceShowcaseCard.md

### Compartilhados
3. LanguageSwitcher
- Arquivo: src/components/shared/LanguageSwitcher.tsx
- Funcao: alternar idioma EN/PT/ES mantendo rota atual por locale

4. SiteHeader
- Arquivo: src/components/shared/SiteHeader.tsx
- Funcao: header principal com links de navegacao e seletor de idioma

### Public Features (Homepage)
5. BeforeAfterShowcase
- Arquivo: src/components/public/features/BeforeAfterShowcase.tsx
- Funcao: bloco visual before/after para prova de transformacao
- Props: title, beforeLabel, afterLabel
- Testes: src/components/public/features/BeforeAfterShowcase.test.tsx
- Docs: src/components/public/features/BeforeAfterShowcase.md

6. TestimonialStrip
- Arquivo: src/components/public/features/TestimonialStrip.tsx
- Funcao: faixa de depoimentos para confianca e conversao
- Props: title, items[{quote, author, city}]
- Testes: src/components/public/features/TestimonialStrip.test.tsx
- Docs: src/components/public/features/TestimonialStrip.md

7. MobileStickyCta
- Arquivo: src/components/public/features/MobileStickyCta.tsx
- Funcao: CTA fixo no mobile para aumentar conversao
- Props: label
- Testes: src/components/public/features/MobileStickyCta.test.tsx
- Docs: src/components/public/features/MobileStickyCta.md

8. PageIntro
- Arquivo: src/components/public/sections/PageIntro.tsx
- Funcao: secao padrao de introducao para paginas publicas
- Props: eyebrow, title, description
- Testes: src/components/public/sections/PageIntro.test.tsx
- Docs: src/components/public/sections/PageIntro.md

9. GalleryProjectGrid
- Arquivo: src/components/public/features/GalleryProjectGrid.tsx
- Funcao: grid de projetos para pagina de galeria
- Props: title, projects
- Testes: src/components/public/features/GalleryProjectGrid.test.tsx
- Docs: src/components/public/features/GalleryProjectGrid.md

10. ContactPanel
- Arquivo: src/components/public/features/ContactPanel.tsx
- Funcao: bloco de contato com telefone, email e endereco
- Props: title, description, phone, email, address
- Testes: src/components/public/features/ContactPanel.test.tsx
- Docs: src/components/public/features/ContactPanel.md

11. EstimateFormPreview
- Arquivo: src/components/public/features/EstimateFormPreview.tsx
- Funcao: preview premium de formulario de orcamento
- Props: title, ctaLabel
- Testes: src/components/public/features/EstimateFormPreview.test.tsx
- Docs: src/components/public/features/EstimateFormPreview.md

12. EstimateLeadForm
- Arquivo: src/components/public/features/EstimateLeadForm.tsx
- Funcao: formulario client-side conectado ao endpoint /api/leads
- Props: ctaLabel, locale, placeholders, feedback
- Testes: src/components/public/features/EstimateLeadForm.test.tsx
- Docs: src/components/public/features/EstimateLeadForm.md

### Modulo de Leads (Backend)
13. createLeadSchema (DTO)
- Arquivo: src/modules/leads/dtos/create-lead.dto.ts
- Funcao: validar e tipar payload do lead
- Testes: src/modules/leads/tests/create-lead.dto.test.ts

14. captureLead (Service)
- Arquivo: src/modules/leads/services/lead-capture.service.ts
- Funcao: orquestrar validacao, persistencia e notificacao
- Testes: src/modules/leads/tests/lead-capture.service.test.ts

15. Lead module docs
- Arquivo: src/modules/leads/docs/README.md
- Funcao: documentacao tecnica do fluxo de captura de leads

### Admin Features
16. AdminLoginForm
- Arquivo: src/components/admin/features/AdminLoginForm.tsx
- Funcao: login client-side para autenticacao no endpoint admin
- Testes: src/components/admin/features/AdminLoginForm.test.tsx
- Docs: src/components/admin/features/AdminLoginForm.md

17. AdminLogoutButton
- Arquivo: src/components/admin/features/AdminLogoutButton.tsx
- Funcao: encerra sessao e redireciona para `/admin/login`
- Testes: src/components/admin/features/AdminLogoutButton.test.tsx
- Docs: src/components/admin/features/AdminLogoutButton.md

### Modulo de Auth (Backend)
18. auth.constants
- Arquivo: src/modules/auth/services/auth.constants.ts
- Funcao: centraliza constantes de cookie e TTL de sessao

19. admin-session.service
- Arquivo: src/modules/auth/services/admin-session.service.ts
- Funcao: emissao e verificacao de token assinado para painel admin
- Testes: src/modules/auth/tests/admin-session.service.test.ts

20. Auth module docs
- Arquivo: src/modules/auth/docs/README.md
- Funcao: documentacao tecnica da camada de autenticacao admin

21. LeadStatusBadge
- Arquivo: src/components/admin/features/LeadStatusBadge.tsx
- Funcao: badge visual para status do lead (NEW, CONTACTED, QUOTED, WON, LOST)
- Testes: src/components/admin/features/LeadStatusBadge.test.tsx
- Docs: src/components/admin/features/LeadStatusBadge.md

22. LeadPipelineBoard
- Arquivo: src/components/admin/features/LeadPipelineBoard.tsx
- Funcao: visao de pipeline por estagios de status para CRM admin
- Testes: src/components/admin/features/LeadPipelineBoard.test.tsx
- Docs: src/components/admin/features/LeadPipelineBoard.md

23. LeadInboxTable
- Arquivo: src/components/admin/features/LeadInboxTable.tsx
- Funcao: tabela de inbox com dados de lead e atualizacao de status
- Testes: src/components/admin/features/LeadInboxTable.test.tsx
- Docs: src/components/admin/features/LeadInboxTable.md

24. AdminLeadsWorkspace
- Arquivo: src/components/admin/features/AdminLeadsWorkspace.tsx
- Funcao: workspace client-side que integra listagem de leads, pipeline e mudanca de status via API
- Testes: src/components/admin/features/AdminLeadsWorkspace.test.tsx
- Docs: src/components/admin/features/AdminLeadsWorkspace.md

25. Admin leads APIs
- Arquivos:
  - src/app/api/admin/leads/route.ts
  - src/app/api/admin/leads/[id]/status/route.ts
  - src/modules/auth/services/admin-request-auth.service.ts
- Funcao: endpoints autenticados para listar leads e alterar status no CRM
- Integracao: validacao de sessao por cookie admin + validacao de status por schema

26. Lead status model
- Arquivos:
  - src/modules/leads/dtos/create-lead.dto.ts
  - src/modules/leads/services/lead-capture.service.ts
  - src/modules/leads/services/lead-storage.service.ts
- Funcao: adiciona status ao ciclo de vida do lead e normaliza registros legados
- Status default de novos leads: NEW

27. Analytics module (backend)
- Arquivos:
  - src/modules/analytics/dtos/track-event.dto.ts
  - src/modules/analytics/services/analytics-capture.service.ts
  - src/modules/analytics/services/analytics-storage.service.ts
  - src/modules/analytics/services/track-analytics.client.ts
  - src/modules/analytics/tests/track-event.dto.test.ts
  - src/modules/analytics/tests/analytics-capture.service.test.ts
  - src/modules/analytics/docs/README.md
- Funcao: captura de eventos de analytics e agregacao para visao administrativa

28. Pixels module (backend)
- Arquivos:
  - src/modules/pixels/dtos/pixel-settings.dto.ts
  - src/modules/pixels/services/pixel-settings.service.ts
  - src/modules/pixels/tests/pixel-settings.dto.test.ts
  - src/modules/pixels/tests/pixel-settings.service.test.ts
  - src/modules/pixels/docs/README.md
- Funcao: gestao de configuracao de pixels e persistencia local de settings

29. AdminAnalyticsOverview
- Arquivo: src/components/admin/features/AdminAnalyticsOverview.tsx
- Funcao: painel de metricas e top paginas do analytics
- Testes: src/components/admin/features/AdminAnalyticsOverview.test.tsx
- Docs: src/components/admin/features/AdminAnalyticsOverview.md

30. AdminPixelManagerForm
- Arquivo: src/components/admin/features/AdminPixelManagerForm.tsx
- Funcao: formulario de configuracao de IDs de pixels e toggle global
- Testes: src/components/admin/features/AdminPixelManagerForm.test.tsx
- Docs: src/components/admin/features/AdminPixelManagerForm.md

31. PixelScripts
- Arquivo: src/components/shared/PixelScripts.tsx
- Funcao: componente server-side para injetar scripts de pixels no layout raiz
- Testes: src/components/shared/PixelScripts.test.tsx
- Docs: src/components/shared/PixelScripts.md

32. Prisma leads persistence
- Arquivos:
  - prisma/schema.prisma
  - src/lib/prisma.ts
  - src/modules/leads/services/lead-prisma-storage.service.ts
  - src/modules/leads/services/lead-storage.service.ts
  - src/modules/leads/tests/lead-prisma-storage.service.test.ts
- Funcao: persistencia principal de leads em banco com fallback local resiliente

33. RBAC v1 (auth)
- Arquivos:
  - src/modules/auth/services/auth.constants.ts
  - src/modules/auth/services/admin-session.service.ts
  - src/modules/auth/services/admin-request-auth.service.ts
  - src/modules/auth/tests/admin-session.service.test.ts
  - src/modules/auth/tests/admin-request-auth.service.test.ts
  - src/modules/auth/docs/README.md
  - src/app/api/admin/login/route.ts
- Funcao: controle de papeis no token de sessao e validacao de autorizacao para rotas admin

34. CRM filtros avancados (leads)
- Arquivos:
  - src/modules/leads/dtos/list-leads-query.dto.ts
  - src/modules/leads/services/list-leads.service.ts
  - src/modules/leads/tests/list-leads-query.dto.test.ts
  - src/modules/leads/tests/list-leads.service.test.ts
  - src/app/api/admin/leads/route.test.ts
  - src/components/admin/features/LeadFiltersBar.tsx
  - src/components/admin/features/LeadFiltersBar.test.tsx
  - src/components/admin/features/LeadFiltersBar.md
- Funcao: consulta de leads com filtros e validacao de query params no CRM admin

35. RBAC API enforcement
- Arquivos:
  - src/modules/auth/services/admin-request-auth.service.ts
  - src/modules/auth/tests/admin-request-auth.service.test.ts
  - src/app/api/admin/leads/route.test.ts
  - src/app/api/admin/leads/[id]/status/route.test.ts
  - src/app/api/admin/analytics/summary/route.test.ts
  - src/app/api/admin/pixels/route.test.ts
- Funcao: cobertura de autorizacao por role em rotas admin com cenarios 401/403

36. API route coverage expansion
- Arquivos:
  - src/app/api/leads/route.test.ts
  - src/app/api/admin/login/route.test.ts
  - src/app/api/admin/logout/route.test.ts
  - src/app/api/analytics/track/route.test.ts
- Funcao: ampliar cobertura de fluxos de erro e sucesso das APIs centrais

37. CRM v2 lead notes
- Arquivos:
  - src/modules/leads/dtos/create-lead-note.dto.ts
  - src/modules/leads/tests/create-lead-note.dto.test.ts
  - src/modules/leads/services/lead-note.service.ts
  - src/modules/leads/tests/lead-note.service.test.ts
  - src/app/api/admin/leads/[id]/notes/route.ts
  - src/app/api/admin/leads/[id]/notes/route.test.ts
  - src/components/admin/features/LeadNotesPanel.tsx
  - src/components/admin/features/LeadNotesPanel.test.tsx
  - src/components/admin/features/LeadNotesPanel.md
- Funcao: habilita notas internas no fluxo operacional de CRM e integra ao workspace de leads

---

## 8. Sistema de Estilos e Motion

### Arquivos
- src/styles/globals.css
- src/styles/paint-motion.css

### Efeitos implementados
- Efeito paint sweep em titulos via classe .paint-title
- Respeito a preferencia de reduced motion
- Base visual com gradientes sutis e atmosfera premium
- Home com blocos premium adicionais: before/after, testimonials e CTA sticky mobile

---

## 9. Internacionalizacao (Detalhe tecnico)

### Configuracao
- src/i18n/routing.ts
  - locales: en, pt, es
  - defaultLocale: en
  - localePrefix: always

- src/i18n/request.ts
  - resolve locale
  - carrega mensagens por locale

- messages/en.json
- messages/pt.json
- messages/es.json

### Regras aplicadas
- Locale invalido retorna not-found
- Provider injeta mensagens no layout de locale
- Homepage com chaves de traducao expandidas (EN/PT/ES) para novas secoes premium
- Paginas publicas MVP com namespace de traducao dedicado: `Pages`
- Formulario de orcamento com placeholders e feedback localizados (EN/PT/ES)

---

## 10. Qualidade e Validacao

Ultima validacao executada:
- npm run lint -> OK
- npm run test -> OK (77 testes passando)
- npm run build -> OK

Validacao de ambiente local containerizado:
- Docker Desktop ativo e validado via `docker info`
- PostgreSQL local ativo via `docker compose up -d postgres`
- Migration aplicada com sucesso via Prisma no container local
- App Next.js ativo via `docker compose up -d --build` (porta 3000)
- Health operacional validado por request HTTP local (status 307 esperado para redirect)

Cobertura atual (baseline apos expansao de testes):
- `npm run test:coverage` -> 61.94% statements / 63.33% lines
- Progresso acumulado: cobertura global subiu de 49.27% para 61.94%

---

## 11. Integracoes Pendentes (Planejadas)

Ainda nao implementado no codigo, mas previsto no blueprint:
- Auth.js / NextAuth
- tRPC routers
- SEO local em escala (city pages + blog pipeline)

Variaveis de ambiente opcionais ja suportadas no lead capture:
- RESEND_API_KEY
- LEADS_NOTIFICATION_EMAIL

Variaveis de ambiente para admin auth:
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET

---

## 12. Protocolo de Atualizacao Deste Arquivo

Atualizar este arquivo sempre que houver qualquer nova entrega de:
- componente
- modulo
- integracao externa
- rota
- teste
- mudanca de arquitetura
- mudanca de stack

Checklist por item novo:
1. Nome do item
2. Arquivo(s)
3. Objetivo funcional
4. Dependencias/integracoes
5. Testes relacionados
6. Status (implementado, em progresso, pendente)

Regra operacional:
- Nenhum PR/entrega deve ser considerado completo sem atualizar este contexto.

---

## 13. Proximo Bloco de Implementacao Recomendado

1. Aplicar migration Prisma em ambiente Postgres real
2. RBAC expandido (SUPER_ADMIN, ADMIN, VIEWER) no painel
3. CRM v2 (filtros avancados, notas internas, follow-up e automacoes)
4. SEO local em escala (city pages + blog pipeline)
