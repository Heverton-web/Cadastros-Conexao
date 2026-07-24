---
name: agentic-ai-data-architectures
description: >- Arquiteturas de dados para IA agente — pipelines, feature stores, RAG e governanca
---
# Agentic AI Data Architectures — Passos Operacionais

## 1. Agentic AI Fundamentals
### 1.1 Perceive/Reason/Act/Learn Loop
1. **Perceive**: agent capta sinais de fontes multiplas (texto, APIs, DBs, sensores, memoria previa)
2. **Reason**: avalia inputs contra objetivos e constraints, decide proximo passo
3. **Act**: agent age alem da conversa — triggers workflows, invoca sistemas externos, coordena subtasks
4. **Learn**: ingere feedback continuamente p/ refinar performance futura (feedback loop)

### 1.2 Tipos de Memoria
1. **Short-term (working) memory**: mantem info dentro do escopo de uma task/sessao — tracking de history
2. **Long-term memory**: persiste conhecimento e preferencias entre sessoes (dias/semanas)
3. **Episodic memory**: captura sequencias de eventos e outcomes — reflection on what worked/failed
4. **Temporal continuity**: episodic memory + state tracking + time-sensitive retrieval

## 2. Memory as Infrastructure — Distributed SQL
### 2.1 Unified Retrieval Foundation
1. Centralizar structured data (facts/transactions) + unstructured (documents/embeddings) + temporal data em single distributed SQL system
2. Distributed SQL preserva modelo SQL (tables, schemas, ACID) enquanto escala horizontalmente via consensus (Raft)
3. Integrar vector search nativamente ou via extensions p/ hybrid search (semantic + relational)
4. Usar SQL declarative power p/ agents fazerem transactional queries + semantic similarity em unified syntax

### 2.2 Elasticidade
1. Scale out/in horizontalmente baseado em demanda spike
2. Decouple compute de storage p/ escalar independentemente
3. Rolling upgrades + transparent migration sem downtime
4. Resource isolation entre tenants ou agent workloads (CPU, memory, query quotas)

## 3. Padroes de Recuperacao e Memoria
### 3.1 Semantic-Transactional Join
1. Combinar vector similarity search c/ relational filters
2. WHERE clause restringe resultados factuais (ex: `WHERE status='active'`)
3. Melhora precision excluindo resultados semanticamente relevantes mas operacionalmente invalidos

### 3.2 Contextual Fact Augmentation
1. Enriquecer embeddings c/ structured data (renewal dates, account size, region)
2. Join embeddings + attributes em single distributed SQL query
3. Assistente ganha narrative similarity + factual context simultaneamente

### 3.3 Probabilistic Joins for Ambiguous Context
1. Expand joins c/ fuzzy ou probabilistic matching (similarity functions statt strict equality)
2. SQL joins produzem match probabilities ou confidence scores
3. Embeddings fornecem semantic context weighted by probabilistic match scores
4. Uso: fraud detection, entity resolution, intelligence analysis

### 3.4 Sliding Window Context
1. Manter moving slice dos dados mais recentes + aggregated measures em horizontes longos
2. Aggregates (counts, sums, averages) atualizaveis em O(1); percentis/distinct counts via sketches/t-digests em O(log n)
3. Vector data: approximate nearest-neighbor indexes + time-based eviction
4. Updates incrementais e idempotentes p/ replay seguro sem duplicacao

### 3.5 Microbatch Refresh
1. Set target freshness (ex: dados ≤60s old)
2. Trigger batches em timer ou quando N novas rows chegarem
3. Ingest apenas dados novos desde ultimo run c/ safety delay
4. Validate, dedupe, transform apenas changed records
5. Merge updates atomically into aggregates, rolling windows, ou embeddings
6. Advance watermark, log metrics
7. Expose refreshed results c/ timestamp p/ agents
8. On failure: fallback p/ ultimo successful watermark + exponential backoff retry

### 3.6 RAG (Retrieval-Augmented Generation)
1. **Indexing**: vectorize external data (docs, PDFs, websites) via embedding model, store in vector DB
2. **Retrieval**: on user query, retriever busca most pertinent documents via similarity search
3. **Augmentation**: incorporate retrieved content into prompt via prompt engineering
4. **Generation**: LLM gera resposta usando internal parameters + external context
5. Vantagem: stay up-to-date sem retrain, citations rastreaveis

