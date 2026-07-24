---
name: ai-agents-mcp
description: >- Criacao de servidores e clientes MCP — tools, resources, prompts e integracao com LLMs
---

# AI Agents com MCP — Passos Operacionais

Skill baseada no livro "AI Agents with MCP" de Kyle Stratis (O'Reilly, 2026 - Early Access). Contém passos práticos para construir clientes MCP, servidores e integrar com agentes LLM.

Use quando: estiver criando um cliente MCP do zero, implementando connect/disconnect com stdio ou Streamable HTTP, integrando tools/resources/prompts de servidores MCP em aplicacoes host LLM, ou gerenciando multiplos servidores MCP simultaneamente.

---

## 1. Criar Cliente MCP Basico (Transporte stdio)

### 1.1 Estrutura do Construtor
1. Instancie `AsyncExitStack` para gerenciar contexto assincrono aninhado.
2. Defina `self._session: ClientSession = None` e `self._connected: bool = False`.
3. Armazene `command` e `server_args` recebidos no construtor.

### 1.2 Implementar Connect (stdio)
1. Verifique `if self._connected` e levante `RuntimeError` se ja conectado.
2. Crie `StdioServerParameters(command=self.command, args=self.server_args)`.
3. Chame `self._exit_stack.enter_async_context(stdio_client(server_params))` e descompacte em `self.read, self.write`.
4. Chame `self._exit_stack.enter_async_context(ClientSession(read_stream=self.read, write_stream=self.write))` e armazene em `self._session`.
5. Chame `await self._session.initialize()` — isso negocia versao do protocolo e anuncia capacidades do cliente.
6. Defina `self._connected = True`.

### 1.3 Implementar Disconnect
1. Chame `await self._exit_stack.aclose()` para fechar todas as conexoes em ordem.
2. Defina `self._connected = False` e `self._session = None`.

---

## 2. Criar Cliente MCP com Streamable HTTP

### 2.1 Construtor para HTTP
1. Armazene `server_url` em vez de `command`/`server_args`.
2. Adicione `self._get_session_id: Callable[[], str] = None` para suporte a retomada de sessao.

### 2.2 Implementar Connect (Streamable HTTP)
1. Chame `self._exit_stack.enter_async_context(streamablehttp_client(url=self.server_url, headers=headers))`.
2. Descompacte o retorno em `self.read, self.write, self._get_session_id`.
3. Repita passos 3-5 da secao 1.2 para criar `ClientSession` e inicializar.
4. Parametros uteis: `timeout` (default 30s), `sse_read_timeout` (default 5min), `auth` (httpx.Auth).

### 2.3 Implementar Disconnect (HTTP)
1. Mesmo que secao 1.3 — `await self._exit_stack.aclose()`.

---

## 3. Interagir com Tools do Servidor

### 3.1 Descobrir Tools (list_tools)
1. Verifique `if not self._connected` e levante `RuntimeError`.
2. Chame `await self._session.list_tools()`.
3. Verifique `if not tools_result.tools` e faca logging warning se vazio.
4. Retorne `tools_result.tools` (lista de objetos `Tool` com `name`, `description`, `inputSchema`).
5. Aceite parametro `cursor` opcional para paginacao.

### 3.2 Usar Tool (call_tool)
1. Verifique conexao e levante `RuntimeError` se nao conectado.
2. Chame `await self._session.call_tool(name=tool_name, arguments=arguments)`.
3. O retorno `CallToolResult.content` e uma lista de:
   - `TextContent` — texto em `content.text`
   - `ImageContent` — base64 em `content.data`
   - `AudioContent` — base64 em `content.data`
   - `EmbeddedResource` — `TextResourceContents` (`.text`) ou `BlobResourceContents` (`.blob`)
4. Itere por `content` e trate cada tipo com `match content.type`.

### 3.3 Integrar Tools num Chatbot (loop agente)
1. Obtenha tools uma vez: `available_tools = mcp_client.get_available_tools()`.
2. Converta para dict: `[tool.model_dump() for tool in available_tools]`.
3. Envie tools no parametro `tools` da chamada LLM com `tool_choice="auto"`.
4. Verifique `message.stop_reason == "tool_use"`.
5. Filtre blocos `tool_use` do `message.content`.
6. Para cada `tool_use`, chame `mcp_client.use_tool(name=tool_use.name, arguments=tool_use.input)`.
7. Monte mensagem `tool_result` com `{"type": "tool_result", "tool_use_id": tool_use.id, "content": result}`.
8. Envie ao LLM: `[msg_usuario, msg_assistant_original, tool_use_message_block]`.
9. Exiba `response.content[0].text` ao usuario.

---

## 4. Interagir com Resources do Servidor

### 4.1 Descobrir Resources
1. Chame `await self._session.list_resources()` — retorna lista de `Resource` (`uri`, `name`, `description`, `mimeType`).
2. Chame `await self._session.list_resource_templates()` — retorna `ResourceTemplate` com `uriTemplate`.
3. Ambos aceitam parametro `cursor` para paginacao.

### 4.2 Ler Resource
1. Chame `await self._session.read_resource(uri=uri)`.
2. Retorna lista de `TextResourceContents` ou `BlobResourceContents`.
3. Use `isinstance(content, TextResourceContents)` para decidir se le `content.text` ou `content.blob`.

### 4.3 Integrar Resources num Chatbot (contexto)
1. Ao iniciar, carregue resources disponiveis e exiba ao usuario.
2. No prompt do usuario, busque palavra-chave (ex: "context:") via regex.
3. Extraia nome do resource, valide se existe em `available_resources`.
4. Leia o resource com `get_resource(uri)`.
5. Converta para bloco de mensagem: se texto → `{"type": "text", "text": content.text}`; se imagem (`image/jpeg`, `image/png`, etc.) → `{"type": "image", "source": {"type": "base64", "media_type": mimeType, "data": content.blob}}`.
6. Estenda a lista `content` da mensagem do usuario com o bloco de contexto.

---

## 5. Interagir com Prompts do Servidor

### 5.1 Descobrir Prompts
1. Chame `await self._session.list_prompts()` — retorna lista de `Prompt` com `name`, `description`, `arguments` (opcionais).

### 5.2 Carregar Prompt
1. Chame `await self._session.get_prompt(name=name, arguments=dict)`.
2. Retorna `list[PromptMessage]`, cada um com `role` e `content`.
3. Converta para formato LLM: `{"role": msg.role, "content": msg.content}`.

### 5.3 Integrar Prompts num Chatbot
1. Ao iniciar, carregue e exiba lista de prompts disponiveis com nomes, descricoes e argumentos.
2. No prompt do usuario, busque comando (ex: "prompt:") via regex.
3. Parseie nome do prompt e pares `argumento valor`.
4. Chame `load_prompt(name, arguments)`.
5. Use as mensagens retornadas diretamente na chamada LLM.

---

## 6. Recursos Avancados do Cliente

### 6.1 Enviar Requisicoes Personalizadas
1. Use `self._session.send_request()` (herdado de `BaseSession`) para enviar mensagens custom.
2. Crie suas proprias classes `Request`, `RequestParams` e `Result` para servidores que suportam endpoints custom.

### 6.2 Ping no Servidor
1. Chame `await self._session.send_ping()`.
2. Retorna `EmptyResult` — confirmacao de conexao ativa.

### 6.3 Alterar Nivel de Log do Servidor
1. Use `await self._session.set_logging_level(level)` com objeto `LoggingLevel` do `mcp.types`.

### 6.4 Callback de Logging
1. Implemente funcao assincrona que recebe `LoggingMessageNotificationsParams`.
2. Verifique `params.level` (segue RFC 5424) e trate niveis criticos (`error`, `critical`, `alert`, `emergency`).
3. Passe a funcao como `logging_callback` no construtor `ClientSession(read_stream, write_stream, logging_callback=fn)`.

### 6.5 Notificacoes de Progresso
1. Chame `await self._session.send_progress_notification(progress_token=token, progress=0.5, total=1.0, message="opcional")`.

---

## 7. Fornecer Capacidades do Cliente ao Servidor

### 7.1 Sampling (Servidor usa LLM do Cliente)
**ATENCAO:** Sempre implemente `Human-in-the-Loop (HITL)` antes de允许 servidor usar seu LLM.

1. No construtor do cliente, aceite `llm_client` (ex: `Anthropic`).
2. Implemente `async def _handle_sampling(self, context: RequestContext, params: CreateMessageRequestParams)`:
   - Itere `params.messages`, convertendo `TextContent` → `{"role", "content": text}` e outros → `{"role", "content": data}`.
   - Chame `self._llm_client.messages.create(max_tokens=params.maxTokens, messages=messages)`.
   - Retorne `CreateMessageResult(role=response.role, content=response.content, model="...")`.
3. Passe `sampling_callback=_handle_sampling` no construtor `ClientSession`.

### 7.2 Raizes (Roots)
1. Defina limites de acesso ao sistema de arquivos que o servidor pode acessar.
2. Durante inicializacao, anuncie roots como capacidade do cliente.
3. Servidores DEVEM respeitar os limites (mas nao sao obrigados).

---

## 8. Suporte a Multiplos Modelos

1. Crie classe interna para cada primitiva (ex: `InternalTool`).
2. No construtor, receba objeto MCP e extraia `name`, `input_schema`, `description`.
3. Implemente metodo `translate_to_<modelo>()` que converta para formato esperado.
4. Exemplo OpenAI: `{"type": "function", "name": name, "description": desc, "parameters": input_schema}`.
5. Estenda para Resources e Prompts seguindo mesmo padrao.

---

## 9. Gerenciar Multiplos Servidores (ClientSessionGroup)

### 9.1 Inicializar
1. Instancie `ClientSessionGroup()` no lugar de `ClientSession` unico.
2. Propriedade `.sessions` lista sessoes ativas.
3. Propriedade `.tools`, `.resources`, `.prompts` consolidam de todos os servidores conectados.

### 9.2 Conectar
1. Chame `await session_group.connect_to_server(server_params=ServerParameters)`.
   - `ServerParameters` e alias para `StdioServerParameters | SseServerParameters | StreamableHttpParameters`.
2. O grupo gerencia conexao, inicializacao e carregamento de componentes automaticamente.

### 9.3 Usar Tools em Multiplos Servidores
1. Chame `session_group.call_tool(name, arguments)` — roteia automaticamente para sessao correta.
2. Use `component_name_hook` no construtor para evitar conflitos de nomes: funcao `(name, Implementation) -> str`.

### 9.4 Desconectar Servidor Individual
1. Chame `session_group.disconnect_from_server(server_params)`.
2. Componentes do servidor sao removidos automaticamente.

---

## 10. Boas Praticas

### 10.1 Seguranca
1. Sempre implemente autorizacao antes de permitir acesso a ferramentas/sampling.
2. Exija confirmacao humana (HITL) para operacooes sensiveis.
3. Valide `server_url` e headers antes de conectar.

### 10.2 Retomada de Conexao (Streamable HTTP)
1. Apos interrupcao, envie `GET` para o endpoint MCP com header `Last-Event-ID`.
2. Servidor PODE reproduzir mensagens perdidas a partir desse ID.
3. Servidor NAO DEVE reproduzir mensagens de fluxos diferentes.

### 10.3 Paginacao
1. Metodos `list_*` retornam `PaginatedResult` com propriedade `nextCursor`.
2. Se `nextCursor` nao for `None`, passe-o como parametro `cursor` na proxima chamada.

### 10.4 Informacoes do Cliente
1. Defina `client_info` no construtor da sessao com `name` e `version` para identificacao do cliente pelo servidor.
