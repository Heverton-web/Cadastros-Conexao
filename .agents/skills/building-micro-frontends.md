---
name: building-micro-frontends
description: >- Micro-frontends com Luca Mezzalira — composicao, roteamento, deploy e migracao
---

# Building Micro-Frontends — Passos Operacionais

## 1. Princípios de Microfrontend
### 1.1 Identificar domínios de negócio
1. Modele microfrontends em torno de domínios de negócio usando DDD — identifique subdomínios (core, support, generic).
2. Use Event Storming com equipes multidisciplinares (produto, dev, QA) para mapear o sistema de ponta a ponta.
3. Subdomínios core = investimento pesado em qualidade e feedback rápido; subdomínios genéricos = soluções prontas ou integração simples.

### 1.2 Aplicar princípios de microsserviços ao frontend
4. **Cultura de automação**: pipelines CI/CD robustos e ciclo de feedback rápido para cada microfrontend.
5. **Ocultar detalhes de implementação**: contratos de API mínimos (token de sessão + ID do produto). Nunca exponha props desnecessárias.
6. **Descentralização**: cada equipe escolhe ferramentas dentro de diretrizes da liderança técnica.
7. **Implantação independente**: cada microfrontend é deployado no seu próprio ritmo, sem coordenação forçada.
8. **Falhas isoladas**: forneça conteúdo alternativo ou oculte microfrontends não essenciais se falharem.
9. **Alta observabilidade**: ferramentas como Sentry, New Relic ou LogRocket em cada microfrontend.

### 1.3 Validar se microfrontends são adequados
10. Use microfrontends quando: software com manutenção a longo prazo, equipe grande, multi-inquilino, substituição de legado iterativa.
11. Evite quando: equipe pequena, aplicativo simples, complexidade da arquitetura supera benefícios.

## 2. Estrutura de Decisão de Microfrontend
### 2.1 Definir o que é um microfrontend no seu projeto
1. Escolha **divisão vertical** (um microfrontend por view/domínio — equipe dona do subdomínio inteiro).
2. Escolha **divisão horizontal** (múltiplos microfrontends na mesma view — reuso entre domínios, exige mais governança).
3. As duas abordagens podem coexistir no mesmo projeto — use a mais adequada para cada subdomínio.

### 2.2 Escolher composição
4. **Composição client-side**: shell carrega microfrontends de uma CDN em runtime. Boa para SPAs, times familiarizados com frontend.
5. **Composição edge-side (ESI)**: CDN monta a view. Adequada para conteúdo estático e alto tráfego, mas suporte varia entre provedores.
6. **Composição server-side**: servidor de origem monta a view. Ideal para SEO, sites de notícias e e-commerce. Exige estratégia de cache e escalabilidade.

### 2.3 Escolher roteamento
7. **Roteamento client-side**: shell gerencia rotas globais (1º nível), microfrontends gerenciam rotas locais (2º nível+).
8. **Roteamento edge-side**: baseado em URL da página, CDN decide qual montagem servir.
9. **Roteamento server-side**: servidor sabe qual modelo HTML corresponde a cada rota.

### 2.4 Definir comunicação entre microfrontends
10. **Eventos de UI**: use emissor de eventos (pub/sub) — prefira a eventos customizados pois é agnóstico a DOM.
11. **Dados compartilhados efêmeros**: use query strings na URL (ex: `?productId=123`).
12. **Dados persistentes**: use Web Storage (localStorage/sessionStorage) ou cookies para tokens e preferências — mesmo subdomínio.
13. **NUNCA use estado global compartilhado entre microfrontends** — é antipadrão, cria acoplamento de deploy.

## 3. Descobrindo Arquiteturas de Microfrontend
### 3.1 Escolher arquitetura com base nas características
1. Avalie: implantabilidade, modularidade, simplicidade, testabilidade, performance, DX, escalabilidade, coordenação (escala 0-5).
2. **Divisão vertical**: notas altas em implantabilidade (5), simplicidade (4), escalabilidade (5). Boa para primeiro contato.
3. **Divisão horizontal**: notas altas em modularidade (5), coordenação baixa. Exige mais governança.

