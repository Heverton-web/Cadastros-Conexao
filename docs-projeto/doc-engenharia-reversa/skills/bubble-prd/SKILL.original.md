---
name: bubble-prd
description: >
  SKILL AUTÔNUMA. Gera o PRD completo do projeto Bubble, consolidando Data
  Types e Option Sets em documento único. Executa completamente sem intervenção.
---

## EXECUÇÃO AUTÔNOMA

Esta skill **não pergunta nada ao usuário**. Quando chamada pelo Tech Lead:

1. Coleta saídas de `bubble-tabelas` e `bubble-option-sets`
2. Consolida em documento único
3. Valida cruzadamente com o JSON
4. Retorna o resultado

## 1. Entrada

- Caminho do JSON do Bubble (fornecido pelo Tech Lead)
- `output_dir` — diretório base onde as skills salvaram seus artefatos (fornecido pelo Tech Lead)
- Saídas de `bubble-tabelas` e `bubble-option-sets` (já geradas em `{output_dir}/relatorios/`)

## 2. Processamento (automático)

### Fase A0: Criar pastas de saída

- Criar `{output_dir}/documentacao_completa/` se não existir

### Fase A: Coletar Documentos

- Ler `{output_dir}/relatorios/tabelas/tables_report.md` (se existir)
- Ler `{output_dir}/relatorios/option_sets/option_sets_report.md` (se existir)

### Fase B: Consolidar

```markdown
# Documentação do Projeto: gestao-contratos-conexao

_Exportado em: <data>_
---

# Tabelas de Dados (Data Types)

<conteúdo das tabelas>

# Option Sets

<conteúdo dos option sets>
```

### Fase C: Validação Cruzada

- Confirmar que todos os Data Types do JSON estão no documento
- Confirmar que todos os Option Sets do JSON estão no documento
- Verificar consistência de nomes entre seções
- Marcar divergências como notas de engenharia reversa

## 3. Saída

- `{output_dir}/documentacao_completa/PRD_DOCUMENTACAO_COMPLETA.md`

## 4. Validação Automática

- [ ] Todos os Data Types presentes
- [ ] Todos os Option Sets presentes
- [ ] Consistência de nomes
- [ ] Notas de engenharia reversa incluídas

Loop automático: até 3 tentativas.

## 5. Casos Especiais

| Caso                  | Ação                          |
| --------------------- | ----------------------------- |
| Nenhum Data Type      | Incluir seção vazia com aviso |
| Nenhum Option Set     | Incluir seção vazia com aviso |
| Divergências de nomes | Documentar como nota técnica  |

## 6. Critérios de Qualidade

- Seguir formato do plano de engenharia reversa
- Consistência entre seções
- Documento autocontido
- Rastreabilidade ao JSON original
