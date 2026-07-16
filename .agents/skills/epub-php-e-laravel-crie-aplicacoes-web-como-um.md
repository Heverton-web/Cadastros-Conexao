---
name: epub-php-e-laravel-crie-aplica-es-web-como-um-verd
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Php E Laravel Crie Aplicacoes Web Como Um — Passos Operacionais

Conteudo extraido do livro 'Epub Php E Laravel Crie Aplicacoes Web Como Um'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Gostaria também de agradecer ao Daniel Turini, que sempre influenciou em meu crescimento pessoal e profissional.
- Foi ele quem deu meu primeiro computador e me encaminhou ao mundo da Ciência da computação e recentemente aos diversos projetos em PHP que desenvolvemos juntos.
- Agradeço também às equipes da Caelum, Alura e Casa do Código, que são empresas sensacionais constituídas por profissionais extraordinários.
- Em especial a meus amigos Paulo e Guilherme Silveira, Victor Harada, Maurício Aniche e Luiz Corte Real.   ## Prefácio  Apesar de ser intimamente ligado ao Java, uma outra linguagem de programação, há pouco mais de um ano recebi o desafio de manter a aplicação interna de uma empresa americana, totalmente escrita em PHP.
- No começo, o trabalho foi bem mais difícil do que eu esperava, já que se tratava de um projeto legado, nem um pouco orientado a objetos e muitíssimo complicado de manter.
- Depois de um tempo, vimos que a solução mais simples para esse caso seria reescrever todo o projeto, utilizando boas práticas, testes automatizados e as possibilidades mais atuais da linguagem.
- Eu já havia tido algum contato com esse framework quando estava trabalhando no conteúdo técnico do curso de PHP da Caelum, mas ao estudá-lo a fundo enquanto viabilizava as opções atuais, tive a sensação de que seria uma excelente escolha.
- O objetivo desse livro será mostrar por que o Laravel é a aposta do mercado atual e minha primeira opção de framework MVC em PHP.
- Criar aplicações elegantes em pouco tempo nunca foi tão fácil.  ### Público alvo do livro  Idealmente, o leitor já terá uma pequena base sobre PHP.
- Além disso, conhecer orientação a objetos ajudará bastante a entender a fundo tudo o que estamos construindo.


  - Quem nunca foi criar um projeto novo e acabou copiando a estrutura de algum outro projeto que já tinha criado antes? Isso acontece porque boa parte dessa estrutura será igual, você não precisa reinventar a roda a cada novo projeto. Essa é uma das ideias dos frameworks, oferecer essa estrutura padrão entre os projetos, de forma bem organizada e fácil de manter, segundo as melhores práticas do mercado. Essa reutilização de código entre vários projetos vai lhe poupar muito tempo e trabalho. Precisa conectar com o banco? Enviar um e-mail? Migrar seu banco de dados? Você perceberá que o _Laravel_ , assim como diversos outros frameworks do mercado, já tem tudo isso pronto e pré-configurado.

  - Se o problema estivesse acontecendo no código de nosso controller ou em nossas regras de negócio, bastaria extrair o código repetido pra um arquivo ou classe e pronto, poderíamos reutilizá-la sempre. Que tal se fosse possível fazer o mesmo na view, extraindo toda essa estrutura principal em um único arquivo e reutilizá-lo sempre que quiséssemos? Pois bem, isso não só é possível como também **muito recomendado**. Dessa forma, quando quisermos adicionar algum link, mudar os elementos ou fazer qualquer alteração nessa parte em comum, mudamos em um único lugar, e todo o resto é atualizado. O ganho em manutenibilidade é enorme.

  - Eventualmente surgirá a necessidade de desfazer uma migração, seja por um erro de digitação em algum de seus campos, adicionar alguma informação ou algo do tipo. Se você acabou de executar o comando `migrate` e viu que alguma coisa não saiu como esperado, basta executar um `php artisan migrate:rollback` que a ultima migração será desfeita. Legal, não é? Mas cuidado. Muitas vezes será mais interessante criar uma nova migração com as mudanças, em vez de sair desfazendo as últimas migrações executadas. Lembre-se que, caso alguma informação já tenha sido inserida na tabela, ao fazer _rollback_ ela será perdida.

  - Não se preocupe em entender o `DB:insert` por enquanto, voltaremos a falar sobre esse método muito em breve. O que importa nesse momento é que, em vez de executarmos 3 inserts no banco de dados manualmente, deixamos esse código isolado em uma classe responsável por fazer esse trabalho para nós. O ganho é que, em qualquer ambiente, podemos executar esse _seed_ para inserir alguns dados na tabela de produtos sempre que quisermos. Legal, não é? Só faltam dois detalhes para que o código fique completo. O primeiro é adicionar o _import_ da classe `DB`, assim como fizemos no controller de produtos:

  - Apesar de ser intimamente ligado ao Java, uma outra linguagem de programação, há pouco mais de um ano recebi o desafio de manter a aplicação interna de uma empresa americana, totalmente escrita em PHP. No começo, o trabalho foi bem mais difícil do que eu esperava, já que se tratava de um projeto legado, nem um pouco orientado a objetos e muitíssimo complicado de manter. Depois de um tempo, vimos que a solução mais simples para esse caso seria reescrever todo o projeto, utilizando boas práticas, testes automatizados e as possibilidades mais atuais da linguagem. É aí que entra o Laravel.

  - Durante o livro, vimos um recurso muito atrativo do Laravel, o `Artisan`. Essa ferramenta de linha de comando nos torna ainda mais produtivos, pois cuida de boa parte do código de _boilerplate_. Ao criar um novo modelo, por exemplo, precisamos lembrar de adicionar o _namespace_ , dizer que ele herda de `Model`, adicionar o import para a _superclasse_ etc. Muito trabalho, não é? E é sempre a mesma coisa, só muda o nome da classe. É aí que o **Artisan** entra, um simples comando e pronto, toda essa rotina será feita para nós.
