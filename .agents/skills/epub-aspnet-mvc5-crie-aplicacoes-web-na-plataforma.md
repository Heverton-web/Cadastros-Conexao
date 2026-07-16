---
name: epub-asp-net-mvc5-crie-aplica-es-web-na-plataforma
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Aspnet Mvc5 Crie Aplicacoes Web Na Plataforma — Passos Operacionais

Conteudo extraido do livro 'Epub Aspnet Mvc5 Crie Aplicacoes Web Na Plataforma'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Página 3 Impresso e PDF: 978-85-5519-255-5 EPUB: 978-85-5519-256-2 MOBI: 978-85-5519-257-9 Você pode discutir sobre este livro no Fórum da Casa do Código: http://forum.casadocodigo.com.br/.
- Caso você deseje submeter alguma errata ou sugestão, acesse http://erratas.casadocodigo.com.br.
- ISBN  Página 4 Eu sempre consumi muitos livros de desenvolvimento de software brasileiros.
- Antes de conhecer a Casa do Código, eu tinha uma grande frustação com os livros dedicados ao desenvolvimento de software em português, e até mesmo com alguns internacionais.
- Se você já leu algum livro da Casa do Código, ele é diferente desde a capa e todo seu conteúdo.
- Tem uma abordagem mais moderna e menos ortodoxa do que os outros livros possuem.
- Pois, na minha opinião, livros da área de desenvolvimento de software deveriam ter essa pegada mais leve e gostosa de ler.
- E o que me levou a escrever meu primeiro livro, lançado em 2015 pela Casa do Código, foi a vontade de criar um que eu gostaria de ler.
- Isso quer dizer, com um conteúdo prático, que o leitor pudesse se desenvolver nível a nível sem se frustrar com o que estivesse começando a aprender.
- E o mais importante, na minha opinião, com cenários e problemas comuns do dia a dia do desenvolvedor.


  - Durante o processo de desenvolvimento de uma aplicação que envolve a persistência em base de dados, qualquer mudança em uma classe do modelo deve ser refletida na base de dados. Quando se utiliza o Entity Framework, estas mudanças são identificadas e, dependendo da estratégia de inicialização adotada, pode ocorrer que sua base seja removida e criada novamente, do zero, sem os dados de testes que porventura existam. O Entity Framework oferece o Code First Migration, que possibilita o versionamento da estrutura de uma base de dados que é mapeada por meio de um modelo de classes. Este capítulo apresenta o Code First Migration, que possibilita a atualização dessa base, sem a perda dos dados nela registrados. Também são apresentados os Data Annotations para definir características de propriedades e algumas regras de validação. O jQuery novamente surge, agora com a exibição de mensagens de erro e com validações no lado cliente.

  - A implementação `@Html.ActionLink("Create New", "Create")` faz uso de um _HTML Helper_ (`ActionLink()`) para que seja renderizado um código HTML que representa um link para uma action. A terceira implementação, `@Html.DisplayNameFor(model => model.Nome)`, faz uso de outro _HTML Helper_ (`DisplayNameFor()`) para a definição do título da coluna de dados da tabela que está sendo renderizada. Note que é feito uso de expressão _lambda_ (`model => model.Nome`) para obter um campo do modelo. A quarta e última implementação relevante faz uso de um `foreach` para renderização das linhas da tabela, que representarão as categorias recebidas pela visão.

  - Quando se desenvolve uma aplicação com muitas classes, controladores e visões, torna-se difícil administrar a organização pela forma trivial oferecida pelo ASP.NET MVC, pois todos os controladores ficam em uma única pasta, assim como os modelos e as visões. Para minimizar este problema, o framework oferece `Areas`. Elas podem ser vistas em submodelos, onde ficam, de maneira mais organizada, seus controladores, modelos e visões. O conceito Modelo para Visões também é apresentado. O capítulo se dedica ainda ao processo de autenticação e autorização de usuários ─ um requisito necessário para o controle de acesso para qualquer aplicação.

  - As classes identificadas no modelo de negócio de uma aplicação não são isoladas umas das outras. Muitas vezes elas se associam entre si, o que permite a comunicação no sistema. Saber que uma classe se associa a outra quer dizer também que elas podem depender uma da outra. Em um processo, como uma venda, por exemplo, existe a necessidade de saber quem é o cliente, o vendedor e os produtos que são adquiridos. Este capítulo trabalha a associação entre duas classes, o que dará subsídios para aplicar estes conhecimentos em outras aplicações. Também são trazidos controles que permitem a escolha de objetos para gerar a associação.

  - Faremos uso de painéis do Bootstrap. Um painel pode ter até três componentes: cabeçalho (`panel-heading`), corpo (`panel-body`) e rodapé (`panel-footer`). Estes (cada um em uma `<div>`) estão encapsulados por outra `<div>`, que define o `panel`. Verifique que, na definição do painel, definimos também a cor para ele (`panel-primary`), que refletirá no cabeçalho e, para o rodapé, temos a cor `panel-info`. Tudo por meio de classes CSS. Verifique, no rodapé do painel, que o link para registrar um novo fabricante será gerado com um estilo CSS, que dá a ele a aparência de um botão (`new { @class = "btn btn-success" }`).

  - Em uma aplicação web, o uso de layouts comuns para um número significativo de páginas é normal. Um portal, visto como um sistema, uma aplicação, normalmente é divido em setores, e cada um pode ter seu padrão de layout, e o ASP.NET possui recursos para esta característica. Este capítulo apresenta também o Bootstrap, que é um componente que possui recursos para facilitar o desenvolvimento de páginas web, por meio de CSS. O capítulo termina com a apresentação de um controle JavaScript, que é o jQuery DataTable, onde um conjunto de dados é renderizado em uma tabela com recursos para busca e classificação.
