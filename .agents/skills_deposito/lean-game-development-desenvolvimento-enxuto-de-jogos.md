---
name: lean-game-development-desenvolvimento-enxuto-de-jogos
description: >-
  Passos operacionais extraidos do livro 'Lean game development desenvolvimento enxuto de jogos' (PT) — Jogos.
---

# Lean Game Development Desenvolvimento Enxuto De Jogos — Passos Operacionais

Conteudo extraido do livro 'Lean Game Development Desenvolvimento Enxuto De Jogos'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Capítulo 2 Sumário ISBN Agradecimentos Sobre a autora Sobre o livro Prefácio 1.
- MVPs: realmente necessários? 5.
- Desenvolvimento guiado a testes 8.
- O mundo entre o design e o build 10.
- Anexo A — Técnicas e ferramentas lean e ágeis 16.
- Anexo C — Plataformas de distribuição 18.
- Referências  Capítulo 3 ISBN Impresso e PDF: 978-85-5519-264-7 EPUB: 978-85-5519-265-4 MOBI: 978-85-5519-266-1 Caso você deseje submeter alguma errata ou sugestão, acesse http://erratas.casadocodigo.com.br .
- Capítulo 4 Agradecimentos Primeiro, gostaria de agradecer à minha família por estar sempre comigo e me apoiando.
- Obrigada, Diego e Kinjo, e obrigada aos pequenos sempre alegres e contentes Fluffy, Ffonxio e Highlander.
- Além disso, devo agradecer a Ada Lovelance e Alan Turing por terem sido os grandes cabeças na fundação da ciência da computação.

## 2. Principios e Tecnicas
- Tenho também de agradecer ao meu pai, por ter me comprado aquele primeiro livro de C++ para ver se eu calava a boca, e a todas as revisões de texto que ele já fez na minha vida.
- À minha mãe, por todo incentivo na educação.
- Também à Ubisoft, à Microsoft, à Nintendo, à Sony e à Sega, por terem me permitido centenas de milhares de horas de entretenimento com videogames.
- Tenho de agradecer a Universidade Federal do Rio Grande do Sul (UFRGS), especialmente à professora Vania e ao professor Luis Alberto, pois sempre me deram espaço para explorar a minha criatividade, apesar de ela às vezes ir para terras inimagináveis.
- Aos professores da especialização em desenvolvimento de jogos digitais da Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS), em especial o Vitor Severo Leães e o Christian Lykawka, por terem me ajudado a desenvolver o conhecimento em games.
- A todo o pessoal da Thoughtworks, especialmente ao Rodolfo e ao Marcelo, que levaram as empreitadas de games comigo, e a todos que me ajudaram lá — a lista é muito grande, mas citarei as seis pessoas mais importantes: Aneliz, Enzo (várias palestras sobre CI, CD, TDD e muitas horas de diversão), Renata, Otávio, Ana Daros e Braga.
- E um agradecimento especial ao Paulo Caroli, por ter me dito que o Lean Game Development deveria ser muito mais do que uma palestra de 25 minutos e, também, por todo o material que ele disponibilizou na internet para que as pessoas pudessem consultar.
- Ao meu time na Ubisoft, por me ajudar a evoluir cada vez mais.
- E, claro, agradecer à Vivian, à Bianca e à Casa do Código, por acreditarem no Lean Game Development e por me ajudarem no desenvolvimento do livro.
- Um agradecimento especial à Lenora Lerrer Rosenfield, pela ideia da arte para a capa do livro.

## 3. Aplicacoes Praticas
- Capítulo 5 Sobre a autora Julia Naomi Boeira é team lead programmer na Ubisoft Winnipeg, onde prega o desenvolvimento lean, mas já atuou como engenheira de software no Nubank e na Thoughtworks Brasil.
- Atualmente, atua como evangelista Rust na Ubisoft e produz bastante conteúdo voltado ao desenvolvimento de jogos em Rust e Unity.
- É autora dos livros TDD para Games e Programação Funcional e Concorrente em Rust , publicados pela Casa do Código.
- Já trabalhou com as engines Snowdrop, Unity, Unreal Engine, CryEngine.
- Ao perceber que a indústria de games havia interpretado errado os métodos ágeis, buscou uma solução que pudesse ser utilizada de forma mais convergente com o mundo dos games.
- A autora teve a colaboração de Rodolfo Pereira, desenvolvedor de software da Thoughtworks, e de Jay Kim, UX Designer, no desenvolvimento e adaptações dos conceitos já existentes para a criação do Lean Game Development .
- A revisão técnica foi feita por Vitor Severo Leães — Diretor de Operações da Hermit Crab Game Studio e professor convidado da pós-graduação em Jogos Digitais e, também, do MBA em Liderança, Inovação e Gestão 4.0, ambos pela PUCRS — e por Jay Kim.
- Capítulo 6 Sobre o livro A indústria de jogos parece ter alguma resistência aos métodos ágeis.
- Entretanto, grande parte dessa resistência se dá por tentativas frustradas de implementar algumas ferramentas propostas pelos métodos ágeis, em especial, Scrum.
- Sempre acreditei que os métodos e ferramentas ágeis aplicados não podem nunca se sobrepor ao que é proposto no Manifesto Ágil (disponível em: http://agilemanifesto.org/iso/ptbr/manifesto.html ): Indivíduos e interações mais que processos e ferramentas; Software em funcionamento mais que documentação abrangente; Colaboração com o cliente mais que negociação de contratos; Responder a mudanças mais que seguir um plano.

## 4. Topicos Avancados
- O que mais percebo é o peso que tem o primeiro item, pois raramente vejo um local em que processos e ferramentas não sejam superiores a indivíduos e interações.
- Sempre que vejo empresas de jogos falando de suas tentativas frustradas com métodos ágeis, vejo-as falando sobre como utilizaram os processos e a ferramenta de forma rígida, o que me dá muita pena.
- Além disso, creio que o desenvolvimento guiado por testes tenha nascido do segundo item, já que, a meu ver, testes extensivos podem ser interpretados como documentação e, ainda, ajudam no software em funcionamento.
- Penso que, no mundo dos jogos, a colaboração com o cliente seja a etapa fundamental no desenvolvimento, já que o software serve, principalmente, para o entretenimento.
- Outro aspecto importante é que o mercado e a vida mudam, e é preciso se adaptar às necessidades atuais.
- Jogos podem levar muitos anos para ficarem prontos, e é preciso levar em consideração as tendências atuais do mercado em um processo possivelmente tão longo.
- Uma empresa que é exemplo do ponto de vista de engenharia do desenvolvimento de jogos é Riot, pois ela, ao meu ver, já superou, em muitos aspectos, os métodos ágeis.
- Infelizmente, no fator diversidade e comunidade, ela falha (ROUSSEAU, 2021).
- Ela está em um estágio lean de desenvolvimento.
- Veja mais informações sobre a Riot em seu blog de engenharia, disponível em https://engineering.riotgames.com/ .

