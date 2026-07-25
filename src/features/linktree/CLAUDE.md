# CLAUDE.md — Módulo LinkTree

## Visão Geral

Cartões digitais e QR Codes dos colaboradores. Perfis públicos com analytics.

## Estrutura

```
src/features/linktree/
├── module.ts              # Registro do módulo
├── permissions.ts         # 13 permissões
├── types.ts               # Tipos
├── services/              # 1 service
├── hooks/                 # 2 hooks
├── components/            # 18 componentes
└── lib/                   # 1 utilitário
```

## Rotas

| Rota | Descrição |
|---|---|
| `/linktree/dashboard` | Dashboard LinkTree |
| `/linktree/empresa` | LinkTree da empresa |

## Permissões

- `lt_ver_dashboard`, `lt_criar_colaborador`, `lt_editar_colaborador`, `lt_excluir_colaborador`
- `lt_toggle_status`, `lt_ver_link`, `lt_ver_qr`, `lt_baixar_qr`
- `lt_gerenciar_tema`, `lt_empresa_ver`, `lt_empresa_editar`
- `lt_empresa_ver_analytics`, `lt_empresa_gerar_qr`

## Eventos

- `colaborador.criado`, `colaborador.ativado`, `colaborador.inativado`

## Tabelas

- `linktree_colaboradores` — Colaboradores
- `linktree_empresa_config` — Configuração da empresa
- `linktree_empresa_links` — Links do linktree
- `linktree_empresa_sections` — Seções
- `linktree_empresa_clicks` — Cliques/analytics
- `linktree_tema_config` — Tema visual
