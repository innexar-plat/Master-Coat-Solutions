# 🗺️ VINI PAINTING — Roadmap & Cronograma

## Visão Geral das Fases

```
FASE 1          FASE 2          FASE 3          FASE 4          FASE 5
Foundation      Core Site       Admin + CRM     Analytics +     Polish +
& Setup         & Public        & Content       Pixels          Launch
                                                
[██████████]    [██████████]    [██████████]    [██████████]    [██████████]
Sprint 1-2      Sprint 3-5      Sprint 6-8      Sprint 9-10     Sprint 11-12
~2 semanas      ~3 semanas      ~3 semanas      ~2 semanas      ~2 semanas
```

**Total estimado: 12 Sprints (~12 semanas / 3 meses)**

---

## FASE 1: Foundation & Setup (Sprint 1-2)

### Sprint 1 — Project Bootstrap
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 1.1 | Setup Next.js 14 + TypeScript + Tailwind | 2 |
| 1.2 | Setup Prisma + PostgreSQL (Neon.tech) | 3 |
| 1.3 | Setup tRPC + root router | 3 |
| 1.4 | Setup NextAuth.js v5 (credentials provider) | 5 |
| 1.5 | Setup shadcn/ui + design tokens (cores, fontes) | 2 |
| 1.6 | Criar seed script (admin user + dados iniciais) | 2 |
| 1.7 | Setup ESLint + Prettier + Husky | 1 |
| 1.8 | Setup Vercel deployment + env vars | 2 |
| 1.9 | Setup GitHub repo + branch strategy | 1 |
| **Total Sprint 1** | | **21 SP** |

### Sprint 2 — Auth + Admin Shell
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 2.1 | Login page (email + password) | 3 |
| 2.2 | Admin layout (sidebar, topbar, breadcrumbs) | 5 |
| 2.3 | Role-based middleware (SUPER_ADMIN, ADMIN, VIEWER) | 3 |
| 2.4 | Settings model + CRUD + admin page | 5 |
| 2.5 | User management (CRUD) | 3 |
| 2.6 | Audit log system | 3 |
| 2.7 | Setup Redis (Upstash) for rate limiting | 2 |
| 2.8 | Security headers middleware | 2 |
| **Total Sprint 2** | | **26 SP** |

### Entregáveis Fase 1:
- [x] Projeto rodando em Vercel
- [x] Login funcional
- [x] Admin panel shell com navegação
- [x] Database configurado
- [x] Settings básicas editáveis
- [x] Gestão de usuários

---

## FASE 2: Core Site & Public Pages (Sprint 3-5)

### Sprint 3 — Homepage + Layout Público
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 3.1 | Public layout (Header responsivo + Footer) | 5 |
| 3.2 | Homepage: Hero section (dinâmico via admin) | 3 |
| 3.3 | Homepage: Services overview grid | 3 |
| 3.4 | Homepage: About snippet | 2 |
| 3.5 | Homepage: Testimonials carousel | 3 |
| 3.6 | Homepage: CTA sections | 2 |
| 3.7 | Homepage: Footer completo | 3 |
| 3.8 | Mobile responsiveness audit | 2 |
| 3.9 | Contact form (React Hook Form + Zod) | 3 |
| 3.10 | Setup de arquitetura de componentes reutilizaveis + individuais | 3 |
| 3.11 | Setup de testes de componentes (base) + cobertura inicial | 3 |
| **Total Sprint 3** | | **32 SP** |

### Sprint 4 — Services + Gallery + Contact
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 4.1 | Services listing page | 3 |
| 4.2 | Service detail page com schema markup | 5 |
| 4.3 | Services admin CRUD | 5 |
| 4.4 | Gallery page (masonry grid + lightbox) | 5 |
| 4.5 | Gallery admin (upload + organize + before/after) | 8 |
| 4.6 | Contact page + Google Maps embed | 3 |
| 4.7 | About Us page | 2 |
| **Total Sprint 4** | | **31 SP** |

