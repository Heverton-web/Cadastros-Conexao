# PLANO DE MELHORIA — Módulo Catálogo (DB + UI)

**Data:** 2026-07-17
**Status:** PLANEJAMENTO (Aguardando autorização)

---

## 1. ANÁLISE DO ESTADO ATUAL vs ESPECIFICAÇÃO

### 1.1 Tabelas que EXISTEM mas precisam de ALTERações

| Tabela | Status | O que falta/muda |
|--------|--------|-------------------|
| `catalogo_categorias` | ✅ Existe | Faltando `sigla`. Campos OK. |
| `catalogo_conexoes` | ✅ Existe | Faltando `locked`. Campos OK. |
| `catalogo_familias` | ✅ Existe | Faltando `locked`. Campos OK. |
| `catalogo_linhas` | ✅ Existe | OK. |
| `catalogo_implantes` | ⚠️ Estrutura inadequada | Falta `nome`, `sigla`, `sku` (usa PK manual mas estrutura diferente). Falta FKs diretas: `categoria_id`, `conexao_id`, `familia_id`, `osso_soft`, `osso_hard`. Campos extras: `regiao_apical`, `regiao_cervical`, `torque_insercao`, `detalhes_extras` não existem na spec. Falta `preco`, `descricao`. |
| `catalogo_fresas` | ⚠️ Incompleta | Falta `tipo_fresa_id`, `kit_id`, `sigla`, `descricao`, `tipo`, `comprimento`, `material`, `preco`. |
| `catalogo_tipos_reabilitacao` | ✅ Existe | Falta `sigla`. |
| `catalogo_tipos_abutment` | ✅ Existe | OK. |
| `catalogo_abutments` | ⚠️ Inadequada | Falta `parafuso_id`, `chave_id`, `sku`, `nome`, `sigla`, `descricao`, `preco`. Estrutura FKs diferente da spec. |
| `catalogo_acessorios` | ⚠️ Inadequada | Estrutura muito diferente da spec (usa `categoria_id`, `caracteristicas` JSON). Spec pede: `tipo_componente_id`, `tipo_abutment_id`, `parafuso_id`, `chave_id`, `sku`, `nome`, etc. |
| `catalogo_chaves_ferramental` | ⚠️ Inadequada | Falta `tipo_chave_id`, `kit_id`, `sigla`, `descricao`, `tipo`, `comprimento`, `diametro_mm`, `material`, `preco`. |
| `catalogo_cicatrizadores` | ⚠️ Inadequada | Estrutura muito diferente. Falta: `implante_id`, `chave_id`, `sku`, `sigla`, `descricao`, `altura_corpo_mm`, `material`, `preco`. Usa `familia_id` em vez de `implante_id`. |
| `catalogo_kits` | ⚠️ Inadequada | Falta `tipo_kit_id`, `sigla`, `preco`. Usa `categoria_id` em vez de `tipo_kit_id`. |
| `catalogo_kit_composicao` | ⚠️ Inadequada | Estrutura completamente diferente. Spec pede tabelas pivô separadas (chaves, fresas, complementares, opcionais). |
| `catalogo_workflows` | ✅ Existe | Falta `sigla`. |
| `catalogo_etapas_workflow` | ⚠️ Incompleta | Falta `tipo_workflow_id`, `sigla`. Estrutura atual não tem FK para tipo_workflow. |
| `catalogo_categorias_acessorio` | ⚠️ Renomear | Spec chama de "Tipos de Componentes". |
| `catalogo_categorias_instrumental` | ⚠️ Renomear | Spec usa: "Tipos de Chaves", "Tipos de Fresas", "Tipos Complementares", "Tipos Opcionais" como tabelas separadas. |
| `catalogo_parafusos_retensao` | ⚠️ Renomear | Spec chama de `catalogo_parafusos`. Estrutura diferente. |
| `catalogo_parafusos` (novo) | ❌ Não existe | Tabela de Parafusos separada. |
| `catalogo_kit_familia` | ⚠️ Inadequada | Spec usa tabelas pivô para composição do kit. |

### 1.2 Tabelas que NÃO EXISTEM e precisam ser CRIADAS

| Tabela | Descrição |
|--------|-----------|
| `catalogo_cps_tipos_reabilitacao` | Tipos de Reabilitação (componentes) —.rename de `catalogo_tipos_reabilitacao`? |
| `catalogo_cps_tipos_abutments` | Tipos de Abutments (componentes) — rename de `catalogo_tipos_abutment`? |
| `catalogo_cps_tipos_componentes` | Tipos de Componentes |
| `catalogo_cps_tipos_parafusos` | Tipos de Parafusos |
| `catalogo_cps_tipos_cicatrizadores` | Tipos de Cicatrizadores |
| `catalogo_parafusos` | Parafusos (produto) |
| `catalogo_cps_tipos_workflows` | Tipos de Workflows |
| `catalogo_cps_etapas_workflows` | Etapas do Workflow (com FK tipo_workflow_id) |
| `catalogo_tipos_fresagens` | Tipos de Fresagens |
| `catalogo_protocolos_fresagens` | Protocolos de Fresagens (reestruturar) |
| `catalogo_protocolos_fresas_itens` | Tabela pivô: protocolo → fresa com ordem |
| `catalogo_tipos_chaves` | Tipos de Chaves |
| `catalogo_tipos_fresas` | Tipos de Fresas |
| `catalogo_tipos_complementares` | Tipos Complementares |
| `catalogo_tipos_opcionais` | Tipos Opcionais |
| `catalogo_chaves` | Chaves (produto, rename de `catalogo_chaves_ferramental`?) |
| `catalogo_complementares` | Complementares (produto) |
| `catalogo_opcionais` | Opcionais (produto) |
| `catalogo_tipos_kits` | Tipos de Kits |
| `catalogo_kit_chaves` | Pivô Kit ↔ Chaves |
| `catalogo_kit_fresas` | Pivô Kit ↔ Fresas |
| `catalogo_kit_complementares` | Pivô Kit ↔ Complementares |
| `catalogo_kit_opcionais` | Pivô Kit ↔ Opcionais |
| `catalogo_implantes_chaves` | Pivô Implante ↔ Chaves (N:M) |

