# Tarefa: bubble-workflows (Execução Autônoma)

## Objetivo

Analisar e documentar toda a lógica de negócio contida nos workflows do `appBubble.json`.

## Execução

Esta tarefa é executada **automaticamente** pelo Tech Lead como parte do pipeline completo. Nenhuma confirmação humana é necessária.

## Referência

`proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_backend_workflows.md`
`skills/bubble-workflows-backend/SKILL.md`

## Escopo

- Workflows de página (Reset de Senha, Login)
- Backend workflows (se existirem)
- Workflows agendados (scheduled)

## Processamento (Automático)

1. Buscar `backend_workflows` no JSON
2. Extrair workflows de página de `pages.<id>.workflows`
3. Para cada workflow: trigger, condições, ações
4. Se nenhum encontrado → "Nenhum workflow encontrado"

## Validações Automáticas

- [ ] Todos os workflows encontrados
- [ ] Trigger documentado
- [ ] Ordem de ações preservada

## Status: Pipeline Autônomo
