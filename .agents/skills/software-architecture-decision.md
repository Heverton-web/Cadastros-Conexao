---
name: software-architecture-decision
description: >-
  Passos operacionais do livro 'Software Architecture and Decision-Making' (Srinath Perera) — ADRs, trade-offs e riscos.
---

# Software Architecture and Decision-Making — Passos Operacionais

Skill baseada no livro "Software Architecture and Decision-Making" de Srinath Perera (EN). 
Contem principios e tecnicas para tomada de decisoes arquiteturais, analise de trade-offs 
e gestao de incertezas.

Use quando o usuario pedir orientacao pratica sobre: decisao arquitetural, ADRs, trade-offs, riscos, lideranca tecnica.

---

## 1. As 5 Perguntas Fundamentais

Antes de qualquer decisao arquitetural, responda estas 5 perguntas para entender o contexto:

1. **When Is the Best Time to Market?** — Defina o prazo e restricoes de tempo. Isso determina quanta flexibilidade voce tem.
2. **What Is the Skill Level of the Team?** — Avalie a maturidade do time. Uma arquitetura sofisticada exige um time maduro.
3. **What Is Our System's Performance Sensitivity?** — Entenda os requisitos de performance. Eles determinam o nivel de precisao necessario no design.
4. **When Can We Rewrite the System?** — Identifique se ha uma segunda fase natural onde o sistema pode ser reescrito. Isso permite adiar problemas dificeis.
5. **What Are Our System's Scaling Characteristics?** — Projete para o cenario de escala esperado, sem superengenharia.

---

## 2. Os 7 Principios de Decisao

### 2.1 Direcione Tudo pela Jornada do Usuario
1. Olhe para cada decisao do ponto de vista do usuario.
2. Escolha apenas funcionalidades que sejam uteis para a jornada do usuario.
3. Nao implemente recursos "interessantes" que o usuario nao pediu.

### 2.2 Use uma Estrategia Iterativa de Fatia Fina (Thin Slice)
1. Comece com uma fatia fina (end-to-end minima) que percorra toda a pilha.
2. A cada iteracao, aprenda com o feedback real.
3. Expanda a fatia gradualmente, resolvendo os problemas mais arriscados primeiro.

### 2.3 Em Cada Iteracao, Adicione o Maximo de Valor com o Menor Esforco
1. Priorize funcionalidades pelo maior retorno sobre o esforco.
2. Nao gaste 80% do tempo em recursos que serao usados por 20% dos usuarios.
3. Pergunte: "Qual o minimo que podemos fazer para gerar o maximo de valor agora?"

### 2.4 Tome Decisoes e Absorva os Riscos
1. Como lider tecnico, sua funcao e absorver a incerteza, nao passa-la para o time.
2. Defina o escopo e tome decisoes dificeis para que o time possa focar na execucao.
3. Nao delegue decisoes ambíguas para o time — isso gera paralisia e retrabalho.

### 2.5 Projete Profundamente o Que e Dificil de Mudar, Mas Implemente Rapidamente o Que e Facil
1. Identifique o que e dificil de mudar (interfaces publicas, modelos de dados fundamentais, contratos de API).
2. Invista tempo de design nessas areas — os erros ai sao caros.
3. Para o que e facil de mudar (implementacao interna, UI, detalhes), va rapido e refatore depois.
4. **Regra**: "Pense profundamente, mas implemente devagar."

### 2.6 Elimine Incertezas Aprendendo com Evidencia
1. Trabalhe nos problemas dificeis no inicio do projeto, quando ainda ha tempo para aprender.
2. Nao espere ate o final para descobrir que uma abordagem nao funciona.
3. Use prototipos, POCs e experiments para eliminar riscos cedo.

### 2.7 Entenda os Trade-offs entre Coesao e Flexibilidade
1. Coesao demais torna o sistema rigido.
2. Flexibilidade demais torna o sistema complexo e dificil de entender.
3. O equilibrio certo depende do contexto de negocio e da maturidade do time.

---

## 3. Modelos Mentais para Decisoes

### 3.1 Modelos de Custo
- **Modelo 1**: Custo de mudanca do modo kernel — entenda a diferenca entre mudancas locais e globais.
- **Modelo 2**: Hierarquia de operacoes — algumas decisoes afetam muitas camadas.
- **Modelo 3**: Overhead de troca de contexto — muitas responsabilidades reduzem a produtividade.
- **Modelo 4**: Lei de Amdahl — o ganho de paralelizacao e limitado pela porcao serial.
- **Modelo 5**: Lei de Escalabilidade Universal (USL) — a escalabilidade tem limites praticos.
- **Modelo 6**: Trade-offs entre latencia e utilizacao — otimizar um pode prejudicar o outro.
- **Modelo 7**: Projetar para throughput com particionamento maximo.

