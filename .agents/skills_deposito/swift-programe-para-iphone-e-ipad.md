---
name: swift-programe-para-iphone-e-ipad
description: >-
  Passos operacionais extraidos do livro 'Swift programe para iPhone e iPad' (PT) — iOS/Swift.
---

# Swift Programe Para Iphone E Ipad — Passos Operacionais

Conteudo extraido do livro 'Swift Programe Para Iphone E Ipad'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Nenhuma parte deste livro poderá ser reproduzida, nem transmitida, sem   autorização prévia por escrito da editora, sejam quais forem os meios:   fotográﬁcos, eletrônicos, mecânicos, gravação ou quaisquer outros.
- Como uma linguagem nova e beta, Swift ainda possui espaço para peque-   nas mudanças que podem alterar a maneira de um programador desenvolver   uma aplicação, mas nesse instante a Apple já a considera madura o suficiente   para que novos aplicativos possam ser criados com ela.
- Por ser nova, foram trazidos conceitos que estão em voga na comunidade   de desenvolvimento em geral, como podemos ver a influência da linguagem   Scala em Swift.
- Como uma linguagem compilada e com uma IDE rica, recebemos mui-   tas notificações de possíveis erros ainda em tempo de desenvolvimento, o que   1.2.
- Motivação: boas práticas e code smells   Casa do Código  evita diversos erros tradicionais, como o acesso a ponteiros inválidos na me-   mória, algo muito fácil de se proteger em Swift.
- Para desenvolvedores novos no mundo iOS, este livro busca ser um guia   que ensina diversas partes da linguagem e da API disponível durante a criação   e manutenção de uma aplicação mobile completa.
- Todos os níveis de desenvolvedores podem se beneficiar dos conceitos de   boas práticas, code smells, refatorações e design patterns apresentados no livro.  1.2   Motivação: boas práticas e code smells  O objetivo desse livro não é somente guiá-lo através de sua primeira aplicação   iOS, mas sim de ser capaz de julgar por si só o que é uma boa estratégia de   programação, por meio da introdução de uma dezena de boas práticas e code   smells que facilitam ou dificultam a manutenção do código com o passar do   tempo.
- Um code smell é um sinal forte de que existe algo de estranho no código,   não uma garantia de que exista um problema.
- Da mesma forma, boas práticas   e design patterns possuem situações específicas que podem trazer mais mal   do que benefícios.
- Como fazemos no livro, toda situação encontrada deve ser   analisada friamente: qual o custo de manter o código como está e qual o custo   de refatorá-lo?


  - presa (Company Identifier), e um prefixo para a classe (Class prefix). Insira os valores

  - zação e término do aplicativo. É esta classe que inicializa o nosso controller principal

  - view selecione o Attributes Inspector em View -> Utilities -> Show Attributes Inspector,

  - existe a documentação, e o Xcode torna bastante fácil o acesso a ela: basta abrir o pai-

  - File -> New -> File...), e selecione o template Objective-C class. Clique no botão Next,

  - Button, com os textos “Dissolver”, “Virar página”, “Subir vertical” e “Girar horizontal”
