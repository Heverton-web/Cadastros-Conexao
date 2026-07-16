---
name: epub-estruturas-de-dados-domine-as-pr-ticas-essenc
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Estruturas De Dados Domine As Praticas — Passos Operacionais

Conteudo extraido do livro 'Epub Estruturas De Dados Domine As Praticas'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Além destes, a todos os meus colegas de profissão e faculdade que me ajudaram a me tornar o profissional de sucesso que sou hoje._  _Agradecimento especial a Maikol Rodrigues, meu professor (de Estrutura de Dados!) nos tempos da faculdade e, hoje, colega de trabalho.
- Muitas foram as conversas e dicas durante a escrita deste livro.
- Um agradecimento especial ao Hugo Benício, também colega de trabalho e que sempre foi solícito quando surgiam dificuldades com as linguagens C e Python.
- Obrigado pelo apoio e o incentivo de vocês na escrita de mais um livro.
- Grande abraço!_   # Sobre o autor  Olá, pessoal!
- Meu nome é Thiago Leite e Carvalho.
- Adoro desenvolvimento e trabalho com isso desde 2003.
- Desde os estágios no tempo de faculdade até hoje, já trabalhei em empresas de vários ramos e tipos: software house, empresas públicas, no ramo da saúde, indústrias, entre outros.
- Também já prestei algumas consultorias focadas no desenvolvimento.
- Sou graduado e mestre em Engenharia de Software pela Universidade de Fortaleza.


  - As estruturas de dados são fundamentais para qualquer pessoa desenvolvedora, pois são a base para a construção de algoritmos eficientes e sistemas computacionais robustos. Elas permitem a programadores e programadoras armazenarem e manipularem dados de forma organizada e otimizada, o que resulta em programas mais rápidos e eficientes. Além disso, as estruturas de dados são essenciais para a solução de problemas complexos em diversas áreas, como na inteligência artificial, onde pode ser usada em _Machine Learning_ ; no processamento de imagens, para a detecção de padrões; na análise de dados, para avaliações quantitativas e analíticas; na Engenharia de Software, para a construção de soluções que visam à automatização de atividades e processos, entre diversas outras. Ou seja, qualquer que seja o curso (Engenharia da Computação, Análise e Desenvolvimento de Sistemas ou Ciência da Computação), as Estruturas de Dados são uma teoria essencial para a formação de profissionais. Portanto, um entendimento eficaz das estruturas de dados é crucial para que os profissionais da área de computação desenvolvam habilidades sólidas e estejam preparados para enfrentar os desafios cada vez mais complexos na área da Tecnologia da Informação.

  - Em `(a)`, temos um _árvore clássica_ onde os nós estão todos ordenados entre si, da esquerda para a direita. Já em `(b)`, temos uma _árvore binária_ onde os nós estão ordenados em relação a _pais_ e _filhos_. Vale ressaltar que as únicas árvores que são **obrigatoriamente** ordenadas é a **Binária de busca** e **AVL** , lembrando que esta última é um tipo mais específico da primeira. As demais, só se for necessário ao problema que o uso de árvores ajuda a resolver. Por exemplo, se usarmos uma _árvore ordenada_ para armazenar as matrículas de alunos de uma universidade, quando formos realizar uma pesquisa é melhor que ela esteja ordenada, pois assim garantimos que pesquisaremos em no máximo 50% das matrículas e não em todas. Isso vem do fato de que a ordenação leva a uma distribuição onde 50% dos valores estarão à esquerda e os outros 50% à direita. Assim, ao comparar com a matrícula de referência, saberíamos para que lado ir: para matrícula menores, à esquerda, e maiores, à direita.

  - Para elucidar o que de fato é uma lista, podemos explorar o exemplo citado da "lista de compras". Sabemos que essa lista possui uma _quantidade inicial_ de itens, mas que pode _aumentar_ , caso seja notado durante a compra que itens estavam faltando. Geralmente, mas não obrigatoriamente, esses novos itens vão sendo acrescentados ao final da lista. Também sabemos que podemos _eliminar_ itens de forma não sequencial, pois vamos "riscando" da lista os que vão sendo comprados de acordo com o momento em que vamos nos deparando com eles no caminhar pelo supermercado. A eliminação não tem uma sequência definida. Podemos também _alterar_ a lista. Por exemplo, se inicialmente tínhamos colocado uma determinada quantidade de um item, podemos comprar mais ou menos dele. Ou seja, modificamos pontualmente dentro da lista um de seus elementos.

  - Nas listas duplamente encadeadas, temos dois sentidos de navegação: início → fim (esquerda/direita) e fim → início (direita/esquerda), possibilitando a navegação em ambos os sentidos. Isso é possível porque listas duplas têm a capacidade de ter o conhecimento do seu próximo elemento assim como de seu antecessor. Além disso, elas podem memorizar o elemento atual, que foi acessado pela última operação `get`. Por exemplo, se tivermos uma lista com 15 posições e for executado um `get(13)` e depois um `get(9)`, o segundo `get` não precisará ir ao início da lista até chegar à posição `9`, mas sim executará a partir da posição `13`. Dessa forma, será realizada uma navegação no sentido fim → início, passando pelas posições `12`, `11`, `10` e chegando na `9`, pois a posição `9` antecede a posição `13`.

  - Olá, pessoal! Meu nome é Thiago Leite e Carvalho. Adoro desenvolvimento e trabalho com isso desde 2003. Desde os estágios no tempo de faculdade até hoje, já trabalhei em empresas de vários ramos e tipos: software house, empresas públicas, no ramo da saúde, indústrias, entre outros. Também já prestei algumas consultorias focadas no desenvolvimento. Sou graduado e mestre em Engenharia de Software pela Universidade de Fortaleza. Já embarquei no mundo acadêmico e por dez anos fui professor de algumas faculdades, ministrando cadeiras de Programação Orientada a Objetos I e II; Engenharia de Software; Projeto e Arquitetura de Software; Linguagens Formais e Autômatos; Compiladores e Estruturas de Dados. Adoro lecionar e parto do princípio de que a melhor forma de aprender é ensinar.

  - Após as entranhas das estruturas de dados terem sido exploradas, chega a hora de usá-las de fato. Entretanto, no "mundo real", onde reinam linguagens Orientadas a Objetos (OO) ou Funcionais, usar ponteiros realmente não é mais a única opção. Assim, nesta parte do livro, as estruturas de dados clássicas serão apresentadas nas principais linguagens do mercado: Java, C#, Python e JavaScript. Essas linguagens abstraem o uso de ponteiros, o que nos ajuda a focar no problema a resolver, e não em criar a estrutura de dados em si. Além disso, algumas outras estruturas de dados úteis que estas linguagens disponibilizam também serão apresentadas. Então, se você desenvolve especificamente em Java, C#, Python ou JavaScript, aconselho focar nos respectivos capítulos.
