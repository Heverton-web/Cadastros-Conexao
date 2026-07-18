# Plano: Restruuturação Completa do Módulo Catálogo - DB + UI

## Resumo Executivo

Reestruturar todas as tabelas, schemas Zod, services CRUD e modais UI do módulo catálogo para alinhar com a nova especificação de negócio. Envolve ~20 tabelas novas, ~10 tabelas modificadas, ~10 tabelas deprecadas, ~20 modais reescritos e pivot tables para N:M.

**Decisões confirmadas:**
- Migration grande única (cria + migra + dropa)
- Imagens via tabela separada `catalogo_imagens_produto` (CHECK expandido)
- N:M implante→chaves via tabela pivô `catalogo_implante_chaves`
- `categoria_id` no implante com DEFAULT fixo (oculto no modal)

---

## FASE 1: Migration SQL Única

### Arquivo: `supabase/migrations/YYYYMMDD_catalogo_reestruturacao_completa.sql`

#### 1.1 Criar tabelas de estrutura (hierarquia renomeada + novas)

```sql
-- catalogo_categorias: ADICIONAR coluna sigla
ALTER TABLE catalogo_categorias ADD COLUMN IF NOT EXISTS sigla TEXT;

-- catalogo_ips_conexoes (NOVA - dados migram de catalogo_conexoes)
CREATE TABLE catalogo_ips_conexoes (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES catalogo_categorias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT NOT NULL,
  locked BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
-- Migrar dados
INSERT INTO catalogo_ips_conexoes (id, empresa_id, categoria_id, nome, sigla, locked, ativo, created_at, updated_at)
SELECT id, empresa_id, categoria_id, nome, COALESCE(sigla, ''), locked, ativo, created_at, updated_at
FROM catalogo_conexoes;

-- catalogo_ips_familias (NOVA - dados migram de catalogo_familias)
CREATE TABLE catalogo_ips_familias (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  conexao_id UUID NOT NULL REFERENCES catalogo_ips_conexoes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor_identificacao TEXT DEFAULT '#c9a655',
  locked BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
INSERT INTO catalogo_ips_familias (id, empresa_id, conexao_id, nome, cor_identificacao, ativo, created_at, updated_at)
SELECT f.id, f.empresa_id, f.conexao_id, f.nome, f.cor_identificacao, f.ativo, f.created_at, f.updated_at
FROM catalogo_familias f;

-- catalogo_ips_linhas (NOVA - dados migram de catalogo_linhas)
CREATE TABLE catalogo_ips_linhas (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  familia_id UUID NOT NULL REFERENCES catalogo_ips_familias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
INSERT INTO catalogo_ips_linhas (id, empresa_id, familia_id, nome, ativo, created_at, updated_at)
SELECT id, empresa_id, familia_id, nome, ativo, created_at, updated_at
FROM catalogo_linhas;
```

#### 1.2 Tipos de Estrutura (todos os `catalogo_cps_tipos_*` e `catalogo_tipos_*`)

