---
name: epub-flask-de-a-a-z
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Flask De A A Z — Passos Operacionais

Conteudo extraido do livro 'Flask De A A Z'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- À minha mãe Andréa que me criou e lutou para que eu me tornasse o homem que hoje sou, que passou por momentos difíceis para que eu pudesse sorrir e acreditou durante todo o tempo que eu chegaria até aqui e a meus pais França e Vilma, que me acompanharam e me acolheram em sua família aos 13 anos, família esta que posso chamar de minha e que também foi fundamental para que eu alcançasse meus objetivos e ao meu pai Hamilton que é um exemplo de perseverança viva e que sempre me gerou inspiração para seguir acreditando em meus sonhos.
- À minha companheira, amiga, musa, namorada, noiva e esposa, meu eterno amor, minha inspiração e um dos motivos pelo qual permaneço buscando ser uma pessoa melhor a cada dia, para permanecer sendo capaz de fazê-la se apaixonar por mim todos os dias, como me apaixono por ela em todos os instantes, obrigado por estar ao meu lado cada segundo, acreditando em mim.
- Aos meus irmãos, Diogo e Victor, que são exemplos que incansavelmente sempre segui na certeza de que me tornaria um grande e honrado homem, e a minha pequena e linda irmã Maria Luiza, que com seu sorriso repleto e sincero sempre me traz uma luz e alegria, até mesmo em momentos complicados e conturbados que todos temos em nosso dia a dia.
- À minha tia Janete e tio Eduardo, que investiram em meus estudos e assim me ajudaram a entrar para o ramo da tecnologia e ao meu melhor amigo e irmão Marcos Abraão, que nesses mais de 15 anos de amizade sempre apostou grande em mim e investiu seu tempo e esforço.
- Ao meu amigo Vinícius Albino, por ser essa pessoa que acrescenta em minha vida com seus conselhos, me ajudando a ser uma pessoa melhor e mais madura.
- Ao meu padrasto Saulo, que junto de minha mãe Andréa auxiliou em minha criação, sempre me tratando como um filho, me aconselhando e ajudando em tudo que pôde.
- A todos os meus alunos, que são o real motivo e inspiração para que eu continue todos os dias buscando conhecimento para ser compartilhado entre todos de forma a ajudar no crescimento profissional e pessoal de cada um.
- A toda a equipe da Casa do Código que foram fundamentais para que este livro viesse a ter o nível de qualidade que o leitor merece, em especial à Vivian Matsui que desde o primeiro contato acreditou em meu sonho e fez parte de todo o processo como minha editora-chefe.
- A todos vocês o meu muito obrigado, por fazerem parte da minha vida e acreditarem que eu me tornaria alguém cujo coração teria como missão compartilhar o aprendizado e sabedoria que graças a Deus vindo de vocês me tornou o homem que hoje sou.   # Sobre o autor  Tiago Luiz é graduado em Análise e Desenvolvimento de Sistemas pelas Faculdades Integradas Simonsen, professor na área de Tecnologia há mais de 6 anos, atualmente trabalha como cientista de dados onde desenvolve sistemas e scripts em Python focados em processamento de um alto volume de dados.
- Especialista em Python, Google Maps e Adobe Muse é fundador do Canal Digital Cursos, onde existem cursos inteiramente online focados em ajudar pessoas a entrarem para o mercado de trabalho.   # Prefácio  Este livro foi criado com o foco de partilhar com você, leitor ou leitora, mais sobre meus conhecimentos e experiências com a ferramenta Flask, uma das mais utilizadas pelos programadores Python no mundo.

## 2. Principios e Tecnicas
- O conteúdo é bem direto, sem rodeios, mas ao mesmo tempo com explicações proveitosas e práticas.
- A didática foi construída para que seu entendimento ocorra de um modo descontraído e fácil, focando diretamente no que precisa ser dito a você.
- Há também imagens que expressem os resultados desejados no sistema que será desenvolvido no livro, para você acompanhar sua evolução ao decorrer dos capítulos.
- O que mais me alegra é saber que este livro é capaz de auxiliar um profissional de desenvolvimento na criação de seus projetos de forma segura, efetiva e rápida, com uma ferramenta inteiramente poderosa e completa.
- Além dos capítulos essenciais que estão no livro, dispomos também de alguns conteúdos extras que acreditamos ser de grande valor para sua vida como programador Python, como autenticação segura com JWT e serviço de envio de e-mail.
- Considere como um presente de quem deseja ver seu crescimento profissional.
- Faça bom proveito deste conteúdo, foi um imenso prazer compartilhar com você o conhecimento que recebi de muitas pessoas que, como eu, tiveram o intuito de ajudar outras a crescerem profissionalmente e alcançarem seus sonhos.  _Tiago Luiz_   # Sobre o livro  Neste livro, você aprenderá a trabalhar com uma das linguagens mais utilizadas no mundo, o Python.
- O tema principal a ser abordado será o framework Flask.
- Por ser uma ferramenta do Python robusta e completa, ela permite que a aplicação Web seja construída de forma a atender às necessidades de seu usuário final, ao mesmo tempo em que flexibiliza o fluxo de desenvolvimento de uma equipe, ou até mesmo de um desenvolvedor que tenha projetos pessoais.
- O Flask é um dos melhores frameworks para se trabalhar no Python atualmente.

