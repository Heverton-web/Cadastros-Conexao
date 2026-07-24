---
name: genai-design-patterns
description: >- Padroes de design para aplicacoes GenAI em producao — controle de estilo, RAG, raciocinio e confiabilidade
---

# Generative AI Design Patterns — Passos Operacionais

## 1. Controle de Estilo e Formato (Chapter 2)

### 1.1 Pattern 1: Logits Masking
1. Identificar saidas invalidas p/ regras de negocio (ex: JSON mal formatado, valores proibidos)
2. Interceptar amostragem do modelo apos logits processados
3. Zerar probabilidades de tokens/sequencias invalidas
4. Se sequencia completa invalida → backtrack e regenerar
5. Alternativa: try-and-try-again (repetir ate saida valida) — so aceitavel se baixo custo

### 1.2 Pattern 2: Grammar (Gramatica Formal)
1. Criar gramatica formal (BNF, regex, JSON Schema) que define saida valida
2. Opcao A: Usar logits processor que aplica gramatica — so tokens gramaticamente validos sao permitidos
3. Opcao B: Usar formato padrao (JSON mode, tool use nativo do provider)
4. Opcao C: Especificar schema pelo usuario (structured outputs)
5. Aplicar em extracao de dados, geracao de codigo, saidas tabulares

### 1.3 Pattern 3: Style Transfer
1. Coletar pares input-output de exemplo no estilo desejado
2. Opcao A: Few-shot learning — incluir exemplos no prompt
3. Opcao B: Fine-tuning — treinar modelo no dataset de estilo
4. Aplicar em: formatacao juridica, tom de marca, templates de email

### 1.4 Pattern 4: Reverse Neutralization
1. Identificar bias ou tom indesejado no output do modelo
2. Criar prompt que neutraliza o bias (ex: "responda sem tomar partido politico")
3. Ou treinar modelo para gerar versao neutra e depois aplicar estilo desejado
4. Usar em: geracao de texto juridico imparcial, conteudo para audiencias diversas

### 1.5 Pattern 5: Content Optimization
1. Definir metrica de otimizacao (click-through, engajamento, legibilidade)
2. Usar modelo para gerar multiplas variantes de conteudo
3. Avaliar variantes contra metrica (A/B test, predicao de performance)
4. Selecionar variante otima
5. Aplicar em: linhas de assunto, headlines, CTAs

## 2. Adicionar Conhecimento — RAG Basico (Chapter 3)

### 2.1 Pattern 6: Basic RAG
1. Receber query do usuario
2. Embedding da query → buscar documentos similares no vector store
3. Concatenar documentos recuperados + query original como contexto
4. Enviar p/ LLM gerar resposta aumentada
5. Decidir: top-k, chunk size, overlap
6. IMPORTANTE: RAG da peixes (dados); CoT ensina a pescar (logica)

### 2.2 Pattern 7: Semantic Indexing
1. Indexar documentos com embeddings semanticos (nao apenas TF-IDF)
2. Para cada documento: chunking → embedding → armazenar em vector DB
3. Na query: embedding query → ANN search (similaridade de cosseno)
4. Retornar chunks mais relevantes p/ contexto
5. Ajustar: chunk size (256-1024 tokens), overlap (10-20%)

### 2.3 Pattern 8: Indexing at Scale
1. Para milhões de documentos: usar indice invertido + ANN hibrido
2. Particionar indices por tenant/dominio (sharding)
3. Usar compression de embeddings (PQ, SCANN) p/ reduzir memoria
4. Cache de queries frequentes
5. Balancear entre recall e latencia

## 3. Adicionar Conhecimento — RAG Avancado (Chapter 4)

### 3.1 Pattern 9: Index-Aware Retrieval
1. Ao recuperar chunks, incluir metadados do documento fonte (titulo, secao, posicao)
2. Preservar hierarquia do documento original na resposta
3. Usar HyDE (Hypothetical Document Embeddings): gerar documento hipotetico primeiro, depois buscar por similaridade

### 3.2 Pattern 10: Node Postprocessing
1. Apos recuperar chunks, aplicar pos-processamento:
   - Remover duplicatas
   - Reordenar por relevancia
   - Filtrar por limite de tokens
2. Garantir que contexto final nao exceda context window do modelo
3. Aplicar em sumarizacao multi-documento

