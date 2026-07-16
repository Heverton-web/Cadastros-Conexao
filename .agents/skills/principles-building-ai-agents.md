---
name: principles-building-ai-agents
description: >- Principios para construir agentes de IA — modelos, prompts, ferramentas, MCP, RAG, avaliacao e deploy
---

# Principles of Building AI Agents — Passos Operacionais

## 1. Choosing a Provider and Model

### 1.1 Decision Criteria
1. **Hosted vs open-source**: Start with hosted (OpenAI, Anthropic, Google Gemini). Prototype fast, avoid infra debugging
2. **Model size vs cost/latency**: Larger models = more accurate, slower, pricier. Prototype with expensive models, then optimize
3. **Context window**: Gemini Flash supports 2M tokens. Start with large context before building memory systems
4. **Reasoning models**: Use for complex multi-step problems. Feed lots of context upfront via many-shot prompting

### 1.2 Provider Landscape (May 2025)
1. OpenAI — GPT-4o, o-series reasoning; Anthropic — Claude (code-friendly); Google — Gemini (largest context)
2. Meta — Llama (open-source); Mistral, DeepSeek — open-source alternatives

## 2. Writing Great Prompts

### 2.1 Prompting Techniques
1. **Zero-shot**: ask directly (YOLO)
2. **Single-shot**: one input/output example
3. **Few-shot**: multiple examples for precise output control
4. **Seed crystal**: ask model to generate its own prompt, then refine
5. **System prompt**: set agent characteristics/tone (does NOT improve accuracy)

### 2.2 Formatting Tricks
1. Use CAPITALIZATION for emphasis
2. XML-like structure (`<task>...</task>`, `<context>...</context>`) for precise instructions
3. Claude/GPT-4 respond better to structured: task, context, constraints

## 3. Agents 101

### 3.1 Levels of Autonomy
1. Low: binary decisions in a decision tree
2. Medium: memory, tool calling, retry on failure
3. High: planning, subtask division, task queue management

### 3.2 Agent vs Direct LLM Call
1. Direct LLM = contractor: one-shot transformation. Agent = employee: persistent context, role, tools
2. Mastra agents: `new Agent({ name, instructions, model, tools })` — persistent memory + consistent config

## 4. Model Routing and Structured Output

### 4.1 Model Routing
1. Use AI SDK or Mastra to swap providers without rewriting code
2. Benefit: prototype on one model, optimize/production on another

### 4.2 Structured Output
1. Request JSON by providing a schema in the prompt
2. Most models support structured/JSON mode natively
3. Use for extracting structured data from unstructured text (resumes, medical records, forms)

## 5. Tool Calling

### 5.1 Designing Tools (Most Important Step)
1. Define the full list of tools needed BEFORE coding
2. Each tool = one clear operation (fetch weather, query DB, calculate)
3. Provide detailed descriptions in tool definition AND system prompt
4. Use specific input/output schemas; use semantic naming (`multiplyNumbers` not `doStuff`)

### 5.2 Best Practices
1. Think like an analyst: break problem into reusable operations → each is a tool
2. Describe both what a tool does AND when to call it
3. Schema: define typed inputs (string, number, enum) and outputs

## 6. Agent Memory

### 6.1 Working Memory
1. Stores persistent user characteristics (preferences, context)
2. ChatGPT example: asks what it knows about you — that's working memory

### 6.2 Hierarchical Memory
1. Combine recent messages (sliding window) + semantically relevant long-term memories (RAG)
2. `lastMessages`: sliding window of most recent messages
3. `semanticRecall`: RAG-based search through past conversations
4. `topK`: number of messages to retrieve; `messageRange`: context on each side

### 6.3 Memory Processors
1. `TokenLimiter`: removes oldest messages until under token limit — prevents context window overflow
2. `ToolCallFilter`: strips tool call details from memory — saves tokens, forces re-execution when needed

## 7. Dynamic Agents

### 7.1 When to Use Dynamic
1. Agent properties (instructions, model, tools) change at runtime based on user input or environment
2. Example: support agent adjusts behavior per subscription tier + language preference

### 7.2 Implementation
1. Pass runtime parameters instead of hardcoded config
2. System prompt, model selection, tool list all determined per-request

## 8. Agent Middleware

