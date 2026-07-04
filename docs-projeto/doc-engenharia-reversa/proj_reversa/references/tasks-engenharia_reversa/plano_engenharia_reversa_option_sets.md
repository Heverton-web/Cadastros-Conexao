# Plano de Engenharia Reversa: Option Sets

**Arquivo Alvo:** `gestao-contratos-conexao-option-sets-2026-06-18.md`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---

## 1. Análise do Arquivo Alvo

### Visão Geral

O arquivo documenta todos os Option Sets (conjuntos de opções/enumerações) utilizados na aplicação Bubble. Cada option set é um conjunto de valores predefinidos usados em dropdowns, filtros e estados.

### Estrutura Identificada

```
# Option Sets

## <NomeDo OptionSet>

# <NomeDo OptionSet> (Option Set)

## Summary
[Descrição do propósito do option set]

## Opções

| Coluna 1 | Coluna 2 | [Coluna N] |
|----------|----------|-----------|
| valor1   | valor1   | valor1    |
| valor2   | valor2   | valor2    |
```

### Conteúdo Atual

O arquivo contém **~20 option sets** documentados:

1. **tes** - Deletado (sem opções visíveis)
2. **Tipo_Página** - 3 opções com URLs de navegação
3. **Ações de Log** - 9 ações registráveis
4. **Meses do ano** - 12 meses com valores
5. **[CRED] Tipo de Acesso** - 8 tipos de acesso/permissões
6. **Contrato_Status do Contrato** - 3 status (Criado, Pendente, Assinado)
7. **Cadastro_Status Cadastro** - 6 status de cadastro
8. **[CRED] Função** - 12 funções (algumas deletadas)
9. **Cadastro_Tipo de Cadastro** - 2 tipos (PF, PJ)
10. **Cadastro_Tipo de Consulta** - 2 tipos (CNPJ, CRO)
11. **Cadastro_Tipo de endereço** - 2 tipos (Principal, Entrega)
12. **Cadastro_Departamento** - 4 departamentos
13. **Cadastro_Menu Navegação** - 3 itens de menu
14. **Expira Link** - 4 opções de tempo
15. **Cadastro_Tipo de Envio de Link** - 2 tipos de envio
16. **Cadastro_Tipo de Ação do Cliente** - 2 tipos de ação
17. **Contrato_Status Ação do Assinante** - 2 status
18. **Contrato_Tipo de Assinante** - 2 tipos (PF, PJ)
19. **Contrato_Menu Lateral** - 4 itens de menu
20. **Contrato_Navegação Modelos de Contratos** - 2 opções de navegação

---

## 2. Estrutura Esperada no JSON

Os Option Sets devem estar estruturados no JSON como:

```json
{
  "option_sets": {
    "option_set_id_1": {
      "name": "Tipo_Página",
      "display_name": "Tipo de Página",
      "description": "Define os tipos de páginas disponíveis...",
      "deleted": false,
      "options": [
        {
          "display": "LP Convencional",
          "value": "lp_convencional",
          "database_value": "lp_convencional",
          "sort_factor": 1,
          "metadata": {
            "link": "https://gestao-contratos-conexao.bubbleapps.io/lp_evento"
          }
        },
        {
          "display": "LP VIP",
          "value": "lp_vip",
          "database_value": "lp_vip",
          "sort_factor": 2,
          "metadata": {
            "link": "https://gestao-contratos-conexao.bubbleapps.io/lp_evento_vip"
          }
        }
        // ...
      ]
    },
    "option_set_id_2": {
      // ...
    }
  }
}
```

### Campos Esperados por Option

| Campo          | Tipo   | Descrição                            | Obrigatório                 |
| -------------- | ------ | ------------------------------------ | --------------------------- |
| display        | string | Texto exibido no UI                  | ✅                          |
| value          | string | Valor identificador único            | ✅                          |
| database_value | string | Valor armazenado no banco            | ⚠️ Pode ser igual a `value` |
| sort_factor    | number | Ordem de classificação               | ❌                          |
| metadata       | object | Dados adicionais (links, tipos, etc) | ❌                          |

---

