---
name: boas-praticas-nodejs-umbler
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Boas Praticas Nodejs Umbler — Passos Operacionais

Conteudo extraido do livro 'Boas Praticas Nodejs Umbler'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- INTRODUÇÃO                            3   2\.
- BONS HÁBITOS E PRINCÍPIOS GERAIS                6   Use Node para os projetos certos                   7   Node.js foi criado para async                      8   Ajude seu cérebro a entender o projeto                8   Crie apenas os diretórios que precisa                   8   Torne fácil localizar arquivos de código                9   Diminua o acoplamento e aumente o reuso de software          9   Priorize configuration over convention                9    Nomes de arquivos no formato ‘lower-kebab-case’             10   Tenha um padrão de código a.k.a.
- MÓDULOS RECOMENDADOS                      38   7.SEGUINDO EM FRENTE                         42  Clique nos capítulos    para acessá-los   1  INTRODUÇÃO  Without requirements and design,    programming is the art of adding    bugs to an empty text file.
- Louis Srygley   INTRODUÇÃO   4  Sabe quando você faz um trabalho e ele fica tão bom que você pensa algo como:    “eu gostaria de ter tido acesso a isso quando estava começando”?
- Pois é, esse é o meu sentimento com este ebook.
- Quando estamos começando com uma nova tecnologia sempre tudo é muito    confuso, complexo e, por que não dizer, assustador?
- Trabalho há onze anos com programação e há uns treze programo mesmo que    não profissionalmente, desde um técnico em eletrônica que fiz em 2004 que    incluía programação de microcontroladores para a indústria.
- Nesse ínterim tive    de trocar sucessivas vezes de tecnologias, seja por questões acadêmicas, seja    por questões de mercado: Assembly, C/C++, Lisp, Prolog, Visual Basic, Java,    Lua, .NET, PHP e, agora, Node.js.
- E a cada troca eu volto a ser um calouro, tendo de aprender não apenas sintaxe,    semântica, todo o “ferramental” relacionado à tecnologia, mas o mais difícil de    tudo: boas práticas!
- Como saber se o código que estou escrevendo está dentro dos padrões de    mercado?


  - ele essa tarefa de controlar a carga de requisições, balanceando entre diferentes nós

  - idênticos da sua aplicação, cada um em um processador. Você pode fazer isso com Node.

  - • >, >=, <, <=1.0: a versão deve ser superior, superior ou igual, inferior, inferior

  - nomeDoScript”, facilitando a sua vida caso seu time tenha vários scripts diferentes.

  - para alertar sobre a importância desse mindset para o uso correto desta tecnologia e

  - irá levar e isso é terrível pois ele bloqueia todas as requisições até que termine.
## 2. Principios e Tecnicas
- Como tirar o máximo proveito da linguagem através do uso das melhores    ferramentas e extensões?
- Como é a arquitetura ou o mindset correto para os tipos de projetos que são    criados com esta tecnologia?
- Como …  E tudo fica pior quando estamos falando de uma tecnologia que não tem sequer    uma década de vida ainda e até cinco anos atrás era coisa de devs malucos em    eventos.
- São muitas as dúvidas sobre Node.js e, mesmo com o todo-poderoso    Google em nossas mãos, parece que essas respostas estão desconectadas e    jogadas cada uma em um canto obscuro da Internet, fazendo com que dê um    trabalho enorme encontrá-las.
- INTRODUÇÃO   5  Não trago aqui verdades universais ou respostas para todas as perguntas que    você vai ter sobre Node.js, mas trago um apanhado da experiência coletiva de    milhares de desenvolvedores ao redor do globo para formar um guia de boas    práticas com Node.js.
- Pessoas com muito mais conhecimento de Node do que    eu, e algumas dicas minhas também, afinal eu também sou um desses milhares    de desenvolvedores!
- Talvez inclusive você reconheça alguma dica que você mesmo pode ter dado em    alguma rede social ou publicação na Internet.
- Espero que goste do que preparamos pra você e que este ebook seja útil na    sua jornada como programador Node.js.
- Este é o grande propósito da Umbler:  Facilitar o desenvolvimento web, seja com a nossa    plataforma, seja com materiais como esse.
- Ah, e se um dia o seu projeto virar uma startup de sucesso e você for fazer um    IPO ou receber uma proposta de compra vinda do Facebook, lembra de quem te    ajudou lááááá no início. ;)  Um abraço e sucesso.


  - cursos específicos, então não entrarei em detalhes aqui. Apenas reservo este espaço

  - guia de estilo, entre eles o mocha, dotenv, mssql, express-generator e muito mais.

  - comando para inicializar o projeto...opa essa é uma dica quente, vamos explorá-la?

  - Existem bons livros sobre programação funcional, inclusive com JavaScript, além de