### 3.2 Implementar divisão vertical (composição + roteamento client-side)
4. Crie um **shell de aplicação**: elemento persistente que orquestra microfrontends — gerencia estado inicial, configurações globais, rotas, bibliotecas compartilhadas e tratamento de erros.
5. O shell carrega HTML ou JS como ponto de entrada de cada microfrontend.
6. Separe roteamento: shell gerencia URLs de 1º nível (`/catalog`), microfrontend gerencia 2º nível+ (`/catalog/books`).
7. Use uma das 5 técnicas de composição client-side: ES Modules, SystemJS, Module Federation, Native Federation, análise de HTML (DOMParser).
8. **Module Federation**: use plug-in do bundler (Webpack/Vite/Rspack), configure `shared` para dependências comuns, `exposes` para expor módulos.
9. **Import maps**: use SystemJS como fallback para navegadores sem suporte nativo.
10. Carregue rotas dinamicamente: busque config JSON de um endpoint e registre remotes em runtime (`registerRemotes`).

### 3.3 Implementar sistema de design
11. Camadas: tokens de design (JSON/YAML) → componentes básicos (genéricos, sem lógica de negócio) → biblioteca de UI → microfrontends.
12. Use **Web Components** para o sistema de design — independentes de framework, funcionam em qualquer microfrontend.
13. Automatize validação de versão do design system no CI (ex: Dependabot para manter versões atualizadas).

## 4. Renderização Client-Side (Module Federation)
### 4.1 Configurar o projeto
1. Escolha Module Federation para composição client-side quando o time já conhece o bundler (Webpack/Vite/Rspack).
2. Estrutura: cada microfrontend é uma pasta independente — pode ser monorepo ou polyrepo.
3. Configure o `ModuleFederationPlugin` no bundler: `name`, `filename`, `exposes`, `shared`.

### 4.2 Montar o shell da aplicação
4. O shell (host) declara bibliotecas compartilhadas em `shared` com `singleton: true` e `requiredVersion`.
5. Para evitar conflitos de versão, use `shareScope` diferente para microfrontends com versões distintas da mesma lib.
6. Inicialização assíncrona: `index.js` → `import("./bootstrap")` → `bootstrap.js` monta a app React.
7. Adicione middleware de autenticação no shell (fetch wrapper que anexa JWT), mas cada microfrontend decide se usa.

### 4.3 Registro dinâmico de microfrontends
8. Crie hook `useMfeInitialization` que busca config JSON de um endpoint de descoberta.
9. Registre remotes dinamicamente com `registerRemotes()`.
10. Gere rotas a partir da config: mapeie `path` → `request` (nome do remote + módulo exposto).
11. Use `React.lazy(() => loadRemote(request))` para carregar sob demanda.

### 4.4 Comunicação entre microfrontends na mesma view
12. Crie um `EventEmitter` singleton (biblioteca: `tseep` ou similar).
13. Congele o emissor com `Object.freeze()` para evitar extensão.
14. Injete o emissor via props em cada microfrontend.
15. Namespace os eventos: `cart:itemAdded`, `auth:userLoggedIn`.
16. No componente "meta shell" (ex: MinhaConta), carregue múltiplos remotes e injete o emissor.

### 4.5 Hospedagem e cache
17. **Único storage + CDN**: mais simples, governança centralizada. Recomendado para maioria.
18. **Múltiplos storages + CDN unificada**: mais autonomia para equipes, mas coordenação extra.
19. **Contêineres**: apenas para setores regulamentados (evite para arquivos estáticos).
20. Configure TTL diferente por microfrontend: alto para conteúdo estável (classificação), baixo para conteúdo dinâmico (estoque).

## 5. Renderização Server-Side (SSR)
### 5.1 Decidir quando usar SSR
1. Use SSR para: SEO crítico, conteúdo pesado (e-commerce, notícias), carregamento rápido em conexões ruins.
2. Evite SSR para: aplicações B2B majoritariamente autenticadas — a complexidade não compensa.

