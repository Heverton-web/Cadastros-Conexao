# Banco de produção × `supabase/migrations/` — drift

**Levantado em 2026-08-03**, contra o projeto `cluuqzhizeqvkgvfdisx`
(`VITE_SUPABASE_URL` do `.env`). Método: OpenAPI do PostgREST (186 tabelas
expostas, service_role) + `GET /rest/v1/<tabela>` para confirmar caso a caso.

> Confirme que este `.env` aponta para **produção** e não para um projeto de
> desenvolvimento. Se for dev, o drift descrito aqui é de dev — mas a conclusão
> sobre a ordem das migrations continua valendo.

## Resumo

O banco está **muito atrás** do diretório de migrations.

| Fato | Evidência |
| --- | --- |
| A renomeação EN→PT nunca rodou | `hub_materiais` → HTTP **404**; `hub_materials` → HTTP **200**. Idem `mapas_distribuidores`/`mapas_distributors`, `conectores_api`/`api_connectors` |
| A remoção de `empresa_id` nunca rodou | **83 tabelas** ainda têm a coluna, incluindo `despesas`, `rotas`, `funis`, `credenciais`, `cadastros`, `profiles`, `nps_*`, `linktree_*` |
| `empresa_id` continua `NOT NULL` | `POST /rest/v1/despesas` com `{}` → Postgres `23502` (not_null_violation). Idem `rotas` |
| **52 tabelas que o código consulta não existem** | ver tabela abaixo |

## Impacto: 52 tabelas ausentes

| Módulo | Tabelas ausentes |
| --- | --- |
| `hub` | 14 — todas as `hub_*` em português (`hub_materiais`, `hub_colecoes`, `hub_progresso_usuario`, `hub_config_sistema`, …) |
| `funis` | 12 — `funis_anexos`, `funis_automacoes`, `funis_comentarios`, `funis_etiquetas`, `funis_modelos`, `funis_notificacoes`, `funis_recorrentes`, … + `users` |
| `catalogo` | 9 — `catalogo_acessorios`, `catalogo_grupo_precos`, `catalogo_pagamentos`, `catalogo_instrumentais_gerais`, `logos`, … |
| **`core`** | 3 — `conectores_api`, `logs_webhook`, `notificacoes_modelos` |
| `agentes` | 2 — `provedores_ia`, `agentes_usage_log` |
| `mapas` | 2 — `mapas_consultores`, `mapas_distribuidores` |
| `admin` | 2 — `config_app`, `credenciais_mock` |
| `nps` | 2 — `dashboard_perfis`, `nps_perguntas_pesquisa` |
| `despesas` · `integracoes` · `demos` · `marketing` · `gerador-links` | 1 cada — `comprovantes`, `config_integracoes`, `credenciais_demo`, `empresa_limites_modulo`, `gerador_modelos` |

**O caso mais grave é `core`:** `dispararEventoModulo` consulta `webhooks`,
`notificacoes_modelos` e `conectores_api` em paralelo. `webhooks` existe — então
**webhook HTTP continua sendo entregue**. As outras duas não existem (no banco
ainda se chamam `notificacoes_templates` e `api_connectors`), logo
**notificação in-app/e-mail e conector de API nunca disparam**. O código faz
`console.error` e segue com lista vazia, então a falha é silenciosa para o
usuário. Ver [eventos.md](eventos.md).

`comprovantes`, `logos` e `users` são consultadas pelo código e **não têm
`CREATE TABLE` em nenhuma migration** — nunca existiram no repositório.

## Migrations não aplicadas (identificadas pelas tabelas que criariam)

```
00078_catalogo.sql                      7 tabelas de catálogo
00080_catalogo_clientes.sql             catalogo_grupo_precos
00084_agentes_usage_log.sql             agentes_usage_log
20260705000000_normalizar_tabelas.sql   38 renomeações EN->PT
20260725000000_provedores_ia.sql        provedores_ia
20260726180000_catalogo_pagamentos.sql  catalogo_pagamentos
```

Provavelmente há mais — estas são só as detectáveis por tabela ausente. Para a
lista exata, consulte `supabase_migrations.schema_migrations` (precisa de conexão
direta ao banco; a senha em `SUPABASE_DB_PASSWORD` foi recusada para o usuário
`postgres`, então talvez o projeto exija o pooler).

## Por que a limpeza de `empresa_id` está bloqueada

Circularidade, com o banco no estado atual:

- Remover `empresa_id` dos payloads de insert → **quebra**, porque a coluna existe
  e é `NOT NULL`.
- Aplicar `20260721000000` (dropa a coluna) sem limpar o código → **quebra**,
  porque o código continua enviando a coluna.

Só a fase 1 (`ALTER COLUMN … DROP NOT NULL`) rompe o ciclo, e ela pressupõe que o
banco corresponda ao repositório — o que não é verdade hoje.

Por isso **as três migrations novas ficam em `supabase/migrations-pendentes/`**,
fora do alcance do runner do `deploy-vps`.

## Ordem correta

1. **Reconciliar o banco com o repositório.** Aplicar o backlog de migrations
   ausentes **exceto** `20260721000000`. Isso restaura as 52 tabelas e volta a
   entregar eventos de módulo. Fazer em ambiente de teste primeiro: a
   `20260705000000` renomeia 38 tabelas.
2. Descobrir o conjunto real de migrations pendentes em
   `supabase_migrations.schema_migrations`, e resolver o acesso direto ao banco
   (pooler ou senha correta) para que `npm run audit:empresa-id` funcione.
3. `migrations-pendentes/…fase1_relaxar_empresa_id.sql` — tira `NOT NULL` de 57
   tabelas. Segura isolada.
4. Limpar `empresa_id` do código (470 ocorrências, 132 arquivos) e deployar.
5. `…fase2a_remover_empresa_id.sql` — dropa de 74 tabelas.
6. `…fase2b_upsert_conflict_target.sql` — as 4 tabelas cujo `upsert` usa
   `empresa_id` como conflict target (`hub_config_chatbot`, `hub_config_sistema`,
   `hub_integracoes_sistema`, `rotas_config`). Exige trocar o índice único
   **antes** de dropar a coluna, senão o upsert passa a duplicar linha — bug já
   vivido neste projeto, corrigido pela `20260720030000` em
   `catalogo_design_config`.

Nenhum passo depois do 1 faz sentido antes dele.

## Não deployar antes de resolver o passo 1

Um `deploy-vps` hoje aplicaria os 6+ migrations atrasados de uma vez, incluindo a
renomeação de 38 tabelas e a remoção de `empresa_id` de 71 — sem verificação
intermediária, contra um banco cujo estado ninguém tinha medido até agora.
