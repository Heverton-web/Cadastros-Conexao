# Resumo Consolidado — Banco de Dados ERP Conexão

> **13 módulos documentados** — Gerado em: 04/07/2026

---

## Sumário

1. [Lista de Arquivos Gerados](#1-lista-de-arquivos-gerados)
2. [Resumo por Módulo](#2-resumo-por-módulo)
3. [Comparativo Geral](#3-comparativo-geral)
4. [RLS Patterns Identificados](#4-rls-patterns-identificados)
5. [Oportunidades de Refatoração](#5-oportunidades-de-refatoração)
6. [Estatísticas Gerais do Sistema](#6-estatísticas-gerais-do-sistema)

---

## 1. Lista de Arquivos Gerados

| # | Arquivo | Módulo | Tamanho (seções) |
|---|---|---|---|
| 1 | `cadastros.md` | Cadastros | 11 seções |
| 2 | `hub.md` | Hub (Treinamento & Gamificação) | 11 seções |
| 3 | `nps.md` | NPS (Pesquisa de Satisfação) | 8 seções |
| 4 | `mapas.md` | Mapas (Presença) | 9 seções |
| 5 | `linktree.md` | LinkTree (Bio Links) | 9 seções |
| 6 | `gerador-links.md` | Gerador de Links | 9 seções |
| 7 | `rotas.md` | Rotas | 8 seções |
| 8 | `despesas.md` | Despesas | 9 seções |
| 9 | `crm.md` | CRM | 8 seções |
| 10 | `funis.md` | Funis (Kanban) | 8 seções |
| 11 | `marketing.md` | Marketing | 11 seções |
| 12 | `empresas.md` | Empresa (Core Multi-tenant) | 13 seções |
| 13 | `global.md` | Global (Infraestrutura) | 23 seções |
| | **resumo-banco-dados.md** | **(este arquivo)** | — |

---

## 2. Resumo por Módulo

### 2.1 Cadastros — `cadastros.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 6: `cadastros`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`, `documentos`, `form_schema` |
| **Tabelas suporte** | 5+: `permissoes`, `credenciais`, `atividades`, `notificacoes` |
| **ENUMs** | 3+ (status cadastro, tipo_pessoa, tipo_endereco) |
| **RLS Pattern** | Super admin OR admin/consultor (baseado em `created_by`) |
| **Rotas** | ~12 |
| **Migrações** | ~10 (00001 a 00025 + posteriores) |
| **Destaque** | Entidade central do sistema; fluxo de status com 6 estados (link_gerado → dados_enviados → em_analise → em_correcao → aprovado → reprovado); view `clientes` que join 3 tabelas |
| **Trigger** | `set_created_by` — seta `created_by = auth.uid()` automaticamente |

### 2.2 Hub — `hub.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | **15** (maior número do sistema) |
| **ENUMs** | 7: `hub_app_role`, `hub_app_status`, `hub_app_language`, `hub_material_type`, `hub_translation_status`, `hub_progress_status`, `hub_badge_trigger` |
| **RLS Pattern** | Misto: algumas SELECT público (materiais), outras restritas por empresa |
| **Rotas** | ~21 |
| **Migrações** | 5 (00041, 00042, 00043, 00044, 00045) |
| **Destaque** | Conteúdo multilíngue (pt-br, en-us, es-es); gamificação com badges (7 triggers), níveis e pontos; suporte a chatbot; ranking de usuários |

### 2.3 NPS — `nps.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 4: `nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio` |
| **ENUMs** | — (usa texto livre) |
| **RLS Pattern** | Survey público (única tabela com INSERT anônimo no sistema); admin empresa para gestão |
| **Rotas** | ~11 |
| **Migrações** | 4 (00036, 00038, 20260623141500, 20260623150000) |
| **Destaque** | **Único módulo com acesso anônimo a INSERT** (coleta de respostas NPS); dualidade na `nps_perguntas` (coluna `empresa_id` nullable indica refatoração em andamento) |

### 2.4 Mapas — `mapas.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | **2** (menor número do sistema): `mapas_distributors`, `mapas_consultants` |
| **ENUMs** | 1: `mapa_categoria` (EXCLUSIVE, NON_EXCLUSIVE) |
| **RLS Pattern** | SELECT público para anônimos; CRUD restrito por empresa |
| **Rotas** | ~9 |
| **Migrações** | 2 (00035, 20260630000002) |
| **Destaque** | Módulo mais enxuto; tabelas gêmeas (distribuidores e consultores têm estrutura quase idêntica); integração Google Maps |

### 2.5 LinkTree — `linktree.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 6: `linktree_colaboradores`, `linktree_tema_config` + 4 `linktree_empresa_*` |
| **RLS Pattern** | SELECT público para página pública; CRUD admin empresa |
| **Rotas** | ~12 |
| **Migrações** | 3 (00039, 00040, 00053) |
| **Destaque** | 2 submódulos independentes (Colaboradores + Empresa Bio); tema rico com 60+ propriedades JSONB; grants explícitos para `anon`; agendamento de links |

### 2.6 Gerador de Links — `gerador-links.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 3: `gerador_links`, `gerador_templates`, `gerador_link_cliques` |
| **RLS Pattern** | Super admin OR empresa_id |
| **Rotas** | 9 + rota de redirect `/r/:linkId` |
| **Migrações** | 2 (20260701000000, 20260701000001) |
| **Destaque** | 6 tipos de links (WhatsApp, UTM, Google Review, Maps, Waze, QR Code); RPC `registrar_clique()` SECURITY DEFINER; tracking completo com geolocalização, device, referrer |

### 2.7 Rotas — `rotas.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 6: `rotas_config`, `rotas_veiculos`, `rotas_motoristas`, `rotas`, `rotas_paradas`, `rotas_ocorrencias` |
| **RLS Pattern** | Super admin OR empresa_id (padrão) |
| **Rotas** | ~7 |
| **Migrações** | 2 (20260629150000, 20260630000002) |
| **Destaque** | Pipeline completo: config → veículos → motoristas → rotas → paradas → ocorrências; integração Google Maps Directions & Routes API; motoristas herdam veículo |

### 2.8 Despesas — `despesas.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 6: `despesas_tipos`, `despesas_config`, `despesas_periodos`, `despesas`, `despesas_envios`, `despesas_pagamentos` |
| **RLS Pattern** | Super admin OR empresa_id (padrão) |
| **Rotas** | ~7 |
| **Migrações** | 1 (20260629130000) |
| **Destaque** | Pipeline 3 estágios (colaborador → aprovador → financeiro); ciclo de períodos (semanal/quinzenal/mensal); 3 triggers de `updated_at` |

### 2.9 CRM — `crm.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 4: `pipeline_estagios`, `tarefas`, `templates_mensagem`, `metas` |
| **Tabelas compartilhadas** | 6: `usuarios`, `clientes`, `visitas`, `logs_transferencia`, `logs_transferencia_consultor`, `convites_acesso` |
| **RLS Pattern** | **Hierárquico**: super_admin > gestor > consultor (baseado em role CRM `usuarios.role`) |
| **Rotas** | ~15 |
| **Migrações** | 1 (20260629120000) + tabelas base do CRM antigo |
| **Destaque** | Pipeline Kanban com 6 estágios padrão; hierarquia de equipe com auto-referência (`gestor_id`); trigger de log de transferência de clientes |

### 2.10 Funis — `funis.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 7: `funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes` + 3 de templates |
| **RLS Pattern** | Super admin OR empresa_id (padrão) |
| **Rotas** | ~8 |
| **Migrações** | 3 (00037, 20260624090000, 20260630000001) |
| **Destaque** | 2 submódulos (Kanban + Templates); **18 permissões** (maior conjunto do sistema); 46 arquivos de componentes; auto-referências de dependência entre tarefas |

### 2.11 Marketing — `marketing.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | **14**: `mktg_eventos`, `mktg_landing_pages`, `mktg_landing_pages_versoes`, `mktg_meta_contas`, `mktg_meta_campanhas`, `mktg_meta_posts`, `mktg_meta_insights`, `mktg_utms`, `mktg_criativos`, `mktg_campanhas_email`, `mktg_disparos_email`, `mktg_calendario`, `mktg_leads`, `mktg_pixels` |
| **RLS Pattern** | **Perfeitamente uniforme** em todas: `is_super_admin_session() OR empresa_id = get_current_empresa_id()` |
| **Rotas** | ~20 |
| **Migrações** | 1 (20260630100000) |
| **Destaque** | Maior módulo em tabelas (14) e frontend (58 arquivos); **RLS mais consistente** do sistema; integração Meta Ads; versionamento de landing pages; pipeline de conversão completa |

### 2.12 Empresa (Core) — `empresas.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | 4 core + 4 derivadas: `empresas`, `empresas_config`, `modulos_empresa`, `empresa_modulo_limits` + 4 Linktree Empresa |
| **Tabelas que referenciam** | **~45+** (via `empresa_id`) |
| **RLS Pattern** | Core: **super admin only** (mais restritivo do sistema); Derivadas: SELECT público |
| **Rotas** | **~27** (maior número) |
| **Migrações** | **17** (00001, 00010, 00023, 00024, 00025, 00029, 00031, 00038, 00046-00053) |
| **Destaque** | Coração da arquitetura multi-tenant; 3 camadas de código (core/shared/features); 5 funções RLS backbone de segurança; 3 RPCs de admin (SECURITY DEFINER, service_role); **sem permissions.ts** |

### 2.13 Global (Infraestrutura) — `global.md`

| Item | Descrição |
|---|---|
| **Tabelas próprias** | ~20: `profiles`, `permissoes`, `atividades`, `documentos`, `credenciais`, `notificacoes`, `notificacoes_templates`, `webhooks`, `webhook_logs`, `app_config`, `mock_credentials`, `integracoes_config`, `form_schema`, `api_connectors` + 6 CRM antigo |
| **Tabelas removidas** | 3: `pacientes`, `contratos`, `leads` |
| **RLS Pattern** | **5 níveis diferentes**: público → usuário → admin empresa → super admin |
| **Rotas** | ~15 (globais) |
| **Migrações** | ~20+ |
| **Destaque** | Maior diversidade de RLS do sistema; 17 RPCs; 4 triggers; 5 views; workflow engine (notificações → webhooks → api_connectors); subsistema CRM antigo coexiste sem integração |

---

## 3. Comparativo Geral

| Módulo | Tabelas | RLS Pattern | Rotas | ENUMs | Migrações | Diferencial |
|---|---|---|---|---|---|---|
| **Cadastros** | 6+5 | Admin/consultor (created_by) | ~12 | 3+ | ~10 | Entidade central, view clientes |
| **Hub** | **15** | Misto (público + empresa) | ~21 | **7** | 5 | Multilíngue, gamificação |
| **NPS** | 4 | **Anônimo INSERT** | ~11 | — | 4 | Survey público |
| **Mapas** | **2** | Público SELECT | ~9 | 1 | 2 | Mais enxuto |
| **Linktree** | 6 | Público + admin empresa | ~12 | — | 3 | 2 submódulos |
| **Gerador Links** | 3 | Super admin + empresa | 9+1 | — | 2 | 6 tipos de link |
| **Rotas** | 6 | Padrão empresa | ~7 | — | 2 | Pipeline completo |
| **Despesas** | 6 | Padrão empresa | ~7 | — | 1 | 3 estágios aprovação |
| **CRM** | 4+6 | **Hierárquico** | ~15 | **7** | 1+base | Kanban, hierarquia equipe |
| **Funis** | 7 | Padrão empresa | ~8 | — | 3 | 18 permissões |
| **Marketing** | **14** | **Uniforme** | ~20 | — | 1 | Maior frontend |
| **Empresa** | 4 core | **Super admin only** | **27** | — | **17** | Multi-tenant core |
| **Global** | **~20** | **5 níveis** | 15 | — | ~20+ | Workflow engine |
| | | | | | | |
| **TOTAL** | **~92** | **6 patterns** | **~170** | **~18** | **~70** | **13 módulos** |

---

## 4. RLS Patterns Identificados

### Padrão 1 — Super Admin Exclusivo
```
is_super_admin_session()
```
**Tabelas:** `app_config`, `mock_credentials`, `integracoes_config`, `empresas` (INSERT/UPDATE/DELETE)
**Quem acessa:** Apenas super admin

### Padrão 2 — Super Admin + Admin Empresa
```
is_super_admin_session() OR (role = 'admin' AND empresa_id = get_current_empresa_id())
```
**Tabelas:** `credenciais`, `webhooks` (INSERT/UPDATE/DELETE), `empresa_modulo_limits` (SELECT)
**Quem acessa:** Super admin + admin da empresa

### Padrão 3 — Super Admin + Empresa (Padrão ~90%)
```
is_super_admin_session() OR empresa_id = get_current_empresa_id()
```
**Tabelas:** Maioria das tabelas de módulos (NPS, Funis, Rotas, Despesas, Marketing, etc.)
**Quem acessa:** Super admin + qualquer usuário da empresa

### Padrão 4 — Hierárquico (CRM)
```
has_role(auth.uid(), 'super_admin')  -- super admin total
OR gestor_id = auth.uid()            -- gestor vê seus consultores
OR consultor_atual_id = auth.uid()   -- consultor vê seus clientes
```
**Tabelas:** `usuarios`, `clientes`, `visitas`, `logs_transferencia`
**Quem acessa:** Hierarquia super_admin > gestor > consultor

### Padrão 5 — Usuário Individual
```
auth.uid() = usuario_id
```
**Tabelas:** `notificacoes` (SELECT/UPDATE), `permissoes` (SELECT), `profiles` (SELECT próprio)
**Quem acessa:** Apenas o próprio usuário (exceto super admin)

### Padrão 6 — Público/Anônimo
```
SELECT: true   -- qualquer um pode ler
INSERT: true   -- qualquer um pode inserir (apenas NPS)
```
**Tabelas:** `form_schema`, `empresas_config`, `mapas_*` (SELECT), NPS (INSERT), Linktree Empresa (SELECT)
**Quem acessa:** Qualquer pessoa, inclusive não autenticada

---

## 5. Oportunidades de Refatoração

### 5.1 Tabelas Gêmeas (Duplicação)
- `mapas_distributors` / `mapas_consultants` — estrutura quase idêntica, poderiam ser unificadas com coluna `tipo` ENUM
- `linktree_colaboradores` / `linktree_empresa_*` — 2 subsistemas Linktree com sobreposição de funcionalidades

### 5.2 Dualidade e Migrações Incompletas
- `nps_perguntas.empresa_id` **nullable** — indica que a migração de global para multi-tenant não foi finalizada
- Migration `00048_empresa_role_limits.sql` mantida como **deprecada** — arquivo órfão

### 5.3 Subsistema CRM Antigo
- Tabelas `usuarios`, `clientes`, `visitas`, `logs_transferencia`, `convites_acesso` coexistem com `src/features/crm/`
- **Duas tabelas `clientes`**: view moderna (00005) + tabela física do CRM antigo (20260512)
- **Dois triggers `handle_new_user`**: um para `profiles` e outro para `usuarios` — podem conflitar

### 5.4 Ausência de Permissions.ts
- **Marketing**: 14 tabelas sem registro de permissões no sistema (`permissions.ts`)
- **Empresa**: Sem `permissions.ts` propositalmente (controle via RLS)
- **Global**: A maioria das features não tem `module.ts` nem `permissions.ts`

### 5.5 Inconsistências de RLS
- `empresas` — apenas super admin pode modificar, mas admin da empresa não pode alterar nem o próprio perfil
- `notificacoes` — todos autenticados podem criar, mas apenas o dono pode ver (pode gerar spam)
- `webhooks` (00006 → 00008) — política mudou de "super admin only" para "qualquer autenticado SELECT" para permitir disparo

### 5.6 Frontend
- Marketing é o único módulo com submódulos independentes registrados como módulos no registry (calendar, criativos, etc.)
- Hub tem 21 rotas mas 15 tabelas — índice rota/tabela alto

---

## 6. Estatísticas Gerais do Sistema

| Métrica | Valor |
|---|---|
| **Total de módulos documentados** | 13 |
| **Total de tabelas (estimado)** | ~92 |
| **Total de ENUMs** | ~18 |
| **Total de rotas frontend (estimado)** | ~170 |
| **Total de migrações SQL** | ~70 |
| **Total de RPCs** | 17+ (globais) + 5+ (módulos) |
| **Total de triggers** | 8+ |
| **Total de funções helper** | 7 |
| **Total de views** | 5 |
| **Padrão RLS dominante** | `is_super_admin_session() OR empresa_id = get_current_empresa_id()` (~90%) |
| **Menor módulo** | Mapas (2 tabelas) |
| **Maior módulo (tabelas)** | Hub (15) / Marketing (14) |
| **Maior módulo (rotas)** | Empresa (~27) |
| **Maior frontend** | Marketing (58 arquivos) |
| **Único com INSERT anônimo** | NPS |
| **Único sem permissions.ts** | Empresa |
| **RLS mais uniforme** | Marketing |
| **RLS mais diverso** | Global (5 níveis) |
| **RLS mais restritivo** | Empresa (core) |

---

> **Documentos gerados automaticamente via análise das migrações SQL e código frontend do ERP Conexão.**
