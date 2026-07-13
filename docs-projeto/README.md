# 📚 Índice Remissivo — Documentação ERP Odonto

> **Gerado em:** 04/07/2026 | **Total de documentos:** 206+ | **Pastas:** 44+

---

## 🗺️ Mapa de Navegação

```
docs-projeto/
├── README.md                              ← Você está aqui
├── 01-modulos/                            ← Doc por módulo (13 módulos × 4 aspectos)
│   ├── doc-banco-dados/                   ←   Estrutura de tabelas, RLS, índices
│   ├── doc-design-system/                 ←   Tokens CSS, temas, componentes
│   ├── doc-funcoes/                       ←   Funções, permissões, fluxos
│   └── doc-eventos-botoes-triggers/       ←   Webhooks, notificações, ações
├── 02-arquitetura/                        ← Análise de código + arquitetura
│   ├── doc-analise-codigo/               ←   Clean Code, Frontend, Backend, BD, Modular
│   ├── doc-arquitetura/                  ←   Templates + análise por módulo
│   └── doc-modularidade-isolamento/      ←   Registry pattern, acoplamento
├── 03-infraestrutura/                     ← Deploy, segurança, monitoramento
│   ├── doc-deploy-devops/
│   ├── doc-seguranca/
│   └── doc-monitoramento-logging/
├── 04-autenticacao/                       ← Auth + permissões
│   ├── doc-autenticacao-autorizacao/
│   └── doc-funcoes/ (perms + resumo)
├── 05-dados/                              ← BD, migrações, fluxo de dados
│   ├── doc-migracoes-banco/
│   └── doc-fluxo-dados/
├── 06-design/                             ← UI, componentes, responsividade
│   ├── doc-componentes-ui/
│   ├── doc-responsividade/
│   └── doc-modulos/ (docs específicas)
├── 07-apis/                               ← APIs, integrações, notificações
│   ├── doc-apis-integracoes/
│   └── doc-notificacoes/
├── 08-qualidade/                          ← Testes, performance, erros
│   ├── doc-testes-qa/
│   ├── doc-performance-otimizacao/
│   └── doc-tratamento-erros/
├── 09-tecnico/                            ← Formulários, state, rotas
│   ├── doc-formularios-validacao/
│   ├── doc-state-management/
│   └── doc-rotas-navegacao/
├── 10-workflows/                          ← Automações, skills
│   ├── doc-workflows/
│   ├── doc-workflows-automacoes/
│   └── doc-skills-automacao/
├── 11-ambiente/                           ← Ambientes, dependências, legado
│   ├── doc-ambientes-features/
│   ├── doc-dependencias/
│   └── doc-legado-refatoracao/
│   └── doc-refatoracoes/
├── 12-guia/                               ← Contribuição, acessibilidade
│   ├── doc-guia-contribuicao/
│   └── doc-acessibilidade/
├── 13-engenharia-reversa/                 ← Bubble.io reverse engineering
│   └── doc-engenharia-reversa/
├── 14-planos/                             ← Planos de implementação
├── 15-avaliacoes/                         ← Avaliações técnicas (CQRS, GraphQL, etc)
├── 16-analises/                           ← Análises técnicas diversas
├── 17-doc-apoio/                         ← Scripts, documentos auxiliares
├── specs/                                 ← Especificações de features
├── superpowers/                           ← Superpowers specs/plans
├── prints_telas/                          ← Screenshots da aplicação
├── tests/                                 ← Planos e relatórios de teste
├── manual/                                ← Manual HTML (6 capítulos)
└── planejamento-app/                      ← Planejamento de features
```

---

## 📂 CATEGORIA 1 — MÓDULOS DO SISTEMA (13 módulos)

Documentação completa por módulo, cobrindo **Banco de Dados**, **Design System**, **Funções** e **Eventos/Webhooks**.

### 1.1 Cadastros

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/cadastros.md`](doc-banco-dados/cadastros.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/cadastros.md`](doc-design-system/cadastros.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/cadastros.md`](doc-funcoes/cadastros.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/cadastros.md`](doc-eventos-botoes-triggers/cadastros.md) |
| Documentação do Módulo | Análise completa do módulo | [`doc-modulos/mod-cadastros/cadastros.md`](doc-modulos/mod-cadastros/cadastros.md) |

### 1.2 NPS

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/nps.md`](doc-banco-dados/nps.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/nps.md`](doc-design-system/nps.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/nps.md`](doc-funcoes/nps.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/nps.md`](doc-eventos-botoes-triggers/nps.md) |
| Documentação do Módulo | Análise completa do módulo | [`doc-modulos/mod-nps/nps.md`](doc-modulos/mod-nps/nps.md) |

### 1.3 CRM

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/crm.md`](doc-banco-dados/crm.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/crm.md`](doc-design-system/crm.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/crm.md`](doc-funcoes/crm.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/crm.md`](doc-eventos-botoes-triggers/crm.md) |

