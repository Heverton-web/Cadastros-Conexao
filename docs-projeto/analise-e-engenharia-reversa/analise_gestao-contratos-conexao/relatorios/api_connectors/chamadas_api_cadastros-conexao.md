# Chamadas de API (API Connectors)

## BUSCA CNPJ - CNPJ.WS

# BUSCA CNPJ - CNPJ.WS

## Summary
Este conector de API integra com o serviço CNPJ.WS para realizar consultas detalhadas de informações cadastrais de empresas pelo CNPJ. Ele permite recuperar dados como razão social, capital social, natureza jurídica, informações do estabelecimento e status fiscal.

## Calls

| Call | Método | Path |
|--------|--------|------|
| Consultar CNPJ | GET | /api/v1/cnpj/{cnpj} |

---

### Consultar CNPJ

# Consultar CNPJ

## Summary
Chamada de API para consultar informações de um CNPJ, retornando dados cadastrais, de estabelecimento e situação fiscal.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | GET |
| Path | api-connectors/bTIwu/calls/bTIwz |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| CNPJ | text | Sim |

## Response

A resposta contém informações detalhadas do CNPJ, incluindo:
- `cnpj_raiz`: CNPJ raiz.
- `razao_social`: Razão social da empresa.
- `capital_social`: Valor do capital social.
- `responsavel_federativo`: Nome do responsável federativo.
- `atualizado_em`: Data de atualização dos dados.
- `porte`: Informações sobre o porte da empresa (ID e descrição).
- `natureza_juridica`: Informações sobre a natureza jurídica (ID e descrição).
- `qualificacao_do_responsavel`: Informações sobre a qualificação do responsável (ID e descrição).
- `simples`: Detalhes sobre o regime Simples Nacional (status, datas, MEI).
- `estabelecimento`: Dados do estabelecimento principal (CNPJ, nome fantasia, endereço, contatos, situação cadastral, etc.).
- `estabelecimento.atividades_secundarias`: Lista de atividades secundárias do estabelecimento.

## Buscar DDI

# Buscar DDI

## Summary
Este conector de API busca informações detalhadas sobre países, incluindo códigos DDI, capitais, moedas, populações e nomes em diferentes idiomas.

## Calls

| Call | Método | Path |
|---|---|---|
| Buscar DDI | GET | /all |

### cURL Call

# cURL Call

## Summary
Esta API Call é responsável por buscar informações gerais sobre países, incluindo dados demográficos, geográficos e governamentais.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | GET |
| Path | api-connectors/bTPab/calls/bTPac |
| Autenticação | None |

## Parâmetros
Esta API Call não possui parâmetros configurados.

## Response
O retorno desta API Call é uma lista de objetos, onde cada objeto representa um país e contém informações detalhadas sobre ele. Exemplos de campos retornados incluem:

- `objects.region`: A região do país.
- `objects.subregion`: A sub-região do país.
- `objects.area`: A área territorial do país.
- `objects.borders`: Uma lista de códigos dos países vizinhos.
- `objects.calling_codes`: Uma lista dos códigos telefônicos de discagem.
- `objects.cars`: Informações sobre as placas de carro.
- `objects.classification`: Classificação do país.
- `objects.continents`: Uma lista dos continentes aos quais o país pertence.
- `objects.coordinates`: As coordenadas geográficas (latitude e longitude).
- `objects.currencies`: Uma lista de moedas utilizadas no país.
- `objects.date`: Informações sobre datas relevantes.
- `objects.demonyms`: O gentílico do país.
- `objects.economy`: Dados econômicos do país.
- `objects.government_type`: O tipo de governo.
- `objects.landlocked`: Indica se o país é sem saída para o mar.
- `objects.languages`: Uma lista de idiomas falados no país.
- `objects.leaders`: Informações sobre os líderes do país.
- `objects.links`: Links relacionados ao país.
- `objects.memberships`: Membresias em organizações internacionais.
- `objects.number_format`: Formato de números utilizado.
- `objects.parent`: Informações sobre o país "pai" (em caso de territórios dependentes).
- `objects.population`: A população do país.
- `objects.postal_code`: Formato do código postal.
- `objects.timezones`: Uma lista de fusos horários.
- `objects.tlds`: Uma lista de Top-Level Domains.
- `objects.uuid`: Identificador único do país.
- `objects.names`: Contém o nome do país em diferentes formatos (comum, nativo, oficial, traduzido).
- `meta`: Metadados da resposta, incluindo `total`, `count`, `limit`, `offset`, `more`, `request_id` e `duration`.

