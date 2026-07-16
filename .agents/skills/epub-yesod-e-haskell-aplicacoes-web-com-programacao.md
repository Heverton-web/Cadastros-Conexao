---
name: epub-yesod-e-haskell-aplica-es-web-com-programa-o-
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Yesod E Haskell Aplicacoes Web Com Programacao — Passos Operacionais

Conteudo extraido do livro 'Epub Yesod E Haskell Aplicacoes Web Com Programacao'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Introdução — Configurando o ambiente & primeiros passos](01-stack.html)   * [2\.
- Scaffold & Templates: Configuração do ambiente com Stack](02-stack-scaffold.html)   * [3\.
- Estrutura de projeto Yesod com template yesod-minimal](03-desbravando-o-scaffold-estrutura-do-projeto.html)   * [4\.
- Shakespearean Templates — ser ou não ser, eis a questão ](04-shakespearean-templates.html)   * [5\.
- Montando o front-end com blocos](05-widgets.html)   * [6\.
- Persistência de dados](06-persistencia.html)   * [7\.
- Projeto Livraria](07-projeto-livraria.html)   * [8\.
- Manipulando credenciais e arquivos estáticos](08-credenciais-arquivos.html)   * [9\.
- Criando WebService RESTful](09-restful.html)   * [10\.
- Uma conclusão inevitável](10-conclusao.html)     # ISBN  Impresso e PDF: 978-85-7254-039-1  EPUB: 978-85-7254-040-7  MOBI: 978-85-7254-041-4  > Caso você deseje submeter alguma errata ou sugestão, acesse <http://erratas.casadocodigo.com.br>.   # Autores  ## Alexandre Garcia de Oliveira  É formado Tecnólogo em Processamento de Dados na Faculdade de Tecnologia da Baixada Santista Rubens Lara (FATEC-RL) em 2004, e Bacharel em Matemática pelo Instituto de Matemática e Estatística da Universidade de São Paulo em 2012, onde também se formou Mestre em Matemática Aplicada em 2015.


  - > Não há nada intrínseco ligando essas linguagens ao Yesod. Isso significa que você pode utilizar uma independente da outra. Temos como exemplo o desenvolvimento de um web service utilizando o padrão REST em um projeto Yesod. Nesse caso, não será necessário o uso de qualquer um dos quatro Shakespearean Templates, pois esta arquitetura, de forma resumida, recebe e envia JSONs através dos seus recursos (rotas). Isso também é válido para aplicações web desenvolvidas no mesmo domínio, porém a não utilização dessas linguagens trará péssimas consequências, como a perda das rotas _type-safe_. Existem outros efeitos colaterais ruins, e caso deseje saber não deixe de ler este artigo: <https://www.yesodweb.com/blog/2012/10/yesod-pure> feito pelo criador do framework Yesod, Michael Snoyman. Neste artigo, ele implementa um exemplo sem o uso dos Shakespearean Templates, entre outros recursos.

  - Caso você escreva um pragma inexistente o GHC vai ignorá-lo. Todo pragma começará com `{-#` e será fechado com `#-}`. Resumindo, pragmas são considerados arquivos de cabeçalho e precisam seguir algumas regras: todo pragma de cabeçalho precisa vir antes da palavra-chave `module` no arquivo. Todo arquivo em Haskell, por padrão, necessita de uma nomeação de módulo, que define a chamada deste arquivo. Se o arquivo não possuir um nome de módulo, o compilador assume que seja `Main`. É o equivalente ao nome de uma classe na Programação Orientada a Objetos. Mas não se preocupe tanto com isso agora pois quando houver a necessidade de usá-los bastará copiá-los no arquivo necessário, e no decorrer do projeto o seu uso ficará cristalino. Podem existir muitos pragmas em um arquivo, e podem ser precedidos ou seguidos por comentários sem afetar seu funcionamento.

  - Vimos como criar um snippet e como criar um projeto. Neste capítulo, vamos aprender a estrutura de um projeto Yesod (template `yesod-minimal`). Entraremos em sua estrutura de pastas, chamadas de arquivos, funções, entre outros. O entendimento dessa estrutura é primordial para que você seja capaz de organizar com eficiência seu projeto para obter maior produtividade. No começo, pode parecer um pouco confuso, mas com tempo e um pouco de prática você verá como é simples e fácil manipular projetos no Yesod. Após algumas configurações iniciais, a maior parte da manipulação no projeto se concentrará em um único local. Ao término deste capítulo você estará habituado(a) aos componentes e processos de um projeto Yesod.

  - Para ficar claro, o **modelo** representa as regras de negócio da nossa aplicação, por exemplo, efetuar a soma de dois números digitados por um usuário. A **visão** representa as páginas HTML da aplicação, que poderia ser um formulário com duas entradas de texto e um botão de envio. (os dois números que serão somados). E por último, temos o **controlador** , que faz o intermédio entre a visão e o modelo - neste caso quando o usuário preenche as duas caixas de texto com números e envia os dados do formulário para o servidor. O controlador receberá estes dois números, executará o modelo que possui a função para a soma de dois números, e atualizará a visão com a resposta gerada pelo modelo.

  - Informalmente, um módulo em Haskell é o equivalente a uma classe em Java/C# que pode ser importado por outro módulo. No exemplo que construiremos neste capítulo, em que teremos o mínimo exigido para a construção de um projeto utilizando o framework Yesod, temos um módulo chamado `Main` contido dentro do arquivo `Main.hs` com todo o conteúdo/código-fonte do nosso projeto. Em seguida, temos um módulo `Yesod`, que é uma importação de outro módulo dentro do módulo `Main` (o nosso arquivo). Em outras palavras, nosso projeto principal que contém o módulo `Main` está utilizando um módulo externo chamado `Yesod`. Um módulo Haskell é equivalente a uma biblioteca da linguagem Java.

  - > Quando um código de metaprogramação é compilado, o código gerado é muito maior do que o código escrito pelo programador. Então o objetivo da metaprogramação é fazer com que o programador evite de escrever códigos repetidos, que serão iguais em quaisquer casos no desenvolvimento de uma aplicação, mudando apenas algumas características, como o nome de um tipo de dado, no nosso caso nome das rotas! Esta pequena linha de código `/pagina1R Pagina1R GET` gerará um código muito maior após compilado. Qualquer outra rota que o programador coloque obterá os mesmos códigos gerados pela rota anterior, mudando apenas o nome do tipo da rota, que neste caso é `Pagina1R`.