### 5.2 Estratégias de cache para SSR
3. CDN: primeira linha de defesa — lida com 80-90% das requisições de conteúdo popular.
4. Cache em memória (Redis): padrão cache-aside para fragmentos HTML — verifique cache antes de consultar servidores.
5. **Cache quente**: pré-carregue dados antes do pico (tarefas periódicas, processos background).
6. Use TTLs escalonados para evitar avalanche de expiração simultânea.
7. Cache de 5-10 segundos já reduz drasticamente carga em picos (ex: Black Friday, eventos esportivos).

### 5.3 Composição SSR — Fragmentos HTML
8. Cada equipe expõe um fragmento HTML via endpoint HTTP.
9. Um **compositor de UI** (orquestrador server-side) busca template base com placeholders.
10. Use descoberta de serviços para resolver endpoints dos fragmentos.
11. Faça requisições paralelas (`Promise.allSettled`) para buscar todos os fragmentos.
12. Trate erros por fragmento: `error` (falha total) ou `hide` (oculta fragmento) — configurável no placeholder.
13. Use streaming para transmitir a página conforme os fragmentos ficam prontos.

### 5.4 Composição SSR — Divisão por URL (Multi-zona)
14. Roteie URLs de 1º nível para aplicações independentes (ex: `/checkout` → app de checkout).
15. Use reescritas na borda/CDN para direcionar tráfego sem poluir o código da aplicação.
16. Componentes compartilhados: compile-time (biblioteca npm) — mais simples que runtime.
17. Autenticação: cookie HttpOnly + Secure + SameSite no domínio base, compartilhado entre zonas.
18. Dados efêmeros entre zonas: query strings. Dados persistentes: APIs de backend.

### 5.5 Monitoramento de performance SSR
19. Use hidratação parcial/retomada: hidrate só partes interativas (Astro, Qwik, Preact).
20. Defina orçamento de performance por microfrontend (tamanho de bundle, LCP alvo).
21. Execute Lighthouse em CI para cada microfrontend.
22. Use monitoramento de usuários reais (RUM) para observar performance real em produção.

## 6. Automação e CI/CD
### 6.1 Princípios de automação
1. Mantenha o ciclo de feedback rápido (pipeline < 8-10 min).
2. Paralelize etapas independentes.
3. Capacite as equipes para gerenciar seus próprios pipelines de build.
4. Defina **guardrails** (limites): ferramentas, dashboard de deploy, fitness functions.
5. Revise e itere a estratégia de automação com frequência.

### 6.2 Estratégia de repositórios
6. **Monorepo**: compartilhamento de código fácil, colaboração entre equipes, mas exige investimento pesado em tooling de escala.
7. **Polyrepo**: isolamento total, estratégia de branch por projeto, menos investimento em tooling, mas maior duplicação.
8. **Híbrido**: agrupe por subdomínio DDD — monorepo dentro do contexto delimitado, polyrepo entre contextos.

### 6.3 Testes
9. Testes unitários e de integração: não mudam em relação a SPAs comuns.
10. **E2E com divisão vertical**: cada equipe testa seu domínio + transições para outros microfrontends (redirecionamentos).
11. **E2E com divisão horizontal**: coordenação entre equipes — defina claramente quem testa o que na view composta.
12. Três opções para E2E: ambiente estável com todos MFE, ambientes on-demand, servidor proxy para montar só o necessário.

### 6.4 Fitness functions (funções de adequação)
13. Tamanho do bundle: defina orçamento por microfrontend e falhe o build se exceder.
14. Métricas de performance: execute Lighthouse/WebPageTest no CI.
15. Análise estática: complexidade ciclomática (SonarQube).
16. Testes de características da arquitetura: verifique limites entre microfrontends (sem dependências diretas entre eles).
17. Cobertura de código.
18. Segurança: verifique vulnerabilidades e conformidade.

### 6.5 Operações específicas
19. Verifique se cada microfrontend usa a versão correta de bibliotecas obrigatórias (design system, logging, observabilidade).
20. SSR compile-time: gere páginas otimizadas com CSS embutido durante o build (não em runtime).

## 7. Descoberta e Deploy
### 7.1 Estratégias de deploy progressivo
1. **Blue-green**: implante nova versão, teste em produção sem expor usuários, depois migre 100% do tráfego.
2. **Canary**: migre tráfego gradualmente (ex: 5% → 20% → 100%), monitore métricas (erro, engajamento).
3. Ambas exigem um roteador (client-side, server-side ou edge).

