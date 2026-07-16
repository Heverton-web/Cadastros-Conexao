---
name: epub-canivete-su-o-do-desenvolvedor-node
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Canivete Suico Do Desenvolvedor Node — Passos Operacionais

Conteudo extraido do livro 'Epub Canivete Suico Do Desenvolvedor Node'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Introdução](01-Introducao.html)   * [2\.
- Melhorando a performance do lado do cliente](02-gulp.html)   * [3\.
- Cuidando de erros e logs](03-errors.html)   * [4\.
- Melhorando performance e segurança](04-advanced.html)   * [5\.
- Envio de e-mails com Node.js](05-mailer.html)     # Agradecimentos  Gostaria primeiramente de agradecer ao Adriano, por ter acreditado no livro, sugerido o tema e, principalmente, por ter acreditado no garoto do interior que, há alguns anos atrás, teve seu primeiro emprego como estagiário no protótipo da Editora em que hoje escrevo.
- Gostaria de agradecer também as pessoas que trabalham comigo pelo constante incentivo à aprendizagem e melhoria, principalmente aos meus amigos Maurício Aniche e Guilherme Silveira.
- Por fim, mas não menos importante, gostaria de agradecer aos meus pais, por sempre estarem ao meu lado e também me incentivarem a sempre dar o melhor de mim.   # Sobre o autor  Meu nome é Caio Incau, e trabalho com desenvolvimento de software.
- Comecei aos 16 anos estudando por conta em casa, na época com Delphi.
- Aos 17 anos, entrei na faculdade para cursar Sistemas de Informação.
- Também nessa idade, tomei uma das melhores decisões que já tive: decidi estudar Java pela Caelum.


  - Vamos analisar bem nosso log: ele nos mostra o IP que acessou nosso servidor – neste caso, `127.0.0.1` –, a data `[Fri, 03 Apr 2015 11:33:38 GMT]`, seguido pelo método HTTP e a URL `"GET /fafa41 HTTP/1.1`. Depois temos a resposta HTTP `404`, o tamanho da resposta `528`e, por fim, a plataforma do cliente: seu Sistema Operacional e seu navegador – `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.104 Safari/537.36`.

  - Neste capítulo, aprendemos sobre alguns problemas ao servir arquivos na web, vimos o que é o gulp e como ele nos ajuda a resolver esses problemas, reduzimos o número de requisições em nosso servidor e deixamos essas requisições mais leves por meio da concatenação e `uglify` dos arquivos. Ao final, ainda adicionamos um sistema de `watch` que facilita nosso processo de desenvolvimento, pois ele toma conta de aplicar as mudanças nos arquivos finais.

  - O `frameguard` aceita três opções: _DENY_ , _SAMEORIGIN_ , e _ALLOW-FROM_ , sendo que ao usar _DENY_ , a página não pode ser mostrada em um _iframe_ , impedindo que usem sua página em _clickjackings_ ; já o _SAMEORIGIN_ permite que sua página seja mostrada como _iframe_ , mas somente no mesmo domínio da página; e, por último, o _ALLOW-FROM_ , que recebe um segundo parâmetro especificando qual URI pode acessar sua página por meio de _iframes_.

  - Se este é um processo repetitivo, podemos automatizar através do nosso task runner. Podemos avisá-lo para ficar olhando as pastas onde nossos arquivos estão e, quando houver alguma alteração, ele rodará automaticamente as tarefas que cuidam dos arquivos que servimos ao navegador. Essa tarefa de olhar para as alterações é tão comum que está definida dentro do próprio gulp, não precisamos instalar ou importar nenhum módulo externo para isto.

  - Caso você venha a enfrentar algum erro durante as tarefas no gulp, você vai reparar que as mensagens de erro nem sempre ajudam a resolver o problema. Para isto, existe o `gutil.log`, cujo uso é bem simples: basta adicionar uma chamada ao método `on` após adicionar algo ao `pipe`, este método recebe uma String e uma função. Em nosso caso, a função será o `gutil.log`, e a String será um evento que vamos observar, o evento de `error`.

  - Logo após, chamamos o método `pipe`, que recebe uma função que processará o resultado da ação que a antecede diretamente na ordem do _pipeline_ – nesse caso, a função `src`, que havia realizado a leitura dos arquivos. Por fim, colocamos mais uma ação na _pipeline_ (chamando o método `pipe` novamente) e, desta vez, mostramos para o gulp onde deve ser escrito o arquivo com o resultado do processamento, através do método `dest`.
