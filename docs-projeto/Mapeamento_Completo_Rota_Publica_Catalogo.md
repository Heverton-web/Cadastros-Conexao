# Mapeamento Completo: Rota Pública `/catalogo?empresa=<id>`

## 1. Rota e Hierarquia

**Arquivo:** `src/routes/catalogo.index.tsx`

A rota é **100% pública** — filha direta de `rootRoute`, **sem** `RequirePermission` nem `authLayout`. O `empresa_id` é extraído do query param `?empresa=` na URL.

### Hierarquia de Rotas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/catalogo` | `catalogo.index.tsx` | Landing page com cards de categorias |
| `/catalogo/$slug` | `catalogo.empresa.$slug.tsx` | Landing por slug da empresa |
| `/catalogo/implantes` | `catalogo.implantes.tsx` | Drill-down 4 etapas (Conexão → Família → Linha → Implantes) |
| `/catalogo/componentes` | `catalogo.componentes.tsx` | Drill-down 4 etapas (Família → Reabilitação → Abutment → Lista) |
| `/catalogo/kits` | `catalogo.kits.tsx` | Grid de kits ativos |
| `/catalogo/promocionais` | `catalogo.promocionais.tsx` | Grid de pacotes promocionais |
| `/catalogo/produto/$tipo/$sku` | `catalogo.produto.$tipo.$sku.tsx` | Detalhe do produto |
| `/loja/$slug` | `catalogo-loja.$slug.index.tsx` | Loja pública por slug (banner + produtos) |
| `/loja/$slug/login` | `catalogo-loja.$slug.login.tsx` | Login do cliente da loja |
| `/loja/$slug/pedidos` | `catalogo-loja.$slug.pedidos.tsx` | Pedidos do cliente |
| `/loja/$slug/favoritos` | `catalogo-loja.$slug.favoritos.tsx` | Favoritos do cliente |

---

## 2. Fluxo de Renderização

```
Acessa /catalogo?empresa=<id>
  │
  ├─ CatalogoIndexPage
  │    ├─ Valida param ?empresa
  │    ├─ Se super_admin sem param → tela seleção empresas
  │    ├─ Se sem empresa → "Bem-vindo ao Catálogo"
  │    └─ Se tem empresa → CatalogoStoreContent
  │         │
  │         ├─ getCatalogoDesign(empresaId) → catalogo_design_config
  │         ├─ empresas.nome → footer
  │         │
  │         ├─ StoreLayout (CSS vars, header, carrinho)
  │         │    ├─ Hero Section (tagline, título, subtítulo)
  │         │    ├─ Cards Grid (implantes, componentes, kits, promocionais)
  │         │    └─ Footer (redes sociais)
  │         │
  │         ├─ /catalogo/implantes → DrillDown → ProductCards
  │         ├─ /catalogo/componentes → DrillDown → ProductCards
  │         ├─ /catalogo/kits → Grid de kits
  │         ├─ /catalogo/promocionais → Grid de promos
  │         └─ /catalogo/produto/$tipo/$sku → Ficha técnica + carrinho
```

### Lógica do `CatalogoIndexPage`

1. **Loading state** → Mostra spinner dentro de `StoreLayout`
2. **Verifica `?empresa=<id>`** na URL:
   - Se existe e não é "null" → seta `empresaId` e para o loading
   - Se NÃO existe → tenta autenticar via `supabase.auth.getUser()`
3. **Se usuário autenticado:**
   - Busca `profiles.empresa_id` e `profiles.is_super_admin`
   - Se `is_super_admin` → mostra **tela de seleção de empresa** (grid de empresas ativas)
   - Se `empresa_id` existir → **redireciona** para `/catalogo?empresa={id}`
4. **Se sem empresa** (não logado, sem param) → Mostra mensagem "Bem-vindo ao Catálogo"
5. **Se empresa definida** → Renderiza `<CatalogoStoreContent empresaId={empresaId} />`

### `CatalogoStoreContent`

