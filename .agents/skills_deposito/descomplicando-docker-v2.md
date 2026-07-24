---
name: epub-descomplicando-docker-v2
description: >-
  Passos operacionais extraidos do livro 'EPUB_Descomplicando_Docker_v2' (PT) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# Descomplicando Docker V2 — Passos Operacionais

Conteudo extraido do livro 'Descomplicando Docker V2'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Nenhuma parte deste livro poderá ser reproduzida, sob qualquer meio, especialmente em fotocópia (xerox), sem a permissão, por escrito, da Editora.
- Para uma melhor visualização deste e-book sugerimos que mantenha seu software constantemente atualizado.
- Editor: Sergio Martins de Oliveira   Diretora Editorial: Rosa Maria Oliveira de Queiroz   Gerente de Produção Editorial: Marina dos Anjos Martins de Oliveira   Editoração Eletrônica: SBNigri Artes e Textos Ltda.
- Capa: Use Design   Produçao de e-pub: SBNigri Artes e Textos Ltda.
- Técnica e muita atenção foram empregadas na produção deste livro.
- Porém, erros de digitação e/ou impressão podem ocorrer.
- Qualquer dúvida, inclusive de conceito, solicitamos enviar mensagem para brasport@brasport.com.br, para que nossa equipe, juntamente com o autor, possa esclarecer.
- A Brasport e o(s) autor(es) não assumem qualquer responsabilidade por eventuais danos ou perdas a pessoas ou bens, originados do uso deste livro.
- ISBN Digital: 978-85-7452-902-8   **BRASPORT Livros e Multimídia Ltda.**  Rua Teodoro da Silva, 536 A – Vila Isabel   20560-001 Rio de Janeiro-RJ   Tels.
- Fax: (21) 2568.1415/2568.1507   **e-mails:**  marketing@brasport.com.br   vendas@brasport.com.br   editorial@brasport.com.br   **site: www.brasport.com.br**  **Filial**  Av.

## 2. Principios e Tecnicas
- Paulista, 807 – conj. 915   01311-100 – São Paulo-SP    #  Agradecimentos   Jeferson Fernando   Ao meu companheiro de longas jornadas de trampo, Marcus André, pessoa fundamental para o desenvolvimento deste livro.
- Além de ser um superamigo, orgulha-me muito acompanhar seu crescimento profissional e pessoal! _Ieiiiii_ !
- Aos alunos que acumulei e com quem fiz amizades ao longo desses 15 anos ministrando treinamentos pelo Brasil, especialmente aos alunos do treinamento _Descomplicando o Docker_ da LINUXtips! :D   Ao Carlos “do CNI” de’Villa, lá de Itanhaém, que foi o primeiro a acreditar no meu potencial em repassar o conhecimento, isso quando eu tinha apenas 16 anos.
- A todos os amigos que fiz por onde passei, especialmente o Juliano “ncode” Martinez, João “orelhinhas” Gabriel, Jean Feltrin, Guilherme “Lero” Schroeder, Rodolfo “enetepe” Ponteado, Guilherme Almeida, Luiz Salvador Jr, Jhonatan Araujo, Francisco “chico” Freire, Adinan Paiva, Adilson Nunes, Pedro Vara, Eduardo Lipolis, Fábio “santa” Santiago, Rodrigo “birgui” Inacio, Giordano Fechio, Rafael ­Benvenuti, João Borges, Mateus Prado, Leo Martins, Guilherme Calcette e o ­Ricardo Iorio.
- Com muito carinho, gostaria de agradecer a duas pessoas que foram muito importantes para mim nesses últimos anos, principalmente em relação a minha carreira: Eduardo Scarpellini e Leonardo Lorieri, muito obrigado!
- Como sempre digo, vocês mudaram a minha vida! <3   Meus chefes:   Rogerio Lelis, que sempre me ajudou e me apoiou em tudo que precisei!
- André Brandão, que, além de ser o melhor gerente que já tive, é o meu _coach_ e ajudou-me a quebrar algumas barreiras bem importantes em minha vida.
- Rodrigo Campos, que tenho como espelho pela sensacional habilidade de palestrar com maestria.
- Quero agradecer a minha sogra, Suely, meu sogro, Mario Sergio, e minha cunhada, Camila Silvano, que sempre me apoiam e torcem por mim.
- Quero agradecer muito aos meus irmãos Magno Junior e Camila Vitalino, sempre ao meu lado e me apoiando em tudo.

