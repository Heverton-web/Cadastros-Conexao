---
name: arquitetura-distribuida
description: >-
  Passos operacionais do livro 'Arquitetura de Software Distribuido' — microsservicos, comunicacao, tolerancia a falhas e observabilidade.
---

# EPUB Arquitetura de software distribuído_ boas práticas para um mundo de microsserviços — Passos Operacionais

Skill baseada no livro "EPUB Arquitetura de software distribuído_ boas práticas para um mundo de microsserviços" (PT). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: arquitetura distribuida, microsservicos, comunicacao, tolerancia a falhas.

---

## 1. Arquitetura de software distribuído_ boas práticas para um mundo de microsserviços

- _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
- _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
- _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
- _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
- _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- _Reconheça e retenha seus maiores talentos_. Se você está na posição gestora, precisa fazer a gestão de conhecimento de sua equipe. Como arquiteto de software, você deve aproveitar o que cada um tem de melhor e também motivar cada um a melhorar o que sabe. Capacite no que sua empresa precisa, mas também procure promover capacitação no que interessa aos membros da equipe e tente aproveitar conhecimento não utilizado em inovação.
- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.

## 2. 1.1 O que é arquitetura?


### 2.1 Certo, mas a questão ainda persiste: o que é arquitetura?

1. [page_001](src/pages/page_001.html)
1. [page_002](src/pages/page_002.html)
1. [page_003](src/pages/page_003.html)
1. [page_004](src/pages/page_004.html)
1. [page_005](src/pages/page_005.html)
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 3. 1.2 O que vem a seguir

- _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
- _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
- _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
- _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
- _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- _Reconheça e retenha seus maiores talentos_. Se você está na posição gestora, precisa fazer a gestão de conhecimento de sua equipe. Como arquiteto de software, você deve aproveitar o que cada um tem de melhor e também motivar cada um a melhorar o que sabe. Capacite no que sua empresa precisa, mas também procure promover capacitação no que interessa aos membros da equipe e tente aproveitar conhecimento não utilizado em inovação.
- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.

## 4. 2.1 Aprendendo com os erros

- _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
- _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
- _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
- _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
- _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- _Reconheça e retenha seus maiores talentos_. Se você está na posição gestora, precisa fazer a gestão de conhecimento de sua equipe. Como arquiteto de software, você deve aproveitar o que cada um tem de melhor e também motivar cada um a melhorar o que sabe. Capacite no que sua empresa precisa, mas também procure promover capacitação no que interessa aos membros da equipe e tente aproveitar conhecimento não utilizado em inovação.
- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.

## 5. 2.2 Nosso projeto de sistema distribuído


### 5.1 Nosso sistema de auditoria - Podips

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)
- [3\. O microsserviço de fila](03-o_microsservico_de_fila.html)
- [6\. O microsserviço de monitoramento](06-o_microsservico_de_monitoramento.html)
- Um problema pode ter mais de uma solução;

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 6. 2.3 Sistema distribuído

- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.

## 7. 3.1 A estrutura de filas no nosso sistema de auditoria

- [page_001](src/pages/page_001.html)
- [page_002](src/pages/page_002.html)
- [page_003](src/pages/page_003.html)
- [page_004](src/pages/page_004.html)
- [page_005](src/pages/page_005.html)
- [page_006](src/pages/page_006.html)
- [page_007](src/pages/page_007.html)
- [page_008](src/pages/page_008.html)

## 8. 3.2 Instalando o Apache ActiveMQ


### 8.1 Criando a fila do sistema Podips

1. [page_001](src/pages/page_001.html)
1. [page_002](src/pages/page_002.html)
1. [page_003](src/pages/page_003.html)
1. [page_004](src/pages/page_004.html)
1. [page_005](src/pages/page_005.html)
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 9. 3.3 Simulação de produtor e consumidor


### 9.1 O sistema produtor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 9.2 O sistema consumidor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 10. 4.1 A abstração no desenvolvimento de software

- [page_001](src/pages/page_001.html)
- [page_002](src/pages/page_002.html)
- [page_003](src/pages/page_003.html)
- [page_004](src/pages/page_004.html)
- [page_005](src/pages/page_005.html)
- [page_006](src/pages/page_006.html)
- [page_007](src/pages/page_007.html)
- [page_008](src/pages/page_008.html)

## 11. 4.2 A escolha pela linguagem Go

- [page_001](src/pages/page_001.html)
- [page_002](src/pages/page_002.html)
- [page_003](src/pages/page_003.html)
- [page_004](src/pages/page_004.html)
- [page_005](src/pages/page_005.html)
- [page_006](src/pages/page_006.html)
- [page_007](src/pages/page_007.html)
- [page_008](src/pages/page_008.html)

