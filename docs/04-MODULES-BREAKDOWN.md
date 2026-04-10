# 📦 VINI PAINTING — Módulos de Negócio (Detalhado)

## Módulo 1: Website Público

### 1.1 Homepage
**Objetivo:** Primeira impressão profissional + conversão imediata

**Seções:**
1. **Hero Section**
   - Título dinâmico (editável via admin)
   - Subtítulo com proposta de valor
   - Background: imagem de trabalho ou vídeo curto
   - CTA primário: "Get a Free Estimate"
   - CTA secundário: "Call Now (407) XXX-XXXX"
   - Trust badges: Licensed, Insured, 5-Star Rated

2. **Services Overview**
   - Grid de 4-6 serviços principais com ícones
   - Link para página detalhada de cada serviço
   - Animação on-scroll

3. **About Snippet**
   - Foto da equipe
   - Breve história (2-3 parágrafos)
   - Anos de experiência + projetos completados
   - CTA: "Learn More About Us"

4. **Gallery Preview**
   - Before/After slider (3-4 projetos destaque)
   - Grid de 6 imagens mais recentes
   - CTA: "View Full Gallery"

5. **Testimonials**
   - Carousel de reviews com estrelas
   - Google Reviews widget integrado
   - CTA: "Read More Reviews"

6. **Service Areas**
   - Mapa interativo de Orlando e região
   - Lista de cidades atendidas
   - CTA: "Check If We Serve Your Area"

7. **Free Estimate CTA Section**
   - Formulário simplificado (nome, telefone, tipo de serviço)
   - Ou link para formulário completo

8. **Blog Preview**
   - 3 últimos posts
   - CTA: "Read Our Blog"

9. **Footer**
   - Logo + descrição curta
   - Links rápidos
   - Info de contato
   - Social media links
   - Google Map embed
   - Copyright + Legal links

### 1.2 Serviços
**Página principal** `/services`
- Lista de todos os serviços com descrição e imagem
- Filtro por tipo (residential/commercial)

**Página individual** `/services/[slug]`
- Descrição completa do serviço
- Galeria específica do serviço
- FAQ do serviço
- Schema markup (Service)
- CTA de orçamento
- Serviços relacionados

**Serviços planejados:**
- Interior House Painting
- Exterior House Painting
- Commercial Painting
- Cabinet Painting & Refinishing
- Pressure Washing
- Drywall Repair
- Popcorn Ceiling Removal
- Color Consultation
- Deck & Fence Staining
- Epoxy Garage Floor Coating

### 1.3 Galeria / Portfolio
**Página principal** `/gallery`
- Grid masonry com filtros (por serviço, cidade, tipo)
- Lightbox para visualização
- Before/After slider integrado

**Página de projeto** `/gallery/[slug]`
- Todas as fotos do projeto
- Before/After
- Descrição do trabalho
- Detalhes: cidade, tipo de serviço, duração
- Schema markup (ImageGallery)

### 1.4 Blog / Content Marketing
**Listagem** `/blog`
- Cards de blog posts com thumbnail
- Filtro por categoria
- Search bar
- Paginação

**Post** `/blog/[slug]`
- Artigo completo com Rich Text
- Table of Contents auto-gerado
- Share buttons
- Related posts
- CTA de estimativa
- Schema markup (Article, BlogPosting)

**Categorias planejadas:**
- Painting Tips & Tricks
- Color Trends
- Home Improvement
- Before & After Stories
- Orlando Area Guides
- DIY vs Professional

### 1.5 Páginas de Cidade (SEO Local)
**Página** `/areas/[city]`
Cada cidade terá uma página única com:
- H1: "Professional Painting Services in [City], FL"
- Conteúdo único sobre a cidade
- Serviços disponíveis na cidade
- Galeria de trabalhos na cidade
- Testimonials de clientes da cidade
- FAQ localizado
- Schema markup (LocalBusiness + areaServed)
- Google Maps embed

### 1.6 Landing Pages
**Página** `/lp/[slug]`
- Layout simplificado (sem menu completo)
- Foco total em conversão
- Formulário proeminente
- Testimonials selecionados
- Oferta/promoção específica
- UTM tracking
- Pixel events automáticos
- A/B testing support (futuro)

**Landing Pages planejadas:**
- `lp/interior-painting-orlando`
- `lp/exterior-painting-special`
- `lp/free-estimate`
- `lp/spring-special`
- `lp/cabinet-painting`

---

## Módulo 2: Painel Administrativo

### 2.1 Dashboard
- Total de leads (semana/mês)
- Leads por status (pipeline summary)
- Visitas ao site (hoje/semana/mês)
- Top páginas visitadas
- Taxa de conversão (visitas → leads)
- Leads por fonte (organic, paid, referral)
- Revenue pipeline (estimated value)
- Quick actions (novo post, ver leads, etc.)
- Últimos 5 leads
- Gráfico de leads por dia (últimos 30 dias)

### 2.2 Gerenciamento de Conteúdo

#### Páginas
- CRUD de páginas customizadas
- Editor visual (Tiptap)
- SEO settings por página (title, description, OG image)
- Preview antes de publicar
- Draft/Published status
- Schedule publication

#### Blog Posts
- CRUD completo
- Rich text editor (Tiptap) com:
  - Headers, bold, italic, links
  - Imagens inline
  - Code blocks
  - Embeds (YouTube, maps)
  - Lists, tables
- Categories e tags
- Featured image
- SEO settings (title, description, slug, canonical)
- Draft/Published/Scheduled
- Author attribution
- Reading time auto-calculated

#### Serviços
- CRUD de serviços
- Título, slug, descrição, ícone
- Galeria do serviço
- FAQ do serviço
- Preço estimado (opcional)
- Ordem de exibição (drag & drop)

