---
name: epub-devops-na-pr-tica
description: >-
  Passos operacionais extraidos do livro 'EPUB_Devops_na_prática' (PT) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# Devops Na Pratica — Passos Operacionais

Conteudo extraido do livro 'Devops Na Pratica'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Nenhuma parte deste livro poderá ser reproduzida, nem transmitida, sem   autorização prévia por escrito da editora, sejam quais forem os meios:   fotográﬁcos, eletrônicos, mecânicos, gravação ou quaisquer outros.
- Casa do Código   Livros para o programador   Rua Vergueiro, 3185 - 8º andar   04101-300 – Vila Mariana – São Paulo – SP – Brasil   Casa do Código  "Para meu pai, que me introduziu ao mundo da computação e é meu exemplo   de vida.”  i   Casa do Código  Prefácio  Jez Humble  Pouco depois que me formei na universidade em 1999, eu fui contratado por   uma start-up em Londres.
- Meu chefe, Jonny LeRoy, ensinou-me a prática   de implantação contínua: quando terminávamos uma nova funcionalidade,   fazíamos alguns testes manuais rápidos na nossa estação de trabalho e, em   seguida, copiávamos os scripts ASP relevantes por FTP para o servidor de   produção – uma prática que eu não recomendaria hoje, mas que teve a van-   tagem de nos permitir mostrar novas ideias para nossos usuários muito rapi-   damente.
- Em 2004, quando entrei na ThoughtWorks, meu trabalho era ajudar em-   presas a entregar software e eu fiquei chocado ao descobrir que prazos de me-   ses ou mesmo anos eram comuns.
- Felizmente, tive a sorte de trabalhar com   várias pessoas inteligentes em nossa indústria que estavam explorando for-   mas de melhorar estes resultados, ao mesmo tempo aumentando a qualidade   e melhorando a nossa capacidade de servir nossos usuários.
- As práticas que   desenvolvemos também tornaram a vida melhor para as pessoas com quem   estávamos trabalhando (por exemplo, não precisávamos mais fazer deploys   fora do horário comercial) – uma indicação importante de que você está fa-   zendo algo certo.
- Em 2010, Dave Farley e eu publicamos Entrega Contínua,   onde descrevemos os princípios e práticas que tornam possível entregar pe-   quenas alterações incrementais, de forma rápida, barata e com baixo risco.
- No entanto, o nosso livro omite os detalhes práticos do que você re-   almente precisa para começar a criar uma pipeline de entrega, como pôr   em prática sistemas de monitoramento e infraestrutura como código, além   dos outros passos práticos importantes necessários para implementar entrega   contínua.
- Por isso estou muito contente que o Danilo escreveu o livro que está  iii   Casa do Código  em suas mãos, que eu acho ser uma contribuição importante e valiosa para a   nossa área.
- O Danilo está profundamente envolvido em ajudar organizações   a implementar as práticas de entrega contínua há vários anos e tem ampla   experiência, e eu tenho certeza de que você vai achar o seu livro prático e   informativo.


  - que vai ser entregue é estável ou não, como: testes de integração, testes de sis-

  - nho, corrigir defeitos, deixar as telas da loja virtual mais bonitas se isso tudo

  - da escrita do livro, a versão mais nova é o VirtualBox 4.3.8 e será a versão uti-

  - por coletar informações sobre o resto da infraestrutura, avaliar se ela está sau-

  - ao processo que envolve as etapas 1 - 4, ou seja, todas as atividades necessárias

  - http://192.168.33.16:8080/. Se tudo estiver certo você verá a tela de boas-vindas
## 2. Principios e Tecnicas
- Desejo-lhe tudo de melhor na sua jornada.  iv   Casa do Código  Sobre o livro  Entregar software em produção é um processo que tem se tornado cada vez   mais difícil no departamento de TI de diversas empresas.
- Ciclos longos de   teste e divisões entre as equipes de desenvolvimento e de operações são alguns   dos fatores que contribuem para este problema.
- Mesmo equipes ágeis que   produzem software entregável ao final de cada iteração sofrem para chegar   em produção quando encontram estas barreiras.
- DevOps é um movimento cultural e profissional que está tentando que-   brar essas barreiras.
- Com o foco em automação, colaboração, compartilha-   mento de ferramentas e de conhecimento, DevOps está mostrando que de-   senvolvedores e engenheiros de sistema têm muito o que aprender uns com   os outros.
- Neste livro, mostramos como implementar práticas de DevOps e Entrega   Contínua para aumentar a frequência de deploys na sua empresa, ao mesmo   tempo aumentando a estabilidade e robustez do sistema em produção.
- Você   vai aprender como automatizar o build e deploy de uma aplicação web, como   automatizar o gerenciamento da infraestrutura, como monitorar o sistema   em produção, como evoluir a arquitetura e migrá-la para a nuvem, além de   conhecer diversas ferramentas que você pode aplicar no seu trabalho.  v   Casa do Código  Agradecimentos  Ao meu pai, Marcos, por ser sempre um exemplo a seguir e por ir além   tentando acompanhar os exemplos de código mesmo sem nenhum conhe-   cimento no assunto.
- À minha mãe, Solange, e minha irmã, Carolina, pelo   incentivo e por corrigirem diversos erros de digitação e português nas ver-   sões preliminares do livro.
- À minha parceira e melhor amiga, Jenny, pelo carinho e apoio durante as   diversas horas que passei trabalhando no livro.
- Ao meu editor, Paulo Silveira, pela oportunidade, pela confiança e por   saber como dar um puxão de orelha ou um incentivo na hora certa para que   o livro se tornasse uma realidade.


  - as alterações tenham efeito. Isso irá nos levar de volta à tela de boas-vindas do

  - conceitos difíceis, pela opinião sobre os termos difíceis de traduzir, por ques-

  - tornar algo corriqueiro, o ciclo vicioso da figura 1.1 se inverte completamente.

  - Java utilizados pela loja virtual, inclusive uma instância embutida do Solr. Por
