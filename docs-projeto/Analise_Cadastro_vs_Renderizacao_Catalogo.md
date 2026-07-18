# Análise: Cadastro via Modais vs Renderização na Loja Pública

## Resumo Executivo

O módulo catálogo possui **9 gaps** onde dados são cadastrados corretamente nos modais admin mas **não são renderizados** (ou são renderizados incorretamente) na loja pública. Os 2 mais críticos são: **imagens não aparecem na página de detalhe** e **preços de composição BOM usam mock**.

---

## GAPS IDENTIFICADOS

### GAP 1 (CRÍTICO): Imagens não exibidas na página de detalhe do produto

- **Admin:** Upload funciona via `ImageUploader` → salva em `catalogo_imagens_produto` + bucket `catalogo-imagens`
- **Listagens:** `listarImagensBatch` busca imagens → `ProductCard` → `ProductThumb` → thumbnail aparece ✅
- **Página de detalhe (`/catalogo/produto/$tipo/$sku`):** `ProductImage` **NÃO busca imagens reais** — mostra apenas ícone `Box` placeholder

**Arquivo afetado:** `src/routes/catalogo.produto.$tipo.$sku.tsx` (componente `ProductImage`)

**Como resolver:**
O componente `ProductImage` na rota de detalhe precisa buscar imagens via `listarImagensBatch` e exibir a primeira imagem encontrada, em vez de mostrar um placeholder.

---

### GAP 2 (CRÍTICO): Preços de BOM/Composição usam `mockPreco()`

- **Listagem de kits:** `formatBRL(mockPreco(...))` ignora preço real do banco
- **BomTable:** `mockPreco()` gera preço pseudo-aleatório baseado no hash do SKU
- **FresagemTimeline:** `mockPreco()` usado diretamente
- A função `getPrecoFromDB()` existe e é usada no `AddButton`, mas não nos componentes de composição

**Arquivos afetados:**
- `src/features/catalogo/components/BomTable.tsx`
- `src/features/catalogo/components/FresagemTimeline.tsx`
- `src/routes/catalogo.kits.tsx`

**Como resolver:**
Substituir `mockPreco()` por `getPrecoFromDB()` nos componentes `BomTable`, `FresagemTimeline` e na listagem de kits.

---

### GAP 3 (MÉDIO): Campo `macrogeometria` coletado mas não salvo

- Schema `implantes.ts` existe `macrogeometria`
- Input no `ImplanteForm.tsx` coleta o valor
- **Porém:** no `makeImplantePayload()`, `macrogeometria` **NÃO é incluído** no payload

**Arquivo afetado:** `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx`

**Como resolver:**
Adicionar `macrogeometria` ao payload em `makeImplantePayload()`.

---

### GAP 4 (MÉDIO): Campo `nome` do implante salvo mas não enviado

- Schema exige `nome` obrigatório
- Service `criarImplante` aceita `nome`
- **Porém:** no `makeImplantePayload()`, `nome` **NÃO é enviado**

**Arquivo afetado:** `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx`

**Como resolver:**
Incluir `nome` no payload de `makeImplantePayload()`.

---

### GAP 5 (MÉDIO): `material` e `superficie` do implante não exibidos

- Salvos em `detalhes_extras` (JSONB) no modal
- Na ficha técnica pública, não há `SpecCard` para esses campos

**Arquivo afetado:** `src/routes/catalogo.produto.$tipo.$sku.tsx`

**Como resolver:**
Adicionar SpecCards para `material` e `superficie` na ficha técnica do implante.

---

### GAP 6 (MÉDIO): `descricao` do implante não exibida

- Campo é salvo no modal
- Na ficha pública, não é renderizado

**Arquivo afetado:** `src/routes/catalogo.produto.$tipo.$sku.tsx`

**Como resolver:**
Renderizar o campo `descricao` na seção de informações do produto.

---

### GAP 7 (BAIXO): `heroBackgroundUrl` e `pageBackgroundUrl` não aplicados

- Campos salvos no design config
- Na loja pública, nenhum código aplica essas imagens como background

**Arquivo afetado:** `src/features/catalogo/components/StoreLayout.tsx`

**Como resolver:**
Aplicar `heroBackgroundUrl` como background-image na hero section e `pageBackgroundUrl` no body quando configurados.

---

### GAP 8 (BAIXO): `typography` do design não aplicada

- `fontFamily` e `fontFamilyMono` são salvos mas nenhum código aplica essas fontes no DOM

**Arquivo afetado:** `src/features/catalogo/components/StoreLayout.tsx`

**Como resolver:**
Aplicar as fontes configuradas via CSS vars ou `@font-face` no `StoreLayout`.

---

### GAP 9 (BAIXO): Toggles `showPrices`/`showSearchBar` ignorados

- Design config permite configurar visibilidade de preços e barra de busca
- `StoreLayout` SEMPRE mostra barra de busca e preço no botão

**Arquivos afetados:**
- `src/features/catalogo/components/StoreLayout.tsx`
- Componente `AddButton`

**Como resolver:**
Verificar `visibility.showPrices` e `visibility.showSearchBar` antes de renderizar esses elementos.

---

## MAPA DE CAMPOS POR ENTIDADE

### IMPLANTE (`catalogo_implantes`)