### 1.4 Funis

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/funis.md`](doc-banco-dados/funis.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/funis.md`](doc-design-system/funis.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/funis.md`](doc-funcoes/funis.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/funis.md`](doc-eventos-botoes-triggers/funis.md) |
| Documentação do Módulo | Análise completa do módulo | [`doc-modulos/mod-FUNIS/FUNIS.md`](doc-modulos/mod-FUNIS/FUNIS.md) |

### 1.5 Mapas

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/mapas.md`](doc-banco-dados/mapas.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/mapas.md`](doc-design-system/mapas.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/mapas.md`](doc-funcoes/mapas.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/mapas.md`](doc-eventos-botoes-triggers/mapas.md) |
| Documentação do Módulo | Análise completa do módulo | [`doc-modulos/mod-mapas/mapas.md`](doc-modulos/mod-mapas/mapas.md) |

### 1.6 Hub

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/hub.md`](doc-banco-dados/hub.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/hub.md`](doc-design-system/hub.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/hub.md`](doc-funcoes/hub.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/hub.md`](doc-eventos-botoes-triggers/hub.md) |
| Documentação do Módulo | Análise completa do módulo | [`doc-modulos/mod-hub/hub.md`](doc-modulos/mod-hub/hub.md) |

### 1.7 Despesas

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/despesas.md`](doc-banco-dados/despesas.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/despesas.md`](doc-design-system/despesas.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/despesas.md`](doc-funcoes/despesas.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/despesas.md`](doc-eventos-botoes-triggers/despesas.md) |

### 1.8 Rotas

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/rotas.md`](doc-banco-dados/rotas.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/rotas.md`](doc-design-system/rotas.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/rotas.md`](doc-funcoes/rotas.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/rotas.md`](doc-eventos-botoes-triggers/rotas.md) |

### 1.9 LinkTree

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/linktree.md`](doc-banco-dados/linktree.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/linktree.md`](doc-design-system/linktree.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/linktree.md`](doc-funcoes/linktree.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/linktree.md`](doc-eventos-botoes-triggers/linktree.md) |

### 1.10 Gerador de Links

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/gerador-links.md`](doc-banco-dados/gerador-links.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/gerador-links.md`](doc-design-system/gerador-links.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/gerador-links.md`](doc-funcoes/gerador-links.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/gerador-links.md`](doc-eventos-botoes-triggers/gerador-links.md) |
| Documentação do Módulo | Análise completa do módulo | [`doc-modulos/mod-links/links.md`](doc-modulos/mod-links/links.md) |

### 1.11 Marketing

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/marketing.md`](doc-banco-dados/marketing.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/marketing.md`](doc-design-system/marketing.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/marketing.md`](doc-funcoes/marketing.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/marketing.md`](doc-eventos-botoes-triggers/marketing.md) |

### 1.12 Empresa (Multi-tenant Core)

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/empresas.md`](doc-banco-dados/empresas.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/empresas.md`](doc-design-system/empresas.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/empresas.md`](doc-funcoes/empresas.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/empresas.md`](doc-eventos-botoes-triggers/empresas.md) |

### 1.13 Global (Infraestrutura Compartilhada)

| Aspecto | Documento | Link |
|---|---|---|
| Banco de Dados | Tabelas, índices, RLS | [`doc-banco-dados/global.md`](doc-banco-dados/global.md) |
| Design System | Tokens CSS, temas, componentes | [`doc-design-system/global.md`](doc-design-system/global.md) |
| Funções | Quem usa, como usa, fluxo | [`doc-funcoes/global.md`](doc-funcoes/global.md) |
| Eventos/Triggers | Webhooks, notificações, ações | [`doc-eventos-botoes-triggers/global.md`](doc-eventos-botoes-triggers/global.md) |

---

## 📂 CATEGORIA 2 — ARQUITETURA E QUALIDADE DE CÓDIGO

### 2.1 Análise de Código Limpo

| Documento | Conteúdo | Link |
|---|---|---|
| **Clean Code** | Violações críticas (8), médias (6), padrões corretos (7), recomendações | [`doc-analise-codigo/clean-code.md`](doc-analise-codigo/clean-code.md) |
| **Arquitetura Limpa + Modular** | 3 camadas, isolamento, 8 anomalias, roadmap modularidade total | [`doc-analise-codigo/arquitetura-limpa-modular.md`](doc-analise-codigo/arquitetura-limpa-modular.md) |
| **Banco de Dados Multi-tenant** | 3 pilares, 22 tabelas verificadas, 6 anomalias, recomendações | [`doc-analise-codigo/banco-dados-multitenant.md`](doc-analise-codigo/banco-dados-multitenant.md) |
| **Frontend** | Stack, 7 padrões, 4 anti-padrões, 10 recomendações | [`doc-analise-codigo/frontend.md`](doc-analise-codigo/frontend.md) |
| **Backend** | Supabase, MCP Server, RPCs, RLS, 5 vulnerabilidades, roadmaps | [`doc-analise-codigo/backend.md`](doc-analise-codigo/backend.md) |

