# Plano de Testes de Estresse

## 1. Objetivo

Validar a resiliência, performance e corretude de **todas as funcionalidades** da aplicação `cadastros-conexao` sob carga simulada, abrangendo **todas as roles de usuário**: Público, Consultor, Cadastro (analista), TI e Super Admin.

## 2. Ferramentas

| Ferramenta | Versão | Função |
|-----------|--------|--------|
| [k6](https://k6.io) | 2.0.0 | Teste de carga em APIs REST, Auth e RPCs do Supabase |
| Playwright | latest | Simulação de fluxos reais no navegador (Chromium) |

## 3. Cenários de Teste

### 3.1 k6 — API / RPC / Database

| # | Cenário | Arquivo | Role | Alvo | VUs | Duração |
|---|---------|---------|------|------|-----|---------|
| K1 | Auth Login | `k6-auth-login.js` | Todas | `supabase.auth.signInWithPassword` | 100 | 30s |
| K2 | Listar Cadastros | `k6-cadastro-list.js` | Cadastro | `SELECT cadastros + PF/PJ + enderecos` | 50 | 50s |
| K3 | Aprovar Cadastro | `k6-cadastro-approve.js` | Cadastro | `UPDATE cadastro + INSERT atividades + webhook` | 30 | 40s |
| K4 | Pre-cadastro Submit | `k6-pre-cadastro-submit.js` | Público | `RPC update_cadastro_from_precadastro` | 40 | 60s |
| K5 | Document Upload | `k6-document-upload.js` | Público | `Storage PUT + INSERT documentos` | 20 | 40s |
| K6 | Notification Polling | `k6-notification-poll.js` | Todas | `SELECT notificacoes` (polling 10s) | 200 | 120s |
| K7 | RPC Stress (todos) | `k6-rpc-stress.js` | Mistas | Todas as RPCs do banco | 60 | 80s |
| K8 | Dashboard Stats | `k6-dashboard.js` | Cadastro | `SELECT count(*) agrupado por status` | 30 | 30s |
| K9 | Relatorios | `k6-relatorios.js` | Cadastro | `SELECT com range de datas` | 20 | 30s |
| K10 | Webhook Disparo | `k6-webhooks.js` | Cadastro | `POST webhooks externos + RPC api_connector` | 15 | 30s |

### 3.2 Playwright — Navegador (fluxos reais)

| # | Cenário | Arquivo | Roles | Fluxo |
|---|---------|---------|-------|-------|
| P1 | Fluxo Completo | `pw-fluxo-completo.spec.js` | Consultor + Público | Login consultor → Gerar link → Login público → Preencher PF → Upload docs → 2FA → Submeter |
| P2 | Aprovação | `pw-aprovacao.spec.js` | Cadastro | Login → Listar pendentes → Revisar campos → Aprovar |
| P3 | Reprovação/Correção | `pw-reprovacao.spec.js` | Cadastro | Login → Reprovar com motivo → Solicitar correção |
| P4 | Admin Config | `pw-admin-config.spec.js` | Super Admin | Login → Aba Integrações → Salvar config → Central de Ações → Testar |
| P5 | Credenciais | `pw-credenciais.spec.js` | TI | Login → Listar → Criar → Inativar → Reativar |
| P6 | Notificações | `pw-notificacoes.spec.js` | Todas | Sino → Ver lista → Filtrar → Marcar lidas |
| P7 | Relatórios | `pw-relatorios.spec.js` | Cadastro | Login → Abrir relatórios → Filtrar por período |
| P8 | Dashboard | `pw-dashboard.spec.js` | Cadastro | Login → Verificar cards de status → Navegar |
| P9 | Consultor Dashboard | `pw-consultor.spec.js` | Consultor | Login → Gerar link → Ver histórico |

## 4. Thresholds (Limites de Aceitação)

| Métrica | Warning | Critical |
|---------|---------|----------|
| `http_req_duration` p95 | < 2s | < 5s |
| `http_req_duration` p99 | < 3s | < 8s |
| `http_req_failed` | < 1% | < 5% |
| RPC response time | < 500ms | < 2s |
| Playwright test steps | < 5s each | < 10s each |

## 5. Relatório Final

Após execução de todos os cenários, será gerado `docs/tests/stress-test-report.md` contendo:

- Resumo executivo com status geral
- Resultados detalhados por cenário (tabelas, thresholds, falhas)
- Logs de erros e causas raiz
- Correções aplicadas durante os testes
- Pontos de atenção e recomendações

---

**Planejamento aprovado em:** 21/06/2026
