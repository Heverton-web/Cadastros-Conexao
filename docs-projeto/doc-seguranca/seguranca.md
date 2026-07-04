# Análise de Segurança — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Foco:** RLS, Auth, Validação

---

## 1. Visão Geral

A segurança do ERP Conexão é implementada em **3 camadas**:

1. **RLS (Row Level Security)** — Supabase/PostgreSQL — segurança a nível de banco
2. **Permissões Granulares** — Frontend + Registry — segurança a nível de aplicação
3. **Auth Middleware** — `AuthGuard` + `requireSupabaseAuth` — segurança a nível de rota

---

## 2. Row Level Security (RLS)

### 2.1 Funções Auxiliares

| Função | Descrição | Security |
|---|---|---|
| `is_super_admin_session()` | Verifica se usuário é super admin | `SECURITY DEFINER` |
| `is_admin_or_super()` | Verifica se é admin ou super admin | `SECURITY DEFINER` |
| `get_current_empresa_id()` | Retorna empresa_id do usuário logado | `SECURITY DEFINER` |
| `pode_acessar_empresa(p_empresa_id)` | Verifica acesso a empresa específica | `SECURITY DEFINER` |
| `set_created_by()` | Trigger: define created_by automaticamente | `SECURITY DEFINER` |
| `set_usuario_id()` | Trigger: define usuario_id em atividades | `SECURITY DEFINER` |

**Nota:** A migration `00025_fix_rls_recursion.sql` corrigiu recursão infinita adicionando `SECURITY DEFINER` a todas as funções auxiliares — essencial, pois as RLS policies consultam `profiles`, e a RLS de `profiles` usa essas funções.

### 2.2 Matriz de RLS Policies

#### Tabelas Core

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Super OR mesma empresa OR próprio | Super | Super | Super |
| `empresas` | Autenticados | Super | Super | Super |
| `empresas_config` | Autenticados | Super | Super | Super |
| `modulos_empresa` | Autenticados | Super | Super | Super |

#### Tabelas de Cadastro

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `cadastros` | Super OR (admin + mesma empresa) OR (created_by + mesma empresa) | Super OR mesma empresa | Super OR (admin + empresa) OR (criador + empresa) | Super OR (admin + empresa) |
| `cadastros_pf` | Super OR (admin/criador via cadastros) | Super OR mesma empresa | Super OR (admin/criador via cadastros) | Super OR (admin via cadastros) |
| `cadastros_pj` | Idem PF | Idem PF | Idem PF | Idem PF |
| `cadastros_enderecos` | Idem PF | Idem PF | Idem PF | Idem PF |
| `documentos` | Idem PF | Super OR empresa | Idem PF | Idem PF |

#### Tabelas Administrativas

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `credenciais` | Super OR (admin + empresa) | Super OR (admin + empresa) | Super OR (admin + empresa) | Super OR (admin + empresa) |
| `atividades` | Super OR mesma empresa | Super OR empresa | — | Super |
| `notificacoes` | Super OR (própria + empresa) | Super OR empresa | Super OR (própria + empresa) | — |
| `webhooks` | Super OR (admin + empresa) | Super OR (admin + empresa) | Super OR (admin + empresa) | Super |
| `api_connectors` | Autenticados | — | — | — |
| `integracoes_config` | Super OR (admin + empresa) | Super OR (admin + empresa) | Super OR (admin + empresa) | Super |
| `permissoes` | Super OR própria OR (admin + empresa) | Super OR (admin + empresa) | Super OR (admin + empresa) | Super |

#### Tabelas Públicas

| Tabela | SELECT | Nota |
|---|---|---|
| `form_schema` | Público (inclusive anônimo) | Migration 00034 |
| `mapas_distributors` | Público | |
| `mapas_consultants` | Público | |
| `linktree_colaboradores` | Público | |

#### Tabelas Super Admin (migration 00006)

| Tabela | Política |
|---|---|
| `app_config` | Apenas super admin |
| `mock_credentials` | Apenas super admin |

### 2.3 Padrão de RLS

```
Super Admin:
  is_super_admin_session() = true → acesso total

Admin de Empresa:
  is_admin_or_super() = true + empresa_id = get_current_empresa_id() → CRUD da empresa

Consultor:
  created_by = auth.uid() + empresa_id = get_current_empresa_id() → próprios registros
```

---

## 3. SECURITY DEFINER

Todas as funções RPC e triggers usam `SECURITY DEFINER` com `set search_path = ''`:

```
CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER          -- Executa como owner (postgres), bypassa RLS
SET search_path = ''      -- Evita search path injection
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR is_super_admin = true)
  );
$$;
```

---

## 4. Triggers

| Trigger | Tabela | Função | Propósito |
|---|---|---|---|
| `on_auth_user_created` | `auth.users` | `handle_new_user()` | Cria profile automaticamente |
| `on_profile_created_permissoes` | `profiles` | `handle_new_profile_permissoes()` | Cria permissões padrão |
| `trg_cadastros_set_created_by` | `cadastros` | `set_created_by()` | Define created_by automaticamente |
| `trg_atividades_set_usuario_id` | `atividades` | `set_usuario_id()` | Define usuario_id automaticamente |

---

## 5. Segurança de API Connectors

A RPC `executar_api_connector_server`:

- **SECURITY DEFINER**: Bypassa RLS para executar chamadas externas
- **pg_net**: Usa `net.http_post()` / `net.http_get()` para chamadas HTTP assíncronas
- **Interpolação segura**: Substitui placeholders `{{var}}` sem injection

---

## 6. Views

```
clientes:
  security_invoker = true → respeita RLS das tabelas base
```

---

## 7. Validação Server-Side

- **Zod schemas** no frontend para validação de formulários
- **Constraints CHECK** no banco (ambiente, role, tipo_evento)
- **UNIQUE constraints** (empresa_id + modulo_key, email, identifier)
- **Triggers** para valores padrão

---

## 8. Vulnerabilidades Potenciais

| Risco | Mitigação | Status |
|---|---|---|
| Recursão RLS | SECURITY DEFINER | ✅ Corrigido (00025) |
| SQL Injection | search_path vazio + SECURITY DEFINER | ✅ |
| XSS | React + sanitização de inputs | ✅ |
| CSRF | Supabase tokens + SameSite | ✅ |
| Brute Force | Supabase Auth rate limiting | ⚠️ Padrão Supabase |
| Admin cria usuário | Rota service_role protegida | ✅ |
| Chaves de API em código | VITE_ expostas no frontend | ⚠️ Anon key apenas |