## Consulta CNPJ

# Consulta CNPJ (API Connector)

## Summary
Este conector permite consultar informações de CNPJ através da API da CNPJ.

## Calls

| Call       | Método | Path                   |
|------------|--------|------------------------|
| Buscar CNPJ | GET    | /office/[CPNJ]         |

---

### Buscar CNPJ

# Buscar CNPJ

## Summary
Esta API Call busca informações detalhadas de um CNPJ utilizando um serviço externo. Retorna dados como razão social, endereço, atividades e informações sobre sócios.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | GET |
| Path | `https://api.cnpja.com/office/[CPNJ]` |
| Autenticação | Não especificada (mas header `bTIwp` está configurado como privado) |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| CPNJ | text | Sim |

## Response
A resposta é uma estrutura complexa de dados contendo um vasto conjunto de informações sobre a empresa, incluindo dados básicos, endereço, atividades econômicas, sócios, telefones e emails. As propriedades retornadas são:

- `updated`: Data da última atualização dos dados.
- `taxId`: CNPJ da empresa.
- `company`: Objeto contendo informações detalhadas da empresa:
    - `id`: ID interno da empresa.
    - `name`: Razão social da empresa.
    - `equity`: Capital social da empresa.
    - `nature`: Objeto com ID e descrição da natureza jurídica.
    - `size`: Objeto com ID, sigla e descrição do porte da empresa.
    - `members`: Lista de sócios da empresa.
- `alias`: Nome fantasia da empresa.
- `founded`: Data de fundação da empresa.
- `head`: Indica se é a sede da empresa (booleano).
- `statusDate`: Data da última alteração de status.
- `status`: Objeto com ID e descrição do status da empresa.
- `address`: Objeto com detalhes do endereço.
    - `municipality`: Código do município.
    - `street`: Logradouro.
    - `number`: Número.
    - `details`: Complemento do endereço.
    - `district`: Bairro.
    - `city`: Cidade.
    - `state`: Estado.
    - `zip`: CEP.
    - `country`: Objeto com ID e nome do país.
- `phones`: Lista de telefones da empresa.
- `emails`: Lista de emails da empresa.
- `mainActivity`: Objeto com ID e descrição da atividade principal.
- `sideActivities`: Lista de atividades secundárias da empresa.

## BUSCA CRO

# BUSCA CRO

## Summary
Este conector de API permite consultar dados de CRO (Cadastro de Representantes Oficiais) utilizando uma chave de API e parâmetros de busca como tipo, UF e nome/número. Ele retorna informações detalhadas sobre os representantes encontrados.

## Calls

| Call | Método | Path |
|---|---|---|
| Consultar CRO | GET | https://www.consultacrm.com.br/api/index.php?tipo=[TIPO]&uf=[UF]&q=[NOME_NÚMERO]&chave=[API_KEY]&destino=json |

### Consultar CRO

# Consultar CRO

## Summary
Esta API Call busca informações de CRO (Cadastro de Pessoas Físicas) utilizando parâmetros como tipo, UF, nome/número e chave de API. Retorna dados estruturados em formato JSON.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | GET |
| Path | https://www.consultacrm.com.br/api/index.php?tipo=[TIPO]&uf=[UF]&q=[NOME_NÚMERO]&chave=[API_KEY]&destino=json |
| Autenticação | Não especificada (parâmetros na URL) |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| TIPO | text | Sim |
| UF | text | Sim |
| NOME_NÚMERO | text | Sim |
| API_KEY | text | Sim |

## Response

| Propriedade | Tipo |
|-------------|------|
| url | text |
| total | number |
| status | text |
| mensagem | text |
| api_limite | text |
| api_consultas | number |
| item | list |

### Estrutura do `item` (subtipo `Consultar CRO item`)

| Propriedade | Tipo |
|-------------|------|
| id | text |
| uid | text |
| tipo | text |
| nome | text |
| numero | text |
| profissao | text |
| uf | text |
| situacao | text |
| link | text |

## CONSULTAS CRO 02

# CONSULTAS CRO 02 (API Connector)

## Summary
Este conector de API integra-se à API InfoSimples para realizar consultas de cadastro de CRO (Conselho Regional de Odontologia). Ele permite buscar informações detalhadas sobre um CRO específico em uma determinada UF.

## Calls