```sql
-- catalogo_cps_tipos_reabilitacao (REESCRITA - adiciona sigla + vinculo N:M com familias)
CREATE TABLE catalogo_cps_tipos_reabilitacao (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
INSERT INTO catalogo_cps_tipos_reabilitacao (id, empresa_id, nome, sigla, ativo, created_at, updated_at)
SELECT id, empresa_id, nome, sigla, ativo, created_at, updated_at
FROM catalogo_tipos_reabilitacao;

-- Tabela pivô: tipo_reabilitacao <-> familias (N:M)
CREATE TABLE catalogo_cps_tipos_reabilitacao_familias (
  tipo_reabilitacao_id UUID NOT NULL REFERENCES catalogo_cps_tipos_reabilitacao(id) ON DELETE CASCADE,
  familia_id UUID NOT NULL REFERENCES catalogo_ips_familias(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  PRIMARY KEY (tipo_reabilitacao_id, familia_id)
);

-- catalogo_cps_tipos_abutments (NOVA - dados migram de catalogo_tipos_abutment)
CREATE TABLE catalogo_cps_tipos_abutments (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  tipo_reabilitacao_id UUID NOT NULL REFERENCES catalogo_cps_tipos_reabilitacao(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
INSERT INTO catalogo_cps_tipos_abutments (id, empresa_id, nome, sigla, ativo, created_at, updated_at)
SELECT id, empresa_id, nome, sigla, ativo, created_at, updated_at
FROM catalogo_tipos_abutment;

-- catalogo_cps_tipos_componentes (NOVA)
CREATE TABLE catalogo_cps_tipos_componentes (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  categoria_id UUID REFERENCES catalogo_categorias(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_cps_tipos_parafusos (NOVA)
CREATE TABLE catalogo_cps_tipos_parafusos (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_cps_tipos_cicatrizadores (NOVA)
CREATE TABLE catalogo_cps_tipos_cicatrizadores (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_tipos_chaves (NOVA)
CREATE TABLE catalogo_tipos_chaves (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_tipos_fresas (NOVA)
CREATE TABLE catalogo_tipos_fresas (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_tipos_complementares (NOVA)
CREATE TABLE catalogo_tipos_complementares (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_tipos_opcionais (NOVA)
CREATE TABLE catalogo_tipos_opcionais (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_tipos_fresagens (NOVA)
CREATE TABLE catalogo_tipos_fresagens (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- catalogo_tipos_kits (NOVA - dados migram de catalogo_categorias_kit)
CREATE TABLE catalogo_tipos_kits (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
INSERT INTO catalogo_tipos_kits (id, empresa_id, nome, ativo, created_at, updated_at)
SELECT id, empresa_id, nome, ativo, created_at, updated_at
FROM catalogo_categorias_kit;

-- catalogo_cps_tipos_workflows (NOVA - dados migram de catalogo_workflows)
CREATE TABLE catalogo_cps_tipos_workflows (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);
INSERT INTO catalogo_cps_tipos_workflows (id, empresa_id, nome, ativo, created_at, updated_at)
SELECT id, empresa_id, nome, ativo, created_at, updated_at
FROM catalogo_workflows;

-- catalogo_cps_etapas_workflows (NOVA - dados migram de catalogo_etapas_workflow)
CREATE TABLE catalogo_cps_etapas_workflows (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_workflow_id UUID NOT NULL REFERENCES catalogo_cps_tipos_workflows(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sigla TEXT,
  ordem INT NOT NULL DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO catalogo_cps_etapas_workflows (id, empresa_id, nome, ordem, ativo, created_at, updated_at)
SELECT id, empresa_id, nome, ordem, ativo, created_at, updated_at
FROM catalogo_etapas_workflow;
```

#### 1.3 Tabelas de Produtos (REESCRITAS)

