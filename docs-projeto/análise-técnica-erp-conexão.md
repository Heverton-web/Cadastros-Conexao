# Análise Técnica do ERP Conexão

**Data:** 2026-06-29  
**Versão:** 1.0  
**Autor:** Análise Automatizada via OpenCode

---

## Sumário Executivo

O **ERP Conexão** é uma aplicação web SPA completa para gestão empresarial, construída com tecnologias modernas e arquitetura modular. O sistema atende múltiplas empresas com temas dinâmicos, permissões granulares e integração com Supabase.

| Aspecto | Detalhes |
|---------|----------|
| **Stack Principal** | React 19 + TanStack Router + Vite + Tailwind CSS v4 + Supabase |
| **Arquitetura** | Modular por features com 7 módulos de negócio |
| **Capacidades** | 43 permissões, multi-empresas, temas dinâmicos, PWA, webhooks |
| **Deploy** | Docker + VPS com Traefik (HTTPS) |
| **Status Atual** | 67 rotas, 53 migrations, testes E2E (Playwright) e stress (k6) |
| **Domínio** | cadastros.vpsconexao.org |

---

## 1. Arquitetura do Sistema

### 1.1 Stack Tecnológico

| Categoria | Tecnologia | Versão | Uso |
|-----------|-----------|--------|-----|
| **Framework** | React | 19.1.0 | UI Library |
| **Router** | TanStack Router | 1.114.0 | Gerenciamento de rotas |
| **State/Server** | TanStack React Query | 5.101.1 | Cache e sincronização de dados |
| **Build Tool** | Vite | 6.3.0 | Dev server e bundler |
| **Linguagem** | TypeScript | 5.8.0 | Tipagem estática |
| **Estilização** | Tailwind CSS v4 | 4.1.0 | Utility-first CSS |
| **Banco de Dados** | Supabase (PostgreSQL) | supabase-js 2.108.2 | Backend-as-a-Service |
| **UI Components** | Radix UI | 22 pacotes | Primitivas acessíveis |
| **Icones** | Lucide React | 0.487.0 | Biblioteca de ícones |
| **Gráficos** | Recharts | 3.9.0 | Visualização de dados |
| **Validação** | Zod | 3.24.2 | Schema validation |
| **Notificações** | react-hot-toast | 2.5.2 | Toast notifications |
| **PDF** | jsPDF + jspdf-autotable | 4.2.1 / 5.0.8 | Geração de PDF |
| **QR Code** | qrcode.react | 4.2.0 | Geração de QR Code |
| **Mapas** | d3-geo | 3.1.1 | Projeções geográficas |
| **Drag & Drop** | @dnd-kit/core + sortable | 6.3.1 / 10.0.0 | Interface arrastável |

### 1.2 Estrutura de Diretórios

```
erp-conexao/
├── src/                          # Código-fonte principal
│   ├── main.tsx                  # Entry point da aplicação
│   ├── routeTree.gen.ts          # Árvore de rotas gerada (TanStack Router)
│   ├── routes/                   # Definição de rotas (67 arquivos)
│   ├── components/               # Componentes compartilhados
│   │   ├── ui/                   # 49 componentes UI (shadcn/ui)
│   │   ├── layout/               # Componentes de layout (8 arquivos)
│   │   └── admin/                # Componentes admin (3 arquivos)
│   ├── core/                     # Núcleo da aplicação
│   │   ├── auth/                 # Autenticação (AuthProvider, useAuth, types)
│   │   ├── supabase/             # Cliente Supabase
│   │   ├── router/               # Guards de rota
│   │   ├── permissions/          # Sistema de permissões
│   │   ├── layout/               # AppLayout, BottomNav, DeviceGate
│   │   ├── services/             # Serviços core (notificações, webhooks, atividades)
│   │   ├── theme/                # ThemeProvider, useEmpresaTheme
│   │   ├── ui/                   # Componentes UI core (Button, Card, Input, DocViewer)
│   │   └── utils/                # Utilitários (cn, formatPhone, viacep)
│   ├── features/                 # Módulos de negócio (21 módulos)
│   │   ├── cadastros/            # Gestão de cadastros PF/PJ
│   │   ├── empresas/             # Gestão de empresas
│   │   ├── mapas/                # Mapas interativos de presença comercial
│   │   ├── nps/                  # Pesquisas de satisfação (NPS)
│   │   ├── funis/                # Funis Kanban
│   │   ├── linktree/             # Cartões digitais e QR Codes
│   │   ├── hub/                  # Plataforma de treinamento e gamificação
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── consultor/            # Área do consultor
│   │   ├── credenciais/          # Gestão de credenciais
│   │   ├── admin/                # Painel administrativo
│   │   ├── clientes/             # Gestão de clientes
│   │   ├── documentos/           # Gestão de documentos
│   │   ├── relatorios/           # Relatórios
│   │   ├── form-schema/          # Schema de formulários dinâmicos
│   │   ├── api-connectors/       # Conectores de API
│   │   ├── integracoes/          # Integrações
│   │   ├── demos/                # Modo demo
│   │   ├── precadastro/          # Pré-cadastro
│   │   ├── paytrack/             # PayTrack
│   │   └── revisoes/             # Revisões
│   ├── lib/                      # Bibliotecas e serviços legados (23 arquivos)
│   ├── registry/                 # Registro de módulos, nav items, permissões
│   ├── pwa/                      # PWA (manifest, service worker)
│   ├── styles/                   # Estilos globais (globals.css)
│   ├── legacy/                   # Código legado (components/, lib/)
│   └── utils/                    # Utilitários (vazio)
├── supabase/                     # Migrations do banco de dados
│   └── migrations/               # 53 arquivos SQL de migração
├── tests/                        # Testes
│   ├── playwright/               # 6 testes E2E (Playwright)
│   └── k6/                       # 10 testes de stress (k6)
├── scripts/                      # Scripts de manutenção (6 arquivos)
├── docs-projeto/                 # Documentação do projeto
├── json-exports/                 # Exportações JSON de dados
├── public/                       # Assets estáticos (logos, icons, geojson)
├── supabase-mcp-server/          # MCP server para Supabase
├── dist/                         # Build de produção
├── .agents/                      # Configuração de agentes AI
└── .mimocode/                    # Configuração MimoCode
```

