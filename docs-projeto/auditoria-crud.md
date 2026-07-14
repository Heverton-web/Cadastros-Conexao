# Auditoria CRUD — Relatório Consolidado

**Data:** 13/07/2026
**Total de módulos auditados:** 14 registrados + complementares
**Issues encontrados:** 90 (24 CRÍTICOS, 28 ALTOS, 28 MÉDIOS, 10 BAIXOS)

---

## Sumário por Módulo

| Módulo | CRÍTICO | ALTO | MÉDIO | BAIXO | Total |
|--------|---------|------|-------|-------|-------|
| Catálogo | 0 | 0 | 0 | 0 | 0 ✅ |
| Cadastros | 2 | 3 | 3 | 3 | 11 |
| CRM | 2 | 4 | 4 | 2 | 12 |
| NPS | 5 | 1 | 3 | 0 | 9 |
| Despesas | 1 | 6 | 5 | 0 | 12 |
| Hub | 4 | 1 | 4 | 0 | 9 |
| Funis | 1 | 0 | 2 | 0 | 3 |
| Mapas | 1 | 0 | 1 | 1 | 3 |
| Gerador Links | 2 | 1 | 0 | 0 | 3 |
| LinkTree | 2 | 1 | 0 | 0 | 3 |
| Rotas | 0 | 1 | 2 | 2 | 5 |
| Marketing | 2 | 8 | 3 | 3 | 16 |
| Empresas | 3 | 3 | 3 | 2 | 11 |
| Manutenção | 0 | 0 | 2 | 1 | 3 |
| **Total** | **24** | **28** | **28** | **10** | **90** |

---

## 🔴 CRÍTICOS (24)

### Cadastros
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| CAD-C1 | `criarCadastro()` não insere `empresa_id` — quebra multi-tenant | `src/features/clientes/index.ts` | 159-168 |
| CAD-C2 | `listarCadastros()` não filtra por `empresa_id` — vazamento entre tenants | `src/features/clientes/index.ts` | 64-93 |

### CRM
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| CRM-C1 | Delete de tarefa SEM confirmação (AlertDialog ausente) | `src/features/crm/components/TarefasList.tsx` | 161-172 |
| CRM-C2 | INSERT em componentes SEM `.select()` — não retorna registro criado | `src/features/crm/components/NovaTarefaModal.tsx` | 77-87 |

### NPS
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| NPS-C1 | Sem camada de hooks React Query — todo CRUD é supabase direto | `src/features/nps/hooks/` | inexistente |
| NPS-C2 | `NpsPesquisasPage` chama `supabase.from()` direto — INSERT, UPDATE, DELETE, toggle, reorder ignoram service layer | `src/features/nps/components/dashboard/NpsPesquisasPage.tsx` | 161-292 |
| NPS-C3 | `criarPergunta` não dispara evento da Central de Ações | `src/features/nps/services/perguntas.ts` | 31-46 |
| NPS-C4 | `NpsDashboardPage` chama `supabase.from("nps_respostas")` direto no useEffect | `src/features/nps/components/dashboard/NpsDashboardPage.tsx` | 249 |
| NPS-C5 | `NpsRelatoriosPage` chama `supabase.from()` direto | `src/features/nps/components/dashboard/NpsRelatoriosPage.tsx` | - |

### Despesas
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| DESP-C1 | `periodo_id` NUNCA é setado na criação de despesa — fluxo de envio/aprovação/pagamento COMPLETAMENTE MORTO | `src/features/despesas/components/colaborador/NovaDespesaModal.tsx` + `src/features/despesas/types.ts:93-100` + `src/features/despesas/services/despesas.service.ts:63-83` | Cadeia completa |

### Hub
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| HUB-C1 | `window.confirm()` em vez de AlertDialog | `src/features/hub/pages/AdminMateriaisPage.tsx` | 264 |
| HUB-C2 | `window.confirm()` em vez de AlertDialog | `src/features/hub/pages/AdminBadgesPage.tsx` | 170 |
| HUB-C3 | `window.confirm()` em vez de AlertDialog | `src/features/hub/pages/AdminTrilhasPage.tsx` | 169 |
| HUB-C4 | Badge edit chama `createHubBadge` em vez de `updateHubBadge` — duplicata no banco | `src/features/hub/pages/AdminBadgesPage.tsx` | 184-189 |