#### Galeria / Portfolio
- Upload múltiplo de imagens
- Organização por projeto
- Before/After pareamento
- Tags e categorias
- Descrição do projeto
- Cidade/localização
- Ordering (drag & drop)
- Bulk operations (delete, categorize)

#### Testimonials
- CRUD de testimonials
- Nome, cidade, rating (1-5), texto
- Foto do cliente (opcional)
- Link para Google Review (opcional)
- Featured flag
- Data do review

#### Landing Pages
- Builder simplificado
- Sections: Hero, Form, Testimonials, CTA
- Customização de cores e textos
- Clone de landing pages existentes
- Preview link
- Published/Draft status
- UTM auto-configuration

### 2.3 Configurações Gerais do Site
- **Empresa:** Nome, logo, favicon, slogan
- **Contato:** Telefone, email, endereço, mapa
- **Social:** Facebook, Instagram, YouTube, Google Business
- **Aparência:** Cores primárias/secundárias, fontes
- **Header:** Menu items, CTA button text
- **Footer:** Links, textos, copyright
- **Horário:** Business hours
- **Licenças:** License number, insurance info
- **Notificações:** Email de notificação de leads

---

## Módulo 3: Micro CRM

### 3.1 Inbox de Leads
**Tabela principal com:**
- Nome, email, telefone
- Serviço de interesse
- Mensagem
- Fonte (formulário, landing page, telefone)
- UTM params (source, medium, campaign)
- Data de criação
- Status (badge colorido)
- Assigned to (futuro)

**Funcionalidades:**
- Search e filtros avançados
- Sort por qualquer coluna
- Bulk actions (change status, delete, export)
- Quick view modal
- Paginação + infinite scroll option

### 3.2 Pipeline de Leads (Kanban)
```
┌──────────┐ ┌───────────┐ ┌─────────┐ ┌───────┐ ┌──────┐
│   NEW    │→│ CONTACTED │→│ QUOTED  │→│  WON  │ │ LOST │
│          │ │           │ │         │ │       │ │      │
│ ████     │ │ ██        │ │ ███     │ │ ██    │ │ █    │
│ ████     │ │ ██        │ │         │ │       │ │      │
└──────────┘ └───────────┘ └─────────┘ └───────┘ └──────┘
```
- Drag & drop entre colunas
- Contagem por coluna
- Valor estimado por coluna (futuro)
- Quick actions em cada card

### 3.3 Detalhe do Lead
- Todas as informações do lead
- Timeline de interações:
  - "Lead criado via formulário de contato"
  - "Status alterado para Contacted"
  - "Nota adicionada: Ligou e agendou visita para segunda"
  - "Status alterado para Quoted - $2,500"
- Notas internas (textarea)
- Tags (urgent, VIP, repeat-customer, etc.)
- Valor estimado do serviço
- Follow-up date + reminder
- Documentos/fotos anexados (futuro)

### 3.4 Notificações
- Email instant: Novo lead recebido
- Email digest: Resumo diário de leads
- Browser notifications (admin logado)
- Reminder de follow-up
- Lead não contatado há X horas (alerta)

### 3.5 Relatórios CRM
- Leads por período
- Leads por fonte (organic vs paid vs direct)
- Leads por serviço
- Taxa de conversão (lead → won)
- Tempo médio de conversão
- Valor médio por lead won
- Leads por cidade
- Exportação CSV/PDF

---

## Módulo 4: Analytics & Tracking

### 4.1 Dashboard Analytics
- **Visão Geral:**
  - Pageviews (hoje/semana/mês)
  - Visitantes únicos
  - Bounce rate
  - Tempo médio na página
  - Páginas por sessão

- **Gráficos:**
  - Visitas por dia (line chart - 30 dias)
  - Top 10 páginas (bar chart)
  - Dispositivos (pie chart: mobile/desktop/tablet)
  - Fontes de tráfego (pie chart)
  - Horário de pico (heatmap)

### 4.2 Click Tracking
- Heatmap simplificado por página
- Top CTAs clicados
- Phone number clicks
- Form interaction tracking
- Scroll depth por página

### 4.3 Conversões
- Form submissions por página
- Conversion rate por landing page
- Top converting pages
- UTM attribution report
- Cost per lead (se integrado com ads spend - futuro)

### 4.4 Pixel Management
**Interface Admin:**
- Campo para Google Analytics 4 ID
- Campo para Meta Pixel ID
- Campo para Google Ads Conversion ID + Label
- Campo para TikTok Pixel ID
- Campo para Google Tag Manager Container ID
- Toggle enable/disable por pixel
- Custom scripts injection area
- Event mapping configuration

---

## Módulo 5: SEO Engine

### 5.1 Configuração Global SEO
- Default meta title template
- Default meta description
- Default OG image
- Site name
- robots.txt editor
- Sitemap settings

### 5.2 SEO Por Página
- Custom title
- Custom description
- Custom canonical URL
- Custom OG image
- noindex/nofollow toggles
- Schema markup type selection
- Preview: Google SERP, Facebook card, Twitter card

### 5.3 Automações SEO
- Sitemap.xml auto-gerado
- Schema markup automático:
  - LocalBusiness (homepage)
  - Service (serviços)
  - BlogPosting (blog)
  - FAQPage (FAQ)
  - ImageGallery (galeria)
  - BreadcrumbList (todas as páginas)
  - Review/AggregateRating (testimonials)
- Open Graph tags automáticas
- Canonical URLs automáticas
- Breadcrumbs automáticos
- Internal linking suggestions (futuro)

### 5.4 Local SEO Features
- Google Business Profile optimization guide
- NAP consistency (Name, Address, Phone)
- City pages com conteúdo único
- Local schema markup
- Service area map
- Driving directions integration
- Local phone number prominente
