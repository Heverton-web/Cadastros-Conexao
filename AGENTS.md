# AGENTS.md — ERP Odonto & Bubble Reverse Engineering

**Idioma:** PT-BR obrigatório.

## Estrutura do Projeto

- **Raiz** → `bubble_reverse_engineering/`: Engenharia reversa de Bubble.io + configs globais.
- **`proj_erp/`** → Aplicação ERP (TanStack Start + React Router + Vite + Supabase).
- **`supabase-mcp-server/`** → MCP server TypeScript para gerenciar banco Supabase.

## Comandos de Desenvolvimento

```bash
npm run dev      # dev server (Vite)
npm run build    # build produção
npm run format   # Prettier
npm run lint     # ESLint
```

## 🚨 Regras Obrigatórias (resumo)

| Regra | Detalhe |
|-------|---------|
| Sem alertas nativos | `window.confirm/alert/prompt` PROIBIDO. Usar `AlertDialog` ou `Dialog` |
| Multi-tenant | Toda tabela tem `empresa_id`. RLS filtra por empresa |
| RequirePermission | Toda rota autenticada usa `RequirePermission` ou `RequireSuperAdmin` |
| Eventos Central de Ações | Todo módulo tem ≥2 eventos + `dispararEventoModulo()` fire-and-forget |
| Build check | `npm run build` SEMPRE após alteração de código |

## Referências Detalhadas

| Documento | Quando ler |
|-----------|------------|
| `skill://docs/ui-rules` | Regras de UI para criacao de modais, AlertDialog e scroll |
| `skill://docs/architecture` | Arquitetura do projeto — modulos, eventos e multi-tenant |
| `skill://docs/permissions` | Sistema de permissoes — guards e checklist de novo modulo |
| `skill://docs/mcp-supabase` | Uso do MCP Supabase para gerenciamento de banco de dados |
| `skill://rules/economia-tokens` | Regras de eficiencia de tokens para agentes |

## Comportamento do Agente

- **Caveman**: SEM greetings, SEM re-emitir arquivos inteiros, direto ao ponto. Explicações SOMENTE com "?"
- **Lean-CTX**: Ler assinaturas antes de corpos, agrupar edições, evitar grep em diretórios grandes
- **RTK**: Manter lições aprendidas no scratchpad abaixo. Consultar antes de cada plano
- **Skills**: Checar `.agents/skills/` antes de tarefa complexa

### 📝 SCRATCHPAD RTK

- **Learnt**: Laboratório de Testes (global.laboratorio.tsx): requer migration 00054 para RPCs de token real. Fallback automático para UUID local se RPC indisponível. Página reescrita com 3 abas (Gerador, Teste de Fluxo, Histórico). Central de Testes (global.testes.tsx): fetch com AbortSignal.timeout(30000) adicionado.
- **Regra Obrigatória**: SEMPRE rodar `npm run build` após QUALQUER alteração de código para validar ausência de erros. Nunca assumir que edição está correta sem verificar build.

## Deploy

- Só executar quando o usuário disser "deploy", "/deploy" ou "fazer deploy".
- Usar skill `deploy-vps`. Build deve passar antes do push.

## Bubble Reverse Engineering

- Pipeline completo via `/bubble-tech-lead` + skills em `.agents/skills/`.

## Skills Disponíveis