## 3. Verificação no Arquivo JSON Anotado

### Passo 1: Localizar Seção de Option Sets

- Buscar por: `"option_sets": {`
- Localização esperada: Raiz do JSON ou dentro de `_index`
- Padrão de chaves: IDs como `"bTKDT"`, `"bTKDU"`, etc.

### Passo 2: Estrutura Esperada

Cada option set deve ter:

- `"name"` - nome identificável (ex: "Tipo_Página")
- `"options"` - array com objetos de opção
- `"deleted"` - flag indicando se foi deletado

### Passo 3: Validar Presença

- ✅ Confirmar que `option_sets` existe no JSON
- ✅ Confirmar que todos os ~20 option sets estão presentes
- ✅ Confirmar que campos obrigatórios existem

---

## 4. Padrão de Markdown para Option Sets

### Padrão Geral

```markdown
# Option Sets

## <NomeDo OptionSet>

# <NomeDo OptionSet> (Option Set)

## Summary

[Descrição concisa do propósito]

## Opções

| [Colunas Variáveis] |
| ------------------- |
| [Dados]             |
```

### Variações de Colunas

#### Caso 1: Simples (Display | Value)

```markdown
| Opção   | Valor  |
| ------- | ------ |
| Opção 1 | valor1 |
```

#### Caso 2: Com Metadata (Display | Valor | Campo Extra)

```markdown
| Opção           | Link        | Valor           | Sort Factor |
| --------------- | ----------- | --------------- | ----------- |
| LP Convencional | https://... | lp_convencional | 1           |
```

#### Caso 3: Com Múltiplos Campos

```markdown
| Opção               | Valor | Tipo de Acesso |
| ------------------- | ----- | -------------- |
| Consultor de Vendas | bTHgl | bTKOl          |
```

#### Caso 4: Deletado (sem opções)

```markdown
## Summary

Este Option Set é nomeado 'tes' e está marcado como excluído.

## Opções

Este Option Set não possui opções visíveis pois foi marcado como excluído.
```

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

### Fase 2: Localizar Option Sets

**Passo 2.1** - Acessar bloco de option sets

```python
option_sets_data = data.get('option_sets', {})
# ou
option_sets_data = data.get('_index', {}).get('option_sets', {})
```

**Passo 2.2** - Validar não está vazio

```python
if not option_sets_data:
    print("Nenhum option set encontrado")
    return
```

### Fase 3: Processar Cada Option Set

**Passo 3.1** - Iterar sobre cada option set

```python
all_option_sets = []
for os_id, os_data in option_sets_data.items():
    name = os_data.get('name', os_id)
    display_name = os_data.get('display_name', name)
    description = os_data.get('description', '')
    deleted = os_data.get('deleted', False)
    options = os_data.get('options', [])

    all_option_sets.append({
        'id': os_id,
        'name': name,
        'display_name': display_name,
        'description': description,
        'deleted': deleted,
        'options': options
    })
```

**Passo 3.2** - Ordenar por nome

```python
all_option_sets.sort(key=lambda x: x['name'])
```

**Passo 3.3** - Processar opções por option set

Para cada option set:

```python
# Extrair colunas dinâmicas
columns = set()
for option in options:
    columns.update(option.keys())
# Remove 'display' e 'value' que são obrigatórios
base_columns = ['display', 'value']
dynamic_columns = sorted(columns - set(base_columns))

# Determinar estrutura da tabela
if deleted:
    table_type = 'deleted'
elif dynamic_columns:
    table_type = 'with_metadata'
    columns_final = base_columns + dynamic_columns
else:
    table_type = 'simple'
    columns_final = base_columns
```

### Fase 4: Gerar Markdown

**Passo 4.1** - Criar cabeçalho

```markdown
# Option Sets
```

**Passo 4.2** - Para cada option set, gerar bloco:

```markdown
## <NomeDo OptionSet>

# <NomeDo OptionSet> (Option Set)

## Summary

[description]

## Opções

| [Colunas] |
| --------- |
| [Valores] |
```

**Passo 4.3** - Lógica de colunas dinâmicas

Se `deleted == True`:

