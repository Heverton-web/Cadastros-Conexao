---
name: apis-rest
description: >-
  Passos operacionais do livro 'APIs REST' — design de APIs RESTful, metodos HTTP, autenticacao e boas praticas.
---

# server.ssl.key-store=classpath:keystore.p12 — Passos Operacionais

Skill baseada no livro "server.ssl.key-store=classpath:keystore.p12" (PT). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: APIs REST, HTTP, autenticacao, versionamento.

---

## 1. EPUB APIs REST_ seus serviços prontos para o mundo real


## 2. Pré-requisitos


## 3. 1.1 Utilizando o Spring Boot para criar uma primeira API

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 4. 1.2 O primeiro caso de uso: a listagem de novos motoristas

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 5. 1.3 Quais são os métodos HTTP e como escolher entre eles?


### 5.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 6. 2.1 Recuperando os dados de um motorista específico

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 7. 2.2 Conhecendo os códigos de status

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 8. 2.3 Utilizando um cliente adequado - introdução ao Postman

- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- Construir um `EntityModel` (através do método `buildOutputModel`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O cliente (aplicação) envia um par `client ID` e `client secret` para o servidor de autorização;
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O dispositivo envia uma requisição para o servidor de autorização;
- Já no computador, o usuário utiliza um _browser_ para acessar a URL de verificação, contendo seu código;

## 9. 2.4 Negociação de conteúdo

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- Construir um `EntityModel` (através do método `buildOutputModel`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O cliente (aplicação) envia um par `client ID` e `client secret` para o servidor de autorização;
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O dispositivo envia uma requisição para o servidor de autorização;

## 10. 2.5 Enviando dados para o servidor

- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O servidor de autorização realiza a autenticação dos dados e devolve o `access token`;
- O cliente utiliza o `access token` para acessar os dados.

## 11. 2.6 Idempotência: os efeitos de invocações sucessivas

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 12. 2.7 Atualizando os dados enviados com PUT e PATCH

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 13. 2.8 Apagando os dados de um determinado motorista


### 13.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 14. 3.1 Criando a API de passageiros

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 15. 3.2 Criando a API de solicitação de viagens

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 16. 3.3 Criação do serviço de solicitação de viagens

- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- Construir um `EntityModel` (através do método `buildOutputModel`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O cliente (aplicação) envia um par `client ID` e `client secret` para o servidor de autorização;
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;

## 17. 3.4 Inserindo links: primeiro uso de HATEOAS


### 17.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 18. 4.1 Reorganizando o projeto

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 19. 4.2 Criando a chave de API do Google

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 20. 4.3 Criando o código do cliente

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 21. 4.4 Recuperando os dados com JSONPath

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 22. 4.5 Integrando a consulta no projeto

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 23. 4.6 Testando a nova API


### 23.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 24. 5.1 Conhecendo as estratégias de teste

- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O usuário apresenta suas credenciais (usuário e senha) para o cliente, expressando seu desejo de utilizar os recursos do servidor de recursos;
- O cliente apresenta estas mesmas credenciais para o servidor de autorização;

## 25. 5.2 Criando os testes da API de passageiros com REST Assured

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 26. 5.3 Executando o teste

- [Capítulo 1](src/pages/page_001.html)
- [Capítulo 2](src/pages/page_002.html)
- [Capítulo 3](src/pages/page_003.html)
- [Capítulo 4](src/pages/page_004.html)
- [Capítulo 5](src/pages/page_005.html)
- [Capítulo 6](src/pages/page_006.html)
- [Capítulo 7](src/pages/page_007.html)
- [Capítulo 8](src/pages/page_008.html)

## 27. 5.4 Testes mais completos com WireMock


## 28. 5.5 Configuração do mock do Google Maps


### 28.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 29. 6.1 Conhecendo HTTPS


## 30. 6.2 Implementando HTTPS na nossa API


## 31. 6.3 Incluindo autenticação básica

- O servidor de autorização realiza a autenticação dos dados e devolve o `access token`;

## 32. 6.4 Criando sistema de autorização


## 33. 6.5 Carregando os usuários pelo banco de dados

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 34. 6.6 Atualização dos testes integrados


### 34.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 35. 7.1 Como criar URLs significativas

- Quando o usuário dá seu consentimento, o servidor de autorização marca o dispositivo como autorizado;
- Quando o dispositivo é marcado como autorizado, a próxima requisição _polling_ que o dispositivo fará vai obter o `access token`, permitindo que o fluxo continue pelo dispositivo móvel.

## 36. 7.2 Utilizar os códigos HTTP corretos

- Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
- Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O ciente então vai até o servidor de recursos utilizando o `access token`, e tem acesso aos seus dados.
- O usuário utiliza seu dispositivo móvel para requisitar os dados;
- O dispositivo envia uma requisição para o servidor de autorização;
- O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

## 37. 7.3 Fornecer mensagens de erro significativas


## 38. 7.4 Internacionalizando as mensagens de erro

- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- O usuário apresenta suas credenciais (usuário e senha) para o cliente, expressando seu desejo de utilizar os recursos do servidor de recursos;
- O cliente apresenta estas mesmas credenciais para o servidor de autorização;

## 39. 7.5 Como criar uma API retrocompatível (ou: como versionar uma API)


### 39.1 Versionamento através de mudança de hostnames

1. Primeiro temos que alterar o tipo de retorno (para retornar o `EntityModel`).
1. Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
1. Construir um `EntityModel` (através do método `buildOutputModel`).
1. O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
1. O cliente (aplicação) envia um par `client ID` e `client secret` para o servidor de autorização;
- [Agradecimentos](01-agradecimentos.html)
- [10 Considerações finais](10-consideracoes_finais.html)
- _Building a RESTful Web Service_ \- <https://spring.io/guides/gs/rest-service>
- _Serving Web Content with Spring MVC_ \- <https://spring.io/guides/gs/serving-web-content>
- _Building REST services with Spring_ \- <https://spring.io/guides/tutorials/bookmarks>

> * [ISBN](index.html)
  * [Agradecimentos](01-agradecimentos.html)
  * [Sobre o autor](02-sobre_o_autor.html)
  * [Introdução](04-introducao.html)
  * Serviços em REST
    * [1 O que é REST, afinal?](01-oqueerest.html)
    * [2 Expandindo nosso serviço inicial](02-expandindo.html)
    * [3 Criando relacionamentos entre recursos](03-relacionamentos.html)
    * [4 Criando clientes REST](04-clientes.h


> Muitas pessoas fizeram parte da concepção deste livro, participando direta ou indiretamente. Este livro nasceu como segunda versão do meu livro _REST: Construa API's inteligentes de maneira simples_ (tendo sido dissociado posteriormente), então existe uma história de no mínimo 7 anos envolvida.


### 39.2 Versionamento pela URL

1. O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);
1. O dispositivo apresenta o `User Code` e `Verification URL` para o cliente;
1. Já no computador, o usuário utiliza um _browser_ para acessar a URL de verificação, contendo seu código;
- JDBC URL: jdbc:h2:mem:testdb
- Se modelarmos a URL como `/solicitacoes/viagens`, vamos acabar considerando que todas as viagens pertencem de uma vez só a todas as solicitações de viagens, o que é um erro;
- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;
- Se modelarmos a URL como `/viagens/solicitacoes`, temos um problema semelhante ao primeiro caso;
- Se modelarmos a URL como `/viagens/{id}/solicitacoes`, não vamos conseguir criar uma solicitação sem antes ter uma viagem, o que é um erro semântico.

> Por muitos anos, trabalhei como especialista em SOA. Desde o início procurei sempre ter em mente a concepção original desta arquitetura - algo muito próximo ao que hoje reconhecemos como microsserviços. Esta experiência me levou a adotar REST ainda em seus primórdios no país. Utilizei REST pela primeira vez em um projeto em 2011, em projeto para o iG. Desde então, venho estudando cada vez mais sob


> A partir do capítulo 7, inicia-se a segunda parte do livro, sobre APIs. Esse capítulo vai utilizar os conhecimentos já adquiridos ao longo do livro e os sedimenta. Então, veremos como criar URLs mais significativas para nossos clientes, quais os códigos HTTP mais importantes, como fornecer mensagens de erro significativas, como internacionalizar as mensagens de erro e, finalmente, como criar APIs 


### 39.3 Versionamento por query params

1. O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- Os que começam com 4 (4xx) são códigos de falha que foi originada por algo de errado que o cliente fez (como erros de validação, por exemplo).
- Os que começam com 5 (5xx) são códigos de falha que foi originada por uma condição não tratada pelo servidor.

> Gostaria também de agradecer todos que compraram o meu livro de REST, já mencionado. Muitas técnicas que usei neste livro foram resultado de _feedback_ dos leitores dele. Sem dúvida alguma, o suporte do público é fundamental para que nós, autores, tenhamos disposição em escrever e disseminar o conhecimento acumulado nestes anos de estrada.


> Trabalho como especialista de software no PagSeguro, tendo anteriormente passado por empresas como Guichê Virtual, Sciensa e Serasa Experian. Como consultor, prestei serviços para empresas dos mais diversos segmentos de atuação, como Netshoes, CVC, Magazine Luiza, iG, Oi internet, e muitas outras.


### 39.4 Versionamento por um cabeçalho customizado

1. Depois, temos que modificar o método para construir um `TravelRequestOutput` (através do método `map`).
1. Construir um `EntityModel` (através do método `buildOutputModel`).
1. O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
1. O cliente (aplicação) envia um par `client ID` e `client secret` para o servidor de autorização;
1. O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
- [8 Documentando a API](08-documentacao.html)
- Os que começam com 2 (2xx) são códigos de sucesso - mostram ao cliente que a requisição finalizou seu processamento com sucesso. O código 200 é uma resposta genérica de sucesso, e os outros propõem ao cliente que este faça nossos tratamentos mais complexos.
- Os que começam com 4 (4xx) são códigos de falha que foi originada por algo de errado que o cliente fez (como erros de validação, por exemplo).
- Os que começam com 5 (5xx) são códigos de falha que foi originada por uma condição não tratada pelo servidor.
- Se modelarmos a URL como `/solicitacoes/viagens`, vamos acabar considerando que todas as viagens pertencem de uma vez só a todas as solicitações de viagens, o que é um erro;

> Muitas pessoas fizeram parte da concepção deste livro, participando direta ou indiretamente. Este livro nasceu como segunda versão do meu livro _REST: Construa API's inteligentes de maneira simples_ (tendo sido dissociado posteriormente), então existe uma história de no mínimo 7 anos envolvida.


> Gostaria também de agradecer todos que compraram o meu livro de REST, já mencionado. Muitas técnicas que usei neste livro foram resultado de _feedback_ dos leitores dele. Sem dúvida alguma, o suporte do público é fundamental para que nós, autores, tenhamos disposição em escrever e disseminar o conhecimento acumulado nestes anos de estrada.


### 39.5 Versionamento pelo cabeçalho Accept

1. O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
1. Quando o dispositivo é marcado como autorizado, a próxima requisição _polling_ que o dispositivo fará vai obter o `access token`, permitindo que o fluxo continue pelo dispositivo móvel.
- Os que começam com 5 (5xx) são códigos de falha que foi originada por uma condição não tratada pelo servidor.

### 39.6 Finalmente, qual modelo escolher?


> A partir do capítulo 7, inicia-se a segunda parte do livro, sobre APIs. Esse capítulo vai utilizar os conhecimentos já adquiridos ao longo do livro e os sedimenta. Então, veremos como criar URLs mais significativas para nossos clientes, quais os códigos HTTP mais importantes, como fornecer mensagens de erro significativas, como internacionalizar as mensagens de erro e, finalmente, como criar APIs 


## 40. 8.1 Criando uma documentação viva com Swagger/OpenAPI

- O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
- O dispositivo envia uma requisição para o servidor de autorização;
- Enquanto isso, o dispositivo móvel ficava fazendo _polling_ no servidor para verificar se já havia uma resposta;

## 41. 8.2 Utilizando o documenter do Postman


### 41.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

## 42. 9.1 Paginação


## 43. 9.2 CORS


## 44. 9.3 OAuth


### 44.1 Authorization Code Flow

1. O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);
1. O dispositivo apresenta o `User Code` e `Verification URL` para o cliente;

### 44.2 Client Credentials Flow

1. O usuário manifesta, ao clicar no botão de _login_ do C.A.R., seu desejo em utilizar seus dados da rede social; 2) O C.A.R. (que já estava cadastrado na rede social e, portanto, possui um `client ID` e um `client secret`) notifica a rede social deste desejo, e apresenta seus dados para a rede social; 3) A rede social devolve um _link_ para que o usuário seja redirecionado; 4) O usuário, ao ser redirecionado, se depara com uma tela expressando o uso que o C.A.R. fará de seus dados. Ao concordar, a rede social redireciona o usuário para o C.A.R. com um código de acesso; 5) De posse desse código de acesso, o C.A.R. faz uma nova requisição para a rede social, solicitando o **access token** que permite que o C.A.R. acesse o conjunto de dados que foi autorizado pelo cliente.
1. O cliente (aplicação) envia um par `client ID` e `client secret` para o servidor de autorização;
1. O servidor de autorização valida e, caso estejam corretos, retorna um `access token` para o cliente;
1. O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);
1. O dispositivo apresenta o `User Code` e `Verification URL` para o cliente;
- [4 Criando clientes REST](04-clientes.html)
- Os que começam com 1 (1xx) são informacionais - mostram ao cliente que a requisição foi recebida e que algo está sendo executado. Geralmente não são muito utilizados.
- Os que começam com 2 (2xx) são códigos de sucesso - mostram ao cliente que a requisição finalizou seu processamento com sucesso. O código 200 é uma resposta genérica de sucesso, e os outros propõem ao cliente que este faça nossos tratamentos mais complexos.
- Os que começam com 3 (3xx) são códigos de redirecionamento - mostram ao cliente que o resultado final da requisição depende de outras ações.
- Os que começam com 4 (4xx) são códigos de falha que foi originada por algo de errado que o cliente fez (como erros de validação, por exemplo).

