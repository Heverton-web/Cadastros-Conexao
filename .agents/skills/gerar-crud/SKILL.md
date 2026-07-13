---
name: gerar-crud
description: >
  Gera operações CRUD completas com React Query hooks, paginação, ordenação,
  filtros avançados, validação Zod, tratamento de erros e cache strategies.
  Valida multi-tenant (empresa_id obrigatório) em todas as queries.
  Trigger: "gerar crud", "criar crud", "operações crud"
---

# Gerar CRUD — ERP Odonto

Gera service completo + hooks React Query com funcionalidades avançadas.

## Pré-requisitos

- Módulo deve existir em `src/features/<modulo>/`
- Tabela deve existir no Supabase

## Workflow

### Step 1: Coletar informações

- **Módulo:** kebab-case (ex: `cadastros`)
- **Entidade:** PascalCase (ex: `Cadastro`)
- **Tabela:** snake_case no Supabase (ex: `cadastros`)
- **Campos:** lista de campos com tipos

### Step 2: Ler schema da tabela

```bash
# Via MCP Supabase
supabase_describe_table schema=public table=<tabela>
```

Mapear tipos PostgreSQL → TypeScript:

| PostgreSQL | TypeScript |
|------------|------------|
| uuid | string |
| text | string |
| varchar | string |
| integer | number |
| bigint | number |
| numeric | number |
| boolean | boolean |
| timestamptz | string |
| jsonb | Record<string, unknown> |
| enum | union type |

### Step 3: Gerar types.ts

```typescript
// src/features/<modulo>/types.ts

export interface {{MODULO_PASCAL}} {
  id: string;
  empresa_id: string;
  created_at: string;
  updated_at: string;
  // campos da tabela
}

export interface Criar{{MODULO_PASCAL}}Input {
  // campos de criação (sem id, empresa_id, timestamps)
}

export interface Atualizar{{MODULO_PASCAL}}Input {
  id: string;
  // campos de atualização (parcial)
}

export interface Filtros{{MODULO_PASCAL}} {
  busca?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  ordenarPor?: keyof {{MODULO_PASCAL}};
  direcao?: "asc" | "desc";
  pagina?: number;
  itensPorPagina?: number;
}

export interface PaginacaoResponse<T> {
  data: T[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}
```

### Step 4: Gerar service.ts

```typescript
// src/features/<modulo>/services/<entidade>.service.ts

import { supabase } from "~/lib/supabase";
import { dispararEventoModulo } from "~/core/services/webhooks";
import type {
  {{MODULO_PASCAL}},
  Criar{{MODULO_PASCAL}}Input,
  Atualizar{{MODULO_PASCAL}}Input,
  Filtros{{MODULO_PASCAL}},
  PaginacaoResponse,
} from "../types";

const TABELA = "{{TABELA}}";
const MODULO_KEY = "{{MODULO_KEY}}";

export const {{MODULO_CAMEL}}Service = {
  // ═══ LISTAR COM FILTROS E PAGINAÇÃO ═══
  async listar(
    empresaId: string,
    filtros: Filtros{{MODULO_PASCAL}} = {}
  ): Promise<PaginacaoResponse<{{MODULO_PASCAL}}>> {
    const {
      busca,
      status,
      dataInicio,
      dataFim,
      ordenarPor = "created_at",
      direcao = "desc",
      pagina = 1,
      itensPorPagina = 20,
    } = filtros;

    let query = supabase
      .from(TABELA)
      .select("*", { count: "exact" })
      .eq("empresa_id", empresaId);

    // Filtros
    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,descricao.ilike.%${busca}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (dataInicio) {
      query = query.gte("created_at", dataInicio);
    }
    if (dataFim) {
      query = query.lte("created_at", dataFim);
    }

    // Ordenação
    query = query.order(ordenarPor, { ascending: direcao === "asc" });

    // Paginação
    const inicio = (pagina - 1) * itensPorPagina;
    query = query.range(inicio, inicio + itensPorPagina - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      pagina,
      itensPorPagina,
      totalPaginas: Math.ceil((count || 0) / itensPorPagina),
    };
  },

  // ═══ BUSCAR POR ID ═══
  async buscarPorId(id: string, empresaId: string): Promise<{{MODULO_PASCAL}} | null> {
    const { data, error } = await supabase
      .from(TABELA)
      .select("*")
      .eq("id", id)
      .eq("empresa_id", empresaId)
      .single();

    if (error) throw error;
    return data;
  },

  // ═══ CRIAR ═══
  async criar(input: Criar{{MODULO_PASCAL}}Input, empresaId: string): Promise<{{MODULO_PASCAL}}> {
    const { data, error } = await supabase
      .from(TABELA)
      .insert({ ...input, empresa_id: empresaId })
      .select()
      .single();

    if (error) throw error;

    dispararEventoModulo(
      MODULO_KEY,
      "{{MODULO_KEY}}.criado",
      { id: data.id, empresa_id: empresaId },
      empresaId
    ).catch(() => {});

    return data;
  },

  // ═══ ATUALIZAR ═══
  async atualizar(
    input: Atualizar{{MODULO_PASCAL}}Input,
    empresaId: string
  ): Promise<{{MODULO_PASCAL}}> {
    const { id, ...campos } = input;
    const { data, error } = await supabase
      .from(TABELA)
      .update(campos)
      .eq("id", id)
      .eq("empresa_id", empresaId)
      .select()
      .single();

    if (error) throw error;

    dispararEventoModulo(
      MODULO_KEY,
      "{{MODULO_KEY}}.atualizado",
      { id, empresa_id: empresaId },
      empresaId
    ).catch(() => {});

    return data;
  },

  // ═══ EXCLUIR ═══
  async excluir(id: string, empresaId: string): Promise<void> {
    const { error } = await supabase
      .from(TABELA)
      .delete()
      .eq("id", id)
      .eq("empresa_id", empresaId);

    if (error) throw error;

    dispararEventoModulo(
      MODULO_KEY,
      "{{MODULO_KEY}}.excluido",
      { id, empresa_id: empresaId },
      empresaId
    ).catch(() => {});
  },

  // ═══ CONTAR ═══
  async contar(empresaId: string, filtros: Filtros{{MODULO_PASCAL}} = {}): Promise<number> {
    let query = supabase
      .from(TABELA)
      .select("*", { count: "exact", head: true })
      .eq("empresa_id", empresaId);

    if (filtros.status) {
      query = query.eq("status", filtros.status);
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  },
};
```

