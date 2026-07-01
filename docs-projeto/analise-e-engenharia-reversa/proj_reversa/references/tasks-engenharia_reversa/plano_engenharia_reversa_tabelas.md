# Plano de Engenharia Reversa: Tabelas de Dados (Data Types)

**Arquivo Alvo:** `gestao-contratos-conexao-tabelas-2026-06-18.md`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---

## 1. Análise do Arquivo Alvo

### Visão Geral

O arquivo documenta todos os Data Types (tabelas de dados) utilizados na aplicação Bubble. Cada Data Type define a estrutura de dados, campos, tipos de dados e se são obrigatórios ou não.

### Estrutura Identificada

```markdown
# <NomeDaTabela>

# <NomeDaTabela> (Data Type)

## Summary

[Descrição do propósito e contexto da tabela]

## Campos

| Campo      | Tipo | Obrigatório |
| ---------- | ---- | ----------- |
| nome_campo | tipo | Sim/Não     |
```

### Conteúdo Atual

O arquivo contém **~15 Data Types** documentados:

1. **LOG** - Registros de atividades (7 campos)
2. **User** - Informações de usuários (múltiplas versões, deletada)
3. **evento** - Dados de eventos (15 campos, alguns deletados)
4. **Contratos_Pastas** - Pastas de contratos (deletado, 2 campos)
5. **Cadastros** - Cadastros de clientes (26 campos)
6. **Cadastros_Clientes_PJ** - Dados de clientes PJ (17 campos)
7. **contratos** - Informações de contratos (deletado, 10 campos)
8. **Cadastros_Endereços** - Endereços de clientes (11 campos)
9. **Contratos_Template** - Modelos de contrato (deletado, 3 campos)
10. **tutoriais** - Dados de tutoriais (3 campos)
11. **Buscas CRO** - Informações de buscas (7 campos)
12. **Cadastros_Documentos** - Documentos de cadastro (20 campos)
13. **evento_es** - Eventos (deletado, 13 campos)
14. **evento_APCD** - Eventos APCD (7 campos)
15. **evento_LEAD** - Leads de eventos (7 campos)
16. **LOG Detalhes** - Detalhes de logs (5 campos)
17. **Cadastros_Clientes_PF** - Dados de clientes PF (11 campos)

---

## 2. Estrutura Esperada no JSON

Os Data Types devem estar estruturados no JSON como:

```json
{
  "data_types": {
    "data_type_id_1": {
      "name": "LOG",
      "display_name": "LOG",
      "description": "Este Data Type armazena registros de atividades...",
      "deleted": false,
      "fields": [
        {
          "name": "A. - deleted",
          "field_name": "a__deleted",
          "type": "text",
          "type_id": "text",
          "required": false,
          "deleted": true,
          "description": ""
        },
        {
          "name": "A. Quem realizou",
          "field_name": "quem_realizou",
          "type": "text",
          "type_id": "text",
          "required": false,
          "deleted": false
        },
        {
          "name": "D. CLIENTE",
          "field_name": "cliente",
          "type": "custom.cliente",
          "type_id": "custom_cliente",
          "required": false,
          "deleted": false
        }
      ]
    },
    "data_type_id_2": {/* ... */}
  }
}
```

### Campos Esperados por Data Type

| Campo        | Tipo    | Descrição                      | Obrigatório         |
| ------------ | ------- | ------------------------------ | ------------------- |
| name         | string  | Nome legível da tabela         | ✅                  |
| display_name | string  | Nome para exibição             | ✅                  |
| description  | string  | Descrição do propósito         | ⚠️ Pode estar vazio |
| deleted      | boolean | Flag indicando se foi deletado | ❌                  |
| fields       | array   | Lista de campos da tabela      | ✅                  |

### Campos Esperados por Field

| Campo       | Tipo    | Descrição                                                                     | Obrigatório      |
| ----------- | ------- | ----------------------------------------------------------------------------- | ---------------- |
| name        | string  | Nome do campo com prefixo (ex: "A. Quem realizou")                            | ✅               |
| field_name  | string  | Identificador técnico                                                         | ✅               |
| type        | string  | Tipo de dado (text, number, date, boolean, custom, option, list, file, image) | ✅               |
| type_id     | string  | ID técnico do tipo                                                            | ⚠️               |
| required    | boolean | Se é obrigatório                                                              | ⚠️ Padrão: false |
| deleted     | boolean | Flag indicando se foi deletado                                                | ❌ Padrão: false |
| description | string  | Descrição do campo                                                            | ❌               |

