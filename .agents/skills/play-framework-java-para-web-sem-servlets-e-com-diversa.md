---
name: play-framework-java-para-web-sem-servlets-e-com-diversa
description: >-
  Passos operacionais extraidos do livro 'Play framework java para web sem servlets e com diversão' (PT) — Java, Java Web, Desenvolvimento Web.
---
# Conteudo Extraido
Fonte: EPUB - [PT] EPUB_Play_framework__java_para_web_sem_servlets_e_com_diversão - Desconhecido.txt


## Conceitos Fundamentais
- Capítulo 4 Agradecimentos Agradeço a você por querer aprender mais, à minha esposa por sempre estar ao meu lado, aos meus pais e a Deus por tudo.
- Capítulo 5 Sobre o autor Formado pela UNESP em BCC, foi instrutor oficial da Sun Microsystems e da Oracle Education.
- Atualmente contribui para alguns projetos open source, como KDE, Jenkins entre outros.
- Capítulo 6 Prefácio O melhor presente que se dá é aquele que você gostaria de ganhar.
- Esse é o livro que eu gostaria de ler quando estava começando a usar o Play Framework, ele é o meu presente para você, aproveite!
- Público alvo Esse livro foi feito para programadores Java (iniciantes e veteranos) que buscam pelo desenvolvimento rápido e divertido de aplicações web.


  - Não seria um absurdo se todo mês fosse cobrada uma taxa fixa de trezentos reais de energia elétrica, independente do uso ? Entretanto, quando se paga por um serviço de hospedagem, é exatamente o que acontece, pois o site fica no ar, independente do uso dos recursos por uma quantia mensal fixa. Para mudar esse cenário, surgiu o conceito de cloud computing (computação em nuvem), segundo o qual os serviços são pagos pelo uso, proporcionando inúmeras vantagens: toda a parte de infraestrutura (rede, armazenamento de arquivos, banco de dados, segurança) é de responsabilidade da prestadora de serviços, e o crescimento do uso de serviços é pago proporcionalmente, o que, em termos de custo, é uma excelente opção.

  - Esse aviso significa que o site que estamos visitando não é garantido por uma unidade certificadora, como por exemplo a empresa Verisign. Para adiquirir um certificado digital, é preciso pagar para essas empresas, que funcionam semelhantes a cartórios virtuais, elas asseguram que o site que está sendo acessado é realmente da empresa que ele representa. Quando um certificado é assinado localmente (como no nosso caso), o site funciona, apenas exibindo um aviso. No caso do Google Chrome, o https aparece riscado em vermelho, como mostra a figura 8.2.

  - No capítulo [4](index_split_007.html#publicando) publicamos uma aplicação básica (<http://play-capitulo4.herokuapp.com/>), e usaremos agora uma URL diferente para refletir a aplicação completa (<http://top100filmescult.herokuapp.com/>). Depois de cadastrados os dados iniciais, devemos informar um e-mail de contato e o domínio no qual a aplicação funcionará. Será necessário cadastrar um domínio diferente, por exemplo <seu-usuario-no-Heroku>-top100filmescult.herokuapp.com, semelhante à figura 7.2.

  - Existe outra diferença interessante : as aplicações criadas até o Play 2.2 necessitam de uma instalação do Play para funcionar, já as aplicações criadas com o Activador (Play 2.3+) são "auto-suficientes", não tem dependência externa... é possível rodar a mesma aplicação em outra máquina apenas copiando o diretório e mais nada, isso é algo positivo que aumenta a flexibilidade, principalmente quando se trabalha com diferentes ambientes ( desenvolvimento, homologação e produção).

  - O Play é um framework que redefine o desenvolvimento web em Java. O seu foco é o divertido desenvolvimento no qual a interface HTTP é algo simples, flexível e poderoso, sendo uma alternativa limpa para as opções Enterprise Java infladas. Ele foca na produtividade do desenvolvedor para as arquiteturas RESTful, e sua vantagem em relação às linguagens e frameworks não Java, como Rails e PHP, é que ele usufriu de todo o poder da Java Virtual Machine (JVM).

  - Para cada restart do servidor do Play, o seu banco de dados será limpo novamente. No início do desenvolvimento de um cadastro, isso não é um problema, mas chega um momento em que o sistema necessita de um cadastro mínimo já no banco de dados para funcionar de maneira adequada. Criar um cadastro de filmes em que é preciso cadastrar os diretores toda vez é inviável. Por esse motivo precisamos ter essas informações pré-cadastradas em um repositório.

  - Escolhendo a opção _Hobby Dev_ e associada à aplicação recém-criada, teremos uma aplicação gratuita com o banco de dados PostgreSQL disponível com suporte a 20 conexões simultâneas e tabelas com no máximo 10.000 linhas (figura 4.4). O Heroku trabalha preferencialmente com PostgreSQL, mas oferece também outras opções como MySQL, MongoDB, Neo4J; é preciso consultar no site os planos existentes, mas a maioria deles oferece um gratuito de teste.

  - As redes sociais são essenciais para a divulgação do site e seus serviços. Vamos integrar o nosso site ao Facebook de duas maneiras, primeiramente utilizando a API nativa disponibilizada para os desenvolvedores, e depois utilizando um plugin do Play para conectar a várias redes sociais: Twitter, GitHub, Google, LinkedIn, Foursquare, Instagram, VK (rede social russa semelhante ao Facebook) e XING (rede social semelhante ao LinkedIn).

  - Devemos preencher as informações da aplicação, como mostra a figura 7.1. As informações são simples: o primeiro campo é o nome do aplicativo, o segundo é o namespace (se desejar ter uma URL <http://apps.facebook.com/namespace>), e finalmente, o terceiro é para classificar sua categoria. No exemplo usamos a categoria de `Diversão`, mas se fosse um aplicativo de tênis, para exemplificar, a categoria adequada seria `Esporte` .

  - Felizmente, utilizando o plugin Secure Social (<http://securesocial.ws>) conseguiremos com poucos ajustes fazer essa integração no nosso site de filmes. O Secure Social é um módulo de autenticação do Play Framework que suporta os protocolos mais usados do mercado: OAuth, OAuth2, OpenID, usuário/senha e proporciona algumas informações dos usuários autenticados, como nome, sobrenome, nome completo e e-mail.
## Principios e Tecnicas
- Melhorando sua aplicação – a segunda parte do livro Os capítulos restantes complementam a sua aplicação com a criação de serviços, autenticação e o uso de alguns plugins imperdíveis para o seu sistema.
- Código fonte O código fonte desse livro está disponível no endereço https://github.com/boaglio/play2-casadocodigo , onde foram criadas tags para cada um dos capítulos, para facilitar a compreensão da evolução do nosso sistema de filmes cult.
- Capítulo 7 Capítulo 1 : Hello Play Java e Hello Play Scala 1.1 O que é o Play O Play é um framework que redefine o desenvolvimento web em Java.
- O seu foco é o divertido desenvolvimento no qual a interface HTTP é algo simples, flexível e poderoso, sendo uma alternativa limpa para as opções Enterprise Java infladas.
- Ele foca na produtividade do desenvolvedor para as arquiteturas RESTful, e sua vantagem em relação às linguagens e frameworks não Java, como Rails e PHP, é que ele usufriu de todo o poder da Java Virtual Machine (JVM). 1.2 O que não é o Play O Play n
- Uma aplicação JSF roda sobre a API de Servlet, que por sua vez roda em um container Java EE, que fica dentro de um HTTP Server.

## Aplicacoes Praticas
- Já com o Play, temos apenas duas: o próprio Play framework e o seu HTTP server embutido (Netty).
- Confira a visão geral do Play na figura 1.1 Fig. 1.1: Play framework stack 1.3 Instalação do Play Como pré-requisito, o Play espera que sua máquina tenha instalado uma versão recente do JDK ( http://www.oracle.com/technetwork/java/javase/ ), e tenha 
- A instalação do Play é bem simples e feita em apenas dois passos.
- O primeiro deles é fazer o download do site http://www.playframework.org .
- Depois disso, faça o ajuste conforme o seu sistema operacional.
- Instalação no Windows Descompacte o pacote na raiz e renomeie o diretório compactado para play .

## Topicos Avancados
- Mas se o nome do framework é Play, por que o arquivo se chama Activator ?
- Essa é uma mudança que ocorreu na versão 2.3 , para mais detalhes consulte o apêndice 10 .
- Fig. 1.2: Variável de ambiente no Windows Edite a variável PATH conforme a figura 1.2 , adicionando no final do PATH o valor de ;C:\play\ .
- Atrás de um proxy Se sua internet estiver atrás de um proxy, altere o arquivo C:\play\framework\build.bat na linha de comando Java e adicione os parâmetros: 1 -Dhttp.proxyUser=&lt;meu-usuario&gt; 2 -Dhttp.proxyPassword=&lt;minha-senha&gt; 3 -Dhttp.pr
- Instalação em Linux Descompacte o pacote na raiz, por exemplo: /home/fb/activator-1.2.10-minimal/ , e crie um link simbólico para esse diretório chamado play , como: 1 ln -s /home/fb/activator-1.2.10-minimal/ /home/fb/play Caso haja uma atualização, 
- Adicione no arquivo $HOME/.bashrc ou em $HOME/.bash_profile o comando: export PATH=$PATH:$HOME/play/ .

## Secao 5
- Em uma eventual atualização, descompacte a nova versão e atualize o link simbólico para o novo diretório.
- Se preferir usar o Homebrew, apenas rode o comando brew install play .