## 2. Principios e Tecnicas
- Este livro é para quem está começando a se aventurar no maravilhoso mundo do desenvolvimento de software e quer começar a trabalhar com um banco de dados.
- Este livro é para quem á conhece SQL e quer se aperfeiçoar na utilização de um gerenciador de banco de dados.
- Este livro também é para quem conhece o PostgreSQL e quer construir um projeto utilizando-o.
- Do começo ao fim, vamos desenvolver um projeto que pode ser aplicado na prática.
- Em cada exemplo, busquei aplicar problemas PREFÁCIO ESCREVENDO O LIVRO QUE EU GOSTARIA DE LER  Página 5 comuns do dia de um desenvolvedor.
- O código-fonte de todos os códigos gerados durante o nosso projeto neste livro estão disponíveis em meu repositório no GitHub.
- Lá você vai encontrá-los separados por capítulos. https://github.com/viniciuscdes/postgresql_codigos Feedback é muito importante para todos os profissionais.
- Após lançar meu primeiro livro, tive muitos feedbacks positivos e muitos que trouxeram oportunidades de melhoria que pude aplicar neste meu segundo livro.
- Será um imenso prazer para mim saber o que você tem a dizer sobre este meu trabalho.
- Você pode enviar sua dúvida ou feedback para o e-mail a seguir: viniciuscdes@gmail.com Se preferir, pode acessar meu site pessoal também.


  - Já em relação à sua multiplicidade, ela é um, pois cada `Produto` está associado a apenas um `Fabricante` e a apenas uma `Categoria`. Mas e como fica a associação de `Categoria` e `Fabricante` para `Produto`? Bem, uma `Categoria` pode ter vários `Produto`s e um `Fabricante` produz diversos `Produto`s. Com isso, já identificamos a multiplicidade de muitos (ou um para muitos), mas não temos ainda a navegabilidade. Ou seja, de uma `Categoria` ou `Fabricante`, não é possível identificar quais produtos pertencem a uma `Categoria` ou quais `Produtos` um `Fabricante` produz diversos `Produtos`.

  - > A escolha da interface `ICollection` para uma propriedade se deve ao fato de que, com esta interface, seja possível iterar (navegar) nos objetos recuperados e modificá-los. Existe ainda a possibilidade de utilizar `IEnumerable` apenas para navegar, e `IList` quando precisar de recursos a mais, como uma classificação dos elementos. Veja o artigo _List vs IEnumerable vs IQueryable vs ICollection vs IDictionary_ , em <http://www.codeproject.com/Articles/832189/List-vs-IEnumerable-vs-IQueryable-vs-ICollection-v>, pois é interessante este conhecimento.

  - O livro teve seus três capítulos iniciais como introdutórios, apresentação do ASP.NET MVC 5, do Entity Framework e do Bootstrap, dando a você subsídios para a criação de pequenas aplicações. Os três seguintes capítulos trouxeram recursos adicionais, como associações, uma arquitetura para suas futuras aplicações e personalização de propriedades das classes de modelo. O livro finalizou, com seus dois últimos capítulos, apresentando técnicas e recursos para o controle de acesso de usuários à aplicação, uploads, downloads e tratamento de erros.

  - Estes dois pontos estão diretamente ligados a **acoplamento** e **coesão**. O acoplamento trata da independência dos componentes interligados e, em nosso caso, a independência é zero, pois está tudo em um único projeto. Desta maneira, temos um forte acoplamento. Já na coesão, que busca medir um componente individualmente, temos as classes controladoras, que, em nosso caso, desempenham muitas funções, pois validam os dados, trabalham a persistência e ainda geram a comunicação com a visão. Com isso, temos uma baixa coesão em nossa aplicação.
