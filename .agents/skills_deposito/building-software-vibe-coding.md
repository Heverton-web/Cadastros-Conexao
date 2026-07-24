---
name: building-software-vibe-coding
description: Passos operacionais para construir software com Vibe Coding — prompt engineering, setup de ambiente, iteração rápida, debugging e deployment
---

# Building Software With Vibe Coding — Passos Operacionais

## 1. ESTRUTURA DE PROMPT DE SOFTWARE EFICAZ (Cap.1)
### 1.1 Quatro componentes de um prompt de desenvolvimento
1. **Contexto**: definir stack tecnológica, tipo de projeto, estado atual do desenvolvimento
2. **Objetivo específico**: articular exatamente qual funcionalidade ou resultado deseja ("criar componente de carrinho que exiba itens, quantidades e preço total")
3. **Formato de saída**: especificar linguagem, framework, padrões (REST, componentes React, etc.)
4. **Restrições do projeto**: performance, segurança, compatibilidade, deadline

### 1.2 Cinco técnicas para descrever funcionalidades
1. **Transformação de histórias de usuário**: adaptar "Como [usuário], quero [funcionalidade] para [benefício]" com contexto ambiental e emocional
2. **Especificação comportamental**: descrever respostas do sistema em cenários normais, exceções e recuperação
3. **Documentação de fluxo de processo**: rastrear jornada de dados, decisões e ações em fluxos completos
4. **Linguagem específica de domínio**: usar terminologia padronizada do setor (saúde, finanças, etc.)
5. **Especificação de anti-requisitos**: descrever explicitamente o que o software NÃO deve fazer

### 1.3 Ciclo iterativo de refinamento de prompts (4 passos)
1. Criar prompt inicial com intenção de alto nível
2. Receber resposta da IA
3. **Avaliar** usando estrutura de avaliação (correção funcional, qualidade código, alinhamento arquitetural)
4. **Refinar** com base nas descobertas:
   - **Análise de lacunas**: identificar discrepâncias entre saída desejada e real (funcionais, arquiteturais, contextuais, qualidade)
   - **Especificidade incremental**: aumentar precisão gradualmente sem limitar criatividade
   - **Meta-instruções**: pedir à IA que faça perguntas esclarecedoras, identifique ambiguidades

