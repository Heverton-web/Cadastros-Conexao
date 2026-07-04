# Plano de Engenharia Reversa: Elementos Reutilizáveis

**Arquivo Alvo:** `gestao-contratos-conexao-elementos-reutilizaveis-2026-06-18.md`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---

## 1. Objetivo

Analisar o arquivo de Elementos Reutilizáveis e estruturar um plano para recriar esse documento a partir do JSON anotado exportado pelo Bubble.

O objetivo principal é:

- Identificar (ou confirmar ausência de) elementos reutilizáveis no projeto
- Documentar a estrutura esperada caso existissem
- Definir como recriaria este arquivo programaticamente

---

## 2. Análise do Arquivo Alvo

### Conteúdo Atual

```markdown
# Elementos Reutilizáveis

_Nenhum elemento reutilizável encontrado._
```

### Observações

- O arquivo é extremamente simples: apenas um título e uma mensagem indicando ausência de elementos reutilizáveis.
- **Conclusão:** O projeto Bubble não utiliza componentes reutilizáveis (reusable elements).

---

## 3. Estrutura Esperada do JSON

Para que existissem elementos reutilizáveis, o JSON deveria conter uma seção similar a:

```json
{
  "reusable_elements": {
    "element_id_1": {
      "name": "Nome do Elemento",
      "type": "Tipo do elemento (ex: Group, Custom)",
      "properties": {/* propriedades visuais */},
      "elements": [/* elementos filhos */],
      "workflows": [/* workflows associados */]
    },
    "element_id_2": {/* ... */}
  }
}
```

### Blocos Esperados em Cada Elemento Reutilizável

1. **name**: Identificador legível do elemento
2. **type**: Tipo de componente (Group, Custom, etc.)
3. **properties**: Configurações visuais (tamanho, cor, posição, etc.)
4. **elements**: Subelementos que compõem o componente
5. **workflows**: Workflows atrelados ao componente reutilizável

---

## 3. Verificação no Arquivo JSON Anotado

### Passo 1: Localizar Seção de Reusable Elements

- ✅ **Verificado:** O arquivo `appBubble - cadastros.annotado.json` não contém um bloco `reusable_elements` visível.
- **Status:** Confirmar procurando pelos padrões:
  - `"reusable_elements": {`
  - `"reutilizáveis":`
  - `"components":`
  - `"shared_elements":`

### Passo 2: Consultar Blocos Alternativos

Se não encontrado no nível raiz, verificar em:

- `pages[*].reusable_elements`
- `_index.reusable_elements`
- `styles.reusable_elements`

### Resultado

- **Confirmado:** Nenhum elemento reutilizável está definido neste projeto.
- **Motivo:** O projeto utiliza apenas elementos diretos nas páginas sem compartilhamento de componentes.

---

## 4. Padrão de Markdown para Elementos Reutilizáveis

Se elementos existissem, o documento seguiria este padrão:

```markdown
# Elementos Reutilizáveis

## Summary

- Total de elementos reutilizáveis: X
- Tipos: [lista de tipos únicos]

## Elementos

### <element_name>

- **ID:** element_id
- **Tipo:** Tipo do elemento
- **Descrição:** Breve descrição funcional
- **Subelementos:** Lista de componentes internos
- **Workflows:** Nome dos workflows associados

#### Propriedades Visuais

| Propriedade | Valor |
| ----------- | ----- |
| width       | X px  |
| height      | Y px  |
| background  | Cor   |

#### Subelementos

- Element 1 (tipo)
- Element 2 (tipo)

#### Workflows

- Workflow 1: Descrição
- Workflow 2: Descrição
```

---

## 5. Passos para Recriar o Arquivo

### Fase 1: Preparação do JSON

**Passo 1.1** - Extrair e limpar JSON

- Remove comentários (`//` e `/* */`)
- Remove caracteres de controle
- Valida sintaxe JSON

**Passo 1.2** - Parsear o JSON limpo

```python
import json
with open('appBubble - cadastros.annotado.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
```

### Fase 2: Localizar Elementos Reutilizáveis

**Passo 2.1** - Verificar raiz do JSON

```python
reusable_elements = data.get('reusable_elements', {})
```

**Passo 2.2** - Se vazio, registrar status

```python
if not reusable_elements:
    print("Nenhum elemento reutilizável encontrado.")
    return "# Elementos Reutilizáveis\n\n*Nenhum elemento reutilizável encontrado.*"
```

### Fase 3: Processar Elementos (se existissem)

**Passo 3.1** - Iterar sobre cada elemento

```python
for element_id, element_data in reusable_elements.items():
    name = element_data.get('name', element_id)
    element_type = element_data.get('type', 'Unknown')
    properties = element_data.get('properties', {})
    subelements = element_data.get('elements', [])
    workflows = element_data.get('workflows', [])
```

**Passo 3.2** - Extrair metadados por elemento

- Nome legível (`name` ou `default_name`)
- Tipo de componente
- Propriedades visuais relevantes
- Lista de subelementos
- Workflows associados

**Passo 3.3** - Documentar workflows vinculados

