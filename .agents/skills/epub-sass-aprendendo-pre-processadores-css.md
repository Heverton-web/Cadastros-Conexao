---
name: epub-sass-aprendendo-pr-processadores-css
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Sass Aprendendo Pre Processadores Css — Passos Operacionais

Conteudo extraido do livro 'Epub Sass Aprendendo Pre Processadores Css'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Preparando o ambiente](01-preparando-o-ambiente.html)   * [2\.
- O projeto Apeperia](02-projeto.html)   * [3\.
- Reutilizando seu código com mixins](03-mixins.html)   * [4\.
- Um perigoso atalho no código](04-aninhamento.html)   * [5\.
- Organizando a bagunça](05-imports.html)   * [6\.
- Cores de forma mais fácil](06-funcoes-de-cor.html)   * [7\.
- Melhorando a performance com extends e placeholders](07-extends-e-placeholders.html)   * [8\.
- Aproximando regras CSS e media queries](08-mq-no-seletor.html)   * [9\.
- Códigos prontos com Compass](09-compass.html)   * [10\.
- Calculando e retornando valores](10-operacoes-matematicas.html)   * [11\.


  - O problema de qualquer pré-processador, pegando o Sass e o LESS como exemplo, é que os browsers não os entendem nativamente, mesmo sendo linguagens de estilos. A única linguagem desse tipo que os browsers compreendem atualmente é o bom e velho CSS. E é justamente por esse motivo que é necessário pegar códigos feitos em Sass/LESS/_SeuPreProcessadorFavoritoAqui_ e compilá-los em CSS comum, para que assim o browser consiga entendê-lo de fato. Algo que ilustro com a figura:

  - Visando seguir os passos do Twitter, poderíamos pegar todo o nosso código do Apeperia, todos os _mixins_ e _extends_ , e disponibilizarmos na internet, a fim de facilitar a vida de outros desenvolvedores que passem pelos mesmos problemas que nós — como a criação de um _mixin_ de borda arredondada, por exemplo. Mas será que fomos nós os primeiros desbravadores de código que precisamos fazer um _image replacement_ na vida? Ou uma sombra padrão? Provavelmente não.

  - Para resetar os estilos aplicados pelo browser, chamamos o `normalize.css`, que é um dos muitos _CSS Resets_ que existem por aí. A diferença é que ele não é tão agressivo como a maioria. Chamamos também nossa folha de estilos comum, a `estilos.css`, que foi criada pela equipe de _front-end_ da empresa. Há também o `media-queries.css`, que contém algumas regras sobrescritas, e finamente uma chamada para o **Google Fonts** para usarmos a fonte Roboto.

  - A cor de um elemento visual, um botão ou um logo é uma das primeiras coisas que vem à mente quando pensamos em _rebranding_ , mudar a identidade visual da empresa. Um problema que existe na área de design são os chamados "flanelinhas de layout". Se você, querido leitor, for da área de design, já deve ter ouvido frases como: _"coloca um pouco mais pra direita"_ , _"deixa uma cor mais sóbria"_ e _"tenta dar um ar mais honesto"_. Acontece, também.

  - Os nomes das classes desse código foram baseados no nome da nossa pasta (`sprite`) e nos arquivos que ali estão (`icone-check.png` e `icone-x.png`). Logo, precisamos atualizar em nosso `index.html` os nomes das classes dos elementos `span`, que estão dentro da seção de Planos. Onde há a classe `icone-x`, trocaremos pela classe `sprite-icone-x`, e o mesmo com a classe `icone-check`, mudando-a para `sprite-icone-check`. Vejo o exemplo a seguir:

  - E se precisássemos utilizar outro prefixo sempre que usarmos o `border-radius`? O prefixo `-moz-`, por exemplo. Teríamos de fazer essa alteração em quatro regras diferentes, onde está o _DRY_? Sempre que repetimos muito um valor, acabamos solucionando isso com uma variável, e quando repetimos muito um trecho de código, podemos utilizar uma funcionalidade presente em todos os pré-processadores mais conhecidos, chamada **mixin**.
## 2. Principios e Tecnicas
- Conselhos finais](11-conselhos.html)     # ISBN    * Impresso e PDF: 978-85-5519-204-3   * Epub: 978-85-5519-205-0   * Mobi: 978-85-5519-206-7     # Agradecimentos  _"I am Alpha and Omega, the beginning and the end, I will give unto him that is athirst of the fountain of the water of life, freely."_ — Revelation 21:6  Quando um dos meus chefes deu a ideia _"E se você fizer um livro de Sass?"_ , achei inocentemente que seria o mestre do foco e escreveria em poucas semanas.
- Gosto de terminar as coisas que começo.
- Mas, rapaz, escrever é complicado.
- Exige uma dedicação fora do comum.
- Um post que você faz em meia hora não se compara em nada com isso.
- Mas, no fim, deu tudo certo e a prova é que você está aí lendo este livro.
- Contudo, não o escrevi sozinho.
- Quero agradecer a Caelum e todos os "caelumers" por me ajudarem direta, ou indiretamente, na concepção deste livro, desde um papo motivador até as revisões técnicas e gramaticais.
- A todos meus alunos que sempre me ensinaram algo a mais em todas as aulas que ministrei.
- E muito obrigado a você, leitor, que investiu seu dinheiro neste livro e investirá sua dedicação a ele.


  - Identificar pelo dispositivo é uma boa. Mas até que ponto um aparelho é considerado mobile ou desktop? Ou tablet, ou _phablet_? Por isso, foi adotada uma convenção de se pegar o **tamanho** da tela como parâmetro. Se a tela tiver **X** pixels de largura, fique de uma maneira; se tiver **Y** , fique de outra. E uma das formas que temos para fazer isso é utilizando o recurso de **_media query_** , disponível a partir do CSS3.

  - Uma prática muito comum para melhorar a performance de sites é diminuir o número de _requests_ que a página faz para o servidor — ou seja, menos pedidos de arquivos que nosso HTML solicita ao servidor. Quando tratamos de HTTP2, isso não é um problema, mas para fins de HTTP normal, diminuir o número de _requests_ é uma boa. Podemos deixar o tempo de carregamento do site mais rápido, como ilustro na figura seguinte:

  - Uma boa prática de qualquer linguagem é sempre utilizar os comentários a fim de deixar seu código bem documentado, seja para explicar ou separar seções diferentes. Nosso código já veio bem comentado. Podemos encontrar comentários separando as seções como `/** Header **/` ou `/** Destaque **/`. Como separamos essas seções em vários arquivos, poderíamos até mesmo subtrair esses comentários, mas manter o padrão.

  - Para resolver nosso problema e permitir que qualquer arquivo use a variável, deixamos ela direto no `variaveis.scss`, tornando-a global/pública. Essa ideia de escopo vale tanto para arquivos diferentes quanto para regras diferentes. Se mantivéssemos a criação da variável na regra `footer .container`, ela só existiria ali dentro daquele escopo específico, podendo ser usada em declarações dessa mesma regra CSS.
