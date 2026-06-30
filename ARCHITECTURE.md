# Arquitetura de Módulos — ERP Conexão

## Princípio Fundamental

> **Módulos são ilhas. Dados são a ponte.**

Cada módulo em `src/features/` deve ser **completamente auto-contido e auto-suficiente**.
O único fio de conexão entre módulos são **dados** — via camadas compartilhadas explícitas.

---

## Estrutura de Camadas

```
src/
├── shared/          ← Dados de infraestrutura da plataforma (único fio entre módulos)
│   └── empresas/    ← Tipos + serviços de empresa usados por qualquer módulo
│       ├── index.ts
│       ├── types.ts
│       └── service.ts
│
├── lib/             ← Utilitários genéricos (sem lógica de negócio)
│   └── utils/
│       └── format.ts  ← formatDate, formatBRL etc.
│
├── components/      ← Componentes UI genéricos
│   └── shared/      ← Componentes que múltiplos módulos podem usar
│       ├── EmpresaSuperAdminSelector.tsx
│       └── useEmpresaSuperAdmin.ts
│
└── features/        ← Módulos de negócio (ISOLADOS entre si)
    ├── cadastros/
    ├── crm/
    ├── nps/
    ├── despesas/
    └── ...
```

---

## Regras de Importação

### ✅ PERMITIDO

```ts
// Dentro do mesmo módulo
import { MeuServico } from "../services/meu.service";
import type { MeuTipo } from "../types";

// Da camada shared (dados de plataforma)
import { listarEmpresas, type Empresa } from "~/shared/empresas";

// De utilitários genéricos
import { formatDate, formatBRL } from "~/lib/utils/format";

// De componentes compartilhados
import { EmpresaSuperAdminSelector } from "~/components/shared/EmpresaSuperAdminSelector";

// Da camada UI (shadcn/ui, etc.)
import { Button } from "~/components/ui/button";

// Do registry de módulos (apenas em module.ts)
import { registerModule } from "~/registry";
```

### ❌ PROIBIDO

```ts
// Um módulo importando internals de outro módulo
import { formatDate } from "~/features/crm/lib/comercial";       // ❌
import { useEmpresaSuperAdmin } from "~/features/despesas/hooks"; // ❌
import { ClienteCard } from "~/features/clientes/components/..."; // ❌
import { useRotas } from "~/features/rotas/hooks/useRotas";       // ❌
```

---

## Template de Módulo

Todo módulo novo deve seguir esta estrutura:

```
src/features/meu-modulo/
├── index.ts          ← barrel público (o que o módulo expõe, se algo)
├── module.ts         ← registro: registerModule() + nav items
├── permissions.ts    ← constantes de permissão do módulo
├── types.ts          ← tipos internos do módulo
├── components/       ← páginas e componentes React
├── hooks/            ← hooks React (apenas dados do próprio módulo)
└── services/         ← acesso ao Supabase (apenas tabelas do módulo)
```

### Regra de ouro para `services/`
Cada service acessa **apenas as tabelas que pertencem ao módulo**.
Se precisar de dados de empresa, use `~/shared/empresas`.
Se precisar de dados de outro módulo, **receba via props ou parâmetro** — nunca importe o service do outro módulo.

---

## Como adicionar dados compartilhados

Quando um dado precisa ser usado por **mais de um módulo**, ele pertence à camada `shared/`:

1. Crie `src/shared/nome-do-dado/types.ts`
2. Crie `src/shared/nome-do-dado/service.ts`
3. Crie `src/shared/nome-do-dado/index.ts` (barrel)
4. Importe via `~/shared/nome-do-dado`

**Nunca copie** a lógica nos dois módulos. **Nunca importe** de um módulo para o outro.

---

## Como adicionar utilitários genéricos

Utilitários sem lógica de negócio (formatação, máscaras, datas) pertencem a `src/lib/utils/`:

```ts
// src/lib/utils/format.ts
export function formatDate(date: string | null | undefined): string { ... }
export function formatBRL(value: number | null | undefined): string { ... }
export function formatCPF(cpf: string): string { ... }
```

---

## Estado atual de conformidade

| Módulo | Status | Observação |
|---|---|---|
| `cadastros` | ✅ Auto-contido | |
| `crm` | ✅ Auto-contido | `formatBRL/formatDate` re-exportados de `~/lib/utils/format` |
| `nps` | ✅ Auto-contido | Usa `~/shared/empresas` |
| `despesas` | ✅ Auto-contido | Usa `~/shared/empresas` |
| `rotas` | ✅ Auto-contido | Usa `~/lib/utils/format` e `~/components/shared` |
| `funis` | ✅ Auto-contido | |
| `hub` | ✅ Auto-contido | |
| `linktree` | ✅ Auto-contido | |
| `mapas` | ✅ Auto-contido | |
| `empresas` | ✅ Infra-UI | Re-exporta de `~/shared/empresas` |

---

## Verificação rápida

Para checar se há violações novas, rode no terminal:

```bash
# Listar imports cross-feature (deve retornar vazio)
rg "from \"~/features/[^\"]+\"" src/features --type-add "tsx:*.tsx" --type ts --type tsx
```

Se retornar resultados, verifique se o import é:
1. Do **próprio módulo** (intra) → OK
2. De **outro módulo** (inter) → Violação → mover para `shared/` ou `lib/utils/`