```sql
-- catalogo_protocolos_fresagens (NOVA - substitui catalogo_protocolo_fresagem)
CREATE TABLE catalogo_protocolos_fresagens (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo_osso TEXT NOT NULL,
  sigla TEXT,
  diametro_mm_aplicavel DECIMAL(5,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- catalogo_protocolos_fresas_itens (PIVOT com ordenação)
CREATE TABLE catalogo_protocolos_fresas_itens (
  id UUID PK DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  protocolo_id UUID NOT NULL REFERENCES catalogo_protocolos_fresagens(id) ON DELETE CASCADE,
  fresa_id TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- catalogo_implantes (REESCRITA COMPLETA)
-- Mantém empresa_id + linha_id FK para compatibilidade com dados existentes
-- Adiciona todas as novas colunas
ALTER TABLE catalogo_implantes
  ADD COLUMN IF NOT EXISTS nome TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sigla TEXT,
  ADD COLUMN IF NOT EXISTS descricao TEXT,
  ADD COLUMN IF NOT EXISTS conexao_id UUID REFERENCES catalogo_ips_conexoes(id),
  ADD COLUMN IF NOT EXISTS familia_id UUID REFERENCES catalogo_ips_familias(id),
  ADD COLUMN IF NOT EXISTS categoria_id UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS osso_soft UUID REFERENCES catalogo_protocolos_fresagens(id),
  ADD COLUMN IF NOT EXISTS osso_hard UUID REFERENCES catalogo_protocolos_fresagens(id),
  ADD COLUMN IF NOT EXISTS macrogeometria TEXT,
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS superficie TEXT;

-- catalogo_implante_chaves (PIVOT N:M)
CREATE TABLE catalogo_implante_chaves (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  implante_sku TEXT NOT NULL,
  chave_id UUID NOT NULL,
  PRIMARY KEY (empresa_id, implante_sku, chave_id)
);

-- catalogo_abutments (REESCRITA COMPLETA)
-- Adicionar novas colunas ao existente
ALTER TABLE catalogo_abutments
  ADD COLUMN IF NOT EXISTS nome TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS sigla TEXT,
  ADD COLUMN IF NOT EXISTS descricao TEXT,
  ADD COLUMN IF NOT EXISTS parafuso_id TEXT,
  ADD COLUMN IF NOT EXISTS chave_id UUID;

-- catalogo_componentes (NOVA)
CREATE TABLE catalogo_componentes (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_componente_id UUID REFERENCES catalogo_cps_tipos_componentes(id),
  tipo_abutment_id UUID REFERENCES catalogo_cps_tipos_abutments(id),
  parafuso_id TEXT,
  chave_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  diametro_plataforma_mm DECIMAL(5,2),
  altura_transmucoso_mm DECIMAL(5,2),
  altura_corpo_mm DECIMAL(5,2),
  angulacao_graus DECIMAL(5,2),
  tipo TEXT,
  tipo_travamento TEXT,
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- catalogo_parafusos (NOVA - substitui catalogo_parafusos_retensao com FK corrigida)
CREATE TABLE catalogo_parafusos (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_parafuso_id UUID REFERENCES catalogo_cps_tipos_parafusos(id),
  chave_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  torque_ncm DECIMAL(5,2),
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- catalogo_cicatrizadores (REESCRITA COMPLETA com FK corrigida)
CREATE TABLE catalogo_cicatrizadores_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  implante_id UUID,
  chave_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  diametro_plataforma_mm DECIMAL(5,2),
  altura_transmucoso_mm DECIMAL(5,2),
  altura_corpo_mm DECIMAL(5,2),
  torque_ncm DECIMAL(5,2),
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);
-- Migrar dados
INSERT INTO catalogo_cicatrizadores_new (sku, empresa_id, nome, altura_transmucoso, diametro_plataforma, torque_ncm, chave_sku, preco, ativo, created_at, updated_at)
SELECT sku, empresa_id, nome, altura_transmucoso, diametro_plataforma, torque_ncm, chave_sku, preco, ativo, created_at, updated_at
FROM catalogo_cicatrizadores;
-- Dropar antiga e renomear nova
DROP TABLE catalogo_cicatrizadores;
ALTER TABLE catalogo_cicatrizadores_new RENAME TO catalogo_cicatrizadores;

-- catalogo_chaves (NOVA - substitui catalogo_chaves_ferramental)
CREATE TABLE catalogo_chaves (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_chave_id UUID REFERENCES catalogo_tipos_chaves(id),
  kit_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm DECIMAL(5,2),
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);
-- Migrar dados de catalogo_chaves_ferramental
INSERT INTO catalogo_chaves (sku, empresa_id, nome, tipo, preco, ativo, created_at, updated_at)
SELECT sku, empresa_id, nome, tipo_ferramenta, preco, ativo, created_at, updated_at
FROM catalogo_chaves_ferramental;

-- catalogo_fresas (REESCRITA COMPLETA)
CREATE TABLE catalogo_fresas_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_fresa_id UUID REFERENCES catalogo_tipos_fresas(id),
  kit_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm DECIMAL(5,2),
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);
INSERT INTO catalogo_fresas_new (sku, empresa_id, nome, diametro_mm, preco, ativo, created_at, updated_at)
SELECT sku, empresa_id, nome, diametro_mm, preco, ativo, created_at, updated_at
FROM catalogo_fresas;
DROP TABLE catalogo_fresas;
ALTER TABLE catalogo_fresas_new RENAME TO catalogo_fresas;

-- catalogo_complementares (NOVA)
CREATE TABLE catalogo_complementares (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_complementar_id UUID REFERENCES catalogo_tipos_complementares(id),
  kit_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm DECIMAL(5,2),
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- catalogo_opcionais (NOVA)
CREATE TABLE catalogo_opcionais (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_opcional_id UUID REFERENCES catalogo_tipos_opcionais(id),
  kit_id UUID,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  tipo TEXT,
  comprimento TEXT,
  diametro_mm DECIMAL(5,2),
  material TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);

-- catalogo_kits (REESCRITA COMPLETA)
CREATE TABLE catalogo_kits_new (
  sku TEXT NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_kit_id UUID REFERENCES catalogo_tipos_kits(id),
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (sku, empresa_id)
);
INSERT INTO catalogo_kits_new (sku, empresa_id, nome, descricao, preco, ativo, created_at, updated_at)
SELECT sku, empresa_id, nome, descricao, preco, ativo, created_at, updated_at
FROM catalogo_kits;
DROP TABLE catalogo_kits_composicao;  -- BOM antigo
DROP TABLE catalogo_kit_familias;     -- junction antigo
DROP TABLE catalogo_kits;
ALTER TABLE catalogo_kits_new RENAME TO catalogo_kits;

-- catalogo_kit_chaves (PIVOT N:M kit <-> chaves)
CREATE TABLE catalogo_kit_chaves (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  kit_sku TEXT NOT NULL,
  chave_id UUID NOT NULL,
  PRIMARY KEY (empresa_id, kit_sku, chave_id)
);

-- catalogo_kit_fresas (PIVOT N:M kit <-> fresas)
CREATE TABLE catalogo_kit_fresas (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  kit_sku TEXT NOT NULL,
  fresa_id TEXT NOT NULL,
  PRIMARY KEY (empresa_id, kit_sku, fresa_id)
);

-- catalogo_kit_complementares (PIVOT N:M kit <-> complementares)
CREATE TABLE catalogo_kit_complementares (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  kit_sku TEXT NOT NULL,
  complementar_id TEXT NOT NULL,
  PRIMARY KEY (empresa_id, kit_sku, complementar_id)
);

-- catalogo_kit_opcionais (PIVOT N:M kit <-> opcionais)
CREATE TABLE catalogo_kit_opcionais (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  kit_sku TEXT NOT NULL,
  opcional_id TEXT NOT NULL,
  PRIMARY KEY (empresa_id, kit_sku, opcional_id)
);
```