## 2. Principios e Tecnicas
- Apesar disso, é sim possível acompanhar o conteúdo e fazer todos os exercícios sem nunca ter escrito uma linha de código.
- Esse livro não é uma "bíblia" sobre o Laravel, afinal sua documentação e milhares de sites que mencionarei no decorrer da leitura já oferece uma referência completa sobre todas as funcionalidades do framework.
- Diferente disso, veremos de forma prática como resolver problemas do dia a dia e conheceremos os conceitos chave sobre a tecnologia.        ##  Capítulo 1:  Introdução   ###  1.1  O projeto e as tecnologias   Nosso projeto será de controle de estoque.
- Como usuário final, seremos capazes de gerenciar os produtos que serão persistidos em um banco de dados MySQL, visualizar com facilidade os que estão em falta no estoque, e mais.
- O contexto é simples, mas será uma boa base para explorar os poderosos recursos e facilidades que o Laravel oferece.
- Ao final deste livro, teremos uma listagem parecida com:  _Fig. 1.1: Listagem com alguns produtos._          Adição de produtos com validação de dados:  _Fig. 1.2: Adição e validação de produtos._          Autenticação e segurança:  _Fig. 1.3: Formulário de Login da aplicação._          E muito mais, como veremos a seguir.
- Um ponto importante é que o livro não focará apenas nas funcionalidades da aplicação, mas sim nos conceitos e recursos como um todo.
- Envie um e-mail na lista de discussões desse livro que vamos ajudá-lo.
- O endereço é:  <https://groups.google.com/d/forum/livro-laravel>      ---      **Laravel Homestead**  Se preferir, em vez de instalar o PHP, Laravel e todas as suas dependências em sua máquina local, você pode utilizar o _Laravel Homestead_ para preparar o ambiente de uma forma bem simples e elegante em uma máquina virtual.
- O _Homestead_ é uma solução oficial e já inclui PHP 5.6, MySQL, além de diversos outros recursos de que você pode precisar para desenvolver aplicações completas em Laravel.


  - O método `env`, utilizado no arquivo `database.php`, primeiro procura pela configuração definida no arquivo de _environment_ e, caso não encontre, utiliza o segundo valor que passamos. Em outras palavras, se quisermos que o Laravel passe a utilizar as configurações de produção em vez dos valores fixos passados para o arquivo database, tudo o que precisamos fazer é criar um arquivo `.env` com essas configurações. Se você estiver utilizando a versão mais nova do Laravel, ele já existirá. Basta adicionar o conteúdo:

  - Recebemos um `MassAssignmentException`, mas o que isso significa? ::Mass-assignment%% é o nome que se dá para o que estamos fazendo, criando um modelo a partir de um array com uma serie de valores. O problema dessa abordagem é que pode ser muito vulnerável, já que os valores do array vêm da requisição feita no navegador do usuário, que pode enviar o que bem entender. Em outras palavras, um usuário um pouco mais malicioso poderia editar qualquer atributo do modelo que desejasse. Uma falha de segurança grave.

  - Recebemos um `TokenMismatchException`, que acontece sempre que enviamos uma requisição do tipo `POST` sem mandar um parâmetro chamado `_token`. Mas por que isso é necessário? Por padrão, o Laravel tem um mecanismo de proteção contra **CSRF** (_Cross-site request forgery_ , ou falsificação de solicitação entre sites). Esse é um tipo de ataque, bastante conhecido no mundo web, que tira proveito da relação de confiança entre seu usuário legítimo e um aplicativo web. Você pode ler um pouco mais sobre ele aqui:

  - Repare que, quando nosso cliente envia uma requisição pelo navegador, primeiramente temos um arquivo PHP, que é o `routes.php`, que está frente de todos. Ele cuida de atender as requisições e enviá-las para o local correto, no caso os nossos controllers. Os controllers, por sua vez, decidem o que fazer com as requisições, passando pela camada de model (que fazem acesso ao banco, executam as regras de negócio etc.) e logo em seguida delegam pra _view_ que será exibida como resposta no navegador do cliente.
