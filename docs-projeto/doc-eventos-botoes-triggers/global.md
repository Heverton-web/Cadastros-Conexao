# Análise de Eventos, Botões e Triggers — Infraestrutura Global (Event System)

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O sistema de eventos do ERP Conexão é um **workflow builder** que permite configurar ações automáticas (webhooks, notificações, APIs) disparadas por eventos de módulo. A infraestrutura é compartilhada entre todos os módulos e centralizada na **Central de Ações**.

### Arquitetura em Camadas

```
Evento Ocorre (código)
    │
    ▼
dispararWebhooks(evento, payload, empresaId)
    │
    ├── Busca webhooks ativos → webhooks table
    ├── Busca templates ativos → notificacoes_templates
    ├── Busca api_connectors ativos → api_connectors
    │
    ▼
Orquestrador (ordena por ordem)
    │
    ├── Dispara notificações (dispararNotificacaoIndividual)
    ├── Executa webhooks HTTP (fetch)
    └── Executa API connectors (getActionExecutor)
    │
    ▼
Logs → webhook_logs
```

---

## 2. Componentes do Sistema

### 2.1 Type Definitions

```typescript
type ModuleEvent = {
  key: string;          // Identificador único (ex: "cadastro.criado")
  label: string;        // Nome amigável (ex: "Cadastro Criado")
  descricao: string;    // Descrição do evento
  type?: "status_change" | "button_action";  // Categoria
};
```

### 2.2 Dicionário de Tipos de Evento

| Tipo | Descrição | Exemplos |
|---|---|---|
| `status_change` | Mudança automática de estado | cadastro.aprovado, tarefa.criada |
| `button_action` | Ação manual de botão | documento.aprovado, rota.iniciada |

### 2.3 Orquestrador de Workflows

O `dispararWebhooks()` em `src/core/services/webhooks.ts`:

1. Busca **usuário realizador** (nome, email, role) do auth
2. Busca **dados completos do cadastro** vinculado
3. Consulta em paralelo:
   - `notificacoes_templates` ativos para o evento
   - `webhooks` ativos para o evento
   - `api_connectors` ativos para o evento
4. Monta lista de tarefas com ordem
5. Resolve placeholders `{{tabela.coluna}}` dinamicamente
6. Executa em sequência por ordem
7. Loga resultado em `webhook_logs`

### 2.4 Disparo Específico de Módulo

`dispararEventoModulo(moduloKey, eventoKey, payload, empresaId)`:
- Busca webhooks filtrados por `modulo_key` + `evento_key`
- Similar ao `dispararWebhooks` mas com escopo de módulo

---

## 3. Eventos Consumidos vs Configurados

### Total de Eventos Registrados

| Módulo | Eventos | Status Change | Button Action |
|---|---|---|---|
| Cadastros | 6 | 3 | 3 |
| Funis | 12 | 9 | 3 |
| Hub | 8 | 7 | 1 |
| Mapas | 8 | 8 | 0 |
| Despesas | 7 | 5 | 2 |
| Rotas | 4 | 2 | 2 |
| CRM | 3 | 2 | 1 |
| NPS | 3 | 2 | 1 |
| LinkTree | 3 | 3 | 0 |
| Gerador Links | 0 | 0 | 0 |
| Marketing | 0 | 0 | 0 |
| Empresa | 0 | 0 | 0 |
| **Total** | **54** | **41** | **13** |

### Eventos Legados do Pipeline (adicional)

| Evento | Tipo | Origem |
|---|---|---|
| `link_gerado` | status_change | Cadastros |
| `dados_enviados` | status_change | Cadastros |
| `em_analise` | status_change | Cadastros |
| `em_correcao` | status_change | Cadastros |
| `aprovado` | status_change | Cadastros |
| `reprovado` | status_change | Cadastros |
| `botao_compartilhar_link` | button_action | Cadastros |
| `botao_aprovar` | button_action | Cadastros |
| `botao_reprovar` | button_action | Cadastros |
| `botao_corrigir` | button_action | Cadastros |
| `criacao_credencial` | button_action | Admin Global |

---

