---
name: epub-desenvolvimento-web-com-asp-net-mvc
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# EPUB Desenvolvimento web com ASP.NET MVC — Passos Operacionais

Skill baseada no livro "EPUB Desenvolvimento web com ASP.NET MVC" (PT). Contem passos praticos e sequencias operacionais.

Use quando o usuario pedir orientacao pratica sobre: desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js.

---

## 1. ## Desenvolvimento web com ASP.NET MVC


## 2. ## Sumário


## 3. ## Agradecimentos


## 4. ## Sobre os autores


## 5. ## Prefácio


## 6. ##  Capítulo 1:  Sua primeira aplicação


## 7. ##  Capítulo 2:  Entendendo a estrutura de uma aplicação ASP.NET MVC


## 8. ##  Capítulo 3:  Projetando a aplicação Cadê meu médico?


## 9. ##  Capítulo 4:  Models: desenhando os modelos da nossa aplicação


## 10. ##  Capítulo 5:  Controllers: adicionando comportamento à nossa aplicação


## 11. ##  Capítulo 6:  Views: interagindo com o usuário


## 12. ##  Capítulo 7:  Segurança: criando sua área administrativa

## Conceitos Fundamentais

- O próximo passo é testarmos a imagem que foi gerada criando um container, e dizer que
- applications that cannot run in “the cloud” for various reasons; but the majority of
- torna possível a inicialização (ou a parada) de serviços e coleta de informações
- of Docker. We had no idea that we were about to start the container revolution.
- physical machines. In 2004, Xen had a lot of limitations: it ran only on Linux,


  - Com o projeto _Cadê meu médico?_ aberto (mas não em execução), clique com o botão direito sobre o nome do projeto. No menu que se abrirá, selecione a opção "_Publish..._ ". Ao fazê-lo, uma nova janela de parametrização será exibida. Clique no botão "_Import_ ", disponível imediatamente a frente do _combo box_. Na janela que se apresentará, selecione a opção "_Import from a publish profile file_ " e clique no botão "_Browse_ ". Navegue até o arquivo de publicação que baixamos quando criamos o ambiente de publicação e clique em "_Open_ ". Ao selecionar o arquivo e clicar em "_Ok_ ", automaticamente o Visual Studio alternará a aba de "_Profile_ " para "_Connection_ ", conforme apresenta a figura 8.7.

  - * **NuGet:** ao realizar o deploy de sua aplicação no WAWS, não é mais necessário enviar os pacotes de forma agregada. O Windows Azure se encarrega de realizar tal tarefa em tempo de execução no momento da implantação. **Domínios personalizados:** uma dificuldade encontrada por boa parte dos desenvolvedores web que utilizam web roles no Windows Azure é a criação de domínios personalizados. Com Windows Azure Web Sites, a especificação de domínios personalizados tornou-se extremamente simples, podendo utilizar o próprio portal de administração para este fim. Entretando, é importante observar que, para que esta _feature_ funcione, o web site deve estar “rodando” em modo reservado.

  - Quando criamos nossa primeira aplicação de exemplo (ver capítulo [1](index_split_004.html#sua-primeira-aplicacao)) e escolhemos o _template_ "_Internet Application_ ", vimos o Visual Studio criar um _layout_ padrão para a aplicação e também adicionar, de forma automática, referências a várias bibliotecas JavaScript. Além disso, bibliotecas para que alguns recursos nativos do _template_ padrão pudessem funcionar de forma adequada (autenticação de usuários, por exemplo) foram adicionadas. Mencionamos isso apenas para esclarecer que trabalhar com bibliotecas em projetos ASP.NET MVC é normal e você deve, sempre que necessário, se valer desta opção.
## Princípios e Técnicas

- instalação do MySQL, a fim de evitar telas interativas que são exibidas durante
- entre o nosso host local e o novo container, de forma que tudo o que for criado
- containers e verificar se estão utilizando os novos endereços IP que definimos:
- Até agora, todos os containers que criamos estão utilizando o total de recursos
- O rootfs (ou root file system) inclui a estrutura típica de diretórios ( /dev,


  - A web possui características intrínsecas, que não podem ser desconsideradas em hipótese alguma quando se planejam aplicações para serem executadas neste ambiente. Aspectos como: o correto e profundo entendimento do protocolo HTTP [[null]](index_split_013.html#protocolo-http), utilização de tecnologias nativas dos navegadores (entenda-se, HTML, CSS e JavaScript), responsividade, segurança, desempenho e, claro, _design_ , devem estar **sempre** entre as principais preocupações de desenvolvedores web e, principalmente, das tecnologias e _frameworks_ criados para gerar aplicações eficientes para este modelo.

  - É pertinente observar neste ponto o fato de que, para instalar as bibliotecas necessárias ao nosso projeto via NuGet, estamos utilizando a ferramenta gráfica disponibilizada pelo Visual Studio para este fim. Muito embora tal ferramenta seja funcional e atenda às necessidades, vale mencionar que esta não é a única forma de trabalho disponível. Desenvolvedores que possuem preferência por trabalhar com linhas de comando também são atendidos pelo Visual Studio. Isso é feito através da ferramenta _Package Manager Console_ , acessível através do menu superior na opção _Library Package Manager_.

  - O tempo passou e a internet deixou de ser um ambiente estritamente voltado para o entretenimento, e passou a ser um ambiente também de negócios. Evidentemente que o perfil do usuário também sofreu alterações. O usuário que antes acessava um website apenas para ler suas notícias (por exemplo), agora acessava também para consultar preços de produtos, reservar passagens aéreas, solicitar orçamentos para serviços etc. É desnecessário mencionar aqui que uma nova demanda havia sido criada e que os websites passaram a ter traços de aplicações (por inércia, com maior complexidade associada).

  - O código apresentado pela listagem * é simples, mas apresenta alguns aspectos importantes. Ao recebermos os dados de `Login` e `Senha`, verificamos por meio de uma expressão lambda — um bom post sobre este assunto pode ser encontrado em <http://bit.ly/expressoeslambda> — se existe na base de dados algum registro que atende de forma única aos dados informados pelo usuário. Se encontrar, gravamos o código do usuário em um _cookie_ , o registramos no navegador e retornamos o valor `true` para indicar o sucesso da operação. Caso contrário, retornamos o valor `false` para indicar a falha.
## Aplicações Práticas

- do container sem precisar abrir os arquivos de log, pois todo o log está sendo
- e inserir algum texto. Entretanto, antes note o retorno de um request feito ao
- carga para inicializar os serviços. Isso garante a distribuição das tarefas no
- What is this so-called container revolution? Is it really a revolution, or is
- down. In our repositories, we have “infrastructure as code” files, describing

## Principios e Tecnicas

  - Um dos muitos conceitos interessantes introduzidos pelo _ASP.NET_ foi o de _Master Pages_ (páginas mestras). Por meio das famosas _master pages_ , conseguimos reaproveitar muito do _layout_ que é comum ao site. Por exemplo, não precisamos construir o menu em cada página do site. Em vez disso, podemos colocar o menu em uma _master page_ e "dizer" ao ASP.NET que todas as páginas que herdam os estilos de determinada página mestra devem exibir o mesmo menu. De igual forma, esta técnica poderia ser utilizada para estruturar quaisquer conteúdos de propósitos gerais, permitindo, assim, a manutenção do foco no conteúdo específico da página corrente.

  - Com o desenvolvimento das aplicações totalmente voltado para a manipulação de componentes do lado servidor (TextBox, GridView, DropDownList, Label etc.) e a facilidade de injeção de comportamentos destes através de seus eventos proporcionada pelo Visual Studio (arrasta o componente, duplo clique e inserção de código no evento), a Microsoft arrebanhou uma grande fatia de desenvolvedores, principalmente aqueles já acostumados com esse modelo (“Delphistas” e “VBistas”). Assim, as aplicações web tornaram-se corporativistas, fato este que agradou o mercado e resultou em uma grande adoção da plataforma tecnológica (_a.k.a_ .NET).

  - Muitos aspectos podem ser configurados nesta tela, como, por exemplo, a autenticação do mecanismo de banco de dados (mista utilizando o usuário `sa` padrão, ou Windows Authentication), os diretórios para armazenamento físico dos dados, dentre tantos outros. Para completar este exemplo de instalação, usarei os valores padrão, fornecidos pelo instalador. A única modificação será a adição de uma senha para o usuário administrador padrão `sa`. Esta possibilidade se abre quando selecionamos a opção "_Modo misto_ " para a autenticação. Faça isso e clique em "_Avançar_ ". Você verá uma nova tela (ver figura 9.15).

