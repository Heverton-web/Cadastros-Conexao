---
name: eu-ai-act-guide
description: Guia operacional de conformidade com a Lei de IA da UE — classificação de risco, documentação, auditoria, checklist
---

# EU AI Act Guide — Passos Operacionais

## 1. INVENTÁRIO E CLASSIFICAÇÃO DE RISCO (Cap.4)

### 1.1 Criar Inventário de Sistemas de IA
1. Identificar aplicações de IA em todos os departamentos.
2. Incluir IA desenvolvida internamente E soluções de IA de terceiros.
3. Documentar detalhes: departamento, finalidade, dados utilizados, status de implantação e categoria de risco.

### 1.2 Determinar Aplicabilidade da Lei
1. O sistema se enquadra na definição de "sistema de IA" (Art.3)?
2. Está dentro do escopo da Lei com base na finalidade de uso e classificação de risco?
3. É considerado de alto risco? Aplicam-se obrigações de transparência?
4. Identificar o papel da organização: provedor (provider) ou implementador (deployer).

### 1.3 Classificar Nível de Risco
1. **Risco Inaceitável (proibido):** técnicas subliminares manipulativas, exploração de vulnerabilidades, categorização biométrica sensível, pontuação social, reconhecimento facial em espaços públicos (exceto exceções legais), predição de criminalidade, criação de bancos de dados faciais sem permissão, reconhecimento de emoções em trabalho/escola.
2. **Alto Risco:** sistemas que afetam saúde, segurança, direitos fundamentais (Art.6 + Anexo III).
3. **Risco Limitado:** sistemas que interagem diretamente com humanos — obrigações de transparência (Art.50).
4. **Risco Mínimo:** sem obrigações específicas.

## 2. CRISP-ML(Q) — CICLO DE VIDA DE ML COM GARANTIA DE QUALIDADE (Cap.2)

### 2.1 Compreensão de Negócios e Dados
1. Definir objetivos de negócio e critérios de sucesso.
2. Identificar fontes de dados, coletar dados iniciais.
3. Descrever, explorar e verificar a qualidade dos dados.
4. Realizar colaboração estreita entre stakeholders de negócio e equipe de dados.

### 2.2 Preparação dos Dados
1. Selecionar dados relevantes.
2. Limpar dados (valores ausentes, outliers, inconsistências).
3. Construir dados (engenharia de atributos).
4. Integrar dados de múltiplas fontes.
5. Formatar dados para modelagem.
6. Documentar conjunto(s) final(is) e processo de construção.

### 2.3 Modelagem
1. Selecionar técnicas de modelagem apropriadas.
2. Gerar projeto de teste (divisão treino/teste/validação).
3. Construir modelo(s) — comparar múltiplas abordagens.
4. Avaliar modelo usando validação cruzada e métricas apropriadas.
5. Incorporar conhecimento de domínio.
6. Selecionar modelo(s) de melhor desempenho.

### 2.4 Avaliação do Modelo
1. Avaliar resultados de previsão em dados independentes.
2. Revisar processo de desenvolvimento.
3. Examinar explicabilidade e robustez do modelo.
4. Verificar com stakeholders de negócio se critérios de sucesso foram atingidos.
5. Decidir próximos passos: aprovação final ou retorno para fases anteriores.

### 2.5 Implantação do Modelo
1. Planejar implantação (estratégia: shadow, canary, blue/green).
2. Planejar monitoramento e manutenção.
3. Elaborar relatório final.
4. Revisar projeto.

### 2.6 Monitoramento e Manutenção
1. Monitorar dados de entrada, previsões do modelo e resultados de negócio continuamente.
2. Avaliar modelo periodicamente.
3. Retreinar/atualizar modelo conforme necessário para evitar deriva (data drift, concept drift).
4. Manter aplicação de ML com base em necessidades de negócio em evolução.

## 3. MLOPS STACK CANVAS — INFRAESTRUTURA TÉCNICA (Cap.2)

### 3.1 Proposta de Valor
1. Definir clientes-alvo e suas necessidades.
2. Articular nome, categoria e principal benefício do produto.
3. Identificar concorrência e diferenciação.
4. Responder: O que estamos tentando fazer? Qual o problema? Por que é importante?

