# Análise de Acessibilidade — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Estado Atual

A acessibilidade no ERP Conexão é **parcial** — implementada por convenções de componentes shadcn/ui, mas sem auditoria formal.

---

## 2. O que já temos

| Item | Status | Detalhes |
|---|---|---|
| **Contraste de cores** | ✅ | Tema dark com contraste adequado |
| **Focus styles** | ✅ | `focus:border-accent` em inputs |
| **Touch targets** | ✅ | `min-h-[44px]` em botões |
| **aria-labels** | ⚠️ | Parcial — alguns botões sem label |
| **Role attributes** | ⚠️ | shadcn/ui inclui roles básicas |
| **Keyboard navigation** | ⚠️ | Tabs e selects funcionam, mas sem teste |
| **Screen readers** | ❌ | Não testado |
| **prefers-reduced-motion** | ❌ | Animações sem media query |
| **Focus trap em modais** | ⚠️ | shadcn/ui Dialog tem focus trap |
| **Skip to content** | ❌ | Não implementado |

---

## 3. Melhorias Recomendadas

| Melhoria | Impacto | Esforço |
|---|---|---|
| `prefers-reduced-motion` em animações | Alto | Baixo |
| aria-labels em botões de ação | Alto | Médio |
| Focus trap em todos os modais | Alto | Baixo |
| Skip to content link | Médio | Baixo |
| Keyboard testing | Médio | Médio |
| Screen reader testing | Alto | Alto |
