---
name: building-microservices-go
description: >-
  Passos operacionais do livro 'Building Server-side and Microservices with Go' (Dusan Stojanovic) — microservicos em Go, APIs REST, concorrencia e boas praticas.
---

# Building Server-side and Microservices with Go --- Passos Operacionais

Skill baseada no livro 'Building Server-side and Microservices with Go' de Dusan Stojanovic (EN).
Contem praticas para construcao de servidores e microservicos em Go.

Use quando o usuario pedir orientacao pratica sobre: microservicos, Go, APIs REST, concorrencia.

---

## 1. Estrutura de Projeto Go

1. Use `go mod init` para inicializar o modulo.
2. Organize em: `cmd/` (entrypoints), `internal/` (privado), `pkg/` (publico).
3. Separe handlers, services, repositories e models em pacotes.
4. Cada microservico deve ter seu proprio modulo.

## 2. Servidor HTTP Basico

1. `http.HandlerFunc` para handlers simples.
2. `http.NewServeMux()` para roteamento.
3. `http.ListenAndServe(":8080", mux)` para iniciar.
4. Middlewares: `http.Handler(logging(auth(mux)))`.

## 3. APIs REST

1. Recursos no plural: `/api/users`.
2. GET para listar/buscar, POST para criar, PUT para atualizar, DELETE para remover.
3. JSON: `json.NewEncoder(w).Encode(data)` e `json.NewDecoder(r.Body).Decode(&data)`.
4. Status codes: 200, 201, 204, 400, 404, 500.

## 4. Concorrencia

1. Goroutines: `go funcName()` para execucao concorrente.
2. `sync.WaitGroup` para aguardar multiplas goroutines.
3. Canais: `ch := make(chan T)` para comunicacao segura.
4. Padroes: Pipeline, Fan-out/Fan-in, Worker Pool.
5. `context.Context` para propagar cancelamento e timeouts.

## 5. Persistencia

1. `database/sql` para bancos relacionais.
2. `go.mongodb.org/mongo-driver` para MongoDB.
3. Defina interfaces de repositorio no pacote `domain`.

## 6. Testes

1. Arquivos `*_test.go` no mesmo pacote.
2. `httptest.NewServer(handler)` para testar APIs.
3. `httptest.NewRequest()` para criar requisicoes de teste.

## 7. Docker e Deploy

1. Dockerfile multi-estagio com `golang:alpine` para build.
2. Configure via variaveis de ambiente (`os.Getenv`).
3. Use logging estruturado com niveis: debug, info, warn, error.

## Conceitos Fundamentais

- distribution. The package will install it into /usr/local/go directory.
- case reﬂect.Int, reﬂect.Int8, reﬂect.Int16, reﬂect.Int32, reﬂect.Int64:
- after the electrical switch designed to protect electrical circuit from
- Slice literals are similar to array literals. Only diﬀerence is length
- will be false, and function will return false, zero values for integer

## Princípios e Técnicas

- functionalities (microservices). Microservices will continue to evolve
- I would like to thank all of my friends, if I try to list them all, I
- in further chapters, will be presented here. This chapter will try to
- /usr/local directory. This will create new In order to work properly,
- uint8 (set of all 8-bit unsigned integers), uint16 (set of all 16-bit

## Aplicações Práticas

- respective types. In our case all ﬁelds are integers, so value 0 will
- create slice that references that array. In this case, creating slice
- function will create array of ﬁve 0 values (default value for integer
- y is 6). It is regular situation to call method for variable with nil
- is ready to pick up variable. If receiver is ready before variable is
