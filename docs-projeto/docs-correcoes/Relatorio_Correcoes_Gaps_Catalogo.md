# Relatório de Correções: Gaps Cadastro vs Renderização — Módulo Catálogo

**Data:** 2026-07-18
**Status:** Todos os 9 gaps corrigidos ✅
**Build:** Passando em todas as etapas

---

## Resumo

Foram identificados **9 gaps** onde dados cadastrados via modais admin não eram renderizados (ou eram renderizados incorretamente) na loja pública do catálogo. Todos foram corrigidos seguindo a prioridade do mais crítico ao menos crítico, com build verificado entre cada correção.

---

## Gaps Corrigidos

### GAP 1 (CRÍTICO) — Imagens não exibidas na página de detalhe ✅

**Problema:** O componente `ProductImage` na rota `/catalogo/produto/$tipo/$sku` mostrava apenas um ícone placeholder `Box`, ignorando imagens reais cadastradas.

**Arquivos alterados:**
- `src/features/catalogo/hooks/useCatalogo.ts` — Adicionado hook `useImagensProduto`
- `src/routes/catalogo.produto.$tipo.$sku.tsx` — `ProductImage` agora aceita prop `imageUrl` e exibe `<img>` quando disponível

**Solução:**
1. Criado hook `useImagensProduto(tipo, sku)` que busca imagens via `listarImagens`
2. Componente `ProductImage` modificado para aceitar prop `imageUrl`
3. `ImplanteDetail`, `AbutmentDetail` e `KitDetail` agora buscam imagens e passam para `ProductImage`

---

### GAP 2 (CRÍTICO) — Preços de BOM/Composição usam mockPreco() ✅

**Problema:** `BomTable`, `FresagemTimeline` e listagem de kits usavam `mockPreco()` (preço pseudo-aleatório) em vez do preço real do banco.

**Arquivos alterados:**
- `src/features/catalogo/components/BomTable.tsx` — Usa `getPrecoFromDB(item.preco, ...)` em vez de `mockPreco()`
- `src/features/catalogo/components/FresagemTimeline.tsx` — Usa `getPrecoFromDB(p.fresa?.preco, ...)` em vez de `mockPreco()`
- `src/routes/catalogo.kits.tsx` — Usa `getPrecoFromDB(kit.preco, ...)` em vez de `mockPreco()`

**Solução:**
- `BomTable` agora recebe `preco` nos items e usa `getPrecoFromDB`
- `FresagemTimeline` usa `p.fresa?.preco` do protocolo
- Listagem de kits usa `kit.preco` do banco

---

### GAP 3 (MÉDIO) — Campo macrogeometria coletado mas não salvo ✅

**Problema:** O input `macrogeometria` existia no formulário mas não era incluído no payload de criação.

**Arquivo alterado:**
- `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx`

**Solução:**
- Adicionado `macrogeometria` ao state `implante`
- Adicionado ao payload em `makeImplantePayload()`
- Adicionado à restauração de edição

---

### GAP 4 (MÉDIO) — Campo nome do implante não enviado ✅

**Problema:** O service `criarImplante` requer `nome`, mas o modal não o incluía no payload.

**Arquivo alterado:**
- `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx`

**Solução:**
- `nome` agora é gerado automaticamente: `${familia.nome} ${diametro_mm}×${comprimento_mm}`
- Incluído no payload de criação/atualização

---

### GAP 5 (MÉDIO) — material e superficie não exibidos ✅

**Problema:** Campos salvos em `detalhes_extras` (JSONB) mas não exibidos na ficha técnica pública.

**Arquivo alterado:**
- `src/routes/catalogo.produto.$tipo.$sku.tsx`

**Solução:**
- Adicionados SpecCards condicionais para `material` e `superficie` na ficha do implante
- Leitura de `impl.detalhes_extras.material` e `impl.detalhes_extras.superficie`

---

### GAP 6 (MÉDIO) — descricao do implante não exibida ✅

**Problema:** Campo `descricao` salvo no modal mas não renderizado na ficha pública.

**Arquivo alterado:**
- `src/routes/catalogo.produto.$tipo.$sku.tsx`

**Solução:**
- Adicionado bloco de descrição abaixo do `ProductHeader` (condicional a `impl.descricao`)

---

### GAP 7 (BAIXO) — heroBackgroundUrl e pageBackgroundUrl não aplicados ✅

**Problema:** Imagens de background salvas no design config mas ignoradas no frontend.

**Arquivos alterados:**
- `src/features/catalogo/components/StoreLayout.tsx` — CSS vars `--catalogo-hero-bg` e `--catalogo-page-bg`
- `src/routes/catalogo.index.tsx` — Hero section usa `backgroundImage: var(--catalogo-hero-bg)`

**Solução:**
- `heroBackgroundUrl` aplicado como `background-image` na hero section
- `pageBackgroundUrl` aplicado no `document.body` com `background-size: cover`
- Cleanup atualizado para remover variáveis ao desmontar

---

### GAP 8 (BAIXO) — typography não aplicada ✅

**Problema:** `fontFamily` e `fontFamilyMono` salvas mas não aplicadas no DOM.

**Arquivo alterado:**
- `src/features/catalogo/components/StoreLayout.tsx`

**Solução:**
- CSS vars `--catalogo-font-family` e `--catalogo-font-mono` adicionadas
- `document.body.style.fontFamily` aplicada com a fonte configurada
- Cleanup atualizado

---

### GAP 9 (BAIXO) — Toggles showPrices/showSearchBar ignorados ✅

**Problema:** Design config permitia configurar visibilidade de preços e barra de busca, mas eram sempre exibidos.

**Arquivos alterados:**
- `src/features/catalogo/components/StoreLayout.tsx` — Context `CatalogoVisibilityContext`
- `src/routes/catalogo.produto.$tipo.$sku.tsx` — `AddButton` respeita `showPrices`

**Solução:**
- Criado `CatalogoVisibilityContext` com `showPrices` e `showSearchBar`
- Barra de busca condicional a `visibility.showSearchBar`
- `AddButton` mostra preço apenas quando `showPrices=true`

---

## Arquivos Modificados (Resumo)

| Arquivo | Gaps |
|---------|------|
| `src/features/catalogo/hooks/useCatalogo.ts` | GAP 1 |
| `src/routes/catalogo.produto.$tipo.$sku.tsx` | GAP 1, 5, 6, 9 |
| `src/features/catalogo/components/BomTable.tsx` | GAP 2 |
| `src/features/catalogo/components/FresagemTimeline.tsx` | GAP 2 |
| `src/routes/catalogo.kits.tsx` | GAP 2 |
| `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx` | GAP 3, 4 |
| `src/features/catalogo/components/StoreLayout.tsx` | GAP 7, 8, 9 |
| `src/routes/catalogo.index.tsx` | GAP 7 |

---

## Verificação

- ✅ `npm run build` passando em todas as etapas
- ✅ Todos os 9 gaps corrigidos
- ✅ Nenhum erro de TypeScript
- ✅ Nenhum breaking change identificado
