# 🎨 VINI PAINTING — Project Blueprint

## Visão Geral do Projeto

**Nome:** Vini Painting (Website + Admin Platform)
**Tipo:** Website institucional + Painel Administrativo + Micro CRM
**Localização:** Orlando, FL — e cidades vizinhas
**Idioma Padrão do Site:** Inglês (EN)
**Idiomas Disponíveis no Site:** Inglês (EN), Português (PT-BR), Espanhol (ES)
**Comportamento de Idioma:** detectar idioma do navegador e aplicar automaticamente quando suportado
**Idioma do Admin:** Português/Inglês

---

## 1. Objetivos do Projeto

| # | Objetivo | Prioridade |
|---|----------|-----------|
| 1 | Website profissional de alta conversão para empresa de pintura | CRÍTICA |
| 2 | SEO local dominante em Orlando e região | CRÍTICA |
| 3 | Painel admin completo para gerenciar todo o site | ALTA |
| 4 | Micro CRM para captura e gestão de leads | ALTA |
| 5 | Sistema de galeria com portfolio de trabalhos | ALTA |
| 6 | Analytics e tracking de conversões | MÉDIA |
| 7 | Landing pages otimizadas para campanhas pagas | MÉDIA |
| 8 | Integração com pixels de ads (Meta/Google) | MÉDIA |
| 9 | Sistema de autenticação seguro | CRÍTICA |
| 10 | Blog/Content marketing para SEO | MÉDIA |

---

## 2. Público-Alvo

### Primário
- Proprietários de casas em Orlando e região
- Property managers
- Real estate agents
- Empresas comerciais pequenas/médias

### Secundário
- Construtoras
- HOAs (Homeowner Associations)
- Interior designers

### Área de Cobertura (Cidades)
- Orlando (principal)
- Kissimmee
- Winter Park
- Altamonte Springs
- Lake Mary
- Sanford
- Ocoee
- Winter Garden
- Clermont
- Daytona Beach
- Deltona
- St. Cloud
- Apopka
- Casselberry
- Longwood
- Maitland
- Windermere
- Dr. Phillips
- Lake Nona
- Celebration

---

## 3. Módulos do Sistema

### 3.1 WEBSITE PÚBLICO
- Homepage com hero section e CTA forte
- Página de Serviços (Interior, Exterior, Commercial, Cabinet, Pressure Washing)
- Galeria / Portfolio completo
- Página Sobre (About Us)
- Página de Contato
- Blog / Artigos SEO
- Páginas de cidade (SEO local)
- Landing Pages para campanhas
- Testimonials / Reviews
- FAQ
- Área de cobertura (service areas)
- Free Estimate form (formulário principal)
- Botão visível de troca de idioma (EN/PT/ES) em todas as páginas públicas
- Fallback obrigatório para inglês quando idioma do navegador não for suportado

### 3.2 PAINEL ADMINISTRATIVO
- Dashboard com métricas
- Configurações gerais do site (logo, cores, textos, telefone, endereço)
- Gerenciamento de páginas
- Gerenciamento de galeria/portfolio
- Gerenciamento de blog posts
- Gerenciamento de serviços
- Gerenciamento de testimonials
- Gerenciamento de landing pages
- Configuração de SEO por página
- Configuração de pixels (Meta, Google, TikTok)
- Gerenciamento de usuários
- Backup e manutenção
- Configuração de idioma padrão e controle de traduções por conteúdo

### 3.3 MICRO CRM
- Inbox de leads (formulário do site + landing pages)
- Pipeline de leads (New → Contacted → Quoted → Won → Lost)
- Histórico de interações por lead
- Tags e categorização
- Notas internas
- Status de follow-up
- Exportação CSV
- Notificações por email de novo lead
- Dashboard de conversão

### 3.4 ANALYTICS & TRACKING
- Dashboard de visitas e pageviews
- Click tracking em CTAs e botões
- Heatmap simplificado
- Tracking de formulários
- Conversão por landing page
- UTM parameter tracking
- Integração Google Analytics 4
- Relatórios semanais/mensais

### 3.5 SISTEMA DE AUTENTICAÇÃO
- Login seguro com email/senha
- Roles: Super Admin, Admin, Viewer
- Two-factor authentication (2FA)
- Session management
- Password recovery
- Audit log de ações

---

## 4. Funcionalidades Extras (Sugestões)

| Funcionalidade | Descrição | Valor |
|---------------|-----------|-------|
| **Estimativa Online** | Calculadora simples de estimativa por cômodo/área | Conversão |
| **Agendamento** | Calendário para agendar visitas de orçamento | Operacional |
| **WhatsApp/SMS** | Botão de WhatsApp + notificação SMS de leads | Conversão |
| **Google Reviews Widget** | Mostrar reviews do Google no site | Confiança |
| **Before/After Slider** | Comparação visual de trabalhos | Portfolio |
| **Multilíngue** | Suporte EN/ES/PT no site público | Alcance |
| **Speed Optimization** | Lighthouse 90+ score | SEO/UX |
| **PWA** | App-like experience no mobile | UX |
| **Schema Markup** | Structured data para rich snippets | SEO |
| **Sitemap Automático** | Geração automática de sitemap XML | SEO |
| **Email Marketing** | Integração com Mailchimp/SendGrid | Marketing |
| **QR Code Generator** | Para materiais impressos → landing page | Marketing |

---

## 5. Requisitos Não-Funcionais

- **Performance:** Lighthouse score > 90 (todas as métricas)
- **Mobile First:** 100% responsivo
- **Segurança:** OWASP Top 10 compliance
- **Uptime:** 99.9%
- **Backup:** Diário automático
- **SSL:** HTTPS obrigatório
- **GDPR/CCPA:** Compliance com cookies e privacidade
- **Acessibilidade:** WCAG 2.1 AA
- **SEO:** Core Web Vitals green
- **Frontend Quality Bar:** componentes reutilizaveis e organizados por dominio/camada
- **Testing Policy:** todo modulo/componente novo deve incluir testes
- **Documentation Policy:** todo modulo/componente novo deve incluir documentacao tecnica
- **Visual Direction:** interface premium com cards, efeitos e animacoes com identidade de pintura

---

## 7. Padrões de Engenharia Frontend (Obrigatório)

- Componentes devem ser separados entre:
	- componentes reutilizaveis globais
	- componentes individuais por feature/modulo
- Estrutura de pastas deve refletir responsabilidades (UI base, seções, features, templates).
- Ao criar novo modulo/componente, entregar no mesmo PR:
	- implementacao
	- testes (unitarios e/ou integracao conforme criticidade)
	- documentacao de uso, props, estados e exemplos
- Evitar duplicacao visual/funcional: extrair para componente reutilizavel sempre que houver repeticao.
- Frontend deve ter direcao visual consistente com nicho de pintura (texturas leves, movimentos de pincel, transicoes fluidas).

---

## 6. Integrações Planejadas

| Serviço | Propósito |
|---------|-----------|
| Google Analytics 4 | Analytics |
| Google Search Console | SEO monitoring |
| Google Business Profile | Local SEO |
| Meta Pixel (Facebook/Instagram) | Ads tracking |
| Google Ads Pixel | Ads tracking |
| TikTok Pixel | Ads tracking |
| Google Maps API | Mapa de cobertura |
| SendGrid / Resend | Transactional emails |
| Cloudinary / S3 | Image storage e optimization |
| Stripe (futuro) | Pagamentos online |
| Twilio (futuro) | SMS notifications |
| Zapier (futuro) | Automações |
