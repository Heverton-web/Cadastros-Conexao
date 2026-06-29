---
name: criar-design-modulo
description: Cria a estrutura de configuração de Design System para um módulo existente do ERP Conexão — gera rota /modulo/design e registra hasDesignConfig no module.ts.
triggers:
  - "criar design do módulo"
  - "adicionar design ao módulo"
  - "configurar design do módulo"
---

# Skill: criar-design-modulo

## Pré-requisitos
- Módulo deve existir em `src/features/<modulo>/`
- Módulo deve estar registrado em `src/registry/modules.ts`

## Steps

### 1. Criar rota de design
```typescript
// src/routes/<modulo>.design.tsx
import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { ModuloDesignPage } from "~/design-system/components/ModuloDesignPage";

export const <modulo>DesignRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/<modulo>/design",
  component: () => <ModuloDesignPage moduloKey="<modulo>" moduloNome="<Nome>" />,
});
```

### 2. Registrar rota no routeTree.gen.ts
- Adicionar import
- Adicionar na lista de rotas dentro de `authLayout.addChildren([])`

### 3. Atualizar module.ts do módulo
```typescript
// Adicionar em ModuleDefinition:
hasDesignConfig: true,
designRoute: "/<modulo>/design",
```

### 4. Commit
```bash
git add src/routes/<modulo>.design.tsx src/features/<modulo>/module.ts
git commit -m "feat(<modulo>): adicionar configuração de Design System"
```

## Validação
- `npm run build` deve passar
- Rota `/<modulo>/design` deve ser acessível
- Admin deve ver link de design no módulo