#### 1.4 Expandir catalogo_imagens_produto

```sql
-- Expandir CHECK para todos os tipos de produto
ALTER TABLE catalogo_imagens_produto DROP CONSTRAINT IF EXISTS catalogo_imagens_produto_produto_tipo_check;
ALTER TABLE catalogo_imagens_produto ADD CONSTRAINT catalogo_imagens_produto_produto_tipo_check
  CHECK (produto_tipo IN (
    'implante', 'abutment', 'kit', 'parafuso', 'cicatrizador',
    'chave', 'fresa', 'complementar', 'opcional', 'componente'
  ));
```

#### 1.5 RLS Policies (padrão correto para todas as tabelas novas)

```sql
-- Template padrão para todas as tabelas novas:
ALTER TABLE catalogo_ips_conexoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "empresa_select_own" ON catalogo_ips_conexoes
  FOR SELECT USING (empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid()) OR is_super_admin_session());
CREATE POLICY "empresa_insert_own" ON catalogo_ips_conexoes
  FOR INSERT WITH CHECK (empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid()) OR is_super_admin_session());
CREATE POLICY "empresa_update_own" ON catalogo_ips_conexoes
  FOR UPDATE USING (empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid()) OR is_super_admin_session());
CREATE POLICY "empresa_delete_own" ON catalogo_ips_conexoes
  FOR DELETE USING (empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid()) OR is_super_admin_session());

-- Repetir para TODAS as tabelas novas/renomeadas:
-- catalogo_ips_familias, catalogo_ips_linhas,
-- catalogo_cps_tipos_reabilitacao, catalogo_cps_tipos_abutments,
-- catalogo_cps_tipos_componentes, catalogo_cps_tipos_parafusos, catalogo_cps_tipos_cicatrizadores,
-- catalogo_tipos_chaves, catalogo_tipos_fresas, catalogo_tipos_complementares, catalogo_tipos_opcionais,
-- catalogo_tipos_fresagens, catalogo_tipos_kits,
-- catalogo_cps_tipos_workflows, catalogo_cps_etapas_workflows,
-- catalogo_protocolos_fresagens, catalogo_protocolos_fresas_itens,
-- catalogo_componentes, catalogo_parafusos, catalogo_chaves,
-- catalogo_complementares, catalogo_opcionais,
-- catalogo_implante_chaves,
-- catalogo_kit_chaves, catalogo_kit_fresas, catalogo_kit_complementares, catalogo_kit_opcionais,
-- catalogo_cps_tipos_reabilitacao_familias
```

#### 1.6 Triggers de updated_at

```sql
-- Aplicar trigger de updated_at em todas as tabelas novas
CREATE OR REPLACE FUNCTION update_catalogo_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em cada tabela nova que tem updated_at:
-- catalogo_ips_conexoes, catalogo_ips_familias, catalogo_ips_linhas,
-- catalogo_cps_tipos_*, catalogo_tipos_*, catalogo_protocolos_fresagens,
-- catalogo_componentes, catalogo_parafusos, catalogo_chaves, catalogo_fresas,
-- catalogo_complementares, catalogo_opcionais, catalogo_kits
```

#### 1.7 Tabelas a DROPAR (no final da migration)

