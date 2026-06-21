# Especificação Técnica: Workflow Builder Sequencial (Matriz de Passos)

Esta especificação detalha o funcionamento e a implementação do **Workflow Builder Sequencial** na Central de Ações do Super Admin.

---

## 1. Funcionamento dos Disparos e Sequenciamento

As ações de um determinado gatilho (evento do sistema) são organizadas e disparadas de forma sequencial na ordem definida pela propriedade `ordem`. 

### Comportamento da Fila:
- **Execução Sequencial e Assíncrona:** O disparo total do workflow roda em background (assíncrono em relação à interface do usuário para não travar a navegação), mas as etapas individuais dentro dele rodam em ordem sequencial (síncronas entre si).
- **Tratamento de Erros:** Se um passo falhar (ex: webhook retornar 500 ou timeout), a falha é registrada nos logs (`webhook_logs`), mas a fila **continua** a execução dos passos subsequentes normalmente.
- **Ações Nativas vs. Customizadas:**
  - **Passo 1 (Nativo):** Representa as operações internas do sistema.
  - **Passos Customizados (2 em diante):** Ações adicionadas pelo Super Admin (Notificações, chamadas de API, Webhooks).

---

## 2. Estrutura do Banco de Dados

A propriedade `ordem` é adicionada para controlar a sequência exata de cada ação vinculada a um gatilho.

### Migrations SQL:
Adicionar a coluna `ordem` (inteiro, padrão `0` ou sequencial) nas tabelas:
- `api_connectors`: `ordem INT DEFAULT 0`
- `notificacoes_templates`: `ordem INT DEFAULT 0`
- `webhooks` (legada): `ordem INT DEFAULT 0`

---

## 3. Interface do Usuário (CentralAcoesTab.tsx)

A aba **Workflows (Matriz de Gatilhos)** exibirá uma visualização em formato de timeline vertical:

1. **Cabeçalho do Gatilho:** Nome do evento (ex: "Compartilhar Link").
2. **Timeline de Passos:**
   - **Passo 1: Ação Nativa:** Fixo, descrevendo a operação padrão do sistema.
   - **Passos Customizados (2, 3...):** Cards para cada Notificação, API ou Webhook configurado, com o número do passo explícito.
3. **Controles de Ordenação:** Botões `Mover para Cima` e `Mover para Baixo` que ajustam o valor de `ordem` e salvam instantaneamente.
4. **Adição Inline:** Botão `+ Adicionar Ação` que abre um modal ou preenche o formulário para cadastro de um novo item com o gatilho pré-selecionado.
