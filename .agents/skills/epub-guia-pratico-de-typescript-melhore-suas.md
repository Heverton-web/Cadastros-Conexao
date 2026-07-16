---
name: epub-guia-pr-tico-de-typescript-melhore-suas-aplic
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Guia Pratico De Typescript Melhore Suas — Passos Operacionais

Conteudo extraido do livro 'Epub Guia Pratico De Typescript Melhore Suas'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- According to GitHub, it is the most popular language in the world (yes, used even more than Python), and the new features in ES6+ continue to add useful capabilities.
- However, for large application development, its feature set is considered to be incomplete.
- This is why TypeScript was created.
- In this chapter, we'll learn about the TypeScript language, why it was created, and what value it provides to JavaScript developers.
- We'll learn about the design philosophy Microsoft used in creating TypeScript and why these design decisions added important support in the language for large application development.
- We'll also see how TypeScript enhances and improves upon JavaScript.
- We'll compare and contrast the JavaScript way of writing code with TypeScript.
- TypeScript has a wealth of cutting-edge features to benefit developers.
- Chief among them are static typing and **Object-Oriented Programming** (**OOP**) capabilities.
- These features can make for code that is higher quality and easier to maintain.


  - "texto" : "No episódio dessa terça-feira, 25, o jurado Erick Jacquin surpreendeu a todos ao participar do MasterChef Brasil com muita pompa e estilo. O chef de cozinha apostou em um terno azul ciano e pantufas! O detalhe não passou desapercebido por Ana Paula Padrão, mas essa não é a primeira vez que o francês chama atenção por seus looks. Por isso, o Portal da Band separou 10 fotos que provam que Jacquin é um dos caras mais estilosos que nós conhecemos.",

  - As nossas controllers são responsáveis por receber todas as requisições dos nossos usuários, se comunicando com as outras camadas do nosso projeto e retornando o que o usuário precisa. Na nossa API, as controllers estão acessando o nosso banco de dados através dos nossos serviços e retornando os dados conforme a requisição do usuário. Mas isso não é uma regra, nós podemos ter outras controllers com outras responsabilidades, como o upload de um arquivo.

  - Note que temos duas novas palavras reservadas no trecho em `NewsService`, a `async` e a `await`. Para quem não as conhece, quando declaramos uma função com `async`, estamos passando que essa função é assíncrona e que ela não deve bloquear o segmento principal do nosso código. A palavra `await` é utilizada dentro de uma função `async`, então adicioná-la faz com que o fluxo da função assíncrona não seja interrompido esperando pelo retorno da função.

  - Para quem está tendo o seu primeiro contato com _padrão de projetos_ (Design Patterns) neste livro, um padrão de projeto ou padrão de desenho é uma solução geral para um problema que ocorre com frequência dentro de um determinado contexto no desenvolvimento de software. Caso você tenha interesse em saber mais sobre esse assunto, eu recomendo a leitura do seguinte link: <https://pt.wikipedia.org/wiki/Padr%C3%A3o_de_projeto_de_software>.

  - Um ponto importante de se destacar nesse momento é que à versão _3.4_ do TypeScript foi adicionada uma funcionalidade chamada `Incremental flag`, que pode ser utilizada no seu compilador. Essa nova funcionalidade salva as últimas alterações do compilador, fazendo com que ele seja mais rápido no momento de desenvolvimento. Para utilizar essa funcionalidade, basta adicioná-la dentro de `compilerOptions` no seu arquivo `tsconfig.json`.

  - Um decorator de `parameter` deve ser declarado antes da declaração de um parâmetro e recebe três parâmetros. O primeiro, como na maioria dos decorators que já vimos, é o `target`, que é o protótipo da classe. O segundo é o `propertyKey`, que é o nome do método que contém o parâmetro com o qual estamos trabalhando. O último é o `parameterIndex`, que é o número da posição do parâmetro na função, lembrando que começa a partir do `0`.
