# Análise de Eventos, Botões e Triggers — Módulo Cadastros

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Eventos do Módulo](#2-eventos-do-módulo)
3. [Ações Nativas por Evento](#3-ações-nativas-por-evento)
4. [Webhooks que Podem Ser Configurados](#4-webhooks-que-podem-ser-configurados)
5. [Notificações que Podem Ser Configuradas](#5-notificações-que-podem-ser-configuradas)
6. [APIs/Conectores que Podem Ser Configurados](#6-apisconectores-que-podem-ser-configurados)
7. [Integrações Nativas Disponíveis](#7-integrações-nativas-disponíveis)
8. [Quem Pode Configurar](#8-quem-pode-configurar)
9. [Como Configurar](#9-como-configurar)
10. [Onde Configurar (Frontend — Rotas)](#10-onde-configurar-frontend--rotas)
11. [Onde São Registradas as Definições (Banco de Dados)](#11-onde-são-registradas-as-definições-banco-de-dados)
12. [Variáveis de Payload por Evento](#12-variáveis-de-payload-por-evento)
13. [Assistente de Colunas do Banco](#13-assistente-de-colunas-do-banco)
14. [Logs de Execução](#14-logs-de-execução)

---

## 1. Visão Geral

O módulo **Cadastros** é o módulo central do ERP Conexão, responsável pela gestão de cadastros de clientes (PF/PJ), documentos, aprovações e geração de links. Possui o sistema de eventos mais maduro da aplicação, com **6 eventos registrados** que disparam notificações, webhooks e chamadas de API.

O pipeline de cadastro possui 6 estados (link_gerado → dados_enviados → em_analise → em_correcao → aprovado/reprovado), cada um com seu próprio evento.

---

## 2. Eventos do Módulo

### 2.1 Status Change (4 eventos)

| Evento | Label | Descrição | Tipo |
|---|---|---|---|
| `cadastro.criado` | Cadastro Criado | Dispara quando um novo cadastro é criado | status_change |
| `cadastro.aprovado` | Cadastro Aprovado | Dispara quando um cadastro é aprovado | status_change |
| `cadastro.reprovado` | Cadastro Reprovado | Dispara quando um cadastro é reprovado | status_change |
| `documento.aprovado` | Documento Aprovado | Dispara quando um documento é aprovado | button_action |
| `documento.reprovado` | Documento Reprovado | Dispara quando um documento é reprovado | button_action |
| `link.gerado` | Link Gerado | Dispara quando um link de cadastro é gerado | button_action |

### 2.2 Eventos Legados (Eventos de Status do Pipeline)

Além dos eventos registrados em `module.ts`, o sistema possui **eventos de status do pipeline** definidos em `EVENTOS_STATUS_CHANGE` e `EVENTOS_BUTTON_ACTION` no service `webhooks.ts`:

| Evento | Label | Tipo |
|---|---|---|
| `link_gerado` | Link Gerado | status_change |
| `dados_enviados` | Dados Enviados | status_change |
| `em_analise` | Em Análise | status_change |
| `em_correcao` | Em Correção | status_change |
| `aprovado` | Aprovado | status_change |
| `reprovado` | Reprovado | status_change |
| `botao_compartilhar_link` | Compartilhar Link | button_action |
| `botao_aprovar` | Aprovar Cadastro | button_action |
| `botao_reprovar` | Reprovar Cadastro | button_action |
| `botao_corrigir` | Solicitar Correção | button_action |
| `criacao_credencial` | Criação de Credencial | button_action |

**Total: 11 eventos + 6 eventos de módulo = 17 eventos disponíveis para workflow.**

---

## 3. Ações Nativas por Evento

| Evento | Ações Nativas |
|---|---|
| `link_gerado` | Atualiza status do cadastro para "Link Gerado"; Registra log de criação de link de acesso |
| `dados_enviados` | Salva formulário do pré-cadastro no banco; Atualiza data de envio de dados |
| `em_analise` | Atualiza status para "Em Análise"; Notifica equipe de compliance interna |
| `em_correcao` | Salva observações de correção; Atualiza status para "Em Correção" |
| `aprovado` | Atualiza status para "Aprovado"; Libera acesso completo do cliente no portal |
| `reprovado` | Salva motivo de reprovação; Atualiza status para "Reprovado" |
| `botao_compartilhar_link` | Gera token seguro temporário; Monta URL pública de acesso externo |
| `botao_aprovar` | Altera perfil do cliente para ativo; Gera logs de auditoria |
| `botao_reprovar` | Gera justificativa de reprovação e salva no cadastro |
| `botao_corrigir` | Envia solicitações de reenvio de documentos para o cliente |
| `criacao_credencial` | Cria usuário e senha temporários do parceiro no banco |

---

## 4. Webhooks que Podem Ser Configurados

Através da **Central de Ações** (`/empresa/acoes`), é possível criar webhooks para **qualquer evento do módulo**, onde o usuário define:

| Campo | Descrição |
|---|---|
| Nome | Identificação da ação |
| URL | Endpoint HTTP/HTTPS de destino |
| Método | GET, POST, PUT, PATCH, DELETE |
| Headers | Cabeçalhos HTTP customizados (ex: Authorization, Content-Type) |
| Body Template | JSON com suporte a variáveis `{{campo}}` |
| Gatilho | Evento que dispara o webhook |
| Ativo | Se o webhook está ativo ou não |
| Ordem | Sequência de execução no workflow |

**Funcionalidades adicionais:**
- Importador de cURL: converte comandos cURL em configuração de webhook
- Assistente de variáveis de tabelas do banco: seleciona tabela+coluna e insere como variável
- Teste de payload antes de salvar
- Ordenação por drag/arrow

---

## 5. Notificações que Podem Ser Configuradas

Templates de notificação podem ser criados para disparar notificações internas para usuários:

| Campo | Descrição |
|---|---|
| Título | Título da notificação (suporta `{{variavel}}`) |
| Corpo | Mensagem da notificação (suporta `{{variavel}}`) |
| Gatilho | Evento vinculado |
| Destinatário | `consultor` (criador do cadastro), `cadastro` (setor), `superadmin`, `ti` |
| Ativo | Se o template está ativo |

---

## 6. APIs/Conectores que Podem Ser Configurados

Através dos **API Connectors**, é possível configurar chamadas para APIs externas com:

| Campo | Descrição |
|---|---|
| Nome | Identificação |
| URL | Endpoint de destino |
| Método | GET, POST, PUT, PATCH, DELETE |
| Headers | Cabeçalhos HTTP |
| Query Params | Parâmetros de URL |
| Body Template | JSON do corpo |
| Gatilho | Evento vinculado |
| Schema de Resposta | Schema esperado (opcional) |
| Ativo | Status |

---

## 7. Integrações Nativas Disponíveis

Na Central de Ações, há modelos pré-configurados para integrações nativas:

| Integração | Endpoints Disponíveis |
|---|---|
| **Evolution API (WhatsApp)** | sendText, sendMedia, sendAudio, sendContact, sendLocation, sendReaction, sendLinkPreview, sendButtons, sendList, sendStatus |
| **CEP API** | ViaCEP (consulta CEP), BrasilAPI v1, BrasilAPI v2 (CEP + Geo) |
| **Google Maps** | Geocode, Distance Matrix, Place Autocomplete, Place Details |
| **Google Sheets** | append, getValues, update, clear |
| **Gmail SMTP** | Envio de e-mail personalizado |

---

## 8. Quem Pode Configurar

| Perfil | Configuração |
|---|---|
| **Super Admin** | Acesso total a `/global/acoes` — pode configurar webhooks/notificações globais e de qualquer empresa |
| **Admin de Empresa** | Acesso a `/empresa/acoes` — pode configurar apenas para sua empresa |
| **Consultor** | Sem acesso à Central de Ações |
| **TI** | Sem acesso direto, pode receber permissão via credenciais |

---

## 9. Como Configurar

1. Acessar rota `/empresa/acoes` (admin empresa) ou `/global/acoes` (super admin)
2. Selecionar o módulo "Cadastros" no seletor de módulos
3. Na **Matriz de Gatilhos**, visualizar todos os eventos do módulo
4. Para cada evento, clicar em:
   - **"+ Notificação"** — para criar template de notificação
   - **"+ Webhook"** — para criar webhook
   - **"+ API"** — para criar chamada de API
5. Preencher os campos no editor lateral
6. Testar o payload antes de salvar
7. Reordenar ações via setas up/down
8. Salvar

---

## 10. Onde Configurar (Frontend — Rotas)

| Rota | Perfil | Descrição |
|---|---|---|
| `/empresa/acoes` | Admin Empresa | Central de Ações filtrada por empresa_id |
| `/global/acoes` | Super Admin | Central de Ações global (sem empresa) |
| `/empresa` | Admin Empresa | Menu de navegação → "Central de Ações" |

O componente `CentralAceesTab` é o mesmo em ambas as rotas, diferenciando apenas pelo parâmetro `empresaId`.

---

## 11. Onde São Registradas as Definições (Banco de Dados)

### Tabela `webhooks`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `nome` | TEXT | Nome do webhook |
| `evento` | TEXT | Evento que dispara |
| `tipo_evento` | TEXT | "status_change" \| "button_action" |
| `url` | TEXT | URL de destino |
| `metodo` | TEXT | GET, POST, etc |
| `headers` | JSONB | Cabeçalhos HTTP |
| `body_template` | JSONB | Payload padrão |
| `ativo` | BOOLEAN | Se está ativo |
| `ordem` | INTEGER | Ordem no workflow |
| `modulo_key` | TEXT | "cadastros" |
| `evento_key` | TEXT | Evento específico do módulo |
| `empresa_id` | UUID | FK empresas (null = global) |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### Tabela `webhook_logs`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `webhook_id` | UUID | FK webhooks |
| `evento` | TEXT | Evento executado |
| `url` | TEXT | URL chamada |
| `status_code` | INTEGER | Código HTTP de retorno |
| `resposta` | TEXT | Corpo da resposta (truncado 2000 chars) |
| `sucesso` | BOOLEAN | Se a chamada foi bem-sucedida |
| `payload_enviado` | JSONB | Payload completo enviado |
| `empresa_id` | UUID | FK empresas |
| `created_at` | TIMESTAMPTZ | |

### Tabela `notificacoes_templates`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `evento` | TEXT | Evento vinculado |
| `titulo` | TEXT | Título com suporte a `{{variavel}}` |
| `corpo_template` | TEXT | Mensagem com suporte a `{{variavel}}` |
| `ativo` | BOOLEAN | Se está ativo |
| `ordem` | INTEGER | Ordem no workflow |
| `destinatario_tipo` | TEXT | "consultor" \| "cadastro" \| "superadmin" \| "ti" |
| `modulo_key` | TEXT | "cadastros" |
| `empresa_id` | UUID | FK empresas |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### Tabela `notificacoes`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `usuario_id` | UUID | FK profiles (destinatário) |
| `titulo` | TEXT | Título interpolado |
| `mensagem` | TEXT | Mensagem interpolada |
| `lida` | BOOLEAN | Se foi lida |
| `dados` | JSONB | Dados extras (ex: `{cadastro_id}`) |
| `created_at` | TIMESTAMPTZ | |

### Tabela `api_connectors`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `name` | TEXT | Nome |
| `type` | TEXT | "api_call" \| "webhook" |
| `url` | TEXT | Endpoint |
| `method` | TEXT | GET, POST, etc |
| `headers` | JSONB | Cabeçalhos |
| `query_params` | JSONB | Parâmetros de URL |
| `body_template` | TEXT | Payload |
| `evento` | TEXT | Evento vinculado |
| `tipo_evento` | TEXT | "status_change" \| "button_action" |
| `is_active` | BOOLEAN | Status |
| `ordem` | INTEGER | Ordem no workflow |
| `modulo_key` | TEXT | "cadastros" |
| `empresa_id` | UUID | FK empresas |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### Tabela `atividades`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `entidade_tipo` | TEXT | "cadastro" |
| `entidade_id` | UUID | ID da entidade |
| `acao` | TEXT | Ação executada |
| `descricao` | TEXT | Descrição |
| `usuario_id` | UUID | FK profiles (quem executou) |
| `created_at` | TIMESTAMPTZ | |

### Tabela `integracoes_config`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `chave` | TEXT | Identificador (ex: "evolution_api", "cep_api") |
| `nome` | TEXT | Nome amigável |
| `config` | JSONB | Configuração da integração (credenciais, URLs, chaves) |
| `ativo` | BOOLEAN | Se está ativa |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

---

## 12. Variáveis de Payload por Evento

### Eventos de Cadastro

| Variável | Descrição |
|---|---|
| `{{cadastro_id}}` | ID do cadastro |
| `{{lead_nome}}` | Nome do lead/colaborador |
| `{{email}}` | E-mail do lead |
| `{{motivo}}` | Motivo (reprovação/correção) |
| `{{codigo_cliente}}` | Código após aprovação |
| `{{token}}` | Token do link de acesso |
| `{{link_acesso}}` | URL pública de pré-cadastro |

### Eventos de Documento

| Variável | Descrição |
|---|---|
| `{{cadastro_id}}` | ID do cadastro |
| `{{documento_id}}` | ID do documento |
| `{{motivo}}` | Motivo da ação |
| `{{comentario}}` | Comentário da ação |

### Variáveis de Usuário Realizador (sempre disponíveis)

| Variável | Descrição |
|---|---|
| `{{usuario_nome}}` | Nome do usuário que executou a ação |
| `{{usuario_email}}` | E-mail do usuário |
| `{{usuario_role}}` | Role do usuário |

### Variáveis de Tabelas do Banco (via assistente)

| Formato | Exemplo |
|---|---|
| `{{tabela.coluna}}` | `{{cadastros.colaborador}}`, `{{profiles.nome}}` |

O assistente de colunas na Central de Ações permite selecionar dinamicamente qualquer tabela + coluna do banco e copiar como variável.

---

## 13. Assistente de Colunas do Banco

Na Central de Ações, no editor de webhooks/APIs/notificações, há um **Assistente de Colunas do Banco de Dados** que:

1. Consulta a RPC `obter_esquema_banco()` para listar todas as tabelas e colunas
2. Apresenta dois selects (Tabela + Coluna)
3. Ao clicar "Copiar Variável", insere no formato `{{tabela.coluna}}`
4. Exibe preview do formato no editor

---

## 14. Logs de Execução

Na aba **Logs de Execução** da Central de Ações, é possível visualizar:

- Histórico das últimas 100 execuções de webhooks
- Status code de cada chamada
- Payload enviado
- Resposta da API (truncada)
- Timestamp de execução
- Filtro por gatilho

---

## Observações Importantes

1. **Orquestrador assíncrono**: `dispararWebhooks()` executa em `Promise.resolve().then()` — não bloqueia a requisição original
2. **Fallback de templates**: Se `destinatario_tipo` não encontrar usuários, tenta fallback para `created_by` ou `destinatario_id`
3. **Empresa_id**: Eventos podem ser configurados como "Global" (sem empresa_id) ou "Específico por Empresa"
4. **Variáveis dinâmicas**: O sistema busca dados de tabelas mencionadas nos templates automaticamente via consultas ao banco
5. **Ações nativas**: Não podem ser removidas — são executadas sempre. Webhooks/APIs/notificações são ações adicionais