### Sprint 5 — Blog + City Pages + SEO Base
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 5.1 | Blog listing page + pagination | 3 |
| 5.2 | Blog post page + schema markup | 3 |
| 5.3 | Blog admin: Rich text editor (Tiptap) | 8 |
| 5.4 | Blog admin: Categories + Tags | 3 |
| 5.5 | City/Area pages (template + 5 cidades iniciais) | 5 |
| 5.6 | FAQ page com schema markup | 2 |
| 5.7 | Sitemap.xml dinâmico | 2 |
| 5.8 | robots.txt | 1 |
| 5.9 | Base meta tags + OG tags | 3 |
| **Total Sprint 5** | | **30 SP** |

### Entregáveis Fase 2:
- [x] Site público completo e navegável
- [x] Todas as páginas principais
- [x] Services com admin CRUD
- [x] Gallery com upload e organização
- [x] Blog funcional com editor rico
- [x] 5+ city pages para SEO
- [x] SEO básico configurado

---

## FASE 3: Admin Avançado + CRM (Sprint 6-8)

### Sprint 6 — Micro CRM Core
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 6.1 | Lead model + tRPC CRUD | 5 |
| 6.2 | Lead inbox (tabela com search/filter/sort) | 8 |
| 6.3 | Lead detail page (info + timeline) | 5 |
| 6.4 | Lead pipeline Kanban (drag & drop) | 8 |
| 6.5 | Notas internas por lead | 3 |
| 6.6 | Tags de lead | 2 |
| **Total Sprint 6** | | **31 SP** |

### Sprint 7 — CRM Advanced + Notifications
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 7.1 | Email notification: novo lead (Resend) | 3 |
| 7.2 | Email template para notificações | 3 |
| 7.3 | Lead follow-up reminders | 3 |
| 7.4 | Lead export CSV | 2 |
| 7.5 | CRM dashboard (métricas + gráficos) | 5 |
| 7.6 | UTM tracking capture on forms | 3 |
| 7.7 | Lead source attribution | 3 |
| 7.8 | Testimonials admin CRUD | 3 |
| **Total Sprint 7** | | **25 SP** |

### Sprint 8 — Landing Pages + Forms
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 8.1 | Landing page template system | 8 |
| 8.2 | Landing page admin builder | 8 |
| 8.3 | Free Estimate form page | 3 |
| 8.4 | Multi-step estimate form (optional) | 5 |
| 8.5 | Form analytics (starts, completions, drop-offs) | 3 |
| 8.6 | Admin: SEO editor por página | 3 |
| **Total Sprint 8** | | **30 SP** |

### Entregáveis Fase 3:
- [x] CRM funcional com pipeline
- [x] Notificações de leads por email
- [x] Landing page builder
- [x] Formulários otimizados
- [x] Testimonials gerenciáveis

---

## FASE 4: Analytics + Pixel Management (Sprint 9-10)

### Sprint 9 — Custom Analytics
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 9.1 | Analytics tracking script (client-side) | 5 |
| 9.2 | Tracking API endpoint | 3 |
| 9.3 | Analytics data model + aggregation | 5 |
| 9.4 | Analytics dashboard: pageviews + visitors | 5 |
| 9.5 | Analytics: top pages + sources | 3 |
| 9.6 | Analytics: device breakdown | 2 |
| **Total Sprint 9** | | **23 SP** |

### Sprint 10 — Pixels + Click Tracking
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 10.1 | Pixel manager admin page | 5 |
| 10.2 | GTM/GA4/Meta/Google Ads pixel injection | 5 |
| 10.3 | Conversion event firing (form submit, phone click) | 3 |
| 10.4 | Click tracking on CTAs | 3 |
| 10.5 | Scroll depth tracking | 2 |
| 10.6 | Conversion reports (admin) | 5 |
| 10.7 | UTM attribution reports | 3 |
| **Total Sprint 10** | | **26 SP** |

### Entregáveis Fase 4:
- [x] Analytics dashboard funcional
- [x] Pixel management via admin
- [x] Click e scroll tracking
- [x] Conversion tracking
- [x] UTM reports

---

## FASE 5: Polish + Launch (Sprint 11-12)

