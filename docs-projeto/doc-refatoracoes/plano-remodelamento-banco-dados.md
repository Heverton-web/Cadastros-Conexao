# Plano de Remodelamento do Banco de Dados - ERP Conexao

## Visao Geral

Remodelacao completa do schema do banco de dados para arquitetura multi-empresa com 4 tabelas core (USUARIOS, EMPRESAS, COLABORADORES, CLIENTES) e modulos auto-contidos que compartilham esses dados centrais.

**Decisoes confirmadas:**
- 1 colaborador = 1 empresa
- Clientes sao GLOBAIS (mesmo cliente pode existir em varias empresas)
- Separar cadastros em: clientes (entidade) + solicitacoes (workflow)
- Escala: pequena/media (ate 100 empresas, <10k clientes) - sem particionamento

---

## FASE 1: Tabelas Core (fundacao)

### 1.1 Tabela `usuarios` (substitui profiles como entidade auth)

```sql
CREATE TABLE usuarios (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL,
  avatar_url  TEXT,
  telefone    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

**Motivo:** Separa dados de autenticacao da relacao com empresa. Um usuario e unico no sistema.

### 1.2 Tabela `empresas` (mantida, simplificada)

```sql
-- Mantida como esta, com adicao de dados_extras se necessario
-- Remove empresas_config para dentro de empresas como JSONB
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{
  "logo_url": null,
  "theme": {}
}'::jsonb;
```

### 1.3 Tabela `colaboradores` (NOVA - substitui empresa_id do profiles)

```sql
CREATE TABLE colaboradores (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  empresa_id    UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','editor','viewer')),
  departamento  TEXT,
  ambiente      TEXT NOT NULL DEFAULT 'ambos' CHECK (ambiente IN ('cadastro','consultor','tecnologia','ambos','suporte')),
  cargo         TEXT,
  is_super_admin BOOLEAN DEFAULT false,
  ativo         BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(usuario_id)  -- 1 usuario = 1 empresa
);
```

**Index para performance:**
```sql
CREATE INDEX idx_colaboradores_usuario ON colaboradores(usuario_id);
CREATE INDEX idx_colaboradores_empresa ON colaboradores(empresa_id);
CREATE INDEX idx_colaboradores_empresa_role ON colaboradores(empresa_id, role);
```

### 1.4 Tabela `clientes` (NOVA - entidade global)

```sql
CREATE TABLE clientes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_pessoa       TEXT CHECK (tipo_pessoa IN ('PF','PJ')),
  -- Dados PF
  nome_completo     TEXT,
  cpf               TEXT,
  data_nascimento   DATE,
  cro               TEXT,
  cro_uf            TEXT,
  email_comunicacao TEXT,
  email_nf          TEXT,
  tel_fixo          TEXT,
  celular1          TEXT,
  celular2          TEXT,
  data_emissao_cro  DATE,
  estado            TEXT,
  -- Dados PJ
  razao_social      TEXT,
  nome_fantasia     TEXT,
  cnpj              TEXT,
  inscricao_estadual TEXT,
  -- Endereco
  cep               TEXT,
  rua               TEXT,
  numero            TEXT,
  bairro            TEXT,
  complemento       TEXT,
  cidade            TEXT,
  estado_endereco   TEXT,
  -- Meta
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

**Index:**
```sql
CREATE INDEX idx_clientes_cpf ON clientes(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX idx_clientes_cnpj ON clientes(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX idx_clientes_nome ON clientes USING gin(nome_completo gin_trgm_ops);
```

### 1.5 Tabela `empresa_cliente` (NOVA - associacao many-to-many)

```sql
CREATE TABLE empresa_cliente (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id  UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  created_by  UUID REFERENCES usuarios(id),
  status      TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo','pendente')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, cliente_id)
);
```

**Index:**
```sql
CREATE INDEX idx_empresa_cliente_empresa ON empresa_cliente(empresa_id);
CREATE INDEX idx_empresa_cliente_cliente ON empresa_cliente(cliente_id);
```

---

## FASE 2: Funcoes Helper (RLS padronizado)

Substituir todas as funcoes existentes para referenciar `colaboradores` ao inves de `profiles`:

```sql
-- Pegar empresa_id do usuario logado
CREATE OR REPLACE FUNCTION get_current_empresa_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT empresa_id FROM colaboradores WHERE usuario_id = auth.uid()
$$;

-- Verificar se e super admin
CREATE OR REPLACE FUNCTION is_super_admin_session()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM colaboradores
    WHERE usuario_id = auth.uid() AND is_super_admin = true
  )
$$;

-- Verificar se e admin ou super admin
CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM colaboradores
    WHERE usuario_id = auth.uid()
    AND (role = 'admin' OR is_super_admin = true)
  )
$$;

-- Verificar acesso a empresa especifica
CREATE OR REPLACE FUNCTION pode_acessar_empresa(p_empresa_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT
    is_super_admin_session()
    OR EXISTS (
      SELECT 1 FROM colaboradores
      WHERE usuario_id = auth.uid() AND empresa_id = p_empresa_id
    )
$$;
```