## 3. Aplicacoes Praticas
- Dedico este livro a Paula Midori, Claudia e Ivo, pelas enormes doses de paciência, amor e conselhos que me dão diariamente.
- São meus três fortes pilares que tenho na vida e tenho certeza de que, sem eles, não seria nada.
- Também deixo minha lembrança póstuma a Issao Nakayama, com quem convivi relativamente pouco, mas que com certeza sempre será lembrado.   # Sobre o autor  Natan Souza é front-end designer no grupo Caelum desde 2015, e instrutor dos cursos presenciais de front-end e UX.
- Além disso, também produz cursos online dessas áreas para a Alura, incluindo os cursos de Sass e LESS.
- Começou a dar seus primeiros cliques no Photoshop ainda em 2005, o que o levaria a se interessar pela área de Design, e graduando-se bacharel em Design Digital anos mais tarde.
- Está focado na área de web e UX desde 2009, passando por empresas como FIAP e PMESP.
- Atuou como front-end e designer em toda a sua trajetória profissional.    * Twitter: @designernatan    * LinkedIn: <http://bit.ly/linkedinDoNatan>    * Site: <http://www.designernatan.com.br>      # Prefácio  Não importa se você já trabalha com front-end há dois, cinco, ou mesmo dez anos.
- Nossa área é um ser totalmente orgânico que muda constantemente, o tempo todo.
- Toda dia surge alguma técnica, framework ou linguagem nova.
- E caso um desses vire "moda" e caia no gosto dos desevolvedores por algum motivo, lá vamos nós mais uma vez estudar e adaptar nossa rotina para abraçar a novidade.

## 4. Topicos Avancados
- Você pode muito bem se fechar na sua zona de conforto e negar tudo de novidade que vem de fora — o que acredito ser uma atitude bem compreensível, visto que o medo do desconhecido está impregnado em nosso DNA.
- Apesar de compreensível, pessoalmente acredito que essa escolha seja bem perigosa, uma vez que existe muito risco envolvido, e você pode acabar parado no tempo.
- Depois de um certo amadurecimento de nossa área, alguns desenvolvedores começaram a ficar chateados por algumas deficiências que o CSS comum tinha na época, como a impossibilidade de criar variáveis ou mesmo aninhar regras CSS.
- Isso foi um dos motivos de começarem a surgir tecnologias que suprissem essas necessidades, os chamados **pré-processadores CSS**.
- Isso aconteceu aproximadamente de 2006 para cá, e os que mais se destacaram foram o **Sass** e o **LESS**.
- Ambos começaram a ser assunto de posts e palestras poucos anos depois em toda a área de front-end.
- E até outros grandes nomes surgiram, como o Myth e o Stylus, tendo este último ganhado muitos holofotes de uns tempos para cá.
- O problema de qualquer pré-processador, pegando o Sass e o LESS como exemplo, é que os browsers não os entendem nativamente, mesmo sendo linguagens de estilos.
- A única linguagem desse tipo que os browsers compreendem atualmente é o bom e velho CSS.
- E é justamente por esse motivo que é necessário pegar códigos feitos em Sass/LESS/_SeuPreProcessadorFavoritoAqui_ e compilá-los em CSS comum, para que assim o browser consiga entendê-lo de fato.

