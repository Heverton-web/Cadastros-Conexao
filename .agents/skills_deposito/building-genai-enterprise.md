---
name: building-genai-enterprise
description: >- Solucoes GenAI empresariais — prompt engineering, fine-tuning, RAG, agentes e governanca
---

# Building GenAI for Enterprise — Passos Operacionais

## 1. Prompt Engineering
### 1.1 Zero-shot
1. Enviar instrucao direta sem exemplos
2. Modelo usa conhecimento pre-treinado
3. Ideal p/ tarefas simples (classificacao, extracao)

### 1.2 Few-shot
1. Incluir 2-5 exemplos completos (input + output esperado) no prompt
2. Exemplos devem cobrir variacoes do dominio
3. Separar exemplos do input real com delimitadores claros (`---`, `###`)
4. Limite: few-shot nao funciona se modelo nao tem conhecimento previo (→ RAG ou fine-tuning)

### 1.3 Chain-of-Thought (CoT)
1. Adicionar "Let's think step by step" ou "Raciocine passo a passo"
2. Modelo decompõe problema em etapas logicas
3. Output intermediario + conclusao final
4. Variante: **Few-shot CoT** — fornecer exemplos c/ raciocinio passo a passo

### 1.4 Tree-of-Thought (ToT)
1. Modelo explora multiplos caminhos de solucao simultaneamente
2. Avalia cada ramo antes de escolher o melhor
3. Usar p/ planejamento, diagnostico, tomada de decisao
4. Prompt: "Considere 3 abordagens diferentes, avalie pros/cons de cada, escolha a melhor"

### 1.5 Project: Marketing Assistant
1. Funcionalidades: gerar copy, analisar sentimento, extrair keywords, sumarizar feedback
2. Construir UI c/ Streamlit: `st.text_input`, `st.selectbox` p/ escolher tecnica
3. Backend: funcoes separadas p/ cada tecnica (zero_shot(), few_shot(), cot())
4. Prompt templates modulares p/ reuso

## 2. Fine-Tuning
### 2.1 Quando fine-tuning (vs RAG vs prompting)
1. Prompt engineering falha → tentar RAG primeiro
2. RAG falha ou custo alto → fine-tuning
3. Fine-tuning necessario quando: modelo carece de conhecimento especifico do dominio, precisa de tom/estilo consistente, instrucoes complexas demais p/ prompt

### 2.2 Parameter-Efficient Fine-Tuning (PEFT)
1. **LoRA**: matrizes de baixa dimensao injectadas em cada transformer layer
2. **Q-LoRA**: LoRA + quantizacao 4-bit — GPU modesta (16GB VRAM suficiente)
3. Adapter: camadas bottleneck adicionadas entre layers originais
4. Prompt tuning: embeddings treinaveis prefixados ao input

### 2.3 Full fine-tuning
1. Todos os parametros do modelo sao atualizados — custo alto
2. Requer GPU com VRAM significativa
3. Risco de catastrophic forgetting (modelo perde capacidades genericas)

### 2.4 LoRA passo a passo
1. `pip install peft transformers datasets torch`
2. Carregar modelo base: `AutoModelForCausalLM.from_pretrained(...)`
3. Configurar LoRA: `LoraConfig(r=8, lora_alpha=32, target_modules=["q_proj","v_proj"], lora_dropout=0.1)`
4. `get_peft_model(model, lora_config)` → apenas parametros LoRA sao treinaveis
5. Treinar c/ `Trainer` da HF + dataset formatado (instruction → response)
6. Salvar: `model.save_pretrained("./lora-weights")`
7. Inference: carregar base + `PeftModel.from_pretrained(base, "./lora-weights")`

### 2.5 Using GPU on Colab
1. Runtime → Change runtime type → T4 GPU
2. `!nvidia-smi` verificar VRAM
3. Modelos 7B cabem em T4 16GB com Q-LoRA

### 2.6 Project: HR Assistant
1. Dataset: perguntas frequentes de RH (beneficios, ferias, politicas)
2. Formato: `{"instruction": "...", "response": "..."}`
3. Fine-tunar modelo base com LoRA no dataset
4. Testar: perguntas similares mas nao identicas ao dataset
5. Validar que respostas sao consistentes com politicas da empresa

## 3. RAG (Retrieval-Augmented Generation)
### 3.1 Arquitetura RAG
1. **Indexing**: chunk documentos → embed → vector DB
2. **Retrieval**: query → embed → nearest neighbor search
3. **Generation**: [system prompt + context retrieved + user query] → LLM
4. Chunk size tipico: 500-1000 tokens, overlap 50-200 tokens

