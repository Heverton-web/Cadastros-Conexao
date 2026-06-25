# PLANO DE INTEGRAÇÃO — MÓDULO HUB NO ERP CONEXÃO

**Data:** 25/06/2026
**Status:** Aprovado (aguardando implementação)

---

## Decisões de Arquitetura

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Storage** | Reutilizar bucket `materials` existente | Evitar duplicidade de buckets no Supabase |
| **Chatbot** | Apenas integração com n8n (sem widget React) | Complexidade externalizada para webhook |
| **Multi-idioma** | Sistema próprio do HUB (objeto de chaves) | Mais leve, já implementado no HUB original |
| **Auth** | Usuários do ERP (`profiles`) — sem tabela separada | Reutiliza sistema de permissões existente |
| **Escopo** | Todas as fases (completo) | Entrega total do módulo |

---

## 1. Estrutura do Módulo

```
src/features/hub/
├── types.ts
├── permissions.ts              # 15 permissoes hub_*
├── module.ts                   # ModuleDefinition + setup() + nav items
├── index.ts
├── lib/
│   ├── api.ts                  # CRUDs Supabase (materiais, trilhas, badges, etc.)
│   ├── gamification.ts         # Lógica XP, badges, níveis
│   └── i18n.ts                 # Chaves de tradução (PT/EN/ES)
├── components/
│   ├── HubDashboard.tsx        # Dashboard principal (cliente/consultor/distribuidor)
│   ├── ManagerView.tsx         # Visão read-only (gestor)
│   ├── AdminPanel.tsx          # Painel admin com 6 abas
│   ├── MaterialCard.tsx        # Card de material
│   ├── CollectionCard.tsx      # Card de trilha
│   ├── ViewerModal.tsx         # Visualizador (PDF/video/image/audio/html)
│   ├── MaterialFormModal.tsx   # CRUD material
│   ├── CollectionFormModal.tsx # CRUD trilha
│   ├── AssetManagerModal.tsx   # Assets multi-idioma
│   ├── UserRow.tsx             # Linha de usuário na lista
│   ├── UserEditModal.tsx       # Editar usuário
│   ├── RankingBoard.tsx        # Ranking XP
│   ├── BadgeDisplay.tsx        # Badge individual
│   ├── BadgeFormModal.tsx      # CRUD badge
│   ├── TrailProgress.tsx       # Progresso trilha
│   ├── InviteShareModal.tsx    # Compartilhar convite
│   └── ThemeEditorPanel.tsx    # Editor tema visual
```

---

## 2. Rotas

### Públicas (rootRoute — sem auth)
| Caminho | Tela | Descrição |
|---------|------|-----------|
| `/hub/materiais/$id/visualizar` | ViewerModal | Visualização pública de material compartilhado |

### Protegidas (authLayout)
| Caminho | Tela | Descrição | Nav Item |
|---------|------|-----------|----------|
| `/hub` | HubDashboard | Dashboard: materiais + trilhas + gamificação | ✅ "Dashboard" (order 35) |
| `/hub/admin` | AdminPanel | Admin: 6 abas (Materiais/Usuários/Trilhas/Métricas/Config/Badges) | ✅ "Administrar" (order 36) |
| `/hub/webhooks` | WebhooksPage | Gerenciamento webhooks | ✅ "Webhooks" (order 37) |

### AdminPanel — 6 Abas Internas
1. **Materiais** — CRUD, filtros, toggle ativo/inativo
2. **Usuários** — lista, aprovação/rejeição, comunicação
3. **Trilhas** — CRUD, associação materiais
4. **Métricas** — KPIs, gráficos (recharts), ranking, exportação
5. **Configurações** — tema, gamificação, invites, integrações
6. **Badges** — CRUD badges com gatilhos

---

## 3. Permissões (15 hub_*)

```typescript
// Adicionar ao tipo Permissoes em src/core/permissions/types.ts
hub_ver_dashboard: boolean;        // Dashboard principal
hub_ver_materiais: boolean;        // Listar materiais
hub_criar_material: boolean;       // Criar material
hub_editar_material: boolean;      // Editar material
hub_excluir_material: boolean;     // Excluir material
hub_ver_trilhas: boolean;          // Listar trilhas
hub_criar_trilha: boolean;         // Criar trilha
hub_editar_trilha: boolean;        // Editar trilha
hub_excluir_trilha: boolean;       // Excluir trilha
hub_gerir_usuarios: boolean;       // Aprovar/rejeitar usuários
hub_ver_metricas: boolean;         // KPIs e gráficos
hub_gerenciar_config: boolean;     // Config gerais + integrações
hub_gerenciar_badges: boolean;     // CRUD badges
hub_gerenciar_tema: boolean;       // Tema visual
hub_gerenciar_webhooks: boolean;   // Webhooks
```

### Defaults por Ambiente (em `src/features/cadastros/permissions.ts`)

