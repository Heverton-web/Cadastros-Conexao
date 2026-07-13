# Resumo Consolidado — Funções dos Módulos ERP Conexão

> **Documento gerado em:** 04/07/2026
> **Total de módulos documentados:** 13 módulos + 1 sistema de permissões
> **Total de arquivos:** 14 documentos

---

## Sumário

1. [Lista de Arquivos Gerados](#1-lista-de-arquivos-gerados)
2. [Resumo por Módulo](#2-resumo-por-módulo)
3. [Comparativo Geral](#3-comparativo-geral)
4. [Padrões Identificados](#4-padrões-identificados)
5. [Observações e Anomalias](#5-observações-e-anomalias)
6. [Estatísticas Gerais](#6-estatísticas-gerais)

---

## 1. Lista de Arquivos Gerados

| # | Arquivo | Módulo | Tamanho |
|---|---|---|---|
| 1 | `cadastros.md` | Cadastros | ~30 seções |
| 2 | `crm.md` | CRM | ~15 seções |
| 3 | `despesas.md` | Despesas | ~10 seções |
| 4 | `empresas.md` | Empresa (Core) | ~40 seções |
| 5 | `funis.md` | Funis Kanban | ~12 seções |
| 6 | `gerador-links.md` | Gerador de Links | ~12 seções |
| 7 | `global.md` | Global (Infraestrutura) | ~35 seções |
| 8 | `hub.md` | Hub Treinamento | ~15 seções |
| 9 | `linktree.md` | LinkTree | ~12 seções |
| 10 | `mapas.md` | Mapas | ~10 seções |
| 11 | `marketing.md` | Marketing | ~12 seções |
| 12 | `nps.md` | NPS | ~10 seções |
| 13 | `permissionamento-granular.md` | Sistema de Permissões | ~20 seções |
| 14 | `rotas.md` | Rotas | ~10 seções |

---

## 2. Resumo por Módulo

### 2.1 Cadastros
| Indicador | Valor |
|---|---|
| **Key** | `cadastros` |
| **Descrição** | Gestão de cadastro de clientes PF/PJ |
| **Ambientes** | cadastro, consultor, tecnologia, suporte |
| **Permissões** | 17 funções granulares |
| **Webhooks** | 6 eventos |
| **Rotas** | 7 páginas |
| **Design Config** | ✅ `/empresa/cadastros/design` |
| **Destaque** | Módulo central do sistema. Fluxo completo: link → cadastro → aprovação/reprovação. 4 grupos de permissão (Escopo, Aprovação, Documentos, Campos, Credenciais, Admin) |

### 2.2 NPS
| Indicador | Valor |
|---|---|
| **Key** | `nps` |
| **Descrição** | Pesquisas de satisfação NPS |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 7 funções granulares |
| **Webhooks** | 3 eventos |
| **Rotas** | 6 páginas |
| **Design Config** | ✅ `/empresa/nps/design` |
| **Tokens Tema** | 58+ `--nps-*` personalizáveis |
| **Destaque** | Único módulo com INSERT anônimo no banco. Survey público com tema independente do design system global. Dashboard com gráficos Recharts, heatmap, análise de sentimento |

### 2.3 Mapas
| Indicador | Valor |
|---|---|
| **Key** | `mapas-interativos` |
| **Descrição** | Mapas interativos de presença comercial |
| **Ambientes** | cadastro, consultor |
| **Permissões** | 5 funções granulares |
| **Webhooks** | 8 eventos |
| **Rotas** | 7 páginas |
| **Design Config** | ✅ `/empresa/mapas/design` |
| **Destaque** | Módulo mais enxuto. SELECT público para anônimos. Mapa SVG do Brasil com pins por estado |

### 2.4 LinkTree
| Indicador | Valor |
|---|---|
| **Key** | `linktree` |
| **Descrição** | Cartões digitais e QR Codes. Bio Instagram |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 13 funções granulares |
| **Webhooks** | 3 eventos |
| **Rotas** | 6 páginas |
| **Design Config** | ✅ `/empresa/linktree/design` |
| **Destaque** | 2 submódulos independentes (Colaboradores + Empresa Bio). 60+ propriedades JSONB de tema. RLS público estratégico |

### 2.5 Gerador de Links
| Indicador | Valor |
|---|---|
| **Key** | `gerador-links` |
| **Descrição** | Geração de links personalizados |
| **Ambientes** | cadastro, tecnologia |
| **Permissões** | 6 funções granulares |
| **Webhooks** | 0 eventos |
| **Rotas** | 9 páginas |
| **Design Config** | ❌ (sem config visual) |
| **Destaque** | Módulo utilitário. 6 tipos de link (WhatsApp, UTM, Google Review, Maps, Waze, QR Code). Tracking de cliques via `/r/:linkId` |

### 2.6 Rotas
| Indicador | Valor |
|---|---|
| **Key** | `rotas` |
| **Descrição** | Planejamento e execução de rotas de visitas |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 6 funções granulares |
| **Webhooks** | 4 eventos |
| **Rotas** | 3 páginas |
| **Design Config** | ✅ `/empresa/rotas/design` |
| **Destaque** | Integração Google Maps. 4 status de rota (planejada, em_execucao, realizada, nao_realizada) |

### 2.7 Despesas
| Indicador | Valor |
|---|---|
| **Key** | `despesas` |
| **Descrição** | Gestão de despesas em rota, aprovação e reembolso |
| **Ambientes** | cadastro, consultor, tecnologia, suporte |
| **Permissões** | 8 funções granulares |
| **Webhooks** | 7 eventos |
| **Rotas** | 4 páginas |
| **Design Config** | ✅ `/empresa/despesas/design` |
| **Destaque** | Pipeline 3 estágios (colaborador → aprovador → financeiro). 6 tabelas no banco. Ciclo de períodos (semanal/quinzenal/mensal) |

### 2.8 CRM
| Indicador | Valor |
|---|---|
| **Key** | `crm` |
| **Descrição** | Gestão de relacionamento com clientes |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 10 funções granulares |
| **Webhooks** | 3 eventos |
| **Rotas** | 13 páginas |
| **Design Config** | ✅ `/empresa/crm/design` |
| **Destaque** | Segundo maior em rotas. Pipeline Kanban com 6 estágios. Hierarquia de equipe (super_admin > diretor > gestor > consultor). Aceitar convite via token |

### 2.9 Funis
| Indicador | Valor |
|---|---|
| **Key** | `funis` |
| **Descrição** | Gerenciamento de funis Kanban |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | **18 funções** (maior conjunto) |
| **Webhooks** | **12 eventos** (maior conjunto) |
| **Rotas** | 4 páginas |
| **Design Config** | ✅ `/empresa/funis/design` |
| **Destaque** | Maior módulo em componentes (46). 18 permissões em 10 grupos. Suporte a templates, automações, labels, comentários, anexos. Credential Scopes implementado |

### 2.10 Marketing
| Indicador | Valor |
|---|---|
| **Key** | `marketing` |
| **Descrição** | Módulo de Marketing Digital |
| **Ambientes** | cadastro, tecnologia |
| **Permissões** | ~9 distribuídas em 13 submódulos |
| **Webhooks** | 0 eventos |
| **Rotas** | **20 páginas** (maior) |
| **Design Config** | ❌ (Nenhum submódulo tem) |
| **Destaque** | Maior módulo em rotas. 13 submódulos: Dashboard, Landing Pages, Email Marketing, Meta Ads, Calendário, Criativos, Pixels, SEO, UTMs, WhatsApp, Leads, LinkTree. Módulo principal sem permissões próprias |

### 2.11 Hub
| Indicador | Valor |
|---|---|
| **Key** | `hub` |
| **Descrição** | Plataforma de treinamento e gamificação |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | **28 funções** (maior quantidade) |
| **Webhooks** | 8 eventos |
| **Rotas** | **18 páginas** |
| **Design Config** | ✅ `/empresa/hub/design` |
| **Destaque** | 4 papéis (Admin, Gestor, Consultor, Distribuidor) + Cliente. 15 tabelas no banco. 7 ENUMs. Sistema de gamificação com badges, níveis, pontos. 5 grupos de permissão (Materiais, Trilhas, Gamificação, Usuários, Admin) |

### 2.12 Empresa (Core Multi-tenant)
| Indicador | Valor |
|---|---|
| **Key** | `empresas-core` |
| **Descrição** | Núcleo de infraestrutura multi-tenant |
| **Ambientes** | N/A (acesso irrestrito) |
| **Permissões** | 0 próprias (infraestrutura) |
| **Webhooks** | 0 eventos |
| **Rotas** | **22+ páginas** |
| **Design Config** | ✅ `/empresa/design` (própria) |
| **Destaque** | Camada fundacional. Módulo especial sem permissions nem ambientes. 5 abas (Dados, Credenciais, Banco Externo, Design, Branding). Gerencia permissões de outros módulos. Define limites de credenciais por módulo. Provider de contexto (`useEmpresa()`) para toda aplicação |

### 2.13 Global (Infraestrutura Compartilhada)
| Indicador | Valor |
|---|---|
| **Key** | N/A (sem module.ts) |
| **Descrição** | Serviços e tabelas compartilhadas |
| **Rotas** | 15 páginas (`/global/*`) |
| **Permissões** | Sistema de permissões usado por todos os módulos |
| **Destaque** | Não possui module.ts próprio. Infraestrutura descentralizada: AuthProvider, Auth, Notificações, Webhooks, Atividades, Documentos, Credenciais, Integrações, Form Schema (legado). 14 categorias de tabelas, 17+ RPCs, 4 triggers, 5 views |

### 2.14 Permissionamento Granular
| Indicador | Valor |
|---|---|
| **Total de permissões** | ~100 (em 18 módulos/submódulos) |
| **Camadas** | 3 (Banco RLS → Registry → UI) |
| **Níveis de granularidade** | 3 (Módulo → Páginas → Ações) |
| **Tabela de persistência** | `public.permissoes` (JSONB) |
| **Trigger automático** | `on_profile_created_permissoes` |
| **Destaque** | Sistema completo em 3 camadas. Hierarquia: Super Admin (bypass) > Admin Empresa > Usuário. Registry em memória com `registerPermission()`, `registerPermissionDefaults()`. UI de gerenciamento via `/empresa/permissoes` e `/global/permissoes` |

---

## 3. Comparativo Geral

### Por Permissões (ranking)

| # | Módulo | Permissões | Webhooks | Rotas | Design Config |
|---|---|---|---|---|---|
| 1 | **Hub** | **28** ⭐ | 8 | 18 | ✅ |
| 2 | **Funis** | 18 | **12** ⭐ | 4 | ✅ |
| 3 | **Cadastros** | 17 | 6 | 7 | ✅ |
| 4 | **LinkTree** | 13 | 3 | 6 | ✅ |
| 5 | **CRM** | 10 | 3 | 13 | ✅ |
| 6 | **Marketing** | ~9 | 0 | **20** ⭐ | ❌ |
| 7 | **Despesas** | 8 | 7 | 4 | ✅ |
| 8 | **NPS** | 7 | 3 | 6 | ✅ |
| 9 | **Gerador Links** | 6 | 0 | 9 | ❌ |
| 10 | **Rotas** | 6 | 4 | 3 | ✅ |
| 11 | **Mapas** | 5 | 8 | 7 | ✅ |
| 12 | **Empresa** | 0* | 0 | **22** ⭐ | ✅ |
| 13 | **Global** | — | — | 15 | ✅ |

\* Empresa não tem permissões próprias porque é infraestrutura.

### Por Rotas (ranking)

| # | Módulo | Rotas |
|---|---|---|
| 1 | **Empresa** | 22+ |
| 2 | **Marketing** | 20 |
| 3 | **Hub** | 18 |
| 4 | **Global** | 15 |
| 5 | **CRM** | 13 |
| 6 | **Gerador Links** | 9 |
| 7 | **Cadastros** | 7 |
| 8 | **Mapas** | 7 |
| 9 | **NPS** | 6 |
| 10 | **LinkTree** | 6 |
| 11 | **Funis** | 4 |
| 12 | **Despesas** | 4 |
| 13 | **Rotas** | 3 |

### Por Webhooks (ranking)

| # | Módulo | Eventos |
|---|---|---|
| 1 | **Funis** | 12 |
| 2 | **Hub** | 8 |
| 3 | **Mapas** | 8 |
| 4 | **Despesas** | 7 |
| 5 | **Cadastros** | 6 |
| 6 | **Rotas** | 4 |
| 7 | **NPS** | 3 |
| 8 | **LinkTree** | 3 |
| 9 | **CRM** | 3 |
| 10 | **Marketing** | 0 |
| 11 | **Gerador Links** | 0 |
| 12 | **Empresa** | 0 |

---

## 4. Padrões Identificados

### 4.1 Estrutura de Registro de Módulos

Todos os módulos seguem o mesmo padrão de `ModuleDefinition`:

```typescript
export const moduloModule: ModuleDefinition = {
  key: "modulo-key",
  nome: "Nome do Módulo",
  descricao: "Descrição",
  icon: LucideIcon,
  routes: string[],
  permissions: string[],
  ambientes: string[],
  abas: { key, label, descricao }[],
  events: { evento }[],
  hasDesignConfig: boolean,
  designRoute?: string,
  setup: () => {
    registerPermission(...)
    registerPermissionDefaults(...)
    registerNavItem({ ..., permissionCheck: ... })
  }
}
```

### 4.2 Padrão de Permissões

- **Nomenclatura**: `{modulo}_{acao}` ou prefixo simplificado (`lt_`, `lk_`, `mktg_`, `crm_`, `hub_`, `funis_`, `rotas_`, `despesas_`, `nps_`, `mapas_`)
- **Cadastros** usa nomes descritivos sem prefixo (`ver_todos_cadastros`, `aprovar_cadastro`)
- **Três níveis de granularidade**: Módulo (ativar/desativar) → Página (nav-item) → Ação (permissão granular)
- **Defaults por ambiente**: `registerPermissionDefaults(moduleKey, { ambiente: { perm: bool } })`
- **Super Admin bypass**: todas as permissões true automaticamente

### 4.3 Padrão de Design Config

- 11 de 13 módulos têm `hasDesignConfig: true`
- Design routes seguem padrão: `/empresa/{modulo}/design`
- 2 módulos sem: **Gerador Links** (utilitário) e **Marketing** (submódulos independentes)
- **Hub** é o único com CSS próprio (`hub-theme.css`, `badge-animations.css`)

### 4.4 Padrão de Eventos/Webhooks

- Nomenclatura: `{modulo}.{entidade}.{acao}` — `cadastro.criado`, `rota.iniciada`
- **Funis** é o módulo com mais eventos (12)
- **Gerador Links** e **Marketing** não têm eventos registrados

### 4.5 Padrão de Ambientes

Ambientes mais comuns: `cadastro`, `consultor`, `tecnologia`
- `suporte` aparece apenas em: Cadastros, NPS, Despesas, LinkTree
- `cadastro` + `consultor` + `tecnologia` é o trio padrão da maioria

---

## 5. Observações e Anomalias

### 5.1 Divergências de Arquitetura

1. **Módulo Empresa não segue o padrão** — Sem permissions, sem ambientes, sem eventos. É infraestrutura multi-tenant, não um módulo de negócio.

2. **Módulo Global não tem module.ts** — Infraestrutura descentralizada em `src/core/` e `src/features/` avulsos.

3. **Marketing sem módulo principal** — O `module.ts` do Marketing não tem permissões próprias. As permissões estão nos submódulos individuais.

4. **Subsistema CRM duplicado** — Tabelas antigas (`usuarios`, `clientes`, `visitas`) coexistem com o novo módulo CRM em `src/features/crm/`.

5. **Gerador Links e Marketing sem Design Config** — Únicos módulos de negócio sem personalização visual.

### 5.2 Oportunidades de Melhoria

1. **Consolidar prefixos de permissão** — Cadastros usa nomes sem prefixo, enquanto todos os outros módulos usam prefixo.

2. **Unificar sistema de eventos** — Marketing e Gerador Links não têm webhooks, mesmo tendo operações que poderiam disparar eventos.

3. **Módulo Empresa sem permissões** — Qualquer usuário autenticado vê os itens de navegação da empresa (`permissionCheck: () => true`). Pode ser um risco de segurança.

4. **Trigger duplicado** — Migration `20260624090000_customize_funis_colunas.sql` remove e recria trigger que já existia em `00037_funis_module.sql`.

5. **Hub com CSS próprio** — Único módulo com CSS isolado do design system global. Pode causar inconsistência visual.

### 5.3 Módulos por Complexidade

| Complexidade | Módulos | Critério |
|---|---|---|
| **Alta** | Hub, Funis, Cadastros, Marketing | >15 permissões OU >15 rotas OU >10 eventos |
| **Média** | CRM, Despesas, LinkTree, NPS | 7-13 permissões, 4-13 rotas |
| **Baixa** | Mapas, Gerador Links, Rotas | ≤6 permissões, ≤9 rotas |

---

## 6. Estatísticas Gerais

### Totais Consolidados

| Indicador | Total |
|---|---|
| **Módulos documentados** | 13 |
| **Permissões registradas** | ~100 (em 18 módulos/submódulos) |
| **Webhooks definidos** | ~54 eventos |
| **Rotas registradas** | ~134 |
| **Módulos com Design Config** | 11 de 13 |
| **Arquivos de documentação** | 14 |

### Distribuição de Permissões

```
Hub         ████████████████████████████ 28
Funis       ██████████████████           18
Cadastros   █████████████████            17
LinkTree    █████████████                13
CRM         ██████████                   10
Marketing   █████████                     9
Despesas    ████████                      8
NPS         ███████                       7
Gerador     ██████                        6
Rotas       ██████                        6
Mapas       █████                         5
Empresa     ▒▒▒▒▒▒                        0 (infra)
```

### Distribuição de Rotas

```
Empresa     ██████████████████████████    22
Marketing   ████████████████████████      20
Hub         ██████████████████████        18
Global      █████████████████             15
CRM         ███████████████               13
Gerador     ███████████                    9
Cadastros   █████████                      7
Mapas       █████████                      7
NPS         ███████                        6
LinkTree    ███████                        6
Funis       █████                          4
Despesas    █████                          4
Rotas       ███                            3
```

---

## Notas Finais

1. **Documentos gerados em**: `docs-projeto/doc-funcoes/`
2. **Formato**: Segue as 8 análises do template (Visão Geral, Quem, Quando, Como, O Que, Registro, Formato, Banco)
3. **Próximas documentações sugeridas**: Sistema de Navegação (Nav Items), Registry de Módulos, Sistema de Eventos/Webhooks
4. **14 arquivos** no total, cobrindo **13 módulos** + **sistema de permissões** completo
