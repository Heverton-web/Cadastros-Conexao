---
name: genai-software-development
description: >- Avaliacao e uso de ferramentas GenAI no ciclo de desenvolvimento — geracao de codigo, revisao, testes e documentacao
---

# Generative AI for Software Development — Passos Operacionais

## 1. Code Generation e Autocompletion

### 1.1 Categorizar Ferramentas
1. Separar em browser-based (ChatGPT, Gemini) vs IDE-based (GitHub Copilot, Cursor, Windsurf)
2. Browser-based: contexto manual (copy/paste), ideal p/ scripts pequenos
3. IDE-based: contexto automatico do codebase, essencial p/ projetos grandes

### 1.2 Avaliar Ferramentas (Metodologia de 1-10)
1. Submeter mesmo code challenge p/ cada ferramenta (ex: algoritmo 2D array)
2. Rodar exatamente 1 vez por ferramenta
3. Comparar output: 10=impecavel, 5=parcial, 1=erro
4. Verificar: qualidade do codigo, eficiencia, clareza

### 1.3 Usar Prompt Efetivo
1. Incluir contexto claro (formato entrada/saida, exemplos)
2. Especificar linguagem e framework
3. Definir restricoes (performance, seguranca, estilo)

### 1.4 Praticas de Uso Seguro
1. SEMPRE revisar codigo gerado antes de commit/push
2. Rodar suite de testes (happy path + edge cases + erros)
3. Nao aceitar cegamente ("vibe coding") — codigo IA pode ter libs desatualizadas ou alucinacoes
4. Verificar diretrizes da empresa sobre uso de IA

### 1.5 Escolher IDE-Based vs Browser-Based
1. Projetos multi-arquivo → IDE-based (contexto completo)
2. Scripts/testes rapidos → browser-based
3. Vantagem IDE: aceitar/rejeitar sugestoes inline, sem copy/paste

## 2. UI/UX Design com IA

### 2.1 Workflow Design-to-Code
1. Prompt de design em linguagem natural (ex: "app delivery com telas de login, restaurantes, pedidos, tracking")
2. Ferramenta gera design visual (Uizard, Bolt.new, Lovable)
3. Converter design p/ codigo frontend (HTML/CSS, Next.js, React)
4. Revisar e ajustar layout gerado

### 2.2 Criterios de Avaliacao
1. Qualidade do design gerado (adesao ao prompt)
2. Capacidade de conversao design→codigo
3. Flexibilidade p/ edicao manual pos-geracao
4. Escala 1-10 (1=erro, 5=nao atende requisitos, 10=impecavel)

### 2.3 Trade-offs
1. Vantagem: comprime semanas→horas, permite nao-designers criar UIs
2. Limitacao: qualidade varia, originalidade limitada, necessidade de revisao humana

## 3. Bug Detection e Code Review

### 3.1 Configurar Revisao Automatizada
1. Escolher ferramenta (Codacy, DeepCode/Snyk, CodeRabbit)
2. Conectar ao repositorio (Git-integrated) ou IDE (IDE-based)
3. Definir regras: SQL injection, XSS, memory leaks, loops ineficientes

### 3.2 Processo de Review
1. Submeter mesmo codigo com bugs conhecidos p/ comparar ferramentas
2. Avaliar precisao na deteccao, falsos positivos, sugestoes de correcao
3. Usar 1-2 ferramentas em paralelo (cobertura maior)
4. SEMPRE ter humano revisando antes de merge

### 3.3 Beneficios vs Cuidados
1. Code review 24/7, feedback instantaneo
2. Ferramentas erram — tratar como learning opportunity, nao verdade absoluta
3. Revisar e testar correcoes sugeridas antes de abrir PR

## 4. Automated Testing e QA

