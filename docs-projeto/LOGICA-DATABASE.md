# LÓGICA DE DATABASE — MÓDULO CATÁLOGO

## FLUXO DE CADASTRO DO MÓDULO CATÁLOGO

---

### ETAPA 01 — HIERARQUIA DE CATEGORIAS (Estrutura)

**1.1 Categoria**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Categorias" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | locked: boolean | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` (multi-tenant)
- **TABELA:** `catalogo_categorias`

**1.2 Conexão**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Conexões" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | sigla: string | locked: boolean | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `categoria_id` (FK → Categoria) — **precisa ter pelo menos 1 Categoria**
- **TABELA:** `catalogo_conexoes`

**1.3 Família**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Famílias" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | cor_identificacao: hex color | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `conexao_id` (FK → Conexão) — **precisa ter pelo menos 1 Conexão**
- **TABELA:** `catalogo_familias`

**1.4 Linha**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Linhas" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `familia_id` (FK → Família) — **precisa ter pelo menos 1 Família**
- **TABELA:** `catalogo_linhas`

> **Resumo da cadeia:** Categoria → Conexão → Família → Linha

---

### ETAPA 02 — TIPOS AUXILIARES (Estrutura)

**2.1 Tipo de Reabilitação**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Tipos de Reabilitação" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` (sem FK dependente)
- **TABELA:** `catalogo_tipo_reabilitacao`

**2.2 Tipo de Abutment**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Tipos de Abutment" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | sigla: string | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` (sem FK dependente)
- **TABELA:** `catalogo_tipo_abutment`

**2.3 Categoria de Acessório**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Categorias de Acessório" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id`
- **TABELA:** `catalogo_categoria_acessorio`

**2.4 Categoria de Kit**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Categorias de Kit" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id`
- **TABELA:** `catalogo_categoria_kit`

**2.5 Categoria de Instrumental**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Categorias de Instrumental" → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string (obrigatório) | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id`
- **TABELA:** `catalogo_categoria_instrumental`

---

### ETAPA 03 — PRODUTOS (aba Produtos)

**3.1 Implante**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Implante" → botão "Novo"
- **DADOS:** `sku: string (PK manual) | diametro_mm: number | comprimento_mm: number | rosca_interna: string | regiao_apical: string | regiao_cervical: string | torque_insercao: number | detalhes_extras: json | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `linha_id` (FK → Linha) — **precisa ter a cadeia Categoria→Conexão→Família→Linha completa**
- **TABELA:** `catalogo_implantes`
- **OBS:** Aceita imagens via `catalogo_imagens_produto` (produto_tipo="implante", produto_sku=sku)

**3.2 Fresa**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Fresa" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | diametro_mm: number | venda_avulsa: boolean | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` (sem FK hierárquico — independente)
- **TABELA:** `catalogo_fresas`

**3.3 Abutment**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Abutment" → botão "Novo"
- **DADOS:** `sku: string (PK) | diametro_plataforma: string | angulacao_graus: number | altura_transmucoso: number | altura_corpo: number | torque_ncm: number | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `familia_id` (FK → Família) + `tipo_reabilitacao_id` (FK → Tipo de Reabilitação) + `tipo_abutment_id` (FK → Tipo de Abutment)
- **TABELA:** `catalogo_abutments`
- **PRÉ-REQUISITO:** Família + Tipo de Reabilitação + Tipo de Abutment devem existir

**3.4 Parafuso de Retenção**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Parafuso de Retenção" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | torque_ncm: number | vinculo_tipo: "abutment" | "componente" | vinculo_sku: string | chave_sku: string | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `chave_sku` (FK → Chave Ferramental, opcional)
- **TABELA:** `catalogo_parafusos_retencao`
- **PRÉ-REQUISITO:** Se usar chave_sku, a Chave Ferramental deve existir

**3.5 Cicatrizador**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Cicatrizador" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | altura_transmucoso: number | diametro_plataforma: string | torque_ncm: number | familia_id: string | chave_sku: string | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `familia_id` (FK → Família, opcional) + `chave_sku` (FK → Chave Ferramental, opcional)
- **TABELA:** `catalogo_cicatrizadores`

**3.6 Chave Ferramental**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Chaves Ferramentais" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | tipo_ferramenta: "Aperto" | "Medição" | "Cirúrgica" | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` (independente)
- **TABELA:** `catalogo_chaves_ferramental`

