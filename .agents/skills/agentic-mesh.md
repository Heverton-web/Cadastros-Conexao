---
name: agentic-mesh
description: Constrói e opera ecossistemas de agentes empresariais — arquitetura, descoberta, comunicação, segurança, governança e implantação em escala.
---

# Agentic Mesh — Passos Operacionais

## 1. ARQUITETURA DE AGENTES (Cap. 5)

### 1.1 Definir Princípios do Agente
1. Definir **Confiável e Responsável** — agente adere ao propósito declarado e políticas corporativas/éticas/regulatórias
2. Definir **Confiável e Durável** — agente fornece resultados precisos (ex.: 99,999%) e mantém conversas longas (minutos a dias)
3. Definir **Explicável e Rastreável** — cada etapa, ferramenta e colaborador registrado para auditoria; passo a passo disponível para revisão
4. Definir **Colaborativo e Inteligente** — agente colabora autonomamente com outros agentes e ferramentas

### 1.2 Certificar um Agente
1. Submeter documentação técnica: finalidade, políticas, arquitetura, algoritmos, parâmetros operacionais
2. Realizar análise da documentação — avaliar conformidade com políticas, riscos, especificações
3. Desenvolver protocolos de teste e simular ambiente operacional
4. Revisão iterativa: desenvolvedores + avaliadores corrigem discrepâncias
5. Revisar ambiente de implantação (fontes de dados, integrações, monitoramento)
6. Emitir certificação formal atestando conformidade
7. Publicar métricas detalhadas e relatórios de conformidade
8. Manter vigilância contínua com auditorias regulares e reavaliações periódicas

### 1.3 Projetar Componentes do Agente
1. Implementar **Cérebro (LLM)** — interpreta entradas em linguagem natural, raciocina, planeja
2. Implementar **Memória** — conhecimento nativo (pesos LLM), contexto transitório, repositórios externos (RAG)
3. Implementar **Engenharia de Contexto** — selecionar, estruturar e fornecer informação correta ao LLM no momento certo
4. Implementar **Ferramentas** — capacidades especializadas que o agente pode invocar

### 1.4 Gerenciar Tarefas do Agente
1. **Criar Plano de Tarefas** — UUID + lista de etapas (sequenciais ou DAG); cada etapa contém: ID, colaborador/ferramenta, parâmetros, status, resultados
2. **Identificar Colaboradores e Ferramentas** — pesquisar inventário no registro; inserir nome do colaborador/ferramenta em cada etapa
3. **Substituir Parâmetros** — LLM extrai da solicitação e mapeia para parâmetros exigidos por cada agente/ferramenta
4. **Executar Plano** — LLM-driven (flexível, não-determinístico) OU programático (determinístico, repetível, explicável)

### 1.5 Implementar Modelos de Mensagem
1. **Solicitação-Resposta** — síncrono, interações imediatas (ideal para trocas simples)
2. **Filas de Mensagens** — assíncrono, desacopla remetente/destinatário
3. **Orientado a Eventos/Streaming** — agentes inscritos em fluxos contínuos de eventos
4. **Arquitetura Baseada em Atores** — cada agente processa mensagens e mantém estado próprio
5. **Espaços de Trabalho Compartilhados** — ambiente colaborativo para dados e ideias comuns

### 1.6 Gerenciar Conversas entre Agentes
1. Definir tipos de interação: saudações/discussão (contexto), informacional (dados), solicitação de tarefa (comandos), status (progresso)
2. Manter histórico da conversa como árvore de chamadas (serial ou paralela)
3. Gerenciar estado do agente: estado de runtime, histórico da conversa, status da tarefa, estado da tarefa
4. Persistir estado em banco de dados (não apenas em memória) para suportar reinicialização e recuperação

### 1.7 Definir Identidade e Funções
1. Atribuir **FQN (Fully Qualified Name)** — namespace + nome local (ex.: brodagroupsoftware:bank-agent)
2. Registrar identidade no **IBOR (Identity Book of Record)**
3. Atribuir função com RBAC (Role-Based Access Control) para acesso a agentes, ferramentas e dados

