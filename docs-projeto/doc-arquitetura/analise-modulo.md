# Análise de Arquitetura por Módulo — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## Sumário

1. [Arquitetura Modular](#1-arquitetura-modular)
2. [Padrão de Módulo](#2-padrão-de-módulo)
3. [Análise por Módulo](#3-análise-por-módulo)
4. [Matriz de Acoplamento](#4-matriz-de-acoplamento)
5. [Padrões por Complexidade](#5-padrões-por-complexidade)
6. [Conclusões](#6-conclusões)

---

## 1. Arquitetura Modular

### 1.1 Princípios

O ERP Conexão segue o princípio de **Feature-Sliced Design** (arquitetura fatiada por funcionalidades):

1. **Cada módulo é auto-contido** em `src/features/<modulo>/`
2. **Módulos se comunicam APENAS via banco de dados** (nunca via imports diretos entre módulos)
3. **O Registry é a única camada de integração** entre módulos e infraestrutura
4. **Excluir um módulo não quebra outros** (isolamento total)
5. **Cada módulo pode ser habilitado/desabilitado por empresa** via `modulos_empresa`

### 1.2 Estrutura Padrão de um Módulo

```
src/features/<modulo>/
├── module.ts           → Definição do módulo (ModuleDefinition)
├── permissions.ts      → Permissões granulares (array de PermissionDefinition)
├── types.ts            → Types específicos do módulo
└── components/         → Componentes React do módulo
    ├── Dashboard.tsx
    ├── FormPage.tsx
    └── ...
```

---

## 2. Padrão de Módulo

### 2.1 Estrutura do ModuleDefinition

```typescript
export const moduloModule: ModuleDefinition = {
  // Identificação
  key: "modulo-key",          // Chave única (snake_case)
  nome: "Nome do Módulo",    // Nome exibido
  descricao: "Descrição",    // Descrição funcional
  icon: LucideIcon,          // Ícone (lucide-react)

  // Rotas
  routes: [
    "/modulo/dashboard",
    "/modulo/pagina1",
    "/modulo/pagina2/:id",
  ],

  // Configuração de acesso
  permissions: ["perm1", "perm2"],  // Chaves das permissões
  ambientes: ["cadastro", "consultor"],  // Ambientes que podem acessar

  // Abas de configuração
  abas: [
    { key: "aba1", label: "Aba 1", descricao: "..." },
  ],

  // Eventos/Webhooks
  events: [
    {
      key: "modulo.evento1",
      label: "Evento",
      descricao: "Dispara quando...",
      type: "status_change" | "button_action",
    },
  ],

  // Flags
  hasDesignConfig: true,
  designRoute: "/empresa/modulo/design",

  // Setup
  setup: () => {
    // 1. Registrar permissões
    for (const p of MODULO_PERMISSIONS) registerPermission(p);

    // 2. Registrar defaults por ambiente
    registerPermissionDefaults("modulo-key", {
      cadastro: { perm1: true, perm2: false },
      consultor: { perm1: false, perm2: true },
    });

    // 3. Registrar nav-items com permissionCheck
    registerNavItem({
      id: "modulo-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/modulo/dashboard",
      permissionCheck: (perms) => perms?.perm1 === true,
      order: 1,
      moduloKey: "modulo-key",
    });
  },
};
```

### 2.2 Fluxo de Setup

```
main.tsx
  ↓ registerModule(moduloModule)  → armazena no ModuleRegistry

_auuth.tsx (AuthGuard)
  ↓
useAuth() carrega profile + permissoes + modulosAtivos
  ↓
Se módulo está ativo → modulo.setup()
  ↓
setup() registra permissions + defaults + nav-items
  ↓
AppLayout renderiza sidebar com nav-items filtrados por permissionCheck()
```

---

## 3. Análise por Módulo

### 3.1 Cadastros (Módulo Central)

| Característica | Detalhe |
|---|---|
| **Key** | `cadastros` |
| **Tipo** | Módulo de Negócio — Alta Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia, suporte |
| **Permissões** | 17 (maioria do sistema) |
| **Rotas** | 7 |
| **Design Config** | ✅ |
| **Tabelas** | 6 (`cadastros`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`, etc.) |

**Arquitetura específica:**
- **Único módulo** com `credential scopes` habilitado
- **Único módulo** com `hasCustomActions` habilitado
- **Único módulo** com `hasApiConnectors`, `hasFormulario`, `hasLaboratorio`
- 17 permissões **sem prefixo** (diferente de todos os outros)
- 4 ambientes (maior cobertura)
- 6 eventos (fluxo de aprovação completo)
- Core do sistema — mais antigo e mais complexo

**Arquivos:**
```
src/features/cadastros/
├── module.ts
├── permissions.ts        # 17 permissões sem prefixo
├── types.ts
└── components/
```

### 3.2 NPS

| Característica | Detalhe |
|---|---|
| **Key** | `nps` |
| **Tipo** | Módulo de Negócio — Média Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 7 |
| **Rotas** | 6 |
| **Design Config** | ✅ (com tema survey independente) |
| **Tabelas** | 4 (`nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio`) |

**Arquitetura específica:**
- **Único módulo** com INSERT anônimo no banco (survey público)
- **Único módulo** com tema CSS independente do design system global (58+ `--nps-*` tokens)
- Possui `theme.ts` e `NpsBackground.tsx` específicos
- Registrado em `src/features/nps/`

### 3.3 Mapas

| Característica | Detalhe |
|---|---|
| **Key** | `mapas-interativos` |
| **Tipo** | Módulo de Negócio — Baixa Complexidade |
| **Ambientes** | cadastro, consultor |
| **Permissões** | 5 |
| **Rotas** | 7 |
| **Design Config** | ✅ |
| **Tabelas** | 2 (`mapas_distributors`, `mapas_consultants`) |

**Arquitetura específica:**
- Módulo mais enxuto do sistema
- SELECT público para anônimos (mapa público)
- Mapa SVG do Brasil com pins por estado
- Tabelas gêmeas (distribuidores e consultores com estrutura quase idêntica)

**Arquivos:**
```
src/features/mapas/
├── module.ts
├── permissions.ts        # 5 permissões
├── types.ts
└── components/
    ├── PublicMapShell.tsx
    ├── EntityDetailDialog.tsx
    ├── StateDetailSheet.tsx
    └── ...
```

### 3.4 LinkTree

| Característica | Detalhe |
|---|---|
| **Key** | `linktree` |
| **Tipo** | Módulo de Negócio — Média Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 13 |
| **Rotas** | 6 |
| **Design Config** | ✅ |
| **Tabelas** | 6 (`linktree_colaboradores`, `linktree_tema_config`, `linktree_empresa_*`) |

**Arquitetura específica:**
- Possui **2 submódulos independentes**: Colaboradores + Empresa Bio Instagram
- Tema com 60+ propriedades JSONB (único módulo com tema JSONB externo ao design system)
- RLS público estratégico para página pública

### 3.5 Gerador de Links

| Característica | Detalhe |
|---|---|
| **Key** | `gerador-links` |
| **Tipo** | Módulo Utilitário — Baixa Complexidade |
| **Ambientes** | cadastro, tecnologia |
| **Permissões** | 6 |
| **Rotas** | 9 |
| **Design Config** | ❌ |
| **Tabelas** | 3 (`gerador_links`, `gerador_templates`, `gerador_link_cliques`) |

**Arquitetura específica:**
- Módulo utilitário sem personalização visual
- 6 tipos de link (WhatsApp, UTM, Google Review, Maps, Waze, QR Code)
- Tracking de cliques via RPC `registrar_clique()` SECURITY DEFINER
- Rota de redirect `/r/:linkId`

### 3.6 Rotas

| Característica | Detalhe |
|---|---|
| **Key** | `rotas` |
| **Tipo** | Módulo de Negócio — Baixa Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 6 |
| **Rotas** | 3 |
| **Design Config** | ✅ |
| **Tabelas** | ~4 |

**Arquitetura específica:**
- Módulo mais simples após Mapas
- Integração com Google Maps
- 4 eventos de ciclo de vida de rota

### 3.7 Despesas

| Característica | Detalhe |
|---|---|
| **Key** | `despesas` |
| **Tipo** | Módulo de Negócio — Média Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia, suporte |
| **Permissões** | 8 |
| **Rotas** | 4 |
| **Design Config** | ✅ |
| **Tabelas** | 6 (`despesas_tipos`, `despesas_config`, `despesas_periodos`, `despesas`, `despesas_envios`, `despesas_pagamentos`) |

**Arquitetura específica:**
- Pipeline de 3 estágios (colaborador → aprovador → financeiro)
- Ciclo de períodos (semanal, quinzenal, mensal)
- 7 eventos (maioria de webhooks para fluxos)

### 3.8 CRM

| Característica | Detalhe |
|---|---|
| **Key** | `crm` |
| **Tipo** | Módulo de Negócio — Alta Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 10 |
| **Rotas** | 13 (segundo maior) |
| **Design Config** | ✅ |
| **Tabelas** | 10+ (próprias + compartilhadas) |

**Arquitetura específica:**
- Segundo maior módulo em rotas
- Pipeline Kanban com 6 estágios padrão
- Hierarquia de equipe: super_admin > diretor > gestor > consultor
- **Coexiste com subsistema legado** (`usuarios`, `clientes`, `visitas`)
- Rota de aceitar convite via token (`/crm/aceitar-convite/$token`)

### 3.9 Funis

| Característica | Detalhe |
|---|---|
| **Key** | `funis` |
| **Tipo** | Módulo de Negócio — Alta Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 18 (maior conjunto) |
| **Rotas** | 4 |
| **Design Config** | ✅ |
| **Tabelas** | 7 (`funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`, `funis_templates*`) |

**Arquitetura específica:**
- Maior módulo em componentes (46 arquivos)
- 18 permissões em 10 grupos (comentários, anexos, automações, etc.)
- 12 eventos (maior conjunto)
- **Credential Scopes** implementado
- Submódulo de Templates (`funis_templates`, `funis_template_cols`, `funis_template_tasks`)

### 3.10 Marketing

| Característica | Detalhe |
|---|---|
| **Key** | `marketing` |
| **Tipo** | Módulo de Negócio — Alta Complexidade |
| **Ambientes** | cadastro, tecnologia |
| **Permissões** | ~9 (distribuídas) |
| **Rotas** | 20 (maior) |
| **Design Config** | ❌ (nenhum submódulo) |
| **Tabelas** | 14 (`mktg_*` — maior) |

**Arquitetura específica:**
- **Arquitetura atípica**: submódulos independentes com `module.ts` próprio
- Módulo principal (`marketing/module.ts`) **não tem permissões próprias**
- 13 submódulos registrados como módulos independentes
- Nenhum submódulo tem `hasDesignConfig`
- Estrutura de submódulos:

```
src/features/marketing/
├── module.ts                  # Módulo principal (sem permissões)
├── dashboard/module.ts        # Dashboard
├── landing-pages/module.ts    # Landing Pages
├── meta-bm/module.ts          # Meta Ads
├── email-marketing/module.ts  # Email Marketing
├── calendario-editorial/module.ts
├── criativos/module.ts
├── seo/module.ts
├── utms/module.ts
├── pixels/module.ts
├── leads/module.ts
├── linktree/module.ts
└── whatsapp/module.ts
```

### 3.11 Hub

| Característica | Detalhe |
|---|---|
| **Key** | `hub` |
| **Tipo** | Módulo de Negócio — Alta Complexidade |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 28 (maior quantidade) |
| **Rotas** | 18 |
| **Design Config** | ✅ (com tema CSS próprio) |
| **Tabelas** | 15 (maior quantidade) |

**Arquitetura específica:**
- **Arquitetura multi-papel**: 5 papéis (Admin, Gestor, Consultor, Distribuidor, Cliente)
- Cada papel tem rotas e permissões específicas
- 28 permissões em 5 grupos (Materiais, Trilhas, Gamificação, Usuários, Admin)
- 15 tabelas, 7 ENUMs
- **Único módulo com CSS próprio** (`hub-theme.css`, `badge-animations.css`)
- Sistema de gamificação com badges, níveis e pontos
- Chatbot integrado

### 3.12 Empresa (Core Multi-tenant)

| Característica | Detalhe |
|---|---|
| **Key** | `empresas-core` |
| **Tipo** | Infraestrutura Core |
| **Permissões** | 0 próprias |
| **Rotas** | 22+ (maior) |
| **Design Config** | ✅ (rota própria `/empresa/design`) |

**Arquitetura específica:**
- **Módulo atípico**: não tem `permissions`, `ambientes`, ou `events`
- Acesso irrestrito (`permissionCheck: () => true`)
- Serviços em `src/shared/empresas/` (compartilhado)
- Provider em `src/core/empresa/` (infraestrutura)
- Gerencia permissões de outros módulos
- Define limites de credenciais por módulo
- 22+ rotas (maior que qualquer módulo de negócio)

### 3.13 Global (Infraestrutura)

| Característica | Detalhe |
|---|---|
| **Key** | N/A (sem module.ts) |
| **Tipo** | Infraestrutura Compartilhada |
| **Rotas** | 15 (`/global/*`) |
| **Arquitetura** | Descentralizada em `src/core/` e `src/features/` |

**Arquitetura específica:**
- **Não possui module.ts** — registro descentralizado
- Serviços espalhados em `src/core/services/` e `src/features/` avulsos
- 14 categorias de tabelas
- AuthProvider, EmpresaProvider, Permissions services
- Notificações, Webhooks, Atividades, Documentos

---

## 4. Matriz de Acoplamento

### 4.1 Acoplamento entre Módulos

```
              Cad  NPS  Map  Lnk  G.L  Rot  Des  CRM  Fun  Mkt  Hub  Emp  Glb
Cadastros     ─    N    N    N    N    N    N    N    N    N    N    N    S
NPS           N    ─    N    N    N    N    N    N    N    N    N    N    S
Mapas         N    N    ─    N    N    N    N    N    N    N    N    N    S
LinkTree      N    N    N    ─    N    N    N    N    N    N    N    N    S
Gerador Links N    N    N    N    ─    N    N    N    N    N    N    N    S
Rotas         N    N    N    N    N    ─    N    N    N    N    N    N    S
Despesas      N    N    N    N    N    N    ─    N    N    N    N    N    S
CRM           N    N    N    N    N    N    N    ─    N    N    N    S    S
Funis         N    N    N    N    N    N    N    N    ─    N    N    N    S
Marketing     N    N    N    N    N    N    N    N    N    ─    N    N    S
Hub           N    N    N    N    N    N    N    N    N    N    ─    N    S
Empresa       N    N    N    N    N    N    N    N    N    N    N    ─    S
Global        S    S    S    S    S    S    S    S    S    S    S    S    ─

Legenda: N = Não acoplado | S = Acoplado (usa serviços) | D = Direto
```

**Conclusão**: Módulos de negócio são **independentes entre si**. Todos se acoplam ao Global (infraestrutura) e ao Empresa (multi-tenancy).

### 4.2 Dependências de Cada Módulo

| Módulo | Depende de | Usado por |
|---|---|---|
| Cadastros | Global (auth, permissoes), Empresa | Ninguém |
| NPS | Global, Empresa | Ninguém |
| Mapas | Global, Empresa | Ninguém |
| LinkTree | Global, Empresa | Ninguém |
| Gerador Links | Global, Empresa | Ninguém |
| Rotas | Global, Empresa | Ninguém |
| Despesas | Global, Empresa | Ninguém |
| CRM | Global, Empresa, Cadastros (tabelas) | Ninguém |
| Funis | Global, Empresa | Ninguém |
| Marketing | Global, Empresa | Ninguém |
| Hub | Global, Empresa | Ninguém |
| Empresa | Global | Todos (via empresa_id) |
| Global | Nada | Todos |

---

## 5. Padrões por Complexidade

### 5.1 Alta Complexidade

**Hub, Funis, Cadastros, Marketing, CRM**

Características comuns:
- **15+ permissões** OU **13+ rotas** OU **10+ eventos**
- Múltiplos submódulos ou papéis
- Pipeline/fluxo de múltiplos estágios
- Sistema de eventos/notificações robusto
- Ricas interfaces com múltiplos componentes

**Diferenças internas:**

| Característica | Hub | Funis | Cadastros | Marketing | CRM |
|---|---|---|---|---|---|
| Permissões | 28 | 18 | 17 | ~9 | 10 |
| Rotas | 18 | 4 | 7 | 20 | 13 |
| Eventos | 8 | 12 | 6 | 0 | 3 |
| Tabelas | 15 | 7 | 6 | 14 | 10+ |
| Submódulos | 5 papéis | Templates | 3 sub | 13 sub | Hierarquia |

### 5.2 Média Complexidade

**Despesas, LinkTree, NPS**

Características comuns:
- **7-13 permissões**, **4-13 rotas**
- Pipeline de 2-3 estágios
- Tema customizável (design config)
- Múltiplas tabelas (4-6)

| Característica | Despesas | LinkTree | NPS |
|---|---|---|---|
| Permissões | 8 | 13 | 7 |
| Rotas | 4 | 6 | 6 |
| Eventos | 7 | 3 | 3 |
| Tabelas | 6 | 6 | 4 |
| Pipeline | 3 estágios | 2 submódulos | Survey + Dashboard |

### 5.3 Baixa Complexidade

**Mapas, Gerador Links, Rotas**

Características comuns:
- **≤6 permissões**, **≤9 rotas**
- Poucos eventos (0-8)
- Poucas tabelas (2-4)
- Interface mais simples

| Característica | Mapas | Gerador Links | Rotas |
|---|---|---|---|
| Permissões | 5 | 6 | 6 |
| Rotas | 7 | 9 | 3 |
| Eventos | 8 | 0 | 4 |
| Tabelas | 2 | 3 | 4 |
| Diferencial | Google Maps | QR Code | Google Maps |

---

## 6. Conclusões

### 6.1 Padrão Arquitetural Consolidado

```
Módulo de Negócio = ModuleDefinition + Service Layer + Rota + Componentes

1. ModuleDefinition (module.ts)
   ├── key, nome, descricao
   ├── routes (array de URLs)
   ├── permissions (array de chaves)
   ├── ambientes (quem pode acessar)
   ├── events (webhooks)
   └── setup() (registra tudo)

2. Permissions (permissions.ts)
   ├── Array de { key, label, description, group }
   └── Defaults por ambiente

3. Services (components/*)
   ├── Queries (React Query hooks)
   ├── Mutations (React Query mutations)
   └── UI Components

4. Route (src/routes/*.tsx)
   └── createRoute({ path, component })

5. Migration (supabase/migrations/*.sql)
   ├── CREATE TABLE with empresa_id
   ├── ALTER TABLE ENABLE ROW LEVEL SECURITY
   └── CREATE POLICY with is_super_admin OR empresa_id
```

### 6.2 Anomalias Arquiteturais

| Anomalia | Módulo | Impacto |
|---|---|---|
| Permissões sem prefixo | Cadastros | Inconsistência de nomenclatura |
| Submódulos como módulos independentes | Marketing | Complexidade de registro |
| Design Config ausente | Marketing, Gerador Links | Sem personalização visual |
| CSS próprio fora do design system | Hub | Risco de inconsistência visual |
| Tema JSONB externo | LinkTree | Duplicação de sistema de tema |
| Módulo sem module.ts | Global | Descoberta difícil |
| Subsistema CRM legado | CRM | Duplicação de funcionalidade |
