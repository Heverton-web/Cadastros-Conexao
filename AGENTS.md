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
-参照 existente em `~/components/ui/alert-dialog` e `~/components/ui/dialog` para padrão

## Arquitetura

- **Multi-tenant**: toda tabela → `empresa_id` UUID FK. RLS filtra por `empresa_id`.
- **Módulos**: self-contained em `src/features/<modulo>/`. Única conexão = banco de dados.
- **Eventos**: todo módulo DEVE ter `events[]` no `module.ts` (min 2) + `dispararEventoModulo()` fire-and-forget.
- **Permissões**: toda rota → `RequirePermission` ou `RequireSuperAdmin`. Botões → check `permissoes?.chave`.
- **Build**: `npm run build` DEVE passar após qualquer alteração.

## Economia de Tokens (RIGOROSO)

### O que fazer
- **Skill-first**: ler skill antes de tarefa complexa (`.agents/skills/<nome>/SKILL.md`)
- **Lean-CTX**: `grep` antes de `read`. Assinaturas antes de corpos. Nunca ler arquivo inteiro sem necessidade
- **Subagents**: delegar tarefas paralelas via `task` — 5 tarefas independentes = 5 subagents, não 5 turnos inline
- **Cache interno**: consolidar edits em `write`/`edit` único, não troca incremental
- **`/clear`**: ao finalizar tarefas longas para limpar contexto acumulado
- **Caveman**: respostas telegráficas. Sem re-emitir arquivos inteiros. Só diffs/chunks cirúrgicos

### O que NÃO fazer
- Nunca ler arquivo "só pra ver" — ter objetivo claro
- Nunca fazer `read` de diretório grande — usar `glob`/`grep`
- Nunca gerar explicações longas sem pedido explícito
- Nunca delegar design inicial a subagent (escopo é seu, execução é dele)
- Nunca spawnar subagent sem tarefa autocontida e verificável

### Skills essenciais
| Skill | Trigger |
|---|---|
| `deploy-vps` | "deploy", "/deploy" |
| `calcular-gastos-sessao` | "quanto gastei", "custo sessão" |
| `criar-modulo` | "novo módulo", "criar módulo" |
| `validar-modulo` | "validar módulo", "verificar módulo" |
| `pre-flight-check` | antes de mudanças estruturais |
| `lean-ctx` | inspeção de código sem ler arquivos inteiros |
| `caveman` | modo ultra-condensado |

## Deploy

Só executar quando usuário disser "deploy" ou "/deploy". Usar skill `deploy-vps`. Build DEVE passar antes do push.

## Gastos

Ao final de cada ação, exibir `[💰 Ação: R$ X | Sessão: R$ Y]`. Detalhes na skill `calcular-gastos-sessao`.

## Bubble Reverse Engineering

Pipeline via `/bubble-tech-lead` + skills em `.agents/skills/`.
