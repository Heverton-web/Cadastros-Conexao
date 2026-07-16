---
name: engenharia-software-ia-sandeco
description: Engenharia de software assistida por IA — prompting, code review, debugging, automação, CI/CD. Baseado no livro de Sandeco.
---
# Engenharia de Software com IA — Passos Operacionais

## 1. IA + Processo = Software de Verdade

### 1.1 Superando o Vibe Coding
1. **Nunca aceitar código de IA sem revisão** — código que funciona não é código correto
2. **Definir requisitos antes de prompt** — IA preenche buracos com suposições nem sempre corretas
3. **Estabelecer processo** antes de gerar código: o que construir, para quem, restrições, escala
4. **Revisar sistematicamente** todo código gerado por IA — casos extremos, segurança, manutenibilidade

### 1.2 Engenharia de software com IA
1. **IA acelera** escrita de código, automatiza tarefas repetitivas, sugere soluções
2. **Engenheiro define** o que construir, com quais restrições e qualidade
3. **IA + método**: IA como amplificadora de pensamento, não substituta

## 2. Git com IA — Controle de Versão Essencial

### 2.1 Por que Git é obrigatório com IA
1. **IA não tem memória** do que o código era antes — só vê estado atual
2. **Commit antes de cada intervenção significativa** da IA → ponto de restauração
3. **Reverter erros** do agente com `git revert` ou `git restore`
4. **Histórico de commits** = documentação viva do raciocínio para a IA

### 2.2 Instalação e configuração
1. `git config --global user.name "Seu Nome"`
2. `git config --global user.email "email@exemplo.com"`
3. Criar repositório no GitHub, clonar: `git clone <url>`

### 2.3 Comandos essenciais
1. `git status` — ver estado atual
2. `git add <arquivo>` / `git add .` — preparar mudanças
3. `git commit -m "tipo: mensagem descritiva"` — registrar commit (usar Conventional Commits)
4. `git push -u origin main` — enviar ao remoto
5. `git pull` — sincronizar antes de começar sessão
6. `git log --oneline` — histórico resumido
7. `git diff` — diferenças não commitadas
8. `git restore <arquivo>` — descartar mudanças (voltar ao último commit)
9. `git restore .` — descartar tudo (cuidado: sem desfazer)
10. `git switch --detach <hash>` — inspecionar commit antigo
11. `git revert <hash>` — desfazer commit publicado (cria novo commit)

### 2.4 Branches — experimentação segura com IA
1. Criar branch antes de mudanças significativas: `git checkout -b feat/nova-funcionalidade`
2. Ver branches: `git branch`
3. Trocar: `git checkout main`
4. Integrar: `git checkout main` → `git merge feat/nova-funcionalidade`
5. Deletar branch obsoleta: `git branch -d feat/nova-funcionalidade`
6. **Worktree** (Claude Code): `git worktree add ../projeto-experimento feat/experimento` — segunda cópia física do repo em pasta separada, permite IA trabalhar em paralelo sem trocar branch

### 2.5 Fluxo seguro com agente
1. **Commit do estado atual** antes de qualquer mudança da IA
2. **Criar branch** para experimento
3. **Instruir agente** na branch de experimento
4. **Revisar** tudo que o agente gerou
5. **Testar** antes de merge
6. **Merge ou descarte** da branch

## 3. POO e Design Patterns para Manutenção

### 3.1 Pilares da orientação a objetos
1. **Encapsulamento** — esconder implementação, expor interface
2. **Herança** — reutilizar comportamento entre classes
3. **Polimorfismo** — mesma interface, comportamentos diferentes

### 3.2 Singleton
1. Garantir que uma classe tenha apenas uma instância
2. Útil para: conexão de banco, logger, cache global
3. Implementar com `__new__` ou variável de classe
4. Cuidado: Singletons podem esconder acoplamento global

### 3.3 Factory Method
1. Definir interface para criar objetos, deixar subclasses decidirem qual classe instanciar
2. Útil quando tipo do objeto é conhecido só em tempo de execução
3. Isola lógica de criação do resto do sistema