---

## 3. Verificação no Arquivo JSON Anotado

### Passo 1: Localizar Seção de Data Types

- Buscar por: `"data_types": {`
- Localização esperada: Raiz do JSON ou dentro de `_index`
- Padrão de chaves: IDs alfanuméricos como `"bTHBQ"`, `"bTHBR"`, etc.

### Passo 2: Estrutura Esperada

Cada data type deve ter:

- `"name"` - nome identificável (ex: "LOG", "Cadastros")
- `"fields"` - array com objetos de campo
- `"deleted"` - flag indicando se foi deletado
- `"description"` - propósito do data type

### Passo 3: Validar Presença

- ✅ Confirmar que `data_types` existe no JSON
- ✅ Confirmar que todos os ~17 data types estão presentes
- ✅ Confirmar que cada data type possui `fields` array
- ✅ Confirmar campos obrigatórios em cada field

---

## 4. Padrão de Markdown para Data Types

### Estrutura Geral

```markdown
# <NomeDaTabela>

# <NomeDaTabela> (Data Type)

## Summary

[Descrição do data type]

## Campos

| Campo       | Tipo             | Obrigatório         |
| ----------- | ---------------- | ------------------- |
| nome_campo  | tipo_completo    | Sim/Não             |
| outro_campo | tipo_customizado | Não (default: true) |
```

### Regras de Renderização

#### Regra 1: Nome do Campo

- Usar `name` do JSON (ex: "A. Quem realizou")
- Pode conter prefixos numéricos/alfabéticos e sufixos como "- deleted"

#### Regra 2: Tipo de Campo

Os tipos podem ser:

- **Primitivos:** `text`, `number`, `date`, `boolean`
- **Customizados:** `custom.cliente`, `custom.log`, etc.
- **Option Sets:** `option`, `option set tipo_de_cadastro`
- **Listas:** `list.text`, `list.number`, `list of custom cliente`
- **Arquivos:** `file`, `image`
- **Referências API:** `api.apiconnector2.bTMGk.bTMGl`
- **Referências Deletadas:** Podem ter sufixo "- deleted"

#### Regra 3: Obrigatório

- Se `required: true` → "Sim"
- Se `required: false` → "Não"
- Se tiver `default` → "Não (default: [valor])"
- Exemplo: "Não (default: true)"

#### Regra 4: Status Deletado

- Se field `deleted: true` → Sufixo " - deleted" no nome
- Se data_type `deleted: true` → Mensagem no summary + campo deletado no cabeçalho

### Variações de Tipo de Dado

| Tipo Técnico             | Tipo Legível            | Exemplo                  |
| ------------------------ | ----------------------- | ------------------------ |
| text                     | text                    | text                     |
| number                   | number                  | number                   |
| date                     | date                    | date                     |
| boolean                  | boolean                 | boolean                  |
| custom_cliente           | custom.cliente          | custom.cliente           |
| option_set_tipo_cadastro | option.tipo_de_cadastro | option.tipo_de_cadastro  |
| list_text                | list.text               | list.text                |
| list_number              | list.number             | list.number              |
| list_custom_cliente      | list of custom cliente  | list of custom `cliente` |
| file                     | file                    | file                     |
| image                    | image                   | image                    |

---

## 5. Passos para Recriar o Arquivo

### Fase 1: Preparação do JSON

**Passo 1.1** - Extrair e limpar JSON

- Remove comentários (`//` e `/* */`)
- Remove caracteres de controle inválidos
- Valida sintaxe JSON
- Output: JSON limpo e parseável

**Passo 1.2** - Parsear o JSON limpo

```python
import json
with open('appBubble - cadastros.annotado.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
```

### Fase 2: Localizar Data Types

**Passo 2.1** - Acessar bloco de data types

```python
data_types_data = data.get('data_types', {})
# ou
data_types_data = data.get('_index', {}).get('data_types', {})
```

**Passo 2.2** - Validar não está vazio

```python
if not data_types_data:
    print("Nenhum data type encontrado")
    return
```