### 2.2 Arquitetura Geral

| Documento | Conteúdo | Link |
|---|---|---|
| **Análise Geral** | Stack (React 19 + Vite 6 + Supabase), diagrama de camadas, 9 decisões | [`doc-arquitetura/analise-geral.md`](doc-arquitetura/analise-geral.md) |
| **Template Geral** | Stack recomendado, estrutura de diretórios, passo a passo | [`doc-arquitetura/template-geral.md`](doc-arquitetura/template-geral.md) |
| **Análise por Módulo** | 13 módulos, matriz de acoplamento, 7 anomalias | [`doc-arquitetura/analise-modulo.md`](doc-arquitetura/analise-modulo.md) |
| **Template de Módulo** | 9 etapas, templates completos (module.ts, permissions.ts, service.ts, SQL) | [`doc-arquitetura/template-modulo.md`](doc-arquitetura/template-modulo.md) |

### 2.3 Modularidade e Isolamento

| Documento | Conteúdo | Link |
|---|---|---|
| **Modularidade** | Registry pattern, 0 acoplamento entre módulos, dependências | [`doc-modularidade-isolamento/modularidade-isolamento.md`](doc-modularidade-isolamento/modularidade-isolamento.md) |

---

## 📂 CATEGORIA 3 — INFRAESTRUTURA E OPERAÇÕES

### 3.1 Deploy e DevOps

| Documento | Conteúdo | Link |
|---|---|---|
| **Deploy e DevOps** | Docker multi-stage, VPS, CI/CD, env vars, health checks | [`doc-deploy-devops/deploy-devops.md`](doc-deploy-devops/deploy-devops.md) |
| **Manual de Deploy VPS** | Guia de deploy via Docker + VPS | [`analises/DEPLOY_VPS.md`](analises/DEPLOY_VPS.md) |

### 3.2 Segurança

| Documento | Conteúdo | Link |
|---|---|---|
| **Segurança** | RLS policies, SECURITY DEFINER, funções auxiliares, 5 vulnerabilidades | [`doc-seguranca/seguranca.md`](doc-seguranca/seguranca.md) |

### 3.3 Monitoramento e Logging

| Documento | Conteúdo | Link |
|---|---|---|
| **Monitoramento** | Sentry, K6 thresholds, webhook logs, health check | [`doc-monitoramento-logging/monitoramento-logging.md`](doc-monitoramento-logging/monitoramento-logging.md) |

---

## 📂 CATEGORIA 4 — AUTENTICAÇÃO, SEGURANÇA E PERMISSÕES

### 4.1 Autenticação e Autorização

| Documento | Conteúdo | Link |
|---|---|---|
| **Autenticação e Autorização** | Login, 2FA, reset senha, hierarquia de perfis, ~100 permissões | [`doc-autenticacao-autorizacao/autenticacao-autorizacao.md`](doc-autenticacao-autorizacao/autenticacao-autorizacao.md) |

### 4.2 Permissionamento Granular

| Documento | Conteúdo | Link |
|---|---|---|
| **Permissionamento Granular** | 8 análises completas (quem, quando, como, o que, onde) | [`doc-funcoes/permissionamento-granular.md`](doc-funcoes/permissionamento-granular.md) |
| **Resumo de Funções** | Contagem de funções por módulo, padrões, observações | [`doc-funcoes/resumo-funcoes.md`](doc-funcoes/resumo-funcoes.md) |

---

## 📂 CATEGORIA 5 — DADOS E BANCO DE DADOS

### 5.1 Banco de Dados

| Documento | Conteúdo | Link |
|---|---|---|
| **Análise Geral** | Estrutura completa, RLS, migrações, índices | [`doc-banco-dados/analise-geral-banco-dados.md`](doc-banco-dados/analise-geral-banco-dados.md) |
| **Resumo** | Consolidado de todos os módulos | [`doc-banco-dados/resumo-banco-dados.md`](doc-banco-dados/resumo-banco-dados.md) |
| **Migrações** | 55+ migrações catalogadas, ordem, dependências | [`doc-migracoes-banco/migracoes-banco.md`](doc-migracoes-banco/migracoes-banco.md) |

> Documentos individuais: [`cadastros`](doc-banco-dados/cadastros.md) · [`crm`](doc-banco-dados/crm.md) · [`despesas`](doc-banco-dados/despesas.md) · [`empresas`](doc-banco-dados/empresas.md) · [`funis`](doc-banco-dados/funis.md) · [`gerador-links`](doc-banco-dados/gerador-links.md) · [`global`](doc-banco-dados/global.md) · [`hub`](doc-banco-dados/hub.md) · [`linktree`](doc-banco-dados/linktree.md) · [`mapas`](doc-banco-dados/mapas.md) · [`marketing`](doc-banco-dados/marketing.md) · [`nps`](doc-banco-dados/nps.md) · [`rotas`](doc-banco-dados/rotas.md)

