# Índice do Projeto

Pipeline executado via `/bubble-tech-lead @appBubble.json` em 2026-06-18.

---

## Relatórios Gerados

| Relatório | Arquivo | Status |
|-----------|---------|--------|
| Páginas | `pages_report.md` | ✅ 3 páginas |
| Workflows | `workflows_report.md` | ✅ 2 workflows |
| Option Sets | `option_sets_report.md` | ✅ 13 option sets |
| Tabelas (Data Types) | `tables_report.md` | ⏳ Ausente no JSON |
| Conclusões | `conclusoes_engenharia_reversa.md` | ✅ Consolidado |

## Skills Executadas

| Skill | Domínio | Plano de Referência |
|-------|---------|---------------------|
| `bubble-paginas` | Páginas | `plano_engenharia_reversa_paginas.md` |
| `bubble-option-sets` | Option Sets | `plano_engenharia_reversa_option_sets.md` |

## Skills Não Executadas (domínios ausentes)

| Skill | Motivo |
|-------|--------|
| `bubble-tabelas` | `data_types` não presente no JSON |
| `bubble-workflows-backend` | `backend_workflows` não presente |
| `bubble-api-connectors` | `api_connectors` não presente |
| `bubble-elementos-reutilizaveis` | `reusable_elements` não presente |
| `bubble-prd` | Dependente de tabelas + option sets consolidados |

## Modelos de Referência

`proj_reversa/references/tasks-engenharia_reversa/` e `proj_reversa/references/resultados/`

## Otimizações (Modo Eco)

| Otimização | Status | Ganho |
|------------|--------|-------|
| Skills comprimidas (caveman `full`) | ✅ 8 skills | -28% bytes / -15% linhas |
| Dispatches caveman | ✅ Template criado | -50% tokens por dispatch |
| Sub-agentes escrevem direto | 🔧 Implementação futura | -99% tokens retorno |
| Status ultra | ✅ Template definido | -75% tokens status |
| Originais preservados | `SKILL.original.md` | Restore fácil |

**Template dispatch:** `proj_reversa/references/dispatch_template_caveman.md`

## Estrutura do Projeto

```
bubble_reverse_engineering/
├── README.md
├── INDICE.md
├── conclusoes_engenharia_reversa.md
├── FINAL_INSTRUCTIONS.md
├── pages_report.md
├── workflows_report.md
├── option_sets_report.md
├── tables_report.md
├── appBubble.json
├── skills/     (8 skills)
├── tasks/      (5 tasks)
└── proj_reversa/references/
```