## 2. Principios e Tecnicas
- Leciona há 9 anos no Centro Estadual de Educação Tecnológica Paula Souza (CEETEPS), sendo há 8 anos pelas Fatecs, onde passou pelos campos de Santos, Praia Grande e São Caetano do Sul.
- Programa em Haskell há cerca de 6 anos.
- Leciona no Centro Estadual de Educação Tecnológica Paula Souza (CEETEPS) desde 2016 pela Etec, tendo como sede a Etec Adolpho Berezin, atuando também na Etec Praia Grande e Cubatão.
- Apaixonado por viagens, jogos de estratégia, séries e animes.   # Prefácio  Com a ascensão das metodologias ágeis, o mercado de TI demanda, mais do que nunca, o desenvolvimento rápido de soluções.
- Existem muitas linguagens de programação e frameworks que possibilitam a construção de aplicações de maneira veloz, e o Yesod está entre eles.
- Neste livro você será apresentado a todas as ferramentas necessárias que o Yesod disponibiliza para a construção de uma aplicação web do zero.  ### Público-alvo  Este livro é voltado a qualquer desenvolvedor ou desenvolvedora que deseja aprender como construir aplicações web utilizando o paradigma de Programação Funcional e, consequentemente, o Yesod.
- Também é indicado para quem está em busca de frameworks para desenvolvimento ágil.  ### Conhecimentos necessários  Conhecimento básico/intermediário de Haskell, que é a linguagem que o Yesod utiliza.
- O livro _Haskell: Uma introdução à programação funcional_ traz todo o conhecimento de Haskell necessário para entendimento do paradigma funcional, assim como da linguagem Haskell, para a leitura e compreensão deste livro.
- Ter conhecimento básico de arquitetura Web (_Request/Response_) para desenvolvimento horizontal pode ajudar, porém, será abordado no livro.
- É necessário ter um conhecimento básico de GNU+Linux/MacOS e shell.


  - O segundo parâmetro do `selectList` é uma lista de modificadores adicionais que servem para ordenar, limitar e determinar um ponto inicial. A ordenação é dividida em duas partes: `Asc` para ordenar ascendentemente, e `Desc` para ordenar descendentemente, sendo que ambos recebem um parâmetro que é um campo da tabela. Por exemplo, `selectList [] [Asc LivroAutor]` seleciona todos os livros da tabela e os ordena em ordem alfabética por autor. Do mesmo modo dos filtros, é possível utilizar mais de um modificador. Por exemplo, `selectList [] [Asc LivroAutor, Asc LivroTitulo]` ordena os livros por autor e, para os livros de um mesmo autor, os ordena pelo título.

  - O intuito deste capítulo é apresentá-lo o mínimo necessário para criação e execução de um projeto em Yesod. Uma estrutura mínima para que você possa entender o funcionamento do framework e suas funções básicas. Dificilmente você vai desenvolver um projeto em um único arquivo, ou seja, de forma monolítica. Todavia, é possível você compilar este miniprojeto em um arquivo executável, ou o que chamamos de arquivo binário. Este arquivo contém todo o código compilado de nosso miniprojeto e pode ser executado em qualquer computador, em diversos sistemas operacionais. É o que vai para a produção e será executado em um ambiente real, ou seja, em um servidor web.

  - Como foi visto através do livro, pode-se notar que o Yesod é um framework de alta produtividade, onde a maioria da implementação do código se concentra nos Handlers. Isso se deve em grande parte à linguagem, mas também ao modo como o Yesod funciona. Sendo um framework extremamente modular e tendo uma comunidade insaciável, a maioria do trabalho pesado já foi desenvolvido e basta ser utilizado. A parte da linguagem se deve ao conceito de _type-safety_ , que o Yesod utiliza intensamente, delegando ao compilador a checagem da consistência do código, o que permite que o programador foque no que é realmente importante: desenvolver.

  - No projeto que iniciamos no capítulo 3, declaramos duas funções Handler que não estão implementadas e fazem uso da função `error`, ou seja, sem qualquer conteúdo, apenas uma mensagem de erro estática. Estas funções são `postHomeR` do módulo `Home` e a função `getPagina1R` do módulo `Pagina1`, ambas dentro da pasta `src`. Daremos continuidade criando um conteúdo para elas, removendo a função `error` e inserindo um conteúdo que gere uma resposta ao usuário, fazendo uso do HTML, CSS e JavaScript através dos Shakespearean Templates. Estes templates compartilham uma sintaxe em comum e características similares, que são:
## 3. Aplicacoes Praticas
- Você também poderá utilizar Windows, porém, não será abordado neste livro.
- Capítulo 1  # Introdução — Configurando o ambiente & primeiros passos  Neste livro, aprenderemos a mexer no Yesod e, com isso, saberemos como fazer aplicações Web e APIs REST.
- Iniciaremos com exemplos minimalistas (o mínimo necessário para uma aplicação Web funcionar) até chegar ao acesso ao banco de dados com a API _persistent_.
- A linguagem utilizada será Haskell, porque o excelentíssimo sistema de tipos do Haskell traz para tempo de compilação muitos erros em tempo de execução, desta forma, diminui-se o custo de produção e custo com manutenção.
- Montaremos um projeto com você, que fará uma livraria online na qual teremos duas partes primordiais: cadastro de usuários para compra de livros; e a parte da administração (_dashboard_) na qual administradores poderão cadastrar livros para venda, inserindo dados sobre os livros como nome, autor, e preço.
- Veremos como efetuar o cadastro de clientes e de livros, além de como estes clientes poderão comprar livros através de um carrinho de compras e visualizar seu histórico de compras através de suas respectivas contas.
- Então aprenderemos o porquê dos Shakespearean Templates e como eles facilitam o desenvolvimento do front-end com seus templates: Hamlet, Julius, Cassius e Lucius.
- Fazendo uso dos interpoladores dentro dos templates, o Yesod tomará conta parcialmente do seu front-end e facilitará muito a comunicação com o back-end, evitando-se muitos erros que aconteceriam em tempo de execução (com a aplicação funcionando).
- Por enquanto, não se preocupe pois tudo será esclarecido da melhor forma possível, passo a passo.
- Mas antes de começar, precisamos arrumar nosso ambiente, vamos lá.  ## 1.1 O que é o Stack  Stack é uma ferramenta multiplataforma para instalação e configuração de projetos em Haskell, totalmente em linha de comando.

## 4. Topicos Avancados
- Apesar de seu uso não ser obrigatório, por ser um gerenciador de projetos, vamos utilizá-lo no decorrer do livro por facilitar o gerenciamento de dependências.
- O Stack possui várias características, entre elas:    * Instalar o GHC (compilador) em um ambiente isolado, podendo existir vários projetos com diferentes versões do GHC em um mesmo sistema operacional.   * Gerenciar o download das dependências necessárias automaticamente;   * Construir e compilar o projeto.    > **Guia do usuário Stack** >  > No livro, vamos abordar as características essenciais do Stack para o fluxo de trabalho.
- Caso queria saber mais, não deixe de acessar o guia do usuário para o stack: <https://docs.haskellstack.org/en/stable/GUIDE/#stacks-functions>.
- Uma das principais características do Stack é a sua lista de pré-projetos (templates), para que tenhamos um alicerce pronto ao criar um projeto, sem a necessidade de criar um do zero, escrevendo códigos repetidos de configurações, que são **clichês** (_boilerplates_) para quaisquer projetos que você possa criar.
- Estes templates nos dão também a estrutura de pastas e arquivos necessários para criação de um projeto em Yesod de forma a organizá-lo da melhor maneira possível.
- Posteriormente será abordada a organização mais detalhadamente.
- Por ora utilizaremos apenas o **REPL** (_read-eval-print-loop_) GHCi, do Haskell, através do Stack.  > **Afinal, o que é REPL?** >  > Desenvolvedores de primeira viagem utilizam essa funcionalidade em diversas linguagens, porém, não sabem seu nome.
- Nada mais é que o shell da linguagem, também conhecido como console.
- É um programa que recebe entradas de dados do usuário, avalia e então retorna o resultado ao usuário.
- Seu uso é muito comum no início dos estudos em uma linguagem de programação.  ## 1.2 Instalando o Stack  O site <https://haskell-lang.org/get-started> contém todo o conteúdo necessário para a instalação e configuração do stack nos três principais sistemas operacionais: GNU/Linux, MacOS e Windows.

