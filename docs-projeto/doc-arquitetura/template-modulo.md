# Template Arquitetural — Novo Módulo (ERP Conexão Pattern)

> **Baseado no padrão arquitetural dos 13 módulos do ERP Conexão**
> **Documento gerado em:** 04/07/2026

---

## Sumário

1. [Estrutura do Módulo](#1-estrutura-do-módulo)
2. [Arquivos do Módulo](#2-arquivos-do-módulo)
3. [Passo a Passo de Criação](#3-passo-a-passo-de-criação)
4. [Padrões Obrigatórios](#4-padrões-obrigatórios)
5. [Checklist por Complexidade](#5-checklist-por-complexidade)
6. [Exemplo Completo](#6-exemplo-completo)

---

## 1. Estrutura do Módulo

### 1.1 Frontend

```
src/features/<modulo>/
├── module.ts                    # Definição do módulo (OBRIGATÓRIO)
├── permissions.ts               # Permissões granulares (OPCIONAL)
├── types.ts                     # Types específicos (OPCIONAL)
└── components/                  # Componentes React (OPCIONAL)
    ├── DashboardPage.tsx
    ├── ListaPage.tsx
    ├── FormPage.tsx
    ├── DetailPage.tsx
    └── ...

src/routes/<modulo>.*.tsx        # Rotas TanStack Router (OBRIGATÓRIO)
src/routes/empresa.<modulo>-design.tsx  # Rota de design (SE aplicável)

supabase/migrations/<timestamp>_<modulo>_module.sql  # Migration (OBRIGATÓRIO)
```

### 1.2 Banco de Dados

```
Todas as tabelas do módulo devem:
├── Ter coluna empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE
├── Ter RLS habilitado (ALTER TABLE ... ENABLE ROW LEVEL SECURITY)
├── Ter RLS policy (is_super_admin_session() OR empresa_id = get_current_empresa_id())
├── Ter created_at TIMESTAMPTZ DEFAULT now()
└── Usar prefixo <modulo>_ (ex: nps_perguntas, mktg_campanhas)
```

---

## 2. Arquivos do Módulo

### 2.1 module.ts (OBRIGATÓRIO)

```typescript
import { IconName } from "lucide-react";
import { registerModule, registerNavItem } from "~/registry";
import { registerPermission } from "~/registry/permissions-registry";
import { registerPermissionDefaults } from "~/registry/defaults";
import type { ModuleDefinition } from "~/registry";
import { MODULO_PERMISSIONS } from "./permissions";

export const moduloModule: ModuleDefinition = {
  key: "meu-modulo",
  nome: "Meu Módulo",
  descricao: "Descrição do módulo",
  icon: IconName,

  // Rotas que o módulo ocupa
  routes: [
    "/meu-modulo",
    "/meu-modulo/dashboard",
    "/meu-modulo/itens",
    "/meu-modulo/itens/$id",
    "/meu-modulo/config",
  ],

  // Permissões associadas (chaves definidas em permissions.ts)
  permissions: ["mod_ver", "mod_criar", "mod_editar", "mod_excluir"],

  // Ambientes que podem acessar
  ambientes: ["cadastro", "consultor", "tecnologia"],

  // Abas de configuração (aparecem nas telas de permissão)
  abas: [
    {
      key: "mod-geral",
      label: "Geral",
      descricao: "Configurações gerais do módulo",
    },
    {
      key: "mod-avancado",
      label: "Avançado",
      descricao: "Configurações avançadas",
    },
  ],

  // Eventos que disparam webhooks
  events: [
    {
      key: "mod.item.criado",
      label: "Item Criado",
      descricao: "Dispara quando um novo item é criado",
      type: "status_change",
    },
    {
      key: "mod.item.atualizado",
      label: "Item Atualizado",
      descricao: "Dispara quando um item é atualizado",
      type: "status_change",
    },
    {
      key: "mod.item.excluido",
      label: "Item Excluído",
      descricao: "Dispara quando um item é excluído",
      type: "button_action",
    },
  ],

  // Flags opcionais
  hasDesignConfig: true,
  designRoute: "/empresa/meu-modulo/design",

  hasCredentialScopes: false,
  hasLaboratorio: false,
  hasCustomActions: false,
  hasApiConnectors: false,

  // Setup: registra permissões, defaults e nav-items
  setup: () => {
    // 1. Registrar permissões no registry global
    for (const p of MODULO_PERMISSIONS) {
      registerPermission({
        key: p.key,
        label: p.label,
        description: p.description,
        group: p.group,
      });
    }

    // 2. Registrar defaults por ambiente
    registerPermissionDefaults("meu-modulo", {
      cadastro: {
        mod_ver: true,
        mod_criar: true,
        mod_editar: true,
        mod_excluir: false,
      },
      consultor: {
        mod_ver: true,
        mod_criar: true,
        mod_editar: false,
        mod_excluir: false,
      },
      tecnologia: {
        mod_ver: true,
        mod_criar: true,
        mod_editar: true,
        mod_excluir: true,
      },
    });

    // 3. Registrar nav-items com permissionCheck
    registerNavItem({
      id: "mod-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/meu-modulo/dashboard",
      permissionCheck: (perms) => perms?.mod_ver === true,
      order: 10,
      moduloKey: "meu-modulo",
    });

    registerNavItem({
      id: "mod-itens",
      label: "Itens",
      icon: List,
      to: "/meu-modulo/itens",
      permissionCheck: (perms) => perms?.mod_ver === true,
      order: 20,
      moduloKey: "meu-modulo",
    });

    registerNavItem({
      id: "mod-config",
      label: "Configuração",
      icon: Settings,
      to: "/meu-modulo/config",
      permissionCheck: (perms) => perms?.mod_criar === true,
      order: 90,
      moduloKey: "meu-modulo",
    });
  },
};
```

### 2.2 permissions.ts (RECOMENDADO)

```typescript
export const MODULO_PERMISSIONS = [
  {
    key: "mod_ver" as const,
    label: "Visualizar",
    description: "Permite visualizar o módulo e seus dados",
    group: "Meu Módulo",
  },
  {
    key: "mod_criar" as const,
    label: "Criar",
    description: "Permite criar novos itens",
    group: "Meu Módulo",
  },
  {
    key: "mod_editar" as const,
    label: "Editar",
    description: "Permite editar itens existentes",
    group: "Meu Módulo",
  },
  {
    key: "mod_excluir" as const,
    label: "Excluir",
    description: "Permite excluir itens",
    group: "Meu Módulo",
  },
  {
    key: "mod_configurar" as const,
    label: "Configurar",
    description: "Permite acessar configurações do módulo",
    group: "Administração",
  },
] as const;

export type ModuloPermissao = (typeof MODULO_PERMISSIONS)[number]["key"];
```

### 2.3 types.ts (RECOMENDADO)

```typescript
// Tipos do módulo seguindo padrões da aplicação
export type ModuloItem = {
  id: string;
  empresa_id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo";
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ModuloItemInput = {
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo";
  config?: Record<string, unknown>;
};
```

### 2.4 Service Layer (RECOMENDADO)

**src/features/meu-modulo/service.ts**:
```typescript
import { supabase } from "~/core/supabase";
import type { ModuloItem, ModuloItemInput } from "./types";

export async function listarItens(empresaId: string): Promise<ModuloItem[]> {
  const { data, error } = await supabase
    .from("modulo_itens")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ModuloItem[];
}

export async function buscarItem(id: string): Promise<ModuloItem | null> {
  const { data } = await supabase
    .from("modulo_itens")
    .select("*")
    .eq("id", id)
    .single();
  return data as ModuloItem | null;
}

export async function criarItem(input: ModuloItemInput, empresaId: string): Promise<ModuloItem> {
  const { data, error } = await supabase
    .from("modulo_itens")
    .insert({ ...input, empresa_id: empresaId })
    .select()
    .single();

  if (error) throw error;
  return data as ModuloItem;
}

export async function atualizarItem(id: string, input: Partial<ModuloItemInput>): Promise<void> {
  const { error } = await supabase
    .from("modulo_itens")
    .update(input)
    .eq("id", id);

  if (error) throw error;
}

export async function deletarItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("modulo_itens")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
```

### 2.5 Queries e Mutations (RECOMENDADO)

**src/features/meu-modulo/queries.ts**:
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarItens, criarItem, atualizarItem, deletarItem } from "./service";
import type { ModuloItemInput } from "./types";
import { useAuth } from "~/lib/auth";
import toast from "react-hot-toast";

export function useItensQuery() {
  const { empresa } = useAuth();
  return useQuery({
    queryKey: ["modulo-itens", empresa?.id],
    queryFn: () => listarItens(empresa?.id ?? ""),
    enabled: !!empresa?.id,
    staleTime: 60_000,
  });
}

export function useCriarItemMutation() {
  const queryClient = useQueryClient();
  const { empresa } = useAuth();

  return useMutation({
    mutationFn: (input: ModuloItemInput) => criarItem(input, empresa?.id ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulo-itens"] });
      toast.success("Item criado com sucesso!");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useAtualizarItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ModuloItemInput> }) =>
      atualizarItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulo-itens"] });
      toast.success("Item atualizado!");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useDeletarItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletarItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulo-itens"] });
      toast.success("Item removido!");
    },
    onError: (error: any) => toast.error(error.message),
  });
}
```

### 2.6 Migration SQL (OBRIGATÓRIO)

**supabase/migrations/20260701000000_meu_modulo_module.sql**:
```sql
-- 001_meu_modulo_module.sql
-- Módulo: Meu Módulo
-- Descrição: Gerencia itens do meu módulo

-- ============================================================
-- 1. ENUMs (SE aplicável)
-- ============================================================
-- CREATE TYPE mod_status AS ENUM ('ativo', 'inativo');

-- ============================================================
-- 2. TABELAS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.modulo_itens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  descricao   TEXT,
  status      TEXT NOT NULL DEFAULT 'ativo'
              CHECK (status IN ('ativo', 'inativo')),
  config      JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS modulo_itens_empresa_idx
  ON modulo_itens(empresa_id);

CREATE INDEX IF NOT EXISTS modulo_itens_status_idx
  ON modulo_itens(empresa_id, status);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE modulo_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RLS modulo_itens" ON modulo_itens
  FOR ALL TO authenticated
  USING (
    is_super_admin_session()
    OR empresa_id = get_current_empresa_id()
  )
  WITH CHECK (
    is_super_admin_session()
    OR empresa_id = get_current_empresa_id()
  );

-- ============================================================
-- 5. TRIGGER updated_at
-- ============================================================

-- Usar trigger existente se houver, ou criar:
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_modulo_itens_updated_at
--   BEFORE UPDATE ON modulo_itens
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();
```

### 2.7 Rotas (OBRIGATÓRIO)

**src/routes/meu-modulo.dashboard.tsx**:
```typescript
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { DashboardPage } from "~/features/meu-modulo/components/DashboardPage";

export const moduloDashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/meu-modulo/dashboard",
  component: DashboardPage,
});
```

### 2.8 Registro no main.tsx (OBRIGATÓRIO)

```typescript
// Em src/main.tsx:
import { moduloModule } from "~/features/meu-modulo/module";
registerModule(moduloModule);
```

---

## 3. Passo a Passo de Criação

### 3.1 Sequência Recomendada

```
ETAPA 1 — Banco de Dados
├── Criar migration SQL com tabelas, RLS, índices
└── Aplicar migration no Supabase

ETAPA 2 — Types
├── Criar types.ts com interfaces do módulo
└── (Opcional) Definir ENUMs e tipos complexos

ETAPA 3 — Permissions
├── Criar permissions.ts com array de permissões
└── Seguir padrão de nomenclatura: {mod}_{acao}

ETAPA 4 — Module Definition
├── Criar module.ts
├── Definir key, nome, rotas, ambientes, abas, eventos
├── Implementar setup() com registerPermission + registerPermissionDefaults + registerNavItem
└── Registrar no main.tsx

ETAPA 5 — Services
├── Criar service.ts com funções CRUD
├── Criar queries.ts com React Query hooks
└── Usar supabase.from("modulo_tabela").*()

ETAPA 6 — Rotas
├── Criar rotas no src/routes/<modulo>.*.tsx
└── Cada rota: createRoute({ getParentRoute: () => authLayout, path, component })

ETAPA 7 — Componentes
├── DashboardPage
├── ListaPage / TablePage
├── FormPage (criar/editar)
└── DetailPage (opcional)

ETAPA 8 — Design Config (OPCIONAL)
├── Criar rota /empresa/<modulo>/design
├── Adicionar hasDesignConfig: true no module.ts
└── Usar ModuloDesignPage ou componente customizado

ETAPA 9 — Testes
├── Testes unitários dos serviços
└── Testes E2E das rotas (Playwright)
```

### 3.2 Comandos Úteis

```bash
# Criar estrutura do módulo
mkdir -p src/features/meu-modulo/components

# Gerar migration
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_meu_modulo_module.sql

# Gerar rota de dashboard
# src/routes/meu-modulo.dashboard.tsx

# Verificar types
npx tsc --noEmit

# Verificar lint
npm run lint

# Rodar testes
npm run test
```

---

## 4. Padrões Obrigatórios

### 4.1 Nomenclatura

| Item | Padrão | Exemplo Correto | Exemplo Errado |
|---|---|---|---|
| Key do módulo | `snake_case` | `meu-modulo` | `MeuModulo`, `meu modulo` |
| Chave de permissão | `{mod}_{acao}` | `mod_ver`, `mod_criar` | `ver_modulo`, `modulo.ver` |
| Prefixo de tabela | `{mod}_` | `modulo_itens` | `itens_modulo` |
| Rota de módulo | `/modulo/pagina` | `/meu-modulo/dashboard` | `/dashboard/meu-modulo` |
| Arquivo de rota | `modulo.pagina.tsx` | `meu-modulo.dashboard.tsx` | `dashboard.meu-modulo.tsx` |
| Nav item ID | `mod-pagina` | `mod-dashboard` | `dashboard-mod` |

### 4.2 Estrutura de Permissões

```typescript
// Sempre 4+ permissões para módulos de negócio:
// Básico (3): ver, criar, editar
// Destrutivo (1): excluir
// Administrativo (1+): configurar, gerenciar, aprovar

export const MINIMUM_PERMISSIONS = [
  { key: "mod_ver", label: "Visualizar", group: "Módulo" },
  { key: "mod_criar", label: "Criar", group: "Módulo" },
  { key: "mod_editar", label: "Editar", group: "Módulo" },
  { key: "mod_excluir", label: "Excluir", group: "Módulo" },
];
```

### 4.3 Componentes Obrigatórios

Toda rota deve tratar 3 estados:

```typescript
export function MinhaPagina() {
  const { data, isLoading, error } = useItensQuery();

  // 1. Loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  // 2. Error
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle />}
        title="Erro ao carregar"
        description={error.message}
      />
    );
  }

  // 3. Empty
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon />}
        title="Nenhum item encontrado"
        description="Crie seu primeiro item para começar"
      />
    );
  }

  // 4. Data
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mobile-first: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 */}
    </div>
  );
}
```

### 4.4 Padrão de Action Destrutiva

```typescript
// NUNCA usar window.confirm()
// SEMPRE usar AlertDialog

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

