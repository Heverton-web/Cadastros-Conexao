# AGENTS.md — `despesas`

**PT-BR. Sem greetings.** Regras globais em [AGENTS.md](../../../AGENTS.md) da raiz — este arquivo cobre só o que é específico deste módulo.

<!-- sync:fatos -->

**Despesas em Rota** — Gestão de despesas em rota, aprovação e reembolso

Tipo: **registrado** · `key: "despesas"` · 36 arquivos

## Estrutura

```
src/features/despesas/
├── diagnostic.ts
├── index.ts
├── module.ts
├── onboarding.tsx
├── permissions.ts
├── types.ts
├── components/  (15 arquivos)
├── hooks/  (9 arquivos)
└── services/  (6 arquivos)
```

## Rotas

`/despesas` · `/despesas/aprovacao` · `/despesas/meus-relatorios` · `/despesas/relatorios`

## Permissões

`despesas_lancar` · `despesas_enviar` · `despesas_aprovar` · `despesas_reprovar` · `despesas_definir_pagamento` · `despesas_configurar` · `despesas_ver_relatorios` · `despesas_ver_todas`

## Eventos

`despesa.criada` · `despesa.enviada` · `despesa.aprovada` · `despesa.reprovada` · `pagamento.agendado` · `periodo.aberto` · `periodo.fechando`

Disparos no código: 8. Sempre `dispararEventoModulo("despesas", <evento>, payload).catch(() => {})`.

## Registro

- Ambientes: `cadastro` · `consultor` · `tecnologia` · `suporte`
- Abas de config: `geral` · `permissoes` · `credenciais` · `eventos`
- Flags: `hasDiagnostico` · `hasCredentialScopes` · `hasDesignConfig`
- Rota de design: `/empresa/despesas/design`

## Tabelas e RPCs

Tabelas: `comprovantes` · `despesas` · `despesas_config` · `despesas_envios` · `despesas_pagamentos` · `despesas_periodos` · `despesas_tipos`

<!-- /sync:fatos -->

## Notas

- **Débito `empresa_id` (real):** `despesas` e `despesas_periodos` **foram** limpas pela migration `20260721000000`, mas o módulo ainda envia/filtra o campo (129 ocorrências). Insert/update nessas tabelas falha no PostgREST. Em código novo não passe o campo; ao tocar num arquivo que usa, remova. Ver A1 em `docs/agents/plano-correcao-auditoria.md`.
- `comprovantes`, `despesas_config`, `despesas_envios`, `despesas_pagamentos` e `despesas_tipos` mantêm a coluna — nessas, o uso é correto.
