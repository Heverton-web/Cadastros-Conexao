---
name: webapp-com-nodejs-e-mongodb-umbler
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Webapp Com Nodejs E Mongodb Umbler — Passos Operacionais

Conteudo extraido do livro 'Webapp Com Nodejs E Mongodb Umbler'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Introdução ................................................................................................................ 3  2\.
- Preparando o ambiente........................................................................................ 7  3\.
- Conhecendo o NODE ....................................................................................... 11  4\.
- Conhecendo o banco de dados ..................................................................... 25  5\.
- Conectando no banco de dados .................................................................... 32  6\.
- Persistindo os dados .......................................................................................... 41  7\.
- Conclusão ............................................................................................................... 51   01  Introdução  Walking on water and developing software    from a specification are easy if both are frozen.  \- Edward Berard   Introdução   4  Luiz Fernando  Dev Evangelist   Umbler  Hoje eu vou contar uma história de como um coala muito esperto aprendeu a    criar aplicações usando Node.js e MongoDB.
- Essa história se passa em meados    de 2016, antes do Umblerito ajudar a criar nossas plataformas de Node.js    e MongoDB na Umbler e estava apenas aprendendo a trabalhar com estas    tecnologias.
- Se você é um programador iniciante nestas duas tecnologias, tenho certeza    que você vai se identificar.
- Além disso, ensinar um coala de dois anos a    programar é algo deveras divertido também.


  - 1\. Introdução ................................................................................................................ 3

  - 7\. Conclusão ............................................................................................................... 51

  - 6\. Persistindo os dados .......................................................................................... 41

  - 2\. Preparando o ambiente........................................................................................ 7

  - 3\. Conhecendo o NODE ....................................................................................... 11

  - 4\. Conhecendo o banco de dados ..................................................................... 25
## 2. Principios e Tecnicas
- Se você nunca programou antes, nem na faculdade ou no técnico, talvez    este não seja o melhor livro para você aprender.
- Considero aqui que você já    programa para web, em qualquer tecnologia.
- Ter assistido os vídeos de Node.   js e MongoDB que gravei para a Umbler ajuda também (estão disponíveis em    nosso canal no YouTube, assiste lá!).
- Espero que você goste da leitura e que o conteúdo seja útil.
- Introdução   5  Eu estava passeando pela Umbler outro dia quando encontrei o Umblerito    cabisbaixo.
- Sim, nosso querido coala estava atirado em um puff na sala de    jogos sem muito ânimo, com uma cara de partir o coração.
- Ele coçava sua    barriga que, confesso, está um pouco mais avantajada do que deveria, e olhava    para o horizonte, com um marasmo que dava sono só de olhar.
- Obviamente,    fiquei intrigado, uma vez que nosso mascote geralmente é muito inquieto e    está sempre fazendo mil e uma coisas pelos corredores da empresa.
- Tratei de    pegar um biscoito Passatempo (o favorito do Umblerito) e sentei ao lado dele    para conversar.
- Conversa vai, conversa vem, ele me explicou que estava chateado.


  - 5\. Conectando no banco de dados .................................................................... 32

  - escaláveis, performáticas, leves e tudo mais que já tinha ouvido falar das qualidades

  - Pois é, Sr. Umblerito, mas isso terá que ficar para outro dia. Pois, minha esposa

  - (‘/’), o módulo index.js irá tratar. Já para as requisições no caminho ‘/users’,
## 3. Aplicacoes Praticas
- Ao que    parece todo mundo sabia criar aplicações Node.js com MongoDB, exceto    ele.
- Claro que isso era um exagero.
- Ele se sentia atrasado em relação aos    outros programadores pois ainda criava todas suas aplicações com C# ou    Java e usando bancos SQL tradicionais.
- Não sei de onde ele tirou que isso    era um problema, mas reconheci nesse desabafo uma preocupação genuína    e que corriqueiramente percebo em meus alunos da faculdade também:    a preocupação de não estar acompanhando a velocidade das mudanças    tecnológicas.
- Como bom amigo que sou, me ergui do puff com um pulo e estendi a mão pra    ele.  \-- Bora criarmos algo em Node.js com MongoDB?
- Ele me olhou incrédulo com seus pequenos olhos negros.
- Afinal, era um fim    de tarde de sexta-feira e todos já estavam se preparando para ir embora após    mais uma sessão de ShareIT, uma espécie de TEDx que fazemos internamente    na Umbler semanalmente, evento no qual um de nós ensina algo novo aos    demais.  \-- Não preciso mais do que algumas poucas horas para eu te dar um overview    e, juntos, criarmos uma aplicação completa em Node e Mongo.
- Desafiar o Umblerito é muito engraçado.
- Ele é pior que o Marty McFly quando    chamado de franguinho.
- Como eu esperava, ele se ergueu meio desajeitado,    tirou um notebook do seu marsúpio (aquela bolsa na barriga, sabe?) e    caminhou em direção a uma pequena sala de reunião que estava desocupada.

## 4. Topicos Avancados
- Ao notar que eu não o segui, ele se virou e questionou:  \-- Você vem homo sapiens?
- Ou está com medo que um coala programe melhor    que você?
- Eu balancei a cabeça com um sorriso e pensando que empresa maluca na qual eu    fui me meter.
- Vamos, seu abusado!   02  Preparando o    ambiente  A language that doesn’t affect the way you    think about programming is not worth knowing.  \- Alan Perlis   Preparando o ambiente   8  Vai rodar na minha máquina?
- Esta foi a primeira dúvida do Umblerito.
- Ele tinha um computador bem antigo,    2008 ou 2009 eu acho.  \-- Claro que vai!
- Eu falava isso com conhecimento de causa.
- Meu próprio notebook à época    era um modelo 2009, um Core 2 Duo que ao longo dos anos eu fui fazendo    alguns upgrades como 8GB RAM e 256GB SSD.
- Mas já vi Node rodar liso em    configurações bem inferiores a minha.
- É realmente uma tecnologia muito    democrática considerando que é gratuita, multi plataforma, open-source e    muito leve.  \-- E como se instala?

