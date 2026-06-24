---
name: bubble-tabelas
description: >
  SKILL AUTÔNUMA. Analisa estrutura tabelas Bubble a partir do JSON, mapeia
  campos/tipos/relacionamentos, gera documentação Markdown. Sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:
- JSON path
- `output_dir` — diretório base artefatos
- JSON pode ter `data_types` ou `_index.data_types` ou `user_types`

## Processamento

### Fase A: Criar pastas saída
- Criar `{output_dir}/relatorios/tabelas/`

### Fase B: Preparação
- Extrair e limpar JSON (remover comentários `//`, `/* */`)
- Validar sintaxe JSON

### Fase C: Localizar Data Types
- Buscar `data_types` no JSON
- Se não existir, buscar `_index.data_types` ou `user_types`
- Se nenhum existir, gerar: `# Tabelas de Dados (Data Types)\n\nNenhum data type encontrado.` para `{output_dir}/relatorios/tabelas/tables_report.md`

### Fase D: Processar cada Data Type
```python
for dt_id, dt_data in data_types_data.items():
    name = dt_data.get('name', dt_id)
    description = dt_data.get('description', '')
    deleted = dt_data.get('deleted', False)
    fields = dt_data.get('fields', [])
```
- Ordenar por nome
- Filtrar campos deletados
- Traduzir tipos técnicos

### Fase E: Gerar Markdown
```markdown
# Tabelas de Dados (Data Types)

## <Nome>
| Campo | Tipo | Obrigatório |
```

### Fase F: Validar e Salvar
- Verificar arquivo não vazio
- Confirmar total tabelas
- Consolidado: `{output_dir}/relatorios/tabelas/tables_report.md`
- Individuais: `{output_dir}/relatorios/tabelas/<nome>.md`

## Saída
- `{output_dir}/relatorios/tabelas/tables_report.md` (consolidado)
- `{output_dir}/relatorios/tabelas/<nome>.md` (individual)

## Validação Automática

- [ ] Bloco `data_types`/`user_types` existe no JSON
- [ ] Cada data type tem `name` e `fields`
- [ ] Campos deletados filtrados
- [ ] Tipos traduzidos corretamente

Loop: até 3 tentativas. Se falhar: "limitação conhecida".

## Tradução Tipos

| Técnico | Legível |
|---------|---------|
| text | text |
| number | number |
| boolean | boolean |
| date | date |
| custom_X | custom.X |
| option_set_X | option.X |
| list_custom_X | list of custom X |

## Casos Especiais

| Caso | Ação |
|------|------|
| Data Type deletado | Incluir com aviso no Summary |
| Campo deletado | Não incluir na tabela |
| Campo com default | "Não (default: valor)" |
| Data Types ausentes | "Nenhum data type encontrado" |

## Critérios Qualidade
- Completude: todos campos e relacionamentos descritos
- Clareza: terminologia padronizada
- Precisão: tipos e cardinalidades corretos
