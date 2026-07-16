---
name: vibe-coding-kim-yegge
description: Equipe seu time de desenvolvimento com Vibe Coding — loops Inner/Middle/Outer, orquestração de agentes AI, FAAFO mindset e operação de cozinha digital
---

# Vibe Coding — Passos Operacionais

## 1. FAAFO Framework (Fast, Ambitious, Autonomous, Fun, Options)

### 1.1 Os 5 Pilares
1. **F**ast — acelere com AI, mas sem pular verificações
2. **A**mbitious — tackle problemas que antes eram impossíveis sozinho
3. **A**utonomous — AI executa tarefas; você mantém visão estratégica
4. **F**un — coding vira conversa criativa, não sofrimento
5. **O**ptions — explore múltiplas soluções em paralelo com branches

## 2. Habilidades Essenciais (Ch7)

### 2.1 Fast Feedback Loops
1. Construa incrementalmente, teste frequentemente, valide sem parar
2. Feedback rápido = força estabilizadora que mantém controle
3. CI/CD é o preditor #1 de performance (State of DevOps Reports)
4. Use AI para tarefas de validação (mais rápido que revisão manual)
5. Verificação: "building the thing right" — Validação: "building the right thing"

### 2.2 Modularidade
1. Partição clara entre módulos → trabalho em paralelo sem conflito
2. Acoplamento frouxo + APIs definidas = AI agents trabalham independentes
3. Arquitetura modular previne merge conflicts e "explosões" em cascata
4. Permite **optionality**: tente 3 estratégias de cache em paralelo
5. Time de desenvolvimento em sistema não-modular tem 9x mais chance de pedir demissão

### 2.3 Aprender Continuamente
1. Expert coaching: use mentores, pares e a própria AI para explicar
2. Fast feedback: loops de verificação apertados
3. Prática intencional: refine prompts, avalie output da AI
4. Desafios crescentes: use AI para problemas que não resolveria ontem
5. Técnica "Count Your Babies": verifique sistematicamente se AI entregou tudo que pediu
6. "Warning Signs Detector": identifique atalhos que AI toma escondido
7. Checkpointing estratégico: crie rede de segurança com commits frequentes

### 2.4 Domínio do Ofício
1. Construa o que ama — isso dirige aprendizado natural
2. Entenda limitações e forças das ferramentas AI
3. Transforme coding de atividade solitária em diálogo colaborativo
4. Mindset de criador: foco em resultados significativos, não em ferramentas

## 3. Sessões Práticas de Vibe Coding (Ch8)

### 3.1 Primeira Sessão (Chatbot)
1. Acesse ChatGPT, Claude ou Gemini pelo navegador
2. Prompt inicial: "Write a JavaScript app that animates a bouncing red ball with gravity"
3. AI gera código + preview executável (Artifacts/Canvas/Code Interpreter)
4. Itere: "Make it green", "Add another ball", "Turn it into a game"
5. Peça explicações: "Explain how the gravity works in simple terms"

### 3.2 Programas Interativos
1. Prompt: "Create a Flappy Bird-like game I can play in the browser"
2. AI gera HTML+CSS+JS completo e jogável
3. Refine: "Slow it down", "Add clouds", "Make it better"
4. Use voice mode no celular para ditar prompts

### 3.3 Quando Usar AI no Fluxo
1. **Nova tarefa?** Bounce o problema com AI primeiro
2. **Código funciona?** Peça edge cases
3. **Precisa de testes?** AI cria test plan + testes
4. **Bugs?** AI documenta a correção no changelog
5. **Documentação?** AI lê e resume (passe URL ou attach)
6. **Code review?** AI como segundo par de olhos
7. **Configuração?** AI guia passo a passo

## 4. Configuração da Cozinha (Ch8-9)