### 1.4 Gestão de contexto
1. Manter arquivo de regras do projeto (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`)
2. Atualizar documentação e decisões anteriores entre sessões
3. Criar Documento de Requisitos do Produto (PRD) antes de codificar
4. Usar fatias verticais: implementar funcionalidade completa em etapas incrementais
5. Iniciar novo chat quando contexto ficar muito longo; usar resumos para reter pontos-chave

### 1.5 Evitar armadilhas comuns
1. **Ambiguidade**: substituir "melhore" / "otimize" por especificações concretas
2. **Especificação excessiva**: não engessar a IA com detalhes que impedem soluções melhores
3. **Negligência de contexto**: fornecer stack, restrições, requisitos de integração
4. **Expectativas irreais**: não esperar solução perfeita na primeira tentativa
5. **Falácia da resposta única**: usar múltiplas iterações em vez de prompts monolíticos
6. **Validação insuficiente**: testar código gerado com o mesmo rigor que código manual

## 2. MELHORES PRÁTICAS OPERACIONAIS (Cap.4)
### 2.1 Planejamento pré-desenvolvimento
1. Criar PRD abrangente antes de codificar: o que o app faz, para quem, como funciona
2. Definir tecnologias base, fluxos de usuário, casos extremos
3. Estabelecer marcos do projeto como bússola durante o desenvolvimento

### 2.2 Desenvolvimento incremental com prompts focados
1. **Decompor** projetos em partes lógicas: autenticação, schema DB, features, integrações
2. Criar um prompt focado para **cada parte individualmente**
3. Evitar múltiplas alterações não relacionadas em um único prompt
4. Cada prompt focado produz código mais fácil de avaliar, testar e iterar

### 2.3 Engenharia de prompt com contexto explícito
1. Incluir **contexto**: domínio e arquitetura da aplicação
2. Incluir **restrições**: stack, estilo de código, performance, limites de segurança
3. Incluir **exemplos**: comportamento esperado de entrada/saída ou padrões de implementação
4. Prompt estruturado: "Estou criando uma API REST para [domínio]. Use [tecnologia] com [convenções]. Implemente [requisitos específicos]."

### 2.4 Revisão e testes de código gerado
1. Entender o código gerado antes de aceitar alterações
2. Verificar: tratamento de erros, validação de entrada, autenticação, limites de taxa
3. Executar testes abrangentes após cada modificação para detectar regressões

### 2.5 Seleção estratégica de ferramentas
1. **Claude**: equilíbrio precisão/raciocínio — usar para maioria dos casos
2. **Replit Agent**: quando minúcia é mais importante que velocidade
3. **Lovable**: apps web full-stack com serviços integrados (DB, pagamentos, deploy)
4. **V0**: componentes de UI prontos para produção com frameworks modernos
5. **Cursor**: contexto aprimorado para projetos complexos com arquivos grandes

### 2.6 Validação de segurança
1. Incluir requisitos de segurança explícitos em prompts que envolvam input do usuário, autenticação, dados, APIs
2. Fluxo de segurança em 3 etapas:
   - Gerar código COM requisitos de segurança no prompt
   - Solicitar que a IA revise seu próprio código em busca de vulnerabilidades
   - Usar ferramentas de varredura de segurança dedicadas antes do deploy

### 2.7 Feedback iterativo e restart
1. Observar resultados, fornecer correções específicas, guiar IA
2. Feedback eficaz: descrever **o que funciona** e **o que precisa mudar** — sem diretrizes vagas
3. Reconhecer quando implementação entrou em espiral de problemas
4. **Descartar** tentativas fracassadas e recomeçar com lições aprendidas
5. Usar histórico de tentativas anteriores para informar novo prompt

## 3. SETUP DE AMBIENTE E FERRAMENTAS (Cap.4, 5, 6)
### 3.1 Selecionar plataforma de vibe coding
1. Escolher entre:
   - **IA conversacional**: Claude, ChatGPT, Gemini, Grok — prototipagem rápida
   - **IDE com IA**: Cursor, GitHub Copilot, Windsurf — contexto de projeto completo
   - **Construtor full-stack**: Lovable, Bolt, Replit, v0 — app completo de um prompt
   - **Agente autônomo**: Claude Code — projeto ponta a ponta com mínima intervenção
2. Considerar: modelo de IA subjacente, grau de automação, escopo, arquitetura de execução

### 3.2 Configurar projeto
1. Para **Replit**: login → descrever requisitos → Agent cria app completo com DB e autenticação
2. Para **Lovable**: prompt inicial → IA gera frontend React + backend Node.js + schema DB
3. Para **Google AI Studio**: prompt estruturado → app com integrações Google Cloud
4. Para **Bolt.new**: prompt → geração no navegador, sem setup local

### 3.3 Modos de operação
1. **Modo Agente**: IA opera autônoma — planeja, executa, depura
2. **Modo Chat**: IA como assistente — conversa, planeja, não modifica código diretamente
3. **Modo Código**: acesso direto ao código-fonte gerado para edições manuais
4. **Edição Visual**: modificar UI diretamente na página (Lovable, Google AI Studio)

## 4. FLUXO DE DESENVOLVIMENTO COMPLETO (Cap.5, 6, 7)
### 4.1 Ideação e planejamento
1. Definir: problema central, público-alvo, critérios de sucesso do usuário final
2. Mapear jornadas do usuário: descoberta → uso diário → resultados
3. Pesquisar soluções existentes: padrões esperados, lacunas, oportunidades
4. Prompt de planejamento vago → resultado genérico: **fornecer instruções específicas**

### 4.2 Construção do app via prompts
1. Inserir prompt único e estruturado com requisitos completos
2. Revisar design inicial proposto pela IA; aceitar ou refinar
3. Acompanhar progresso: IA edita arquivos, configura DB, implementa autenticação
4. Teste ponta a ponta automático: IA simula jornadas completas do usuário

### 4.3 Aprimoramento incremental
1. Pedir refinamentos visuais específicos (paleta, gradientes, tipografia)
2. Adicionar features via prompts: "Quero planejar um cronômetro de descanso entre séries"
3. Para features de backend: "Integrar autenticação e banco de dados"
4. Usar **anotações visuais** na pré-visualização (Google AI Studio) para feedback multimodal

### 4.4 Testes
1. Verificar landing page, fluxo de autenticação, painel, CRUD
2. Testar busca, filtros, navegação responsiva
3. Verificar persistência entre sessões e tratamento de erros

### 4.5 Deploy
1. **Replit**: guia Deployments → selecionar tipo (VM, serverless) → domínio `.replit.app`
2. **Lovable**: segurança scan → publish → URL `[projeto].lovable.app`
3. **Google AI Studio**: botão foguete → Cloud Run → URL pública
4. Opcional: configurar domínio personalizado e HTTPS automático

## 5. DEPURAÇÃO E QUALIDADE (Cap.4, 8)
### 5.1 Pipeline de qualidade para código gerado por IA
1. Análise estática + linting + verificação de segurança + conformidade arquitetural
2. Testes SAST, DAST, IAST e penetração para aplicações críticas
3. Revisão específica de: tratamento de erros, validação de entrada, autenticação

### 5.2 Segurança
1. Verificar: secrets embutidos no código, SQL injection, XSS, CSRF
2. Usar scanners integrados (Lovable Security Scan, CodeQL, ESLint)
3. Fluxo de 3 etapas: prompt com segurança → IA auto-revisa → ferramenta externa varre

### 5.3 Quando recomeçar vs. continuar
1. Se implementação entra em espiral de erros → descartar e recomeçar
2. Salvar lições aprendidas da tentativa anterior
3. Prompt de recomeço inclui o que NÃO funcionou

## 6. FLUXO DE TRABALHO HÍBRIDO (Cap.8)
### 6.1 Alocação de tarefas entre IA e humano
1. **IA faz**: prototipagem rápida, código boilerplate, testes, CRUD, documentação
2. **Humano faz**: decisões arquitetônicas, lógica de negócios complexa, compliance, segurança crítica
3. **Ambos**: componentes que exigem iteração rápida com supervisão

### 6.2 Manter consistência com bases de código existentes
1. Configurar IA para acessar contexto do projeto: padrões, convenções, nomenclatura
2. Fornecer arquivos de regras, exemplos, documentação de APIs
3. Revisar código gerado contra padrões estabelecidos antes de integrar

### 6.3 Adoção incremental
1. Começar com apps de baixo risco (ferramentas internas, protótipos)
2. Aumentar complexidade gradualmente
3. Documentar padrões de sucesso; analisar falhas sem atribuir culpa
4. Automatizar tarefas rotineiras; manter responsabilidade humana por componentes críticos

## 7. PROMPT PARA AUTOMAÇÃO DE FLUXO DE TRABALHO (Cap.7)
### 7.1 Estrutura de prompt para automação
1. Definir módulos com especificações funcionais claras
2. Manter-se agnóstico em tecnologia — deixar IA escolher implementação
3. Organizar requisitos em módulos lógicos:
   - Processamento de e-mails (categorização, regras, templates, roteamento)
   - Sincronização de dados (fontes, mapeamento, bidirecional, agendamento)
   - Geração de relatórios (visualizações, agregação, exportação, modelos)

### 7.2 Deploy de automação
1. Google AI Studio → Implantar aplicativo → Cloud Run → URL público
2. n8n → Workflow Builder com IA → descrever em linguagem natural → nós gerados
