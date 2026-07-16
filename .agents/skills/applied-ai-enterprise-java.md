---
name: applied-ai-enterprise-java
description: >- Passos de IA aplicada para desenvolvimento Java empresarial — Jakarta, Quarkus, LangChain4j e deploy
---
# Applied AI for Enterprise Java Development — Passos Operacionais

## 1. Prompt Engineering (Ch3)

### 1.1 Tipos de Prompt
1. User prompt: entrada bruta do usuário, precisa pré-processamento
2. System prompt: define comportamento do modelo, oculto do usuário, setado no início da sessão
3. Contextual prompt: inclui info de background, interações passadas, conhecimento de domínio

### 1.2 Técnicas de Prompt
1. Zero-shot: pergunta sem exemplos — usar quando tarefa é simples
2. Few-shot: fornecer 2-5 exemplos input-output — usar para guiar formato
3. Chain-of-thought (CoT): gerar passos intermediários — usar para raciocínio complexo
4. Self-consistency: gerar múltiplas respostas, escolher a mais frequente — melhora acurácia
5. Instruction prompting: dar instruções explícitas sobre o que quer
6. RAG: aumentar prompt com dados externos (bases, documentos)
7. Prompt chaining: manter contexto entre múltiplas interações — usar para diálogos multi-turno

### 1.3 Construção de Prompts Dinâmicos
1. Combinar texto fixo com info gerada por outras partes do sistema
2. Template: `"You are a {role}. Answer the following question: {question}"`
3. Usar guardrails para validar entrada e saída (regex, modelo de moderação, limite de tamanho)

### 1.4 Otimização Performance vs Custo
1. Prompts mais curtos → menos tokens → menor custo
2. Cache de contexto (in-memory, hot memory, vector DB, cold storage)
3. Debugging: logar prompt + resposta, iterar no wording

## 2. AI Architectures for Applications (Ch4)

### 2.1 Data Preparation Pipeline
1. Coletar dados brutos de fontes (DB, API, Kafka, arquivos)
2. Limpar e normalizar dados
3. Transformar para formato que o modelo entenda (tokenização)
4. Enriquecer com metadados
5. Armazenar em camada de dados (vector store, cache, cold storage)

### 2.2 AI Gateway Layer
1. Receber query do usuário
2. Validar input (guardrails, rate limiting, autenticação)
3. Enriquecer query com contexto
4. Enviar para o modelo
5. Validar output (guardrails, formatação)
6. Retornar resposta

### 2.3 Context & Memory Layer
1. Montar contexto antes de cada inferência:
   - System prompt (regras de comportamento)
   - Histórico da conversa (hot memory)
   - Conhecimento de domínio (vector DB)
   - Dados arquivados (cold storage)
2. Combinar em prompt final
3. Cachear resultados frequentes

### 2.4 Tools & Agents Layer
1. Definir tools como funções que o modelo pode chamar
2. Registrar tools no LangChain4j via `ToolProvider`
3. Usar rules engine para decisões determinísticas (ferramenta, rate limit, aprovação)
4. Integrar MCP via Wanaku para roteamento

## 3. Embeddings, Vector Stores & Local Models (Ch5)

### 3.1 Gerar Embeddings
1. Escolher modelo de embedding (all-MiniLM-L6-v2, OpenAI, Mistral, BERT, CodeBERT)
2. Converter texto em array de floats (dimensões: 384, 768, 1536 etc.)
3. Armazenar em vector store com metadados

### 3.2 Medir Similaridade
1. Cosine similarity: ângulo entre vetores (mais comum)
2. Dot product: projeção de um vetor no outro (equivalente para vetores normalizados)
3. Euclidean distance (L2): distância linear
4. Manhattan distance (L1): soma das diferenças absolutas
5. Hamming distance: para embeddings binários

### 3.3 Vector Stores
1. Escolher backend: Chroma (dev), pgvector (PostgreSQL), Milvus (escala enterprise), Redis (baixa latência)
2. Cada entry tem: embedding vector + metadados
3. Insert: gerar embedding → salvar com metadados
4. Query: gerar embedding da query → ANN search → retornar top-K + metadados

### 3.4 Models Locais
1. Ollama: instalar binário → `ollama pull <model>` → `ollama run <model>` → API em `localhost:11434`
2. Podman Desktop: instalar extensão AI Lab → modelos em container → API via curl
3. Jlama: dependência Java → carregar modelo direto na JVM → inferência sem GPU