## 3. Aplicacoes Praticas
- Se quiser, você pode ler mais a respeito e ver instrução de instalação e uso em:  <http://laravel.com/docs/homestead>      ---           ###  1.4  Acesse o código desse livro   O código completo do projeto que desenvolveremos no decorrer desse livro está disponível em meu repositório do GitHub.
- Você pode acessá-lo em:  <https://github.com/Turini/estoque-laravel>       ###  1.5  Aproveitando ao máximo o conteúdo   Para tirar um maior proveito dessa leitura, não fique preso à teoria.
- Você pode e deve acompanhar o livro com seu editor favorito aberto, escrevendo todo o código e testes dos capítulos.
- Além disso, eu sempre recomendo que você vá além escrevendo novos testes para solidificar ainda mais o conhecimento.       ###  1.6  Tirando suas dúvidas   Ficou com alguma dúvida?
- Não deixe de me enviar um e-mail.
- A lista de discussão a seguir foi criada exclusivamente para este livro:  <https://groups.google.com/d/forum/livro-laravel>  Essa lista é um canal de comunicação direta comigo e com os demais leitores, portanto fique à vontade para levantar discussões técnicas, apontar correções, indicar melhorias etc.
- Seu feedback é sempre muito bem-vindo.
- Além da lista, não deixe de consultar a documentação do framework durante todo o aprendizado.
- Ela é bem completa e explicativa:  <http://laravel.com/docs/>  Outro recurso que você pode utilizar para esclarecer suas dúvidas e participar ativamente na comunidade é o fórum do GUJ.
- Lá você não só pode perguntar, mas também responder, editar, comentar e assistir a diversas discussões sobre o universo da programação.   <http://www.guj.com.br/>        ##  Capítulo 2:  Novo projeto com Laravel   ###  2.1  Como criar cinco telas de uma aplicação web?

## 4. Topicos Avancados
- Imagine uma aplicação que tenha as funções de adicionar, remover, listar, enviar e-mail, entre diversas outras que são essenciais para toda aplicação web.
- Para cada uma, devemos executar um código de lógica, buscar ou atualizar informações do banco, mostrar um HTML como resposta.
- Bastante coisa repetitiva, não é?
- Será que alguém não pode nos ajudar?       ###  2.2  Framework, pra que te quero?
- Independente da linguagem ou tecnologia que estamos usando, um conceito global é: **não queremos ficar nos preocupando com infraestrutura**.
- É aí que os frameworks entram.
- Eles nos ajudam e muito a agilizar o processo de desenvolvimento, de forma organizada, evitando repetições de código e muito mais.
- Quem nunca foi criar um projeto novo e acabou copiando a estrutura de algum outro projeto que já tinha criado antes?
- Isso acontece porque boa parte dessa estrutura será igual, você não precisa reinventar a roda a cada novo projeto.
- Essa é uma das ideias dos frameworks, oferecer essa estrutura padrão entre os projetos, de forma bem organizada e fácil de manter, segundo as melhores práticas do mercado.