### 1.3 Decisão de Arquitetura: Renomear vs Criar Nova

**Decisão:** Dado que a estrutura atual é significativamente diferente da spec, a abordagem mais limpa é:

1. **CRIAR novas tabelas** com os nomes da spec (mantendo dados existentes via seed de migração)
2. **MANTER tabelas antigas** temporariamente (não dropar imediatamente para não quebrar frontend existente)
3. **MIGRAR dados** das tabelas antigas para as novas via SQL de migração
4. **DROPAR tabelas antigas** apenas após frontend estar 100% migrado

**Exceção:** `catalogo_categorias`, `catalogo_conexoes`, `catalogo_familias`, `catalogo_linhas` — estão OK, apenas adicionar colunas faltantes.

---

## 2. FASE 1 — MIGRAÇÃO DO BANCO DE DADOS

### 2.1 Migration: Estrutura (Categorias, Conexões, Famílias, Linhas)

```sql
-- Adicionar colunas faltantes
ALTER TABLE catalogo_categorias ADD COLUMN IF NOT EXISTS sigla TEXT;
ALTER TABLE catalogo_conexoes ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT true;
ALTER TABLE catalogo_familias ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT true;
```

### 2.2 Migration: Tabelas de Tipos (Componentes)

```sql
-- Tipos de Reabilitação (já existe catalogo_tipos_reabilitacao)
-- Apenas adicionar sigla se faltar
ALTER TABLE catalogo_tipos_reabilitacao ADD COLUMN IF NOT EXISTS sigla TEXT;

-- Tipos de Abutments (já existe catalogo_tipos_abutment)
-- OK, já tem sigla

-- Tipos de Componentes (NOVA)
CREATE TABLE catalogo_cps_tipos_componentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  categoria_id UUID REFERENCES catalogo_categorias(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos de Parafusos (NOVA)
CREATE TABLE catalogo_cps_tipos_parafusos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos de Cicatrizadores (NOVA)
CREATE TABLE catalogo_cps_tipos_cicatrizadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos de Workflows (NOVA)
CREATE TABLE catalogo_cps_tipos_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Etapas do Workflow (REESTRUTURAR - adicionar tipo_workflow_id)
-- Criar nova tabela
CREATE TABLE catalogo_cps_etapas_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_workflow_id UUID NOT NULL REFERENCES catalogo_cps_tipos_workflows(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ordem INTEGER NOT NULL DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, tipo_workflow_id, nome)
);

-- Tipos de Fresagens (NOVA)
CREATE TABLE catalogo_tipos_fresagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos de Chaves (NOVA)
CREATE TABLE catalogo_tipos_chaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos de Fresas (NOVA)
CREATE TABLE catalogo_tipos_fresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos Complementares (NOVA)
CREATE TABLE catalogo_tipos_complementares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos Opcionais (NOVA)
CREATE TABLE catalogo_tipos_opcionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tipos de Kits (NOVA)
CREATE TABLE catalogo_tipos_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
```

### 2.3 Migration: Tabelas de Produtos

```sql
-- Parafusos (NOVA - substitui catalogo_parafusos_retensao)
CREATE TABLE catalogo_parafusos (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_parafuso_id UUID REFERENCES catalogo_cps_tipos_parafusos(id),
  chave_id UUID, -- FK para catalogo_chaves (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  torque_ncm NUMERIC,
  material TEXT,
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Chaves (REESTRUTURAR - substitui catalogo_chaves_ferramental)
CREATE TABLE catalogo_chaves (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_chave_id UUID REFERENCES catalogo_tipos_chaves(id),
  kit_id UUID, -- FK para catalogo_kits (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm NUMERIC,
  material TEXT,
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Fresas (REESTRUTURAR)
CREATE TABLE catalogo_fresas_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_fresa_id UUID REFERENCES catalogo_tipos_fresas(id),
  kit_id UUID, -- FK para catalogo_kits (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm NUMERIC,
  material TEXT,
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Complementares (NOVA)
CREATE TABLE catalogo_complementares (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_complementar_id UUID REFERENCES catalogo_tipos_complementares(id),
  kit_id UUID, -- FK para catalogo_kits (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm NUMERIC,
  material TEXT,
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Opcionais (NOVA)
CREATE TABLE catalogo_opcionais (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_opcional_id UUID REFERENCES catalogo_tipos_opcionais(id),
  kit_id UUID, -- FK para catalogo_kits (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm NUMERIC,
  material TEXT,
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);
```

