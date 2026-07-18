# Fichas Técnicas — Catálogo de Produtos

## Padrão de referência: ImplanteDetail

Todos os componentes de ficha técnica seguem o mesmo layout `grid-cols-12` com sidebar/main:

```
┌─────────────────────────────────────────────────┐
│ Sidebar (col-4/5)  │  Main (col-8/7)            │
│                    │                            │
│  ProductImage      │  ProductHeader             │
│  ├── thumbnails    │  AddButton (mobile)        │
│  AddButton (desk)  │  SectionTabs               │
│                    │  ├── Tab content            │
│                    │  │   SpecCard grid          │
│                    │  │   RelatedProductCard     │
│                    │  │   EmptyState             │
```

## Componentes por aba

### ImplanteDetail
| Aba | Conteúdo | Dados |
|---|---|---|
| Ficha | SpecCard grid (Diâmetro, Comprimento, Rosca, Torque, Região Apical, etc.) | specs[] do implante |
| Protocolos | Protocolo de reabilitação | useGuias() |
| Chaves | RelatedProductCard + AddButton | useChavesDoImplante(sku) |
| Kits | RelatedProductCard + EmptyState | useKitsComChavesEmComum(sku) |
| Cicatrizadores | RelatedProductCard + EmptyState | useCicatrizadoresDaFamilia() |
| Abutments | RelatedProductCard + EmptyState | useAbutmentsDaFamilia(familiaId) |

### AbutmentDetail
| Aba | Conteúdo | Dados |
|---|---|---|
| Ficha | SpecCard grid (Plataforma, Angulação, Transmucoso, Corpo, Torque, Material) + sigla badge + descrição | abutment fields |
| Sequência | SequenciaProtetica | useGuias() + SequenciaProtetica component |
| Kits | RelatedProductCard + EmptyState | useKitsComChavesEmComum(sku) |

### KitDetail
| Aba | Conteúdo | Dados |
|---|---|---|
| Ficha | SpecCard grid (Nome, Tipo, Descrição, SKU) | kit fields |
| Composição | BomTable + EmptyState | kit.composicao |

### PromocionalDetail
| Aba | Conteúdo | Dados |
|---|---|---|
| Ficha | SpecCard grid (Preço Original, Preço Promocional, Economia %) | calculado de promo.itens |
| Itens | RelatedProductCard por item com tipo badge | promo.itens |

## Arquivos

| Arquivo | Descrição |
|---|---|
| `ImplanteDetail.tsx` | Padrão de referência |
| `AbutmentDetail.tsx` | Reescrito para seguir padrão |
| `KitDetail.tsx` | Reescrito para seguir padrão |
| `PromocionalDetail.tsx` | Reescrito para seguir padrão |
| `SharedComponents.tsx` | ProductImage, ProductHeader, AddButton, SpecCard, SectionTabs, EmptyState, RelatedProductCard |
| `CatalogoIcons.tsx` | Ícones SVG customizados odontológicos |
| `TabIconsContext.tsx` | Contexto de ícones com fallback Lucide |

## Hooks de dados

```typescript
// Detalhes
useAbutmentDetalhe(sku)      // → CatalogoAbutment
useKitDetalhe(sku)           // → CatalogoKit
usePromocionalDetalhe(id)    // → CatalogoPromocional
useImagensProduto(tipo, sku) // → CatalogoImagemProduto[]

// Relacionados
useGuias({ familia_id })     // → guias de reabilitação
useChavesDoImplante(sku)     // → CatalogoChave[]
useAbutmentsDaFamilia(id)    // → CatalogoAbutment[]
useKitsComChavesEmComum(sku) // → CatalogoKit[]
useCicatrizadoresDaFamilia() // → CatalogoCicatrizador[]
```

## Ícones customizados (TabIconsContext)

| Key | SVG | Representação |
|---|---|---|
| `dental:ficha` | IconFicha | Dente com prancheta |
| `dental:protocolos` | IconProtocolo | Cronograma + dente |
| `dental:chaves` | IconChave | Chave de fenda dental |
| `dental:kits` | IconKit | Caixa com instrumentos |
| `dental:cicatrizadores` | IconCicatrizador | Corpo + gengiva |
| `dental:abutments` | IconAbutment | Implante com conexão |

Fallback: Lucide icons para customização admin.