### 4.1 Selecionar Ferramenta de Teste IA
1. Katalon Studio: IDE-based, gera codigo Groovy de ingles natural, self-healing
2. testRigor: codeless, NLP descreve funcionalidade, IA gera/executa/reporta
3. Criterios: geracao de testes de texto simples, execucao automatica, self-healing, integracao CI/CD

### 4.2 Criar Testes com IA
1. Descrever fluxo em linguagem natural (ex: "usuario faz login, agenda consulta, verifica historico")
2. Definir casos de teste: login, booking, history verification
3. Ferramenta gera scripts e executa contra aplicacao
4. Revisar resultados e ajustar conforme necessario

### 4.3 Praticas
1. Self-healing reduz manutencao quando UI muda
2. testRigor ideal p/ equipes pequenas (zero codigo)
3. Katalon mais poderoso mas com curva de aprendizado
4. Sempre manter testadores humanos p/ edge cases

## 5. Predictive Analytics e Performance Optimization

### 5.1 Workflow Analise com IA
1. Upload de dataset (ex: CSV transacoes ecommerce)
2. Fazer perguntas analiticas em linguagem natural
3. Ferramenta gera visualizacoes, segmentacoes, previsoes
4. Avaliar qualidade: profundidade, acuracia, contexto das respostas

### 5.2 Ferramentas e Avaliacao
1. Julius: forte em analise objetiva e visualizacao
2. Akkio: decente em queries simples e segmentacao, fraco em previsao
3. ChatGPT: versatil, depende da qualidade do prompt
4. Escala 1-10: acuracia dos calculos, qualidade das visualizacoes, contextualizacao

### 5.3 Fontes de Dados Comuns
1. Atividade de usuario (page views, click paths, sessoes)
2. Logs de sistema (performance, erros)
3. Ferramentas de tracking (tempo real)
4. Feedback de clientes (reviews, tickets, surveys)

## 6. Documentation e Technical Writing

### 6.1 Tipos de Documentacao via IA
1. API/SDK docs: gerar de codigo automaticamente
2. Documentacao interna e specs: features, decisoes arquiteturais
3. Guias de usuario: instalacao, troubleshooting
4. Release notes e changelogs

### 6.2 Workflow com Ferramentas
1. Swimm: documenta 1 arquivo por vez, integrado ao workflow Git
2. ChatGPT: prompt com todos os arquivos + estrutura do repo
3. Cursor: documenta no proprio IDE com contexto completo
4. Scribe: captura screencast e gera passo-a-passo

### 6.3 Avaliacao
1. Profundidade e precisao da documentacao gerada
2. Formatacao correta (Markdown)
3. Utilidade p/ casos de uso definidos
4. Escala 1-10

### 6.4 Praticas
1. Documentacao IA sempre requer revisao humana
2. Produz 90% em segundos, mas qualidade final e humana
3. Ideal p/ combater falta de documentacao por pressao de prazos

## 7. Chatbots e Virtual Assistants

### 7.1 Escolher Tipo de Implementacao
1. No-code: Chatbase (upload datasets, deploy rapido)
2. Drag-and-drop: Botpress (fluxos visuais, logica complexa)
3. Code-based: LangChain (full control, agentic reasoning, self-hosted)

### 7.2 Workflow de Construcao
1. Definir caso de uso (suporte, FAQ, automacao interna)
2. Escolher tipo conforme complexidade e recursos
3. Upload de dados de treino / configurar fontes de conhecimento
4. Definir fluxos de conversa e integracoes API
5. Testar acuracia factual, retencao de memoria, alucinacoes

### 7.3 Avaliacao
1. Facilidade de setup e deploy
2. Acuracia factual e resistencia a alucinacao
3. Memoria entre conversas
4. Capacidade de integracao com APIs externas
5. Escala 1-10

### 7.4 Praticas
1. Sempre informar usuarios que outputs podem conter erros (alucinacao)
2. Chatbots code-based (LangChain) oferecem mais controle e seguranca
3. Para dados sensiveis, preferir self-hosted