| Skill | Descrição |
|-------|-----------|
| `criar-modulo` | Cria estrutura completa de novo módulo |
| `criar-rota` | Criacao de rotas protegidas no ERP Odonto com RequirePermission |
| `gerar-crud` | Operações CRUD com React Query |
| `criar-componente-modulo` | Cria componente React seguindo padrões shadcn/ui |
| `adicionar-permissao` | Adiciona permissão ao sistema de permissões |
| `validar-modulo` | Verificar integridade do módulo |
| `documentar-modulo` | Gerar documentação do módulo |
| `deploy-vps` | Deploy do ERP via Docker e VPS com rollback automatico |
| `planejar-modulo-repo-externo` | Analisar repo externo e planejar integração |
| `gerenciar-nav-items` | Gerencia nav items de módulos |
| `design-frontend` | Aplicacao de classes de design system no frontend — /design <rota> |
| `responsividade` | Analise e correcao de responsividade de modulos — /responsividade <modulo> |
| `criar-design-modulo` | Cria config de Design System do módulo |
| `gerar-pagina` | Gera página React completa com Design System |
| `gerar-formulario` | Gera formulário React com React Hook Form + Zod |
| `gerar-modal` | Geracao de modais e dialogs com shadcn/ui — confirm, form, info e warning |
| `google-maps-platform` | Integracao com Google Maps Platform — mapas, geocoding, rotas e places |
| `loop` | Especifica loop de agente autônomo |
| `rtk-memory` | Memória RTK para agentes |
| `lean-ctx` | Estratégia LEAN-CTX para limitação de contexto |
| `caveman` | Modo comunicação ultra-condensada |
| `pre-flight-check` | Verificação prévia antes de implementações |
| `implementar-mapa-dark-premium` | Implementacao de mapa dark premium com tokens CSS personalizados |
| `headroom` | Framework para componentes UI reutilizáveis |
| `modulo-completo` | Workflow: Documentação → Design → Responsividade |
| `loop-modulo-completo` | Pipeline iterativo de módulo até tudo passar |
| `engsoft-moderna` | Engenharia de Software Moderna com Marco Tulio Valente — processos, requisitos, SOLID, padroes e testes |
| `ai-engineering` | Skill baseada no livro AI Engineering de Chip Huyen — construcao de aplicacoes com modelos de Fundacao |
| `ai-agents-mcp-operacional` | Criacao de servidores e clientes MCP — tools, resources, prompts e integracao com LLMs |
| `building-apps-ai-agents` | Projeto e implementacao de sistemas de agentes de IA — do agente unico ao multiagente |
| `agentic-enterprise` | Estrategia e implementacao de IA agente empresarial — arquitetura, governanca e seguranca |
| `ai-assisted-programming` | Passos operacionais de programacao assistida por IA — engenharia de prompt, Copilot, ChatGPT, refatoracao e depuracao |
| `ai-native-software-delivery` | Entrega de software nativa em IA — CI/CD com IA, deploy automatizado e infra como codigo |
| `ai-systems-performance-engineering` | Otimizacao full-stack de sistemas de IA — GPU, CUDA, PyTorch, inferencia e caching |
| `building-ai-agent-platforms` | Arquitetura e operacao de plataformas de agentes de IA — design de plataforma, API e observabilidade |
| `building-micro-frontends` | Micro-frontends com Luca Mezzalira — composicao, roteamento, deploy e migracao |
| `ai-value-creators` | Framework para criar valor com IA Generativa — estrategia, metricas, casos de uso e governanca |
| `eu-ai-act-guide` | Guia de conformidade com a Lei de IA da UE — classificacao de risco, documentacao e auditoria |
| `ai-essentials-executives` | Frameworks estrategicos para executivos decidirem sobre IA — estrategia, metricas e analise de dados |
| `building-software-vibe-coding` | Construcao de software com Vibe Coding — engenharia de prompt, iteracao rapida e depuracao |
| `agentic-mesh` | Construcao de ecossistemas de agentes empresariais — arquitetura mesh, descoberta, comunicacao e seguranca |
| `ai-engineering-art-intelligent-systems` | Passos operacionais de engenharia de IA e construcao de sistemas inteligentes — design, pipelines de dados, LLMOps e multiagentes |
| `ai-assisted-programming-web-ml` | Passos operacionais de programacao assistida por IA para web e ML — configuracao, front-end, back-end, ML e deploy |
| `ai-agents-definitive-guide` | Guia definitivo para construir agentes de IA — tipos de agentes, ferramentas, memoria, multiagente e deploy |
| `agentic-ai-data-architectures` | Arquiteturas de dados para IA agente — pipelines, feature stores, RAG e governanca |
| `applied-ai-enterprise-java` | Passos de IA aplicada para desenvolvimento Java empresarial — Jakarta, Quarkus, LangChain4j e deploy |
| `building-ai-powered-products` | Framework completo de AI Product Management — ciclo AIPDL, OKRs, design de agentes e estrategia |
| `building-genai-fastapi` | Passos de construcao de servicos GenAI com FastAPI — APIs, streaming, RAG e deploy no Cloud Run |
| `building-genai-enterprise` | Solucoes GenAI empresariais — prompt engineering, fine-tuning, RAG, agentes e governanca |
| `genai-software-development` | Avaliacao e uso de ferramentas GenAI no ciclo de desenvolvimento — geracao de codigo, revisao, testes e documentacao |
| `genai-design-patterns` | Padroes de design para aplicacoes GenAI em producao — controle de estilo, RAG, raciocinio e confiabilidade |
| `designing-ai-interfaces` | Principios de design e padroes de interface para sistemas de IA — UX de copiloto, dashboards e design de agentes |
| `essential-math-ai` | Fundamentos de matematica para IA e machine learning — algebra linear, calculo, probabilidade e otimizacao |
| `grokking-ai-algorithms` | Implementacao passo a passo dos principais algoritmos de IA — busca, algoritmos geneticos, ML, redes neurais, RL e transformers |
| `hands-on-apis-ai-data-science` | Passos praticos de APIs para IA e Data Science — FastAPI, Docker, Airflow, LangChain e deploy |
| `python-simplified-genai` | Aprenda Python do zero com IA Generativa — algoritmos, pandas, CNN e deploy com Gradio/Hugging Face |
| `vibe-coding-kim-yegge` | Capacitacao de equipes com Vibe Coding — loops Inner/Middle/Outer, orquestracao de agentes e operacao continua |
| `visualizing-genai` | Guia pratico para construir aplicacoes GenAI — prompting, agentes, RAG, fine-tuning e arquitetura |
| `vibe-engineering` | Disciplina de engenharia para desenvolvimento assistido por IA — engenharia de contexto, migracao e validacao |
| `automate-boring-stuff-python` | Passos de automacao com Python — regex, scraping, Excel, PDF, email, GUI e OCR |
| `principles-building-ai-agents` | Principios para construir agentes de IA — modelos, prompts, ferramentas, MCP, RAG, avaliacao e deploy |
| `learning-ai-tools-tableau` | Ferramentas de IA no Tableau — Tableau Pulse, Tableau Agent, metricas, insights e integracao Slack/Salesforce |
| `learning-genai-tools-excel` | Ferramentas GenAI para Excel — ChatGPT, formulas, templates, analise de dados e VBA |
| `machine-learning-classificacao` | Pipeline completo de classificacao com scikit-learn — carga, tratamento, treino, teste e validacao de modelos |
| `vibe-coding-addy-osmani` | Workflows de desenvolvimento assistido por IA — o problema dos 70%, padroes de parceria e validacao |
| `data-science-do-zero` | Ciencia de dados do zero com Joel Grus — estatistica, algebra linear, ML, SQL e MapReduce |
| `engenharia-software-ia-sandeco` | Engenharia de software assistida por IA com Sandeco — Git, design patterns e agentes |
| `apis-rest` | Design de APIs RESTful, métodos HTTP, autenticação e boas práticas |
| `arquitetura-distribuida` | Microsserviços, comunicação, tolerância a falhas e observabilidade |
| `arquitetura-limpa` | Princípios SOLID, boundaries, design de componentes e casos de uso |
| `arquitetura-tomada-decisao` | ADRs, trade-offs e documentação arquitetural |
| `building-microservices-go` | Microserviços com Go, APIs REST e concorrência |
| `building-multi-tenant-saas` | Design de arquiteturas multi-tenant com Tod Golding — isolamento, escalabilidade e governanca |
| `clean-architecture-android` | Clean Architecture Android, MVVM e injeção de dependência |
| `designing-data-intensive` | Replicação, particionamento, transações, streams e batch |
| `explorando-apis-java` | Exploracao de APIs e bibliotecas Java — JDBC, IO, Threads e JavaFX |
| `facilitating-software-architecture` | Liderança arquitetural, stakeholders e governança |
| `fundamentals-software-architecture` | Estilos arquiteturais, métricas e governança |
| `fundamentos-arquitetura` | Estilos, métricas, componentes e governança |
| `google-app-engine` | Serviços em nuvem, escalabilidade e Datastore |
| `graphql` | Schema design, queries, mutations, resolvers e integração |
| `head-first-software-architecture` | Princípios de arquitetura, design patterns e documentação |
| `introducao-arquitetura-design` | UML, padrões de projeto e modelagem |
| `learning-domain-driven-design` | Domain-Driven Design com Vladik Khononov — bounded contexts, eventos e agregados |
| `mastering-apis-enterprise` | Design enterprise, governança e segurança |
| `modern-data-architecture-ai` | Arquitetura de dados moderna para IA — pipelines, feature stores e data lakes |
| `principles-modernization` | Migração e refactoring de sistemas legados |
| `rest-construa-apis-inteligentes` | Design RESTful, HTTP e autenticação |
| `restful-api-design` | Design de APIs RESTful — HATEOAS, versionamento e melhores praticas |
| `software-architecture-decision` | Tomada de decisao arquitetural — ADRs, trade-offs e gerenciamento de riscos |
| `version-control-git` | Controle de versao com Git — branching, merge, rebase e workflows |
| `ai-native-software-delivery` | Entrega de software nativa em IA — CI/CD com IA, deploy automatizado e infra como codigo |
| `caixa-de-ferramentas-devops` | Ferramentas e praticas DevOps para automacao e infraestrutura |
| `containers-com-docker` | Containers com Docker — desenvolvimento e producao |
| `docker` | Fundamentos de Docker — criacao e gerenciamento de containers |
| `docker-deep-dive` | Guia completo de Docker com Nigel Poulton — instalacao, imagens, redes e producao |
| `docker-para-desenvolvedores` | Docker para desenvolvedores — da criacao ao deploy |
| `docker-para-desenvolvedores-rafael-gomes` | Docker para desenvolvedores com Rafael Gomes — praticas e comandos essenciais |
| `docker-up-and-running` | Docker do basico ao deploy — guia completo de containers |
| `amazon-aws-descomplicando` | Amazon AWS descomplicado — computacao em nuvem, servicos e praticas |
| `azure-cloud` | Microsoft Azure — plataformas e servicos em nuvem |
| `certificacao-linux-lpic` | Guia pratico para certificacao LPIC-1 — administracao Linux |
| `descomplicando-docker-v1` | Descomplicando Docker — volume 1, fundamentos e pratica |
| `descomplicando-docker-v2` | Descomplicando Docker — volume 2, avancado e producao |
| `devops-na-pratica` | DevOps na pratica — automacao, integracao continua e entrega |
| `google-app-engine-devops` | Google App Engine com practices DevOps — servicos em nuvem |
| `jornada-kubernetes-completo` | Jornada Kubernetes completa — da teoria a pratica com GitOps |
| `kubernetes-pt` | Kubernetes — orquestracao de containers, pods, servicos e deploy |
| `genai-on-google-cloud` | GenAI no Google Cloud — servicos de IA generativa na nuvem |
| `generative-ai-on-kubernetes` | IA Generativa em Kubernetes — deploy e operacao de modelos em containers |
| `hands-on-devops-linux` | Devops pratico com Linux — automate e deploy |
| `implementing-devsecops` | Implementacao de DevSecOps com Docker e Kubernetes — seguranca em todo o ciclo |
| `infrastructure-automation-terraform` | Automacao de infraestrutura com Terraform — IaC e gerenciamento |
| `jenkins-automatize-tudo` | Jenkins — automatizacao de CI/CD sem complicacoes |
| `kubernetes-up-and-running` | Kubernetes do basico a producao — orquestracao pratica |
| `manual-de-devops` | Manual de DevOps — praticas, ferramentas e cultura DevOps |
| `mastering-docker` | Dominando Docker — 2a edicao, tecnicas avancadas |
| `modern-system-administration` | Administracao moderna de sistemas — praticas e ferramentas atuais |
| `sre-with-aiops` | SRE com AIOps — confiabilidade de servicos com inteligencia operacional |
| `strategic-devops` | DevOps estrategico — alinhamento de tecnologia e negocios |
| `comprehensive-devops-interview-guide` | Guia completo para entrevistas DevOps — questoes tecnicas e comportamentais |
| `ultimate-docker-container-book` | O guia definitivo de Docker e containers — da teoria a producao |
| `usando-docker` | Usando Docker — guia pratico do dia a dia |
| `using-docker-2015` | Guia pratico de Docker — primeiros passos e fundamentos |
| `a-web-mobile-programe-para-um-mundo-de-muitos` | Desenvolvimento Web |
| `aplicativos-web-real-time-com-node-js` | Aplicacoes web em tempo real com Node.js — websockets, eventos e streaming |
| `boas-praticas-nodejs-umbler` | Boas praticas Node.js — organizacao, seguranca e performance |
| `building-production-ready-web-apps-with-nodejs` | Construcao de aplicacoes web prontas para producao com Node.js |
| `cangaceiro-javascript-uma-aventura-no-sertao-da` | JavaScript do basico ao avancado — uma aventura no sertao da programacao |
| `construindo-apis-rest-com-nodejs` | Construcao de APIs REST com Node.js — rotas, middleware e banco de dados |
| `construindo-apis-testaveis-com-nodejs-waldemar-neto` | Construcao de APIs testaveis com Node.js — TDD, integracao e qualidade |
| `creating-npm-package-your-react-javascript-guide-to` | Criacao de pacotes NPM — guia para React, JavaScript e bibliotecas |
| `data-structures-and-algorithms-in-javascript` | Estruturas de dados e algoritmos em JavaScript — implementacoes praticas |
| `django-de-a-a-z` | Django do zero ao deploy — framework web Python completo |
| `dominando-javascript-com-jquery-casa-do-codigo` | Dominando JavaScript com jQuery — manipulacao DOM e eventos |
| `ecmascript-6-entre-de-cabeca-no-futuro-do-javascript` | ECMAScript 6 — o futuro do JavaScript, classes, promises e modulos |
| `efficient-nodejs` | Node.js eficiente — performance, concorrencia e boas praticas |
| `elixir-do-zero-a-concorrencia` | Elixir do zero a concorrencia — programacao funcional e distribuida |
| `eloquent-javascript` | JavaScript eloquente — fundamentos, algoritmos e programacao web |
| `epub-angular-11-e-firebase-construindo-uma-aplicacao` | Angular 11 e Firebase — construcao de aplicacoes completas |
| `epub-desenvolva-jogos-com-html5-canvas-e-javascript` | Desenvolvimento de jogos com HTML5 Canvas e JavaScript |
| `epub-desenvolvimento-web-com-aspnet-mvc` | Desenvolvimento web com ASP.NET MVC — controllers, views e models |
| `epub-desenvolvimento-web-com-php-e-mysql` | Desenvolvimento web com PHP e MySQL — do basico ao avancado |
| `epub-guia-front-end-o-caminho-das-pedras-para-ser-um` | Guia front-end completo — o caminho das pedras para desenvolvedores |
| `epub-html5-e-css3-domine-a-web-do-futuro` | HTML5 e CSS3 — dominando a web do futuro |
| `epub-javascript-assertivo-testes-e-qualidade-de` | JavaScript assertivo — testes e qualidade de codigo |
| `epub-play-framework-java-para-web-sem-servlets-e-com` | Play Framework Java — desenvolvimento web sem servlets |
| `epub-react-native-desenvolvimento-de-aplicativos` | React Native — desenvolvimento de aplicativos mobile multiplataforma |
| `estruturas-de-dados-e-algoritmos-com-javascript` | Estruturas de dados e algoritmos com JavaScript — guia pratico |
| `flask-de-a-a-z` | Flask do zero ao deploy — framework web Python minimalista |
| `full-stack-react-typescript-and-node` | Full-stack com React, TypeScript e Node.js — aplicacoes completas |
| `full-stack-web-development` | Desenvolvimento web full-stack — front-end, back-end e banco de dados |
| `full-stack-web-development-with-react-angular-nodejs` | Full-stack com React, Angular e Node.js — tres frameworks em um guia |
| `full-stack-web-development-with-typescript-5` | Full-stack com TypeScript 5 — tipagem segura do front ao back |
| `head-first-javascript-programming-a-learners-guide-to` | JavaScript Head First — guia para aprendizes com exemplos praticos |
| `html-5-embarque-imediato` | HTML5 — embarque imediato nas novas funcionalidades |
| `html-e-css-projete-e-construa-sites` | HTML e CSS — projete e construa sites do zero |
| `ios-programe-para-iphone-e-ipad` | iOS — programacao para iPhone e iPad com Swift |
| `javascript-and-jquery-interactive-front` | JavaScript e jQuery — front-end interativo e dinamico |
| `javascript-for-modern-web-development-alok-ranjan` | JavaScript para desenvolvimento web moderno — praticas atuais |
| `javascript-mastery-advanced-techniques-for-dynamic` | Dominio de JavaScript — tecnicas avancadas para web dinamica |
| `mastering-mean-stack` | Dominando MEAN Stack — MongoDB, Express, Angular e Node.js |
| `meteor-criando-aplicacoes-web-real-time-com-javascript` | Meteor — criando aplicacoes web em tempo real com JavaScript |
| `modern-web-design-in-30-days` | Design web moderno em 30 dias — HTML, CSS e responsividade |
| `nodejs-aplicacoes-web-real-time-com-nodejs` | Node.js — aplicacoes web em tempo real com JavaScript no servidor |
| `nodejs-complete-resume` | Node.js — guia completo de conceitos e praticas |
| `nodejs-handbook` | Node.js handbook — guia de referencia rapida |
| `nodejs-para-iniciantes-umbler` | Node.js para iniciantes — primeiros passos com JavaScript no back-end |
| `o-retorno-do-cangaceiro-javascript-de-padroes-a-uma` | O retorno do cangaceiro JavaScript — de padroes a uma arquitetura solida |
| `swift-programe-para-iphone-e-ipad` | Swift — programe para iPhone e iPad com a linguagem da Apple |
| `react-js-a-beginners-guide-to-building-interactive` | React.js — guia para iniciantes construirem interfaces interativas |
| `udemy-guide-nodejs-andrewmead-version3` | Node.js com Andrew Mead — guia completo do zero ao deploy |
| `web-api-cookbook-level-up-your-javascript` | Receitas de Web APIs — evolua seu JavaScript com APIs modernas |
| `web-apis-em-nodejs-luiz-tools` | Web APIs em Node.js — construcao de servicos RESTful |
| `web-design-responsivo-paginas-adaptaveis-para-todos` | Web design responsivo — paginas adaptaveis para todos os dispositivos |
| `web-development-with-html-css-and-javascript` | Desenvolvimento web com HTML, CSS e JavaScript — fundamentos |
| `webapp-com-nodejs-e-mongodb-umbler` | Webapps com Node.js e MongoDB — aplicacoes completas com banco NoSQL |
| `epub-aplicacoes-java-para-a-web-com-jsf-e-jpa` | Aplicacoes Java para web com JSF e JPA — faces, persistencia e componentes |
| `epub-aprenda-javascript-com-dashboards-seus-primeiros` | Aprenda JavaScript com dashboards — seus primeiros projetos visuais |
| `epub-aspnet-mvc5-crie-aplicacoes-web-na-plataforma` | ASP.NET MVC5 — criacao de aplicacoes web na plataforma Microsoft |
| `epub-canivete-suico-do-desenvolvedor-node` | Canivete suico do desenvolvedor Node — ferramentas e utilitarios essenciais |
| `epub-canvas-html-5-composicao-grafica-e` | Canvas HTML5 — composicao grafica e interatividade no navegador |
| `epub-coletanea-front-end` | Coletanea front-end — artigos e tecnicas de desenvolvimento web |
| `epub-css-eficiente-tecnicas-e-ferramentas-que-fazem-a` | CSS eficiente — tecnicas e ferramentas que fazem a diferenca |
| `epub-estruturas-de-dados-domine-as-praticas` | Estruturas de dados — domine as praticas essenciais de programacao |
| `epub-front-end-com-vuejs-da-teoria-a-pratica-sem` | Front-end com Vue.js — da teoria a pratica sem complicacao |
| `epub-guia-pratico-de-typescript-melhore-suas` | Guia pratico de TypeScript — melhore suas aplicacoes com tipagem |
| `epub-jsf-eficaz-as-melhores-praticas-para-o` | JSF eficaz — melhores praticas para o desenvolvedor Java Web |
| `epub-php-e-laravel-crie-aplicacoes-web-como-um` | PHP e Laravel — criacao de aplicacoes web como um profissional |
| `epub-postgresql-banco-de-dados-para-aplicacoes-web` | PostgreSQL — banco de dados para aplicacoes web modernas |
| `epub-progressive-web-apps-construa-aplicacoes` | Progressive Web Apps — construcao de aplicacoes web progressivas |
| `epub-sass-aprendendo-pre-processadores-css` | Sass — aprendendo pre-processadores CSS para estilos eficientes |
| `epub-vraptor-desenvolvimento-agil-para-web-com-java` | VRaptor — desenvolvimento agil para web com Java |
| `epub-vuejs-construa-aplicacoes-incriveis` | Vue.js — construcao de aplicacoes incriveis com o framework progressivo |
| `epub-web-design-responsivo-paginas-adaptaveis-para` | Web design responsivo — paginas adaptaveis para todos os dispositivos |
| `epub-yesod-e-haskell-aplicacoes-web-com-programacao` | Yesod e Haskell — aplicacoes web com programacao funcional |
| `a-logica-do-jogo-recriando-classicos-da-historia-dos-vi` | Logica de jogos — recriando classicos da historia dos videogames |
| `a-web-mobile-programe-para-um-mundo-de-muitos-dispositi` | Web mobile — programacao para um mundo com muitos dispositivos |
| `agile-desenvolvimento-de-software-com-entregas-frequent` | Agile — desenvolvimento de software com entregas frequentes e valor de negocio |
| `ai-engineering-and-the-art-of-building-intelligent-syst` | Engenharia de IA e a arte de construir sistemas inteligentes |
| `algoritmos-em-java-busca-ordenacao-e-analise` | Algoritmos em Java — busca, ordenacao e analise de complexidade |
| `applied-ai-for-enterprise-java-development-alex-soto-bu` | IA aplicada para desenvolvimento Java empresarial com Soto, Eisele e Vinto |
| `aprenda-a-programar-com-python` | Aprenda a programar com Python — logica, estruturas e projetos |
| `armazenando-dados-com-redis` | Armazenamento de dados com Redis — estrutura, comandos e padroes |
| `automate-the-boring-stuff-with-python-al-sweigart` | Automacao de tarefas com Python — regex, arquivos, scraping e Excel |
| `better-python-code` | Codigo Python melhor — boas praticas e padroes de projeto |
| `casa-do-codigo-epub-android-nativo-com-kotlin-e-mvvm` | Android nativo com Kotlin e MVVM — desenvolvimento de apps modernos |
| `casa-do-codigo-tdd` | TDD — Desenvolvimento Orientado a Testes com exemplos praticos |
| `como-descobrir-quem-esta-do-outro-lado-da-tela-hacking` | Hacking etico — identificacao e analise de ameacas digitais |
| `data-science-for-healthcare-nitin-singh` | Ciencia de dados para saude — analise e modelos preditivos |
| `datas-e-horas-conceitos-fundamentais-e-as-apis-do-java` | Datas e horas em Java — API de tempo, manipulacao e formatacao |
| `desbravando-java-e-orientacao-a-objetos-um-guia-para-o` | Desbravando Java e orientacao a objetos — guia para iniciantes |
| `engenharia-de-software-moderna-marco-tulio-valente` | Engenharia de Software Moderna com Marco Tulio Valente |
| `engenharia-de-software-r-s-pressman-b-r-maxim` | Engenharia de Software com Pressman e Maxim — abordagem classica |
| `entendendo-algoritmos-um-guia-ilustra` | Entendendo algoritmos — guia ilustrado para iniciantes |
| `entrega-continua-em-android-como-automatizar-a-distribu` | Entrega continua em Android — automatizacao de distribuicao de apps |
| `epub-componentes-reutilizaveis-em-java-com-reflexao-e-a` | Componentes reutilizaveis em Java — reflexao, anotacoes e generics |
| `epub-cucumber-e-rspec-construa-aplicacoes-ruby-com-test` | Cucumber e RSpec — construcao de aplicacoes Ruby com testes |
| `epub-datas-e-horas-conceitos-fundamentais-e-as-apis-do` | Datas e horas com Java — conceitos fundamentais e API de tempo |
| `epub-desbravando-java-e-orientacao-a-objetos-um-guia-pa` | Desbravando Java e OO — guia para iniciantes na linguagem |
| `epub-practical-java-8-lambdas-streams-and-new-resources` | Java 8 pratico — lambdas, streams e novos recursos da linguagem |
| `epub-protractor-licoes-sobre-testes-end-to-end-automati` | Protractor — licoes sobre testes end-to-end automatizados |
| `epub-refatorando-com-padroes-de-projeto-um-guia-em-ruby` | Ruby, Padrões de Projeto |
| `epub-rspec-crie-especificacoes-executaveis-em-ruby` | RSpec — criacao de especificacoes executaveis em Ruby |
| `epub-selenium-webdriver-descomplicando-testes-automatiz` | Selenium WebDriver — descomplicando testes automatizados com Java |
| `epub-spock-framework-testes-automatizados-ageis-para-ja` | Spock framework — testes automatizados ageis para Java |
| `epub-testes-automatizados-de-software-um-guia-pratico` | Testes automatizados de software — um guia pratico completo |
| `fragmentos-de-um-programador` | Fragmentos de um programador — reflexoes e aprendizados da carreira |
| `fundamentals-of-software-engineering` | Fundamentos de engenharia de software — principios e praticas essenciais |
| `guia-do-mestre-programador` | Guia do mestre programador — caminho para excelencia em desenvolvimento |
| `image-processing-masterclass-with-python-50-solutions-a` | Processamento de imagens com Python — 50 solucoes e algoritmos |
| `implementing-reverse-engineering-jitender-narula` | Implementacao de engenharia reversa — tecnicas e ferramentas |
| `implementing-reverse-engineering-the-real-practice-of-x` | Engenharia reversa na pratica — metodologias e estudos de caso |
| `introducao-a-programacao-com-python-algoritmos-e-logica` | Introducao a programacao com Python — algoritmos e logica |
| `ionic-framework-construa-aplicativos-para-todas-as-plat` | Ionic Framework — construcao de aplicativos multiplataforma |
| `jogos-2d-com-stencyl-crie-jogos-completos-sem-codigos-d` | Jogos 2D com Stencyl — criacao de jogos sem codigo |
| `jornada-python` | Jornada Python — do basico ao avancado na linguagem |
| `jsf-eficaz-as-melhores-praticas-para-o-desenvolvedor-we` | JSF eficaz — praticas recomendadas para desenvolvimento web Java |
| `kotlin-com-android-crie-aplicativos-de-maneira-facil-e` | Kotlin com Android — criacao de aplicativos de forma facil e produtiva |
| `lean-game-development-desenvolvimento-enxuto-de-jogos` | Lean Game Development — desenvolvimento enxuto de jogos |
| `learning-generative-ai-tools-for-excel-angelica-lo-duca` | Ferramentas GenAI para Excel com Angelica Lo Duca |
| `low-code-development-with-servicenow-nicola-attico` | Desenvolvimento low-code com ServiceNow — automacao empresarial |
| `mastering-microsoft-excel-365-the-ultimate-guide-to-nir` | Dominando Microsoft Excel 365 — guia completo para produtividade |
| `mastering-the-it-audit-ramaswamy-jyothi` | Auditoria de TI — dominando praticas e frameworks de auditoria |
| `mongodb-construa-novas-aplicacoes-com-novas-tecnologias` | MongoDB — novas aplicacoes com novas tecnologias de banco de dados |
| `mysql-comece-com-o-principal-banco-de-dados-open-source` | MySQL — o principal banco de dados open source do mercado |
| `o-programador-pragmatico-de-aprendiz-a-mestre` | O Programador Pragmatico — de aprendiz a mestre na programacao |
| `oauth-20-proteja-suas-aplicacoes-com-o-spring-security` | OAuth 2.0 — protecao de aplicacoes com Spring Security |
| `onsumindo-a-api-do-zabbix-com-python` | Consumo da API do Zabbix com Python — automacao de monitoramento |
| `platform-engineering-and-security` | Engenharia de plataforma e seguranca — fundamentos e praticas |
| `play-framework-java-para-web-sem-servlets-e-com-diversa` | Play Framework — Java para web sem servlets com recursos modernos |
| `postgresql-banco-de-dados-para-aplicacoes-web-modernas` | PostgreSQL — banco de dados relacional para aplicacoes web modernas |
| `powershell-automation-and-scripting-ahmed-uzejnovic` | Automacao e scripting com PowerShell — administracao de sistemas |
| `powershell-essential-guide-prashanth-jayaram-rajendra-g` | Guia essencial de PowerShell — comandos, scripts e automacao |
| `practical-java-8-lambdas-streams-and-new-resources` | Java 8 pratico — lambdas, streams e novos recursos |
| `programando-em-google` | Programando em Google — ferramentas e plataformas Google para devs |
| `python` | Python — fundamentos, estruturas e programacao |
| `python-escreva-seus-primeiros-programas` | Python — escreva seus primeiros programas e aprenda logica |
| `python-for-devops-varghese-chacko` | Python para DevOps — automacao de infraestrutura e deploy |
| `python-powered-excel` | Python para Excel — automacao de planilhas e analise de dados |
| `react-native-desenvolvimento-de-aplicativos-mobile-com` | React Native — desenvolvimento de aplicativos mobile nativos |
| `redes-de-computadores` | Redes de computadores — fundamentos, protocolos e arquitetura |
| `redes-de-computadores-e-a-internet-uma-abordagem-top-do` | Redes e Internet — abordagem top-down com Kurose e Ross |
| `refatorando-com-padroes-de-projeto-um-guia-em-ruby` | Refatoracao com padroes de projeto — guia em Ruby |
| `seguranca-em-aplicacoes-web` | Seguranca em aplicacoes web — protecao contra ameacas e vulnerabilidades |
| `selenium-webdriver-descomplicando-testes-automatizados` | Selenium WebDriver — testes automatizados descomplicados com Java |
| `series-temporais-com-prophet-analise-e-previsao-de-dado` | Series temporais com Prophet — analise e previsao de dados |
| `sql-crash-course-thomas-liddle` | SQL Crash Course — aprendizado rapido de banco de dados relacional |
| `test-driven-development-with-python-harry-jw-percival` | TDD com Python — desenvolvimento orientado a testes com Django |
| `trilhas-python` | Trilhas Python — caminhos de aprendizado na linguagem |
| `vraptor-desenvolvimento-agil-para-web-com-java` | VRaptor — desenvolvimento agil para web com Java |
| `web-automation-with-playwright-and-python-kailash-patha` | Automacao web com Playwright e Python — testes end-to-end |
| `aprendendo-node` | Aprendendo Node.js — fundamentos, modulos e aplicacoes |
| `aprendendo-node-shelley-powers` | Aprendendo Node.js com Shelley Powers — guia completo e pratico |
| `comunicacao-de-dados-e-redes-de-computadores-portuguese` | Comunicacao de dados e redes — fundamentos e protocolos de rede |
| `enterprise-architects-handbook-a-blueprint-to-design-an` | Handbook do arquiteto empresarial — blueprint para design de sistemas |
| `javascript-de-alto-desempenho-nicholas-c-zakas-mary-e-t` | JavaScript de alto desempenho — otimizacao e boas praticas |
| `marketing-de-conteudo-casa-do-codigo` | Marketing de conteudo — estrategias para promocao de produtos digitais |
| `modern-full-stack-development-frank-w-zammetti` | Desenvolvimento full-stack moderno com Frank Zammetti |
| `mongodb-construa-novas-aplicaco` | MongoDB — construcao de novas aplicacoes com banco NoSQL |
| `the-ai-engineers-guide-to-surviving-the-eu-ai-act-larys` | Guia do engenheiro de IA para conformidade com o EU AI Act |
| `web-scraping-com-python-ryan-e-mitchell` | Web scraping com Python — extracao de dados da web |
| `big-data-tecnicas-e-tecnologias-para-extracao-de-valor` | Big Data — tecnicas e tecnologias para extracao de valor dos dados |
| `building-multimodal-generative-ai-and-agentic-app` | IA Generativa multimodal e aplicacoes agente — visao, texto e agentes |
| `data-science-crash-course` | Data Science Crash Course — fundamentos praticos de ciencia de dados |
| `elasticsearch-consumindo-dados-real-time-com-elk` | Elasticsearch — consumo de dados em tempo real com ELK Stack |
| `epub-pandas-python` | Pandas com Python — manipulacao e analise de dados |
| `inteligencia-artificial-e-chatgpt-da-revolucao-dos-modelos` | IA e ChatGPT — a revolucao dos modelos de linguagem |
| `jpa-eficaz-as-melhores-praticas-de-persistencia-de-dados` | JPA eficaz — melhores praticas de persistencia de dados em Java |
| `nosql-como-armazenar-os-dados-de-uma-aplicacao-moderna` | NoSQL — armazenamento de dados para aplicacoes modernas |
| `pandas-python` | Pandas com Python — analise de dados e data wrangling |
| `pandas-python-data-wrangling-para-ciencia-de-dados` | Pandas — data wrangling para ciencia de dados com Python |
| `sistemas-de-banco-de-dados` | Sistemas de Banco de Dados com Elmasri e Navathe — modelagem, SQL, normalizacao, transacoes e controle de concorrencia |

