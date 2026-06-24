# Índice do Projeto: gestao-contratos-conexao

Pipeline executado via `/bubble-tech-lead` em 2026-06-18.

---

## Relatórios por Domínio

| Relatório | Arquivo | Status |
|-----------|---------|--------|
| Páginas | `relatorios/paginas/pages_report.md` | ✅ 19 páginas |
| Data Types | `relatorios/tabelas/tables_report.md` | ✅ 26 data types |
| Option Sets | `relatorios/option_sets/option_sets_report.md` | ✅ 20 option sets |
| Workflows | `relatorios/workflows/workflows_report.md` | ✅ 0 backend workflows |
| API Connectors | `relatorios/api_connectors/api_connectors_report.md` | ✅ 0 connectors |
| Elementos Reutilizáveis | `relatorios/elementos_reutilizaveis/elementos_reutilizaveis_report.md` | ✅ 0 elementos |

## Documentos Consolidados

| Documento | Arquivo |
|-----------|---------|
| Documentação Completa | `documentacao_completa/PRD_DOCUMENTACAO_COMPLETA.md` |
| Conclusões | `conclusoes_engenharia_reversa.md` |

## Sub-relatórios

### Páginas
- `relatorios/paginas/resumo_paginas.md`

### Option Sets
- `relatorios/option_sets/resumo_option_sets.md`

## Tasks
- `tasks/task_bubble-paginas.md`
- `tasks/task_bubble-tabelas.md`
- `tasks/task_bubble-option-sets.md`

## Otimizações

Pipeline executado em **Modo Eco** — skills comprimidas com caveman `full`, dispatches otimizados.

| Componente | Antes | Depois |
|------------|-------|--------|
| SKILL.md (8) | 28Kb | 20Kb (-28%) |
| Dispatches | 3 textos longos | Template caveman |
| Retorno sub-agentes | Análise em texto (~25K) | Escrita direta em arquivos |
| Status | Verboso | ultra |

**Template:** `proj_reversa/references/dispatch_template_caveman.md`

## Estrutura do Projeto

```
bubble_reverse_engineering/
├── analise_gestao-contratos-conexao/
│   ├── INDICE.md
│   ├── conclusoes_engenharia_reversa.md
│   ├── tasks/
│   ├── relatorios/
│   │   ├── paginas/
│   │   ├── tabelas/
│   │   ├── option_sets/
│   │   ├── workflows/
│   │   ├── api_connectors/
│   │   └── elementos_reutilizaveis/
│   └── documentacao_completa/
├── skills/              (8 skills do squad)
├── tasks/               (tasks globais)
├── proj_reversa/        (referências)
└── README.md
```
