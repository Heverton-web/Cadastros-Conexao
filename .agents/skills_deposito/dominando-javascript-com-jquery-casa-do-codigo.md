---
name: dominando-javascript-com-jquery-casa-do-codigo
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Dominando Javascript Com Jquery Casa Do Codigo — Passos Operacionais

Conteudo extraido do livro 'Dominando Javascript Com Jquery Casa Do Codigo'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Nenhuma parte deste livro poderá ser reproduzida, nem transmitida, sem auto-   rização prévia por escrito da editora, sejam quais forem os meios: fotográficos,   eletrônicos, mecânicos, gravação ou quaisquer outros.
- Casa do Código   Livros para o programador   Rua Vergueiro, 3185 - 8º andar   04101-300 – Vila Mariana – São Paulo – SP – Brasil   Casa do Código  Prefácio  \-- Ah, você programa em jQuery?
- Mesmo que essa frase irrite um desenvolvedor experiente, ela é a principal prova   de que um framework definitivamente foi adotado em massa pelo mercado, ao ponto   de ser confundido com uma linguagem de programação.
- E esse é definitivamente o   caso quando falamos do jQuery - um framework que sem dúvidas revolucionou o   desenvolvimento web, simplificando absurdamente tarefas corriqueiras do desen-   volvimento web.
- A melhor maneira de conseguir explorar todo o potencial que o jQuery pode   oferecer, é conhecendo melhor JavaScript - a linguagem da web, e o ambiente onde   todo esse código é executado: navegadores e páginas HTML.
- Vale lembrar que esse   mesmo JavaScript extrapolou os limites, e se faz presente no backend, em jogos,   servindo de motor para implementações de novas máquinas virtuais, emulação de   hardwares antigos e até como linguagem padrão de plataformas inteiras, como Fire-   fox OS e Windows 8!
- Sim, o JavaScript passou do estigma de linguagem odiada e mal compreendida   a uma das mais interessantes e essenciais.
- E o jQuery é certamente um dos catalisa-   dores dessa mudança.
- Neste livro, Plínio Balduino parte de um código JavaScript, que estava prestes a   se tornar impossível de manter, para simplificá-lo com o uso de jQuery, enquanto   apresenta o funcionamento do framework por debaixo dos panos.
- A aplicação Ja-   vaScript tem aquele sabor que tanto conhecemos: muita manipulação de DOM e   invocações AJAX, de onde começam a brotar IFs e técnicas pouco ortodoxas (as co-   nhecidas gambiarras) para se proteger das incompatibilidades entre navegadores e   suas idiossincrasias.


  - por menor que fosse, você precisava atualizar toda a página. Isto é, cada clique fazia o

  - “Se precisa de um ‘jeitinho’ de usar, é porque a interface com o usuário está quebrada.”

  - “Por favor, não tente deixar o seu código ilegível. Eu garanto que ele ficará ilegível o

  - indica que o valor foi repetido três vezes. O console evitou imprimir o valor repetidas

  - rer 8 e versões anteriores. Isso se deve ao fato de que apenas recentemente a Microsoft

  - Como o ícone da lixeira fica dentro do nosso item da lista de tarefas, ao clicarmos ali
## 2. Principios e Tecnicas
- Muitos fizeram apostas para o futuro das linguagens de programação; Hoje ve-   mos que os que apostaram forte em linguagens estáticas estão observando, boqui-   abertos, a velocidade em que o JavaScript toma espaço no mercado.
- Justamente os  i   Casa do Código  pontos fracos da linguagem foram os que possibilitaram que ela resistisse à erosão   do tempo; sua permissividade ajudou desenvolvedores de diversas épocas a fornece-   rem funcionalidades que não estavam disponíveis (mais conhecidos como shims ou   polyfills), e no fim das contas, um “projeto de 10 dias” com quase 20 anos de idade se   tornasse nada menos do que uma das mais importantes linguagens da programação   moderna.
- O JavaScript veio pra ficar, e não vai desaparecer tão cedo.
- Como o Brendan   Eich, criador da linguagem diz:   \-- “always bet on JS”   Douglas ’qmx’ Campos  ii   Casa do Código  Agradecimentos  Agradeço aos meus pais, Luis e Isabel, pelo suporte de uma vida inteira e pela exce-   lente educação.
- Obrigado Paulo Silveira, Adriano Almeida e Sérgio Lopes, pela confiança ao en-   tregarem tamanha responsabilidade nas minhas mãos e pelo apoio e senso crítico   durante toda a produção deste livro.
- Muito obrigado, André Noel, pela gentileza de ceder um de seus trabalhos para   ilustrar este livro.
- Caso você não seja o André Noel e ainda não conhece o trabalho   dele, recomendo fortemente uma visita ao http://www.vidadeprogramador.com.br   Thank you mr.
- Brendan Eich for your work and thank you for answering my   questions so promptly and kindly.
- I’ll pay you some beers next time you’ll be in São   Paulo.
- Fazendo um momento Maguila, eu não poderia deixar de agradecer também a   Alexandre Borba, André Faria, Bruno Oliveira, Diego Plentz, Douglas Campos, Edu-   ardo Cintra, Francelino Guilherme, Igor Hercowitz, Lucas Carvalho, Marcelo Tar-   deli, Osni Oliveira, Ricardo Massuia, Rodrigo Lorca, Vinicius Baggio, aos amigos do   GURU-SP, GURU-ES e Adapti.


  - mais simples de ler, apesar de eu achar que é mais legível, mas é interessante que você

  - desgastante tanto para o cliente quanto para o servidor. Mais ainda: fica notável, para

  - multiplicar os nove primeiros dígitos por 10, 9, 8, e assim por diante respectivamente,

  - polyfills), e no fim das contas, um “projeto de 10 dias” com quase 20 anos de idade se
