# Análise de APIs e Integrações — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Supabase RPC + pg_net + APIs Externas

---

## 1. Visão Geral

O ERP Conexão possui **3 categorias** de APIs:

1. **RPCs do Supabase** — Funções PostgreSQL chamadas como API
2. **Integrações Nativas** — Configuradas via UI (Evolution API, CEP, Google Maps, Gmail, Sheets)
3. **API Connectors** — Customizáveis via Central de Ações

---

## 2. RPCs do Supabase (~50+ funções)

### 2.1 Administrativas

| RPC | Migração | Descrição |
|---|---|---|
| `admin_criar_usuario` | 00047 | Cria auth user + profile |
| `admin_atualizar_senha` | 00046 | Atualiza senha de usuário |
| `admin_deletar_usuario` | 00052 | Remove usuário completo |

### 2.2 Segurança

| RPC | Migração | Descrição |
|---|---|---|
| `is_super_admin_session()` | 00023 | Verifica se é super admin |
| `is_admin_or_super()` | 00023 | Verifica admin ou super |
| `get_current_empresa_id()` | 00023 | Retorna empresa_id do auth |
| `pode_acessar_empresa(uuid)` | 00023 | Verifica acesso a empresa |
| `gerar_2fa_pin(text, text, text, text)` | 00015 | Gera PIN para 2FA |
| `validar_2fa_pin(text, text)` | 00015 | Valida PIN com expiração 5min |

### 2.3 Integrações

| RPC | Migração | Descrição |
|---|---|---|
| `executar_api_connector_server(uuid, jsonb)` | 00022 | Executa conector via pg_net |
| `enviar_whatsapp_evolution(text, text)` | 00016 | Envia WhatsApp via pg_net |

### 2.4 Utilitárias

| RPC | Descrição |
|---|---|
| `obter_esquema_banco()` | Lista tabelas + colunas (assistente Central de Ações) |
| `get_permissoes_padrao(text)` | Retorna permissões padrão por ambiente |

---

## 3. Integrações Nativas

### 3.1 Configuração

Tabela `integracoes_config` — gerenciada em `/global/acoes` (abas Integrações):

| Chave | Nome | Config JSON |
|---|---|---|
| `evolution_api` | Evolution API (WhatsApp) | `{base_url, api_key, instancia}` |
| `cep_api` | CEP Resiliente | `{provider: "brasilapi"\|"viacep"}` |
| `google_maps` | Google Maps | `{api_key}` |
| `google_sheets` | Google Sheets | `{spreadsheet_id, client_email, private_key}` |
| `google_drive` | Google Drive | `{folder_id, client_email, private_key}` |
| `gmail_smtp` | SMTP/E-mail | `{host, port, user, pass}` |

### 3.2 Evolution API (WhatsApp)

**Endpoints disponíveis na Central de Ações:**
- `sendText` — Texto simples
- `sendMedia` — Imagem/documento
- `sendAudio` — Áudio
- `sendContact` — VCard
- `sendLocation` — Localização
- `sendReaction` — Reação (emoji)
- `sendLinkPreview` — Link com preview
- `sendButtons` — Botões interativos
- `sendList` — Lista de opções
- `sendStatus` — Status/Story

**Envio assíncrono via banco:**
```sql
SELECT public.enviar_whatsapp_evolution('5511999999999', 'Olá!');
```
Usa `pg_net` (extensão PostgreSQL) para HTTP POST assíncrono.

### 3.3 CEP API

**Fluxo resiliente:**
1. Tenta BrasilAPI (provider principal)
2. Se falhar, fallback automático para ViaCEP
3. Abort após 3.5s de timeout

### 3.4 Google Maps

**Edge Function:** `supabase/functions/calcular-distancia/`
- Autenticação: `requireSupabaseAuth`
- Busca chave da empresa em `rotas_config`
- Chama Distance Matrix API do Google
- Retorna distância km + duração minutos

### 3.5 ViaCEP (Frontend)

`src/core/utils/viacep.ts` — chamada direta do frontend para consulta de CEP.

---

## 4. API Connectors (Customizáveis)

Tabela `api_connectors` — gerenciado via Central de Ações:

### 4.1 Funcionalidades

- **Importador de cURL**: Converte comando cURL em configuração
- **Modelos nativos**: Templates para Evolution, CEP, Google Maps, Sheets, Gmail
- **Teste de payload**: Mock de variáveis antes de salvar
- **Ordenação**: Workflow em ordem sequencial

### 4.2 Execução

A RPC `executar_api_connector_server`:
1. Busca conector por ID
2. Interpola placeholders `{{var}}`
3. Usa `pg_net.http_get()` ou `net.http_post()` para chamada assíncrona
4. Loga resultado em `webhook_logs`

---

## 5. Webhooks

Tabela `webhooks` — gerenciado via Central de Ações:

- **Disparo síncrono**: `dispararWebhooks()` em `src/core/services/webhooks.ts`
- **Orquestrador**: Busca notificações + webhooks + api_connectors vinculados ao evento
- **Payload enriquecido**: Busca dados do usuário realizador + cadastro + tabelas mencionadas
- **Execução ordenada**: Por ordem numérica

---

## 6. Supabase Edge Functions

| Função | Path | Uso |
|---|---|---|
| `calcular-distancia` | `supabase/functions/calcular-distancia/` | Google Maps Distance Matrix |

Escritas em Deno (TypeScript), autenticação via Supabase.

---

## 7. Fluxo de Execução Completo

```
Evento (ex: cadastro.aprovado)
    │
    ▼
dispararWebhooks(evento, payload, empresaId)
    │
    ├── Busca templates notificacao → dispara notificações internas
    ├── Busca webhooks ativos → executa HTTP POST/GET
    └── Busca api_connectors → executa via RPC pg_net
    │
    ▼
Registra log em webhook_logs (status, resposta, payload)
```

---

## 8. RPCs de Segurança

Todas as RPCs executam com:
- `SECURITY DEFINER` — bypassa RLS
- `SET search_path = ''` — previne path injection
- Concedidas a `service_role` para admins
