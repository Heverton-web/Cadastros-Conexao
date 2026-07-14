# Limpar URLs — Remover Query Params desnecessários

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Converter query params de drill-down em path segments para URLs mais limpas e legíveis.

**Architecture:** Rotas de catálogo usam query params para estados sequenciais de drill-down — são candidatos perfeitos para path segments. CRM BI mantém query params por serem filtros dinâmicos independentes.

**Tech Stack:** TanStack Router, React state

---

## Análise

| Rota | Atual | Proposta |
|------|-------|----------|
| `/catalogo/implantes?conexao=X&familia=Y&linha=Z` | query params | `/catalogo/implantes/$conexaoId/$familiaId/$linhaId` |
| `/catalogo/componentes?tipoReab=X&familia=Y&tipoAbutment=Z` | query params | `/catalogo/componentes/$tipoReabId/$familiaId/$tipoAbutmentId` |
| `/catalogo/produto/$tipo/$sku?conexao=X&familia=Y&linha=Z` | path + query | `/catalogo/produto/$tipo/$sku` (manter, volta usa search) |
| `/crm/bi?vendedor=X&inicio=Y&fim=Z` | query params | **Manter** — filtros dinâmicos |

---

## Task 1: Refatorar `/catalogo/implantes` — path segments

**Files:**
- Modify: `src/routes/catalogo.implantes.tsx`
- Modify: `src/routes/catalogo.produto.$tipo.$sku.tsx` (link de volta)

**Step 1: Definir nova rota com params opcionais**

```tsx
// Nova rota: /catalogo/implantes com path segments opcionais
export const catalogoImplantesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo/implantes",
  validateSearch: (s: Record<string, unknown>) => ({}),  // sem search params
  component: CatalogoImplantesPage,
})

// Sub-rotas para cada etapa do drill-down
export const catalogoImplantesConexaoRoute = createRoute({
  getParentRoute: () => catalogoImplantesRoute,
  path: "/$conexaoId",
  component: CatalogoImplantesPage,
})

export const catalogoImplantesFamiliaRoute = createRoute({
  getParentRoute: () => catalogoImplantesConexaoRoute,
  path: "/$familiaId",
  component: CatalogoImplantesPage,
})

export const catalogoImplantesLinhaRoute = createRoute({
  getParentRoute: () => catalogoImplantesFamiliaRoute,
  path: "/$linhaId",
  component: CatalogoImplantesPage,
})
```

**Step 2: Reescrever o componente para usar params de rota**

```tsx
function CatalogoImplantesPage() {
  // Usar useParams para cada etapa
  // Etapa 1: /catalogo/implantes → sem params
  // Etapa 2: /catalogo/implantes/$conexaoId → conexaoId presente
  // Etapa 3: /catalogo/implantes/$conexaoId/$familiaId → familiaId presente
  // Etapa 4: /catalogo/implantes/$conexaoId/$familiaId/$linhaId → linhaId presente
  
  // Navegar com navigate({ to: '/catalogo/implantes', params: { conexaoId, familiaId, linhaId } })
}
```

**Step 3: Atualizar link de volta em `catalogo.produto.$tipo.$sku.tsx`**

```tsx
// De:
navigate({ to: '/catalogo/implantes', search: { conexao: search.conexao, familia: search.familia, linha: search.linha } })

// Para:
navigate({ to: '/catalogo/implantes/$conexaoId/$familiaId/$linhaId', params: { conexaoId: search.conexao, familiaId: search.familia, linhaId: search.linha } })
```

---

## Task 2: Refatorar `/catalogo/componentes` — path segments

**Files:**
- Modify: `src/routes/catalogo.componentes.tsx`
- Modify: `src/routes/catalogo.produto.$tipo.$sku.tsx` (link de volta)

**Step 1: Mesma lógica do Task 1**

```tsx
// Sub-rotas:
// /catalogo/componentes/$tipoReabId
// /catalogo/componentes/$tipoReabId/$familiaId
// /catalogo/componentes/$tipoReabId/$familiaId/$tipoAbutmentId
```

**Step 2: Atualizar componente e links de volta**

---

## Task 3: Atualizar links no `Linktree` e outros

**Files:**
- Verificar `Link` components que apontam para rotas de catálogo
- Atualizar params conforme necessário

---

## Task 4: Build e validação

**Step 1:** Rodar `npm run build` e confirmar 0 erros

**Step 2:** Testar manualmente:
- Navegar pela árvore de drill-down do catálogo
- Verificar que URLs ficam limpas: `/catalogo/implantes/abc123/def456/ghi789`
- Verificar que botão "Voltar" funciona corretamente
- Verificar que links do catálogo para produto funcionam

---

## Resultado Esperado

**Antes:**
```
/catalogo/implantes?conexao=abc&familia=def&linha=ghi
/catalogo/componentes?tipoReab=abc&familia=def&tipoAbutment=ghi
```

**Depois:**
```
/catalogo/implantes/abc/def/ghi
/catalogo/componentes/abc/def/ghi
```

URLs limpas, sem `?`, sem `=`, sem `&`. Path params são mais semânticos e fazen de bookmark/copy colar mais natural.
