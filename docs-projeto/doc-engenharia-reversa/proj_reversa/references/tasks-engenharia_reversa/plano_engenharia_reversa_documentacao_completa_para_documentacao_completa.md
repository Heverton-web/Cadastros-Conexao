# Plano de Engenharia Reversa: Documentação Completa

## Objetivo

Analisar `gestao-contratos-conexao-documentacao-completa-2026-06-18.md` e estruturar os passos necessários para recriar esse mesmo documento a partir de `appBubble - cadastros.annotado.json`.

## O que o arquivo contém

O documento `gestao-contratos-conexao-documentacao-completa-2026-06-18.md` é um arquivo agregado de documentação de projeto que inclui ao menos estas seções:

- `# Tabelas de Dados (Data Types)`
- `# Option Sets`

Não há indicação de seções de páginas ou workflows dentro desse arquivo. Ou seja, ele combina documentação de data types e option sets em um único PDF/Markdown.

## Conclusão principal

A geração deste documento completo requer duas etapas principais a partir do JSON Bubble:

1. extrair e documentar os Data Types definidos em `appBubble - cadastros.annotado.json`;
2. extrair e documentar os Option Sets definidos em `appBubble - cadastros.annotado.json`.

## Passos para recriar o arquivo completo

1. **Limpar e parsear o JSON anotado**
   - Abrir `appBubble - cadastros.annotado.json`.
   - Remover comentários `// ...` e `/* ... */` fora de strings.
   - Processar o JSON resultante de modo que possa ser carregado com `json.loads`.

2. **Extrair Data Types**
   - Localizar o bloco de Data Types no JSON exportado.
   - Para cada Data Type, extrair:
     - nome do Data Type
     - campos do Data Type
     - tipo de cada campo
     - se o campo é obrigatório
     - se o Data Type ou campo está marcado como deletado/excluído
   - Gerar Markdown por Data Type com este padrão:
     - `# <Nome> (Data Type)`
     - `## Summary`
     - `## Campos`
     - tabela Markdown `Campo | Tipo | Obrigatório`

3. **Extrair Option Sets**
   - Localizar o bloco de Option Sets no JSON exportado.
   - Para cada Option Set, extrair:
     - nome do Option Set
     - descrição ou summary, se houver
     - lista de opções com display/value e quaisquer metadados relevantes (`sort_factor`, `link`, etc.)
   - Gerar Markdown por Option Set com este padrão:
     - `# <Nome> (Option Set)` ou `# <Nome>` quando apropriado
     - `## Summary`
     - `## Opções`
     - tabela Markdown com as colunas relevantes para cada option set

4. **Concatenar as seções em um único documento**
   - Iniciar o documento com:
     - `# Documentação do Projeto: gestao-contratos-conexao`
     - `*Exportado em: <data>*`
     - `---`
   - Em seguida, incluir a seção:
     - `# Tabelas de Dados (Data Types)`
     - todas as entradas de Data Types geradas
   - Depois, incluir a seção:
     - `# Option Sets`
     - todas as entradas de Option Sets geradas

5. **Validar consistência do conteúdo**
   - Comparar os nomes e campos gerados com o conteúdo real de `gestao-contratos-conexao-documentacao-completa-2026-06-18.md`.
   - Verificar se todos os Option Sets e Data Types que aparecem no documento estão presentes no JSON exportado.
   - Confirmar que o documento completo não está omitindo seções adicionais que existam no JSON.

6. **Gerar notas de engenharia reversa**
   - Documentar diferenças de nomenclatura entre o JSON e o Markdown final.
   - Anotar quais Data Types estão marcados como deletados e como isso deve ser refletido no documento.
   - Anotar quais Option Sets incluem metadados especiais (ex.: `link`, `sort_factor`) e como apresentar essas colunas.

## Observações importantes

- Embora este documento seja chamado de "Documentação Completa", ele não inclui necessariamente páginas ou workflows; ele é uma combinação de Data Types e Option Sets.
- Se o JSON também contiver um bloco `pages`, esse bloco não faz parte deste arquivo específico, mas pode ser reutilizado em um documento separado de páginas.
- A geração de `gestao-contratos-conexao-documentacao-completa-2026-06-18.md` deve ser implementada como um pipeline de extração de Data Types + Option Sets, não como uma conversão direta de páginas.

## Resultado salvo

- Arquivo de plano salvo em `bubble_reverse_engineering_notes/plano_engenharia_reversa_documentacao_completa_para_documentacao_completa.md`.
