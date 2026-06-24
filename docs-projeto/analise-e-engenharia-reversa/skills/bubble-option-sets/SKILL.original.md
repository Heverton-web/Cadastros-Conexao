---
name: bubble-option-sets
description: >
  SKILL AUTÔNUMA. Documenta todos os Option Sets do Bubble. Executa
  completamente sem intervenção humana.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:
1. Lê o JSON do caminho fornecido
2. Processa todos os Option Sets
3. Gera documentação completa
4. Retorna o resultado

## 1. Entrada
- Caminho do arquivo JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base para salvar artefatos (fornecido pelo Tech Lead)
- JSON deve conter bloco `option_sets`

## 2. Processamento (automático)

### Fase A0: Criar pastas de saída
- Criar `{output_dir}/relatorios/option_sets/` se não existir

### Fase A: Localizar Option Sets
- Buscar `option_sets` no JSON
- Se não existir, gerar `{output_dir}/relatorios/option_sets/option_sets_report.md` com "Nenhum option set encontrado." e encerrar

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
# <Nome> (Option Set)
## Summary
## Opções
| Col1 | Col2 |
|------|------|
| v1   | v1   |
```

## 3. Saída
- `{output_dir}/relatorios/option_sets/option_sets_report.md` (consolidado)
- `{output_dir}/relatorios/option_sets/<option_set_nome>.md` (um por option set)
- `{output_dir}/relatorios/option_sets/resumo_option_sets.md` (índice)

## 4. Validação Automática

- [ ] Todos os option sets do JSON cobertos
- [ ] Valores têm pelo menos uma coluna
- [ ] Option sets deletados marcados

Loop automático: até 3 tentativas.

## 5. Casos Especiais

| Caso | Ação |
|------|------|
| Option sets deletados | Incluir com aviso |
| Múltiplas colunas | Detectar automaticamente |
| Nenhum option set | Documentar "Nenhum encontrado" |

## 6. Critérios de Qualidade
- Completude: todos os option sets documentados
- Precisão: valores corretos
- Usabilidade: relacionar uso no sistema
