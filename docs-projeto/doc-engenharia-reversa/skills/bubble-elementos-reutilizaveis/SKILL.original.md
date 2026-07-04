---
name: bubble-elementos-reutilizaveis
description: >
  SKILL AUTÔNUMA. Identifica e documenta elementos reutilizáveis do Bubble.
  Executa completamente sem intervenção humana.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:

1. Lê o JSON do caminho fornecido
2. Processa elementos reutilizáveis
3. Gera documentação completa
4. Retorna o resultado

## 1. Entrada

- Caminho do arquivo JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base para salvar artefatos (fornecido pelo Tech Lead)
- JSON pode conter `reusable_elements` ou `components`

## 2. Processamento (automático)

### Fase A0: Criar pastas de saída

- Criar `{output_dir}/relatorios/elementos_reutilizaveis/` se não existir

### Fase A: Localizar Elementos

- Buscar `reusable_elements` ou `components` no JSON
- Se não existir, gerar `{output_dir}/relatorios/elementos_reutilizaveis/elementos_reutilizaveis_report.md` com "Nenhum elemento reutilizável encontrado." e encerrar

### Fase B: Extrair Metadados

- Nome, display_name, properties

### Fase C: Mapear Estrutura

- Elementos visuais internos
- Hierarquia de grupos
- Workflows associados

### Fase D: Mapear Uso em Páginas

- Onde cada componente é instanciado
- Valores passados como propriedades

### Fase E: Gerar Markdown

```markdown
# Elementos Reutilizáveis

## <Nome>

# <Nome> (Reusable Element)

## Summary

## Propriedades

## Elementos Internos

## Workflows

## Uso em Páginas
```

## 3. Saída

- `{output_dir}/relatorios/elementos_reutilizaveis/elementos_reutilizaveis_report.md` (consolidado)
- `{output_dir}/relatorios/elementos_reutilizaveis/<nome>.md` (um por elemento)
- `{output_dir}/relatorios/elementos_reutilizaveis/catalogo_elementos.md` (catálogo)

## 4. Validação Automática

- [ ] Todos os elementos reutilizáveis encontrados
- [ ] Propriedades documentadas com tipo
- [ ] Workflows internos mapeados
- [ ] Uso em páginas rastreado

Loop automático: até 3 tentativas.

## 5. Casos Especiais

| Caso                     | Ação                      |
| ------------------------ | ------------------------- |
| Nenhum elemento          | Documentar explicitamente |
| Propriedades não tipadas | Marcar como "any"         |
| Elementos deletados      | Incluir com aviso         |

## 6. Critérios de Qualidade

- Precisão: propriedades e uso corretos
- Completude: sem omissões
- Padrão: identificar boas práticas
