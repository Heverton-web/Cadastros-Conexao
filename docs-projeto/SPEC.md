# ⚙️ SPEC — Technical Specification

> **ERP Conexão** · Versão 1.0 · 04/07/2026
> **Stack:** React 19 · TanStack Router · Supabase · PostgreSQL · Docker

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  React 19 SPA · TanStack Router · Tailwind v4 · shadcn/ui   │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ AuthProvider│ │ React Query│ │ DesignSystem│ │ Zustand  │ │
│  │ (Context)   │ │ (Cache 60s)│ │ (Provider)  │ │ (Persist)│ │
│  └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └────┬─────┘ │
│         │              │              │            │        │
│  ┌──────┴──────────────┴──────────────┴────────────┴─────┐  │
│  │                    Registry Layer                       │  │
│  │  registerModule · registerPermission · registerNavItem │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────┴──────────────────────────────┐  │
│  │               Core Services Layer                      │  │
│  │  webhooks.ts · notificacoes.ts · atividades.ts         │  │
│  └────────────────────────┬──────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│              SUPABASE (Backend-as-a-Service)                  │
│  ┌────────────────────────┴──────────────────────────────┐  │
│  │                 PostgreSQL Database                      │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐ │  │
│  │  │ Auth (GoTrue)│ │ RLS Policies│ │ PL/pgSQL Functions│ │  │
│  │  │ (JWT, 2FA)   │ │ (70+)       │ │ (8+ RPCs)        │ │  │
│  │  └─────────────┘ └─────────────┘ └──────────────────┘ │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐ │  │
│  │  │ Migrations  │ │ Realtime    │ │ Storage          │ │  │
│  │  │ (73 .sql)   │ │ (WebSocket) │ │ (Documentos/PNG) │ │  │
│  │  └─────────────┘ └─────────────┘ └──────────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│              EXTERNAL APIs                                     │
│  Evolution API · ViaCEP/BrasilAPI · Google Maps · Gmail SMTP  │
└───────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

| Princípio | Aplicação |
|---|---|
| **Modular Monolith** | Módulos isolados no código, mesmo processo e banco |
| **Registry Pattern** | Módulos se registram, não importam outros módulos |
| **Multi-tenant** | Isolamento por `empresa_id` com RLS |
| **BaaS-first** | Supabase como backend, sem servidor Node.js dedicado |
| **Mobile-first** | Responsividade: breakpoints base/sm/md/lg |
| **Cache by default** | React Query staleTime de 60s |
| **Event-driven** | 54 eventos de módulo disparando webhooks/notificações |

---

## 2. Tech Stack

### 2.1 Frontend

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework UI | React | ^19.1.0 |
| Routing | TanStack Router | ^1.114.0 |
| Server State | TanStack Query | ^5.101.1 |
| Styling | Tailwind CSS v4 | ^4.1.0 |
| UI Library | shadcn/ui | 59+ componentes |
| Icons | Lucide React | ^0.487.0 |
| Forms | React Hook Form + Zod | ^7.80 + ^3.24 |
| Charts | Recharts | ^3.9.0 |
| Toast | react-hot-toast | ^2.5.2 |
| State (local/persist) | Zustand | ^5.0.14 |
| OCR | Tesseract.js | ^7.0.0 |
| PDF | jsPDF + jsPDF-AutoTable | ^4.2 + ^5.0 |
| QR Code | qrcode.react | ^4.2.0 |
| DnD | @dnd-kit | ^6.3.1 |
| i18n | i18next | ^26.3.3 |

### 2.2 Tooling

| Ferramenta | Versão | Uso |
|---|---|---|
| Vite | ^6.3.0 | Bundler |
| TypeScript | ^5.8.0 | Type safety |
| Vitest | ^4.1.9 | Unit tests |
| Playwright | ^1.61.1 | E2E tests |
| Storybook | ^10.4.6 | Component docs |
| Sentry | ^10.62.0 | Error monitoring |
| ESLint + Prettier | — | Lint/format |

### 2.3 Backend (BaaS)

| Serviço | Uso |
|---|---|
| Supabase Auth | Autenticação JWT, 2FA |
| Supabase Database | PostgreSQL (73 migrações) |
| Supabase Realtime | Notificações em tempo real |
| Supabase Storage | Upload de documentos |
| Supabase Edge Functions | Futuro (server-side) |

### 2.4 Infrastructure

