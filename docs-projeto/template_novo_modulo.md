# TEMPLATE — Workflow de Integração de Novo Módulo ao ERP Conexão

**Última atualização:** 29/06/2026
**Referência:** [Plano CRM](./plan_novo_modulo.md) | [Plano Hub](./PLANO-MODULO-HUB.md)

---

## Visão Geral

Este documento descreve o workflow padrão para integrar qualquer aplicação standalone como um novo módulo no ERP Conexão. Siga cada fase na ordem.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  FASE 1     │───▶│  FASE 2     │───▶│  FASE 3     │───▶│  FASE 4     │───▶│  FASE 5     │
│  Descoberta  │    │  Decisões   │    │  Migração   │    │  Integração │    │  Validação  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## FASE 1 — Descoberta e Análise

### 1.1. Analisar o repositório fonte

Acesse o repositório GitHub/clonado e mapeie:

| Item | Onde buscar | O que anotar |
|------|-------------|--------------|
| **Stack** | `package.json` | Framework, build tool, UI lib, versões |
| **Banco** | `supabase/migrations/` | Lista de migrations, nomes de tabelas |
| **Rotas** | `src/routes/` | Lista completa de arquivos de rota |
| **Componentes** | `src/components/` | Componentes próprios vs `ui/` genéricos |
| **Hooks** | `src/hooks/` | Hooks customizados |
| **Libs** | `src/lib/` | Funções de negócio, utils, services |
| **Integrações** | `src/integrations/` | Client Supabase, types, middleware |
| **Auth** | `src/hooks/useAuth.tsx` | Como autentica, o que retorna |

**Preencher tabela:**

```markdown
| Aspecto        | Detalhe                          |
|----------------|----------------------------------|
| Stack          | [framework] + [build] + [UI]     |
| Linguagem      | [TS %, JS %, SQL %]              |
| UI             | [lib UI]                         |
| Banco          | [Supabase/PostgreSQL/Outro]      |
| Autenticação   | [Supabase Auth / JWT / Outro]    |
| Migrations     | [N] arquivos SQL                 |
| Rotas          | [N] arquivos                     |
| Componentes    | [N] componentes próprios         |
| Hooks          | [lista]                          |
| Libs           | [lista]                          |
```

### 1.2. Analisar o ERP destino

Ler os seguintes arquivos do ERP:

| Arquivo | O que extrair |
|---------|---------------|
| `src/registry/modules.ts` | Tipo `ModuleDefinition`, funções de registro |
| `src/registry/nav-items.ts` | Tipo `NavItemRegistration`, `getNavItems()` |
| `src/registry/permissions-registry.ts` | Tipo `PermissionDefinition` |
| `src/features/` | Módulos existentes, ordens de nav items usadas |
| `src/routes/_auth.tsx` | Como `AuthGuard` carrega módulos |
| `package.json` | Dependências já instaladas |

### 1.3. Comparar stacks

Criar tabela de compatibilidade:

```markdown
| Componente       | Fonte | ERP  | Compatível? |
|------------------|-------|------|-------------|
| React            | [ver] | [ver]| [✅/❌]     |
| Router           | [ver] | [ver]| [✅/❌]     |
| Vite             | [ver] | [ver]| [✅/❌]     |
| UI lib           | [ver] | [ver]| [✅/❌]     |
| Tailwind         | [ver] | [ver]| [✅/❌]     |
| Supabase         | [ver] | [ver]| [✅/❌]     |
| zod              | [ver] | [ver]| [✅/❌]     |
```

**Se houver incompatibilidade** → documentar adaptações necessárias.

### 1.4. Verificar dependências novas

```bash
# Listar deps do package.json fonte que NÃO existem no ERP
diff <(jq -r '.dependencies | keys[]' fonte/package.json | sort) \
     <(jq -r '.dependencies | keys[]' erp/package.json | sort)
```

**Resultado:** Lista de pacotes para instalar com `npm install`.

---

## FASE 2 — Decisões de Arquitetura

### 2.1. Decisões obrigatórias

Preencher **antes** de começar a codar:

| Decisão | Opções | Escolha | Justificativa |
|---------|--------|---------|---------------|
| **Banco de dados** | Mesmo DB / DB separado | `[escolha]` | `[motivo]` |
| **Estratégia** | Módulo feature / Subpasta / Clone | `[escolha]` | `[motivo]` |
| **Componentes UI** | Reusar `ui/` / Copiar | `[escolha]` | `[motivo]` |
| **Supabase client** | Reusar / Novo client | `[escolha]` | `[motivo]` |
| **Auth** | Reusar `useAuth` / Adaptar | `[escolha]` | `[motivo]` |
| **Rotas** | Prefixo `X.*` / Outro padrão | `[escolha]` | `[motivo]` |
| **Migrations** | Copiar / Já aplicadas | `[escolha]` | `[motivo]` |
| **Types** | Mesclar / Separar | `[escolha]` | `[motivo]` |

### 2.2. Definir identidade do módulo

```markdown
- **Key:** `[nome]-conexao` (ex: `crm-conexao`, `hub-conexao`)
- **Nome:** `[Nome de Exibição]`
- **Descrição:** `[uma frase]`
- **Ícone:** `[LucideIcon name]`
- **Prefixo de permissão:** `[nome]_` (ex: `crm_`, `hub_`)
- **Prefixo de rota:** `[nome].` (ex: `crm.`, `hub.`)
- **Ordem nav items:** `[faixa]` (ex: 50-59, consultar ordens existentes)
```

### 2.3. Mapear permissões

Listar todas as permissões do módulo:

```markdown
| Key                  | Label              | Descrição                        | Grupo          |
|----------------------|--------------------|----------------------------------|----------------|
| [prefixo]_dashboard  | Acessar dashboard  | Visualizar painel principal      | [Módulo] - Geral |
| [prefixo]_acao_1     | [Label]            | [Descrição]                      | [Módulo] - [Grupo] |
| ...                  | ...                | ...                              | ...            |
```

### 2.4. Mapear nav items

```markdown
| ID                  | Label     | Icon            | Rota                  | Ordem | Permissão check         |
|---------------------|-----------|-----------------|-----------------------|-------|-------------------------|
| [prefixo]-dashboard | Dashboard | LayoutDashboard | /[prefixo]/dashboard  | [N]   | perms?.[prefixo]_dashboard |
| ...                 | ...       | ...             | ...                   | ...   | ...                     |
```

---

## FASE 3 — Migração de Código

### 3.1. Clonar repositório fonte

```bash
git clone [URL_REPO] C:\Users\trcnologia\Desktop\PROJETOS\proj_erp\_temp_[modulo]
```

### 3.2. Criar estrutura de feature

```
src/features/[modulo]/
├── module.ts           # ModuleDefinition + setup()
├── permissions.ts      # Array de permissões
├── index.ts            # Barrel export
├── components/         # Componentes específicos
├── hooks/              # Hooks específicos (se necessário)
├── lib/                # Funções de negócio
├── services/           # Acesso a dados Supabase
└── types/              # Tipos TypeScript
```

### 3.3. Mapear e copiar rotas

**Regra de nomenclatura TanStack Router flat file:**

| Fonte (standalone) | ERP (módulo) | Regra |
|---------------------|--------------|-------|
| `_auth.[rota].tsx` | `_auth.[prefixo].[rota].tsx` | Inserir prefixo após `_auth.` |
| `[rota].tsx` (pública) | `[prefixo].[rota].tsx` | Inserir prefixo antes da rota |
| `__root.tsx` | **NÃO COPIAR** | ERP já tem root |
| `index.tsx` (login) | **NÃO COPIAR** | ERP já tem login |
| `_auth.tsx` (layout) | **NÃO COPIAR** | ERP já tem AuthGuard |

**Tabela de mapeamento:**

