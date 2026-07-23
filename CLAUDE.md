# AGENTS.md — ERP Odonto

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Estrutura

- `proj_erp/` → ERP (TanStack Start + React Router + Vite + Supabase)
- `bubble_reverse_engineering/` → Engenharia reversa Bubble.io
- `supabase-mcp-server/` → MCP server para Supabase

## Comandos

```bash
npm run dev      # dev server
npm run build    # build produção (RODAR APÓS QUALQUER ALTERAÇÃO)
npm run format   # Prettier
npm run lint     # ESLint
```

## MCP Supabase

Server em `supabase-mcp-server/`. Tools: `supabase_execute_sql`, `supabase_list_tables`, `supabase_describe_table`, `supabase_apply_migration`.

## Regras de UI

- **PROIBIDO** `window.confirm()`, `window.alert()`, `window.prompt()`
- **OBRIGATÓRIO** `AlertDialog` (exclusões) ou `Dialog` (conteúdo) de `~/components/ui/`
- Dialogs com scroll: `DialogContent flex flex-col max-h-[85vh] overflow-hidden` + body `overflow-y-auto flex-1 min-h-0`
- Referência existente em `~/components/ui/alert-dialog` e `~/components/ui/dialog` para padrão

## Arquitetura

- **Single-tenant**: `empresa_id` foi removido de praticamente todas as tabelas em `20260721000000_remove_empresa_id_all_tables.sql`. RLS hoje é aberta (`USING (true)`). Não injetar `empresa_id` em código novo. Exceção: `agentes_usage_log` (uso/billing) manteve a coluna.
- **Módulos**: self-contained em `src/features/<modulo>/`. Única conexão = banco de dados.
- **Eventos**: todo módulo DEVE ter `events[]` no `module.ts` (min 2) + `dispararEventoModulo()` fire-and-forget.
- **Permissões**: toda rota → `RequirePermission` ou `RequireSuperAdmin`. Botões → check `permissoes?.chave`.
- **Build**: `npm run build` DEVE passar após qualquer alteração.

## Economia de Tokens (RIGOROSO)

### O que fazer
- **Skill-first**: ler `.agents/skills/<nome>/SKILL.md` antes de tarefa complexa
- **Lean-CTX**: `grep` antes de `read`. Assinaturas antes de corpos. Nunca ler arquivo inteiro sem necessidade
- **Headroom**: comprimir logs/erros antes de reportar. Saída > 7 linhas = headroom obrigatório
- **Caveman**: respostas telegráficas. Sem re-emitir arquivos inteiros. Só diffs/chunks cirúrgicos
- **Pre-flight-check**: `types → testes → build` ANTES de qualquer deploy ou commit estrutural
- **RTK-Memory**: registrar erros novos e padrões descobertos no `## RTK SCRATCHPAD` do AGENTS.md
- **Subagents**: delegar tarefas paralelas via `task` — 5 tarefas independentes = 5 subagents, não 5 turnos inline
- **Cache interno**: consolidar edits em `write`/`edit` único, não troca incremental
- **`/clear`**: ao finalizar tarefas longas para limpar contexto acumulado

### O que NÃO fazer
- Nunca ler arquivo "só pra ver" — ter objetivo claro
- Nunca ler mais de 3 arquivos grandes sem consolidar (lean-ctx)
- Nunca fazer `read` de diretório grande — usar `glob`/`grep`
- Nunca ocultar erros principais em logs (headroom preserva sempre)
- Nunca declarar tarefa concluída sem pre-flight-check
- Nunca re-analisar erro já registrado no RTK SCRATCHPAD
- Nunca gerar explicações longas sem pedido explícito
- Nunca delegar design inicial a subagent (escopo é seu, execução é dele)
- Nunca spawnar subagent sem tarefa autocontida e verificável

### Pipeline de economia (ordem de aplicação)
```
1. lean-ctx    → inspecionar código (mínimo tokens de input)
2. headroom    → comprimir logs/erros (mínimo tokens de contexto)
3. caveman     → comprimir resposta (mínimo tokens de output)
4. rtk-memory  → registrar aprendizado (evitar re-análise futura)
5. pre-flight  → validar antes de commit/deploy (evitar retrabalho)
```