### 3.2 Gerenciamento de Dados e Código
1. **Fontes de Dados e Versionamento:** estimar custo de aquisição/armazenamento, definir estratégia de versionamento de dados.
2. **Análise de Dados e Gestão de Experimentos:** definir linguagem, métricas de avaliação, metadados para reprodutibilidade.
3. **Repositório de Recursos (Feature Store):** decidir necessidade, projetar APIs, escolher bancos de dados.
4. **Fundamentos DevOps:** avaliar CI/CD existente, controle de versão de código, monitoramento de desempenho, métricas DORA.

### 3.3 Gerenciamento de Modelos
1. **CI/CD/CT — Orquestração de Pipeline:** definir frequência/gatilho de retreinamento, fluxo de pipeline, testes de requisitos não funcionais.
2. **Registro e Versionamento de Modelos:** estabelecer registro de modelos, padrão de versionamento (ex: semver).
3. **Implantação de Modelos:** definir formato de entrega, ambiente alvo, política de lançamento, estratégia de implantação.
4. **Serviço de Previsão:** definir modo (online/batch), padrão (MaaS/MaaD/Precompute/Híbrido), verificações de entrada/saída.
5. **Monitoramento:** definir métricas de ML, métricas de domínio, detecção de degradação, estratégia de alerta, gatilhos de retreinamento.

### 3.4 Gerenciamento de Metadados
1. Coletar metadados de código, dados e modelos (ID de execução, etapas, timestamps, divisão treino/teste, hiperparâmetros).
2. Definir estratégia de documentação (tratar documentação como código).
3. Coletar métricas operacionais (tempo de restauração, % falhas em alterações).

## 4. ENGENHARIA DE IA PARA SISTEMAS DE ALTO RISCO (Cap.5)

### 4.1 Artigo 9 — Sistema de Gestão de Riscos

**Pré-desenvolvimento:**
1. Definir metodologias e ferramentas de avaliação de riscos.
2. Elaborar plano de gestão de riscos alinhado à Lei de IA da UE.
3. Estabelecer registro de riscos centralizado e estratégia de documentação.

**Compreensão de Negócios e Dados:**
4. Realizar workshop de identificação de riscos com stakeholders.
5. Documentar riscos potenciais no registro de riscos.
6. Realizar avaliação de impacto ético.
7. Alinhar objetivos do projeto com valores organizacionais e requisitos de compliance.

**Preparação dos Dados:**
8. Avaliar qualidade, integridade e representatividade dos dados.
9. Garantir que conjuntos de dados estejam livres de viés discriminatório.
10. Identificar e documentar riscos relacionados a dados (viés, privacidade, deriva).
11. Implementar versionamento e rastreamento de linhagem de dados.
12. Projetar e implementar testes de validação de dados.

**Modelagem:**
13. Realizar avaliações de vulnerabilidade do modelo.
14. Validar arquitetura do modelo quanto a explicabilidade e robustez.
15. Implementar versionamento de código e artefatos do modelo.
16. Projetar e implementar testes unitários para componentes do modelo.
17. Documentar arquitetura e decisões de projeto.
18. Implementar testes de integração para pipeline de ML.
19. Simular casos extremos e testar comportamento sob condições extremas.

**Avaliação:**
20. Executar conjuntos de testes abrangentes (unitários, integração, sistema).
21. Realizar testes adversários e documentar vulnerabilidades e estratégias de mitigação.
22. Avaliar desempenho contra objetivos comerciais, éticos e finalidade pretendida.
23. Incluir métricas de alinhamento de valor: justiça, explicabilidade, robustez, segurança.
24. Atualizar registro de riscos com base nos resultados.
25. Realizar testes A/B em ambientes controlados.
26. Engajar especialistas de domínio para validar métricas.

**Implantação:**
27. Realizar auditoria de segurança pré-implantação.
28. Implementar sistema de monitoramento e alerta contínuo.
29. Configurar testes de regressão automatizados.
30. Estabelecer mecanismos de feedback para usuários finais e stakeholders.
31. Assegurar que medidas de mitigação de riscos (ex: reversão) estejam operacionais.
32. Integrar verificações de controle de qualidade ao processo de implantação.

**Monitoramento e Manutenção:**
33. Implementar monitoramento automatizado para data drift, concept drift e degradação.
34. Definir limites e configurar alertas para métricas críticas.
35. Realizar auditorias internas regulares de desempenho.
36. Realizar testes periódicos de engenharia do caos.
37. Atualizar registro de riscos regularmente com base em informações operacionais.
38. Agendar revisões periódicas de diretrizes éticas e alinhamento de valor.