### 1.8 Configurar Agente
1. Definir **Identidade, Descrição e Propósito** em linguagem natural
2. Definir **Estratégia de Execução de Tarefas** — instruções passo a passo em linguagem natural
3. Definir **Configuração de Segurança** — função, mTLS, OAuth2
4. Definir **Políticas e Certificação** — diretrizes de governança + certificações associadas
5. Definir **Visibilidade** — modelos de confiança zero: nenhum agente/ferramenta visível por padrão; conceder explicitamente via FQN ou regex

## 2. AGENTES DE NÍVEL EMPRESARIAL (Cap. 6)

### 2.1 Projetar Microagentes (Microsserviços)
1. Implementar cada agente como microsserviço independente e conteinerizado
2. Cada agente possui endpoint REST, capacidade própria, segurança, colaboração e gestão de tarefas
3. Registrar agentes em registro compartilhado para descoberta dinâmica

### 2.2 Implementar Segurança
1. Configurar **mTLS** — autenticação bidirecional com certificados digitais; toda comunicação criptografada
2. Configurar **Segurança de Contêineres** — isolar cada agente com perímetro de segurança próprio
3. Configurar **Segurança Kubernetes** — namespaces, network policies, RBAC, service accounts

### 2.3 Garantir Confiabilidade
1. **Decomposição de Tarefas** — orquestrador LLM analisa solicitação, cria plano, atribui etapas a modelos especializados
2. **Execução Determinística** — desacoplar planejamento (LLM) da execução (programática); componentes operam com sobreposição mínima
3. **Especialização** — usar múltiplos modelos menores e ajustados para tarefas específicas em vez de um modelo monolítico

### 2.4 Implementar Explicabilidade
1. Tratar planos de tarefas como artefatos de primeira classe
2. Registrar: criação do plano, seleção de agentes/ferramentas, substituição de parâmetros
3. Associar ID único (IID) a cada solicitação — persiste em todas as etapas e sub-etapas
4. Para agentes orientados a objetivos, usar GID (Goal ID) rastreado no espaço de trabalho

### 2.5 Implementar Descoberta de Agentes
1. Configurar registro com esquema padronizado: propósito, capacidades, propriedade, status operacional, políticas
2. Definir regras de escopo de visibilidade: FQNs ou expressões regulares
3. Agentes consultam registro via API para encontrar colaboradores durante planejamento

### 2.6 Implementar Observabilidade e Operabilidade
1. Configurar monitor: rastrear cada solicitação por IID; registrar execução de cada etapa do plano
2. Expor métricas: total de solicitações, latência, taxa de erro, chamadas de API
3. Implementar operabilidade: iniciar/parar agentes, provisionar recursos, reverter versões

### 2.7 Testar Agentes
1. Testar caminhos esperados e casos extremos
2. Testar vulnerabilidade a injeção de prompt
3. Pensar como atacante durante os testes

## 3. MALHA AGÉTICA — ECOSSISTEMA (Cap. 7)

### 3.1 Componentes da Malha
1. **Registro** — catálogo central de agentes, ferramentas, espaços de trabalho
2. **Monitor** — coleta métricas e rastreia execução de solicitações (IID/GID)
3. **Servidor de Interações** — APIs para iniciar/gerenciar conversas e interações
4. **Mercado (Marketplace)** — interface amigável para usuários descobrirem e interagirem com agentes
5. **Bancadas de Trabalho** — interface para desenvolvedores criarem, configurarem e implantarem agentes
6. **Proxy** — ponto único de entrada com autenticação, autorização e políticas de segurança

### 3.2 Gerenciar Ciclo de Vida no Registro
1. **Registro** — definir configuração do agente (metadados, colaboradores, abordagem, espaços de trabalho, políticas de segurança) e enviar ao registro
2. **Descoberta** — agentes consultam registro via API para encontrar outros agentes, filtrados por visibilidade
3. **Histórico** — registro mantém histórico de conversas e interações
4. **Desativação** — marcar agente como excluído; encerrar instâncias em execução

### 3.3 Implementar Estrutura de Confiança
1. Publicar padrão de comportamento como política no registro
2. Criadores solicitam certificação ao aprovador
3. Aprovador revisa comportamento, testa conformidade
4. Aprovador certifica o agente — certificação exibida nos metadados

