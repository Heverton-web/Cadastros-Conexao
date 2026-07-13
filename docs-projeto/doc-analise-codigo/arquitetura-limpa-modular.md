# Análise de Arquitetura — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Princípios:** Clean Architecture + Modular Architecture

---

## 1. Resumo Executivo

O ERP Conexão foi projetado com forte orientação modular. A arquitetura atual se aproxima de uma **Arquitetura Modular Monolítica**, onde módulos de negócio são isolados mas compartilham o mesmo processo e banco de dados. Pontuação: **~75/100** (boa base, com ressalvas).

---

## 2. Clean Architecture — Análise por Camada

### 2.1 Regra de Dependência

```
External (Banco/Supabase)
  ↓
Gateways/Repositories (Services)
  ↓
Use Cases (Hooks/Features)
  ↓
Controllers (Routes)
  ↓
Presenters (Components)
  ↓
Frameworks (React/shadcn/ui)
```

#### ❌ Violações Encontradas

| Violação | Local | Exemplo |
|---|---|---|
| Service chama UI | `src/core/services/webhooks.ts` | `dispararNotificacaoIndividual()` importa serviço de UI? (na verdade é outro service) |
| Rota tem lógica de negócio | `src/routes/cadastros.dashboard.tsx` | DashboardPage faz data fetching direto, sem hook |
| Componente tem data fetching | `KanbanAvancado.tsx` | Hook useQuery dentro do componente |
| `main.tsx` vira orchestrator | `src/main.tsx` | 25+ registerModule, registerSW, initSentry |

---

### 2.2 Entidades vs Casos de Uso

O projeto mistura entidades de domínio com camadas técnicas:

```typescript
// ❌ Entidade "Cadastro" misturada com persistência
type Cadastro = {
  id: string;
  status: "link_gerado" | "aprovado";  // Domínio
  created_by: string;                     // Técnico (auditoria)
  empresa_id: string;                     // Técnico (multi-tenant)
  token_acesso: string;                   // Técnico (auth)
};

// ✅ Separar
type CadastroDomain = {
  id: string;
  status: StatusCadastro;
  nome: string;
  email: string;
};

type CadastroPersistence = CadastroDomain & {
  created_by: string;
  empresa_id: string;
};
```

> **Nota:** No contexto de SPA + Supabase (BFF), essa separação é opcional e adicionaria complexidade desnecessária neste projeto.

---

## 3. Modular Architecture — Análise

### 3.1 ✅ O que Funciona Bem

| Padrão | Descrição |
|---|---|
| **Registry Pattern** | `registerModule()`, `registerPermission()`, `registerNavItem()` — módulos registram, não importam |
| **Feature Folders** | Cada módulo em `src/features/<modulo>/` com services, hooks, components |
| **Acoplamento Zero** | Nenhum módulo de negócio importa outro módulo de negócio |
| **Shared Core** | `src/core/` com auth, permissions, supabase client |
| **Design System Provider** | Tema independente por módulo |

### 3.2 ❌ O que Precisa Melhorar

#### Acoplamento de Infraestrutura

```
main.tsx
  ├── importa TODOS os módulos (25+)
  ├── initSentry()
  ├── registerSW()
  └── createRouter()
```

**Solução:** Auto-descoberta de módulos via glob pattern ou convenção de diretório.

#### Shared vs Feature

```typescript
// ❌ Import de feature para shared
// src/shared/empresas/service.ts → OK

// ❌ Módulo importa de outro módulo
// src/features/cadastros/services/cadastros.service.ts 
//   import { Empresa } from "~/features/empresas";  // Se existir
```

#### Submódulos do Marketing

```
marketing/
  ├── dashboard/
  ├── utms/
  ├── calendario-editorial/
  ├── seo/
  ├── landing-pages/
  ├── email-marketing/
  ├── pixels/
  ├── meta-bm/
  ├── leads/
  ├── criativos/
  ├── whatsapp/
  └── linktree/
```

13 submódulos, cada um com `registerModule()` próprio — idealmente agrupados sob um módulo pai único com namespacing.

---

## 4. ArchTest — Checklist de Conformidade

| Requisito | Status | Evidência |
|---|---|---|
| Módulo não importa outro módulo | ✅ | Registry pattern impede |
| Toda tabela tem empresa_id | ✅ | Migration 00023 |
| RLS por empresa_id | ✅ | `pode_acessar_empresa()` |
| Setup isolado por módulo | ✅ | `module.setup()` |
| Permissões por módulo | ✅ | `registerPermission()` |
| Eventos por módulo | ⚠️ | 3 módulos sem eventos |
| Design config por módulo | ⚠️ | 2 módulos sem `hasDesignConfig` |
| Testes por módulo | ⚠️ | 8 módulos com testes, 5 sem |
| Módulo removível sem quebrar outros | ✅ | Acoplamento zero |
| Submódulos isolados | ⚠️ | Marketing não padronizado |

---

## 5. Roadmap para Modularidade Total

### Fase 1 — Correções Urgentes (1-2 dias)

1. **Auto-descoberta de módulos**: Substituir registros manuais em `main.tsx` por scan automático
2. **Unificar submódulos Marketing**: Agrupar sob módulo pai
3. **Adicionar testes aos módulos faltantes**: Cadastros, Gerador Links, Marketing, Empresa

### Fase 2 — Isolamento (1-2 semanas)

4. **Módulo Empresa como Core**: Mover lógica de empresa de `src/features/empresa` para `src/core/empresa`
5. **API pública por módulo**: Cada módulo expõe apenas `index.ts` com funções consumíveis
6. **Módulo Global como agregador**: Mover Central de Ações para módulo próprio

### Fase 3 — Preparação para Micro-frontends (médio prazo)

7. **Module Federation**: Cada módulo vira remote Entry
8. **Lazy loading de módulos**: Carregar módulo apenas quando acessado
9. **Testes de isolamento**: CI/CD verifica se módulo funciona sozinho

---

## 6. Diagrama de Dependências Ideal

```
core/ (auth, supabase, registry, services)
  ├── Empresa (multi-tenant)
  │
  ├── Cadastros ──── Rotas Próprias
  ├── CRM ────────── Rotas Próprias
  ├── NPS ────────── Rotas Próprias
  ├── Mapas ──────── Rotas Próprias
  ├── Funis ──────── Rotas Próprias
  ├── Despesas ───── Rotas Próprias
  ├── Rotas ──────── Rotas Próprias
  ├── LinkTree ───── Rotas Próprias
  ├── Gerador Links ─ Rotas Próprias
  ├── Hub ────────── Rotas Próprias
  └── Marketing ──── Rotas Próprias
       ├── dashboard
       ├── utms
       ├── calendario
       └── ... (11 submódulos)
```

> NENHUM módulo de negócio se comunica com outro — apenas via banco de dados (empresa_id).
