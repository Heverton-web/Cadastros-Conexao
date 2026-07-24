---
name: engsoft-moderna
description: Passos operacionais extraídos do livro "Engenharia de Software Moderna" (Marco Tulio Valente) — processos, requisitos, projeto, padrões, arquitetura, testes, refactoring, DevOps e Git.
---

# Engenharia de Software Moderna — Passos Operacionais

Skill baseada no livro "Engenharia de Software Moderna" de Marco Tulio Valente. Contém passos práticos e sequências operacionais para o dia-a-dia do desenvolvedor.

Use quando o usuário pedir orientação prática sobre: processos ágeis, requisitos, princípios de projeto SOLID, padrões GoF, arquitetura, testes, refactoring, DevOps ou Git.

---

## 1. PROCESSOS ÁGEIS — XP

### 1.1 Valores XP
- **Comunicação**: evite suposições, converse com o time e clientes.
- **Simplicidade**: faça a coisa mais simples que possa funcionar.
- **Feedback**: valide cedo com stakeholders; correções de rota no início são mais baratas.
- **Coragem**: diga a verdade sobre estimativas e qualidade.
- **Respeito**: trate colegas e clientes com dignidade.
- **Qualidade de vida**: jornadas sustentáveis (~40h/semana).

### 1.2 Planejamento de Release (XP)
1. Defina duração da iteração (1-3 semanas; sugestão: 2-3 semanas).
2. Defina número de iterações por release (2-3 meses no total).
3. Representante dos clientes escreve histórias (2-3 sentenças cada).
4. Desenvolvedores estimam histórias em story points (escala Fibonacci: 1,2,3,5,8,13).
5. Use **Planning Poker**: cada dev estima individualmente → cartas viram juntas → se discrepante, discutem → revotam até consenso.
6. Defina a **velocidade do time** (story points por iteração).
7. Representante prioriza histórias respeitando a velocidade.
8. Quebre histórias em **tarefas** (duração de dias, não semanas).

### 1.3 Práticas de Programação XP
1. **Design incremental**: não projete tudo upfront (YAGNI). Refatore continuamente.
2. **Programação em pares**: driver + navigator. Alterne pares a cada sessão (~50 min).
3. **Propriedade coletiva**: qualquer dev pode modificar qualquer parte do código.
4. **Testes automatizados**: toda classe deve ter testes de unidade.
5. **TDD**: escreva o teste antes do código (ciclo red-green-refactor).
6. **Build automatizado**: compile, execute testes e empacote sem intervenção manual.
7. **Integração contínua**: integre código pelo menos 1x/dia no branch principal.

---

## 2. SCRUM

### 2.1 Papéis
- **Dono do Produto (PO)**: visionário, escreve e prioriza histórias, disponível para dúvidas.
- **Scrum Master**: garante que regras Scrum são seguidas, remove impedimentos, facilitador.
- **Desenvolvedores**: time cross-funcional (3-9 pessoas), auto-organizável.

### 2.2 Artefatos
- **Backlog do Produto**: lista priorizada de histórias (dinâmica, PO atualiza).
- **Backlog do Sprint**: tarefas do sprint corrente com estimativas (time que gera).
- **Quadro Scrum** (Scrum Board): colunas "A fazer", "Em andamento", "Teste", "Concluído".
- **Gráfico de Burndown**: horas restantes por dia do sprint (curva deve ser declinante).

### 2.3 Eventos e Time-boxes
| Evento | Duração (sprint 1 mês) |
|---|---|
| Planejamento do Sprint | máx 8h |
| Sprint | < 1 mês |
| Reunião Diária (Daily) | 15 min |
| Revisão do Sprint | máx 4h |
| Retrospectiva | máx 3h |

### 2.4 Ciclo do Sprint
1. **Planejamento**: PO propõe histórias → time estima e se compromete → gera Backlog do Sprint.
2. **Sprint**: time implementa as tarefas. Reuniões diárias (em pé, 15 min): o que fez, o que fará, impedimentos.
3. **Revisão**: demonstra o produto ao vivo para stakeholders. Histórias não aprovadas voltam ao Backlog do Produto.
4. **Retrospectiva**: time reflete sobre o sprint e propõe melhorias no processo.
5. Critérios de "done" (Definition of Done): testes de unidade passando, código revisado, integrado no repositório.

---

## 3. REQUISITOS

