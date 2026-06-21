# Plano de Engenharia Reversa: API Connectors

**Arquivo Alvo:** `gestao-contratos-conexao-api-connectors-2026-06-18.md`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---

## 1. Objetivo

Analisar o arquivo de API Connectors e estruturar um plano para recriar esse documento a partir do JSON anotado exportado pelo Bubble.

## 2. Análise do Arquivo Alvo

### Conteúdo

O documento `gestao-contratos-conexao-api-connectors-2026-06-18.md` documenta os conectores de API usados pelo projeto. Ele inclui:

- seção principal `# Chamadas de API (API Connectors)`;
- conectores individuais com nome e summary;
- tabelas de `Calls` com `Call`, `Método` e `Path`;
- subseções de cada `Call` com `## Summary`, `## Detalhes`, `## Parâmetros` e `## Response`.

Os conectores documentados incluem, entre outros:

- BUSCA CNPJ - CNPJ.WS
- Buscar DDI
- Consulta CNPJ
- BUSCA CRO
- CONSULTAS CRO 02
- Encurtador Link
- Evolution API
- Webhook N8N
- Webhook - Envio email Conexão
- TINYURL
- EMAILS (vários endpoints auxiliares)

## 3. Conclusão Principal

A reconstrução deste arquivo exige extrair do JSON Bubble:

- os conectores de API definidos em `api_connectors` ou blocos equivalentes;
- as chamadas (`calls`) associadas a cada conector;
- parâmetros de entrada e tipos;
- paths, métodos HTTP e metadados de autenticação;
- informações de response quando registradas.

Este arquivo é baseado em metadados de conectores e não em páginas ou workflows diretos, embora workflows possam referenciar esses connectors posteriormente.

## Passos para recriar o arquivo

1.  **Limpar e parsear o JSON anotado**
    - Abrir `appBubble - cadastros.annotado.json`.
    - Remover comentários `// ...` e `/* ... */` fora de strings.
    - Garantir que o JSON seja válido antes de carregar.

2.  **Localizar os blocos de API Connectors no JSON**
    - Procurar por estruturas como `api_connectors`, `api_connectors2`, `api.bubble` ou keys específicas de Bubble que contêm `api connectors`.
    - Identificar os conectores registrados no projeto com seus IDs e nomes.

3.  **Extrair metadados dos conectores**
    - Para cada conector, extrair:
      - nome do conector;
      - descrição ou summary, se disponível;
      - calls associadas.
    - Para cada call, extrair:
      - nome da call;
      - método HTTP;
      - path ou URL;
      - autenticação configurada;
      - parâmetros de entrada e obrigatoriedade;
      - formato do body, se configurado.

4.  **Gerar a seção de `Calls`**
    - Para cada conector, criar uma tabela Markdown `Call | Método | Path` idêntica ao formato do documento original.
    - Incluir todas as `calls` definidas para o conector.

5.  **Gerar subseções de cada `Call`**
    - Para cada call documentada no JSON, criar subseções como:
      - `### <Nome da Call>`
      - `# <Nome da Call>`
      - `## Summary`
      - `## Detalhes`
      - `## Parâmetros`
      - `## Response`
    - Documentar `Detalhes` em formato de tabela com `Método`, `Path`, `Autenticação` e outras propriedades relevantes.

6.  **Capturar respostas e exemplos quando disponíveis**
    - Extrair descrições de response e schemas configurados no JSON.
    - Quando houver exemplos de objeto ou campos de response, documentar com a mesma granularidade do arquivo original.

7.  **Manter o layout do documento original**
    - Incluir o título principal `# Chamadas de API (API Connectors)`.
    - Inserir separadores `---` entre blocos de conectores maiores, conforme o documento original.
    - Reduzir as entradas a metadados textuais sempre que a configuração mínima estiver disponível.

8.  **Validar com o documento existente**
    - Verificar se todos os conectores listados no Markdown existem no JSON exportado.
    - Confirmar se os caminhos e métodos extraídos batem com o documento de destino.
    - Ajustar a tradução de valores e a nomenclatura conforme os nomes amigáveis presentes no documento.

## Observações específicas

- Os documentos mostram conectores tanto para consultas de CNPJ/CRO quanto para serviços de envio de mensagens, encurtadores de URL e webhooks.
- Conectores de email e webhook no documento são muitos e semelhantes entre si; no JSON, provavelmente aparecem como várias `calls` sob um conector comum ou como conectores distintos.
- Alguns calls documentam parâmetros `body` genéricos (`body | text | Sim`) e objetos de response JSON; esses devem ser inferidos a partir de `request` e `response` no JSON.

## Resultado salvo

- Arquivo de plano salvo em `bubble_reverse_engineering_notes/plano_engenharia_reversa_api_connectors.md`.
