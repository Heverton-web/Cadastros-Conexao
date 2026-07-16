---
name: aplicativos-web-real-time-com-node-js
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Aplicativos Web Real Time Com Node Js — Passos Operacionais

Conteudo extraido do livro 'Aplicativos Web Real Time Com Node Js'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Agra-   deço também ao meu pai e minha mãe pelo amor, força, incentivo e por todo apoio   desde o meu início de vida.
- Obrigado por tudo e principalmente por estar ao meu   lado em todos os momentos.
- Um agradecimento especial a minha namorada Natália Santos, afinal começa-   mos a namorar na mesma época que comecei este livro, e sua companhia, compre-   ensão e incentivo foram essenciais para persistir neste projeto.
- Charlotte Bento de Carvalho, pelo apoio e incentivo nos meus   estudos desde a escola até a minha formatura na faculdade.
- Um agradecimento ao meu primo Cláudio Souza.
- Foi graças a ele que entrei   nesse mundo da tecnologia.
- Ele foi a primeira pessoa a me apresentar o computador   e me aconselhou anos depois a entrar em uma faculdade de TI.
- Um agradecimento ao Bruno Alvares da Costa, Leandro Alvares da Costa e Le-   onardo Pinto, esses caras me apresentaram um mundo novo da área de desenvolvi-   mento de software.
- Foram eles que me influenciaram a escrever um blog, a palestrar   em eventos, a participar de comunidades e fóruns, e principalmente a nunca cair   na zona de conforto, a aprender sempre.
- Foi uma honra trabalhar junto com eles   em 2011.


  - assistir ou enviar vídeos, ver ou publicar fotos, ouvir músicas e assim por diante. Isso

  - prática ele é um loop infinito que a cada iteração verifica em sua fila de eventos se um

  - tir o usuário criar, listar, atualizar e excluir contatos. Esse é o conjunto clássico de

  - ray contendo os elementos a partir de um range inicial e final da lista. O range utiliza

  - de sistemas. Existem diversos tipos de testes: teste unitário, teste funcional, teste de

  - requisições em nosso servidor. Testar requisições sobre as rotas é muito útil, pois per-
## 2. Principios e Tecnicas
- E hoje, mesmo muita coisa tendo mudado, ainda tenho a honra de traba-   lhar com o Leandro numa nova startup que já está virando uma empresa, que é a   BankFacil.
- Obrigado pessoal da editora Casa do Código, em especial ao Paulo Silveira e   Adriano Almeida.
- Muito obrigado pelo suporte e pela oportunidade!
- Obrigado galera da comunidade NodeBR.
- Seus feedbacks ajudaram a melhorar   este livro e também agradeço a todos os leitores do blog Underground WebDev.
- Afi-   nal a essência deste livro foi baseado nos posts sobre Node.js publicados lá.
- Por último, obrigado você, prezado leitor, por adquirir este livro.
- Espero que este   livro seja uma ótima referência para ti.  i   Casa do Código  Comentários  Veja abaixo alguns comentários no blog Underground WebDev a respeito do con-   teúdo que você esta prestes a ler.
- A comunidade brasileira agradece.   – Rafael Henrique Moreira - virtualjoker@gmail.com - “http://nodebr.com”  Tive o prazer de trocar experiências e aprender muito com o Caio.
- Um cara singular à   “instância”, do típico nerd que abraça um problema e não desgruda até resolvê-lo.


  - requisição real, pelo qual testamos as rotas. Este tipo de teste aqui está automatizado,

  - Suas aplicações serão single-thread, ou seja, cada aplicação terá instância de um único

  - zar os módulos http, url e fs (file system), que tal reorganizar a nossa aplicação para

  - flexível e liberal. Apesar de utilizar o seu scaffold de geração inicial, temos a total
## 3. Aplicacoes Praticas
- Obrigado pela ajuda durante nosso tempo trabalho e não vou deixar de acompanhar   essas aulas.
- Parabéns!   – Magno Ozzyr - magno_ozzyr@hotmail.com  Digno de reconhecimento o empenho do Caio no projeto de contribuir com o   desenvolvimento e propagação dessa tecnologia.
- Isso combina com o estilo ambicioso   e persistente que sempre demonstrou no processo de formação.
- Continue   compartilhando os frutos do seu trabalho para assim deixar sua marca na história da   computação.   – Fernando Macedo - fernando@fmacedo.com.br - “http://fmacedo.com.br”  Ótimo conteúdo, fruto de muito trabalho e dedicação.
- Conheci o Caio ainda na   faculdade, sempre enérgico, às vezes impaciente por causa de sua ânsia pelo novo.
- Continue assim buscando aprender mais e compartilhando o que você conhece com os   outros.
- Parabéns pelo trabalho!   – Thiago Ferauche - thiago.ferauche@gmail.com  Wow, muito bacana Caio!
- Eu mesmo estou ensaiando para aprender Javascript e cia.
- Hoje trabalho mais com HTML/CSS, e essa ideia de “para Leigos” me interessa muito!
- Fico no aguardo dos próximos posts!! =)   – Marcio Toledo - mntoledo@gmail.com - “http://marciotoledo.com”  iii   Casa do Código  Caião, parabéns pela iniciativa, pelo trabalho e pela contribuição para a comunidade.

## 4. Topicos Avancados
- Trabalhamos juntos e sei que você é uma pessoa extremamente dedicada e ansioso por   novos conhecimentos.
- Continue assim e sucesso!   – Leonardo Pinto - leonardo.pinto@gmail.com  Caio, parabéns pelo curso e pelo conteúdo.
- É sempre bom contar com material de   qualidade produzido no Brasil, pois precisamos difundir o uso de novas tecnologias e   encorajar seu uso.   – Evaldo Junior - evaldojuniorbento@gmail.com - “http://evaldojunior.com.br”  Parabéns pela iniciativa!
- Acredito que no futuro você e outros façam mais cursos do   mesmo, sempre buscando compartilhar o conhecimento pra quem quer aprender.   – Jadson Lourenço - “http://twitter.com/jadsonlourenco”  iv   Casa do Código  Sobre o autor  Figura 1: Caio Ribeiro Pereira  Sou Web Developer na startup BankFacil, minha experiência baseia-se no domínio   dessa sopa de letrinhas: Node.js, Modular Javascript, Modular CSS, Ruby, Java, Mon-   goDB, Redis, Agile, Filosofia Lean, Scrum, XP, Kanban e TDD.
- Bacharel em Sistemas de Informação pela Universidade Católica de Santos, blo-   gueiro nos tempos livres, apaixonado por programação, web, tecnologias, filmes e   seriados.
- Participante das comunidades:  • NodeBR: Comunidade Brasileira de Node.js  • MeteorBrasil: Comunidade Brasileira de Meteor  • DevInSantos: Grupo de Desenvolvedores de Software em Santos  Iniciei em 2011 como palestrante nos eventos DevInSantos e Exatec, abordando   temas atuais sobre Node.js e Javascript.
- Autor dos Blogs: Underground WebDev e Underground Linux.  v   Casa do Código  Prefácio  As mudanças do mundo web  Tudo na web se trata de consumismo e produção de conteúdo.
- Ler ou escrever blogs,   assistir ou enviar vídeos, ver ou publicar fotos, ouvir músicas e assim por diante.
- Isso   fazemos naturalmente todos os dias na internet.
- E cada vez mais aumenta a neces-   sidade dessa interação entre os usuários com os diversos serviços da web.

