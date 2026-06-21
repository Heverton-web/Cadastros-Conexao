---
name: bubble-paginas
description: >
  SKILL AUTÔNUMA. Documenta as páginas do Bubble, mapeando layouts, elementos
  visuais, grupos e fluxos de navegação. Executa completamente sem intervenção.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:
1. Lê o JSON do caminho fornecido
2. Processa todas as páginas
3. Gera documentação completa
4. Retorna o resultado

## 1. Entrada
- Caminho do arquivo JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base para salvar artefatos (fornecido pelo Tech Lead)
- JSON deve conter bloco `pages`

## 2. Processamento (automático)

### Fase A0: Criar pastas de saída
- Criar `{output_dir}/relatorios/paginas/` se não existir

### Fase A: Localizar Páginas
- Acessar bloco `pages` no JSON
- Se não existir, gerar `{output_dir}/relatorios/paginas/pages_report.md` com "Nenhuma página encontrada." e encerrar

### Fase B: Extrair Metadados
- Para cada página: name, title, type
- Identificar página inicial (index)

### Fase C: Mapear Elementos
- Percorrer árvore de elementos recursivamente
- Identificar: groups, buttons, texts, inputs, images, repeating groups
- Mapear hierarquia pai-filho

### Fase D: Mapear Workflows de Página
- Para cada workflow: trigger, condições, ações
- Vincular a elementos específicos por ID

### Fase E: Gerar Markdown
```markdown
# <NomeDaPagina>
## Summary
### UI
* **Elemento** (Tipo) - Descrição.
### Workflows
- **Trigger**: Ações
### Workflow <ID>
**Trigger:** ...
## Summary
## Actions
1. ...
```

## 3. Saída
- `{output_dir}/relatorios/paginas/pages_report.md` (consolidado)
- `{output_dir}/relatorios/paginas/<nome_pagina>.md` (uma por página)
- `{output_dir}/relatorios/paginas/resumo_paginas.md` (índice)

## 4. Validação Automática

Após gerar, validar:
- [ ] Todas as páginas do JSON foram documentadas
- [ ] Cada elemento tem ID único
- [ ] Workflows vinculados ao elemento correto
- [ ] Hierarquia de grupos preservada

Loop automático: até 3 tentativas de correção.

## 5. Casos Especiais (tratamento automático)

| Caso | Ação |
|------|------|
| Popups/overlays | Documentar como sub-páginas |
| Elementos condicionais | Marcar condição |
| Elementos deletados | Incluir com aviso |
| Nenhuma página | Documentar "Nenhuma página encontrada" |

## 6. Critérios de Qualidade
- Mapear todos os elementos interativos e seus eventos
- Documentar condições de exibição
- Relacionar páginas com workflows e APIs