## 4. Quem Pode Configurar

| Perfil | Rota | Escopo |
|---|---|---|
| **Super Admin** | `/global/acoes` | Global + Qualquer empresa |
| **Admin de Empresa** | `/empresa/acoes` | Apenas sua empresa |
| **Consultor** | — | Sem acesso |
| **TI** | — | Sem acesso (pode receber permissão) |

---

## 5. Como Configurar (Fluxo Completo)

1. Acessar `/empresa/acoes` (admin) ou `/global/acoes` (super admin)
2. Selecionar **empresa** (apenas super admin pode selecionar)
3. Selecionar **módulo** no dropdown
4. Visualizar **Matriz de Gatilhos** com todos os eventos do módulo
5. Para cada evento:
   - Ver **ações nativas** (sempre executadas)
   - Adicionar ações customizadas:
     - **Notificação**: template com título, corpo e destinatário
     - **Webhook**: URL, método, headers, body
     - **API**: URL, método, headers, query params, body
6. **Reordenar** ações com setas up/down
7. **Testar** payload antes de salvar
8. **Salvar**
9. Ver **Logs de Execução** na aba "Logs"

### Funcionalidades do Editor

- **Importador de cURL**: Converte comandos cURL em configuração
- **Assistente de Colunas**: Seleciona tabela+coluna e copia como variável
- **Payload Padrão**: Carrega JSON sugerido para o evento
- **Teste de Notificação**: Interpola variáveis e mostra resultado
- **Teste de API**: Executa chamada real e mostra resposta
- **KV Editor**: Adiciona/remove headers e query params

---

## 6. Onde Configurar (Frontend — Rotas)

| Rota | Perfil | Componente | Descrição |
|---|---|---|---|
| `/empresa/acoes` | Admin Empresa | `CentralAcoesTab` com `empresaId` | Configuração por empresa |
| `/global/acoes` | Super Admin | `CentralAcoesTab` sem `empresaId` | Configuração global |
| `/global/acoes` (abas) | Super Admin | `SupabaseTab`, `CredenciaisTab`, `IntegracoesTab`, `DemosTab`, `FormBuilderTab` | Configurações complementares |

### Abas Adicionais em `/global/acoes`

| Aba | Função |
|---|---|
| Supabase | Configurações de conexão Supabase (app_config) |
| Credenciais | Gerenciamento de credenciais e permissões de usuários |
| Central de Ações | Matriz de gatilhos e logs |
| Demos | Credenciais de demonstração |
| Integrações | Configuração de integrações nativas |
| Formulário | Builder de formulários dinâmicos |

---

## 7. Onde São Registradas as Definições (Banco de Dados)

### Tabelas do Sistema de Eventos

| Tabela | Finalidade | Schema |
|---|---|---|
| `webhooks` | Webhooks configurados | `public` |
| `webhook_logs` | Logs de execução | `public` |
| `notificacoes_templates` | Templates de notificação | `public` |
| `notificacoes` | Notificações enviadas | `public` |
| `api_connectors` | Conectores de API | `public` |
| `atividades` | Log de atividades | `public` |
| `integracoes_config` | Configuração de integrações nativas | `public` |
| `app_config` | Configurações globais da aplicação | `public` |

### Relacionamentos

```
webhooks.modulo_key ───────► ModuleDefinition.key (lógico)
webhooks.empresa_id ───────► empresas.id
webhook_logs.webhook_id ───► webhooks.id
notificacoes.usuario_id ───► profiles.id
api_connectors.empresa_id ─► empresas.id
atividades.usuario_id ─────► profiles.id
```

---

## 8. Integrações Nativas Disponíveis

### Evolution API (WhatsApp)

| Endpoint | Descrição |
|---|---|
| `sendText` | Envio de mensagem de texto |
| `sendMedia` | Envio de imagem/documento |
| `sendAudio` | Envio de áudio gravado |
| `sendContact` | Envio de contato (VCard) |
| `sendLocation` | Envio de localização |
| `sendReaction` | Envio de reação (emoji) |
| `sendLinkPreview` | Envio de link com preview |
| `sendButtons` | Envio de botões interativos |
| `sendList` | Envio de lista de opções |
| `sendStatus` | Envio de status/story |