## 12. 4.3 O podips-reader


### 12.1 Chamando a função principal

1. [page_001](src/pages/page_001.html)
1. [page_002](src/pages/page_002.html)
1. [page_003](src/pages/page_003.html)
1. [page_004](src/pages/page_004.html)
1. [page_005](src/pages/page_005.html)
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 12.2 Chamando as demais funções

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [9\. Referências](09-referencias.html)
- Há soluções melhores do que outras;
- `QUEUE_PASSWORD`, com o valor admin.
- Adding package laminas/laminas-servicemanager (^3.4)
- Adding package mezzio/mezzio-laminasrouter (^3.0.1)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> Por fim, ele é associado a _ABRAPHP_ , _Zend PHP Certified Engineer_ , _Zend Framework Certified Engineer_ e _Zend Framework 2 Certified Architect_.


## 13. 5.1 A escolha pela linguagem Python

- [page_001](src/pages/page_001.html)
- [page_002](src/pages/page_002.html)
- [page_003](src/pages/page_003.html)
- [page_004](src/pages/page_004.html)
- [page_005](src/pages/page_005.html)
- [page_006](src/pages/page_006.html)
- [page_007](src/pages/page_007.html)
- [page_008](src/pages/page_008.html)

## 14. 5.2 O podips-writer


### 14.1 O padrão Sujeito/Observador

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 15. 6.1 O podips-monitor

- _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
- _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
- _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
- _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
- _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- _Reconheça e retenha seus maiores talentos_. Se você está na posição gestora, precisa fazer a gestão de conhecimento de sua equipe. Como arquiteto de software, você deve aproveitar o que cada um tem de melhor e também motivar cada um a melhorar o que sabe. Capacite no que sua empresa precisa, mas também procure promover capacitação no que interessa aos membros da equipe e tente aproveitar conhecimento não utilizado em inovação.
- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.

## 16. 6.2 Criação do podips-monitor


### 16.1 O contêiner de injeção de dependências do podips-monitor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 16.2 O roteador do podips-monitor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 16.3 O mecanismo de template do podips-monitor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 16.4 O componente de manipulação de erros do podips-monitor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 16.5 Instalação de dependências

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)
- [3\. O microsserviço de fila](03-o_microsservico_de_fila.html)
- [6\. O microsserviço de monitoramento](06-o_microsservico_de_monitoramento.html)
- Um problema pode ter mais de uma solução;

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 17. 6.3 Implementação do podips-monitor


### 17.1 Definindo as rotas do podips-monitor

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [9\. Referências](09-referencias.html)
- Há soluções melhores do que outras;
- `QUEUE_PASSWORD`, com o valor admin.
- Adding package laminas/laminas-servicemanager (^3.4)
- Adding package mezzio/mezzio-laminasrouter (^3.0.1)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> Por fim, ele é associado a _ABRAPHP_ , _Zend PHP Certified Engineer_ , _Zend Framework Certified Engineer_ e _Zend Framework 2 Certified Architect_.


### 17.2 O método handle e os dados de monitoração

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 17.3 As dependências do método handle

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)
- [5\. O microsserviço consumidor](05-o_microsservico_consumidor.html)
- [7\. O microsserviço agendado](07-o_microsservico_agendado.html)
- [9\. Referências](09-referencias.html)
- Há soluções melhores do que outras;

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 17.4 Recuperando o conteúdo dos arquivos de status

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 17.5 Limitando a criação de instâncias

1. [page_001](src/pages/page_001.html)
1. [page_002](src/pages/page_002.html)
1. [page_003](src/pages/page_003.html)
1. [page_004](src/pages/page_004.html)
1. [page_005](src/pages/page_005.html)
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 17.6 A visão em duas etapas do Mezzio

1. [page_001](src/pages/page_001.html)
1. [page_002](src/pages/page_002.html)
1. [page_003](src/pages/page_003.html)
1. [page_004](src/pages/page_004.html)
1. [page_005](src/pages/page_005.html)
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


## 18. 6.4 Documentação da API

- _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
- _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
- _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
- _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- _Reconheça e retenha seus maiores talentos_. Se você está na posição gestora, precisa fazer a gestão de conhecimento de sua equipe. Como arquiteto de software, você deve aproveitar o que cada um tem de melhor e também motivar cada um a melhorar o que sabe. Capacite no que sua empresa precisa, mas também procure promover capacitação no que interessa aos membros da equipe e tente aproveitar conhecimento não utilizado em inovação.
- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.
- _Planeje para mudança_. Lembra da **configurabilidade** e da **parametrização**? Evite criar definições fixas no software. Deixe-o sempre aberto para alterações que possam ser feitas sem a necessidade de lançamento de uma nova versão. O software deve ser desenvolvido de forma que possamos alterar seu comportamento o máximo possível dentro de uma mesma versão.