| Call                  | Método | Path                                     |
| --------------------- | ------ | ---------------------------------------- |
| Buscar CRO 02         | POST   | `https://api.infosimples.com/api/v2/consultas/cro/[UF]/cadastro` |

### Buscar CRO 02

# Buscar CRO 02

## Summary
Esta API Call realiza uma busca de informações de registro de um Conselho Regional de Odontologia (CRO) utilizando o número de inscrição e o estado (UF). Retorna detalhes do profissional e suas responsabilidades.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | `https://api.infosimples.com/api/v2/consultas/cro/[UF]/cadastro` |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| UF | text | Sim (path parameter) |
| NUMERO_CRO | text | Sim (body parameter) |
| TOKEN | text | Sim (body parameter) |
| timeout | text | Não (body parameter, valor padrão: "300") |

## Response

| Campo | Tipo | Descrição |
|---|---|---|
| code | number | Código de status da resposta da API. |
| code_message | text | Mensagem correspondente ao código de status. |
| header | object | Informações do cabeçalho da resposta da API. |
| data_count | number | Número de registros retornados. |
| data | list | Lista de registros de CRO encontrados. |

**Detalhes do objeto `data`:**

| Campo | Tipo | Descrição |
|---|---|---|
| categoria | text | Categoria do profissional. |
| email | text | Email do profissional. |
| endereco_cidade | text | Cidade do endereço do profissional. |
| endereco_uf | text | UF do endereço do profissional. |
| especialidades | text | Especialidades do profissional. |
| inscricao | text | Número de inscrição do CRO. |
| inscricao_data | text | Data de inscrição do CRO. |
| inscricao_tipo | text | Tipo de inscrição. |
| nome | text | Nome completo do profissional. |
| normalizado_inscricao_data | text | Data de inscrição normalizada. |
| normalizado_situacao_data | text | Data de situação normalizada. |
| responsabilidades | list | Lista de responsabilidades do profissional. |
| site | text | Site do profissional. |
| situacao | text | Situação do registro do CRO. |
| situacao_data | text | Data da situação do CRO. |
| situacao_detalhe | text | Detalhe da situação do CRO. |
| telefone | text | Telefone do profissional. |
| site_receipt | text | Site de recebimento. |

**Detalhes do objeto `responsabilidades`:**

| Campo | Tipo | Descrição |
|---|---|---|
| tipo | text | Tipo da responsabilidade. |
| responsavel_tecnico | text | Nome do responsável técnico. |
| categoria_responsavel | text | Categoria do responsável. |
| empresa | text | Nome da empresa associada à responsabilidade. |
| empresa_categoria | text | Categoria da empresa. |

## Encurtador Link

# Encurtador Link

## Summary
Este conector API integra um serviço para encurtar URLs. Permite a criação de links curtos através de uma chamada POST.

## Calls

| Call     | Método | Path                         |
|----------|--------|------------------------------|
| Encurtar | POST   | https://api.encurtador.dev/encurtamentos |


### Encurtar

# Encurtar (API Call)

## Summary
Realiza uma chamada POST para a API externa "encurtador.dev" para encurtar uma URL.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://api.encurtador.dev/encurtamentos |
| Autenticação | Nenhuma (inferido pelo payload) |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| URL | text | Sim |

## Response
Retorna um objeto JSON contendo a URL encurtada no campo `urlEncurtada`.

## Evolution API

# Evolution API

## Summary
Este conector de API integra a Evolution API, permitindo o envio de mensagens de texto e mídias. Possui chamadas para enviar texto e para enviar imagens via URL.

## Calls

| Call | Método | Path |
|---|---|---|
| Enviar Texto | POST | https://evoapi.signa-docs.com/message/sendText/Teste_7f1f7c74 |
| Enviar URL de Imagem | POST | https://evoapi.signa-docs.com/message/sendMedia/Teste_7f1f7c74 |

### Enviar Texto

# Enviar Texto

## Summary
Esta chamada de API é usada para enviar mensagens de texto através da API EvoAPI. Ela permite especificar o número do destinatário, o texto da mensagem e um atraso opcional.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://evoapi.signa-docs.com/message/sendText/Teste_7f1f7c74 |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| body | text | Sim |

## Response
A resposta desta chamada de API pode conter os seguintes campos (com base nos dados fornecidos):