## 3. Aplicacoes Praticas
- Luiz Duarte  Dev Evangelist   Umbler   2  BONS HÁBITOS    E PRINCÍPIOS    GERAIS  I’m not a great programmer;    I’m just a good programmer    with great habits.
- Kent Beck   BONS HÁBITOS E PRINCÍPIOS GERAIS   7  Acima de qualquer boa prática que eu possa propor neste ebook, vale ressaltar    alguns princípios e motivações que devem estar acima de qualquer coisa em    seus projetos com Node.js.
- Nem todos princípios vão se encaixar apenas no Node.js e talvez você reconheça    uma ou outra coisa que já utilize hoje em outra tecnologia, como PHP.
- Por outro lado, talvez encontre críticas a hábitos ruins que você possui hoje.
- Não se assuste, parte do processo de evolução como programadores (e como    pessoas!) envolve manter bons hábitos e evitar hábitos ruins o tempo todo.
- Afinal, é como dizem, “o hábito faz o monge”.
- Existe um dito popular que diz: “Nem todo problema é um prego e nem toda    ferramenta um martelo”.
- Qualquer tecnologia que lhe vendam como sendo a solução para todos seus    problemas é no mínimo para se desconfiar.
- Node não é um canivete-suíço e    possui um propósito de existir muito claro desde sua homepage até a seção de    about no site oficial: ele te proporciona uma plataforma orientada à eventos,    assíncrona e focada em I/O e aplicações de rede não-bloqueantes.
- Isso não quer dizer que você não possa fazer coisas com ele para as quais ele não    foi originalmente concebido, apenas que ele pode não ser a melhor ferramenta    para resolver o problema e você pode acabar frustrado achando que a culpa é do    Node.

## 4. Topicos Avancados
- Por isso, use Node preferencialmente para:          APIs;      Bots;      Mensageria;      IoT;       Aplicações real-time;  Use Node para os projetos certos   BONS HÁBITOS E PRINCÍPIOS GERAIS   8  Isso pode parecer óbvio quando falamos de uma plataforma focada em I/O não-   bloqueante, mas parece que tem programador que a todo custo quer mudar isso    em suas aplicações, fazendo todo tipo de malabarismo para transformar trechos    de código e módulos originalmente assíncronos em tarefas síncronas.
- Se não gosta de callbacks (será que alguém gosta?) use promises e async/await,    mas não tente transformar Node.js em uma plataforma síncrona pois esse não    é o objetivo dele e ele não funciona bem dessa forma, afinal ele é single-thread,    lembra?
- Se realmente precisa que tudo rode sincronamente, use PHP ou outra    plataforma que crie threads separadas e seja feliz.
- Conseguimos lidar com apenas pequenas quantidades de informação de cada    vez.
- Alguns cientistas falam de sete coisas ao mesmo tempo, outros falam de    quatro coisas.
- Por isso que usamos pastas, módulos e por isso que criamos    funções.
- Elas nos ajudam a lidar com a complexidade do sistema nos permitindo    mexer em pequenas porções dele de cada vez.
- Não saia criando dezenas de diretórios que acabarão vazios ou com apenas    um arquivo dentro.
- Comece com o básico de pastas que você precisa e vá    adicionando conforme a complexidade for aumentando.
- Afinal, você não compra    um ônibus como primeiro veículo pensando no dia em que pode querer dar    carona para muita gente, certo?

