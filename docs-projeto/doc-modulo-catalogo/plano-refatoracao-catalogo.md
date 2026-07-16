# Plano de Refatoração — Organização do Módulo Catálogo

## Contexto

O módulo catálogo admin tem duas rotas:
- `/catalogo/admin/produtos` — CRUD de SKUs vendáveis
- `/catalogo/admin/cadastros` — tabelas auxiliares

**Decisão: manter as duas rotas separadas.**

---

## Descobertas

### 1. Tipos de produto ATUAIS (existentes)

| Tipo | Tabela | Form |
|------|--------|------|
| Implante | `catalogo_implantes` | ImplanteForm |
| Abutment (Componente) | `catalogo_abutments` | AbutmentForm |
| Kit | `catalogo_kits` | KitForm |

### 2. Tipos de produto NOVOS (não previstos)

#### 2.1 Parafusos de Retenção
- **O que são**: parafusos específicos que fixam abutments ou componentes
- **Campos**: SKU, nome, torque específico, imagens
- **Relacionamentos**:
  - Vinculado a: abutment OU componente
  - Associado a: chave de fixação OU chave protética específica
- **Tabela necessária**: `catalogo_parafusos_retensao` (nova)
- **Form necessário**: ParafusoRetencaoForm.tsx (novo)

#### 2.2 Cicatrizadores
- **O que são**: healing abutments / gingival formers — usados na fase de cicatrização
- **Campos**: SKU/código, altura transmucoso, diâmetro plataforma, torque específico, imagens
- **Relacionamentos**:
  - Vinculado à família do implante (cada família → tipo diferente de cicatrizador)
  - Chave de instalação (chave protética)
- **Tabela necessária**: `catalogo_cicatrizadores` (nova)
- **Form necessário**: CicatrizadorForm.tsx (novo)

### 3. Cadastros FALTANTES na UI (existentes no DB)

| Cadastro | Situação |
|----------|----------|
| **Instrumentais** (itens) | Service existe mas **não há subtab nem toggle** na UI |
| **etapa_nome** no AbutmentForm | Campo texto livre em vez de select da tabela `catalogo_etapas_workflow` |

---

## Nova Estrutura: 6 tabs → 4 tabs

### Antes (6 tabs, 14 subtabs)
```
1. Hierarquia        → Categorias, Conexões, Famílias, Linhas
2. Cirúrgico         → Fresas
3. Protético         → Tipos de Reabilitação, Tipos de Abutment
4. Acessórios & Ferr → Categorias de Acessório, Acessórios, Chaves & Ferramentas
5. Instrumentais     → Categorias de Instrumental (SEM CRUD de itens)
6. Kits & Workflows  → Categorias de Kit, Workflows, Etapas
```

### Depois (4 tabs, 16 subtabs)
```
1. ESTRUTURA (icon: Layers)
   ├── Categorias                → catalogo_categorias
   ├── Conexões                  → catalogo_conexoes
   ├── Famílias                  → catalogo_familias
   └── Linhas                    → catalogo_linhas

2. COMPONENTES PROTÉTICOS (icon: Stethoscope)
   ├── Tipos de Reabilitação     → catalogo_tipos_reabilitacao
   ├── Tipos de Abutment         → catalogo_tipos_abutment
   ├── Tipos de Componente       → catalogo_categorias_acessorio  (renomeado)
   ├── Componentes               → catalogo_acessorios            (renomeado)
   ├── Workflows Protéticos      → catalogo_workflows
   └── Etapas de Workflow        → catalogo_etapas_workflow

3. INSTRUMENTAIS (icon: Scissors)
   ├── Chaves Protéticas         → catalogo_chaves_ferramental (tipo ≠ "Cirúrgica")
   ├── Chaves Cirúrgicas         → catalogo_chaves_ferramental (tipo = "Cirúrgica")
   ├── Fresas                    → catalogo_fresas
   ├── Instrumentos Opcionais    → catalogo_instrumentais_gerais (filtro por categoria)
   ├── Instrumentos Complementares → catalogo_instrumentais_gerais (filtro por categoria)
   └── Categorias de Instrumental → catalogo_categorias_instrumental

4. KITS (icon: Package)
   └── Categorias de Kit         → catalogo_categorias_kit
```

---

## Nova Estrutura de Produtos: 3 → 5 tipos

### Antes
```
ProdutoFormModal:
├── Implante   → ImplanteForm
├── Componente → AbutmentForm
└── Kit        → KitForm
```

### Depois
```
ProdutoFormModal:
├── Implante           → ImplanteForm (existente)
├── Componente         → AbutmentForm (existente)
├── Parafuso Retenção  → ParafusoRetencaoForm (NOVO)
├── Cicatrizador       → CicatrizadorForm (NOVO)
└── Kit                → KitForm (existente)
```

### Definição dos novos tipos

#### ParafusoRetencaoForm
```
Campos:
├── SKU (text, required)
├── Nome (text, required)
├── Torque (N·cm) (number)
├── Vinculado a:
│   ├── Tipo: Abutment ou Componente (select)
│   └── SKU do vinculado (select condicional)
├── Chave de Fixação:
│   └── SKU da chave (select de catalogo_chaves_ferramental)
└── Preço (number)
```

#### CicatrizadorForm
```
Campos:
├── SKU (text, required)
├── Nome (text, required)
├── Altura Transmucoso (mm) (number)
├── Diâmetro Plataforma (select: 3.5, 4.3, 5.0, etc.)
├── Torque (N·cm) (number)
├── Família do Implante (select de catalogo_familias)
├── Chave de Instalação:
│   └── SKU da chave (select de catalogo_chaves_ferramental)
└── Preço (number)
```

---

## Ordem Lógica de Cadastramento