```markdown
| Fonte                          | Destino                                | URL resultante              |
|--------------------------------|----------------------------------------|-----------------------------|
| `_auth.dashboard.tsx`          | `_auth.[prefixo].dashboard.tsx`        | /[prefixo]/dashboard        |
| `_auth.secao.tsx`              | `_auth.[prefixo].secao.tsx`            | /[prefixo]/secao            |
| `_auth.secao.sub.tsx`          | `_auth.[prefixo].secao.sub.tsx`        | /[prefixo]/secao/sub        |
| `_auth.secao.$id.tsx`          | `_auth.[prefixo].secao.$id.tsx`        | /[prefixo]/secao/:id        |
| `aceitar-convite.$token.tsx`   | `[prefixo].aceitar-convite.$token.tsx` | /[prefixo]/aceitar-convite/:token |
| `__root.tsx`                   | **NÃO COPIAR**                         | —                           |
| `index.tsx` (login)            | **NÃO COPIAR**                         | —                           |
| `_auth.tsx` (layout)           | **NÃO COPIAR**                         | —                           |
```

### 3.4. Mapear e copiar componentes

```markdown
| Componente fonte      | Destino no ERP                      | Ação          |
|-----------------------|-------------------------------------|---------------|
| `[ComponenteA].tsx`   | `features/[modulo]/components/`     | Copiar        |
| `[ComponenteB].tsx`   | `features/[modulo]/components/`     | Copiar        |
| `ui/*`                | **NÃO COPIAR**                      | Reusar do ERP |
```

### 3.5. Mapear e copiar hooks e libs

```markdown
| Arquivo fonte                   | Destino no ERP                      | Ação                    |
|---------------------------------|-------------------------------------|-------------------------|
| `hooks/useAuth.tsx`             | **NÃO COPIAR**                      | Reusar do ERP           |
| `hooks/use-[custom].tsx`        | `features/[modulo]/hooks/`          | Copiar                  |
| `lib/[funcao].ts`               | `features/[modulo]/lib/`            | Copiar                  |
| `lib/utils.ts`                  | **NÃO COPIAR**                      | Reusar `cn()` do ERP    |
| `integrations/supabase/client.ts` | **NÃO COPIAR**                    | Reusar do ERP           |
| `integrations/supabase/types.ts`  | Mesclar no types.ts do ERP        | Adicionar tabelas novas |
| `integrations/supabase/auth-*.ts` | **NÃO COPIAR**                    | Reusar do ERP           |
```

### 3.6. Aplicar migrations SQL

```bash
# Copiar arquivos de migration
cp _temp_[modulo]/supabase/migrations/*.sql erp-conexao/supabase/migrations/
```

**Antes de aplicar, verificar:**
- [ ] Nomes de tabelas não conflitam com existentes
- [ ] RLS policies não quebram acesso existente
- [ ] Foreign keys referenciam tabelas corretas

### 3.7. Adaptar imports

**Substituições globais em todos os arquivos copiados:**

| De | Para | Motivo |
|----|------|--------|
| `from "@/components/ui/` | `from "~/components/ui/"` | Padrão ERP usa `~/` |
| `from "@/hooks/useAuth"` | `from "~/hooks/useAuth"` | Reusar auth do ERP |
| `from "@/integrations/supabase"` | `from "~/integrations/supabase"` | Reusar client do ERP |
| `from "@/lib/utils"` | `from "~/lib/utils"` | Reusar utils do ERP |
| `from "@/registry"` | `from "~/registry"` | Padrão ERP |

### 3.8. Instalar dependências novas

```bash
cd erp-conexao
npm install [pacote1] [pacote2] ...
```

---

## FASE 4 — Integração no Registry

### 4.1. Criar `permissions.ts`

```typescript
// src/features/[modulo]/permissions.ts

export const [MODULO]_PERMISSIONS = [
  {
    key: "[prefixo]_dashboard" as const,
    label: "Acessar dashboard",
    description: "Visualizar painel principal do módulo",
    group: "[Módulo] - Geral",
  },
  // ... mais permissões
];
```

### 4.2. Criar `module.ts`

```typescript
// src/features/[modulo]/module.ts

import { [Icon1], [Icon2] } from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { [MODULO]_PERMISSIONS } from "./permissions";

export const [modulo]Module: ModuleDefinition = {
  key: "[modulo]-conexao",
  nome: "[Nome]",
  descricao: "[Descrição]",
  icon: [IconPrincipal],
  routes: [
    "/[prefixo]/dashboard",
    "/[prefixo]/rota1",
    // ... todas as rotas do módulo
  ],
  permissions: [MODULO]_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral", descricao: "Configurações gerais" },
    { key: "permissoes", label: "Permissões", descricao: "Gerenciar permissões" },
    // ... abas do módulo (para painel admin global)
  ],
  events: [
    // ... eventos do módulo (opcional)
  ],
  setup: () => {
    // 1. Registrar permissões
    for (const p of [MODULO]_PERMISSIONS) {
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      });
    }

    // 2. Registrar nav items
    registerNavItem({
      id: "[prefixo]-dashboard",
      label: "Dashboard",
      icon: [IconDashboard],
      to: "/[prefixo]/dashboard",
      permissionCheck: (perms) => perms?.[prefixo]_dashboard === true,
      order: [N],
      moduloKey: "[modulo]-conexao",
    });
    // ... mais nav items
  },
};
```

### 4.3. Criar `index.ts`

```typescript
// src/features/[modulo]/index.ts

export { [modulo]Module } from "./module";
export { [MODULO]_PERMISSIONS } from "./permissions";
```

### 4.4. Verificar registro automático

O `AuthGuard` em `_auth.tsx` já carrega módulos dinamicamente. **Não é necessário** alterar o registry manualmente — basta que o `module.ts` exporte o módulo e que ele seja importado em algum lugar que o `AuthGuard` processe.

Se o módulo não aparecer automaticamente, verificar se há um import centralizado dos módulos.

---

## FASE 5 — Validação

### 5.1. Lint e TypeCheck

```bash
npm run lint
npx tsc --noEmit
```

### 5.2. Dev server

```bash
npm run dev
```

### 5.3. Checklist de validação

- [ ] Módulo aparece na sidebar (para super_admin)
- [ ] Permissões funcionam (nav items filtrados por permissão)
- [ ] Todas as rotas carregam sem erro 404
- [ ] Componentes renderizam corretamente
- [ ] Dados do Supabase carregam (queries funcionam)
- [ ] Auth funciona (rotas protegidas redirecionam)
- [ ] Nenhum erro no console do browser
- [ ] Nenhum erro no terminal (Vite/SSR)

### 5.4. Limpeza

```bash
# Remover pasta temporária
rm -rf _temp_[modulo]
```

---

## Referências de Padrões do ERP

### ModuleDefinition (tipo completo)

```typescript
type ModuleDefinition = {
  key: string;              // Único, ex: "crm-conexao"
  nome: string;             // Nome de exibição
  descricao: string;        // Uma frase
  icon: LucideIcon;         // Ícone do lucide-react
  routes: string[];         // Todas as rotas do módulo
  ambientes: string[];      // Ambientes onde aparece
  abas: ModuleAba[];        // Abas do painel admin
  permissions: string[];    // Keys de permissão
  events: ModuleEvent[];    // Eventos do módulo
  setup?: () => void;       // Função de registro (chamada pelo AuthGuard)
};
```

### NavItemRegistration (tipo completo)

```typescript
type NavItemRegistration = {
  id: string;               // Único, ex: "crm-dashboard"
  label: string;            // Texto na sidebar
  icon: LucideIcon;         // Ícone
  to: string;               // Rota TanStack Router
  permissionCheck: (perms: Record<string, boolean> | null) => boolean;
  order: number;            // Ordem na sidebar (consultar faixas existentes)
  moduloKey?: string;       // Key do módulo pai
  matchPaths?: string[];    // Paths extras para active state
  noChildMatch?: boolean;   // Ignorar child paths no match
};
```

### Faixas de ordem na sidebar

| Faixa | Módulo |
|-------|--------|
| 1-9 | Cadastros |
| 10-19 | — |
| 20-29 | — |
| 25-30 | Hub Admin |
| 35-47 | Hub Gestor/Consultor |
| 50-59 | — |
| 55-56 | Hub Distribuidor |
| 60-69 | — |
| 70-79 | — |
| 80-89 | — |
| 90-99 | — |
| 100+ | Disponível |

**Para novo módulo:** Usar faixa não ocupada (consultar `src/features/*/module.ts`).

### Imports padrão do ERP

```typescript
// Registry
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";

// Auth
import { useAuth } from "~/hooks/useAuth";

// Supabase
import { supabase } from "~/integrations/supabase/client";

// UI
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

// Utils
import { cn } from "~/lib/utils";
```
