---
name: visualizing-genai
description: Guia prático p/ construir apps GenAI — prompting, agentes, RAG, fine-tuning, arquitetura
---

# Visualizing Generative AI — Passos Operacionais

## 1. Usando APIs de LLM (Chapter 2)

### 1.1 Setup de API Keys
1. Criar conta nos providers (OpenAI, Google/Gemini, Groq, Anthropic)
2. Obter API keys nos dashboards:
   - OpenAI: platform.openai.com/api-keys
   - Gemini: aistudio.google.com (API Key)
   - Groq: console.groq.com/keys
   - Anthropic: console.anthropic.com
3. Salvar em `keys.env`:
   ```
   OPENAI_API_KEY=sk-...
   GOOGLE_API_KEY=AI...
   GROQ_API_KEY=gsk_...
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Carregar com `python-dotenv`:
   ```python
   from dotenv import load_dotenv
   load_dotenv("keys.env")
   ```

### 1.2 Invocando LLMs via LangChain
1. Instalar pacotes: `langchain-openai`, `langchain-google-genai`, `langchain-groq`, `langchain-anthropic`
2. Criar LLM object:
   ```python
   llm = ChatOpenAI(model_name="gpt-3.5-turbo", openai_api_key=os.getenv("OPENAI_API_KEY"))
   llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=os.getenv("GOOGLE_API_KEY"))
   llm = ChatGroq(model_name="mixtral-8x7b-32768", groq_api_key=os.getenv("GROQ_API_KEY"))
   llm = ChatAnthropic(model="claude-3-sonnet", api_key=os.getenv("ANTHROPIC_API_KEY"))
   ```
3. Invocar: `response = llm.invoke(prompt)`

### 1.3 Prompt Template e Chain
1. Criar template com `PromptTemplate.from_template()`:
   ```python
   prompt = PromptTemplate.from_template("""Categorize the review below...
   **Review**:
   {review_text}
   """)
   ```
2. Adicionar output parser: `output_parser = StrOutputParser()`
3. Montar chain: `chain = prompt | llm | output_parser`
4. Invocar: `response = chain.invoke({"review_text": review})`

### 1.4 Prompt Signature com DSPy
1. Definir signature: `"context, review -> sentiment, topics, explanation"`
2. Criar `dspy.Predict`: `prog = dspy.Predict(signature)`
3. Configurar LLM: `llm = dspy.OpenAI(model="gpt-3.5-turbo", api_key=...)`
4. Invocar: `answer = prog(context=..., review=...)`
5. Acessar campos: `answer.sentiment`, `answer.topics`, `answer.explanation`

### 1.5 Estrutura de Prompt Eficaz
1. Especificar **Role** (quem escreve — "You are a trivia host")
2. Especificar **Audience** (leitor alvo — "student earning below minimum wage")
3. Especificar **Format/Style** (email, Instagram post, artigo)
4. Repetir a pergunta ao final do prompt
5. Terminar com início da resposta esperada (ex: `**Summary**`)
6. Usar meta-prompting: pedir p/ LLM criar o prompt

### 1.6 Controle de Geração (Parâmetros)
1. **Temperature** (0.0-1.0): baixo p/ fatos/código, alto p/ criatividade
2. **Top-K**: limitar aos K tokens mais prováveis
3. **Top-P** (nucleus sampling): escolher tokens até cumulative probability P
4. Ajustar via API: `llm = dspy.OpenAI(temperature=0.3, top_p=0.8, top_k=3)`

### 1.7 Técnicas de Prompt Engineering
1. **Zero-shot**: instrução direta sem exemplos
2. **Few-shot**: fornecer 2-3 exemplos do formato desejado
3. **Chain-of-thought**: demonstrar passos lógicos ou usar "think step-by-step"
4. **Context window**: inserir dados no prompt (PDFs, imagens, texto)
5. **Meta-prompting**: pedir p/ LLM criar o prompt ideal

### 1.8 Customização de Modelos
1. **Prefix tuning**: ajusta só parâmetros de prefixo (models open-weight como T5, Llama)
2. **Adapter tuning (LoRA)**: adiciona layer extra de pesos sobre o modelo base
3. **Distillation**: treina modelo menor nas respostas de um maior

## 2. Construindo Agentes (Chapter 4)

### 2.1 Setup AutoGen
1. Instalar: `pip install pyautogen`
2. Configurar LLM:
   ```python
   config = {"config_list": [{"model": "gpt-4", "api_key": os.environ.get("OPENAI_API_KEY")}]}
   ```
3. Criar user proxy:
   ```python
   user_proxy = UserProxyAgent("user_proxy", code_execution_config={"work_dir": "coding", "use_docker": False}, human_input_mode="NEVER")
   ```
4. Criar assistant:
   ```python
   assistant = AssistantAgent("Assistant", llm_config=config, max_consecutive_auto_reply=3)
   ```
5. Iniciar chat: `user_proxy.initiate_chat(assistant, message="Is it raining in Chicago?")`

### 2.2 Agente com Ferramentas (Weather Agent)
1. Extrair location via system message + few-shot:
   ```python
   SYSTEM_MESSAGE_1 = """In the question below, what location is the user asking about?
   Example:
   Question: What's the weather in Kalamazoo, Michigan?
   Answer: Kalamazoo, Michigan.
   Question:"""
   ```
2. Geocoding: função Python que chama Google Maps Geocoding API
3. Registrar função com `autogen.register_function(geocoder, caller=assistant, executor=user_proxy)`
4. Expandir system message incluindo geocoding step
5. Adicionar tool de weather (NWS API)
6. System message final com steps numerados + exemplo completo

### 2.3 Agente com LangGraph
1. Criar graph: `workflow = StateGraph(MessagesState)`
2. Adicionar nós:
   ```python
   workflow.add_node("assistant", call_model)
   workflow.add_node("tools", ToolNode(tools))
   ```
3. Definir tools como funções Python decoradas com `@tool`
4. Configurar modelo: `model = ChatOpenAI(model='gpt-3.5-turbo', temperature=0).bind_tools(tools)`
5. Definir conditional edges:
   ```python
   def assistant_next_node(state): return "tools" if last_message.tool_calls else END
   workflow.add_conditional_edges("assistant", assistant_next_node)
   workflow.add_edge("tools", "assistant")
   ```
6. Compilar: `app = workflow.compile()`
7. Invocar: `app.invoke({"messages": [HumanMessage(content=question)]})`

### 2.4 RAG — Indexing Pipeline
1. Carregar documentos, chunk em parágrafos
2. Escolher embedding model (MiniLM, text-embedding-004, GritLM-7B)
3. Criar vector store (Chroma, Pinecone, pgvector, Faiss):
   ```python
   vectorstore = Chroma.from_documents(documents=docs, embedding=embed_model, persist_directory=PERSIST_DIR)
   ```
4. Configurar retriever: `retriever = vectorstore.as_retriever(search_kwargs={"k": 5})`

### 2.5 RAG — Generation Pipeline
1. Pull prompt de hub: `rag_prompt = hub.pull("rlm/rag-prompt")`
2. Criar chain:
   ```python
   rag_chain = ({"context": retriever | add_docs_to_context, "question": RunnablePassthrough()} | rag_prompt | llm_model | StrOutputParser())
   ```
3. Invocar: `rag_chain.invoke("What rocks do you find in the Upper Lias?")`

### 2.6 Melhorias de RAG
1. **Hypothetical answer**: gerar resposta hipotética primeiro, usar embedding dela p/检索
2. **Reranking**: 2-stage — recuperar 10 docs, comprimir p/ 3 com cross-encoder (`FlashrankRerank`)
3. **Hierarchical indexing**: indexar sentenças, parágrafos, páginas
4. **Contextual retrieval**: adicionar metadados (título do doc, capítulo)
5. **BM25**: p/ buscas exatas de texto incomum (part numbers)
6. **Error correction**: validar extração, reingestar se lossy

### 2.7 SQL Agent (Dados Estruturados)
1. Carregar dados em SQLite via Pandas:
   ```python
   df.to_sql("names", engine, index=False)
   ```
2. Criar SQL agent com LangChain:
   ```python
   agent_executor = create_sql_agent(model, db=db, agent_type="tool-calling")
   ```
3. Invocar: `agent_executor.invoke({"input": "what was the most popular name for girls in 1999?"})`
4. Corrigir erros lógicos:
   - Adicionar comentários/descrições ao schema das colunas
   - Usar few-shot examples no prompt
   - Dynamic few-shot com RAG (semantic similarity)

### 2.8 Charting com Agentes
1. SQL agent p/ obter dados
2. Model gera código Python (Matplotlib)
3. Executar código em sandbox (`subprocess.call()` ou `%run`)

### 2.9 Arquiteturas de Agentes (Andrew Ng)
1. **Reflection**: gerar → criticar → melhorar (loop)
2. **Tool use**: fornecer tools (calculadora, search, APIs) + ReAct (reasoning + action)
3. **Dynamic planning**: chain-of-thought p/ decompor tarefa, executar passos com LLM ou gerar código
4. **Multi-agent collaboration**: múltiplos agentes com roles diferentes

## 3. Arquitetando Aplicações GenAI (Chapter 5)

### 3.1 Escolha do Modelo Base
1. Verificar LMSYS Chatbot Arena p/ qualidade comparativa
2. Verificar Artificial Analysis p/ custo e velocidade
3. Critérios: conveniência (cloud provider), custo, velocidade, capacidades (context window, safety)
4. Default: modelo streamlined (GPT-4o-mini, Gemini Flash, Claude Haiku)
5. Subir p/ frontier model só quando necessário

### 3.2 Arquiteturas por Risco e Criatividade
**Low Risk:**
1. **Generate each time**: chamar API a cada request (alta criatividade)
2. **Response/prompt caching**: cachear respostas exatas (LangChain `InMemoryCache`)
3. **Semantic caching**: reescrever prompts p/ forma canônica, aumentar cache hit
4. **Small Language Models (SLMs)**: Phi-3, Mistral 7B p/ tarefas simples (baixa criatividade)

**Medium Risk:**
1. **Pregenerated templates**: gerar templates com placeholders, human review, armazenar
2. **Assembled reformat**: gerar atributos individuais, montar via LLM com contexto
3. **ML template selection**: recommendation engine + pregenerated content

**High Risk:**
1. **Fine-tuning**: adapter tuning (LoRA), distillation, RLHF/DPO
2. **Guardrails**: prebuilt (Nvidia NeMo) + custom (input filtering, output validation, fact-checking)

### 3.3 Fine-tuning com Adapter Tuning (LoRA)
1. Criar dataset de treino no formato conversation (system/user/assistant messages)
2. Extrair input-output pairs do corpus de domínio
3. Estimar custo com notebooks do provider
4. Upload do JSONL:
   - OpenAI: `client.files.create(file=open("file.jsonl","rb"), purpose="fine-tune")`
   - Gemini: `gsutil cp file.jsonl gs://$BUCKET/`
