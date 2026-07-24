---
name: epub-vue-js-construa-aplica-es-incr-veis
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Vuejs Construa Aplicacoes Incriveis — Passos Operacionais

Conteudo extraido do livro 'Epub Vuejs Construa Aplicacoes Incriveis'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- page_002 Sumário Dedicatória Agradecimentos Sobre o autor Apresentação Capítulo 1: Visão geral sobre TDD 1.1 TDD e sua história 1.2 E por qual motivo eu deveria usar TDD?
- Capítulo 2: Primeiros passos com RSpec e Cucumber 2.1 Olá RSpec 2.2 Olá Cucumber 2.3 O que é BDD?
- Sem o trabalho árduo e constante suporte da minha mãe, eu não estaria aqui hoje, escrevendo um livro.
- Ela é minha heroína e a pessoa mais batalhadora que já conheci.
- Obrigado Lilian Pessoa por me dar as oportunidades que tive na vida.
- Escrever um livro é uma empreitada bem mais trabalhosa que eu pensei.
- Essas horas não foram um investimento apenas meu, foi também da minha noiva.
- Vários meses sem ter um final de semana tranquilo para passar ao lado dela.
- Obrigado Ana Raquel por segurar essa barra e por me apoiar até a última palavra deste livro.  page_005 Agradecimentos Primeiro eu gostaria de agradecer ao Adriano Almeida, da Casa do Código, pelo convite para escrever este livro.
- Sem esse primeiro empurrão é muito improvável que esse livro existiria.


  - Quando desenvolvemos pensando de forma modularizada, ou seja, desenvolvendo componentes que juntos vão montar nossa página, tentamos ao máximo isolar suas responsabilidades e torná-los independentes para reaproveitamento. Porém, ainda é possível e bem provável, na verdade, que um componente precise de um ou mais dados vindos de outro componente, seja para diminuir o número de requisições, ou para reduzir a quantidade de código repetido.

  - Vendo isto, Evan começou a olhar para as ferramentas que existiam no momento, para que ele pudesse resolver este problema. Quando ele começou a pesquisar a fundo, percebeu que não existia uma biblioteca que lhe permitisse trabalhar livre e com menos repetição. O Reacts.js estava apenas começando e frameworks como Backbone.js eram muito mais do que ele precisava para prototipar, pois este trabalhava com toda a arquitetura MVC.

  - Para fazer isso, as dependências complexas são substituídas por Mocks, que nada mais são do que objetos que simulam o comportamento do objeto real, sem executar toda a sua lógica. Por exemplo, imagine que sua lista de tarefas venha de um banco de dados. Você não quer abrir uma conexão, criar tarefas, salvar, comitar uma transação e sabe-se lá quantas mais coisas são necessárias para adicionar e retornar tarefas desse banco.

  - Você se lembra de que o componente é baseado em marcação, estilo e comportamento? Pois bem, é isso que vamos começar a definir. Crie o seu arquivo `Hello.vue`. Dentro dele, vamos marcar onde fica cada parte do elemento, usando a tag `<template>`, para mostrar onde fica nossa marcação do componente (HTML). Usaremos também a tag `<style>` para marcar seu estilo e, por fim, a tag `<script>` para marcar seu comportamento.

  - Em casos de componentes grandes, pode acontecer de queremos ter mais de um slot inserido, certo? Pensando nisto, o Vue criou o que chamamos de `named slots`. Todo `slot` tem o atributo especial `name`, que pode ser usado para customizar como o conteúdo será distribuído em mais de um `slot`. Os nomes funcionam como identificadores para você apontar para o seu componente, em que cada conteúdo deverá ser renderizado.

  - Outro fator que pode importar é, caso você tenha dados sensíveis em uma das condições, nesse caso o `v-show` não é indicado, pois qualquer pessoa com alguma experiência em desenvolvimento web poderá ver esse elemento escondido no seu HTML. Um exemplo seria em uma aplicação, com diferentes níveis de acesso, na qual o administrador pode ver algumas funcionalidades, o funcionário outras e os usuários menos ainda.
