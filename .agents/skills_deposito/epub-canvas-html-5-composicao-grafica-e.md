---
name: epub-canvas-html-5-composi-o-gr-fica-e-interativid
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Canvas Html 5 Composicao Grafica E — Passos Operacionais

Conteudo extraido do livro 'Epub Canvas Html 5 Composicao Grafica E'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Nenhuma parte deste livro poderá ser reproduzida, sob qualquer meio, especialmente em fotocópia (xerox), sem a permissão, por escrito, da Editora.
- Para uma melhor visualização deste e-book sugerimos que mantenha seu software constantemente atualizado.
- Editor: Sergio Martins de Oliveira   Diretora Editorial: Rosa Maria Oliveira de Queiroz   Assistente de Produção: Marina dos Anjos Martins de Oliveira   Revisão de Texto: Maria Helena A.
- Oliveira   Eletrônica: SBNigri Artes e Textos Ltda.
- Capa: Trama Criações   Produçao de e-pub: SBNigri Artes e Textos Ltda.
- Técnica e muita atenção foram empregadas na produção deste livro.
- Porém, erros de digitação e/ou impressão podem ocorrer.
- Qualquer dúvida, inclusive de conceito, solicitamos enviar mensagem para brasport@brasport.com.br, para que nossa equipe, juntamente com o autor, possa esclarecer.
- A Brasport e o(s) autor(es) não assumem qualquer responsabilidade por eventuais danos ou perdas a pessoas ou bens, originados do uso deste livro.
- ISBN Digital: 978-85-7452-700-0   **BRASPORT Livros e Multimídia Ltda.**  Rua Pardal Mallet, 23 – Tijuca   20270-280 Rio de Janeiro-RJ   Tels.


  - Falar em bibliotecas de códigos em JavaScript nos remete a recursividade. Esse termo representa a maneira de resolver um problema, dividindo-o em problemas menores, porém do mesmo princípio. Dentro dessa perspectiva­, é muito atraente pensar na possibilidade de termos em mãos diversos métodos que reduzem as tarefas de mesma natureza a tarefas menores (subtarefas). Como exemplo, imagine ter que reescrever uma sentença longa toda vez que precisar desenhar um círculo, utilizando de sete a oito linhas para concluir a tarefa. No mundo do “copiar e colar” pode-se duplicar essas linhas e alterar as propriedades, o que parece, grosso modo, ser uma ótima solução. Mas o resultado disso seria uma quantidade desnecessária e absurda de linhas de programação.

  - O uso de amostragem gráfica utilizando CANVAS é resultante de uma releitura no desenvolvimento web, onde é perceptível a obrigatoriedade de uma nova roupagem para os sites contemporâneos. Os menus clássicos de navegação e múltiplas páginas são substituídos por _single-pages_ e navegação vertical com efeitos de sobreposição e deslocamento atribuídos sobre a rolagem da página. Unidos a essas novas estratégias entram os objetos gráficos inseridos a partir do objeto CANVAS. O uso dessa tecnologia remete a um nível de alta criatividade, onde designers e diretores de arte encontram um ambiente ideal para criação de experiências visuais ricas para internet.

  - Nosso “marcador de tempo” é a variável  tempo,  a qual representa o  timestamp  recebendo o valor do método  Date.getTime()  processado com retorno em milissegundos. A variável  newX  controla o incremento dos valores relacionados à posição horizontal da forma desenhada por intermédio de  bezierCurve().  A variável  flag  controla a execução da animação mediante o valor de x referente a uma das extremidades da forma que tende a colidir com a parede do lado direito do CANVAS. Caso isso aconteça,  flag  receberá o valor  false  e a animação será interrompida.

  - O elemento  <canvas> torna-se, cada dia mais, um padrão de uso na interpretação de gráficos para web, sendo utilizado largamente em estruturas de jogos complexos e web sites em HTML5. Porém, os dispositivos que o interpretam, como navegadores e smartphones, ainda são limitados. Nessa perspectiva, precisamos otimizar o processo de interpretação dos elementos renderizados sobre o contexto 2D do CANVAS para garantir entrega e velocidade nos trabalhos oferecidos. Seguem algumas sugestões úteis para melhorar a performance dos seus projetos em CANVAS.

  - A função  calculo  fornece dois parâmetros denominados  a  e  b  . Tenha em conta que parâmetros suportam quaisquer nomes desde que não iniciem com números nem hifens. É uma boa prática utilizar nomes que sejam referências ao objetivo do parâmetro – como exemplo, imagine uma função que utiliza parâmetros destinados a receber valores de posições horizontais e verticais para um objeto. Nesse caso, os parâmetros podem receber nomes como  posX  e  posY  , boas referências que remetem à lembrança de que estamos lidando com posicionamento.

  - Para se desenhar sobre um **contexto** utiliza-se do método  getContext()  contido na API 2D do objeto CANVAS. Este método permite adicionar texto, imagens, vídeos, formas geométricas, linhas e curvas em formatos de cor sólida e gradiente a um contexto, que por sua vez é projetado visualmente na página do navegador por intermédio do elemento de marcação HTML  <canvas> . Cada objeto CANVAS possui seu próprio contexto, individual e de livre manipulação, referenciado por um atributo  id  do elemento de marcação ao qual pertence.
