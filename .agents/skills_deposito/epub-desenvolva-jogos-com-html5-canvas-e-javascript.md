---
name: epub-desenvolva-jogos-com-html5-canvas-e-javascrip
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Desenvolva Jogos Com Html5 Canvas E Javascript — Passos Operacionais

Conteudo extraido do livro 'Epub Desenvolva Jogos Com Html5 Canvas E Javascript'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Aqui focarei no desenvolvimento de jogos para a web, usando a tecnologia **Canvas** , presente na especificação do HTML5 e suportada por todos os maiores browsers modernos, em suas versões mais atualizadas.
- Pretendo mostrar que desenvolver jogos é uma tarefa na realidade simples, e que não exige grandes curvas de aprendizados com frameworks monstruosos — o básico oferecido pelo ambiente do navegador é o suficiente para começar!
- Tudo o que você precisará é de um browser atualizado e um bom editor de textos.
- Em ambiente Windows, é muito comum o uso do _Notepad++_ (<http://notepad-plus-plus.org>).
- Caso você use Linux, é bem provável que sua distribuição já venha com um editor que suporte coloração de sintaxe para várias linguagens (GEdit, KWrite, etc.).
- No entanto, eu recomendo veementemente o uso do _Brackets_ (<http://brackets.io>), que foi onde eu criei os códigos.
- É multiplataforma (funciona em Windows, Linux, Mac OS X) e realiza autocompletar em código JavaScript de forma bastante eficiente.
- O jogo que você vai criar já está disponível na web.
- Trata-se do **Canvas** , uma das maravilhas do HTML5.
- O Canvas é uma área retangular em uma página web onde podemos criar desenhos programaticamente, usando JavaScript (a linguagem de programação normal das páginas HTML).


  - A solução para jogos e outras aplicações que requerem animações mais precisas é trabalhar com ciclos mais curtos, aproveitando cada momento em que a CPU está disponível para nosso aplicativo, e nesse momento fazer o cálculo do tempo. Para isso, a especificação do HTML5 traz o método `window.requestAnimationFrame`, que delega para o browser a tarefa de executar sua animação o mais rápido possível, assim que os recursos do sistema estiverem disponíveis. Para este método, passamos como parâmetro a função que fará os desenhos no Canvas. Temos que chamá-lo de forma cíclica, uma vez após a outra, da mesma forma que faríamos caso usássemos o conhecido `setTimeout`:

  - Tradicionalmente, quando queremos executar tarefas periódicas em páginas web, usamos os métodos `window.setTimeout` ou `window.setInterval`, passando a função desejada e o intervalo em milissegundos. Os resultados são satisfatórios para tarefas simples, no entanto, o controle do tempo pelo browser não é totalmente preciso. É preciso lembrar que os sistemas operacionais modernos são multitarefa, e mesmo os browsers podem ter várias guias abertas. Não é possível garantir que a CPU esteja sempre disponível no momento exato desejado, portanto o intervalo informado sempre será aproximado.

  - Imagine um jogo de carros de corrida. Todos os carros são padronizados nas suas características, embora elas possam variar (dentro desse padrão). Por exemplo, todos os carros possuem cor, velocidade máxima e velocidade atual. Contudo, em um dado momento, cada carro possui _valores_ diferentes para estas características. O carro do jogador é vermelho, está a 150km/h e pode alcançar até 200km/h. Seu rival é azul, está a 170km/h e pode alcançar até 220km/h. As características que definem um carro no jogo são as mesmas, mas cada uma está preenchida com valores diferentes para cada carro.

  - Tudo o que você precisará é de um browser atualizado e um bom editor de textos. Em ambiente Windows, é muito comum o uso do _Notepad++_ (<http://notepad-plus-plus.org>). Caso você use Linux, é bem provável que sua distribuição já venha com um editor que suporte coloração de sintaxe para várias linguagens (GEdit, KWrite, etc.). No entanto, eu recomendo veementemente o uso do _Brackets_ (<http://brackets.io>), que foi onde eu criei os códigos. É multiplataforma (funciona em Windows, Linux, Mac OS X) e realiza autocompletar em código JavaScript de forma bastante eficiente.

  - Pronto! Temos um herói que se movimenta e atira dentro de um loop de animação. Embora ainda esteja muito básico, é preciso que os conceitos aprendidos fiquem bem fixados para seguirmos para as próximas etapas. Procure reler e refazer os códigos de cada capítulo diversas vezes. **Tente também fazer algumas coisas diferentes, como mover ou atirar na vertical!** Para isso, os códigos de teclas são 38 (acima) e 40 (abaixo), e as alterações na posição _y_ dos sprites serão as mesmas já feitas para _x_ , somente incrementando a partir da `velocidadeY`. Experimente!

  - Podemos ler o relógio do computador em cada ciclo para controlar o movimento da bolinha. Sabemos que o JavaScript possui o objeto `Date`, que obtém a data e a hora atuais, e que esse objeto possui o método `getTime()`, que devolve esse instante exato em milissegundos. Para saber quanto tempo demorou entre um ciclo e outro (lembre-se de que esse tempo é sempre variável), bastaria tirar a diferença entre o instante atual e o anterior. Sabendo o intervalo decorrido, é possível calcular quanto a bola deve se deslocar nesse tempo:
## 2. Principios e Tecnicas
- Com esta tecnologia, podemos criar trabalhos artísticos, animações e jogos, que é o assunto central deste livro.
- Com o Canvas, ao longo dos capítulos, iremos desenvolver o jogo da figura 1.1:  _Fig. 1.16: Jogo desenvolvido ao longo do livro_          Este livro é composto pelos seguintes capítulos:  1. _Fundamentos:_ neste capítulo, aprenda como funciona o Canvas, como criar animações via programação e também noções de Orientação a objetos em JavaScript, para que nossos códigos se tornem mais organizados e reaproveitáveis;  [2](index_split_003.html#cap-loop-animacao). _O loop de animação:_ controle a animação de seus jogos de forma eficiente.
- Usaremos intensivamente a detecção de colisões;  [8](index_split_009.html#capitulo-incorpore-animacoes). _Incorpore animações, sons, pausa e vidas extras ao jogo:_ com todos os conceitos aprendidos e bem fixados, você verá como é fácil estender o jogo e adicionar novos elementos.
- Ao fim do capítulo, você terá sugestões de melhorias que você mesmo poderá tentar realizar, como exercício;  [9](index_split_010.html#capitulo-publique-jogo). _Publique seu jogo e torne-o conhecido:_ um passo a passo de como publicar seu jogo na web e divulgá-lo nas redes sociais.  **Importante:** preparei um pacote de arquivos contendo todos os códigos, imagens e sons utilizados.
- Em cada novo arquivo que criarmos, indicarei o nome do respectivo arquivo nesse pacote.
- Realize seu download no endereço:  <http://github.com/EdyKnopfler/games-js/archive/master.zip>  Antes de começarmos a desenvolver um jogo em específico, é importante nos habituarmos a algumas funções da tecnologia Canvas.
- Vamos começar o aprendizado!  ###  1.1  Introdução ao HTML5 Canvas   Para criar um Canvas em uma página HTML, utilizamos a tag `<canvas>`.
- Os atributos `width` e `height` informam a largura e a altura, respectivamente, da área de desenho.
- É importante também informar um `id` para podermos trabalhar com ele no código JavaScript:               1 <canvas id="nome_canvas" width="largura" height="altura">     2 </canvas>       Entre as tags de abertura e fechamento, podemos colocar alguma mensagem indicando que o browser não suporta essa tecnologia.
- Caso o browser a suporte, esse conteúdo é ignorado:               1 <canvas id="meu_canvas" width="300" height="300">     2    Seu navegador não suporta o Canvas do HTML5. <br>     3    Procure atualizá-lo.     4 </canvas>       Os atributos `width` e `height` da tag `<canvas>` são obrigatórios, pois são os valores usados na geração da imagem.


  - Se você chegou até este livro, é porque está interessado em desenvolver jogos. Aqui focarei no desenvolvimento de jogos para a web, usando a tecnologia **Canvas** , presente na especificação do HTML5 e suportada por todos os maiores browsers modernos, em suas versões mais atualizadas. Pretendo mostrar que desenvolver jogos é uma tarefa na realidade simples, e que não exige grandes curvas de aprendizados com frameworks monstruosos — o básico oferecido pelo ambiente do navegador é o suficiente para começar!

  - Sprites são criados e destruídos a todo momento. Por "destruídos", entenda não apenas morto, aniquilado, atingido, mas destruídos na _memória do computador_. Por exemplo, um inimigo ou item que saiu da tela pode ser destruído e recriado caso o herói retorne àquele ponto. Em JavaScript, não fazemos destruição de objetos (em outras linguagens isso é possível), apenas anulamos as variáveis que se referem a ele e o deixamos livres para o _garbage collector_ apagá-lo da memória automaticamente.

  - Note que agora o fundo move-se em velocidade constante, porém bem devagar, pois passamos a trabalhar com pixels por segundo. Podemos ajustar novas velocidades com valores maiores na função `configuracoesIniciais` da página HTML. Você pode fazer vários testes e atribuir os valores que desejar, dependendo da sensação de velocidade que quer passar. Como as nuvens estão mais próximas, dei a elas a maior velocidade, mas nada impede que coloquemos as estrelas em primeiro plano, por exemplo:

  - Neste capítulo, avançaremos um pouco além e faremos algo muito interessante e fundamental: as _spritesheets_ (folhas de sprites). Um sprite, como você aprendeu no capítulo [2.1](index_split_003.html#capitulo-sprites), é cada elemento controlado pelo loop de animação (o herói, um inimigo, um bloco ou plataforma etc.). Uma folha de sprites é uma imagem contendo várias partes de uma animação. Essas partes são alternadas constantemente para produzir o movimento de um ou mais sprites.
## 3. Aplicacoes Praticas
- O Canvas pode receber dimensões diferentes via CSS, no entanto, seu processamento sempre será feito usando as dimensões informadas na tag.
- Se as dimensões no CSS forem diferentes, o browser amplia ou reduz a imagem gerada para deixá-la de acordo com a folha de estilo.
- Dado um Canvas com dimensões 100x100 pixels:               1 <canvas id="meu_canvas" width="100" height="100"></canvas>       A seguinte formatação CSS fará a imagem ser ampliada:               1 #meu_canvas {     2    width: 200px;     3    height: 200px;     4 }       #### Contexto gráfico  Para desenhar no Canvas, é preciso executar um script após ele ter sido carregado.
- Neste script, obteremos o _contexto gráfico_ , que é o objeto que realiza de fato as tarefas de desenho no Canvas.
- Uma maneira é criar uma tag `<script>` após a tag `<canvas>`:                1 <!DOCTYPE html>      2 <html>      3       4 <head>      5    <title>Processando o Canvas após a tag</title>      6 </head>      7       8 <body>      9    <canvas id="meu_canvas" width="200" height="200"></canvas>     10    <script>     11       // Aqui obteremos o contexto gráfico e trabalharemos com o      12       // Canvas     13    </script>     14 </body>     15      16 </html>       Também é muito comum desenharmos em eventos que ocorrem após a página ter sido carregada.
- Isto é útil caso queiramos colocar os scripts na seção `<head>` do documento HTML:                1 <!DOCTYPE html>      2 <html>      3       4 <head>      5    <title>Processando o Canvas na seção HEAD</title>      6    <script>      7       window.onload = function() {      8          // Aqui trabalharemos com o Canvas      9       }     10    </script>     11 </head>     12      13 <body>     14    <canvas id="meu_canvas" width="200" height="200"></canvas>     15 </body>     16      17 </html>       No código, nós referenciamos o Canvas e obtemos o contexto gráfico.
- O Canvas é referenciado como qualquer elemento em uma página; o contexto é obtido pelo método `getContext` do Canvas.
- Como parâmetro, passamos uma string identificando o contexto desejado.
- Neste livro, usaremos o contexto `2d` ("d" em minúsculo!):               1 <canvas id="meu_canvas" width="200" height="200"></canvas>     2 <script>     3    // Referenciando o Canvas     4    var canvas = document.getElementById('meu_canvas');     5         6    // Obtendo o contexto gráfico     7    var context = canvas.getContext('2d');     8 </script>       #### O sistema de coordenadas do Canvas  Para posicionarmos os desenhos no Canvas, pensamos nele como um enorme conjunto de pontos.
- Cada ponto possui uma posição horizontal (_x_) e uma vertical (_y_).

## 4. Topicos Avancados
- O ponto (0, 0) (lê-se: zero em `x` e zero em `y`) corresponde ao canto superior esquerdo do Canvas:  _Fig. 1.1: Sistema de coordenadas do Canvas_             ###  1.2  Começando a desenhar   #### Métodos _fillRect_ e _strokeRect_  Uma vez obtido o contexto gráfico, podemos configurar várias propriedades e chamar nele os métodos de desenho.
- Por exemplo, para desenhar retângulos, podemos usar os métodos:    * `fillRect(x, y, largura, altura)`: pinta completamente uma área retangular;   * `strokeRect(x, y, largura, altura)`: desenha um contorno do retângulo.
- Os valores `x` e `y` corresponderão à posição do canto superior esquerdo do retângulo.
- A partir daí, o retângulo vai para a direita (largura) e para baixo (altura).
- Veja um exemplo de código para desenhar um retângulo no Canvas, nosso primeiro exemplo prático completo:                1 <!-- arquivo: retangulos-1.html -->      2 <!-- este código vai dentro do body -->      3 <canvas id="meu_canvas" width="200" height="200"></canvas>      4 <script>      5    // Canvas e contexto      6    var canvas = document.getElementById('meu_canvas');      7    var context = canvas.getContext('2d');      8          9    // Desenhar um retângulo     10    context.fillRect(50, 50, 100, 100);     11 </script>       Não é simples de fazer?
- O resultado será um simples retângulo preto.
- Um _path_ é um conjunto de comandos de desenho que ficam registrados na memória, aguardando os métodos _fill_ (preencher) ou _stroke_ (contornar) serem chamados.
- Porém, antes de tudo, devemos chamar o método _beginPath_ (iniciar caminho) para apagar os traçados feitos previamente.
- Um arco é uma parte de uma circunferência, e serve para criar linhas curvas.
- Uma circunferência, para o Canvas, é nada mais que um arco de 360 graus.