*   `key.remoteJid` (text)
*   `key.fromMe` (boolean)
*   `key.id` (text)
*   `pushName` (text)
*   `status` (text)
*   `message.conversation` (text)
*   `messageType` (text)
*   `messageTimestamp` (number)
*   `instanceId` (text)
*   `source` (text)

### Enviar URL de Imagem

# Enviar URL de Imagem

## Summary
Esta API call envia uma mídia (imagem) com legenda via URL para a API Evolution-API.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://evoapi.signa-docs.com/message/sendMedia/Teste_7f1f7c74 |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| body | text | Sim |

## Response
Retorna um objeto JSON contendo `id`, `jid` e informações sobre a chamada.

```json
{
  "id": "string value",
  "jid": "string value",
  "isVideo": false,
  "callDuration": 3
}
```

## Webhook N8N

# Webhook N8N

## Summary
Este conector de API integra-se com o Webhook N8N para enviar dados em massa, incluindo conteúdo e uma lista de leads.

## Calls

| Call | Método | Path |
|---|---|---|
| Envio em massa | POST | https://primary-production-c096c.up.railway.app/webhook-test/webhook001 |

### Envio em massa

# Envio em massa (API Call)

## Summary
Realiza uma chamada POST para enviar conteúdo e uma lista de leads para um endpoint específico em um serviço externo.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://primary-production-c096c.up.railway.app/webhook-test/webhook001 |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| conteudo | text | Sim |
| leads | text | Sim |

## Response
Retorna o tipo `api.apiconnector2.bTMSd.bTMSe`. O campo `message` com tipo `text` é esperado.

## Webhook - Envio email Conexão

# Webhook - Envio email Conexão

## Summary
Este conector de API integra chamadas para um webhook externo, permitindo o envio de e-mails com templates pré-definidos e o registro de eventos.

## Calls

| Call | Método | Path |
|---|---|---|
| Enviar email com template | POST | https://flows-webhook.signa-docs.com/webhook/conexao_cadastros |
| Email evento | POST | https://flows-webhook.signa-docs.com/webhook/evento |

### Enviar email com template

# Enviar email com template

## Summary
Esta API Call envia um email utilizando um template pré-definido, utilizando informações do cliente, consultor e um link específico.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | /webhook/conexao_cadastros |
| Autenticação | Nenhuma |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| `nomeCliente` | text | Não |
| `email` | text | Não |
| `link` | text | Não |
| `nomeConsultor` | text | Não |
| `idConsultor` | text | Não |
| `codigoCliente` | text | Não |
| `acaoCliente` | text | Não |

## Response
O retorno esperado é um objeto com uma propriedade `message` do tipo texto.

### Email evento

# Email evento

## Summary
Configura uma chamada de API para enviar dados de evento para um webhook. Utiliza o método POST e envia informações detalhadas sobre o cliente, número do sorteio, status e dados de conexão evolucionária.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flows-webhook.signa-docs.com/webhook/evento |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_cliente | text | Não |
| cpf_cliente | text | Não |
| cro_cliente | text | Não |
| whats_cliente | text | Não |
| email_cliente | text | Não |
| cidade_cliente | text | Não |
| uf_cliente | text | Não |
| tipo_cadastro | text | Não |
| numero_sorteio | number | Não |
| status | text | Não |
| zapCliente | text | Não |

## Response
Não especificada.

## TINYURL

# TINYURL

## Summary
Este conector API integra funcionalidades da TinyURL para criar e gerenciar URLs encurtadas. Permite encurtar links e modificar aliases de URLs existentes.

## Calls

| Call        | Método | Path                 |
|-------------|--------|----------------------|
| Encurtar    | POST   | /create              |
| Mudar alias | PATCH  | /update              |

### Encurtar

# Encurtar (API Call)

## Summary
Esta API Call da TinyURL é utilizada para encurtar uma URL fornecida, permitindo a customização de um alias e oferecendo informações analíticas sobre o link gerado.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://api.tinyurl.com/create |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|-------|-------------|
| url_para_encurtar | text | Sim |
| alias | text | Não |

## Body
```json
{
    "url": "<url_para_encurtar>",
    "domain": "tinyurl.com",
    "alias": "<alias>",
    "tags": null,
    "expires_at": null,
    "description": "string"
}
```