### 4.1 Ferramentas por Tipo
1. **Chatbots**: ChatGPT, Claude, Gemini — entrada rápida, sem instalação
2. **Coding Assistants**: Cursor, Copilot — inline no IDE
3. **Coding Agents**: Claude Code, Sourcegraph Amp, OpenAI Codex, Gemini CLI — executam tarefas completas
4. **MCP (Model Context Protocol)**: conecta AI a sistemas existentes (DBs, APIs, debuggers)

### 4.2 Organização do Projeto
1. Mantenha estrutura de diretórios padrão (AI navega melhor)
2. Use `.md` files para regras do projeto (AGENTS.md, CLAUDE.md)
3. Documente locais de arquivos-chave para AI não "fumbling around"

## 5. Inner Developer Loop (segundos a minutos) — Ch14

### 5.1 Prevent
1. **Checkpoint frequente**: commit a cada mudança incremental que funciona
   - Git é seu primary safety net
   - IDE local history como backup
   - AI escreve mensagens de commit claras
   - Use AI para recuperação (git bisect, localizar arquivos perdidos)
2. **Tasks pequenas e focadas**: decomponha até folhas serem executáveis por AI
   - Gere planos em Markdown, AI mantém progresso
   - Delete planos obsoletos imediatamente
   - Seja super prescritivo: objetivos claros + requisitos técnicos + exemplos
3. **AI escreve especificações primeiro**: spec + test plan antes de codificar
   - Serializa o grafo de tarefas
   - Cria baseline de "o que é sucesso"
   - Gere acceptance tests (TDD de verdade)
   - Cenários BDD (given-when-then)
   - Datasets de teste com boundary conditions
4. **AI escreve os testes**: unit, integration, smoke, edge cases
   - Revise cada teste (eyeball)
   - Execute você mesmo
   - AI analisa próprios testes
   - Automatize execução a cada file change
   - Dificuldade em criar testes = falta de modularidade
5. **AI como Git Maestro**: delegue operações complexas de Git
   - Decida se AI pode commitar (Steve: sim quando provou entender; Gene: nunca)
   - Branches para exploração de alto risco
   - Commit messages detalhadas (o que + por que)

### 5.2 Detect
1. **Verifique claims da AI**: "all tests pass" ≠ verdade — rode você mesmo
   - AI marca ☑ em planos de forma enganosa (reward hijacking)
   - Instrua AI a rodar test suite completo
   - Rode você mesmo depois
2. **Fique de olho**: sinais de AI ignorando instruções ou com amnésia
   - Suspeitou? Interrompa: "Stop! Tell me what you're doing"
   - Se saturação de contexto: limpe contexto, nova sessão
3. **TDD com AI**: escreva testes antes do código
   - Qualidade > quantidade: um teste sólido primeiro
   - AI arruma flaky tests
   - Testes de nível mais alto (componentes inteiros)
   - Automatize execução a cada save
4. **Aprenda assistindo**: AI usa comandos que você não conhece (ex: `gradle projects`, `git log -p`, `wait` do Bash)
5. **Cleanup duty**: ao encontrar bug, delegue imediatamente para AI
   - Definição de "done" inclui todos os bugs conhecidos corrigidos
6. **Freezer**: quando AI fumbling, diga onde está o arquivo (ou coloque em AGENTS.md)

### 5.3 Correct
1. **Fix forward ou roll back**: decisão baseada em frequência de checkpoints
   - `git bisect` via AI para achar commit problemático
   - Mais checkpoints = mais opções
2. **Automatize linting**: múltiplos passes de correção:
   - Estilo e elegância do código
   - Eficiência algorítmica
   - Cleanup de erros/warnings
   - Error handling robusto
   - Remover debug cruft
   - Formatação consistente
3. **Retome o controle quando AI está em loop**
   - Se AI afunda em logging: use debugger (AI opera via MCP)
   - Comece de novo: "Show me 5 completely different ways to do this"
   - Last mile é sempre humano — complete ou redirecione
4. **AI como Rubber Duck**: explique o problema para AI
   - "Let's think through this together" em vez de "Fix this"
   - AI responde com perguntas relevantes

## 6. Middle Developer Loop (horas a dias) — Ch15

