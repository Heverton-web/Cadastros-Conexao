# AGENTS.md — Módulo Cadastros

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Gestão de cadastro de clientes PF/PJ com fluxo de aprovação, documentos, revisões e credenciais.

## Estrutura

```
src/features/cadastros/
├── module.ts              # 8 rotas, 17 eventos, 16 permissões
├── permissions.ts         # Workflow de aprovação
├── types.ts               # Tipos
├── services/              # Supabase
├── hooks/                 # React Query
├── components/            # UI (admin + import)
└── lib/                   # Utilitários
```

## Rotas

`/cadastros/dashboard`, `/cadastros/solicitacoes`, `/cadastros/clientes`, `/cadastros/consultor`, `/cadastros/relatorios`, `/cadastros/previsualizacao`, `/global/acoes`, `/empresa/tema`

## Permissões

`ver_todos_cadastros`, `aprovar_cadastro`, `reprovar_cadastro`, `solicitar_correcao_cadastro`, `aprovar_documento`, `reprovar_documento`, `gerenciar_credenciais`, `excluir_cadastro`, `gerar_links`

## Eventos

`cadastro.criado`, `cadastro.aprovado`, `cadastro.reprovado`, `documento.aprovado`, `documento.reprovado`, `link.gerado`, `criacao_credencial`

## Tabelas

`cadastros`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`, `clientes`, `documentos`, `convites_acesso`
