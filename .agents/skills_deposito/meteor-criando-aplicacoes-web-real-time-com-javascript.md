---
name: epub-meteor-criando-aplica-es-web-real-time-com-ja
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# EPUB Meteor  criando aplicações web real-time com JavaScript — Passos Operacionais

Skill baseada no livro "EPUB Meteor  criando aplicações web real-time com JavaScript" (PT). Contem passos praticos e sequencias operacionais.

Use quando o usuario pedir orientacao pratica sobre: desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js.

---

## 1. ## Meteor_ criando aplicações web real-time com JavaScript


## 2. ## Sumário


## 3. ## Agradecimentos


## 4. ## Sobre o autor


## 5. ## Prefácio


## 6. ##  Capítulo 1:  Introdução


## 7. ##  Capítulo 2:  Configurando o ambiente de desenvolvimento


## 8. ##  Capítulo 3:  Criando uma rede social real-time


## 9. ##  Capítulo 4:  Implementando uma timeline de posts


## 10. ##  Capítulo 5:  Signin e Signup de usuários


## 11. ##  Capítulo 6:  Perfil do usuário


## 12. ##  Capítulo 7:  Tela de perfil público do usuário

## Conceitos Fundamentais

- assistir ou enviar vídeos, ver ou publicar fotos, ouvir músicas e assim por diante. Isso
- prática ele é um loop infinito que a cada iteração verifica em sua fila de eventos se um
- tir o usuário criar, listar, atualizar e excluir contatos. Esse é o conjunto clássico de
- ray contendo os elementos a partir de um range inicial e final da lista. O range utiliza
- de sistemas. Existem diversos tipos de testes: teste unitário, teste funcional, teste de


  - Começando nossa codificação, vamos criar os testes para o modelo `Friendships`, visto que ele possui muitas funções importantes que precisam ser testadas. Inicialmente vamos criar testes no lado do servidor, onde testaremos todas as funções desse modelo que foram criadas no decorrer deste projeto. Um detalhe importante é que, para deixarmos os testes rápidos e também para focarmos apenas em validar as funções de regras de negócios que foram criadas neste modelo, vamos adotar a técnica de criar _mocks_ nos modelos, que basicamente é uma técnica que permite alterar o comportamento de um objeto. No nosso caso vamos mockar os modelos para evitar que as funções que estão sendo testadas acessem o MongoDB desnecessariamente, afinal o objetivo do teste unitário em nossos modelos é de validar qualquer entrada e saída realizada através das diversas funções que foram criadas a elas. Não será necessário testar, por exemplo, como funciona a função `Friendships.find`, `Friendships.findOne` ou qualquer outra função nativa do MongoDB, mas faz todo sentido mockarmos o comportamento dessas funções para validarmos as funções que criarmos em cima desses modelos. O Jasmine permite criar mocks através da função `spyOn(Objeto, "função")` e através dessa chamada é possível alterar o resultado dessas funções para evitar que o modelo acesse o banco de dados para retornar tal resultado. Para testar o modelo `Friendships` crie o arquivo `tests/jasmine/server/unit/friendships.js`, nele vamos inicialmente criar apenas as declarações dos testes:

  - Em seguida, adicionaremos uma lista de permissões a respeito dos dados que iremos consumir da conta do usuário quando ele se autenticar em nosso sistema através do Facebook. Quando um usuário permitir seu acesso, ele libera diversas informações de sua conta, como seu e-mail, sua lista de amigos, seus últimos posts, seu perfil e muito mais. Cada informação varia de sistema para sistema, e para conhecer todas as permissões é necessário conhecer a fundo a documentação de sua API (no nosso caso, temos que estudar a API do Facebook através do **Facebook Developers**). Antes de uma aplicação externa permitir tal acesso, é exibida uma página da própria aplicação avisando sobre todas as informações que serão expostas ao se autenticar. No Meteor, utilizamos a função `Accounts.ui.config()` para configurar as permissões de cada autenticação externa via atributo `requestPermissions`. No próximo capítulo, explicarei em detalhes como autocompletar o nome do usuário que entrar na rede via Facebook. Porém, se você não possui uma conta no Facebook e pretende entrar através do cadastro convencional, então usaremos o atributo `extraSignupFields` para incluir um campo extra, que será o nome do usuário. Para aplicar estas configurações na aplicação, crie o arquivo `client/config/accounts.js` com os códigos a seguir:

  - Para monitorar o sistema através de _logging_ , primeiro temos que configurar os pontos importantes do projeto para registrar um log do estado dos dados. Para esta tarefa vamos fazer algo diferente: em vez de utilizarmos algum package de logging do Meteor, vamos usar um módulo Node.js. Desta vez não só iremos configurar logs como também vamos explorar como reaproveitar módulos Node.js em uma aplicação Meteor. Como Meteor é construído em cima do Node.js, também temos a possibilidade de usar não todos, mas a maioria dos módulos Node.js existentes no NPM (_Node Package Manager_). Mas por que nem todos os módulos Node.js rodam no Meteor? O Meteor é uma plataforma que possui um contexto específico, que também trabalha fortemente integrado com banco de dados MongoDB. Exemplos de módulos que não serão compatíveis no Meteor são os módulos drivers de banco de dados: MySQL, Redis, SQL Server e outros. Outro exemplo de tipos módulos totalmente incompatíveis com Meteor são os _web frameworks_ , responsáveis por criar uma aplicação web no Node.js, como **Express** , **Connect** , **Sails** , **Geddy** e muitos outros existente neste link:
## Princípios e Técnicas

- requisições em nosso servidor. Testar requisições sobre as rotas é muito útil, pois per-
- requisição real, pelo qual testamos as rotas. Este tipo de teste aqui está automatizado,
- Suas aplicações serão single-thread, ou seja, cada aplicação terá instância de um único
- zar os módulos http, url e fs (file system), que tal reorganizar a nossa aplicação para
- flexível e liberal. Apesar de utilizar o seu scaffold de geração inicial, temos a total


  - Através do segundo parâmetro, chamado de `template`, temos acesso às funções `template.find` e `template.findAll`, que serão utilizadas para retornar um elemento interno do template. No nosso caso, o `template` retorna o template atual, e com isso é possível navegar entre seus elementos internos. Utilizaremos a função `template.find("textarea")` para obter a tag `<textarea>` e, assim, capturar os dados da mensagem publicada. Em seguida, utilizamos um _shortcut_ lógico no trecho `var posts = Session.get("posts") || [];`, que simplesmente retorna um _array_ vazio quando `Session.get("posts")` retornar `undefined`. Após obtermos o array de posts, incluiremos um novo post no array e o atualizaremos dentro da `Session`, via `Session.set("posts", posts)`. Para ver como ficou, crie o arquivo `client/events/post.js`, seguindo a implementação adiante:

  - Com essa estrutura feita, agora vamos implementar os testes em cada situação criada pela função `it()`. Também estamos usando a função `beforeEach()`, que é executada repetidamente antes de rodar cada teste. No callback do `beforeEach()`, mockamos o comportamento da função `Meteor.userId()`, afinal todos os testes vão rodar sem usuário logado e se não mockarmos esse comportamento toda chamada a esta função vai retornar `undefined`. O motivo de mockarmos o retorno de `Meteor.userId()` é para focarmos apenas nos testes do modelo `Friendships` e a aplicação desse _mock_ realizado pela função `spyOn(Meteor, "userId").and.returnValue(userId)` minimiza a implementação de códigos complexos que teriam que cadastrar e logar um novo usuário desnecessariamente para em seguida permitir que os testes unitários no modelo funcionem corretamente.

  - Neste capítulo, criaremos uma tela para o perfil do usuário logado, que será exibido no bloco lateral esquerdo, constituído pelos campos: nome e descrição. De início, um novo usuário não terá esses dados completos. Para isso, vamos criar um bloco que apresenta o perfil (`Template.profileBox`), um template que será um formulário para atualizar o perfil (`Template.profileForm`) e, por último, um template que será o intermediador entre os templates anteriores (`Template.profile`). Começaremos criando o bloco do perfil, que será um subtemplate do diretório do template `home`, ou seja, vamos criar o diretório `client/views/home/profile`, dentro do qual implementaremos o HTML `client/views/home/profile/profile_box.html`. Este template vai utilizar a marcação `{{currentUser.profile}}` para apresentar o perfil do usuário:

  - Até agora, nenhuma novidade na declaração dos testes do modelo `Posts`. A única diferença é que foram criadas mais variáveis no início do teste que serão usadas nos futuros mocks e usamos uma função utilitária do Jasmine para trabalhar com mocks em cima da instância do objeto `Date`. Para isso, foi necessário instalar o mock de datas através da função `jasmine.clock().install()`, e depois foi aplicado o mock utilizando uma data fake via `jasmine.clock().mockDate(timeNow)`. Ao instalar esse mock, é necessário desinstalá-lo toda vez que um teste terminar sua execução para evitar inconsistências nos demais testes. Para isso, implementamos a função `jasmine.clock().uninstall()` dentro do callback `afterEach()`, que aliás é um callback executado no término de cada teste unitário.