const [itemParaDeletar, setItemParaDeletar] = useState<ItemType | null>(null);

// Botão de ação destrutiva
<button onClick={() => setItemParaDeletar(item)}>
  <Trash2 size={14} />
</button>

// Modal de confirmação
<AlertDialog
  open={!!itemParaDeletar}
  onOpenChange={(o) => !o && setItemParaDeletar(null)}
>
  <AlertDialogContent className="bg-card border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-0 overflow-hidden max-w-sm">
    <div className="bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent px-6 pt-6 pb-4 border-b border-red-500/20">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
          <Trash2 className="h-6 w-6" />
        </div>
        <div>
          <AlertDialogTitle className="text-lg font-bold text-text-main">
            Excluir item?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-text-muted mt-0.5">
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </div>
      </div>
    </div>
    <div className="px-6 py-4">
      <p className="text-sm text-text-muted">
        O item será removido permanentemente.
      </p>
    </div>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end px-6 pb-6 pt-2 border-t border-border">
      <AlertDialogCancel className="rounded-xl px-6 border-border text-text-main hover:bg-surface-hover">
        Cancelar
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleConfirmDelete}
        className="rounded-xl px-6 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/25"
      >
        Excluir
      </AlertDialogAction>
    </div>
  </AlertDialogContent>