### 3.1 Histórias de Usuário
1. Liste os papéis de usuário (user roles) antes de escrever histórias.
2. Use o formato: "Como [papel], eu gostaria de [ação]".
3. Garanta os **3Cs**: Cartão (2-3 sentenças), Conversação (PO disponível), Confirmação (testes de aceite).
4. Valide com **INVEST**: Independente, Negociável, Valor, Estimável, Sucinta (<1 semana), Testável.
5. Realize workshop de escrita de histórias (até 1 semana) para gerar backlog inicial.
6. Defina testes de aceitação concretos com o PO antes da iteração.
7. Evite gold plating: implemente apenas o acordado nos testes.
8. Requisitos não-funcionais: use para refinar **done criteria**, não para backlog.

### 3.2 Casos de Uso
1. Identifique o ator principal (entidade externa ao sistema com um objetivo).
2. Estruture: Nome (verbo no infinitivo), Ator, Fluxo normal (≤9 passos), Extensões (alternativos/erro).
3. Evite "se" no fluxo normal → transforme em extensões.
4. Inclua opcionais: propósito, pré-condições, pós-condições, casos relacionados.
5. Boas práticas: linguagem simples, ator como sujeito + verbo, sem pseudo-código, sem tecnologia/interface.
6. Para CRUDs, agrupe em "Gerenciar Entidade".

### 3.3 Produto Mínimo Viável (MVP)
1. Formule hipótese de negócio clara.
2. Execute o ciclo **Construir → Medir → Aprender**.
3. Use métricas acionáveis (% conversão, valor/pedido, CAC), não métricas de vaidade.
4. Métricas de funil: Aquisição → Ativação → Retenção → Receita → Recomendação (AARRR).
5. Três decisões pós-MVP: continuar testando, investir (market fit), pivotar/parar.
6. Considere MVPs não-software: processos manuais (Zappos), vídeos (Dropbox), landing pages.
7. Use **Design Sprint** (5 dias, equipe 7 pessoas) se ideia não estiver clara.

### 3.4 Testes A/B
1. Defina controle (A) e tratamento (B) — idênticos exceto pelo requisito testado.
2. Escolha métrica de conversão.
3. Divida usuários aleatoriamente 50/50.
4. Calcule tamanho mínimo da amostra (calculadora Optimizely).
5. Execute até atingir exatamente o N calculado. Não pare antes nem depois.
6. Se B atingiu ganho mínimo com 95% significância → incorpore B. Senão, mantenha A.
7. Execute testes A/A antes para validar o setup.

---

## 4. PRINCÍPIOS DE PROJETO

### 4.1 Ocultamento de Informação
1. Identifique decisões sujeitas a mudança em cada classe (algoritmos, estruturas, requisitos).
2. Declare como `private` atributos e métodos que implementam detalhes internos.
3. Defina interface pública estável (métodos `public` com contrato sintática e semanticamente estável).
4. Não exponha estruturas de dados internas.
5. Use getters/setters SOMENTE quando imprescindível.
6. Projete toda interface como se fosse para consumo externo (regra Bezos).

### 4.2 Coesão
1. Cada classe deve ter uma única responsabilidade.
2. Critério: se existe mais de um motivo para modificar a classe, divida-a.
3. Separe apresentação de regras de negócio.
4. Aplique coesão também a métodos — um método deve fazer uma coisa.
5. Cheque LCOM prático: se dois métodos não acessam nenhum atributo em comum, falta coesão.

### 4.3 Acoplamento
1. **Aceitável**: A usa métodos públicos de B com interface estável.
2. **Ruim**: A acessa arquivo/BD de B, compartilha variável global, interface instável.
3. Não compartilhe arquivos ou variáveis globais.
4. Torne dependências explícitas (parâmetros tipados, não leitura de arquivos internos).
5. Monitore acoplamento indireto (A → B → C → D).

### 4.4 SOLID — Passos Práticos

**SRP (Responsabilidade Única)**
1. Identifique os motivos para modificar a classe. Deve existir UM e apenas um.
2. Separe apresentação de regras de negócio.
3. Extraia métodos que misturam responsabilidades (calcular + exibir → duas classes).

**OCP (Aberto/Fechado)**
1. Antecipe pontos de extensão no projeto.
2. Ofereça mecanismos de extensão sem modificar código fonte (interfaces, Strategy, Template Method).
3. Não use `instanceof` para tratar variantes.
4. Nem tudo precisa ser extensível — projete apenas para extensões previstas.