### 1.3 Arquitetura Modular por Features

O projeto segue uma **arquitetura modular baseada em features**. Cada módulo de negócio está encapsulado em `src/features/<módulo>/` com subdiretórios padronizados:

```
features/<módulo>/
├── module.ts         # Definição do módulo (ModuleDefinition)
├── permissions.ts    # Permissões específicas do módulo
├── index.ts          # Barrel exports
├── types.ts          # Tipos TypeScript
├── components/       # Componentes React do módulo
├── pages/            # Páginas do módulo
├── services/         # Serviços (CRUD, API calls)
├── hooks/            # Custom hooks
├── lib/              # Utilitários específos
└── constants/        # Constantes
```

### 1.4 Sistema de Registro de Módulos

O projeto implementa um **sistema de registro de módulos** centralizado em `src/registry/`:

- **`modules.ts`**: Define `ModuleDefinition` com key, nome, descrição, icon, routes, permissions, ambientes, abas, events, e capacidades
- **`nav-items.ts`**: Registro de itens de navegação com permissão de acesso por módulo
- **`permissions-registry.ts`**: Registro centralizado de todas as permissões

**Módulos registrados** (7 módulos):
1. `empresas-core` - Gestão de empresas
2. `cadastros-conexão` - Gestão de cadastros PF/PJ
3. `mapas-interativos` - Mapas de presença comercial
4. `nps-conexão` - Pesquisas NPS
5. `funis-conexão` - Funis Kanban
6. `linktree-conexão` - Cartões digitais
7. `hub-conexão` - Treinamento e gamificação

### 1.5 Hierarquia de Rotas

```
rootRoute (__root.tsx)
├── loginRoute (/)           # Pública
├── preCadastroRoute         # Pública
├── npsSurveyRoute           # Pública
├── linktreePublicRoute      # Pública
├── hubClienteDashboard      # Pública
└── authLayout (_auth.tsx)   # Protegida (AuthGuard)
    ├── dashboardRoute
    ├── clientesRoute
    ├── consultorRoute
    ├── mapas/*
    ├── nps/*
    ├── funis/*
    ├── linktree/*
    ├── hub/*
    ├── global/*             # Rotas admin global
    └── empresa/*            # Rotas admin empresa
```

### 1.6 Padrão de Layout

- **Root Layout** (`__root.tsx`): ThemeProvider + Toaster + Outlet
- **Auth Layout** (`_auth.tsx`): AuthGuard + AppLayout (header, sidebar, bottom nav, notifications)
- **AppLayout**: Layout responsivo com sidebar colapsável (desktop), bottom nav (mobile), sistema de notificações e module drawer

---

## 2. Padrões de Engenharia

### 2.1 Convenções de Código

| Convenção | Descrição |
|-----------|-----------|
| **Linguagem** | PT-BR para nomes de funções, variáveis e comentários |
| **Path alias** | `~` mapeia para `./src` |
| **Barrel exports** | Cada módulo/pasta tem `index.ts` |
| **Strict TypeScript** | `strict: true` no tsconfig |
| **Module type** | ESM (`"type": "module"`) |
| **UI Rules** | NUNCA usar `window.confirm()`, `window.alert()`, `window.prompt()` - usar componentes de modal |

### 2.2 Componentes UI (shadcn/ui)

**49 componentes** em `src/components/ui/` seguindo o padrão shadcn/ui:

- **Cada componente** exporta variantes via `class-variance-authority` (CVA)
- **Composição** via `cn()` (clsx + tailwind-merge)
- **Acessibilidade** via Radix UI primitives
- **Exemplo (Button)**: variantes (default, destructive, outline, secondary, ghost, ghost-destructive, ghost-edit, link) × tamanhos (default, sm, lg, icon)

