# Análise de Fluxo de Dados — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Supabase → React Query → AuthProvider → Componente

---

## 1. Visão Geral

O fluxo de dados do ERP Conexão segue a arquitetura:

```
Supabase DB → Supabase Client → Service Layer → React Query → Componente
                                                   ↓
                                           Cache (staleTime: 60s)
```

---

## 2. Stack de Dados

| Camada | Tecnologia | Função |
|---|---|---|
| **Banco de Dados** | PostgreSQL (Supabase) | Armazenamento + RLS |
| **API Layer** | Supabase REST + RPC + Realtime | Comunicação cliente-bd |
| **Client** | `@supabase/supabase-js` | Conexão + auth |
| **Cache/Sync** | `@tanstack/react-query` @5 | Query/mutation/cache |
| **State Global** | React Context | Auth + Empresa + Tema |
| **State Persistente** | Zustand + persist | Auth store (localStorage) |

---

## 3. Supabase Client

```typescript
// src/core/supabase/client.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- **Anon Key**: Chave pública (RLS faz a segurança)
- **Config**: `main.tsx` — `staleTime: 60_000` (60s)
- **Portal**: Disponível via `app_config` para Super Admin

---

## 4. Padrões de Service Layer

Cada módulo possui services e hooks:

```
src/features/<modulo>/
  services/
    <modulo>.service.ts     → Supabase queries
    <modulo>.queries.ts     → React Query keys + options
  hooks/
    use<Modulo>.ts          → Custom hooks (React Query)
```

### Exemplo de Service

```typescript
export async function listarDespesas(empresaId: string) {
  const { data, error } = await supabase
    .from("despesas")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Despesa[];
}
```

### Exemplo de Hook (React Query)

```typescript
export function useDespesas(empresaId: string) {
  return useQuery({
    queryKey: ["despesas", empresaId],
    queryFn: () => listarDespesas(empresaId),
    staleTime: 30_000,  // 30s before refetch
    enabled: !!empresaId,
  });
}

export function useCriarDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DespesaInput) => criarDespesa(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["despesas"] }),
  });
}
```

---

## 5. React Query Configuration

```typescript
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,  // 1 min cache global
    },
  },
});
```

### Padrões

| Aspecto | Padrão | Customizado |
|---|---|---|
| `staleTime` | 60s | 5s (notificações), 30s (despesas), Infinity (design tokens) |
| `gcTime` | 5 min | — |
| `retry` | 3 | 1 (tabelas críticas) |
| `refetchOnWindowFocus` | true | — |
| `enabled` | true | `!!id` para queries condicionais |

---

## 6. Providers Stack

```
QueryClientProvider (React Query)
  └── AuthProvider (Context: user, profile, permissoes, empresa)
      └── RouterProvider (TanStack Router)
          └── DesignSystemProvider (Tema: CSS vars)
```

---

## 7. Padrão de Cache Invalidation

```typescript
// Após mutation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["despesas"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
}

// Ou após ação manual
const { data } = await supabase.from("despesas").insert(input);
queryClient.setQueryData(["despesas", empresaId], (old) => [data, ...old]);
```

---

## 8. Dados de Autenticação (AuthProvider)

O `AuthProvider` carrega **7 dados** no login:

1. `user` — Supabase Auth user
2. `profile` — Tabela `profiles` (nome, role, ambiente, is_super_admin, empresa_id)
3. `permissoes` — Tabela `permissoes` (JSONB) + merge com `modulos_acesso`
4. `modulosAcesso` — Hierarquia de módulos/páginas/ações
5. `empresa` — `empresas` + `empresas_config` (logo, tema, branding)
6. `modulosAtivos` — `modulos_empresa` (quais módulos liberados)

---

## 9. Estratégia de Cache

| Tipo de Dado | Cache | Motivo |
|---|---|---|
| Permissões | Context (memória) | Muda raramente |
| Empresa config | Context (memória) | Muda raramente |
| Design tokens | Context + Infinity stale | Atualizado manualmente |
| Listas (cadastros, despesas) | React Query 60s | Mudam frequentemente |
| Notificações | React Query 5s | Precisa de tempo real |
| Dados de mapa | React Query Infinity | Dados estáticos |