**3.7 Acessório**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Acessório" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | diametro_mm: number | altura_mm: number | caracteristicas: json | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `categoria_id` (FK → Categoria de Acessório) — **precisa ter 1 Categoria de Acessório**
- **TABELA:** `catalogo_acessorios`

**3.8 Kit**
- **ROTA:** `/catalogo/admin/produtos` → tipo "Kit" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | descricao: string | preco: number | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + `categoria_id` (FK → Categoria de Kit) — **precisa ter 1 Categoria de Kit**
- **TABELA:** `catalogo_kits`
- **COMPOSIÇÃO (BOM):** tabela `catalogo_kit_composicao` — pode conter fresas, chaves, acessórios, instrumentais, implantes, parafusos, cicatrizadores
- **FAMÍLIAS VINCULADAS:** tabela `catalogo_kit_familia` — quais famílias o kit cobre

**3.9 Instrumental**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Estrutura" → sub-aba "Instrumentais" → botão "Novo"
- **DADOS:** `sku: string (PK) | nome: string | preco: number`
- **RELACIONAMENTOS:** `empresa_id` + `categoria_id` (FK → Categoria de Instrumental)
- **TABELA:** `catalogo_instrumental_geral`

---

### ETAPA 04 — PROTOCOLOS E CONFIGURAÇÕES

**4.1 Protocolo de Fresagem**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Protocolos"
- **DADOS:** `id: uuid auto | implante_sku: string | fresa_sku: string | tipo_osso: "Soft (III-IV)" | "Hard (I-II)" | ordem_uso: number`
- **RELACIONAMENTOS:** `empresa_id` + `implante_sku` (FK → Implante) + `fresa_sku` (FK → Fresa)
- **TABELA:** `catalogo_protocolos_fresagem`
- **PRÉ-REQUISITO:** Implante + Fresa devem existir

**4.2 Sequência Protética**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Sequência Protética"
- **DADOS:** `id: uuid auto | abutment_sku: string | tipo_workflow: "analógico" | "digital" | etapa_ordem: number | etapa_nome: string | acessorio_sku: string`
- **RELACIONAMENTOS:** `empresa_id` + `abutment_sku` (FK → Abutment) + `acessorio_sku` (FK → Acessório)
- **TABELA:** `catalogo_sequencia_protetica`

**4.3 Workflow + Etapas**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Workflows"
- **DADOS Workflow:** `id: uuid auto | nome: string | ativo: boolean`
- **DADOS Etapa:** `id: uuid auto | ordem: number | nome: string | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` (ambos)
- **TABELAS:** `catalogo_workflows` + `catalogo_etapas_workflow`

**4.4 Guia de Reabilitação**
- **ROTA:** `/catalogo/admin/cadastros` → aba "Guia de Reabilitação"
- **DADOS:** `id: uuid auto | diametro_plataforma: string | acessorio_sku: string`
- **RELACIONAMENTOS:** `empresa_id` + `familia_id` (FK → Família) + `tipo_abutment_id` (FK → Tipo de Abutment) + `workflow_id` (FK → Workflow) + `etapa_id` (FK → Etapa Workflow) + `acessorio_sku` (FK → Acessório)
- **TABELA:** `catalogo_guia_reabilitacao`

---

### ETAPA 05 — VENDAS E PROMOÇÃO

**5.1 Cupom de Desconto**
- **ROTA:** `/catalogo/admin/cupons` → botão "Novo"
- **DADOS:** `id: uuid auto | codigo: string | tipo: "percentual" | "fixo" | valor: number | validade: string (data) | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id`
- **TABELA:** `catalogo_cupons`

**5.2 Faixa de Frete**
- **ROTA:** `/catalogo/admin/frete` → botão "Nova Faixa"
- **DADOS:** `id: uuid auto | cep_inicio: string | cep_fim: string | valor: number | prazo_dias: number`
- **RELACIONAMENTOS:** `empresa_id`
- **TABELA:** `catalogo_frete`

