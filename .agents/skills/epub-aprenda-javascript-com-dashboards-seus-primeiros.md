---
name: epub-aprenda-javascript-com-dashboards-seus-primei
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Aprenda Javascript Com Dashboards Seus Primeiros — Passos Operacionais

Conteudo extraido do livro 'Epub Aprenda Javascript Com Dashboards Seus Primeiros'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Apresentaremos, desde o básico, a linguagem web mais popular do mundo: o JavaScript.
- Todo o desenvolvimento será direcionado à criação de painéis informativos, os famosos Dashboards.
- Essa abordagem busca atrair pessoas que já possuem uma massa de dados, mas enfrentam dificuldades para transformá-la em informação — seja por falta de familiaridade com ferramentas técnicas ou pelo alto custo de softwares especializados.
- Tudo o que usaremos aqui serão ferramentas gratuitas.
- Você deve estar se perguntando: "Mas meus dados estão em diferentes formatos, como eles serão colocados em um Dashboard?".
- Aprenderemos a trabalhar com dados a partir do formato _.csv_ , que é basicamente um formato adaptado de qualquer planilha de dados.
- Embora seja útil ter dados em formato de planilha, não é obrigatório para acompanhar o conteúdo deste livro.
- Este livro vai ensinar você a programar em JavaScript, desde o comando mais simples, como um _alert("Hello World")_ , até a criação de Dashboards atraentes e capazes de serem visualizados em qualquer dispositivo, seja móvel ou não (celulares ou computadores).
- Compartilho aqui um compilado dos meus 12 anos de experiência como desenvolvedor de aplicações para web e mais 4 na docência na área de tecnologia, para mostrar que, com as ferramentas mais básicas e gratuitas da tecnologia, é possível criar aplicativos muito robustos.
- Essas informações ajudarão você a conhecer a programação e vão fornecer resultados rápidos e atraentes, quebrando o paradigma de que são necessários conhecimentos aprofundados para começar a trabalhar na área de TI.


  - Por padrão o `prompt` recebe os dados inseridos pelo usuário como uma string. Assim, mesmo que o usuário digite um número, como 10, o valor será interpretado como texto e armazenado dessa forma na variável. Em seguida, ao realizar uma operação com o símbolo `+`, o programa pode interpretar essa ação como uma concatenação de textos — e não como uma soma numérica — já que o operador `+` serve para ambas as finalidades. Por outro lado, o operador é exclusivo para subtrações com valores numéricos, o que evita esse tipo de ambiguidade. Portanto, ao utilizar entradas numéricas com `prompt`, é fundamental indicar ao programa o tipo de dado que se deseja manipular. Veja, a seguir, como esse mesmo código pode ser ajustado com conversão explícita de tipos:

  - Neste código, as linhas 4 e 5 indicam explicitamente que os valores armazenados em `x` e `y` serão convertidos para o tipo inteiro. O `parseInt()` realiza essa conversão de uma string para um número inteiro, ou seja, `x` passa a conter o valor numérico equivalente ao que estava originalmente em formato de texto. O mesmo ocorre com `y`. O termo `Int`, no nome da função, vem justamente de _"integer"_ , que significa inteiro, em inglês. Caso você precise converter uma string para um número com casas decimais, pode utilizar o comando `parseFloat()`. E se quiser fazer o caminho inverso — transformar um número em texto —, uma maneira simples de fazer isso é somar o número com uma string vazia (`""`), o que força a conversão para o tipo textual.

  - Observe que o texto que vai para esse parágrafo é adicionado em 2 momentos: o primeiro, avisando o status da bateria com uma variável `nivel`; o segundo, comunicando que não foi possível obter informações da bateria. Esse segundo trecho da Web API já está preparado para o erro de não haver uma bateria no dispositivo do usuário. Se seu usuário acessar de um notebook, tablet ou de um smartphone, a informação da bateria será exibida. Mas pode acontecer do seu usuário acessar de um computador desktop que não tem uma bateria e, para evitar um erro estranho, é só informar que "Não foi possível obter informações da bateria" ou "Bateria não encontrada.". É só alterar o texto conforme você deseja exibir ao usuário.

  - Fizemos o mesmo algoritmo usando duas estruturas diferentes. Tem alguma diferença? Qual deles é melhor usar? Isso vai depender da comparação que deseja fazer. No caso da escolha de um sorvete, vamos imaginar que temos 100 opções de sorvete. Com a estrutura de simples escolha do `switch`, a opção digitada será direcionada diretamente à opção correta. Já com a estrutura `if/else`, que é um comparador mais complexo, ele fará a comparação até encontrar a opção correta. Então, se imaginarmos que a pessoa escolheu o sorvete com a opção 100, o `if/else` só encontrará a opção correta na centésima comparação. Portanto, **nesse caso** , o uso do `if/else` pode resultar em maior consumo de processamento.

  - Vamos imaginar que queremos desenvolver um site que fornece previsão do tempo. Antes de fazer o site, teríamos que ter diversos sensores e termômetros em todas as regiões que queremos e depois montar um banco de dados organizados. É simples fazer isso? É barato? Não. Mas existem grandes empresas que fazem e, se elas quiserem, podem compartilhar essas informações via API e qualquer pessoa pode usar em sua aplicação. Hoje em dia temos diversas APIs gratuitas de previsão do tempo. Existem diversas APIs de diversos assuntos gratuitos que conseguimos buscar informações e montar sites incríveis baseado em informações que não temos, mas que outras empresas têm e nos permitem utilizar através de APIs.

  - Vamos entender os primeiros passos da nossa jornada. Isso envolve compreender nosso ponto de partida e o ponto de chegada. Como autor, apaixonado pela área, tenho acompanhado de forma significativa a expansão da Tecnologia da Informação (a famosa T.I.) em suas diversas ramificações. A pandemia da COVID-19 impulsionou a transformação digital de uma forma sem precedentes. Somente no Brasil, aproximadamente 46 mil profissionais são formados anualmente na área de tecnologia, mas a demanda gira em torno de 70 mil. Tenho percebido esse aumento não apenas em dados divulgados, mas também como docente. A procura é tão intensa que também puxa a demanda dos agentes multiplicadores: os professores.