## 2. Principios e Tecnicas
- Já embarquei no mundo acadêmico e por dez anos fui professor de algumas faculdades, ministrando cadeiras de Programação Orientada a Objetos I e II; Engenharia de Software; Projeto e Arquitetura de Software; Linguagens Formais e Autômatos; Compiladores e Estruturas de Dados.
- Adoro lecionar e parto do princípio de que a melhor forma de aprender é ensinar.
- Profissionalmente, sou programador Java e possuo conhecimento nos frameworks deste universo: Spring, Hibernate, JSF, Struts etc.
- Possuo três certificações em Java.
- Também já fui desenvolvedor C# e possuo conhecimentos em Python e Angular.
- Resumindo, sou um entusiasta do desenvolvimento de software.
- Atualmente, sou funcionário público, trabalhando no Serpro, empresa de tecnologia do Governo Federal do Brasil.
- Dedico-me a escrever livros, artigos para o LinkedIn e a produzir cursos para a Udemy.
- Além disso, também ministro cursos e palestras para instituições.
- Caso queira saber um pouco mais sobre mim, acesse o meu perfil no LinkedIn: <https://www.linkedin.com/in/thiago-leite-e-carvalho-1b337b127/>.   # Prefácio  As estruturas de dados são fundamentais para qualquer pessoa desenvolvedora, pois são a base para a construção de algoritmos eficientes e sistemas computacionais robustos.


  - Muitas vezes precisamos ter acesso a elementos em uma estrutura de dados de forma rápida. Sabemos que, ao usar _vetores_ , conseguimos esse acesso rápido, mas teremos a desvantagem de ter o tamanho fixo da estrutura. Então podemos pensar em usar uma _lista_ , que tem tamanho variável. Todavia, teremos um processo lento de leitura, pois teremos que navegar por ela — de elemento em elemento — para encontrar o elemento desejado. Baseado nessas informações, talvez se cogite usar uma _árvore_ , que tem o dinamismo desejado e o acesso rápido, caso se use uma _árvore binária ordenada_ , por exemplo. Mas ela pode se tornar lenta, caso sua profundidade seja muito grande, além de consumir mais memória para percorrê-la, devido à recursividade.

  - É válido ressaltar que, para facilitar o alcance destes objetivos, este livro foca exclusivamente nas estruturas de dados. Ou seja, um conceito recorrentemente exposto de forma conjunta como _busca e ordenação_ não estará presente neste livro. Todavia, ele pode ser encontrado em literaturas específicas de _algoritmos_ e _complexidade de algoritmos_. Outra observação relevante ao modo como este livro é organizado é o fato de que, na Parte 1, as explicações sobre as teorias das estruturas de dados são mais detalhadas; por outro lado, na Parte 2, que foca nas linguagens, apenas focamos na definição e no uso de tais estruturas. Assim, temos a possibilidade de explorar algumas nuanças de cada linguagem para tais estruturas.

  - Dessa forma, podemos então detectar que, diferentemente das EDs anteriormente estudadas, que eram lineares, as árvores possuem um processo de acesso aos seus elementos (_nós_) mais aprimorado por ser hierárquica, pois não apenas temos a ideia de _cima-baixo_ ou _esquerda-direita_ , mas, sim, uma ordem de navegação pelos elementos (nós) que, a depender da forma utilizada, levará a um diferente resultado de exibição. É válido informar que essas navegações podem ser _à esquerda_ ou _à direta_ , e que uma não é melhor do que a outra, sendo apenas uma questão referencial. Todavia, a navegação _à esquerda_ é universalmente a mais utilizada e é a adotada neste livro. Essas formas de navegação são apresentadas a seguir.

  - Somos responsáveis por criar os softwares que automatizarão e agilizarão a execução de atividades antes demoradas e maçantes. Entender com precisão como funcionam tais estruturas e saber usá-las da forma adequada é primordial. Embora inicialmente sejam assuntos complexos, com o passar do tempo chegaremos à conclusão de que, na verdade, são praticamente inerentes ao nosso dia a dia, seja como consumidor ou criador dessas estruturas. Ao encará-las dessa forma, seu entendimento se tornará mais natural e acessível, o que possibilitará uma utilização eficaz e eficiente, que resultará em softwares de alta qualidade. No fim, tudo será uma questão de amadurecimento do raciocínio lógico, que virá com tempo e prática.
