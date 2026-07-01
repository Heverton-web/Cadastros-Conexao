---
name: bubble-prd
description: >
  SKILL AUTÔNUMA. Gera PRD completo projeto Bubble, consolidando Data Types
  e Option Sets em documento único. Executa sem intervenção.
---

## EXECUÇÃO AUTÔNUMA

No questions. Tech Lead fornece:

- JSON path
- `output_dir` — diretório base onde skills salvaram artefatos
- Saídas de `bubble-tabelas` e `bubble-option-sets` em `{output_dir}/relatorios/`

## Processamento

### Fase A0: Criar pastas saída

- Criar `{output_dir}/documentacao_completa/`

### Fase A: Coletar Documentos

- Ler `{output_dir}/relatorios/tabelas/tables_report.md` (se existir)
- Ler `{output_dir}/relatorios/option_sets/option_sets_report.md` (se existir)

### Fase B: Consolidar

```markdown
# Documentação do Projeto: <nome>

_Exportado em: <data>_
---

# Tabelas de Dados (Data Types)

<conteúdo tabelas>

# Option Sets

<conteúdo option sets>
```

### Fase C: Validação Cruzada

- Confirmar todos Data Types do JSON estão no documento
- Confirmar todos Option Sets do JSON estão no documento
- Verificar consistência nomes entre seções
- Marcar divergências como notas engenharia reversa

## Saída

- `{output_dir}/documentacao_completa/PRD_DOCUMENTACAO_COMPLETA.md`

## Validação Automática

- [ ] Todos Data Types presentes
- [ ] Todos Option Sets presentes
- [ ] Consistência nomes
- [ ] Notas engenharia reversa incluídas

Loop: até 3 tentativas.

## Casos Especiais

| Caso               | Ação                         |
| ------------------ | ---------------------------- |
| Nenhum Data Type   | Seção vazia com aviso        |
| Nenhum Option Set  | Seção vazia com aviso        |
| Divergências nomes | Documentar como nota técnica |

## Critérios Qualidade

- Seguir formato plano engenharia reversa
- Consistência entre seções
- Documento autocontido
- Rastreabilidade ao JSON original