### 7.2 Frontend Discovery Schema
4. Crie um schema JSON padronizado para descrever microfrontends e suas estratégias de deploy:
   - `url` primária + `fallbackUrl` para resiliência
   - `metadata` (versão, integridade)
   - `deployment` (porcentagem de tráfego, flag `default`)
   - `extras` para extensões específicas (ex: Module Federation prefetch)
5. Hóstee o schema em um endpoint de **serviço de descoberta** (API ou arquivo estático).
6. O shell da aplicação busca o schema no carregamento e registra os remotes dinamicamente.

### 7.3 Integração com Module Federation
7. Hook `useMfeInitialization`: busca `discovery.json`, mapeia para `registerRemotes()`, gera rotas.
8. Resolução canary: atribua usuário a bucket (por ID), avalie configuração pré-definida no schema.
9. Resolução padrão: versão única estável para todos.

### 7.4 Feature flags + Discovery
10. Use discovery para estratégias de implantação (canary, blue-green).
11. Reserve feature flags para configurações de runtime dentro de um microfrontend (ex: fallback de pagamento, desconto promocional).
12. Discovery + flags = controle em camadas: deploy progressivo + ativação seletiva de funcionalidades.

## 8. Padrões de Backend
### 8.1 Dicionário de serviços
1. Crie um JSON listando todos os endpoints de API disponíveis por versão.
2. Cada microfrontend (vertical) ou o shell (horizontal) carrega o dicionário na inicialização.
3. Use versionamento de API para suportar múltiplos clientes sem breaking changes.
4. Para testes em produção: passe header customizado na requisição do dicionário para receber uma config personalizada.

### 8.2 API Gateway
5. Ponto de entrada único para microsserviços: roteamento, autenticação, rate limiting, logging centralizados.
6. Cuidado: pode se tornar ponto único de falha e gargalo de governança.
7. Combine com dicionário de serviços para dar flexibilidade aos clientes.

### 8.3 Backend for Frontend (BFF)
8. Crie um BFF por tipo de cliente (web, mobile, IoT).
9. BFF agrega respostas de múltiplas APIs e retorna estrutura de dados pronta para a view.
10. Use BFF com divisão vertical: cada microfrontend consome seu BFF específico.
11. Com divisão horizontal: avalie se o BFF não cria acoplamento indesejado entre microfrontends.

### 8.4 GraphQL
12. Use GraphQL como ponto de entrada único com federação de esquemas.
13. Projete o schema baseado na estrutura da view (não nos dados do backend).
14. Cada equipe mantém seu esquema e o gateway GraphQL mescla em um supergrafo.
15. Cache: queries idênticas entre microfrontends devem ser cacheadas (cliente e servidor).

### 8.5 Melhores práticas de API
16. **API-first**: defina contratos antes da implementação, use mocks para times trabalharem em paralelo.
17. **Consistência de API**: padronize erros, códigos de resposta, formato de eventos entre microfrontends.
18. **WebSocket**: crie uma única conexão no shell e distribua eventos via emissor para os microfrontends.

## 9. Antipadrões Comuns
### 9.1 Microfrontend vs. Componente
1. Não confunda componente com microfrontend: componente resolve desafio técnico, microfrontend é dono de um domínio de negócio inteiro.
2. Divisão horizontal com mais de 5-7 microfrontends por página = granularidade excessiva.

### 9.2 Estado compartilhado
3. NUNCA use estado global entre microfrontends — é acoplamento de deploy.
4. Cada microfrontend gerencia seu próprio estado interno.
5. Comunicação: use emissor de eventos (pub/sub), não store global.

### 9.3 Anarquia de microfrontends
6. Estabeleça diretrizes técnicas mínimas (guardrails) para evitar proliferação de frameworks.
7. Múltiplos frameworks só como estratégia temporária de migração.
8. Crie comunidades de prática para compartilhar conhecimento e evitar silos.