### Step 5: Gerar hooks/use<Entidade>.ts

```typescript
// src/features/<modulo>/hooks/use<Entidade>.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { {{MODULO_CAMEL}}Service } from "../services/{{MODULO_KEY}}.service";
import type {
  Criar{{MODULO_PASCAL}}Input,
  Atualizar{{MODULO_PASCAL}}Input,
  Filtros{{MODULO_PASCAL}},
} from "../types";

const QUERY_KEY = "{{MODULO_KEY}}";

// ═══ LISTAR ═══
export function use{{MODULO_PASCAL}}s(empresaId: string, filtros: Filtros{{MODULO_PASCAL}} = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, empresaId, filtros],
    queryFn: () => {{MODULO_CAMEL}}Service.listar(empresaId, filtros),
    enabled: !!empresaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// ═══ BUSCAR POR ID ═══
export function use{{MODULO_PASCAL}}(id: string, empresaId: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id, empresaId],
    queryFn: () => {{MODULO_CAMEL}}Service.buscarPorId(id, empresaId),
    enabled: !!id && !!empresaId,
  });
}

// ═══ CRIAR ═══
export function useCriar{{MODULO_PASCAL}}(empresaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Criar{{MODULO_PASCAL}}Input) =>
      {{MODULO_CAMEL}}Service.criar(input, empresaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, empresaId] });
    },
  });
}

// ═══ ATUALIZAR ═══
export function useAtualizar{{MODULO_PASCAL}}(empresaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Atualizar{{MODULO_PASCAL}}Input) =>
      {{MODULO_CAMEL}}Service.atualizar(input, empresaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, empresaId] });
    },
  });
}

// ═══ EXCLUIR ═══
export function useExcluir{{MODULO_PASCAL}}(empresaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {{MODULO_CAMEL}}Service.excluir(id, empresaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, empresaId] });
    },
  });
}

// ═══ CONTAR ═══
export function useContar{{MODULO_PASCAL}}s(empresaId: string, filtros: Filtros{{MODULO_PASCAL}} = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, "count", empresaId, filtros],
    queryFn: () => {{MODULO_CAMEL}}Service.contar(empresaId, filtros),
    enabled: !!empresaId,
  });
}
```

### Step 6: Validar

```bash
npm run build   # deve passar sem erros
npm run lint    # deve passar
```

### Step 7: Commit

```bash
git add src/features/<modulo>/services/ src/features/<modulo>/hooks/ src/features/<modulo>/types.ts
git commit -m "feat(<modulo>): gerar CRUD completo com paginação e filtros"
```

## Regras Obrigatórias

1. **empresa_id** — toda query filtra por empresa_id
2. **dispararEventoModulo()** — fire-and-forget com `.catch(() => {})`
3. **Ordenação padrão** — created_at desc
4. **Paginação** — padrão 20 itens por página
5. **Stale time** — 5 minutos para queries frequentes
6. **Invalidação** — sempre invalidar cache após mutações

## Economia de Tokens

- **Lean-CTX:** Ler apenas schema da tabela
- **Caveman:** Service e hooks são templates reutilizáveis
- **Pre-flight:** Rodar build após cada alteração
