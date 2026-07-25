# AGENTS.md — Módulo LinkTree

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Cartões digitais e QR Codes dos colaboradores. Perfis públicos com analytics.

## Estrutura

```
src/features/linktree/
├── module.ts              # 2 rotas, 3 eventos, 13 permissões
├── permissions.ts         # Permissões LinkTree
├── types.ts               # Tipos
├── services/              # 1 service
├── hooks/                 # 2 hooks
├── components/            # 18 componentes
└── lib/                   # 1 utilitário
```

## Rotas

`/linktree/dashboard`, `/linktree/empresa`

## Permissões

`lt_ver_dashboard`, `lt_criar_colaborador`, `lt_editar_colaborador`, `lt_excluir_colaborador`, `lt_toggle_status`, `lt_ver_link`, `lt_ver_qr`, `lt_baixar_qr`, `lt_gerenciar_tema`, `lt_empresa_ver`, `lt_empresa_editar`, `lt_empresa_ver_analytics`, `lt_empresa_gerar_qr`

## Eventos

`colaborador.criado`, `colaborador.ativado`, `colaborador.inativado`

## Tabelas

`linktree_colaboradores`, `linktree_empresa_config`, `linktree_empresa_links`, `linktree_empresa_sections`, `linktree_empresa_clicks`, `linktree_tema_config`
