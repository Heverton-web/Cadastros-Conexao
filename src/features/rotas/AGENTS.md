# AGENTS.md — Módulo Rotas de Visitas

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Planejamento e execução de rotas de visitas a clientes. Upload base, formulário, relatórios.

## Estrutura

```
src/features/rotas/
├── module.ts              # 3 rotas, 4 eventos, 6 permissões
├── permissions.ts         # Permissões de rotas
├── types.ts               # Tipos
├── services/              # Services
├── hooks/                 # Hooks
├── components/            # Componentes
└── lib/                   # Utilitários
```

## Rotas

`/rotas`, `/rotas/$id`, `/rotas/design`

## Permissões

`rotas_planejar`, `rotas_executar`, `rotas_configurar`, `rotas_upload_base`, `rotas_ver_relatorios`, `rotas_form_config`

## Eventos

`rota.criada`, `rota.iniciada`, `rota.finalizada`, `visita.registrada`

## Tabelas

`rotas_config`, `rotas_clientes_base`, `rotas`, `rotas_clientes`, `rotas_trajetos`, `rotas_visitas`, `rotas_form_perguntas`
