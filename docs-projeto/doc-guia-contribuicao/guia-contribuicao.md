# Guia de Estilo e Contribuição — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Routing | TanStack Router (React Router v7) |
| State | React Query + Context + Zustand |
| Styling | Tailwind v4 + shadcn/ui |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Build | Vite 6 |
| Testing | Vitest + Playwright + K6 |
| Deploy | Docker + VPS + Traefik |

---

## 2. Estrutura de Arquivos

```
src/
├── core/               → Infraestrutura compartilhada
│   ├── auth/
│   ├── permissions/
│   ├── services/
│   ├── supabase/
│   ├── empresa/
│   ├── router/
│   └── store/
├── features/           → Módulos de negócio
│   └── <modulo>/
│       ├── module.ts
│       ├── permissions.ts
│       ├── services/
│       ├── hooks/
│       ├── components/
│       └── index.ts
├── routes/             → Páginas (TanStack Router)
├── registry/           → Module/permission/nav registration
├── components/ui/      → shadcn/ui components
├── design-system/      → Design tokens + provider
└── styles/             → globals.css
```

---

## 3. Convenções de Código

### 3.1 Nomenclatura

| Item | Padrão | Exemplo |
|---|---|---|
| Arquivos | kebab-case | `cadastros.module.ts` |
| Componentes | PascalCase | `EntityDetailDialog` |
| Funções | camelCase | `listarCadastros` |
| Constantes | UPPER_SNAKE | `ALL_PERMISSIONS` |
| Tipos | PascalCase | `ModuleDefinition` |
| Hooks | use* | `useCadastros` |

### 3.2 Commits

Conventional Commits:

```
feat: add new feature
fix: correct bug
refactor: restructure code
chore: maintenance
docs: documentation
test: add tests
```

### 3.3 Imports

```typescript
// 1. React/library
import { useState } from "react";

// 2. Lucide icons
import { Users } from "lucide-react";

// 3. Registry
import { registerModule } from "~/registry";

// 4. Core
import { supabase } from "~/core/supabase";

// 5. Outros módulos externos
import toast from "react-hot-toast";
```

---

## 4. Como Adicionar um Novo Módulo

1. Criar `src/features/<modulo>/` com:
   - `module.ts` → ModuleDefinition + setup()
   - `permissions.ts` → ALL_PERMISSIONS
   - `services/` → Supabase queries
   - `hooks/` → React Query hooks
   - `components/` → UI components
2. Registrar em `src/main.tsx`: `registerModule(<modulo>Module)`
3. Criar rotas em `src/routes/<modulo>.*.tsx`
4. Adicionar migration SQL em `supabase/migrations/`
5. Adicionar testes em `src/__tests__/modules/<modulo>/`

---

## 5. Comandos de Desenvolvimento

```bash
npm run dev          # Dev server
npm run build         # Build
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Vitest
npm run typecheck     # tsc --noEmit
```
