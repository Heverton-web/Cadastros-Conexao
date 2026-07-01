# Plano: Módulo LinkTree Corporativo

## Contexto

O projeto **cartao-visitas** (https://github.com/ConexaoImplantes/cartao-visitas) é uma aplicação standalone construída com Lovable/TanStack Start que implementa um sistema de LinkTree corporativo para colaboradores da Conexão Implantes. Ele será integrado ao **ERP Conexão** como um novo módulo seguindo o padrão modular já estabelecido.

### O que o cartao-visitas faz atualmente:

- **Tabela `collaborators`**: nome, cargo, email, whatsapp, telefone_fixo, foto_url, status (ativo/inativo)
- **Tabela `theme_config`**: config JSONB global com background, icons, typography, institucional
- **Página pública `/cartao/:id`**: Renderiza o LinkTreeCard com tema customizado
- **Admin**: Dashboard (CRUD colaboradores), Tema (editor visual), QR Codes
- **Permissões**: `user_permissions` table com keys como `dashboard.view`, `dashboard.create`, `dashboard.edit`, `dashboard.delete`, `dashboard.toggle_status`, `dashboard.view_link`, `dashboard.view_qr`, `dashboard.download_qr`, `tema.view`

---

## Fases de Implementação

### Fase 1: Migration do Banco de Dados

**Arquivo**: `supabase/migrations/00039_linktree_module.sql`

Adaptar as tabelas existentes do cartao-visitas para o padrão multi-empresa do ERP Conexão:

```sql
-- 1. Tabela: linktree_colaboradores (adaptada de 'collaborators')
CREATE TABLE IF NOT EXISTS linktree_colaboradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  telefone_fixo TEXT,
  foto_url TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela: linktree_tema_config (por empresa)
CREATE TABLE IF NOT EXISTS linktree_tema_config (
  id TEXT PRIMARY KEY,  -- 'global' ou empresa_id
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Triggers, índices, RLS (padrão ERP Conexão)
-- RLS: empresa_id = get_current_empresa_id() OR is_super_admin_session()
```

**Princípios**:

- `empresa_id` em ambas as tabelas (multi-empresa)
- RLS seguindo padrão do ERP (empresa_id + super_admin)
- Triggers `update_updated_at_column()` (já existe no ERP)
- Colaboradores com `created_by` para rastreabilidade
- Tema config isolado por empresa

### Fase 2: Tipos e Constantes

**Arquivo**: `src/features/linktree/types.ts`

- `LinktreeColaborador` (adaptado de `Collaborator`)
- `LinktreeThemeConfig` (adaptado de `ThemeConfig`)
- `LinktreePermissionKey` (keys das permissões)
- `DEFAULT_THEME` e `normalizeTheme()`
- Funções utilitárias: `maskPhone`, `encodePhone`, `decodePhone`, `encodeTelefone`, `decodeTelefone`

**Arquivo**: `src/features/linktree/permissions.ts`

```typescript
export const LINKTREE_PERMISSIONS = [
  { key: "lt_ver_dashboard", label: "Ver dashboard LinkTree", ... },
  { key: "lt_criar_colaborador", label: "Criar colaborador", ... },
  { key: "lt_editar_colaborador", label: "Editar colaborador", ... },
  { key: "lt_excluir_colaborador", label: "Excluir colaborador", ... },
  { key: "lt_toggle_status", label: "Ativar/inativar colaborador", ... },
  { key: "lt_ver_link", label: "Visualizar link público", ... },
  { key: "lt_ver_qr", label: "Visualizar QR Code", ... },
  { key: "lt_baixar_qr", label: "Baixar QR Code", ... },
  { key: "lt_gerenciar_tema", label: "Gerenciar tema", ... },
];
```

**Atualizar**: `src/core/permissions/types.ts`

- Adicionar chaves `lt_*` ao tipo `Permissoes`
- Atualizar `getPermissoesPadrao()` nos 4 ambientes

### Fase 3: Definição do Módulo

**Arquivo**: `src/features/linktree/module.ts`

```typescript
export const linktreeModule: ModuleDefinition = {
  key: "linktree-conexao",
  nome: "LinkTree Corporativo",
  descricao: "Cartões digitais e QR Codes dos colaboradores",
  icon: Link2, // ou ExternalLink
  routes: ["/linktree/dashboard", "/linktree/tema"],
  permissions: LINKTREE_PERMISSIONS.map((p) => p.key),
  ambientes: ["cadastro", "consultor", "tecnologia"],
  abas: [
    { key: "geral", label: "Geral" },
    { key: "permissoes", label: "Permissões" },
    { key: "credenciais", label: "Credenciais" },
    { key: "eventos", label: "Eventos" },
  ],
  events: [
    {
      key: "colaborador.criado",
      label: "Colaborador Criado",
      type: "status_change",
    },
    {
      key: "colaborador.ativado",
      label: "Colaborador Ativado",
      type: "status_change",
    },
    {
      key: "colaborador.inativado",
      label: "Colaborador Inativado",
      type: "status_change",
    },
  ],
  hasCredentialScopes: true,
};
```

### Fase 4: Serviços (CRUD)

**Arquivo**: `src/features/linktree/index.ts`

- `listarColaboradores(empresaId?)` - SELECT com empresa_id
- `criarColaborador(input)` - INSERT com empresa_id
- `atualizarColaborador(id, input)` - UPDATE
- `toggleColaboradorStatus(id, status)` - UPDATE status
- `deletarColaborador(id)` - DELETE (super_admin ou owner)
- `buscarColaboradorPorId(id)` - SELECT single (para página pública)
- `buscarTemaConfig(empresaId?)` - SELECT theme_config
- `salvarTemaConfig(empresaId, config)` - UPSERT theme_config
- `gerarQrCodeUrl(id)` - Gera URL pública do cartão
- `gerarQrCodeDataUrl(id)` - Gera QR Code como data URL (usando lib `qrcode`)

### Fase 5: Componentes React

**Diretório**: `src/features/linktree/components/`

1. **`LinkTreeCard.tsx`** - Componente de visualização pública do cartão (portado do cartao-visitas, adaptado para usar `empresa_id` no tema)
2. **`LinktreeColaboradorModal.tsx`** - Modal de criação/edição de colaborador (portado do `collaborator-modal.tsx`)
3. **`LinktreeThemeEditor.tsx`** - Editor de tema (portado da página `cartao.tema.tsx`)
4. **`LinktreeQrModal.tsx`** - Modal de visualização/download de QR Code

**Diretório**: `src/features/linktree/lib/`

- **`qr.ts`** - Funções de QR Code (portado do `lib/qr.ts`)
- **`types.ts`** - Tipos e utilitários (portado do `lib/types.ts`): `ThemeConfig`, `DEFAULT_THEME`, `normalizeTheme()`, `maskPhone`, `encodePhone`, `decodePhone`, `encodeTelefone`, `decodeTelefone`, `BlobPosition`, `BlobItem`, etc.
- **`image-utils.ts`** - Compressão de imagens (portado do `lib/image-utils.ts`): `compressImage()` para fotos de perfil, `compressImageContain()` para logos

**NOTA sobre o que NÃO será portado**:

- `lib/permissions.ts` do cartao-visitas (usa `user_permissions` table) → substituído pelo sistema de permissões granular do ERP (`usePermissoes()`)
- `hooks/use-auth.tsx` → substituído pelo `AuthProvider` do ERP
- `hooks/use-permissions.tsx` → substituído pelo `usePermissoes()` do ERP
- `lib/error-capture.ts`, `lib/error-page.ts`, `lib/lovable-error-reporting.ts` → específicos do Lovable, não necessários
- `lib/users.functions.ts` → gestão de usuários do cartao-visitas, substituída pelo sistema de credenciais do ERP
- Toda a tabela `user_roles` e `user_permissions` do cartao-visitas → não necessária (ERP usa `credenciais` + `permissao_usuario`)

### Fase 6: Rotas (Páginas)

**Arquivo**: `src/routes/linktree.dashboard.tsx`

- Portar `cartao.dashboard.tsx` do cartao-visitas
- Adaptar para usar `supabase` do ERP Conexão (`~/core/supabase`)
- Adaptar permissões para usar `usePermissoes()` do ERP
- Filtro por `empresa_id` (multi-empresa)

**Arquivo**: `src/routes/linktree.tema.tsx`

- Portar `cartao.tema.tsx` do cartao-visitas
- Tema isolado por empresa

**Arquivo**: `src/routes/linktree.$id.tsx` (rota pública)

- Portar `cartao.$id.tsx` do cartao-visitas
- Acesso via `anon` (RLS público para status=ativo)
- **NOTA**: Esta rota NÃO está dentro do layout autenticado - é pública

### Fase 7: Integração no App

**Arquivo**: `src/main.tsx`

- Importar e registrar `linktreeModule`
- Adicionar nav items (Dashboard LinkTree, Tema LinkTree)

**Arquivo**: `src/core/permissions/types.ts`

- Adicionar chaves `lt_*` ao tipo `Permissoes`

**Arquivo**: `src/features/cadastros/permissions.ts`

- Adicionar chaves `lt_*` ao `getPermissoesPadrao()` para cada ambiente

---

## Arquivos a Criar/Modificar

### Novos:

| Caminho                                                         | Descrição                                                       |
| --------------------------------------------------------------- | --------------------------------------------------------------- |
| `supabase/migrations/00039_linktree_module.sql`                 | Migration: tabelas linktree_colaboradores, linktree_tema_config |
| `src/features/linktree/module.ts`                               | Definição do módulo                                             |
| `src/features/linktree/permissions.ts`                          | Permissões do módulo                                            |
| `src/features/linktree/types.ts`                                | Tipos e utilitários                                             |
| `src/features/linktree/index.ts`                                | Serviços CRUD                                                   |
| `src/features/linktree/components/LinkTreeCard.tsx`             | Card público                                                    |
| `src/features/linktree/components/LinktreeColaboradorModal.tsx` | Modal CRUD                                                      |
| `src/features/linktree/components/LinktreeThemeEditor.tsx`      | Editor de tema                                                  |
| `src/features/linktree/components/LinktreeQrModal.tsx`          | Modal QR Code                                                   |
| `src/features/linktree/lib/qr.ts`                               | Utilitários QR                                                  |
| `src/features/linktree/lib/image-utils.ts`                      | Compressão de imagens                                           |
| `src/routes/linktree.dashboard.tsx`                             | Página dashboard                                                |
| `src/routes/linktree.tema.tsx`                                  | Página tema                                                     |
| `src/routes/linktree.$id.tsx`                                   | Rota pública do cartão                                          |

### Modificar:

| Caminho                                 | Mudança                                                       |
| --------------------------------------- | ------------------------------------------------------------- |
| `package.json`                          | Adicionar dependência `qrcode` (e `@types/qrcode` em devDeps) |
| `src/main.tsx`                          | Importar e registrar linktreeModule                           |
| `src/core/permissions/types.ts`         | Adicionar chaves lt_*                                         |
| `src/features/cadastros/permissions.ts` | Adicionar lt_* em getPermissoesPadrao()                       |

---

## Verificação

1. **Build**: `npm run build` deve compilar sem erros
2. **Migration**: Executar `00039_linktree_module.sql` no Supabase
3. **Módulo**: Verificar que `linktree-conexao` aparece na listagem de módulos em `/admin/modulos`
4. **Configurador**: Abas Geral, Permissões, Credenciais, Eventos funcionam
5. **Dashboard**: CRUD de colaboradores funciona com filtro por empresa
6. **Tema**: Editor de tema salva por empresa
7. **Rota pública**: `/linktree/:id` renderiza o card sem autenticação
8. **QR Code**: Geração e download funcionam
9. **Permissões**: Credencial com escopo no módulo controla acesso corretamente
10. **RLS**: Usuário de empresa A não vê colaboradores da empresa B