### Funis
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| FUN-C1 | Missing types: `Comment`, `Label`, `LabelInput`, `Attachment`, `AttachmentInput`, `Automation`, `AutomationInput`, `Notification`, `Recurring`, `RecurringInput`, `Activity`, `FunisFilters` — BUILD QUEBRA | `src/features/funis/types.ts` | Todos |

### Mapas
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| MAP-C1 | `useMapasDistributors` e `useMapasConsultants` não filtram por `empresa_id` na SQL — vazamento de dados entre tenants | `src/features/mapas/hooks/useMapasData.ts` | 7-35 |

### Gerador de Links
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| GL-C1 | `atualizarLink()` SEM `.select()` — update fire-and-forget | `src/features/gerador-links/services/links.service.ts` | 28-33 |
| GL-C2 | `atualizarTemplate()` SEM `.select()` — update fire-and-forget | `src/features/gerador-links/services/templates.service.ts` | 27-32 |

### LinkTree
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| LT-C1 | `LinktreeDashboardPage` bypass completo do React Query + hooks — CRUD com `supabase` direto + `useState` manual | `src/features/linktree/components/LinktreeDashboardPage.tsx` | Todo |
| LT-C2 | `LinktreeColaboradorModal` update chama `supabase.update()` SEM `.select()` | `src/features/linktree/components/LinktreeColaboradorModal.tsx` | 201-206 |

### Marketing
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| MKT-C1 | Delete sem AlertDialog — `handleDeletar` chamado diretamente no clique | `src/features/marketing/calendario-editorial/components/CalendarioGrid.tsx` | 188-196 |
| MKT-C2 | Types inconsistentes com uso real — dados escritos com valores fora do enum | `leads/types.ts`, `pixels/types.ts`, `criativos/types.ts`, `email-marketing/types.ts` | Todos |

### Empresas
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| EMP-C1 | `deletarEmpresa()` SEM cascading deletes — órfãos em config, modulos, credenciais, profiles | `src/shared/empresas/service.ts` | 95-98 |
| EMP-C2 | `window.confirm()` para delete de empresa | `src/routes/global.empresas.tsx` | 96-99 |
| EMP-C3 | Delete de credential SEM confirmação (nem AlertDialog, nem confirm) | `src/routes/empresa.tsx` | 518-526 |

---

## 🟠 ALTOS (28)

### Cadastros
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| CAD-H1 | `updated_at` setado manualmente — deveria usar trigger/coluna default | `src/features/clientes/index.ts` | 178 |
| CAD-H2 | `.as any` em `solicitarCorrecao` perde type safety | `src/features/clientes/index.ts` | 221 |
| CAD-H3 | `tipo_acao` sem validação Zod no input | `src/features/clientes/index.ts` | - |

### CRM
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| CRM-H1 | Inconsistência de import `~/core/supabase` vs `~/lib/supabase` | Múltiplos | - |
| CRM-H2 | `empresa_id` ausente em queries (equipe, transferencia, Kanban) | `crm.equipe.tsx`, `crm.transferencia.*` | - |
| CRM-H3 | Delete de tarefa sem evento disparado | `TarefasList.tsx` | 161-172 |
| CRM-H4 | Transferências de cliente sem evento disparado | `crm.transferencia.*` | - |

### NPS
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| NPS-H1 | INSERT em NpsPesquisasPage SEM `.select()` | `NpsPesquisasPage.tsx` | 292 |