| Ambiente | hub_ver_dashboard | CRUD Materiais | CRUD Trilhas | Gerir Usuários | Ver Métricas | Config/Tema/Webhooks |
|----------|:-:|:-:|:-:|:-:|:-:|:-:|
| consultor | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| cadastro | ✅ | ✅ (sem excluir) | ✅ (sem excluir) | ✅ | ✅ | ❌ |
| tecnologia | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (config+tema+webhooks) |
| suporte | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ambos | ✅ | ✅ tudo | ✅ tudo | ✅ | ✅ | ✅ tudo |

---

## 4. Tabelas do Banco (17 tabelas, schema `public`)

Todas as tabelas seguem o padrão multi-tenant do ERP com `empresa_id UUID REFERENCES empresas(id)`.

### 4.1 Enums

```sql
CREATE TYPE hub_tipo_material AS ENUM ('pdf', 'image', 'video', 'audio', 'html');
CREATE TYPE hub_status_progresso AS ENUM ('started', 'completed');
CREATE TYPE hub_idioma AS ENUM ('pt-br', 'en-us', 'es-es');
CREATE TYPE hub_status_traducao AS ENUM ('draft', 'review', 'published');
CREATE TYPE hub_status_convite AS ENUM ('active', 'used', 'expired');
```

### 4.2 Tabelas

| # | Tabela | Descrição | Colunas Principais |
|---|--------|-----------|-------------------|
| 1 | `hub_materiais` | Cabeçalho dos materiais | `id`, `empresa_id`, `titulo` (jsonb), `tipo` (enum), `permissoes_role` (text[]), `ativo`, `pontos`, `tags` (text[]), `categoria`, `created_by` |
| 2 | `hub_material_assets` | Arquivos por idioma | `id`, `material_id` (FK), `idioma` (enum), `url`, `subtitle_url`, `status_traducao` |
| 3 | `hub_trilhas` | Trilhas/coleções | `id`, `empresa_id`, `titulo` (jsonb), `descricao` (jsonb), `capa_url`, `permissoes_role` (text[]), `ativo`, `pontos`, `created_by` |
| 4 | `hub_trilhas_itens` | Junção material ↔ trilha | `id`, `trilha_id` (FK), `material_id` (FK), `order_index` — UNIQUE(trilha_id, material_id) |
| 5 | `hub_progresso_material` | Progresso por material | `id`, `empresa_id`, `user_id`, `material_id` (FK), `trilha_id` (FK nullable), `status` (enum), `completed_at` — UNIQUE(user_id, material_id, trilha_id) |
| 6 | `hub_progresso_trilha` | Progresso por trilha | `id`, `empresa_id`, `user_id`, `trilha_id` (FK), `status` (enum), `completed_at` — UNIQUE(user_id, trilha_id) |
| 7 | `hub_logs_acesso` | Auditoria visualizações | `id`, `empresa_id`, `material_id` (FK), `user_id`, `idioma`, `timestamp` |
| 8 | `hub_niveis` | Níveis/patentes (global) | `id`, `nome`, `pontos_minimos`, `order_index`, `cor` — Seeds: Iniciante/Bronze/Prata/Ouro/Master |
| 9 | `hub_badges` | Definições de badges | `id`, `empresa_id`, `nome`, `descricao`, `icone`, `tipo_gatilho`, `valor_gatilho`, `pontos_recompensa`, `cor` |
| 10 | `hub_usuarios_badges` | Badges conquistadas | `id`, `empresa_id`, `user_id`, `badge_id` (FK), `earned_at` — UNIQUE(user_id, badge_id) |
| 11 | `hub_convites` | Tokens de convite | `id`, `empresa_id`, `token` (UNIQUE), `role`, `status` (enum), `used_by`, `used_at`, `expires_at`, `sender_name`, `recipient_name`, `recipient_phone` |
| 12 | `hub_config` | Config da empresa (1 por empresa) | `empresa_id` (PK FK), `app_nome`, `logo_url`, `tema` (jsonb), `gamificacao_ativa`, `idiomas_ativos` (text[]) |
| 13 | `hub_webhooks` | Webhooks configurados | `id`, `empresa_id`, `nome`, `url`, `evento`, `event_filter` (jsonb), `ativo` |
| 14 | `hub_webhook_logs` | Logs de execução | `id`, `empresa_id`, `webhook_id` (FK), `evento`, `payload` (jsonb), `status` (success/error), `response_code`, `response_body` |
| 15 | `hub_integracoes` | Chaves de API IA | `id`, `empresa_id`, `gemini_api_key_encrypted`, `openai_api_key_encrypted`, `gemini_function`, `openai_function`, `gemini_active`, `openai_active` |
| 16 | `hub_chat_logs` | Logs chatbot (reservado) | `id`, `empresa_id`, `user_id`, `message`, `response`, `materials_found`, `collections_found` |
| 17 | `hub_convite_config` | Config de invites | `empresa_id` (PK FK), `mensagem_padrao`, `dias_expiracao`, `roles_disponiveis` (text[]) |

### 4.3 RLS Policies

Todas as tabelas seguem o padrão:
- `SELECT`: `is_super_admin_session() OR empresa_id = get_current_empresa_i
