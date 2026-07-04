# Análise de Banco de Dados — Multi-tenant + Core

> **Documento gerado em:** 04/07/2026 | **Princípios:** Multi-tenant, Tabelas Core, Isolamento

---

## 1. Resumo Executivo

O banco de dados do ERP Conexão foi projetado seguindo o padrão **Discrimination-Based Multi-Tenancy** (multi-tenant por coluna `empresa_id`). A arquitetura é sólida, com RLS policies robustas e funções auxiliares bem definidas. Pontuação: **~85/100**.

---

## 2. Estrutura Multi-tenant

### 2.1 Tabelas Core

#### `empresas` — Entidade Central

```sql
CREATE TABLE public.empresas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  cnpj        TEXT,
  ativo       BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

#### `empresas_config` — Configuração por Empresa

```sql
CREATE TABLE public.empresas_config (
  empresa_id  UUID PRIMARY KEY REFERENCES empresas(id) ON DELETE CASCADE,
  logo_url    TEXT,
  theme       JSONB DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

#### `modulos_empresa` — Módulos Ativos

```sql
CREATE TABLE public.modulos_empresa (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  modulo_key  TEXT NOT NULL,
  ativo       BOOLEAN DEFAULT true,
  config      JSONB DEFAULT '{}'::jsonb,
  UNIQUE(empresa_id, modulo_key)
);
```

### 2.2 Cadeia de Referência

```
empresas.id
  ├── empresas_config.empresa_id
  ├── modulos_empresa.empresa_id
  ├── profiles.empresa_id
  ├── cadastros.empresa_id (e +14 tabelas)
  └── ALL MODULE TABLES.empresa_id
```

> **45+ tabelas** referenciam `empresas.id` via FK.

---

## 3. Funções Multi-tenant

### 3.1 Helper Functions Core

```sql
-- Retorna empresa_id do usuário logado
get_current_empresa_id() → UUID

-- Verifica se é super admin (bypassa multi-tenant)
is_super_admin_session() → BOOLEAN

-- Verifica se é admin da empresa OU super
is_admin_or_super() → BOOLEAN

-- Verifica se usuário pode acessar uma empresa específica
pode_acessar_empresa(p_empresa_id UUID) → BOOLEAN
```

### 3.2 Fluxo de Acesso

```
Usuário loga
  → AuthProvider busca profile.empresa_id
  → RLS filtra todas as queries por empresa_id
  → Admin vê apenas dados da sua empresa
  → Super Admin vê dados de TODAS as empresas (is_super_admin_session bypass)
```

---

## 4. RLS Policies — Padrão Multi-tenant

### 4.1 Padrão Genérico

```sql
CREATE POLICY "select_<tabela>_empresa"
  ON public.<tabela> FOR SELECT TO authenticated
  USING (
    is_super_admin_session()                          -- Super admin vê tudo
    OR empresa_id = get_current_empresa_id()           -- Admin vê sua empresa
  );
```

### 4.2 Padrão por Owner

```sql
CREATE POLICY "select_atividades_empresa"
  ON public.atividades FOR SELECT TO authenticated
  USING (
    is_super_admin_session()                            -- Super admin
    OR empresa_id = get_current_empresa_id()             -- Mesma empresa
    OR usuario_id = auth.uid()                           -- Própria atividade
  );
```

### 4.3 Exceções (Públicas)

```sql
-- Tabelas públicas (SELECT para anônimos)
form_schema → TO public USING (true)
mapas_distributors → Público
mapas_consultants → Público
linktree_colaboradores → Público
nps_respostas → INSERT anônimo
```

---

## 5. Verificação de Conformidade Multi-tenant

### 5.1 Tabelas com empresa_id (✅ conforme)

| Grupo | Tabelas |
|---|---|
| Core | `profiles`, `cadastros` (+pf, +pj, +enderecos), `documentos`, `credenciais` |
| Infra | `atividades`, `notificacoes`, `notificacoes_templates`, `webhooks`, `webhook_logs`, `form_schema`, `api_connectors`, `integracoes_config`, `permissoes` |
| NPS | `nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio` |
| Funis | `funis`, `funis_colunas`, `funis_tarefas`, `funis_comentarios`, `funis_anexos`, `funis_labels`, `funis_permissoes`, `funis_notifications`, `funis_templates` |
| Hub | 15 tabelas `hub_*` |
| Mapas | `mapas_distributors`, `mapas_consultants` |
| Rotas | `rotas`, `rotas_config` |
| Despesas | `despesas`, `despesas_periodos`, `despesas_anexos` |
| Gerador Links | `gerador_links`, `gerador_templates`, `gerador_link_cliques` |
| LinkTree | `linktree_colaboradores`, `linktree_empresa_*` |
| Marketing | `marketing_landing_pages`, `marketing_leads`, etc (14 tabelas) |

### 5.2 Tabelas SEM empresa_id (⚠️ revisar)

| Tabela | Motivo | Risco |
|---|---|---|
| `app_config` | Config global (apenas super admin) | ✅ Intencional |
| `mock_credentials` | Credenciais demo | ✅ Intencional |
| `nps_perguntas` (algumas) | Config global sem empresa | ⚠️ Dualidade pode causar dados órfãos |
| Subsistema CRM antigo (6 tabelas) | Legado | ⚠️ Sem empresa_id |

---

## 6. Índices

```sql
CREATE INDEX IF NOT EXISTS idx_cadastros_empresa ON cadastros(empresa_id);
CREATE INDEX IF NOT EXISTS idx_credenciais_empresa ON credenciais(empresa_id);
CREATE INDEX IF NOT EXISTS idx_atividades_empresa ON atividades(empresa_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_empresa ON permissoes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_documentos_empresa ON documentos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_nps_perguntas_empresa ON nps_perguntas(empresa_id, active);
CREATE INDEX IF NOT EXISTS idx_nps_respostas_empresa ON nps_respostas(empresa_id, created_at);
```

> Mais índices são recomendados para tabelas grandes como `hub_access_logs` e `gerador_link_cliques`.

---

## 7. Migrações — Ordem e Dependências

### Linha do Tempo Multi-tenant

```
00001: profiles.sql              → Auth trigger
00006: admin.sql                 → is_super_admin
00010: permissoes.sql            → Permissões
00014: notifications_and_expiry  → Notificações
00016: integracoes_nativas.sql   → Integrações
00023: multiempresas.sql         → ⭐ Multi-tenant (empresa_id em todas tabelas)
  ├── Adiciona empresa_id em 14+ tabelas
  ├── Recria RLS policies
  └── Cria funções get_current_empresa_id
```

---

## 8. Recomendações

### Críticas

1. **Adicionar empresa_id** às tabelas legadas do CRM (6 tabelas antigas)
2. **Resolver dualidade** da `nps_perguntas` (registros com/sem empresa_id)
3. **Adicionar índices** para queries de dashboard (status + empresa_id)

### Melhorias

4. **Soft Delete**: Adicionar `deleted_at` a todas as tabelas (atualmente delete físico)
5. **Audit Log**: Trigger que registra todas as alterações em `empresa_id`
6. **Cascade Rules**: Verificar FKs com `ON DELETE CASCADE` vs `SET NULL`
7. **View multi-tenant**: Criar views que já aplicam filtro de empresa automaticamente
8. **Data Isolation Test**: Script que verifica se empresa A consegue ver dados da empresa B
