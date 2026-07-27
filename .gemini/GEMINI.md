# GEMINI.md — ERP Odonto

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Fable Family

- Tarefa multi-step não trivial → aplicar `fable-method`.
- Tarefa unattended / subagents em paralelo → `fable-loop`.
- Trabalho concluído → `fable-judge` antes de declarar pronto.

## Estrutura

```
proj_erp/
├── src/
│   ├── features/       # Módulos de negócio (25 módulos)
│   ├── shared/         # Dados compartilhados (empresas, form-schema)
│   ├── core/           # Infra: auth, permissions, services, store, theme
│   ├── components/     # UI genérica (ui/, shared/, layout/, guards/)
│   ├── design-system/  # Tokens, presets, hooks, provider
│   ├── registry/       # Registro de módulos, nav items, permissões
│   ├── routes/         # ~198 rotas (TanStack Router file-based)
│   ├── lib/            # Utilitários genéricos (format, utils)
│   └── hooks/          # Hooks compartilhados
├── supabase/           # Migrations SQL
├── supabase-mcp-server/# MCP server (Supabase)
├── docs-projeto/       # Documentação (docs-design-system/, specs/, etc.)
└── .agents/skills/     # 39 skills de automação
```

**Config unificada:** `.claude/` contém symlinks (`.lnk`) para `.agents/` — skills, hooks, commands, rules, specs, workflows. Editar em `.agents/`, symlink atualiza automaticamente.

## Comandos

```bash
dev  # dev server
build  # build produção (RODAR APÓS QUALQUER ALTERAÇÃO)
preview  # preview produção
format  # Prettier
lint  # ESLint
test  # vitest run
test:watch  # vitest watch
test:coverage  # vitest com coverage
storybook  # Storybook dev
build-storybook  # Storybook build
test:safe  # testes com headroom filter
deploy:safe  # deploy com headroom filter
check:types  # type-check (tsc --noEmit)
check:guards  # verificar guards de rota
validate:all  # types + testes
```

## Arquitetura

- **Single-tenant:** `empresa_id` removido de ~71 tabelas (migration `20260721000000`). RLS aberta (`USING true`). Não injetar `empresa_id` em código novo. Exceção: `agentes_usage_log`.
- **Módulos:** self-contained em `src/features/<modulo>/`. Única conexão = banco.
- **Imports:** módulo só importa de `shared/`, `lib/`, `components/ui/`, `core/`. Nunca de outro módulo.
- **Eventos:** todo módulo DEVE ter `events[]` no `module.ts` (min 2) + `dispararEventoModulo(moduloKey, eventoKey, payload)` — 3 args, fire-and-forget com `.catch(() => {})`.
- **Permissões:** rota → `RequirePermission` ou `RequireSuperAdmin`. Botões → `permissoes?.chave`.
- **Detalhes:** ver `ARCHITECTURE.md`.

## Regras de UI

- **PROIBIDO** `window.confirm()`, `window.alert()`, `window.prompt()`
- **OBRIGATÓRIO** `AlertDialog` (exclusões) ou `Dialog` (conteúdo) de `~/components/ui/`
- Dialog scroll: `DialogContent flex flex-col max-h-[85vh] overflow-hidden` + body `overflow-y-auto flex-1 min-h-0`
- Design system: `src/design-system/` (tokens, presets, hooks). Docs em `docs-projeto/docs-design-system/`

## Skills

### Economia de Tokens
| Skill | Trigger |
|---|---|
| `pre-flight-check` |  |
| `rtk-memory` |  |

### Módulo (criar/estilizar/validar)
| Skill | Trigger |
|---|---|
| `aplicar-design-modulo` |  |
| `criar-componente-modulo` | criar componente |
| `criar-design-modulo` |  |
| `criar-form-multitipo` |  |
| `criar-migration` |  |
| `criar-modulo` |  |
| `criar-rota` |  |
| `design-frontend` |  |
| `documentar-modulo` |  |
| `gerenciar-nav-items` |  |
| `validar-modulo` |  |

### CRUD e UI
| Skill | Trigger |
|---|---|
| `adicionar-permissao` |  |
| `gerar-crud` |  |
| `gerar-formulario` |  |
| `gerar-modal` |  |
| `gerar-pagina` |  |
| `responsividade` |  |

### Deploy e Operação
| Skill | Trigger |
|---|---|
| `calcular-gastos-sessao` |  |
| `deploy-vps` |  |
| `implementar-plan` |  |
| `master-skill` |  |

### Conhecimento e Referência
| Skill | Trigger |
|---|---|
| `ai-agents-mcp` |  |
| `ai-engineering` |  |
| `auditoria-fix-adversarial` |  |
| `clean-architecture` |  |
| `clean-code` |  |
| `fable-domain` |  |
| `fable-judge` |  |
| `fable-loop` |  |
| `fable-method` |  |
| `fix-squad-paralelo` |  |
| `google-maps-platform` |  |
| `implementar-mapa-dark-premium` |  |
| `loop` |  |
| `planejar-modulo-repo-externo` |  |
| `sync-docs` |  |
| `triagem-erros-massa` |  |


## Economia de Tokens

```
1. lean-ctx    → grep antes de read, assinaturas antes de corpos
2. headroom    → comprimir logs > 7 linhas
3. caveman     → respostas telegráficas, só diffs cirúrgicos
4. rtk-memory  → registrar erro/padrão no RTK SCRATCHPAD
5. pre-flight  → types → testes → build ANTES de commit/deploy
```

**O que NÃO fazer:** ler arquivo "só pra ver"; ler >3 arquivos grandes sem consolidar; read de diretório grande (usar glob/grep); declarar tarefa concluída sem pre-flight; re-analisar erro registrado no RTK SCRATCHPAD; gerar explicações longas sem pedido.

## Deploy

Só quando usuário disser "deploy" ou "/deploy". Usar skill `deploy-vps`. Build DEVE passar antes do push.

## Gastos

Exibir `[💰 Ação: R$ X | Sessão: R$ Y]` ao final de cada ação. Detalhes: `calcular-gastos-sessao`.

## RTK SCRATCHPAD

> Erros resolvidos e padrões descobertos. Gerenciado por `rtk-memory`. Não re-analisar o que já está aqui.

### Padrões consolidados
- **Single-tenant:** não injetar `empresa_id`. Migration `20260721000000` removeu de ~71 tabelas. Checar `grep` na migration antes de confiar que uma tabela foi coberta.
- **dispararEventoModulo:** 3 args `(moduloKey, eventoKey, payload)`. Nunca passar 4º arg. Sempre `.catch(() => {})`, nunca `await`.
- **State em handlers:** usar nome explícito do state (ex: `tipoAtivo`), nunca variável genérica sem prefixo.
- **Cross-feature imports:** proibidos. Mover lógica compartilhada para `shared/` ou `lib/utils/`.
- **Vite não type-checka por padrão:** rodar `npm run check:types` além do build ao mexer com tipagem dinâmica de Supabase.
