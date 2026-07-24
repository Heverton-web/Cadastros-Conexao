---
name: react-native-desenvolvimento-de-aplicativos-mobile-com
description: >-
  Passos operacionais extraidos do livro 'React Native desenvolvimento de aplicativos mobile com React' (PT) — Mobile.
---

# React Native Desenvolvimento De Aplicativos Mobile Com — Passos Operacionais

Conteudo extraido do livro 'React Native Desenvolvimento De Aplicativos Mobile Com'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- História do desenvolvimento do React Native](01-historia-do-desenvolvimento-do-react-native.html)   * [2\.
- Instalação e configurações iniciais](02-instalacao-e-configuracao-iniciais.html)   * [3\.
- Funcionamento do React Native](03-funcionamento-do-react-native.html)   * [4\.
- Criando os primeiros componentes](04-criando-os-primeiros-componentes.html)   * [5\.
- Componentes estilizados (CSS-in-JS)](05-inserindo-estilos.html)   * [6\.
- O básico de layouts com o Flexbox](06-layouts-com-flexbox.html)   * [7\.
- Renderização condicional](07-renderizacao-condicional.html)   * [8\.
- State, eventos e componentes controlados e não controlados](08-state-eventos-e-componentes-controlados.html)   * [9\.
- Requisições AJAX e APIs](09-requisicoes-ajax.html)   * [10\.
- Navegação](10-navegacao.html)   * [11\.


  - Quando estamos desenvolvendo uma aplicação web, é comum precisarmos mostrar ou esconder um determinado elemento na tela dada uma certa condição, por exemplo, a interação do usuário com um botão. Uma situação prática bem simples é o detalhamento de um produto em um e-commerce. Imagine que criamos uma página cheia de produtos e que para um, em específico, existe uma descrição mais detalhada. Porém, não queremos que esses detalhes sejam exibidos logo de cara, caso contrário, a interface do nosso programa ficaria uma verdadeira zona. Então, para resolver isso, manipulamos o DOM (_Document Object Model_) por meio do JavaScript para que esse detalhe só apareça caso o item seja clicado (evento de `click`). Isso é bem comum, certo? Temos certeza de que você aí do outro lado sem dúvidas já pensou em uma série de outras situações onde manipulamos a página para que certo conteúdo só apareça de acordo com uma condição - sendo ela um evento causado pelo usuário, uma informação carregada via AJAX, enfim, os exemplos são inúmeros.

  - É neste arquivo que criaremos o nosso primeiro componente do zero. Para isso, nas duas primeiras linhas, faremos a importação da biblioteca do React e dos componentes `Text` (<https://facebook.github.io/react-native/docs/text.HTML>) e `View` (<https://facebook.github.io/react-native/docs/view.html>) da biblioteca do `react-native`. Lembrando um pouco do que dissemos no capítulo anterior enquanto explicávamos como o React funciona, os componentes nativos `Text` e `View` do React Native são como as tags HTML `<div>` e `<p>`, que usamos na construção de aplicações web. Eles funcionam como contêineres de conteúdo e são componentes fundamentais para a construção de interface de usuários. Eles trabalham de forma que conseguimos deixar o conteúdo (textos, imagens, vídeos e afins) organizado, estilizado e interativo dentro das nossas aplicações. Tanto um quanto o outro dão suporte a aninhamento, estilos CSS e controle de toque do usuário. Vamos usá-los com bastante frequência.

  - O AJAX surgiu no início da web como alternativa para fazermos requisições para uma página e carregar um conteúdo de forma dinâmica sem a necessidade de atualizar toda a página. Para entender o que isso quer dizer, imagine o perfil de uma pessoa que usa o Facebook e/ou o Instagram. No momento em que a pessoa abre o aplicativo/site, o serviço dispara uma série de chamadas concorrentes para a sua API a fim de carregar as informações do usuário: fotos, amigos, curtidas, reações etc. Como esse processo pode levar um tempo — afinal, estamos falando de uma grande quantidade de informação — elas são propositalmente requisitadas simultaneamente e carregadas de acordo com sua chegada no front-end. É por isso que geralmente os dados "leves" como textos e menus são carregados antes de fotos e vídeos. Mas o importante disso tudo é que a experiência de carregamento é pouco desagradável, já que o usuário consegue ter o mínimo de informação disponível na tela logo ao acessá-lo.

  - Se existe uma ferida aberta em todos os desenvolvedores de React (para web) ela tem nome: **Redux**. É muito provável que você já tenha ouvido falar desse termo em algum contexto, mesmo sem saber o que ele significa. O Redux (<https://redux.js.org/>) é uma biblioteca que foi criada com o intuito de nos ajudar a administrar os estados dentro de uma aplicação. Pense nos componentes que fizemos até agora e você verá que todos eles têm algo em comum: administram poucas informações. Quando levamos os estados para uma aplicação complexa, a situação é totalmente diferente. Em vez de lidar com o estado em apenas um componente, precisamos lidar com inúmeros estados de forma compatível com as ações do usuário na aplicação, ou seja, a ação em um componente precisa se comunicar com vários outros componentes diferentes para que todos eles reflitam um estado global da aplicação. E fazer essa "comunicação" entre estados pode se tornar uma grande dor de cabeça.

  - Durante o nosso percurso neste livro, vimos muita coisa. Saímos da instalação e configuração das dependências do React Native e fomos até o desenvolvimento de aplicações que consomem serviços na internet. No meio desse percurso, inevitavelmente tivemos que parar e estudar o funcionamento da biblioteca React, afinal, todos os conceitos trabalhados nela também são usados no React Native. A partir deste ponto, vimos o que é o JSX, o que é um componente, quais são as principais dependências, o que são propriedades e estados, estilos por meio do Flexbox e CSS, navegação de telas, quais são as principais funções do ciclo de vida de um componente, como passar informações de um componente para outro, consumir serviços da internet e atualizar os componentes com as respostas... até chegarmos à última grande novidade do React, os Hooks. A quantidade de informações apresentada e o conhecimento adquirido não foram pouca coisa. Você deve se sentir orgulhoso!

  - Mas, dando continuidade à nossa história, o framework surgiu em um desses eventos e deu o que falar. A partir daí, começou a ser desenvolvido até sua primeira aparição pública em janeiro de 2015, no evento React.js Con. Caso tenha curiosidade e facilidade com a língua inglesa, encorajamos a ver a apresentação completa que está disponível no Youtube (<https://www.youtube.com/watch?v=KVZ-P-ZI6W4/>). Meses depois, no evento F8 — conferência anual realizada pelo Facebook e que ocorre na cidade de São Francisco, Califórnia —, anunciaram que o React Native seria um projeto de código aberto e disponível por meio do GitHub (<https://github.com/facebook/react-native/>) — plataforma de hospedagem de código-fonte com controle de versão usando o Git que permite que programadores contribuam em projetos privados e/ou de código aberto de qualquer lugar do mundo. Desde então, a coisa não parou mais.
## 2. Principios e Tecnicas
- Integração com o banco de dados do Firebase](11-integracao-com-o-firebase.html)   * [12\.
- Trabalhando com Hooks](12-trabalhando-com-hooks.html)   * [13\.
- O futuro do React Native](13-o-futuro-do-react-native.html)   * [14\.
- Referências](14-referencias.html)     # ISBN  Impresso e PDF: 978-65-86110-09-8  EPUB: 978-65-86110-06-7  MOBI: 978-65-86110-08-1  > Caso você deseje submeter alguma errata ou sugestão, acesse <http://erratas.casadocodigo.com.br>.   # Dedicatória  Dedicamos este livro às nossas famílias: Maria Aparecida de Freitas Escudelario e Irineu Escudelario; Ednilda Cicilini de Pinho, Ilidio Graciano Martins de Pinho e Lucas Martins de Pinho.
- Graças ao apoio de vocês, conseguimos concluir mais este trabalho.
- Do fundo dos nossos corações, muito obrigado.
- Amamos vocês.   # Agradecimentos  Primeiramente, gostaríamos de agradecer muito às nossas famílias que sempre nos apoiaram, motivaram e educaram a buscarmos sempre sermos pessoas melhores, seja no trabalho, com os amigos e principalmente com o próximo.
- Também somos muito gratos aos nossos amigos e mentores.
- A ajuda de todos foi extremamente valiosa para a conclusão deste trabalho.
- Nosso muito obrigado a cada um de vocês.


  - A primeira pasta é a `.expo` (note que ela é oculta). É nela que estão contidos os arquivos de informação e configuração interna do Expo. Não precisaremos saber detalhes profundos sobre eles, mas caso queira, a documentação do utilitário está impecável (<https://docs.expo.io/versions/latest/>). A segunda é a pasta `/assets`, onde estão contidos todos os arquivos estáticos da nossa aplicação, como, por exemplo, as imagens. Todas as imagens que vamos utilizar em nosso app deverão ser colocadas nessa pasta. A terceira é a `/node_modules`, onde estão contidas as dependências do projeto. O próximo arquivo é o `.gitignore`. É nele que é informado quais arquivos e pastas devem ser ignorados ao subir o projeto no controle de versionamento do git (inclusive, note que o Expo já nos fez um favorzão de tirar a pasta `/node_modules` dos commits. Amém!).

  - Do lado esquerdo da atribuição temos duas variáveis sendo extraídas do `useState`: a primeira é o `contador` e a segunda é o `setContador`. O primeiro parâmetro é o nome do estado que estamos atualizando. Como estamos fazendo uma contagem, achamos que seria prudente chamar o estado dessa maneira (mas que fique claro que esse nome é totalmente arbitrário). O segundo parâmetro em si se trata de uma função. Usaremos essa função todas as vezes em que for necessário atualizar o valor do estado. Você se lembra de que falamos que nunca alteramos o valor do estado diretamente? De que, em vez disso, precisamos usar - quando estamos trabalhando com classes - o método `this.setState({})`? Com os Hooks, essa regra continua valendo, a única real diferença é que, neste exemplo, nós passaremos por parâmetro o valor que desejamos atribuir ao estado.

  - O banco de dados em tempo real do Firebase permite o armazenamento e sincronismo dos dados entre usuários e dispositivos em tempo real com um banco de dados NoSQL hospedado na nuvem. Os dados atualizados são sincronizados em todos os dispositivos conectados em questão de segundos. Além disso, nossos dados permanecem disponíveis caso o aplicativo fique offline, o que oferece uma ótima experiência do usuário, independentemente da conectividade de rede (já que nos dá a possibilidade de fazer a sincronização de dados quando houver conectividade, mas sem deixar o aplicativo inapto). Mas, como tudo o que é bom nesta vida (e na tecnologia), este recurso tem limitações dentro da versão gratuita, entretanto serão mais do que suficientes para os nossos experimentos no livro e para os seus primeiros aplicativos do React Native em produção.

  - Se você está lendo este livro, temos certeza de que você já possui ao menos uma ideia do que se trata o React Native. Mas antes de começarmos a falar sobre sua história, vamos entender o que ele é. O React Native pode ser definido como um framework que consiste em uma série de ferramentas que viabilizam a criação de aplicações mobile nativas — para as plataformas iOS e Android — utilizando o que há de mais moderno no desenvolvimento front-end (HTML, CSS e JS). Ele é considerado por muitos como a melhor opção do mercado no que se refere ao desenvolvimento mobile híbrido baseado em JavaScript, estando à frente dos seus concorrentes (ex.: Ionic). A _stack_ do React Native é poderosíssima, pois nos permite utilizar ECMAScript 2015+ (ES6+), CSS Grid e Flexbox, JSX, diversos pacotes do npm e muito mais.
## 3. Aplicacoes Praticas
- Também gostaríamos de agradecer à Editora Casa do Código por nos dar a oportunidade e o espaço para compartilhar este conhecimento de React Native.
- Em especial, um agradecimento a Vivian Matsui, sempre muito presente e parceira em todo o processo da construção deste livro.
- E por fim, e não menos importante, gostaríamos de agradecer a você que está lendo!
- Muito obrigado pela confiança em nosso trabalho!
- Nós nos esforçamos muito para trazer um material de qualidade, atual e de acordo com o que o mercado de trabalho está esperando de um profissional que trabalha com esta tecnologia.
- Ficamos na esperança de que este material ajude você a ser um profissional da tecnologia ainda melhor.
- Boa leitura e bons códigos!   # Autores  ### Bruna de Freitas Escudelario  Figura -2.1: Bruna de Freitas Escudelario.
- Desenvolvedora front-end desde 2016.
- Fez bacharelado em Ciência da Computação pela Pontifícia Universidade Católica de São Paulo (PUC-SP) e é coautora do livro _Construct 2: Crie seu primeiro jogo multiplataforma_ , também publicado pela Editora Casa do Código, e do livro _O Básico da Modelagem 3D com o Blender_ , publicado pela Editora Viena.
- Sempre gostou muito de ler e estuda diariamente por meio de cursos, artigos e vídeos na internet.

## 4. Topicos Avancados
- Começou a se aventurar no desenvolvimento de jogos há pouco tempo, mas já acumulou experiência suficiente para tocar seu primeiro negócio na internet – junto com o Diego –, a _Time to Play_ , uma iniciativa especializada em recursos para a construção de jogos digitais.
- Hoje atua como desenvolvedora front-end em uma grande empresa de aprendizagem corporativa de São Paulo.    * Site: <https://brunaescudelario.github.io/>    ### Diego Martins de Pinho  Figura -2.2: Diego Martins de Pinho.
- Desenvolvedor de software desde 2013, tem experiência na área da educação e domínio em tecnologias web de front-end e back-end.
- Dentre as principais linguagens estão o Java e o JavaScript.
- Fez bacharelado em Ciência da Computação pela Pontifícia Universidade Católica de São Paulo (PUC-SP) e possui MBA em Gerenciamento da Tecnologia da Informação pela Faculdade de Informática e Administração Paulista (FIAP).
- Tem uma grande paixão pela educação e gosta muito de ensinar.
- Escreve artigos sobre tecnologia na internet, faz apresentações em eventos e é entusiasta em programação para jogos, modelagem (2D e 3D) e animação.
- É coautor do livro _Construct 2: Crie seu primeiro jogo multiplataforma_ e autor do livro _ECMAScript 6: Entre de cabeça no futuro do JavaScript_ , ambos publicados pela Editora Casa do Código.
- Hoje atua na área da educação como Professor Especialista de Programação e Jogos na Escola Móbile Integral em São Paulo.
- Também é responsável pela iniciativa Code Prestige de ensino de programação a distância.    * Site: <https://diegopinho.com.br>     # Prefácio  Quando o Diego e a Bruna me convidaram para escrever estas linhas iniciais do novo livro de React Native que estão publicando, fiquei extremamente feliz.