**LSP (Substituição de Liskov)**
1. Pre-condições não podem ser fortalecidas na subclasse.
2. Pós-condições não podem ser enfraquecidas na subclasse.
3. Verificação prática: código que funciona com classe base deve funcionar com qualquer subclasse.

**ISP (Segregação de Interfaces)**
1. Mantenha interfaces pequenas e coesas.
2. Crie interfaces específicas por tipo de cliente.
3. Evite interfaces com métodos que clientes não usam.

**DIP (Inversão de Dependências)**
1. Dependa de abstrações (interfaces), não de implementações concretas.
2. Aplique injeção de dependência (passe implementação via construtor/parâmetro).

### 4.5 Composição vs Herança
1. Regra: prefira composição a herança.
2. Herança = reuso caixa-branca (subclasse vê detalhes internos, forte acoplamento).
3. Composição = reuso caixa-preta (atributo tipado por interface, implementação oculta).
4. Use herança apenas se relação "é-um" for genuína e hierarquia for rasa.

### 4.6 Lei de Demeter
1. Um método pode invocar apenas: (a) própria classe; (b) parâmetros; (c) objetos criados por ele; (d) atributos da classe.
2. Evite encadeamento de gets: `a.getX().getY().getZ()`.
3. "Fale apenas com amigos, não com amigos dos amigos."

### 4.7 Métricas de Código
| Métrica | O que mede | Alvo |
|---|---|---|
| LCOM | Falta de coesão (pares de métodos sem atributo comum) | Quanto menor, melhor |
| CBO | Acoplamento (classes das quais A depende) | Quanto menor, melhor |
| CC (Complexidade Ciclomática) | `(#decisões) + 1` | CC ≤ 10 |
| LOC | Linhas de código | Não usar para produtividade |

---

## 5. PADRÕES DE PROJETO (GoF)

### 5.1 Factory
1. Identifique múltiplos `new` do mesmo tipo espalhados.
2. Vai precisar variar os tipos concretos? Se sim → crie método fábrica estático.
3. Substitua TODOS os `new` pelo método fábrica.
4. Para famílias: use Abstract Factory.
5. Critério: trocar tipo exige modificação em UM ponto.

### 5.2 Singleton
1. Recurso é conceitualmente único (logging, config)? Implemente.
2. Construtor privado + atributo estático + `getInstance()` com lazy init.
3. Avalie impacto em testabilidade (estado global).
4. NÃO use como artifício para variável global.

### 5.3 Proxy
1. Objeto base precisa de mediação (cache, log, controle)?
2. Crie interface comum para base e proxy.
3. Proxy implementa a interface + referência ao base + lógica extra antes/depois da delegação.
4. Troque referência ao base pelo proxy no cliente.

### 5.4 Adapter
1. Interface esperada ≠ interface disponível (terceiros).
2. Crie adaptador que implementa a interface-alvo e chama a classe adaptada.
3. Faça conversões de parâmetros/retorno no adaptador.
4. Use quando NÃO tem acesso ao código fonte da classe a adaptar.

### 5.5 Facade
1. Clientes precisam conhecer muitas classes de um subsistema?
2. Crie Fachada com interface simples e unificada.
3. Fachada instancia objetos internos, chama métodos na ordem, gerencia dependências.
4. Clientes interagem APENAS com a Fachada.

### 5.6 Decorator
1. Precisa de funcionalidades combináveis sem explosão de subclasses?
2. Crie classe abstrata Decorator: implementa interface + referência ao componente.
3. Decoradores concretos adicionam funcionalidade antes/depois de delegar.
4. Instancie aninhado: `new Decorador1(new Decorador2(new Base()))`.

### 5.7 Strategy
1. Classe precisa de múltiplos algoritmos intercambiáveis?
2. Crie interface para família de algoritmos.
3. Implemente cada algoritmo como classe concreta separada.
4. Contexto recebe estratégia via setter/construtor e delega chamada.

### 5.8 Observer
1. Relação 1-para-muitos (mudanças notificam vários objetos)?
2. Subject: `addObserver()` + `notifyObservers()`. Observer: `update()`.
3. No sujeito, chame `notifyObservers()` após alterar estado.
4. Vantagem: sujeito não conhece observadores (baixo acoplamento).

