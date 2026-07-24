---
name: docker-para-desenvolvedores
description: >-
  Passos operacionais extraidos do livro 'Docker para Desenvolvedores' (PT) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# Docker Para Desenvolvedores — Passos Operacionais

Conteudo extraido do livro 'Docker Para Desenvolvedores'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Leanpub empowers authors and   publishers with the Lean Publishing process.
- Lean   Publishing is the act of publishing an in-progress ebook   using lightweight tools and many iterations to get reader   feedback, pivot until you have the right book and build   traction once you do.
- This work is licensed under a Creative Commons   Attribution 4.0 International License   Tweet Sobre Esse Livro!
- Por favor ajude Rafael Gomes a divulgar esse livro no   Twitter!
- A hashtag sugerida para esse livro é   #docker-para-desenvolvedores.
- Em específico a aplicações web, certos conceitos   e práticas como DevOps, infraestrutura em Nuvem, phoenix,   imutável e 12 factor apps são teorias bem aceitas que ajudam   na produtividade e manutenção dos sistemas.
- Por serem con-   ceitos não tão novos, são muitas as ferramentas e sistemas   que podem auxiliar na implantação desses.
- Mas Docker é uma   das primeiras e mais comentadas ferramentas e plataformas   que combina tantos desses conceitos de maneira coesa e   relativamente simples de usar.
- Como qualquer ferramenta,   Docker é um investimento que oferece melhor retorno quando   se entende seu propósito e como usa-lo apropriadamente.
- Existem várias apresentações, artigos e documentações sobre   Docker.


  - 132https://github.com/jenkinsci/docker/blob/83ce6f6070f1670563a00d0f61d04edd62b78f4f/

  - 72https://docs.docker.com/engine/reference/commandline/build/#specify-dockerfile-f

  - 142https://github.com/docker/docker/blob/03e2923e42446dbb830c654d0eec323a0b4ef02a/

  - 141http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/

  - 143http://blog.replicated.com/2016/02/05/refactoring-a-dockerfile-for-image-size/

  - 17https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/
## 2. Principios e Tecnicas
- Porém existia a oportunidade de um livro ligando   a teoria com a prática da ferramenta.
- Em que o leitor pode   entender as motivações de Docker e também como organizar   sua aplicação para extrair o maior proveito da ferramenta.
- Estou muito alegre que o Rafael escreveu este livro, que   acredito ser uma contribuição importante para nossa área.
- O   Rafael é extremamente engajado na comunidade de Docker   e Devops pelo Brasil, além disso entende o que as pessoas   buscam de conhecimento na área.
- Nesse livro você vai poder   entender o básico sobre Docker com uma liguagem simples e   vários exemplos práticos.
- Espero que esse livro seja mais um   passo para impulsionar sua jornada.
- Desejo-lhe sucesso e tudo   de melhor.
- Prefácio   2  Abraços,  Luís Armando Bianchin   Como ler esse livro  Esse material foi dividido em duas grandes partes.
- A primeira   trata das questões mais básicas do Docker.
- É exatamente o   mínimo necessário que um desenvolvedor precisa saber para   utilizar essa tecnologia com propriedade, ou seja, ciente do   que exatamente acontece ao executar cada comando.


  - 119https://docs.docker.com/engine/reference/logging/overview/#json-file-options

  - 149https://serverfault.com/questions/599103/make-a-docker-application-write-to-

  - 13http://techfree.com.br/2015/06/sera-que-esse-modelo-de-containers-e-um-hype/

  - 15http://techfree.com.br/2015/12/entendendo-armazenamentos-de-dados-no-docker/
## 3. Aplicacoes Praticas
- Nessa primeira parte tentaremos não abordar questões de   “baixo nível” do Docker, pois são de maior apelo para a equipe   responsável pela infraestrutura.
- Caso você não saiba nada sobre Docker, aconselhamos muito   a leitura dessa primeira parte, pois assim conseguirá aprovei-   tar a segunda parte, focada na construção de uma aplicação   web no Docker seguindo as melhores práticas, sem pausas.
- Neste livro, adotamos as práticas do 12factor1.
- O 12factor será detalhado no início da segunda parte, mas   podemos adiantar que o consideramos os “12 mandamentos   para aplicações web no Docker”, ou seja, uma vez que sua   aplicação siga todas as boas práticas apresentadas neste docu-   mento, você possivelmente estará usando todo potencial que   o Docker tem a lhe proporcionar.
- Essa segunda parte é dividida por cada boa prática do 12fac-   tor.
- Dessa forma, apresentamos um código de exemplo no   primeiro capítulo, que será evoluído ao longo do desenvol-   vimento do livro.
- A ideia é que você possa exercitar com um   código de verdade e, assim, assimilar o conteúdo de forma  1https://12factor.net/pt_br/   Como ler esse livro   4  prática.
- Também organizamos alguns apêndices com assuntos   extras importantes, mas que não se encaixaram nos capítulos.
- Agradecimentos  Meu primeiro agradecimento vai para a pessoa que me deu a   chance de estar aqui e poder escrever esse livro: minha mãe.
- A famosa Cigana, ou Dona Arlete, pessoa maravilhosa, que   pra mim é um exemplo de ser humano.

## 4. Topicos Avancados
- Quero agradecer também a minha segunda mãe, Dona Maria,   que tanto cuidou de mim quando eu era criança, enquanto   Dona Arlete tomava conta dos outros dois filhos e um sobri-   nho.
- Me sinto sortudo por ter duas, enquanto muitos não tem   ao menos uma mãe.
- Aproveito para agradecer a pessoa que me apresentou o   Docker, Robinho2, também conhecido como Robson Peixoto.
- Em uma conversa informal no evento Linguágil, em Salvador   (BA), ele me falou: “Estude Docker!” E, aqui estou eu termi-   nando um livro que transformou a minha vida.
- Obrigado de   verdade Robinho!
- Obrigado a Luís Armando Bianchin, que começou como autor   junto comigo, mas depois por força do destino acabou não   podendo continuar.
- Fica aqui meu agradecimento, pois foi   com seu feedback constante que pude continuar a fazer o   livro.
- Obrigado a Paulo Caroli que tanto me incentivou a escrever   o livro e indicou a plataforma Leanpub pra fazer isso.
- Se não   fosse ele, o livro não teria saído tão rápido.  2https://twitter.com/robinhopeixoto   Agradecimentos   6  Obrigada a fantástica Emma Pinheiro3, pela belíssima capa.
- Quero agradecer muito as pessoas incríveis do Raul Hacker   Club4 que tanto me incentivaram em todo esse tempo.