### Fase 3: Processar Cada Data Type

**Passo 3.1** - Iterar sobre cada data type

```python
all_data_types = []
for dt_id, dt_data in data_types_data.items():
    name = dt_data.get('name', dt_id)
    display_name = dt_data.get('display_name', name)
    description = dt_data.get('description', '')
    deleted = dt_data.get('deleted', False)
    fields = dt_data.get('fields', [])

    all_data_types.append({
        'id': dt_id,
        'name': name,
        'display_name': display_name,
        'description': description,
        'deleted': deleted,
        'fields': fields
    })
```

**Passo 3.2** - Ordenar por nome

```python
all_data_types.sort(key=lambda x: x['name'])
```

**Passo 3.3** - Processar campos por data type

Para cada data type:

```python
fields_list = []
for field in fields:
    field_name = field.get('name', '')
    field_type = field.get('type', 'unknown')
    field_required = field.get('required', False)
    field_deleted = field.get('deleted', False)
    field_default = field.get('default', None)

    # Traduzir tipo para legível
    type_display = translate_type(field_type)

    # Traduzir obrigatoriedade
    if field_deleted:
        # Não incluir campos deletados em tabela
        continue

    if field_required:
        required_display = "Sim"
    elif field_default is not None:
        required_display = f"Não (default: {field_default})"
    else:
        required_display = "Não"

    fields_list.append({
        'name': field_name,
        'type': type_display,
        'required': required_display
    })
```

### Fase 4: Gerar Markdown

**Passo 4.1** - Criar cabeçalho geral

```markdown
# Tabelas de Dados (Data Types)
```

**Passo 4.2** - Para cada data type, gerar bloco:

```markdown
## <NomeDaTabela>

# <NomeDaTabela> (Data Type)

## Summary

[description]

## Campos

| Campo        | Tipo   | Obrigatório |
| ------------ | ------ | ----------- |
| [nome_campo] | [tipo] | [requerido] |
```

**Passo 4.3** - Lógica de exibição para deletados

Se `deleted == True`:

```markdown
# <NomeDaTabela> (Data Type)

## Summary

Este Data Type está marcado como deletado e não será mais utilizado.

## Campos

| Campo                  | Tipo | Obrigatório |
| ---------------------- | ---- | ----------- |
| [campos não deletados] |
```

Se `deleted == False`:

```markdown
# <NomeDaTabela> (Data Type)

## Summary

[description]

## Campos

| Campo    | Tipo | Obrigatório |
| -------- | ---- | ----------- |
| [campos] |
```

**Passo 4.4** - Função de tradução de tipos

```python
def translate_type(field_type):
    """Traduz tipo técnico para legível"""

    # Mapeamento direto
    simple_types = {
        'text': 'text',
        'number': 'number',
        'date': 'date',
        'boolean': 'boolean',
        'file': 'file',
        'image': 'image'
    }

    if field_type in simple_types:
        return simple_types[field_type]

    # Customizados
    if field_type.startswith('custom_'):
        custom_name = field_type.replace('custom_', '')
        return f'custom.{custom_name}'

    if field_type.startswith('custom.'):
        return field_type  # Já formatado

    # Option Sets
    if field_type.startswith('option_set_'):
        os_name = field_type.replace('option_set_', '')
        return f'option set {os_name}'

    if field_type.startswith('option set '):
        return field_type  # Já formatado

    # Listas
    if field_type.startswith('list_'):
        list_type = field_type.replace('list_', '')
        if list_type.startswith('custom_'):
            custom_name = list_type.replace('custom_', '')
            return f'list of custom `{custom_name}`'
        else:
            return f'list.{list_type}'

    if field_type.startswith('list of '):
        return field_type  # Já formatado

    # API References (raro)
    if field_type.startswith('api.'):
        return field_type

    # Fallback
    return field_type
```

### Fase 5: Salvar Resultado

**Passo 5.1** - Concatenar todo o markdown

```python
markdown_content = "# Tabelas de Dados (Data Types)\n\n"
for dt in all_data_types:
    markdown_content += generate_data_type_block(dt)
    markdown_content += "\n\n"
```

**Passo 5.2** - Salvar em arquivo

```python
output_path = 'gestao-contratos-conexao-tabelas-2026-06-18.md'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(markdown_content)
```