### 5.9 Template Method
1. Subclasses compartilham estrutura de algoritmo com passos variáveis?
2. Classe abstrata: método **template** (concreto) define o esqueleto + métodos abstratos para passos variáveis.
3. Subclasses implementam APENAS os métodos abstratos.

### 5.10 Visitor
1. Precisa adicionar operações a uma hierarquia sem modificar as classes?
2. Interface Visitor com `visit()` sobrecarregado para cada classe concreta.
3. Cada elemento da hierarquia implementa `accept(Visitor v) { v.visit(this); }`.
4. Desvantagem: nova classe na hierarquia exige atualizar todos Visitors.

### 5.11 Quando NÃO usar padrões
1. Os ganhos de flexibilidade realmente serão necessários?
2. Cada padrão adiciona pelo menos uma classe — avalie custo.
3. Evite "patternite": não force um problema a caber em um padrão.

---

## 6. ARQUITETURA DE SOFTWARE

### 6.1 Arquitetura em Camadas
1. Organize classes em camadas hierárquicas.
2. Camada N SÓ usa serviços da camada N-1 (não pule, não crie ciclo, não inverta).
3. Modelo 3 camadas: Interface → Lógica de Negócio → Banco de Dados.
4. Na camada de aplicação: inclua Fachada + módulo de persistência.
5. Benefícios: particionamento, disciplina, troca facilitada de camadas, reuso.

### 6.2 MVC
1. Separe em 3 grupos: **Modelo** (dados), **Visão** (apresentação), **Controladoras** (eventos).
2. Modelo NÃO depende de Visão/Controladoras.
3. Interface + Controladoras = grupo "Interface Gráfica" (dependente do Modelo).
4. Use Observer para notificar View sobre mudanças no Modelo.
5. SPAs: HTML+CSS (Visão/Controle) no navegador; Modelo em JS com two-way data binding.

### 6.3 Microsserviços
1. Avalie antes: monólito é mais simples. Microsserviço = sistema distribuído.
2. Cada serviço: processo independente, sem memória compartilhada, time ~5 pessoas.
3. Cada serviço: banco de dados próprio (NÃO compartilhe).
4. Comunicação via interfaces públicas (HTTP/REST).
5. Infraestrutura: nuvem, orquestração (containers), CI/CD por serviço.
6. Lei de Conway: a arquitetura espelha a estrutura organizacional.

### 6.4 Arquitetura Orientada a Mensagens (Filas)
1. Comunicação assíncrona entre cliente e servidor.
2. Introduza broker de fila (RabbitMQ, Kafka, SQS).
3. Produtor → Fila → Consumidor (1-para-1, FIFO).
4. Benefícios: desacoplamento no espaço (não se conhecem) e no tempo (não precisam estar online simultaneamente).
5. Escalabilidade: múltiplos consumidores na mesma fila.

### 6.5 Pub/Sub
1. Comunicação 1-para-N (um evento → múltiplos assinantes).
2. Introduza broker Pub/Sub.
3. Publicador publica evento → TODOS assinantes notificados (push).
4. Use tópicos para organizar eventos.
5. Diferença de filas: fila = 1-para-1 (pull); Pub/Sub = 1-para-N (push).

### 6.6 Anti-padrão: Big Ball of Mud
- Sintomas: qualquer módulo se comunica com qualquer outro; correções introduzem bugs; implementações simples demoram cada vez mais.
- Prevenção: separe em camadas/serviços desde o início.
- Correção: reestruturação arquitetural (refactoring de arquitetura).

---

## 7. TESTES DE SOFTWARE

### 7.1 Testes de Unidade — Estrutura
1. **Fixture**: instancie objetos e inicialize estado.
2. **Chamar**: execute o método testado.
3. **Verificar**: use `assert` para comparar resultado com esperado.
4. Nome da classe: `ClasseOriginal + "Test"`.
5. Nome do método: prefixo `test` + descrição.
6. `@Test`: método público, sem parâmetros, anotado.
7. `@Before`: código executado antes de cada `@Test`.
8. Máximo 1 assert por método de teste (exceção: objeto com múltiplos campos).

### 7.2 Princípios FIRST
| Letra | Princípio | Prática |
|---|---|---|
| F | **Fast** | Executar em ms. Separe testes lentos. |
| I | **Independent** | Ordem não importa. Sem estado global compartilhado. |
| R | **Repeatable** | Determinístico. Evite `sleep()`, aleatoriedade. |
| S | **Self-checking** | Binário: verde/vermelho. |
| T | **Timely** | Escritos antes do código (TDD). |