### 3.4 Operar a Malha
1. Coletar estatísticas agregadas: solicitações por agente, origem das solicitações, gargalos
2. Controlar agentes individualmente: desligar, reiniciar, reverter versões, provisionar recursos
3. Gerenciar ciclo de vida completo: criação → registro/publicação → execução → certificação → atualização → desativação

### 3.5 Projetar Frotas de Agentes
1. Definir frota como agrupamento lógico de agentes com missão compartilhada
2. Coordenação orientada a eventos (pub/sub), não RPC direto
3. Manter camada de memória/contexto compartilhada como âncora de coordenação
4. Suportar escalonamento elástico — gerar/desativar agentes dinamicamente
5. Implementar tolerância a falhas — comunicação assíncrona, filas duráveis (NATS JetStream, Kafka)

## 4. EXPERIÊNCIA DO USUÁRIO (Cap. 8)

### 4.1 Projetar Interface do Mercado
1. Implementar login único (SSO) com funções que abrangem todo o processo
2. Criar tela inicial para orientação e descoberta de agentes
3. Implementar mercado bilateral: consumidores descobrem agentes verificados; criadores publicam com controle de versão e visibilidade

### 4.2 Projetar Painéis
1. **Painel do Consumidor** — conversar com agentes, colaborar em espaços de trabalho compartilhados
2. **Painel do Criador** — publicar, certificar e versionar agentes
3. **Painel de Confiança** — certificações, políticas, conformidade
4. **Painel do Operador** — monitorar execução, controlar agentes, visualizar logs

## 5. REGISTRO DE MALHA (Cap. 9)

### 5.1 Modelar Entidades do Registro
1. **Agentes** — nome, versão, propósito, descrição, abordagem, funções, políticas, certificações, colaboradores, ferramentas
2. **Conversas** — conversation_id, timestamp, participantes (name + role), state (ACTIVE/INACTIVE)
3. **Interações** — interaction_id, start/complete_timestamp, owner, step_id, collaborator, state, prompt, parameters, results
4. **Espaços de Trabalho** — workspace_id, goals (goal_id, name, description, state), messages (message_id, participant_id, content, interaction_id)
5. **Políticas** — policy_id, name, purpose, description + certificações (certification_id, username, state, timestamp)
6. **Usuários** — user_id, name, email, state (ACTIVE/SUSPENDED/DEACTIVATED)

### 5.2 Considerações de Implementação
1. Gerenciamento de esquemas com versionamento e compatibilidade reversa
2. Eventos e notificações via barramento pub/sub para alterações no registro
3. Log de auditoria imutável para todas as ações de acesso/modificação
4. Resolução de conflitos e controle de concorrência
5. Exclusões lógicas e arquivamento com períodos de retenção
6. Gestão de mudanças com aprovações em etapas e reversão
7. Integração com sistemas externos (IAM, logs centralizados, catálogos de dados)
8. Criptografia em repouso e em trânsito
9. Escalabilidade para milhões de agentes
10. Backup e recuperação de desastres entre regiões

## 6. GESTÃO DE INTERAÇÃO (Cap. 10)

### 6.1 Padrões de Interação
1. **Interação Pessoa-Agente** — usuário envia solicitação via marketplace; servidor de interações inicia conversa
2. **Interação Agente-Agente** — agentes comunicam via eventos, mensagens, contexto compartilhado
3. **Conversas** — preservam continuidade e intenção; compostas por múltiplas interações
4. **Espaços de Trabalho** — ambientes de colaboração compartilhados para múltiplos agentes coordenarem tarefas

### 6.2 Gerenciar Estado e Continuidade
1. Manter interações de longa duração com persistência de contexto
2. Suportar recuperação de falhas com estado preservado
3. Implementar estrutura orientada a eventos para confiabilidade em tempo real

## 7. SEGURANÇA (Cap. 11)

### 7.1 Implementar TLS Mútuo (mTLS)
1. Configurar certificados para autenticação bidirecional entre todos os agentes
2. Criptografar toda a comunicação entre agentes ponta a ponta
3. Impedir ataques man-in-the-middle

### 7.2 Implementar Autenticação e Autorização
1. Integrar com sistema BOR (Book of Record) existente da empresa para autenticação de usuários
2. Implementar OAuth2 para autorização baseada em grupos
3. Atribuir identidades únicas para agentes com seu próprio sistema de permissões
4. Usar RBAC para controle de acesso a agentes e ferramentas individuais
5. Aplicar princípio do menor privilégio