```sql
-- Somente após verificação de que todos os dados foram migrados:
DROP TABLE IF EXISTS catalogo_conexoes CASCADE;
DROP TABLE IF EXISTS catalogo_familias CASCADE;
DROP TABLE IF EXISTS catalogo_linhas CASCADE;
DROP TABLE IF EXISTS catalogo_tipos_abutment CASCADE;
DROP TABLE IF EXISTS catalogo_workflows CASCADE;
DROP TABLE IF EXISTS catalogo_etapas_workflow CASCADE;
DROP TABLE IF EXISTS catalogo_protocolo_fresagem CASCADE;
DROP TABLE IF EXISTS catalogo_tipos_reabilitacao CASCADE;
DROP TABLE IF EXISTS catalogo_chaves_ferramental CASCADE;
DROP TABLE IF EXISTS catalogo_categorias_kit CASCADE;
DROP TABLE IF EXISTS catalogo_kits_old CASCADE;
DROP TABLE IF EXISTS catalogo_kit_familias CASCADE;
DROP TABLE IF EXISTS catalogo_kit_composicao CASCADE;
DROP TABLE IF EXISTS catalogo_parafusos_retensao CASCADE;
DROP TABLE IF EXISTS catalogo_sequencia_protetica CASCADE;
DROP TABLE IF EXISTS catalogo_categorias_acessorio CASCADE;
DROP TABLE IF EXISTS catalogo_categorias_instrumental CASCADE;
DROP TABLE IF EXISTS catalogo_acessorios CASCADE;
DROP TABLE IF EXISTS catalogo_instrumentais_gerais CASCADE;
DROP TABLE IF EXISTS catalogo_acessorio_ferramental CASCADE;
DROP TABLE IF EXISTS catalogo_imagens_implante CASCADE;
DROP TABLE IF EXISTS catalogo_guias_reabilitacao CASCADE;
```

---

## FASE 2: Tipos TypeScript

### Arquivo: `src/features/catalogo/types/index.ts` — REESCREVER

Novas interfaces para todas as entidades:

| Entidade | Tipo | PK |
|----------|------|-----|
| CatalogoCategoria | id: uuid | id |
| CatalogoIpsConexao | id: uuid | id |
| CatalogoIpsFamilia | id: uuid | id |
| CatalogoIpsLinha | id: uuid | id |
| CatalogoCpsTipoReabilitacao | id: uuid | id |
| CatalogoCpsTipoAbutment | id: uuid | id |
| CatalogoCpsTipoComponente | id: uuid | id |
| CatalogoCpsTipoParafuso | id: uuid | id |
| CatalogoCpsTipoCicatrizador | id: uuid | id |
| CatalogoTipoChave | id: uuid | id |
| CatalogoTipoFresa | id: uuid | id |
| CatalogoTipoComplementar | id: uuid | id |
| CatalogoTipoOpcional | id: uuid | id |
| CatalogoTipoFresagem | id: uuid | id |
| CatalogoTipoKit | id: uuid | id |
| CatalogoCpsTipoWorkflow | id: uuid | id |
| CatalogoCpsEtapaWorkflow | id: uuid | id |
| CatalogoProtocoloFresagem | id: uuid | id |
| CatalogoImplante | sku: text | sku+empresa_id |
| CatalogoAbutment | sku: text | sku+empresa_id |
| CatalogoComponente | sku: text | sku+empresa_id |
| CatalogoParafuso | sku: text | sku+empresa_id |
| CatalogoCicatrizador | sku: text | sku+empresa_id |
| CatalogoChave | sku: text | sku+empresa_id |
| CatalogoFresa | sku: text | sku+empresa_id |
| CatalogoComplementar | sku: text | sku+empresa_id |
| CatalogoOpcional | sku: text | sku+empresa_id |
| CatalogoKit | sku: text | sku+empresa_id |

### Arquivo: `src/features/catalogo/types/cadastros.ts` — ATUALIZAR

Adicionar tipos para N:M: `KitComposicaoChave`, `KitComposicaoFresa`, `KitComposicaoComplementar`, `KitComposicaoOpcional`, `ImplanteChave`, `ProtocoloFresaItem`

---

## FASE 3: Services CRUD

### Arquivos a reescrever/modificar:

| Service | Mudança Principal |
|---------|-------------------|
| `services/hierarquia.service.ts` | Usar `catalogo_ips_*` tables, importar tipos novos |
| `services/implantes.service.ts` | Novos campos, hierarchy FKs, N:M chaves, protocolo FKs |
| `services/componentes.service.ts` | Novas tabelas `catalogo_cps_*`, abutments reescritos, novo `catalogo_componentes` |
| `services/kits.service.ts` | `catalogo_kits` reescrito, novas pivot tables, `tipo_kit_id` |
| `services/workflows.service.ts` | `catalogo_cps_tipos_workflows`, `catalogo_cps_etapas_workflows` |
| `services/fresagens.service.ts` | **NOVO** — CRUD `catalogo_tipos_fresagens`, `catalogo_protocolos_fresagens`, pivot `catalogo_protocolos_fresas_itens` |
| `services/cicatrizadores.service.ts` | Reescrito com novos campos |
| `services/parafusos-retensao.service.ts` | Renomear para `parafusos.service.ts`, usar `catalogo_parafusos` |
| `services/chaves.service.ts` | **NOVO** — CRUD `catalogo_chaves` + `catalogo_tipos_chaves` |
| `services/fresas.service.ts` | **NOVO** — CRUD `catalogo_fresas` + `catalogo_tipos_fresas` |
| `services/complementares.service.ts` | **NOVO** — CRUD `catalogo_complementares` + `catalogo_tipos_complementares` |
| `services/opcionais.service.ts` | **NOVO** — CRUD `catalogo_opcionais` + `catalogo_tipos_opcionais` |
| `services/imagens.service.ts` | Atualizar `produto_tipo` CHECK para novos tipos |

