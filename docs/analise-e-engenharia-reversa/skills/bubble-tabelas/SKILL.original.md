---
name: bubble-tabelas
description: >
  SKILL AUTÔNOMA. Analisa a estrutura de tabelas do Bubble a partir do JSON,
  mapeia campos/tipos/relacionamentos e gera documentação Markdown. Executa
  completamente sem intervenção humana.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:
1. Lê o JSON do caminho fornecido
2. Processa todos os Data Types
3. Gera documentação completa
4. Retorna o resultado

## 1. Entrada
- Caminho do arquivo JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base para salvar os artefatos (fornecido pelo Tech Lead)
- JSON deve conter bloco `data_types` ou `_index.data_types`

## 2. Processamento (automático)

### Fase A: Criar pastas de saída
- Criar `{output_dir}/relatorios/tabelas/` se não existir

### Fase B: Preparação
- Extrair e limpar JSON (remover comentários `//` e `/* */`)
- Validar sintaxe JSON

### Fase C: Localizar Data Types
- Acessar bloco `data_types` no JSON parseado
- Se não existir, gerar: `# Tabelas de Dados (Data Types)\n\nNenhum data type encontrado.` para `{output_dir}/relatorios/tabelas/tables_report.md` e encerrar

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
# <Nome> (Data Type)
## Summary
[description]
## Campos
| Campo | Tipo | Obrigatório |
```

### Fase F: Validar e Salvar
- Verificar que arquivo não está vazio
- Confirmar total de tabelas
- Salvar consolidado em `{output_dir}/relatorios/tabelas/tables_report.md`
- Salvar arquivos individuais em `{output_dir}/relatorios/tabelas/<nome>.md`

## 3. Saída
- `{output_dir}/relatorios/tabelas/tables_report.md` (consolidado)
- `{output_dir}/relatorios/tabelas/<nome>.md` (um por data type)

## 4. Validação Automática (sem perguntar)

Após gerar, validar:
- [ ] Bloco `data_types` existe no JSON
- [ ] Cada data type tem `name` e `fields`
- [ ] Campos deletados foram filtrados
- [ ] Tipos foram traduzidos corretamente

Se alguma validação falhar: re-executar com correção automática (máx 3x).
Se após 3 tentativas ainda falhar: retornar documento com "limitação conhecida".

## 5. Tradução de Tipos

| Tipo Técnico | Tipo Legível |
|---|---|
| text | text |
| number | number |
| custom_cliente | custom.cliente |
| option_set_tipo | option.tipo |
| list_custom_cliente | list of custom `cliente` |

## 6. Casos Especiais (tratamento automático)

| Caso | Ação |
|------|------|
| Data Type deletado | Incluir com aviso no Summary |
| Campo deletado | Não incluir na tabela |
| Campo com default | Mostrar "Não (default: valor)" |
| Data Types ausentes | Documentar "Nenhum data type encontrado" |

## 7. Critérios de Qualidade
- Completude: todos os campos e relacionamentos descritos
- Clareza: terminologia padronizada
- Precisão: tipos e cardinalidades corretos