### 3.4 Strategy
1. Definir família de algoritmos intercambiáveis
2. Encapsular cada algoritmo em classe separada
3. Cliente escolhe estratégia em tempo de execução
4. Exemplo: diferentes métodos de pagamento, ordenação, validação

### 3.5 Observer
1. Um objeto (sujeito) notifica múltiplos observadores sobre mudanças
2. Útil para eventos, notificações, atualizações de UI
3. Desacopla origem do evento dos handlers

### 3.6 Repository
1. Separar lógica de negócio do acesso a dados
2. Repository age como coleção de objetos em memória
3. Abstrai banco: trocar SQL por NoSQL sem afetar regras de negócio
4. Integração direta com desenvolvimento em camadas

## 4. Arquitetura em Camadas

### 4.1 Estrutura
1. **Camada de Apresentação** — interface com usuário
2. **Camada de Negócio** — regras e lógica da aplicação
3. **Camada de Dados** — persistência (banco, APIs externas)
4. **Cada camada** depende apenas da camada imediatamente inferior

### 4.2 Boas práticas
1. Nunca misturar responsabilidades entre camadas
2. Usar injeção de dependência para desacoplar
3. Repository na camada de dados, Service na camada de negócio
4. Testar cada camada isoladamente (testes unitários)

## 5. Manutenção de Software (SWEBOK)

### 5.1 Categorias formais
1. **Corretiva** (21%) — consertar bugs em produção. Exige diagnóstico rápido, deploy controlado
2. **Adaptativa** (25%) — ajustar sistema quando ambiente muda (SO, dependências, regulações)
3. **Evolutiva** (50%) — adicionar funcionalidades que cliente descobre precisar depois
4. **Preventiva** (4%) — refatorar antes que o problema apareça; mais valiosa e mais negligenciada

### 5.2 Estratégias práticas
1. **Testes automatizados** — sem eles, cada corretiva é risco de quebrar outras partes
2. **Refatoração planejada** — pagar débito técnico enquanto juros são administráveis
3. **Custo exponencial** — mudança custa centavos no início, fortunas em produção
4. **67% do custo total** do software é manutenção (Pressman)

### 5.3 Manutenção com IA
1. IA gera débito técnico na velocidade da digitação — revisar sempre
2. Prompt para IA: incluir restrições de manutenibilidade (legibilidade, padrões, testes)
3. Commits frequentes permitem reverter experimentos fracassados da IA
4. Sem processo, IA cria código funcional hoje que trava manutenção amanhã

## 6. Prevenção de Débito Técnico com IA

### 6.1 Regras para usar IA sem acumular dívida
1. **Nunca fazer "prompt → aceitar → próximo prompt"**
2. **Definir padrões de código** antes de começar (linter, formatter, estilo)
3. **Exigir testes** para todo código gerado por IA
4. **Revisar em pull request** como se fosse código humano
5. **Documentar decisões** da IA nos commits

### 6.2 Quando o software não foi pensado para manutenção
1. Identificar: funções gigantes, nomes obscuros, acoplamento excessivo, ausência de testes
2. Ferramentas de reengenharia: extrair método, renomear, mover classe
3. Refatorar com IA: dar prompts específicos de refatoração (ex.: "extrair validação para classe separada")

## 7. Fluxo de Desenvolvimento com Agentes

### 7.1 Antes de começar
1. Definir requisitos claros por escrito
2. Criar branch feature
3. Fazer commit do estado atual
4. Preparar contexto para o agente (docs, interfaces, exemplos)

### 7.2 Durante
1. Prompt com escopo definido (o que fazer, o que NÃO fazer)
2. Revisar diff após cada intervenção do agente
3. Executar testes após cada mudança
4. Commits incrementais (a cada funcionalidade concluída)

### 7.3 Após
1. Teste completo (unitário, integração, regressão)
2. Revisão final de código
3. Merge na branch principal
4. Se algo quebrou: `git revert` e repita com prompt melhorado
