---
name: building-apps-ai-agents
description: Passos operacionais para projetar, implementar, orquestrar e monitorar sistemas de agentes de IA — do agente único ao multiagente.
---

# Building Applications with AI Agents — Passos Operacionais

Skill baseada no livro "Building Applications with AI Agents" de Michael Albada (O'Reilly, 2025). Contém passos práticos para design, ferramentas, orquestração, memória, multiagente, validação, monitoramento e melhoria contínua.

Use quando: projetar sistemas de agentes, implementar ferramentas MCP/API, configurar orquestração, estruturar memória RAG/GraphRAG, decidir entre single vs multiagente, validar/avaliar agentes, monitorar produção, ou implementar ciclos de feedback.

---

## 1. PROJETANDO SISTEMAS DE AGENTES (Cap. 2)

### 1.1 Escopo Inicial
1. **Defina uma fatia concreta**: comece com um fluxo de trabalho delimitado (ex.: cancelamento de pedido) em vez de "automatizar todo o suporte".
2. **Entradas e saídas claras**: especifique entradas concretas (mensagem do cliente + registro do pedido) e saídas estruturadas (chamadas de ferramenta + confirmação).
3. **Ciclo de feedback rápido**: escolha um caso de uso onde seja fácil medir sucesso (ferramenta correta foi chamada? parâmetros certos? mensagem clara?).

### 1.2 Seleção de Modelo
1. **Avalie a complexidade da tarefa**: modelos grandes (GPT-5, Claude Opus, Gemini 2.5 Pro) para raciocínio multi-etapas; modelos menores (Phi-4, ModernBERT, Llama 3.1 8B) para tarefas repetitivas.
2. **Considere modalidade**: texto-only vs multimodal (imagens, áudio) — modelos multimodais para saúde/suporte; texto-only para menor latência.
3. **Pondere custo × latência**: use roteamento dinâmico — modelo grande para queries complexas, modelo leve para tarefas rotineiras.
4. **Verifique recursos de hardware**: modelos open-weight (~14B params rodam em RTX 3090; acima disso precisa A100+).

### 1.3 Três Categorias de Ferramentas (Cap. 2/4)
1. **Ferramentas locais**: lógica interna, cálculos, regras — precisas e previsíveis, mas exigem manutenção.
2. **Ferramentas baseadas em API**: interagem com serviços externos (clima, ações, busca) — expandem alcance mas dependem de disponibilidade.
3. **Ferramentas MCP (Model Context Protocol)**: padrão aberto (Anthropic, OpenAI, Google, MS) — interface "USB-C para IA" via JSON-RPC. Servidores MCP expõem métodos; clientes MCP descobrem e invocam.

### 1.4 Trade-offs de Design
1. **Velocidade × Precisão**: sistemas em tempo real priorizam velocidade; diagnósticos/legal priorizam precisão. Abordagem híbrida: resposta rápida inicial + refinamento posterior.
2. **Escalabilidade**: alocação dinâmica de GPU, provisionamento elástico, execução assíncrona, balanceamento de carga entre GPUs.
3. **Confiabilidade**: tolerância a falhas (detectar e recuperar), testes extensivos (unitários, integração, simulação), monitoramento contínuo.
4. **Custos**: modelos lean, recursos cloud, código aberto. Modelos menores para tarefas menos críticas.

### 1.5 Melhores Práticas
1. **Design iterativo**: construa incrementalmente — protótipo pequeno e funcional → avalie → refine. Identifica falhas cedo.
2. **Estratégia de avaliação**: agente não testado é agente não confiável. Avalie recall de ferramentas, precisão de parâmetros, qualidade da mensagem.
3. **Testes no mundo real**: use cenários reais, casos extremos, entradas inesperadas.

---

## 2. USO DE FERRAMENTAS (Cap. 4)

### 2.1 LangChain Fundamentals
1. Inicialize modelo: `llm = ChatOpenAI(model_name="gpt-4o")`.
2. Defina ferramenta com `@tool`: nome + descrição + esquema de entrada/saída.
3. Vincule: `llm_with_tools = llm.bind_tools([tool1, tool2])`.
4. Invoque e processe: itere `ai_msg.tool_calls`, execute ferramenta, anexe `ToolMessage` ao histórico.

### 2.2 Ferramentas Locais
1. Escolha nomes precisos e de escopo restrito.
2. Escreva descrições claras e distintas (evite sobreposição).
3. Defina esquemas de entrada/saída rigorosos (tipos, ranges, validação).
4. Use para áreas frágeis de LLMs: matemática, datas, calendário, mapas.

### 2.3 Ferramentas Baseadas em API
1. Interaja com serviços externos via HTTP/API wrapper.
2. Trate erros robustamente: fallbacks para indisponibilidade.
3. Proteja com HTTPS + autenticação forte.
4. Respeite rate limits e leis de privacidade.

### 2.4 MCP (Model Context Protocol)
1. Configure servidor MCP expondo métodos via JSON-RPC 2.0 sobre HTTPS/WebSocket.
2. Cliente MCP descobre catálogo de métodos e seus esquemas.
3. Invoque métodos remotos sem adaptadores personalizados.
4. Atenção: segurança (autenticação, RBAC, prevenção de injeção) ainda é área ativa.

### 2.5 Desenvolvimento Automatizado de Ferramentas
1. Use modelos de fundação como fabricantes de ferramentas (geração de código em tempo real).
2. Aprendizado por imitação: observe interações humanas e proponha novas ferramentas.
3. Valide ferramentas geradas antes de integrar ao agente.

---

## 3. ORQUESTRAÇÃO (Cap. 5)

### 3.1 Tipos de Agentes
1. **Agente Reflexo**: mapeamento direto entrada→ação. Latência mínima. Use para roteamento por palavra-chave, automações simples.
2. **Agente ReAct**: intercala raciocínio e ação em ciclo. Flexível e adaptável. Use para análise dinâmica, agregação multi-fonte.
3. **Agente Planejador-Executor**: separa planejamento (gerar plano multi-etapas) da execução (invocar ferramentas). Plano explícito facilita debug.
4. **Agente de Decomposição de Consultas**: divide pergunta complexa em subquestões, busca cada uma, sintetiza resposta final. Ideal para pesquisa factual.
5. **Agente de Reflexão**: revisa etapas anteriores para identificar erros antes de prosseguir. Use para tarefas de alto risco (transações financeiras, diagnósticos).
6. **Agente de Pesquisa Profunda**: combina planejamento + decomposição + ReAct + reflexão. Para revisões de literatura, inteligência competitiva.

### 3.2 Seleção de Ferramentas
1. **Padrão**: descrições das ferramentas no prompt do modelo. Simples, mas escala mal para muitas ferramentas.
2. **Semântica**: indexa ferramentas em banco vetorial via embeddings; recupera top-K no runtime. Rápido e escalável.
   - Incorpore descrições de ferramentas com modelo de embedding (Ada, ModernBERT).
   - Armazene em FAISS ou similar.
   - Em runtime, incorpore a query, busque no índice, selecione tool + parâmetros via LLM.
3. **Hierárquica**: organize tools em grupos → selecione grupo → selecione tool dentro do grupo. Maior latência, melhor precisão para muitos tools.

### 3.3 Topologias de Execução
1. **Ferramenta Única**: planeje → selecione → parametrize → execute → componha resposta.
2. **Paralela**: recupere top-K tools, filtre com LLM, execute independentemente, consolide resultados.
3. **Cadeia (Chain)**: ações sequenciais com dependências. Use LCEL (LangChain Expression Language) para sintaxe declarativa: `chain = prompt | llm | parser`. Defina comprimento máximo para evitar acúmulo de erros.
4. **Grafo** (LangGraph): nós (invocações discretas) + arestas condicionais + arestas de consolidação.
   - Esboce topologia no papel: nós, setas, ramificações, merge points.
   - Implemente incrementalmente com `StateGraph`.
   - Use `add_conditional_edges` para roteamento dinâmico.
   - Consolide múltiplos ramos em um nó de sumarização.
   - Limite profundidade e fator de ramificação.

### 3.4 Engenharia de Contexto
1. Inclua no contexto: mensagem do usuário, trechos recuperados da memória, resumos de conversas anteriores, instruções do sistema, estado do workflow.
2. Priorize relevância — recupere apenas o mais útil, não grandes blocos.
3. Use formatação estruturada (MCP, JSON) para passar estado.
4. Sumarize históricos longos em representações concisas.
5. Monte contexto dinamicamente a cada etapa de inferência.

---

## 4. CONHECIMENTO E MEMÓRIA (Cap. 6)

### 4.1 Janela de Contexto (Memória de Curto Prazo)
1. **Janela deslizante (FIFO)**: mantenha interações recentes; descarte as mais antigas quando encher. Simples, mas perde informação independente de relevância.
2. **Implementação LangGraph**: use `MessagesState` com acumulador de mensagens.

### 4.2 Busca Tradicional (Texto Completo)
1. Construa índice invertido com tokenização, normalização, stop-word removal.
2. Use BM25 para pontuação de relevância (frequência do termo × raridade).
3. Recupere top-K passagens e insira no prompt do modelo.
4. Excelente para correspondência exata e termos específicos.

### 4.3 Memória Semântica com Armazenamento Vetorial
1. Gere embeddings de documentos usando modelo de encoding (Ada, ModernBERT, etc.).
2. Armazene vetores em banco vetorial (FAISS, VectorDB, Annoy, Chroma).
3. Em runtime: incorpore a consulta → busque por similaridade no vetor store → recupere top-N.
4. Combine com janela de contexto: reserve parte para resultados da busca semântica, parte para interações recentes.

### 4.4 RAG (Retrieval-Augmented Generation)
1. **Indexação**: split documentos em chunks → gere embeddings → indexe em vetor store.
2. **Runtime**: query → retrieve chunks relevantes → combine com prompt → LLM gera resposta.
3. Use para incorporar conhecimento externo (políticas, documentação técnica).
4. Para janelas de contexto muito longas (Gemini 2.5, GPT-4.1 1M tokens), RAG ainda supera abordagens sem recuperação em fatos precisos.

### 4.5 GraphRAG (RAG com Grafos de Conhecimento)
1. **Coleta de dados**: múltiplas fontes (bases, docs, web).
2. **Pré-processamento**: limpeza, padronização, remoção de ruído.
3. **NER**: extraia entidades (pessoas, lugares, organizações, conceitos).
4. **Extração de relacionamentos**: determine predicados entre entidades (ex.: "é_um", "trabalha_para").
5. **Ontologia**: defina esquema de tipos de entidades e tipos de relacionamento.
6. **População**: crie nós e arestas no banco de grafo (Neo4j, Amazon Neptune).
7. **Integração e validação**: resolva duplicatas, verifique acurácia.
8. **Manutenção**: atualizações regulares com novos dados.
9. Use CLI GraphRAG (`pip install graphrag`) para prototipagem rápida.
10. Para produção: Neo4j + `neo4j-graphrag-python`.

### 4.6 Note-Taking
1. Instrua o modelo a gerar notas sobre o contexto antes de responder.
2. Intercale notas com o contexto original.
3. A técnica melhora raciocínio em tarefas complexas sem alterar a arquitetura.

---

## 5. DE UM AGENTE PARA MUITOS (Cap. 8)

### 5.1 Quando Usar Agente Único vs Multiagente
1. **Comece com agente único** se: tarefa de complexidade modesta, poucas ferramentas (<10-15), latência crítica.
2. **Migre para multiagente** quando: conjunto de ferramentas cresce e degrada a seleção, tarefas exigem especialização, ou paralelismo é necessário.
3. **Limiar prático**: ~16 ferramentas em um prompt é o ponto onde a degradação começa.
4. Antes de migrar, tente: seleção hierárquica ou semântica de ferramentas (Cap. 5).

### 5.2 Padrões de Coordenação
1. **Coordenação Democrática**: agentes colaboram sem hierarquia — flexível mas overhead de consenso.
2. **Coordenação Gerente (Supervisor)**: um agente supervisor encaminha para especialistas. Mais controlado e previsível.
   - Supervisor analisa query → seleciona especialista → especialista processa → resposta consolidada.
3. **Coordenação Hierárquica**: múltiplos níveis de gerência. Para sistemas muito complexos.
4. **Abordagens Ator-Crítico**: agentes geram propostas (atores) e avaliam (críticos) iterativamente.

### 5.3 Técnicas de Comunicação Multiagente
1. **Agente-a-Agente (A2A)**: comunicação direta entre agentes. Simples, mas acopla.
2. **Message Brokers / Event Bus**: desacopla remetentes e destinatários via filas (Kafka, RabbitMQ). Escalável e resiliente.
3. **Actor Frameworks** (Ray, Orleans, Akka): atores leves com passagem de mensagens assíncrona. Suportam balanceamento de carga adaptativo e alta concorrência.

### 5.4 Implementação Prática (LangGraph)
1. Defina `AgentState` com `TypedDict` (operação + mensagens).
2. Crie nós de supervisor e especialistas.
3. Cada especialista recebe apenas suas ferramentas e um prompt customizado.
4. Use `add_conditional_edges` no supervisor para rotear ao especialista correto.
5. Garanta ferramentas compartilhadas (ex.: `send_logistics_response`) para respostas uniformes.
6. Arestas paralelas habilitam processamento concorrente.

---

## 6. VALIDAÇÃO E MEDIÇÃO (Cap. 9)

### 6.1 Métricas Fundamentais
1. **Recolhimento de Ferramentas**: o planejador invocou todas as ferramentas esperadas?
2. **Precisão de Ferramentas**: o planejador evitou ferramentas desnecessárias?
3. **Precisão de Parâmetros**: para cada ferramenta, os argumentos estão corretos?
4. **Qualidade da Mensagem**: a confirmação contém a linguagem apropriada?
5. **Métricas Semânticas**: BERTScore, BLEU, ROUGE, distância baseada em embeddings (para quando respostas corretas têm redações diferentes).

### 6.2 Conjuntos de Avaliação
1. Crie exemplos estruturados: estado de entrada + histórico de conversa + resultado esperado (ferramentas, parâmetros, frases).
2. Inclua cenários: caminho feliz, casos extremos, ambiguidades, adversariais.
3. Escale com: extração de logs de produção, geração via LLM (com revisão humana), aumento adversarial.
4. Use formatos de teste que capturem metadados para análise posterior (tipo de falha, cobertura).
5. Trate o conjunto de avaliação como especificação viva — expanda continuamente.

### 6.3 Avaliação de Componentes
1. **Ferramentas**: testes unitários para cada ferramenta (caminho feliz, entradas malformadas, latência, consumo de recursos).
2. **Planejamento**: fluxos de trabalho canônicos + resultados esperados. Métricas: recall/precisão de ferramentas, precisão de parâmetros.
3. **Memória**: testes com recuperações "fáceis" e "difíceis"; cenários de contexto longo.
4. **Aprendizagem**: verificar se o agente melhora com exemplos (in-context learning).
5. Use mocks para dependências externas (APIs, bancos).

### 6.4 Avaliação Holística (End-to-End)
1. Execute o agente de ponta a ponta e capture invocações de ferramentas, argumentos e mensagens.
2. Compare com expectativas de ground truth.
3. Avalie consistência (simule conversas longas) e coerência.
4. Teste alucinação: verifique se todas as afirmações são fundamentadas nos dados recuperados.
5. Prepare-se para deploy: gate automatizado (ex.: 95% de precisão), rollback rápido, portões de promoção.

---

## 7. MONITORAMENTO EM PRODUÇÃO (Cap. 10)

### 7.1 Métricas-Chave por Camada
1. **Infraestrutura**: CPU/memória, tempo de atividade, latência P50/P95/P99.
2. **Fluxo de Trabalho**: taxa de sucesso de tarefas, utilização de tokens, sucesso/falha de chamadas de ferramentas, taxa de retry, frequência de fallback.
3. **Modelo**: uso de tokens (input/output), indicador de alucinação, mudanças na distribuição.
4. **Usuário**: feedback implícito (abandono, reformulação), feedback explícito (avaliações, polegar).

### 7.2 Pilha de Monitoramento Recomendada (Open Source)
1. **OpenTelemetry (OTel)**: instrumentação de spans para cada nó LangGraph (ferramenta, LLM, plano).
2. **Loki**: agregação de logs estruturados.
3. **Tempo**: rastreamento distribuído de spans.
4. **Grafana**: visualização, painéis, alertas.
5. Alternativas: ELK Stack (busca avançada), Arize Phoenix (traçado + evals LLM), SigNoz (unificado), Langfuse (observabilidade de modelo de fundação).

### 7.3 Instrumentação OTel na Prática
1. Inicialize tracer na inicialização.
2. Envolva cada nó LangGraph com `tracer.start_as_current_span("nome_do_no")`.
3. Anote spans com: nome da ferramenta, tokens de entrada/saída, status de sucesso/falha, códigos de erro.
4. Exporte spans para Tempo e logs para Loki.
5. Correlacione spans e logs via IDs de sessão/request compartilhados.
6. Balancie detalhe vs ruído: inclua contexto suficiente para análise de causa raiz.

### 7.4 Padrões de Deploy Seguro
1. **Modo Sombra**: nova versão roda em paralelo com produção, sem expor resultados. Compare métricas (seleção de ferramenta, latência, alucinação).
2. **Canário**: nova versão para 1-5% dos usuários. Compare via Grafana com tags de versão. Se ok, expanda gradualmente.
3. **Coleção de Traços de Regressão**: toda falha em produção → exporte rastro → transforme em caso de teste. Conjunto de regressão vivo.
4. **Agentes de Autocura**: leiam própria telemetria. Se ferramenta falha → redirecione ou replaneje. Se latência alta → pule etapas opcionais. Se alucinação alta → submeta a revisão humana.

### 7.5 Detecção de Mudanças na Distribuição (Drift)
1. **Teste KS** (Kolmogorov-Smirnov): compara distribuições de entradas/saídas. KS > 0.1 + p < 0.05 = drift.
2. **KL Divergência**: mede mudança em distribuições de tokens. KL > 0.5 = drift conceitual.
3. **PSI (Population Stability Index)**: para variáveis categóricas (uso de ferramentas). PSI < 0.1 = estável; 0.1-0.25 = monitorar; > 0.25 = intervir.
4. Similaridade de cosseno entre embeddings de queries atuais e históricas (média < 0.8 → revisar).

### 7.6 Governança Interfuncional (RACI)
1. **Produto** (A/R): taxa de sucesso da tarefa, feedback do usuário.
2. **ML** (R): latência de planejamento, taxas de alucinação, utilização de tokens.
3. **Infra/SRE** (R): tempo de atividade, infraestrutura, alertas.
4. Evite métricas isoladas em silos — painéis compartilhados entre todas as equipes.

---

## 8. CICLOS DE MELHORIA (Cap. 11)

### 8.1 Pipelines de Feedback Automatizados
1. **DSPy**: defina assinaturas (input/output specs) → componha módulos (CoT, ReAct) → otimizadores (BootstrapFewShot, MIPROv2) refinam prompts e exemplos com base em dados.
2. **Trace (Microsoft)**: otimização generativa de ponta a ponta usando feedback (pontuações, críticas em linguagem natural, preferências). Ideal para sistemas de caixa preta.
3. **APO (Automatic Prompt Optimization)**: loop fechado — prompt inicial → modelo alvo → avaliação → otimizador → prompt refinado.

### 8.2 Detecção Automatizada e RCA
1. **Detecção**: gatilhos baseados em regras + detecção de anomalias + clustering estatístico.
2. **RCA**:
   - Reconstrua cadeia de decisões, invocações e interações.
   - Isole o componente preciso (instrução mal interpretada, seleção de ferramenta inadequada, parâmetro errado).
   - Identifique padrões (incidente isolado vs. tendência recorrente).
   - Avalie impacto (frequência e gravidade).
3. Transforme falhas de produção em casos de teste — cada falha vira um teste de regressão.

### 8.3 Experimentação
1. **Deploy Paralelo**: execute variantes lado a lado sem expor usuários.
2. **Teste A/B**: variante experimental vs. baseline com tráfego dividido. Requer significância estatística.
3. **Bayesian Bandits**: alocação dinâmica de tráfego para variantes de melhor desempenho. Mais eficiente que A/B para muitas variantes.

### 8.4 Aprendizagem Contínua
1. **In-Context Learning**: forneça exemplos de sucesso no prompt para melhoria imediata sem retreino.
2. **Re-treinamento Offline**: colete dados de produção, filtre por qualidade, faça fine-tuning supervisionado.
3. Cuidado: overfitting, regressão em casos raros, deriva de conceito.

---

## 9. SEGURANÇA (Cap. 12)

### 9.1 Riscos Únicos
1. Desalinhamento de objetivos, raciocínio probabilístico (alucinações), adaptação dinâmica, visibilidade limitada.
2. Viés de automação humana, fadiga de alerta, decay de habilidades.

### 9.2 Vetores de Ameaça
1. **Injeção de Prompt** (direta/indireta): comandos maliciosos que anulam instruções do sistema.
2. **Vazamento de Informação**: extração de instruções do sistema ou dados sensíveis.
3. **Jailbreaking**: bypass de filtros de segurança (ex.: DAN).
4. **Engenharia Social**: manipulação do agente via contexto enganoso.
5. **Evasão**: ofuscação de entradas para burlar filtros.
6. **Ataques multiagente**: envenenamento de memória compartilhada, propagação de comportamentos maliciosos.

### 9.3 Defesas Práticas
1. **Red Teaming**: teste regular com ferramentas como Lakera Gandalf, Giskard Red, Prompt Airlines CTF.
2. **Modelagem de Ameaças MAESTRO**: framework estruturado para ameaças específicas de agentes.
3. **Controles de acesso**: RBAC, criptografia em repouso e trânsito, PII masking em logs.
4. **Proveniência e integridade de dados**: registre origem de cada informação usada pelo agente.
5. **Salvaguardas externas**: firewalls de prompt, rate limiting, approval gates para ações críticas.
6. **Salvaguardas internas**: validação de saída, consistência de plano, auto-checagem.

---

## 10. COLABORAÇÃO HUMANO-AGENTE (Cap. 13)

### 10.1 Papéis e Autonomia
1. Defina escopo do agente e limites claros de decisão.
2. Implemente o "slider de autonomia": do totalmente automático ao humano-no-loop.
3. Estabeleça caminhos de escalonamento claros (quando e como o agente solicita ajuda humana).

### 10.2 Confiança e Governança
1. **Ciclo de Vida da Confiança**: calibração inicial → verificação contínua → revisão periódica.
2. **Estruturas de Accountability**: quem é responsável por cada decisão do agente.
3. **Privacidade e Conformidade**: dados do usuário, GDPR, SOC 2.
4. **Memória Compartilhada**: garanta que humano e agente tenham visibilidade do mesmo contexto.