### 3.5 OpenAI API
1. Obter API key em platform.openai.com
2. Rate limits: monitorar headers `x-ratelimit-*`
3. SDK: `OpenAiChatModel.builder().apiKey("...").modelName("gpt-4o-mini").build()`
4. Embeddings: `OpenAiEmbeddingModel` ou raw HTTP POST `/v1/embeddings`

## 4. Inference APIs (Ch6)

### 4.1 Criar Inference API com DJL + Spring Boot
1. Adicionar dependências DJL (BOM + engine ONNX/PyTorch + modelo)
2. Criar POJO de request/response (Java record)
3. Carregar modelo: `Criteria.Builder` → `ZooModel`
4. Implementar Translator: `NoBatchifyTranslator` → `processInput` / `processOutput`
5. Usar `Predictor` para inferência: `predictor.predict(input)`
6. Criar REST controller Spring: `@RestController` → `@PostMapping("/inference")`
7. Testar: `mvn spring-boot:run` → POST /inference

### 4.2 Inference com gRPC
1. Definir schema `.proto` com service + messages
2. Gerar stubs Java via protobuf-maven-plugin
3. Implementar gRPC server com Spring Boot
4. Implementar gRPC client

## 5. Accessing Inference Models with Java (Ch7)

### 5.1 REST Client (Spring)
1. Criar interface `@HttpExchange` ou `WebClient`
2. Configurar URL base + timeout
3. Chamar POST para endpoint de inferência

### 5.2 REST Client (Quarkus)
1. Criar interface `@RegisterRestClient`
2. Configurar `quarkus.rest-client."interface".url` em application.properties
3. Injtar com `@Inject @RestClient`

### 5.3 gRPC Client
1. Adicionar dependências gRPC + protobuf
2. Definir .proto idêntico ao servidor
3. Gerar stubs
4. Criar channel: `ManagedChannelBuilder.forAddress("localhost", 8080).usePlaintext().build()`
5. Chamar stub: `blockingStub.predict(request)`

## 6. LangChain4j — Framework (Ch8)

### 6.1 Configuração
1. Adicionar dependência `dev.langchain4j:langchain4j` + integração do modelo (ex: `langchain4j-open-ai`)
2. Instanciar `ChatModel`: `OpenAiChatModel.builder().apiKey("...").modelName("gpt-4o-mini").build()`
3. Chamar: `model.chat("pergunta")`

### 6.2 Prompt Templates
1. Definir template: `PromptTemplate.from("You are {{role}}. Answer: {{question}}")`
2. Aplicar variáveis: `template.apply(Map.of("role", "assistant", "question", q))`
3. Structured outputs: definir schema Java → LLM retorna JSON → desserializa

### 6.3 Memory
1. `MessageWindowChatMemory.builder().maxMessages(10).build()`
2. Associar ao AI service: `AiServices.builder(Assistant.class).chatMemory(memory)`
3. Suporta: message window, token window, função customizada

### 6.4 Data Augmentation (RAG)
1. Criar `ContentRetriever` (ex: `EmbeddingStoreContentRetriever`)
2. Configurar no AI service: `.retrievalAugmentor(DefaultRetrievalAugmentor.builder().contentRetriever(retriever).build())`
3. Ingestion: parser → splitter → embedding → store

### 6.5 Tools
1. Definir método Java com `@Tool("descrição")`
2. Registrar: `.tools(toolInstance)`
3. Modelo decide quando chamar baseado na descrição da tool

### 6.6 AI Services (High-Level API)
1. Definir interface: `interface Assistant { String chat(String msg); }`
2. Builder: `AiServices.builder(Assistant.class).chatModel(model).build()`
3. Suporte a streaming: retornar `TokenStream` em vez de `String`
4. Suporte a guardrails: `.inputGuardrails(...)`, `.outputGuardrails(...)`

### 6.7 Use Cases
1. Extrair info de texto não-estruturado → Java object via structured outputs + AI service
2. Classificação de texto → system prompt categorizando, exemplo: suporte técnico
3. Geração de imagem + descrição → modelos multimodais (ex: OpenAI DALL-E)
4. Spring Boot: `@AiService` interface + REST controller
5. Quarkus: `@RegisterAiService` + WebSocket endpoint
6. OCR: processar PDF/imagem com Tesseract/OpenCV → extrair texto → enviar para LLM
7. Tooling dinâmico: múltiplas tools registradas, modelo escolhe com base na descrição

## 7. Vector Embeddings & Stores (Ch9)

### 7.1 Embeddings com DJL
1. Adicionar dependências: DJL + PyTorch engine + modelo (ex: `paraphrase-albert-small-v2`)
2. Carregar modelo via `Criteria`
3. Preditor: `predictor.predict(text)` → `float[]` embedding

