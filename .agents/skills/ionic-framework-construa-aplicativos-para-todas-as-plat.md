---
name: ionic-framework-construa-aplicativos-para-todas-as-plat
description: >-
  Passos operacionais extraidos do livro 'Ionic framework construa aplicativos para todas as plataformas mobile' (PT) — Mobile.
---

# Ionic Framework Construa Aplicativos Para Todas As Plat — Passos Operacionais

Conteudo extraido do livro 'Ionic Framework Construa Aplicativos Para Todas As Plat'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Capítulo 2 Sumário ISBN Agradecimentos O autor Prefácio 1.
- Conhecendo os nossos arquivos 4.
- Recursos  Capítulo 3 ISBN Impresso e PDF: 978-85-5519-288-3 EPUB: 978-85-5519-289-0 MOBI: 978-85-5519-290-6 Você pode discutir sobre este livro no Fórum da Casa do Código: http://forum.casadocodigo.com.br/ .
- Caso você deseje submeter alguma errata ou sugestão, acesse http://erratas.casadocodigo.com.br .
- Capítulo 4 Agradecimentos A realização deste projeto tornou-se possível e real com o apoio e confiança de algumas pessoas.
- Faço questão de deixar aqui o meu agradecimento a elas.
- Em primeiro lugar, quero agradecer ao Adriano Almeida pela oportunidade e confiança na minha obra.
- À Vivian Matsui que foi fundamental para aprender e continuar aprendendo os macetes de uma boa escrita.
- Agradeço à minha família pela paciência e compreensão incondicional, principalmente à minha filha Letícia por ter "cedido" o tempo em que poderíamos estarmos juntos, como também seu colo para descanso e relaxamento em momentos de estresse.
- Este parágrafo não é um simples agradecimento, mas um intenso agradecimento e dedicação à memória de meus pais, principalmente minha mãe, falecida no mesmo ano de publicação, por ter deixado o legado de uma boa educação e ter me apoiado e incentivado a estudar TI para seguir a profissão onde me sinto realizado e feliz.

## 2. Principios e Tecnicas
- Capítulo 5 O autor Figura -1.1: Adrian Gois Em 1995 recebi de presente de minha querida e saudosa mãe meu primeiro computador com o SO Windows 95: um ITAUTEC equipado com um processador Pentium que fez me apaixonar à primeira vista pela tecnologia.
- A partir daí, comecei a ingressar no mundo da internet desde já, pesquisando como programar aquela máquina.
- Fiz assim meus primeiros programas na linguagem Clipper e, logo em seguida, comecei a estudar HTML e JavaScript .
- Depois disto, nunca mais deixei de lado o fascínio por computadores.
- Assim me tornei bacharel em Ciência da Computação pela UNIFACS/Salvador-BA, fundei a empresa ABG TI SOLUTIONS ( http://www.abgsolucoes.com.br ), onde obtive experiência em Desenvolvimento de Sistemas em grandes empresas multinacionais, passando por linguagens como Java , JavaScript , C , C++ , Delphi , entre outras que permeiam o mundo do desenvolvimento.
- Hoje lidero uma equipe de TI em uma fábrica de software com arquiteturas diversas, passando por .NET até Microsoft SharePoint , com contratos em empresas de grande e médio porte.
- Desenvolvo projetos de aplicativos híbridos, utilizando a tecnologia deste livro.
- Capítulo 6 Prefácio Já parou para imaginar, enquanto você lê esta pequena frase, quantos smartphones estão sendo utilizados no mundo?
- Segundo a TeleGeography , em 2015 tínhamos 7,1 bilhões de chips ativos no mundo, ou seja, quase a quantidade de habitantes do globo terrestre.
- Com isso, podemos inferir sobre o grande potencial de mercado que é o de smartphones e telefonia.

## 3. Aplicacoes Praticas
- Com a invenção dos smartphones , surgiram tanto grandes como descartáveis ideias de aplicativos.
- No início, tudo era muito restrito ao desenvolvimento destas ideias em uma plataforma e, a partir de seu sucesso ou não, a migração do código para outras plataformas, principalmente na dupla iOS versus Android.
- Por conta disto, surgiram os frameworks para compilação híbrida de aplicativos sendo desenvolvidos em uma única linguagem.
- Hoje, sabe-se que isso é possível com a mesclagem de HTML , JavaScript e CSS , basicamente.
- Dentro destes frameworks , o foco desta obra é Ionic framework .
- Nele é possível utilizar componentes responsivos e atrativos para o desenvolvimento dos aplicativos, com a possibilidade de compilação e fácil instalação nas mais diversas plataformas – seja Windows Phone , Android , iOS , BlackBerry etc.
- O livro é dividido em 10 capítulos, nos quais inicialmente é explanado sobre a instalação e preparação do ambiente de desenvolvimento e, em seguida, um capítulo dedicado a explicar os comandos básicos do framework .
- Posteriormente, vamos evoluindo na criação e entendimento dos artefatos do aplicativo e, a cada novo capítulo, temos novas inserções de componentes.
- Ao final, dedico dois capítulos a recursos extras, como utilização da câmera do dispositivo, consumo de serviços do firebase do Google, entre outros recursos avançados.
- Esta leitura levará você em uma viagem ao mundo do desenvolvimento de aplicativos, sem se preocupar com a plataforma nativa à qual ele será destinado, tornando as coisas mais fáceis para manutenção e evolução.

## 4. Topicos Avancados
- Público-alvo Este livro é direcionado aos desenvolvedores que já tenham, pelo menos, uma base em JavaScript , HTML5 e CSS .
- No decorrer do livro, mesmo o leitor não tendo experiência com as tecnologias que permeiam o Ionic , como AngularJS e Cordova/Phonegap, pretendo fazê-lo alcançar um nível de conhecimento básico sobre todas elas.
- É aconselhável também uma base de conhecimento em lógica de programação, para que se evolua no desenvolvimento de um Caso de uso que utilizaremos como exemplo para os capítulos.
- Sendo assim, se já programou nessa tríade (HTML, JS e CSS) e quer iniciar no mundo de aplicativos com o Ionic Framework , não se preocupe, você está no lugar certo.
- Código-fonte Durante a leitura deste livro, desenvolveremos um aplicativo denominado Cardápio Móvel e seu código fonte pode ser clonado através do link: https://github.com/adriangois/codigo-livro-ionicframework .
- Capítulo 7 Capítulo 1 Introdução Com o nascimento dos dispositivos inteligentes, surgiu uma grande quantidade de Sistemas Operacionais.
- Com isso, surgia também a dificuldade em padronizar uma linha de desenvolvimento de aplicações que fossem portáveis ou multiplataforma.
- O Java ME, lançado em 1999, foi a plataforma criada da subdivisão do Java 2 (Java 1.2).
- Com o objetivo de integrar dispositivos limitados em termo de hardware , veio como promessa da já citada padronização, visto que todos os aplicativos rodariam em uma Máquina Virtual ( VM – Virtual Machine ), não importando em qual sistema/dispositivo estaria hospedado.
- Tudo isso provido pela portabilidade da tão crescente tecnologia Java.