### 7.3 Test Smells (o que evitar)
1. **Teste Obscuro**: longo, complexo, difícil de entender → quebre em testes menores.
2. **Lógica Condicional**: `if`/`for` dentro de teste → deve ser linear.
3. **Duplicação**: código repetido em vários testes → use `@Before`.
4. Refatore testes também — código de teste precisa de manutenção.

### 7.4 TDD — Ciclo Red-Green-Refactor
1. **Red**: escreva o teste ANTES do código → deve falhar.
2. **Green**: implemente o MÍNIMO para passar.
3. **Refactor**: remova duplicação, quebre métodos, mova código.
4. Baby steps: avanços pequenos e incrementais.
5. Dica: o teste é o primeiro usuário da classe — projete a interface pelo teste.

### 7.5 Mocks e Stubs
1. Use **mock** quando a classe depende de serviço externo (BD, API, serviço remoto).
2. Mock manual: crie classe que implementa a interface da dependência com retornos fixos.
3. Mock com Mockito: `Mockito.mock()`, `when().thenReturn()`, `verify()`.
4. Tipos de dublê: Dummy (só preencher tipo), Fake (implementação simplificada), Stub (verifica estado), Mock (verifica comportamento).
5. **Cuidado**: mocks aumentam acoplamento entre teste e implementação.

### 7.6 Cobertura de Testes
- Fórmula: `comandos executados / total de comandos`.
- Não fixe número mágico. Monitore evolução.
- Times que valorizam testes: ~70%. Com TDD: >90%.
- C0 = comandos; C1 = branches (mais rigoroso).

### 7.7 Pirâmide de Testes
```
    /\          Testes de Sistema (10%)
   /  \         Testes de Integração (20%)
  /____\        Testes de Unidade (70%)
```

### 7.8 Seleção de Dados de Teste
1. **Partição por Equivalência**: divida entradas em classes → teste 1 valor de cada classe.
2. **Análise de Valor Limite**: teste valores nos limites inferiores e superiores de cada faixa.
3. Testes exaustivos são impossíveis — use as técnicas acima.

---

## 8. REFACTORING

### 8.1 Catálogo de Refactorings

| # | Refactoring | Quando aplicar | Passos |
|---|---|---|---|
| 1 | Extrair Método | Método longo, código com propósito distinto | Selecionar trecho → criar novo método com nome auto-explicativo → substituir original por chamada |
| 2 | Inline Method | Método muito pequeno (1-2 linhas) com poucas chamadas | Remover método → incorporar corpo em cada ponto de chamada |
| 3 | Mover Método | Método usa mais serviços de outra classe | Mover implementação → atualizar chamadas |
| 4 | Pull Up Method | Método idêntico em subclasses | Subir para superclasse → remover cópias |
| 5 | Push Down Method | Método na superclasse relevante só para uma subclasse | Descer para subclasse |
| 6 | Extrair Classe | Classe com muitas responsabilidades | Extrair atributos relacionados para nova classe |
| 7 | Renomear | Nome inadequado/desatualizado | Renomear → atualizar todas as referências |
| 8 | Extrair Variável | Expressão complexa em uma linha | Criar variável temporária com nome significativo |
| 9 | Remover Flags | Variável booleana de controle em laço/condicional | Substituir por `return`/`break`/`continue` |
| 10 | Substituir Condicional por Polimorfismo | `switch`/`if` testando tipo | Criar subclasses com método polimórfico |
| 11 | Remover Código Morto | Métodos não chamados, classes não usadas | Deletar |

### 8.2 Code Smells (como identificar)
1. **Código Duplicado**: clones Tipo 1 (idêntico), Tipo 2 (nomes diferentes), Tipo 3 (pequenas mudanças), Tipo 4 (semanticamente equivalentes).
2. **Método Longo**: >20 linhas → Extrair Método.
3. **Classe Grande**: muitos atributos de baixa coesão → Extrair Classe. Desconfie de "Manager", "System", "Subsystem".
4. **Feature Envy**: método acessa mais atributos de outra classe → Mover Método.
5. **Muitos Parâmetros**: agrupe em classe (ex: `DateRange`).
6. **Obsessão por Tipo Primitivo**: CEP, Moeda, Email, Telefone como `String` → crie classes dedicadas.
7. **Comentários Explicando Código Ruim**: extraia para método com nome significativo e remova comentário.

