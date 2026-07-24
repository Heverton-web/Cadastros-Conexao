---
name: vibe-engineering
description: Disciplina de engenharia p/ AI-assisted development — context engineering, migração, validação científica, performance
---

# Vibe Engineering — Passos Operacionais

## 1. Framework de Modernização com LLMs (Chapter 2)

### 1.1 Pre-análise do Aplicativo
1. Extrair conhecimento sem mergulhar no código: usar LLM p/ resumir estrutura, dependências, propósito
2. Evitar hábito de ler codebase manualmente primeiro
3. 2 abordagens p/ repositório:
   - **In-place**: modificar repo existente num branch separado
   - **New repo**: copiar p/ repo novo (mais seguro, preserva original)
4. Estratégia híbrida: branch no repo original + pull request no final

### 1.2 Setup de Testes Antes da Migração
1. Garantir cobertura de testes (unit, integration, smoke) antes de qualquer modificação
2. Usar LLM p/ gerar testes se não existirem:
   - Prompt: "Generate unit tests for the following {method/class} covering edge cases, null inputs, and boundary conditions"
3. Verificar que todos os testes passam antes de iniciar migração
4. Commit dos testes como baseline

### 1.3 Migração da Camada de Produção
1. **NÃO** migrar tudo em um único prompt — tentador mas arriscado
2. Dividir migração em etapas pequenas e verificáveis
3. Cada etapa = um commit separado no branch `migration`
4. Usar LLM p/ migrar uma classe/arquivo por vez:
   - Prompt: "Migrate this {Java} class to {Spring Boot} preserving all business logic. Keep the same method signatures and database schema"
5. Executar testes após cada etapa

### 1.4 Migração de UI
1. Gerar testes de UI antes (Playwright, Selenium) p/ capturar comportamento
2. Usar LLM p/ converter templates (ex: JSF → React):
   - Context: componente original + screenshot se possível
   - Prompt: "Convert this JSF form to a React component using hooks and TypeScript"
3. Validar visualmente + testes de UI

### 1.5 Cleanup Stages
1. **Stage 1**: alto nível — remover imports/dependências mortas, corrigir paths
2. **Stage 2**: granular — verificar ocorrências residuais do framework antigo
3. Usar `grep`/`rg` p/ encontrar padrões residuais, passar p/ LLM: "Remove all remaining {legacy} imports and replace with {new} equivalents"

### 1.6 Documentação
1. Gerar docs com LLM após migração estável:
   - Prompt: "Generate architecture documentation including class diagram, dependency graph, and migration decisions for this codebase"
2. Incluir: rationale das decisões de migração, trade-offs, configurações de ambiente

### 1.7 Migração de Persistência
1. Mapear schema antigo → novo (ex: Hibernate → Spring Data JPA)
2. Gerar DDL migrations (Flyway/Liquibase) com LLM
3. Prompt: "Convert this Hibernate entity to Spring Data JPA. Also generate Flyway migration scripts"
4. Testar com dataset de produção ofuscado

### 1.8 Finalização
1. Revisar cada commit do branch `migration`
2. Abrir pull request único p/ merge
3. Incluir changelog com mudanças por camada

## 2. Context Engineering (Chapter 3)

### 2.1 Identificar Context Vacuum
1. **Sintoma**: LLM sugere imports/classes que não existem ou nomes errados
2. **Causa**: passar snippet isolado sem contexto do projeto
3. **Fix**: incluir imports, definições de tipos, estrutura de diretórios no prompt

### 2.2 Construir Contexto Estratégico
1. **Multi-shot**: fornecer definições de tipos, interfaces, exemplos de uso no prompt
2. **Contexto mínimo**: só o necessário p/ tarefa, sem ruído
3. **Estrutura explícita**: marcar seções no prompt com `## FILE`, `## SPEC`, `## OUTPUT`
4. **Labeling**: rotular variáveis, parâmetros com descrições semânticas

### 2.3 Estratégias de Contexto
1. **Tarefa única**: incluir definições de tipos, função alvo, exemplos de input/output
2. **Refatoração multi-arquivo**: incluir estrutura do projeto + interfaces afetadas + testes existentes
3. **Feature cross-cutting**: incluir contratos de API, schemas, fluxo completo
4. **Bug fix**: incluir stack trace, código relevante, expectativa vs realidade

### 2.4 Evitar Context Rot
1. Contexto grande demais degrada performance do modelo (primacy/recency bias)
2. Técnicas:
   - Ordenar info mais relevante no início e fim do prompt
   - Usar resumos de seções menos críticas
   - Retirar contexto não utilizado em iterações anteriores
3. Sinal denso: cada token no prompt deve carregar significado p/ tarefa

### 2.5 Usar AI Coding Tools p/ Gerenciar Contexto
1. **JetBrains AI Assistant, GitHub Copilot Workspace, Cursor, Cline**: ferramentas que gerenciam contexto automaticamente
2. **Agent mode**: delegar busca de contexto p/ ferramenta
3. **Rules files** (`.cursorrules`, `CLAUDE.md`): definir preferências de contexto, arquivos a incluir por padrão
4. **Spec-driven**: criar arquivo de especificação que o tool lê automaticamente