### 5.2 Fluxo de Dados

| Documento | Conteúdo | Link |
|---|---|---|
| **Fluxo de Dados** | Supabase → React Query → Componente, cache strategy (staleTime 60s) | [`doc-fluxo-dados/fluxo-dados.md`](doc-fluxo-dados/fluxo-dados.md) |

---

## 📂 CATEGORIA 6 — DESIGN SYSTEM E UI

### 6.1 Design System

| Documento | Conteúdo | Link |
|---|---|---|
| **Global** (referência) | 85+ tokens CSS, variáveis, infraestrutura compartilhada | [`doc-design-system/global.md`](doc-design-system/global.md) |
| **Empresa** | Provider + resolver + preset dark-gold | [`doc-design-system/empresas.md`](doc-design-system/empresas.md) |
| **NPS** | 58 tokens próprios `--nps-*`, tema dual (dashboard + survey) | [`doc-design-system/nps.md`](doc-design-system/nps.md) |

> Documentos por módulo: [`cadastros`](doc-design-system/cadastros.md) · [`crm`](doc-design-system/crm.md) · [`despesas`](doc-design-system/despesas.md) · [`funis`](doc-design-system/funis.md) · [`gerador-links`](doc-design-system/gerador-links.md) · [`hub`](doc-design-system/hub.md) · [`linktree`](doc-design-system/linktree.md) · [`mapas`](doc-design-system/mapas.md) · [`marketing`](doc-design-system/marketing.md) · [`rotas`](doc-design-system/rotas.md)

### 6.2 Componentes UI

| Documento | Conteúdo | Link |
|---|---|---|
| **Componentes UI** | ~59 shadcn/ui componentes customizados, lucide icons, padrões | [`doc-componentes-ui/componentes-ui.md`](doc-componentes-ui/componentes-ui.md) |

### 6.3 Responsividade

| Documento | Conteúdo | Link |
|---|---|---|
| **Responsividade** | Breakpoints, mobile-first obrigatório, padrões | [`doc-responsividade/responsividade.md`](doc-responsividade/responsividade.md) |
| Cadastros | Plano de correção | [`doc-responsividade/resp-cadastros/cadastros.md`](doc-responsividade/resp-cadastros/cadastros.md) |
| Funis | Plano de correção | [`doc-responsividade/resp-FUNIS/cadastros.md`](doc-responsividade/resp-FUNIS/cadastros.md) |
| Hub | Plano de correção | [`doc-responsividade/resp-hub/hub.md`](doc-responsividade/resp-hub/hub.md) |
| Links | Plano de correção | [`doc-responsividade/resp-links/links.md`](doc-responsividade/resp-links/links.md) |

---

## 📂 CATEGORIA 7 — APIs, INTEGRAÇÕES E EVENTOS

### 7.1 APIs e Integrações

| Documento | Conteúdo | Link |
|---|---|---|
| **APIs e Integrações** | 50+ RPCs, 5 integrações nativas, pg_net, conectores | [`doc-apis-integracoes/apis-integracoes.md`](doc-apis-integracoes/apis-integracoes.md) |

### 7.2 Eventos, Botões e Triggers

| Documento | Eventos | Link |
|---|---|---|
| **Global** (infraestrutura) | ~54 consolidados | [`doc-eventos-botoes-triggers/global.md`](doc-eventos-botoes-triggers/global.md) |
| **Funil** | 12 eventos | [`doc-eventos-botoes-triggers/funis.md`](doc-eventos-botoes-triggers/funis.md) |
| **Hub** | 8 eventos | [`doc-eventos-botoes-triggers/hub.md`](doc-eventos-botoes-triggers/hub.md) |
| **Mapas** | 8 eventos | [`doc-eventos-botoes-triggers/mapas.md`](doc-eventos-botoes-triggers/mapas.md) |
| **Despesas** | 7 eventos | [`doc-eventos-botoes-triggers/despesas.md`](doc-eventos-botoes-triggers/despesas.md) |
| **Cadastros** | 6 + 11 legados | [`doc-eventos-botoes-triggers/cadastros.md`](doc-eventos-botoes-triggers/cadastros.md) |
| **Rotas** | 4 eventos | [`doc-eventos-botoes-triggers/rotas.md`](doc-eventos-botoes-triggers/rotas.md) |
| **CRM** | 3 eventos | [`doc-eventos-botoes-triggers/crm.md`](doc-eventos-botoes-triggers/crm.md) |
| **NPS** | 3 eventos | [`doc-eventos-botoes-triggers/nps.md`](doc-eventos-botoes-triggers/nps.md) |
| **LinkTree** | 3 eventos | [`doc-eventos-botoes-triggers/linktree.md`](doc-eventos-botoes-triggers/linktree.md) |
| **Gerador Links** | 0 eventos | [`doc-eventos-botoes-triggers/gerador-links.md`](doc-eventos-botoes-triggers/gerador-links.md) |
| **Marketing** | 0 eventos | [`doc-eventos-botoes-triggers/marketing.md`](doc-eventos-botoes-triggers/marketing.md) |
| **Empresa** | 0 eventos | [`doc-eventos-botoes-triggers/empresas.md`](doc-eventos-botoes-triggers/empresas.md) |

