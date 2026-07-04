# Plano de Engenharia Reversa: Páginas

**Arquivo Alvo:** `gestao-contratos-conexao-paginas-2026-06-18.md`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---

## 1. Objetivo

Analisar o arquivo de páginas e estruturar um plano para recriar esse documento a partir do JSON anotado exportado pelo Bubble.

## 2. Análise do Arquivo Alvo

### O que foi analisado

- `gestao-contratos-conexao-tabelas-2026-06-18.md`: documento de Data Types (tabelas) gerado a partir do JSON do Bubble.
- `gestao-contratos-conexao-paginas-2026-06-18.md`: documento de páginas e workflows.
- `appBubble - cadastros.annotado.json`: exportação Bubble anotada com comentários PT-BR.

## 3. Conclusão Principal

O arquivo `gestao-contratos-conexao-tabelas-2026-06-18.md` documenta Data Types e não a estrutura de páginas. Ele confirma que o JSON fonte contém blocos distintos para:

- `pages` → páginas + elementos + workflows
- `user_types` / `data_types` → Data Types usados no sistema

Portanto, a recriação do arquivo de páginas deve focar no bloco `pages` do JSON.

## 4. Padrões Identificados

### `gestao-contratos-conexao-tabelas-2026-06-18.md`

- Cada Data Type aparece como:
  - `# <Tipo>` ou `# <Tipo> (Data Type)`
  - `## Summary`
  - `## Campos`
  - tabela Markdown com `Campo | Tipo | Obrigatório`
- Campos marcados como deletados aparecem com `- deleted` no nome ou tipo.
- Data Types excluídos são documentados, mas com aviso de marcação como excluído.

### `gestao-contratos-conexao-paginas-2026-06-18.md`

- Estrutura de página e workflows:
  - `# Páginas`
  - Para cada página:
    - `## <page_name>`
    - `# <page_name>`
    - `## Summary`
    - `### UI`
    - `### Workflows`
- Workflows independentes também têm seções próprias:
  - `### Workflow <workflow_id>`
  - `# Workflow <nome ou id>`
  - `## Summary`
  - `## Actions`
- Nomes amigáveis de workflows podem vir de `workflow.name` ou de interpretação de ações quando o nome não existe.

## Passos para recriar o arquivo de páginas

1.  **Ler e limpar o JSON anotado**
    - Abrir `appBubble - cadastros.annotado.json`.
    - Remover comentários `// ...` e `/* ... */` fora de strings.
    - Lidar com caracteres de controle ou strings malformadas antes do parse JSON.

2.  **Extrair o bloco `pages`**
    - O documento de páginas deve ser construído a partir de `data['pages']`.
    - Cada chave interna de `pages` representa uma página Bubble.

3.  **Extrair metadados da página**
    Para cada página no bloco `pages`:
    - `page_name = page['name']` ou a chave de página quando não houver nome legível.
    - `page_type = page['type']` (geralmente `Page`).
    - `elements = page.get('elements', {})`.
    - `workflows = page.get('workflows', {})`.
    - `properties = page.get('properties', {})`.

4.  **Gerar seção de página**
    - `## <page_name>`
    - `# <page_name>`
    - `## Summary`
      - Criar texto descritivo curto usando o propósito da página, seus elementos e workflows visíveis.
    - `### UI`
      - Listar elementos principais: grupos, inputs, botões, textos, imagens, alerts.
      - Incluir `name` ou `default_name` do elemento e seu `type`.
      - Incluir labels e placeholders quando disponíveis em `properties`.

5.  **Extrair e documentar workflows por página**
    - Para cada workflow:
      - Identificar `workflow_id` e `workflow.name`.
      - Extrair `workflow.trigger` ou `workflow.event`.
      - Extrair `workflow.actions`, ordenando a execução.
      - Mapear ações Bubble para descrições legíveis:
        - `ResetPassword` → redefinição de senha / validação de campos
        - `ChangePage` → redirecionamento para página alvo
        - `LogIn` → login de usuário
        - `ShowElement` / `HideElement` → exibir/ocultar elemento
        - `SendPasswordResetEmail` → enviar email de redefinição
        - `Create a new thing` / `Delete a thing` / `DeleteListOfThings` → criar/excluir registros
        - `SetCustomState` → definir estado customizado
        - `DisplayGroupData` → mostrar dados em grupo ou elemento
        - `Pause` → pausar execução

6.  **Gerar seção de workflows independentes**
    - Alguns workflows recebem documentação separada em `gestao-contratos-conexao-paginas-2026-06-18.md`.
    - Para cada workflow global ou nomeado:
      - `### Workflow <workflow_id>`
      - `# Workflow <workflow_name ou workflow_id>`
      - `## Summary`
      - `## Actions`
    - Use `workflow.name` sempre que disponível; caso contrário, derive um título da sequência de ações.

7.  **Gerar sumários de páginas e workflows**
    - Os resumos devem ser narrativos e em português.
    - Use as ações principais como base para o resumo:
      - ex: “Este workflow reseta a senha do usuário e, em seguida, redireciona para a página de login.”
      - ex: “Este workflow é acionado ao clicar em um botão específico e oculta um elemento de mensagem de erro.”

8.  **Validar com `gestao-contratos-conexao-tabelas-2026-06-18.md`**
    - Embora a tabela seja um documento de tipos de dados, ela ajuda a validar nomes de campos e tipos usados nas ações.
    - Use-a como referência para interpretar campos como `user`, `custom.cliente`, `option set` e nomes de atributos de dados.

## Observações importantes

- `gestao-contratos-conexao-tabelas-2026-06-18.md` ajuda a confirmar a nomenclatura de Data Types, mas não substitui a lógica de páginas.
- A geração de `gestao-contratos-conexao-paginas-2026-06-18.md` deve ser baseada exclusivamente no bloco `pages` do JSON.
- O documento de páginas inclui fluentemente:
  - páginas de login e reset de senha
  - workflows de sucesso/erro
  - workflows de mudança de estado e navegação

## Resultado salvo

- Arquivo de análise e plano salvo em:
  - `bubble_reverse_engineering_notes/reverse_engineering_plan_paginas.md`