### 3.2 LangChain
1. `pip install langchain langchain-openai langchain-community chromadb`
2. Document loaders: `PyPDFLoader`, `TextLoader`, `WebBaseLoader`
3. Text splitter: `RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)`
4. Embeddings: `OpenAIEmbeddings()` ou `HuggingFaceEmbeddings()`
5. Vector store: `Chroma.from_documents(docs, embeddings)` ou Pinecone/Weaviate
6. Chain: `RetrievalQA.from_chain_type(llm=llm, retriever=store.as_retriever())`

### 3.3 Components detalhados
1. **Chunking**: recursive split → respeita paragrafos/sentencas
2. **Indexing**: embedding store + metadata (fonte, data, paginas)
3. **Retrieval**: top-k chunks (k=3-10), threshold de similaridade
4. **Prompt**: template c/ `{context}` + `{question}`, instrucao p/ responder baseado apenas no contexto

### 3.4 Project: Contract Intelligence
1. PDF contracts → `PyPDFLoader`
2. Chunk por clausula (paragraph-aware)
3. Query: "What are the termination clauses?" → retrieve chunks → LLM sumariza
4. Validar: respostas citam clausulas especificas do contrato

## 4. Advanced RAG
### 4.1 Pre-retrieval optimization
1. **Query reescrita**: LLM reescreve pergunta ambigua p/ melhor retrieval
2. **Query decomposicao**: pergunta complexa → sub-perguntas → respostas parciais → sintese
3. **HyDE**: gerar resposta hipotetica, embed a resposta (nao a query)
4. **Multi-hop retrieval**: 1o hop encontra entidade, 2o hop encontra relacao

### 4.2 Retrieval optimization
1. **Hybrid search**: keyword (BM25) + semantic (embedding) combinados
2. **Metadata filtering**: filtrar por data, categoria, autor antes da busca
3. **Fine-tuned embedding**: modelo embedding customizado p/ o dominio

### 4.3 Post-retrieval optimization
1. **Reranking**: cross-encoder reordena chunks retrieved p/ relevancia
2. **Summary index**: resumir chunks antes de passar ao LLM
3. **Context compression**: extrair so partes uteis dos chunks longos

### 4.4 Knowledge Graphs
1. Entidades e relacoes — nodes + edges
2. Extrair entidades do texto c/ LLM → populam KG
3. Retrieval: encontrar entidades no KG → obter sub-grafo → incluir no prompt
4. KG + Vector → combinar resultados

### 4.5 RAG + Fine-tuning
1. Fine-tune embedding model p/ similaridade semantica do dominio
2. Fine-tune LLM p/ seguir instrucao de "responder baseado no contexto"
3. Fine-tuning nao substitui RAG — complementam

### 4.6 Project: Customer Success Navigator
1. Base: documentacao do produto + FAQs + historico de tickets
2. Advanced RAG pipeline: query rewrite → hybrid search → reranking → LLM
3. Capacidades: troubleshooting, product info, escalation triage

## 5. Agentic Workflows
### 5.1 Core components
1. **Tools**: APIs, DB queries, calculators, search — interface padrao p/ LLM chamar
2. **Memory**: short-term (conversa) + long-term (vector store)
3. **Orchestration**: LLM decide qual tool chamar, quando, e como interpretar resultado

### 5.2 ReAct framework
1. **Reason** → **Act** → **Observe** loop:
   - Thought: raciocina sobre o que precisa
   - Action: chama tool (ex: `Search[query]`)
   - Observation: resultado da tool
   - Repeat ate resposta final
2. Prompt template: exemplos few-shot de Thought/Action/Observation
3. Parse output estruturado p/ extrair action name + args

### 5.3 Reflexion framework
1. ReAct + etapa de **self-reflection** apos gerar resposta
2. Avaliar se resposta contem erros logicos ou informacao insuficiente
3. Se erro detectado → gerar resposta melhorada
4. Loop de refinamento ate passar criterio de qualidade

### 5.4 LlamaIndex
1. `pip install llama-index`
2. `VectorStoreIndex.from_documents(docs)` → cria index
3. `query_engine = index.as_query_engine(llm=llm)`
4. Agent: `ReActAgent.from_tools(tools, llm=llm, verbose=True)`
5. Tool definition: `FunctionTool.from_defaults(fn=my_function, name="...", description="...")`