### Skills de economia de tokens
| Skill | Pasta | Trigger | O que faz |
|---|---|---|---|
| `caveman` | `.agents/skills/caveman/` | "caveman mode", "/caveman", "menos tokens" | Comunicação ultra-condensada (-75% output) |
| `headroom` | `.agents/skills/headroom/` | "headroom", "compactar logs" | Compacta logs/erros, preserva contexto acionável |
| `lean-ctx` | `.agents/skills/lean-ctx/` | "lean-ctx", "inspecionar código" | Leitura seletiva: assinaturas > corpos (-60% input) |
| `pre-flight-check` | `.agents/skills/pre-flight-check/` | "pre-flight", "validar antes de deploy" | Validação types → testes → build obrigatória |
| `rtk-memory` | `.agents/skills/rtk-memory/` | "rtk-memory", "registrar erro" | Aprendizado persistente no RTK SCRATCHPAD |

### Outras skills
| Skill | Trigger |
|---|---|
| `deploy-vps` | "deploy", "/deploy" |
| `calcular-gastos-sessao` | "quanto gastei", "custo sessão" |
| `criar-migration` | "criar migration", "criar tabela", "migration supabase" |
| `criar-form-multitipo` | "form modal com tipos", "modal com abas de tipo de produto" |

## Deploy

Só executar quando usuário disser "deploy" ou "/deploy". Usar skill `deploy-vps`. Build DEVE passar antes do push.

## Gastos

Ao final de cada ação, exibir `[💰 Ação: R$ X | Sessão: R$ Y]`. Detalhes na skill `calcular-gastos-sessao`.

## Bubble Reverse Engineering

Pipeline via `/bubble-tech-lead` + skills em `.agents/skills/`.

## RTK SCRATCHPAD

> Registro persistente de erros resolvidos, decisões arquiteturais e padrões descobertos.
> Gerenciado pela skill `rtk-memory`. Nunca re-analisar o que já está aqui.

### 2026-07-23 — Sistema é single-tenant, não multi-tenant (drift entre skills e schema real)
- **Descoberta**: 6 skills (`criar-modulo`, `gerar-crud`, `planejar-modulo-repo-externo`, `documentar-modulo`, `validar-modulo`) + este CLAUDE.md exigiam `empresa_id` obrigatório como se o ERP fosse multi-tenant
- **Realidade**: `supabase/migrations/20260721000000_remove_empresa_id_all_tables.sql` removeu `empresa_id` de ~71 tabelas. RLS atual é aberta (`USING (true)`). Sistema é single-tenant
- **Exceção**: `agentes_usage_log` manteve `empresa_id` (uso/billing, criada em `00084_agentes_usage_log.sql`) — não generalizar essa exceção para outras tabelas
- **Fix**: skills e CLAUDE.md corrigidos para não exigir/injetar `empresa_id`
- **Padrão**: antes de confiar em uma skill que menciona multi-tenant/empresa_id, checar a migration mais recente que toque a tabela — não assumir que a doc da skill reflete o schema atual

### 2026-07-23 — `dispararEventoModulo()` tem 3 args, não 4
- **Arquivo real**: `src/core/services/webhooks.ts:379` — assinatura `(moduloKey, eventoKey, payload)`
- **Templates desatualizados**: `criar-modulo`/`gerar-crud` passavam um 4º arg (`empresaId`) que é silenciosamente ignorado pela implementação real
- **Fix**: templates corrigidos para 3 args
- **Padrão**: sempre chamar fire-and-forget com `.catch(() => {})`, nunca `await`

### 2026-07-23 — `ativo` não definido no update de tipo workflow
- **Arquivo**: `src/routes/catalogo.admin.workflows.tsx:147`
- **Erro**: `ReferenceError: ativo is not defined` ao editar tipo de workflow
- **Causa**: `.update({ ... ativo })` usava variável solta em vez de `tipoAtivo` (state)
- **Fix**: trocar `ativo` por `ativo: tipoAtivo`
- **Padrão**: em handlers com destructuring de state, sempre usar o nome explícito do state, nunca apropa variável genérica sem prefixo
