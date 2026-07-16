---
name: web-apis-em-nodejs-luiz-tools
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Web Apis Em Nodejs Luiz Tools — Passos Operacionais

Conteudo extraido do livro 'Web Apis Em Nodejs Luiz Tools'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Introdução ao Node.js                      10  História do Node.js                      11  Características do Node.js                   12  Por que Node.js?                      14  2\.
- Configurando o Ambiente                      18  Instalando o Node.js                      19  Visual Studio Code                      22  Google Chrome                         26  MongoDB                            26  Postman                            27  3\.
- ExpressJS                            28  Routes e Views                         35  Event Loop                         42  O Problema                         42  A solução                            43  Task/Event/Message Queue                   47  4\.
- Mongodb                            49  Introdução ao MongoDB                   50  Quando devo usar MongoDB?                   52  Quando não devo usar MongoDB?                53  Instalação e Testes                      54  Comandos elementares                   57  Find avançado                         58   Delete                            64  5\.
- Carrega ainda um diploma de Reparador de Equipamentos Eletrônicos    (SENAI, 2005) e duas certificações Scrum para trabalhar com Métodos    Ágeis: Professional Scrum Developer e Professional Scrum Master    (ambas em 2010).
- Atuando na área de TI desde 2006, na maior parte do tempo como    desenvolvedor web, é apaixonado por desenvolvimento de software    desde que teve o primeiro contato com a linguagem Assembly no curso    de eletrônica.
- De lá para cá teve oportunidade de utilizar diferentes    linguagens em em diferentes sistemas, mas principalmente com    tecnologias web, incluindo ASP.NET, JSP e, nos últimos tempos, Node.js.
- Foi amor à primeira vista e a paixão continua a crescer!
- Trabalhando com Node.js desenvolveu diversos projetos para empresas    de todos os tamanhos, desde grandes empresas como Softplan até    startups como Busca Acelerada e Só Famosos, além de ministrar    palestras e cursos de Node.js para alunos do curso superior de várias    universidades e eventos de tecnologia.
- Um grande entusiasta da plataforma, espera que com esse livro possa    ajudar ainda mais pessoas a aprenderem a desenvolver softwares com    Node.js e aumentar a competitividade das empresas brasileiras e a    empregabilidade dos profissionais de TI.


  - Connect, Express.js, Socket.IO, Koa.js, Hapi.js, Sails.js, Meteor, Derby e

  - js. Ela é usada, na época de escrita desse livro, por mais de 3 milhões de

  - Código 10: disponível em http://www.luiztools.com.br/livro-node-api-fontes

  - estas questões para você ver junto à documentação oficial no site oficial,

  - find e o update, o primeiro parâmetro do delete é o filtro que vai definir

  - Note que desta vez usei ‘i’ ao invés de ‘install’ e que informei o nome de
## 2. Principios e Tecnicas
- Além de viciado em desenvolvimento, atua    como Agile Coach no Banco Agiplan, como    Developer Evangelist na Umbler e é autor do    blog www.luiztools.com.br, onde escreve    semanalmente sobre empreendedorismo    e desenvolvimento de software, bem como    mantenedor da página LuizTools no    Facebook, com o mesmo propósito.
- Para quem é este livro  Primeiramente, este ebook vai lhe ensinar os primeiros passos de    programação de WebAPIs com Node.js, mas não vai lhe ensinar lógica    básica e algoritmos, ele exige que você já saiba isso, ao menos em um    nível básico (final do primeiro semestre da faculdade de computação,    por exemplo).
- Parto do pressuposto que você é ou já foi um estudante de Técnico    em informática, Ciência da Computação, Sistemas de Informação,    Análise e Desenvolvimento de Sistemas ou algum curso semelhante.
- Usarei diversos termos técnicos ao longo do livro que são comumente    aprendidos nestes cursos e que não tenho o intuito de explicar aqui.
- O foco deste livro é ensinar alguns poucos aspectos da programação    usando Node.js para quem já sabe sobre o básico de web com alguma    outra linguagem como PHP e ASP ou está apenas começando nessa    plataforma, incluindo algumas “pinceladas” em MongoDB.
- Ao término deste livro você estará apto a construir web APIs simples em    Node.js e buscar materiais mais avançados para começar a construir    softwares profissionais usando estas tecnologias, inclusive o meu livro    Programação Web com Node.js e o meu curso Node.js e MongoDB,    que são muito mais completos nesse sentido.
- INTRODUÇÃO AO NODE.JS  “  “  Good software, like wine, takes time.  \- Joel Spolsky   1   11   INTRODUÇÃO AO NODE.JS  Node.js é um ambiente de execução de código JavaScript no lado do    servidor, open-source e multiplataforma.
- Historicamente, JavaScript foi    criado para ser uma linguagem de scripting no lado do cliente, embutida    em páginas HTML que rodavam em navegadores web.
- No entanto,    Node.js permite que possamos usar JavaScript como uma linguagem de    scripting server-side também, permitindo criar conteúdo web dinâmico    antes da página aparecer no navegador do usuário.
- Assim, Node.js    se tornou um dos elementos fundamentais do paradigma “full-stack”    JavaScript, permitindo que todas as camadas de um projeto possa ser    desenvolvida usando apenas essa linguagem.


  - Caso o cliente não exista, deve aparecer null (o cliente não existir não é

  - foi a partir dela que o criador do Node.js, Ryan Dahl, criou o projeto. O

  - comando), não precisamos usar ‘;’ (ponto-e-vírgula). Se você colocar, vai

  - dessa requisição deve passar pela função ‘X’. No app.js, registramos duas