### 7.3 Gerenciar Segredos
1. Armazenar segredos em cofre seguro (ex.: Amazon Cognito, HashiCorp Vault)
2. Separar credenciais do LLM — código não-LLM gerencia autenticação
3. Rotacionar segredos periodicamente
4. Nunca expor segredos ao LLM diretamente

### 7.4 Prevenir Injeção de Prompt
1. Validar entrada do usuário contra padrões esperados (tipo, formato, tamanho)
2. Rejeitar entradas que imitam prompts de sistema ou saídas intermediárias
3. Demarcar claramente seções de entrada do usuário vs instruções do sistema
4. Alertar LLM contra tipos conhecidos de injeção
5. Limitar acesso do agente ao mínimo necessário
6. Construir ferramentas que não exponham dados sensíveis ao LLM
7. Testar agentes contra injeção de prompt

### 7.5 Prevenir LLM Jailbreaking
1. Usar modelos mais capazes e atualizados (melhores em detectar ataques)
2. Testar agentes contra vários tipos de ataque
3. Restringir acesso: limitar quem pode acessar e taxa de solicitações

### 7.6 Monitorar Comportamento
1. Estabelecer baseline de comportamento normal (solicitações típicas, padrões de comunicação)
2. Detectar anomalias: número excepcional de solicitações, mensagens entre pares
3. Para agentes com acesso a dados críticos: quarentena automatizada

### 7.7 Implementar Recuperação de Desastres
1. Administradores podem desligar agentes comprometidos
2. Rotacionar segredos sob controle da malha
3. Remover segredos comprometidos da malha
4. Realizar backup regular de todo o registro e configurações
5. Restaurar a partir de backups para estado anterior conhecido

## 8. ESTRUTURA DE CONFIANÇA E GOVERNANÇA (Cap. 12)

### 8.1 Implementar Framework de Confiança em 7 Camadas
1. **Camada 1: Identidade e Autenticação** — identidade criptográfica, certificados digitais, mTLS; integração com LDAP/AD/Keycloak/Okta; rotação/renovação/revogação de credenciais
2. **Camada 2: Autorização e Controle de Acesso** — OAuth2 com tokens JWT; RBAC/ABAC; modelo Zero Trust (nunca confie, sempre verifique); menor privilégio; Open Policy Agent para decisões em runtime
3. **Camada 3: Propósito e Políticas** — declarações estruturadas em linguagem natural do propósito e restrições; políticas legíveis por humanos e máquinas
4. **Camada 4: Planejamento e Explicabilidade** — capturar plano de tarefas (etapas, ferramentas selecionadas, parâmetros); expor raciocínio do agente
5. **Camada 5: Observabilidade e Rastreabilidade** — logs estruturados com ID de tarefa consistente; correlação entre ações em fluxos multiagentes; painéis de monitoramento
6. **Camada 6: Certificação e Conformidade** — processo formal de avaliação (propósito, permissões, conformidade); recertificação periódica; metadados legíveis por máquina
7. **Camada 7: Governança e Ciclo de Vida** — conselhos/governança formal; proprietário designado para cada agente; fases: definição → projeto/construção/teste → integração → implantação → operações/monitoramento → certificação/adaptação → desativação

### 8.2 Governança de Agentes na Prática
1. Definir conselho de governança (interno ou multipartidário)
2. Cada agente tem proprietário responsável designado
3. Estabelecer processos para escalonamento de incidentes, quarentena e investigação
4. Integrar governança além das fronteiras organizacionais

## 9. FÁBRICA DE AGENTES (Cap. 14)

### 9.1 Ciclo de Desenvolvimento de Agentes (SDLC)
1. **Conceitualização** — identificar tarefa que pode ser melhorada com agente; validar se agente é a solução adequada
2. **Análise de Requisitos** — definir entradas, saídas, tratamento de eventos inesperados, critérios de sucesso
3. **Projeto** — determinar agentes/ferramentas necessários; definir regras de acesso para outros agentes
4. **Construção** — criar configuração do agente, integrar ferramentas e agentes, criar novas ferramentas se necessário
5. **Aceitação** — testes automatizados (incluindo injeção de prompt), testes de QA, critérios de aceitação
6. **Implantação** — promover agente para produção; iniciar e disponibilizar na malha
7. **Manutenção** — novos recursos, correções de bugs, novas versões
8. **Desativação** — avisar usuários, redirecionar para substitutos, desligar