### 7.3 Notificações

| Documento | Conteúdo | Link |
|---|---|---|
| **Notificações** | Templates, 4 tipos de destinatário, polling 5s, canais | [`doc-notificacoes/notificacoes.md`](doc-notificacoes/notificacoes.md) |

---

## 📂 CATEGORIA 8 — TESTES E QUALIDADE

### 8.1 Testes

| Documento | Conteúdo | Link |
|---|---|---|
| **Testes e QA** | 31 unit tests, 7 Playwright E2E specs, 7 K6 stress scripts | [`doc-testes-qa/testes-qa.md`](doc-testes-qa/testes-qa.md) |
| Plano de Stress Test | Planejamento | [`tests/stress-test-plan.md`](tests/stress-test-plan.md) |
| Relatório de Stress | Resultados | [`tests/stress-test-report.md`](tests/stress-test-report.md) |

### 8.2 Performance

| Documento | Conteúdo | Link |
|---|---|---|
| **Performance** | Cache, code splitting, Sentry 0.1 trace, recommendations | [`doc-performance-otimizacao/performance-otimizacao.md`](doc-performance-otimizacao/performance-otimizacao.md) |

### 8.3 Tratamento de Erros

| Documento | Conteúdo | Link |
|---|---|---|
| **Tratamento de Erros** | Service errors, toast, React Query error states | [`doc-tratamento-erros/tratamento-erros.md`](doc-tratamento-erros/tratamento-erros.md) |

---

## 📂 CATEGORIA 9 — TÉCNICO (FORMLÁRIOS, STATE, ROTAS)

| Documento | Conteúdo | Link |
|---|---|---|
| **Formulários e Validação** | React Hook Form + Zod, form_schema dinâmico | [`doc-formularios-validacao/formularios-validacao.md`](doc-formularios-validacao/formularios-validacao.md) |
| **State Management** | React Query 60s cache, AuthProvider, Zustand persist | [`doc-state-management/state-management.md`](doc-state-management/state-management.md) |
| **Rotas e Navegação** | ~134 rotas, route tree, AuthGuard, NavItems | [`doc-rotas-navegacao/rotas-navegacao.md`](doc-rotas-navegacao/rotas-navegacao.md) |

---

## 📂 CATEGORIA 10 — WORKFLOWS, AUTOMAÇÕES E SKILLS

| Documento | Conteúdo | Link |
|---|---|---|
| **Workflows e Automações** | Workflow builder, orquestrador, automações | [`doc-workflows-automacoes/workflows-automacoes.md`](doc-workflows-automacoes/workflows-automacoes.md) |
| **Workflow de Módulo Completo** | Pipeline de criação de módulo | [`doc-workflows/workflow-modulo-completo.md`](doc-workflows/workflow-modulo-completo.md) |
| **Skills de Automação** | 15 skills catalogadas, sistema de agentes | [`doc-skills-automacao/skills-automacao.md`](doc-skills-automacao/skills-automacao.md) |

---

## 📂 CATEGORIA 11 — AMBIENTES, DEPENDÊNCIAS E LEGADO

| Documento | Conteúdo | Link |
|---|---|---|
| **Ambientes e Features** | 4 ambientes, feature toggles por módulo | [`doc-ambientes-features/ambientes-features.md`](doc-ambientes-features/ambientes-features.md) |
| **Dependências** | Package.json completo, bundle analysis | [`doc-dependencias/dependencias.md`](doc-dependencias/dependencias.md) |
| **Legado e Refatoração** | Bubble legacy, tabelas gêmeas, roadmap | [`doc-legado-refatoracao/legado-refatoracao.md`](doc-legado-refatoracao/legado-refatoracao.md) |
| **Plano de Refatoração BD** | Remodelamento de banco de dados | [`doc-refatoracoes/plano-remodelamento-banco-dados.md`](doc-refatoracoes/plano-remodelamento-banco-dados.md) |

---

## 📂 CATEGORIA 12 — GUIA DE CONTRIBUIÇÃO E ACESSIBILIDADE

