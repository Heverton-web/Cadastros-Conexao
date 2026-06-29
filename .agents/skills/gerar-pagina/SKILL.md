---
name: gerar-pagina
description: Gera página React completa com PageHeader, breadcrumb, layout responsivo mobile-first e tokens do Design System para um módulo do ERP Conexão. Inclui estados de loading, erro e vazio.
triggers:
  - "gerar página"
  - "criar página"
  - "nova página"
  - "nova rota"
---

# Skill: gerar-pagina

## Pré-requisitos
- Módulo deve existir em `src/features/<modulo>/`
- Nome da página e path da rota

## Steps

### 1. Coletar informações
- Nome da página (PascalCase, ex: `PaginaRelatorios`)
- Módulo alvo (kebab-case)
- Path da rota (ex: `/relatorios/dashboard`)
- Tipo: `list` | `detail` | `form` | `dashboard`

### 2. Gerar arquivo de rota
```typescript
// src/routes/<modulo>.<subpath>.tsx
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { <Pagina> } from "~/features/<modulo>/pages/<Pagina>";

export const <modulo><Pagina>Route = createRoute({
  getParentRoute: () => authLayout,
  path: "/<modulo>/<subpath>",
  component: <Pagina>,
});
```

### 3. Gerar componente de página
```typescript
// src/features/<modulo>/pages/<Pagina>.tsx
import { PageHeader } from "~/components/ui/page-header";
import { Loader2 } from "lucide-react";

export function <Pagina>() {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen"
         style={{ background: "var(--color-bg)", color: "var(--color-text-main)" }}>
      <PageHeader title="Título" description="Descrição" />
      
      {/* Conteúdo */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
        {/* ... */}
      </div>
    </div>
  );
}
```

### 4. Incluir estados
- Loading: `<Loader2 className="animate-spin text-[var(--color-accent)]" />`
- Erro: `<EmptyState />` com ícone de erro
- Vazio: `<EmptyState />` com mensagem

### 5. Registrar rota no routeTree.gen.ts

### 6. Commit
```bash
git add src/routes/<modulo>.<subpath>.tsx src/features/<modulo>/pages/<Pagina>.tsx
git commit -m "feat(<modulo>): criar página <Pagina>"
```

## Validação
- `npm run build` deve passar
- Rota deve aparecer no TanStack Devtools
