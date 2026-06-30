# Análise de Autonomia dos Módulos — ERP Conexão

## Diagnóstico

**Resposta curta: Não está assim.** Existem **4 violações de acoplamento** entre módulos distintos.

A boa notícia: a maioria dos módulos (20 de 24) são auto-suficientes. Os problemas são localizados e corrigíveis.

---

## Mapa de Dependências Cruzadas

> Dependências **intra-módulo** (`../services`, `../hooks`, `../types`) são saudáveis — cada módulo usando seus próprios arquivos. As problemáticas são as **inter-módulo**.

### ❌ Violações Identificadas

| Módulo Dependente | Importa de | O que importa | Arquivo |
|---|---|---|---|
| `rotas` | `crm` | `formatDate` | `PlanejamentoRotasPage.tsx`, `DetalheRotaPage.tsx` |
| `rotas` | `despesas` | `useEmpresaSuperAdmin`, `EmpresaSuperAdminSelector` | `ConfigRotasPage.tsx` |
| `nps` | `empresas` | `buscarEmpresa`, `buscarEmpresaConfig`, `listarEmpresas` | `NpsPreviewPage.tsx`, `NpsPesquisasPage.tsx` |
| `despesas` | `empresas` | `listarEmpresas`, `type Empresa` | `useEmpresaSuperAdmin.ts`, `EmpresaSuperAdminSelector.tsx` |

```
rotas ──────────────── depende de ──> crm (formatDate)
rotas ──────────────── depende de ──> despesas (EmpresaSuperAdminSelector)
nps ────────────────── depende de ──> empresas (listarEmpresas)
despesas ──────────── depende de ──> empresas (listarEmpresas, Empresa)
```

---

## O que está OK ✅

| Módulo | Status |
|---|---|
| `funis` | Auto-contido |
| `hub` | Auto-contido |
| `linktree` | Auto-contido (usa apenas `~/features/linktree/*`) |
| `mapas` | Auto-contido |
| `crm` | Auto-contido (usa `~/features/crm/lib/*` — próprio) |
| `cadastros`, `clientes`, `documentos`, `admin` | Auto-contidos |
| `despesas` (componentes/services) | Auto-contido, **exceto** `useEmpresaSuperAdmin` |

---

## Plano de Correção

### Problema 1 — `rotas` importa `formatDate` do `crm`
**Impacto:** baixo · **Esforço:** mínimo

`formatDate` e `formatBRL` são **utilitários genéricos** que não pertencem ao CRM.

**Solução:** Mover para `src/lib/utils/format.ts` (shared utils, fora de features).

```
src/lib/
  utils/
    format.ts   ← formatDate, formatBRL, formatCPF etc.
```

Arquivos a alterar:
- `rotas/components/PlanejamentoRotasPage.tsx` — trocar import
- `rotas/components/DetalheRotaPage.tsx` — trocar import  
- `crm/lib/comercial.ts` — re-exportar de `src/lib/utils/format.ts` (retrocompat)
- Demais arquivos do `crm` que usam `formatBRL`

---

### Problema 2 — `rotas` importa `EmpresaSuperAdminSelector` do `despesas`
**Impacto:** médio · **Esforço:** baixo

Este componente é um seletor de empresa para super-admins — claramente **compartilhado**, não pertence ao módulo despesas.

**Solução:** Mover para `src/components/shared/EmpresaSuperAdminSelector.tsx`

```
src/components/
  shared/
    EmpresaSuperAdminSelector.tsx  ← componente + hook useEmpresaSuperAdmin
```

Arquivos a alterar:
- `despesas/components/shared/EmpresaSuperAdminSelector.tsx` → mover
- `despesas/hooks/useEmpresaSuperAdmin.ts` → mover
- `rotas/components/ConfigRotasPage.tsx` → atualizar import
- `despesas/*` → atualizar imports internos

---

### Problema 3 — `nps` e `despesas` importam do módulo `empresas`
**Impacto:** alto · **Esforço:** médio

O módulo `empresas` exporta `listarEmpresas`, `buscarEmpresa`, `buscarEmpresaConfig`, `type Empresa`. Isso é **dado estrutural da plataforma** — correto que exista, mas a arquitetura precisa deixar isso explícito.

**Duas opções:**

#### Opção A — `empresas` é um módulo-infraestrutura (recomendada)
Formalizar que `empresas` é um módulo de **dados compartilhados** (não uma feature de negócio), movendo para `src/lib/empresas/` ou `src/shared/empresas/`.

```
src/shared/
  empresas/
    index.ts   ← listarEmpresas, buscarEmpresa, buscarEmpresaConfig
    types.ts   ← type Empresa
```

Benefício: deixa claro na arquitetura que qualquer módulo pode usar dados de empresa — é infraestrutura, não feature.

#### Opção B — Cada módulo traz seu próprio acesso aos dados de empresa
Cada módulo duplica as queries que precisa (ex: `nps/services/empresa.ts` com `listarEmpresas`).

**Contra:** duplicação de código, manutenção custosa. ❌

**Recomendação: Opção A.**

---

## Resumo do Plano

```
Passo 1 → Criar src/lib/utils/format.ts com formatDate, formatBRL
           Atualizar crm, rotas para importar daí

Passo 2 → Mover EmpresaSuperAdminSelector + useEmpresaSuperAdmin
           para src/components/shared/
           Atualizar rotas e despesas

Passo 3 → Mover src/features/empresas → src/shared/empresas
           (ou manter em features mas documentar como "shared infra")
           Atualizar nps e despesas
```

**Esforço total estimado:** ~2–3 horas de refactor cirúrgico, sem quebrar funcionalidades.

---

## Verificação Futura

Para garantir que novas violações não apareçam, adicione uma regra de lint:

```json
// .eslintrc ou eslint.config.js
"import/no-restricted-paths": ["error", {
  "zones": [
    {
      "target": "src/features/!(empresas)/**",
      "from": "src/features/!(empresas)/**",
      "message": "Módulos não podem importar entre si. Use src/shared ou src/lib."
    }
  ]
}]
```

