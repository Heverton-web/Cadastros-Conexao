---
name: epub-colet-nea-front-end
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (EN).
---

# Epub Coletanea Front End — Passos Operacionais

Conteudo extraido do livro 'Epub Coletanea Front End'. Contem passos, tecnicas e principios baseados na obra original.

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


  - Quando desenvolvemos pensando primeiro nos cenários mais limitados, conseguimos planejar nosso desenvolvimento de modo a tornar nosso site minimamente acessível nesses cenários. No entanto, isso pode ser restritivo para o processo criativo de desenvolvimento de um site. Imagine, por exemplo, que você precisa fazer uma página mostrando as funcionalidades de um aparelho celular novo. O jeito mais simples e que atende a todos os usuários é simplesmente montar uma lista dessas funcionalidades, possivelmente com imagens ilustrativas. Porém, pensando dessa forma, você pode acabar deixando de apresentá-las de uma forma mais criativa, como um menu interativo. Para não correr esse risco, vale a pena pensar primeiro em como queremos que nosso site fique no final para, daí, começar a implementar pelo cenário mais limitado. Essa ideia de projeto final, inclusive, pode servir de guia para soluções mais criativas mesmo nesses primeiros cenários.

  - Depois de algumas semanas estudando o processo, eu, Daniel Araujo e Marcello Manso começamos a criar um framework interno que prometia revolucionar a forma como criávamos formulários para os sistemas internos da Petrobras. O ponto alto do projeto foi o Grid criado, pois, para ajustarmos nosso formulário para qualquer container de qualquer sistema, teríamos que criar uma solução adaptativa em porcentagem. Isso me levou a uma imersão dentro do grid 960 criado por **Nathan Smith** , até então o GRID mais importante do mundo quanto à diagramação Web. Adaptando o sistema de grid criado por Nathan, criamos um framework fluido baseado em 12 colunas, proporcionando-nos muita agilidade e flexibilidade na criação de formulários Web. Acredito que isso só foi possível por causa da criação da propriedade `box-sizing`, que permitiu fazer um input com `padding` e `border` ocupar 100% da área de um container.

  - Desde 2003, no começo da minha carreira dentro de empresas, a ideia de padronizar componentes sempre esteve presente em mim. Sempre fui um metódico compulsivo, que guardava referências em pastas separadas por componentes, e não eram só referências: eu criava códigos desses artefatos separados para que todo o time tivesse acesso e perpetuasse esse grande repositório. No caso da Petrobras, quando comecei a fazer parte do time de produto, identifiquei que existia um grande retrabalho para cada projeto criado. Acredito que qualquer retrabalho é um sintoma, pois dá visibilidade a um problema de processo, seja causado por gargalos, insegurança, ego, preguiça ou falta de experiência. Assim sendo, comecei a mapear todos os componentes que eram utilizados em mais de 2 projetos, para começar a intermediar perante a equipe uma forma de padronizarmos o artefato.

  - Bernard De Luna atua em projetos digitais desde 1999, já participou de diversos projetos do Brasil, EUA, Inglaterra, França e Austrália. Nos últimos anos liderou time de produtos na Petrobras, foi diretor criativo da Melt DSP, coordenador de produto da Estante Virtual e atualmente é Head de produto no Videolog e co-founder do Freteiros.com. Especializado em Front-end, Design funcional e Marketing Digital, Bernard já deu mentoria na Lean Startup Machine, é mentor da Papaya Ventures e da Codemy, já palestrou em mais de 70 eventos pelo Brasil, além do evento internacional do W3C, Startup Camp LATAM e HTML5DevConf, entre outros. No tempo vago, adora tirar foto do seu cachorro com a hashtag #jupidog, tem uma mania feia de falar em terceira pessoa e se autointitula "sexy web projects specialist".

  - Por exemplo, imagine que desenvolvemos uma _web app_ para o Firefox OS. Nossa app deverá realizar _polling_ , isso é, deverá, de tempos em tempos, acessar uma determinada fonte de dados para checar se há informação nova disponível — digamos, por exemplo, que nossa app pergunta ao Facebook de 10 em 10 segundos se há algo de novo no _feed_. Em um intervalo de 1 hora, nossa aplicação fará **360 requisições** só para saber se há algo de novo. 360 requisições por hora pode facilmente comprometer a bateria de um dispositivo móvel. O ideal seria, por exemplo, fazer essas requisições de 30 em 30 segundos (baixando a quantidade de requisições por hora para 120) quando o dispositivo não estiver carregando e manter a frequência de 5 segundos para quando estiver conectado a uma fonte de energia.

  - Agora, em projetos em que há uma dependência muito grande de recursos modernos dos navegadores, como num jogo ou um site que trabalha com a webcam do usuário, o _progressive enhancement_ acaba não trazendo vantagens e, por outro lado, pode dificultar o desenvolvimento. Nessas situações, é possível desenvolver uma versão mais simples, sem as funcionalidades principais, para os cenários mais limitados, usando _progressive enhancement_. Essa abordagem é seguida, por exemplo, pelo Gmail, o serviço de e-mail da Google. A versão principal do cliente web é desenvolvida usando recursos avançados de JavaScript. Para simplificar o desenvolvimento dessa versão e ainda permitir o acesso aos e-mails nos navegadores mais limitados, foi desenvolvida uma versão baseada apenas em HTML.
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


  - Certa vez, estava dando um treinamento para uma instituição de ensino e um dos exercícios práticos era dividir a turma em 2 grupos, sendo que eles teriam 5 minutos para criar o planejamento de corte da página do Facebook, determinando os componentes e criando o padrão de classes. O resultado foi surpreendente! O primeiro grupo criou as classes focadas nos componentes, utilizando `btn-` e `comment-`, enquanto o outro grupo criou classes focando nas ações `edit-` e `link-`. No fim, peguei o capitão de cada grupo e coloquei para explicar o planejamento produzido pelo outro time. Reconheço que foi engraçado ver as tentativas de ler e entender padrões como `b-` e `f-`, ainda mais sabendo que alguém de fora nunca pode julgar que o padrão de um time não está certo.

  - Não gosto do nome das classes do Bootstrap v2, nem da não separação entre o nome e o número. O Foundation e a nova versão do Bootstrap já possuem um nome mais elegante e mais organizado. O que mais me incomoda nesses sistemas de GRID é a utilização de "row" para incluir as colunas. Você é obrigado a penalizar o seu HTML, incluindo tags sem valor algum, simplesmente para conseguir fazer linhas de colunas. Definitivamente, criar um framework de GRID é analisar bastante o custo x benefício de poluir algo em função de um sistema reutilizável. Dentro dessas opções, escolhemos o Semantic.gs (<http://semantic.gs>) que, diferente dos demais, não engessa quantidade de colunas na marcação, não polui o HTML e é extremamente configurável através de pré-processadores.

  - Todo projeto tem uma origem, uma necessidade e um problema para resolver. Quando criamos um produto/serviço, queremos resolver um problema para alguém, ou somos ousados a ponto de criar um novo problema para alguém. Como desenvolvedores, nós podemos criar uma _checklist_ de problemas predefinidos que temos ao iniciar um projeto, afinal todo projeto que se preze deveria ser preparado para ser acessível, semântico, performático, testável e sustentável. Há alguns anos, um grande problema começou a ganhar um pouco mais de popularidade: a reutilização de trechos de código. Seja HTML, CSS ou JavaScript, esses trechos, conhecidos como módulos, funcionam como peças de _LEGO_ que, somadas estrategicamente, criam projetos flexíveis, padronizados e organizados.

  - Infelizmente, isso dificilmente acontece em um cenário real. Normalmente temos que lidar com um público-alvo pouco conhecido, dificuldades na hora de tomar decisões de produto mais técnicas junto ao cliente e limitações no orçamento e no prazo de entrega. Ainda assim, é possível aplicar o _progressive enhancement_. Se não sabemos qual o cenário mais limitado a que vamos atender, podemos começar pelo mais limitado. Se não temos orçamento e/ou prazo suficientes para desenvolver todas as funcionalidades desejadas, podemos entregar as que atendem aos cenários mais limitados primeiro. Se o cliente não sabe quais tecnologias os visitantes do site vão usar para acessar o conteúdo, começamos com o mínimo possível de tecnologias.
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