- Busca `getCatalogoDesign(empresaId)` → config de design da loja
- Busca `empresas.nome` para footer
- Renderiza **Hero Section** (tagline + título + subtítulo)
- Renderiza **Cards de Categorias** (grid dinâmico, 1-4 cards visíveis)
- Renderiza **Footer** com redes sociais
- Cada card é um `<Link to="/catalogo/{key}">` (implantes, componentes, kits, promocionais)

---

## 3. Service Layer

Todos os services acessam **direto o Supabase** (`supabase.from("catalogo_*")`) com filtro `.eq("empresa_id", empresaId)`. Não há API customizada.

| Service | Arquivo | Tabela Supabase | Funções |
|---|---|---|---|
| `design.service.ts` | `src/features/catalogo/services/design.service.ts` | `catalogo_design_config` | `getCatalogoDesign()` |
| `hierarquia.service.ts` | `src/features/catalogo/services/hierarquia.service.ts` | `catalogo_categorias`, `catalogo_ips_conexoes`, `catalogo_ips_familias`, `catalogo_ips_linhas` | `listarConexoes()`, `listarFamilias()`, `listarLinhas()` |
| `implantes.service.ts` | `src/features/catalogo/services/implantes.service.ts` | `catalogo_implantes` | `listarImplantesAtivos()`, `listarImplantesPorLinha()`, `getImplanteDetalhe()` |
| `componentes.service.ts` | `src/features/catalogo/services/componentes.service.ts` | `catalogo_abutments`, `catalogo_cps_tipos_reabilitacao`, `catalogo_cps_tipos_abutments` | `listarAbutments()`, `getAbutmentDetalhe()`, `listarTiposReabilitacao()`, `listarTiposAbutment()` |
| `kits.service.ts` | `src/features/catalogo/services/kits.service.ts` | `catalogo_kits` | `listarKitsAtivos()`, `getKitDetalhe()` |
| `promocionais.service.ts` | `src/features/catalogo/services/promocionais.service.ts` | `catalogo_promocionais` | `listarPromocionaisAtivos()`, `getPromocionalDetalhe()` |
| `imagens.service.ts` | `src/features/catalogo/services/imagens.service.ts` | `catalogo_imagens_produto` | `listarImagensBatch()` |

---

## 4. Types

**Arquivo principal:** `src/features/catalogo/types/index.ts`

### Hierarquia IPS

```typescript
interface CatalogoCategoria { id, empresa_id, nome, sigla, locked, ativo }
interface CatalogoIpsConexao { id, empresa_id, categoria_id, nome, sigla, locked, ativo, categoria? }
interface CatalogoIpsFamilia { id, empresa_id, conexao_id, nome, cor_identificacao, locked, ativo, conexao? }
interface CatalogoIpsLinha { id, empresa_id, familia_id, nome, ativo, familia? }
```

### Produtos

```typescript
interface CatalogoImplante { sku, empresa_id, linha_id, nome, diametro_mm, comprimento_mm, preco, ativo, linha?, conexao?, familia?, imagens? }
interface CatalogoAbutment { sku, empresa_id, tipo_abutment_id, nome, diametro_plataforma_mm, angulacao_graus, preco, ativo, tipo_abutment?, familia?, imagens? }
interface CatalogoKit { sku, empresa_id, tipo_kit_id, nome, descricao, preco, ativo, tipo_kit?, chaves?, fresas?, complementares?, opcionais?, imagens? }
interface CatalogoPromocional { id, empresa_id, nome, descricao, preco, expira_em, ativo, itens? }
```

### Imagens e UI

```typescript
interface CatalogoImagemProduto { id, empresa_id, produto_tipo, produto_sku, url_imagem, fonte, ordem_exibicao }
interface ProductSheetResult { tipo, sku, nome, subtitulo, cor, specs, imagens, fullRoute }
interface CartItem { sku, nome, tipo, cor, preco, quantidade, meta? }
```

### Design Config

```typescript
interface CatalogoDesignConfig { colors, typography, texts, visibility, images, elementBackgrounds, effects, cards, footer }
```

### Tipos de Clientes

**Arquivo:** `src/features/catalogo/types/clientes.ts`

