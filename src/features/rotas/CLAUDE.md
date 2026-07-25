# CLAUDE.md — Módulo Rotas de Visitas

## Visão Geral

Planejamento e execução de rotas de visitas a clientes. Upload de base, formulário pós-visita e relatórios.

## Estrutura

```
src/features/rotas/
├── module.ts              # Registro do módulo
├── permissions.ts         # 6 permissões
├── types.ts               # Tipos
├── services/              # Services
├── hooks/                 # Hooks
├── components/            # Componentes
└── lib/                   # Utilitários
```

## Rotas

| Rota | Descrição |
|---|---|
| `/rotas` | Lista de rotas |
| `/rotas/$id` | Detalhe da rota |
| `/rotas/design` | Design da página |

## Permissões

- `rotas_planejar`, `rotas_executar`, `rotas_configurar`
- `rotas_upload_base`, `rotas_ver_relatorios`, `rotas_form_config`

## Eventos

- `rota.criada`, `rota.iniciada`, `rota.finalizada`, `visita.registrada`

## Tabelas

- `rotas_config` — Configurações de rotas
- `rotas_clientes_base` — Base de clientes
- `rotas` — Rotas planejadas
- `rotas_clientes` — Clientes da rota
- `rotas_trajetos` — Trajetos
- `rotas_visitas` — Visitas realizadas
- `rotas_form_perguntas` — Perguntas do formulário