5. Iniciar job:
   - OpenAI: `client.fine_tuning.jobs.create(training_file=id, model=BASE_MODEL)`
   - Vertex AI: `sft.train(source_model="gemini-1.0-pro-002", train_dataset=...)`
6. Aguardar conclusão (polling loop com `time.sleep(60)`)
7. Inferir: chamar completion especificando fine-tuned model

### 3.4 Fine-tuning com Distillation
1. Coletar dataset de inputs (sem labels)
2. Teacher model gera rationale + output
3. Criar dataset de treino com input → rationale + output
4. Submeter p/ pipeline de distillation:
   - Vertex AI: `student_model.distill_from(teacher_model=..., dataset=...)`
   - Azure ML: pipeline component com `enable_chain_of_thought=True`
5. Verificar legalidade do teacher model (alguns providers proíbem)
6. Fazer hyperparameter tuning (learning rate, epochs, etc.)
7. Avaliar com métricas de negócio

### 3.5 Fine-tuning com RLHF/DPO
1. Coletar human preference dataset (prompt + chosen + rejected)
2. Carregar dataset Hugging Face: `load_dataset("json", data_files=INPUT_FILE_NAME)`
3. Split train/test
4. Carregar modelo base: `AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3.1-8B")`
5. Criar `DPOTrainer`, chamar `train()`, salvar
6. Fontes de feedback: explicita (thumbs), implícita (conversão, tempo de leitura)