```python
workflows_desc = []
for workflow in workflows:
    wf_name = workflow.get('name', workflow.get('id'))
    wf_trigger = workflow.get('trigger', 'Sem trigger definido')
    workflows_desc.append(f"- {wf_name}: Disparado por {wf_trigger}")
```

### Fase 4: Gerar Markdown

**Passo 4.1** - Criar cabeçalho

```markdown
# Elementos Reutilizáveis

## Summary

- Total: {count} elementos
- Tipos: {tipos únicos}
```

**Passo 4.2** - Gerar seção por elemento

```markdown
### <element_name>

- **ID:** {id}
- **Tipo:** {type}
- **Subelementos:** {count}
- **Workflows:** {count}
```

**Passo 4.3** - Gerar tabelas de propriedades visuais

```markdown
#### Propriedades Visuais

| Propriedade | Valor   |
| ----------- | ------- |
| {prop}      | {value} |
```

**Passo 4.4** - Listar subelementos

```markdown
#### Subelementos

- {Element 1} ({type})
- {Element 2} ({type})
```

**Passo 4.5** - Documentar workflows

```markdown
#### Workflows Associados

- {workflow_name}: {trigger}
```

### Fase 5: Salvar Resultado

**Passo 5.1** - Salvar arquivo em Markdown

```python
with open('gestao-contratos-conexao-elementos-reutilizaveis-2026-06-18.md', 'w', encoding='utf-8') as f:
    f.write(markdown_content)
```

**Passo 5.2** - Validar saída

- Verificar se arquivo foi criado
- Confirmar formatação Markdown válida

---

## 6. Mapeamento de Propriedades Visuais

Propriedades esperadas a documentar (se elementos existissem):

| Propriedade     | Tipo    | Descrição                          |
| --------------- | ------- | ---------------------------------- |
| width           | px/%    | Largura do elemento                |
| height          | px/%    | Altura do elemento                 |
| backgroundColor | hex/var | Cor de fundo                       |
| borderRadius    | px      | Raio das bordas                    |
| boxShadow       | CSS     | Sombra do elemento                 |
| fontSize        | px      | Tamanho da fonte                   |
| fontWeight      | value   | Espessura da fonte                 |
| padding         | px      | Espaçamento interno                |
| margin          | px      | Espaçamento externo                |
| zIndex          | number  | Ordem de sobreposição              |
| display         | value   | Modo de exibição (flex, grid, etc) |

---

## 7. Regras de Transformação

### Caso 1: Nenhum Elemento Reutilizável

- **Condição:** `reusable_elements` está vazio ou não existe
- **Ação:** Retornar apenas:

  ```markdown
  # Elementos Reutilizáveis

  _Nenhum elemento reutilizável encontrado._
  ```

- **Status:** ✅ **APLICÁVEL** (situação atual do projeto)

### Caso 2: Elementos Reutilizáveis Existem

- **Condição:** `reusable_elements` contém 1+ elementos
- **Ação:** Gerar documento completo com seções por elemento
- **Status:** ❌ **NÃO APLICÁVEL** (não há elementos neste projeto)

---

## 8. Validações e Testes

### Teste 1: Verificar Presença do Bloco

```python
assert 'reusable_elements' not in data or not data['reusable_elements']
print("✓ Confirmado: Nenhum elemento reutilizável no JSON")
```

### Teste 2: Validar Formato Markdown

```python
assert markdown_content.startswith("# Elementos Reutilizáveis")
assert "Nenhum elemento reutilizável encontrado" in markdown_content
print("✓ Formato Markdown válido")
```

### Teste 3: Comparar com Arquivo Original

```python
with open('gestao-contratos-conexao-elementos-reutilizaveis-2026-06-18.md', 'r') as f:
    original = f.read()
assert original == markdown_content
print("✓ Arquivo recriado com sucesso")
```

---

## 6. Observações Técnicas

### Características do Projeto

- O projeto não utiliza componentes reutilizáveis no Bubble.
- Todos os elementos são inline (definidos diretamente em páginas).
- Não há blocos de `reusable_elements` no JSON exportado.

### Implicações para Recriação

- A recriação do arquivo é determinística: sempre produzirá a mesma saída.
- Não há variabilidade baseada em configurações diferentes.
- O arquivo é estático enquanto não forem adicionados elementos reutilizáveis ao Bubble.

### Possível Implementação Futura

Se no futuro forem adicionados elementos reutilizáveis ao projeto:

1. Executar parser JSON com suporte a `reusable_elements`
2. Aplicar Fase 3 do plano de recriação
3. Regenerar documento com elementos listados
4. Documentar each componente com propriedades e workflows

---

## 10. Conclusão

O arquivo `gestao-contratos-conexao-elementos-reutilizaveis-2026-06-18.md` é recriado a partir do JSON através de uma verificação simples:

1. ✅ Localizar `reusable_elements` no JSON
2. ✅ Verificar se está vazio ou ausente
3. ✅ Se vazio → Retornar mensagem "Nenhum elemento reutilizável encontrado"
4. ✅ Se preenchido → Gerar documento com elementos listados (não aplicável atualmente)

**Status Final:** Recriação é possível e determinística. Implementação recomendada em Python com suporte a limpeza de comentários no JSON.
