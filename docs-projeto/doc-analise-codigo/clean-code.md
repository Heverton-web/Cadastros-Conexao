# Análise de Código Limpo — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Princípios:** Clean Code (Robert C. Martin)

---

## 1. Resumo Executivo

O ERP Conexão possui **boas práticas moderadas**, com pontos fortes no padrão Registry/Module e pontos fracos em componentes monolíticos e duplicação de código. A pontuação geral de Clean Code é **~65/100**.

---

## 2. Violações Encontradas

### 🔴 CRÍTICAS (devem ser corrigidas)

#### 2.1 Componentes Monolíticos (God Components)

| Arquivo | Tamanho | Problema |
|---|---|---|
| `src/components/admin/CentralAcoesTab.tsx` | ~115.000 chars | **GOD COMPONENT** — mistura 8 responsabilidades: listagem, formulários webhook, formulários notificação, formulários API, importador cURL, editor KV, assistente de banco, testes |
| `src/routes/global.acoes.tsx` | ~50.000 chars | 5 componentes em um arquivo (SupabaseTab, CredenciaisTab, IntegracoesTab, CentralAcoesTab, FormBuilderTab) |
| `src/features/crm/components/KanbanAvancado.tsx` | ~400 linhas | 3 componentes em 1 arquivo (KanbanAvancado + KanbanColuna + KanbanCard) |
| `src/components/layout/AppLayout.tsx` | ~250 linhas | Notificação, header, sidebar, drawer, bottom nav tudo no mesmo componente |

**Solução:** Extrair em arquivos separados respeitando single responsibility principle.

#### 2.2 Código Duplicado

| Duplicação | Arquivos |
|---|---|
| `AppLayout.tsx` | `src/components/layout/AppLayout.tsx` + `src/core/layout/AppLayout.tsx` — dois layouts diferentes |
| `Button.tsx` | `src/components/ui/button.tsx` (shadcn/ui) + `src/core/ui/Button.tsx` (custom) — duas implementações |
| Lógica de notificações | Duplicada em ambos os AppLayout (polling, marcar lida, carregar) |
| `registrarAtividade` / `logAtividade` | Services duplicados entre módulos |
| Eventos legados do pipeline | Definidos em `webhooks.ts` e também no `module.ts` do Cadastros |

**Solução:** Remover duplicatas, consolidar no shadcn/ui.

#### 2.3 IIFE no JSX

```tsx
{(() => {
  // 50 linhas de lógica dentro do JSX
  return (...);
})()}
```

Presente em **ambos os AppLayout** para o dropdown de notificações — **lógica de negócio dentro da view**.

**Solução:** Extrair para componente `NotificationDropdown` separado.

#### 2.4 Nomes Genéricos e Inconsistências

| Local | Problema | Sugestão |
|---|---|---|
| `listarCadastros()` retorna `(Cadastro & { profiles: { nome: string } | null })[]` | Tipo `any` implícito no cast | Criar tipo específico |
| `const { data } = await supabase.rpc(...)` | `data` genérico em todo código | Nomear como `result` ou específico |
| `handleClick`, `handleSubmit` | Handler genérico | Nomear como `handleAprovarCadastro` |
| Permissions com nome EN/pt | `ver_todos_cadastros` e `crm_dashboard` | Padronizar inglês |
| Toast messages | Mensagens presas no componente | Movê-las para constantes |

---

### 🟡 MÉDIAS (melhorar gradualmente)

#### 2.5 Type Safety

```typescript
// ❌ Uso de "as any" para contornar tipos
const data = await supabase.from("clientes").select("*");
return data as any;

// ✅ Solução: tipar explicitamente
const { data } = await supabase
  .from("clientes")
  .select("*")
  .returns<Cliente[]>();
```

#### 2.6 Tratamento de Erros Genérico