## 3. Aplicacoes Praticas
- Elas permitem a programadores e programadoras armazenarem e manipularem dados de forma organizada e otimizada, o que resulta em programas mais rápidos e eficientes.
- Além disso, as estruturas de dados são essenciais para a solução de problemas complexos em diversas áreas, como na inteligência artificial, onde pode ser usada em _Machine Learning_ ; no processamento de imagens, para a detecção de padrões; na análise de dados, para avaliações quantitativas e analíticas; na Engenharia de Software, para a construção de soluções que visam à automatização de atividades e processos, entre diversas outras.
- Ou seja, qualquer que seja o curso (Engenharia da Computação, Análise e Desenvolvimento de Sistemas ou Ciência da Computação), as Estruturas de Dados são uma teoria essencial para a formação de profissionais.
- Portanto, um entendimento eficaz das estruturas de dados é crucial para que os profissionais da área de computação desenvolvam habilidades sólidas e estejam preparados para enfrentar os desafios cada vez mais complexos na área da Tecnologia da Informação.
- Conheço o Thiago desde 2001 e venho acompanhando o seu caminhar desde a época da universidade, quando ele foi meu aluno nas disciplinas de Estruturas de Dados e Pesquisa Operacional.
- Atualmente somos colegas de trabalho: em 2012, comecei a trabalhar na mesma empresa que ele.
- Thiago sempre se destacou no desenvolvimento na linguagem C e em Java com Orientação a Objetos e, por isso, já foi convidado a ministrar em empresas e universidades diversos cursos, como Java, Hibernate, Spring, entre outros.
- Também já trabalhou com a plataforma .Net por 4 anos.
- Com o início da carreira de professor universitário, juntamente com os anos de experiência em desenvolvimento, ele percebeu a dificuldade de seus alunos e alunas – e até mesmo de profissionais com experiência em programação – de realmente compreenderem e aplicarem os conceitos práticos de Estruturas de Dados.
- Essas pessoas cometiam falhas na escolha das estruturas de dados mais adequadas e eficientes para a resolução de problemas específicos.

## 4. Topicos Avancados
- Ele também percebeu que existia uma lacuna de textos didáticos, focados em explicar detalhadamente as estruturas de dados clássicas e também em abordá-las nas principais linguagens que o mercado utiliza.
- Por tudo isso, ele resolveu escrever este livro.
- Thiago teve o cuidado de selecionar as principais e mais utilizadas estruturas de dados e apresentar, de forma clara e objetiva, os principais conceitos de cada uma delas.
- Além de vários exemplos (códigos) explicados de forma minuciosa, são apresentadas também implementações em várias linguagens de programação.
- A linguagem C é a mais utilizada no decorrer do livro, mas também são exploradas as linguagens Java, C#, Python e JavaScript.
- A organização dos conceitos de forma fluida e gradativa facilita o aprendizado e desmistifica a complexidade atribuída a esse assunto.
- Um grande diferencial deste livro é que ele aborda as estruturas de dados (ED) de forma simples, concisa e com exemplos do nosso dia a dia, mostrando que elas são mais naturais do que imaginamos.
- O livro inicia com conceitos básicos e inerentes a Estruturas de Dados e Computação, passando pelas EDs mais básicas e seguindo até as mais avançadas.
- Nessa trilha, sempre são fornecidos textos e códigos comentados com o intuito de facilitar a absorção do conteúdo.
- Para finalizar, vários exercícios são apresentados para complementar o aprendizado e todos eles estão resolvidos e disponíveis para leitores e leitoras.

