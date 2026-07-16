---
name: epub-progressive-web-apps-construa-aplica-es-progr
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Epub Progressive Web Apps Construa Aplicacoes — Passos Operacionais

Conteudo extraido do livro 'Epub Progressive Web Apps Construa Aplicacoes'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Aplicações progressivas](index.html)   * [2\.
- Fundamentos sobre frameworks e ferramentas](02-fundamentando.html)   * [3\.
- Configurando o ambiente de desenvolvimento](03-configurando.html)   * [4\.
- Primeiros passos do desenvolvimento](04-novo-usuario.html)   * [5\.
- Componentes com estado e fluxo de eventos](05-novo-cap-5.html)   * [6\.
- Componentes complexos e domínio da aplicação](06-novo-usuario.html)   * [7\.
- Codificando os requisitos progressivos](07-requisitos-pwa.html)   * [8\.
- Publicando a aplicação em produção](08-nginx-lighthouse.html)   * [9\.
- Referências bibliográficas](99-referencias.html)     Capítulo 1  # Aplicações progressivas  PWA é um acrônimo para _Progressive Web Apps_ , ou Aplicações Web Progressivas.
- A palavra _progressiva_ vem da ideia de _Progressive Enhancement_ , ou melhoria progressiva.


  - Usar roteamento das URLs no lado do cliente (navegador) é um comportamento muito comum nas aplicações web contemporâneas. Este paradigma oferece vantagens, mas, ao mesmo tempo, exige uma certa cautela. A principal vantagem é que, após o carregamento da página (mais especificamente do JavaScript que faz o roteamento), quando o usuário clicar em um de seus links, a própria aplicação fará o tratamento da rota sem a necessidade de se comunicar com o servidor HTTP. Ou seja, o overhead – associado ao envio da solicitação ao servidor, do processamento da rota e retorno para o navegador – é poupado com uma simples rotina JavaScript que roda localmente.

  - 4. **Deve ter um ciclo de vida pequeno mas com boa manutenibilidade:** o ciclo de construção de software geralmente é longo, caro e demasiadamente desgastante à equipe e ao _owner_ (dono) do projeto. Estabelecer objetivos claros e metas intermediárias nos permite trabalhar com ciclos menores e entrega de valor a curto prazo. Considero isso como um mantra pessoal, mas caso queira se aprofundar no assunto, dê uma olhada na obra _Guia da Startup: Como startups e empresas estabelecidas podem criar produtos de software rentáveis_ , de Joaquim Torres, publicado na Casa do Código (<https://www.casadocodigo.com.br/pages/sumario-startup-guia>).

  - Vamos agora evoluir essa discussão com a efetiva criação do _modelo de domínio_ (ou Model). A palavra _domínio_ no contexto do desenvolvimento de software evoca uma ideia de representação do conhecimento que é mantido pela aplicação. Em outras palavras, ele é uma abstração do mundo real, representada em objetos _modelados_ , específica e especialmente para tornar a informação presente dentro do sistema. Às vezes, ela é enriquecida com regras de negócio, validação de dados, persistência de dados, entre outros elementos. O quão próximo a representação está do objeto real depende justamente do _domínio_ que a aplicação pretende absorver.

  - Espero que, a partir do conteúdo apresentado, você esteja apto a implementar sua própria aplicação progressiva e acompanhar a evolução do tema, que, aliás, passa por uma constante evolução e padronização. Com o passar dos dias, mais e mais sistemas mobile e navegadores suportam os requisitos PWA, com uma expectativa real de que a _Progressive Enhancement_ deixe de pertencer às _boas práticas_ de desenvolvimento web e assuma o posto de _commodity_. Ou seja, no futuro, uma página web que não funcione _off-line_ e não permita a instalação local será tão estranha aos usuários quanto uma televisão de tubo sem um controle remoto.

  - Apenas reforçando, as demais funcionalidades reutilizarão os componentes criados na tela de _Novo Usuário_ , não sendo necessário para nós, sob o ponto de vista de aprendizado, reproduzir uma codificação que não acrescentará novos conceitos. Sob o ponto de vista do entendimento do projeto **Be happy with me** como um todo, entretanto, é interessante que você compreenda seu funcionamento. Só como adendo, o código completo do projeto está disponível no repositório Git, cujo link é <https://github.com/lgapontes/behappywith.me>. Opcionalmente, você poderá estudá-las por lá, se quiser.

  - Em termos simples, certificados desse tipo são criados sem o reconhecimento formal de uma entidade certificadora (terceiro confiável). Funciona assim: os navegadores _conhecem_ uma gama de entidades certificadoras, responsáveis por certificar que uma URL provendo conteúdo HTTPS é fidedigna. Quando um navegador acessa um site seguro, ele obtém sua chave pública, valida-a com a entidade certificadora e, se tudo estiver correto, avisa o usuário de que a conexão é segura (geralmente exibindo os dados do certificado válido e um ícone do cadeado verde na barra de endereços).
## 2. Principios e Tecnicas
- Neste contexto, a ideia por trás da palavra _progressiva_ é condicionar uma aplicação a atender o maior número de pessoas possível, sob todos os aspectos.
- Não é um estudo direcionado aos tipos de dispositivos, navegadores, versões das linguagens HTML, CSS ou JavaScript.
- Trata-se da criação de uma experiência cujos usuários terão acesso contínuo sem nenhum tipo de restrição tecnológica.
- Podemos colocar da seguinte forma: desenvolver com melhoria progressiva é um paradigma em que a aplicação deverá estar disponível para todos, sejam usuários de microcomputadores ou smartphones, com browsers atualizados ou obsoletos, com conexão à internet ou não.
- Uma aplicação progressiva deve estar disponível até mesmo quando o usuário estiver offline.
- Pode parecer um absurdo, mas a ideia de construir progressivamente traz novos desafios ao desenvolvimento.
- Não podemos simplesmente ter um site _mobile-first_ com design moderno.
- Ele precisa funcionar em qualquer dispositivo, sem conexão, para todo tipo de usuário, e continuar melhorando progressivamente até o infinito e além!  > **O que é mobile-first?** >  > O termo mobile-first é um conceito de desenvolvimento de software no qual o foco são os dispositivos mobile.
- Ou seja, ao se elaborar um site, cria-se toda a organização das páginas e a exibição dos dados com foco nos usuários de dispositivos mobile, mas sem se esquecer dos usuários de microcomputador.
- Como veremos em breve, atualmente existem muitos frameworks CSS para este tipo de desenvolvimento.


  - Antes de você se debruçar sobre os parágrafos deste tópico, lembre-se de que a criação de um certificado válido está condicionada a um domínio válido (por exemplo, <https://behappywith.me>) apontando para o endereço IP do servidor cuja aplicação está sendo provida. A critério de entendimento, nossa aplicação está publicada em um servidor na nuvem AWS da Amazon (<https://aws.amazon.com/pt/>), com o DNS (_Domain Name System_ , responsável por redirecionar o domínio para o IP do servidor) e o próprio domínio registrados no Hostgator (<https://www.hostgator.com.br/>).

  - O NPM possui um tipo de dependência, conhecida como _Peer Dependencies_ (dependência de pares), que nos permite especificar quais são os _pacotes hosts_ (cuja tradução próxima seria _pacotes hospedeiros_) que um determinado _pacote plugin_ está associado. Por _pacote plugin_ , entenda aquele que **deve** ser _plugado_ a um _pacote host_ para funcionar corretamente. Então, ratificando, uma _Peer Dependency_ não significa que o _pacote plugin_ **necessita** de outro pacote, e sim que ele **deve** ser plugado a um _pacote host_ de determinada versão.

  - Além de outras minúcias que serão discutidas no futuro, estamos definindo um estado inicial com uma `cor` igual a vermelho e um `contador` igual a zero. Isso é realizado pelo atributo `this.state`. Note também que o `constructor` (um método que sempre é chamado durante a criação do objeto) recebe as propriedades através do parâmetro `props` e, em seguida, repassa-o para a superclasse `React.Component` pela sintaxe `super()`. Esta é bastante difundida em linguagens orientadas a objetos para representar a convocação do `constructor` da superclasse.

  - Não se apegue aos arquivos `README.md` e `.gitignore`, e à pasta `docs`, todos exibidos na figura. A PWA publicada no GitHub possui tais recursos. Caso você pense em publicar seu projeto em algum repositório git, sugiro que crie um arquivo `.gitignore` semelhante ao publicado no GitHub deste livro (<https://raw.githubusercontent.com/lgapontes/behappywith.me/master/front-end/.gitignore>). Ele deve ficar dentro da pasta `front-end` para evitar a publicação de códigos de distribuição e outros arquivos de tempo de desenvolvimento.
## 3. Aplicacoes Praticas
- Tudo isso parece confuso no início, mas na verdade é bem simples.
- No próximo tópico, vamos levantar quais requisitos uma aplicação precisa respeitar para ser considerada uma verdadeira PWA.  ## 1.1 Requisitos de uma aplicação progressiva  Faremos aqui um apanhado geral de todas as características que uma aplicação progressiva precisa atender.
- Existe uma ferramenta chamada Lighthouse que é capaz de gerar um relatório completo das características de uma aplicação.
- Por enquanto, vamos entender cada item deste relatório com uma breve descrição de como atacá-lo.
- A programação envolvida na resolução dos itens será aprimorada nos próximos capítulos.  > **Lighthouse** >  > Organizado e mantido pela equipe de desenvolvimento do Google, o Lighthouse é uma ferramenta de código aberto que permite qualificar aplicações web em relação aos requisitos de melhoria progressiva. >  > Figura 1.1: Lighthouse >  > Seu principal objetivo é gerar um relatório avaliando requisitos de performance, acessibilidade e o quão progressiva é uma aplicação.
- Mais adiante veremos como utilizá-la (extensão do Google Chrome) para medir a qualidade da aplicação construída neste livro.
- Veremos agora, em tópicos, quais são os requisitos de uma aplicação progressiva.  ### Deve registrar um Service Worker  _Service Worker_ é uma especificação W3C que permite executar um trecho de código JavaScript continuamente no nível do navegador.
- Por meio dele (não exclusivamente), é possível implementar recursos offline e organizar o cache dos arquivos estáticos da página web.
- Um dos itens do relatório do Lighthouse é exatamente este: uso do Service Worker.
- Entretanto, podemos centrar-nos na ideia de que nossa aplicação deve funcionar offline, de preferência com os recursos oferecidos pelo Service Worker.

## 4. Topicos Avancados
- No futuro, veremos as minúcias do uso e da implementação do Service Worker em detalhes.  ### Resposta com status 200 mesmo estando offline  Uma página web funciona sobre o protocolo HTTP, que, por sua vez, trabalha com vários status de retorno às solicitações dos browsers.
- O retorno de código 200 significa sucesso na solicitação.
- Uma aplicação progressiva deve simular tal status mesmo estando offline.
- Guardando os dados localmente.
- Isso pode ser realizado via _Local Storage_ (dados), _Application Cache_ (arquivos), _IndexedDB_ (dados), e o próprio Service Worker, que, além de nos ajudar com as respostas status 200, orquestra o cache dos arquivos.
- Mais uma vez, não se preocupe, veremos as vantagens e desvantagens de cada um em detalhes.  ### Deve exibir conteúdo quando o JavaScript estiver desabilitado  Permita-me contar uma rápida história: a muito tempo atrás (2008), trabalhei em um site de inscrições para um processo seletivo.
- Nele, a principal informação do usuário era o CPF.
- Na página, havia um código JavaScript que acrescentava pontos no CPF.
- Por uma falha no desenvolvimento, essa regra não estava replicada no back-end (PHP).
- Tudo corria bem até que um dos usuários, após ter se cadastrado com seu CPF devidamente pontuado, desabilitou o JavaScript e fez um segundo cadastro do mesmo CPF sem os pontos.

