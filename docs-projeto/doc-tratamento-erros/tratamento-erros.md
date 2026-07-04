# Análise de Tratamento de Erros — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Estratégias de Erro

| Camada | Estratégia |
|---|---|
| **React Query** | `error` state + toast |
| **Supabase** | `try/catch` + `throw error` |
| **Auth** | Login: `if (error) throw error` |
| **Componente** | Fallback UI + toast |
| **Monitoramento** | Sentry (10% trace) |

---

## 2. Padrão de Service

```typescript
export async function listarCadastros(empresaId: string) {
  const { data, error } = await supabase
    .from("cadastros")
    .select("*")
    .eq("empresa_id", empresaId);
  
  if (error) throw error;  // ← React Query captura
  return data;
}
```

---

## 3. Padrão de Componente

```typescript
function MinhaPagina() {
  const { data, isLoading, error } = useQuery({...});

  if (isLoading) return <Skeleton className="h-32 rounded-2xl" />;
  if (error) return <div>Erro ao carregar</div>;
  if (!data?.length) return <EmptyState icon={<Icon />} title="Nenhum registro" />;
  
  return <div>{/* conteúdo */}</div>;
}
```

---

## 4. Toast de Erro

```typescript
import toast from "react-hot-toast";

try {
  await action();
  toast.success("Sucesso!");
} catch (err: any) {
  toast.error("Erro: " + (err.message || "Tente novamente"));
}
```

---

## 5. Error Boundaries

Não há Error Boundaries implementados explicitamente — os erros são tratados via:
- `try/catch` nos services
- `onError` do React Query (queries)
- `onError` das mutations

---

## 6. Sentry

```typescript
Sentry.init({
  tracesSampleRate: 0.1,         // 10% performance
  replaysOnErrorSampleRate: 1.0,  // 100% erro = replay
});
```

---

## 7. Erros Comuns e Tratamento

| Erro | Causa | Tratamento |
|---|---|---|
| 401 | Não autenticado | AuthGuard → redirect / |
| 403 | Sem permissão | UI esconde botões |
| 404 | Registro não existe | Empty state |
| 500 | Erro servidor | Toast + console.error |
| RLS | Violação de política | Erro silencioso (403) |
