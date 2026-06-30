---
name: bubble-option-sets
description: >
  SKILL AUTÔNUMA. Documenta todos Option Sets do Bubble. Executa sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:

- JSON path
- `output_dir` — diretório base artefatos
- JSON deve conter bloco `option_sets`

## Processamento

### Fase A0: Criar pastas saída

- Criar `{output_dir}/relatorios/option_sets/`

### Fase A: Localizar Option Sets

- Buscar `option_sets` no JSON
- Se não existir, gerar relatório com "Nenhum option set encontrado."

### Fase B: Extrair Metadados

- Nome, display_name, deleted
- Detectar colunas dinâmicas

### Fase C: Processar Valores

```python
for os_id, os_data in option_sets_data.items():
    name = os_data.get('name', os_id)
    values = os_data.get('values', [])
    columns = os_data.get('columns', [])
```

### Fase D: Gerar Markdown

```markdown
# Option Sets

## <Nome>

| Col1 | Col2 |
| ---- | ---- |
| v1   | v1   |
```

## Saída

- `{output_dir}/relatorios/option_sets/option_sets_report.md` (consolidado)
- `{output_dir}/relatorios/option_sets/<nome>.md` (individual)
- `{output_dir}/relatorios/option_sets/resumo_option_sets.md` (índice)

## Validação Automática

- [ ] Todos option sets do JSON cobertos
- [ ] Valores têm pelo menos uma coluna
- [ ] Option sets deletados marcados

Loop: até 3 tentativas.

## Casos Especiais

| Caso                  | Ação                     |
| --------------------- | ------------------------ |
| Option sets deletados | Incluir com aviso        |
| Múltiplas colunas     | Detectar automaticamente |
| Nenhum option set     | "Nenhum encontrado"      |

## Critérios Qualidade

- Completude: todos option sets documentados
- Precisão: valores corretos
- Usabilidade: relacionar uso no sistema