## 2. Principios e Tecnicas
- Fax: (21) 2568.1415/2568.1507   **e-mails:**  marketing@brasport.com.br   vendas@brasport.com.br   editorial@brasport.com.br   **site: www.brasport.com.br**  **Filial**  Av.
- Paulista, 807 – conj. 915   01311-100 – São Paulo-SP   Tel.
- Fax (11): 3287.1752   e-mail: filialsp@brasport.com.br    #   _Este livro é dedicado a todos que possuem a sede do conhecimento, àqueles que têm coragem para enfrentar suas próprias dificuldades e aos que fazem dos desafios os degraus para alcançar seus objetivos._   #   Agradecimentos   Agradeço a Deus por me prover de coragem, saúde e discernimento.
- Agradeço a minha esposa e meus filhos, por me apoiarem incondicionalmente.
- Ao meu editor Sergio Martins de Oliveira e ao amigo Paulo Madson, dono de uma simplicidade sem igual, que me incentivou a escrever este e muitos outros livros.    #   Sobre o Livro   Este livro se destina àqueles que pretendem adquirir conhecimentos a respeito dos recursos de composição gráfica do objeto CANVAS, sobre a manipulação de pixels em contexto 2D gerando desenhos e formas vetoriais e sobre interatividade e controle para exibição e design de interação em páginas web.
- A fim de alcançar tais resultados, o leitor é orientado a conhecer detalhadamente os conceitos e objetivos do objeto CANVAS em conjunto com a linguagem de programação JavaScript.
- O livro atende aos leitores que possuam conhecimentos na linguagem HTML e tenham noções de JavaScript, bem como um conceito razoável em lógica de programação.    #   Sobre o autor   **PALESTRANTE**  Roque Fernando possui larga experiência com palestras, tendo atendido a plateias com até quinhentos participantes.
- Conheça mais sobre as palestras do autor ( **Tendências do mercado na era digital** e **Hora de mudar – pense, conquiste, realize** ) em seu site:   www.roquefernando.com.br.   **GESTOR EMPRESARIAL**  Elemento9, fundada em 2009, é uma empresa que desenvolve soluções em sistemas _online_ e HTML5 para as mais diversas finalidades.
- Como arquiteto da informação, o autor coordena projetos que envolvem desde _hotsite­_ , portais e comércio eletrônico, incluindo aplicativos para tablets e jogos educativos.
- E9 Mídia, fundada em 2011, é uma empresa do ramo de _Digital Signage_ e TV Corporativa.


  - <canvas> é um elemento de marcação da linguagem HTML. O padrão atual para desenvolvimento de interfaces web usa convenções do HTML5, que seguem as definições e recomendações do W3C. A estrutura semântica de um documento HTML5 é dividida em seções representadas pelo elemento  <section> . Contidos nas seções ficam um ou mais artigos representados por elementos  <article> . Assim como o corpo do documento HTML  <body>,  cada  <article> conta com elementos de marcação para cabeçalhos  <header> e rodapés  <footer> .

  - **Nota importante:** os parâmetros x e y, em ambos os métodos, são coordenadas do ponto final de referência para criação de curvas. Diferentemente de programas como Photoshop e Illustrator, onde os desenhos feitos por intermédio de uma caneta são reproduzidos em tempo real incluindo a visão e o controle das suas alças de Bézier, os desenhos criados por curvas quadráticas ou de Bézier em CANVAS requerem tempo e paciência do desenvolvedor, caso sejam desenvolvidos especificamente a partir do código JavaScript.

  - Do leque das empresas para as quais Roque Fernando prestou consultoria especializada constam o Mackenzie, Telefônica, Pearson Education, CTI – Centro Tecnológico Aéreo Espacial, Anglo Vestibulares, Editora Abril, Certisign, Editora Globo, WMaccan, Impacta Tecnologia, entre outros. Sua consultoria é baseada na análise crítica da usabilidade em aplicativos _online_ , sites e sistemas de informação com foco na arquitetura da informação e gerência de projetos digitais para web com foco em HTML5.

  - O método  window.requestAnimationFrame()  é atualmente recomendado para criar esquemas de animação. As animações compreendem movimentar linhas, imagens, textos e formas. Para controlar o fluxo das animações temos recursos diversos, como o carregar de uma página, o clique do mouse, o arrastar do mouse, o movimento do mouse sobre a tela, a rolagem, entre outros. Com JavaScript temos total alcance das informações globais do CANVAS, suas coordenadas de tela e seus objetos criados no contexto 2D.
