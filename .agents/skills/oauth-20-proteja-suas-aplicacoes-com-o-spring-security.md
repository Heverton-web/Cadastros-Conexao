---
name: oauth-20-proteja-suas-aplicacoes-com-o-spring-security
description: >-
  Passos operacionais extraidos do livro 'OAuth 20 proteja suas aplicações com o spring security OAuth2' (PT) — Segurança.
---
# Conteudo Extraido
Fonte: EPUB - [PT] EPUB_OAuth_20__proteja_suas_aplicações_com_o_spring_security_OAuth2 - Desconhecido.txt


## Conceitos Fundamentais
- Capítulo 2 Sumário ISBN Agradecimentos Sobre o autor Sobre o livro 1.
- Funcionamento interno do Spring Security OAuth2 9.
- Implicit grant type para aplicações no Browser 11.
- Refresh Tokens e escopos para aumentar a segurança 13.
- Adicionando suporte a banco de dados no projeto 14.
- Bibliografia Capítulo 3 ISBN Impresso e PDF: 978-85-94188-12-0 EPUB: 978-85-94188-13-7 MOBI: 978-85-94188-14-4 Você pode discutir sobre este livro no Fórum da Casa do Código: http://forum.casadocodigo.com.br/ .

## Principios e Tecnicas
- Capítulo 4 Agradecimentos Em primeiro lugar, agradeço aos meus pais pela dedicação empregada em minha educação, pelo apoio e incentivo a tudo que eu quis estudar e por serem, para mim, grande fonte de inspiração.
- Não posso deixar de citar também a paciência de minha companheira Janine, por sempre me apoiar em meus trabalhos e estudos.
- Agradeço também ao Jorge Acetozi, por me incentivar na escrita do livro, e ao Rafael Chinelato, por ajudar na revisão técnica de alguns capítulos.
- Agradeço à Casa do Código por tornar possível a publicação deste material e por permitir que tantos livros sejam publicados sem burocracia, facilitando o compartilhamento de conhecimento.
- Agradeço ao Adriano Almeida e à Vivian Matsui pela oportunidade e apoio durante a escrita do livro.
- Também agradeço ao leitor que se interessou pelo assunto ao qual tanto me dediquei, com o intuito de facilitar o entendimento consolidando o que aprendi na prática e estudando especificações, livros sobre segurança, Spring e OAuth.

## Aplicacoes Praticas
- Comecei a trabalhar com desenvolvimento de software profissionalmente em 1999, criando soluções que executavam diretamente na máquina do usuário com mecanismos muito simples de autenticação.
- Comecei a participar do desenvolvimento de sistemas web lá em 2003, quando ainda não se ouvia falar de OAuth.
- Já trabalhei no desenvolvimento de sistemas para empresas de médio porte, e-commerce, meios de pagamento e soluções corporativas para instituições financeiras.
- Em cada projeto, tive a oportunidade de conhecer e ajudar a definir diferentes arquiteturas, sempre atento aos erros e acertos.
- Acredito que o conhecimento tem muito valor quando aplicado e divulgado, seja através do ensino ou da publicação de conteúdo através de blog posts, palestras, artigos para revistas e livros.
- Comecei escrevendo posts para o meu primeiro blog, em http://aeloy.blogspot.com , que já não é mais atualizado dando lugar ao mais recente http://adolfoeloy.com.br .

## Topicos Avancados
- Capítulo 6 Sobre o livro Quando tive a necessidade de proteger recursos de uma aplicação com OAuth 2.0, em um projeto em que trabalhei, ele já seguia a stack do Spring, sendo natural utilizar a implementação de OAuth 2.0 do próprio Spring Security OA
- Porém, ler a documentação da biblioteca e escrever código não foram suficientes para que eu tivesse um entendimento satisfatório sobre o assunto.
- Por isso, acabei buscando referências em livros sobre segurança e nas especificações descritas através de RFCs, em especial a RFC 6749.
- RFC, ou Request For Comments , trata-se de documentos que podem ser criados por comunidades ou empresas para especificar protocolos, algoritmos, frameworks e tudo mais que possa ser padronizado.
- A motivação para a escrita do livro foi condensar, em um material, teoria e prática a respeito de OAuth 2.0, utilizando o projeto Spring Security OAuth2.
- Ler especificações, por exemplo, pode ser muito cansativo para algumas pessoas (e ainda não há códigos de exemplo para facilitar o entendimento).

## Secao 5
- Ao ler este livro, o desenvolvedor poderá entender como usar o OAuth 2.0 em cenários específicos, bem como entender o porquê de proteger recursos com OAuth 2.0.
- Durante o dia a dia e mesmo lendo sobre o OAuth na internet, percebe-se que, apesar de o assunto não ser novo, ainda existe bastante confusão e até mesmo cenários de mau uso da tecnologia.