### 2.4 Migration: Tabelas de Produtos (Implantes, Abutments, Componentes, Cicatrizadores)

```sql
-- Implantes (REESTRUTURAR completamente)
CREATE TABLE catalogo_implantes_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  categoria_id UUID REFERENCES catalogo_categorias(id),
  conexao_id UUID REFERENCES catalogo_ips_conexoes(id),
  familia_id UUID REFERENCES catalogo_ips_familias(id),
  linha_id UUID REFERENCES catalogo_ips_linhas(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  -- Chaves vinculadas (N:M via tabela pivô)
  -- Protocolos
  osso_soft UUID, -- FK para catalogo_protocolos_fresagens (será adicionado depois)
  osso_hard UUID, -- FK para catalogo_protocolos_fresagens (será adicionado depois)
  -- Imagens (upload ou URL)
  arquivo TEXT,
  url_s3 TEXT,
  url_google_drive TEXT,
  -- Especificações técnicas
  diametro_plataforma_mm NUMERIC,
  comprimento_mm NUMERIC,
  rosca_interna NUMERIC,
  macrogeometria TEXT,
  torque_ncm NUMERIC,
  material TEXT,
  superficie TEXT,
  -- Comercial
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Tabela pivô Implante ↔ Chaves
CREATE TABLE catalogo_implantes_chaves (
  implante_sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  chave_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (implante_sku, empresa_id, chave_sku),
  FOREIGN KEY (implante_sku, empresa_id) REFERENCES catalogo_implantes(sku, empresa_id),
  FOREIGN KEY (chave_sku, empresa_id) REFERENCES catalogo_chaves(sku, empresa_id)
);

-- Abutments (REESTRUTURAR)
CREATE TABLE catalogo_abutments_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_abutment_id UUID REFERENCES catalogo_cps_tipos_abutments(id),
  parafuso_id UUID, -- FK para catalogo_parafusos (será adicionado depois)
  chave_id UUID, -- FK para catalogo_chaves (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  -- Imagens
  arquivo TEXT,
  url_s3 TEXT,
  url_google_drive TEXT,
  -- Especificações
  diametro_plataforma_mm NUMERIC,
  altura_transmucoso_mm NUMERIC,
  altura_corpo_mm NUMERIC,
  angulacao_graus NUMERIC,
  torque_ncm NUMERIC,
  material TEXT,
  -- Comercial
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Componentes (NOVA)
CREATE TABLE catalogo_componentes (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_componente_id UUID REFERENCES catalogo_cps_tipos_componentes(id),
  tipo_abutment_id UUID REFERENCES catalogo_cps_tipos_abutments(id),
  parafuso_id UUID, -- FK para catalogo_parafusos (será adicionado depois)
  chave_id UUID, -- FK para catalogo_chaves (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  -- Imagens
  arquivo TEXT,
  url_s3 TEXT,
  url_google_drive TEXT,
  -- Especificações
  diametro_plataforma_mm NUMERIC,
  altura_transmucoso_mm NUMERIC,
  altura_corpo_mm NUMERIC,
  angulacao_graus NUMERIC,
  tipo TEXT,
  tipo_travamento TEXT,
  material TEXT,
  -- Comercial
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Cicatrizadores (REESTRUTURAR)
CREATE TABLE catalogo_cicatrizadores_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  implante_id UUID, -- FK para catalogo_implantes (será adicionado depois)
  chave_id UUID, -- FK para catalogo_chaves (será adicionado depois)
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  -- Imagens
  arquivo TEXT,
  url_s3 TEXT,
  url_google_drive TEXT,
  -- Especificações
  diametro_plataforma_mm NUMERIC,
  altura_transmucoso_mm NUMERIC,
  altura_corpo_mm NUMERIC,
  torque_ncm NUMERIC,
  material TEXT,
  -- Comercial
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);
```

### 2.5 Migration: Protocolos de Fresagens

```sql
-- Protocolos de Fresagens (REESTRUTURAR)
CREATE TABLE catalogo_protocolos_fresagens_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  tipo_osso TEXT NOT NULL, -- 'Soft' ou 'Hard'
  sigla TEXT,
  diametro_mm_aplicavel NUMERIC, -- diâmetro do implante aplicável
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Tabela pivô: Protocolo ↔ Fresas com Ordem
CREATE TABLE catalogo_protocolos_fresas_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  protocolo_id UUID NOT NULL REFERENCES catalogo_protocolos_fresagens_new(id),
  fresa_id TEXT NOT NULL, -- SKU da fresa
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, protocolo_id, fresa_id),
  UNIQUE(empresa_id, protocolo_id, ordem)
);
```

### 2.6 Migration: Kits

