# Conclusões de engenharia reversa - Bubble export

Estas conclusões foram geradas a partir da análise do arquivo `appBubble - cadastros.annotado.json` e do documento alvo `gestao-contratos-conexao-paginas-2026-06-18.md`.

## Objetivo

- Definir como recriar o arquivo de documentação alvo a partir do JSON anotado exportado pelo Bubble.
- Identificar a estrutura do documento gerado e os padrões de mapeamento entre páginas, workflows e ações.

## Estrutura do documento alvo

1. `# Páginas`
   - Cada página recebe um bloco de documentação com:
     - `## <page_name>`
     - `# <page_name>`
     - `## Summary`
     - `### UI`
     - `### Workflows`
2. Seções de workflows detalhadas independentes:
   - `### Workflow <workflow_id>`
   - `# Workflow <workflow_name>`
   - `## Summary`
   - `## Actions`

## Mapeamento do JSON Bubble

- `pages` no JSON -> páginas no documento
- `page.name` -> título de página
- `page.elements` -> itens da seção `UI`
- `page.workflows` -> itens da seção `Workflows`
- `workflow.name` -> nome legível do workflow
- `workflow.trigger` -> evento de disparo do workflow
- `workflow.actions` -> sequência de ações a documentar
- `action.type` e `action.properties` -> descrição funcional das ações

## Regras para geração do documento

- Usar `name` ou `default_name` de elementos e workflows sempre que existir.
- Quando não houver `workflow.name`, nomear por tipo ou `Workflow <workflow_id>`.
- Traduzir ações principais para português em resumos e ações.
- Incluir informações de elementos alcançados por `ShowElement` / `HideElement` / `ChangePage`.
- Para as páginas principais, gerar um resumo de UI e workflows.
- Para workflows independentes, listar trigger e ações numeradas.

## Observações específicas

- O arquivo alvo combina documentação de página com workflow separados, inclusive workflows de `index`, `consultor` e `credenciais`.
- Há workflows de exibição/ocultação de elemento e workflows de mudança de estado que assumem nomes como `GERADOS`, `ENVIADOS`, `ANÁLISE`, `APROVADOS`, `REPROVADOS`, `CORREÇÃO`.
- A fidelidade do documento depende de identificar corretamente nomes legíveis e de traduzir ações do Bubble em frases compreensíveis.

## Localização

- Arquivo JSON fonte: `appBubble - cadastros.annotado.json`
- Documento alvo analisado: `gestao-contratos-conexao-paginas-2026-06-18.md`
- Notas salvas em: `bubble_reverse_engineering_notes/bubble_reverse_engineering_conclusoes.md`