## 3. Aplicacoes Praticas
- O Flask está em sua versão `1.0.2`, e seu primeiro release foi feito em abril de 2010, então podemos ver que ele é bem maduro, tendo em vista que são mais de 9 anos de atualizações pelas quais ele vem se solidificando.
- Outra tecnologia muito interessante que trabalharemos no livro e que será fundamental para nosso crescimento é o SQLAlchemy, uma biblioteca muito interessante e completa, que nos permite trabalhar com diversos bancos de dados relacionais dentro do Python.
- A interação do SQLAlchemy com o Flask é excelente e isso trará muitas vantagens para nossos estudos.  ### Um breve resumo do mercado de Python  De acordo com o blog da GeekHunter, o Python está entre as 10 linguagens de programação mais bem pagas atualmente, mas não é só isso que traz vantagens em utilizar o Python.
- Sua sintaxe de fácil escrita e sua flexibilidade, quando bem utilizadas, permitem que tenhamos excelentes projetos com estruturas totalmente reutilizáveis e nada burocráticas.
- Link da postagem: <https://blog.geekhunter.com.br/salario-de-programador-cargos-em-alta-2019/>  ### Público e pré-requisitos  Este livro é voltado para desenvolvedores que possuem conhecimento da linguagem Python e desejam utilizá-la em sistemas Web e APIs.
- Recomendamos que você tenha conhecimento básico em Python e criação de ambientes virtuais (_Virtualenvs_).
- Não é necessário conhecimento nas ferramentas citadas na introdução, mas o conteúdo abordado será de nível avançado.  ### O que aprenderei neste livro?
- Você aprenderá a criar aplicações Web e APIs Rest totalmente robustas utilizando Flask, SQLAlchemy e outras ferramentas que o Python possui.
- Criaremos um sistema de gerenciamento de produtos, onde gerenciaremos não somente produtos, mas suas categorias, usuários e suas funções no painel de acesso, podendo limitar um usuário para que ele acesse apenas a API do sistema ou o administrador também.
- Ao término teremos uma aplicação que possuirá uma API e uma área administrativa completa e personalizada para atender nossas regras de negócio.

## 4. Topicos Avancados
- Com o Flask temos a possibilidade de criar APIs para nossos aplicativos móveis, com muita qualidade e de forma bem robusta.
- Também conseguimos criar uma área administrativa bem completa através dos recursos que o Flask e o SQLAlchemy proporcionam em conjunto, de um modo bem seguro.  ### Como estudar com este livro?
- O livro foi escrito para ser estudado com a mão na massa, trazendo explicações bem sólidas sobre o assunto junto da execução prática de etapas de um sistema de gerenciamento de estoque, que será construído no decorrer dos capítulos, além de uma API que usuários autorizados poderão utilizar para consumir os dados do sistema externamente através de um `app` ou `website`.
- Além das explicações contendo práticas bem elaboradas e de fáceis entendimentos, contamos também com algumas observações e dicas em cada tema, conforme a experiência do autor.
- São questões ou conselhos que deixarei para evitar que você passe por algum problema que já enfrentei utilizando o framework.   # Introdução  Nessa primeira parte temos dois capítulos que servirão como introdução ao livro.
- O primeiro abordará a maneira correta de configurar seu computador para trabalhar com Python e o segundo falará um pouco sobre o que é o Flask, seus pontos fortes e fracos, as vantagens de utilizá-lo, e já iniciaremos a criação do sistema de gerenciamento utilizando o Flask.
- Figura 1: Logo da linguagem e da ferramenta  Capítulo 1  # Configuração do Python  Neste capítulo, veremos como fazer as instalações básicas do Python em nossa máquina e rodaremos nosso primeiro script para testar se tudo está dentro do esperado.
- Caso já tenha o Python em sua máquina, sinta-se à vontade para ir ao capítulo 2.
- Vamos demonstrar utilizando os Sistemas Operacionais Windows e Linux (mais precisamente Ubuntu), mas tenha em mente que se seu sistema operacional for qualquer outro que trabalhe baseado em Linux, ou se for MacOS, os comandos de Linux provavelmente vão funcionar ou estarão bem próximos dele.  ## 1.1 Instalando o Python e suas dependências  ### Windows  Vá até o link <https://www.python.org/downloads/> e faça o download da versão mais atual que estiver disponível.
- Clicando em `download`, isso provavelmente já ocorrerá direto.