## 3. Aplicacoes Praticas
- Lá você encontrará todas as minhas redes sociais e contatos. http://www.viniciuscdes.net CÓDIGO-FONTE ENVIE SEU FEEDBACK  Página 7 Quando lancei meu primeiro livro, uma das primeiras coisas que eu fiz foi ir até a faculdade na qual me formei para doá-lo à biblioteca da instituição através das mãos de uma professora, a qual também foi minha orientadora.
- Este ato singelo foi um pequeno gesto para demonstrar a minha gratidão por aqueles que se dedicam a compartilhar seu conhecimento todos os dias com centenas de pessoas durante todos os anos de sua vida.
- Desde o primeiro dia que entrei na faculdade, sempre tive em minha mente que os melhores amigos que eu poderia fazer seriam os professores.
- Isso porque sabia que eles estavam dispostos a ensinar todos os dias e, de vez em quando, eu também conseguia compartilhar o que eu sabia e também ensiná-los.
- Durante a minha faculdade, sempre busquei essa troca de conhecimento que aquele ambiente nos proporciona.
- Com os professores, desde de pequeno, aprendi que compartilhar conhecimento nunca é demais.
- E cada vez que você compartilha algo, você aprende muito mais.
- Eu sempre fui inquieto e me perguntei como estou compartilhando o que aprendi durante todos esses anos, e como eu vou deixar para as outras pessoas esse conhecimento.
- Foi então que surgiu a grande vontade de escrever um livro.
- Então, dedico este livro a todos os professores que eu tive durante todos esses anos de vida.

## 4. Topicos Avancados
- Acredito que uma das grandes realizações de um professor é saber como estão os alunos que passaram por suas turmas.
- Ser professor é algo, muitas vezes, estressante.
- É uma dedicação diária em tentar fazer a diferença em uma sala de aula.
- AGRADECIMENTO  Página 8 Só gostaria de deixar registrado que vocês fizeram a diferença em minha vida.
- Sempre que encontro um professor antigo, tento passar essa mensagem.
- Creio que sirva de incentivo para que eles continuem se dedicando e que o trabalho que eles desenvolvem não é em vão.
- Gostaria de agradecer aos meus primeiros professores.
- Minha mãe, Juraci, meu pai, Nelson, e meus irmãos, Anderson, Judson e Nelson Jr.
- Além de serem professores das minhas primeiras palavras, são os de meu caráter.
- E não poderia de deixar de agradecer minha esposa, Thais, pelo incentivo em todos os meus projetos.

