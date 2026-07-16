---
name: epub-desenvolvimento-web-com-php-e-mysql
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Desenvolvimento Web Com Php E Mysql — Passos Operacionais

Conteudo extraido do livro 'Epub Desenvolvimento Web Com Php E Mysql'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Introdução](01-introducao.html)   * [2\.
- Instalando o PHP](02-instalando-o-php.html)   * [3\.
- O primeiro programa em PHP](03-primeiro-programa-php.html)   * [4\.
- Construindo um calendário com PHP](04-construindo-um-calendario-com-php.html)   * [5\.
- Recebendo dados de formulários com PHP](05-lista-tarefas-entrada-de-dados.html)   * [6\.
- Tratamento de diferentes campos de formulários](06-lista-tarefas-mais-dados.html)   * [7\.
- Acessando e usando um banco de dados](07-lista-tarefas-cadastro-no-banco.html)   * [8\.
- Integrando PHP com o banco de dados MySQL](08-lista-tarefas-integracao-banco.html)   * [9\.
- Edição e remoção de registros](09-lista-tarefas-edicao.html)   * [10\.
- Dados mais seguros com validação de formulários](10-lista-tarefas-validacao.html)   * [11\.


  - Na próxima etapa podemos definir quais são as dependências do ambiente de desenvolvimento da aplicação. É comum encontrar situações onde precisamos de algumas bibliotecas apenas durante o desenvolvimento de aplicações, mas não para disponibilizar a aplicação em um servidor, por exemplo. Bibliotecas usadas apenas no ambiente de desenvolvimento são focadas em facilitar o dia a dia no desenvolvimento de aplicações e em testes automatizados. No nosso caso não vamos usar bibliotecas focadas no desenvolvimento, então temos que escrever _no_ como resposta para a próxima pergunta:

  - Podemos continuar com esta estrutura, mas, com o tempo, o arquivo vai crescer e ganhar mais funcionalidades. Isso deixará nossa pequena aplicação mais complicada de ler e entender, uma vez que tudo estará em um arquivo muito grande e com mais de uma linguagem (PHP, HTML, CSS). Por isso, aqui entra uma decisão importante: separar nossa aplicação em dois arquivos. Um deles fará o processamento de entrada de dados e manipulação da sessão, e o outro exibirá o formulário de cadastro de tarefas e a lista das tarefas cadastradas, ou seja, será o nosso **template**.

  - Na verdade, eu sempre quis escrever um livro sobre programação e até cheguei a começar alguns rascunhos, mas acabei deixando todos de lado. Até que um dia o Caio Ribeiro Pereira, que estava terminando seu livro de Node.js, me perguntou se eu não queria escrever um livro de Python e me apresentou ao Paulo Silveira da Caelum/Casa do Código. Depois disso, trocamos alguns e-mails e comecei a escrever este livro de PHP e MySQL, finalmente colocando no "papel", o que pensei em fazer por muito tempo. Obrigado, Caio! E obrigado, Paulo!

  - Esse passo da criação do arquivo `inc.php` é necessário pois de alguma forma o PHP precisa saber onde estão as classes da PHPMailer. A comunidade PHP criou uma forma de se resolver esse problema usando um mecanismo do PHP chamado de "autocarregamento", ou "autoload". Existe até mesmo uma forma padronizada de se fazer o autocarregamento de arquivos usando uma ferramenta chamada **Composer** que veremos mais adiante neste livro. Com o uso do Composer não precisaremos mais deste recurso, criando o arquivo `inc.php`.

  - O arquivo `composer.lock` contém as versões exatas das dependências do nosso projeto. É como se fosse uma fotografia do momento em que as dependências foram instaladas. Este é um arquivo importante pois permite que outras pessoas trabalhando no mesmo projeto tenham exatamente as mesmas versões das dependências, evitando problemas de incompatibilidades entre versões diferentes. O mesmo é válido para a hospedagem da nossa aplicação online, pois podemos instalar no servidor as versões corretas das dependências.

  - Caso você queira ter mais informações sobre o assunto, pesquise por "armazenamento de arquivo no banco de dados ou no sistema de arquivos". Você vai encontrar diversos pontos de vista e diversos experimentos sobre o assunto, mas vai perceber que no geral a opção de usar o sistema de arquivos é a mais utilizada. Outra forma comum de se armazenar arquivos é usando serviços especializados, que rodam em nuvem, e que não cobriremos neste livro, mas você pode pesquisar sobre "armazenamento de arquivos em nuvem".
## 2. Principios e Tecnicas
- Recebendo upload de arquivos](11-lista-tarefas-upload.html)   * [12\.
- Lembretes de tarefas por e-mail](12-lista-tarefas-email.html)   * [13\.
- Programando com Orientação a Objetos](13-oo.html)   * [14\.
- Protegendo a aplicação contra SQL Injection e XSS](14-sql-injection.html)   * [15\.
- Conhecendo o PDO](15-pdo.html)   * [16\.
- Introdução ao MVC](16-mvc.html)   * [17\.
- Carregamento automático de classes e Namespaces](17-namespaces.html)   * [18\.
- Dependências com Composer](18-composer.html)   * [19\.
- Hospedagem de aplicações PHP](19-hospedando.html)   * [20\.
- Apenas o começo](20-apenas-o-comeco.html)     # ISBN  Impresso e PDF: 978-85-66250-30-5  EPUB: 978-85-66250-77-0  > Caso você deseje submeter alguma errata ou sugestão, acesse <http://erratas.casadocodigo.com.br>.   # Agradecimentos  A vida não é uma sequência de acontecimentos aleatórios.


  - Para corrigir isso, é necessário editar o arquivo de configuração do PHP usado pelo XAMPP. O arquivo se chama `php.ini` e, no XAMPP do Windows, ele fica em `c:\xampp\php\php.ini`. No XAMPP do Mac OS X, ele fica em `Applications/XAMPP/php/php.ini`, e no Debian/Ubuntu, ele fica em `/etc/php/X.X/apache2/php.ini`, onde `X.X` é o número da versão do PHP instalada no seu computador. Caso não encontre, tente o diretório `/opt/lampp/etc/php.ini`, ou o comando `sudo find / -name php.ini` e encontrará o local.

  - A vida não é uma sequência de acontecimentos aleatórios. Muita coisa teve de acontecer em uma certa ordem para que este livro fosse possível, desde uma longínqua oportunidade de fazer o primeiro curso de informática, passando por curso técnico, faculdade, grupos de estudo, palestras, até as oportunidades de trabalhar com pessoas que me fizeram evoluir. Por isso, agradeço a Deus por ter me dado as ferramentas e o discernimento necessários para encontrar os caminhos que me trouxeram até este livro.

  - A dupla PHP e MySQL se conhece há muitos anos e trabalha bem em equipe, sendo a principal responsável pelo conteúdo dinâmico na web, desde portais de notícia e conteúdos a lojas online, blogs e redes sociais. Essa dupla também é muito famosa por conta da facilidade de se escrever código em PHP para conversar com o banco de dados. Outra vantagem é que as instalações de PHP em servidores e ambientes de desenvolvimento já contam com as bibliotecas de acesso ao MySQL por padrão, na maioria dos casos.

  - > Mesmo assim, não há como negar que o PDO é realmente uma evolução interessante no mundo do PHP e é algo que todas as pessoas que trabalham com PHP deve conhecer. Por isso, veremos como converter a nossa aplicação das tarefas para usar o PDO nos capítulos finais deste livro, após os capítulos que tratam de Orientação a Objetos. Ou seja, você vai terminar o livro conhecendo duas bibliotecas de conexão a bancos de dados em PHP e ainda vai aprender técnicas de mudança de uma biblioteca para outra!