```typescript
interface CatalogoCliente { id, empresa_id, user_id, grupo_id, nome, email, telefone, tipo, ativo, grupo? }
interface CatalogoGrupoCliente { id, empresa_id, nome, preco_tipo, desconto_percentual, ativo }
```

---

## 5. Hooks (React Query)

Todos usam `useCatalogoEmpresaId()` como fonte do `empresaId` e `enabled: !!empresaId`.

**Arquivo:** `src/features/catalogo/hooks/useCatalogo.ts`

| Hook | Service chamado |
|---|---|
| `useCategorias` | `hierarquia.listarCategorias(empresaId)` |
| `useConexoes` | `hierarquia.listarConexoes(empresaId)` |
| `useFamilias` | `hierarquia.listarFamilias(empresaId)` |
| `useLinhas` | `hierarquia.listarLinhas(empresaId)` |
| `useImplantesAtivos` | `implantes.listarImplantesAtivos(empresaId)` |
| `useImplantesPorLinha` | `implantes.listarImplantesPorLinha(empresaId, linhaId)` |
| `useImplanteDetalhe` | `implantes.getImplanteDetalhe(empresaId, sku)` |
| `useAbutments` | `componentes.listarAbutments(empresaId)` |
| `useAbutmentDetalhe` | `componentes.getAbutmentDetalhe(empresaId, sku)` |
| `useTiposReabilitacao` | `componentes.listarTiposReabilitacao(empresaId)` |
| `useTiposAbutment` | `componentes.listarTiposAbutment(empresaId)` |
| `useKitsAtivos` | `kits.listarKitsAtivos(empresaId)` |
| `useKitDetalhe` | `kits.getKitDetalhe(empresaId, sku)` |
| `usePromocionaisAtivos` | `promocionais.listarPromocionaisAtivos(empresaId)` |
| `usePromocionalDetalhe` | `promocionais.getPromocionalDetalhe(empresaId, id)` |
| `useProtocoloFresagem` | `implantes.getProtocoloFresagem(empresaId, sku)` |
| `useGuias` | `workflows.listarGuias(empresaId, filters)` |

### Hooks de Autenticação

| Hook | Arquivo | Descrição |
|---|---|---|
| `useCatalogoEmpresaId` | `hooks/useCatalogoEmpresa.ts` | Resolve empresa_id: context > search param `?empresa=` > slug URL > auth ERP > DEFAULT fallback |
| `useCatalogoVisitante` | `hooks/useCatalogoVisitante.ts` | Combina estado visitante/cliente. `isVisitante`, `podeVerPrecos`, `podeComprar` |
| `useCatalogoCliente` | `hooks/useCatalogoCliente.ts` | Verifica se user logado e `catalogo_cliente` ativo via `supabase.auth.getUser()` + query em `catalogo_clientes` |

---

## 6. Componentes de Renderização

| Componente | Arquivo | Função |
|---|---|---|
| **StoreLayout** | `src/features/catalogo/components/StoreLayout.tsx` | Wrapper de todas as rotas públicas. CSS vars do design, header com logo/busca/carrinho, footer |
| **WatermarkShape** | `src/features/catalogo/components/WatermarkShape.tsx` | Formas decorativas nos cards (diamond, circle, hexagon, ring, square) |
| **DrillDown** | `src/features/catalogo/components/DrillDown.tsx` | Navegação em etapas (Implantes e Componentes). Mostra opções com contadores e progress bar |
| **ProductCard** | `src/features/catalogo/components/ProductCard.tsx` | Card de produto com thumbnail, nome, SKU, seta. Usado na etapa 4 do drill-down |
| **ProductThumb** | `src/features/catalogo/components/ProductThumb.tsx` | Miniatura do produto com imagem ou placeholder colorido |
| **FresagemTimeline** | `src/features/catalogo/components/FresagemTimeline.tsx` | Timeline de protocolo de fresagem (no detalhe do implante) |
| **SequenciaProtetica** | `src/features/catalogo/components/SequenciaProtetica.tsx` | Sequência protética (no detalhe do abutment) |
| **BomTable** | `src/features/catalogo/components/BomTable.tsx` | Tabela de composição BOM do kit |
| **CartDrawer** | `src/features/catalogo/components/CartDrawer.tsx` | Drawer lateral do carrinho de compras |
| **ImageViewer** | `src/features/catalogo/components/ImageViewer.tsx` | Modal de zoom nas imagens |
| **ProductSheet** | `src/features/catalogo/components/ProductSheet.tsx` | Ficha técnica do produto (modal) |
| **BannerSolicitarAcesso** | `src/features/catalogo/components/BannerSolicitarAcesso.tsx` | Banner para visitantes na loja slug solicitarem acesso |

