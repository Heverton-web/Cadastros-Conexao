# Análise de Frontend — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** React 19 + TanStack Router + Tailwind v4 + shadcn/ui

---

## 1. Resumo Executivo

O frontend do ERP Conexão utiliza **React 19** com **TanStack Router** e **shadcn/ui**, seguindo padrões modernos. A maior fraqueza está na organização de componentes (muitos monolíticos) e duplicação de layouts. Pontuação: **~70/100**.

---

## 2. Stack Frontend

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | React | 19 |
| Routing | TanStack Router | ~1.114 |
| Server State | TanStack Query | ^5 |
| UI Library | shadcn/ui | ~59 componentes |
| Icons | Lucide React | ^0.484 |
| Styling | Tailwind v4 | — |
| Forms | React Hook Form + Zod | ^7.55 + ^3.24 |
| Toast | react-hot-toast | ^2.5 |
| Persistence | Zustand | ^5.0 |
| Monitoring | Sentry | ^9 |

---

## 3. Provider Stack

```
main.tsx
  └── StrictMode
      └── QueryClientProvider (staleTime: 60s)
          └── AuthProvider (Context)
              └── RouterProvider (TanStack Router)
                  └── DesignSystemProvider (Tema)
```

---

## 4. Padrões de Componentes

### 4.1 ✅ O que Funciona Bem

| Padrão | Exemplo | Benefício |
|---|---|---|
| **PageHeader + breadcrumb** | `DashboardPage` | Consistência entre páginas |
| **KPI Cards** | `cadastros.dashboard.tsx` | Gradiente + ícone + hover padronizado |
| **Status Pills** | `STATUS_COLOR[c.status]` | Cores consistentes por status |
| **Skeleton + EmptyState** | `if (loading) return <Skeleton />` | UX profissional |
| **Card de Lista** | Solicitações recentes | Hover com translate + shadow |
| **Dialog/AlertDialog** | Exclusão com confirmação | Modal com gradiente no header |
| **Mobile-first** | `grid-cols-1 sm:grid-cols-2` | Responsivo |

### 4.2 ❌ O que Precisa Melhorar

| Problema | Arquivo | Impacto |
|---|---|---|
| **2 AppLayouts** | `src/components/layout/` + `src/core/layout/` | Duplicação total |
| **CentralAcoesTab 115k chars** | `src/components/admin/` | Manutenção impossível |
| **IIFE no JSX** | Ambos AppLayout | Lógica na view |
| **3 componentes em 1 arquivo** | `KanbanAvancado.tsx` | Viola SRP |
| **Rota com data fetching direto** | `cadastros.dashboard.tsx` | Sem hook separado |
| **Duas implementações de Button** | `src/components/ui/` + `src/core/ui/` | Inconsistência |

---

## 5. Arquitetura de Componentes

### 5.1 Hierarquia Atual

```
AppLayout
├── Header (inline)
│   ├── Logo / Brand
│   ├── ModuleDrawer (mobile)
│   ├── NotificationDropdown (inline - IIFE)
│   └── UserMenu (inline)
├── NavSidebar
├── ModuleDrawer
├── <Outlet /> (conteúdo da rota)
└── BottomNav
```

### 5.2 Hierarquia Ideal

```
AppLayout
├── Header
│   ├── Logo
│   ├── ModuleSelector
│   ├── NotificationDropdown  ← Extraído
│   └── UserMenu              ← Extraído
├── Sidebar (desktop)
│   └── NavItem[]
├── MobileDrawer
├── MainContent
│   └── <Outlet />
└── BottomNav (mobile)
```

---

## 6. Roteamento

### 6.1 Árvore de Rotas (~134)

```
rootRoute
├── Públicas: /, /pre-cadastro/$token, /nps/survey, /linktree/$id
│
└── authLayout (protegido)
    ├── Cadastros: 7 rotas
    ├── CRM: 13 rotas
    ├── Funis: 4 rotas
    ├── Hub: 18 rotas
    ├── NPS: 7 rotas
    ├── Mapas: 7 rotas
    ├── Despesas: 5 rotas
    ├── Rotas: 3 rotas
    ├── LinkTree: 6 rotas
    ├── Gerador Links: 9 rotas
    ├── Marketing: 20 rotas
    ├── Admin Global: 12 rotas
    └── Empresa: 16 rotas
```

### 6.2 Proteção de Rotas

```typescript
// authLayout usa AuthGuard
function AuthGuard() {
  const { user, loading } = useAuth();
  if (loading) return <Loader2 />;
  if (!user) navigate({ to: "/" });
  return <AppLayout />;
}
```

---

## 7. Navegação Lateral

### Registry Pattern

```typescript
registerNavItem({
  id: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  to: "/cadastros/dashboard",
  permissionCheck: (perms) => perms?.ver_todos_cadastros === true,
  order: 1,
  moduloKey: "cadastros",
});
```

**100+ nav items registrados** com filtragem por permissão.

---

## 8. Design System

### 8.1 Tokens CSS (85+)

```css
--color-accent: #c9a655;      /* Gold */
--color-text-main: #f8fafc;   /* Branco */
--color-bg: #0f172a;          /* Slate escuro */
```

### 8.2 Temas por Módulo

4 níveis de resolução: Preset → Global → Empresa → Módulo

### 8.3 Componentes com Tema

| Módulo | CSS Próprio | Design Config |
|---|---|---|
| Cadastros | ❌ | ✅ |
| Hub | ✅ (hub-theme.css) | ✅ |
| NPS | ✅ (NpsBackground.tsx) | ✅ |
| Empresa | ✅ (provider + resolver) | ✅ (própria) |

---

## 9. Performance Frontend

### 9.1 React Query Cache

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000 },  // 1 min
  },
});
```

### 9.2 Otimizações

| Técnica | Status |
|---|---|
| Code Splitting (rota) | ✅ Automático TanStack Router |
| Lazy Loading | ⚠️ Parcial |
| Memo / useMemo | ✅ Presente em Kanban |
| Virtual Scrolling | ❌ Ausente |
| Image Optimization | ✅ Cache Nginx 1y |

---

## 10. Recomendações

### Imediatas

1. **Extrair NotificationDropdown** do AppLayout
2. **Remover AppLayout duplicado** (`src/core/layout/`)
3. **Remover Button duplicado** (`src/core/ui/Button.tsx`)
4. **Extrair Kanban sub-components** em arquivos separados

### Curto Prazo

5. **Criar hooks de dados** para páginas que fazem fetch direto (dashboard)
6. **Criar componentes de formulário** reutilizáveis (Zod + RHF)
7. **Adicionar Error Boundaries** por rota
8. **Lazy load módulos** por rota (chunk splitting)

### Médio Prazo

9. **Storybook para todos os componentes** (já tem configurado)
10. **Testes de regressão visual** (Playwright)
11. **Bundle analysis** no CI
12. **PWA completo** com service worker offline-first