| Documento | Conteúdo | Link |
|---|---|---|
| **Guia de Contribuição** | Stack, estrutura, convenções, comandos | [`doc-guia-contribuicao/guia-contribuicao.md`](doc-guia-contribuicao/guia-contribuicao.md) |
| **Acessibilidade** | Estado atual + recomendações WCAG | [`doc-acessibilidade/acessibilidade.md`](doc-acessibilidade/acessibilidade.md) |

---

## 📂 CATEGORIA 13 — ENGENHARIA REVERSA (BUBBLE.IO)

Documentação do processo de engenharia reversa da aplicação Bubble.io original.

| Documento | Link |
|---|---|
| **README** — Visão geral do processo | [`doc-engenharia-reversa/README.md`](doc-engenharia-reversa/README.md) |
| **AGENTS.md** — Configuração dos agentes | [`doc-engenharia-reversa/AGENTS.md`](doc-engenharia-reversa/AGENTS.md) |
| **Índice** — Navegação completa | [`doc-engenharia-reversa/INDICE.md`](doc-engenharia-reversa/INDICE.md) |
| **Análise Gestão Contratos** | [`doc-engenharia-reversa/analise_gestao-contratos-conexao/INDICE.md`](doc-engenharia-reversa/analise_gestao-contratos-conexao/INDICE.md) |

### 13.1 Skills de Engenharia Reversa (8 skills)

| Skill | Link |
|---|---|
| `bubble-api-connectors` | [`doc-engenharia-reversa/skills/bubble-api-connectors/SKILL.md`](doc-engenharia-reversa/skills/bubble-api-connectors/SKILL.md) |
| `bubble-elementos-reutilizaveis` | [`doc-engenharia-reversa/skills/bubble-elementos-reutilizaveis/SKILL.md`](doc-engenharia-reversa/skills/bubble-elementos-reutilizaveis/SKILL.md) |
| `bubble-option-sets` | [`doc-engenharia-reversa/skills/bubble-option-sets/SKILL.md`](doc-engenharia-reversa/skills/bubble-option-sets/SKILL.md) |
| `bubble-paginas` | [`doc-engenharia-reversa/skills/bubble-paginas/SKILL.md`](doc-engenharia-reversa/skills/bubble-paginas/SKILL.md) |
| `bubble-prd` | [`doc-engenharia-reversa/skills/bubble-prd/SKILL.md`](doc-engenharia-reversa/skills/bubble-prd/SKILL.md) |
| `bubble-tabelas` | [`doc-engenharia-reversa/skills/bubble-tabelas/SKILL.md`](doc-engenharia-reversa/skills/bubble-tabelas/SKILL.md) |
| `bubble-tech-lead` | [`doc-engenharia-reversa/skills/bubble-tech-lead/SKILL.md`](doc-engenharia-reversa/skills/bubble-tech-lead/SKILL.md) |
| `bubble-workflows-backend` | [`doc-engenharia-reversa/skills/bubble-workflows-backend/SKILL.md`](doc-engenharia-reversa/skills/bubble-workflows-backend/SKILL.md) |

### 13.2 Tasks de Engenharia Reversa (5 tasks)

| Task | Link |
|---|---|
| Tabelas | [`doc-engenharia-reversa/tasks/task_bubble-tabelas.md`](doc-engenharia-reversa/tasks/task_bubble-tabelas.md) |
| Páginas | [`doc-engenharia-reversa/tasks/task_bubble-paginas.md`](doc-engenharia-reversa/tasks/task_bubble-paginas.md) |
| Option Sets | [`doc-engenharia-reversa/tasks/task_bubble-option-sets.md`](doc-engenharia-reversa/tasks/task_bubble-option-sets.md) |
| API Connectors | [`doc-engenharia-reversa/tasks/task_bubble-api-connectors.md`](doc-engenharia-reversa/tasks/task_bubble-api-connectors.md) |
| Workflows Backend | [`doc-engenharia-reversa/tasks/task_bubble-workflows.md`](doc-engenharia-reversa/tasks/task_bubble-workflows.md) |

---

## 📂 CATEGORIA 14 — PLANOS DE IMPLEMENTAÇÃO

Documentos em: [`planos/`](planos/)