### 4.2 Artigo 10 — Dados e Governança de Dados

**Compreensão de Negócios e Dados:**
1. Estabelecer estrutura de governança de dados alinhada à Lei de IA da UE.
2. Definir funções e responsabilidades para gestão de dados.
3. Definir e documentar métricas e padrões de qualidade de dados.
4. Manter documentação de todas as fontes de dados (incluindo credibilidade).
5. Verificar e registrar termos de licenciamento e direitos de uso.
6. Avaliar requisitos de proteção de dados.
7. Validar confiabilidade das fontes de dados.
8. Analisar perfil dos conjuntos de dados existentes.
9. Documentar problemas conhecidos de qualidade de dados.
10. Avaliar integridade e representatividade dos dados.
11. Verificar possíveis vieses nos dados.

**Preparação dos Dados:**
12. Especificar requisitos de validação (esquema, tipo, intervalo, consistência).
13. Implementar verificações de qualidade (integridade, precisão, consistência).
14. Configurar fluxos de trabalho de validação de dados.
15. Implementar procedimentos de limpeza de dados.
16. Implementar rastreamento de linhagem de dados.
17. Validar qualidade dos dados processados.
18. Documentar regras de transformação.
19. Implementar anonimização quando necessário.
20. Configurar versionamento de dados.
21. Implementar medidas de preservação de privacidade.
22. Configurar armazenamento seguro e controles de acesso.
23. Documentar medidas de segurança.
24. Configurar registro de auditoria.

**Modelagem:**
25. Validar qualidade dos dados de treinamento.
26. Documentar metodologia de divisão dos dados.
27. Implementar estratégia de validação cruzada.
28. Acompanhar versões dos dados e versões do modelo.
29. Rastrear linhagem do modelo.
30. Monitorar deriva de dados.
31. Implementar controles de reprodutibilidade.
32. Acompanhar resultados de experimentos.
33. Testar robustez e validar imparcialidade do modelo.

**Avaliação, Implantação, Monitoramento:**
34. Avaliar desempenho, imparcialidade e robustez.
35. Realizar avaliação de riscos e validar medidas de segurança.
36. Estabelecer SLAs para atributos de qualidade de dados.
37. Integrar controles de qualidade na implantação.
38. Configurar alertas automatizados e plano de resposta a incidentes.
39. Projetar e testar procedimentos de reversão.
40. Monitorar continuamente métricas de qualidade, desempenho, equidade e saúde do sistema.

### 4.3 Artigos 11-12 — Documentação Técnica e Manutenção de Registros

**Documentação Técnica (Art.11):**
1. Preparar documentação detalhada do projeto, desenvolvimento e finalidade do sistema.
2. Incluir arquitetura do sistema, algoritmos, fontes de dados, métricas de desempenho.
3. Descrever medidas de gestão de riscos aplicadas e como o sistema está em conformidade.
4. Permitir rastreabilidade e reprodutibilidade dos resultados.
5. Garantir disponibilidade para autoridades reguladoras.
6. Manter documentação atualizada refletindo todas as modificações.
7. Documentar: fontes e métodos de coleta de dados, características dos conjuntos de dados, etapas de pré-processamento, métricas de qualidade, cobertura populacional, privacidade, caso de uso, avaliação de riscos, supervisão humana, arquitetura, desempenho, segurança, manutenção e ciclo de vida.

**Manutenção de Registros (Art.12):**
8. Manter registros detalhados das principais operações, desempenho e anomalias.
9. Garantir rastreabilidade para investigação de incidentes e auditabilidade.
10. Definir política de retenção adequada à finalidade e riscos.
11. Armazenar registros em formato estruturado e acessível.
12. Disponibilizar registros às autoridades reguladoras.
13. Usar registros como base para investigação de falhas e ações corretivas.

### 4.4 Artigos 13-15 — Transparência, Supervisão Humana, Precisão e Robustez
1. Fornecer instruções detalhadas para implementadores (Art.13).
2. Incorporar mecanismos de supervisão humana no projeto (Art.14).
3. Garantir padrões de precisão, robustez e segurança cibernética (Art.15).

## 5. ENGENHARIA DE IA PARA RISCO LIMITADO — SMACTR (Cap.6)