### Sprint 11 — Performance + SEO + Testing
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 11.1 | Lighthouse audit + optimization (target 90+) | 5 |
| 11.2 | Image optimization pass (Cloudinary) | 3 |
| 11.3 | Core Web Vitals optimization | 3 |
| 11.4 | Schema markup audit (todas as páginas) | 3 |
| 11.5 | Create remaining city pages (15+ cidades) | 5 |
| 11.6 | 404 e error pages | 2 |
| 11.7 | E2E tests (Playwright - critical flows) | 5 |
| 11.8 | Security audit (rate limiting, CSRF, XSS check) | 3 |
| 11.9 | Design polish: cards premium, animacoes e efeitos com tema pintura | 5 |
| 11.10 | Motion QA: performance de animacoes (60fps alvo) | 3 |
| **Total Sprint 11** | | **37 SP** |

### Sprint 12 — Final Polish + Launch
| Task | Descrição | Story Points |
|------|-----------|:------------:|
| 12.1 | Accessibility audit (WCAG 2.1 AA) | 3 |
| 12.2 | Cross-browser testing (Chrome, Safari, Firefox, Edge) | 3 |
| 12.3 | Mobile testing (iOS + Android) | 2 |
| 12.4 | PWA setup (manifest, service worker básico) | 3 |
| 12.5 | Cookie consent banner (CCPA) | 2 |
| 12.6 | Privacy Policy + Terms of Service pages | 2 |
| 12.7 | Setup domains + DNS + SSL | 2 |
| 12.8 | Google Search Console setup | 1 |
| 12.9 | Google Analytics 4 setup real | 1 |
| 12.10 | Load test básico | 2 |
| 12.11 | Final QA pass | 3 |
| 12.12 | Launch! 🚀 | 1 |
| **Total Sprint 12** | | **25 SP** |

### Entregáveis Fase 5:
- [x] Performance otimizada (90+ Lighthouse)
- [x] SEO completo
- [x] Testes automatizados
- [x] Segurança auditada
- [x] PWA funcional
- [x] SITE LIVE! 🎉

---

## Roadmap Pós-Launch (Fase 6+)

### V1.1 — Melhorias (Mês 4)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Online estimate calculator
- [ ] WhatsApp integration
- [ ] Email digest semanal de leads
- [ ] A/B testing para landing pages

### V1.2 — Expansão (Mês 5-6)
- [ ] Scheduling/Booking system
- [ ] Automated email sequences (nurture leads)
- [ ] Integration com Zapier
- [ ] SMS notifications (Twilio)
- [ ] Competitive analysis dashboard

### V2.0 — Enterprise (Mês 7+)
- [ ] Multi-location support
- [ ] Team management (assign leads to painters)
- [ ] Job tracking (em andamento, concluído)
- [ ] Invoice generation (básico)
- [ ] Customer portal
- [ ] Stripe payment integration
- [ ] Review request automation
- [ ] Referral tracking

---

## Dependências Críticas

```
Project Setup ──── Auth System ──── Admin Shell
      │                                  │
      │                     ┌────────────┤
      │                     │            │
      ▼                     ▼            ▼
  Database ────────── API Layer ──── Public Site
      │                     │            │
      │                     │            │
      ▼                     ▼            ▼
   Models ──────────── CRM ──────── Forms → Leads
                        │
                        ▼
                   Analytics ──── Pixels
                        │
                        ▼
                    Dashboard
```

---

## Definition of Done (DoD)

Uma feature é considerada "Done" quando:
- [ ] Código escrito e funcional
- [ ] TypeScript sem erros
- [ ] Mobile responsivo
- [ ] Acessibilidade básica (alt tags, aria labels, keyboard nav)
- [ ] SEO tags presentes (quando aplicável)
- [ ] Validação de inputs (Zod)
- [ ] Error handling
- [ ] Componente reutilizavel extraido quando houver repeticao
- [ ] Testes adicionados para novo modulo/componente
- [ ] Documentacao do modulo/componente atualizada
- [ ] Animacoes e efeitos validados em desktop e mobile
- [ ] Build sem erros
- [ ] Code review (se equipe)
- [ ] Testado no browser (Chrome + mobile)