### 5.5 Debugging and optimization
1. Log completo: thought → action → observation → final
2. Limitar tools disponiveis p/ evitar loop infinito
3. Timeout por step: kill agent se excede N segundos
4. Max iterations: prevenir runaway

### 5.6 Project: IT Ops Agent
1. Tools: ver status servidor (ping/API), ler logs, executar comando seguro, consultar runbook
2. Memoria: historico de incidentes (vector store)
3. Capacidade: diagnosticar falha → sugerir acao → escalar se necessario
4. Guardrails: lista branca de comandos, log de todas as acoes

## 6. Deploy GenAI Systems
### 6.1 Critical aspects
1. **Requisitos**: latencia, throughput, privacidade, compliance
2. **Arquitetura**: load balancer → API gateway → model server → vector DB
3. **Infra**: compute (GPU/CPU), networking, storage, licensing
4. **Estrategia**: rollout gradual, canary deployment

### 6.2 Cloud deployment
1. AWS: SageMaker p/ models, ECS/EKS p/ apps, RDS p/ structured, OpenSearch p/ vector
2. Auto-scaling baseado em metrics de GPU/utilizacao
3. Multi-region p/ latencia global

### 6.3 Model server deployment
1. **vLLM**: alta throughput p/ LLMs — `pip install vllm`, `python -m vllm.entrypoints.openai.api_server`
2. **TGI** (Hugging Face): `text-generation-inference` — otimizado p/ HF models
3. **Ollama**: local, simples, modelos quantizados
4. Private deploy necessario quando: dados sensiveis, latencia, custo de API

### 6.4 Model selection
1. Nao unico — processo continuo
2. Avaliar: accuracy (benchmarks), latencia (tokens/s), custo (por token/hora), contexto maximo
3. Trocar modelo sem mudar codigo → abstraction layer (OpenAI-compatible API)
4. A/B testing entre modelos em producao

### 6.5 Cost implications
1. **Compute**: GPU on-demand vs reserved vs spot instances
2. **API**: tokens input + output — estimar volume por usuario
3. **Storage**: embeddings, vector DB, logs, audit trails
4. **Network**: egress costs c/ dados grandes (videos, imagens)

### 6.6 Optimization
1. **Batching**: agrupar requests p/ maior throughput
2. **Caching**: respostas similares (semantic cache)
3. **Model quantization**: FP16 → INT8 → FP4 reduz VRAM
4. **Prompt compression**: remover whitespace, tokens desnecessarios

### 6.7 Evaluation
1. **Offline**: benchmark datasets, test set
2. **Online**: user feedback, rating, A/B test metrics
3. **Metricas**: relevancia, precisao, toxicidade, custo medio por request
4. **Human-in-the-loop**: amostragem de outputs p/ revisao manual

## 7. Governance & Ethics
### 7.1 Risks
1. **Bias**: dados de treinamento enviesados → outputs discriminam grupos
2. **Privacy**: PII em prompts/context → vazamento de dados
3. **Misinformation**: alucinacoes → informacoes falsas apresentadas como fato
4. **Over-reliance**: usuarios confiam sem verificacao → decisoes erradas
5. **IP infringement**: modelo gera conteudo protegido por copyright

### 7.2 Mitigacao
1. **Guardrails tecnicos**: content filter, PII detection, input/output validation
2. **Human review**: outputs de alto risco revisados por humano
3. **Audit trail**: log completo (prompt → retrieval → response → approval)
4. **Fine-tuning**: remover bias dos dados de treino

### 7.3 Responsible AI toolbox
1. **Governance framework**: politicas, ownership, escalation
2. **Technical safeguards**: rate limit, prompt injection detection, output sanitization
3. **Transparency**: usuarios informados que interagem com AI
4. **Feedback loop**: reportar outputs problematicos → melhoria continua

### 7.4 AI regulations
1. **EU AI Act**: classificar sistema por risco (unacceptable, high, limited, minimal)
2. **US Executive Order**: testing, transparency, safety
3. **China**: algoritmos registrados, censura de outputs
4. Compliance checklist: documentacao, audit, transparencia, direito a explicacao

### 7.5 Impact on jobs
1. Automacao de tarefas repetitivas — nao substituicao completa
2. Reskilling: times precisam aprender prompt engineering, evaluation, oversight
3. Novos papeis: AI ethicist, LLM ops engineer, prompt librarian
