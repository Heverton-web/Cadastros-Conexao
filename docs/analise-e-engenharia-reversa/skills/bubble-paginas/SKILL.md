---
name: bubble-paginas
description: >
  SKILL AUTÔNUMA. Documenta páginas Bubble: layouts, elementos visuais, grupos,
  fluxos navegação. Executa sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:
- JSON path
- `output_dir` — diretório base artefatos

## Processamento

### Fase A0: Criar pastas saída
- Criar `{output_dir}/relatorios/paginas/`

### Fase A: Localizar Páginas
- Acessar bloco `pages` no JSON
- Se não existir, gerar `{output_dir}/relatorios/paginas/pages_report.md` com "Nenhuma página encontrada."

### Fase B: Extrair Metadados
- Cada página: name, title, type
- Identificar página inicial (index)

### Fase C: Mapear Elementos
- Percorrer árvore elementos recursivamente
- Identificar: groups, buttons, texts, inputs, images, repeating groups
- Mapear hierarquia pai-filho (`current_parent`)

### Fase D: Mapear Workflows Página
- Cada workflow: trigger, condições, ações
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
## Actions
1. ...
```

## Saída
- `{output_dir}/relatorios/paginas/pages_report.md` (consolidado)
- `{output_dir}/relatorios/paginas/<nome_pagina>.md` (individual)
- `{output_dir}/relatorios/paginas/resumo_paginas.md` (índice)

## Validação Automática

- [ ] Todas páginas do JSON documentadas
- [ ] Cada elemento tem ID único
- [ ] Workflows vinculados ao elemento correto
- [ ] Hierarquia grupos preservada

Loop: até 3 tentativas correção.

## Casos Especiais

| Caso | Ação |
|------|------|
| Popups/overlays | Documentar como sub-páginas |
| Elementos condicionais | Marcar condição |
| Elementos deletados | Incluir com aviso |
| Nenhuma página | "Nenhuma página encontrada" |

## Critérios Qualidade
- Mapear todos elementos interativos e eventos
- Documentar condições exibição
- Relacionar páginas com workflows e APIs