## 3. Aplicacoes Praticas
- Meu filhote Eduardo, que hoje já está um homem!
- O agradecimento mais especial é para as mulheres da minha vida:   • Minha esposa e fiel companheira Aletheia, que sempre está ao meu lado em todos os momentos, tristes ou felizes, fáceis ou difíceis, e que sempre acreditou em mim.
- Eu te amo!   • Minhas princesas e as coisas mais lindas, Maria Fernanda e Maria Eduarda, que são meu tudo, meu ar, minha vida!
- Eu amo vocês, princesas!   • E finalmente minha rainha, minha mãe, Cidinha Tavares, que passou por diversas dificuldades para conseguir educar o homem que hoje sou!
- Marcus André   Eu agradeço, primeiramente, ao Jeferson Vitalino (quem?) pela ideia, oportunidade e parceria neste livro.
- Gostaria, também, de continuar agradecendo a ele pelo tempo, pela dedicação e, acima de tudo, por acreditar em mim.
- Esses últimos anos têm sido, sem dúvida, os melhores da minha carreira profissional e você tem uma bela parcela de culpa nisso.
- Queria também agradecer a todas as pessoas que contribuíram direta ou indiretamente para a minha formação como profissional de TI: colegas de trabalho, professores da faculdade, chefes, ex-clientes, pessoas que me agregaram muito valor e às quais eu serei eternamente grato.
- Um agradecimento especial aos meus amigos/irmãos: Mário ­Anderson, Márcio Ângelo, Bruno Henrique e Manuela Guedes.
- Meus amigos ­Jucianio Werllen, Rondineli Gomes, Renan Vicente e amigos de outras áreas: Jémina Diógenes, Juliana Mesquita, Ana Clara Rezende e Rodrigo Peixe.

## 4. Topicos Avancados
- À minha família: ao meu pai, José Monte, e à minha mãe, dona ­Evani, muito obrigado por tudo e parabéns, seu projeto de homem feliz deu certo. :)   À minha mais nova família, Elisângela Oliveira.
- Agradeço imensamente pela compreensão nesses últimos tempos, pelo carinho, pela emoção, pelo cuidado.
- Muito obrigado por me mostrar a complexidade nas coisas simples e o universo que existe entre o **0** e o **1** .
- Eu te amo.   ****  **Agradecimento especial:**  Gostaríamos ainda de agradecer ao Vicente Marçal, ao Carlos Augusto Malucelli, ao Eduardo Fonseca e ao Henrique Serrat Guimarães por dar aquela conferida final no livro, para que pudéssemos ter a certeza de que você, leitor, teria uma experiência sensacional durante a leitura e execução dos exemplos.
- Bom aprendizado, divirtam-se!    #  Prefácio da primeira edição   If you are a developer, you probably have heard about Docker by now: Docker is the ideal platform to run applications in containers.
- Fine, but what are those containers?
- Containers are a lightweight virtualization technique providing us with lots of possibilities: thanks to them, we can ship applications faster; we can easily implement CI/CD (continuous integration and continuous delivery); we can set up development environments faster than ever; we can ensure parity between those development environments and our production servers; and much more.
- If you write code, if you deploy code, if you operate code, then I promise that containers are going to make your life easier.
- But containers have been around for _decades_ , and Docker was only released in 2013.
- Why is everybody so excited about Docker, if the technology behind it is more than ten years old?