## 2. Principios e Tecnicas
- Além disso, este livro pode abrir as portas do mundo da tecnologia e incentivar o avanço em uma das áreas com maior demanda de vagas de trabalho atualmente.
- Tudo o que você precisa já está no seu computador e, agora, em suas mãos.  ## Para quem é este livro?    * Iniciantes em lógica de programação;   * Iniciantes da área da tecnologia que desejam conhecer e praticar com a linguagem web mais popular do mundo;   * Pessoas interessadas em transformar dados brutos em informações visuais para tomada de decisão.    ### É necessário algum pré-requisito?
- Este livro apresentará como os sites e plataformas web são codificados e organizados nos seus pilares mais básicos.
- Ao final deste livro, você será capaz de compreender o funcionamento básico existente por trás de toda página da internet.
- Qualquer site pode ser composto por diversas tecnologias, sejam básicas ou avançadas, mas todas derivadas do HTML, CSS e JavaScript, que são as linguagens mais trabalhadas aqui.
- Por isso, este livro é perfeito para iniciantes do mundo da programação.  ## Sobre o livro  Este livro foi escrito pensando em você que está começando sua jornada no mundo da programação e quer ver resultados práticos desde os primeiros passos.
- A proposta é mostrar que, mesmo com conhecimentos iniciais, é possível criar aplicações web úteis, modernas e, principalmente, visuais.
- Para isso, o foco será a construção de Dashboards interativos, usando apenas ferramentas gratuitas, acessíveis e que funcionam diretamente no navegador.
- O livro foi dividido em três partes, com uma evolução pensada para que o aprendizado seja gradual e sem saltos conceituais.  **Parte I — Entendendo as ferramentas**  Aqui, você conhecerá os principais conceitos por trás de qualquer página web.
- Vamos falar sobre editores de código, navegadores, e os três pilares da web: HTML, CSS e JavaScript.


  - * Onde é melhor colocar a tag `<script>`? Há diversas recomendações na internet — dentro da tag `<head>`, no início do `<body>`... mas aqui vai minha dica, baseada em prática: sempre coloque a tag `<script>` no final do arquivo `.html`, logo antes de fechar a tag `</body>`. Isso garante que o conteúdo da página (HTML) seja carregado primeiro, antes das funcionalidades em JS. Assim, o que é visível aparece mais rápido para o usuário, enquanto os scripts são carregados em seguida. Essa prática melhora o tempo de carregamento da página — mesmo que em milissegundos — e ajuda a manter seu projeto mais eficiente. Adotar esse hábito é uma forma simples e eficaz de otimizar seus projetos.

  - Isso é muito comum. Na verdade, esse tópico é só para sanar qualquer dúvida que ocasionalmente exista quanto ao uso dos operadores. Observe novamente nos exemplos anteriores que, com os operadores relacionais, fazemos comparações entre valores, e os operadores lógicos usamos somente quando temos que fazer mais de uma comparação ao mesmo tempo. Isso faz com que, quase obrigatoriamente, os operadores lógicos sejam usados para complementar comparações feitas pelos operadores relacionais. Então, quando precisar de uma estrutura `if` mais robusta, com certeza haverá combinação entre os operadores relacionais e lógicos. Vamos fazer um programa de exemplo?

  - No contexto de funções de Ordem Superior, a abstração é como resumir um grupo complexo de instruções em uma pequena função que especifica a ação que ela pode executar. Essas abstrações ocultam detalhes sobre algumas operações executadas, mas resolvem grandes problemas para nós em um nível mais alto (ou em um nível mais abstraído). Como programadores(as), estamos sempre criando abstrações para poder pensar em um nível mais alto. Tentamos construir soluções complexas para os desafios que surgem. No JavaScript, existem diversos métodos nativos (já embutidos nele) que oferecem soluções para problemas recorrentes.

  - Como estamos construindo um projeto de Dashboard ambicioso, que envolve pintar um mapa de todo o país, precisamos de informações que também cubram todo o território nacional. O exemplo perfeito para isso são os dados abertos da nossa federação. O Governo Federal disponibiliza um portal de dados abertos, em <http://dados.gov.br/>. Nesse site, você encontra diversos bancos de dados com informações reais e relevantes sobre o Brasil. Fica até como dica: esse portal é excelente para treinar, já que oferece conjuntos de dados com volumes expressivos, perfeito para quem deseja praticar a criação de Dashboards.
