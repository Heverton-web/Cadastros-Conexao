# Implementação do "API Connector" Nativo e Ferramenta de Testes (Postman)

## Arquitetura Definida

- **Motor de Execução:** Será utilizada a arquitetura de **Supabase Edge Functions** como intermediário seguro. A função receberá o ID do `api_connector`, lerá do banco os Headers (incluindo chaves secretas), a URL e o Body Template. Fazerá a interpolação das variáveis enviadas pelo frontend/cliente, fará o HTTP Request ao serviço externo (CNPJ, N8N, etc.) e devolverá a Resposta diretamente ao cliente ou armazenará em log se for assíncrono.
- **Armazenamento:** Criação da tabela `api_connectors` no Postgres.
- **Frontend (Painel Postman):** Criação de uma aba Administrativa para cadastrar, editar e "Testar/Inicializar" a chamada de API.

## Tabela `api_connectors`

- `id` (uuid)
- `name` (text)
- `type` (text) - "api_call" ou "webhook"
- `method` (text)
- `url` (text)
- `headers` (jsonb)
- `query_params` (jsonb)
- `body_template` (text)
- `response_schema` (jsonb) - Para guardar o formato da última resposta recebida
- `is_active` (boolean)

## Edge Function (`api_runner`)

- Recebe `{ connector_id, variables }`.
- Carrega as configs.
- Interpola as `variables` usando Regex simples `{{var}}` em URLs, Headers e Body.
- Executa `fetch`.
- Retorna o resultado.

## Componente React `ApiTesterTab.tsx`

- Lista as chamadas em um menu lateral.
- Editor central com abas: Headers, Params, Body.
- Aba de Teste: preenche os valores mock das variáveis encontradas no texto (`{{xyz}}`).
- Exibe bloco de Resposta com Status HTTP, Duração e Body.
