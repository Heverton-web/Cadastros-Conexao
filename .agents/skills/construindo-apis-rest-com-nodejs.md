---
name: construindo-apis-rest-com-node-js
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Construindo Apis Rest Com Nodejs — Passos Operacionais

Conteudo extraido do livro 'Construindo Apis Rest Com Nodejs'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Introdução ao Node.js](01-introducao-ao-nodejs.html)   * [2\.
- Setup do ambiente](02-setup-do-ambiente.html)   * [3\.
- Gerenciando módulos com NPM](03-gerenciando-modulos-com-npm.html)   * [4\.
- Construindo a API](04-construindo-a-api.html)   * [5\.
- Trabalhando com banco de dados relacional](05-trabalhando-com-banco-de-dados-relacional.html)   * [6\.
- Implementando CRUD dos recursos da API](06-implementando-crud-dos-recursos-da-api.html)   * [7\.
- Autenticando usuários na API](07-autenticando-usuarios-na-api.html)   * [8\.
- Testando a aplicação — Parte 1](08-testando-a-aplicacao-parte-1.html)   * [9\.
- Testando a aplicação — Parte 2](09-testando-a-aplicacao-parte-2.html)   * [10\.
- Documentando uma API](10-documentando-uma-api.html)   * [11\.


  - string de template final, responsável por verificar se existem tarefas para exibir

  - sistema. Para pular e ir direto para a tela principal, clique no botão “Go to the

  - resultado final bem legal! Esse template terá de listar todas as tarefas existen-

  - deles, será essencial para que a leitura deste livro seja de fácil entendimento.

  - pleto, e possui uma interface muito bonita e fácil de trabalhar. Nele, será pos-

  - rio, pois precisávamos, no capítulo anterior, preparar a estrutura de diretórios
## 2. Principios e Tecnicas
- Preparando o ambiente de produção](11-preparando-o-ambiente-producao.html)   * [12\.
- Construindo uma aplicação cliente — Parte 1](12-construindo-uma-aplicacao-cliente-parte-1.html)   * [13\.
- Construindo uma aplicação cliente — Parte 2](13-construindo-uma-aplicacao-cliente-parte-2.html)   * [14\.
- Bibliografia](14-bibliografia.html)     # ISBN  Impresso e PDF: 978-85-5519-150-3  EPUB: 978-85-5519-151-0  MOBI: 978-85-5519-152-7  > Caso você deseje submeter alguma errata ou sugestão, acesse <http://erratas.casadocodigo.com.br>.   # Agradecimentos  Primeiramente, quero agradecer a Deus por tudo o que ele fez em minha vida!
- Agradeço também ao meu pai e à minha mãe pelo amor, pela força, pelo incentivo e por todo o apoio desde o início da minha vida.
- Obrigado por tudo e, principalmente, por estarem ao meu lado em todos os momentos.
- Um agradecimento à Aline Brandariz Santos por ser o sorriso em minha vida, por estar ao meu lado em todos os momentos, por me fazer feliz, por me apoiar e me incentivar a arriscar na vida.
- Charlotte Bento de Carvalho pelo apoio e incentivo aos meus estudos desde a escola até a minha formatura na faculdade.
- Um agradecimento ao meu primo, Cláudio Souza, pois foi graças a ele que entrei nesse mundo da tecnologia.
- Ele foi a primeira pessoa a me apresentar o computador, e me aconselhou anos depois a entrar em uma faculdade de TI.


  - botão “Get it now - it’s free!”. Após sua instalação, na tela de Apps do Chrome,

  - claro que a boa prática é instanciar um total de processos relativo à quantidade

  - certificado simples, você pode acessar o site: http://www.selfsignedcertificate.

  - REST com endpoints para criar; atualizar; excluir e listar tarefas; e cadastrar,
## 3. Aplicacoes Praticas
- Um agradecimento ao Bruno Alvares da Costa, Leandro Alvares da Costa e Leonardo Pinto.
- Esses caras me apresentaram um mundo novo da área de desenvolvimento de _software_.
- Foram eles que me influenciaram a escrever um blog, a palestrar em eventos, a participar de comunidades e fóruns e, principalmente, a nunca cair na zona de conforto e aprender sempre.
- Foi uma honra trabalhar junto com eles.
- Agradeço ao pessoal da editora Casa do Código, em especial ao Paulo Silveira e Adriano Almeida.
- Muito obrigado pelo suporte e pela oportunidade!
- Por último, obrigado a você, prezado leitor ou prezada leitora, por adquirir este livro.
- Espero que ele seja uma ótima referência para você.   # Comentários dos leitores  A seguir, veja alguns comentários dos leitores que acompanham meu blog e também gostaram dos meus outros livros, que também foram publicados pela editora Casa do Código.  _"Conheci seu blog através do seu livro de Meteor e, desde então, os seus posts vem sempre me surpreendendo na qualidade e simplicidade com que é abordado o conteúdo.
- Minha maneira de enxergar o JavaScript mudou drasticamente, e a comunidade de Meteor no Brasil só tem a crescer com suas contribuições.
- Valeu, Caio!"_ — Lucas Nogueira Munhoz — ln.munhoz@gmail.com — <http://lucasmunhoz.com>  _"Mestre no assunto._ " — Thiago Porto — thiago@waib.com  _"Li a primeira edição do livro NodeJS, sensacional.

## 4. Topicos Avancados
- Ele conduz o leitor a exercitar o conhecimento de forma prática.
- Parabéns e sucesso!_ " — Lynneker sales — lynneker@rbmsolutions.com.br  _"Tenho os dois livros que você escreveu: Node.js e Meteor, e posso garantir que vou comprar o terceiro.
- Gosto muito da didática fácil e objetiva que você implementa nos seus livros e no blog.
- Sempre uso eles como referência no desenvolvimento.
- Usar ES6 no Front e no Back deve ser lindo demais.
- Nem vi, mas já sei que vou comprar, pois seus artigos e livros nunca decepcionam!_ " — Nícolas Rossett — nicolas@nvieira.com.br  _"Sem dúvida, o livro de Node.js é muito bom, um conteúdo bem prático, com muitos exemplos e até a construção de um projeto.
- Isso ajuda muito o leitor, pois a partir do momento que ele põe a mão na massa, o conteúdo é aprendido de forma mais fácil.
- Parabéns!_ " — David Alves — david_end27@hotmail.com  _"Apoio demais essa metodologia de aprendizado prático, ainda mais com a construção de um projeto passo a passo.
- Sem dúvidas, pretendo aprender também.
- Obrigado por disponibilizar esse espaço para a nossa opinião._ " — Rafael Miguel — raffaelmiguell@gmail.com   # Sobre o autor  Figura -1.1: Caio Ribeiro Pereira.