```sql
-- Kits (REESTRUTURAR)
CREATE TABLE catalogo_kits_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_kit_id UUID REFERENCES catalogo_tipos_kits(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  -- Imagens
  arquivo TEXT,
  url_s3 TEXT,
  url_google_drive TEXT,
  -- Comercial
  preco NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- Pivô Kit ↔ Chaves
CREATE TABLE catalogo_kit_chaves (
  kit_sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  chave_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (kit_sku, empresa_id, chave_sku),
  FOREIGN KEY (kit_sku, empresa_id) REFERENCES catalogo_kits(sku, empresa_id),
  FOREIGN KEY (chave_sku, empresa_id) REFERENCES catalogo_chaves(sku, empresa_id)
);

-- Pivô Kit ↔ Fresas
CREATE TABLE catalogo_kit_fresas (
  kit_sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  fresa_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (kit_sku, empresa_id, fresa_sku),
  FOREIGN KEY (kit_sku, empresa_id) REFERENCES catalogo_kits(sku, empresa_id),
  FOREIGN KEY (fresa_sku, empresa_id) REFERENCES catalogo_fresas_new(sku, empresa_id)
);

-- Pivô Kit ↔ Complementares
CREATE TABLE catalogo_kit_complementares (
  kit_sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  complementar_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (kit_sku, empresa_id, complementar_sku),
  FOREIGN KEY (kit_sku, empresa_id) REFERENCES catalogo_kits(sku, empresa_id),
  FOREIGN KEY (complementar_sku, empresa_id) REFERENCES catalogo_complementares(sku, empresa_id)
);

-- Pivô Kit ↔ Opcionais
CREATE TABLE catalogo_kit_opcionais (
  kit_sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  opcional_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (kit_sku, empresa_id, opcional_sku),
  FOREIGN KEY (kit_sku, empresa_id) REFERENCES catalogo_kits(sku, empresa_id),
  FOREIGN KEY (opcional_sku, empresa_id) REFERENCES catalogo_opcionais(sku, empresa_id)
);
```

### 2.7 Migration: RLS + Índices

```sql
-- Aplicar RLS em TODAS as novas tabelas
-- Padrão: empresa_id = auth.uid() OR is_super_admin
-- Criar índices para performance

-- Para cada tabela nova:
-- ALTER TABLE xxx ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "xxx_select" ON xxx FOR SELECT USING (...);
-- CREATE POLICY "xxx_insert" ON xxx FOR INSERT WITH CHECK (...);
-- CREATE POLICY "xxx_update" ON xxx FOR UPDATE USING (...);
-- CREATE POLICY "xxx_delete" ON xxx FOR DELETE USING (...);
-- CREATE INDEX IF NOT EXISTS idx_xxx_empresa ON xxx(empresa_id);
```

### 2.8 Migration: Migração de Dados

```sql
-- Migrar dados das tabelas antigas para as novas
-- (detalhado na implementação)

-- Exemplo: Migrar catalogo_categorias_acessorio → catalogo_cps_tipos_componentes
-- Exemplo: Migrar catalogo_categorias_instrumental → catalogo_tipos_chaves/fresas/etc
-- Exemplo: Migrar catalogo_chaves_ferramental → catalogo_chaves
-- etc.
```

### 2.9 Migration: Adicionar FKs Pendentes

```sql
-- Após criar todas as tabelas, adicionar FKs que dependem de outras tabelas
ALTER TABLE catalogo_parafusos ADD FOREIGN KEY (chave_id, empresa_id) REFERENCES catalogo_chaves(sku, empresa_id);
ALTER TABLE catalogo_chaves ADD FOREIGN KEY (kit_id, empresa_id) REFERENCES catalogo_kits(sku, empresa_id);
ALTER TABLE catalogo_fresas_new ADD FOREIGN KEY (kit_id, empresa_id) REFERENCES catalogo_kits(sku, empresa_id);
ALTER TABLE catalogo_implantes ADD FOREIGN KEY (osso_soft) REFERENCES catalogo_protocolos_fresagens_new(id);
ALTER TABLE catalogo_implantes ADD FOREIGN KEY (osso_hard) REFERENCES catalogo_protocolos_fresagens_new(id);
ALTER TABLE catalogo_abutments ADD FOREIGN KEY (parafuso_id, empresa_id) REFERENCES catalogo_parafusos(sku, empresa_id);
ALTER TABLE catalogo_abutments ADD FOREIGN KEY (chave_id, empresa_id) REFERENCES catalogo_chaves(sku, empresa_id);
ALTER TABLE catalogo_componentes ADD FOREIGN KEY (parafuso_id, empresa_id) REFERENCES catalogo_parafusos(sku, empresa_id);
ALTER TABLE catalogo_componentes ADD FOREIGN KEY (chave_id, empresa_id) REFERENCES catalogo_chaves(sku, empresa_id);
ALTER TABLE catalogo_cicatrizadores_new ADD FOREIGN KEY (implante_id, empresa_id) REFERENCES catalogo_implantes(sku, empresa_id);
ALTER TABLE catalogo_cicatrizadores_new ADD FOREIGN KEY (chave_id, empresa_id) REFERENCES catalogo_chaves(sku, empresa_id);
```

### 2.10 Migration: Limpeza