### 5.1 Obrigações de Transparência (Art.50)
1. Informar usuários sobre interação com IA (início da interação).
2. Marcar conteúdo sintético (rótulos legíveis por máquina e facilmente detectáveis).
3. Revelar deepfakes claramente como artificiais.
4. Implementadores de reconhecimento de emoções e categorização biométrica devem informar usuários sobre funcionamento e uso dos dados.

### 5.2 Estrutura SMACTR — 5 Etapas

**Etapa 1 — Escopo:**
1. Revisar motivações e impacto pretendido do sistema.
2. Confirmar princípios éticos que guiarão o desenvolvimento.
3. Mapear casos de uso e implantações análogas para antecipar danos potenciais.
4. Definir escopo de auditoria e riscos éticos.
5. Identificar áreas potenciais de dano ou impacto social.

**Etapa 2 — Mapeamento:**
6. Identificar todas as partes interessadas relevantes (afetados, desenvolvedores, usuários, grupos).
7. Determinar impacto potencial sobre cada stakeholder.
8. Iniciar análise FMEA (Failure Mode and Effects Analysis) centrada em princípios éticos.

**Etapa 3 — Coleta de Artefatos:**
9. Reunir documentação e dados técnicos relevantes do sistema.
10. Coletar especificações de projeto, dados de treinamento e avaliação.
11. Identificar riscos potenciais e preocupações éticas relacionadas ao desenvolvimento.
12. Incluir declaração de objetivos éticos e documento de requisitos do produto (PRD).

**Etapa 4 — Testes:**
13. Conduzir testes técnicos de desempenho do modelo (precisão, robustez, confiabilidade).
14. Avaliar imparcialidade e identificar vieses potenciais.
15. Testar sob várias condições (casos extremos, cenários adversários).
16. Usar métricas técnicas e considerações éticas para avaliação.
17. Realizar testes adversários e de segurança.

**Etapa 5 — Reflexão:**
18. Analisar resultados dos testes em relação aos objetivos originais de escopo.
19. Identificar falhas no compromisso com princípios éticos.
20. Formular recomendações de melhoria.
21. Desenvolver plano de mitigação de riscos em colaboração com equipes de engenharia.

## 6. GPAI E IA GENERATIVA — GenAIOps (Cap.7)

### 6.1 Obrigações para Provedores de Modelos GPAI (Art.53)
1. Criar e manter documentação técnica abrangente (especificações de projeto, processos de treinamento, resultados de avaliação).
2. Fornecer documentação para provedores downstream (capacidades, limitações, riscos conhecidos).
3. Implementar política de conformidade com direitos autorais da UE.
4. Publicar resumo detalhado dos dados de treinamento.
5. Nomear representante autorizado na UE (se sediado fora da UE).

### 6.2 Obrigações para Modelos com Risco Sistêmico (Art.55)
1. Realizar avaliações rigorosas e regulares (testes adversários padronizados).
2. Avaliar e mitigar proativamente riscos sistêmicos.
3. Estabelecer sistema de rastreamento, documentação e notificação de incidentes graves.
4. Implementar salvaguardas robustas de segurança cibernética.

### 6.3 GenAIOps — Componentes Principais
1. **Infraestrutura de Engenharia de Prompt:** ferramentas para criar, testar, versionar e orquestrar prompts.
2. **Otimização de Inferência:** quantização, caching, destilação para reduzir latência/custo.
3. **Avaliação Contínua:** monitoramento em tempo real de alucinações, deriva de desempenho, feedback humano.
4. **Controles de Segurança e Conteúdo:** filtragem automática, marca d'água, red teaming, avaliação de risco.
5. **Governança e Conformidade:** documentação transparente (model cards), rastreabilidade de conteúdo, trilhas de auditoria.
6. **Adaptação de Modelos:** fine-tuning, RLHF, LoRA para personalização.

### 6.4 GenAIOps + CRISP-ML(Q) + SMACTR — Passos Integrados

**Fase de Compreensão de Negócios e Dados:**
1. Traduzir objetivos de negócio em objetivos de ML/LLM.
2. Definir métricas de sucesso (negócio, ML, sistema, experiência do usuário, ética).
3. Selecionar modelo base adequado (proprietário vs. código aberto, tamanho, custo, latência).
4. SMACTR Escopo: realizar avaliação preliminar de riscos, análise ética, definir princípios éticos.
5. SMACTR Mapeamento: identificar stakeholders (proprietários de dados, compliance, jurídico, usuários finais).