### 3.7 Long-Term Memory (LTM)
1. **Capture**: ao fim da sessao (ou checkpoints), gerar summary/embedding do q foi importante
2. **Filter**: heuristicas (frequencia, relevancia), scoring (recency, explicit "remember this"), forgetting rules
3. **Storage**: vector DB p/ semantic recall + structured DB p/ explicit facts (key-value)
4. **Retrieval**: agent query memory stores → retrieved memories added to context window

### 3.8 Episodic Stores (Session-Based)
1. **Capture**: durante sessao ativa, registrar events, exchanges, outcomes (rolling transcript, structured logs, embeddings)
2. **Filter**: heuristics p/ interactions criticas, temporal sequence scoring, session-bound expiry rules
3. **Storage**: session buffers/rolling windows, event logs, intermediate stores (podem distill p/ LTM)
4. **Retrieval**: agent recalls episodic memory p/ thread coherence — steps ja dados, clarificacoes, unresolved tasks

### 3.9 Temporal Consistency Retrieval
1. Write data into temporal tables q automaticamente track valid-time ou transaction-time history
2. Agent inclui temporal predicates (`AS OF TIMESTAMP`) p/ reconstruir world state em momento especifico
3. Embeddings tied to historical records retrieved alongside temporal validity
4. Retrieved facts passados p/ reasoning pipeline c/ time labels p/ evitar conflating past/present

### 3.10 Multiagent Shared Memory
1. Distributed SQL hosts common tables p/ agent-to-agent data exchange
2. Shared embeddings permitem agents discover semantically related contributions from peers
3. SQL garante atomic updates to commitments (locking resources, recording task progress)
4. Agents read shared state + enrich c/ semantic recall p/ coordinated strategies

### 3.11 Incremental Fact Synchronization
1. Distributed SQL emite row-level changes via CDC (Change Data Capture) ou streaming replication
2. Updated rows sao re-embedded e stored in vector index
3. Agents query embeddings guaranteed to reflect current transactional truth
4. Refreshed embeddings + transactional facts provided together during reasoning

## 4. Operationalizando AI Memory Layer
### 4.1 Latency Enforcement
1. **Best-case latency**: fast indexing, in-memory access, minimal internal overhead
2. **Tail latency (p95/p99)**: redundancy, speculative execution, scheduling, resource isolation
3. **Cold lookup/cache miss**: prefetching, efficient index structures, smart invalidation policies
4. **Network/cross-node latency**: partition-aware locality, colocate related data, batch requests
5. **Index maintenance latency**: incremental updates, background compaction, non-blocking reads

### 4.2 Elasticity and Isolation
1. Horizontal scaling on demand (partitioned + replicated nodes)
2. Resource isolation across tenants/agents (CPU, memory, query quotas)
3. Partition-aware locality + data colocation p/ minimizar cross-node hops
4. Elastic compute-storage decoupling (scale query processing independently)
5. Safe scaling via rolling upgrades, transparent migration
6. Mitigate "noisy neighbor" via throttling/sandboxing

### 4.3 Governance
1. **Standardized metadata per request**: request context, data source, timestamp, version IDs, user identity, provenance
2. **RBAC at retrieval boundary**: access control enforced no retrieval layer, nao apenas na app
3. **Immutable audit logs**: toda retrieval event (success/denied) — who, what, metadata, access decision, timing
4. Embed governance inside retrieval layer — evita policy divergence across services

### 4.4 Accuracy — Feedback Loops
1. **Instrument metrics**: precision, recall, MRR, NDCG, hit rates contra ground truth
2. **System-level monitoring**: detect quando relevance degrada, query patterns underperform, domain drift
3. **Feedback loops**: capturar user corrections/relevance judgments → reranker modules
4. **Model disagreement signals**: quando generative model declines context, revises answer, low confidence → feed back as supervision
5. Proactive adaptation baseado em metrics + feedback, nao reactive patching
