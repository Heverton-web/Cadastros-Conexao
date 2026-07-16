---
name: estruturas-de-dados-e-algoritmos-com-javascript-gr
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Estruturas De Dados E Algoritmos Com Javascript — Passos Operacionais

Conteudo extraido do livro 'Estruturas De Dados E Algoritmos Com Javascript'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- 2ª Edição  Loiane Groner   ##   Novatec   Copyright © Packt Publishing 2018.
- First published in the English language under the title ‘Learning JavaScript Data Structures and Algorithms - Third Edition – (9781788623872)’   ## Copyright © Packt Publishing 2018.
- Publicação original em inglês intitulada ‘Learning JavaScript Data Structures and Algorithms - Third Edition – (9781788623872)’  ## Esta tradução é publicada e vendida com a permissão da Packt Publishing.  ## © Novatec Editora Ltda. [2018].  ## Todos os direitos reservados e protegidos pela Lei 9.610 de 19/02/1998.
- É proibida a reprodução desta obra, mesmo parcial, por qualquer processo, sem prévia autorização, por escrito, do autor e da Editora.  ## Editor: Rubens Prates  Tradução: Lúcia A.
- Kinoshita  Revisão gramatical: Tássia Carvalho  Editoração eletrônica: Carolina Kuwabata   ## ISBN: 978-85-7522-728-2  ## Histórico de edições impressas:  ## Fevereiro/2019 Segunda edição  Abril/2018 Primeira reimpressão  Março/2017 Primeira edição (ISBN: 978-85-7522-553-0)   ## Novatec Editora Ltda.
- Rua Luís Antônio dos Santos 110  02460-000 – São Paulo, SP – Brasil  Tel.: +55 11 2959-6529  E-mail: [novatec@novatec.com.br](mailto:novatec%40novatec.com.br?subject=)  Site: [www.novatec.com.br](http://www.novatec.com.br)  Twitter: [twitter.com/novateceditora](http://twitter.com/novateceditora)  Facebook: [facebook.com/novatec](http://facebook.com/novatec)  LinkedIn: [linkedin.com/in/novatec](http://linkedin.com/in/novatec)   # Aos meus pais, por seu amor e assistência, e por me guiarem durante todos esses anos.
- Atualmente, trabalha como analista de negócios e desenvolvedora de Java/HTML5/JavaScript em uma instituição financeira norte-americana.
- É apaixonada por tecnologia, publica artigos em seu blog e ministra palestras em conferências sobre Java, ExtJS, Cordova, Ionic, TypeScript e Angular.
- É Google Developer Expert em Web Technologies (Tecnologias Web) e Angular, e Microsoft Most Valuable Professional em Visual Studio e Development Technologies (Tecnologias de Desenvolvimento).
- É também autora de outros livros da Packt.


  - As estruturas de dados são fundamentais para qualquer pessoa desenvolvedora, pois são a base para a construção de algoritmos eficientes e sistemas computacionais robustos. Elas permitem a programadores e programadoras armazenarem e manipularem dados de forma organizada e otimizada, o que resulta em programas mais rápidos e eficientes. Além disso, as estruturas de dados são essenciais para a solução de problemas complexos em diversas áreas, como na inteligência artificial, onde pode ser usada em _Machine Learning_ ; no processamento de imagens, para a detecção de padrões; na análise de dados, para avaliações quantitativas e analíticas; na Engenharia de Software, para a construção de soluções que visam à automatização de atividades e processos, entre diversas outras. Ou seja, qualquer que seja o curso (Engenharia da Computação, Análise e Desenvolvimento de Sistemas ou Ciência da Computação), as Estruturas de Dados são uma teoria essencial para a formação de profissionais. Portanto, um entendimento eficaz das estruturas de dados é crucial para que os profissionais da área de computação desenvolvam habilidades sólidas e estejam preparados para enfrentar os desafios cada vez mais complexos na área da Tecnologia da Informação.

  - Em `(a)`, temos um _árvore clássica_ onde os nós estão todos ordenados entre si, da esquerda para a direita. Já em `(b)`, temos uma _árvore binária_ onde os nós estão ordenados em relação a _pais_ e _filhos_. Vale ressaltar que as únicas árvores que são **obrigatoriamente** ordenadas é a **Binária de busca** e **AVL** , lembrando que esta última é um tipo mais específico da primeira. As demais, só se for necessário ao problema que o uso de árvores ajuda a resolver. Por exemplo, se usarmos uma _árvore ordenada_ para armazenar as matrículas de alunos de uma universidade, quando formos realizar uma pesquisa é melhor que ela esteja ordenada, pois assim garantimos que pesquisaremos em no máximo 50% das matrículas e não em todas. Isso vem do fato de que a ordenação leva a uma distribuição onde 50% dos valores estarão à esquerda e os outros 50% à direita. Assim, ao comparar com a matrícula de referência, saberíamos para que lado ir: para matrícula menores, à esquerda, e maiores, à direita.

  - Para elucidar o que de fato é uma lista, podemos explorar o exemplo citado da "lista de compras". Sabemos que essa lista possui uma _quantidade inicial_ de itens, mas que pode _aumentar_ , caso seja notado durante a compra que itens estavam faltando. Geralmente, mas não obrigatoriamente, esses novos itens vão sendo acrescentados ao final da lista. Também sabemos que podemos _eliminar_ itens de forma não sequencial, pois vamos "riscando" da lista os que vão sendo comprados de acordo com o momento em que vamos nos deparando com eles no caminhar pelo supermercado. A eliminação não tem uma sequência definida. Podemos também _alterar_ a lista. Por exemplo, se inicialmente tínhamos colocado uma determinada quantidade de um item, podemos comprar mais ou menos dele. Ou seja, modificamos pontualmente dentro da lista um de seus elementos.

  - Nas listas duplamente encadeadas, temos dois sentidos de navegação: início → fim (esquerda/direita) e fim → início (direita/esquerda), possibilitando a navegação em ambos os sentidos. Isso é possível porque listas duplas têm a capacidade de ter o conhecimento do seu próximo elemento assim como de seu antecessor. Além disso, elas podem memorizar o elemento atual, que foi acessado pela última operação `get`. Por exemplo, se tivermos uma lista com 15 posições e for executado um `get(13)` e depois um `get(9)`, o segundo `get` não precisará ir ao início da lista até chegar à posição `9`, mas sim executará a partir da posição `13`. Dessa forma, será realizada uma navegação no sentido fim → início, passando pelas posições `12`, `11`, `10` e chegando na `9`, pois a posição `9` antecede a posição `13`.

  - Olá, pessoal! Meu nome é Thiago Leite e Carvalho. Adoro desenvolvimento e trabalho com isso desde 2003. Desde os estágios no tempo de faculdade até hoje, já trabalhei em empresas de vários ramos e tipos: software house, empresas públicas, no ramo da saúde, indústrias, entre outros. Também já prestei algumas consultorias focadas no desenvolvimento. Sou graduado e mestre em Engenharia de Software pela Universidade de Fortaleza. Já embarquei no mundo acadêmico e por dez anos fui professor de algumas faculdades, ministrando cadeiras de Programação Orientada a Objetos I e II; Engenharia de Software; Projeto e Arquitetura de Software; Linguagens Formais e Autômatos; Compiladores e Estruturas de Dados. Adoro lecionar e parto do princípio de que a melhor forma de aprender é ensinar.

  - Após as entranhas das estruturas de dados terem sido exploradas, chega a hora de usá-las de fato. Entretanto, no "mundo real", onde reinam linguagens Orientadas a Objetos (OO) ou Funcionais, usar ponteiros realmente não é mais a única opção. Assim, nesta parte do livro, as estruturas de dados clássicas serão apresentadas nas principais linguagens do mercado: Java, C#, Python e JavaScript. Essas linguagens abstraem o uso de ponteiros, o que nos ajuda a focar no problema a resolver, e não em criar a estrutura de dados em si. Além disso, algumas outras estruturas de dados úteis que estas linguagens disponibilizam também serão apresentadas. Então, se você desenvolve especificamente em Java, C#, Python ou JavaScript, aconselho focar nos respectivos capítulos.
## 2. Principios e Tecnicas
- Gostaria de agradecer aos meus pais a educação, a orientação e os conselhos que me deram por todos esses anos, e ao meu marido por ser paciente e me apoiar, incentivando-me para que eu continue fazendo o que amo.
- Também gostaria de agradecer aos leitores deste e de outros livros que escrevi o apoio e o feedback.
- Sobre os revisores  Todd Zebert é desenvolvedor web full stack e trabalha atualmente na Miles.
- Já foi revisor técnico de vários livros e vídeos, é palestrante frequente em conferências sobre JavaScript, Drupal e tecnologias relacionadas, além de ter um blog de tecnologia na Medium.
- Tem experiência prévia diversificada em tecnologia, incluindo infraestrutura, engenharia de rede, gerenciamento de projetos e liderança em TI.
- Começou a trabalhar com desenvolvimento web no navegador Mosaic original.
- É empreendedor e faz parte da comunidade de startups de Los Angeles.
- Acredita em trabalhos voluntários, código aberto, maker/STEM/STEAM e em retribuição à comunidade.
- Kashyap Mukkamala é um arquiteto de software entusiasmado, trabalha na Egen Solutions Inc. e é autor do livro Hands-On Data Structures and Algorithms with JavaScript.
- Quando não está resolvendo problemas de empresas Fortune 500 na Egen, Kashyap concentra-se em construir a web do futuro e, com isso, está ajudando a comunidade a crescer e a aprender.   # Prefácio  JavaScript, uma das linguagens de programação mais populares atualmente, é conhecida como a linguagem da internet porque os navegadores a entendem de modo nativo, sem a instalação de qualquer plugin.


  - Muitas vezes precisamos ter acesso a elementos em uma estrutura de dados de forma rápida. Sabemos que, ao usar _vetores_ , conseguimos esse acesso rápido, mas teremos a desvantagem de ter o tamanho fixo da estrutura. Então podemos pensar em usar uma _lista_ , que tem tamanho variável. Todavia, teremos um processo lento de leitura, pois teremos que navegar por ela — de elemento em elemento — para encontrar o elemento desejado. Baseado nessas informações, talvez se cogite usar uma _árvore_ , que tem o dinamismo desejado e o acesso rápido, caso se use uma _árvore binária ordenada_ , por exemplo. Mas ela pode se tornar lenta, caso sua profundidade seja muito grande, além de consumir mais memória para percorrê-la, devido à recursividade.

  - É válido ressaltar que, para facilitar o alcance destes objetivos, este livro foca exclusivamente nas estruturas de dados. Ou seja, um conceito recorrentemente exposto de forma conjunta como _busca e ordenação_ não estará presente neste livro. Todavia, ele pode ser encontrado em literaturas específicas de _algoritmos_ e _complexidade de algoritmos_. Outra observação relevante ao modo como este livro é organizado é o fato de que, na Parte 1, as explicações sobre as teorias das estruturas de dados são mais detalhadas; por outro lado, na Parte 2, que foca nas linguagens, apenas focamos na definição e no uso de tais estruturas. Assim, temos a possibilidade de explorar algumas nuanças de cada linguagem para tais estruturas.

  - Dessa forma, podemos então detectar que, diferentemente das EDs anteriormente estudadas, que eram lineares, as árvores possuem um processo de acesso aos seus elementos (_nós_) mais aprimorado por ser hierárquica, pois não apenas temos a ideia de _cima-baixo_ ou _esquerda-direita_ , mas, sim, uma ordem de navegação pelos elementos (nós) que, a depender da forma utilizada, levará a um diferente resultado de exibição. É válido informar que essas navegações podem ser _à esquerda_ ou _à direta_ , e que uma não é melhor do que a outra, sendo apenas uma questão referencial. Todavia, a navegação _à esquerda_ é universalmente a mais utilizada e é a adotada neste livro. Essas formas de navegação são apresentadas a seguir.

  - Somos responsáveis por criar os softwares que automatizarão e agilizarão a execução de atividades antes demoradas e maçantes. Entender com precisão como funcionam tais estruturas e saber usá-las da forma adequada é primordial. Embora inicialmente sejam assuntos complexos, com o passar do tempo chegaremos à conclusão de que, na verdade, são praticamente inerentes ao nosso dia a dia, seja como consumidor ou criador dessas estruturas. Ao encará-las dessa forma, seu entendimento se tornará mais natural e acessível, o que possibilitará uma utilização eficaz e eficiente, que resultará em softwares de alta qualidade. No fim, tudo será uma questão de amadurecimento do raciocínio lógico, que virá com tempo e prática.
## 3. Aplicacoes Praticas
- A linguagem JavaScript evoluiu muito, a ponto de não ser mais apenas uma linguagem de frontend; nos dias de hoje, ela está igualmente presente no servidor (NodeJS), no banco de dados (MongoDB) e em dispositivos móveis, além de ser usada em dispositivos embarcados e na Iot (Internet of Things, ou Internet das Coisas).
- Conhecer as estruturas de dados é muito importante para qualquer profissional da área de tecnologia.
- Trabalhar como desenvolvedor significa ser capaz de resolver problemas com a ajuda das linguagens de programação, e as estruturas de dados são uma parte indispensável das soluções que precisamos criar para resolver esses problemas.
- Escolher uma estrutura de dados incorreta também pode impactar o desempenho do programa que escrevemos.
- Por isso, é importante conhecer as diferentes estruturas de dados e saber aplicá-las de forma apropriada.
- Os algoritmos são o estado da arte em ciência da computação.
- Há muitas maneiras de resolver o mesmo problema, e algumas abordagens são melhores que outras.
- É por isso que conhecer os algoritmos mais famosos também é muito importante.
- Este livro foi escrito para iniciantes que queiram conhecer estruturas de dados e algoritmos, mas também para aqueles que já tenham familiaridade com eles, mas desejem conhecê-los usando JavaScript.
- A quem este livro se destina  Se você é estudante de ciência da computação ou está iniciando a sua carreira na área de tecnologia e quer explorar os melhores recursos de JavaScript, este livro foi escrito para você.

## 4. Topicos Avancados
- Se já tem familiaridade com programação, mas quer aperfeiçoar suas habilidades com algoritmos e estruturas de dados, este livro também foi feito para você.
- Basta ter conhecimento básico de JavaScript e de lógica de programação para começar a se divertir com os algoritmos.
- O que este livro inclui  O Capítulo 1, JavaScript – uma visão geral rápida, apresenta o básico sobre JavaScript, aquilo que devemos conhecer antes de ver as estruturas de dados e os algoritmos.
- Além disso, aborda a configuração do ambiente de desenvolvimento de que precisaremos neste livro.
- O Capítulo 2, Visão geral sobre ECMAScript e TypeScript, aborda algumas funcionalidades novas de JavaScript introduzidas a partir de 2015, além de incluir as funcionalidades básicas do TypeScript, um superconjunto do JavaScript.
- O Capítulo 3, Arrays, explica como usar a estrutura de dados mais básica e mais utilizada, os arrays.
- Esse capítulo mostra como declarar, inicializar, adicionar e remover elementos de um array.
- Também aborda o uso dos métodos do Array nativo de JavaScript.
- O Capítulo 4, Pilhas, apresenta a estrutura de dados de pilha, mostrando como criar, adicionar e remover elementos dela.
- Também mostra como usar pilhas para resolver alguns problemas relacionados à ciência da computação.

