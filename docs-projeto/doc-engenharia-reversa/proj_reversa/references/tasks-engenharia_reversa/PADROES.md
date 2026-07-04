# 📐 Padrões de Estrutura - Planos de Engenharia Reversa

**Data:** 2026-06-18  
**Objetivo:** Documentar a estrutura padronizada de todos os planos de engenharia reversa

---

## 📋 Estrutura Padrão de um Plano

Todos os planos de engenharia reversa seguem uma estrutura padronizada para facilitar leitura, manutenção e comparação.

### Cabeçalho

```markdown
# Plano de Engenharia Reversa: [Nome do Artefato]

**Arquivo Alvo:** `[nome-arquivo-2026-06-18.md]`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---
```

**Regras:**

- Título sempre começa com "Plano de Engenharia Reversa: "
- CamelCase para nome do artefato
- Arquivo alvo sempre com sufixo `-2026-06-18.md`
- Data sempre `2026-06-18`
- Linha divisória com `---` após metadados

### Seção 1: Objetivo

```markdown
## 1. Objetivo

[Descrição em 1-2 parágrafos do objetivo principal]

- [Ponto-chave 1]
- [Ponto-chave 2]
- [Ponto-chave 3]
```

**Regras:**

- Seção numerada como "1. Objetivo"
- Deve ser conciso mas completo
- Pode conter bullets para pontos principais
- Responde: "Por que analisar este artefato?"

### Seção 2: Análise do Arquivo Alvo

```markdown
## 2. Análise do Arquivo Alvo

### Visão Geral

[Descrição da finalidade do arquivo]

### Estrutura Identificada

[Padrão Markdown observado]

### Conteúdo Atual

- **Total de itens:** N
- **Principais componentes:** [lista]
- **Status:** [Ativo/Deletado/Misto]
```

**Regras:**

- Seção numerada como "2. Análise do Arquivo Alvo"
- Subsecções com `###` para estrutura
- Deve incluir: visão geral, estrutura, conteúdo
- Responde: "O que o arquivo contém?"

### Seção 3: Estrutura Esperada no JSON

```markdown
## 3. Estrutura Esperada no JSON

Os [artefatos] devem estar estruturados no JSON como:

\`\`\`json
{
"[bloco_json]": {
"[id_1]": {
"name": "[Nome]",
"field1": "valor1"
}
}
}
\`\`\`

### Campos Esperados

| Campo   | Tipo    | Descrição       | Obrigatório |
| ------- | ------- | --------------- | ----------- |
| name    | string  | Nome legível    | ✅          |
| deleted | boolean | Flag de deleção | ❌          |
```

**Regras:**

- Seção numerada como "3. Estrutura Esperada no JSON"
- Deve conter exemplo JSON válido
- Tabela com campos esperados
- Responde: "Como os dados estão estruturados no JSON?"

### Seção 4: Padrão de Markdown para [Artefato]

```markdown
## 4. Padrão de Markdown para [Artefato]

### Padrão Geral

\`\`\`markdown

# [NomeDo Artefato]

## Summary

[Descrição]

## [Seção Principal]

[Conteúdo]
\`\`\`

### Regras de Renderização

- **Regra 1:** [Descrição]
- **Regra 2:** [Descrição]
- **Regra 3:** [Descrição]
```

**Regras:**

- Seção numerada como "4. Padrão de Markdown para [Artefato]"
- Deve conter padrão geral em bloco código
- Lista de regras específicas

### Seção 5: Passos para Recriar o Arquivo

```markdown
## 5. Passos para Recriar o Arquivo

### Fase 1: Preparação

**Passo 1.1** - [Descrição]

- Sub-ação 1
- Sub-ação 2

**Passo 1.2** - [Descrição]
\`\`\`python
[Código exemplo]
\`\`\`

### Fase 2: [Fase Subsequente]

...
```

**Regras:**

- Seção numerada como "5. Passos para Recriar o Arquivo"
- Dividida em fases lógicas
- Passos numerados dentro de cada fase (1.1, 1.2, 2.1, 2.2)
- Pode conter código Python com ```python
- Responde: "Como implementar a recriação?"

### Seção 6-8: Tópicos Específicos

```markdown
## 6. [Tópico Específico 1]

[Conteúdo variável por artefato]

## 7. [Tópico Específico 2]

[Conteúdo variável por artefato]

## 8. [Tópico Específico 3]

[Conteúdo variável por artefato]
```

**Regras:**

- Seções 6+ são específicas por artefato
- Podem incluir: Tratamento de Casos Especiais, Validações, Mapeamento, Estrutura Recomendada, Observações Técnicas
- Numeração continua sequencialmente

### Seção Final: Conclusão

```markdown
## 9. Conclusão

O arquivo `[nome].md` é recriado através do seguinte fluxo:

1. ✅ Passo 1
2. ✅ Passo 2
3. ✅ Passo 3