### 7.2 Embeddings com LangChain4j Local
1. Adicionar dependência: `langchain4j-embeddings-all-minilm-l6-v2`
2. `AllMiniLmL6V2EmbeddingModel model = new AllMiniLmL6V2EmbeddingModel()`
3. `model.embed("texto").content()` → embedding vector

### 7.3 Embeddings Remotos (LangChain4j)
1. Adicionar dependência: `langchain4j` + modelo remoto (ex: `langchain4j-mistral-ai`)
2. Configurar `MistralAiEmbeddingModel` com API key
3. `embed(texto)` ou `embedAll(lista)`

### 7.4 RAG Pipeline Completo
1. Ingestion:
   - Parse documentos (txt, PDF, HTML)
   - Split em chunks (tamanho, overlap)
   - Calcular embedding de cada chunk
   - Armazenar em `EmbeddingStore` com metadados
2. Retrieval:
   - Embedding da query do usuário
   - Busca similaridade no vector store (top-K)
   - Reranking opcional para melhorar precisão
3. Geração:
   - Montar prompt com contexto recuperado
   - Enviar para LLM
   - Retornar resposta

### 7.5 Query Router
1. Configurar `WebSearchContentRetriever` (Tavily) para queries web
2. Criar router que decide: RAG vs web search vs generic
3. Integrar no AI service com `ContentRetriever`

### 7.6 Filtros e Splitting
1. Splitting window: `DocumentSplitter` com `segment(desiredSize, maxOverlap)`
2. Filtrar resultados: metadados (categoria, data, autor) como critério
3. `EmbeddingStoreContentRetriever` suporta filtro por metadados

## 8. LangGraph4j — Graph Orchestration (Ch10)

### 8.1 Setup
1. Dependência: `org.bsc.langgraph4j:langgraph4j-core`
2. Estado: estender `AgentState` com métodos getter tipados
3. Node: função async que recebe `AgentState`, retorna `Map<String,Object>` (partial update)

### 8.2 Construção do Grafo
1. Definir estado: `class State extends AgentState` com getters
2. Definir nós (nodes): `Node` ou `AsyncNode` com lógica
3. Definir arestas (edges): conectar nós (simples ou condicional)
4. Criar grafo: `GraphState.graph(State::new)` → `.node("nodeA", myNode)` → `.edge(START, "nodeA")` → `.edge("nodeA", END)`
5. Compilar: `graph.compile()`
6. Executar: `compiledGraph.invoke(Map.of("key", value))`

### 8.3 Conditional Edges
1. Definir condição: função que retorna nome do próximo nó
2. Registrar: `.condition("nodeA", myCondition, Map.of("nextA", "nodeB", "nextB", "nodeC"))`

### 8.4 Append vs Overwrite State
1. Overwrite: retornar chave no Map do node
2. Append: configurar schema com `AppendableValue` ou `ArrayList`

### 8.5 Agent Routing
1. Criar AI services: RAG agent, generic agent, etc.
2. Routing node: classificar pergunta → LLM decide qual agente chamar
3. Graph state: contém `question` + `generation` (output do modelo)

### 8.6 Human-in-the-Loop
1. Configurar `CheckpointSaver` no `CompileConfig`
2. Definir nós onde pausa execução (`interruptAfter` / `interruptBefore`)
3. Identificar execução: `RunnableConfig` com ID único
4. Resumir: `compiledGraph.updateState(runnableConfig, partialState)` → `invoke`

### 8.7 Subgraphs & Parallel
1. Subgraphs: grafo dentro de nó de outro grafo — modularizar grafos grandes
2. Parallel: fork-join model — múltiplos nós rodam simultaneamente
3. Time Travel: obter/atualizar estado em qualquer ponto

### 8.8 RAG com Self-Reflection
1. Grafo multi-nó: generate → check relevance → regen se baixa
2. Usar cycle edges para retry/reflexão
3. Parar quando qualidade aceitável ou máximo de tentativas

## 9. Image Processing (Ch11)

### 9.1 Setup OpenCV
1. Adicionar dependência `org.bytedeco:opencv-platform`
2. Inicializar: `OpenCV.loadLocally()` ou `System.loadLibrary(Core.NATIVE_LIBRARY_NAME)`

### 9.2 Operações Básicas
1. Load: `Imgcodecs.imread(path)`
2. Save: `Imgcodecs.imwrite(path, mat)`
3. Grayscale: `Imgproc.cvtColor(mat, gray, Imgproc.COLOR_BGR2GRAY)`
4. Resize: `Imgproc.resize(src, dst, new Size(w,h), interpolation)`
5. Crop: `new Rect(x, y, w, h)` → `new Mat(src, rect)`