## 3. Aplicacoes Praticas
- À minha revisora e amiga, Vivian Matsui,   por corrigir todos os meus erros de português.
- Aos meus revisores técnicos: Hugo Corbucci, Daniel Cordeiro e Carlos   Vilella.
- Obrigado por me ajudarem a encontrar formas melhores de explicar   conceitos difíceis, pela opinião sobre os termos difíceis de traduzir, por ques-   tionarem minhas decisões técnicas e por me ajudarem a melhorar o conteúdo   do livro.
- Aos colegas Prasanna Pendse, Emily Rosengren, Eldon Almeida e outros   membros do grupo “Blogger’s Bloc” na ThoughtWorks, por me incentivarem   a escrever mais e pelo feedback nos capítulos iniciais, mesmo não entendendo   a língua portuguesa.
- Aos meus inúmeros outros colegas de trabalho da ThoughtWorks, em es-   pecial Rolf Russell, Brandon Byars e Jez Humble, que ouviram minhas ideias   sobre o livro e me ajudaram a escolher a melhor forma de abordar cada as-   sunto, capítulo por capítulo.  vii   Casa do Código  Por fim, a todos que contribuíram de forma direta ou indireta na escrita   deste livro.
- Muito obrigado!  viii   Casa do Código  Sobre o autor  Danilo Sato começou a programar ainda criança, quando muitas pessoas   ainda não tinham computador em casa.
- Em 2000 entrou no curso de bacha-   relado em Ciência da Computação da Universidade de São Paulo, começando   sua carreira como administrador da Rede Linux do IME-USP durante 2 anos.
- Ainda na graduação começou a estagiar como desenvolvedor Java/J2EE e teve   seu primeiro contato com Métodos Ágeis na disciplina de Programação Ex-   trema (XP).
- Iniciou o mestrado na USP logo após a graduação e, orientado pelo Pro-   fessor Alfredo Goldman, defendeu em Agosto de 2007 a dissertação “Uso Efi-   caz de Métricas em Métodos Ágeis de Desenvolvimento de Software” [16].
- Durante sua carreira, Danilo atuou como consultor, desenvolvedor, admi-   nistrador de sistemas, analista, engenheiro de sistemas, professor, arquiteto e   coach, tornando-se consultor líder da ThoughtWorks em 2008, onde traba-   lhou em projetos Ruby, Python e Java no Brasil, EUA e no Reino Unido.

## 4. Topicos Avancados
- Atu-   almente tem ajudado clientes a adotar práticas de DevOps e Entrega Contínua   para reduzir o tempo entre a concepção de uma ideia e sua implementação   com código rodando em produção.
- Ao planejar suas férias em família – agendando   quarto em hotéis, comprando passagens de avião, realizando transações fi-   nanceiras, enviando SMS ou compartilhando as fotos da viagem – você in-   terage com diversos sistemas de software.
- Quando um desses sistemas está   fora do ar, o problema não é apenas da empresa que está perdendo negócios,   mas também dos usuários que não conseguem realizar suas tarefas.
- Por esse   motivo é importante investir na qualidade e estabilidade do software desde o   momento em que a primeira linha de código é escrita até o momento em que   ele está rodando em produção.   1.1.
- Abordagem tradicional   Casa do Código  1.1   Abordagem tradicional  Metodologias de desenvolvimento de software evoluíram, porém o processo   de transformar ideias em código ainda envolve diversas atividades como: le-   vantamento de requisitos, design, arquitetura, implementação e teste.
- Os Mé-   todos Ágeis de desenvolvimento de software surgiram no final da década de   90 propondo uma nova abordagem para organizar tais atividades.
- Ao invés   de realizá-las em fases distintas – modelo conhecido como processo em cas-   cata – elas acontecem em paralelo o tempo todo, em iterações curtas.
- Ao final   de cada iteração, o software se torna mais e mais útil, com novas funcionali-   dades e menos bugs, e o time decide junto com o cliente qual a próxima fatia   a ser desenvolvida.
- Assim que o cliente decide que o software está pronto para ir ao ar e o   código é colocado em produção, os verdadeiros usuários começam a usar o   sistema.
- Nesse momento, diversas outras preocupações se tornam relevantes:   suporte, monitoramento, segurança, disponibilidade, desempenho, usabili-   dade, dentre outras.