| Documento | Conteúdo | Link |
|---|---|---|
| Plano Módulo Hub | Estratégia de implementação | [`planos/PLANO-MODULO-HUB.md`](planos/PLANO-MODULO-HUB.md) |
| Plano Módulo Hub (Mimo) | Versão Mimo do Hub | [`planos/PLANO-MODULO-HUB-MIMO.md`](planos/PLANO-MODULO-HUB-MIMO.md) |
| Plano Módulo LinkTree | Estratégia de implementação | [`planos/plano-modulo-linktree.md`](planos/plano-modulo-linktree.md) |
| Plano Novo Módulo | Template para criar módulos | [`planos/plan_novo_modulo.md`](planos/plan_novo_modulo.md) |
| Template Novo Módulo | Template estruturado | [`planos/template_novo_modulo.md`](planos/template_novo_modulo.md) |
| Plano Modularização | Estratégia de modularização | [`planos/plano-modularizacao-erp.md`](planos/plano-modularizacao-erp.md) |
| Mapa Rotas Hub | Mapeamento de rotas do Hub | [`planos/MAPA-ROTAS-HUB.md`](planos/MAPA-ROTAS-HUB.md) |
| Plano Limpeza Rotas | Limpeza de rotas duplicadas | [`planos/plano-limpeza-rotas.md`](planos/plano-limpeza-rotas.md) |
| Mover Rotas Admin | Migração de rotas admin | [`planos/plano-mover-rotas-admin-empresa.md`](planos/plano-mover-rotas-admin-empresa.md) |
| Plano Google Maps | Rotas por empresa | [`planos/plano-rotas-google-maps-per-company.md`](planos/plano-rotas-google-maps-per-company.md) |
| Plano Refatoração Design System | Refatoração de tokens | [`planos/plano-refatoracao-design-system.md`](planos/plano-refatoracao-design-system.md) |
| Plano UI/UX Overhaul | Reforma completa da UI | [`planos/PLANO-UIUX-OVERHAUL.md`](planos/PLANO-UIUX-OVERHAUL.md) |
| Mapa Dark Premium | Design dark premium | [`planos/2026-06-30-mapa-dark-premium-design.md`](planos/2026-06-30-mapa-dark-premium-design.md) |

---

## 📂 CATEGORIA 15 — AVALIAÇÕES TÉCNICAS

Documentos em: [`avaliacoes/`](avaliacoes/)

| Documento | Decisão Avaliada | Link |
|---|---|---|
| Backend Separado | Separar backend do frontend? | [`avaliacoes/avaliacao-backend-separado.md`](avaliacoes/avaliacao-backend-separado.md) |
| CQRS | Padrão CQRS para o ERP? | [`avaliacoes/avaliacao-cqrs.md`](avaliacoes/avaliacao-cqrs.md) |
| Event Sourcing | Event sourcing como estratégia? | [`avaliacoes/avaliacao-event-sourcing.md`](avaliacoes/avaliacao-event-sourcing.md) |
| GraphQL | GraphQL vs REST? | [`avaliacoes/avaliacao-graphql.md`](avaliacoes/avaliacao-graphql.md) |
| Redis | Cache com Redis? | [`avaliacoes/avaliacao-redis.md`](avaliacoes/avaliacao-redis.md) |
| Server Components | React Server Components? | [`avaliacoes/avaliacao-server-components.md`](avaliacoes/avaliacao-server-components.md) |

---

## 📂 CATEGORIA 16 — ANÁLISES TÉCNICAS

Documentos em: [`analises/`](analises/)

| Documento | Conteúdo | Link |
|---|---|---|
| Análise Técnica Completa | Visão geral do ERP | [`analises/análise-técnica-erp-conexão.md`](analises/análise-técnica-erp-conexão.md) |
| Arquitetura Modular | Princípios modulares | [`analises/ARQUITETURA_MODULAR.md`](analises/ARQUITETURA_MODULAR.md) |
| Análise Modularidade | Estado da modularidade | [`analises/analise-modularidade.md`](analises/analise-modularidade.md) |
| Autonomia dos Módulos | Grau de autonomia | [`analises/analise_autonomia_modulos.md`](analises/analise_autonomia_modulos.md) |
| Guia Arquitetura MimoCode | Arquitetura do MimoCode | [`analises/guia-arquitetura-mimocode.md`](analises/guia-arquitetura-mimocode.md) |
| Subagentes MimoCode | Configuração de subagentes | [`analises/subagentes-mimocode.md`](analises/subagentes-mimocode.md) |
| Deploy VPS | Guia de deploy | [`analises/DEPLOY_VPS.md`](analises/DEPLOY_VPS.md) |

---

## 📂 CATEGORIA 17 — DOCUMENTOS DE APOIO

Documentos em: [`doc-apoio/`](doc-apoio/)

| Documento | Conteúdo | Link |
|---|---|---|
| Manual MD para PDF | Conversão de markdown para PDF | [`doc-apoio/manual-md-to-pdf.md`](doc-apoio/manual-md-to-pdf.md) |
| Script Criar Skills | Script de criação de skills | [`doc-apoio/script_criar_skills.txt`](doc-apoio/script_criar_skills.txt) |
| Script Skills Criadas | Skills já existentes | [`doc-apoio/script_criar_skills_ja_criadas.txt`](doc-apoio/script_criar_skills_ja_criadas.txt) |
| Agent MD Antigo | Configuração antiga do agente | [`doc-apoio/agent_md_antigo.txt`](doc-apoio/agent_md_antigo.txt) |

---

## 📂 CATEGORIA 18 — SPECIFICAÇÕES E SUPERPOWERS

### 18.1 Especificações de Funcionalidades

