# CLAUDE.md — Módulo Documentos

## Visão Geral

Upload, aprovação e gestão de documentos de cadastro. Sem module.ts formal — biblioteca utilitária.

## Estrutura

```
src/features/documentos/
└── index.ts    # Service functions e tipos
```

## Funções

- `uploadDocumento`, `listarDocumentos`
- `aprovarDocumento`, `reprovarDocumento`, `solicitarCorrecaoDocumento`
- `reverterDocumento`, `getDocumentosStatus`, `getDocumentosStatusMap`
- `setDocumentosMassa`

## Tabelas

- `documentos` — Documentos do cadastro

## Tipos

- `DocumentoStatus`: pendente | ok | reprovado | em_correcao
- `DocStatus`: inclusa | incompleta | nao_enviada | pendente | em_analise
