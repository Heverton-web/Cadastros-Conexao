---
name: nodejs-para-iniciantes-umbler
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Nodejs Para Iniciantes Umbler — Passos Operacionais

Conteudo extraido do livro 'Nodejs Para Iniciantes Umbler'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- A PLATAFORMA NODE.JS...............................................................................................6  História do Node.js...........................................................................................................7  Características do Node.js............................................................................................8  Node.js não é uma linguagem de programação ....................................................9  Node.js não é um framework Javascript..................................................................9  3\.
- CONFIGURAÇÃO E PRIMEIROS PASSOS.............................................................. 11  Node.js............................................................................................................................... 12  Visual Studio Code........................................................................................................ 16  MongoDB.......................................................................................................................... 20  4\.
- CRIANDO UMA APLICAÇÃO WEB........................................................................... 21  Routes e views................................................................................................................ 28  Event Loop........................................................................................................................ 36  Task/Event/Message Queue..................................................................................... 40  5\.
- SEGUINDO EM FRENTE................................................................................................. 61   1  INTRODUÇÃO  Talk is cheap.
- Show me the code.  \- Linus Torvalds   INTRODUÇÁO   4   1  Na época da escola, costumava montar grupos de estudos para ajudar os colegas    que tinham mais dificuldade em algumas matérias.
- Como sempre fui nerd, ficar    na escola no turno inverso, ensinando os colegas, era mais um hobby do que uma    obrigação.
- Mas, jamais havia pensado em me tornar professor.
- No entanto, em 2010 (quando estava me formando em Ciência da Computação),    a empresa em que trabalhava na época, estava enfrentando enormes    dificuldades para contratar profissionais para o seu time.
- Para ajudar a empresa,    comecei a ministrar cursos de extensão em dezenas de universidades gaúchas    sobre tecnologias que utilizávamos, como ASP.NET, C# e SQL Server.
- Formava    turmas aos sábados, dezenas de alunos participavam e, em um mês, saíam uns    poucos “formados” – sendo que, destes, contratávamos apenas os melhores de    cada turma (geralmente apenas um).


  - Node.js............................................................................................................................... 12

  - 1\. INTRODUÇÃO........................................................................................................................3

  - Event Loop........................................................................................................................ 36

  - MongoDB.......................................................................................................................... 20

  - Routes e views................................................................................................................ 28

  - História do Node.js...........................................................................................................7
## 2. Principios e Tecnicas
- Em 2013, virei professor regular de uma grande rede de ensino gaúcha,    justamente na semana em que me formei na pós-graduação de Computação    Móvel.
- Desde então nunca mais parei de ensinar, seja como professor regular do    ensino superior, blogueiro de desenvolvimento ou até mesmo como evangelista    técnico – meu papel atualmente na Umbler.
- Ser um programador não é fácil.
- Trabalho nessa área há onze anos (sim, além    de dar aula, trabalho também!), tive a oportunidade de trabalhar com várias    tecnologias, em várias empresas, em dezenas de projetos de todos os tamanhos.
- Inclusive, tive minha própria startup.
- Já tive de aprender diversas tecnologias    “do zero” e aplicá-las rapidamente em projetos de missão crítica para dezenas    de milhares de clientes (às vezes, centenas de milhares).
- E, por mais que sempre    me considerasse um autodidata, tudo ficava mais fácil quando tinha um bom    professor ou, ao menos, um bom material de apoio.
- O que é curioso é que quando ainda estamos “aprendendo a programar” (como    se isso acabasse um dia!), olhamos para os professores como se eles tivessem    nascido sabendo fazer tudo aquilo.
- Como se tivessem feito apenas escolhas    certas de tecnologias e empresas durante toda sua carreira.
- Como se fossem    algum tipo de herói.


  - Listando os clientes....................................................................................................... 53

  - Visual Studio Code........................................................................................................ 16

  - 5\. PERSISTINDO DADOS.................................................................................................... 41

  - MongoDB Driver........................................................................................................... 49
## 3. Aplicacoes Praticas
- INTRODUÇÁO   5   1  Vivemos as mesmas inseguranças que os calouros.
- Devo    aprender a linguagem X ou Y?
- É melhor o framework W    ou Z?
- Será que a tecnologia K vai aguentar a demanda do    meu sistema?
- Quem não tem esse tipo de dúvida no dia a dia é porque parou no tempo, não    evolui mais e só programa usando legado.
- Faça um favor a nós dois: ignore-os.
- Deixe-os acumuladndo teias de aranha.
- Hoje, trago um apanhado do que acredito que todo iniciante em Node.js deve    saber para entender de fato essa plataforma, saber quando e como usá-la e etc.
- Para que, após ler e fazer todos os exercícios deste e-book, um programador,    mesmo que iniciante, seja capaz de responder perguntas como essa quando a    conversa envolver Node.js.
- Quando batem palmas em minhas palestras e cursos, costumo dizer que não há    necessidade, uma vez que naquela sala somos todos “devs”.

## 4. Topicos Avancados
- E esse e-book é isso:    um material de “dev para dev”, sem cerimônias.
- Luiz Duarte  Dev Evangelist   Umbler   2  A    PLATAFORMA   NODE.JS  A language that doesn’t affect the    way you think about programming    is not worth knowing.  \- Alan J.
- Perlis   A PLATAFORMA NODE.JS   7   2  Node.js é um ambiente de execução de código JavaScript no lado do servidor,    open-source e multiplataforma.
- Historicamente, JavaScript foi criado para ser    uma linguagem de scripting no lado do cliente, embutida em páginas HTML que    rodavam em navegadores web.
- No entanto, Node.js permite que possamos usar    JavaScript como uma linguagem de scripting server-side também, permitindo    criar conteúdo web dinâmico antes da página aparecer no navegador do usuário.
- Assim, Node.js se tornou um dos elementos fundamentais do paradigma “full-   stack” JavaScript, permitindo que todas as camadas de um projeto possam ser    desenvolvidas usando apenas essa linguagem.
- Node.js possui uma arquitetura orientada a eventos capaz de operações de    I/O assíncronas.
- Esta escolha de design tem como objetivo otimizar a vazão e    escala de requisições em aplicações web com muitas operações de entrada e    saída (request e response, por exemplo), bem como aplicações web real-time    (como mensageria e jogos).
- Basicamente, ele aliou o poder da comunicação em    rede do Unix com a simplicidade da popular linguagem JavaScript, permitindo    que, rapidamente, milhões de desenvolvedores ao redor do mundo tivessem    proficiência em usar Node.js para construir rápidos e escaláveis webservers sem    se preocupar com threading.
- História do Node.js  Node.js foi originalmente escrito por Ryan Dahl, em 2009, e não foi exatamente    a primeira tentativa de rodar JavaScript no lado do servidor - uma vez que 13    anos antes já havia sido criado o Netscape LiveWire Pro Web.