### 9.2 Construir Agentes em Escala
1. Criar **modelos (templates)** reutilizáveis de agentes com ferramentas, abordagens e configurações padrão
2. Armazenar modelos em biblioteca; criar agentes a partir de modelos preenchendo apenas diferenças
3. Certificar modelos, não apenas agentes individuais — alterações limitadas não quebram certificação

### 9.3 Organizar Frotas
1. **Hierarquia** — agente gerente no topo, controla fluxo; funcionários têm visão limitada; controle centralizado, previsível
2. **Enxame** — sem agente gestor; todos são pares com comunicação direta; flexível, auto-organizável
3. **Federação** — múltiplos agentes gerentes como pares; cada um com seus funcionários; meio-termo entre hierarquia e enxame

### 9.4 Construir Frotas
1. Selecionar tipo de organização adequado à tarefa
2. Definir entradas e saídas da frota
3. Selecionar agentes existentes (modelos) em vez de criar novos sempre que possível
4. Construir núcleo: agentes para tarefas principais + capacidades de suporte + comunicação

### 9.5 Operar Frotas em Escala
1. **Implantar** — usar Kubernetes (pods) para gerenciar frota como unidade; confiança zero com certificados de curta duração
2. **Monitorar** — agregar métricas em nível de frota; usar agentes observadores de frota para resumir logs
3. **Atualizar** — passar pelo pipeline DevOps; manter versões antigas compatíveis; desativar gradualmente
4. **Desativar** — suspender novas solicitações, permitir conclusão das em andamento, depois desligar

## 10. ROTEIRO DE IMPLEMENTAÇÃO (Cap. 15)

### 10.1 Fluxo 1: Fundamentos Estratégicos
1. **Fase 1 — Formular Estratégia**: definir visão de negócios, objetivos, escopo (domínios/geografias delimitados), casos de uso iniciais, métricas de sucesso mensuráveis
2. **Fase 2 — Projeto Arquitetônico**: arquitetura conceitual para agentes (segurança, observabilidade, descoberta, explicabilidade) e frotas (orquestração, resiliência, escala); ferramentas, modelos e memória
3. **Fase 3 — Pipeline de Candidatos**: catalogar oportunidades; classificar por viabilidade, valor comercial e potencial de demonstração
4. **Fase 4 — Selecionar MVP**: escopo restrito, mas que teste recursos arquitetônicos críticos; segurança e governança inegociáveis; demonstração clara para negócios e técnica

### 10.2 Fluxo 2: Construção Tecnológica / Industrialização
1. **Base Tecnológica**:
   - Fase 1: Infraestrutura de dados e estado (esquema de estado, armazenamento centralizado, logs de auditoria)
   - Fase 2: Gateways de mensagens/streaming/API (NATS JetStream/Kafka, gateways com rate limiting e auth)
   - Fase 3: Integrar modelos + formalizar ambientes (dev/test/homolog/prod)
2. **Industrialização**:
   - Fase 1: Observabilidade e monitoramento (logs, tracing, métricas em formato consistente)
   - Fase 2: Alta disponibilidade + CI/CD (redundância, replicação, failover, deploy automatizado)
   - Fase 3: Otimizar para escala e eficiência (auto-scaling, visibilidade de custos, balanceamento)
3. **Base Segura**:
   - Fase 1: Controles de identidade e acesso (credenciais criptográficas, RBAC/ABAC)
   - Fase 2: Comunicação segura (mTLS, OAuth2/JWT, gerenciamento de segredos)
   - Fase 3: Confiança zero universal (auth contínua, real-time authorization, red team)
4. **Gerenciar Modelos e Operações**:
   - Fase 1: Registro e fornecimento de modelos (catálogo centralizado com metadados, owner, versão)
   - Fase 2: Pipelines de treinamento/ajuste fino/versionamento (automatizado, com reversão)
   - Fase 3: Monitoramento, detecção de desvios e governança contínua

