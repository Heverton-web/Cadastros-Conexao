---
name: bubble-workflows-backend
description: >
  SKILL AUTÔNUMA. Documenta workflows backend Bubble. Executa sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:

- JSON path
- `output_dir` — diretório base artefatos
- JSON pode ter `backend_workflows` ou workflows dentro de `pages`

## Processamento

### Fase A0: Criar pastas saída

- Criar `{output_dir}/relatorios/workflows/`

### Fase A: Localizar Workflows

- Buscar `backend_workflows` no JSON
- Se não existir, gerar relatório com "Nenhum backend workflow encontrado."
- Também extrair workflows de página de `pages.<id>.workflows`

### Fase B: Extrair Metadados

- Nome workflow
- Tipo trigger (data_change, scheduled, api, ButtonClicked, etc.)
- Condições execução

### Fase C: Processar Ações

- Tipo (create, update, delete, send_email, call API, Search, Login, etc.)
- Parâmetros e dados envolvidos
- Ordem execução

### Fase D: Gerar Markdown

```markdown
# Workflows

## <NomeWorkflow>

**Trigger:** [tipo]
**Página:** [se aplicável]

### Condições

### Actions

| # | Tipo | Descrição | Elementos |
```

## Saída

- `{output_dir}/relatorios/workflows/workflows_report.md` (backend)
- `{output_dir}/relatorios/workflows/<nome>.md` (individual)
- `{output_dir}/relatorios/workflows/resumo_workflows.md` (classificação)

## Validação Automática

- [ ] Todos workflows encontrados
- [ ] Trigger documentado
- [ ] Ordem ações preservada
- [ ] Condições registradas

Loop: até 3 tentativas.

## Casos Especiais

| Caso                    | Ação                      |
| ----------------------- | ------------------------- |
| Nenhum backend workflow | Documentar explicitamente |
| Workflows duplicados    | Identificar e marcar      |
| Scheduled workflows     | Incluir cron/intervalo    |

## Critérios Qualidade

- Ordem ações preservada
- Condições documentadas
- Anti-padrões identificados
