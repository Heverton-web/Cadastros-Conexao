# Tarefa: bubble-tabelas (Execução Autônoma)

## Objetivo
Identificar e documentar a estrutura de dados (Data Types / Tabelas) utilizada no aplicativo, inferida a partir do JSON.

## Execução
Esta tarefa é executada **automaticamente** pelo Tech Lead como parte do pipeline completo. Nenhuma confirmação humana é necessária.

## Referência
`proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_tabelas.md`
`skills/bubble-tabelas/SKILL.md`

## Escopo
- Tipos de dados customizados (ex: `user`, `custom.cliente`)
- Campos e tipos de cada tabela
- Relacionamentos (referências entre tabelas)
- Option Sets utilizados como campos
- Cobertura de ~17 Data Types esperados

## Arquivo Alvo
`gestao-contratos-conexao-tabelas.md`

## Estrutura Esperada no JSON
```json
{
  "data_types": {
    "id_1": {
      "name": "LOG",
      "display_name": "LOG",
      "description": "",
      "deleted": false,
      "fields": [
        {"name": "A. Quem realizou", "type": "text", "required": false, "deleted": false}
      ]
    }
  }
}
```

## Processamento (Automático)
1. Extrair e limpar JSON (remover `//` e `/* */`)
2. Validar sintaxe JSON
3. Localizar bloco `data_types`
4. Se ausente → gerar "Nenhum data type encontrado" e encerrar
5. Para cada data type: extrair name, fields, deleted
6. Ordenar por nome, filtrar campos deletados
7. Traduzir tipos técnicos para legíveis
8. Gerar Markdown seguindo estrutura do alvo
9. Salvar e validar

## Validações Automáticas
- [ ] Bloco `data_types` existe no JSON? (se não, documento vazio é aceitável)
- [ ] Total de ~17 data types encontrados?
- [ ] Cada data type tem `name` e `fields`?
- [ ] Campos deletados foram filtrados?
- [ ] Tipos traduzidos corretamente?

## Casos Especiais
| Caso | Ação |
|------|------|
| Data Type deletado | Incluir com aviso no Summary |
| Campo deletado | Não incluir na tabela |
| Nenhum data type | Documentar "Nenhum encontrado" |

## Status: Pipeline Autônomo