```
Nível 0 (sem dependências):
  ├── Categorias
  ├── Tipos de Reabilitação
  ├── Tipos de Abutment
  ├── Tipos de Componente
  ├── Categorias de Instrumental
  ├── Categorias de Kit
  ├── Fresas (SKU direto)
  ├── Chaves (SKU direto)
  ├── Workflows
  └── Etapas de Workflow

Nível 1 (depende de nível 0):
  ├── Conexões (precisa: categoria_id)
  ├── Componentes (precisa: categoria_id)
  └── Instrumentais (precisa: categoria_id)

Nível 2 (depende de nível 1):
  └── Famílias (precisa: conexao_id)

Nível 3 (depende de nível 2):
  ├── Linhas (precisa: familia_id)
  └── Abutments (precisa: familia_id + tipo_reabilitacao + tipo_abutment)

Nível 4 (depende de nível 3):
  ├── Implantes (precisa: linha_id → família → conexão → categoria)
  ├── Cicatrizadores (precisa: família + chave)
  ├── Parafusos de Retenção (precisa: abutment/componente + chave)
  └── Kits (precisa: categoria_kit + familias + BOM items)
```

---

## Plano de Ação

### Fase 1: Corrigir cadastros faltantes (DB existente)

**1.1 Adicionar CRUD de Instrumentais na UI**
- Arquivo: `src/routes/catalogo.admin.cadastros.tsx`
- Adicionar subtabs filtradas por categoria + toggle
- Criar `useToggleInstrumentalAtivo` em `useCatalogo.ts`

**1.2 Trocar etapa_nome por select**
- Arquivo: `src/features/catalogo/components/admin/produtos/forms/AbutmentForm.tsx`
- Substituir input por select com `useEtapas()`

### Fase 2: Reestruturar tabs (4 tabs)

**2.1 Reescrever constante TABS**
- Arquivo: `src/routes/catalogo.admin.cadastros.tsx`
- Nova estrutura: Estrutura, Componentes Protéticos, Instrumentais, Kits

**2.2 Renomear "Acessórios" → "Componentes"**
- "Categorias de Acessório" → "Tipos de Componente"
- "Acessórios" → "Componentes"

**2.3 Mover Workflows/Etapas para Componentes Protéticos**

**2.4 Separar Chaves por uso**
- Chaves Protéticas (tipo ≠ "Cirúrgica")
- Chaves Cirúrgicas (tipo = "Cirúrgica")

### Fase 3: Adicionar novos tipos de produto

**3.1 Criar tabela `catalogo_parafusos_retensao`**
- Migration SQL
- Campos: sku, empresa_id, nome, torque_ncm, vinculo_tipo, vinculo_sku, chave_sku, preco, ativo

**3.2 Criar tabela `catalogo_cicatrizadores`**
- Migration SQL
- Campos: sku, empresa_id, nome, altura_transmucoso, diametro_plataforma, torque_ncm, familia_id, chave_sku, preco, ativo

**3.3 Criar types TypeScript**
- Arquivo: `src/features/catalogo/types/index.ts`
- Adicionar `CatalogoParafusoRetencao` e `CatalogoCicatrizador`

**3.4 Criar services**
- `parafusos-retensao.service.ts` (novo)
- `cicatrizadores.service.ts` (novo)

**3.5 Criar hooks**
- `useCriarParafusoRetencao`, `useAtualizarParafusoRetencao`, `useToggleParafusoRetencaoAtivo`
- `useCriarCicatrizador`, `useAtualizarCicatrizador`, `useToggleCicatrizadorAtivo`

**3.6 Criar forms**
- `ParafusoRetencaoForm.tsx` (novo)
- `CicatrizadorForm.tsx` (novo)

**3.7 Atualizar ProdutoFormModal**
- Adicionar botões "Parafuso Retenção" e "Cicatrizador" na seleção de tipo
- Importar e renderizar novos forms

**3.8 Atualizar BOM do Kit**
- Adicionar tipos "parafuso_retensao" e "cicatrizador" ao BomItemTipo

**3.9 Atualizar ProductSheetTipo**
- Adicionar "parafuso_retensao" e "cicatrizador"

**3.10 Adicionar na página de Cadastros**
- Tab "Componentes Protéticos": adicionar subtabs de Parafusos e Cicatrizadores (ou na tab de Estrutura)

### Fase 4: Validar

**4.1** `npm run build` — sem erros
**4.2** Verificar `/catalogo/admin/cadastros` — 4 tabs, subtabs corretas
**4.3** Verificar `/catalogo/admin/produtos` — 5 tipos de produto
**4.4** Testar CRUD completo de cada tipo novo

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/routes/catalogo.admin.cadastros.tsx` | Reescrever TABS (4 tabs), adicionar subtabs Instrumentais |
| `src/features/catalogo/components/admin/produtos/forms/AbutmentForm.tsx` | Trocar input etapa_nome por select |
| `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx` | Adicionar 2 novos tipos |
| `src/features/catalogo/types/index.ts` | Adicionar 2 novas interfaces + tipos |
| `src/features/catalogo/hooks/useCatalogo.ts` | Adicionar hooks dos novos tipos + toggle instrumental |

## Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `src/features/catalogo/components/admin/produtos/forms/ParafusoRetencaoForm.tsx` | Form de parafuso de retenção |
| `src/features/catalogo/components/admin/produtos/forms/CicatrizadorForm.tsx` | Form de cicatrizador |
| `src/features/catalogo/services/parafusos-retensao.service.ts` | Service de parafusos |
| `src/features/catalogo/services/cicatrizadores.service.ts` | Service de cicatrizadores |
| `supabase/migrations/XXXX_novas_tabelas.sql` | Migration com 2 novas tabelas |
