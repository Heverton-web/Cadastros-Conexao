# Análise de Funções — Módulo Empresa

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Quem Utiliza](#2-quem-utiliza)
3. [Quando Utiliza](#3-quando-utiliza)
4. [Como Utiliza](#4-como-utiliza)
5. [O Que Faz](#5-o-que-faz)
6. [Como São Registradas as Definições](#6-como-são-registradas-as-definições)
7. [O Que É Registrado (Dados e Formato)](#7-o-que-é-registrado-dados-e-formato)
8. [Onde São Registradas as Definições (Banco de Dados)](#8-onde-são-registradas-as-definições-banco-de-dados)

---

## 1. Visão Geral

O **Módulo Empresa** é o **núcleo de infraestrutura multi-tenant** do ERP Conexão. Ele não é um módulo de negócio como os demais — é a **camada fundacional** que permite que o ERP opere com múltiplas empresas isoladas.

**Funções principais:**
- **Gerenciamento de Empresas (Super Admin):** Criar, editar, ativar/inativar e deletar empresas
- **Configuração de Empresa (Admin/Usuário):** Editar dados da própria empresa, branding, design, banco externo
- **Gerenciamento de Credenciais:** Criar, editar, ativar/inativar e deletar credenciais da empresa
- **Gerenciamento de Permissões Granulares:** Atribuir permissões de módulos, páginas e ações para cada credencial
- **Configuração de Design:** Personalizar cores, preset de tema da empresa
- **Configuração de Branding:** Upload de logos e favicon
- **Configuração de Banco Externo:** Definir conexão com banco de dados externo por empresa
- **Central de Ações:** Configurar webhooks e automações
- **Configurações Específicas:** Config de despesas, rotas, NPS (tema/design), Linktree (tema/design), Hub (chatbot/design)
- **Configuração de Design de Módulos:** Design específico para cada módulo (mapas, funis, CRM, cadastros, despesas, rotas)
- **Limites de Credenciais (Super Admin):** Definir limites de acesso/envio/criação por módulo por empresa

**Categoria:** Infraestrutura / Administrativo

**Arquivo principal de definição:** `src/features/empresas/module.ts`

---

## 2. Quem Utiliza

| Perfil | O Que Pode Fazer |
|---|---|
| **Super Admin** | Acesso total. Pode criar/editar/deletar qualquer empresa, gerenciar credenciais de qualquer empresa, definir limites, configurar design global. Acessa pelas rotas `/global/empresas`, `/global/permissoes`, `/global/limits`, `/global/design` |
| **Admin de Empresa** | Pode editar dados da própria empresa, gerenciar credenciais da própria empresa, configurar design/branding, configurar banco externo, configurar webhooks. Acessa pela rota `/empresa/*` |
| **Sistema (automático)** | O `EmpresaProvider` carrega dados da empresa automaticamente no contexto para toda a aplicação |

---

## 3. Quando Utiliza

| Momento | Função |
|---|---|
| **Criação do sistema** | Super Admin cria empresas no painel `/global/empresas` |
| **Onboarding de nova empresa** | Ao criar uma nova empresa, o modal permite definir dados, cores, logo, módulos ativos, e criar credencial admin simultaneamente |
| **Configuração inicial** | Admin de empresa acessa `/empresa` para preencher dados cadastrais |
| **Personalização visual** | Admin acessa `/empresa/design` para personalizar cores, `/empresa/branding` para logo |
| **Gerenciamento de usuários** | Admin acessa `/empresa/permissoes` para criar/editar/remover credenciais e definir permissões |
| **A cada login** | O `EmpresaProvider` carrega contexto da empresa automaticamente |
| **Integração externa** | Admin configura banco externo em `/empresa/banco` |
| **Definição de limites** | Super Admin acessa `/global/limits` para definir limites por módulo por empresa |

---

## 4. Como Utiliza

### 4.1 Gerenciamento de Empresas (Super Admin)

Rota: `/global/empresas` → Componente `AdminSuperEmpresas`

1. Super Admin visualiza lista de empresas com status (ativo/inativo)
2. Pode alternar status com `toggleEmpresa(id, ativo)`
3. Pode deletar empresa com `deletarEmpresa(id)` (com confirmação via `confirm()` nativo)
4. Pode criar nova empresa via modal `CriarEmpresaModal` com formulário completo
5. Pode clicar em empresa para editar em `/global/empresas/$id`

**Criação de empresa** (`CriarEmpresaModal`):
- Preenche dados obrigatórios (nome, slug)
- Expandir seções opcionais: contato, endereço, redes sociais, design, branding, módulos, admin
- Define cores da marca (5 cores), logos, favicon
- Seleciona módulos ativos para a empresa
- Cria credencial admin (opcional)
- Ao salvar: chama `criarEmpresa()`, upsert `modulos_empresa`, cria credencial e usuário auth via RPC `admin_criar_usuario`

### 4.2 Gestão da Própria Empresa (Admin)

Rota: `/empresa` → Componente `AdminEmpresa`

5 abas em tabs:
1. **Dados:** Formulário com seções (Identificação, Contato, Endereço, Redes Sociais) → `atualizarEmpresa()`
2. **Credenciais:** Lista de credenciais com ações (editar, toggle ativo, deletar, gerenciar permissões) → CRUD via `listarCredenciaisPorEmpresa()`, `criarCredencial()`, `atualizarCredencial()`, `toggleCredencial()`, `deletarCredencial()`
3. **Banco Externo:** Config de conexão (host, port, database, user, password) + script SQL gerado automaticamente → `salvarEmpresaConfig()`
4. **Design:** Color picker para 5 cores da marca + preview ao vivo → `salvarEmpresaConfig({ theme })`
5. **Branding:** Upload/logos (login, header, favicon) via input file → `uploadEmpresaLogo()` + `salvarEmpresaConfig()`

### 4.3 Gerenciamento de Permissões

Rotas: `/empresa/permissoes` e `/global/permissoes`

1. Seleciona empresa (filtro) ou visualiza todos os usuários
2. Expande usuário para ver módulos e permissões
3. Alterna toggle de acesso ao módulo (acessar/não acessar)
4. Para módulos com acesso liberado, alterna páginas individuais e ações granulares
5. Botão "Salvar" persiste via `setPermissoes()` + `setModulosAcesso()`
6. Pode criar nova credencial com permissões via modal (`admin_criar_usuario` RPC)
7. Pode editar dados da credencial (nome, departamento, senha)
8. Pode ativar/inativar credencial
9. Pode excluir credencial via RPC `admin_deletar_usuario`

### 4.4 Configuração de Design

Rotas: `/empresa/design` e `/global/design`

1. Seleciona preset de tema (Dark Gold, Dark Blue, Light Clean, Dark Emerald)
2. Customiza cores individuais com color picker
3. Preview ao vivo aplica tokens CSS no `documentElement`
4. Salva via `saveDesignEmpresa()` ou `saveDesignGlobal()`
5. Botão "Herdar do Global" reseta overrides

### 4.5 Limites de Credenciais (Super Admin)

Rota: `/global/limits` → Componente `GlobalLimitsPage`

1. Expande empresa para ver grid de módulos
2. Para cada módulo, define 3 tipos de limite:
   - **Acesso:** Máximo de credenciais com acesso ao módulo
   - **Envio:** Máximo de envios (para marketing/whatsapp/email)
   - **Criação:** Máximo de criações
3. Valor `0` = ilimitado
4. Salva via upsert em `empresa_modulo_limits`

### 4.6 Serviços (Camada de Dados)

`src/shared/empresas/service.ts` expõe funções CRUD:
- `listarEmpresas()`, `buscarEmpresa(id)`, `criarEmpresa(input)`, `atualizarEmpresa(id, input)`, `deletarEmpresa(id)`, `toggleEmpresa(id, ativo)`
- `buscarEmpresaConfig(empresaId)`, `salvarEmpresaConfig(empresaId, input)`
- `listarModulosEmpresa(empresaId)`, `toggleModuloEmpresa(id, ativo)`, `upsertModuloEmpresa(empresaId, moduloKey, ativo)`
- `uploadEmpresaLogo(empresaId, tipo, file)`, `deletarEmpresaLogo(empresaId, tipo)`
- `ativarModulosParaEmpresa(empresaId, modulos)`

### 4.7 Contexto (Provider)

`src/core/empresa/EmpresaContext.tsx`:
- `EmpresaProvider` carrega `empresa` + `config` automaticamente baseado no `profile.empresa_id`
- Hook `useEmpresa()` disponível em toda a aplicação
- Atualiza quando `profile.empresa_id` muda

---

## 5. O Que Faz

### Funções de Gerenciamento de Empresas

| Função | Descrição |
|---|---|
| **Criar Empresa** | Cria registro em `empresas`, `empresas_config`, `modulos_empresa`, e opcionalmente credencial + usuário auth |
| **Editar Empresa** | Atualiza dados cadastrais (nome, contato, endereço, redes sociais) |
| **Ativar/Inativar** | Alterna status `ativo` da empresa |
| **Deletar Empresa** | Remove empresa e todos os dados vinculados (CASCADE) |
| **Gerenciar Branding** | Upload e gerenciamento de logos (login, header) e favicon via storage Supabase |
| **Configurar Design** | Personalização de cores da marca (5 cores) e preset de tema |
| **Configurar Banco Externo** | Definir conexão com banco de dados externo (host, port, database, user, password) |
| **Gerar Script SQL** | Script para criar tabelas no banco externo |
| **Gerenciar Módulos** | Ativar/desativar módulos por empresa |
| **Definir Limites** | Limitar credenciais/envios/criações por módulo por empresa |

### Funções de Gerenciamento de Credenciais

| Função | Descrição |
|---|---|
| **Listar Credenciais** | Lista credenciais vinculadas à empresa |
| **Criar Credencial** | Cria credencial (registro em `credenciais`) |
| **Editar Credencial** | Atualiza dados da credencial (nome, email, whatsapp, departamento) |
| **Ativar/Inativar** | Alterna status `ativo` da credencial |
| **Deletar Credencial** | Remove credencial e usuário auth via RPC |
| **Gerenciar Permissões** | Abrir modal de permissões da credencial |
| **Editar Dados da Credencial** | Editar nome, departamento e senha do usuário |
| **Criar Nova com Permissões** | Criar credencial + usuário auth + permissões em uma operação |

### Funções de Permissões

| Função | Descrição |
|---|---|
| **Carregar Usuários** | Busca profiles filtrados por empresa |
| **Carregar Permissões** | Busca `permissoes` (JSONB) para cada usuário |
| **Toggle Acesso Módulo** | Libera/bloqueia acesso completo a um módulo |
| **Toggle Página** | Libera/bloqueia acesso a página específica dentro de módulo |
| **Toggle Ação** | Libera/bloqueia ação específica dentro de módulo |
| **Salvar Permissões** | Persiste `setPermissoes()` + `setModulosAcesso()` |
| **Ativar/Inativar Credencial** | Alterna `ativo` em `profiles` |
| **Excluir Credencial** | RPC `admin_deletar_usuario` |
| **Editar Credencial** | Atualiza `profiles` (nome, ambiente) + RPC `admin_atualizar_senha` |
| **Criar Credencial** | RPC `admin_criar_usuario` + `setModulosAcesso()` |

### Funções de Configuração de Design

| Função | Descrição |
|---|---|
| **Selecionar Preset** | Escolhe entre 4 presets de tema (Dark Gold, Dark Blue, Light Clean, Dark Emerald) |
| **Customizar Cores** | Color picker para ~10 cores principais + typography + border radius |
| **Preview ao Vivo** | Aplica tokens CSS em tempo real no `documentElement` |
| **Salvar Design Empresa** | Persiste `tokens_override` + `preset_key` no `design_system_empresa` |
| **Salvar Design Global** | Persiste configuração global de design |
| **Resetar** | Restaura configurações para o padrão ou herda do global |
| **Publicar** | Salva e invalida cache do React Query |

### Funções de Limites

| Função | Descrição |
|---|---|
| **Carregar Dados** | Busca empresas + `empresa_modulo_limits` |
| **Definir Limite Acesso** | Máximo de credenciais com acesso ao módulo |
| **Definir Limite Envio** | Máximo de envios/mensagens (marketing, email) |
| **Definir Limite Criação** | Máximo de criações |
| **Salvar Limites** | Upsert em `empresa_modulo_limits`, delete se todos os limites forem 0 |

---

## 6. Como São Registradas as Definições

O módulo Empresa é registrado via `registerModule()` em `src/features/empresas/module.ts`:

```typescript
export const empresasModule: ModuleDefinition = {
  key: "empresas-core",
  nome: "Empresa",
  descricao: "Gerenciamento de empresas",
  icon: Building2,
  routes: [ /* 18 rotas */ ],
  permissions: [],  // Sem permissões próprias — acesso irrestrito
  ambientes: [],
  abas: [
    { key: "empresa-banco", label: "Banco de Dados", descricao: "..." },
    { key: "empresa-dados", label: "Dados da Empresa", descricao: "..." },
    { key: "empresa-permissoes", label: "Permissões", descricao: "..." },
    { key: "empresa-design", label: "Design", descricao: "..." },
    { key: "empresa-branding", label: "Branding", descricao: "..." },
  ],
  hasDesignConfig: true,
  designRoute: "/empresa/design",
  setup: () => {
    // Registra 20+ nav items no sistema de navegação
    registerNavItem({ id: "empresa-banco", label: "Banco de Dados", ... });
    registerNavItem({ id: "empresa-dados", label: "Dados da Empresa", ... });
    registerNavItem({ id: "empresa-permissoes", label: "Permissões", ... });
    registerNavItem({ id: "empresa-design", label: "Design", ... });
    registerNavItem({ id: "empresa-branding", label: "Branding", ... });
    registerNavItem({ id: "empresa-acoes", label: "Central de Ações", ... });
    registerNavItem({ id: "empresa-despesas-config", label: "Despesas", ... });
    registerNavItem({ id: "empresa-rotas-config", label: "Config. Rotas", ... });
    // + design routes para cada módulo (nps, linktree, hub, mapas, funis, crm, cadastros, despesas, rotas)
  },
};
```

**Características especiais:**
- `permissions: []` — não define permissões próprias (acesso irrestrito para quem tem acesso à empresa)
- `permissionCheck: () => true` em todos os nav items — qualquer usuário autenticado vê os itens
- **22 rotas registradas** — maior que qualquer módulo de negócio
- **hasDesignConfig: true** com designRoute própria

### Componentes de UI

O módulo utiliza:
- `src/features/empresas/components.tsx` — Componentes auxiliares: `SectionCard`, `CollapsibleSection`, `Grid`, `Field`
- `src/features/empresas/index.ts` — Re-exporta de `~/shared/empresas` para compatibilidade
- `src/shared/empresas/service.ts` — Serviços CRUD
- `src/shared/empresas/types.ts` — Tipos (`Empresa`, `EmpresaConfig`, `ModuloEmpresa`)
- `src/core/empresa/EmpresaContext.tsx` — Provider de contexto
- `src/core/empresa/useEmpresa.ts` — Hook de acesso

### Rotas do Módulo

**22 rotas registradas:**
| Rota | Função |
|---|---|
| `/global/empresas` | Lista de empresas (Super Admin) |
| `/global/empresas/$id` | Editar empresa específica (Super Admin) |
| `/global/permissoes` | Gerenciar permissões (Super Admin) |
| `/global/design` | Design System global (Super Admin) |
| `/global/limits` | Limites por módulo (Super Admin) |
| `/global/modulos` | Lista de módulos registrados |
| `/global/modulos/$key` | Detalhes de módulo |
| `/empresa` | Dashboard da empresa (Admin) |
| `/empresa/banco` | Config de banco externo |
| `/empresa/branding` | Upload de logos e favicon |
| `/empresa/design` | Design System da empresa |
| `/empresa/permissoes` | Gerenciar permissões da empresa |
| `/empresa/acoes` | Central de Ações (webhooks) |
| `/empresa/despesas-config` | Config de despesas |
| `/empresa/rotas/config` | Config de rotas |
| `/empresa/nps/tema` | Tema NPS |
| `/empresa/nps/design` | Design NPS |
| `/empresa/linktree/tema` | Tema Linktree |
| `/empresa/linktree/design` | Design Linktree |
| `/empresa/hub/chatbot` | Chatbot Hub |
| `/empresa/hub/design` | Design Hub |
| `/empresa/mapas/design` | Design Mapas |
| `/empresa/funis/design` | Design Funis |
| `/empresa/crm/design` | Design CRM |
| `/empresa/cadastros/design` | Design Cadastros |
| `/empresa/despesas/design` | Design Despesas |
| `/empresa/rotas/design` | Design Rotas |

---

## 7. O Que É Registrado (Dados e Formato)

### Definição do Módulo (`ModuleDefinition`)
```typescript
{
  key: "empresas-core",
  nome: "Empresa",
  descricao: "Gerenciamento de empresas",
  icon: Building2,           // Lucide icon
  routes: string[],          // 18+ paths registrados
  permissions: string[],     // [] — vazio
  ambientes: string[],       // [] — vazio
  abas: { key, label, descricao }[],  // 5 abas de configuração
  events: [],                // Nenhum evento
  hasDesignConfig: true,
  designRoute: "/empresa/design",
  setup: () => void          // Registra nav items
}
```

### Nav Items (20+)
```typescript
{
  id: "empresa-dados",
  label: "Dados da Empresa",
  icon: Building2,
  to: "/empresa",
  permissionCheck: () => true,  // Sempre visível
  order: 20,
  moduloKey: "empresas-core",
  noChildMatch?: true           // Apenas para o item principal
}
```

### Permissões Modulares (via `ModulosAcesso`)
```typescript
{
  "cadastros": {
    acessar: boolean,
    paginas: string[],     // IDs dos nav items
    acoes: string[]        // Chaves das permissões
  },
  "nps": { acessar, paginas, acoes },
  "funis": { acessar, paginas, acoes },
  // ... para cada módulo
}
```

### Limites (`empresa_modulo_limits`)
```typescript
{
  empresa_id: string,
  modulo_key: string,
  max_credenciais: number,  // 0 = ilimitado
  max_envios: number,       // 0 = ilimitado
  max_criacoes: number      // 0 = ilimitado
}
```

---

## 8. Onde São Registradas as Definições (Banco de Dados)

### Tabelas Core

| Tabela | Schema | Descrição |
|---|---|---|
| `empresas` | `public` | Dados cadastrais da empresa (nome, slug, contato, endereço, redes sociais, status) |
| `empresas_config` | `public` | Configurações: theme (JSONB), logos (URLs), db_config (JSONB) |
| `modulos_empresa` | `public` | Módulos ativos por empresa (empresa_id, modulo_key, ativo, config) |
| `empresa_modulo_limits` | `public` | Limites de credenciais/envios/criações por módulo por empresa |

### Tabelas de Infraestrutura Relacionadas

| Tabela | Descrição |
|---|---|
| `profiles` | Perfil do usuário com `empresa_id` FK, `role`, `ambiente`, `ativo` |
| `permissoes` | JSONB com permissões e `modulos_acesso` por usuário |
| `credenciais` | Credenciais vinculadas à empresa (nome, email, whatsapp, departamento) |

### Tabelas de Design System

| Tabela | Descrição |
|---|---|
| `design_system_global` | Configuração global de design (preset_key, tokens_override, versao) |
| `design_system_empresa` | Override de design por empresa |

### Funções RPC

| Função | Descrição |
|---|---|
| `admin_criar_usuario(p_email, p_senha, p_nome, p_empresa_id, p_is_super_admin)` | Cria usuário auth + profile |
| `admin_atualizar_senha(p_user_id, p_nova_senha)` | Altera senha do usuário |
| `admin_deletar_usuario(p_user_id)` | Remove usuário auth + profile |
| `get_current_empresa_id()` | Retorna empresa_id do usuário logado |
| `is_super_admin_session()` | Verifica se usuário é super_admin |
| `check_empresa_modulo_limit(p_empresa_id, p_modulo_key)` | Verifica se empresa atingiu limite de credenciais para o módulo |

### Storage

| Bucket | Descrição |
|---|---|
| `logos` | Armazena logos (login, header) e favicon por empresa |

---

## Diagrama de Relacionamento

```
empresas
  ├── empresas_config (1:1) — theme, logos, db_config
  ├── modulos_empresa (1:N) — módulos ativos
  ├── empresa_modulo_limits (1:N) — limites por módulo
  ├── profiles (1:N) — usuários vinculados
  ├── credenciais (1:N) — credenciais da empresa
  └── 45+ tabelas de negócio referenciam empresas.id (multi-tenant)
```