**Status Final:** [Determinístico/Condicional/Complexo]
```

**Regras:**

- Penúltima ou última seção numerada
- Resume o fluxo completo
- Usa checkmarks (✅) para passos
- Indica status final de implementação

---

## 📐 Aplicação por Artefato

### Elementos Reutilizáveis

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Observações Técnicas, Possíveis Extensões Futuras
- **Complexidade:** Baixa (apenas verificação)

### Option Sets

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Algoritmo de Detecção de Colunas, Tratamento de Casos Especiais
- **Complexidade:** Média (detecção dinâmica)

### Data Types (Tabelas)

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Função de Tradução de Tipos, Tratamento de Casos Especiais, Comparação com Option Sets
- **Complexidade:** Média-Alta (tradução de tipos)

### API Connectors

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Mapeamento de Propriedades, Tratamento de Casos Especiais
- **Complexidade:** Alta (estrutura complexa)

### Backend Workflows

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Definição de Backend Workflows, Observações Técnicas
- **Complexidade:** Baixa (apenas verificação)

### Páginas

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Padrões Identificados, Conclusão Principal
- **Complexidade:** Muito Alta (páginas + elementos + workflows)

### Documentação Completa

- **Seções Padrão:** 1-12
- **Tópicos Específicos:** Estrutura de Agregação, Integração de Componentes
- **Complexidade:** Média (combinação de fontes)

---

## ✅ Checklist de Padronização

Ao criar ou revisar um plano de engenharia reversa, verificar:

- [ ] **Cabeçalho:** Título padronizado, arquivo alvo, arquivo fonte, data
- [ ] **Seção 1:** Objetivo claro e conciso
- [ ] **Seção 2:** Análise do arquivo alvo com visão geral, estrutura, conteúdo
- [ ] **Seção 3:** Estrutura JSON esperada com exemplo
- [ ] **Seção 4:** Padrão Markdown com regras de renderização
- [ ] **Seção 5:** Passos divididos em fases com numeração consistente
- [ ] **Seções 6-8:** Tópicos específicos apropriados
- [ ] **Conclusão:** Resumo do fluxo com status final
- [ ] **Formatação:** Markdown válido, sem erros de sintaxe
- [ ] **Consistência:** Espaçamento, capitalização, terminologia
- [ ] **Exemplos:** Código Python quando apropriado
- [ ] **Tabelas:** Formatação consistente com pipes

---

## 🎯 Convenções de Nomenclatura

### Arquivos de Plano

**Padrão:** `plano_engenharia_reversa_[artefato].md`

**Exemplos:**

- ✅ `plano_engenharia_reversa_elementos_reutilizaveis.md`
- ✅ `plano_engenharia_reversa_option_sets.md`
- ✅ `plano_engenharia_reversa_tabelas.md`
- ✅ `plano_engenharia_reversa_api_connectors.md`
- ✅ `plano_engenharia_reversa_backend_workflows.md`
- ✅ `plano_engenharia_reversa_paginas.md`
- ❌ `plano_engenharia_reversa_[artefato]_para_paginas.md` (OBSOLETO)

### Nomes de Artefatos

**Padrão:** Nome singular ou plural conforme apropriado

**Exemplos:**

- Elementos Reutilizáveis (plural)
- Option Sets (plural, sem tradução)
- Tabelas de Dados (plural)
- API Connectors (plural, sem tradução)
- Backend Workflows (plural, sem tradução)
- Páginas (plural)
- Documentação Completa (singular)

---

## 📝 Template Vazio

Para criar um novo plano, usar este template:

```markdown
# Plano de Engenharia Reversa: [Nome do Artefato]

**Arquivo Alvo:** `[nome]-2026-06-18.md`  
**Arquivo Fonte:** `appBubble - cadastros.annotado.json`  
**Data:** 2026-06-18

---

## 1. Objetivo

[Descrição]

## 2. Análise do Arquivo Alvo

### Visão Geral

[Conteúdo]

### Estrutura Identificada

[Padrão Markdown observado]

### Conteúdo Atual

[Lista de itens/componentes]

## 3. Estrutura Esperada no JSON

[JSON exemplo]

### Campos Esperados

[Tabela de campos]

## 4. Padrão de Markdown para [Artefato]

[Padrão e regras]

## 5. Passos para Recriar o Arquivo

[Fases e passos]

## 6. [Tópico Específico 1]

[Conteúdo]

## 7. [Tópico Específico 2]

[Conteúdo]

## 8. Conclusão

[Resumo e status final]
```

---

## 📞 Contato para Atualizações

Se necessário atualizar os padrões, contatar:

- **Responsável:** AI Agent (Engenharia Reversa)
- **Data da Última Revisão:** 2026-06-18
- **Versão:** 1.0

---

_Este documento define os padrões para todos os planos de engenharia reversa. Manter atualizado conforme novos padrões forem identificados._