### 9.4 Camada anticorrupção (ACL)
9. Para integrar sistemas legados: crie um wrapper (microfrontend adaptador) em volta do iframe.
10. O wrapper traduz `postMessage` do legado para eventos no emissor de eventos.
11. O shell da aplicação nunca vê o iframe — o adaptador isola a complexidade.

### 9.5 Compartilhamento unidirecional vs. omnidirecional
12. Fluxo de dados deve ser unidirecional: shell → microfrontends (pai → filho).
13. Compartilhamento bidirecional entre microfrontends cria dependências circulares e dificulta rollback.

### 9.6 Abstração prematura
14. Siga o princípio AHA (Avoid Hasty Abstractions): duplique código primeiro, abstraia só quando o padrão se repetir.
15. DRY em sistemas distribuídos = duplicação de conhecimento e intenção, não apenas de código.

## 10. Migrando para Microfrontends
### 10.1 Planejamento
1. Use abordagem **iterativa**, nunca big bang.
2. Comece com **prova de conceito**: 3 pessoas, 3 semanas para um módulo de alto impacto.
3. Use o padrão **Strangler Fig**: roteador na borda direciona requisições para o novo MFE ou para o legado.
4. Migre páginas inteiras ou grupos de páginas — evite misturar MFE e legado na mesma view.

### 10.2 O que migrar primeiro
5. Escolha novas funcionalidades ou grandes reformulações (já há investimento).
6. Prefira módulos isolados e de baixo risco para o primeiro piloto.
7. Crie o primeiro microfrontend do zero (não extraia do monolito) para aprender todo o ciclo.

### 10.3 Manter consistência de UX
8. Invista em um sistema de design (comece com tokens de design, evolua para Web Components).
9. Não reutilize componentes do monolito — crie novos componentes modulares.
10. Aceite inconsistência temporária — o valor entregue compensa.

### 10.4 Dependências e versionamento
11. Não tema duplicação entre legado e MFE — é melhor que acoplamento.
12. Versionamento dos MFEs é independente do monolito.
13. Divida por URL de 1º nível para isolar domínios e dependências.

### 10.5 Questões transversais
14. **Roteamento**: centralize na borda (CDN/edge computing). Use URLs absolutas para navegar entre sistemas.
15. **Estado**: query strings para dados efêmeros, APIs de backend para dados persistentes.
16. **Autenticação**: mesmo subdomínio para compartilhar cookies. Tokens de refresh em ambos os sistemas.

### 10.6 Microsserviços são opcionais
17. Microfrontends funcionam com qualquer backend (monolito, microsserviços, monolito modular).
18. Modernize o frontend primeiro (stateless, mais rápido), o backend depois.

## 11. Organizacional
### 11.1 Convencer stakeholders
1. Fale a língua do negócio: entregas mais rápidas, menor risco, melhor ROI.
2. Colete métricas de baseline: tempo de deploy, frequência de erros, velocidade de entrega.
3. Use análise de trade-off: requisitos de negócio × características da arquitetura × capacidades organizacionais.
4. Execute prova de conceito para demonstrar valor antes de expandir.

### 11.2 Estrutura de equipes
5. **Equipes multifuncionais (feature teams)**: recomendadas para divisão horizontal — cada equipe dona de ponta a ponta.
6. **Equipes de componente**: melhor para divisão vertical com aplicações multiplataforma (web + mobile).
7. Alinhe times por subdomínios DDD e jornadas do usuário (não por camadas técnicas).

### 11.3 Governança e comunicação
8. RFCs: para propor mudanças técnicas, coletar feedback assíncrono, documentar decisões.
9. ADRs (Architecture Decision Records): contexto + decisão + justificativa. Fornece panorama histórico.
10. Comunidade de prática (fóruns quinzenais/mensais de frontend): compartilhe boas práticas, evite silos.
11. Reuniões all-hands de tecnologia para alinhamento geral.
12. Planejamento em grupo (1-2 dias) para mapear dependências entre equipes.

### 11.4 Descentralização
13. Times descentralizados com autonomia de decisão dentro de guardrails técnicos.
14. Líderes técnicos atuam como suporte e facilitadores, não como tomadores de decisão centralizados.
15. Revise fluxos de comunicação trimestralmente — atrito entre equipes = sinal de problema (arquitetura ou organização).
