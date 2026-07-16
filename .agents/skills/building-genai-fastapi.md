---
name: building-genai-fastapi
description: >- Passos de construcao de servicos GenAI com FastAPI — APIs, streaming, RAG e deploy no Cloud Run
---

# Building GenAI Services c/ FastAPI — Passos Operacionais

## 1. Setup Projeto
### 1.1 Instalar dependencias
1. `conda create -n genaiservice python=3.11 && conda activate genaiservice`
2. `pip install "fastapi[standard]" uvicorn openai`
3. Adicionar: `transformers torch soundfile av python-multipart diffusers accelerate`
4. Configurar linters/formatters: autoflake, flake8, isort, black, ruff, mypy, bandit, safety
5. Usar requirements.txt (simples) ou Poetry (complexo)

### 1.2 Estrutura de projeto
1. **Flat**: unico dir p/ MVP (app/main.py, models.py, routers.py)
2. **Nested**: agrupar por tipo (app/models/, routers/, services/)
3. **Modular**: agrupar por dominio (app/modules/auth/, users/, profiles/)
4. Progressivamente reorganizar — comecar flat, evoluir p/ modular conforme complexidade cresce

### 1.3 Onion/Layered pattern
1. **Routers** — `APIRouter` grouping
2. **Controllers** handlers — injetam dependencias
3. **Services/Providers** — orquestram business logic + sistemas externos
4. **Repositories** — data access (ORM/SQL)
5. **Schemas/Models** — Pydantic p/ validacao
6. Cross-layer: Middleware, Dependencies, Pipes, Mappers, Guards

## 2. FastAPI Core
### 2.1 Server basico
1. Criar `app = FastAPI(lifespan=lifespan)`
2. `@app.get("/chat")` com OpenAI: `openai_client.chat.completions.create(model="gpt-4o", messages=[...])`
3. `fastapi dev` p/ start com hot reload
4. Auto docs em `/docs` (Swagger)

### 2.2 Dependency injection
1. `Depends()` injeta funcoes reutilizaveis (paginacao, DB session, auth)
2. Hierarquico: dependencias podem depender de outras
3. Cache por request — executado 1x por request

### 2.3 Lifespan events
1. `@asynccontextmanager` sobre funcao `lifespan`
2. Pre-load models em `models = {}` antes do `yield`
3. Cleanup (fechar conexoes, descarregar modelos) apos `yield`
4. Passar `lifespan=lifespan` p/ `FastAPI()`

## 3. Model Serving
### 3.1 Language models
1. `transformers.pipeline("text-generation", model="TinyLlama/...")`
2. Configurar device: `torch.device("cuda" if torch.cuda.is_available() else "cpu")`
3. `pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)`
4. Parametros inference: `temperature`, `max_new_tokens`, `top_k`, `top_p`, `do_sample`

### 3.2 Audio models (Bark)
1. `AutoProcessor.from_pretrained("suno/bark-small")` + `AutoModel.from_pretrained(…)`
2. `processor(text=[prompt], return_tensors="pt", voice_preset=preset)`
3. `soundfile.write(buffer, output, sample_rate, format="wav")`
4. Retornar `StreamingResponse(audio_array_to_buffer(...), media_type="audio/wav")`

### 3.3 Vision models (Stable Diffusion)
1. `DiffusionPipeline.from_pretrained("segmind/tiny-sd")`
2. `pipe(prompt, num_inference_steps=10).images[0]` → Pillow Image
3. `img_to_bytes()`: buffer → `Response(content=..., media_type="image/png")`

### 3.4 Video models (img2vid)
1. `StableVideoDiffusionPipeline.from_pretrained("stabilityai/stable-video-diffusion-img2vid")`
2. Input: `image.resize((1024,576))`, `torch.manual_seed(42)`
3. `pipe(image, decode_chunk_size=8, num_frames=25).frames[0]`
4. Export: `av.open(buffer, "w", format="mp4")` + `stream.encode(frame)` → MP4
5. Instalar `python-multipart` p/ file upload