## 3. Aplicacoes Praticas
- Muita coisa teve de acontecer em uma certa ordem para que este livro fosse possível, desde uma longínqua oportunidade de fazer o primeiro curso de informática, passando por curso técnico, faculdade, grupos de estudo, palestras, até as oportunidades de trabalhar com pessoas que me fizeram evoluir.
- Por isso, agradeço a Deus por ter me dado as ferramentas e o discernimento necessários para encontrar os caminhos que me trouxeram até este livro.
- Este livro não seria uma realidade sem o apoio da minha amada esposa _Cássia Luz_.
- Quando conversamos sobre a oportunidade de eu escrever um livro, ela disse **"você tem de escrever um livro!".** E isso me motivou bastante a encarar essa tarefa tão difícil.
- (E obrigado também pela ideia da ilustração da capa, ficou demais!).
- Agradeço também aos meus pais, Silvana e Evaldo, meus irmãos, Jenner e Antonio Paulo, e à sra.
- Mário, tios da Cássia, que me desculparam por não comparecer aos almoços e jantares em família porque estava escrevendo só mais algumas páginas.
- Para a terceira edição deste livro também precisei contar com a ajuda da minha filha _Joana_ , que no auge dos seus três anos de idade precisou me desculpar por ter que trabalhar "só um pouquinho" no livro antes de poder brincar.
- Na verdade, eu sempre quis escrever um livro sobre programação e até cheguei a começar alguns rascunhos, mas acabei deixando todos de lado.
- Até que um dia o Caio Ribeiro Pereira, que estava terminando seu livro de Node.js, me perguntou se eu não queria escrever um livro de Python e me apresentou ao Paulo Silveira da Caelum/Casa do Código.

## 4. Topicos Avancados
- Depois disso, trocamos alguns e-mails e comecei a escrever este livro de PHP e MySQL, finalmente colocando no "papel", o que pensei em fazer por muito tempo.
- Não posso esquecer do pessoal do GCCSD (Grupo de Compartilhamento do Conhecimento Santos Dumont) que foi bastante incentivador quando eu ainda dava passos pequenos em TI e, ainda hoje, é uma fonte de ideias e discussões sem igual.
- Agradeço também às pessoas que leram a primeira e a segunda edição e que enviaram diversas mensagens através da lista de discussão, que me permitiram refinar e melhorar o conteúdo.
- Obrigado também Vivan Matsui da Casa do Código por revisar o conteúdo das edições deste livro e por sugerir melhorias que enriqueceram o conteúdo.   # Sobre o autor  Evaldo Junior Bento trabalha com TI desde 2004.
- É desenvolvedor web com foco em boas práticas e padrões de desenvolvimento utilizando PHP como uma de suas principais linguagens de desenvolvimento desde 2008.
- Foi professor universitário por quatro anos, e ministrou disciplinas relacionadas a desenvolvimento de software e sistemas operacionais.
- É palestrante em eventos relacionados a software livre e desenvolvimento de software no Brasil e na Europa.
- Possui formação em Processamento de Dados pela Fatec e Pós-graduação em Gestão Estratégica de TI.
- Mantém um blog sobre desenvolvimento e tecnologia em português (<http://blog.evaldojunior.com.br/>) e em inglês (<http://blog.evaldojunior.com/>), é colaborador em alguns projetos em software livre no GitHub, em <https://github.com/InFog> e está no Twitter em <https://twitter.com/InFog9> onde fala sobre TI e sobre vida.   # Prefácio  Muita gente que pensa em Web lembra logo de HTML, CSS e JavaScript.
- Claro, são as linguagens fundamentais dos navegadores.

