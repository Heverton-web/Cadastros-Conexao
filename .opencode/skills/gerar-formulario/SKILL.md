---
name: gerar-formulario
description: Gera formulário React completo com React Hook Form + Zod + componentes do Design System (CSS vars / Tailwind v4) para um módulo existente do ERP Conexão.
triggers:
  - "gerar formulário"
  - "criar formulário"
  - "novo formulário"
---

# Skill: gerar-formulario

## Pré-requisitos
- Módulo deve existir em `src/features/<modulo>/`
- Conhecer os campos do formulário (nome, tipo, obrigatório)

## Steps

### 1. Coletar informações
- Nome do formulário (PascalCase, ex: `FormCadastro`)
- Módulo alvo (kebab-case)
- Lista de campos: `{ name, type, required, label }`

### 2. Gerar schema Zod
```typescript
// src/features/<modulo>/components/<Form>.schema.ts
import { z } from "zod";
export const schema = z.object({
  // campos
});
export type FormData = z.infer<typeof schema>;
```

### 3. Gerar componente de formulário
```typescript
// src/features/<modulo>/components/<Form>.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type FormData } from "./<Form>.schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
```

### 4. Layout responsivo com tokens do DS
- Usar CSS vars: `var(--color-surface)`, `var(--color-border)`, `var(--radius-lg)`
- Grid responsivo: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Botões alinhados ao DS: `bg-[var(--color-accent)] text-[var(--color-accent-fg)]`

### 5. Exportar via index.ts do módulo

### 6. Commit
```bash
git add src/features/<modulo>/components/<Form>*
git commit -m "feat(<modulo>): gerar formulário <Form>"
```

## Validação
- `npm run lint` deve passar
- `npm run build` deve passar
