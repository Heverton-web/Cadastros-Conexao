---
name: bubble-elementos-reutilizaveis
description: >
  SKILL AUTÔNUMA. Identifica e documenta elementos reutilizáveis Bubble.
  Executa sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:

- JSON path
- `output_dir` — diretório base artefatos
- JSON pode ter `reusable_elements` ou `components`

## Processamento

### Fase A0: Criar pastas saída

- Criar `{output_dir}/relatorios/elementos_reutilizaveis/`

### Fase A: Localizar Elementos

- Buscar `reusable_elements` ou `components` no JSON
- Se não existir, gerar relatório com "Nenhum elemento reutilizável encontrado."

### Fase B: Extrair Metadados

- Nome, display_name, properties

### Fase C: Mapear Estrutura

- Elementos visuais internos
- Hierarquia grupos
- Workflows associados

### Fase D: Mapear Uso em Páginas

- Onde cada componente instanciado
- Valores passados como propriedades

### Fase E: Gerar Markdown

```markdown
# Elementos Reutilizáveis

## <Nome>

### Propriedades

### Elementos Internos

### Workflows

### Uso em Páginas
```

## Saída

- `{output_dir}/relatorios/elementos_reutilizaveis/elementos_reutilizaveis_report.md` (consolidado)
- `{output_dir}/relatorios/elementos_reutilizaveis/<nome>.md` (individual)
- `{output_dir}/relatorios/elementos_reutilizaveis/catalogo_elementos.md` (catálogo)

## Validação Automática

- [ ] Todos elementos reutilizáveis encontrados
- [ ] Propriedades documentadas com tipo
- [ ] Workflows internos mapeados
- [ ] Uso em páginas rastreado

Loop: até 3 tentativas.

## Casos Especiais

| Caso                     | Ação                      |
| ------------------------ | ------------------------- |
| Nenhum elemento          | Documentar explicitamente |
| Propriedades não tipadas | "any"                     |
| Elementos deletados      | Incluir com aviso         |

## Critérios Qualidade

- Precisão: propriedades e uso corretos
- Completude: sem omissões
- Padrão: identificar boas práticas