| Campo | Salvo no Modal | Lido na Loja | Status |
|-------|:---:|:---:|:---:|
| `sku` | Sim | Sim | ✅ |
| `nome` | Sim (schema) | **NÃO** — usa `familia + dimensões` | ✗ GAP |
| `sigla` | Sim | **NÃO** | ✗ |
| `descricao` | Sim | **NÃO** na ficha | ✗ GAP |
| `linha_id` | Sim | Sim | ✅ |
| `diametro_mm` | Sim | Sim | ✅ |
| `comprimento_mm` | Sim | Sim | ✅ |
| `rosca_interna` | Sim | Sim | ✅ |
| `regiao_apical` | Sim | Sim | ✅ |
| `regiao_cervical` | Sim | Sim | ✅ |
| `torque_insercao` | Sim | Sim | ✅ |
| `macrogeometria` | Sim | **NÃO** (não salvo) | ✗ GAP |
| `material` | Sim (JSONB) | **NÃO** exibido | ✗ GAP |
| `superficie` | Sim (JSONB) | **NÃO** exibido | ✗ GAP |
| `preco` | Sim | Sim | ✅ |
| Imagens | Sim | **NÃO** na ficha detalhe | ✗ GAP |
| Protocolo fresagem | Sim | Sim | ✅ |

### ABUTMENT (`catalogo_abutments`)

| Campo | Salvo no Modal | Lido na Loja | Status |
|-------|:---:|:---:|:---:|
| `sku` | Sim | Sim | ✅ |
| `nome` | **NÃO** (derivado) | Derivado de `tipo + família` | ⚠️ |
| `descricao` | **NÃO** coletado | **NÃO** | ⚠️ |
| `familia_id` | Sim | Sim | ✅ |
| `tipo_reabilitacao_id` | Sim | Sim | ✅ |
| `tipo_abutment_id` | Sim | Sim | ✅ |
| `diametro_plataforma` | Sim | Sim | ✅ |
| `angulacao_graus` | Sim | Sim | ✅ |
| `altura_transmucoso` | Sim | Sim | ✅ |
| `altura_corpo` | Sim | Sim | ✅ |
| `torque_ncm` | Sim | Sim | ✅ |
| `preco` | Sim | Sim | ✅ |
| Sequência protética | Sim | Sim | ✅ |
| Imagens | Sim | **NÃO** na ficha detalhe | ✗ GAP |

### KIT (`catalogo_kits`)

| Campo | Salvo no Modal | Lido na Loja | Status |
|-------|:---:|:---:|:---:|
| `sku` | Sim | Sim | ✅ |
| `nome` | Sim | Sim | ✅ |
| `descricao` | Sim | Sim | ✅ |
| `tipo_kit_id` | Sim | **NÃO** exibido | ✗ |
| `preco` | Sim | Sim | ✅ |
| Composição BOM | Sim | Sim (mas com mockPreco) | ⚠️ |
| Imagens | Sim | **NÃO** na ficha detalhe | ✗ GAP |

### PROMOCIONAL (`catalogo_promocionais`)

| Campo | Salvo no Modal | Lido na Loja | Status |
|-------|:---:|:---:|:---:|
| `nome` | Sim | Sim | ✅ |
| `descricao` | Sim | Sim | ✅ |
| `preco` | Sim | Sim | ✅ |
| `expira_em` | Sim | Sim | ✅ |
| `ativo` | Sim | Sim | ✅ |
| Itens pivot | Sim | Sim | ✅ |

### DESIGN CONFIG (`catalogo_design_config`)

| Campo | Salvo no Modal | Aplicado na Loja | Status |
|-------|:---:|:---:|:---:|
| `colors.*` (14 cores) | Sim | Sim (CSS vars) | ✅ |
| `typography.*` | Sim | **NÃO** | ✗ GAP |
| `texts.*` (hero) | Sim | Sim | ✅ |
| `visibility.*` (8 toggles) | Sim | Parcial | ⚠️ |
| `images.logoUrl` | Sim | Sim | ✅ |
| `images.heroBackgroundUrl` | Sim | **NÃO** | ✗ GAP |
| `images.pageBackgroundUrl` | Sim | **NÃO** | ✗ GAP |
| `effects.*` | Sim | Sim | ✅ |
| `cards.*` | Sim | Sim | ✅ |
| `footer.*` | Sim | Sim | ✅ |

### HIERARQUIA (Categorias, Conexões, Famílias, Linhas)

| Campo | Salvo | Usado na Loja | Status |
|-------|:---:|:---:|:---:|
| `nome` | Sim | Sim | ✅ |
| `sigla` | Sim | Sim | ✅ |
| `cor_identificacao` | Sim | Sim | ✅ |
| `ativo` | Sim | Sim | ✅ |

---

## DIAGNÓSTICO POR CATEGORIA

### Imagens
- Upload funciona (Supabase Storage + `catalogo_imagens_produto`) ✅
- Thumbnails em listagens aparecem via `listarImagensBatch` ✅
- **Página de detalhe NÃO exibe imagens** — usa placeholder genérico ✗

### Preços
- Preços base salvos e exibidos corretamente ✅
- **BOM/Composição usam `mockPreco()`** em vez do preço real ✗
- Preços de promocionais corretos ✅

### Hierarquia (Drill-Down)
- Navegação 4 etapas funciona ✅
- Contadores baseados em dados reais ✅
- Filtros `ativo` respeitados ✅
- Entidades sem descendentes são ocultadas ✅

### Design Config
- Cores CSS vars aplicadas ✅
- Textos hero renderizados ✅
- Cards customizados funcionam ✅
- Footer com links sociais funciona ✅
- **Fontes ignoradas** ✗
- **Imagens de background ignoradas** ✗