---

## FASE 3: Migrar dados existentes

### 3.1 Migrar profiles -> usuarios + colaboradores

```sql
-- Copiar dados basicos para usuarios
INSERT INTO usuarios (id, nome, email, avatar_url, created_at)
SELECT id, nome, email, avatar_url, created_at
FROM profiles
ON CONFLICT (id) DO NOTHING;

-- Criar registros em colaboradores
INSERT INTO colaboradores (usuario_id, empresa_id, role, departamento, ambiente, is_super_admin, ativo)
SELECT
  id,
  empresa_id,
  role,
  departamento,
  ambiente,
  COALESCE(is_super_admin, false),
  COALESCE(ativo, true)
FROM profiles
WHERE empresa_id IS NOT NULL
ON CONFLICT (usuario_id) DO NOTHING;

-- Migrar permissoes para colaboradores (colunas role/ambiente ja la)
-- permissoes continua existindo para dados granulares JSONB
```

### 3.2 Migrar cadastros -> clientes + empresa_cliente + solicitacoes

```sql
-- 1. Criar clientes unicos (deduplicar por CPF/CNPJ)
WITH clientes_dedup AS (
  SELECT DISTINCT ON (COALESCE(pf.cnpj, pf.cpf))
    c.id as cadastro_id,
    COALESCE(pf.nome, pj.nome_fantasia, pj.razao_social) as nome_completo,
    c.tipo_pessoa,
    pf.cpf,
    pf.data_nascimento,
    pf.cro,
    pf.cro_uf,
    pf.email_comunicacao,
    pf.email_nf,
    pf.tel_fixo,
    pf.celular1,
    pf.celular2,
    pf.data_emissao_cro,
    pf.estado,
    pj.razao_social,
    pj.nome_fantasia,
    pj.cnpj,
    pj.inscricao_estadual,
    e.cep, e.rua, e.numero, e.bairro, e.complemento, e.cidade, e.estado as estado_endereco
  FROM cadastros c
  LEFT JOIN cadastros_pf pf ON pf.cadastro_id = c.id
  LEFT JOIN cadastros_pj pj ON pj.cadastro_id = c.id
  LEFT JOIN cadastros_enderecos e ON e.cadastro_id = c.id
  ORDER BY COALESCE(pf.cnpj, pf.cpf), c.created_at
)
INSERT INTO clientes (nome_completo, tipo_pessoa, cpf, data_nascimento, cro, cro_uf,
  email_comunicacao, email_nf, tel_fixo, celular1, celular2, data_emissao_cro, estado,
  razao_social, nome_fantasia, cnpj, inscricao_estadual,
  cep, rua, numero, bairro, complemento, cidade, estado_endereco)
SELECT
  nome_completo, tipo_pessoa, cpf, data_nascimento, cro, cro_uf,
  email_comunicacao, email_nf, tel_fixo, celular1, celular2, data_emissao_cro, estado,
  razao_social, nome_fantasia, cnpj, inscricao_estadual,
  cep, rua, numero, bairro, complemento, cidade, estado_endereco
FROM clientes_dedup;

-- 2. Criar associacoes empresa_cliente
INSERT INTO empresa_cliente (empresa_id, cliente_id, created_by, status, created_at)
SELECT DISTINCT
  c.empresa_id,
  cl.id,
  c.created_by,
  CASE WHEN c.status = 'aprovado' THEN 'ativo' ELSE 'pendente' END,
  c.created_at
FROM cadastros c
JOIN clientes cl ON cl.cnpj IS NOT DISTINCT FROM (
  SELECT pj.cnpj FROM cadastros_pj pj WHERE pj.cadastro_id = c.id
)
OR cl.cpf IS NOT DISTINCT FROM (
  SELECT pf.cpf FROM cadastros_pf pf WHERE pf.cadastro_id = c.id
);

-- 3. Renomear cadastros para solicitacoes (mantem workflow)
-- Adicionar coluna cliente_id
ALTER TABLE cadastros ADD COLUMN cliente_id UUID REFERENCES clientes(id);
-- Preencher cliente_id baseado no match
```

---

## FASE 4: Atualizar tabelas de modulos

### 4.1 Padronizar todas as tabelas de modulo

Para CADA tabela de modulo que tem `empresa_id`:

