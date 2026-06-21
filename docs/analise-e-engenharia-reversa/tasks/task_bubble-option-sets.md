# Tarefa: bubble-option-sets (Execução Autônoma)

## Objetivo
Mapear todos os Option Sets definidos no JSON e documentar nome, opções disponíveis, uso em páginas/tabelas/workflows e valores padrão.

## Execução
Esta tarefa é executada **automaticamente** pelo Tech Lead como parte do pipeline completo. Nenhuma confirmação humana é necessária.

## Referência
`proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_option_sets.md`
`skills/bubble-option-sets/SKILL.md`

## Escopo
- Identificar todos os objetos com `option_set`
- Listar opções (valor interno e label exibido)
- Relacionar com campos que os utilizam

## Processamento (Automático)
1. Localizar `option_sets` no JSON
2. Se ausente → "Nenhum option set encontrado"
3. Para cada option set: name, values, columns
4. Gerar Markdown com tabela de opções

## Validações Automáticas
- [ ] Todos os option sets do JSON cobertos
- [ ] Valores têm pelo menos uma coluna
- [ ] Option sets deletados marcados

## Status: Pipeline Autônomo
