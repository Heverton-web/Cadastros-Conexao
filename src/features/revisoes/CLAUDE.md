# CLAUDE.md — Módulo Revisões

## Visão Geral

Gestão de revisões de cadastro. Biblioteca utilitária — sem module.ts formal.

## Estrutura

```
src/features/revisoes/
└── index.ts    # Service functions e tipos
```

## Funções

- `getRevisoes()` — Obter revisões do cadastro
- `setRevisaoCampo()` — Definir revisão de campo
- `setRevisoesMassa()` — Definir revisões em massa

## Tabelas

- `cadastros` (campo JSON `revisoes`)

## Tipos

- `RevisaoStatus`: pendente | ok | reprovado | em_correcao
- `CampoRevisao`: Campo com status de revisão
- `Revisoes`: Mapa de campos revisados