| Componente | Versão/Especificação |
|---|---|
| Container | Docker + Docker Compose |
| Orchestration | Docker Swarm |
| Reverse Proxy | Traefik (HTTPS + Let's Encrypt) |
| Web Server | Nginx (alpine) |
| VPS | 167.86.69.79 |
| Registry | Docker Hub (hevertonperes/cadastros-conexao) |
| CI/CD | GitHub Actions |

---

## 3. Database Design

### 3.1 Schema Overview

```
public
├── empresas                  ← Core: entidade multi-tenant
├── empresas_config           ← Tema/logo por empresa
├── modulos_empresa           ← Módulos ativos por empresa
├── profiles                  ← Usuários (vinculados à empresa)
├── permissoes                ← Permissões granulares
│
├── cadastros                 ← Core: pipeline de cadastro
├── cadastros_pf              ← Dados pessoa física
├── cadastros_pj              ← Dados pessoa jurídica
├── cadastros_enderecos       ← Endereços
├── documentos                ← Documentos anexados
├── atividades                ← Audit log
│
├── webhooks                  ← Webhooks configurados
├── webhook_logs              ← Logs de execução
├── notificacoes              ← Notificações in-app
├── notificacoes_templates    ← Templates de notificação
├── api_connectors            ← Conectores de API
│
├── nps_perguntas             ← Perguntas NPS/CSAT
├── nps_respostas             ← Respostas das pesquisas
├── funis / funis_colunas / funis_tarefas / ...
├── hub_* (15 tabelas)        ← Gamificação e conteúdo
├── mapas_*                   ← Geolocalização
├── linktree_*                ← Páginas LinkTree
├── despesas / despesas_periodos / ...
├── rotas                     ← Planejamento de rotas
├── gerador_links             ← Links com UTM
└── marketing_* (14 tabelas)  ← Marketing digital
```

### 3.2 Multi-tenant Pattern

```sql
-- Toda tabela DEVE ter:
empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE

-- RLS Policy padrão:
CREATE POLICY "select_<tabela>_empresa" ON <tabela> FOR SELECT
  USING (
    is_super_admin_session()
    OR empresa_id = get_current_empresa_id()
  );
```

### 3.3 RPC Functions (8+)

| Função | Propósito |
|---|---|
| `is_super_admin_session()` | Verifica se usuário é super admin |
| `is_admin_or_super()` | Verifica se é admin de empresa ou super |
| `get_current_empresa_id()` | Retorna empresa do usuário logado |
| `pode_acessar_empresa(uuid)` | Verifica acesso a empresa específica |
| `enviar_whatsapp_evolution(text, text)` | Dispara WhatsApp via pg_net |
| `admin_criar_usuario(...)` | Cria usuário como super admin |
| `admin_atualizar_senha(uuid, text)` | Atualiza senha de usuário |
| `admin_deletar_usuario(uuid)` | Remove usuário do sistema |

---

## 4. Security Model

### 4.1 Authentication Flow

```
User → Login (email + password)
  → Supabase Auth (GoTrue)
  → JWT token gerado
  → AuthProvider busca profile
    ├── empresa_id (multi-tenant)
    ├── role (admin/viewer)
    └── is_super_admin (flag)
```

### 4.2 RLS Hierarchy

| Role | Acesso |
|---|---|
| `is_super_admin_session()` = true | **TODAS** as empresas e tabelas |
| `role = 'admin'` | Dados da própria empresa |
| `role = 'viewer'` | Apenas cadastros que criou + dados da empresa |
| Anônimo (sem auth) | Apenas rotas públicas (survey NPS, LinkTree, pré-cadastro) |

### 4.3 CORS & Security Headers

| Header | Valor |
|---|---|
| Content-Security-Policy | Configurado via Nginx |
| HTTPS | Obrigatório (Traefik + Let's Encrypt) |
| SSL | Forçado via redirect HTTP → HTTPS |

---

## 5. Module Architecture

### 5.1 Module Structure

```typescript
// src/features/<modulo>/
module.ts            ← Definição do módulo
permissions.ts       ← Permissões específicas
types.ts             ← Tipos TypeScript
services/            ← Camada de dados (Supabase)
hooks/               ← React Query hooks
components/          ← Componentes React
    dashboard/
    form/
    list/
```

### 5.2 Module Registration

```typescript
registerModule({
  key: "cadastros",
  nome: "Cadastros",
  descricao: "Gestão de cadastros de distribuidores",
  icon: ClipboardCheck,
  routes: ["/cadastros/dashboard", "/cadastros/solicitacoes", ...],
  ambientes: ["admin", "consultor"],
  abas: [{ key: "dashboard", label: "Dashboard" }],
  permissions: ["ver_todos_cadastros", "criar_cadastros", ...],
  events: [
    { key: "cadastro_aprovado", label: "Cadastro Aprovado", type: "status_change" },
    { key: "cadastro_reprovado", label: "Cadastro Reprovado", type: "status_change" },
  ],
  hasDesignConfig: true,
  setup: () => {
    registerPermissions();
    registerNavItems();
    registerDefaultPermissoes();
  },
});
```

### 5.3 Current Modules

| Módulo | Key | Rotas | Eventos | Permissões |
|---|---|---|---|---|
| Cadastros | `cadastros` | 7 | 6 + 11 legados | 8 |
| CRM | `crm` | 13 | 3 | 8 |
| Funis | `funis` | 5 | 12 | 8 |
| Hub | `hub` | 18 | 8 | 11 |
| NPS | `nps` | 7 | 3 | 5 |
| Mapas | `mapas` | 7 | 8 | 6 |
| Despesas | `despesas` | 6 | 7 | 9 |
| Rotas | `rotas` | 4 | 4 | 5 |
| LinkTree | `linktree` | 6 | 3 | 5 |
| Gerador Links | `gerador-links` | 9 | 0 | 4 |
| Marketing | `marketing` | 20 | 0 | 4 |
| Empresas | `empresas` | 16 | 0 | 5 |
| Global | `global` | 12 | — | 8 |
| **Total** | **13** | **~134** | **~54** | **~80** |

---

## 6. Event System

### 6.1 Architecture

```
Disparo (frontend)
  ↓
dispararWebhooks(evento, payload, empresaId)
  ↓
Busca:
  ├── notificacoes_templates (templates ativos)
  ├── webhooks (webhooks configurados)
  └── api_connectors (conectores ativos)
  ↓
Resolve placeholders {{tabela.coluna}}
  ↓
Ordena por prioridade
  ↓
Executa sequencialmente:
  ├── notification → dispararNotificacaoIndividual()
  ├── webhook → fetch() para URL externa
  └── api_connector → getActionExecutor()()
  ↓
Registra log em webhook_logs
```

### 6.2 Event Categories

| Categoria | Exemplos | Total |
|---|---|---|
| Status Change | `cadastro_aprovado`, `link_gerado` | 11 |
| Button Action | `botao_aprovar`, `botao_reprovar` | 5 |
| Módulo (geral) | `funil_criado`, `despesa_criada` | 38 |
| **Total** | | **54** |

---

## 7. Deployment

### 7.1 Docker Pipeline

```
Build (GitHub Actions ou local)
  → npm ci --legacy-peer-deps
  → npm run build (vite build)
  → Docker build (node:20-alpine + nginx:alpine)
  → Docker push para hevertonperes/cadastros-conexao
  → SSH na VPS
  → git pull
  → docker build (com build args)
  → docker push
  → docker service update
```

### 7.2 Multi-stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 7.3 Infrastructure

```
VPS: 167.86.69.79
Docker Swarm:
  ├── app (cadastros-conexao)
  ├── Traefik (reverse proxy + SSL)
  └── Redis (futuro)
```

---

## 8. Performance Targets

| Métrica | Target | Ferramenta |
|---|---|---|
| First Contentful Paint | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Time to Interactive | <3s | Lighthouse |
| Bundle Size (gzip) | <200KB | Vite analyze |
| React Query cache | 60s staleTime | Config |
| API response (Supabase) | <500ms | Supabase logs |
| Lighthouse score | >80 | CI check |
| K6 stress (RPS) | >1000 req/s | K6 |

---

## 9. Monitoring & Observability

### 9.1 Sentry

```typescript
// src/core/monitoring/sentry.ts
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.1,     // 10% das transações
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 9.2 Logging

| Tipo | Destino | Retenção |
|---|---|---|
| Error tracing | Sentry | 90 dias |
| Webhook execution | `webhook_logs` (DB) | Indeterminado |
| Activity audit | `atividades` (DB) | Indeterminado |
| Stress test metrics | K6 report | Under VCS |

---

## 10. Testing Strategy

| Nível | Ferramenta | Cobertura |
|---|---|---|
| Unit tests | Vitest | 31 testes |
| E2E | Playwright | 7 specs |
| Stress | K6 | 7 scripts (1000 RPS) |
| A11y | axe-core | Via Storybook |
| TypeScript | `tsc --noEmit` | Full project |

---

> **Documento gerado em:** 04/07/2026 | **Próxima revisão:** 04/08/2026
