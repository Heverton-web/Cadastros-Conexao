---
name: jsf-eficaz-as-melhores-praticas-para-o-desenvolvedor-we
description: >-
  Passos operacionais extraidos do livro 'JSF eficaz as melhores práticas para o desenvolvedor web java' (PT) — Java, Java Web, Desenvolvimento Web.
---
# Conteudo Extraido
Fonte: EPUB - [PT] EPUB_JSF_eficaz__as_melhores_práticas_para_o_desenvolvedor_web_java - Desconhecido.txt


## Conceitos Fundamentais
- Capítulo 2 Sumário Sobre o Autor Agradecimentos Sobre o Livro Capítulo 1: Escolhas que afetam o desenvolvimento da aplicação 1.1 Suspeite se a aplicação está usando bem o JSF 1.2 Devo seguir todas as dicas ao pé da letra?
- Parte 1 - Use os escopos corretamente Capítulo 2: @RequestScoped para escopos curtos Capítulo 3: Mantenha o bean na sessão com @SessionScoped Capítulo 4: Entenda o novo @ViewScoped Capítulo 5: Crie escopos longos e customizáveis com @ConversationScop
- Capítulo 9: Exibindo Objetos e Mensagens após Redirect e o FlashScoped Parte 2 - Cuidados com seus Managed Beans Capítulo 10: Colocando lógica de rendered no MB Capítulo 11: Inicializando Objetos Capítulo 12: Injetando ManagedBeans Capítulo 13: Targe
- Capítulo 16: Utilizando imagens/css/javascript de modos simples Capítulo 17: Boa utilização do Facelets Capítulo 18: Enviar valores para o ManagedBean 18.1 Envie valor como parâmetro pelo f:setPropertyActionListener 18.2 Envie valor como parâmetro 18
- Capítulo 4 Sobre o Autor Hébert Coelho de Oliveira trabalha há mais de 10 anos com desenvolvimento de softwares.
- Possui as certificações SCJP, SCWCD, OCBCD, OCJPAD.


  - O primeiro `p:fieldSet` é o que exibe os elementos disponíveis para serem arrastados. Dentro dele é possível encontrar um `dataTable`. A lista utilizada no dataTable é `List<Foto> fotos`, onde a classe foto tem apenas duas `String`s; a primeira String é o nome da foto, e a segunda, o caminho físico da foto (por exemplo, `/home/uaihebert/fotos`). O componente `p:draggable` é quem configura qual objeto da tela poderá ser arrastado; ele tem o atributo `for`, que aponta quem poderá ser arrastado; o parâmetro `revert`, que indica que caso o objeto seja largado em um lugar inválido ele deve voltar ao seu lugar de origem; os parâmetros `handle`, que estão falando qual classe servirá de ativador para se mover o objeto, e no caso foi escolhido o título do panel – o usuário não conseguirá mover o objeto a não ser pelo título; `stack`, que controla automaticamente o "arrastar" do componente.

  - Note no código da página `autoComplete.xhtml` a quantidade de configurações (a maioria não obrigatória) que é possível ter, e existem outras que não foram utilizadas. ` forceSelection` indica se a seleção de algum valor é obrigatória, para evitar que o usuário deixe um valor qualquer, como uma cidade chamada _123***_. `minQueryLength` é a quantidade mínima de caracteres necessários para disparar a chamada no ManagedBean. `value` terá o valor selecionado pelo usuário. `completeMethod="#{primefacesMB.autoComplete}"` é o método que retornará a lista filtrada pelo valor informado pelo usuário. `var` é o nome que um item da lista retornada no método definido no `completeMethod` retornará; `itemLabel` é o nome que será exibido ao usuário; e `itemValue` o valor selecionado que será enviado ao ManagedBean. `dropdown="true"` exibe ou não o botão para exibir os valores.

  - Para exibir uma mensagem para o usuário existem diferentes maneiras: duas fáceis e uma mais complexa. Após inserir a mensagem no contexto para exibi-la para o usuário, basta executar o seguinte comando: `externalContext.getFlash().setKeepMessages(true)`. Desse modo a mensagem será exibida para o usuário após ser redirecionado. O outro modo de exibir a mensagem é adicionar a tag a seguir na página: `<c:set target="#{flash}" property="keepMessages" value="true" />`. Desse modo a mensagem será salva no flash e exibida ao usuário. O último modo envolve criar um `PhaseListener` que faça o trabalho manual de persistir o valor na sessão e depois remover; para maiores informações dessa abordagem visite o link: <http://uaihebert.com/?p=499> .

  - O componente `p:droppable` define qual objeto receberá os objetos jogados. `for` aponta qual componente segurará o objeto jogado; `tolerance` aponta qual o tipo de ação para que ele considere que o objeto foi jogado; `activeStyleClass` define qual estilo o componente que receberá um objeto terá enquanto ele não for jogado: ver na foto 21.4. `datasource` é o componente que contém os objetos que poderão ser arrastados e `onDrop` é ação que será executada (que veremos em breve). Existe também um listener que realiza a transferência da foto de uma lista (`#{primefacesMB.fotos}`) para outra(`#{primefacesMB.fotosSelecionadas}`).

  - Para exibir um objeto ou um atributo após um `SendRedirect` basta fazer como no método `redirecionarComFlash`. Basta utilizar o FlashScope `externalContext.getFlash().put("valorParaExibir", valorParaExibir);` para armazenar o valor como se fosse um mapa; esse mapa armazenará o valor até o final do redirecionamento. Para exibir esse valor na outra tela, basta fazer: `<h:outputText value="#{flash.valorParaExibir}" />`. Após o valor ser acessado no FlashScope ele será eliminado da memória. É possível também manter o objeto na sessão, basta acessar o objeto por `<h:outputText value="#{flash.keep.valorParaExibir}" />`.

  - Ao executar uma aplicação no JBoss com o MyFaces a seguinte mensagem é exibida: _"WARN [JBossJSFConfigureListener] MyFaces JSF implementation found! This version of JBoss AS ships with the java.net implementation of JSF. There are known issues when mixing JSF implementations. This warning does not apply to MyFaces component libraries such as Tomahawk. However, myfaces-impl.jar and myfaces-api.jar should not be used without disabling the built-in JSF implementation. See the JBoss wiki for more details "_ Note que o próprio JBoss avisa que o ideal seria apenas utilizar uma implementação, a que ele fornece.

  - Devido ao fato de que o _select_ é utilizado em classes, o JSF tentará comparar os valores através dos métodos `hashCode` e `equals`. Esse erro pode acontecer caso sua classe não esteja implementando esses dois métodos corretamente. O método `hashCode` deve sempre retornar um inteiro que represente numericamente a classe. Esse inteiro é comumente utilizado pela interface Set e outros componentes. O método `equals` deve sempre retornar se um objeto é igual ao outro, e o resultado não pode variar. Para melhores detalhes veja: <http://tutorials.jenkov.com/java-collections/hashcode-equals.html>

  - Veja que o código da página é quase o mesmo, com um detalhe muito importante. Precisamos informar que a paginação será feita de forma `lazy`, através do atributo `lazy="true"`. Foram adicionadas no componente `p:column` os atributos `sortBy` para habilitar a ordenação e `filterBy` para indicar o filtro. Toda coluna que utilizar o `sortBy` enviará esse valor na hora em que for alterado. Esse parâmetro funciona do modo Lazy e do modo normal. `filterBy` fará o filtro do campo assim que seu valor for alterado. Essa opção também funciona tanto com Filtro Lazy como do modo normal.

  - É preciso tomar bastante cuidado com a configuração/utilização de um Converter. A anotação `@FacesConverter(forClass = Cidade.class)` foi utilizada para definir que toda classe `Cidade` da aplicação utilizará esse `Converter`. Infelizmente algumas implementações simplesmente ignoram esse valor da anotação e não encontram o converter. A solução seria utilizar a anotação assim: `@FacesConverter(value = "cidadeConverter")`. E em cada componente que necessitasse de um `Converter` fazer uso do seguinte atributo: converter="cidadeConverter".

  - Infelizmente o `dataTable` do JSF não é dos mais bonitos e nem práticos. Se você colocar uma coleção de 100000 itens para o `dataTable`, todos os itens serão exibidos. Dessa forma, além de você manter no mínimo 100000 objetos na memória, a renderização da tela demorará muito, pois a quantidade de informação que deverá ser mostrada é muito grande. Indo mais além, é ruim também para o usuário, já que a usabilidade ficará prejudicada. Como encontrar uma informação numa lista com outras 100000? É como encontrar uma agulha no palheiro.