> * [ISBN](index.html)
  * [Agradecimentos](01-agradecimentos.html)
  * [Sobre o autor](02-sobre_o_autor.html)
  * [Introdução](04-introducao.html)
  * Serviços em REST
    * [1 O que é REST, afinal?](01-oqueerest.html)
    * [2 Expandindo nosso serviço inicial](02-expandindo.html)
    * [3 Criando relacionamentos entre recursos](03-relacionamentos.html)
    * [4 Criando clientes REST](04-clientes.h


> No capítulo 2 esta API é expandida, e daí vemos como recuperar dados de passageiros específicos, além de como criar estes dados, atualizar (total ou parcial) e apagar - tudo isso com um cliente especializado, o `Postman`. Também veremos como funciona um dos pilares fundamentais de REST, o da negociação de conteúdo, e conheceremos o que é idempotência e seus efeitos práticos sobre as APIs.


### 44.3 Device Flow

1. O servidor retorna o `Device Code` (ID do dispositivo registrado no servidor), `User Code` (ID do cliente registrado) e `Verification URL` (a URL onde o fluxo poderá prosseguir);

### 44.4 Password Credentials Flow

- Password: (em branco)

## 45. 9.4 AWS API Gateway


### 45.1 Conclusão

- Se modelarmos a URL como `/solicitacoes/{id}/viagens`, vamos acabar chegando à conclusão de que sempre vamos precisar do ID da solicitação de viagem para conseguir chegar à viagem ocorrida, o que prejudica a usabilidade da nossa API;

### 45.2 Cloud computing


### 45.3 Serverless


### 45.4 CQRS


### 45.5 GraphQL


### 45.6 OAuth