### CEP API

| Endpoint | Descrição |
|---|---|
| `viacep` | Consulta CEP via ViaCEP |
| `brasilapi_v1` | Consulta CEP via BrasilAPI v1 |
| `brasilapi_v2` | Consulta CEP + Coordenadas via BrasilAPI v2 |

### Google Maps

| Endpoint | Descrição |
|---|---|
| `geocode` | Geocodificar endereço |
| `distancematrix` | Calcular distância entre pontos |
| `placeautocomplete` | Autocomplete de locais |
| `placedetails` | Detalhes de local por ID |

### Google Sheets

| Endpoint | Descrição |
|---|---|
| `append` | Inserir linha em planilha |
| `getvalues` | Ler linhas da planilha |
| `update` | Atualizar linha na planilha |
| `clear` | Limpar células da planilha |

### Gmail SMTP

| Endpoint | Descrição |
|---|---|
| `send` | Envio de e-mail personalizado |

---

## 9. Variáveis de Sistema

### Variáveis de Usuário Realizador

| Variável | Origem |
|---|---|
| `{{usuario_nome}}` | profiles.nome |
| `{{usuario_email}}` | auth.email |
| `{{usuario_role}}` | profiles.role |

### Variáveis de Cadastro

| Variável | Origem |
|---|---|
| `{{lead_nome}}` | cadastros.colaborador |
| `{{cadastro_id}}` | cadastros.id |
| `{{email}}` | cadastros.email |

### Template Placeholder System

O sistema suporta placeholders no formato `{{tabela.coluna}}` que são resolvidos dinamicamente durante a execução do workflow. O processo:

1. Escaneia todos os templates por `{{...}}`
2. Identifica quais tabelas são necessárias
3. Busca dados das tabelas via Supabase
4. Substitui placeholders pelos valores reais

---

## 10. Logs de Execução

### Tabela `webhook_logs`

| Coluna | Descrição |
|---|---|
| `id` | UUID |
| `webhook_id` | Webhook executado |
| `evento` | Evento disparado |
| `url` | URL chamada |
| `status_code` | HTTP status code |
| `resposta` | Resposta (truncada 2000 chars) |
| `sucesso` | Booleano |
| `payload_enviado` | JSON completo enviado |
| `empresa_id` | Empresa |
| `created_at` | Data/hora |

**Limite:** Últimas 100 execuções na UI.

---

## 11. Considerações Técnicas

1. **Assíncrono não-bloqueante**: `dispararWebhooks()` roda em `Promise.resolve().then()` — não aguarda conclusão
2. **Empresa_id**: Webhooks podem ser globais (null) ou específicos por empresa
3. **Fallback notificações**: Se `destinatario_tipo` não encontrar usuários, usa fallback para `created_by`
4. **Payload enriquecido**: O sistema automaticamente busca:
   - Dados do usuário logado
   - Dados completos do cadastro vinculado
   - Dados de tabelas mencionadas nos templates
5. **Modelos nativos**: Templates pré-configurados para Evolution API, CEP, Google Maps, Google Sheets e Gmail

---

## 12. Divergências e Melhorias

### Divergências Identificadas

| Módulo | Problema |
|---|---|
| Mapas | Eventos sem campo `type` |
| Marketing + Gerador Links + Empresa | 0 eventos registrados |
| Eventos legados pipeline | Definições duplicadas (module.ts + webhooks.ts) |
| `tipo_evento` nullable | Em `api_connectors` o campo é opcional |

### Recomendações

1. **Adicionar eventos ao Marketing** (leads, email, landing pages)
2. **Adicionar eventos ao Gerador Links** (cliques em links gerados)
3. **Normalizar campo `type` nos eventos do Mapas**
4. **Unificar eventos legados do pipeline** com os eventos registrados em module.ts
5. **Adicionar webhook de debug** para testar payload sem executar ação real
6. **Suporte a retry automático** em falhas de webhook
7. **Webhook de saúde** (ping periódico para monitorar endpoints)