## Response
O retorno da API contém os seguintes campos:
- `domain`: O domínio utilizado para encurtar o link.
- `alias`: O alias customizado para o link encurtado.
- `deleted`: Indica se o link foi deletado.
- `archived`: Indica se o link foi arquivado.
- `analytics.enabled`: Indica se a análise de dados está habilitada.
- `analytics.public`: Indica se a análise de dados é pública.
- `created_at`: Data de criação do link.
- `expires_at`: Data de expiração do link (se definida).
- `tiny_url`: A URL encurtada gerada.
- `url`: A URL original fornecida para encurtamento.
- `code`: Código de status da requisição.

### Mudar alias

# Mudar alias

## Summary
Esta API Call atualiza o alias de uma URL encurtada através da API do TinyURL.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | PATCH |
| Path | https://api.tinyurl.com/update |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| alias_antigo | text | Sim |
| alias_novo | text | Sim |

## Response
O retorno esperado inclui detalhes sobre a URL atualizada, como o código de status, o novo tiny_url, e informações de analytics.

## EMAILS

# EMAILS

## Summary
Este conector de API gerencia chamadas para Webhooks relacionados ao envio de emails. Inclui funcionalidades para envio de tokens, emails para consultores e para a equipe Magali, além de lidar com solicitações de correção.

## Calls

| Call | Método | Path |
|---|---|---|
| email_token | POST | https://flow-webhook.vpsconexao.org/webhook/token |
| email_envio_magali | POST | https://flow-webhook.vpsconexao.org/webhook/email_magali |
| email_envio_consultor | POST | https://flow-webhook.vpsconexao.org/webhook/email_consultor |
| email_correcao_magali | POST | https://flow-webhook.vpsconexao.org/webhook/correcao_magali |
| email_correcao_consultor | POST | https://flow-webhook.vpsconexao.org/webhook/correcao_consultor |

### email_token

# email_token

## Summary
Chamada de API para enviar token, email e celular para um webhook.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/token |
| Autenticação | Nenhuma |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| email | text | Sim |
| token | text | Sim |
| celular | text | Sim |

## Response
Retorna uma mensagem do webhook.

| Propriedade | Tipo |
|-------------|------|
| message | text |

### email_envio_magali

# email_envio_magali

## Summary
Esta API Call envia dados de contato de um consultor e cliente para um webhook específico, provavelmente para processamento de e-mail ou notificação.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/email_magali |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Sim |
| nome_cliente | text | Sim |
| email_envio | text | Sim |
| whatsapp_magali | text | Sim |

## Response
A resposta esperada contém um campo `message` do tipo `text`.

### email_envio_consultor

# email_envio_consultor

## Summary
Realiza uma chamada POST para a API externa para enviar informações de contato de um consultor e cliente.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/email_consultor |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Sim |
| email_consultor | text | Sim |
| nome_cliente | text | Sim |
| whatsapp_consultor | text | Sim |

## Response
Retorna um objeto com o campo `message` do tipo `text`. Exemplo: `"string value"`.

### email_correcao_magali

# email_correcao_magali

## Summary
Realiza uma chamada de API POST para notificar sobre correções no sistema, enviando detalhes do consultor, cliente e a natureza da correção.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/correcao_magali |
| Autenticação | Nenhuma |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text (string) | Não |
| nome_cliente | text (string) | Não |
| email_magali | text (string) | Não |
| whatsapp_magali | text (string) | Não |
| motivo_correcao | text (string) | Não |
| quem_solicitou | text (string) | Não |
| data_solicitacao | text (string) | Não |
| link_correcao | text (string) | Não |

## Response
Retorna um campo `message` do tipo `text`.

### email_correcao_consultor

# email_correcao_consultor

## Summary
Esta API Call envia informações de correção de um consultor para um webhook. É utilizada para notificar sobre correções necessárias em dados de consultores ou clientes.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | `https://flow-webhook.vpsconexao.org/webhook/correcao_consultor` |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Não |
| email_consultor | text | Não |
| whatasapp_consultor | text | Não |
| nome_cliente | text | Não |
| motivo_correcao | text | Não |
| solicitado_por | text | Não |
| data_solicitacao | text | Não |
| link_correcao | text | Não |

## Response
| Campo | Tipo |
|-------|------|
| message | text |

### email_correcao_cliente

# email_correcao_cliente

## Summary
Esta API Call envia dados para um webhook externo para processar correções relacionadas a clientes.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | `https://flow-webhook.vpsconexao.org/webhook/correcao_cliente` |
| Autenticação | Não especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|---|---|---|
| nome_consultor | text | Não |
| email_consultor | text | Não |
| whatsapp_consultor | text | Não |
| nome_cliente | text | Não |
| email_cliente | text | Não |
| whatsapp_cleinte | text | Não |
| motivo_correcao | text | Não |
| quem_solicitou | text | Não |
| data_solicitacao | text | Não |
| link_correcao | text | Não |