## 2. Principios e Tecnicas
- Escrevê-lo foi não só um excelente desafio mas também uma grande oportunidade de aprendizado.
- Gostaria de agradecer também à Plataformatec e a todo mundo que trabalha comigo lá.
- São os melhores profissionais com quem eu já trabalhei e me inspiram todo dia a ser um profissional melhor.
- Não posso deixar também de agradecer a minha família e amigos como um todo.
- Ao fazer este livro, tive que abdicar de passar inúmeras horas com eles, decisão que não foi fácil de tomar e muito menos de manter.
- Por fim, gostaria de agradecer às pessoas que investiram seu tempo revisando as primeiras versões deste livro.
- Eles não tinham nenhuma obrigação de fazê-lo, fizeram pela boa vontade, amizade, por serem colaborativos e pela vontade de aprender algo novo.
- São eles: Bernardo Chaves, Erich Kist, Danilo Inacio e Anna Cruz.  page_006 Sobre o autor Hugo Baraúna é cofundador e sócio da Plataformatec, empresa de consultoria em desenvolvimento de software especializada em Ruby e Rails.
- A Plataformatec é referência nacional e internacional no mundo Ruby, devido principalmente a seus projetos open source e sua colaboração com a comunidade.
- Ele atua tanto na direção da empresa quanto como desenvolvedor, tendo participado de projetos de consultoria, coaching e desenvolvimento para startups e empresas da Fortune 1000.


  - Para o tipo de projeto que ele trabalhava, as prioridades eram algo flexível e leve. Quando ele viu que isto ainda não existia no mercado, e por ser um ótimo programador como é, decidiu então ele mesmo resolver este problema, criando o Vue.js. Apesar de o Vue.js ter nascido como uma ferramenta de prototipação rápida, agora ele já pode ser usado para criação de grandes e escaláveis aplicações reativas.

  - Mais do que dar as ferramentas necessárias para desenvolver, os frameworks de componentes reativos para interfaces web modernas vieram nos ajudar com padrões e reaproveitamento de código. Este livro destina-se a pessoas que já têm conhecimento com JavaScript, de preferência com os padrões do ECMAScript 2016, e que desejam aprender a usar uma biblioteca moderna de desenvolvimento front-end, o Vue.js.

  - O comando `unit` vai avisar ao Node para usar as configurações de `testing`, definidas no `testing.env.js` e, com isso, rodar o Karma com as configurações encontradas no `karma.conf.js`. Também precisamos criar o `karma.conf.js`. Para isto, vamos criar a pasta `test` e, dentro dela, a pasta `unit`, fazer a configuração do Karma, que é complexa. Por isso vamos usar a que o próprio VueCLI nos fornece.

  - O mais complexo mesmo é sua configuração que está intimamente ligada ao webpack (<https://webpack.github.io/>), que é um empacotador de código para projetos web. Ele entende cada tipo de arquivo por extensão e faz diversas ações diferentes neles, como minificar, fazer polyfill de código, alterar variáveis e afins. Ele, sem dúvidas, merece um livro a parte, mas você não precisa se preocupar com isso.
## 3. Aplicacoes Praticas
- Hugo se formou em Engenharia de Computação pela Politécnica da USP.
- Durante a faculdade, passou pelo laboratório USP-Microsoft e por empresas como Procwork e IBM.
- Para ele, só é possível fazer produtos e serviços de qualidade quando se ama o que faz.  page_007 Apresentação Abordagem do livro Este livro não é um manual do Cucumber e de RSpec.
- Já existem diversos lugares listando as funcionalidades, classes e métodos do Cucumber e RSpec.
- Portanto, o objetivo não é repetir o que já existe pronto em vários outros lugares.
- A abordagem deste livro é apresentar como usar essas ferramentas, em vez de mostrar todos os detalhes de cada uma delas.
- Saber o que as ferramentas oferecem é diferente de saber como usá-las.
- Além da mostra do uso básico, várias boas práticas não documentadas previamente também são apresentadas, utilizando exemplos ao longo do livro inteiro.
- Estrutura do livro Este livro está estruturado em quatro partes: A primeira consiste em uma introdução ao conceito e histórico do TDD e BDD, assim como um primeiro contato com o RSpec e com o Cucumber.
- Ela é formada pelos capítulos 1 e 2 ; A segunda é uma apresentação geral do RSpec.

## 4. Topicos Avancados
- Passando pela estrutura básica de um teste de unidade feito com ele, pela organização de testes e pelo uso de test doubles como mocks e stubs.
- Ela é formada pelos capítulos 3 a 5 ; A terceira parte consiste em uma apresentação do Cucumber e de como usá-lo para escrever especificações executáveis.
- Ela é formada pelos capítulos 6 a 9 ; Por fim, na quarta e última parte, nós construiremos uma aplicação do zero seguindo o conceito de outside-in development do BDD, utilizando RSpec e Cucumber.
- Ela é formada pelos capítulos 10 a 16 .
- Estou aprendendo ou já sei programar em Ruby mas nunca fiz TDD Se você se enquadra no caso acima, este livro é perfeito para você.
- Você irá aprender como fazer testes automatizados e seguir o fluxo de TDD e BDD para fazer um código mais fácil de ser mantido e com mais qualidade.
- Aprender uma habilidade nova não é simples, mas pode ser mais eficiente com a ajuda de uma apresentação estruturada e de um caminho definido.
- Este livro mostra passo a passo como usar o RSpec e o Cucumber para construir uma aplicação inteira seguindo o fluxo de TDD/BDD.
- Já faço testes automatizados mas não sei se estou fazendo do jeito certo Existem diversos fatores que influenciam o desenvolvimento de bons testes.
- Fazer testes do jeito certo não é apenas ter cobertura de testes em 100%.

