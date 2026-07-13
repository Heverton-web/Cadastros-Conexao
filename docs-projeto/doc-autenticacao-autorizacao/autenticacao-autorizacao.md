# Análise de Autenticação e Autorização — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Supabase Auth + React Context + Registry

---

## 1. Visão Geral

O sistema de autenticação e autorização do ERP Conexão utiliza o **Supabase Auth** como backend, combinado com um **AuthProvider** em React (Context API) e um **Registry** de permissões modulares. A hierarquia de acesso é: **Super Admin → Admin de Empresa → Consultor → Usuário**.

---

## 2. Fluxo de Autenticação

```
Usuário → Login (email + senha)
    │
    ▼
Supabase Auth (signInWithPassword)
    │
    ▼
AuthProvider.onAuthStateChange
    │
    ├── Busca profile (profiles table)
    ├── Busca permissões (permissoes table)
    ├── Busca empresa (empresas table)
    ├── Busca módulos ativos (modulos_empresa)
    └── Setup dos módulos (module.setup())
```

### 2.1 Login

| Método | Função | Descrição |
|---|---|---|
| `login(email, password)` | `AuthProvider` | Autentica via Supabase Auth |
| `register(email, password)` | `AuthProvider` | Cria nova conta + confirmação por email |
| `resetPassword(email)` | `AuthProvider` | Envia email de reset |

### 2.2 Sessão

- **Gerenciada pelo Supabase:** `supabase.auth.onAuthStateChange()`
- **Persistência:** Zustand store (`auth-storage`) salva user/profile no localStorage
- **Token:** JWT gerenciado automaticamente pelo Supabase client
- **Refresh:** Automático via Supabase

### 2.3 AuthGuard

O componente `AuthGuard` no layout protegido (`_auth.tsx`):
1. Aguarda `loading === false`
2. Redireciona para `/` se não há usuário
3. Executa `module.setup()` para todos os módulos ativos
4. Renderiza `AppLayout`

---

## 3. Hierarquia de Perfis

| Perfil | `is_super_admin` | `role` | Acesso |
|---|---|---|---|
| **Super Admin** | `true` | `admin` | Tudo — todas empresas, todos módulos, todas permissões |
| **Admin de Empresa** | `false` | `admin` | Apenas sua empresa (filtro por `empresa_id`) |
| **Consultor** | `false` | `editor` | Apenas seus próprios registros (filtro por `created_by`) |
| **Visualizador** | `false` | `viewer` | Permissões restritas |
| **TI** | `false` | `admin` | Acesso técnico, gerencia credenciais |

---

## 4. Ambientes

4 ambientes que definem conjuntos de permissões padrão:

| Ambiente | Descrição | Permissões Padrão |
|---|---|---|
| `cadastro` | Setor de cadastro | Aprovar/reprovar, ver todos, ver relatórios |
| `consultor` | Consultor de vendas | Gerar links, ver relatórios |
| `tecnologia` | TI / Administrativo | Gerenciar credenciais, acesso total técnico |
| `suporte` | Suporte | Apenas gerenciar credenciais |

---

## 5. Sistema de Permissões

### 5.1 Arquitetura

```
Registry (definições)              Banco (valores)
    │                                    │
    ▼                                    ▼
registerPermission()              permissoes table
registerPermissionDefaults()      modulos_acesso
    │                                    │
    └────────┬───────────────────────────┘
             ▼
      AuthProvider (context)
             │
             ├── Super Admin → all true
             └── Outros → merge permissoes + modulos_acesso
```

### 5.2 Níveis de Granularidade

| Nível | Exemplo |
|---|---|
| **Módulo** | `modulos_acesso.cadastros.acessar` |
| **Página** | `modulos_acesso.cadastros.paginas` → `["/cadastros/dashboard"]` |
| **Ação** | `aprovar_cadastro`, `reprovar_cadastro`, `gerar_links` |

### 5.3 ~100 Permissões em 18 Módulos

| Módulo | Permissões | Ambientes |
|---|---|---|
| Cadastros | 18 | cadastro, consultor, tecnologia, suporte |
| CRM | 10 | cadastro, consultor, tecnologia |
| Funis | 18 | cadastro, consultor, tecnologia |
| Hub | 27 | cadastro, consultor, tecnologia |
| Despesas | 8 | cadastro, consultor, tecnologia, suporte |
| NPS | 7 | cadastro, consultor, tecnologia |
| LinkTree | 13 | cadastro, consultor, tecnologia |
| Rotas | 6 | cadastro, consultor, tecnologia |
| Mapas | 12 | cadastro, consultor |
| Gerador Links | 6 | cadastro, tecnologia |
| Marketing (13 submódulos) | ~50 | cadastro, tecnologia |

---

## 6. 2FA

O ERP possui **2FA para pré-cadastro público** (não para login de usuários do sistema):

| RPC | Função | Segurança |
|---|---|---|
| `gerar_2fa_pin` | Gera PIN de 6 dígitos | `SECURITY DEFINER` |
| `validar_2fa_pin` | Valida PIN com expiração de 5 min | `SECURITY DEFINER` |

O 2FA é usado para verificar identidade do lead durante o fluxo de pré-cadastro, com expiração de 5 minutos.

---

## 7. Rotas Protegidas

| Rota | Proteção | Acesso |
|---|---|---|
| `/` | Pública | Qualquer visitante |
| `/*` (auth layout) | `AuthGuard` | Usuário autenticado |
| `/global/*` | `is_super_admin` check | Apenas super admin |
| `/empresa/*` | `empresa_id` check | Admin/usuário da empresa |
| Rotas de módulo | `permissionCheck` | Por permissão específica |

---

## 8. Administração de Usuários

### RPCs de Admin

| RPC | Migração | Descrição |
|---|---|---|
| `admin_criar_usuario` | 00047 | Cria auth user + profile com email já confirmado |
| `admin_atualizar_senha` | 00046 | Atualiza senha de qualquer usuário |
| `admin_deletar_usuario` | 00052 | Deleta auth + profile + permissoes |

Todas as RPCs são `SECURITY DEFINER` e concedidas a `service_role`.

### UI de Administração

| Rota | Funcionalidade |
|---|---|
| `/global/acoes` (Credenciais tab) | Listar, criar, editar, toggle, deletar credenciais |
| `/global/acoes` (Permissões) | Gerenciar permissões granulares por usuário |
| `/global/permissoes` | Visão geral de permissões de todos os usuários |
| `/global/empresas` | Gerenciar empresas (super admin) |
| `/global/limits` | Limites de módulos por empresa |

---

## 9. Provider Stack

```
main.tsx
  └── QueryClientProvider (React Query)
      └── AuthProvider (Context + Supabase Auth)
          └── RouterProvider (TanStack Router)
              └── DesignSystemProvider (Tema)
```

---

## 10. Fluxo Completo de Login

1. Usuário acessa `/` e faz login
2. `AuthProvider` escuta `onAuthStateChange`
3. Busca **profile** na tabela `profiles`
4. Se `is_super_admin`: todas as permissões = `true`
5. Se não: busca `permissoes` na tabela `permissoes`
6. Busca **empresa** em `empresas` + `empresas_config`
7. Busca **módulos ativos** em `modulos_empresa`
8. Redireciona para `/cadastros/dashboard`
9. `AuthGuard` setup dos módulos com `module.setup()`
10. `AppLayout` renderiza sidebar com nav items filtrados por permissão
