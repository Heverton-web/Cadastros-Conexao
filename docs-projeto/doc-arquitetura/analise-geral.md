# Análise de Arquitetura Geral — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## Sumário

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitetura Frontend](#2-arquitetura-frontend)
3. [Arquitetura de Dados (Backend)](#3-arquitetura-de-dados-backend)
4. [Arquitetura de Banco de Dados](#4-arquitetura-de-banco-de-dados)
5. [Camadas da Aplicação](#5-camadas-da-aplicação)
6. [Fluxo de Dados](#6-fluxo-de-dados)
7. [Diagrama de Componentes](#7-diagrama-de-componentes)
8. [Padrões de Projeto Identificados](#8-padrões-de-projeto-identificados)
9. [Decisões Arquiteturais](#9-decisões-arquiteturais)

---

## 1. Stack Tecnológico

### 1.1 Frontend (Single Page Application)

| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 19.1.0 | Biblioteca de UI |
| **TypeScript** | 5.8.0 | Tipagem estática |
| **Vite** | 6.3.0 | Bundler e dev server |
| **TanStack Router** | 1.114.0 | Roteamento SPA com file-based |
| **TanStack Query** | 5.101.1 | Data fetching e cache |
| **Tailwind CSS** | 4.1.0 | CSS utility-first |
| **shadcn/ui** (Radix) | — | 59+ componentes acessíveis |
| **React Hook Form** | 7.80.0 | Formulários |
| **Zod** | 3.24.2 | Validação de schemas |
| **Zustand** | 5.0.14 | Gerenciamento de estado |
| **Recharts** | 3.9.0 | Gráficos e visualizações |
| **Supabase JS** | 2.108.2 | Cliente Supabase |
| **Lucide React** | 0.487.0 | Ícones |
| **react-hot-toast** | 2.5.2 | Toast notifications |
| **Storybook** | 10.4.6 | Documentação de componentes |
| **Playwright** | 1.61.1 | Testes E2E |
| **Vitest** | 4.1.9 | Testes unitários |
| **Sentry** | 10.62.0 | Monitoramento de erros |
| **i18next** | 26.3.3 | Internacionalização |

### 1.2 Backend (Supabase)

| Tecnologia | Função |
|---|---|
| **Supabase Auth** | Autenticação (email/senha, JWT) |
| **Supabase PostgreSQL** | Banco de dados relacional |
| **Supabase RLS** | Row Level Security (controle de acesso) |
| **Supabase Storage** | Armazenamento de arquivos (logos, documentos) |
| **Supabase Functions** | (não utilizado — lógica no frontend) |
| **PostgreSQL RPCs** | Funções SQL armazenadas |
| **PostgreSQL Triggers** | Gatilhos automáticos (profile, permissoes) |

### 1.3 DevOps

| Tecnologia | Função |
|---|---|
| **Docker** | Containerização |
| **Docker Compose** | Orquestração local |
| **Nginx** | Reverse proxy |
| **VPS** | 167.86.69.79 (deploy) |
| **Docker Hub** | hevertonperes/cadastros-conexao |

---

## 2. Arquitetura Frontend

### 2.1 Estrutura de Diretórios

```
src/
├── main.tsx                          # Entry point
├── routeTree.gen.ts                  # Rotas geradas automaticamente
│
├── routes/                           # Rotas (TanStack Router file-based)
│   ├── __root.tsx                    # Root layout (DesignSystemProvider + Toaster)
│   ├── _auth.tsx                     # Auth guard layout (setup de módulos)
│   ├── index.tsx                     # Landing page
│   ├── auth.login.tsx                # Login
│   ├── auth.cadastro.tsx             # Cadastro
│   ├── cadastros.*.tsx               # Rotas do módulo Cadastros
│   ├── nps.*.tsx                     # Rotas do módulo NPS
│   ├── mapas.*.tsx                   # Rotas do módulo Mapas
│   ├── empresa.*.tsx                 # Rotas de empresa
│   ├── global.*.tsx                  # Rotas globais (Super Admin)
│   └── ...                           # Demais módulos
│
├── components/
│   ├── ui/                           # shadcn/ui (59 componentes)
│   └── layout/                       # Layout da aplicação (sidebar, navbar)
│
├── features/                         # Módulos independentes
│   ├── cadastros/                    # Módulo Cadastros
│   │   ├── module.ts                 # Definição do módulo
│   │   ├── permissions.ts            # Permissões granulares
│   │   ├── types.ts                  # Types do módulo
│   │   └── components/               # Componentes visuais
│   ├── nps/                          # Módulo NPS
│   │   ├── module.ts
│   │   ├── permissions.ts
│   │   ├── theme.ts                  # 58+ tokens NPS
│   │   ├── NpsBackground.tsx
│   │   └── components/
│   ├── mapas/                        # Módulo Mapas
│   │   ├── module.ts
│   │   ├── permissions.ts
│   │   ├── types.ts
│   │   └── components/
│   └── ...                           # Demais módulos
│
├── registry/                         # Sistema de registro central
│   ├── index.ts                      # Re-exports
│   ├── modules.ts                    # ModuleDefinition + registerModule()
│   ├── nav-items.ts                  # NavItemRegistration + registerNavItem()
│   ├── permissions-registry.ts       # PermissionDefinition + registerPermission()
│   ├── defaults.ts                   # PermissionDefaults + registerPermissionDefaults()
│   └── executors.ts                  # Action executors
│
├── core/                             # Core da aplicação
│   ├── auth/                         # AuthProvider (contexto de autenticação)
│   ├── empresa/                      # EmpresaProvider (contexto de empresa)
│   ├── permissions/                  # Permissions services
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── services.ts
│   ├── supabase/                     # Cliente Supabase
│   ├── theme/                        # Theme provider
│   ├── services/                     # Serviços compartilhados
│   │   ├── notificacoes.ts
│   │   ├── webhooks.ts
│   │   └── atividades.ts
│   └── monitoring/                   # Sentry
│
├── design-system/                    # Sistema de Design
│   ├── tokens/                       # Tokens de design
│   │   ├── types.ts
│   │   ├── css-var-map.ts
│   │   ├── resolver.ts
│   │   └── presets/                  # dark-gold, dark-blue, etc.
│   ├── provider/                     # DesignSystemProvider
│   ├── services/                     # Design queries + service
│   ├── hooks/                        # Hooks de design
│   └── components/                   # ModuloDesignPage
│
├── styles/
│   └── globals.css                   # Tailwind v4 + tokens CSS
│
├── lib/
│   ├── auth/                         # Hook useAuth()
│   └── utils.ts                      # cn() helper
│
├── shared/                           # Código compartilhado
│   └── empresas/                     # Serviços de empresa
│       ├── service.ts
│       └── types.ts
│
└── pwa/                              # Service Worker
```

### 2.2 Sistema de Rotas (TanStack Router)

```
Layout Hierarchy:

__root.tsx ──────────────────────────────────────────────
│  DesignSystemProvider + Toaster                        │
│  └── Outlet                                            │
│                                                        │
│  auth.login.tsx (público)                              │
│  auth.cadastro.tsx (público)                           │
│  index.tsx (público)                                   │
│                                                        │
│  _auth.tsx ─── AuthGuard ─────────────────────────     │
│  │  Verifica sessão → setup de módulos → AppLayout     │
│  │  └── Outlet                                         │
│  │                                                     │
│  │  cadastros.dashboard.tsx                            │
│  │  cadastros.clientes.tsx                             │
│  │  nps.dashboard.tsx                                  │
│  │  mapas.distribuidores.tsx                           │
│  │  empresa.tsx (dados da empresa)                     │
│  │  empresa.permissoes.tsx                             │
│  │  global.empresas.tsx                                │
│  │  ...                                                │
└─────────────────────────────────────────────────────────
```

### 2.3 Bootstrap da Aplicação

O fluxo de inicialização é:

```
1. Vite carrega index.html → main.tsx
2. main.tsx:
   a. initSentry()
   b. registerModule() para TODOS os módulos (24 módulos no total)
   c. createRouter(routeTree)
   d. Render: QueryClientProvider > AuthProvider > RouterProvider

3. __root.tsx renderiza: DesignSystemProvider > Toaster > Outlet

4. _auth.tsx (AuthGuard):
   a. useAuth() carrega user, profile, permissoes, modulosAtivos
   b. Itera sobre módulos ativos → chama mod.setup() para cada
   c. setup() registra nav-items com permissionCheck
   d. Se super_admin, refreshPermissoes()
   e. Renderiza AppLayout (sidebar + navbar + content)
```

### 2.4 Sistema de Registry

O coração da arquitetura é o **Registry**, que mantém 4 registries em memória:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           REGISTRY (em memória)                      │
│                                                                      │
│  ModuleRegistry (Map<key, ModuleDefinition>)                         │
│  ├── PermissionsRegistry (Map<key, PermissionDefinition>)           │
│  ├── NavItemsRegistry (Map<id, NavItemRegistration>)                │
│  └── DefaultsRegistry (Map<moduleKey, PermissionDefaults>)          │
└─────────────────────────────────────────────────────────────────────┘
```

- **ModuleRegistry**: Mantém definições de todos os módulos registrados
- **PermissionsRegistry**: Mantém definições de todas as permissões (~100)
- **NavItemsRegistry**: Mantém itens de navegação com `permissionCheck()`
- **DefaultsRegistry**: Mantém defaults de permissão por ambiente

### 2.5 Sistema de Design (Design System)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DESIGN SYSTEM                                 │
│                                                                      │
│  globals.css ─── 85+ tokens CSS (--color-*, --radius-*, etc.)       │
│       ↓                                                              │
│  Design Tokens (src/design-system/tokens/)                           │
│  ├── types.ts ─── DesignTokens interface                             │
│  ├── css-var-map.ts ─── mapeia tokens → CSS variables               │
│  ├── resolver.ts ─── resolve 4 níveis de override                   │
│  └── presets/ ─── dark-gold, dark-blue, dark-emerald, light-clean   │
│       ↓                                                              │
│  Resolução: Preset → Global Override → Empresa Override → Módulo    │
│       ↓                                                              │
│  DesignSystemProvider (src/design-system/provider/)                  │
│  ├── Aplica tokens no documentElement                                │
│  ├── ModuleDesignProvider (override por módulo)                      │
│  └── ModuloDesignPage (UI de customização)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Arquitetura de Dados (Backend)

### 3.1 Single Page Application (SPA) Puro

O ERP Conexão é uma **SPA pura** — não há backend Node.js próprio. O frontend React se comunica **diretamente com o Supabase** via cliente JS.

```
Browser (React SPA)
    │
    ├── supabase.from("tabela").select()  ← Queries SQL via REST
    ├── supabase.rpc("funcao", params)    ← Funções PostgreSQL
    ├── supabase.auth.*()                  ← Autenticação
    └── supabase.storage.*()              ← Arquivos
         │
         ▼
    Supabase Cloud (PostgreSQL + Auth + Storage)
```

### 3.2 Padrão de Acesso a Dados

```typescript
// 1. Serviços (ex: src/shared/empresas/service.ts)
import { supabase } from "~/core/supabase";

export async function listarEmpresas(): Promise<Empresa[]> {
  const { data } = await supabase
    .from("empresas")
    .select("*")
    .order("nome");
  return (data ?? []) as Empresa[];
}

// 2. React Query (ex: src/design-system/services/design-system.queries.ts)
import { useQuery } from "@tanstack/react-query";

export function useDesignGlobalQuery() {
  return useQuery({
    queryKey: ["design-system-global"],
    queryFn: () => buscarDesignGlobal(),
  });
}

// 3. Componentes usam hooks
function MinhaPagina() {
  const { data, isLoading } = useDesignGlobalQuery();
  // ...
}
```

### 3.3 Segurança em 3 Camadas

```
CAMADA 1 — Supabase RLS (Row Level Security)
  ├── is_super_admin_session() → bypass total
  ├── empresa_id = get_current_empresa_id() → multi-tenancy
  └── auth.uid() = usuario_id → próprio registro

CAMADA 2 — Registry + permissionCheck (frontend)
  ├── registerNavItem({ permissionCheck: (perms) => perms?.chave === true })
  ├── getNavItems(perms) → filtra menu lateral
  └── Componentes usam useAuth().permissoes para render condicional

CAMADA 3 — AuthProvider (contexto React)
  ├── Carrega profile + permissoes no login
  ├── Super admin → todas permissões true
  └── ModulosAcesso + permissoes flat → merge
```

---

## 4. Arquitetura de Banco de Dados

### 4.1 Estrutura Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL (Supabase)                        │
│                                                                      │
│  1. Tabelas de Infraestrutura (14 tabelas)                          │
│     profiles, permissoes, atividades, notificacoes, webhooks,       │
│     documentos, credenciais, app_config, integracoes_config,        │
│     form_schema, mock_credentials, webhook_logs,                    │
│     logs_transferencia, logs_transferencia_consultor                 │
│                                                                      │
│  2. Tabelas Core Empresa (4 tabelas)                                │
│     empresas, empresas_config, modulos_empresa,                     │
│     empresa_modulo_limits                                           │
│                                                                      │
│  3. Tabelas de Módulos (45+ tabelas, ~94 no total)                 │
│     cadastros_*, nps_*, mapas_*, linktree_*, gerador_*,            │
│     rotas_*, despesas_*, crm/pipeline_*, funis_*, mktg_*,          │
│     hub_*                                                           │
│                                                                      │
│  4. ENUMs (8+)                                                      │
│     hub_app_role, hub_material_type, hub_progress_status,           │
│     hub_badge_trigger, mapa_categoria, ...                          │
│                                                                      │
│  5. Views (5+)                                                      │
│     clientes, ...                                                   │
│                                                                      │
│  6. RPCs (17+)                                                      │
│     get_current_empresa_id, is_super_admin_session,                 │
│     admin_criar_usuario, admin_atualizar_senha,                     │
│     admin_deletar_usuario, check_empresa_modulo_limit,              │
│     get_user_permissoes, set_user_permissoes, ...                   │
│                                                                      │
│  7. Triggers (4+)                                                   │
│     handle_new_user → cria profile                                  │
│     handle_new_profile_permissoes → insere permissoes padrão        │
│     ...                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Padrão Multi-tenant

Toda tabela de negócio possui coluna `empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE`.

```sql
-- Padrão de criação de tabela
CREATE TABLE modulo_tabela (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  -- campos específicos do módulo
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Padrão de RLS (aplicado a TODAS as tabelas)
ALTER TABLE modulo_tabela ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RLS modulo_tabela" ON modulo_tabela FOR ALL
  TO authenticated
  USING (is_super_admin_session() OR empresa_id = get_current_empresa_id())
  WITH CHECK (is_super_admin_session() OR empresa_id = get_current_empresa_id());
```

### 4.3 Tabelas por Módulo

| Módulo | Tabelas | Prefixo |
|---|---|---|
| Empresa (Core) | 4 | `empresas`, `empresas_config`, `modulos_empresa`, `empresa_modulo_limits` |
| Cadastros | 6 | `cadastros`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos` |
| NPS | 4 | `nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio` |
| Mapas | 2 | `mapas_distributors`, `mapas_consultants` |
| LinkTree | 6 | `linktree_colaboradores`, `linktree_tema_config`, `linktree_empresa_*` |
| Gerador Links | 3 | `gerador_links`, `gerador_templates`, `gerador_link_cliques` |
| Rotas | ~4 | `rotas_*` |
| Despesas | 6 | `despesas_tipos`, `despesas_config`, `despesas_periodos`, `despesas`, `despesas_envios`, `despesas_pagamentos` |
| CRM | 10+ | `pipeline_estagios`, `tarefas`, `templates_mensagem`, `metas`, `usuarios`, `clientes`, `visitas`, `logs_transferencia` |
| Funis | 7 | `funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`, `funis_templates`, `funis_template_cols`, `funis_template_tasks` |
| Marketing | 14 | `mktg_*` |
| Hub | 15 | `hub_*` |

---

## 5. Camadas da Aplicação

### 5.1 Diagrama de Camadas

```
┌──────────────────────────────────────────────────────────────────────┐
│  CAMADA DE APRESENTAÇÃO                                              │
│  ┌──────────────┐ ┌──────────────┐                                  │
│  │ Rotas (SPA)  │ │ shadcn/ui    │                                  │
│  │ (TanStack    │ │ (59+ comps)  │                                  │
│  │  Router)     │ │              │                                  │
│  └──────┬───────┘ └──────┬───────┘                                  │
│         │                │                                           │
│  ┌──────┴────────────────┴───────┐                                  │
│  │      Componentes React         │                                  │
│  │  (features/*/components/*)     │                                  │
│  └──────────────┬─────────────────┘                                  │
├─────────────────┼────────────────────────────────────────────────────┤
│  CAMADA DE      │                                                    │
│  NEGÓCIO        │                                                    │
│  ┌──────────────┴──────────────┐                                    │
│  │   Módulos (features/*/)     │                                    │
│  │   module.ts + permissions    │                                    │
│  │   +components + services    │                                    │
│  └──────────────┬──────────────┘                                    │
│                 │                                                     │
│  ┌──────────────┴──────────────┐                                    │
│  │   Registry                  │                                    │
│  │   (registerModule,          │                                    │
│  │    registerNavItem,         │                                    │
│  │    registerPermission)      │                                    │
│  └──────────────┬──────────────┘                                    │
├─────────────────┼────────────────────────────────────────────────────┤
│  CAMADA DE      │                                                    │
│  SERVIÇOS       │                                                    │
│  ┌──────────────┴──────────────┐                                    │
│  │   Core Services             │                                    │
│  │   (auth, empresa,           │                                    │
│  │    permissions,             │                                    │
│  │    supabase, design-system) │                                    │
│  └──────────────┬──────────────┘                                    │
├─────────────────┼────────────────────────────────────────────────────┤
│  CAMADA DE      │                                                    │
│  DADOS          │                                                    │
│  ┌──────────────┴──────────────┐ ┌──────────────┐                  │
│  │   Supabase Client           │ │ React Query   │                  │
│  │   (SQL queries + RPCs)      │ │ (cache)       │                  │
│  └──────────────┬──────────────┘ └──────────────┘                  │
├─────────────────┼────────────────────────────────────────────────────┤
│  CAMADA DE      │                                                    │
│  INFRA          │                                                    │
│  ┌──────────────┴──────────────────────────────────────────────────┐ │
│  │   Supabase Cloud (PostgreSQL + Auth + Storage + RLS)            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.2 Fluxo de Requisição Típico

```
Usuário acessa /nps/dashboard
    │
    ▼
TanStack Router encontra nps.dashboard.tsx
    │
    ▼
AuthGuard (em _auth.tsx) verifica sessão
    │
    ▼
useAuth() → AuthProvider carrega:
  ├── user (supabase.auth.getUser())
  ├── profile (SELECT * FROM profiles)
  ├── permissoes (SELECT * FROM permissoes)
  └── empresaContext (EmpresaProvider → SELECT * FROM empresas, empresas_config)
    │
    ▼
setup() do módulo NPS registra nav-items
    │
    ▼
AppLayout renderiza sidebar com nav-items filtrados por permissionCheck()
    │
    ▼
Componente NpsDashboardPage renderiza:
  ├── useDesignGlobalQuery() → React Query → cache → render
  ├── supabase.from("nps_respostas").select() → data → gráficos
  └── RLS filtra por empresa_id automaticamente
    │
    ▼
Usuário vê dashboard com KPIs e gráficos
```

---

## 6. Fluxo de Dados

### 6.1 Ciclo Completo de Dados

```
1. React Query inicia com staleTime: 60s
2. Componente monta → useQuery() dispara
3. Função queryFn chama supabase.from().select()
4. Supabase REST API recebe requisição com JWT
5. RLS verifica: is_super_admin ou empresa_id match
6. PostgreSQL executa query
7. Dados retornam → React Query cacheia
8. Componente renderiza com dados
9. Mutations (insert/update/delete) invalidam cache
```

### 6.2 Padrão de Mutations

```typescript
// Exemplo de mutation pattern
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (data) => supabase.from("tabela").insert(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["query-key"] });
    toast.success("Sucesso!");
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

---

## 7. Diagrama de Componentes

```
┌───────────────────────────────────────────────────────────────────┐
│                         APPLICATION                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │                   QueryClientProvider                     │     │
│  │  ┌────────────────────────────────────────────────────┐  │     │
│  │  │                   AuthProvider                      │  │     │
│  │  │  ┌──────────────────────────────────────────────┐  │  │     │
│  │  │  │               EmpresaProvider                 │  │  │     │
│  │  │  │  ┌────────────────────────────────────────┐  │  │  │     │
│  │  │  │  │           RouterProvider                │  │  │  │     │
│  │  │  │  │  ┌──────────────────────────────────┐  │  │  │  │     │
│  │  │  │  │  │       DesignSystemProvider        │  │  │  │  │     │
│  │  │  │  │  │  ┌────────────────────────────┐  │  │  │  │  │     │
│  │  │  │  │  │  │      AppLayout              │  │  │  │  │  │     │
│  │  │  │  │  │  │  ┌────┐ ┌───────────────┐  │  │  │  │  │  │     │
│  │  │  │  │  │  │  │Nav│ │   Content      │  │  │  │  │  │  │     │
│  │  │  │  │  │  │  │Bar│ │   (Outlet)     │  │  │  │  │  │  │     │
│  │  │  │  │  │  │  └────┘ └───────────────┘  │  │  │  │  │  │     │
│  │  │  │  │  │  └────────────────────────────┘  │  │  │  │  │     │
│  │  │  │  │  └──────────────────────────────────┘  │  │  │  │     │
│  │  │  │  └────────────────────────────────────────┘  │  │  │     │
│  │  │  └──────────────────────────────────────────────┘  │  │     │
│  │  └────────────────────────────────────────────────────┘  │     │
│  └──────────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────┘
```

---

## 8. Padrões de Projeto Identificados

### 8.1 Plugin Registry Pattern

O sistema de **Registry** é o padrão central — módulos se registram e a aplicação descobre funcionalidades dinamicamente.

```typescript
// Registro
registerModule(cadastrosModule);

// Descoberta
const modulos = getAllModules();
const mod = getModule("cadastros");
```

### 8.2 Provider Pattern (Context API)

```
DesignSystemProvider ─── Tokens CSS globais
  └── AuthProvider ─── user, profile, permissoes
       └── EmpresaProvider ─── empresa, config
            └── ModuleDesignProvider ─── tokens do módulo
```

### 8.3 Feature-Sliced Design (Modular)

Cada módulo em `src/features/<modulo>/` é **auto-contido**:
```
module.ts      → Definição, rotas, setup()
permissions.ts → Permissões granulares
types.ts       → Types específicos
components/    → Componentes visuais
```

### 8.4 Repository Pattern (Serviços)

Serviços em `src/shared/` ou `src/core/services/` encapsulam acesso a dados:
```typescript
export async function listarEmpresas(): Promise<Empresa[]> {
  // Implementação isolada
}
```

### 8.5 Fluxo Unidirecional

```
Interação do usuário → Mutation (React Query) → Supabase → RLS → PostgreSQL
                                                      ↓
                                               Invalida cache
                                                      ↓
                                               Re-renderiza UI
```

### 8.6 Multi-tenancy via empresa_id

Toda tabela tem `empresa_id`. RLS filtra automaticamente. O `AuthProvider` + `EmpresaProvider` garantem que o contexto correto seja usado.

---

## 9. Decisões Arquiteturais

### 9.1 Por que SPA sem backend próprio?

- **Simplicidade:** Supabase elimina necessidade de backend Node.js
- **Custo:** Menos infraestrutura para gerenciar
- **Velocidade:** Frontend se comunica diretamente com banco
- **Segurança:** RLS garante isolamento multi-tenant

### 9.2 Por que Registry em memória (não no banco)?

- **Performance:** Definições de módulos são estáticas e pequenas
- **Simplicidade:** Não precisa consultar banco para saber quais módulos existem
- **Flexibilidade:** Permite registro dinâmico baseado em permissões

### 9.3 Por que React Query (não Redux)?

- **Data fetching nativo:** React Query é especializado em cache de requisições
- **Menos boilerplate:** Não precisa de actions, reducers, sagas
- **Cache inteligente:** staleTime, refetch, invalidação automática
- **Zustand para estado local:** Para estados que não vêm do servidor

### 9.4 Por que shadcn/ui (não Material UI)?

- **Acessibilidade:** Radix UI é headless e acessível
- **Customização:** Componentes são copiados e editáveis
- **Tailwind nativo:** Integração natural com Tailwind CSS
- **Bundle menor:** Apenas componentes usados são incluídos

### 9.5 Limitações Identificadas

1. **Sem SSR/SEO** — SPA pura não tem server-side rendering
2. **Sem testes de integração** — Testes focam em unitários e E2E
3. **Lógica de negócio no frontend** — Toda regra de negócio está no cliente
4. **Dependência de rede** — Supabase precisa estar online
5. **Sem versionamento de API** — Frontend acessa banco diretamente
6. **Sem filas/background jobs** — Operações pesadas bloqueiam UI