## 3. Aplicacoes Praticas
- Minha esposa e meus filhos sentiram o peso e preço de todo o tempo que investi   nesse livro, mas ainda assim ficaram ao meu lado, me apoiando e empurrando para   frente.
- Senti muito mais a falta de vocês do que realmente aparentou.
- Finalmente, agradeço também a você, leitor.
- Espero que vocês se divirtam tanto   lendo quanto eu me diverti escrevendo.  // Plínio Balduino   (enjoy)();  iii   Casa do Código  Sobre o autor  Desenvolvo softwares profissionalmente desde o século passado e já passei por quase   todas as plataformas de desenvolvimento para desktop, web e mobile.
- A partir de 2004 comecei a perceber o poder por trás do JavaScript e do AJAX,   mas ainda estava quebrando a cabeça fazendo tudo na mão, sem a ajuda de fra-   meworks ou bibliotecas especializadas.
- Existem muitos livros no mercado sobre JavaScript e jQuery, mas a maioria deles   acaba pecando por não mostrar realmente a linguagem, ou por apresentar os assun-   tos de maneira engessada, ou simplesmente por serem manuais de referência que   jogam todo o conteúdo sobre o leitor sem mostrar casos reais de uso e sem apresen-   tar uma motivação para que seja feito daquela forma.
- Obviamente, existem livros muito bons que eu recomendo fortemente, como por   exemplo o Javascript: The Good Parts [4], de Douglas Crockford, mas que podem ser   traumáticos para quem está começando agora.
- Minha ideia não é abraçar o mundo e escrever o livro definitivo sobre JavaScript   e jQuery, mas apresentar de maneira didática como resolver problemas cotidianos,   1.2.
- Como o livro está organizado   Casa do Código  sem tratar o leitor como criança.
- Apresentar os assuntos da maneira mais fluída e   agradável possível será o meu desafio.

## 4. Topicos Avancados
- Eu sempre gostei de livros que me apresentam uma tecnologia, me mostram   como utilizá-la e como sobreviver quando estou começando, e ainda continuam úteis   depois que eu já passei a estar confortável naquele ambiente.
- É exatamente isso que   eu quero que esse livro seja para você, leitor.  1.2   Como o livro está organizado  O livro começa com a história de uma loja virtual bem antiga que, por uma série de   razões, não utilizou JavaScript em sua versão original.
- Nos capítulos 3 e 4 eu apre-   sento a linguagem enquanto reescrevo o carrinho de compras utilizando JavaScript   puro, sem bibliotecas adicionais e com toda a dificuldade de se escrever código para   múltiplos browsers.
- A partir do capítulo 5, apresento a biblioteca jQuery e substituo quase todo o   trabalho que fizemos com JavaScript puro por chamadas mais simples.
- No capítulo 6 nós vamos desenvolver uma lista de tarefas para aprendermos   como manipular a fundo os elementos da sua página HTML.
- Aqui vamos voltar ao   nosso carrinho de compras e adicionar efeitos para deixar o visual mais atraente.
- Voltaremos à lista de tarefas no capítulo 8, dessa vez adicionando recursos de AJAX   e JSON que aprenderemos no capítulo 7, além de termos uma breve introdução ao   REST e como utilizar com jQuery.
- Vamos falar também sobre jQuery UI, seus efeitos e componentes visuais no   capítulo 9 e sobre jQuery Mobile no capítulo 10.
- Finalmente, temos o que eu considero a cereja do bolo: no capítulo 11 eu demons-   tro como utilizar orientação a objetos no JavaScript, indo além do feijão com arroz e   ensinando a usar prototipação, herança clássica e herança múltipla; no capítulo 12 eu   apresento alguns fundamentos de programação funcional e no capítulo 13 você usa   tudo o que foi mostrado no livro e aprende a criar seus próprios plugins para jQuery.
- No final do livro você encontra o capítulo 14 que dá dicas de como escrever có-   digo com jQuery que execute mais rapidamente.  1.3   Algumas palavras sobre JavaScript  Das linguagens famosas e largamente usadas, talvez o JavaScript seja a menos com-   preendida.  2   Casa do Código   Capítulo 1.