## Response
| Propriedade | Tipo |
|---|---|
| message | text |

### email_reprovacao_magali

# email_reprovacao_magali

## Summary
Esta chamada de API envia dados de reprovação de um consultor para um webhook, notificando a Magali.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/reprovacao_magali |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Sim |
| nome_cliente | text | Sim |
| email_magali | text | Sim |
| whatsapp_magali | text | Sim |
| motivo_reprovacao | text | Sim |
| quem_solicitou | text | Sim |
| data_solicitacao | text | Sim |

## Response
| Propriedade | Tipo |
|-------------|------|
| message | text |

### email_reprovacao_consultor

# email_reprovacao_consultor

## Summary
Esta API Call é utilizada para enviar um email informativo sobre a reprovação de um cadastro de consultor, comunicando os detalhes e o motivo da reprovação.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/reprovacao_consultor |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Sim |
| email_consultor | text | Sim |
| whatsapp_consultor | text | Sim |
| nome_cliente | text | Sim |
| motivo_correcao | text | Sim |
| solicitado_por | text | Sim |
| data_solicitacao | text | Sim |
| link_correcao | text | Sim |

## Response
Retorna um objeto contendo uma chave "message" do tipo text. Exemplo: `{"message": "string value"}`.

### email_reprovacao_cliente

# email_reprovacao_cliente

## Summary
Esta API Call envia um e-mail de reprovação para o cliente, notificando sobre correções necessárias.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/reprovacao_cliente |
| Autenticação | None |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Não |
| email_consultor | text | Não |
| whatsapp_consultor | text | Não |
| nome_cliente | text | Não |
| email_cliente | text | Não |
| whatsapp_cleinte | text | Não |
| motivo_correcao | text | Não |
| quem_solicitou | text | Não |
| data_solicitacao | text | Não |
| link_correcao | text | Não |

## Response
| Campo | Tipo |
|---|---|
| message | text |

### email_aprovacao_magali

# email_aprovacao_magali

## Summary
Esta API Call envia um email de aprovação para Magali com os detalhes de um cliente e consultor.

## Detalhes

| Propriedade | Valor |
|---|---|
| Método | POST |
| Path | /webhook/aprovado_magali |
| Autenticação | Nenhuma |

## Parâmetros

| Nome | Tipo | Obrigatório |
|---|---|---|
| nome_consultor | text | Não |
| codigo_cliente | text | Não |
| nome_cliente | text | Não |
| email_magali | text | Não |
| whatsapp_magali | text | Não |
| quem_aprovou | text | Não |
| data_aprovacao | text | Não |

## Response
| Propriedade | Tipo |
|---|---|
| message | text |

### email_aprovacao_cliente

# email_aprovacao_cliente

## Summary
Esta API Call envia um e-mail para notificar a aprovação de um cliente, incluindo detalhes como nome do consultor, cliente, e informações de contato.

## Detalhes

| Propriedade | Valor |
|-------------|-------|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/aprovado_cliente |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|------|------|-------------|
| nome_consultor | text | Sim |
| nome_cliente | text | Sim |
| email_cliente | text | Sim |
| whatsapp_cleinte | text | Sim |
| codigo_cliente | text | Sim |
| quem_aprovou | text | Sim |
| data_aprovacao | text | Sim |

## Response
| Propriedade | Tipo |
|---|---|
| message | text |

### email_aprovacao_consultor

# email_aprovacao_consultor

## Summary
Executa uma chamada POST para a API `https://flow-webhook.vpsconexao.org/webhook/aprovacao_consultor` para enviar dados de aprovação de um cliente e consultor.

## Detalhes

| Propriedade | Valor |
|---|---|
| Método | POST |
| Path | https://flow-webhook.vpsconexao.org/webhook/aprovacao_consultor |
| Autenticação | Nenhuma especificada |

## Parâmetros

| Nome | Tipo | Obrigatório |
|---|---|---|
| nome_consultor | text | Não |
| nome_cliente | text | Não |
| codigo_cliente | text | Não |
| quem_aprovou | text | Não |
| data_aprovacao | text | Não |
| whatasapp_consultor | text | Não |
| email_consultor | text | Não |

## Response
- `message` (text): Mensagem de retorno da API.