### 6.1 Prevent
1. **Regras escritas**: AGENTS.md/CLAUDE.md com regras explícitas
   - AI não lê mente — documente convenções, estilo, arquitetura
2. **Memento Method**: documento vivo do estado atual do projeto
   - O que foi feito, o que está em andamento, decisões tomadas
3. **Design for AI manufacturing**: código pensado para ser mantido por AI
4. **Dois agentes simultâneos**: paralelizar tarefas independentes
5. **Coordenação intencional**: agentes sabem uns dos outros
6. **Keep agents busy**: fila de tarefas para quando você estiver ocupado

### 6.2 Detect
1. **Horrors matinais**: revise o que agentes fizeram enquanto você dormia
2. **Too many cooks**: detecte agentes interferindo entre si (contention)

### 6.3 Correct
1. **Tracer bullets**: validação rápida com tarefa técnica pequena antes de investir
2. **Workflow automation**: invista em scripts que agentes possam usar
3. **Optionality economics**: quanto mais opções paralelas, melhor decisão final

## 7. Outer Developer Loop (semanas a meses) — Ch16

### 7.1 Prevent
1. **Não deixe AI queimar pontes**: revise mudanças em integrações externas
2. **Workspace confusion**: evite "stewnami" — muitos arquivos soltos
3. **Minimize e modularize**: quanto menor o módulo, menor o risco
4. **Frotas de agentes (4+)**: gerencie múltiplos agentes em paralelo
5. **Auditoria**: revise o que está sendo construído e por que
6. **Product manager mindset**: mantenha visão de longo prazo
7. **Operations rápidas, ambiciosas e divertidas**: cultive o ambiente

### 7.2 Detect
1. **AI jogou tudo fora?** Detecte quando AI descarta código existente sem necessidade
2. **CI/CD na era AI**: pipelines precisam detectar regressões introduzidas por AI

### 7.3 Correct
1. **Merge recovery**: use AI para recuperar merges complexos (histórico do Git)
2. **Processos e arquitetura ruins**: quando preso em legado, use AI para refatoração gradual

## 8. Mindset Head Chef (Ch12)

### 8.1 AI como Time, Não Ferramenta
1. Aceite fallibilidade da AI — não desista quando erra
2. Transforme mindset de dev solo para líder de time de desenvolvimento
3. Decomponha projetos complexos em task graphs + tracer bullets
4. Estabeleça padrões de qualidade que previnam corner-cutting
5. Coordene múltiplos AI assistants em paralelo
6. Mantenha supervisão estratégica delegando execução tática

### 8.2 Prevenção de Reward Hijacking (Ch11)
1. AI otimiza para sua aprovação, não para qualidade real
2. Sintomas: ☑ em tarefas não-concluídas, "tests pass" sem compilar
3. Antídoto: verificação empírica — rode testes, inspecione output

## 9. Orquestrando Times de AI (Ch17)

### 9.1 De Line Cook a Head Chef
1. Comece como executor (line cook) — tarefas únicas com AI
2. Evolua para coordenador (sous chef) — múltiplos agentes
3. Torne-se head chef — define cardápio, qualidade, visão

### 9.2 Padrões de Coordenação
1. Tasks paralelas em módulos independentes
2. Um agente por feature branch
3. Revisão cruzada entre agentes
4. Planos compartilhados em Markdown

## 10. Ferramentas e Ecossistema (Ch13)

### 10.1 Navegando a Explosão Cambriana
1. IDE tradicional → coding agents especializados
2. MCP transforma AI de consultor a membro ativo do time
3. Escolha ferramenta baseada no tipo de tarefa:

| Tarefa | Ferramenta |
|--------|-----------|
| Chat rápido | ChatGPT/Claude/Gemini |
| Edição inline | Cursor/Copilot |
| Tarefa completa | Claude Code/Codex/Gemini CLI |
| Acesso a sistemas | MCP servers |
| Deploy/Hosting | Hugging Face Spaces |