```markdown
## Summary

Este Option Set é nomeado '<name>' e está marcado como excluído.

## Opções

Este Option Set não possui opções visíveis pois foi marcado como excluído.
```

Se `deleted == False`:

```markdown
## Summary

[description]

## Opções

| Coluna1 | Coluna2 | [ColunaX] |
| ------- | ------- | --------- |
| val1    | val1    | val1      |
| val2    | val2    | val2      |
```

**Passo 4.4** - Mapear nomes de colunas para legibilidade

| Nome Técnico   | Nome Legível   |
| -------------- | -------------- |
| display        | Opção          |
| value          | Valor          |
| database_value | DB Value       |
| sort_factor    | Sort Factor    |
| link           | Link           |
| type_access    | Tipo de Acesso |

### Fase 5: Salvar Resultado

**Passo 5.1** - Concatenar todo o markdown

```python
markdown_content = "# Option Sets\n\n"
for os in all_option_sets:
    markdown_content += generate_option_set_block(os)
    markdown_content += "\n\n"
```

**Passo 5.2** - Salvar em arquivo

```python
output_path = 'gestao-contratos-conexao-option-sets-2026-06-18.md'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(markdown_content)
```

**Passo 5.3** - Validar saída

- Verificar arquivo foi criado
- Confirmar não está vazio
- Validar sintaxe Markdown

---

## 6. Algoritmo de Detecção de Colunas

### Regra 1: Campos Obrigatórios

Sempre incluir:

- `display` (Opção)
- `value` (Valor)

### Regra 2: Campos Dinâmicos

Se alguma opção contiver campos adicionais, detectar e incluir:

```python
def get_table_columns(options):
    if not options:
        return []

    # Campos obrigatórios
    base_cols = {'display', 'value'}

    # Detectar campos adicionais
    all_fields = set()
    for option in options:
        all_fields.update(option.keys())

    # Remover obrigatórios, manter dinâmicos
    dynamic_cols = sorted(all_fields - base_cols)

    # Retornar ordem: obrigatórios + dinâmicos
    return list(base_cols) + dynamic_cols
```

### Regra 3: Ordenação de Colunas

1. `display` (sempre primeira)
2. `value` (sempre segunda)
3. Demais colunas em ordem alfabética
4. Exceção: `sort_factor` vem ao final se presente

---

## 7. Tratamento de Casos Especiais

### Caso 1: Option Set Deletado

- **Identificação:** `deleted: true`
- **Ação:** Não renderizar tabela, apenas mensagem
- **Exemplo:** "tes"

### Caso 2: Option com Metadata Complexa

- **Identificação:** Campo `metadata` é objeto (não string)
- **Ação:** Extrair campos de metadata para colunas da tabela
- **Exemplo:** Tipo_Página com `link` em metadata

### Caso 3: Sort Factor Presente

- **Identificação:** Opções possuem `sort_factor`
- **Ação:** Incluir coluna "Sort Factor"
- **Regra:** Sort factor deve ser último na tabela

### Caso 4: Valores com Underscore ou Typos

- **Exemplo:** "agodto" (deveria ser "agosto"), "mar_o" (deveria ser "março")
- **Ação:** Preservar valor exatamente como vem do Bubble (pode ser intencional)

### Caso 5: Múltiplas Referências entre Option Sets

- **Exemplo:** "[CRED] Função" referencia "[CRED] Tipo de Acesso"
- **Ação:** Preservar valores de ID mesmo que pareçam ser referências
- **Exemplo:** `Tipo de Acesso: bTKOl` (referencia outro option set)

---

## 8. Validações e Testes

### Teste 1: Estrutura JSON

```python
assert 'option_sets' in data, "Bloco option_sets não encontrado"
assert isinstance(data['option_sets'], dict), "option_sets deve ser dict"
print("✓ Estrutura JSON válida")
```

### Teste 2: Count de Option Sets

```python
expected_count = 20
actual_count = len([os for os in data['option_sets'].values() if not os.get('deleted', False)])
assert actual_count == expected_count, f"Esperado {expected_count}, encontrado {actual_count}"
print(f"✓ {actual_count} option sets encontrados")
```