### 3.5 3D models (Shap-E)
1. `ShapEPipeline.from_pretrained("openai/shap-e")`
2. `pipe(prompt, guidance_scale=15.0, num_inference_steps=N, output_type="mesh")`
3. Converter p/ Open3D: `o3d.geometry.TriangleMesh()` com `mesh.verts` + `mesh.faces`
4. `o3d.io.write_triangle_mesh(tmp.name, mesh_o3d, write_ascii=True)` → OBJ

### 3.6 Strategies de serving
1. **Model-agnostic**: load/unload a cada request (so p/ prototipo)
2. **Compute-efficient**: preload via lifespan (production)
3. **Lean**: external model server (BentoML, cloud providers, OpenAI API)
4. BentoML: `@bentoml.service(resources={"cpu":"4"}, traffic={"timeout":120})` + FastAPI client `httpx.AsyncClient().post(bentoml_url)`

## 4. Type Safety (Pydantic)
### 4.1 Pydantic models
1. `BaseModel` com validacao `@validator('field')` e `Field(ge=0, le=100)`
2. Tipos uteis: `EmailStr`, `HttpUrl`, `UUID`, `constr`, `conint`
3. Export: `model.model_dump()`, `model.model_dump_json()`
4. `model_validate()` p/ runtime validation

### 4.2 Constrained types
1. `str` com `min_length`, `max_length`, `regex` via `Field` ou `Annotated`
2. `int`/`float` com `ge`, `le`, `gt`, `lt`
3. `Literal["option1","option2"]` p/ enums de string
4. `Union[T, None]` ou `Optional[T]` p/ campos opcionais

### 4.3 Settings management
1. `pydantic_settings.BaseSettings` + `model_config = SettingsConfigDict(env_file=".env")`
2. Ler configs de ambiente automaticamente
3. Usar `Annotated` com `Field(validation_alias="ENV_VAR_NAME")`

## 5. Concurrency
### 5.1 Async para I/O
1. `async def` p/ endpoints I/O-bound (DB, HTTP, filesystem)
2. `asyncio.gather()` p/ paralelizar chamadas independentes
3. Time slicing: `asyncio.sleep(0)` cede controle ao event loop

### 5.2 Background tasks
1. `BackgroundTasks.add_task(func, *args)` p/ long-running ops (vector store, upload)
2. Retornar resposta imediata + processar em background thread

### 5.3 Continuous batching (vLLM)
1. Aguardar multiplos requests p/ processar em batch no model
2. Usar `asyncio.Event` + `asyncio.create_task(continuous_batch_worker())`
3. Setar timeout p/ evitar que batch espere indefinidamente

### 5.4 Model serving (compute-bound)
1. `concurrent.futures.ProcessPoolExecutor` — fork processo separado p/ model inference
2. CPU-bound ≠ async: usar multiprocessing, nao asyncio
3. Pool com 1 worker p/ model (evitar concorrencia na GPU) + FastAPI event loop p/ I/O

## 6. Real-Time Streaming
### 6.1 SSE (Server-Sent Events)
1. `StreamingResponse(content=generate_tokens(), media_type="text/event-stream")`
2. Generator: `yield f"data: {json.dumps({'token': token})}\n\n"`
3. `EventSource` no client JS escuta `onmessage`
4. Unidirecional (server → client)

### 6.2 WebSocket
1. `@app.websocket("/ws")` com `WebSocket` param
2. `websocket.accept()` → `websocket.send_text(data)` / `websocket.receive_text()`
3. Bidirecional, baixa latencia
4. `JSONResponse(…)` → nao funciona c/ WS — usar send_text/json manual

### 6.3 SSE vs WebSocket
1. SSE: mais simples, HTTP nativo, reconexao automatica, unidirecional
2. WS: bidirecional, menor latencia, conexao persistente, mais complexo
3. SSE suficiente p/ streaming de tokens LLM; WS p/ chat interativo bidirecional

## 7. Database Integration
### 7.1 ORM com SQLAlchemy + Alembic
1. `declarative_base()` → modelos Python mapeiam tabelas
2. `SessionLocal()` via `Depends(get_db)` — yield session, close no finally
3. Alembic: `alembic init alembic` → `alembic revision --autogenerate -m "msg"`
4. `alembic upgrade head` p/ aplicar migracoes