### 2.3 Estilização

| Aspecto | Implementação |
|---------|---------------|
| **Framework** | Tailwind CSS v4 com `@theme` customizado no `globals.css` |
| **Design System** | Dark mode padrão com cores personalizáveis por empresa via CSS variables |
| **Paleta** | Slate (bg/surface) + Gold (#c9a655) como accent principal |
| **Fonte** | Outfit (Google Fonts) |
| **Utility function** | `cn()` (clsx + tailwind-merge) para composição de classes |
| **Custom utilities** | `btn-hover-destructive`, `btn-hover-edit`, `btn-hover-neutral` |

### 2.4 Gerenciamento de Estado

| Camada | Tecnologia | Uso |
|--------|-----------|-----|
| **Auth Context** | React Context | user, profile, permissões, módulosAcesso, empresa, módulosAtivos |
| **Server State** | TanStack React Query | Cache de dados do servidor (staleTime: 60_000) |
| **Local State** | useState/useEffect | Estado de componentes |
| **Memoização** | useCallback/useRef | Performance e refs mutáveis |
| **localStorage** | selectedModule, sidebarCollapsed | Persistência local |

### 2.5 Autenticação e Permissões

**AuthProvider** (`src/core/auth/AuthProvider.tsx`):
- Expõe: user, profile, permissões, módulosAcesso, empresa, módulosAtivos, loading, login, logout, register, resetPassword
- Fluxo: Login → fetchProfile → carregarEmpresa → carregarPermissões → carregarMódulosAtivos
- Super Admin: Acesso total a todas as permissões e módulos
- Re-autenticação: `onAuthStateChange` listener

**Sistema de Permissões** (`src/core/permissions/types.ts`):
- **43 permissões** organizadas em grupos:
  - Escopo de Dados (ver_todos_cadastros)
  - Visualização (ver_relatorios, visualizar_documento)
  - Aprovação de Cadastro (aprovar, reprovar, solicitar_correção)
  - Aprovação de Documentos
  - Aprovação de Campos
  - Credenciais (gerenciar, admin)
  - Administração (excluir_cadastro, gerenciar_config)
  - Geração de Links
  - NPS (7 permissões)
  - Funis (8 permissões)
  - LinkTree (9 permissões)
  - Hub (permissões específicas)
  - Mapas (permissões específicas)
- **Ambientes**: cadastro, consultor, tecnologia, suporte
- **Permissões padrão**: Definidas por ambiente em `getPermisssoesPadrao()`

### 2.6 Backend (Supabase)

**Cliente Supabase** (`src/core/supabase/client.ts`):
- Configurado via variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Criado com `createClient()` do `@supabase/supabase-js`

**Migrations** (53 arquivos SQL):
- Numeradas de `00001` a `00052` mais 3 migrations com timestamps
- Principais: profiles, tables, admin, rls_blendagem, permissoes, notifications, integracoes, form_schema, multiempresas, branding, credential_scopes, webhooks, permissoes_modulos, mapas, nps, funis, linktree, hub

**Tabelas Principais**:
- `profiles` - Perfis de usuário
- `permissoes` - Permissões de usuário
- `empresas` - Empresas
- `empresas_config` - Configurações da empresa (logo, theme)
- `modulos_empresa` - Módulos ativos por empresa
- `cadastros` - Cadastros de clientes
- `notificacoes` - Notificações
- `notificacoes_templates` - Templates de notificação
- `webhooks` - Webhooks configurados
- `webhook_logs` - Logs de webhooks
- `api_connectors` - Conectores de API

### 2.7 Webhooks e Automação

Sistema completo de webhooks em `src/core/services/webhooks.ts`:
- **3 tipos de tasks**: notification, webhook, api_connector
- **Execução ordenada** por `ordem`
- **Templates** com variáveis dinâmicas `{{tabela.coluna}}`
- **Logs** de execução em `webhook_logs`
- **Eventos**: status_change e button_action

### 2.8 Multi-empresas e Temas Dinâmicos

- Suporte a multi-empresas com `empresa_id`
- Configurações por empresa: logo, theme, módulos ativos
- `ThemeProvider` aplica tema da empresa via CSS variables
- 16 variáveis de tema (accent, gradient, bg, surface, text, feedback colors)
- NPS com tema próprio (nps_bg, nps_surface, nps_text)

### 2.9 Testes

**Playwright (E2E)** - 6 testes em `tests/playwright/`:
- Fluxo completo, Dashboard, Credenciais, Consultor, Aprovação, Config admin

**k6 (Stress/Load)** - 10 testes em `tests/k6/`:
- Login, Aprovação de cadastro, Listagem, Stress completo, Dashboard, Polling de notificações, Pré-cadastro, Relatórios, Stress RPC, Webhooks

### 2.10 Build e Deploy

**Desenvolvimento**:
```bash
npm run dev      # Vite dev server
npm run build    # Build produção
npm run preview  # Preview do build
npm run format   # Prettier
npm run lint     # ESLint
```

**Produção (Docker + VPS)**:
- **Dockerfile**: Multi-stage (Node 20 build → Nginx serve)
- **docker-compose.yml**: Serviço `app` com Traefik reverse proxy
- **Domínio**: `cadastros.vpsconexao.org`
- **HTTPS**: Let's Encrypt via Traefik
- **Rede**: `network_conexão` (externa)

**PWA**:
- `manifest.json`: name "Cadastros Conexão", display standalone
- Service Worker: `sw.js` registrado em `registerSW.ts`
- Icons: 192x192 e 512x512

---

## 3. Automação de Processos

### 3.1 Visão Geral

Esta seção detalha como automatizar processos repetitivos no ERP Conexão, focando na criação automatizada de novos módulos. Cada ferramenta (MCP, skill, rule, workflow, hook, plugin, spec) é descrita com implementação concreta.

### 3.2 Criação Automatizada de Módulos

#### 3.2.1 Skill: `criar-modulo`

**Objetivo**: Gerar estrutura completa de diretórios e arquivos para um novo módulo.

**Implementação**:
```yaml
# .agents/skills/criar-modulo/SKILL.md
name: criar-modulo
description: Cria estrutura completa de um novo módulo no ERP Conexão
trigger: "criar módulo", "novo módulo", "adicionar módulo"

steps:
  1. Validar nome do módulo (kebab-case)
  2. Criar diretório em src/features/<modulo>/
  3. Gerar arquivos base:
     - module.ts (ModuleDefinition)
     - permissions.ts (permissões do módulo)
     - index.ts (barrel exports)
     - types.ts (tipos TypeScript)
     - components/ (diretório)
     - pages/ (diretório)
     - services/ (diretório)
     - hooks/ (diretório)
  4. Registrar módulo em src/registry/modules.ts
  5. Adicionar permissões em src/registry/permissions-registry.ts
  6. Criar rotas em src/routes/<modulo>/
  7. Atualizar routeTree.gen.ts (via TanStack Router plugin)
```

**Template de ModuleDefinition**:
```typescript
// src/features/<modulo>/module.ts
import { ModuleDefinition } from '~/registry/modules'

export const moduloDefinition: ModuleDefinition = {
  key: '<modulo>',
  nome: '<Nome do Módulo>',
  descrição: 'Descrição do módulo',
  icon: 'NomeDoIcon',
  rotas: ['/<modulo>', '/<modulo>/dashboard'],
  permissões: ['ver_<modulo>', 'editar_<modulo>', 'excluir_<modulo>'],
  ambientes: ['cadastro', 'consultor'],
  abas: [
    { key: 'dashboard', nome: 'Dashboard', icon: 'LayoutDashboard' },
    { key: 'lista', nome: 'Lista', icon: 'List' },
  ],
  capacidades: {
    hasCredentialScopes: false,
    hasLaboratorio: false,
  },
}
```

#### 3.2.2 Workflow: `criar-modulo-completo`

**Objetivo**: Sequência automatizada de passos para criar um módulo completo.

**Implementação**:
```yaml
# .agents/workflows/criar-modulo-completo.yaml
name: criar-modulo-completo
description: Workflow completo para criação de módulo
steps:
  - name: validar-nome
    skill: criar-modulo
    args:
      acao: validar
      nome: $nome_modulo
    
  - name: criar-estrutura
    skill: criar-modulo
    args:
      acao: criar-diretorios
      nome: $nome_modulo
    depends_on: validar-nome
    
  - name: criar-tabela
    mcp: supabase_execute_sql
    args:
      sql: |
        CREATE TABLE IF NOT EXISTS $nome_modulo (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          empresa_id UUID REFERENCES empresas(id),
          nome TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE $nome_modulo ENABLE ROW LEVEL SECURITY;
    depends_on: criar-estrutura
    
  - name: criar-migration
    mcp: supabase_apply_migration
    args:
      nome: create_$nome_modulo
      sql: $sql_migration
    depends_on: criar-tabela
    
  - name: registrar-modulo
    skill: criar-modulo
    args:
      acao: registrar
      nome: $nome_modulo
    depends_on: criar-estrutura
    
  - name: criar-permissoes
    skill: adicionar-permissao
    args:
      modulo: $nome_modulo
      permissoes: ['ver_$nome_modulo', 'editar_$nome_modulo', 'excluir_$nome_modulo']
    depends_on: registrar-modulo
    
  - name: criar-rotas
    skill: criar-rota
    args:
      modulo: $nome_modulo
      rotas: ['/$nome_modulo', '/$nome_modulo/dashboard']
    depends_on: criar-permissoes
    
  - name: criar-crud
    skill: gerar-crud
    args:
      modulo: $nome_modulo
      tabela: $nome_modulo
    depends_on: criar-rotas
    
  - name: criar-componentes
    skill: criar-componente-modulo
    args:
      modulo: $nome_modulo
      componentes: ['Lista', 'Formulario', 'Dashboard']
    depends_on: criar-crud
```

#### 3.2.3 Spec: `ModuleDefinition Template`

**Objetivo**: Template validado para definição de módulos.

**Implementação**:
```typescript
// .agents/specs/module-definition.yaml
name: ModuleDefinition
description: Template para definição de módulos do ERP Conexão
schema:
  type: object
  required: [key, nome, descrição, icon, rotas, permissões, ambientes]
  properties:
    key:
      type: string
      pattern: '^[a-z0-9-]+$'
      description: 'Chave única do módulo (kebab-case)'
    nome:
      type: string
      minLength: 3
      maxLength: 50
      description: 'Nome display do módulo'
    descrição:
      type: string
      minLength: 10
      maxLength: 200
      description: 'Descrição curta do módulo'
    icon:
      type: string
      description: 'Nome do ícone Lucide React'
    rotas:
      type: array
      items:
        type: string
        pattern: '^/[a-z0-9-/]+$'
      minItems: 1
      description: 'Array de rotas do módulo'
    permissões:
      type: array
      items:
        type: string
        pattern: '^[a-z_]+$'
      minItems: 1
      description: 'Array de permissões do módulo'
    ambientes:
      type: array
      items:
        type: string
        enum: ['cadastro', 'consultor', 'tecnologia', 'suporte']
      minItems: 1
      description: 'Ambientes onde o módulo está disponível'
    abas:
      type: array
      items:
        type: object
        required: [key, nome, icon]
        properties:
          key:
            type: string
          nome:
            type: string
          icon:
            type: string
      description: 'Abas de navegação do módulo'
    capacidades:
      type: object
      properties:
        hasCredentialScopes:
          type: boolean
          default: false
        hasLaboratorio:
          type: boolean
          default: false
      description: 'Capacidades especiais do módulo'
```

### 3.3 Geração de CRUD

#### 3.3.1 Skill: `gerar-crud`

**Objetivo**: Gerar service.ts com operações CRUD completas.

**Implementação**:
```yaml
# .agents/skills/gerar-crud/SKILL.md
name: gerar-crud
description: Gera operações CRUD para um módulo do ERP Conexão
trigger: "gerar crud", "criar crud", "operações crud"

steps:
  1. Ler schema da tabela via MCP supabase_describe_table
  2. Gerar tipos TypeScript baseados nas colunas
  3. Criar service.ts com operações:
     - listar(filtros, paginação)
     - buscarPorId(id)
     - criar(dados)
     - atualizar(id, dados)
     - excluir(id)
  4. Adicionar validação Zod para inputs
  5. Implementar tratamento de erros
  6. Gerar hooks use<Modulo>Service()
```

**Template de Service**:
```typescript
// src/features/<modulo>/services/<modulo>.service.ts
import { supabase } from '~/core/supabase/client'
import { z } from 'zod'

const schemaCriar = z.object({
  nome: z.string().min(3).max(100),
  // ... outros campos
})

const schemaAtualizar = schemaCriar.partial()

export const moduloService = {
  async listar(filtros?: { busca?: string }, pagina = 1, porPagina = 20) {
    let query = supabase
      .from('<tabela>')
      .select('*', { count: 'exact' })
      .range((pagina - 1) * porPagina, pagina * porPagina - 1)
    
    if (filtros?.busca) {
      query = query.ilike('nome', `%${filtros.busca}%`)
    }
    
    const { data, error, count } = await query
    if (error) throw error
    return { data, total: count }
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('<tabela>')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async criar(dados: unknown) {
    const validados = schemaCriar.parse(dados)
    const { data, error } = await supabase
      .from('<tabela>')
      .insert(validados)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async atualizar(id: string, dados: unknown) {
    const validados = schemaAtualizar.parse(dados)
    const { data, error } = await supabase
      .from('<tabela>')
      .update(validados)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('<tabela>')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
```

#### 3.3.2 Hook: `pre-gerar-crud`

**Objetivo**: Validar schema antes de gerar CRUD.

**Implementação**:
```yaml
# .agents/hooks/pre-gerar-crud.yaml
name: pre-gerar-crud
description: Valida schema da tabela antes de gerar CRUD
trigger: antes_de_executar: gerar-crud
actions:
  - verificar_tabela_existe:
      mcp: supabase_describe_table
      args:
        table_name: $tabela
      on_error: abort
      
  - verificar_colunas_minimas:
      required_columns: ['id', 'created_at']
      on_error: warn
      
  - verificar_rls_ativo:
      mcp: supabase_execute_sql
      args:
        sql: |
          SELECT relrowsecurity 
          FROM pg_class 
          WHERE relname = '$tabela'
      on_error: warn
```

### 3.4 Criação de Componentes

#### 3.4.1 Skill: `criar-componente-modulo`

**Objetivo**: Gerar componente seguindo padrão shadcn/ui.

**Implementação**:
```yaml
# .agents/skills/criar-componente-modulo/SKILL.md
name: criar-componente-modulo
description: Cria componente React seguindo padrões do ERP Conexão
trigger: "criar componente", "novo componente"

steps:
  1. Validar nome do componente (PascalCase)
  2. Verificar se componente já existe em src/components/ui/
  3. Gerar componente com variantes CVA
  4. Adicionar exportação em index.ts
  5. Criar story Storybook (opcional)
```

**Template de Componente**:
```typescript
// src/features/<modulo>/components/<Componente>.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/core/utils/cn'

const componenteVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'default-classes',
        destructive: 'destructive-classes',
        outline: 'outline-classes',
      },
      size: {
        default: 'default-size',
        sm: 'small-size',
        lg: 'large-size',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ComponenteProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componenteVariants> {
  // Props específicas
}

export const Componente = React.forwardRef<HTMLDivElement, ComponenteProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componenteVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Componente.displayName = 'Componente'
```

#### 3.4.2 Rule: `nomenclature`

**Objetivo**: Validar nomenclatura de componentes e arquivos.

**Implementação**:
```yaml
# .agents/rules/nomenclature.yaml
name: nomenclature
description: Valida nomenclatura de componentes e arquivos
rules:
  componentes:
    pattern: '^[A-Z][a-zA-Z]+$'
    message: 'Componentes devem usar PascalCase'
    examples: ['ListaClientes', 'FormularioCadastro', 'DashboardPrincipal']
    
  arquivos_ts:
    pattern: '^[a-z0-9-]+(\.(component|service|hook|types|test|spec))?\.tsx?$'
    message: 'Arquivos devem usar kebab-case com sufixo opcional'
    examples: ['lista-clientes.tsx', 'clientes.service.ts', 'useClientes.ts']
    
  diretorios:
    pattern: '^[a-z0-9-]+$'
    message: 'Diretórios devem usar kebab-case'
    examples: ['cadastros', 'mapas-interativos', 'nps']
    
  rotas:
    pattern: '^/[a-z0-9-]+(/[a-z0-9-]+)*$'
    message: 'Rotas devem usar kebab-case'
    examples: ['/cadastros', '/mapas/distribuidores', '/nps/dashboard']
```

### 3.5 Gerenciamento de Permissões

#### 3.5.1 Skill: `adicionar-permissao`

**Objetivo**: Adicionar permissão ao registry centralizado.

**Implementação**:
```yaml
# .agents/skills/adicionar-permissao/SKILL.md
name: adicionar-permissao
description: Adiciona permissão ao sistema de permissões do ERP Conexão
trigger: "adicionar permissão", "criar permissão", "nova permissão"

steps:
  1. Validar nome da permissão (snake_case)
  2. Verificar se permissão já existe
  3. Adicionar em src/core/permissions/types.ts
  4. Registrar em src/registry/permissions-registry.ts
  5. Associar ao módulo em src/registry/modules.ts
  6. Adicionar permissão padrão por ambiente em getPermissoesPadrao()
```

#### 3.5.2 Rule: `permission-conflicts`

**Objetivo**: Validar conflitos de permissão.

**Implementação**:
```yaml
# .agents/rules/permission-conflicts.yaml
name: permission-conflicts
description: Valida conflitos e dependências de permissões
rules:
  - nome_unico:
      message: 'Nome de permissão deve ser único'
      validation: check_unique_in_registry
      
  - formato_snake_case:
      pattern: '^[a-z][a-z0-9_]*$'
      message: 'Permissões devem usar snake_case'
      
  - prefixo_modulo:
      message: 'Permissão deve ter prefixo do módulo'
      validation: starts_with_module_key
      
  - conflitos_escopo:
      message: 'Permissões de escopo não podem conflitar com permissões específicas'
      validation: check_scope_conflicts
```

### 3.6 Automação de Rotas

#### 3.6.1 Skill: `criar-rota`

**Objetivo**: Gerar arquivo de rota com AuthGuard.

**Implementação**:
```yaml
# .agents/skills/criar-rota/SKILL.md
name: criar-rota
description: Cria rota protegida no ERP Conexão
trigger: "criar rota", "nova rota", "adicionar rota"

steps:
  1. Validar path da rota (kebab-case)
  2. Verificar se rota já existe
  3. Criar arquivo em src/routes/<path>.tsx
  4. Adicionar AuthGuard (se protegida)
  5. Importar componente da página
  6. Atualizar routeTree.gen.ts (automático via TanStack Router)
```

**Template de Rota**:
```typescript
// src/routes/<modulo>/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ModuloPage } from '~/features/<modulo>/pages/ModuloPage'

export const Route = createFileRoute('/<modulo>/')({
  component: ModuloPage,
  beforeLoad: ({ context }) => {
    // Validação de permissão já feita pelo AuthGuard
    return context
  },
})
```

#### 3.6.2 Hook: `pre-criar-rota`

**Objetivo**: Validar rotas duplicadas.

**Implementação**:
```yaml
# .agents/hooks/pre-criar-rota.yaml
name: pre-criar-rota
description: Valida rota antes de criar
trigger: antes_de_executar: criar-rota
actions:
  - verificar_rota_existe:
      glob: 'src/routes/**/*.tsx'
      pattern: $rota_path
      on_error: abort
      
  - verificar_nome_unico:
      message: 'Rota já existe'
      on_error: abort
      
  - verificar_modulo_registrado:
      file: src/registry/modules.ts
      pattern: $modulo_key
      on_error: warn
```

### 3.7 Ferramentas Recomendadas

#### 3.7.1 MCPs (Model Context Protocol Servers)

| MCP | Status | Uso |
|-----|--------|-----|
| `supabase-mcp-server` | ✅ Existente | SQL, migrations, schema inspection |
| `mcp-shadcn` | 🆕 Novo | Buscar e instalar componentes shadcn/ui |
| `mcp-tanstack` | 🆕 Novo | Gerar rotas TanStack Router |

**MCP `mcp-shadcn` (novo)**:
```json
{
  "name": "mcp-shadcn",
  "description": "MCP server para shadcn/ui CLI",
  "tools": [
    {
      "name": "shadcn_add",
      "description": "Adiciona componente shadcn/ui ao projeto",
      "inputSchema": {
        "type": "object",
        "properties": {
          "component": { "type": "string" },
          "path": { "type": "string" }
        }
      }
    },
    {
      "name": "shadcn_list",
      "description": "Lista componentes shadcn/ui disponíveis",
      "inputSchema": { "type": "object", "properties": {} }
    }
  ]
}
```

**MCP `mcp-tanstack` (novo)**:
```json
{
  "name": "mcp-tanstack",
  "description": "MCP server para TanStack Router",
  "tools": [
    {
      "name": "tanstack_create_route",
      "description": "Cria rota TanStack Router",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": { "type": "string" },
          "component": { "type": "string" },
          "protected": { "type": "boolean" }
        }
      }
    }
  ]
}
```

#### 3.7.2 Skills

| Skill | Descrição | Trigger |
|-------|-----------|---------|
| `criar-modulo` | Estrutura completa de módulo | "criar módulo" |
| `gerar-crud` | Operações CRUD | "gerar crud" |
| `criar-componente-modulo` | Componente shadcn/ui | "criar componente" |
| `adicionar-permissao` | Permissão ao registry | "adicionar permissão" |
| `criar-rota` | Rota protegida | "criar rota" |
| `validar-modulo` | Valida integridade do módulo | "validar módulo" |
| `documentar-modulo` | Gera documentação do módulo | "documentar módulo" |

#### 3.7.3 Rules

| Rule | Descrição | Validação |
|------|-----------|-----------|
| `modulo-structure` | Estrutura de diretórios | Verifica pastas obrigatórias |
| `nomenclature` | Nomenclatura de arquivos | Regex patterns |
| `permission-conflicts` | Conflitos de permissão | Duplicatas e dependências |
| `route-validation` | Validação de rotas | Paths duplicados |
| `type-safety` | Segurança de tipos | TypeScript strict |

#### 3.7.4 Workflows

| Workflow | Descrição | Steps |
|----------|-----------|-------|
| `criar-modulo-completo` | Módulo completo end-to-end | 8 steps |
| `gerar-crud-completo` | CRUD com service + hooks | 5 steps |
| `adicionar-feature` | Feature completa ao módulo | 6 steps |

#### 3.7.5 Hooks

| Hook | Trigger | Ação |
|------|---------|------|
| `pre-criar-modulo` | Antes de criar módulo | Valida nome e estrutura |
| `pre-criar-rota` | Antes de criar rota | Verifica duplicatas |
| `pre-gerar-crud` | Antes de gerar CRUD | Valida schema da tabela |
| `pos-criar-modulo` | Após criar módulo | Registra no sistema |
| `pos-criar-rota` | Após criar rota | Atualiza routeTree |

#### 3.7.6 Plugins

| Plugin | Descrição | Integração |
|--------|-----------|------------|
| `shadcn-ui-generator` | Gera componentes shadcn/ui | shadcn/ui CLI |
| `supabase-schema-validator` | Valida schema Supabase | MCP supabase |
| `tanstack-route-generator` | Gera rotas TanStack | TanStack Router plugin |
| `permission-checker` | Valida permissões | Registry de permissões |

#### 3.7.7 Specs

| Spec | Descrição | Arquivo |
|------|-----------|---------|
| `ModuleDefinition` | Template de módulo | `.agents/specs/module-definition.yaml` |
| `RouteTemplate` | Template de rota | `.agents/specs/route-template.yaml` |
| `CRUDService` | Template de service | `.agents/specs/crud-service.yaml` |
| `ComponentTemplate` | Template de componente | `.agents/specs/component-template.yaml` |
| `PermissionTemplate` | Template de permissão | `.agents/specs/permission-template.yaml` |

### 3.8 Exemplo de Uso: Criando um Módulo "Relatórios Avançados"

**Comando do usuário**: "Criar módulo de relatórios avançados com dashboard e exportação PDF"

**Execução automatizada**:

1. **Skill `criar-modulo`** é disparada
2. **Hook `pre-criar-modulo`** valida nome: `relatorios-avancados`
3. **Workflow `criar-modulo-completo`** executa:
   - Cria diretório `src/features/relatorios-avancados/`
   - Gera `module.ts`, `permissions.ts`, `types.ts`, `index.ts`
   - Cria tabela no Supabase via MCP
   - Aplica migration via MCP
   - Registra módulo em `src/registry/modules.ts`
   - Adiciona permissões ao registry
   - Cria rotas: `/relatorios-avancados`, `/relatorios-avancados/dashboard`
   - Gera CRUD com service e hooks
   - Cria componentes: Dashboard, Lista, ExportadorPDF
4. **Hook `pos-criar-modulo`** registra no sistema

**Resultado**: Módulo completo em ~5 minutos vs ~2 horas manualmente.

---

## 4. Roadmap de Melhorias

### 4.1 Curto Prazo (1-3 meses)

| Melhoria | Prioridade | Impacto |
|----------|------------|---------|
| Limpar código legado (`src/legacy/`) | Alta | Reduz complexidade |
| Adicionar testes unitários (Vitest) | Alta | Qualidade de código |
| Implementar lint de commits (commitlint) | Média | Histórico limpo |
| Documentar componentes (Storybook) | Média | Onboarding |

### 4.2 Médio Prazo (3-6 meses)

| Melhoria | Prioridade | Impacto |
|----------|------------|---------|
| Centralizar estado com Zustand | Alta | Performance |
| Implementar monitoramento (Sentry) | Alta | Visibilidade |
| Otimizar bundle (code splitting) | Média | Performance |
| Adicionar CI/CD (GitHub Actions) | Média | Automação |

### 4.3 Longo Prazo (6-12 meses)

| Melhoria | Prioridade | Impacto |
|----------|------------|---------|
| Migrar para Server Components | Baixa | Arquitetura |
| Implementar GraphQL | Baixa | Flexibilidade |
| Adicionar testes de acessibilidade | Média | Inclusão |
| Internacionalização (i18n) | Baixa | Escalabilidade |

### 4.4 Melhorias Arquiteturais

| Melhoria | Descrição | Benefício |
|----------|-----------|-----------|
| Separar backend | Serviço independente para lógica de negócio | Escalabilidade |
| CQRS | Command Query Responsibility Segregation | Performance |
| Event Sourcing | Auditoria completa de mudanças | Compliance |
| Cache distribuído | Redis para cache de sessões | Performance |

---

## 5. Apêndices

### A. Comandos Úteis

**Desenvolvimento**:
```bash
npm run dev          # Iniciar dev server
npm run build        # Build de produção
npm run preview      # Preview do build
npm run format       # Formatar código (Prettier)
npm run lint         # Lintar código (ESLint)
```

**Docker**:
```bash
docker build -t cadastros-conexao .          # Build da imagem
docker-compose up -d                          # Iniciar serviços
docker-compose down                           # Parar serviços
docker-compose logs -f app                    # Ver logs
```

**Supabase**:
```bash
npx supabase migration new <nome>            # Criar migration
npx supabase db push                          # Aplicar migrations
npx supabase db reset                         # Resetar banco
npx supabase gen types typescript             # Gerar tipos
```

**Testes**:
```bash
npx playwright test                           # Rodar testes E2E
npx playwright test --ui                      # Interface visual
k6 run tests/k6/<arquivo>.js                  # Rodar stress test
```

### B. Estrutura de Arquivos Chave

| Arquivo | Descrição |
|---------|-----------|
| `src/registry/modules.ts` | Definição de todos os módulos |
| `src/core/auth/AuthProvider.tsx` | Provedor de autenticação |
| `src/core/permissions/types.ts` | Tipos de permissões |
| `src/routes/_auth.tsx` | Layout protegido (AuthGuard) |
| `src/core/layout/AppLayout.tsx` | Layout principal da aplicação |
| `src/core/services/webhooks.ts` | Sistema de webhooks |
| `src/styles/globals.css` | Estilos globais e tema |
| `vite.config.ts` | Configuração do Vite |
| `tsconfig.json` | Configuração do TypeScript |
| `docker-compose.yml` | Configuração Docker |

### C. Recursos Externos

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)

### D. Glossário

| Termo | Definição |
|-------|-----------|
| **ModuleDefinition** | Estrutura de dados que define um módulo de negócio |
| **AuthGuard** | Componente que protege rotas autenticadas |
| **CVA** | Class Variance Authority - biblioteca para variantes de componentes |
| **RLS** | Row Level Security - segurança no nível de linha do PostgreSQL |
| **MCP** | Model Context Protocol - protocolo para comunicação com IA |
| **shadcn/ui** | Biblioteca de componentes UI baseada em Radix + Tailwind |
| **TanStack Router** | Biblioteca de roteamento type-safe para React |
| **Barrel Export** | Arquivo index.ts que re-exporta tudo de um módulo |
| **Feature Module** | Módulo de negócio encapsulado em src/features/ |
| **Webhook** | Sistema de notificação automática de eventos |

---

**Documento gerado automaticamente via OpenCode em 2026-06-29**