### Padrão CRUD para cada service:

```ts
// Listar (filtra por empresa_id)
async function listar(empresaId: string): Promise<Type[]>

// Criar (insere empresa_id)
async function criar(empresaId: string, input: CreateInput): Promise<Type>

// Atualizar
async function atualizar(id_or_sku: string, input: Partial<UpdateInput>): Promise<Type>

// Toggle ativo
async function toggleAtivo(id_or_sku: string, ativo: boolean): Promise<void>

// Deletar
async function remover(id_or_sku: string): Promise<void>
```

### Padrão N:M (ex: chaves do kit):
```ts
async function salvarKitChaves(empresaId: string, kitSku: string, chaveIds: UUID[]): Promise<void> {
  await supabase.from('catalogo_kit_chaves').delete().eq('empresa_id', empresaId).eq('kit_sku', kitSku)
  if (chaveIds.length === 0) return
  const rows = chaveIds.map(id => ({ empresa_id: empresaId, kit_sku: kitSku, chave_id: id }))
  await supabase.from('catalogo_kit_chaves').insert(rows)
}
```

### Padrão Protocolo Fresagem com ordenação:
```ts
async function salvarProtocoloFresas(empresaId: string, protocoloId: string, items: {fresa_id: string, ordem: number}[]): Promise<void> {
  await supabase.from('catalogo_protocolos_fresas_itens').delete().eq('empresa_id', empresaId).eq('protocolo_id', protocoloId)
  if (items.length === 0) return
  const rows = items.map(item => ({ empresa_id: empresaId, protocolo_id: protocoloId, ...item }))
  await supabase.from('catalogo_protocolos_fresas_itens').insert(rows)
}
```

---

## FASE 4: Schemas Zod

### Criar/atualizar schemas de validação para cada entidade:

**Regras:**
- `sku`: `z.string().min(1, "SKU é obrigatório")` (PK manual)
- `nome`: `z.string().min(1, "Nome é obrigatório")`
- `sigla`: `z.string().optional()`
- `ativo`: `z.boolean().default(true)`
- `locked`: `z.boolean().default(false)` (apenas visible para Super Admin)
- `preco`: `z.coerce.number().min(0).optional()`
- FKs obrigatórios: `z.string().min(1, "Campo é obrigatório")`
- FKs opcionais: `z.string().optional()`
- Specs decimais: `z.coerce.number().optional()`
- Specs texto: `z.string().optional()`

### Cascata selects schemas (implante):
```ts
const implanteSchema = z.object({
  // Hierarquia (categoria_id é DEFAULT, não validado no modal)
  conexao_id: z.string().min(1, "Conexão é obrigatória"),
  familia_id: z.string().min(1, "Família é obrigatória"),
  linha_id: z.string().min(1, "Linha é obrigatória"),
  // Identificação
  sku: z.string().min(1, "SKU é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  sigla: z.string().optional(),
  descricao: z.string().optional(),
  // Protocolos
  osso_soft: z.string().optional(),
  osso_hard: z.string().optional(),
  // Specs
  diametro_plataforma_mm: z.coerce.number().optional(),
  comprimento_mm: z.coerce.number().optional(),
  rosca_interna: z.string().optional(),
  macrogeometria: z.string().optional(),
  torque_ncm: z.coerce.number().optional(),
  material: z.string().optional(),
  superficie: z.string().optional(),
  // Comercial
  preco: z.coerce.number().min(0).optional(),
})
```

### Arquivos para criar/modificar:
- `src/features/catalogo/schemas/` — **NOVO DIRETÓRIO** para todos os schemas
- Um arquivo por entidade: `categorias.ts`, `implantes.ts`, `abutments.ts`, `componentes.ts`, `parafusos.ts`, `cicatrizadores.ts`, `chaves.ts`, `fresas.ts`, `complementares.ts`, `opcionais.ts`, `kits.ts`, `workflows.ts`, `fresagens.ts`, `estrutura.ts`

---

## FASE 5: UI - Modais de Estrutura (Simples)

### Arquivo: `src/features/catalogo/components/admin/CadastroFormDialog.tsx` — ATUALIZAR

O dialog genérico já existe. Precisa:
- Adicionar suporte a campo `sigla` (text)
- Adicionar suporte a `locked` (switch, condicional para Super Admin)