## Principios e Tecnicas
- Foi revisor de um livro específico sobre Primefaces e criador de posts em seu blog com aplicações completas utilizando JSF.
- Escreveu um post sobre JSF com diversas dicas que alcançou mais de 3 mil visualizações no primeiro dia, um post com 18 páginas, que foi a ideia original desse livro.
- Pós Graduado em MIT Engenharia de Software - desenvolvimento em Java.
- Atualmente atua como professor para o curso de Pós Graduação, ensinando o conteúdo de Java Web (JSP, Servlet, JSF e Struts) e tópicos avançados, como EJB, Spring e WebServices.
- Capítulo 5 Agradecimentos Primeiramente agradeço a Deus por me capacitar para escrever o livro.
- Agradeço à minha esposa por toda sua paciência durante o processo de escrita desse livro, e por sempre me animar nos momentos mais difíceis.

## Aplicacoes Praticas
- Capítulo 6 Sobre o Livro O JSF é uma tecnologia muito útil e prática de ser aplicada, mas que diversas vezes é mal utilizada.
- Muitas vezes por falta de conhecimento de quem estrutura a aplicação, o projeto acaba ficando lento e de difícil manutenção.
- Este livro tem por objetivo dar dicas e explicar conceitos que são necessários para que uma boa aplicação utilizando JSF seja criada. Às vezes o mínimo detalhe que vai desde como chamar um método ou passar um valor para um ManagedBean ou até mesmo ut
- Esse livro demonstrará boas práticas, dicas e a correta utilização do JSF em diversos aspectos e diferentes situações.
- Capítulo 7 Capítulo 1 : Escolhas que afetam o desenvolvimento da aplicação Você já sentiu um desânimo por ter que alterar uma funcionalidade?
- Ou ter que procurar por aquele bug que está aparecendo há meses?

## Topicos Avancados
- A tarefa era apenas pegar uma aba que estava entre outras e exibi-la primeiro.
- Fig. 1.1: Exibir primeiro a aba Pessoa A figura 1.1 mostra como era o layout e como, teoricamente, seria simples passar a aba Pessoa para ser exibida antes da aba Carro .
- O que seria uma tarefa de 15 minutos se transformou em uma caça às bruxas de 3 dias.
- Ao alterar as abas de posição, diversos erros começaram a acontecer.
- O primeiro erro que apareceu foi o cruel NullPointerException .
- Como um desenvolvedor poderia imaginar que, ao alterar uma aba de lugar, esse erro iria aparecer?

## Secao 5
- Todos eram SessionScoped e dependiam de informações em comum.
- Ao entrar na primeira aba ( Carro ), diversos dados eram armazenados na sessão e utilizados em outras abas diretamente no ManagedBean que cuidava da aba Carro.

