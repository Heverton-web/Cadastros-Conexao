# Banco de dados

Supabase/Postgres. 167 migrations em `supabase/migrations/`. Skill: `criar-migration`.

## Single-tenant — a regra

A empresa é fixa (`VITE_EMPRESA_ID`, via `~/config/empresa`).

- **Não crie** coluna `empresa_id` em tabela nova.
- **Não filtre** por `empresa_id` em código novo.

## ⚠ Quais tabelas ainda têm `empresa_id`: não confie na migration

`20260721000000_remove_empresa_id_all_tables.sql` tem 71 `ALTER TABLE IF EXISTS …
DROP COLUMN IF EXISTS empresa_id`, mas **19 deles foram no-op**: usam nomes que
`20260705000000_normalizar_tabelas.sql` já havia renomeado 16 dias antes
(`hub_materials` → `hub_materiais`, `mapas_distributors` → `mapas_distribuidores`,
`api_connectors` → `conectores_api`, …). Outros 7 alvos nunca existiram com aquele
nome. O `IF EXISTS` engoliu tudo em silêncio, e a verificação final da migration só
faz `RAISE WARNING` — nunca falhou.

**Consequência: grep na migration dá resposta errada.** A única fonte de verdade é o
schema:

```sql
SELECT table_name FROM information_schema.columns
WHERE table_schema = 'public' AND column_name = 'empresa_id'
ORDER BY table_name;
```

**Decisão de 2026-08-03: `empresa_id` não será mais usado para multi-tenant.**
Não há exceção — a coluna sai de todas as tabelas. Em 152 de 154 definições ela
era FK para `empresas(id)`, isto é, sempre o discriminador de tenant.

Estado atual, até a fase 2 rodar:

- **Ainda com a coluna** (~78 tabelas): `hub_*`, `mktg_*`, `mapas_*`, `agentes_*`,
  `conectores_api`, `empresa_limites_modulo`, `notificacoes_modelos`, `logs_webhook`,
  `schema_formulario`, `config_integracoes`, entre outras. O código que ainda a
  envia **funciona hoje**, mas é transitório — não escreva código novo assim.
- **Já limpas** (código que ainda envia o campo está quebrado): `despesas`,
  `despesas_periodos`, `rotas`, `rotas_trajetos`, `funis`, `credenciais`,
  `profiles`, `cadastros`, `clientes`, `linktree_*` (6), `nps_perguntas`,
  `nps_respostas`, `nps_relatorios_envio`, `nps_webhook_config`.

Para saber o estado real:

```bash
npm run audit:empresa-id
```

Convergência já escrita, em duas fases (aplicar na ordem, fase 2 junto do deploy
que limpa o código): `20260803000000_single_tenant_fase1_relaxar_empresa_id.sql`
(tira `NOT NULL` de 57 tabelas, segura isolada) e
`supabase/migrations-pendentes/20260803000100_single_tenant_fase2_remover_empresa_id.sql`
(dropa de 78 e **falha** se sobrar qualquer uma — fica fora de
`supabase/migrations/` de propósito, para o deploy não aplicá-la antes da limpeza
do código; ver o README daquela pasta). Contexto: A1 em
[plano-correcao-auditoria.md](plano-correcao-auditoria.md).

Ao criar migration nova que remove coluna, faça a verificação **falhar**
(`RAISE EXCEPTION`), não avisar — foi o `RAISE WARNING` que deixou isso passar.

## RLS

Aberta por design (`USING (true)`) — a autorização é na aplicação, via
permissões e guards ([rotas-permissoes.md](rotas-permissoes.md)).

```sql
ALTER TABLE minha_tabela ENABLE ROW LEVEL SECURITY;
CREATE POLICY "minha_tabela_select" ON minha_tabela FOR SELECT USING (true);
CREATE POLICY "minha_tabela_insert" ON minha_tabela FOR INSERT WITH CHECK (true);
CREATE POLICY "minha_tabela_update" ON minha_tabela FOR UPDATE USING (true);
CREATE POLICY "minha_tabela_delete" ON minha_tabela FOR DELETE USING (true);
```

## Convenções de schema

| Item | Padrão |
| --- | --- |
| Nome do arquivo | `<timestamp>_<descricao_snake_case>.sql` (`20260726180000_catalogo_pagamentos.sql`) |
| Nome de tabela | `snake_case`, prefixo do módulo (`catalogo_*`, `hub_*`, `funis_*`, `mktg_*`, `nps_*`, `rotas_*`, `despesas_*`, `linktree_*`, `mapas_*`, `gerador_*`) |
| PK | `id UUID DEFAULT gen_random_uuid() PRIMARY KEY` |
| Timestamps | `created_at`/`updated_at TIMESTAMPTZ DEFAULT now()` |
| FK | `REFERENCES pai(id) ON DELETE CASCADE` |
| Dinheiro | `DECIMAL(10,2)` |
| Extras | `metadata JSONB DEFAULT '{}'` |
| Enum | `TEXT` + comentário com os valores válidos (não usar tipo `ENUM`) |

## Template de migration

```sql
-- ============================================================
-- Migration: <título>
-- Data: AAAA-MM-DD
-- Descrição: <o que muda e por quê>
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS minha_tabela ( ... );
CREATE INDEX IF NOT EXISTS idx_minha_tabela_status ON minha_tabela(status);

-- RLS (aberta — single-tenant)
...

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_minha_tabela_updated_at() ...
CREATE TRIGGER minha_tabela_updated_at BEFORE UPDATE ON minha_tabela
  FOR EACH ROW EXECUTE FUNCTION update_minha_tabela_updated_at();

COMMIT;
```

Regras: idempotente (`IF EXISTS` / `IF NOT EXISTS`), dentro de `BEGIN`/`COMMIT`,
índice em toda FK e coluna filtrada. Nunca editar migration já aplicada — criar nova.

## Cache do PostgREST

Alteração de schema exige invalidar o cache, senão o client retorna coluna inexistente:

```sql
NOTIFY pgrst, 'reload schema';
```

## Tipos no TypeScript

`~/core/supabase` exporta `supabase` e `Json`. Não existe `database.types.ts` gerado:
os tipos de linha são declarados à mão em `types.ts` de cada módulo. Ao mexer em
tipagem dinâmica do Supabase, rode `npm run check:types` — o `vite build` não type-checka.

## Scripts auxiliares

Migrations bloqueadas por mudança de código ficam em `supabase/migrations-pendentes/`
(fora do alcance do runner de deploy) — ver o README de lá.

## Scripts auxiliares

`scripts/` tem utilitários de manutenção (`run-migrations.mjs`, `audit-fks.cjs`,
`diagnostico-rls.cjs`, `reload-postgrest-cache.cjs`, `single-tenant-services.cjs`).
São de uso pontual, não parte do build.
