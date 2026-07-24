---
name: epub-css-eficiente-t-cnicas-e-ferramentas-que-faze
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Css Eficiente Tecnicas E Ferramentas Que Fazem A — Passos Operacionais

Conteudo extraido do livro 'Epub Css Eficiente Tecnicas E Ferramentas Que Fazem A'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- As queridas folhas de estilo que tanto amamos ─ e, às vezes, odiamos ─, que estão conosco, os desenvolvedores _front-end_ , na maioria dos dias de nosso trabalho!
- Desde que nosso colega norueguês **Håkon Wium Lie** brindou o mundo com sua invenção inteligentemente chamada de _Cascading Style Sheets_ (CSS), muita coisa já aconteceu com essas danadinhas!  _Fig. 1.1: Håkon Wium Lie tentando convencer o W3C a aprovar as CSS_          Atualmente, é possível alcançar com CSS o que, até não muito tempo atrás, não se passava de sonho ou do uso de muitos códigos JavaScript.
- Devido a suas modernas características recentes, CSS se popularizou e ganhou os corações de muitos desenvolvedores e entusiastas por todo o mundo!
- As Folhas de Estilo não são tão complicadas de se aprender.
- Ao contrário, são populares justamente pela sua facilidade e rápido início, aliado à visualização imediata do que se está fazendo!
- Entretanto, como qualquer aspecto de nossas vidas, também existe o lado ruim.
- Com o passar do tempo, essa facilidade de uso trouxe um lado negativo ao ecossistema de estilização para web: a adoção involuntária de más práticas de uso.
- Não que isso tenha sido algo maquiavélico, uma conspiração de meia dúzia de _webdevs_ maléficos rumo à disseminação de práticas ruins.
- Por conta disso e por ninguém ter avisado que não era certo, essas más práticas simplesmente se propagaram...  #### Com a palavra: quem entende do assunto  O Autor tem a felicidade de manter contato com alguns dos grandes nomes do cenário mundial quando o assunto é CSS.
- Certamente, o que pessoas como **Harry Roberts** e **Jonathan Snook** pensam sobre boas práticas conta bastante!


  - _Isso se dá, principalmente, devido a uma série de princípios fundamentais de CSS que tornam inerentemente mais difícil a gestão de qualquer projeto de UI não trivial: é impossível encapsular totalmente regras, então todas elas têm a capacidade de herdar ou repassar estilização de e para outras; nada é imutável, logo, é possível acidentalmente desfazer ou interferir com outras regras no projeto; não existe fluxo de controle ou lógica, o que significa que não há nenhuma pista sobre a forma ou o estado do projeto; sua sintaxe liberal (loose syntax) torna muito fácil que as pessoas façam a coisa errada; há total dependência da ordem do código, o que significa que, se porções de código são movidas (ou adicionadas em partes erradas do projeto), um monte de outras coisas podem (potencialmente) quebrar; a especificidade trabalha contra alguns dos outros princípios de design do core da linguagem; e o fato de ser tão simples significa que todo mundo que mexe com CSS, muitas vezes, tem sua opinião de como as coisas devem ser feitas, o que leva a colisões e confusão._

  - **Jonathan Snook** é um desenvolvedor canadense que, assim como você, percebeu que a maneira como o CSS é escrito e gerenciado poderia ser melhor. Evidentemente, o fato de ter trabalhado durante anos em um sem-número de projetos ─ inclusive para grandes empresas, como Yahoo!, mesma empresa que Sullivan, do CSS orientado a objetos, do capítulo [3](index_split_003.html#chapter-css-orientado-a-objetos)) ─ o ajudou a constatar isso. Ante tamanha indignação e com intuito de auxiliar os colegas desenvolvedores, como também a si próprio, decidiu normatizar determinadas regras para que isso fosse possível. Em 2011, 2 anos depois do surgimento de OOCSS, surgiu **SMACSS**.

  - A Sra. Sullivan ─ na verdade, não sei se ela é casada, mas mantenho o Sra. em sinal de respeito ─ gentilmente disponibilizou um wiki no GitHub (<http://goo.gl/rBwNjN>). O repositório contém um projeto bem ferramentado para brincar com OOCSS, contando com uma configuração de VM com Vagrant, comandos `make` e outras características bonitas de se ver, e um domínio com exemplos práticos dos conceitos de OOCSS para facilitar a disseminação de suas ideias (<http://goo.gl/cCFAhH>). Acessando estas referências, você pode encontrar mais informações a respeito de CSS Orientado a Objetos e continuar seus estudos.

  - Além de serem "anzóis de estilo", IDs são utilizados como identificadores de fragmentos específicos da página (um `href` que termina em `#ancora` leva ao elemento de ID _âncora_) e para uso de JavaScript. Se já existem IDs na página por outras razões, por que não reutilizá-los para estilizar? O problema é que isso torna o código fragmentado: há dependências entre CSS e JavaScript e/ou um identificador de fragmento. Usando classes, é possível decidir mudar para um (novo) esquema de nomeação a qualquer momento e tudo com que é preciso se preocupar é alterar alguns nomes no CSS e HTML.

  - Já que estamos lidando com Node, um arquivo `package.json` na raiz do projeto se faz necessário para indicar quais módulos serão usados. É possível que o Node o crie automaticamente com `npm init`, o que iniciará um prompt interativo que perguntará um monte de coisas (tais como: nome do projeto, versão, descrição, licença, autor etc.). Na verdade, para começar a adicionar módulos, só é preciso que esse arquivo seja um JSON válido (mais sobre JSON em <http://goo.gl/bofIoU>). Um JSON válido mínimo não passa de `{}`. Caso queira ser mais prático, basta executar:

  - A diretriz também pode significar o uso de classes para nomear objetos e componentes, em vez de confiar somente na semântica HTML. Por exemplo, um objeto de mídia com `class="media"` e seus componentes com `class="img"` (para componentes de imagem e vídeo) e `class="bd"` (para componentes de texto). Ao referenciar essas classes nas folhas de estilo, o HTML ganha uma flexibilidade maior; ou seja, se um novo elemento de mídia surgir nos próximos anos (como `<svg>`), ele pode receber a estilização sem que seja preciso mexer em sequer uma linha de CSS!
## 2. Principios e Tecnicas
- Para enfatizar o quão importante é adotar as boas práticas que estão presentes neste livro, o Autor perguntou a estas duas sumidades: _Por que uma Arquitetura CSS é importante?
- E por que precisamos de uma?_  **Harry Roberts** , do **CSS Wizardry** (<http://goo.gl/sXt93d>), criador da metodologia ITCSS ([9](index_split_009.html#chapter-itcss)) que chega ao Brasil com exclusividade por meio deste livro, respondeu:  _CSS é incrivelmente fácil de escrever ─ incrivelmente fácil ─, mas possui uma ordem de magnitude mais difícil para se gerir, manter e escalar.
- Uma arquitetura CSS nos fornece uma forma estruturada de escrita e gerenciamento de CSS de uma forma que tanto contorna ou doma essas esquisitices, quanto dá aos desenvolvedores um conjunto de regras e diretrizes a seguir a fim de continuar a escrever CSS que é amigável, são, simples de compreender e mais fácil de escalar._  **Jonathan Snook** , criador do SMACSS ([4](index_split_004.html#chapter-smacss)), disse:  _Sistemas grandes, complexos, em crescimento, precisam de organização.
- Todos estes precisam de alguma maneira de dar sentido à complexidade.
- Programação orientada a objetos existe há décadas como uma maneira de estabelecer a ordem em meio ao caos.
- Desenvolvimento server-side tem sido por anos a ascensão popular de frameworks MVC.
- JavaScript tem sido a ascensão de ferramentas para gerenciamento de dependência._  _Somente nos últimos anos, temos visto qualquer tentativa de organizar CSS de uma forma sensata.
- Abordagens como OOCSS e SMACSS surgiram para proporcionar entendimento mais facilitado de projetos, permitindo qualquer um a, rapidamente, "pular dentro" e ser mais produtivo, a ser capaz de fazer isso sem a sensação de que tudo vai desmoronar quando alguma mudança é feita._  Estas são palavras de eminentes desenvolvedores front-end do planeta Terra.
- Se elas não são suficientes para fazer você chegar à conclusão de que uma Arquitetura CSS mais robusta é **imprescindível** para projetos front-end profissionais, então não há mais nada no mundo que o fará!  #### Conclusão  Este livro tem o objetivo de ajudar, pelo menos um pouquinho, a disseminar algumas boas práticas e tecnologias interessantíssimas para se escrever e manutenir projetos CSS, para você que já trabalha (ou trabalhou) com as Folhas de Estilo e quer aprimorar seu trabalho, passando a escrever **CSS eficiente**.
- Portanto, nele você **não vai** encontrar explicações básico-teóricas como: o que é e como é formada uma regra CSS; regras de usuário, de navegador e de autor; comparativo entre CSS inline, incorporado e externo; qual a diferença entre IDs e classes; o que são pseudoclasses e pseudoelementos; quais as propriedades CSS existentes e valores possíveis para cada etc.


  - Pode parecer estranho e um pouco difícil de se entender rapidamente, mas, diferentemente do que a maioria dos ocidentais, que costumam ler da esquerda para a direita, **seletores CSS são lidos da direita para a esquerda** pelos navegadores. Para tentar compreender o motivo pelo qual os browsers fazem isso, lembremo-nos daqueles jogos de "encontre o caminho" que brincávamos nas revistas da nossa infância. Todos nós iniciávamos a resolução pelo objetivo final do emaranhado de trajetórias, retrocedendo até um dos pontos iniciais possíveis.

  - Cada partial deve ser o mais granular e específico possível, contendo somente o código necessário para cumprir a função a que se destina. Por exemplo, um arquivo `_elements.headings.scss` deve conter tão somente regras para os títulos (h1-h6) e nada mais. Caso haja, por exemplo, uma seção em que títulos e subtítulos sejam apresentados de maneira diferente, isso poderia constar em um outro arquivo, como `_components.page-title.scss`, por meio de classes como `.page-title` e `.page-title-sub`.

  - Se leu o livro na íntegra e prestou atenção, agora você já conhece mais a fundo sobre seletores CSS ([2](index_split_002.html#chapter-seletores-css)), CSS orientado a objetos ([3](index_split_003.html#chapter-css-orientado-a-objetos)), SMACSS ([4](index_split_004.html#chapter-smacss)), BEM ([5](index_split_005.html#chapter-bem)), pré-processadores CSS ([6](index_split_006.html#chapter-pre-processadores-css)) e o novíssimo ITCSS ([9](index_split_009.html#chapter-itcss)).

  - Este capítulo não tem a pretensão de substituir o conhecimento que se encontra no livro oficial ─ que pode ser adquirido em <https://smacss.com/> por um precinho muito camarada ─; ao contrário, pretende apresentar SMACSS e passar por suas principais diretrizes para que você possa conhecer mais a respeito. Ao constatar que é um método que realmente vale a pena ser aprendido mais a fundo, você pode optar por adquirir o livro e saber de mais detalhes e nuances a respeito.
## 3. Aplicacoes Praticas
- Na verdade, muitas dessas informações nem serão úteis aqui.
- Logo, façamos um combinado: ficará subentendido que você é uma pessoa que já estudou tudo isso e agora aprimorará suas habilidades.
- Imagine que estamos cuspindo em nossas respectivas mãos e as apertando em um chacoalhar amistoso para selar esse pacto.
- Aproveite a leitura!   ##  Capítulo 2:  Seletores CSS   A maioria dos desenvolvedores front-end, principalmente os que dão menor importância à teoria, criam suas próprias regras CSS como se não houvesse amanhã.
- Embora isso seja verdade em relação a alguns prazos estabelecidos pela doce e carismática figura do gerente de projetos, as Folhas de Estilo são escritas sem planejamento, sem preparação, sem consciência e sem muitos outros atributos essenciais para que um trabalho bem feito possa ser executado.
- Se você se enquadra nessa infeliz descrição, este capítulo é importantíssimo, já que vai abordar temas como Especificidade CSS, explicação de como os seletores CSS são interpretados e outras dicas gerais.
- O intuito é a disseminação da prática de planejar a escrita de regras CSS antes de escrever código às cegas.
- Ou seja, pensar antes de fazer.
- Além da vantagem óbvia de adquirir mais conhecimentos e passar a escrever CSS melhor, você também terá condições de argumentar com o seu gerente de projetos sobre como é importante planejar suas Folhas de Estilo para obter um CSS mais eficiente e profissional.
- E se, ainda assim, não adiantar, peça a ele que me envie um e-mail para que possa ler uma ou duas verdades!  ###  2.1  Especificidade CSS   É simples escrever regras CSS: primeiro escreva o elemento, classe ou ID que se quer estilizar (aí são inclusos seletores avançados), e aplique as propriedades cabíveis.

## 4. Topicos Avancados
- Entretanto, já aconteceu de você criar uma regra e, por algum motivo, ela não "entrar em ação"?
- Quer dizer, você a criou esperando que tudo corresse bem, mas, por algum motivo, ela não foi aplicada e outra regra teve precedência?
- Provavelmente isso acontece com todos que trabalham com CSS.
- É devido à **especificidade de CSS** que isso ocorre.
- Um dos motivos de haver "Cascata" em "Folha de Estilo em Cascata" é referente, justamente, a quão específica determinada regra é, para ser "mais importante" que outras e entrar em ação em detrimento às demais.  #### O que é a Especificidade CSS?
- Desconhecer a teoria e a prática da Especificidade CSS não raramente leva a confusões, desgostos e falsas acusações de bugs ─ "Já criei a regra, mas ela não funciona!" ─, já havendo relatos de aumento de pressão e náuseas.
- Entretanto, não é algo tão difícil de se entender.
- Pense na especificidade CSS como um **sistema de pesos** que serve para determinar qual regra CSS tem precedência quando várias podem ser aplicadas ao mesmo elemento.
- Regras com maior peso têm preferência sobre regras de menor peso e, por isso, "ganharão" e "entrarão em ação" quando o navegador renderizar os estilos.  _Toda_ regra CSS tem sua especificidade implícita; portanto, mesmo não sabendo, você _já_ se vale da especificidade!
- A ideia é que, a partir de agora, você faça isso conscientemente!  #### Entendendo a especificidade CSS  Existem 4 categorias que definem o nível de especificidade a um dado seletor.

