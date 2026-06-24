---
name: bubble-api-connectors
description: >
  SKILL AUTÔNUMA. Documenta conectores de API do Bubble. Executa completamente
  sem intervenção humana.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:
1. Lê o JSON do caminho fornecido
2. Processa todos os API Connectors
3. Gera documentação completa
4. Retorna o resultado

## 1. Entrada
- Caminho do arquivo JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base para salvar artefatos (fornecido pelo Tech Lead)
- JSON deve conter bloco `api_connectors` ou `plugins`

## 2. Processamento (automático)

### Fase A0: Criar pastas de saída
- Criar `{output_dir}/relatorios/api_connectors/` se não existir

### Fase A: Localizar API Connectors
- Buscar `api_connectors` no JSON
- Se não existir, gerar `{output_dir}/relatorios/api_connectors/api_connectors_report.md` com "Nenhum API connector encontrado." e encerrar

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
# <NomeConector> (API Connector)
## Summary
## Calls
| Call | Método | Path |
## Parâmetros
## Response
```

## 3. Saída
- `{output_dir}/relatorios/api_connectors/api_connectors_report.md` (consolidado)
- `{output_dir}/relatorios/api_connectors/<nome>.md` (um por conector)
- `{output_dir}/relatorios/api_connectors/resumo_api_connectors.md` (índice)

## 4. Validação Automática

- [ ] Todos os conectores documentados
- [ ] Secrets mascarados
- [ ] Métodos HTTP corretos
- [ ] Parâmetros diferenciados

Loop automático: até 3 tentativas.

## 5. Casos Especiais

| Caso | Ação |
|------|------|
| Conectores deletados | Incluir com aviso |
| Sem autenticação | Documentar como "Pública" |
| Nenhum conector | Documentar "Nenhum encontrado" |

## 6. Critérios de Qualidade
- Segurança: nunca expor secrets
- Precisão: endpoints e métodos corretos
- Completude: headers, parâmetros e autenticação documentados