**Passo 5.3** - Validar saída

- Verificar arquivo foi criado
- Confirmar não está vazio
- Validar sintaxe Markdown
- Confirmar todas as 17 tabelas presentes

---

## 6. Tratamento de Casos Especiais

### Caso 1: Data Type Deletado

- **Identificação:** `deleted: true`
- **Ação:** Incluir em documento mas com aviso no Summary
- **Exemplo:** "contratos", "Contratos_Pastas", "evento_es"

### Caso 2: Campo Deletado

- **Identificação:** `field.deleted: true`
- **Ação:** NÃO incluir em tabela de campos (filtrar)
- **Exemplo:** "A. - deleted", "C. Quando realizou - deleted"

### Caso 3: Campo com Default Value

- **Identificação:** `default` em field data
- **Ação:** Mostrar em coluna "Obrigatório"
- **Exemplo:** "Não (default: true)", "Não (default: false)"

### Caso 4: Tipos Customizados (Custom Types)

- **Identificação:** Referência a outro data type
- **Formato:** `custom.nome_do_tipo` ou `list of custom nome_do_tipo`
- **Ação:** Preservar exatamente como vem do JSON
- **Exemplo:** `custom.cliente`, `list of custom cliente`

### Caso 5: Option Sets

- **Identificação:** Campo referencia um option set
- **Formato:** `option.nome_option_set` ou `option set nome_option_set`
- **Ação:** Preservar formato
- **Exemplo:** `option.tipo_de_cadastro`, `option set tipo_de_acesso`

### Caso 6: Tipos Complexos

- **Identificação:** Combinações como `list.text`, `api.connector.call`
- **Ação:** Preservar estrutura original, apenas formatar para legibilidade
- **Exemplo:** `list.number`, `api.apiconnector2.bTMGk.bTMGl`

### Caso 7: Data Type com Múltiplas Versões

- **Identificação:** Mesmo nome, versões diferentes (deletada vs ativa)
- **Exemplo:** "User" aparece duas vezes, uma deletada
- **Ação:** Incluir ambas, marcar deletada apropriadamente

---

## 7. Validações e Testes

### Teste 1: Estrutura JSON

```python
assert 'data_types' in data, "Bloco data_types não encontrado"
assert isinstance(data['data_types'], dict), "data_types deve ser dict"
print("✓ Estrutura JSON válida")
```

### Teste 2: Count de Data Types

```python
expected_count = 17
actual_count = len([dt for dt in data['data_types'].values()])
assert actual_count == expected_count, f"Esperado {expected_count}, encontrado {actual_count}"
print(f"✓ {actual_count} data types encontrados")
```

### Teste 3: Campos Obrigatórios

```python
for dt_id, dt_data in data['data_types'].items():
    assert 'name' in dt_data, f"Data type {dt_id} sem 'name'"
    assert 'fields' in dt_data, f"Data type {dt_data.get('name', dt_id)} sem 'fields'"

    for field in dt_data['fields']:
        assert 'name' in field, f"Field em {dt_data['name']} sem 'name'"
        assert 'type' in field, f"Field {field.get('name')} sem 'type'"
print("✓ Todos os campos obrigatórios presentes")
```

### Teste 4: Campos Deletados Filtrados

```python
for dt in all_data_types:
    for row in dt['fields_for_table']:
        assert '- deleted' not in row['name'], f"Campo deletado não foi filtrado: {row['name']}"
print("✓ Campos deletados filtrados corretamente")
```

### Teste 5: Tipos Traduzidos

```python
for dt in all_data_types:
    for field in dt['fields_for_table']:
        assert not field['type'].startswith('custom_'), f"Tipo não traduzido: {field['type']}"
        assert not field['type'].startswith('option_'), f"Tipo não traduzido: {field['type']}"
print("✓ Todos os tipos traduzidos corretamente")
```

### Teste 6: Comparação com Original

```python
with open('gestao-contratos-conexao-tabelas-2026-06-18.md', 'r') as f:
    original = f.read()

assert generated == original, "Markdown gerado não corresponde ao original"
print("✓ Markdown recriado com sucesso")
```

---

## 8. Mapeamento de Propriedades

### Tipos de Dados Suportados

