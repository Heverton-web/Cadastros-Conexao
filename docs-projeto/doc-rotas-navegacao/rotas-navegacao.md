# Análise de Rotas e Navegação — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** TanStack Router + AuthGuard + NavItems

---

## 1. Visão Geral

O ERP Conexão possui **~134 rotas** gerenciadas pelo **TanStack Router** (React Router v7), com layouts aninhados, guards de autenticação e navegação lateral dinâmica.

---

## 2. Estrutura de Rotas

### 2.1 Hierarquia

```
rootRoute (__root.tsx)
├── loginRoute (/) — Página pública de login
├── preCadastroRoute (/pre-cadastro/$token) — Pública
├── npsSurveyRoute (/nps/survey) — Pública
├── linktreePublicRoute (/linktree/$id) — Pública
├── empresaLinktreePublicRoute (/e/$slug) — Pública
├── hubClienteDashboardRoute (/hub/cliente/dashboard/$empresaId) — Pública
├── crmAceitarConviteRoute (/crm/aceitar-convite/$token) — Pública
├── linkRedirectRoute (/r/$linkId) — Pública (redirect)
│
└── authLayout (_auth.tsx) [PROTEGIDA]
    ├── Dashboard, Cadastros, NPS, Mapas, Funis
    ├── CRM, Despesas, Rotas, Hub
    ├── Marketing (13 submódulos)
    ├── Gerador Links (9 submódulos)
    ├── Admin Global (empresas, permissoes, modulos, banco)
    └── Empresa (design, branding, banco, permissoes)
```

### 2.2 Layouts

| Layout | Arquivo | Proteção |
|---|---|---|
| Root | `__root.tsx` | Nenhuma |
| Auth | `_auth.tsx` | `AuthGuard` |

---

## 3. Route Tree Generator

```typescript
// src/routeTree.gen.ts — gerado automaticamente
// Roda via: vite.config.ts (plugin @tanstack/router-plugin)
```

---

## 4. Proteção de Rotas

### 4.1 AuthGuard

```typescript
function AuthGuard() {
  const { user, loading } = useAuth();
  if (loading) return <Loader2 />;
  if (!user) { navigate({ to: "/" }); return null; }

  // Setup dos módulos
  for (const key of mods) {
    const mod = getModule(key);
    mod?.setup?.();
  }

  return <AppLayout />;
}
```

### 4.2 Permission Checks

Navegação lateral usa `permissionCheck`:

```typescript
registerNavItem({
  id: "cadastros-dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  to: "/cadastros/dashboard",
  permissionCheck: (perms) => perms?.ver_todos_cadastros === true,
  order: 1,
  moduloKey: "cadastros",
});
```

---

## 5. Navegação Lateral (NavItems)

### 5.1 Registro

`src/registry/nav-items.ts` — `registerNavItem()`

```typescript
type NavItemRegistration = {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  permissionCheck: (perms) => boolean;
  order: number;
  moduloKey?: string;
  matchPaths?: string[];     // Rotas ativas adicionais
  noChildMatch?: boolean;     // Não ativar com sub-rotas
};
```

### 5.2 Filtragem por Permissão

```typescript
function getNavItems(perms, moduloKey): NavItemRegistration[] {
  return items
    .filter(item => item.moduloKey === moduloKey)
    .filter(item => item.permissionCheck(perms))
    .sort((a, b) => a.order - b.order);
}
```

---

## 6. Contagem de Rotas por Módulo

| Módulo | Rotas |
|---|---|
| Cadastros | 7 |
| CRM | 13 |
| Hub | 18 |
| NPS | 7 |
| Mapas | 7 |
| Funis | 4 |
| LinkTree | 6 |
| Rotas | 3 |
| Despesas | 5 |
| Marketing | 20 |
| Gerador Links | 9 |
| Global Admin | 12 |
| Empresa | 16 |
| Públicas | 7 |
| **Total** | **~134** |

---

## 7. RPC Admin Routes

| Rota | Função |
|---|---|
| `/global/empresas` | Listar empresas |
| `/global/empresas/$id` | Detalhe empresa |
| `/global/permissoes` | Permissões de todos usuários |
| `/global/modulos` | Módulos do sistema |
| `/global/modulos/$key` | Config módulo |
| `/global/acoes` | Central de Ações |
| `/global/banco` | Config banco |
| `/global/integracoes` | Integrações nativas |
| `/global/demos` | Credenciais demo |
| `/global/design` | Design global |
| `/global/limits` | Limites por empresa |