**Padrao de RLS (aplicar em todas):**
```sql
-- SELECT: so ve da propria empresa
CREATE POLICY "{tabela}_select_empresa" ON {tabela}
  FOR SELECT TO authenticated
  USING (is_super_admin_session() OR empresa_id = get_current_empresa_id());

-- INSERT: so insere na propria empresa
CREATE POLICY "{tabela}_insert_empresa" ON {tabela}
  FOR INSERT TO authenticated
  WITH CHECK (is_super_admin_session() OR empresa_id = get_current_empresa_id());

-- UPDATE: so atualiza da propria empresa
CREATE POLICY "{tabela}_update_empresa" ON {tabela}
  FOR UPDATE TO authenticated
  USING (is_super_admin_session() OR empresa_id = get_current_empresa_id());

-- DELETE: so admin pode deletar
CREATE POLICY "{tabela}_delete_empresa" ON {tabela}
  FOR DELETE TO authenticated
  USING (is_super_admin_session() OR is_admin_or_super());
```

**Index padrao para performance:**
```sql
CREATE INDEX IF NOT EXISTS idx_{tabela}_empresa ON {tabela}(empresa_id);
-- Para tabelas com queries frequentes:
CREATE INDEX IF NOT EXISTS idx_{tabela}_empresa_created ON {tabela}(empresa_id, created_at DESC);
```

### 4.2 Tabelas que precisam de ajuste especifico

**NPS (nps_respostas):**
- Referenciar `empresa_cliente` ao inves de campos soltos
- Adicionar `cliente_empresa_id` para query rapida

**CRM (tarefas, pipeline_estagios):**
- Referenciar `empresa_cliente` para vincular tarefa ao cliente
- Manter `responsavel_id` referenciando `usuarios`

**Rotas:**
- `rotas_clientes_base` pode referenciar `empresa_cliente`
- Manter `usuario_id` referenciando `usuarios`

**Hub:**
- `hub_user_roles` referenciar `usuarios` ao inves de `auth.users` diretamente
- Manter `empresa_id` em todas as tabelas

**Despesas:**
- `usuario_id` referencia `usuarios`
- `empresa_id` mantido

**Marketing:**
- `mktg_leads` pode ser separado de `clientes` (leads sao potenciais, clientes sao confirmados)
- Manter `empresa_id`

**LinkTree:**
- `linktree_colaboradores` pode referenciar `usuarios`
- Manter `empresa_id`

**Gerador Links:**
- Manter `empresa_id`
- Sem referencia direta a clientes

---

## FASE 5: Otimizacoes de Performance

### 5.1 View materializada para dashboard

```sql
-- View para dashboard rapid (refresh periodico)
CREATE MATERIALIZED VIEW mv_dashboard_empresa AS
SELECT
  ec.empresa_id,
  COUNT(DISTINCT ec.cliente_id) as total_clientes,
  COUNT(DISTINCT c.id) as total_colaboradores,
  COUNT(DISTINCT CASE WHEN c2.status = 'ativo' THEN c2.id END) as cadastros_ativos
FROM empresa_cliente ec
LEFT JOIN colaboradores c ON c.empresa_id = ec.empresa_id
LEFT JOIN cadastros c2 ON c2.empresa_id = ec.empresa_id
GROUP BY ec.empresa_id;

CREATE UNIQUE INDEX idx_mv_dashboard_empresa ON mv_dashboard_empresa(empresa_id);

-- Refresh: executar periodicamente
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_empresa;
```

### 5.2 Indices compostos criticos

```sql
-- Para queries de "meus cadastros"
CREATE INDEX idx_cadastros_empresa_status ON cadastros(empresa_id, status);
CREATE INDEX idx_cadastros_empresa_created ON cadastros(empresa_id, created_at DESC);

-- Para queries de NPS
CREATE INDEX idx_nps_respostas_empresa_data ON nps_respostas(empresa_id, created_at DESC);

-- Para queries de CRM
CREATE INDEX idx_tarefas_empresa_status ON tarefas(empresa_id, status);
CREATE INDEX idx_tarefas_empresa_vencimento ON tarefas(empresa_id, data_vencimento);

-- Para queries de rotas
CREATE INDEX idx_rotas_empresa_data ON rotas(empresa_id, data_rota DESC);

-- Para queries de marketing
CREATE INDEX idx_mktg_eventos_empresa_tipo ON mktg_eventos(empresa_id, tipo);
```

### 5.3 Otimizacao de RLS

Todas as funcoes helper devem ser `STABLE` e chamadas minimalmente. Evitar subqueries complexas em policies.

---

## FASE 6: Script de Migracao Completo