### 8.1 Guardrails
1. Input sanitization: prevent prompt injection ("IGNORE PREVIOUS INSTRUCTIONS..."), PII leaks, off-topic chats
2. Output sanitization: filter toxic/inappropriate responses
3. Models are getting better at self-guarding; stay updated on jailbreak techniques

### 8.2 Authentication and Authorization
1. Resource permissioning: which tools/data the agent can access
2. User permissioning: which users can access the agent
3. Middleware is the right layer — runs in the perimeter, not the agent's inner loop

## 9. Model Context Protocol (MCP)

### 9.1 What MCP Is
1. Open protocol (Anthropic, Nov 2024) connecting AI agents to tools — USB-C for AI
2. Servers wrap tools; clients query servers for tool list + execute tools
3. Supported by OpenAI, Google Gemini, all major providers (April 2025)

### 9.2 When to Use MCP
1. Agent needs integrations with 3rd parties (calendar, email, web, GitHub)
2. Building a tool you want other agents to use → ship an MCP server

### 9.3 Building an MCP Server/Client
1. Server: define tools with name, description, input schema → expose over HTTP
2. Client: discover tools from server → call them by name with typed args
3. Use a framework (Mastra, LangChain) to avoid reimplementing spec

### 9.4 Ecosystem
1. Registries: Smithery, PulseMCP, mcp.run
2. Vendors shipping MCP servers: Stripe, others
3. Challenges: discovery fragmentation, quality verification, config differences

## 10. Graph-Based Workflows

### 10.1 Core Primitives
1. **Branching**: parallel LLM calls on same input (e.g., check 12 symptoms in parallel)
2. **Chaining**: sequential steps, each feeds into next (`.then()`)
3. **Merging**: combine results from parallel branches
4. **Conditions**: conditional path execution based on intermediate results

### 10.2 Best Practices
1. One meaningful input/output per step — makes tracing readable
2. Decompose: each step should do ONE thing, max one LLM call per step
3. Compose primitives for loops, retries, etc.

## 11. Suspend and Resume

### 11.1 Human-in-the-Loop Pattern
1. Workflow pauses while waiting for external input (human approval, 3rd party)
2. Persist workflow state — don't keep process running
3. `.suspend()` → saves state; `.resume()` → picks up where left off
4. Watch for status changes to trigger resume

## 12. Streaming Updates

### 12.1 Why Streaming Matters
1. Users need to see progress, not a blank screen
2. Stream LLM tokens, workflow steps, or custom progress data
3. Use reactive tools (ElectricSQL, Turbo Streams) for live UI sync

### 12.2 Implementation Approaches
1. Stream tokens as they generate — most common
2. Stream step-by-step progress for multi-step workflows
3. Escape hatch: write partial results to DB, sync to frontend in real-time

## 13. Observability and Tracing

### 13.1 Tracing Setup
1. Emit OpenTelemetry (OTel) format — standard, portable
2. Trace = tree of spans (like nested HTML / flame chart)
3. Each span: function name, input, output, timing, status

### 13.2 What to Observe
1. Input/output of every function and LLM call
2. Latency per step
3. Error rates and status codes
4. Eval scores alongside production traces

## 14. Evals

### 14.1 Evals 101
1. Evals = tests for non-deterministic AI outputs; return scores 0-1, not pass/fail
2. Think of them like performance tests in CI — some noise, but correlation over time

### 14.2 Textual Evals
1. **Accuracy**: hallucination, faithfulness to context, content similarity, completeness, answer relevancy
2. **Context usage**: context position, precision, relevancy, recall
3. **Output quality**: tone consistency, prompt alignment, summarization quality, keyword coverage

### 14.3 Other Eval Types
1. **Classification/Labeling**: accuracy of tagging/categorization
2. **Tool usage**: did agent call the right tool with right args? (like Jest `expect(fn).toBeCalled`)
3. **Prompt engineering**: sensitivity to prompt variations, robustness against injection
4. **A/B testing**: live experiments with real users (Perplexity, Replit rely on this)
5. **Human review**: inspect production traces for subtle issues

## 15. Retrieval-Augmented Generation (RAG)