### 2.6 Context Through Reasoning
1. Para features complexas, construir entendimento em múltiplos ciclos:
   - **Cycle 1**: explorar codebase, identificar componentes afetados
   - **Cycle 2**: planejar implementação com base no contexto coletado
   - **Cycle 3**: implementar com contexto refinado
2. Usar LLM p/ ajudar a planejar antes de codar:
   - Prompt: "Analyze this codebase structure and create a plan to implement {feature}. List files to modify and changes needed"

## 3. Validação Científica de Soluções LLM (Chapter 6)

### 3.1 Setup do Serviço Text-to-SQL
1. Criar serviço Spring Boot (ou equivalente) com endpoint REST
2. Encapsular LLM provider atrás de interface (facilita troca de provider sem mudar código de negócio)
3. Schema da API:
   - Input: natural language query
   - Output: generated SQL + execution results

### 3.2 Integração com API OpenAI
1. Escolher LLM provider (OpenAI, Anthropic, Google)
2. Configurar via variáveis de ambiente
3. Criar camada de abstração: `interface LLMProvider { generate(prompt): string }`
4. Implementar provider concreto (ex: `OpenAILLMProvider`)
5. Testar com queries conhecidas

### 3.3 Framework de Verificação de Acurácia
1. **Dataset**: coleção de pares (query natural → SQL esperado)
2. **Métricas**:
   - Execution accuracy: SQL gerado roda e retorna resultado correto?
   - Exact match: SQL gerado == SQL esperado (ignorando aliases, whitespace)
   - Component match: matching de SELECT, FROM, WHERE, JOIN
3. **Pipeline de teste**:
   ```python
   for query, expected_sql in test_dataset:
       generated_sql = llm.generate(query)
       score = evaluate(generated_sql, expected_sql)
   ```
4. **A/B testing** de diferentes prompts/approaches sobre o mesmo dataset

### 3.4 Trade-offs com Tamanho do Contexto
1. Testar hipóteses de melhoria:
   - Mais exemplos few-shot melhora acurácia? Até quanto?
   - Incluir schema do banco melhora? Em qual formato?
   - Adicionar dicas de SQL (ex: "use JOIN, não subquery")?
2. Medir: acurácia vs quantidade de tokens de input
3. Plotar curva: tokens vs accuracy — achar ponto de retorno decrescente

### 3.5 Estratégia de Teste
1. Separar dataset em: validation (20%), test (20%), train (60%)
2. Rodar múltiplas iterações (cada prompt/config varia)
3. Comparar resultados com baseline (zero-shot sem contexto extra)
4. Documentar: qual configuração funciona melhor p/ cada tipo de query

## 4. Vibe Performance Engineering (Chapter 7)

### 4.1 Evitar Otimização Prematura por LLM
1. **Sintoma**: LLM sugere otimizações complexas (caching, parallel, async) sem evidência de bottleneck
2. **Causa**: LLM "fantasia" cenários de alta carga
3. **Fix**: fornecer SLAs e métricas de tráfego reais no prompt:
   - "Expected traffic: 100 req/s peak, 10 req/s avg. Data size: 10K records"
4. **Nunca** aceitar otimização sem medir baseline primeiro

### 4.2 Hot-Path Performance Engineering
1. Identificar hot paths: endpoints mais chamados, loops pesados, queries frequentes
2. Para cada hot path:
   - Medir baseline com dados reais (não sintéticos)
   - Documentar: p50, p95, p99 latency, throughput, resource usage
3. Prompt p/ LLM: "Optimize this hot path. Current metrics: p50={x}ms. Expected: p50 < {y}ms. Constraints: {memory, cpu, budget}"

### 4.3 Medição de Código com MetricRegistry
1. Setup com `MetricRegistry` (Dropwizard/ Micrometer):
   ```java
   MetricRegistry metrics = new MetricRegistry();
   Timer timer = metrics.timer("method.execution");
   Timer.Context ctx = timer.time();
   // código a medir
   ctx.stop();
   ```
2. Expor métricas via endpoint `/metrics` (JSON ou Prometheus format)
3. Coletar métricas em produção por período representativo (mínimo 1 semana)
4. Antes de qualquer otimização: registrar baseline

### 4.4 Melhorias de Hot-Path com LLM
1. Assumir que dados de configuração/input são estáticos (ex: arquivo de palavras não muda)
2. Prompt com contexto completo:
   - Código do hot path
   - Métricas atuais e target
   - Características dos dados (tamanho, distribuição, frequência de mudança)
3. Validar cada otimização:
   - Medir antes/depois com mesma carga de teste
   - Rollback se não atingir target
4. Ferramentas: LLM pode sugerir, humano decide

### 4.5 Diferenças entre Human e LLM Performance Engineering
1. **Human**: experiência intuitiva sabe onde otimizar, mas pode ser lento
2. **LLM**: rápido em gerar código otimizado, mas faz suposições falsas
3. **Best practice**: LLM otimiza, humano revisa assumptions, métricas validam
4. Fornecer contexto suficiente evita otimizações desnecessárias
