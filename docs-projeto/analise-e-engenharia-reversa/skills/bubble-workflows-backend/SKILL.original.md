---
name: bubble-workflows-backend
description: >
  SKILL AUTÔNUMA. Documenta todos os workflows backend do Bubble. Executa
  completamente sem intervenção humana.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:
1. Lê o JSON do caminho fornecido
2. Processa workflows backend e de página
3. Gera documentação completa
4. Retorna o resultado

## 1. Entrada
- Caminho do arquivo JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base para salvar artefatos (fornecido pelo Tech Lead)
- JSON pode conter `backend_workflows` ou workflows dentro de `pages`

## 2. Processamento (automático)

### Fase A0: Criar pastas de saída
- Criar `{output_dir}/relatorios/workflows/` se não existir

### Fase A: Localizar Workflows
- Buscar `backend_workflows` no JSON
- Se não existir, gerar `{output_dir}/relatorios/workflows/workflows_report.md` com "Nenhum backend workflow encontrado."
- Também extrair workflows de página de `pages.<id>.workflows`

### Fase B: Extrair Metadados
- Nome do workflow
- Tipo de trigger (data_change, scheduled, api, ButtonClicked, etc.)
- Condições de execução

### Fase C: Processar Ações
- Tipo (create, update, delete, send_email, call API, Search, Login, etc.)
- Parâmetros e dados envolvidos
- Ordem de execução

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

## 3. Saída
- `{output_dir}/relatorios/workflows/workflows_report.md` (workflows backend)
- `{output_dir}/relatorios/workflows/<nome>.md` (um por workflow)
- `{output_dir}/relatorios/workflows/resumo_workflows.md` (classificação)

## 4. Validação Automática

- [ ] Todos os workflows encontrados
- [ ] Trigger documentado
- [ ] Ordem de ações preservada
- [ ] Condições registradas

Loop automático: até 3 tentativas.

## 5. Casos Especiais

| Caso | Ação |
|------|------|
| Nenhum backend workflow | Documentar explicitamente |
| Workflows duplicados | Identificar e marcar |
| Scheduled workflows | Incluir cron/intervalo |

## 6. Critérios de Qualidade
- Ordem de ações preservada
- Condições documentadas
- Anti-padrões identificados
