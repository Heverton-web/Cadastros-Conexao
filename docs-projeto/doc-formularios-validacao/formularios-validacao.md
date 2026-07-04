# Análise de Formulários e Validação — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** React Hook Form + Zod + shadcn/ui

---

## 1. Visão Geral

O sistema de formulários do ERP Conexão utiliza **React Hook Form** com **Zod** para validação, combinado com componentes **shadcn/ui** para inputs estilizados. Há também suporte a **form_schema dinâmico** para criação de campos customizados.

---

## 2. Stack de Formulários

| Camada | Tecnologia |
|---|---|
| Validação | Zod |
| Form State | React Hook Form |
| UI | shadcn/ui (Input, Select, Textarea, Button) |
| Schema dinâmico | `form_schema` table + FormBuilder |

---

## 3. Padrão de Formulário

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  tipo: z.enum(["pf", "pj"]),
});

type FormData = z.infer<typeof schema>;

function MeuFormulario() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("nome")} />
      {form.formState.errors.nome && (
        <p className="text-xs text-red-400">{form.formState.errors.nome.message}</p>
      )}
    </form>
  );
}
```

---

## 4. form_schema Dinâmico

A tabela `form_schema` permite criar campos customizados via UI:

- **SELECT público** (migration 00034)
- **Gerenciado em**: `/global/acoes` (FormBuilder tab)
- **Campos**: label, tipo (text, email, select, checkbox, file), opções, validação, ordem

```sql
CREATE TABLE IF NOT EXISTS public.form_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_key TEXT NOT NULL,
  entidade TEXT NOT NULL,
  campo TEXT NOT NULL,
  label TEXT NOT NULL,
  tipo TEXT NOT NULL,
  opcoes JSONB,
  validacao JSONB,
  obrigatorio BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  empresa_id UUID REFERENCES empresas(id)
);
```

---

## 5. Formulários por Módulo

| Módulo | Formulários | Schema |
|---|---|---|
| Cadastros | Pré-cadastro (PF/PJ), aprovação, correção | Zod + form_schema dinâmico |
| Despesas | Lançamento de despesa, aprovação | Zod |
| Rotas | Planejamento, formulário de visita | Zod + form_config |
| NPS | Pesquisa de satisfação | Custom (NpsBackground) |
| Funis | Criação de tarefa, automação | Zod |
| CRM | Cadastro de cliente, visita | Zod |
| Hub | Edição de matéria, badge | Zod |
| Marketing | Landing pages, campanhas | Zod |

---

## 6. Componentes de Input

Disponíveis em `src/components/ui/`:

| Componente | Uso |
|---|---|
| `Input` | Texto, email, number |
| `Textarea` | Texto longo |
| `Select` | Opções |
| `PasswordInput` | Senha com toggle |
| `Button` | Submit |
| `Checkbox` | Booleano |
| `Skeleton` | Loading state |

---

## 7. Validações Comuns

| Tipo | Validação | Mensagem |
|---|---|---|
| Email | `z.string().email()` | "Email inválido" |
| CPF | Custom regex | "CPF inválido" |
| CNPJ | Custom regex | "CNPJ inválido" |
| CEP | `z.string().length(8)` | "CEP deve ter 8 dígitos" |
| Telefone | Custom | "Telefone inválido" |
| Obrigatório | `z.string().min(1)` | "Campo obrigatório" |
