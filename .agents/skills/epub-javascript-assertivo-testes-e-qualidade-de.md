---
name: epub-javascript-assertivo-testes-e-qualidade-de-c-
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Javascript Assertivo Testes E Qualidade De — Passos Operacionais

Conteudo extraido do livro 'Epub Javascript Assertivo Testes E Qualidade De'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Não posso fazer dedicações sem começar pelo meu irmão Sérgio Luiz, por ser sempre a maior referência que eu poderia ter, um espelho de ser humano, de profissional e de conhecimento.
- À minha companheira Anna, por estar sempre ao meu lado desde o início, tanto figurativamente quanto literalmente.
- Aos meus pais Lilian Cristina e Sérgio Luiz, tia Leila, tio Luciano e avó Elizabeth, por toda a base e qualquer construção que me transformaram na pessoa que eu sou hoje.
- Aos meus amigos de tecnologia com os quais eu tenho a honra de aprender diariamente.
- Evito citar nomes para não esquecer ninguém, mas vocês sabem da importância e do impacto que possuem no código que eu escrevo.
- Às alunas e aos alunos que tive e tenho o imenso prazer de conhecer nos projetos de que faço parte, pessoas com as quais eu, com certeza, aprendo muito mais do que ensino.
- Não existiria um caractere neste livro se não fosse por essas pessoas.
- Nas páginas a seguir, tem um pedacinho de cada um de vocês.  > “I find your lack of tests disturbing.” - **Vader** , 1977.
- Lord Sith   # Prefácio por Willian Justen  Toda operação é sujeita a falhas, desde a criação de uma aplicação web até uma fábrica de criação de peças para carros.
- E essas falhas podem custar desde algumas dezenas de milhares de reais até milhões!


  - Como **estado** está muito ligado aos dados representados em tela e a sua visualização como componente de interface, muitas vezes escrever componentes que possuem estado de forma reutilizável pode ser uma tarefa ligeiramente mais complexa. A ideia de um gerenciador de estados global é, justamente, manter toda essa camada de dados desatrelada do componente em si. Dessa forma, é possível criar uma abstração onde os dados ficam armazenados (`store`) e, através de ações devidamente mapeadas (`actions`), novos valores de estados são gerados (através de `reducers`). Os componentes que necessitam desses valores simplesmente conectam-se a essa abstração, que armazena tudo globalmente, e, dada alguma mudança, realizam suas determinadas re-renderizações.

  - Ufa, bastante coisa! Mas agora, nosso teste corresponde exatamente ao funcionamento do nosso componente. Existem várias funções e utilitários de temporizadores do Jest, mas, para o nosso caso, a função `advanceTimersByTime` serviu muito bem. É possível rodar todos os timers com a função `jest.runAllTimers()`, ou rodar só os timers pendentes com a função `jest.runOnlyPendingTimers()` e algumas outras. Caso tenha interesse ou necessidade, você pode dar uma olhada na documentação oficial (<https://jestjs.io/docs/pt-BR/timer-mocks>). Você pode inserir a função `waitTimersByTime`, que fizemos no arquivo `testUtils`, caso queira manter a organização dos utilitários e se houver a necessidade de reutilizá-la.

  - Essa aplicação está utilizando os ESModules, então foi necessária uma pequena configuração para que os testes funcionassem corretamente. Foi necessário instalar um pacote chamado **Babel** (<https://babeljs.io/>), que é basicamente um "compilador" de JavaScript, que permite que utilizemos algumas funcionalidades mais modernas do JS e que se encarrega de compilar esse código mais "moderno" para uma versão mais "antiga". Além disso, foi instalado um pacote chamado `babel-jest`, que atua como a "ponte" entre o Babel, o Jest e um plugin do próprio Babel que converte os ESModules para CommonJS ao ser executado. Todos esses pacotes estão no `package.json`, na parte de `devDependencies`.

  - Vamos testar o primeiro cenário, onde o usuário é encontrado. Para isso, vamos criar nosso primeiro caso de teste e também dois objetos que simularão `req` e `res`. O objeto `req` deverá conter um campo `username` e outro `password` dentro de `body`, enquanto o objeto `res` deverá conter as funções `json` e `cookie`, que serão as funções de mock padrão do Jest. O único detalhe é que, como algumas chamadas dessas funções são encadeadas (como `res.status().json()`), precisamos lembrar de retornar o objeto `res` de cada uma delas. Como vamos utilizar Promises, vamos lembrar de colocar `async` na assinatura da função de teste também. Podemos fazer tudo isso da seguinte forma:

  - Eu estou na área há muitos anos e tenho orgulho de dizer que fui um dos primeiros a falar mais sobre testes de software no Brasil, principalmente na área de front-end, tendo já escrito sobre o assunto no meu blog, palestrado sobre o tema em diversos eventos e criado um dos poucos cursos de JavaScript focado em testes desde o início. Recebi com muita alegria o convite do Gabriel para escrever este prefácio, pois, além de ser sobre um tema que amo, já sabia de antemão que seria um livro rico em detalhes e muito bem escrito, como tudo o que ele se dispõe a fazer. Mas posso dizer que ele superou minhas expectativas e espero que surpreenda você também.

  - Durante a leitura, você vai aprender que existem diferentes tipos de testes, desde os que testam pequenos pedaços da aplicação, conhecidos como testes unitários, até testes que juntam diferentes pedaços do software e analisam se eles continuam funcionando em harmonia, que são os testes de integração. Além desses, você também verá alguns não tão falados, mas não menos importantes, como os testes de carga. E não se engane, apesar de técnico, o livro também abre espaço para a prática, onde cada assunto discutido é acompanhado da criação de pequenas e diferentes aplicações, permitindo que você experimente e aprenda praticando junto do livro.
## 2. Principios e Tecnicas
- Na programação, nós demos o apelido carinhoso de "_bug_ " para essas falhas.
- E assim como a área de desenvolvimento é bem diversa, esses erros também podem ser, e serão, bem diferentes, seja um botão que não executa nenhuma ação ao ser clicado ou um relatório gerado com valores errados, causando uma completa confusão para os seus clientes.
- Alguns dados interessantes para entendermos as dimensões dos problemas que bugs podem causar:    * Em outubro de 2018 e março de 2019 aconteceram dois acidentes fatais envolvendo o modelo de avião Boeing 737 Max.
- Depois de uma extensa análise, foi descoberto que ambos os acidentes foram causados por uma falha em um software chamado _Mcas_ , que impediu que os pilotos pudessem alterar o ângulo de inclinação da aeronave.   * Entre 2018 e 2019, a Nissan precisou fazer um recall de mais de 1 milhão de carros, pois o software da câmera de ré não resetava as configurações toda vez que o usuário iniciava a ré.   * Em outubro de 1999, uma nave espacial da NASA estimada em 125 milhões de dólares foi perdida no espaço devido a um erro de conversão de dados!
- O software utilizou os dados com o sistema de medidas americano em vez do sistema métrico, deixando a espaçonave fora de órbita.
- Você talvez esteja pensando: "Mas por que isso me importa?
- Mas todos esses dados foram apresentados apenas para mostrar como falhas em software podem causar enormes danos.
- E não, essas coisas não acontecem somente em empresas enormes, mas até no e-commerce do _Seu Zé_ da papelaria da esquina.
- Pensando nessas falhas, nós precisamos estar preparados para eliminá-las antes mesmo de chegarem ao usuário final.
- Sendo assim, a melhor forma é testar sua aplicação e testar bastante.


  - Vamos lembrar o cenário dos componentes da aplicação de front-end. Para cada componente, tivemos que criar um novo arquivo com o padrão `[componente].unit.js` dentro `__tests__/components`. Se esses testes ficassem dentro dos diretórios dos próprios componentes (junto aos arquivos de definição, estilos e stories), o desenvolvimento dessa aplicação no dia a dia seria um pouco mais prático, já que cada pasta de cada componente conteria todos os seus arquivos relacionados. Mas, para quem acompanha o material do livro é muito mais fácil, ao clonar o projeto, apagar somente uma pasta do que apagar diversos arquivos em pastas separadas.

  - As funções restantes desse arquivo são apenas reexportações das funções de storage, então não precisamos nos preocupar em testá-las agora. Deixo como desafio desta parte para você fazer os testes do cliente que realiza as requisições relacionadas aos perfis de usuários, dentro da pasta `clients/http/profiles`. A lógica será exatamente a mesma que fizemos até aqui. Após isso, o arquivo `clients/http/storage` possui algumas funções bem simples de serem testadas e que também seguem a mesma lógica de injeção de dependência para os clientes de storage, que são objetos um pouco mais trabalhosos de se ficar fazendo mock e atualizando.

  - Agora só precisamos disparar um evento de click nesse botão. Podemos fazer isso através do utilitário `fireEvent`, disponível no próprio pacote da `@testing-library/react`, ou importando um outro pacote chamado `@testing-library/user-event`, que também já está instalado. Ambos funcionam perfeitamente, a questão é que a biblioteca `user-event` simula alguns eventos de forma mais completa, já que um evento no DOM pode ser composto por vários outros eventos relacionados e também pode ser disparado junto a esses outros eventos. Ela realiza esse agrupamento de forma mais uniforme a um usuário interagindo com nosso componente.

  - Pelo fato de o TS ser uma camada em cima do JS (ou _superset_) e adicionar essas novas funcionalidades, boa parte delas não está presente (e muito provavelmente nem estarão no futuro) na linguagem JavaScript por si só. Isso exige todo um trabalho de configuração de _build_ (etapa que compilará o código TS para JS) e ajuste conforme as necessidades do projeto. Isso é necessário na grande maioria das aplicações tradicionais que rodarão em um navegador ou em Node e que são escritas com TypeScript, sem contemplar o Deno (<https://deno.land/>), o _runtime_ que permite a execução de código TS lançado recentemente.
## 3. Aplicacoes Praticas
- O problema é que testar todas as possibilidades nos toma tempo e, quanto maior a aplicação vai ficando, mais coisas podem ficar para trás e, assim, mais falhas podem ir aparecendo sem que nós possamos perceber.
- Outro grande problema do teste manual é que nós humanos também somos muito suscetíveis a falhas, ou seja, além das possíveis falhas de software, teremos que somar as falhas humanas.
- Diante dessas dificuldades e problemas é que nasceram os testes automatizados de software, que são códigos testando outros códigos.
- Parece ser muito complicada essa metalinguagem e é um pouco difícil de se entender os conceitos mesmo, mas não se sinta mal se algumas coisas não se encaixarem automaticamente na sua cabeça.
- O que posso dizer seguramente é que este livro ajudará muito nos seus primeiros passos com os testes e, mesmo que você já tenha escrito testes antes, este livro vai ajudar você a escrevê-los melhor e a ter uma visão mais ampla em diferentes situações.
- Eu estou na área há muitos anos e tenho orgulho de dizer que fui um dos primeiros a falar mais sobre testes de software no Brasil, principalmente na área de front-end, tendo já escrito sobre o assunto no meu blog, palestrado sobre o tema em diversos eventos e criado um dos poucos cursos de JavaScript focado em testes desde o início.
- Recebi com muita alegria o convite do Gabriel para escrever este prefácio, pois, além de ser sobre um tema que amo, já sabia de antemão que seria um livro rico em detalhes e muito bem escrito, como tudo o que ele se dispõe a fazer.
- Mas posso dizer que ele superou minhas expectativas e espero que surpreenda você também.
- Durante a leitura, você vai aprender que existem diferentes tipos de testes, desde os que testam pequenos pedaços da aplicação, conhecidos como testes unitários, até testes que juntam diferentes pedaços do software e analisam se eles continuam funcionando em harmonia, que são os testes de integração.
- Além desses, você também verá alguns não tão falados, mas não menos importantes, como os testes de carga.

## 4. Topicos Avancados
- E não se engane, apesar de técnico, o livro também abre espaço para a prática, onde cada assunto discutido é acompanhado da criação de pequenas e diferentes aplicações, permitindo que você experimente e aprenda praticando junto do livro.
- Tenha uma boa leitura e que suas próximas aplicações sejam mais seguras, confiáveis e com a qualidade que só os testes automatizados podem nos dar!   # Sobre o autor  Figura -1.1: Gabriel Ramos.
- Gabriel Ramos é pintor de pixel, ou desenvolvedor, como algumas pessoas preferem chamar, mentor na Laboratória e instrutor na Caelum.
- Já passou por empresas de diversos tamanhos e segmentos: de e-commerces e companhias mais consolidadas a startups unicórnios com produtos emergentes.
- Na grande maioria das experiências, teve contato com tudo o que envolve o ecossistema JavaScript, desde aplicações front-end a ferramentas e back-end em NodeJS.
- Hoje possui uma graduação mais tradicional, mas trabalhou por anos sem uma formação superior e, embora acredite que bases acadêmicas conseguem suprir algumas deficiências de conhecimentos computacionais (principalmente teóricas), é um forte defensor das diversas formas de aprendizagem e tem como princípio que o estudo, acima de tudo, deve ser encorajado, independente de sua forma.
- Mantém um blog pessoal <https://gabrieluizramos.com.br/> no qual fala sobre diversos assuntos de tecnologia e, fora isso, também é apaixonado por fotografia, hobby que mantém com muito carinho disponibilizando suas fotos para uso gratuitamente.   # Todo mundo na mesma página  ### A quem se destina este livro  Este livro é para qualquer pessoa que queira se aprofundar em testes ou melhorar seus fundamentos no assunto.
- É necessário um conhecimento prévio de JavaScript, porém, se você tem familiaridade com qualquer outra linguagem, não sentirá dificuldades em consumir este conteúdo.  ### Requisitos e configuração de ambiente local  Para facilitar o entendimento dos assuntos abordados aqui, é interessante que tenhamos um certo ambiente e algumas ferramentas instaladas em nossos computadores.
- Embora o livro aborde JavaScript, o foco será o desenvolvimento de testes e não as funcionalidades da linguagem por si só.  ## Sobre o projeto e as aplicações desenvolvidas  Realizaremos os testes em cima de um grande projeto com um objetivo único: permitir operações de `CRUD` (ou seja, `criar`, `ler`, `atualizar` e `deletar`) para usuários em um arquivo simulando uma base de dados.
- Além disso, ao longo dos capítulos, trabalharemos com várias camadas diferentes de aplicações, para que possamos abordar diversas peculiaridades e aspectos dos mais variados tipos de testes.