### 9.3 Overlay Elements
1. Draw rectangle: `Imgproc.rectangle(mat, pt1, pt2, color, thickness)`
2. Put text: `Imgproc.putText(mat, text, org, fontFace, scale, color)`
3. Overlap images: alpha blending — iterar pixels com alpha channel

### 9.4 Image Processing
1. Gaussian blur: `Imgproc.GaussianBlur(src, dst, kernelSize, sigma)`
2. Binarization: `Imgproc.threshold(src, dst, thresh, maxval, type)`
3. Noise reduction: `photo.fastNlMeansDenoising(src, dst)`
4. Edge detection (Canny): `Imgproc.Canny(src, edges, lowThresh, highThresh)`
5. Perspective correction: calcular `getPerspectiveTransform` → `warpPerspective`

### 9.5 Barcode & QR Code
1. Barcode: `BarcodeDetector` → `detectAndDecode`
2. QR Code: `QRCodeDetector` → `detectAndDecode`

### 9.6 Video Processing
1. Abrir vídeo: `VideoCapture(path)`
2. Loop por frames: `capture.read(frame)` até retornar false
3. Processar frame
4. Escrever output: `VideoWriter`
5. Webcam: `VideoCapture(0)` para câmera padrão

## 10. Advanced Topics — Streaming, Guardrails, MCP (Ch12)

### 10.1 Streaming (Low-Level API)
1. Usar `StreamingChatModel` (ex: `OpenAiStreamingChatModel`)
2. Implementar `StreamingChatResponseHandler`:
   - `onPartialResponse(token)` → processa token incrementalmente
   - `onCompleteResponse(response)` → finalizou
   - `onError(error)` → erro
3. Chamar: `model.chat("pergunta", handler)`

### 10.2 Streaming (AI Services)
1. Retornar `TokenStream` na interface
2. Encadear callbacks: `.onPartialResponse(...)`, `.onRetrieved(...)`, `.onToolExecuted(...)`, `.onCompleteResponse(...)`, `.onError(...)`
3. `.start()` para iniciar

### 10.3 Input Guardrail
1. Implementar `InputGuardrail` interface
2. Validar mensagem do usuário (regex, modelo de moderação, comprimento)
3. Registrar: `.inputGuardrails(new ViolenceInputGuardrail())` ou anotação `@InputGuardrails`
4. Se falhar → `InputGuardrailException`

### 10.4 Output Guardrail
1. Implementar `OutputGuardrail` interface
2. Validar resposta do modelo antes de enviar ao usuário
3. Registrar: `.outputGuardrails(...)` ou `@OutputGuardrails`
4. Usar para: verificar URLs, conteúdo sensível, formato esperado

### 10.5 MCP Client (LangChain4j)
1. Adicionar dependências: `langchain4j-mcp` + `langchain4j-google-ai-gemini`
2. Configurar transporte: `StdioMcpTransport.Builder().command(List.of("npm", "exec", "@modelcontextprotocol/server-filesystem", "dir"))`
3. Criar `McpClient`: `DefaultMcpClient.Builder().transport(transport).build()`
4. Criar `ToolProvider`: `McpToolProvider.builder().mcpClients(List.of(mcpClient)).build()`
5. Criar AI service com tool provider: `AiServices.builder(Assistant.class).chatModel(model).tools(toolProvider).build()`
6. Fluxo MCP: user prompt → LLM decide tool → MCP client envia para MCP server → resultado volta para LLM → resposta final

### 10.6 MCP Client (Quarkus)
1. Adicionar dependência quarkus-langchain4j-mcp
2. Configurar `@McpToolBox` no AI service
3. Injetar `McpClient` programaticamente se necessário

### 10.7 MCP Server (Quarkus)
1. Adicionar dependência quarkus-mcp-server
2. Anotar método com `@Tool("descricao")` — vira ferramenta MCP
3. Pack: `quarkus.package.jar.type=uber-jar`
4. Testar com MCP Inspector: `npx @modelcontextprotocol/inspector`

### 10.8 Streamable HTTP Transport
1. Alternativa ao stdio: comunicação via HTTP POST
2. Múltiplos clientes por servidor
3. Configurar no MCP server quarkus com `quarkus.mcp.server.transport=STREAMABLE_HTTP`

## 11. DevOps vs MLOps (Ch1)
1. DevOps: entrega contínua de software, pipeline CI/CD
2. MLOps: mesmo princípio para modelos — versionamento de dados, modelos, experimentos
3. Integrar: modelo como artefato no pipeline, monitorar drift, retreinar automático