## Aplicações Práticas

- acessar a rota de edição do contato) e Excluir (botão que vai excluir o contato atual).
- forma totalmente abstraída para o desenvolvedor. Seu site oficial é: (http://socket.io)
- logado dentro do nosso chat. Para finalizar essa tarefa, faremos alguns refactors. Pri-
- quina. Para instalá-lo recomendo que acesse seu site oficial: (http://nginx.org) . Tam-
- guração fará o Nginx servir os arquivos estáticos ao invés do Express, e para finalizar

## Principios e Tecnicas

  - Outro detalhe importante é que o foco desse framework é a prototipagem rápida, fazendo com que trabalhos que levariam meses sejam realizados em semanas, ou até mesmo alguns dias. Isso é possível graças aos seus recursos que visam automatizar tarefas repetitivas, exibir respostas imediatas no browser, diversas convenções, vários componentes customizáveis prontos para uso e também as configurações complexas de baixo nível que estão simplificadas para o desenvolvedor. Por _default_ , suas aplicações Meteor serão em formato _single-page real-time_ , mas também é possível criar aplicações _multi-page_ orientado a rotas. Este framework é considerado como um **MVVM** _(Model-View View-Model)_ , ou seja, não existe _controllers_ ou _routes_ por default, mas é customizá-lo com o propósito de adicionar _controllers_ , _routes_ e outros _patterns_ através da inclusão _packages_ _third-party_.

  - O que significa o erro **Exception from Deps recompute**? Esse erro ocorrerá sempre que surgir algum conflito no PubSub da aplicação. No momento, estamos usando o package default: `autopublish`. Ele cria automaticamente um `Publish` e um `Subscribe` para cada collection que usarmos no client-side da aplicação. Usá-lo em ambiente de produção é uma falha gravíssima de segurança pois vai liberar acesso a qualquer função do MongoDB via console de um browser. Utilize-o apenas para prototipar sua aplicação e, principalmente, para ter noção de quais operações serão utilizadas do banco de dados. Após definir todas as funções de banco de dados, remova este package e crie funções de publish e subscribe para cada operação utilizada das collections. Fique tranquilo, teremos um capítulo dedicado a como usar o PubSub e também como preparar uma aplicação Meteor para ambiente de produção.

  - Express e Meteor são os frameworks que mais se destacam, ambos são frameworks para Node.js com características únicas. O Express é considerado um framework minimalista, focado em criar projetos através de estruturas customizadas pelo desenvolvedor. Com ele é possível criar serviços REST, aplicações web tanto em padrão MVC _(Model-View-Controller)_ como MVR _(Model-View-Routes)_ ou totalmente sem padrão em um único arquivo, tudo vai depender das boas práticas aplicadas pelo desenvolvedor. Uma aplicação Express pode ser pequena ou de grande porte, tudo vai depender dos requisitos e, principalmente, de como vai organizar todos códigos nele, afinal com o Express você tem o poder de aplicar suas próprias convenções e organizações de código. Outro detalhe é que você utiliza seu próprio framework de persistência de dados, então todo controle fica em suas mãos.