### 10.3 Fluxo 3: Fábricas de Agentes e Frotas
1. **Estrutura de Agentes Enterprise**:
   - Etapa 1: Padronizar bases (microsserviços conteinerizados, health checks, telemetria)
   - Etapa 2: Descoberta e registro (diretório central, metadados padronizados)
   - Etapa 3: Observabilidade e operabilidade (logs, métricas, restarts controlados, auto-scaling)
   - Etapa 4: Conformidade com políticas e segurança (identidade criptográfica, políticas em runtime, cofre de segredos)
2. **Estrutura de Ecossistema/Frotas**:
   - Etapa 1: Plano de controle (governança central, registro, políticas, observabilidade em nível de ecossistema)
   - Etapa 2: Mercado e registro (catálogo interno, taxonomia, busca, recomendação)
   - Etapa 3: Descoberta e observabilidade em todo o ecossistema (protocolos de descoberta, painéis em nível de frota)
   - Etapa 4: Confiabilidade e segurança do ecossistema (manuais operacionais, políticas automatizadas, quarentena)
3. **DevSecOps para Agentes/Frotas**:
   - Etapa 1: Padronizar fluxos de desenvolvimento (templates, SDKs, análise estática, testes unitários)
   - Etapa 2: Segurança desde a concepção (scanners de vulnerabilidade, cofre de segredos, verificações de identidade)
   - Etapa 3: Automatizar testes e certificação (testes de integração, regressão, resiliência; certificação como resultado automatizado)
   - Etapa 4: Implantação contínua e transparência (CI/CD, reversão, escalonamento dinâmico, auditoria)
4. **Fábrica de Agentes**:
   - Etapa 1: Modelos e frameworks (conteinerização, observabilidade, identidade, ciclo de vida)
   - Etapa 2: SDKs e bibliotecas compartilhadas (conexão padronizada com barramento, workspace, memória)
   - Etapa 3: Conectores e pontos de integração (conectores certificados e mantidos centralmente)
   - Etapa 4: Automatizar ciclo de vida e montagem (validação, conformidade, certificação automatizada)
5. **Fábrica de Frotas**:
   - Etapa 1: Definir topologias (hierárquica, peer-to-peer, híbrida)
   - Etapa 2: Codificar orquestração (divisão de tarefas, resolução de conflitos, escalonamento)
   - Etapa 3: Ambientes de teste e protocolos de resiliência (simular carga, falhas, cenários adversos)
   - Etapa 4: Automatizar ciclo de vida e certificação (auto-scaling, certificação contínua de frotas)

### 10.4 Fluxo 4: Modelo Organizacional e Operacional
1. **Estabelecer Novo Modelo Operacional**:
   - Fase 1: Definir funções (proprietário de agente, gestor de frota, líder de governança); redesenhar processos (checkpoints de certificação, auditorias de ciclo de vida)
   - Fase 2: Integrar agentes gradualmente (supervisão direta inicial → agentes gerenciando agentes)
2. **Gerenciar Mudanças**:
   - Fase 1: Alinhar liderança executiva com narrativa estratégica; engajar gerentes médios
   - Fase 2: Ampliar socialização (demonstrações, feiras de agentes, ambientes de teste)
3. **Treinar Equipe**:
   - Fase 1: Alfabetização em agentes (como funcionam, como interpretar resultados) + governança e ética
   - Fase 2: Habilidades de colaboração delegar/revisar/feedback + especialização por função

### 10.5 Fluxo 5: Governança e Certificação
1. **Governança e Certificação de Agentes**:
   - Fase 1: Estabelecer identidade e propósito (credenciais criptográficas + propósito declarado)
   - Fase 2: Implementar controles de política (regras legíveis por máquina em tempo de execução)
   - Fase 3: Certificar e delegar responsabilidades (certificação obrigatória antes de produção)
2. **Governança e Certificação de Frotas**:
   - Fase 1: Definir regras e padrões (interoperabilidade, resiliência, ética)
   - Fase 2: Modelar riscos sistêmicos (comportamentos emergentes, conformidade regulatória)
   - Fase 3: Certificar frotas (testes de resiliência, conformidade ética e regulatória; proprietários responsáveis)