## 19. 7.1 O podips-cronjob


### 19.1 Definindo o intervalo entre os eventos da aplicação

1. _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
1. _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
1. _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
1. _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
1. _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- [Agradecimentos](01-agradecimentos.html)
- [Sobre o autor](02-sobre-o-autor.html)
- [Prefácio](03-prefacio.html)
- [1\. Introdução: nossa meta é não bagunçar](01-introducao.html)
- [2\. O projeto de sistema distribuído](02-o_projeto_de_sistema_distribuido.html)

> Programador formado pelo Centro Estadual de Educação Tecnológica Paula Souza, já atuou em empresas privadas de TI e foi funcionário do Banco do Brasil, onde atuou como analista na diretoria internacional.


> É analista de desenvolvimento do Serviço Federal de Processamento de Dados (Serpro), no qual foi coordenador do _Programa Serpro de Software Livre_ e gerente de equipe de desenvolvimento.


### 19.2 Evitando alarmes falsos


## 20. 7.2 Implementação do podips-cronjob

- _Comece o desenvolvimento com requisitos de software_. Construa código somente a partir de requisitos. Idealmente, construa usando desenvolvimento orientado a testes, que garante que o requisito fará parte de um código-fonte. Mais idealmente, construa usando desenvolvimento orientado a comportamento, para os casos em que testes com requisitos são definidos junto com o cliente, no levantamento de requisitos.
- _Honre seus usuários e comunique-se com eles frequentemente_. A maior parte dos problemas na vida ocorre por falta de comunicação. Se tiver dúvidas, pergunte. Antes de prosseguir, mostre o que fez até o momento e confirme se está certo. Os princípios do desenvolvimento ágil valorizam bastante a comunicação, porque ela evita que se trabalhe em algo diferente do que é esperado pelo cliente.
- _Não permita mudanças de requisitos sem garantias_. A mudança é bem-vinda, como afirmam os princípios do desenvolvimento ágil, mas não é por isso que você vai aceitar qualquer coisa do seu cliente. As mudanças precisam ser analisadas e negociadas, porque têm impacto no produto final.
- _Invista antecipadamente em arquitetura de software_. Não espere o projeto começar para pensar em arquitetura. Procure componentes reutilizáveis e estude-os, preparando-se para demandas futuras. Faça laboratórios de simulação de projetos. Exercite-se, não somente sozinho, mas em equipe.
- _Não confunda produtos com padrões_. Há muitos componentes de software disponíveis para os quais você pode terceirizar trabalho. Mas não programe para implementações específicas, programe para interfaces. Defina padrões de comunicação para que seja possível substituir componentes quando for necessário sem grande impacto para o software.
- _Reconheça e retenha seus maiores talentos_. Se você está na posição gestora, precisa fazer a gestão de conhecimento de sua equipe. Como arquiteto de software, você deve aproveitar o que cada um tem de melhor e também motivar cada um a melhorar o que sabe. Capacite no que sua empresa precisa, mas também procure promover capacitação no que interessa aos membros da equipe e tente aproveitar conhecimento não utilizado em inovação.
- _Compreenda tecnologia orientada a objetos_. O tempo passa, o tempo voa e o paradigma da Orientação a Objetos continua numa boa. Na verdade, a maior parte dos serviços que temos hoje está implementada em modelos de objetos. Saber programação Orientada a Objetos é obrigatório não somente para desenvolvedores e desenvolvedoras hoje em dia, mas também para pessoas que administram sistemas, pois diversos softwares de infraestrutura trabalham com arquivos de configuração baseados em objetos.
- _Projete aplicações centradas em web e componentes reusáveis_. Estamos no mundo das aplicações distribuídas. Mesmo que sua aplicação seja inicialmente construída para ser desktop, instalada e operada em somente uma máquina, fazendo uso direto dos recursos do sistema operacional, pode ser que ela se beneficie no futuro de uma integração com serviços web. Então é bom pensar nisso ao definir sua arquitetura. A arquitetura também deve buscar terceirizar o máximo de trabalho para componentes reusáveis e gerar o máximo de componentes reusáveis para projetos futuros.

## Referencias


# |  .------------- hora (0 - 23)
# |  |  .---------- dia do mês (1 - 31)
# |  |  |  .------- mês (1 - 12) OU jan,feb,mar,apr ...
# |  |  |  |  .---- dia da semana (0 - 6) (Sunday=0 ou 7) OU sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