### 15.1 RAG Pipeline Steps
1. **Chunking**: split documents into bite-sized pieces. Strategy + overlap window
2. **Embedding**: transform chunks into vectors (1536-dim array). Use OpenAI, Voyage, Cohere
3. **Upsert**: insert vectors + metadata into vector store
4. **Indexing**: create index (dimension size, similarity metric: cosine/euclidean/dot)
5. **Querying**: convert user input to embedding, cosine similarity search
6. **Reranking**: optional — computationally expensive but improves ordering
7. **Synthesis**: pass retrieved chunks + context to LLM for final answer

### 15.2 Vector DB Selection
1. Postgres + pgvector (don't add another service)
2. Pinecone (good UI, default for new projects)
3. Cloud provider's managed vector DB

### 15.3 RAG Alternatives (Try First)
1. **Full context loading**: dump everything into Gemini's 2M token window — simplest
2. **Agentic RAG**: bundle tools in MCP server for Cursor/Windsurf agent
3. **ReAG**: pre-process with LLMs — enrich chunks, extract entities, structured relationships
4. Start simple, check quality, get complex

## 16. Multi-Agent Systems

### 16.1 Design Principles
1. Like org design: group related tasks into "job descriptions" for agents
2. Separate creative/generative from review/analytical tasks
3. Fractal: hierarchy is supervisor of supervisors; start simple

### 16.2 Agent Supervisor Pattern
1. Supervisor agent delegates to sub-agents via tools
2. Sub-agents wrapped as tools: copywriter, editor → publisher orchestrates

### 16.3 Control Flow
1. Establish approach before execution (like PM spec → approval → engineering)
2. Add human checkpoints in agent workflows
3. Workflows can be wrapped as tools that agents use

### 16.4 Multi-Agent Standards
1. **A2A** (Google): JSON metadata at `/.well-known/agent.json`; HTTP + JSON-RPC 2.0
2. Agents discover each other's capabilities, send tasks with state tracking
3. A2A vs MCP: MCP = tool connectivity; A2A = agent-to-agent communication

## 17. Local Development

### 17.1 Agentic Web Frontend
1. Chat interface + stream to backend + auto-scroll + display tool calls
2. Transport: request/response, SSE, webhooks, web sockets
3. Frameworks: Assistant UI, Copilot Kit, Vercel AI SDK UI
4. Agent logic stays backend-side (don't leak API keys)

### 17.2 Agent Backend
1. Agent Chat Interface — test conversations in browser
2. Workflow Visualizer — step-by-step execution, suspend/resume/replay
3. Tool Playground — test tools independently
4. Tracing & Evals — see inputs/outputs + eval metrics during iteration

## 18. Deployment

### 18.1 Deployment Model
1. Agent → web server → Docker → auto-scaling platform
2. Serverless (Vercel, Lambda) not fully ready — function timeouts, bundle size limits

### 18.2 Challenges
1. Long-running processes (like Temporal/Inngest workloads but tied to user request)
2. Serverless: timeouts, bundle sizes, missing Node.js runtime features

### 18.3 Recommendations
1. Container services: AWS EC2, Digital Ocean — good for B2B with predictable traffic
2. Managed platforms with auto-scaling for variable traffic

## 19. Multimodal

### 19.1 Image Generation
1. Use cases: product mockups, ad creative, asset prototyping, scene layout
2. Tools: Midjourney, DALL-E, Flux, Stable Diffusion
3. "Try-on" models: swap human model but keep clothing item

### 19.2 Voice
1. Modalities: STT (speech-to-text), TTS (text-to-speech), real-time voice
2. Production approach: STT → LLM → TTS pipeline (not end-to-end voice model)
3. Challenges: turn-taking (voice activity detection), latency, training data density

### 19.3 Video
1. Still in ML engineering, not AI engineering (no "Ghibli moment" yet)
2. Requires specialized knowledge and heavy GPU cycles

## 20. Code Generation

### 20.1 Building Code Agents
1. **Feedback loops**: write code → run → read errors → fix iteratively
2. **Sandboxing**: always run generated code in sandbox (`rm -rf /` protection)
3. **Code analysis**: give agent access to linters, type checkers for ground-truth feedback

### 20.2 Safety Considerations
1. Never run generated code on host machine
2. Use sandboxed environments (Docker, VM, serverless sandbox)
3. Rate-limit and monitor agent actions