### Teste 3: Campos Obrigatórios

```python
for os_id, os_data in data['option_sets'].items():
    assert 'name' in os_data, f"Option set {os_id} sem 'name'"
    if not os_data.get('deleted'):
        assert 'options' in os_data, f"Option set {os_data['name']} sem 'options'"
print("✓ Todos os campos obrigatórios presentes")
```

### Teste 4: Comparação com Original

```python
with open('gestao-contratos-conexao-option-sets-2026-06-18.md', 'r') as f:
    original = f.read()

assert generated == original, "Markdown gerado não corresponde ao original"
print("✓ Markdown recriado com sucesso")
```

### Teste 5: Validar Markdown

```python
import re
# Verificar estruturas Markdown
assert markdown_content.startswith("# Option Sets"), "Cabeçalho inválido"
assert markdown_content.count("## Summary") > 0, "Nenhum Summary encontrado"
assert markdown_content.count("## Opções") > 0, "Nenhuma seção Opções encontrada"
print("✓ Markdown estruturalmente válido")
```

---

## 9. Mapeamento de Propriedades

### Colunas Dinâmicas Possíveis

| Campo Técnico  | Campo Legível  | Tipo      | Notas                      |
| -------------- | -------------- | --------- | -------------------------- |
| display        | Opção          | string    | Obrigatório                |
| value          | Valor          | string    | Obrigatório                |
| database_value | DB Value       | string    | Pode ser igual a value     |
| sort_factor    | Sort Factor    | number    | Ordem de exibição          |
| link           | Link           | URL       | Para navegação             |
| type_access    | Tipo de Acesso | reference | Referencia outro OS        |
| tempo          | Tempo          | number    | Horas/dias                 |
| deleted        | -              | boolean   | Indicador de item deletado |

---

## 10. Observações Técnicas

### Características do Projeto

- Contém ~20 option sets
- Alguns option sets possuem items deletados
- Referências cruzadas entre option sets (ex: Função → Tipo de Acesso)
- Metadata variável por option set
- Sort factors presentes em alguns option sets

### Complexidade

- **Média:** Estrutura bem-definida com variações
- **Desafio Principal:** Detecção dinâmica de colunas
- **Desafio Secundário:** Tratamento de metadata complexa

### Possíveis Extensões

Se no futuro forem adicionados mais campos:

1. Algoritmo detectará automaticamente
2. Incluirá em colunas da tabela
3. Nenhuma mudança no código base necessária

---

## 11. Estrutura Recomendada para Código

```python
class OptionSetProcessor:
    def __init__(self, json_path):
        self.json_path = json_path
        self.data = None

    def load_and_clean_json(self):
        """Carrega e limpa JSON de comentários"""
        # Remove comentários, caracteres inválidos
        # Retorna dict parseado

    def extract_option_sets(self):
        """Extrai lista de option sets do JSON"""
        # Localiza bloco option_sets
        # Filtra deletados
        # Retorna lista ordenada

    def generate_markdown_for_option_set(self, os_data):
        """Gera markdown para um option set"""
        # Detecta colunas
        # Monta tabela
        # Retorna string markdown

    def generate_full_document(self):
        """Gera documento completo"""
        # Processa todos os option sets
        # Concatena blocos
        # Retorna markdown completo

    def save_markdown(self, output_path):
        """Salva markdown em arquivo"""
        # Valida
        # Escreve em arquivo
        # Confirma criação
```

---

## 12. Conclusão

O arquivo `gestao-contratos-conexao-option-sets-2026-06-18.md` é recriado a partir do JSON através do seguinte fluxo:

1. ✅ Limpar e parsear JSON
2. ✅ Localizar bloco `option_sets`
3. ✅ Iterar sobre cada option set
4. ✅ Detectar colunas dinâmicas
5. ✅ Gerar tabela markdown
6. ✅ Tratardeleted items
7. ✅ Concatenar blocos
8. ✅ Salvar resultado

**Status Final:** Recriação é possível e implementável. Algoritmo requer lógica de detecção de colunas dinâmicas, mas é determinístico uma vez implementado.