</AlertDialog>
```

### 4.5 Padrão Mobile-First

```typescript
// TODOS os layouts DEVEM começar com grid-cols-1 no mobile

// Grid: 1 coluna mobile → 2 tablet → 4 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>

// Headers: empilhar no mobile
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <h1 className="text-xl sm:text-2xl font-bold">Título</h1>
  <Button>Nova Ação</Button>
</div>

// Touch targets: min 44px
<button className="min-h-[44px] px-4 rounded-lg">Ação</button>

// Tabelas: scroll horizontal no mobile
<div className="overflow-x-auto">
  <table className="min-w-[600px]">...</table>
</div>

// Padding: menor no mobile
<div className="p-3 sm:p-4 lg:p-6">Conteúdo</div>
```

### 4.6 Padrão de Rota de Design (SE aplicável)

**src/routes/empresa.meu-modulo-design.tsx**:
```typescript
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuleDesignProvider } from "~/design-system";

export const empresaModuloDesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/meu-modulo/design",
  component: () => (
    <ModuleDesignProvider moduleKey="meu-modulo">
      {/* Componente de customização de design do módulo */}
    </ModuleDesignProvider>
  ),
});
```

---

## 5. Checklist por Complexidade

### 5.1 Módulo de Baixa Complexidade (≤6 permissões)

**Exemplos:** Mapas, Gerador Links, Rotas

```
[ ] permissions.ts — 4-6 permissões
[ ] module.ts — key, nome, rotas, setup()
[ ] 1-3 rotas principais
[ ] 1-3 tabelas no banco
[ ] RLS padrão (empresa_id)
[ ] 1 componente de página (Dashboard)
[ ] Design Config OPCIONAL
[ ] Eventos OPCIONAIS (0-4)
```

### 5.2 Módulo de Média Complexidade (7-13 permissões)

**Exemplos:** NPS, LinkTree, Despesas

```
[ ] permissions.ts — 7-13 permissões em 2+ grupos
[ ] module.ts — completo com abas e eventos
[ ] 3-6 rotas
[ ] 4-6 tabelas com índices
[ ] RLS padrão + possíveis políticas especiais
[ ] 2+ componentes (Dashboard + Form/List)
[ ] Design Config OBRIGATÓRIO
[ ] 3-7 eventos
[ ] Tests unitários dos serviços
[ ] Estados loading/empty/error em todas as páginas
```

### 5.3 Módulo de Alta Complexidade (15+ permissões)

**Exemplos:** Cadastros, Hub, Funis, Marketing, CRM

```
[ ] permissions.ts — 15-28 permissões em 3+ grupos
[ ] module.ts — completo com todas as flags
[ ] 7-22 rotas
[ ] 6-15 tabelas com índices
[ ] RLS padrão + políticas específicas por funcionalidade
[ ] 5+ componentes (Dashboard, List, Form, Detail, Config, Reports)
[ ] Design Config OBRIGATÓRIO
[ ] 6-12 eventos
[ ] Credential Scopes (SE aplicável)
[ ] Submódulos ou papéis (SE aplicável)
[ ] Tests unitários + E2E
[ ] Storybook dos componentes
```

---

## 6. Exemplo Completo

### 6.1 Módulo de Inventário (Exemplo Prático)

**Visão Geral:** Gerenciamento de inventário de produtos com categorias, controle de estoque e relatórios.

| Característica | Valor |
|---|---|
| **Key** | `inventario` |
| **Complexidade** | Média |
| **Permissões** | 7 |
| **Rotas** | 4 |
| **Tabelas** | 3 (`inv_produtos`, `inv_categorias`, `inv_movimentos`) |
| **Eventos** | 4 |

**Arquivos:**
```
src/features/inventario/
├── module.ts
├── permissions.ts      # inv_ver, inv_criar, inv_editar, inv_excluir, inv_configurar, inv_ver_relatorios, inv_exportar
├── types.ts
└── components/
    ├── DashboardPage.tsx
    ├── ProdutosListaPage.tsx
    ├── ProdutoFormPage.tsx
    └── RelatoriosPage.tsx