### 7.2 Prisma (alternative)
1. `pip install prisma` → `prisma init` → schema.prisma
2. `prisma generate` → cliente type-safe
3. CRUD: `await prisma.user.create(data={...})`, `prisma.user.find_many(where={...})`

### 7.3 Vector DB (pgvector)
1. `pip install pgvector` + sqlalchemy `Vector` column
2. Embeddings: `sentence-transformers` p/ gerar vectors
3. `session.execute(text("SELECT * FROM items ORDER BY embedding <=> :query LIMIT 5"))`

## 8. Auth & Security
### 8.1 Authentication methods
1. **Basic**: `HTTPBasic` credentials via header
2. **Token/JWT**: `python-jose` + `passlib` — `create_access_token()`, `Depends(get_current_user)`
3. **OAuth2**: `fastapi.security.OAuth2PasswordBearer` + identity provider
4. **API Key**: header `X-API-Key` → valida em `Depends(verify_api_key)`

### 8.2 Authorization (RBAC)
1. Guard functions: `Depends(require_role("admin"))`
2. Hierarquia de permissoes injetada como dependencia
3. `@app.get("/admin", dependencies=[Depends(verify_admin)])`

### 8.3 Guardrails (rate limit, moderation)
1. Rate limit: `slowapi` ou middleware custom c/ `time.time()` window
2. Content filter: regex blocklist + OpenAI moderation API
3. Input validation: Pydantic schema + sanitizacao de prompts
4. Traffic shaping: `asyncio.sleep()` p/ throttle requests acima do limite

## 9. Optimizacao
### 9.1 Caching
1. **Keyword**: `@lru_cache` p/ repeticoes exatas de prompt
2. **Semantic**: Redis + cosine similarity — cache responses similares
3. **Context**: cache system prompt + conversation history prefix

### 9.2 Model optimization
1. **Quantization**: `torch.quantization.quantize_dynamic()` ou `bitsandbytes` 4/8-bit
2. **LoRA fine-tuning**: treinar parametros adicionais pequenos p/ adaptar modelo
3. **Model distillation**: modelo menor imita maior

### 9.3 Prompt engineering
1. Few-shot: exemplos no prompt p/ guiar output
2. Chain-of-thought: "Let's think step by step"
3. System prompt claro: regras, formato, tom

## 10. Testing
### 10.1 Test setup
1. `pytest` + `httpx.AsyncClient` p/ testar endpoints async
2. `TestClient(app)` p/ sync (cuidado: nao funciona c/ lifespan async)
3. Isolar: mock external APIs, DB, model inference

### 10.2 Test strategies p/ GenAI
1. **Property-based**: testar formato/output invariante (JSON valido, schema correto)
2. **Semantic similarity**: `sentence-transformers` compara resposta esperada vs gerada
3. **E2E**: fluxo completo (request → model → response → DB)
4. **Regression**: snapshot tests p/ detectar mudancas indesejadas

### 10.3 Anti-patterns
1. Nao testar exatidao de output probabilistico (testar schema, nao valor)
2. Nao fazer mock do model como None — mock retorna dados realistas
3. Nao ignorar test boundaries: chunk size, context window, rate limits

## 11. Deploy
### 11.1 Docker
1. Dockerfile multi-stage: builder (pip install) + runner (uvicorn)
2. Copy models do cache p/ imagem (ou mount volume)
3. `docker compose` c/ services: app, DB, Redis, vector DB

### 11.2 Options
1. **VM**: Azure VM, EC2 — full control, gerenciar updates
2. **Cloud functions**: AWS Lambda — stateless, cold start problematico p/ models
3. **Managed app**: Azure App Service, Google Cloud Run — scaling automatico
4. **Container orchestration**: Kubernetes — complexo, necessario p/ multi-service

### 11.3 Production considerations
1. Health check: `@app.get("/health")` retorna status + model loaded
2. CORS: `CORSMiddleware` p/ permitir origins especificas
3. Environment variables p/ secrets (API keys, DB URLs)
4. Logging estruturado p/ debugging e monitoring
