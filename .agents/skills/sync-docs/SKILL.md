---
name: sync-docs
description: >
  Sincroniza AGENTS.md, CLAUDE.md, GEMINI.md com o estado atual do projeto.
  Atualiza contagem de módulos, rotas, skills e comandos automaticamente.
  Preserva RTK SCRATCHPAD intacto.
triggers:
  - "sincronizar docs"
  - "atualizar AGENTS.md"
  - "sync docs"
  - "atualizar documentação"
---

# Sync Docs — ERP Odonto

Mantém os arquivos de configuração de LLM (AGENTS.md, CLAUDE.md, GEMINI.md) sincronizados com o estado atual do projeto.

## Quando usar

- Após criar/remover módulos
- Após criar/remover rotas
- Após adicionar/remover skills
- Após mudar comandos em package.json
- Quando os docs parecem desatualizados
- Antes de deploy

## Comandos

```bash
# Sincronizar (gera os 4 arquivos)
node scripts/sync-docs.mjs

# Verificar se está desatualizado (exit 1 = desatualizado)
node scripts/sync-docs.mjs --check
```

## O que atualiza automaticamente

| Seção | Fonte |
|---|---|
| Contagem de módulos | `src/features/*/` |
| Contagem de rotas | `src/routes/*.tsx` |
| Contagem de skills | `.agents/skills/*/SKILL.md` |
| Tabela de skills | Frontmatter dos SKILL.md |
| Comandos | `package.json` scripts |

## O que NÃO é alterado

- **RTK SCRATCHPAD** — preservado sempre. Entradas são adicionadas apenas via `rtk-memory`.
- **Seções fixas** — Arquitetura, Regras de UI, Economia de Tokens, Deploy, Gastos

## Arquivos gerados

- `AGENTS.md` (raiz)
- `CLAUDE.md` (raiz)
- `GEMINI.md` (raiz)
- `.gemini/GEMINI.md` (cópia para Gemini)