## 3. Aplicacoes Praticas
- Com olhar no futuro, Roque Fernando idealizou o software de distribuição em Mídia Indoor E9Play, que atualmente é utilizado em faculdades, comércios, prefeituras e eventos.   **CONSULTOR EM TI – ARQUITETO DA INFORMAÇÃO**  Do leque das empresas para as quais Roque Fernando prestou consultoria especializada constam o Mackenzie, Telefônica, Pearson Education, CTI – Centro Tecnológico Aéreo Espacial, Anglo Vestibulares, Editora Abril, Certisign, Editora Globo, WMaccan, Impacta Tecnologia, entre outros.
- Sua consultoria é baseada na análise crítica da usabilidade em aplicativos _online_ , sites e sistemas de informação com foco na arquitetura da informação e gerência de projetos digitais para web com foco em HTML5.    #   Apresentação   Durante uma década desenvolvi aplicações envolvendo _bitmaps_ e gráficos vetoriais para web utilizando o Adobe Flash.
- Escrevi livros e material didático para sala de aula.
- Palestrei sobre o ganho em trabalhar esses elementos dentro do ambiente Flash, postei em blogs, em sites de conteúdo, gravei videoaulas.
- E então surgiu um novo conceito chamado HTML5 que, a princípio, me fez resistente à ideia de que o cenário estava prestes a mudar radicalmente com relação a desenvolvimento para web.
- Com o tempo, ficou nítida a importância do HTML5 e dos inúmeros recursos dessa tecnologia.
- A quantidade de recursos, possibilidades e novos conceitos envolvidos no desenvolvimento de aplicativos e conteúdo web nos leva a perceber que os sites já existentes, sem exceção, já ficaram ultrapassados.
- Estamos numa nova era do desenvolvimento para internet, a era HTML5, da web semântica.
- Se você tem um histórico parecido com o meu, saiba que o HTML5 possui ferramentas suficientes para produzir quaisquer resultados que o Flash produza e que não há motivos para manter animações, sistemas ou quaisquer conteúdos na web em formato Flash.
- Este livro descreve com detalhes os conceitos e métodos programáticos que produzem objetos geométricos, composições gráficas com uso de imagens e vídeos, mesclas, transparências, controles de vídeo, animações e interatividade dentro do objeto CANVAS.

## 4. Topicos Avancados
- É importante que o leitor tenha ciência de que trabalhar com CANVAS requer programar em JavaScript, o que, por sua vez, requer lógica de programação.
- A _tag_ <canvas> é apenas a marcação HTML que representa literalmente sua conotação semântica: tela, lona, pano de fundo.
- Portanto, a marca <canvas> define a existência de uma tela destinada a receber os elementos de sua composição gráfica e seus respectivos comportamentos.
- Desenvolver em CANVAS remete a ter poder visual, poder em questão de processar diversas imagens em alta resolução numa única página em conjunto com vídeos e objetos vetoriais formatados em pixel.
- Por exemplo, ao adicionar uma definição de tamanho de texto:   _section article canvas#cv1,section article canvas#cv2 {   border:solid 1px #000; _ font-size:14px;   _}_  Elementos, atributos e objetos de linguagem usam fonte mono espacejada, por exemplo:   O atributo  required  dispara a obrigatoriedade de preenchimento para campos de texto de um formulário.   **Comentários sobre o código**  Quando necessário, o livro exibirá um comentário sobre o código do assunto em questão.
- Os exercícios descritos neste livro foram testados no navegador Chrome em sua versão mais atual.
- Para informações sobre compatibilidade utilize sites como www.3cschools.com.   **Verificação dos** logs  **e dos erros.** Teste o resultado dos seus arquivos HTML em um browser (preferencialmente o Chrome).
- Pressione F12 caso queira verificar os _logs_ de erro ou valores de objetos e variáveis exibidos por intermédio do painel existente na barra inferior do navegador, acionado com o botão **Console** .   **CANVAS ,** <canvas> **e canvas**  Quando o livro menciona o elemento de marcação do HTML ( _tag_ ) o formato escolhido para escrita foi  <canvas> .
- Quando a referência passa a ser direcionada ao objeto controlado via JavaScript, a escrita muda para **CANVAS­** .
- Ao referenciar o conceito sobre o tema, que é utilizado largamente em programas como Photoshop e Fireworks, menciona-se apenas **canvas** .    #  Sumário   1\.