| Documento | Funcionalidade | Link |
|---|---|---|
| Fluxo de Cadastro | Fluxo completo | [`specs/fluxo_cadastro.md`](specs/fluxo_cadastro.md) |
| Links | Funcionalidade de links | [`specs/links.md`](specs/links.md) |
| Botão Compartilhar Link | Workflow | [`specs/workflows/botao_compartilhar_link.md`](specs/workflows/botao_compartilhar_link.md) |
| API Connectors | Conectores de API | [`specs/new_features/api_connectors_plan.md`](specs/new_features/api_connectors_plan.md) |
| Fluxo Seguro Notificações | Notificações seguras | [`specs/new_features/fluxo_seguro_notificacoes.md`](specs/new_features/fluxo_seguro_notificacoes.md) |
| Form Builder (Super Admin) | Builder de formulários | [`specs/new_features/form_builder_superadmin.md`](specs/new_features/form_builder_superadmin.md) |
| Responsividade Global | Plano de responsividade | [`specs/new_features/responsividade_global_plan.md`](specs/new_features/responsividade_global_plan.md) |
| Role Based UX | UX por perfil de usuário | [`specs/new_features/role_based_ux.md`](specs/new_features/role_based_ux.md) |
| Rota Super Admin | Configurações globais | [`specs/new_features/rota_super_admin_configuracoes.md`](specs/new_features/rota_super_admin_configuracoes.md) |
| Workflow Builder | Builder sequencial | [`specs/new_features/workflow_builder_sequencial.md`](specs/new_features/workflow_builder_sequencial.md) |

### 18.2 Superpowers

| Documento | Conteúdo | Link |
|---|---|---|
| Multi-endereços | Especificação | [`superpowers/specs/2026-06-22-multi-enderecos.md`](superpowers/specs/2026-06-22-multi-enderecos.md) |
| Testes Super Admin | Plano de testes | [`superpowers/plans/2026-06-30-testes-super-admin.md`](superpowers/plans/2026-06-30-testes-super-admin.md) |
| Testes Super Admin Design | Design dos testes | [`superpowers/specs/2026-06-30-testes-super-admin-design.md`](superpowers/specs/2026-06-30-testes-super-admin-design.md) |

---

## 📂 CATEGORIA 19 — RECURSOS ADICIONAIS

| Recurso | Descrição | Localização |
|---|---|---|
| **Manual HTML** | Manual de uso (6 capítulos) | [`manual/`](manual/index.html) |
| **Screenshots** | Capturas de tela da aplicação (30+) | [`prints_telas/`](prints_telas/) |
| **Plano Gestão Contratos** | Planejamento de features | [`planejamento-app/plano-gestao-contratos.md`](planejamento-app/plano-gestao-contratos.md) |

---

## 📊 ESTATÍSTICAS GLOBAIS

| Indicador | Valor |
|---|---|
| **Total de documentos .md** | **206+** |
| **Pastas de documentação** | **44** |
| **Módulos documentados (4 aspectos)** | 13 (52 documentos) |
| **Análises de código** | 5 (Clean Code, Frontend, Backend, BD, Modular) |
| **Engenharia reversa** | 30+ documentos + 8 skills |
| **Especificações de features** | 10 |
| **Avaliações técnicas** | 6 |
| **Planos de implementação** | 13 |
| **Skills de automação** | 15 (7 bubble + 8 ERP) |
| **Eventos/triggers documentados** | 54 |
| **Screenshots** | 30+ prints da aplicação |
| **Manual HTML** | 6 capítulos |

---

## 🔍 COMO USAR ESTE ÍNDICE

1. **Comece pelo módulo desejado** na Categoria 1 — cada módulo tem links para seus 4 aspectos
2. **Para entender o sistema** como um todo, veja Categoria 2 (Arquitetura)
3. **Para issues técnicas e decisões**, veja Categorias 14-16 (Planos, Avaliações, Análises)
4. **Para engenharia reversa**, veja Categoria 13
5. **Para specs de features**, veja Categoria 18
6. **Use Ctrl+F** neste README para encontrar rapidamente o que precisa

---

## 📋 ÚLTIMAS ALTERAÇÕES NA ESTRUTURA (04/07/2026)

A pasta `docs-projeto/` foi reorganizada de **31 arquivos soltos** na raiz para **4 pastas temáticas**:

| Pasta | Arquivos Movidos |
|---|---|
| `planos/` | 13 planos de implementação |
| `avaliacoes/` | 6 avaliações técnicas (CQRS, GraphQL, Redis, etc) |
| `analises/` | 7 análises técnicas + deploy VPS + guias |
| `doc-apoio/` | 4 documentos auxiliares (scripts, txt, etc) |

---

> ⚡ **Última atualização:** 04/07/2026 | **Total de linhas aproximado:** ~35.000+ | **Cobertura:** ~85% da aplicação documentada
