# CLAUDE.md → AGENTS.md

Redirecionamento. A fonte única de instruções deste projeto é `AGENTS.md`.

@AGENTS.md

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANTE: este projeto tem um grafo de conhecimento do código. Use SEMPRE
as tools MCP do `code-review-graph` antes de gastar tokens desnecessários com
Grep/Glob/Read para explorar o código.** O grafo é mais rápido, mais barato
(menos tokens) e dá contexto estrutural (quem chama, quem depende, cobertura
de teste) que escanear arquivo por arquivo não dá.

Vale para **qualquer skill, subagente ou tool** invocado nesta sessão — não só
o loop principal.

O grafo **se atualiza automaticamente**: hook `PostToolUse` (Edit/Write) roda
`code-review-graph update --skip-flows` a cada edição, e `SessionStart` roda
`status`. Nunca rode `build`/`update` manualmente — já está coberto.

### Quando usar o grafo primeiro

- **Explorar código**: `semantic_search_nodes_tool` ou `query_graph_tool` em vez de Grep
- **Entender impacto**: `get_impact_radius_tool` em vez de rastrear imports na mão
- **Code review**: `detect_changes_tool` + `get_review_context_tool` em vez de ler arquivos inteiros
- **Relações**: `query_graph_tool` com callers_of/callees_of/imports_of/tests_for
- **Arquitetura**: `get_architecture_overview_tool` + `list_communities_tool`

Só cair para Grep/Glob/Read quando o grafo **não** cobrir o que precisa.

### Tools principais

| Tool | Quando usar |
| ------ | ---------- |
| `detect_changes_tool` | Revisar mudanças de código — análise com score de risco |
| `get_review_context_tool` | Precisa de trechos de código para review — econômico em tokens |
| `get_impact_radius_tool` | Entender o raio de impacto de uma mudança |
| `get_affected_flows_tool` | Achar quais fluxos de execução são afetados |
| `query_graph_tool` | Rastrear chamadores, chamados, imports, testes, dependências |
| `semantic_search_nodes_tool` | Achar funções/classes por nome ou palavra-chave |
| `get_architecture_overview_tool` | Entender a estrutura de alto nível do código |
| `refactor_tool` | Planejar renomes, achar código morto |

### Fluxo

1. O grafo se atualiza automaticamente a cada edição (hooks) — nunca rode build manual.
2. Use `detect_changes_tool` para code review.
3. Use `get_affected_flows_tool` para entender impacto.
4. Use `query_graph_tool` pattern="tests_for" para checar cobertura.