```typescript
// ❌ Erro genérico
catch (err) {
  toast.error("Erro ao carregar dados");
}

// ✅ Solução: erro específico
catch (err: any) {
  console.error("[Dashboard] Erro ao carregar cadastros:", err);
  toast.error(err?.message || "Falha ao carregar dashboard");
}
```

#### 2.7 Efeitos Colaterais em useEffect

```typescript
// ❌ Mistura data fetching com efeito visual
useEffect(() => {
  listarCadastros().then(setData); // efeito colateral em useEffect
}, []);

// ✅ Solução: usar React Query (já disponível)
const { data, isLoading } = useQuery({
  queryKey: ["cadastros"],
  queryFn: () => listarCadastros(),
});
```

#### 2.8 Módulos sem Eventos

3 módulos com `events: []` que deveriam ter eventos:
- Gerador Links (tracking de cliques)
- Marketing (13 submódulos — leads, email, landing pages)
- Empresas (criação/atualização de empresa)

---

### 🟢 LEVES (boas práticas)

#### 2.9 Comentários

```typescript
// ❌ Comentário desnecessário
// Função que lista cadastros
export async function listarCadastros() { ... }

// ✅ Código auto-documentado
export async function listarCadastrosDaEmpresa(empresaId: string) { ... }
```

#### 2.10 Nomenclatura de Arquivos

```typescript
// ❌ Não segue padrão
src/features/crm/components/KanbanAvancado.tsx  // Português
src/features/crm/components/Logo.tsx             // Inglês

// ✅ Padronizar
kanban-avancado.tsx
logo.tsx
```

---

## 3. Oportunidades de Extração

### Componentes que deveriam ser extraídos

| Componente Atual | Componentes Sugeridos |
|---|---|
| `AppLayout` | `Header`, `NotificationDropdown`, `UserMenu`, `SearchBar` |
| `CentralAcoesTab` | `WebhookForm`, `NotificationForm`, `ApiConnectorForm`, `CurlImporter`, `KvEditor`, `WorkflowMatrix`, `ExecutionLogs`, `VariableAssistant` |
| `KanbanAvancado` | `KanbanBoard`, `KanbanColumn`, `KanbanCard`, `KanbanHeader` |
| `CadastrosDashboard` | `KpiGrid`, `StatusBreakdown`, `RecentRequests` |
| `global.acoes` | `SupabaseConfigTab`, `CredentialsManager`, `IntegrationsManager` |

---

## 4. Padrões que o Projeto Acerta

| Padrão | Local | Motivo |
|---|---|---|
| **Registry Pattern** | `src/registry/` | Centraliza registro sem acoplamento |
| **Service Layer** | `src/features/*/services/` | Separa lógica de dados da UI |
| **React Query hooks** | `src/features/*/hooks/` | Separa queries da UI |
| **shadcn/ui components** | `src/components/ui/` | Componentes consistentes |
| **Mobile-first classes** | Tailwind classes | Responsividade correta |
| **Error boundaries implícitas** | React Query `error` state | Tratamento de erro consistente |
| **Permission checks** | `permissionCheck` nos nav items | UI segura |

---

## 5. Recomendações Prioritárias

### Imediatas (1-2 dias)

1. Extrair `NotificationDropdown` do `AppLayout` para componente separado
2. Remover `src/core/layout/AppLayout.tsx` (não utilizado)
3. Remover `src/core/ui/Button.tsx` (substituído por shadcn/ui)
4. Extrair `CentralAceesTab` em ~8 componentes menores

### Curto Prazo (1 semana)

5. Tipar todas as queries Supabase com `returns<T>()`
6. Substituir `useEffect` para data fetching por React Query
7. Adicionar eventos aos módulos sem eventos
8. Padronizar nomenclatura pt-BR

### Médio Prazo (2-4 semanas)

9. Refatorar módulo Marketing para usar submódulos com eventos
10. Criar Error Boundaries explícitos
11. Centralizar constantes de mensagens/títulos
12. Adicionar testes ao módulo Cadastros
