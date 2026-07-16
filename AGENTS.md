# AGENTS.md — ERP Odonto & Bubble Reverse Engineering

**Idioma:** PT-BR obrigatório.

## Estrutura do Projeto

- **Raiz** → `bubble_reverse_engineering/`: Engenharia reversa de Bubble.io + configs globais.
- **`proj_erp/`** → Aplicação ERP (TanStack Start + React Router + Vite + Supabase).
- **`supabase-mcp-server/`** → MCP server TypeScript para gerenciar banco Supabase.

## Comandos de Desenvolvimento

```bash
npm run dev      # dev server (Vite)
npm run build    # build produção
npm run format   # Prettier
npm run lint     # ESLint
```

## 🚨 Regras Obrigatórias (resumo)

| Regra | Detalhe |
|-------|---------|
| Sem alertas nativos | `window.confirm/alert/prompt` PROIBIDO. Usar `AlertDialog` ou `Dialog` |
| Multi-tenant | Toda tabela tem `empresa_id`. RLS filtra por empresa |
| RequirePermission | Toda rota autenticada usa `RequirePermission` ou `RequireSuperAdmin` |
| Eventos Central de Ações | Todo módulo tem ≥2 eventos + `dispararEventoModulo()` fire-and-forget |
| Build check | `npm run build` SEMPRE após alteração de código |

## Referências Detalhadas

| Documento | Quando ler |
|-----------|------------|
| `skill://docs/ui-rules` | Criando/editando modais, AlertDialog, Dialog, scroll |
| `skill://docs/architecture` | Novo módulo, eventos, multi-tenant, estrutura |
| `skill://docs/permissions` | Permissões, guards, checklist novo módulo |
| `skill://docs/mcp-supabase` | Usando MCP Supabase (tools SQL) |
| `skill://rules/economia-tokens` | Regras de eficiência de tokens |

## Comportamento do Agente

- **Caveman**: SEM greetings, SEM re-emitir arquivos inteiros, direto ao ponto. Explicações SOMENTE com "?"
- **Lean-CTX**: Ler assinaturas antes de corpos, agrupar edições, evitar grep em diretórios grandes
- **RTK**: Manter lições aprendidas no scratchpad abaixo. Consultar antes de cada plano
- **Skills**: Checar `.agents/skills/` antes de tarefa complexa

### 📝 SCRATCHPAD RTK

- **Learnt**: Laboratório de Testes (global.laboratorio.tsx): requer migration 00054 para RPCs de token real. Fallback automático para UUID local se RPC indisponível. Página reescrita com 3 abas (Gerador, Teste de Fluxo, Histórico). Central de Testes (global.testes.tsx): fetch com AbortSignal.timeout(30000) adicionado.
- **Regra Obrigatória**: SEMPRE rodar `npm run build` após QUALQUER alteração de código para validar ausência de erros. Nunca assumir que edição está correta sem verificar build.

## Deploy

- Só executar quando o usuário disser "deploy", "/deploy" ou "fazer deploy".
- Usar skill `deploy-vps`. Build deve passar antes do push.

## Bubble Reverse Engineering

- Pipeline completo via `/bubble-tech-lead` + skills em `.agents/skills/`.

## Skills Disponíveis

| Skill | Descrição |
|-------|-----------|
| `criar-modulo` | Cria estrutura completa de novo módulo |
| `criar-rota` | Cria rota protegida no ERP Odonto |
| `gerar-crud` | Operações CRUD com React Query |
| `criar-componente-modulo` | Cria componente React seguindo padrões shadcn/ui |
| `adicionar-permissao` | Adiciona permissão ao sistema de permissões |
| `validar-modulo` | Verificar integridade do módulo |
| `documentar-modulo` | Gerar documentação do módulo |
| `deploy-vps` | Deploy via Docker + VPS |
| `planejar-modulo-repo-externo` | Analisar repo externo e planejar integração |
| `gerenciar-nav-items` | Gerencia nav items de módulos |
| `design-frontend` | Embeleza frontend com design system (`/design <rota>`) |
| `responsividade` | Analisa e corrige responsividade (`/responsividade <modulo>`) |
| `criar-design-modulo` | Cria config de Design System do módulo |
| `gerar-pagina` | Gera página React completa com Design System |
| `gerar-formulario` | Gera formulário React com React Hook Form + Zod |
| `gerar-modal` | Gera Modal/Dialog com shadcn/ui |
| `google-maps-platform` | Google Maps APIs e SDKs |
| `loop` | Especifica loop de agente autônomo |
| `rtk-memory` | Memória RTK para agentes |
| `lean-ctx` | Estratégia LEAN-CTX para limitação de contexto |
| `caveman` | Modo comunicação ultra-condensada |
| `pre-flight-check` | Verificação prévia antes de implementações |
| `implementar-mapa-dark-premium` | Mapa dark premium com tokens CSS |
| `headroom` | Framework para componentes UI reutilizáveis |
| `modulo-completo` | Workflow: Documentação → Design → Responsividade |
| `loop-modulo-completo` | Pipeline iterativo de módulo até tudo passar |
