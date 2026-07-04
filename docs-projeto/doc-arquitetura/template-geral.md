# Template Arquitetural — Nova Aplicação (ERP Conexão Pattern)

> **Baseado no padrão arquitetural do ERP Conexão**
> **Documento gerado em:** 04/07/2026

---

## Sumário

1. [Stack Recomendado](#1-stack-recomendado)
2. [Estrutura de Diretórios](#2-estrutura-de-diretórios)
3. [Passo a Passo de Criação](#3-passo-a-passo-de-criação)
4. [Configuração Inicial](#4-configuração-inicial)
5. [Padrões de Código](#5-padrões-de-código)
6. [Checklist de Qualidade](#6-checklist-de-qualidade)

---

## 1. Stack Recomendado

### 1.1 Frontend

| Tecnologia | Versão Mínima | Finalidade |
|---|---|---|
| **React** | 19.x | Biblioteca de UI |
| **TypeScript** | 5.8+ | Tipagem estática |
| **Vite** | 6.x | Bundler e dev server |
| **TanStack Router** | 1.x | Roteamento file-based |
| **TanStack Query** | 5.x | Data fetching e cache |
| **Tailwind CSS** | 4.x | CSS utility-first |
| **shadcn/ui** (Radix) | latest | Componentes acessíveis |
| **React Hook Form** | 7.x | Formulários |
| **Zod** | 3.x | Validação de schemas |
| **Zustand** | 5.x | Estado local |
| **Lucide React** | latest | Ícones |
| **react-hot-toast** | 2.x | Toast |
| **query-string** | latest | Parsing de query params |

### 1.2 Backend (Supabase)

| Tecnologia | Finalidade |
|---|---|
| **Supabase Auth** | Autenticação |
| **Supabase PostgreSQL** | Banco de dados |
| **Supabase RLS** | Row Level Security |
| **Supabase Storage** | Arquivos |
| **PostgreSQL RPCs** | Lógica no banco |
| **PostgreSQL Triggers** | Automatizações |

### 1.3 Ferramentas

| Ferramenta | Finalidade |
|---|---|
| **Vitest** | Testes unitários |
| **Playwright** | Testes E2E |
| **Storybook** | Documentação de componentes |
| **Sentry** | Monitoramento de erros |
| **Docker** | Containerização |
| **commitlint** | Padronização de commits |

---

## 2. Estrutura de Diretórios

```
src/
├── main.tsx                          # Entry point
│   # Bootstrap: Sentry + registerModule() + QueryClient + AuthProvider + Router
│
├── routeTree.gen.ts                  # Rotas geradas automaticamente
│
├── routes/                           # Rotas (TanStack Router file-based)
│   ├── __root.tsx                    # Root layout
│   │   # DesignSystemProvider + Toaster + Outlet
│   ├── _auth.tsx                     # Auth guard
│   │   # useAuth() → setup módulos ativos → AppLayout
│   ├── index.tsx                     # Landing / Login
│   └── <modulo>.*.tsx                # Rotas de cada módulo
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── page-header.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ... (shadcn/ui collection)
│   └── layout/                       # Layout da aplicação
│       ├── AppLayout.tsx             # Sidebar + Navbar + Content
│       ├── Sidebar.tsx
│       └── Navbar.tsx
│
├── features/                         # Módulos independentes
│   ├── <modulo1>/
│   │   ├── module.ts                 # Definição do módulo
│   │   ├── permissions.ts            # Permissões granulares
│   │   ├── types.ts                  # Types exclusivos
│   │   └── components/               # Componentes visuais
│   │       ├── DashboardPage.tsx
│   │       └── ...
│   ├── <modulo2>/
│   └── ...                           # Todos os módulos
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
│   │   ├── AuthProvider.tsx
│   │   ├── types.ts
│   │   └── useAuth.ts
│   ├── supabase/                     # Cliente Supabase
│   │   ├── client.ts
│   │   └── types.ts
│   ├── permissions/                  # Permissions services
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── services.ts
│   └── services/                     # Serviços compartilhados
│       ├── notificacoes.ts
│       ├── webhooks.ts
│       └── atividades.ts
│
├── design-system/                    # Sistema de Design (se aplicável)
│   ├── tokens/
│   │   ├── types.ts
│   │   ├── css-var-map.ts
│   │   ├── resolver.ts
│   │   └── presets/
│   ├── provider/
│   ├── services/
│   ├── hooks/
│   └── components/
│
├── styles/
│   └── globals.css                   # Tailwind v4 + tokens CSS
│
├── lib/
│   └── utils.ts                      # cn() helper
│
└── shared/                           # Código compartilhado
    └── utils/
```

---

## 3. Passo a Passo de Criação

### 3.1 Inicialização do Projeto

```bash
# 1. Criar projeto Vite + React + TypeScript
npm create vite@latest minha-app -- --template react-ts

# 2. Instalar dependências core
npm install react@19 react-dom@19
npm install @tanstack/react-router@1 @tanstack/react-query@5
npm install @supabase/supabase-js@2
npm install lucide-react react-hot-toast
npm install react-hook-form @hookform/resolvers zod
npm install zustand
npm install tailwind-merge clsx class-variance-authority

# 3. Instalar Tailwind v4
npm install tailwindcss @tailwindcss/vite

# 4. Instalar shadcn/ui (componentes individuais conforme necessário)
npx shadcn@latest add button dialog alert-dialog skeleton card
npx shadcn@latest add input badge table tabs dropdown-menu

# 5. Instalar dev dependencies
npm install -D typescript@5 vite@6
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react
```

### 3.2 Configuração Vite

**vite.config.ts** (completo):
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          tanstack: ["@tanstack/react-router", "@tanstack/react-query"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
});
```

### 3.3 Configuração TypeScript

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### 3.4 Entry Point (main.tsx)

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "~/core/auth";

// Registrar módulos (exemplo com um módulo)
import { registerModule } from "~/registry";
import { meuModulo } from "~/features/meu-modulo/module";
registerModule(meuModulo);

// Router
const router = createRouter({ routeTree });

// Query Client (60s stale time)
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

// Type declaration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
```

### 3.5 Root Layout (__root.tsx)

```typescript
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { DesignSystemProvider } from "~/design-system";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <DesignSystemProvider>
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text-main)",
            border: "1px solid var(--color-border-subtle)",
          },
        }}
      />
    </DesignSystemProvider>
  );
}
```

### 3.6 Auth Guard Layout (_auth.tsx)

```typescript
import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AppLayout } from "~/components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/lib/auth";
import { getModule, getAllModules } from "~/registry";
import { useState } from "react";

export const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthGuard,
});

function AuthGuard() {
  const { user, profile, permissoes, modulosAtivos, loading } = useAuth();
  const navigate = useNavigate();
  const [modulesReady, setModulesReady] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
    return null;
  }

  if (profile && permissoes && !modulesReady) {
    const mods = profile.is_super_admin
      ? getAllModules().map((m) => m.key)
      : modulosAtivos;

    for (const key of mods) {
      const mod = getModule(key);
      mod?.setup?.();
    }
    setModulesReady(true);

    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return <AppLayout />;
}
```

### 3.7 Registry System (src/registry/)

**modules.ts**:
```typescript
import type { LucideIcon } from "lucide-react";

export type ModuleDefinition = {
  key: string;
  nome: string;
  descricao: string;
  icon: LucideIcon;
  routes: string[];
  ambientes: string[];
  permissions: string[];
  events: ModuleEvent[];
  hasDesignConfig?: boolean;
  designRoute?: string;
  setup?: () => void;
};

const moduleRegistry = new Map<string, ModuleDefinition>();

export function registerModule(mod: ModuleDefinition): void {
  if (moduleRegistry.has(mod.key)) return;
  moduleRegistry.set(mod.key, mod);
}

export function getModule(key: string): ModuleDefinition | undefined {
  return moduleRegistry.get(key);
}

export function getAllModules(): ModuleDefinition[] {
  return Array.from(moduleRegistry.values());
}

export function getModuleKeys(): string[] {
  return Array.from(moduleRegistry.keys());
}
```

**nav-items.ts**:
```typescript
import { type LucideIcon } from "lucide-react";

export type NavItemRegistration = {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  permissionCheck: (perms: Record<string, boolean> | null) => boolean;
  order: number;
  moduloKey?: string;
  noChildMatch?: boolean;
}

const items = new Map<string, NavItemRegistration>();

export function registerNavItem(item: NavItemRegistration): void {
  if (items.has(item.id)) return;
  items.set(item.id, item);
}
```

**permissions-registry.ts**:
```typescript
export type PermissionDefinition = {
  key: string;
  label: string;
  description: string;
  group: string;
};

const permissionsRegistry = new Map<string, PermissionDefinition>();

export function registerPermission(def: PermissionDefinition): void {
  if (permissionsRegistry.has(def.key)) return;
  permissionsRegistry.set(def.key, def);
}

export function getAllPermissionDefs(): PermissionDefinition[] {
  return Array.from(permissionsRegistry.values());
}
```

**defaults.ts**:
```typescript
type PermissionDefaults = Record<string, Record<string, boolean>>;
const defaultsRegistry = new Map<string, PermissionDefaults>();

export function registerPermissionDefaults(
  moduleKey: string,
  defaults: PermissionDefaults,
): void {
  defaultsRegistry.set(moduleKey, defaults);
}
```

### 3.8 Tabela de Permissões no Banco

```sql
-- Migration: permissoes
CREATE TABLE IF NOT EXISTS public.permissoes (
  usuario_id   UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  permissoes   JSONB NOT NULL DEFAULT '{}'::jsonb,
  modulos_acesso JSONB,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  updated_by   UUID REFERENCES auth.users(id)
);

ALTER TABLE public.permissoes ENABLE ROW LEVEL SECURITY;

-- Super admin pode tudo
CREATE POLICY "Super admin pode tudo permissoes"
  ON public.permissoes FOR ALL TO authenticated
  USING (is_super_admin_session())
  WITH CHECK (is_super_admin_session());

-- Usuário vê própria permissão
CREATE POLICY "Usuário vê própria permissão"
  ON public.permissoes FOR SELECT TO authenticated
  USING (auth.uid() = usuario_id);

-- Trigger para criar permissões padrão ao criar profile
CREATE OR REPLACE FUNCTION public.handle_new_profile_permissoes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.permissoes (usuario_id, permissoes, updated_by)
  VALUES (NEW.id, '{}'::jsonb, NEW.id)
  ON CONFLICT (usuario_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_profile_created_permissoes
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile_permissoes();
```

---

## 4. Configuração Inicial

### 4.1 Variáveis de Ambiente (.env)

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_SENTRY_DSN=seu-dsn-sentry  # opcional
```

### 4.2 Cliente Supabase

**src/core/supabase/client.ts**:
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente Supabase não configuradas");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.3 Auth Provider

**src/core/auth/AuthProvider.tsx**:
```typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "~/core/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### 4.4 Estilos Globais

**src/styles/globals.css** (Tailwind v4):
```css
@import "tailwindcss";

@theme {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-card: #1e293b;
  --color-text-main: #f8fafc;
  --color-text-muted: #94a3b8;
  --color-border: #334155;
  --color-accent: #c9a655;
  --color-accent-hover: #d4b366;
  --color-accent-fg: #0f172a;
  --color-accent-muted: #c9a65520;
  --color-success: #22c55e;
  --color-success-bg: #22c55e15;
  --color-error: #ef4444;
  --color-error-bg: #ef444415;
  --color-warning: #eab308;
  --color-warning-bg: #eab30815;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

body {
  background: var(--color-bg);
  color: var(--color-text-main);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}

*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

## 5. Padrões de Código

### 5.1 Convenções de Nomenclatura

| Item | Padrão | Exemplo |
|---|---|---|
| Arquivos de rota | `modulo.pagina.tsx` | `nps.dashboard.tsx` |
| Componentes React | PascalCase | `NpsDashboardPage` |
| Funções utilitárias | camelCase | `listarEmpresas` |
| Tipos/Interfaces | PascalCase | `ModuleDefinition` |
| Constantes | UPPER_SNAKE | `NPS_PERMISSIONS` |
| CSS variables | `--kebab-case` | `--color-accent` |
| Chaves de permissão | `modulo_acao` | `nps_ver_dashboard` |
| Prefixo de tabela | `modulo_` (snake) | `nps_perguntas` |
| Prefixo de permissão | `modulo_` (snake) | `nps_ver_dashboard` |

### 5.2 Padrão de Componentes

```typescript
// 1. Componente funcional com types
interface Props {
  id: string;
  name: string;
  onSave: (data: DataType) => void;
}

export function MeuComponente({ id, name, onSave }: Props) {
  // 2. Hooks no topo
  const { data, isLoading } = useQuery({ ... });
  const [state, setState] = useState(false);
  
  // 3. Early return para loading/empty/error
  if (isLoading) return <Skeleton className="h-32 rounded-2xl" />;
  if (!data) return <EmptyState icon={<Icon />} title="..." description="..." />;
  
  // 4. Render
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mobile-first: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 */}
    </div>
  );
}
```

### 5.3 Padrão de Serviço

```typescript
import { supabase } from "~/core/supabase";
import type { MeuTipo } from "./types";

// Sempre assíncrono, retorna tipo explícito
export async function listarItens(empresaId: string): Promise<MeuTipo[]> {
  const { data, error } = await supabase
    .from("modulo_itens")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return (data ?? []) as MeuTipo[];
}
```

### 5.4 Padrão de Query Hook

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarItens, criarItem } from "./service";

export function useItensQuery(empresaId: string) {
  return useQuery({
    queryKey: ["modulo-itens", empresaId],
    queryFn: () => listarItens(empresaId),
    staleTime: 60_000,
  });
}

export function useCriarItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulo-itens"] });
      toast.success("Item criado!");
    },
    onError: (error: any) => toast.error(error.message),
  });
}
```

---

## 6. Checklist de Qualidade

### 6.1 Antes de Iniciar Desenvolvimento

- [ ] Stack definido (React + Vite + TanStack + Supabase)
- [ ] Registry implementado (modules, nav-items, permissions)
- [ ] AuthProvider configurado
- [ ] Cliente Supabase configurado
- [ ] Design System base configurado (globals.css + tokens)
- [ ] shadcn/ui configurado
- [ ] ESLint + Prettier configurados
- [ ] commitlint configurado
- [ ] Docker + docker-compose configurados

### 6.2 Para Cada Módulo

- [ ] `module.ts` com definição completa (key, nome, rotas, permissões, setup)
- [ ] `permissions.ts` com permissões granulares (prefixo `modulo_`)
- [ ] `types.ts` com tipos específicos do módulo
- [ ] Rotas registradas no TanStack Router
- [ ] Nav-items registrados com `permissionCheck()`
- [ ] Rota de design configurada (se aplicável)
- [ ] Tabelas com `empresa_id` e RLS configurado
- [ ] Testes (unitários + E2E)

### 6.3 Para Cada Tabela no Banco

- [ ] `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- [ ] `empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE`
- [ ] `created_at TIMESTAMPTZ DEFAULT now()`
- [ ] `updated_at TIMESTAMPTZ DEFAULT now()`
- [ ] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
- [ ] RLS policy: `is_super_admin_session() OR empresa_id = get_current_empresa_id()`
- [ ] Índices para buscas comuns

### 6.4 Qualidade de Código

- [ ] TypeScript strict habilitado
- [ ] Componentes mobile-first (grid-cols-1 base)
- [ ] Estados de loading, empty e error em todas as páginas
- [ ] Modal de confirmação para ações destrutivas (AlertDialog)
- [ ] Toast de feedback para todas as ações
- [ ] `cn()` do tailwind-merge para classes condicionais
- [ ] Imports usando alias `~/` em vez de caminhos relativos
- [ ] Funções assíncronas com try/catch
- [ ] React Query para data fetching (não useEffect)