## 2. Principios e Tecnicas
- By the end of this chapter, you will understand some of the limitations of JavaScript that make it difficult to use in large projects.
- You will also understand how TypeScript fills in some of those gaps and makes writing large, complex applications easier and less prone to error.
- In this chapter, we're going to cover the following main topics:    * What is TypeScript?   * Why is TypeScript necessary?    # Technical requirements  In order to take full advantage of this chapter, you should have a basic understanding of JavaScript version ES5 or higher and some experience with building web applications with a JavaScript framework.
- You'll also need to install Node and a JavaScript code editor, such as **Visual Studio Code** (**VSCode**).
- You can find the GitHub repository for this chapter at <https://github.com/PacktPublishing/Full-Stack-React-TypeScript-and-Node>.
- Use the code in the **Chap1** folder.  # What is TypeScript?
- TypeScript is actually two distinct but related technologies – a language and a compiler:     * The language is a feature-rich, statically typed programming language that adds true object-oriented capabilities to JavaScript.    * The compiler converts TypeScript code into native JavaScript, but also provides the programmer with assistance in writing code with fewer errors.
- TypeScript enables the developer to design software that's of a higher quality.
- The combination of the language and the compiler enhances the developer's capabilities.
- By using TypeScript, a developer can write code that is easier to understand and refactor and contains fewer bugs.


  - Além dos tipos primitivos, que abordamos no segundo capítulo deste livro, o TypeScript permite que tipos complexos, como funções e objetos sejam definidos e usados como restrições de tipo. Assim como os objetos literais são a raiz da definição de objeto em JavaScript, os tipos literais de objeto são as definições de um tipo de objeto no TypeScript. Em sua forma mais básica, parece muito com um objeto literal do JavaScript.

  - Dando continuidade ao desenvolvimento do nosso projeto, para validar se todos pacotes foram importados corretamente, abra o seu arquivo `package.json` e observe se ele tem duas novas propriedades: uma chamada `dependencies`, para os pacotes `JavaScript` que foram importados na primeira linha com `--save`, e outra chamada `devDependencies`, para as interfaces TypeScript que foram importadas utilizando o sufixo `--save-dev`.

  - Como os namespaces, os _modules_ no TypeScript nos ajudam a organizar o nosso código separando as nossas classes. Eles utilizam o mesmo conceito dos namespaces com a utilização da palavra reservada `export`, mas com algumas diferenças: para que possamos trabalhar com eles, nós precisamos de um `module loader` e, para chamar um `module` de um outro arquivo, nós precisamos utilizar a palavra reservada `import`.

  - Mas antes, nós precisamos inserir alguns registros no nosso banco de dados, para que possamos retornar às nossas pesquisas. Abra o seu `Robo 3T`, acesse o seu servidor `localhost` e vá até a sua base de dados `db_portal`. Clique em _Collections_ , clique com o botão direito do seu mouse em _news_ e em _Insert Document_. Em seguida, cole o seguinte trecho de código na modal e clique em _save_.
## 3. Aplicacoes Praticas
- Additionally, it adds discipline to the development workflow by forcing errors to be fixed while still in development.
- TypeScript is a development-time technology.
- There is no runtime component and no TypeScript code ever runs on any machine.
- Instead, the TypeScript compiler converts TypeScript into JavaScript and that code is then deployed and run on browsers or servers.
- It's possible that Microsoft considered developing a runtime for TypeScript.
- However, unlike the operating system market, Microsoft does not control the ECMAScript standards body (the group that decides what will be in each version of JavaScript).
- So, getting buy-in from that group would have been difficult and time-consuming.
- Instead, Microsoft decided to create a tool that enhances a JavaScript developer's productivity and code quality.
- So then, if TypeScript has no runtime, how do developers get running code?
- TypeScript uses a process called transpilation. **Transpilation** is a method where code from one language is "compiled" or converted into another language.

## 4. Topicos Avancados
- What this means is that all TypeScript code ultimately is converted into JavaScript code before it is finally deployed and run.
- In this section, we've learned what TypeScript is and how it works.
- In the next section, we'll learn about why these features are necessary for building large, complex applications.  # Why is TypeScript necessary?
- The JavaScript programming language was created by Brendan Eich and was added to the Netscape browser in 1995.
- Since that time, JavaScript has enjoyed enormous success and is now used to build server and desktop apps as well.
- However, this popularity and ubiquity have turned out to be a problem as well as a benefit.
- As larger and larger apps have been created, developers have started to notice the limitations of the language.
- Large application development has greater needs than the browser development JavaScript was first created for.
- At a high level, almost all large application development languages, such as Java, C++, C#, and so on, provide static typing and OOP capabilities.
- In this section, we'll go over the advantages of static typing over JavaScript's dynamic typing.