| Tipo Técnico             | Tipo Legível            | Exemplo em Tabela             |
| ------------------------ | ----------------------- | ----------------------------- |
| text                     | text                    | text                          |
| number                   | number                  | number                        |
| date                     | date                    | date                          |
| boolean                  | boolean                 | boolean                       |
| custom_cliente           | custom.cliente          | custom.cliente                |
| custom_log               | custom.log              | custom.log                    |
| option_set_tipo_cadastro | option.tipo_de_cadastro | option set tipo_de_cadastro   |
| list_text                | list.text               | list.text                     |
| list_number              | list.number             | list.number                   |
| list_custom_cliente      | list of custom          | list of custom `cliente`      |
| file                     | file                    | file                          |
| image                    | image                   | image                         |
| api_connector            | api.connector           | api.apiconnector2.bTMGk.bTMGl |

---

## 9. Estrutura Recomendada para Código

```python
class DataTypeProcessor:
    def __init__(self, json_path):
        self.json_path = json_path
        self.data = None

    def load_and_clean_json(self):
        """Carrega e limpa JSON de comentários"""
        # Remove comentários, caracteres inválidos
        # Retorna dict parseado

    def extract_data_types(self):
        """Extrai lista de data types do JSON"""
        # Localiza bloco data_types
        # Filtra deletados (mantém mas marca)
        # Retorna lista ordenada

    def process_fields(self, dt_data):
        """Processa campos de um data type"""
        # Filtra campos deletados
        # Traduz tipos
        # Formata obrigatoriedade
        # Retorna lista de campos para tabela

    def translate_type(self, field_type):
        """Traduz tipo técnico para legível"""
        # Aplica regras de tradução
        # Retorna tipo formatado

    def generate_markdown_for_data_type(self, dt_data):
        """Gera markdown para um data type"""
        # Monta header
        # Monta summary
        # Monta tabela
        # Retorna string markdown

    def generate_full_document(self):
        """Gera documento completo"""
        # Processa todos os data types
        # Concatena blocos
        # Retorna markdown completo

    def save_markdown(self, output_path):
        """Salva markdown em arquivo"""
        # Valida
        # Escreve em arquivo
        # Confirma criação
```

---

## 10. Observações Técnicas

### Características do Projeto

- Contém ~17 Data Types
- Alguns data types estão deletados (marcados com flag)
- Alguns campos dentro de data types estão deletados
- Tipos incluem customizados, option sets, listas e referências API
- Campos podem ter default values

### Complexidade

- **Média-Alta:** Vários tipos diferentes, lógica de filtragem, tradução de tipos
- **Desafio Principal:** Tradução completa e precisa de tipos de dados
- **Desafio Secundário:** Tratamento de campos vs. tabelas deletadas

### Possíveis Extensões

Se no futuro forem adicionados novos tipos:

1. Adicionar mapeamento em `translate_type()`
2. Nenhuma mudança estrutural necessária
3. Algoritmo detectará automaticamente

---

## 11. Comparação com Option Sets

| Aspecto             | Data Types                       | Option Sets                      |
| ------------------- | -------------------------------- | -------------------------------- |
| Propósito           | Definir estrutura de dados       | Definir valores enumarados       |
| Campos por Item     | Múltiplos (name, type, required) | Múltiplos (display, value, sort) |
| Relação com Pages   | Referenciados em workflows       | Usados em formulários/filtros    |
| Complexidade        | Alta (tipos variados)            | Média (colunas dinâmicas)        |
| Principais Desafios | Tradução de tipos                | Detecção de colunas              |

---

## 12. Conclusão

O arquivo `gestao-contratos-conexao-tabelas-2026-06-18.md` é recriado a partir do JSON através do seguinte fluxo:

1. ✅ Limpar e parsear JSON
2. ✅ Localizar bloco `data_types`
3. ✅ Iterar sobre cada data type
4. ✅ Filtrar campos deletados
5. ✅ Traduzir tipos de dados
6. ✅ Formatar obrigatoriedade
7. ✅ Gerar tabela markdown
8. ✅ Marcar tabelas deletadas
9. ✅ Concatenar blocos
10. ✅ Salvar resultado

**Status Final:** Recriação é possível e implementável. Algoritmo requer função robusta de tradução de tipos e lógica de filtragem, mas é determinístico uma vez implementado.
