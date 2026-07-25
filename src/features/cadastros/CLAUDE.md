# CLAUDE.md — Módulo Cadastros

## Visão Geral

Gestão de cadastro de clientes PF/PJ com fluxo de aprovação, documentos, revisões e credenciais.

## Estrutura

```
src/features/cadastros/
├── module.ts              # Registro do módulo
├── permissions.ts         # 16 permissões
├── types.ts               # Tipos
├── services/              # Supabase data access
├── hooks/                 # React Query hooks
├── components/            # UI
│   ├── admin/             # CRUD admin
│   └── import/            # Importação
└── lib/                   # Utilitários
```

## Rotas

| Rota | Descrição |
|---|---|
| `/cadastros/dashboard` | Dashboard de cadastros |
| `/cadastros/solicitacoes` | Solicitações pendentes |
| `/cadastros/clientes` | Lista de clientes |
| `/cadastros/consultor` | Visão do consultor |
| `/cadastros/relatorios` | Relatórios |
| `/cadastros/previsualizacao` | Pré-visualização |
| `/global/acoes` | Ações globais |
| `/empresa/tema` | Tema da empresa |

## Permissões

- `ver_todos_cadastros`, `ver_relatorios`, `visualizar_documento`
- `aprovar_cadastro`, `reprovar_cadastro`, `solicitar_correcao_cadastro`
- `aprovar_documento`, `reprovar_documento`, `solicitar_correcao_documento`
- `aprovar_campo`, `reprovar_campo`, `solicitar_correcao_campo`
- `gerenciar_credenciais`, `gerenciar_credenciais_admin`
- `excluir_cadastro`, `gerenciar_config`, `gerar_links`

## Eventos

`cadastro.criado`, `cadastro.aprovado`, `cadastro.reprovado`, `documento.aprovado`, `documento.reprovado`, `link.gerado`, `link_gerado`, `dados_enviados`, `em_analise`, `em_correcao`, `aprovado`, `reprovado`, `botao_compartilhar_link`, `botao_aprovar`, `botao_reprovar`, `botao_corrigir`, `criacao_credencial`

## Tabelas

- `cadastros` — Cadastros principais
- `cadastros_pf` — Pessoa física
- `cadastros_pj` — Pessoa jurídica
- `cadastros_enderecos` — Endereços
- `clientes` — Clientes aprovados
- `documentos` — Documentos do cadastro
- `convites_acesso` — Convites de acesso
