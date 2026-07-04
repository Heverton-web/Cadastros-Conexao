# Análise de Dependências — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Core Dependencies

### Framework
| Pacote | Versão | Uso |
|---|---|---|
| `react` | ^19 | UI |
| `react-dom` | ^19 | DOM rendering |
| `@tanstack/react-router` | ~1.114 | Routing |
| `@tanstack/react-query` | ^5 | Server state |

### UI
| Pacote | Versão |
|---|---|
| `lucide-react` | ^0.484 | Ícones |
| `react-hot-toast` | ^2.5 | Toast |
| `react-hook-form` | ^7.55 | Formulários |
| `@hookform/resolvers` | ^5.0 | Validation resolver |
| `zod` | ^3.24 | Schema validation |
| `zustand` | ^5.0 | State persistence |

### Database / Auth
| Pacote | Versão |
|---|---|
| `@supabase/supabase-js` | ^2.49 | Supabase client |

### Utilities
| Pacote | Versão |
|---|---|
| `date-fns` | ^4.1 | Date formatting |
| `clsx` | ^2.1 | Classnames utility |
| `tailwind-merge` | ^3.0 | Tailwind merge |
| `class-variance-authority` | ^0.7 | Variants |

### Monitoramento
| Pacote | Versão |
|---|---|
| `@sentry/react` | ^9 | Error tracking |

---

## 2. Dev Dependencies

| Pacote | Uso |
|---|---|
| `typescript` | Type checking |
| `vite` | Build tool |
| `vitest` | Testing |
| `playwright` | E2E testing |
| `tailwindcss` | CSS framework |
| `eslint` | Linting |
| `prettier` | Formatting |
| `husky` | Git hooks |
| `commitlint` | Commit convention |

---

## 3. Dependências Externas (Runtime)

| Serviço | Uso | Credencial |
|---|---|---|
| Supabase | DB + Auth + Storage | ANON_KEY |
| Google Maps | Distance Matrix | API Key |
| Evolution API | WhatsApp | API Key |
| ViaCEP | CEP lookup | Nenhuma |
| BrasilAPI | CEP lookup | Nenhuma |
| Sentry | Error tracking | DSN |

---

## 4. Bundle Analysis

- **~59 componentes shadcn/ui**
- **~25 módulos registrados**
- **~134 rotas**

---

## 5. Peer Dependencies

| Pacote | depends on |
|---|---|
| `@tanstack/react-router` | `@tanstack/history`, `react` |
| `@supabase/supabase-js` | `@supabase/auth-js`, `@supabase/postgrest-js`, `@supabase/realtime-js` |
| `@sentry/react` | `@sentry/core`, `@sentry/browser` |