**5.3 Promocional (Pacote)**
- **ROTA:** `/catalogo/admin/promocionais` → botão "Novo"
- **DADOS:** `id: uuid auto | nome: string | descricao: string | preco: number | expira_em: string | ativo: boolean`
- **RELACIONAMENTOS:** `empresa_id` + itens em `catalogo_promocional_item` (cada item: `sku` de qualquer produto + `tipo`)
- **TABELA:** `catalogo_promocionais` + `catalogo_promocional_item`

---

### MAPA DE DEPENDÊNCIAS (ordem de criação obrigatória)

```
CATEGORIA ─────────────────────────────────────┐
  └─ CONEXÃO ──────────────────────────────────┤
       └─ FAMÍLIA ─────────────────────────────┤  ┌─ TIPO REABILITAÇÃO ──┐
            └─ LINHA ──────────────────────────┤  ├─ TIPO ABUTMENT ──────┤
                                               │  │                      │
            ┌─ CATEGORIA ACESSÓRIO ────────────┤  │                      │
            ├─ CATEGORIA KIT ──────────────────┤  │                      │
            ├─ CATEGORIA INSTRUMENTAL ─────────┤  │                      │
            │                                  │  │                      │
            ▼                                  ▼  ▼                      ▼
     ┌─────────────┐  ┌──────────┐  ┌───────────────┐  ┌──────────────┐
     │  ACESSÓRIO  │  │   KIT    │  │   ABUTMENT    │  │  CICATRIZADOR│
     │ (cat_acess) │  │ (cat_kit)│  │(fam+tipoR+tipo)│  │(fam+chave?)  │
     └──────┬──────┘  └────┬─────┘  └───────────────┘  └──────────────┘
            │               │
            ▼               ▼
     ┌──────────┐    ┌──────────┐    ┌─────────────────────┐
     │SEQUÊNCIA │    │KIT BOM   │    │    CHAVE FERRAMENTAL │
     │ PROTÉTICA│    │(fresas,  │    │    (independente)    │
     │(abut+acess)│  │ chaves,  │    └─────────┬───────────┘
     └──────────┘    │ acess)   │              │
                     └──────────┘              ▼
                                       ┌──────────────────┐
     ┌──────────┐                      │PARAFUSO RETENSÃO │
     │ WORKFLOW │                      │(vinculo + chave?) │
     │(indep.)  │                      └──────────────────┘
     └────┬─────┘
          ▼
     ┌──────────────┐
     │GUIA REABIL.  │
     │(fam+tipo+    │
     │ workflow+etap)│
     └──────────────┘

     ┌──────────┐  ┌──────────┐  ┌────────────────┐
     │  FRESA   │  │  CHAVE   │  │IMPLANTE (linha) │
     │(indep.)  │  │(indep.)  │  └────────────────┘
     └────┬─────┘  └──────────┘
          ▼
     ┌─────────────────┐
     │PROTOCOLO FRESE. │
     │(implante+fresa) │
     └─────────────────┘
```

---

### FLUXO PRÁTICO RECOMENDADO

| Ordem | Cadastro | Onde |
|-------|----------|------|
| 1 | Categorias (4-5 tipos) | Cadastros → Estrutura |
| 2 | Tipo de Reabilitação + Tipo de Abutment | Cadastros → Estrutura |
| 3 | Conexões (ligadas a Categorias) | Cadastros → Estrutura |
| 4 | Famílias (ligadas a Conexões) | Cadastros → Estrutura |
| 5 | Linhas (ligadas a Famílias) | Cadastros → Estrutura |
| 6 | Fresas | Produtos → Fresa |
| 7 | Chaves Ferramentais | Cadastros → Estrutura |
| 8 | Acessórios (ligados a Categoria Acessório) | Produtos → Acessório |
| 9 | Implantes (ligados a Linha) | Produtos → Implante |
| 10 | Abutments (ligados Família + Tipos) | Produtos → Abutment |
| 11 | Parafusos de Retenção (ligados a Abutment/Chave) | Produtos → Parafuso |
| 12 | Cicatrizadores (ligados a Família/Chave) | Produtos → Cicatrizador |
| 13 | Kits (ligados a Categoria Kit + composição BOM) | Produtos → Kit |
| 14 | Protocolos de Fresagem (Implante × Fresa) | Cadastros → Protocolos |
| 15 | Sequência Protética (Abutment × Acessório) | Cadastros → Sequência |
| 16 | Cupons, Frete, Promoções | Abas próprias no Admin |