src/routes/
├── emp/inventario.tsx
├── inv.produtos.tsx
├── inv.produto.$id.tsx
└── inv.relatorios.tsx

supabase/migrations/
└── 20260701000000_inventario_module.sql
```

**Migration SQL:**
```sql
CREATE TABLE IF NOT EXISTS inv_categorias (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome       TEXT NOT NULL,
  cor        TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inv_categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RLS inv_categorias" ON inv_categorias FOR ALL TO authenticated
  USING (is_super_admin_session() OR empresa_id = get_current_empresa_id())
  WITH CHECK (is_super_admin_session() OR empresa_id = get_current_empresa_id());

CREATE TABLE IF NOT EXISTS inv_produtos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES inv_categorias(id) ON DELETE SET NULL,
  nome        TEXT NOT NULL,
  descricao   TEXT,
  preco       NUMERIC(10,2) DEFAULT 0,
  quantidade  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inv_produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RLS inv_produtos" ON inv_produtos FOR ALL TO authenticated
  USING (is_super_admin_session() OR empresa_id = get_current_empresa_id())
  WITH CHECK (is_super_admin_session() OR empresa_id = get_current_empresa_id());

CREATE TABLE IF NOT EXISTS inv_movimentos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES inv_produtos(id) ON DELETE CASCADE,
  tipo       TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
  quantidade INTEGER NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inv_movimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RLS inv_movimentos" ON inv_movimentos FOR ALL TO authenticated
  USING (is_super_admin_session() OR empresa_id = get_current_empresa_id())
  WITH CHECK (is_super_admin_session() OR empresa_id = get_current_empresa_id());

CREATE INDEX IF NOT EXISTS inv_produtos_empresa_idx ON inv_produtos(empresa_id);
CREATE INDEX IF NOT EXISTS inv_movimentos_produto_idx ON inv_movimentos(produto_id);
```