```sql
-- Após validação completa:
-- DROP TABLE catalogo_parafusos_retensao;
-- DROP TABLE catalogo_cicatrizadores;
-- DROP TABLE catalogo_kit_composicao;
-- DROP TABLE catalogo_kit_familia;
-- etc.
```

---

## 3. FASE 2 — SCHEMAS DE VALIDAÇÃO (Zod)

### 3.1 Arquivo: `src/features/catalogo/schemas/index.ts` (NOVO)

```typescript
import { z } from "zod"

// Base: empresa_id sempre injetado
export const empresaIdSchema = z.string().uuid()

// === CATEGORIAS ===
export const categoriaSchema = z.object({
  id: z.string().uuid().optional(),
  empresa_id: empresaIdSchema,
  nome: z.string().min(1, "Nome obrigatório"),
  sigla: z.string().optional(),
  locked: z.boolean().default(false),
  ativo: z.boolean().default(true),
})

// === CONEXÕES ===
export const conexaoSchema = z.object({
  id: z.string().uuid().optional(),
  empresa_id: empresaIdSchema,
  categoria_id: z.string().uuid("Selecione uma categoria"),
  nome: z.string().min(1, "Nome obrigatório"),
  sigla: z.string().min(1, "Sigla obrigatória"),
  locked: z.boolean().default(true),
  ativo: z.boolean().default(true),
})

// === FAMÍLIAS ===
export const familiaSchema = z.object({
  id: z.string().uuid().optional(),
  empresa_id: empresaIdSchema,
  conexao_id: z.string().uuid("Selecione uma conexão"),
  nome: z.string().min(1, "Nome obrigatório"),
  cor_identificacao: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  locked: z.boolean().default(true),
  ativo: z.boolean().default(true),
})

// === LINHAS ===
export const linhaSchema = z.object({
  id: z.string().uuid().optional(),
  empresa_id: empresaIdSchema,
  familia_id: z.string().uuid("Selecione uma família"),
  nome: z.string().min(1, "Nome obrigatório"),
  ativo: z.boolean().default(true),
})

// === IMPLANTES ===
export const implanteSchema = z.object({
  sku: z.string().min(1, "SKU obrigatório"),
  empresa_id: empresaIdSchema,
  categoria_id: z.string().uuid(),
  conexao_id: z.string().uuid(),
  familia_id: z.string().uuid(),
  linha_id: z.string().uuid(),
  nome: z.string().min(1, "Nome obrigatório"),
  sigla: z.string().optional(),
  descricao: z.string().optional(),
  chaves_id: z.array(z.string()).optional(),
  osso_soft: z.string().uuid("Protocolo Soft obrigatório"),
  osso_hard: z.string().uuid("Protocolo Hard obrigatório"),
  arquivo: z.string().optional(),
  url_s3: z.string().url().optional(),
  url_google_drive: z.string().url().optional(),
  diametro_plataforma_mm: z.number().positive().optional(),
  comprimento_mm: z.number().positive().optional(),
  rosca_interna: z.number().positive().optional(),
  macrogeometria: z.string().optional(),
  torque_ncm: z.number().positive().optional(),
  material: z.string().optional(),
  superficie: z.string().optional(),
  preco: z.number().min(0).default(0),
  ativo: z.boolean().default(true),
})

// ... (schemas para cada entidade)
```

### 3.2 Schemas necessários (lista)

| Schema | Entidade |
|--------|----------|
| `categoriaSchema` | Categorias |
| `conexaoSchema` | Conexões |
| `familiaSchema` | Famílias |
| `linhaSchema` | Linhas |
| `implanteSchema` | Implantes |
| `tipoReabilitacaoSchema` | Tipos de Reabilitação |
| `tipoAbutmentSchema` | Tipos de Abutments |
| `tipoComponenteSchema` | Tipos de Componentes |
| `tipoParafusoSchema` | Tipos de Parafusos |
| `tipoCicatrizadorSchema` | Tipos de Cicatrizadores |
| `abutmentSchema` | Abutments |
| `componenteSchema` | Componentes |
| `parafusoSchema` | Parafusos |
| `cicatrizadorSchema` | Cicatrizadores |
| `tipoChaveSchema` | Tipos de Chaves |
| `tipoFresaSchema` | Tipos de Fresas |
| `tipoComplementarSchema` | Tipos Complementares |
| `tipoOpcionalSchema` | Tipos Opcionais |
| `chaveSchema` | Chaves |
| `fresaSchema` | Fresas |
| `complementarSchema` | Complementares |
| `opcionalSchema` | Opcionais |
| `tipoKitSchema` | Tipos de Kits |
| `kitSchema` | Kits |
| `tipoWorkflowSchema` | Tipos de Workflows |
| `etapaWorkflowSchema` | Etapas do Workflow |
| `tipoFresagemSchema` | Tipos de Fresagens |
| `protocoloFresagemSchema` | Protocolos de Fresagens |

---

## 4. FASE 3 — TYPESCRIPT TYPES

### 4.1 Arquivo: `src/features/catalogo/types/index.ts` (ATUALIZAR)

Reescrever todos os interfaces para coincidir com as novas tabelas:

```typescript
// Interfaces que MUDAM:
// - CatalogoImplante → acrescenta: nome, sigla, descricao, categoria_id, conexao_id, familia_id, osso_soft, osso_hard, chaves_id[], arquivo, url_s3, url_google_drive, etc.
// - CatalogoAbutment → acrescenta: parafuso_id, chave_id, nome, sigla, descricao, material, preco, imagens
// - CatalogoFresa → acrescenta: tipo_fresa_id, kit_id, sigla, descricao, tipo, comprimento, material, preco
// - CatalogoChaveFerramental → renomear para CatalogoChave, acrescenta: tipo_chave_id, kit_id, sigla, etc.
// - CatalogoKit → acrescenta: tipo_kit_id, sigla, preco, composição por pivôs
// - CatalogoProtocoloFresagem → reestruturar completamente

// Interfaces NOVAS:
// - CatalogoTipoComponente
// - CatalogoTipoParafuso
// - CatalogoTipoCicatrizador
// - CatalogoTipoWorkflow
// - CatalogoEtapaWorkflow (com tipo_workflow_id)
// - CatalogoTipoFresagem
// - CatalogoProtocoloFresagem (novo)
// - CatalogoProtocoloFresaItem (pivô)
// - CatalogoTipoChave
// - CatalogoTipoFresa
// - CatalogoTipoComplementar
// - CatalogoTipoOpcional
// - CatalogoComplementar
// - CatalogoOpcional
// - CatalogoTipoKit
// - CatalogoParafuso
// - CatalogoComponente
// - CatalogoCicatrizador (novo)
// - CatalogoImplanteChave (pivô)
// - CatalogoKitChave (pivô)
// - CatalogoKitFresa (pivô)
// - CatalogoKitComplementar (pivô)
// - CatalogoKitOpcional (pivô)
```

---

## 5. FASE 4 — SERVICES (Supabase)

### 5.1 Arquivos a criar/atualizar

| Arquivo | Ação |
|---------|------|
| `services/categorias.service.ts` | ATUALIZAR (adicionar sigla) |
| `services/conexoes.service.ts` | ATUALIZAR (adicionar locked) |
| `services/familias.service.ts` | ATUALIZAR (adicionar locked) |
| `services/linhas.service.ts` | MANTER |
| `services/implantes.service.ts` | REESCREVER (nova estrutura) |
| `services/tipos-reabilitacao.service.ts` | ATUALIZAR (adicionar sigla) |
| `services/tipos-abutment.service.ts` | MANTER |
| `services/tipos-componentes.service.ts` | CRIAR |
| `services/tipos-parafusos.service.ts` | CRIAR |
| `services/tipos-cicatrizadores.service.ts` | CRIAR |
| `services/abutments.service.ts` | REESCREVER |
| `services/componentes.service.ts` | REESCREVER |
| `services/parafusos.service.ts` | CRIAR (substitui parafusos-retensao) |
| `services/cicatrizadores.service.ts` | REESCREVER |
| `services/tipos-chaves.service.ts` | CRIAR |
| `services/tipos-fresas.service.ts` | CRIAR |
| `services/tipos-complementares.service.ts` | CRIAR |
| `services/tipos-opcionais.service.ts` | CRIAR |
| `services/chaves.service.ts` | REESCREVER (substitui acessorios) |
| `services/fresas.service.ts` | REESCREVER |
| `services/complementares.service.ts` | CRIAR |
| `services/opcionais.service.ts` | CRIAR |
| `services/tipos-kits.service.ts` | CRIAR |
| `services/kits.service.ts` | REESCREVER |
| `services/tipos-workflows.service.ts` | CRIAR |
| `services/etapas-workflows.service.ts` | REESCREVER |
| `services/tipos-fresagens.service.ts` | CRIAR |
| `services/protocolos-fresagens.service.ts` | REESCREVER |

---

## 6. FASE 5 — MODAIS UI

### 6.1 Estrutura de modais

Cada entidade terá um modal de cadastro/editar seguindo o padrão:

```tsx
// Componente reutilizável para modal de cadastro
// Arquivo: components/admin/forms/[Entidade]FormModal.tsx
```

### 6.2 Modais por entidade