### Despesas
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| DESP-H1 | `enviarDespesas` + `criarOuAtualizarEnvio` sem transação atômica | `src/features/despesas/components/colaborador/EnviarDespesasModal.tsx` | 63-69 |
| DESP-H2 | `aprovarEnvio` faz bulk update sem escopo de empresa | `src/features/despesas/services/envios.service.ts` | 109-114 |
| DESP-H3 | Deletes sem `empresa_id` no service (despesa, tipo, período) | `despesas.service.ts`, `tipos.service.ts`, `periodos.service.ts` | - |
| DESP-H4 | `ConfigForm.tsx` ignora service layer — supabase direto | `src/features/despesas/components/admin/ConfigForm.tsx` | 27-63 |
| DESP-H5 | `usePeriodoAtual` e `usePrazoEnvio` chamam supabase direto em vez do service | `src/features/despesas/hooks/*` | - |
| DESP-H6 | `useDespesasConfig` e `useSalvarConfig` ignoram service layer | `src/features/despesas/hooks/useDespesasConfig.ts` | 12-59 |

### Hub
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| HUB-H1 | Badge edit sempre cria, nunca atualiza (duplicatas) | `AdminBadgesPage.tsx` | 184-189 |

### Gerador de Links
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| GL-H1 | `TemplateManager.tsx` sem botão de editar templates | `src/features/gerador-links/components/TemplateManager.tsx` | - |

### LinkTree
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| LT-H1 | `LinktreeColaboradorModal` usa `supabase.from()` direto em vez de `criarColaborador`/`atualizarColaborador` | `LinktreeColaboradorModal.tsx` | 201-206 |

### Rotas
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| ROT-H1 | `useAdicionarClientesNaRota` passa `""` como `empresa_id` | `src/features/rotas/hooks/useRotas.ts` | 161 |

### Marketing
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| MKT-H1 | Nenhum hooks React Query em todo o módulo — useState + useEffect manual | Todos | - |
| MKT-H2 | 6 sub-módulos SEM service layer — `supabase.from()` direto no componente | Leads, Email, Criativos, WhatsApp, Meta Posts, Meta Campanhas | - |
| MKT-H3 | Funções service duplicadas inline nos componentes (Pixels, LandingPages) | `PixelsList.tsx`, `LandingPagesList.tsx` | - |
| MKT-H4 | UPDATE sem `.select()` em `atualizarLandingPage()` | `landing-pages.service.ts` | 38-43 |
| MKT-H5 | CRUD incompleto — operações faltando (UTMs sem create/update, Criativos sem create/update, Meta Posts sem create/delete) | Múltiplos | - |
| MKT-H6 | Rotas placeholder sem implementação (email.campanha, email.analytics) | `marketing.email.campanha.tsx`, `marketing.email.analytics.tsx` | - |
| MKT-H7 | WhatsApp route usa permissão `mktg_email_ver` em vez de permissão própria | `marketing.whatsapp.tsx` | 10 |
| MKT-H8 | `Utm` type definido no service, não exportado em `types.ts` | `utm.service.ts` | 3-15 |

### Empresas
| ID | Issue | Arquivo | Linha |
|----|-------|---------|-------|
| EMP-H1 | `atualizarEmpresa()` retorna `void` (sem `.select()`) | `src/shared/empresas/service.ts` | 64-93 |
| EMP-H2 | Direct `supabase` calls em route (module activation, RPC) | `src/routes/global.empresas.tsx` | 337-393 |
| EMP-H3 | `criarEmpresa()` engole erro de `empresas_config` upsert silenciosamente | `src/shared/empresas/service.ts` | 60 |

---

## 🟡 MÉDIOS (28)

### Cadastros
- CAD-M1: Consultor clientes bypassa service layer
- CAD-M2: Sem React Query em Cadastros (100% useEffect manual)
- CAD-M3: `solicitarCorrecao` faz 2 chamadas sequenciais quando poderia ser 1

### CRM
- CRM-M1: Kanban update sem feedback pro usuário (só console.error, sem toast)
- CRM-M2: Modais sem scroll pattern (NovaVisitaModal)
- CRM-M3: Tipos duplicados em múltiplos arquivos
- CRM-M4: `.single()` sem `.maybeSingle()` em várias queries (risco 406)

### NPS
- NPS-M1: Migration hardcoded no componente de UI
- NPS-M2: `showRequiredAlert` modal customizado em vez de AlertDialog
- NPS-M3: Sem cache de queries

### Despesas
- DESP-M1: `criarTipoDespesa` não valida `empresa_id`
- DESP-M2: `criarPeriodo` não valida `empresa_id`
- DESP-M3: Delete período sem verificar despesas vinculadas
- DESP-M4: `reabrirPeriodo` não dispara evento

