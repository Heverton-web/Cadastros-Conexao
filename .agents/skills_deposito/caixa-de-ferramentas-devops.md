---
name: caixa-de-ferramentas-devops
description: >-
  Passos operacionais extraidos do livro 'Caixa de Ferramentas DevOps' (PT) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# Caixa De Ferramentas Devops — Passos Operacionais

Conteudo extraido do livro 'Caixa De Ferramentas Devops'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Hoje sou formado em Ciência da   Computação e pós-graduado em Sistemas de Informação.
- Gosto muito do que faço: construo e conserto sistemas   distribuídos e de larga escala há 20 anos.
- Além de programar em   Python, Erlang e Go, faço café, e-mail, cloud, big data e automação   de infra.
- Há algum tempo comecei a trabalhar gerenciando pessoas e me   apaixonei pela possibilidade de criar equipes e conquistar grandes   projetos.
- Quando descobri minha carreira gerencial tive certeza de   que deveria me esforçar mais para continuar relevante tecnicamente   e falar a língua das pessoas que trabalham comigo.
- Tive a sorte de   participar de empresas e equipes que desenvolvem e operam alguns   dos maiores sistemas da internet do Brasil.
- Escrevi um livro em 2005 chamado Programação Avançada em   Linux, o primeiro livro brasileiro a falar sobre kernel, módulos,   drivers, dispositivos eletrônicos e temas avançados do sistema   operacional.
- Já palestrei em várias edições da RubyConf, QCon e OSCon, no   Brasil e nos Estados Unidos.
- Tenho um repositório de código   (https://github.com/gleicon) e publico o que acho interessante no   Twitter (https://twitter.com/gleicon).
- Meu perfil profissional no Linkedin fica em   https://linkedin.com/in/gleicon.


  - (http://collectd.org) e do Logstash (http://logstash.net/). O collectd é

  - 10.0.0.1, 10.0.0.2, 10.0.0.3. Se o valor fosse all , ele seria aplicado

  - privados só serão vistos por pessoas que você autorizar. Para utilizá-

  - operacional está atualizado, se a versão do VirtualBox é a correta, se

  - facilitar seu trabalho até com provedores reais de IaaS. Participe das

  - jargão para instalar e configurar itens de infraestrutura e plataforma
## 2. Principios e Tecnicas
- Tenho um site com links para   projetos em http://7co.cc/.
- O material das palestras que já dei pode   ser encontrado em http://www.slideshare.net/gleicon e também em   https://speakerdeck.com/gleicon/.
- Participe do nosso grupo de discussão do livro, em   https://groups.google.com/forum/#!forum/caixa-de-ferramentas-   devops.
- INTRODUÇÃO  Este livro é uma introdução com opiniões sobre ferramentas para   desenvolvimento e administração de sistemas.
- As ferramentas   demonstradas são flexíveis e extensíveis, o que permite que a mesma   tarefa seja executada de formas distintas.
- Meu objetivo é mostrar uma maneira de utilizá-las para ganhar   produtividade rapidamente.
- Ao longo do texto, coloquei referências   para que o leitor possa se aprofundar ou buscar um conceito teórico   que está fora do escopo proposto.
- Não vou me deter em discussões   holísticas de implantação de conceitos Ágeis ou DevOps.
- Originalmente, este livro era um conjunto de notas que fui   colecionando durante o dia a dia e conversas com colegas.
- Revisando estas notas quando precisei começar um novo projeto me   dei conta de que elas contavam uma história interessante para quem   teve pouco ou nenhum contato com ferramentas de automação e   virtualização.


  - "/opt/wordpress" por ela e em cada role criar o diretório caso ele não

  - TCP/IP abertas, a resposta de sites e a existência de strings em logs.

  - To (http://lartc.org/howto/lartc.ratelimit.single.html) para limitar a

  - e é utilizada em vários hypervisors (software utilizado para gerenciar
## 3. Aplicacoes Praticas
- Mais ainda, elas me ajudaram a treinar outras pessoas   com pouco tempo e com objetivos maiores do que se especializarem   em Ansible, Vagrant ou Virtualbox.
- As ideias descritas podem ser implementadas e utilizadas com   qualquer substituto destas ferramentas ─ provavelmente você tem   um deploy.sh em algum diretório ou repositório que faz mais que   elas em conjunto.
- Isso é bom, pois mostra que a necessidade existe e   que já foi investido um tempo em atendê-la.
- Minha proposta neste   caso é explorar a combinação das ferramentas apresentadas para   entender a maneira modular como o mesmo problema é resolvido   por elas.
- Automatização é um amplificador da energia que você investe   em suas tarefas.
- O mesmo argumento que era utilizado para   controle de versão pode ser utilizado para automação: você   compromete um tempo aprendendo, investe um pouco mais nos   primeiros passos e depois ganha em escala e qualidade de trabalho.
- Uma das ideias que vou explorar no texto é de que todo   repositório de código tenha uma estrutura mínima que consiga criar   um ambiente para desenvolvimento ou teste localmente.
- Ao montar   uma estrutura de automação para sua aplicação que funciona   localmente, você ganha a mesma estrutura para seu ambiente de   produção.
- Desenvolver localmente com a habilidade de criar ambientes   com arquitetura semelhantes às encontradas em ambiente de   produção é um principio poderoso.
- Ele habilita o desenvolvimento   incremental e testes funcionais, além da familiaridade com a   arquitetura do sistema.

## 4. Topicos Avancados
- A velocidade de desenvolvimento e avaliação de bibliotecas e   projetos de código aberto também aumenta com a habilidade de   criar um ambiente isolado com todas as dependências e descartá-lo   após o uso.
- Finalmente, é um treinamento para o processo de   deploy.
- Se encararmos o fato de que sistemas e suas arquiteturas não são   estáticos, é importante desenvolver um conjunto de práticas para   acompanhar o desenvolvimento e mudança desta arquitetura.
- Temos que ter respostas para recriar o ambiente em caso de   desastres, fazer crescer seus componentes quando confrontados   com uma carga inesperada e desenvolver em uma réplica em escala   do ambiente final.
- Ferramentas como Ansible e Vagrant são associadas ao   movimento DevOps, que explora mudanças culturais e   organizacionais, além de novas abordagens para problemas   conhecidos como gerenciamento de configuração, monitoramento e   coletas de métricas, aplicação de técnicas de engenharia de software   na criação de infraestrutura e a interação rápida entre equipes.
- Acompanhe podcasts (por exemplo o FoodFight, listas como   DevOps Weekly, Reddits como reddit.com/r/devops e   reddit.com/r/sysadmin e conferencias como a Velocity para novas   ideias e projetos.
- Com as ferramentas que vamos ver, é fácil testar de forma   controlada novas ideias apresentadas nestes canais.
- Não é   mandatório adotar ou se associar a qualquer grupo ou metodologia   para ter benefícios.
- São boas práticas colhidas e compartilhadas por   pessoas com experiência de sistemas em produção.
- O custo é baixo e   o maior investimento é o tempo para consumir o material   disponível.