### 3.3 Pattern 11: Trustworthy Generation
1. Para cada afirmacao no output, citar documento fonte especifico
2. Usar chain-of-verification: modelo verifica proprias afirmacoes
3. Incluir marcadores de confianca (ex: "com base na secao 3.2 do documento X")
4. Reduzir alucinacao forçando ancoragem em fontes

### 3.4 Pattern 12: Deep Search
1. Query → multiplas sub-queries (exploracao em largura)
2. Cada sub-query busca fontes diferentes
3. Sintetizar respostas parciais em resposta final coerente
4. Diferente de Deep Research: foco em profundidade dentro de corpus fechado

## 4. Estender Capacidades do Modelo (Chapter 5)

### 4.1 Pattern 13: Chain of Thought (CoT)
1. Variante Zero-shot: adicionar "Think step-by-step" ao prompt
2. Variante Few-shot: fornecer exemplos de raciocinio passo-a-passo
3. Variante Auto-CoT: modelo gera proprias cadeias de raciocinio
4. Aplicar em: matematica, logica, raciocinio sequencial, problemas multi-passo
5. CoT adiciona dados (RAG) vs demonstra logica (CoT)

### 4.2 Pattern 14: Tree of Thoughts (ToT)
1. Gerar multiplos caminhos de raciocinio (arvore)
2. Avaliar cada caminho intermediario (viabilidade, coerencia)
3. Podar caminhos fracos, expandir caminhos promissores
4. Selecionar melhor caminho completo
5. Usar em: problemas de planejamento, otimizacao, buscas complexas

### 4.3 Pattern 15: Adapter Tuning (LoRA)
1. Identificar matrizes alvo (Q, V normalmente) no transformer
2. Configurar LoRA: rank r (8-64), alpha (16-32), dropout (0.05)
3. Adicionar matrizes A (low-rank) e B — apenas essas sao treinadas
4. Multiplicar AB e somar a matriz original com fator alpha
5. Exemplo: Llama 2 7B com LoRA (r=8, alpha=16) treina apenas 0.062% dos parametros

### 4.4 Pattern 16: Evol-Instruct
1. Gerar instrucoes simples → evoluir p/ complexas (deepening)
2. Variar instrucoes (broadening) p/ cobrir mais cenarios
3. Usar modelo mestre p/ gerar pares instrucao-resposta de alta qualidade
4. Fine-tuning com dataset evoluido melhora adesao a instrucoes complexas

## 5. Melhorar Confiabilidade (Chapter 6)

### 5.1 Pattern 17: LLM-as-Judge
1. Usar um modelo separado (judge) p/ avaliar output do modelo principal
2. Definir criterios: acuracia, relevancia, tom, formato
3. Judge retorna score + justificativa
4. Se score abaixo do limiar → regenerar ou sinalizar p/ revisao humana
5. Cuidado: judge sofre dos mesmos biases — usar rubrica estruturada

### 5.2 Pattern 18: Reflection
1. Modelo gera resposta inicial
2. Modelo reflete sobre propria resposta (auto-critica)
3. Identificar erros, inconsistencias, pontos fracos
4. Regenerar resposta incorporando correcoes da reflexao
5. Iterar ate criterio de qualidade ou max iterations

### 5.3 Pattern 19: Dependency Injection
1. Definir interfaces abstratas p/ servicos externos (DB, APIs, vector stores)
2. Injetar implementacoes concretas via configuracao
3. Facilitar testes: mock implementations em testes unitarios
4. Trocar implementacoes sem modificar logica do negocio

### 5.4 Pattern 20: Prompt Optimization
1. Definir prompt inicial e conjunto de testes (inputs + outputs esperados)
2. Usar LLM-as-judge p/ avaliar outputs do prompt
3. Otimizacao: ajustar wording, adicionar exemplos, modificar estrutura
4. Iterar ate performance aceitavel
5. Versionar prompts como codigo

## 6. Agentes e Acoes (Chapter 7)

### 6.1 Pattern 21: Tool Calling
1. Definir schema de ferramentas (nome, descricao, parametros JSON)
2. Modelo decide qual ferramenta chamar baseado na query
3. Executar ferramenta, retornar resultado p/ modelo
4. Modelo incorpora resultado na resposta final
5. Ferramentas: calculadoras, APIs, DB queries, search

### 6.2 Pattern 22: Code Execution
1. Modelo gera codigo (Python, SQL, bash) como acao
2. Executar codigo em sandbox isolado (seguranca)
3. Capturar stdout/stderr/erros
4. Retornar resultado da execucao p/ modelo
5. Usar em: analise de dados, automacao, geracao de relatorios