### Hub
- HUB-M1: DialogContent sem scroll pattern (3 modais: Material, Badge, Collection)

### Funis
- FUN-M1: TemplateManager sem edit button (useAtualizarTemplate existe mas não é chamado)
- FUN-M2: Direct `supabase` call em TaskModal para buscar users

### Mapas
- MAP-M1: Usa `dispararWebhooks` (legado) em vez de `dispararEventoModulo`

### Rotas
- ROT-M1: ConfigRotasPage sem React Query hooks
- ROT-M2: Sem edição de rota (após criar, não pode alterar dados)

### Marketing
- MKT-M1: DELETE sem tratamento de erro nos services
- MKT-M2: Linktree redirect routes sem RequirePermission
- MKT-M3: Meta posts e campanhas sem Delete/Edit buttons

### Empresas
- EMP-M1: `desativarManutencao()` sem verificação de ownership `empresa_id`
- EMP-M2: Manutenção sem função de update (só recreate)
- EMP-M3: `listarEmpresas()`/`buscarEmpresa()` engolem erros

### Manutenção
- MAN-M1: `desativarManutencao()` sem verificação empresa_id
- MAN-M2: Sem função de edição para manutenção existente

---

## 🔵 BAIXOS (10)

### Cadastros
- CAD-L1: Excluir verifica permissão, não `profile?.is_super_admin`
- CAD-L2: Modal customizado em vez de Dialog
- CAD-L3: cadastros.relatorios importa supabase direto

### CRM
- CRM-L1: `console.error` sem tratamento superior em try/catch
- CRM-L2: Rota aceitar-convite sem RequirePermission

### Mapas
- MAP-L1: Sem diretório services/ — todo CRUD no hooks file

### Rotas
- ROT-L1: `useRemoverClienteDaRota` invalidação muito ampla
- ROT-L2: `togglePergunta` sem `.select()`

### Marketing
- MKT-L1: Componentes importam supabase direto em vez do service
- MKT-L2: Calendario sem UPDATE (sem editar evento)
- MKT-L3: Criativos sem CREATE (sem dialog de criação)

### Empresas
- EMP-L1: Direct supabase fetch em ManutencaoPanel

---

## 🟢 MÓDULOS EM BOA SAÚDE

| Módulo | Status | Observação |
|--------|--------|-----------|
| **Catálogo** | ✅ Limpo | Issues corrigidos na sessão anterior. Build + 138 testes passando. |
| **Funis** | ⚠️ 1 crítico (types faltando) | Service layer excelente, hooks completos, eventos corretos. O critical é build quebrar. |

---

## Checklist Consolidado

Categorias de problemas encontrados:

| Categoria | Ocorrências | Módulos afetados |
|-----------|-------------|------------------|
| INSERT/UPDATE sem `.select()` | 6+ | CRM, NPS, Gerador Links, LinkTree, Marketing, Empresas |
| `window.confirm()` em vez de AlertDialog | 5 | Hub (3x), Empresas (2x) |
| Supabase direto no componente (bypass service/hooks) | 8+ | NPS, Despesas, LinkTree, Marketing, Empresas |
| Delete sem confirmação (nem AlertDialog, nem confirm) | 3 | CRM, Marketing, Empresas |
| `empresa_id` ausente em queries | 5 | Cadastros, CRM (4x), Mapas |
| `empresa_id` ausente em inserts | 2 | Cadastros, Despesas |
| Sem React Query hooks (useEffect manual) | 4 | Cadastros, NPS, Marketing, LinkTree |
| Missing edit button na UI | 6 | Hub (badges), Funis (templates), Gerador Links, Rotas, Marketing (3x) |
| Evento Central de Ações não disparado | 5 | CRM (2x), NPS, Despesas, Mapas |
| Dialog sem scroll pattern | 4 | CRM, Hub (3x) |
| Types inconsistentes/duplicados | 3 | CRM, Funis, Marketing |
| UPDATE cria duplicata em vez de atualizar | 2 | Hub (badges), Catálogo (já corrigido) |
