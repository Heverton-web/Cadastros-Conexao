---
name: bubble-api-connectors
description: >
  SKILL AUTÔNUMA. Documenta conectores API do Bubble. Executa sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:

- JSON path
- `output_dir` — diretório base artefatos
- JSON deve conter bloco `api_connectors` ou `plugins`

## Processamento

### Fase A0: Criar pastas saída

- Criar `{output_dir}/relatorios/api_connectors/`

### Fase A: Localizar API Connectors

- Buscar `api_connectors` no JSON
- Se não existir, gerar relatório com "Nenhum API connector encontrado."

### Fase B: Extrair Metadados

- Nome, base_url, headers globais
- Mascarar secrets (substituir por `[MASKED]`)

### Fase C: Processar Calls

```python
for conn_id, conn_data in api_connectors.items():
    name = conn_data.get('name', conn_id)
    base_url = conn_data.get('base_url', '')
    calls = conn_data.get('calls', [])
    for call in calls:
        method = call.get('method', 'GET')
        path = call.get('path', '')
        params = call.get('parameters', [])
```

### Fase D: Gerar Markdown

```markdown
# Chamadas de API (API Connectors)

## <NomeConector>

| Call | Método | Path |

## Parâmetros

## Response
```

## Saída

- `{output_dir}/relatorios/api_connectors/api_connectors_report.md` (consolidado)
- `{output_dir}/relatorios/api_connectors/<nome>.md` (individual)
- `{output_dir}/relatorios/api_connectors/resumo_api_connectors.md` (índice)

## Validação Automática

- [ ] Todos conectores documentados
- [ ] Secrets mascarados
- [ ] Métodos HTTP corretos
- [ ] Parâmetros diferenciados

Loop: até 3 tentativas.

## Casos Especiais

| Caso                 | Ação                |
| -------------------- | ------------------- |
| Conectores deletados | Incluir com aviso   |
| Sem autenticação     | "Pública"           |
| Nenhum conector      | "Nenhum encontrado" |

## Critérios Qualidade

- Segurança: nunca expor secrets
- Precisão: endpoints e métodos corretos
- Completude: headers, parâmetros, autenticação