### 3.2 Modelos de UX
1. **Produtos bons nao precisam de manual** — a UX deve ser intuitiva.
2. **Pense em termos de troca de informacao** — o sistema e sobre comunicacao.
3. **Design UX antes da implementacao** — nao deixe a UX como depois.

---

## 4. Arquitetura Macro e Micro

### 4.1 Preservando Consistencia de Estado (Macro)
1. Vá alem de transacoes tradicionais — pense em consistencia eventual.
2. **Abordagem 1**: Redefina o problema para exigir menos consistencia.
3. **Abordagem 2**: Use sagas/coreografias para coordenar servicos.
4. **Regra**: Consistencia forte e cara — use apenas quando realmente necessario.

### 4.2 Alta Disponibilidade e Escala
1. **Solucao base**: Escalamento horizontal + load balancing.
2. **Abordagem 1**: Eliminacao sucessiva de gargalos (encontre o gargalo, resolva, repita).
3. Monitore constantemente para identificar o proximo gargalo antes que ele se torne critico.

### 4.3 Microservicos
1. **Problema**: Um microservico atualizando o banco de dados de outro — nunca faca isso.
2. **Solucao 1**: Cada microservico atualiza apenas SEU banco de dados.
3. **Solucao 2**: Use mensageria assincrona para coordenar entre servicos.
4. Times baseados em repositorio (propriedade do codigo) sao uma alternativa ao acoplamento organizacional.

---

## 5. Lideranca e Julgamento

### 5.1 Lideranca em Arquitetura
1. Lideranca e sobre gerenciar incerteza, trazer ordem ao caos e oferecer esperanca de um futuro melhor.
2. O arquiteto deve ter uma visao do todo e comunica-la ao time.
3. **Citacao**: "Um lider e um negociante de esperanca." — Napoleon Bonaparte

### 5.2 Erros Comuns de Arquitetura
1. Tentar incorporar muitas funcionalidades exigidas pelos usuarios "no papel".
2. Tornar o design flexivel ou consistente demais, impactando a simplicidade.
3. Profundidade limitada que afeta significativamente a experiencia do usuario.
4. Resolver problemas inuteis para o usuario final.
5. Foco inadequado na jornada do usuario.

### 5.3 Julgamento vs Conhecimento
1. Conhecimento e necessario, mas julgamento e o que separa bons arquitetos dos medianos.
2. Julgamento e a capacidade de tomar decisoes ponderadas que otimizem o resultado mais importante.
3. A maioria dos erros de design nao e causada por falta de conhecimento, mas por falta de julgamento.
4. Contexto e rei — nao existem regras universais que funcionem em todas as situacoes.

---

## 6. Gestao de Incertezas

### 6.1 Tres Tipos de Incerteza
1. **Usuarios**: compreensao parcial do que os usuarios querem.
2. **Sistema**: compreensao limitada de como o sistema se comporta em situacoes complexas.
3. **Evolucao**: requisitos mudam conforme casos de uso e usuarios evoluem.

### 6.2 Estrategias para Lidar com Incerteza
1. Tome decisoes o mais tarde possivel — quando comecamos o design, sabemos menos sobre o sistema.
2. Projete para ser facil de entender e mudar — problemas mudam com o tempo.
3. Diga "nao" a funcionalidades tanto quanto possivel — muitos recursos raramente sao usados.
4. Faca analise de custo esperado: calcule o custo de ter uma opcao vs o custo de nao te-la.

### 6.3 Exemplo de Analise de Trade-off
- Custo de ser portavel entre clouds: 50% mais caro.
- Probabilidade de precisar migrar: 10%.
- Custo esperado de ser portavel: 150%.
- Custo de portar depois: 250% (com 10% de probabilidade = 25% adicional).
- Custo esperado de nao ser portavel: 125%.
- **Decisao**: nao ser portavel agora e a opcao mais barata.

---

## 7. Checklist de Decisao Arquitetural

- [ ] As 5 perguntas foram respondidas antes da decisao?
- [ ] O contexto de negocios foi considerado (prazos, time, concorrencia)?
- [ ] A decisao esta alinhada com os 7 principios?
- [ ] Os trade-offs foram explicitamente documentados?
- [ ] A incerteza foi gerenciada (nao passada para o time)?
- [ ] O que e dificil de mudar foi projetado profundamente?
- [ ] O que e facil de mudar foi implementado rapidamente?
- [ ] Ha um plano para eliminar incertezas com evidencia?