| Modal | Rota/Trigger | Tabs |
|-------|-------------|------|
| `CategoriaFormModal` | `/catalogo/admin/cadastros` → aba Categorias | — |
| `ConexaoFormModal` | `/catalogo/admin/implantes` → aba Estrutura → sub aba Conexões | — |
| `FamiliaFormModal` | `/catalogo/admin/implantes` → aba Estrutura → sub aba Famílias | — |
| `LinhaFormModal` | `/catalogo/admin/implantes` → aba Estrutura → sub aba Linhas | — |
| `ImplanteFormModal` | `/catalogo/admin/implantes` → aba Produtos → sub aba Implantes | Cascata: Cat→Con→Fam→Lin |
| `TipoReabilitacaoFormModal` | `/catalogo/admin/componentes` → aba Estrutura → sub aba Tipos de Reabilitação | Multi-select famílias |
| `TipoAbutmentFormModal` | `/catalogo/admin/componentes` → aba Estrutura → sub aba Tipos de Abutments | Select tipo_reabilitacao |
| `TipoComponenteFormModal` | `/catalogo/admin/componentes` → aba Estrutura → sub aba Tipos de Componentes | — |
| `TipoParafusoFormModal` | `/catalogo/admin/componentes` → aba Estrutura → sub aba Tipos de Parafusos | — |
| `TipoCicatrizadorFormModal` | `/catalogo/admin/componentes` → aba Estrutura → sub aba Tipos de Cicatrizadores | — |
| `AbutmentFormModal` | `/catalogo/admin/componentes` → aba Produtos → sub aba Abutments | Selects: tipo_abutment, parafuso, chave |
| `ComponenteFormModal` | `/catalogo/admin/componentes` → aba Produtos → sub aba Componentes | Selects: tipo_componente, tipo_abutment, parafuso, chave |
| `ParafusoFormModal` | `/catalogo/admin/componentes` → aba Produtos → sub aba Parafusos | Selects: tipo_parafuso, chave |
| `CicatrizadorFormModal` | `/catalogo/admin/componentes` → aba Produtos → sub aba Cicatrizadores | Selects: implante, chave |
| `TipoChaveFormModal` | `/catalogo/admin/instrumentais` → aba Estrutura → sub aba Tipos de Chaves | — |
| `TipoFresaFormModal` | `/catalogo/admin/instrumentais` → aba Estrutura → sub aba Tipos de Fresas | — |
| `TipoComplementarFormModal` | `/catalogo/admin/instrumentais` → aba Estrutura → sub aba Tipos Complementares | — |
| `TipoOpcionalFormModal` | `/catalogo/admin/instrumentais` → aba Estrutura → sub aba Tipos Opcionais | — |
| `ChaveFormModal` | `/catalogo/admin/instrumentais` → aba Produtos → sub aba Chaves | Selects: tipo_chave, kit |
| `FresaFormModal` | `/catalogo/admin/instrumentais` → aba Produtos → sub aba Fresas | Selects: tipo_fresa, kit |
| `ComplementarFormModal` | `/catalogo/admin/instrumentais` → aba Produtos → sub aba Complementares | Selects: tipo_complementar, kit |
| `OpcionalFormModal` | `/catalogo/admin/instrumentais` → aba Produtos → sub aba Opcionais | Selects: tipo_opcional, kit |
| `TipoKitFormModal` | `/catalogo/admin/kits` → aba Estrutura → sub aba Tipos de Kits | — |
| `KitFormModal` | `/catalogo/admin/kits` → aba Produtos → sub aba Kits | Select: tipo_kit + 4 seções de composição |
| `TipoWorkflowFormModal` | `/catalogo/admin/workflows` → aba Estrutura → sub aba Tipos de Workflows | — |
| `EtapaWorkflowFormModal` | `/catalogo/admin/workflows` → aba Etapas → sub aba Etapas do Workflow | Select: tipo_workflow + input ordem |
| `TipoFresagemFormModal` | `/catalogo/admin/fresagens` → aba Estrutura → sub aba Tipos de Fresagens | — |
| `ProtocoloFresagemFormModal` | `/catalogo/admin/fresagens` → aba Protocolos → sub aba Protocolos de Fresagens | Select tipo_osso + lista ordenada de fresas |

### 6.3 Comportamentos Especiais dos Modais

#### 6.3.1 Selects em Cascata (Implantes)

```
Categoria → [filtra] → Conexão → [filtra] → Família → [filtra] → Linha
```

- Ao selecionar Categoria: busca Conexões daquela Categoria → habilita Select Conexão
- Ao selecionar Conexão: busca Famílias daquela Conexão → habilita Select Família
- Ao selecionar Família: busca Linhas daquela Família → habilita Select Linha
- Se mudar Categoria: limpa Conexão, Família, Linha → desabilita selects abaixo

#### 6.3.2 Injeção de `empresa_id`

- `empresa_id` NUNCA aparece como input
- Preenchido automaticamente via `useCatalogoEmpresaId()`
- Super Admin pode ver/alterar (via select condicional)

#### 6.3.3 Seções Dinâmicas de Kit

O modal de Kit terá 4 seções:
1. **Chaves:** Select + botão "Adicionar" → lista visual com botão "Remover"
2. **Fresas:** Select + botão "Adicionar" → lista visual com botão "Remover"
3. **Complementares:** Select + botão "Adicionar" → lista visual com botão "Remover"
4. **Opcionais:** Select + botão "Adicionar" → lista visual com botão "Remover"

Cada seção: `useState<Item[]>([])` + `onAdd` + `onRemove` + `onReorder`

#### 6.3.4 Construtor de Sequência de Fresas (Protocolos)

O modal de Protocolo de Fresagem terá:
1. Select de Fresa (busca `catalogo_fresas`)
2. Input de Ordem (auto-preenchido com próximo número)
3. Botão "Adicionar Fresa"
4. Lista visual ordenada com:
   - Botão "Subir" (move para cima)
   - Botão "Descer" (move para baixo)
   - Botão "Remover"
5. A ordem é recalculada automaticamente ao mover

#### 6.3.5 Renderização Condicional

- Campos `null` ou `undefined` → componente NÃO renderizado
- `sigla` vazia → não exibe badge de sigla
- `descricao` vazia → não exibe seção de descrição
- Imagens: só exibe se houver pelo menos uma imagem

