# Tarefa: bubble-paginas (Execução Autônoma)

## Objetivo
Mapear e documentar todas as páginas presentes no `appBubble.json`, incluindo estrutura hierárquica de elementos, nomes técnicos e visuais, componentes e workflows associados.

## Execução
Esta tarefa é executada **automaticamente** pelo Tech Lead como parte do pipeline completo. Nenhuma confirmação humana é necessária.

## Referência
`proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_paginas.md`
`skills/bubble-paginas/SKILL.md`

## Escopo
- Página `reset_pw` (ID: AAL)
- Página `404` (ID: AAU)
- Página `index` (ID: bTHFf)
- Demais páginas identificadas no JSON

## Processamento (Automático)
1. Localizar bloco `pages` no JSON
2. Se ausente → "Nenhuma página encontrada"
3. Para cada página: extrair name, title, type, elements, workflows
4. Percorrer árvore de elementos recursivamente
5. Gerar Markdown com hierarquia e workflows

## Validações Automáticas
- [ ] Todas as páginas do JSON foram documentadas
- [ ] Cada elemento tem ID único
- [ ] Hierarquia de grupos preservada
- [ ] Links entre páginas documentados

## Status: Pipeline Autônomo