### 6.3 Pattern 23: Multiagent Collaboration
1. Definir agentes especializados (pesquisador, escritor, revisor, etc.)
2. Agentes comunicam via mensagens estruturadas
3. Orquestrador coordena fluxo e delegacao
4. Cada agente tem ferramentas e contexto proprio
5. Aplicar em: workflows complexos que exigem multiplas perspectivas

## 7. Restricoes de Deploy (Chapter 8)

### 7.1 Pattern 24: Small Language Model (SLM)
1. Identificar tarefas que nao requerem raciocinio profundo
2. Substituir LLM grande por SLM (1-3B parametros)
3. SLM: menor latencia, menor custo, pode rodar on-device
4. Ex: classificacao, extracao simples, formatacao

### 7.2 Pattern 25: Prompt Caching
1. Cachear resultados de prompts identicos ou similares
2. TTL baseado na frequencia de mudanca dos dados
3. Cache por chave = hash do prompt + contexto
4. Reduzir latencia e custo de inferencia

### 7.3 Pattern 26: Inference Optimization
1. Quantizacao (FP16→INT8, INT4) reduz memoria e acelera
2. Speculative decoding: modelo pequeno gera rascunho, modelo grande valida
3. Batching: agrupar requests p/ melhor utilizacao GPU
4. Distilacao: treinar modelo menor para imitar maior

### 7.4 Pattern 27: Degradation Testing
1. Testar modelo sob condicoes adversas: alta latencia, baixa memoria, concorrencia
2. Monitorar: acuracia, latencia P50/P95/P99, taxa de erro
3. Estabelecer SLOs e alertas
4. Degradation graceful: fallback p/ modelo menor ou resposta padrao

### 7.5 Pattern 28: Long-Term Memory
1. Agente precisa lembrar entre sessoes → armazenar em DB externo
2. Extrair fatos chave de cada interacao
3. Indexar fatos semanticamente p/ recuperacao futura
4. Resumir historico longo p/ caber no contexto
5. Ex: preferencias do usuario, progresso em tarefas, decisoes passadas

## 8. Seguranca e Garantias (Chapter 9)

### 8.1 Pattern 29: Template Generation
1. Definir template de prompt com slots preenchiveis
2. Valores dos slots passam por sanitizacao (escaping, validacao)
3. Garantir que modelo nao pode modificar estrutura do template
4. Reduzir prompt injection e jailbreaking

### 8.2 Pattern 30: Assembled Reformat
1. Restringir formato de saida a opcoes pre-definidas (menus, listas fixas)
2. Processar saida do modelo → extrair apenas opcao valida
3. Mapear opcao para acao correspondente
4. Usar em: sistemas de menu, comandos limitados

### 8.3 Pattern 31: Self-Check
1. Modelo verifica proprios outputs contra regras definidas
2. Regras: sem PII, sem linguagem toxica, sem factos nao verificaveis
3. Se violacao → suprimir ou sinalizar p/ revisao
4. Camada adicional apos LLM-as-Judge

### 8.4 Pattern 32: Guardrails
1. Implementar multiplas camadas: pre-filter, post-filter, content moderation
2. Pre-filter: bloquear prompts maliciosos (injection, topicos proibidos)
3. Post-filter: verificar output contra politicas de conteudo
4. Usar modelos especializados em moderacao (ex: Llama Guard)
5. Logging de violacoes p/ auditoria

## 9. Workflows Composaveis (Chapter 10)

### 9.1 Arquitetura de Sistema
1. Combinar patterns dos capitulos anteriores em pipeline
2. Ex: RAG → CoT → Tool Calling → LLM-as-Judge → Guardrails
3. Cada etapa e um componente independente e testavel
4. Orquestrador gerencia fluxo e fallbacks

### 9.2 Deploy e Operacao
1. Containerizar cada componente separadamente
2. Health checks e readiness probes p/ cada servico
3. Rate limiting, authN/authZ nas bordas
4. Monitorar: latencia ponta-a-ponta, custo por request, taxa de sucesso
5. CI/CD com testes de regressao dos patterns

### 9.3 Iteracao e Melhoria Continua
1. Logar todas as interacoes (prompts, outputs, scores)
2. Analisar falhas: onde o pipeline quebrou ou produziu baixa qualidade
3. Ajustar patterns individualmente (ex: trocar modelo, mudar chunk size)
4. Re-treinar ou ajustar prompts baseado em dados reais
5. Versionar configuracoes do pipeline como codigo