### 8.3 Prática de Refactoring
1. **Pré-requisito**: tenha boa suíte de testes de unidade.
2. **Oportunista**: ao implementar funcionalidade ou corrigir bug, refatore código mal escrito na hora (~20% do tempo).
3. **Planejado**: para dívida técnica acumulada, aloque sessão dedicada (raro).
4. **Sequencie**: Extrair Método → depois Mover Método extraído.
5. Use refactorings automatizados da IDE quando disponível.

---

## 9. DEVOPS

### 9.1 Princípios
1. Crie processo repetível e confiável (entrega = apertar botão).
2. Automatize tudo que for possível (build, testes, config, BD).
3. Mantenha TUDO em controle de versão.
4. Se um passo causa dor, execute-o com mais frequência.
5. "Concluído" = 100% pronto para entrar em produção.
6. Todos (Dev + Ops) são responsáveis pela entrega.

### 9.2 Integração Contínua (CI)
1. Integre código no branch principal no mínimo 1x/dia.
2. Build automatizado < 10 minutos.
3. Testes de unidade rodam após cada commit.
4. Configure servidor de CI (GitHub Actions, Jenkins, etc.).
5. Prioridade máxima para build quebrado — pare e corrija (ou reverta).
6. Só comece nova tarefa após resultado CI positivo.
7. Use **Trunk-Based Development** (feature branches duram ≤1 dia).

### 9.3 Deployment Contínuo (CD)
1. **Fluxo**: Dev local → Commit → CI (build+testes) → CI (testes exaustivos) → Produção.
2. Quebre tarefas em partes pequenas (cada atualização deve ser pequena).
3. Use **Feature Flags**: booleano que desabilita novo código em produção. Gerencie externamente (config file/table).
4. **Release Canário**: libere para 5% dos usuários → monitore → aumente gradualmente.
5. **Continuous Delivery** (alternativa): todo commit é candidato, mas liberação é manual.

---

## 10. GIT — COMANDOS E FLUXOS

### 10.1 Operações Básicas
| Comando | Quando usar |
|---|---|
| `git init` | Projeto novo |
| `git clone <url>` | Ingressar em projeto existente |
| `git add <arquivo>` | Tornar arquivo tracked / stage |
| `git commit -m "msg"` | Salvar snapshot (frequente, pequeno, um assunto por commit) |
| `git commit -a -m "msg"` | Add automático + commit (só tracked) |
| `git rm <arquivo>` | Remover do repositório |
| `git status` | Verificar estado |
| `git diff` | Ver diferenças antes do commit |
| `git log` | Ver histórico |

### 10.2 Sincronização
| Comando | Quando usar |
|---|---|
| `git push origin master` | Enviar commits locais para remoto |
| `git pull` | Atualizar local com remoto (fetch + merge) |

### 10.3 Conflitos de Merge
1. Editor marca com `<<<<<<< HEAD`, `=======`, `>>>>>>> [hash]`.
2. Escolha qual versão manter, remova marcadores.
3. `git add` → `git commit` → `git push`.

### 10.4 Branches
| Comando | Quando usar |
|---|---|
| `git branch <nome>` | Criar branch |
| `git checkout <nome>` | Trocar de branch |
| `git merge <branch>` | Mesclar (execute no branch que RECEBE) |
| `git branch -d <nome>` | Deletar branch local (após merge) |
| `git push -u origin <nome>` | Enviar branch local pela primeira vez |
| `git push origin --delete <nome>` | Deletar branch remoto |

### 10.5 Pull Requests
1. Crie branch local com alterações → `add`, `commit`, `push`.
2. No GitHub, clique "New pull request", descreva mudanças, solicite revisor.
3. Revisor analisa diff, comenta, aprova ou solicita mudanças.
4. Após aprovação, clique em merge.
5. Para atualizar PR: novo `add`, `commit`, `push` no mesmo branch.

### 10.6 Squash (unificar commits)
1. `git rebase -i HEAD~N` (N = commits a unir).
2. Mantenha `pick` no primeiro, troque para `squash` nos demais.
3. Salve e informe mensagem do commit unificado.

### 10.7 Fork
1. Na página do repositório, clique "Fork".
2. Clone seu fork → crie branch → alterações → commit → push.
3. Crie PR do seu fork para o repositório original.
