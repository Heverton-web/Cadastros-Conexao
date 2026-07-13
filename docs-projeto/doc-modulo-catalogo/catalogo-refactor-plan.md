# PLANO DE REFATORAÇÃO — Módulo Catálogo (Réplica do Original)

## Objetivo
Refatorar o módulo Catálogo para ser uma réplica exata do projeto original (https://catalogo-conexao.lovable.app), integrado como módulo do ERP.

---

## 1. DIFERENÇAS IDENTIFICADAS

### 1.1 StoreLayout (Público)
**Original:**
- Header sticky com logo "CONEXÃO" (text-gradient-gold)
- Nav: IMPLANTES | COMPONENTES | KITS | PROMOS
- Search bar (placeholder: "Buscar por SKU, Linha ou Dimensão...")
- Carrinho badge com contagem
- Footer: "© Conexão Implantes — Catálogo Clínico Enterprise."

**Atual (ERP):**
- Usa layout do ERP (sidebar + topbar)
- Sem search bar
- Sem footer dedicado

### 1.2 Drill-down Implantes
**Original (4 etapas):**
1. Escolha a Conexão (Cone Morse, HE, HI) — mostra contagem de famílias
2. Escolha a Família (NP, GMF, FIT) — mostra cor_identificacao
3. Escolha a Linha (Flex Gold, Easy Grip, Flash) — mostra ativo/inativo
4. Lista de Implantes — card com SKU, dimensões, specs

**Atual:**
- Apenas 3 etapas (Família → Linha → Implantes)
- Sem etapa de Conexão

### 1.3 Drill-down Componentes
**Original (4 etapas):**
1. Escolha o Tipo de Reabilitação (Unitária, Múltipla, Híbrida)
2. Escolha a Família
3. Escolha o Tipo de Abutment (Micro Unit, TiBase, Esteticone)
4. Lista de Abutments

**Atual:**
- Apenas 2 etapas (Família → Abutments)

### 1.4 Ficha Técnica (Implante Detail)
**Original:**
- Breadcrumb: "NP · Flex Gold"
- Título: "Flex Gold NP 3.5x8.5"
- Subtítulo: "SKU: 524385 · Ø 3.5 · C 8.5"
- Botão: "ADICIONAR · R$ 427,00"
- Ficha Técnica: tabela com Ø, Comprimento, Rosca interna, Torque, Região apical, Região cervical, Material, Superfície, Tratamento, Chave de instalação
- Protocolo de Fresagem: abas Hard/Soft com lista de fresas (cada uma com botão "Add")

**Atual:**
- Sem breadcrumb
- Layout simplificado
- Sem abas Hard/Soft
- Sem preços

### 1.5 Kit Detail
**Original:**
- Título + descrição
- Botão: "COMPRAR MALETA · R$ 3.232,00"
- BOM: tabela com Tipo, Nome, SKU, Qtd, botão "Add" por item
- Cada item mostra "ver ficha →"

**Atual:**
- Layout simplificado
- Sem preços
- Sem botões "Add" por item

### 1.6 Admin Layout
**Original:**
- Sidebar lateral com: Catálogo, Cadastros, Dashboard, Promos, Cupons, Frete, Social, Cores, Configurações
- Link "Voltar à loja"
- Header: "CONEXÃO ADMIN" + "Backoffice"

**Atual:**
- Usa layout do ERP
- Sem sidebar dedicada

### 1.7 Admin Cadastros
**Original:**
- Tabs: Hierarquia (Categorias, Conexões, Famílias, Linhas), Cirúrgico (Fresas), Protético (Tipos Reabilitação, Tipos Abutment), Acessórios, Instrumentais, Kits & Workflows
- Tabela com CRUD inline
- Categorias de sistema marcadas como "Sistema"

**Atual:**
- Drill-down hierárquico
- Sem tabs

### 1.8 Admin Cores
**Original:**
- Paletas prontas: Dark Gold, Cobalto, Esmeralda, Rubi, Grafite, Light
- Ajuste fino: Cor Principal, Texto sobre Principal, Cor Secundária, Fundo, Texto Principal, Texto Suave
- Pré-visualização em tempo real

**Atual:**
- Não implementado

---

## 2. COMPONENTES A CRIAR/REFATORAR

### 2.1 StoreLayout (`features/catalogo/components/StoreLayout.tsx`)
- [ ] Header sticky com logo "CONEXÃO" (text-gradient-gold)
- [ ] Nav: IMPLANTES | COMPONENTES | KITS | PROMOS
- [ ] Search bar funcional
- [ ] Carrinho badge com contagem
- [ ] Footer
- [ ] Mobile menu hamburger

### 2.2 AdminLayout (`features/catalogo/components/AdminLayout.tsx`)
- [ ] Sidebar com: Catálogo, Cadastros, Dashboard, Promos, Cupons, Frete, Social, Cores, Config
- [ ] Link "Voltar à loja"
- [ ] Header "CONEXÃO ADMIN"

### 2.3 ProductCard (`features/catalogo/components/ProductCard.tsx`)
- [ ] Card com cor_identificacao da família
- [ ] SKU, nome, specs
- [ ] Botão "Add" com preço

### 2.4 ProductSheet (`features/catalogo/components/ProductSheet.tsx`)
- [ ] Modal global de ficha técnica
- [ ] Specs em grid
- [ ] Protocolo de fresagem com abas Hard/Soft
- [ ] Botão "Adicionar" com preço

### 2.5 DrillDown (`features/catalogo/components/DrillDown.tsx`)
- [ ] Componente reutilizável de drill-down
- [ ] Breadcrumb animado
- [ ] Cards de seleção com contagem

### 2.6 FresagemTimeline (`features/catalogo/components/FresagemTimeline.tsx`)
- [ ] Abas Hard/Soft
- [ ] Lista ordenada de fresas
- [ ] Botão "Add" por fresa

### 2.7 BomTable (`features/catalogo/components/BomTable.tsx`)
- [ ] Tabela BOM com tipo, nome, SKU, qtd
- [ ] Botão "Add" por item
- [ ] Link "ver ficha →"

### 2.8 CarrinhoDrawer (`features/catalogo/components/CarrinhoDrawer.tsx`)
- [ ] Drawer lateral
- [ ] Itens com quantidade
- [ ] Total
- [ ] Botão "Finalizar"

---

## 3. ROTAS A REFATORAR

### 3.1 Públicas (StoreLayout)
- `/catalogo` — Home com 4 cards
- `/catalogo/implantes` — Drill-down 4 etapas
- `/catalogo/componentes` — Drill-down 4 etapas
- `/catalogo/kits` — Listagem de kits
- `/catalogo/promocionais` — Listagem de promoções
- `/catalogo/produto/$tipo/$sku` — Ficha técnica universal
- `/catalogo/carrinho` — Carrinho
- `/catalogo/checkout` — Checkout

### 3.2 Admin (AdminLayout)
- `/catalogo/admin/produtos` — CRUD de SKUs
- `/catalogo/admin/cadastros` — Tabs de cadastros auxiliares
- `/catalogo/admin/dashboard` — KPIs
- `/catalogo/admin/cupons` — Gestão de cupons
- `/catalogo/admin/frete` — Regras de frete
- `/catalogo/admin/promocionais` — Pacotes promocionais
- `/catalogo/admin/cores` — Configurador de temas

---

## 4. DADOS MOCK NECESSÁRIOS

### Hierarquia
- 3 categorias (Implantes, Componentes, Kits)
- 2 conexões (Cone Morse, Hexágono Externo)
- 3 famílias (NP=#3b82f6, GMF=#eab308, FIT=#22c55e)
- 3 linhas (Flex Gold, Easy Grip, Flash)

### Implantes
- 4 implantes ativos (524385, 524390, 630101, 999001)
- 5 fresas
- Protocolos de fresagem Hard/Soft

### Componentes
- 3 tipos reabilitação (Unitária, Múltipla, Híbrida)
- 3 tipos abutment (Micro Unit, TiBase, Esteticone)
- 6 abutments

### Acessórios
- 5 categorias acessório
- 8 acessórios
- 4 chaves ferramentais
- Cross-sell

### Workflows
- 2 workflows (Analógico, Digital)
- 4 etapas
- Guias de reabilitação

### Kits
- 2 categorias kit
- 3 kits
- BOM composition

### Comercial
- 3 cupons
- 4 faixas frete
- 2 promocionais

---

## 5. ORDEM DE IMPLEMENTAÇÃO

1. **StoreLayout** — componente principal da loja pública
2. **AdminLayout** — componente do admin
3. **DrillDown** — componente reutilizável
4. **ProductCard** — card de produto
5. **Refatorar rotas públicas** — usar StoreLayout + DrillDown
6. **Refatorar rotas admin** — usar AdminLayout
7. **FresagemTimeline** — abas Hard/Soft
8. **BomTable** — tabela BOM
9. **ProductSheet** — modal de ficha técnica
10. **CarrinhoDrawer** — drawer do carrinho
11. **Admin Cores** — configurador de temas
12. **Seed data** — aplicar mock no Supabase

---

## 6. DESIGN SYSTEM (Dark Gold)

```css
--color-bg: #0f172a;
--color-surface: #1e293b;
--color-surface-hover: #334155;
--color-card: #1e293b;
--color-text-main: #f8fafc;
--color-text-muted: #94a3b8;
--color-accent: #c9a655;
--color-accent-hover: #d4b366;
--color-accent-fg: #0f172a;
```

Classes especiais:
- `.bg-gradient-gold` — background dourado
- `.text-gradient-gold` — texto dourado
