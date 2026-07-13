# Análise de Legado e Refatoração — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Legado Identificado

### 1.1 Bubble.io Import

- **Script**: `scripts/migrate-bubble.mjs`
- **SQL**: `scripts/import-bubble.sql`
- **Dados migrados**: Cadastros, endereços, documentos do Bubble.io

### 1.2 Subsistema CRM Antigo

Tabelas legadas que coexistem com o novo CRM:

| Tabela | Relação com novo CRM |
|---|---|
| `usuarios` (cadastros antigos) | Substituída por `profiles` |
| `clientes` (view) | Substituída por `cadastros` |
| `visitas` | Substituída por `crm_visitas` |

### 1.3 Tabelas Duplicadas/Gêmeas

| Tabela 1 | Tabela 2 | Sugestão |
|---|---|---|
| `mapas_distributors` | `mapas_consultants` | Unificar com `tipo` ENUM |
| `linktree_colaboradores` | `linktree_empresa_*` | Manter separado |

### 1.4 Eventos Legados do Pipeline

Eventos definidos em `webhooks.ts`:
```typescript
EVENTOS_STATUS_CHANGE = ["link_gerado", "dados_enviados", "em_analise", ...]
EVENTOS_BUTTON_ACTION = ["botao_compartilhar_link", ...]
```
Duplicados com os eventos registrados em `module.ts`.

---

## 2. Dívida Técnica

| Item | Severidade | Localização |
|---|---|---|
| Mapas sem `type` nos eventos | Baixa | `src/features/mapas/module.ts` |
| Eventos legados duplicados | Média | `src/core/services/webhooks.ts` |
| 3 módulos sem eventos | Média | Marketing, Gerador Links, Empresa |
| `nps_perguntas.empresa_id` nullable | Média | Migration 00036 |
| Trigger `on_auth_user_created` recriado | Baixa | Migration 00023 |

---

## 3. Roadmap de Refatoração

### Alta Prioridade

| Tarefa | Módulo |
|---|---|
| Adicionar eventos ao Marketing | Marketing |
| Adicionar eventos ao Gerador Links | Gerador Links |
| Normalizar `type` nos eventos do Mapas | Mapas |
| Unificar eventos legados do pipeline | Cadastros |

### Média Prioridade

| Tarefa | Módulo |
|---|---|
| Limpar tabelas CRM antigas | CRM |
| Unificar tabelas gêmeas de mapas | Mapas |
| Adicionar testes ao módulo Cadastros | Cadastros |
| Adicionar rollback de migrações | Global |

### Baixa Prioridade

| Tarefa |
|---|
| Remover migration 00048 (deprecada) |
| Adicionar soft delete a todas as tabelas |
| Normalizar nullable `nps_perguntas.empresa_id` |
