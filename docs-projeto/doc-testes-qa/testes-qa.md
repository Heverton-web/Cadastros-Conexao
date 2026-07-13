# Análise de Testes e QA — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Playwright + K6 + Vitest

---

## 1. Visão Geral

O ERP Conexão possui **3 camadas de teste**:

| Tipo | Tecnologia | Quantidade | Foco |
|---|---|---|---|
| Unitários | Vitest | ~31 testes | Módulos, permissões, serviços |
| E2E | Playwright | ~7 specs | Fluxos críticos (login, cadastro, aprovação) |
| Stress | K6 | ~7 scripts | Performance sob carga |

---

## 2. Testes Unitários (Vitest)

### 2.1 Configuração

- **Arquivo**: `vitest.config.ts` (raiz)
- **Localização**: `src/__tests__/`
- **Mock de Supabase**: MSW (Mock Service Worker) em `src/__tests__/msw/`

### 2.2 Cobertura por Módulo

| Módulo | Testes | Cobertura |
|---|---|---|
| CRM | 3 (module, permissions, services) | ✅ |
| Despesas | 2 (permissions, services) | ✅ |
| Funis | 3 (module, permissions, services) | ✅ |
| Hub | 3 (module, permissions, services) | ✅ |
| LinkTree | 3 (module, permissions, services) | ✅ |
| Mapas | 3 (module, permissions, services) | ✅ |
| NPS | 3 (module, permissions, services) | ✅ |
| Rotas | 3 (module, permissions, services) | ✅ |
| Super Admin | 3 (modules, navigation, permissions) | ✅ |
| Integrações (MSW) | 2 (cep, supabase-crud) | ✅ |
| **Total** | **31 testes** | |

### 2.3 Módulos SEM testes unitários

| Módulo | Testes |
|---|---|
| Cadastros | ❌ |
| Gerador Links | ❌ |
| Marketing (13 submódulos) | ❌ |
| Empresa | ❌ |
| Webhooks/Notificações | ❌ |
| Design System | ❌ |

---

## 3. Testes E2E (Playwright)

### 3.1 Configuração

- **Pasta**: `tests/playwright/`
- **Config**: `playwright.config.ts` (raiz)

### 3.2 Specs

| Spec | Descrição | Status |
|---|---|---|
| `pw-fluxo-completo.spec.js` | Fluxo completo: login → gerar link → logout | ✅ |
| `pw-admin-config.spec.js` | Configuração de admin | ✅ |
| `pw-aprovacao.spec.js` | Fluxo de aprovação | ✅ |
| `pw-consultor.spec.js` | Fluxo do consultor | ✅ |
| `pw-credenciais.spec.js` | Gerenciamento de credenciais | ✅ |
| `pw-dashboard.spec.js` | Dashboard | ✅ |

---

## 4. Testes de Stress (K6)

### 4.1 Configuração

- **Pasta**: `tests/k6/`
- **Alvo**: Supabase REST API direta

### 4.2 Scripts

| Script | Cenário |
|---|---|
| `k6-complete-stress.js` | Dashboard + Listagens + RPCs + Notificações |
| `k6-auth-login.js` | Login simultâneo |
| `k6-cadastro-approve.js` | Aprovação de cadastros |
| `k6-cadastro-list.js` | Listagem de cadastros |
| `k6-dashboard.js` | Dashboard com 6 queries de status |
| `k6-notification-poll.js` | Polling de notificações |
| `k6-relatorios.js` | Relatórios |

### 4.3 Thresholds

```javascript
thresholds: {
  app_errors: ["rate<0.05"],  // < 5% erro
  http_req_duration: ["p(95)<5000"],  // 95% < 5s
}
```

---

## 5. Smoke Tests

- **Pasta**: `tests/smoke/`
- **Scripts**: `login.smoke.js`, `global-routes.smoke.js`

---

## 6. Gaps Identificados

| Área | Status | Prioridade |
|---|---|---|
| Cadastros (módulo core) | ❌ Sem testes | 🔴 Alta |
| Marketing (13 submódulos) | ❌ Sem testes | 🟡 Média |
| Webhooks | ❌ Sem testes | 🟡 Média |
| UI Components (shadcn/ui) | ❌ Sem testes | 🟢 Baixa |
| E2E coverage (rotas) | ~30% | 🔴 Alta |
| CI integration | ✅ `npm test` no workflow | ✅ |