## 3. Aplicacoes Praticas
- Tudo apresentado de forma simples e com exemplos práticos para garantir que ninguém fique perdido.  **Parte II — Explorando o poder do JavaScript**  Depois de dominar o básico da web, você entrará no universo da programação com JavaScript.
- Nesta parte, vamos abordar desde conceitos fundamentais como variáveis, funções e estruturas de repetição até temas mais avançados como manipulação de objetos, _arrays_ , eventos e consumo de APIs.
- A ideia é que você ganhe fluência suficiente na linguagem para criar interações reais com os usuários.  **Parte III — Chegou a hora dos Dashboards!**  Com a base construída, chega o momento mais esperado: a geração dos Dashboards.
- Você aprenderá a preparar os dados, criar Dashboards, mapas interativos e visualizações que realmente transformam informações brutas em _insights_ visuais.
- Cada capítulo desta parte traz um exemplo prático, incluindo Dashboards de linha, comparações temporais, análises geográficas e até um importador de dados.
- Além de aprender a codificar, você também terá contato com boas práticas de organização, estruturação de código e formas de deixar seus projetos web mais profissionais.  > O livro mantém uma linguagem acessível e direta, sem exigir conhecimentos prévios em programação.
- Tudo é ensinado do zero, mas com a profundidade necessária para que, ao final, você se sinta capaz de criar seus próprios projetos.
- Mais do que ensinar códigos, a proposta aqui é mostrar que você também pode contar histórias com dados.
- E que a tecnologia pode ser uma ponte entre informação e entendimento.   ## Sobre o autor  Lucas Chasseraux Tauil é desenvolvedor web desde 2010.
- Passou por várias tecnologias em sua carreira e em 2022 se tornou professor universitário ministrando disciplinas relacionadas a raciocínio lógico, desenvolvimento de software, redes de computadores e sistemas operacionais.

## 4. Topicos Avancados
- É graduado em Ciência da Computação, pós-graduado em Redes de Computadores e em Desenvolvimento Web.
- Atualmente, cursa mestrado em Ciência da Computação aprofundando ainda mais seus estudos na área.
- Pode ser encontrado em seu LinkedIn <https://www.linkedin.com/in/lucastauil/> e em sua página pessoal <https://espaco.dev>.  ### Agradecimentos  Este livro é dedicado à minha esposa, a Pri, que acredita em mim antes mesmo de eu acreditar.
- Ela me incentiva a sair da zona de conforto e, mesmo que não entenda algumas das minhas decisões mais incomuns, sempre apoiou minhas teimosias profissionais e nunca me deixou desistir — ainda que isso nos custasse adaptações na rotina ou no aspecto financeiro.
- Ter uma companheira como ela é certamente algo de outras vidas...    # Parte I — Entendendo as ferramentas  Nesta primeira parte do livro, vamos entender as ferramentas básicas para construção de Dashboards interativos.
- Você verá:    * Como se organiza o processo de criação de Dashboards na web.   * O papel de editores de código e navegadores.   * Fundamentos essenciais de HTML, CSS e JavaScript.   * O que são e quais as bibliotecas usadas ao longo do livro, como o Chart.js.
- Essa base vai preparar você para colocar a mão na massa com mais segurança nas partes seguintes.
- Capítulo 1  # O caminho até os Dashboards  Vamos entender os primeiros passos da nossa jornada.
- Isso envolve compreender nosso ponto de partida e o ponto de chegada.
- Como autor, apaixonado pela área, tenho acompanhado de forma significativa a expansão da Tecnologia da Informação (a famosa T.I.) em suas diversas ramificações.

