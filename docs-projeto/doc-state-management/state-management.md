# Análise de State Management — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** React Query + Context + Zustand

---

## 1. Visão Geral

O ERP Conexão utiliza **3 estratégias** de gerenciamento de estado, cada uma para um propósito específico:

| Estratégia | Uso | Persistência |
|---|---|---|
| **React Query** (TanStack Query) | Dados do servidor (API, cache, sync) | Memória + cache |
| **React Context** | Estado global de aplicação (auth, tema) | Memória |
| **Zustand + persist** | Estado persistente (auth-storage) | localStorage |

---

## 2. React Query (@tanstack/react-query)

### 2.1 Configuração Global

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,     // 1 min antes de refetch
    },
  },
});
```

### 2.2 Provider Stack

```typescript
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
</QueryClientProvider>
```

### 2.3 Padrão de Hooks

```typescript
// Query
export function useCadastros(empresaId: string) {
  return useQuery({
    queryKey: ["cadastros", empresaId],
    queryFn: () => listarCadastros(empresaId),
    enabled: !!empresaId,
  });
}

// Mutation
export function useCriarCadastro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarCadastro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadastros"] });
      toast.success("Cadastro criado!");
    },
  });
}
```

---

## 3. React Context

### 3.1 AuthProvider

```typescript
// src/core/auth/AuthProvider.tsx
// Estado gerenciado: user, profile, permissoes, modulosAcesso, empresa, modulosAtivos
// Métodos: login, logout, register, resetPassword, fetchProfile, refreshPermissoes
```

### 3.2 EmpresaContext

```typescript
// src/core/empresa/EmpresaContext.tsx
// Estado: empresa selecionada, dados da empresa
```

### 3.3 ThemeProvider / DesignSystemProvider

```typescript
// src/core/theme/ThemeProvider.tsx
// src/design-system/provider/DesignSystemProvider.tsx
// Estado: tema (cores, fontes) — resolvido em 4 níveis (Preset → Global → Empresa → Módulo)
```

---

## 4. Zustand (Persistente)

```typescript
// src/core/store/auth-store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      empresa: null,
      modulosAtivos: [],
      loading: true,
      // ...
    }),
    { name: "auth-storage" },  // localStorage
  ),
);
```

---

## 5. Fluxo de Dados

```
Usuário → Componente → Hook (useQuery) → Service → Supabase
                                 ↓
                           Cache (60s)
                                 ↓
                           Re-render
```

---

## 6. Estratégia de Cache Invalidation

| Evento | Ação |
|---|---|
| Mutation bem-sucedida | `invalidateQueries` da lista |
| Navegação | `refetchOnWindowFocus: true` (default) |
| Refresh manual | `queryClient.refetchQueries()` |
| Logout | `queryClient.clear()` |

---

## 7. Providers Stack (Ordem de Montagem)

```
main.tsx
  1. QueryClientProvider (React Query)
  2. AuthProvider (Context)
     └── RouterProvider (TanStack Router)
         └── DesignSystemProvider (CSS vars)
```