## 2. Principios e Tecnicas
- Saber pesar e tomar decisões como essa diferenciam um programador   iniciante de um profissional e é isso que buscamos aqui: não somente ensinar   a programar, mas sim criar profissionais em nossa área.
- São dezenas de boas práticas, design patterns e code smells catalogados   no decorrer do livro que podem ser acessados diretamente através do índice   remissivo.  1.3   Agradecimentos  Gostaria de agradecer ao desafio proposto pelo Paulo Silveira e o Adriano   Almeida.
- Não é fácil escrever um livro de boas práticas de linguagem e API   quando uma é tão nova e a outra carregada de decisões antigas.
- É delicado   entender as implicações de cada decisão da linguagem, mas o aprendizado   que passamos por este projeto é o que trouxe a ele tanto valor.  2   Casa do Código   Capítulo 1.
- Introdução  Um agradecimento especial ao Hugo Corbucci que tanto nos ajudou na   revisão do livro, e ao Rodrigo Turini, ambos compartilharam conosco os bugs,   as dificuldades e as alegrias de utilizar e ensinar uma linguagem ainda em   desenvolvimento.
- Agradecemos também pelas conversas e discussões de pa-   drões e boas práticas com o Maurício Aniche, além do Francisco Sokol, Diego   Chohfi, Ubiratan Soares e outros.  3   Capítulo 2   Projeto: nossa primeira App  2.1   Instalando o Xcode  O processo de instalação do Xcode se tornou bem simples, basta acessar a   Apple Store e procurar pelo Xcode.
- Nossa primeira App   Casa do Código  Se você deseja usar uma versão beta do Xcode, entre no programa de beta   developers da Apple e siga o link de download de uma versão beta.
- Cuidado,   versões beta podem sofrer alterações e quebrar a qualquer instante - e que-   bram.  2.2   Nossa primeira App  Nossa aplicação será um gerenciador de calorias e felicidade.
- Como usuário   final eu faço um diário das comidas que ingeri, indicando quais alimentos   estavam dentro dela e o quão feliz fiquei.
- Meu objetivo final seria descobrir   quais alimentos me deixam mais felizes com o mínimo de calorias possíveis,   um paraíso.


  - ao controlador “Sobre”, de tal forma que sua área fique azulada, e então solte o clique.

  - irá ser utilizado no botão para retornar a tela anterior - caso nenhum valor seja infor-

  - 4) Repita os passos 1 a 3 para a tela “Inserir novo compromisso”, com o título “Inserir”

  - Por ser retangular, para criar views é necessário especificar as coordenadas x e y, além
## 3. Aplicacoes Praticas
- Para isso será necessário cadastrar refeições ( Meal) e para cada refeição   queremos incluir os itens ( Item) que a compõem.
- Desejamos listar essas re-   feições e fazer o relacionamento entre esses dois modelos, afinal uma refeição   possui diversos itens, além de armazenar todos esses dados no celular.
- Por fim, veremos o processo de execução de nossa app em um simulador,  6   Casa do Código   Capítulo 2.
- Projeto: nossa primeira App  e o de deploy de nossa app tanto em um celular particular para testes quanto   na app store.
- Isso tudo será intercalado com seções de boas práticas de desenvolvi-   mento de softwares e caixas de informações extras, ambos ganchos para que   você possa se tornar um bom programador à medida que pesquisa a infor-   mação contida nessas seções e se aprofunda nelas.
- Não se sinta obrigado a   pesquisá-las no mesmo momento que as lê, sugiro, inclusive, que você ter-   mine primeiro o conteúdo aqui apresentado para só então se aprofundar.
- Dessa forma, terá uma opinião mais formada sobre diversos itens ao entrar   nessas discussões avançadas sobre qualidade de código, usabilidade etc.
- Ao término de nossa jornada, teremos uma aplicação com diversas fun-   cionalidades, entre elas, adicionar novas refeições:  7   2.2.
- Nossa primeira App   Casa do Código  8   Casa do Código   Capítulo 2.
- Projeto: nossa primeira App  Visualizar seus detalhes e removê-las desejado:  Pronto para começar?  2.3   ViewController de cadastro de refeição  Vamos criar uma nova aplicação.

## 4. Topicos Avancados
- No Xcode, escolhemos “Criar um novo pro-   jeto” e, no Wizard que segue, escolhemos iOS, SingleViewApplication,   que seria uma aplicação de uma tela só.
- Aos poucos, evoluiremos a mesma   para mais telas.
- O nome do nosso projeto é eggplant-brownie e a orga-   nização br.com.alura.
- Escolhemos a linguagem swift e nosso alvo será o iPhone.
- A tela de   criação fica então como a seguir:  9   2.3.
- ViewController de cadastro de refeição   Casa do Código  Logo de cara abriremos a nossa janela de criação de interface prin-   cipal:   o storyboard (chamado   Main.storyboard dentro da pasta   eggplant-brownie).
- Ao clicarmos nele, somos capazes de ver uma   janela quadrada que será a primeira tela de nossa aplicação:   nosso   ViewController.
- O View Controller é chamado assim tanto por ser   responsável pela View quanto por fazer o controle do que será executado ao   interagirmos com essa View.
- Tem algo de estranho aqui, nossa tela está quase quadrada e sabemos que   um iPhone não é quadrado.
- Vamos escolher o view controller clicando no   quadrado e, em seguida, no botão amarelo que aparece no topo à esquerda   do quadrado:  10   Casa do Código   Capítulo 2.

