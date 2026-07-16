---
name: epub-front-end-com-vue-js-da-teoria-pr-tica-sem-co
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Front End Com Vuejs Da Teoria A Pratica Sem — Passos Operacionais

Conteudo extraido do livro 'Epub Front End Com Vuejs Da Teoria A Pratica Sem'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Possui uma força imensa de elevar a qualidade da Web brasileira.
- Os milhares de representantes dessa comunidade produzem conteúdos ótimos em seus blogs, listas de discussão, Facebook e conversas de boteco.
- Nós nos encontramos em eventos memoráveis em todo o Brasil.
- Esse livro quer ser uma pequena celebração desse sucesso.
- Inspirados em projetos internacionais semelhantes – como o recomendadíssimo _Smashing Book_ – trazemos essa **Coletânea de Front-end**.
- Um grupo de 11 autores de renome nacional na comunidade se juntou para escrever artigos que julgamos relevantes para a Web.
- E mais importante até que o pequeno grupo de desbravadores desse projeto, queremos abrir o caminho para mais um canal da comunidade front-end.
- Queremos feedback, queremos que briguem conosco pra que lancemos novas edições, com mais autores e mais temas.  ###  1.1  Os capítulos e os autores   O livro está organizado em capítulos independentes, cada um com seu autor.
- Conversamos entre nós, mas cada tópico é expressão do próprio criador.
- A única regra era: escrever algo memorável, que fizesse a diferença na Web brasileira.


  - Note que aumentamos o reúso do código. Para finalizar, vale lembrar que esses `mixins` têm o conceito de herança, ou seja, todo o código declarado na entidade pai (mixin) é importado nas entidades filhas (componentes), permitindo que as entidades filhas façam uso do código do pai e o sobrescreva. Por exemplo, se declararmos no componente `LvLeitor` um método chamado `maiusculo`, que transforma o valor em maiúsculo e concatena com a `String` `postagem`, o resultado será o nome do post concatenado com a `String`. Isso porque o Vue priorizará o método lido no próprio componente, ignorando o declarado no `mixin`, assim como acontece na herança.

  - No projeto orientado, a partir do que aprendemos vamos construir uma aplicação da maneira mais utilizada e recomendada pela comunidade, por meio da prática do TDD para criar um sistema baseado em testes. Sempre nos lembraremos dos três pilares da programação Orientada a Objetos, que na minha opinião são os três pilares de qualquer programação: a **coesão** , cada parte do sistema terá uma responsabilidade única; o **acoplamento** , mantendo o número de dependências de cada bloco igual a zero ou perto disso; e o **encapsulamento** , deixando cada bloco do sistema exibir para os demais apenas aquilo que é realmente necessário.

  - Em um exemplo hipotético, temos um blog cujos títulos das postagens DEVEM sempre ser exibidos em maiúsculo. Com o que aprendemos até aqui, poderíamos criar um método e formatar o título, mas esse blog é uma aplicação toda modularizada, na qual o título do post pode aparecer em vários arquivos e componentes distintos, por exemplo, na lista de posts, na página de busca, na tela de leitura e comentários do post. Para não termos que declarar o método de transformação em cada um desses arquivos, podemos usar um `mixin` para reaproveitá-lo em toda a aplicação.

  - Atualmente, temos na `store` apenas nossa lista de tarefas. Ela já demanda muitos métodos, mas imagine se tivéssemos o estado de uma agenda de contatos nesse mesmo projeto? As coisas ficariam mais confusas, pois teríamos, por exemplo, no arquivo de mutações, além dos métodos `ADD_TAREFA` e `DEL_TAREFA`, os `ADD_CONTATO` e `DEL_CONTATO`. Logo, isso tende a crescer ao infinito. Mas agora, poderíamos separar isso muito bem criando apenas dois módulos: um guardaria os métodos e dados referentes às `Tarefas` e o outro seria responsável pelos `Contatos`.

  - Antes de criar o componente, criaremos o `Login.test.js` para testar a tela de login. Assim como na tela de registro, temos um formulário com as informações do login e um botão de ação para o componente `LvLogin` ver se tudo está funcionando como deveria. No teste, vamos setar os valores do `data` com os dados que serão preenchidos no formulário de login, fazer o mock do método `logar`, que contatará nossa API para validar o usuário e, por fim, chamar o método para ver se o botão de login foi desabilitado, simulando a espera pela resposta da API:

  - Para isso, temos três maneiras de disponibilizar extensões. A primeira forma é por meio das libs NPM, pacotes de código que são desenvolvidos em JavaScript para expor funcionalidades a qualquer outro sistema em JavaScript, mas que não veremos aqui, pois elas não se enquadram no Vue. As outras duas possibilidades são: as diretivas customizadas, que são feitas para formatação e manipulação de elementos HTML, assim como vimos com `v-text` e outros; e os plugins, que estendem diversas funcionalidades do Vue, assim como o Vue-router e o Vuex.
