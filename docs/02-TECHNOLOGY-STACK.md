# 🛠️ VINI PAINTING — Technology Stack

## Stack Principal: Next.js Full-Stack (T3-inspired)

### Justificativa da Escolha
- **Next.js 14+ (App Router):** SSR/SSG para SEO perfeito, Image Optimization nativo, API Routes integradas
- **React 19:** UI reativa e componentizada
- **TypeScript:** Type safety em todo o projeto
- **Custo baixo:** Hospedagem na Vercel (free tier suficiente para início)
- **Velocidade:** Lighthouse 95+ com zero config
- **Ecossistema:** Maior ecossistema de packages React

---

## Stack Completa

### Frontend (Website Público)
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| **Next.js** | 14.x+ | Framework principal (App Router) |
| **React** | 19.x | UI Library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Styling utility-first |
| **shadcn/ui** | latest | Componentes UI (Radix-based) |
| **Framer Motion** | 11.x | Animações e transições |
| **React Hook Form** | 7.x | Formulários com validação |
| **Zod** | 3.x | Schema validation |
| **next-intl** | 3.x | Internacionalização (EN default, PT-BR, ES) + detecção de locale |
| **next-seo** | latest | SEO meta tags management |
| **Swiper** | 11.x | Carousels e sliders |
| **react-compare-slider** | latest | Before/After de pinturas |

### Frontend (Admin Panel)
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| **shadcn/ui** | latest | Componentes admin (Tables, Forms, Charts) |
| **TanStack Table** | 8.x | Tabelas avançadas com sort/filter |
| **TanStack Query** | 5.x | Server state management + cache |
| **Recharts** | 2.x | Gráficos e dashboards |
| **React DnD** | 16.x | Drag & drop (galeria, pipeline) |
| **Tiptap** | 2.x | Rich text editor (blog posts) |
| **date-fns** | 3.x | Manipulação de datas |
| **Sonner** | latest | Toast notifications |

### Backend (API)
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| **Next.js API Routes** | 14.x | API endpoints (App Router) |
| **tRPC** | 11.x | Type-safe API layer |
| **Prisma** | 5.x | ORM + migrations |
| **NextAuth.js (Auth.js)** | 5.x | Autenticação e autorização |
| **Resend** | latest | Transactional emails |
| **Uploadthing** | latest | File/image uploads |
| **rate-limiter-flexible** | latest | Rate limiting API |
| **bcrypt** | latest | Password hashing |
| **jose** | latest | JWT handling |

### Database
| Tecnologia | Propósito |
|-----------|-----------|
| **PostgreSQL** | Database principal (Neon.tech free tier / Supabase) |
| **Prisma** | ORM + Schema management |
| **Redis (Upstash)** | Cache + Rate limiting + Sessions |

### Infrastructure & DevOps
| Tecnologia | Propósito |
|-----------|-----------|
| **Vercel** | Hosting + CDN + Edge Functions |
| **Neon.tech** | PostgreSQL serverless (ou Supabase) |
| **Upstash** | Redis serverless |
| **Cloudinary** | Image CDN + optimization + transformations |
| **GitHub** | Version control |
| **GitHub Actions** | CI/CD pipeline |
| **Sentry** | Error tracking e monitoring |
| **Vercel Analytics** | Web analytics built-in |

### SEO & Marketing
| Tecnologia | Propósito |
|-----------|-----------|
| **next-sitemap** | Geração automática de sitemap.xml |
| **Schema.org (JSON-LD)** | Structured data markup |
| **Google Tag Manager** | Container para todos os pixels |
| **Open Graph** | Social media cards |

### Testing
| Tecnologia | Propósito |
|-----------|-----------|
| **Vitest** | Unit tests |
| **Playwright** | E2E tests |
| **Testing Library** | Component tests |

### Development Tools
| Tecnologia | Propósito |
|-----------|-----------|
| **ESLint** | Linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **lint-staged** | Pre-commit checks |
| **commitlint** | Conventional commits |

---

## Custo Estimado Mensal (Infraestrutura)

### Início (MVP) — $0/mês
| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | $0 |
| Neon.tech | Free | $0 |
| Upstash Redis | Free | $0 |
| Cloudinary | Free (25GB) | $0 |
| Resend | Free (100 emails/dia) | $0 |
| Sentry | Free | $0 |
| **TOTAL** | | **$0/mês** |

### Crescimento — ~$45/mês
| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Pro | $20 |
| Neon.tech | Launch | $19 |
| Upstash Redis | Pay as you go | ~$1 |
| Cloudinary | Plus | $0 (upgrade se necessário) |
| Resend | Pro | $0 (upgrade se necessário) |
| Domínio (.com) | Annual/12 | ~$1 |
| **TOTAL** | | **~$41/mês** |

---

## Alternativas Consideradas e Rejeitadas

| Alternativa | Motivo da Rejeição |
|------------|-------------------|
| WordPress | Lento, inseguro, não escalável, difícil de customizar |
| Wix/Squarespace | Sem controle total, SEO limitado, sem CRM custom |
| Laravel + Vue | Over-engineering, custo de servidor maior, deploy mais complexo |
| Django + React | Dois codebases, mais complexo de manter |
| Gatsby | Slower builds, menor ecossistema, menos features |
| Remix | Menor ecossistema, menos hosting options |
| PHP puro | Antiquado, inseguro, sem type safety |

---

## Estrutura de Monorepo (Opcional futuro)

```
Se o projeto crescer, podemos migrar para Turborepo:
├── apps/
│   ├── web/          (site público)
│   └── admin/        (painel admin — pode ser mesma app com route groups)
├── packages/
│   ├── ui/           (componentes compartilhados)
│   ├── db/           (prisma schema + client)
│   ├── config/       (configs compartilhadas)
│   └── types/        (types compartilhados)
```

Para o MVP, tudo ficará em uma única aplicação Next.js com Route Groups:
```
app/
├── (public)/      → site público
├── (admin)/       → painel admin (protegido)
└── api/           → API routes

Estratégia de idioma no MVP:
- Locale padrão: `en`
- Locales suportados: `en`, `pt`, `es`
- Detecção automática via `Accept-Language` no middleware
- Se idioma do navegador não for suportado: fallback para `en`
- Language switcher no header persistindo preferência em cookie
```