---

## 7. FASE 6 — ROTAS E INTEGRAÇÃO

### 7.1 Rotas a criar/atualizar

| Rota | Arquivo | Ação |
|------|---------|------|
| `/catalogo/admin/implantes` | `catalogo.admin.implantes.tsx` | CRIAR (com abas Estrutura/Produtos) |
| `/catalogo/admin/componentes` | `catalogo.admin.componentes.tsx` | CRIAR (com abas Estrutura/Produtos) |
| `/catalogo/admin/instrumentais` | `catalogo.admin.instrumentais.tsx` | CRIAR (com abas Estrutura/Produtos) |
| `/catalogo/admin/kits` | `catalogo.admin.kits.tsx` | CRIAR (com abas Estrutura/Produtos) |
| `/catalogo/admin/workflows` | `catalogo.admin.workflows.tsx` | CRIAR (com abas Estrutura/Etapas) |
| `/catalogo/admin/fresagens` | `catalogo.admin.fresagens.tsx` | CRIAR (com abas Estrutura/Protocolos) |
| `/catalogo/admin/cadastros` | `catalogo.admin.cadastros.tsx` | ATUALIZAR (adicionar aba Categorias) |

### 7.2 Layout de cada rota admin

Cada rota admin seguirá o padrão:

```
┌─────────────────────────────────────────────┐
│ PageHeader: Título + Botão "Novo"           │
├─────────────────────────────────────────────┤
│ Tabs: [Estrutura] [Produtos]               │
├─────────────────────────────────────────────┤
│ Sub-Tabs (conforme aba selecionada):        │
│ Estrutura: [Tipo1] [Tipo2] [Tipo3] ...    │
│ Produtos: [Produto1] [Produto2] ...        │
├─────────────────────────────────────────────┤
│ Conteúdo: Tabela com dados + ações          │
│ (Editar, Excluir, Toggle Ativo)             │
└─────────────────────────────────────────────┘
```

### 7.3 Proteção de Rotas

Todas as novas rotas devem usar `RequirePermission`:

```tsx
<RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_cadastros"]}>
  <Pagina />
</RequirePermission>
```

---

## 8. ORDEM DE EXECUÇÃO

| Fase | Descrição | Dependências |
|------|-----------|--------------|
| **1.1** | Migration: Adicionar colunas faltantes em tabelas existentes | Nenhuma |
| **1.2** | Migration: Criar tabelas de Tipos | Nenhuma |
| **1.3** | Migration: Criar tabelas de Produtos | 1.2 |
| **1.4** | Migration: Criar tabelas pivô | 1.3 |
| **1.5** | Migration: Protocolos de Fresagens | 1.3 |
| **1.6** | Migration: Kits | 1.3 |
| **1.7** | Migration: RLS + Índices | 1.2-1.6 |
| **1.8** | Migration: Migração de dados | 1.2-1.7 |
| **1.9** | Migration: FKs pendentes | 1.8 |
| **1.10** | Migration: Seed dados | 1.9 |
| **2** | Schemas Zod | 1.9 |
| **3** | Types TypeScript | 2 |
| **4** | Services Supabase | 3 |
| **5** | Modais UI (1 por entidade) | 4 |
| **6** | Rotas Admin | 5 |
| **7** | Integração e Testes | 6 |
| **8** | Limpeza (drop tabelas antigas) | 7 |

---

## 9. RISCOS E MITigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Dados existentes se perdem na migração | ALTO | Script de migração SQL com backup + INSERT INTO nova_tabela SELECT FROM tabela_antiga |
| Frontend quebra ao trocar tabelas | MANTER | Manter tabelas antigas até frontend migrado, usar views de compatibilidade |
| FKs circulares | MÉDIO | Criar tabelas sem FKs → adicionar FKs depois (FASE 1.9) |
| Performance com muitas tabelas pivô | BAIXO | Índices compostos + cache React Query |
| Modais ficam complexos demais | MÉDIO | Componentes reutilizáveis: `CascadeSelect`, `MultiSelect`, `OrderedList`, `ImageUpload` |

---

## 10. CHECKLIST DE VALIDAÇÃO

- [ ] Todas as tabelas da spec existem no banco
- [ ] Todas as colunas da spec existem em cada tabela
- [ ] RLS aplicado em todas as tabelas novas
- [ ] Índices criados para performance
- [ ] Schemas Zod validam todos os campos
- [ ] Types TypeScript espelham exatamente o schema do banco
- [ ] Services CRUD completos para cada entidade
- [ ] Modais implementados com todos os comportamentos:
  - [ ] Selects em cascata (Implantes)
  - [ ] Multi-selects (Tipos de Reabilitação → Famílias)
  - [ ] Seções dinâmicas de Kit
  - [ ] Construtor de sequência de Fresas
  - [ ] Renderização condicional de campos vazios
  - [ ] empresa_id injetado (não exibido)
  - [ ] locked visível apenas para Super Admin
- [ ] Rotas admin com abas e sub-abas
- [ ] Proteção de rotas com RequirePermission
- [ ] Seed com dados de teste
- [ ] Build passando sem erros

---

**Próximo passo:** Aguardar autorização do usuário para iniciar implementação.
