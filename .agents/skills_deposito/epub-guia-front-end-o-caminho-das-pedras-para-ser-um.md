---
name: epub-guia-front-end-o-caminho-das-pedras-para-ser-
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Guia Front End O Caminho Das Pedras Para Ser Um — Passos Operacionais

Conteudo extraido do livro 'Epub Guia Front End O Caminho Das Pedras Para Ser Um'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- São tantas tecnologias, metodologias, boas práticas e outros tantos tópicos que surgem todos os dias, que eu confesso: realmente, fica muito difícil acompanhar tudo.
- Além da sobrecarga enorme que é ficar testando todas as novidades.
- Eu mesmo tenho que filtrar bastante os assuntos a aprender.
- Geralmente, eu não me atenho a nada que eu não precise utilizar em algum projeto.
- Não vou aprender a utilizar um **framework** ou uma ferramenta, simplesmente porque todo mundo está comentando por aí.
- Eu preciso trabalhar, afinal de contas.
- Tenho que garantir o Jack Daniels das crianças.
- Mas, seria pedir muito ter alguém ao meu lado no início da minha carreira dizendo o que é perda de tempo?
- Muitos devs que decidem se aventurar aprendem toda a matéria sozinhos.
- Eu mesmo, quando adolescente inconsequente, não queria, nem a pau, estudar por conta própria.


  - Mas, seria pedir muito ter alguém ao meu lado no início da minha carreira dizendo o que é perda de tempo? Muitos devs que decidem se aventurar aprendem toda a matéria sozinhos. Eu nunca entendi isso. Eu mesmo, quando adolescente inconsequente, não queria, nem a pau, estudar por conta própria. Isso mudou depois que comecei a trabalhar com web. Coisas estranhas da vida! Aprender algo sozinho é interessante! Certamente, você pode acabar perdendo bastante tempo tentando descobrir o que vai torná-lo ou não produtivo. É um processo chato e trabalhoso e nem sempre você acerta. Quando estamos sozinhos, é quase certo que deixaremos passar informações importantes no processo de aprendizado. Já vi tantos bons desenvolvedores front-end que iniciaram sua carreira como autodidatas, mas não tinham ideia do que era controle de versão, WAI-ARIA ou, até mesmo, propriedades corriqueiras do CSS. Não porque eles eram desatentos, mas porque estavam focados em outros tópicos. Isso é normal acontecer quando aprendemos algo de forma não linear, e misturando fontes do conteúdo. Por isso, é tão importante ter alguém que mostre, pelo menos, a direção correta. Você economiza tempo e, talvez, até algum dinheiro nesse processo.

  - Ótimo! Agora que sabemos basicamente o que significa semântica, fica mais fácil entender sobre a estruturação semântica de layouts. As novas tags (nem tão novas assim) do HTML5 foram criadas para que possamos externar a semântica do código, não deixando o significado apenas para seu conteúdo, mas também para a estrutura onde o conteúdo se encontra. Explico melhor: imagine dois títulos na página ─ um no cabeçalho e outro no rodapé. Você sabe que o título do cabeçalho é mais importante do que o título do rodapé. Mas os sistemas de busca, como o Google, não discernem esse fato. Para ele, são dois títulos e pronto. Um no começo da página e outro no final. Por esse motivo, existem as tags `<header>` e `<footer>`. Dessa forma, em vez de criarmos `<div class="cabecalho">`, podemos criar `<header class="cabecalho">`. Os sistemas de busca ou qualquer outra coisa conseguem saber que a tag `HEADER`, por exemplo, se trata de um cabeçalho. Em consequência disso, é fácil identificar e definir a importância de cada informação de acordo com o local no qual ela foi inserida.

  - Eu sei que você já deve ter lido exaustivamente sobre a sintaxe do HTML. Mas eu próprio li, em poucos lugares, a verdadeira importância do HTML. Por esse motivo, escolhi dois assuntos interessantes que lhe darão alguma vantagem sobre o idiota, sentado ao seu lado, no dia da entrevista de emprego. Listo: hipertexto e marcação (estruturação semântica). Você pode aprender a escrever código HTML em qualquer lugar na web. Existem milhares de sites brasileiros e estrangeiros que ensinam isso. Contudo, material sobre hipertexto ou semântica são geralmente escassos e os que encontramos, principalmente os importados, são bem pesados. Quero mostrar o início destes assuntos para que você pesquise mais, posteriormente, a fim de se aprofundar. Mesmo assim, o que você absorver aqui já será de grande ajuda em projetos de todos os tamanhos.

  - O CSS é um recurso bloqueante. Um recurso bloqueante faz o browser parar de renderizar qualquer coisa na página enquanto esse recurso não for carregado. Isso significa que o browser para tudo quando encontra uma chamada de CSS no seu código. Se ele não fizesse isso, ele carregaria seu HTML e mostraria para o usuário o site totalmente sem estilos; poucos segundos depois, o site iria piscar e boom, o layout apareceria. O usuário teria um lixo de experiência. Isso acontece se você colocar o CSS no final do documento. Ele vai carregar seu HTML inteiro e o usuário verá o site primeiro sem nenhum estilo. Quando o browser chegar ao final do documento e encontrar a chamada do CSS, só então vai carregá-lo e seu usuário verá o site mudar bruscamente. O Google chama esse “acontecimento” de FOUC: _Flash of Unstyled Content_.

  - Existem três pilares principais: W3C, browsers e devs. E eu sempre presto atenção aos browsers. Se os browsers acham bacana uma determinada especificação, eles começam a adotá-la, de forma que os devs implementam essa novidade em seus projetos. O que sobra para o W3C? Seu papel é bastante importante para regulamentar estes padrões. Não creio que o W3C vá sair de cena ou algo do tipo. Ele é imprescindível para o desenvolvimento da web. Mas precisa seguir a velocidade dos devs, assim como os browsers têm feito. Por isso, é importante a atuação de representantes dos próprios browsers nos grupos de trabalho do W3C. Também que é muito importante que **você** participe das listas de discussão dos grupos de trabalho. Aqui, estão todas as listas de e-mail de que você pode participar do W3C (<http://lists.w3.org/>).

  - Isso é difícil. Bastante. Como você diz que você é popular na área em que atua sem parecer arrogante, prepotente, mala ou um metido de nariz empinado? Não dá. A galera vai interpretar mal. Eu nunca soube fazer isso e não sei fazer até hoje. É por esse motivo que muitas vezes, no início da minha carreira, eu me escondia nos eventos, não usava os crachás com meu nome e essas coisas. Leva tempo para assimilar. Mas admitir que você é popular (<http://bit.ly/1stoXjx>) tem mais a ver com as atitudes que você vai tomar dali para frente do que se importar com o que os outros vão falar. É muito sobre como você vai lidar com a situação de ser popular e como você vai usar essa vantagem (eu seria imbecil de dizer que isso não é uma vantagem) para melhorar sua carreira e, claro, ajudar outros devs.
## 2. Principios e Tecnicas
- Isso mudou depois que comecei a trabalhar com web.
- Aprender algo sozinho é interessante!
- Certamente, você pode acabar perdendo bastante tempo tentando descobrir o que vai torná-lo ou não produtivo.
- É um processo chato e trabalhoso e nem sempre você acerta.
- Quando estamos sozinhos, é quase certo que deixaremos passar informações importantes no processo de aprendizado.
- Já vi tantos bons desenvolvedores front-end que iniciaram sua carreira como autodidatas, mas não tinham ideia do que era controle de versão, WAI-ARIA ou, até mesmo, propriedades corriqueiras do CSS.
- Não porque eles eram desatentos, mas porque estavam focados em outros tópicos.
- Isso é normal acontecer quando aprendemos algo de forma não linear, e misturando fontes do conteúdo.
- Por isso, é tão importante ter alguém que mostre, pelo menos, a direção correta.
- Você economiza tempo e, talvez, até algum dinheiro nesse processo.  #### A missão deste guia  Este guia tem a missão de ajudar qualquer pessoa que queira iniciar na área de web.


  - O mercado de front-end brasileiro tem crescido bastante. Isso é bom. Isso é maravilhoso. Isso é pica das galáxias. Mas também é algo ruim. Como é muito fácil aprender HTML e CSS, ser dev front-end acaba sendo uma porta bastante acessível para muitas pessoas. Nem sempre essas pessoas se tornam profissionais engajados. Eles querem simplesmente ganhar uma grana, sobreviver e pronto. Para eles, essa profissão é como qualquer outra. Não estou dizendo que eles estão errados. Isso acontece em qualquer profissão, em qualquer país. Para esses, tanto faz o que falamos durante todo livro. Tanto faz os eventos, os meetups, as reuniões que a galera da comunidade faz durante o ano. Eles devem ser deixados de lado... Este livro foi criado para outro perfil de profissional.

  - Você já notou que todo dia surgem novos dispositivos, com diversos tamanhos e hardwares parecidos com os desktops? Qualquer celular meia-boca hoje tem a configuração mais parruda que qualquer computador antigo. Principalmente a configuração da tela, à qual os fabricantes têm dado mais atenção nos últimos anos. Logo, não há motivo para prepararmos um layout e um CSS com media type _HANDHELD_ para o iPhone, já que ele não se encaixa nessa categoria. Entretanto, o iPhone também não é nem de longe um desktop. Aí existe o problema: a media type screen se encaixaria para direcionarmos a formatação para o iPhone e outros smartphones modernos, mas a especificação é clara quando diz que a media type screen é para desktops e computadores. Como fazer agora?

  - Sempre ouvi muitas reclamações de iniciantes dizendo que faltam informações mostrando o "caminho das pedras", ensinando como e por onde começar no mercado de front-end. São tantas tecnologias, metodologias, boas práticas e outros tantos tópicos que surgem todos os dias, que eu confesso: realmente, fica muito difícil acompanhar tudo. Além da sobrecarga enorme que é ficar testando todas as novidades. Eu mesmo tenho que filtrar bastante os assuntos a aprender. Geralmente, eu não me atenho a nada que eu não precise utilizar em algum projeto. Não vou aprender a utilizar um **framework** ou uma ferramenta, simplesmente porque todo mundo está comentando por aí. Eu preciso trabalhar, afinal de contas. Tenho que garantir o Jack Daniels das crianças.

  - O Module Pattern é o básico para iniciar seu entendimento sobre encapsulamento e modularização em JavaScript. O interessante desse pattern é que ele reduz o escopo global de variáveis. Por isso será muito difícil ter problemas recorrentes de escopo de variáveis globais em projetos grandes ou com muitos integrantes na equipe. Essa característica permite criar contextos privados, onde as variáveis e funções são acessadas apenas de dentro e não de fora da função principal. Sua utilização é bastante simples. Não vou entrar nos mínimos detalhes pois alguns conceitos (closures, funções anônimas etc.) podem ser complicados para quem está começando, mas há links no final do texto que você pode seguir para entender mais sobre seu funcionamento.
## 3. Aplicacoes Praticas
- Foquei-me em desenvolvedores front-end porque é a área no qual os profissionais possuem maior familiaridade quando desejam entrar no mercado de web.
- Mesmo assim, se você é um apenas um curioso sobre o assunto, mas quer entender melhor sobre o tema, talvez este livro possa ajudar.
- Este guia vai apresentar os assuntos mais básicos e importantes, tentando auxiliar aqueles que já adentraram ou querem adentrar, agora, o mercado de web.  #### Organização por prioridade  Não separei os tópicos por ordem de dificuldade, mas sim por ordem de **prioridade**.
- Quero deixar claro que a escolha das prioridades atende a minha opinião.
- Ou seja, há milhares de pessoas aí afora que pensam diferente de mim.
- Eu decidi, aqui, o que seria mais ou menos importante aprender para ingressar na área.
- Outra ressalva que faço é que, talvez, você precise aprender um assunto mais complicado antes de passar para tópicos tido como mais fáceis.
- Por exemplo: é mais significativo que um dev front-end saiba primeiro o básico de JavaScript do que de SEO.
- Você até encontra um bom emprego sabendo apenas HTML, CSS e SEO, mas, na maioria dos casos, JavaScript costuma ser mais relevante.  #### O que este guia não é?
- Definitivamente, este guia **não** é um livro didático, logo, ele não vai ensinar nada do começo ao fim, nem tão pouco código.

## 4. Topicos Avancados
- Este livro se propõe a mostrar o "caminho das pedras", ditando o que você precisa aprender, mostrando todos os assuntos pertinentes para se tornar um dev front-end e quais os assuntos mais comentados por aí.
- Isso não quer dizer que você precise aprender tudo o que está listado aqui.
- Este livro vai ajudá-lo a decidir o que aprender primeiro.
- Mas, sem dúvida, você precisa saber que estes assuntos existem.
- Vou tentar indicar links de referências (em inglês e em português) para estudo durante o percorrer do livro.
- Tome tempo para visitá-los e estudá-los também.
- São links com muito conteúdo importante.
- Ensinar o "caminho das pedras".
- Fazê-lo entrar da maneira correta no mundo do desenvolvimento web.
- É isso que este livro se propõe a fazer.

