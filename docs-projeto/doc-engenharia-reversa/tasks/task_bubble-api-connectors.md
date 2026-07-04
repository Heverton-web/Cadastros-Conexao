# Tarefa: bubble-api-connectors (Execução Autônoma)

## Objetivo

Mapear e documentar todos os conectores de API definidos no aplicativo Bubble.

## Execução

Esta tarefa é executada **automaticamente** pelo Tech Lead como parte do pipeline completo. Nenhuma confirmação humana é necessária.

## Referência

`proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_api_connectors.md`
`skills/bubble-api-connectors/SKILL.md`

## Escopo

- APIs externas configuradas
- Endpoints, métodos, autenticação
- Workflows que utilizam esses conectores

## Processamento (Automático)

1. Localizar `api_connectors` no JSON
2. Se ausente → "Nenhum API connector encontrado"
3. Para cada conector: name, base_url, headers, calls
4. Mascarar secrets
5. Gerar Markdown com Calls, Parâmetros, Response

## Validações Automáticas

- [ ] Todos os conectores documentados
- [ ] Secrets mascarados
- [ ] Métodos HTTP corretos

## Status: Pipeline Autônomo
