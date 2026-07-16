---
name: epub-aplica-es-java-para-a-web-com-jsf-e-jpa
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Aplicacoes Java Para A Web Com Jsf E Jpa — Passos Operacionais

Conteudo extraido do livro 'Epub Aplicacoes Java Para A Web Com Jsf E Jpa'. Contem passos, tecnicas e principios baseados na obra original.

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


  - Não seria um absurdo se todo mês fosse cobrada uma taxa fixa de trezentos reais de energia elétrica, independente do uso ? Entretanto, quando se paga por um serviço de hospedagem, é exatamente o que acontece, pois o site fica no ar, independente do uso dos recursos por uma quantia mensal fixa. Para mudar esse cenário, surgiu o conceito de cloud computing (computação em nuvem), segundo o qual os serviços são pagos pelo uso, proporcionando inúmeras vantagens: toda a parte de infraestrutura (rede, armazenamento de arquivos, banco de dados, segurança) é de responsabilidade da prestadora de serviços, e o crescimento do uso de serviços é pago proporcionalmente, o que, em termos de custo, é uma excelente opção.

  - Esse aviso significa que o site que estamos visitando não é garantido por uma unidade certificadora, como por exemplo a empresa Verisign. Para adiquirir um certificado digital, é preciso pagar para essas empresas, que funcionam semelhantes a cartórios virtuais, elas asseguram que o site que está sendo acessado é realmente da empresa que ele representa. Quando um certificado é assinado localmente (como no nosso caso), o site funciona, apenas exibindo um aviso. No caso do Google Chrome, o https aparece riscado em vermelho, como mostra a figura 8.2.

  - No capítulo [4](index_split_007.html#publicando) publicamos uma aplicação básica (<http://play-capitulo4.herokuapp.com/>), e usaremos agora uma URL diferente para refletir a aplicação completa (<http://top100filmescult.herokuapp.com/>). Depois de cadastrados os dados iniciais, devemos informar um e-mail de contato e o domínio no qual a aplicação funcionará. Será necessário cadastrar um domínio diferente, por exemplo <seu-usuario-no-Heroku>-top100filmescult.herokuapp.com, semelhante à figura 7.2.

  - Existe outra diferença interessante : as aplicações criadas até o Play 2.2 necessitam de uma instalação do Play para funcionar, já as aplicações criadas com o Activador (Play 2.3+) são "auto-suficientes", não tem dependência externa... é possível rodar a mesma aplicação em outra máquina apenas copiando o diretório e mais nada, isso é algo positivo que aumenta a flexibilidade, principalmente quando se trabalha com diferentes ambientes ( desenvolvimento, homologação e produção).

  - O Play é um framework que redefine o desenvolvimento web em Java. O seu foco é o divertido desenvolvimento no qual a interface HTTP é algo simples, flexível e poderoso, sendo uma alternativa limpa para as opções Enterprise Java infladas. Ele foca na produtividade do desenvolvedor para as arquiteturas RESTful, e sua vantagem em relação às linguagens e frameworks não Java, como Rails e PHP, é que ele usufriu de todo o poder da Java Virtual Machine (JVM).

  - Para cada restart do servidor do Play, o seu banco de dados será limpo novamente. No início do desenvolvimento de um cadastro, isso não é um problema, mas chega um momento em que o sistema necessita de um cadastro mínimo já no banco de dados para funcionar de maneira adequada. Criar um cadastro de filmes em que é preciso cadastrar os diretores toda vez é inviável. Por esse motivo precisamos ter essas informações pré-cadastradas em um repositório.
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


  - Escolhendo a opção _Hobby Dev_ e associada à aplicação recém-criada, teremos uma aplicação gratuita com o banco de dados PostgreSQL disponível com suporte a 20 conexões simultâneas e tabelas com no máximo 10.000 linhas (figura 4.4). O Heroku trabalha preferencialmente com PostgreSQL, mas oferece também outras opções como MySQL, MongoDB, Neo4J; é preciso consultar no site os planos existentes, mas a maioria deles oferece um gratuito de teste.

  - As redes sociais são essenciais para a divulgação do site e seus serviços. Vamos integrar o nosso site ao Facebook de duas maneiras, primeiramente utilizando a API nativa disponibilizada para os desenvolvedores, e depois utilizando um plugin do Play para conectar a várias redes sociais: Twitter, GitHub, Google, LinkedIn, Foursquare, Instagram, VK (rede social russa semelhante ao Facebook) e XING (rede social semelhante ao LinkedIn).

  - Devemos preencher as informações da aplicação, como mostra a figura 7.1. As informações são simples: o primeiro campo é o nome do aplicativo, o segundo é o namespace (se desejar ter uma URL <http://apps.facebook.com/namespace>), e finalmente, o terceiro é para classificar sua categoria. No exemplo usamos a categoria de `Diversão`, mas se fosse um aplicativo de tênis, para exemplificar, a categoria adequada seria `Esporte` .

  - Felizmente, utilizando o plugin Secure Social (<http://securesocial.ws>) conseguiremos com poucos ajustes fazer essa integração no nosso site de filmes. O Secure Social é um módulo de autenticação do Play Framework que suporta os protocolos mais usados do mercado: OAuth, OAuth2, OpenID, usuário/senha e proporciona algumas informações dos usuários autenticados, como nome, sobrenome, nome completo e e-mail.
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