### Páginas de admin que usam CadastroFormDialog:
Cada sub-aba de estrutura usa `CadastroFormDialog` com `FieldConfig[]`. Atualizar os field configs:

| Rota | Sub-aba | Tables | Novos Fields |
|------|---------|--------|-------------|
| `/catalogo/admin/cadastros` | Categorias | `catalogo_categorias` | +`sigla` |
| `/catalogo/admin/implantes` | Conexões | `catalogo_ips_conexoes` | +`sigla`, `locked` |
| `/catalogo/admin/implantes` | Famílias | `catalogo_ips_familias` | +`locked` |
| `/catalogo/admin/implantes` | Linhas | `catalogo_ips_linhas` | (sem mudança) |
| `/catalogo/admin/componentes` | Tipos Reabilitação | `catalogo_cps_tipos_reabilitacao` | +`sigla`, multi-familias |
| `/catalogo/admin/componentes` | Tipos Abutments | `catalogo_cps_tipos_abutments` | +`sigla`, select tipo_reabilitacao |
| `/catalogo/admin/componentes` | Tipos Componentes | `catalogo_cps_tipos_componentes` | **NOVO** |
| `/catalogo/admin/componentes` | Tipos Parafusos | `catalogo_cps_tipos_parafusos` | **NOVO** |
| `/catalogo/admin/componentes` | Tipos Cicatrizadores | `catalogo_cps_tipos_cicatrizadores` | **NOVO** |
| `/catalogo/admin/instrumentais` | Tipos Chaves | `catalogo_tipos_chaves` | **NOVO** |
| `/catalogo/admin/instrumentais` | Tipos Fresas | `catalogo_tipos_fresas` | **NOVO** |
| `/catalogo/admin/instrumentais` | Tipos Complementares | `catalogo_tipos_complementares` | **NOVO** |
| `/catalogo/admin/instrumentais` | Tipos Opcionais | `catalogo_tipos_opcionais` | **NOVO** |
| `/catalogo/admin/kits` | Tipos Kits | `catalogo_tipos_kits` | **NOVO** (renomeado) |
| `/catalogo/admin/workflows` | Tipos Workflows | `catalogo_cps_tipos_workflows` | **NOVO** (renomeado) |
| `/catalogo/admin/workflows` | Etapas | `catalogo_cps_etapas_workflows` | **NOVO** (renomeado) + `tipo_workflow_id` select |
| `/catalogo/admin/fresagens` | Tipos Fresagens | `catalogo_tipos_fresagens` | **NOVO** |
| `/catalogo/admin/fresagens` | Protocolos | `catalogo_protocolos_fresagens` | **NOVO** (complexo) |

---

## FASE 6: UI - Modais de Produtos (Complexos)

### Arquivo: `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx` — REESCREVER

Reestruturar para suportar novos tipos de produto. Tab selector atualizado:
`implante | abutment | componente | parafuso | cicatrizador | chave | fresa | complementar | opcional | kit`

### Arquivos de Forms a criar/modificar:

| Form | Mudança |
|------|---------|
| `forms/ImplanteForm.tsx` | **REESCREVER** — cascata 4 níveis, multi-select chaves, selects protocolo fresagem, specs expandidas |
| `forms/AbutmentForm.tsx` | **REESCREVER** — novos FKs (tipo_abutment_id, parafuso_id, chave_id), specs expandidas |
| `forms/ComponenteForm.tsx` | **NOVO** — tipo_componente_id, tipo_abutment_id, parafuso_id, chave_id |
| `forms/ParafusoForm.tsx` | **REESCREVER** (era ParafusoRetencaoForm) — tipo_parafuso_id, chave_id |
| `forms/CicatrizadorForm.tsx` | **REESCREVER** — implante_id, chave_id, specs dinâmicas |
| `forms/ChaveForm.tsx` | **NOVO** — tipo_chave_id, specs |
| `forms/FresaForm.tsx` | **NOVO** — tipo_fresa_id, specs |
| `forms/ComplementarForm.tsx` | **NOVO** — tipo_complementar_id, specs |
| `forms/OpcionalForm.tsx` | **NOVO** — tipo_opcional_id, specs |
| `forms/KitForm.tsx` | **REESCREVER** — tipo_kit_id, seções de composição N:M (chaves, fresas, complementares, opcionais) |

### Comportamentos especiais:

#### Cascata 4 níveis (ImplanteForm):
```
Categoria (DEFAULT Implantes, oculto)
  → Conexão (select, filtrado por categoria)
    → Família (select, filtrado por conexão)
      → Linha (select, filtrado por família)
```
- Selects abaixo do pai ficam desabilitados enquanto pai não tem valor
- Mudança de pai reseta valores dos filhos