## 3. Aplicacoes Praticas
- Node.js possui uma arquitetura orientada a eventos capaz de operações    de I/O assíncronas.
- Esta escolha de design tem como objetivo otimizar a    vazão e escala de requisições em aplicações web com muitas operações    de entrada e saída (request e response, por exemplo), bem como    aplicações web real-time (como mensageria e jogos).
- Basicamente ele    aliou o poder da comunicação em rede do Unix com a simplicidade da    popular linguagem JavaScript, permitindo que rapidamente milhões    de desenvolvedores ao redor do mundo tivessem proficiência em    usar Node.js para construir rápidos e escaláveis webservers sem se    preocupar com threading.
- História do Node.js  Node.js foi originalmente escrito por Ryan Dahl em 2009 e não foi    exatamente a primeira tentativa de rodar JavaScript no lado do    servidor, uma vez que 13 anos antes já havia sido criado o Netscape    LiveWire Pro Web.
- Ele inicialmente funcionava apenas em Linux e Mac    OS X mas cresceu rapidamente com o apoio da empresa Joyent, onde    Dahl trabalhava.
- Ele conta em diversas entrevistas que foi inspirado a    criar o Node.js após ver uma barra de progresso de upload no Flickr.
- Ele    entendeu que o navegador tinha de ficar perguntando para o servidor    quanto do arquivo faltava a ser transmitido, pois ele não tinha essa    informação, e que isso era um desperdício de tempo e recursos.
- Ele    queria criar um jeito mais fácil de fazer isso.
- Suas pesquisas nessa área levaram-no a criticar as possibilidades    limitadas do servidor web Apache de lidar (em 2009) com conexões    concorrentes e a forma como se criava código web server-side na época    que bloqueava os recursos do servidor web a todo momento o que fazia   12   INTRODUÇÃO AO NODE.JS  com que eles tivessem de criar diversas stacks de tarefas em caso de    concorrência para não ficarem travados, gerando um grande overhead.
- Dahl demonstrou seu projeto no primeiro JSConf europeu em 8 de    novembro de 2009 e consistia da engine JavaScript V8 do Google, um    evento loop e uma API de I/O de baixo nível (escrita em C++ e que    mais tarde se tornaria a libuv), recebendo muitos elogios do público    na ocasião.

## 4. Topicos Avancados
- Em janeiro de 2010 foi adicionado ao projeto o NPM, um    gerenciador de pacotes que tornou mais fácil aos programadores    publicarem e compartilharem códigos e bibliotecas Node.js    simplificando a instalação, atualização e desinstalação de módulos,    aumentando rapidamente a sua popularidade.
- Em 2011 a Microsoft ajudou o projeto criando a versão Windows de    Node.js, lançando-a em julho deste ano e daí em diante nunca mais    parou de crescer, atualmente sendo mantido pela Node.js Foundation,    uma organização independente e sem fins lucrativos que mantém a    tecnologia com o apoio da comunidade mundial de desenvolvedores.
- Características do Node.js  Node.js é uma tecnologia assíncrona que trabalha em uma única    thread de execução   Por assíncrona entenda que cada requisição ao Node.js não bloqueia o    processo do mesmo, atendendo a um volume absurdamente grande de    requisições ao mesmo tempo mesmo sendo single thread.
- Imagine que existe apenas um fluxo de execução.
- Quando chega    uma requisição, ela entra nesse fluxo, a máquina virtual JavaScript    verifica o que tem de ser feito, delega a atividade (consultar dados no    banco, por exemplo) e volta a atender novas requisições enquanto este    processamento paralelo está acontecendo.
- Quando a atividade termina    (já temos os dados retornados pelo banco), ela volta ao fluxo principal    para ser devolvida ao requisitante.
- Isso é diferente do funcionamento tradicional da maioria das    linguagens de programação, que trabalham com o conceito de multi-   threading, onde, para cada requisição recebida, cria-se uma nova    thread para atender à mesma.
- Isso porque a maioria das linguagens    tem comportamento bloqueante na thread em que estão, ou seja, se   13   INTRODUÇÃO AO NODE.JS  uma thread faz uma consulta pesada no banco de dados, a thread fica    travada até essa consulta terminar.
- Esse modelo de trabalho tradicional, com uma thread por requisição    é mais fácil de programar, mas mais oneroso para o hardware,    consumindo muito mais recursos.
- Node.js não é uma linguagem de programação.