---

## 7. Estrutura de Dados Retornada

### Design Config (landing page)

```json
{
  "colors": { "accent": "#c9a655", "bg": "#0f172a", "surface": "#1e293b" },
  "typography": { "fontFamily": "'Inter', sans-serif" },
  "texts": {
    "storeTagline": "Novo Padrão Odontológico",
    "heroTitle": "Performance & Precisão",
    "heroSubtitle": "..."
  },
  "visibility": {
    "showHeroSection": true,
    "showCategoryCards": true,
    "showWatermark": true,
    "showFooter": true
  },
  "effects": { "enableBlobs": true, "blobColor": "#c9a655", "blobOpacity": 0.10, "blobBlur": 120 },
  "cards": {
    "implantes": { "title": "Implantes", "icon": "Crosshair", "enabled": true },
    "componentes": { "title": "Componentes", "icon": "ShieldCheck", "enabled": true },
    "kits": { "title": "Kits", "icon": "Box", "enabled": true },
    "promocionais": { "title": "Promoções", "icon": "Tag", "enabled": true },
    "watermarkShape": "diamond"
  },
  "footer": { "text": "ERP Odonto", "socialLinks": { "instagram": "", "whatsapp": "" } }
}
```

### Implantes (drill-down)

```json
[{
  "sku": "CM-4.3x11",
  "empresa_id": "uuid",
  "linha_id": "uuid",
  "diametro_mm": 4.3,
  "comprimento_mm": 11,
  "preco": 350.00,
  "ativo": true,
  "linha": {
    "nome": "Premium",
    "familia": {
      "nome": "posterior",
      "cor_identificacao": "#c9a655",
      "conexao": { "nome": "Cone Morse" }
    }
  }
}]
```

### Abutments (componentes)

```json
[{
  "sku": "AB-CM-01",
  "nome": "Abutment Hexágono",
  "tipo_abutment_id": "uuid",
  "diametro_plataforma_mm": 4.8,
  "angulacao_graus": 0,
  "preco": 280.00,
  "tipo_abutment": { "nome": "Reto", "tipo_reabilitacao": { "nome": "Unitária" } },
  "familia": { "nome": "Posterior", "cor_identificacao": "#c9a655" }
}]
```

### Kits

```json
[{
  "sku": "KIT-001",
  "nome": "Maleta Básica",
  "descricao": "Kit completo para cirurgia guiada",
  "preco": 1200.00,
  "ativo": true,
  "tipo_kit": { "nome": "Maleta" },
  "chaves": [], "fresas": [], "complementares": [], "opcionais": []
}]
```

### Promocionais

```json
[{
  "id": "uuid",
  "nome": "Kit Inauguração",
  "descricao": "Pacote especial de lançamento",
  "preco": 2500.00,
  "expira_em": "2026-12-31T00:00:00Z",
  "ativo": true,
  "itens": [
    { "sku": "CM-4.3x11", "tipo": "implante" },
    { "sku": "AB-CM-01", "tipo": "abutment" }
  ]
}]
```

---

## 8. Pontos-Chave

- **Empresa_id** via query param `?empresa=` na URL
- **Design customizável** por empresa (tabela `catalogo_design_config`)
- **Queries Supabase** sempre filtram por `empresa_id`
- **Carrinho isolado** por empresa + usuário (localStorage com escopo)
- Existe variante `/loja/$slug` que resolve empresa_id por slug da URL
- A rota é **100% pública** (sem RequirePermission)