## 2. Principios e Tecnicas
- Nesse nosso meio que muda rápido, não queríamos falar da moda do mês.
- Começamos tentando rediscutir o papel da Web redescobrindo o **Progressive Enhancement** com _Luiz Real_.
- É impressionante como uma técnica com anos de idade é cada vez mais atual.
- E como há muita gente ainda ignorando essa prática essencial.
- Na sequência, _Diego Eis_ aborda **Responsive, Adaptive e Fault Tolerance** com muitas buzzwords e polêmicas.
- O autor mostra como a Web é genialmente imprevisível, adaptativa e flexível e discute o _mindset_ correto pra lidar com isso.
- Entra então _Bernard De Luna_ falando sobre **Como criar frameworks CSS**.
- Mais que uma abordagem puramente técnica, é um tratado sobre a necessidade de padrões nos projetos e uma discussão interessante sobre o papel dos frameworks nas equipes Web.
- Em seguida temos _Giovanni Keppelen_ , que apresenta uma introdução detalhada ao **AngularJS** , um dos principais expoentes atuais do grupo de frameworks JavaScript MVC.
- Ele demonstra códigos práticos dos principais módulos do Angular e os motivos pelos quais você deve considerar essa ferramenta em suas aplicações.


  - Centralizando a fonte de dados da aplicação, você garantirá que não haverá dados duplicados e nem distintos quando deveriam ser iguais. Além disso, no Vuex, temos o gerenciamento de estado, por meio do qual você pode ver com facilidade a alteração da interface guiada pelo estado de seus dados. Isto é, quando eles mudam, a interface também muda, e o Vuex tem a capacidade de deixar todos os estados armazenados para consultas futuras, como para debugar ou ver o valor de uma variável de estado antes e depois de ser alterada.

  - Antes de codificar, temos de dizer que o Vuex é dividido em cinco partes. Temos o `state`, usado para a definição dos dados que a loja possui; os `getters`, que são os transmissores desses dados, utilizados para pegar dados da loja; as `mutations`, que são os manipuladores de dados; as `actions`, cuja única função é submeter mutações; e, por fim, os `modules`, que agrupam os `state`, `getters`, `mutations` e `actions` em um módulo e oferece uma melhor organização dos dados. A seguir, passaremos por cada parte do Vuex.

  - Faremos apenas um teste, igual aos testes anteriores, pois temos um formulário para criar a nota e um botão que contata a API sobre a nova anotação. No teste, iniciamos o componente com o conteúdo da anotação no `data` e criamos um mock do método `criar` para que a API não seja contatada e crie a nota no banco. Esse mock vai mudar o estado do botão, então, após simular o clique nele, vemos se ele está desabilitado. Assim, simularemos todo o funcionamento desse componente para checar se ele está totalmente funcional:

  - Esse nome deve ser uma `String` com minúsculas ou maiúsculas, porém precisa ter a mesma regra de definição de variáveis, ou seja, sem caracteres especiais, espaços e números no início. Também é recomendável usar um prefixo para identificar o componente, pois nomes genéricos como `button` podem facilmente gerar confusão e se misturar com a tag do HTML. Além disso, isso poderia afetar a reusabilidade, pois é muito comum ter componentes com nomes iguais. Então, defina um prefixo que esteja claro para você, como:
## 3. Aplicacoes Praticas
- A discussão sobre acessibilidade é bastante profunda com dois nomes de peso.
- Primeiro, _Reinaldo Ferraz_ discute o coração da acessibilidade vista pelo W3C, mostrando as práticas fundamentais das **WCAG** que muitas vezes ainda são ignoradas no mercado.
- Depois, _Deivid Marques_ expande o tema abordando **WAI-ARIA** e as novas marcações de acessibilidade pensando em interações ricas na Web.
- Com exemplos excelentes, ele mostra como os novos atributos podem ser incorporados sem esforço nas suas aplicações.
- Com a Web evoluindo a passos largos e browsers cada vez mais espertos, o que não faltam são novas APIs para explorar todo esse potencial. _Jaydson Gomes_ mostra várias **APIs modernas** que você já pode usar hoje, como WebStorage, PostMessage, WebNotifications e History.
- Como o tema é longo, _Almir Filho_ mostra ainda mais APIs, agora com foco em acesso a **recursos de dispositivos modernos**.
- Aborda aspectos sobre câmera, acelerômetro, aúdio, GPS, vibração e mais.
- É o que você precisa saber pra dominar a Web em suas novas fronteiras.
- Na sequência, _Caio Gondim_ mostra como dominar todo esse mundo do front-end e facilitar o desenvolvimento com **Debug no browser e Dev Tools**.
- É um capítulo bastante aprofundado em como incorporar o uso das ferramentas de desenvolvimento no seu dia a dia com bastante produtividade e recursos úteis.

## 4. Topicos Avancados
- No último capítulo, _Eduardo Shiota_ fala de **testes com JavaScript**.
- Um assunto de vital importância para garantir a qualidade de qualquer projeto que envolva front-end.
- E, por fim, eu, _Sérgio Lopes_ , idealizador da coletânea, escrevi esse prefácio e fiz o papel de editor, revisor técnico, cobrador de prazos e distribuidor de pitacos no texto alheio.
- Em nome de todos os autores, espero que goste dos temas que escolhemos e aproveite o livro.
- Vamos mudar a Web juntos!      ---      **Sobre o editor**  Sérgio Lopes é instrutor e desenvolvedor na Caelum, onde dá aulas de front-end e outras coisas.
- Escreve bastante conteúdo sobre front em seu blog (sergiolopes.org), twitter (@sergio_caelum) e outros lugares.
- Participa de muitos eventos no Brasil todo e publicou o livro _"A Web Mobile"_ também pela editora Casa do Código.  _Fig. 1.1_           ---            ##  Capítulo 2:  Progressive Enhancement: construindo um site melhor para todos   Com navegadores cada vez mais modernos, cheios de recursos, a tendência é que nossos sites também fiquem cada vez mais sofisticados.
- Porém, não podemos esquecer: nem todo mundo que acessa nossos sites está usando um navegador com os últimos recursos.
- O primeiro pensamento que aparece na cabeça de muitos quando ouvem algo parecido é: mas eu posso obrigar meus usuários a atualizarem seus navegadores.
- Ou então: usuário com navegador desatualizado não merece acessar meu site!