**Fase de Preparação de Dados:**
6. Coletar dados textuais em larga escala, limpar e filtrar.
7. Preparar para entrada do modelo (tokenização, formatação).
8. Configurar base de conhecimento para RAG (banco de dados vetorial).
9. Implementar verificações sistemáticas de qualidade de dados.
10. SMACTR Coleta de Artefatos: compilar documentação, linhagem de dados, registro de vieses.
11. Planejar riscos de dados para testes futuros.

**Fase de Modelagem:**
12. Selecionar modelo base e estabelecer baseline de desempenho.
13. Adaptar modelo (engenharia de prompt, fine-tuning, RAG).
14. Versionar prompts, checkpoints e experimentos.
15. Aplicar garantia de qualidade (testes unitários em prompts, verificações de reprodutibilidade).
16. Incorporar mitigação de viés e guardrails (filtros, amostragem por rejeição).
17. SMACTR Coleta de Artefatos: documentar decisões de modelagem, manter "registro de transparência".
18. Planejar testes com base em mapeamento de riscos.

**Fase de Avaliação:**
19. Executar benchmarks em conjunto de dados de teste (precisão, BLEU/ROUGE, similaridade).
20. Realizar avaliação humana (correção, coerência, segurança).
21. Conduzir testes adversários e red teaming (prompts desafiadores, conteúdo sensível).
22. Usar detectores automatizados de toxicidade/conteúdo problemático.
23. Comparar versões de modelo/prompt lado a lado (testes A/B offline).
24. SMACTR Testes: gerar gráfico de análise de risco ético, FMEA, lista de verificação ética.
25. Documentar resultados e decidir "seguir em frente ou não" com base em critérios de lançamento.

**Fase de Implantação:**
26. Estabelecer CI/CD para prompts e modelos.
27. Integrar componentes (frontend, backend, APIs, banco vetorial).
28. Otimizar latência e taxa de transferência.
29. Implementar logging de entradas/saídas, dashboards e alertas.
30. Implementar guardrails de segurança (filtragem, autenticação, rate limiting, fallback).
31. Realizar implantação faseada (shadow deployment, beta test).
32. SMACTR Reflexão: revisar resultados, decidir aceitabilidade de riscos residuais, gerar relatório de auditoria.

**Fase de Monitoramento e Manutenção:**
33. Monitorar desempenho ao vivo (qualidade, latência, taxas de erro).
34. Monitorar deriva de dados (embedding clustering, mudanças de tópico).
35. Manter logging detalhado para auditoria retrospectiva.
36. Definir cronograma/critérios para retreinamento ou atualização de modelo.
37. Manter prompts e guardrails com base em observações.
38. Coletar e agir sobre feedback do usuário.
39. SMACTR Reflexão Contínua: agendar auditorias internas periódicas, revisar plano de mitigação, documentar incidentes.

## 7. LISTA DE VERIFICAÇÃO — CONFORMIDADE LEI DE IA DA UE

1. **Inventário:** todos os sistemas de IA estão catalogados com finalidade, dados, risco?
2. **Classificação:** cada sistema tem seu nível de risco definido (inaceitável, alto, limitado, mínimo)?
3. **Papel:** provedor ou implementador está claramente identificado por sistema?
4. **Gestão de Riscos (Art.9):** sistema contínuo de identificação, avaliação e mitigação de riscos estabelecido?
5. **Governança de Dados (Art.10):** dados são relevantes, representativos, livres de viés, com pré-processamento documentado?
6. **Documentação Técnica (Art.11):** documentação completa, rastreável, disponível a autoridades?
7. **Registros (Art.12):** logs detalhados mantidos em formato estruturado e acessível?
8. **Transparência (Art.13/50):** usuários são informados sobre interação com IA? Conteúdo sintético é marcado?
9. **Supervisão Humana (Art.14):** mecanismos de intervenção humana projetados e implementados?
10. **Precisão, Robustez, Segurança (Art.15):** métricas definidas, testadas, monitoradas?
11. **GPAI:** documentação técnica, direitos autorais, resumo de dados de treinamento?
12. **Risco Sistêmico:** avaliações de modelo, mitigação, notificação de incidentes, cibersegurança?