#### Seções de composição Kit (KitForm):
```
Seção "Chaves": [Select chave] + [Botão Adicionar] → lista visual com [Remover]
Seção "Fresas": [Select fresa] + [Botão Adicionar] → lista visual com [Remover]
Seção "Complementares": [Select complementar] + [Botão Adicionar] → lista visual com [Remover]
Seção "Opcionais": [Select opcional] + [Botão Adicionar] → lista visual com [Remover]
```

#### Sequência de Fresas no Protocolo:
```
[Select fresa] + [Botão Adicionar] → lista visual ordenada
Lista com botões [↑ Subir] [↓ Descer] [✕ Remover]
Ordem recalculada automaticamente ao reordenar
```

---

## FASE 7: Rotas e Navegação

### Arquivos de rota a atualizar:

| Arquivo | Mudança |
|---------|---------|
| `src/routes/catalogo.admin.cadastros.tsx` | Atualizar sub-aba Categorias com `sigla` |
| `src/routes/catalogo.admin.implantes.tsx` | Novas sub-abas: Conexões, Famílias, Linhas + Produtos |
| `src/routes/catalogo.admin.componentes.tsx` | Novas sub-abas: Tipos Reabilitação, Tipos Abutments, Tipos Componentes, Tipos Parafusos, Tipos Cicatrizadores + Produtos |
| `src/routes/catalogo.admin.produtos.tsx` | Atualizar tipos de produto suportados |
| `src/routes/catalogo.admin.instrumentais.tsx` | **NOVO** — Tipos Chaves/Fresas/Complementares/Opcionais + Produtos |
| `src/routes/catalogo.admin.kits.tsx` | **NOVO** — Tipos Kits + Produtos |
| `src/routes/catalogo.admin.workflows.tsx` | **NOVO** — Tipos Workflows + Etapas |
| `src/routes/catalogo.admin.fresagens.tsx` | **NOVO** — Tipos Fresagens + Protocolos |

### Nav items no module.ts:
Adicionar/atualizar nav items:
- `instrumentais` (Estrutura + Produtos)
- `kits` (Estrutura + Produtos)
- `workflows` (Estrutura + Etapas)
- `fresagens` (Estrutura + Protocolos)

---

## FASE 8: Barrel Exports

### `src/features/catalogo/index.ts` — ATUALIZAR
Exportar novos services, types e components.

---

## Ordem de Execução Recomendada

1. **Migration SQL** — Criar e aplicar (FASE 1)
2. **Types TypeScript** — Definir todas as interfaces (FASE 2)
3. **Services CRUD** — Reescrever todos os services (FASE 3)
4. **Schemas Zod** — Criar schemas de validação (FASE 4)
5. **Forms simples** — Modais de estrutura via CadastroFormDialog (FASE 5)
6. **Forms complexos** — Modais de produtos com cascata/N:M (FASE 6)
7. **Rotas** — Atualizar navegação e sub-abas (FASE 7)
8. **Barrel exports** — Atualizar exports (FASE 8)
9. **Build test** — `npm run build` para validar
10. **Seed dados** — Atualizar seed com novas tabelas

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Perda de dados na migração | Backup antes da migration; INSERT INTO ... SELECT FROM garante cópia |
| FKs quebradas entre tabelas antigas e novas | Ordem correta de criação: criar tabelas novas primeiro, migrar dados, depois dropar antigas |
| Services existentes quebram | Atualizar imports em cadeia; rodar `npm run build` após cada grupo de changes |
| Modais que referenciam tabelas antigas | Busca por string nas tabelas Supabase — atualizar todos os `.from('nome_tabela')` |
| N:M sem pivot tables | Criar todas as pivot tables antes de usar nos modais |
| RLS inconsistente | Usar o padrão correto (`profiles.empresa_id`) em todas as tabelas novas |
| `catalogo_parafusos_retensao` FK errada para `auth.users` | Corrigida na nova tabela `catalogo_parafusos` com FK para `empresas(id)` |

---

## Verificação

Após implementação:
1. `npm run build` — deve passar sem erros
2. Verificar que todas as tabelas foram criadas via MCP (`supabase_list_tables`)
3. Verificar que migrations de dados funcionaram (contar registros)
4. Testar cada modal: criar, editar, listar, deletar
5. Testar cascata de selects no ImplanteForm
6. Testar composição de Kit (adicionar/remover itens N:M)
7. Testar ordenação de fresas no Protocolo de Fresagem
8. Verificar que `empresa_id` não aparece nos modais (apenas para Super Admin)
9. Testar RLS: usuário só vê dados da sua empresa