## 2. Principios e Tecnicas
- Com 18 anos, comecei a trabalhar na Caelum, empresa onde trabalho até o presente momento.
- Durante minha estadia no mercado de TI, tive a oportunidade de trabalhar com Java, Ruby, JavaScript e Objective-C.
- Busco sempre me atualizar e aprender sobre novas tecnologias, pois acredito fortemente que este é o segredo para o sucesso em nossa área de trabalho.
- Capítulo 1  # Introdução  Você já passou por problemas reais ao fazer o deploy de uma aplicação com Express?
- Como, por exemplo, servir conteúdo estático de forma otimizada, tratar os erros, usar cache, ou até mesmo a necessidade de criar um Cluster?
- Pois bem, é isto que este livro aborda: como resolver ou se prevenir de problemas na sua aplicação utilizando Express.
- A ideia é tratar de diversos conceitos básicos e avançados que resolvam alguns dos principais impasses do dia a dia de um desenvolvedor.  ## 1.1 Para quem é este livro  Este livro é para as pessoas que já possuem algum conhecimento em NodeJS, Express e Mongoose.
- Não é necessária uma grande experiência com essas ferramentas, apenas o básico.
- Você pode seguir o livro sem o conhecimento prévio delas, porém será mais complicado de entender o código de exemplo.
- Todo o código estará no meu repositório do GitHub, que você pode acessar em: <https://github.com/CaioIncau/my-todo/tree/cap1>, dividido por capítulos.


  - Repare que colocamos ele logo acima da configuração de erros e do nosso `createServer`. É sempre bom lembrar de que a ordem importa em nosso `app.js`. Os `middlewares` serão resolvidos de acordo com a ordem em que foram especificados, por isso deixamos o `morgan` no final, onde todas as rotas já foram resolvidas. Se você colocar no começo do arquivo, por exemplo, ele não saberá as rotas definidas e não vai funcionar.

  - Ao adicionarmos este módulo no projeto, nosso objeto `request` ganha três novos métodos. O `checkBody`, que procura por um valor no `body` da requisição e adiciona uma mensagem de erro, caso a validação não funcione. Similar a este, temos o `checkParams` e o `checkQuery`, ambos têm a mesma funcionalidade do `checkBody`, mas um procura no `req.params` e o outro no `req.query` (parâmetros recebidos via `GET`).

  - Perceba que usamos pelo menos o dobro de I/O para realizar apenas dois processos em sequência. Agora, imagine um projeto em que temos mais de 20 ou 30 arquivos de estilo, com um encadeamento de uma dezena de funções. Quanto tempo não estaríamos ganhando ao tirar proveito das streams? Visto como a ferramenta trabalha e sua vantagem em relação à sua principal concorrente, vamos colocar a mão na massa!

  - Vamos analisar com calma esse código. Primeiro, nós chamamos o método `fs.createWriteStream`, que recebe o caminho para um arquivo – neste caso, nosso arquivo de log – e um objeto com a opção `flags:a`. Esta última opção serve para indicar que o arquivo será escrito em `append mode`. Isso significa que toda vez que alguém usar este arquivo, deve adicionar conteúdo ao final dele, e não sobrescrever.
## 3. Aplicacoes Praticas
- Espero que você aproveite o que aprender aqui, e aplique em seus projetos, sejam eles pessoais ou empresariais.
- Existe um grupo de discussão deste livro, no qual você pode postar dúvidas e compartilhar seus resultados: <https://groups.google.com/forum/?hl=pt-BR#!forum/canivetenode>.  ## 1.2 Como este livro funciona  Este livro vai usar um projeto extremamente simples como exemplo.
- Será uma aplicação na qual você cadastra tarefas e, por isso, será chamada de _Todo_.
- A proposta é que você veja o conceito e o transporte para o seu projeto, ou até mesmo que aplique diretamente nele: o Todo é apenas um apoio didático.
- A cada capítulo, vamos avançando mais o projeto e adicionando novas funcionalidades voltadas para segurança, performance e manutenibilidade.  ## 1.3 Configurando o projeto de exemplo na sua máquina  O projeto de exemplo está no GitHub, e ele pode ser clonado em seu estado inicial, neste repositório: <https://github.com/CaioIncau/my-todo/tree/inicial>.
- Se você não é familiriazado com o Git, você pode baixar a versão zipada em: <https://github.com/CaioIncau/my-todo/archive/inicial.zip>.
- Se você não tem o Node instalado, lembre-se de baixá-lo em <https://nodejs.org/download/>.
- Rode o comando `node -v` e garanta que seu Node utiliza a versão 0.10 ou superior:  Figura 1.1: Node version  Após baixar o projeto e deszipá-lo, entre na pasta `my-todo` e rode o comando `npm install`.
- Usaremos o `npm` para resolver as dependências do projeto.
- Se precisar, delete a pasta `.node_modules` antes de realizar o `npm install`, pois pode haver conflitos com versões preexistentes dos módulos.

## 4. Topicos Avancados
- Todo o livro corre com as dependências nas versões definidas no código anterior.
- Agora precisamos iniciar o servidor do MongoDB, para que o projeto consiga se conectar ao banco de dados.
- Se você tem o Mongo instalado em seu computador, basta rodar o comando `mongod` em seu terminal e o servidor subirá.
- Caso não possua, você pode encontrar detalhes de como instalá-lo em cada SO na documentação oficial: <http://docs.mongodb.org/manual/installation/>.
- Agora, com o projeto baixado e o Mongo rodando, basta entrar na pasta do projeto e rodar o comando `node app.js`, que vai subir a aplicação e se conectar ao Mongo, criando automaticamente o banco `my-todo`.
- Acesse seu _localhost_ na porta `3001`, e verifique que a aplicação está de pé!
- Figura 1.2: App Running  Pronto!
- Agora nós podemos começar a melhorar nossa aplicação que usa Node, Express e MongoDB.
- Capítulo 2  # Melhorando a performance do lado do cliente  Repare que, em nossa aplicação de exemplo, importamos apenas três arquivos de estilo (`.css`) e dois arquivos de script (`.js`).
- Ainda assim, podemos e devemos melhorar o modo de servi-los.

