---
name: introducao-arquitetura-design
description: >-
  Passos operacionais do livro 'Introducao a Arquitetura e Design de Software' (Paulo Silveira & Guilherme Silveira) — fundamentos de arquitetura, design e boas praticas.
---

# Introducao a Arquitetura e Design de Software — Passos Operacionais

Skill baseada no livro "Introducao a Arquitetura e Design de Software" de Paulo Silveira, Guilherme Silveira e colaboradores (Casa do Codigo, PT-BR). 
Contem fundamentos de arquitetura de software, design orientado a objetos, boas praticas de codigo e padroes de projeto.

Use quando o usuario pedir orientacao pratica sobre: arquitetura, design, Java, OO, boas praticas, padroes de projeto.

---

## 1. O Papel do Arquiteto de Software

### 1.1 Caracteristicas de um Bom Arquiteto
1. Conhece o codigo profundamente — escreve, le e revisa codigo regularmente.
2. Entende o contexto de negocio onde a tecnologia esta sendo empregada.
3. Guia e e guiado pelos colegas de time — nao e uma "torre de marfim".
4. Prioriza requisitos nao funcionais (escalabilidade, performace, seguranca) junto com as funcionalidades.
5. Consegue detectar escolhas ruins de design e implementacao antes que se tornem problemas.

### 1.2 O que Nao Fazer
1. Nao seja um arquiteto de "torre de marfim" que so faz slides e diagramas sem codigo.
2. Nao tome decisoes isoladamente sem consultar o time.
3. Nao crie arquiteturas superengenheiradas para problemas simples.
4. Nao se afaste do codigo — sem habilidade de codigo, o arquiteto fica refem do time.

---

## 2. Fundamentos de Design de Software

### 2.1 Implementacao, Design ou Arquitetura?
1. Nao ha uma linha clara separando design de arquitetura — ambos fazem parte do mesmo continuum.
2. A arquitetura lida com a estrutura de alto nivel e as decisoes mais custosas de mudar.
3. O design lida com a organizacao interna dos componentes e suas interacoes.
4. A implementacao e onde as decisoes de design se concretizam em codigo.

### 2.2 Qualidade Interna vs Externa
- **Qualidade externa**: o que o usuario percebe (performance, usabilidade, disponibilidade).
- **Qualidade interna**: o que o desenvolvedor percebe (coesao, baixo acoplamento, testabilidade).
- Nao negligencie uma em favor da outra — ambas sao essenciais.

---

## 3. Principios de Design Orientado a Objetos

### 3.1 Encapsulamento
1. Esconda detalhes de implementacao atras de interfaces bem definidas.
2. Atributos private com getters/setters apenas quando necessario.
3. Nao exponha estruturas de dados internas.

### 3.2 Coesao
1. Cada classe deve ter uma responsabilidade bem definida.
2. Metodos que operam nos mesmos dados devem estar na mesma classe.
3. Se uma classe tem multiplas responsabilidades, divida-a.

### 3.3 Acoplamento
1. Prefira acoplamento a interfaces (abstracoes) em vez de implementacoes concretas.
2. Evite acoplamento ciclico entre classes e pacotes.
3. Use injecao de dependencia para reduzir acoplamento.

---

## 4. Boas Praticas de Codigo

### 4.1 Codigo Legivel
1. Nomes de variaveis, metodos e classes devem ser auto-explicativos.
2. Metodos curtos (ate 15-20 linhas) que fazem uma unica coisa.
3. Evite comentarios que explicam codigo ruim — refatore o codigo.

### 4.2 Tratamento de Erros
1. Nao engole excecoes — sempre trate ou propague adequadamente.
2. Use excecoes especificas, nao genericas (Exception, Throwable).
3. Registre erros com contexto suficiente para debug.

### 4.3 Testabilidade
1. Escreva testes antes ou junto com o codigo (TDD).
2. Use mocks apenas para boundaries externas (banco, API, arquivo).
3. Uma boa arquitetura e testavel sem infraestrutura externa.

---

## 5. Modelagem e UML

### 5.1 Diagramas Uteis
1. **Diagrama de Classes**: estrutura estatica do sistema (classes, atributos, metodos, relacoes).
2. **Diagrama de Sequencia**: interacao entre objetos ao longo do tempo.
3. **Diagrama de Pacotes**: organizacao e dependencias entre modulos.
4. **Diagrama de Componentes**: arquitetura em alto nivel.

### 5.2 Quando Usar UML
1. Use diagramas para comunicar decisoes de design, nao para documentar cada detalhe.
2. Prefira codigo a diagramas — o codigo e a fonte da verdade.
3. Diagramas sao uteis para discussions iniciais e visoes gerais.

---

## 6. Web Services e Integracao

### 6.1 REST
1. Recursos sao identificados por URLs.
2. Metodos HTTP definem a acao: GET (ler), POST (criar), PUT (atualizar), DELETE (remover).
3. Use JSON como formato padrao de dados.
4. Stateless: cada requisicao contem toda a informacao necessaria.

### 6.2 SOAP
1. Use SOAP quando houver requisitos de seguranca corporativa ou contratos formais.
2. WSDL define o contrato do servico.
3. Prefira REST para novos projetos, a menos que haja requisitos especificos para SOAP.

---

## 7. Gerenciamento de Dependencias

### 7.1 Injecao de Dependencia
1. Passe dependencias pelo construtor — evite new dentro das classes.
2. Use interfaces para definir contratos entre camadas.
3. Considere frameworks de DI (Spring, Guice) para projetos grandes.

### 7.2 Inversao de Controle
1. O fluxo de controle e determinado pelo framework, nao pela aplicacao.
2. O codigo da aplicacao chama frameworks apenas atraves de callbacks.
3. Nao dependa diretamente do framework no codigo de negocio — use adapters.

---

## 8. Checklist do Arquiteto

- [ ] Eu escrevo e reviso codigo regularmente?
- [ ] As decisoes arquiteturais sao compreendidas pelo time?
- [ ] A arquitetura prioriza requisitos nao funcionais junto com funcionais?
- [ ] O codigo e testavel sem infraestrutura externa?
- [ ] As dependencias apontam na direcao correta (abstracoes, nao concretas)?
- [ ] O design e simples o suficiente para o time atual?
- [ ] Estou aprendendo com o feedback do codigo e do time?