### Ordem de execucao:

1. **Backup completo** do banco atual
2. **Criar tabelas core** (usuarios, colaboradores, clientes, empresa_cliente)
3. **Migrar dados** (profiles -> usuarios + colaboradores, cadastros -> clientes)
4. **Atualizar funcoes helper** (get_current_empresa_id, is_super_admin, etc.)
5. **Recriar RLS policies** em todas as tabelas
6. **Adicionar indices** novos
7. **Remover tabelas antigas** (profiles, cadastros_pf, cadastros_pj, cadastros_enderecos)
8. **Dropar view clientes antiga**
9. **Refresh materialized views**

### Arquivos de migration a criar:

```
supabase/migrations/
  YYYYMMDD_01_core_tables.sql         -- usuarios, colaboradores, clientes, empresa_cliente
  YYYYMMDD_02_migrate_data.sql        -- Migracao de dados
  YYYYMMDD_03_helper_functions.sql    -- Funcoes RLS
  YYYYMMDD_04_rls_policies.sql        -- Todas as policies recriadas
  YYYYMMDD_05_indexes.sql             -- Indices de performance
  YYYYMMDD_06_cleanup.sql             -- Remover tabelas antigas
  YYYYMMDD_07_materialized_views.sql  -- Views materializadas
```

---

## Arquivos Criticos a Modificar

### Backend/Database:
- `supabase/migrations/` (novas migrations)
- `src/lib/supabase.ts` (se houver helper de empresa_id)

### Frontend (referencias a profiles):
- `src/features/admin/` - Gerenciamento de usuarios/colaboradores
- `src/features/cadastros/` -> renomear para `solicitacoes/`
- `src/features/clientes/` - Nova entidade
- `src/features/nps/` - Referencia a clientes
- `src/features/crm/` - Referencia a clientes
- `src/features/hub/` - Referencia a usuarios
- `src/features/rotas/` - Referencia a usuarios
- `src/features/despesas/` - Referencia a usuarios
- `src/features/marketing/` - Referencia a clientes
- `src/features/linktree/` - Referencia a colaboradores
- `src/features/empresas/` - Config

### Auth/Context:
- `src/contexts/AuthContext.tsx` (ou similar) - Buscar dados do colaborador
- `src/hooks/useAuth.ts` - Pegar empresa_id do colaborador

---

## Verificacao

### Testes manuais pos-migracao:
1. Login como super admin - deve ver todas as empresas
2. Login como admin de empresa - deve ver apenas dados da empresa
3. Criar novo cadastro - deve vincular a empresa correta
4. Acessar modulo NPS - deve filtrar por empresa
5. Acessar modulo CRM - deve filtrar por empresa
6. Acessar modulo Rotas - deve filtrar por empresa
7. Gerenciar colaboradores - deve funcionar CRUD
8. Dashboard - deve mostrar metricas corretas

### Queries de verificacao:
```sql
-- Verificar que todos os colaboradores foram migrados
SELECT COUNT(*) FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM colaboradores c WHERE c.usuario_id = p.id);

-- Verificar que todas as empresas tem ao menos 1 colaborador
SELECT e.id, e.nome, COUNT(c.id) as total_colaboradores
FROM empresas e
LEFT JOIN colaboradores c ON c.empresa_id = e.id
GROUP BY e.id, e.nome
HAVING COUNT(c.id) = 0;

-- Verificar RLS funcionando
SET role TO authenticated;
SET request.jwt.claims TO '{"sub": "test-user-id"}';
SELECT * FROM clientes; -- Deve retornar vazio ou erro
```

---

## Diagrama ER (Resumo)

```
auth.users
    |
    v
usuarios (id, nome, email, avatar, telefone)
    |
    | 1:1
    v
colaboradores (usuario_id, empresa_id, role, ambiente, is_super_admin)
    |
    | N:1
    v
empresas (id, nome, slug, cnpj, config)
    |
    | 1:N
    v
empresa_cliente (empresa_id, cliente_id, status)
    |
    | N:1
    v
clientes (id, nome, cpf/cnpj, endereco, telefone)

--- Modulos (auto-contidos) ---

nps_respostas (empresa_id, cliente_id, nps_score, ...)
tarefas (empresa_id, cliente_id, responsavel_id, ...)
rotas (empresa_id, usuario_id, ...)
hub_materials (empresa_id, created_by, ...)
despesas (empresa_id, usuario_id, ...)
mktg_campanhas_email (empresa_id, ...)
linktree_colaboradores (empresa_id, usuario_id, ...)
gerador_links (empresa_id, ...)
```

---

*Documento gerado em 2026-07-02*
*Autor: MiMoCode - ERP Conexao*
