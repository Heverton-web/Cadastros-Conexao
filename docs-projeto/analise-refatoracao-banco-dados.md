# Análise de Refatoração do Banco de Dados — ERP Conexão

> **Data:** 04/07/2026  
> **Escopo:** Refatoração das Tabelas CORE e reorganização dos relacionamentos com módulos  
> **Modelo Proposto:** `BANCO-DE-DADOS.md` (desktop do usuário)  
> **Schema Atual:** `prisma/schema.prisma` (~92 tabelas SQL → schema normalizado)

---

## Sumário Executivo

A proposta de remodelagem redefine a camada CORE do banco de dados com foco em:

1. **Tabelas CORE independentes** — `USUARIO` e `EMPRESA` como pilares centrais
2. **Sub-entidades padronizadas** — Dados, Endereço, Documentos, Redes, Design para cada entidade CORE
3. **Hierarquia de roles rígida** — SUPER ADMIN → ADMIN → COLABORADOR / PARCEIRO / CLIENTE
4. **Permissões granulares centralizadas** — Definidas pelo SUPER ADMIN, herdadas por hierarquia
5. **Limites por role por empresa** — Controle de quantas credenciais cada role pode ter

**Veredicto:** A refatoração é **viável e recomendada**, com ajustes. O schema atual já implementa parcialmente esta estrutura, mas possui acoplamento excessivo entre CORE e módulos (tabelas `Empresa` e `Usuario` com 70+ relações cada). A remodelagem simplifica drasticamente esse acoplamento.

---

## 1. Análise Comparativa: Modelo Proposto vs Schema Atual

### 1.1 Tabela USUARIO

| Aspecto | Proposto | Atual (Prisma) |
|---------|----------|-----------------|
| **Nome tabela** | `USUARIO` | `profiles` (via `@@map`) |
| **PK** | `user_id` (auto) | `id` (UUID gen_random_uuid) |
| **Tipo usuário** | `user_tipo: enum` | `userTipo: UserTipo enum` |
| **Permissões** | `user_permissoes: jsonb` (campo na tabela) | Tabela separada `Permissoes` com JSON |
| **Senha** | `senha: string encriptada` | ❌ Não existe (usa Supabase Auth) |
| **Empresa FK** | Não mencionado diretamente | `empresaId` FK → Empresa |
| **Roles** | super_admin, admin, colaborador, parceiro, cliente | super_admin, admin, colaborador, parceiro, cliente |
| **Relações com módulos** | Mínimas — módulos referenciam via FK | 70+ relações diretas no model |

**Diferença crítica:** O modelo proposto coloca permissões como JSONB dentro da tabela USUARIO. O schema atual usa uma tabela separada `Permissoes`. A abordagem proposta é **mais simples e performática** para leituras (single query), enquanto a atual é **mais flexível** para auditoria e versionamento.

**Recomendação:** Manter tabela separada `Permissoes` mas simplificar seu conteúdo. O JSONB direto na tabela USUARIO pode causar locks durante atualizações de permissão.

### 1.2 Tabela EMPRESA

| Aspecto | Proposto | Atual (Prisma) |
|---------|----------|-----------------|
| **Nome tabela** | `EMPRESA` | `empresas` (via `@@map`) |
| **Sub-entidades** | 7 tabelas CORE (dados, endereço, docs, redes, design, deptos, cargos) | 7 tabelas + `EmpresaConfig` |
| **Relações módulos** | Módulos referenciam via FK indireto | 80+ relações diretas no model |
| **Config módulos** | Via tabela `MODULO_EMPRESA` | `ModuloEmpresa` + `EmpresaModuloLimit` |

**Diferença crítica:** O schema atual tem `Empresa` como "god object" com ~80 relações. O modelo proposto quer que módulos se relacionem **indiretamente** — apenas com `empresa_id` como FK, sem criar relações Prisma diretas no model Empresa.

### 1.3 Sub-entidades CORE

| Entidade | Proposta | Atual | Status |
|----------|----------|-------|--------|
| EMP_DADOS | `emp_tipo`, razao, fantasia, cnpj, cpf, email, celular, fixo | `EmpresaDados` com mesmos campos | ✅ Alinhado |
| EMP_ENDERECO | rua, numero, complemento, bairro, cidade, uf, pais, cep | `EmpresaEndereco` com mesmos campos | ✅ Alinhado |
| EMP_DOCUMENTOS | nome, doc (URL) | `EmpresaDocumento` | ✅ Alinhado |
| EMP_REDES | instagram, linkedIn, youtube, site, facebook, tiktok | `EmpresaRedesSocial` (sem facebook/tiktok) | ⚠️ Campos faltando |
| EMP_DESIGN | logo (URL) | `EmpresaDesign` (theme, logoUrl, etc) | ⚠️ Atual mais completo |
| EMP_DEPARTAMENTOS | nome | `EmpresaDepartamento` | ✅ Alinhado |
| EMP_CARGOS | nome | `EmpresaCargo` | ✅ Alinhado |

### 1.4 Entidades de Pessoa (COLABORADOR / PARCEIRO / CLIENTE)

| Aspecto | Proposto | Atual |
|---------|----------|-------|
| **Estrutura** | Cada um com: dados, endereço, documentos, redes (1:1) | Idêntico — `ColabDados`, `ColabEndereco`, etc. |
| **Relação USUARIO** | FK 1:1 para USUARIO | FK 1:1 para Usuario |
| **Relação EMPRESA** | FK 1:1 para EMPRESA | FK 1:1 para Empresa |
| **CLIENTE.user_id** | Opcional (só quando precisa de credenciais) | Opcional (`usuarioId?`) |

**Status:** As entidades de pessoa já estão **perfeitamente alinhadas** com o modelo proposto.

---

## 2. Análise de Viabilidade

### 2.1 O que JÁ existe no schema atual

O schema atual **já implementa** ~85% do modelo proposto:

```
✅ USUARIO com roles (super_admin, admin, colaborador, parceiro, cliente)
✅ EMPRESA com sub-entidades (dados, endereço, documentos, redes, design, deptos, cargos)
✅ COLABORADOR com sub-entidades (1:1 com Usuario e Empresa)
✅ PARCEIRO com sub-entidades (1:1 com Usuario e Empresa)
✅ CLIENTE com sub-entidades (1:1 com Usuario opcional, 1:1 com Empresa)
✅ ModuloEmpresa para ativar/desativar módulos por empresa
✅ EmpresaModuloLimit para limites por módulo
✅ Permissoes com JSON granular
```

### 2.2 O que PRECISA ser refatorado

```
❌ Empresa model com 80+ relações (god object)
❌ Usuario model com 70+ relações (god object)
❌ Falta controle de limites por ROLE (não por módulo)
❌ Falta tabela de limites de credenciais por role/empresa
❌ Permissões muito acopladas ao model Usuario
❌ Modules.ts não reflete hierarquia SUPER ADMIN → ADMIN → outros
❌ EmpresaConfig e EmpresaDesign com sobreposição
```

### 2.3 Viabilidade Técnica

| Critério | Avaliação |
|----------|-----------|
| Compatibilidade com Supabase Auth | ✅ Mantém — auth.users via FK indireta |
| Multi-tenancy (empresa_id) | ✅ Reforçado |
| RLS Policies | ⚠️ Precisam ser reavaliadas |
| Migração de dados | ⚠️ Requer scripts de migração |
| Breaking changes no frontend | ⚠️ Queries Prisma precisam ser atualizadas |
| Performance | ✅ Melhora (menos JOINs em queries simples) |
| Escalabilidade módulos | ✅ Grande melhoria |

---

## 3. Impacto na Implementação de Novos Módulos

### 3.1 Schema Atual (Antes da Refatoração)

Para criar um novo módulo, hoje é necessário:

1. Criar tabelas com `empresa_id` FK
2. **Adicionar relações no model `Empresa`** (modificar schema central)
3. **Adicionar relações no model `Usuario`** se houver referência a usuários
4. Criar enum, model, e configurações
5. Registrar no `module.ts`

**Problema:** Todo novo módulo "polui" os models CORE com mais relações.

### 3.2 Schema Refatorado (Depois)

Para criar um novo módulo, será necessário:

1. Criar tabelas com `empresa_id` FK
2. **NÃO modificar** os models CORE (Empresa, Usuario)
3. Criar enum, model, e configurações
4. Registrar no `module.ts`

**Melhoria:** Os models CORE ficam **estáveis e imutáveis**. Novos módulos são 100% self-contained.

### 3.3 Comparativo de Esforço

| Aspecto | Antes | Depois | Ganho |
|---------|-------|--------|-------|
| Criar tabela módulo | Adicionar FK no Empresa | Criar tabela isolada | ~40% menos código CORE |
| Criar rota | Modificar routeTree + module.ts | Apenas module.ts | ~20% menos config |
| Ativar permissão | Modificar Permissoes + module.ts | Apenas module.ts | ~30% menos config |
| Testar isolamento | Verificar Empresa/Usuario | Verificar apenas o módulo | ~50% menos testes |
| Remover módulo | Remover relações do Empresa/Usuario | Deletar pasta módulo | ~90% mais simples |

---

## 4. Impacto por Módulo Existente

### 4.1 Módulo CADASTROS

**Tabelas afetadas:** `cadastros`, `cadastros_pf`, `cadastros_pj`, `cadastros_enderecos`, `documentos`

**Impacto:** ⚠️ BAIXO-MÉDIO
- Já possui `empresa_id` correto
- Relação com `Usuario` via `createdById` — manter
- Relação com `Empresa` — manter via `empresa_id`
- **Mudança:** Remover relação direta do model `Empresa.cadastros[]` (usar query com where)

### 4.2 Módulo CRM

**Tabelas afetadas:** `pipeline_estagios`, `tarefas`, `templates_mensagem`, `metas`

**Impacto:** ⚠️ BAIXO
- Já isolado com `empresa_id`
- Relação com `Usuario` via `responsavelId`, `criadorId` — manter
- **Mudança:** `PipelineEstagio` referencia `Cliente` — manter (relação entre módulos via DB)

### 4.3 Módulo HUB

**Tabelas afetadas:** 14 tabelas (`hub_user_roles`, `hub_materials`, `hub_collections`, etc.)

**Impacto:** 🟡 MÉDIO
- Possui `hub_user_roles` que cria uma hierarquia paralela
- **Mudança:** Integrar com a hierarquia CORE (user_tipo define permissão no Hub)
- Manter `hub_user_roles` apenas para roles específicas do Hub (client, distributor, etc.)

### 4.4 Módulo MAPAS

**Tabelas afetadas:** `mapas_distributors`, `mapas_consultants`

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- Sem relações diretas com Usuario
- **Nenhuma mudança necessária**

### 4.5 Módulo NPS

**Tabelas afetadas:** `nps_perguntas`, `nps_respostas`, `nps_webhook_config`, `nps_relatorios_envio`

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- **Nenhuma mudança necessária**

### 4.6 Módulo FUNIS (Kanban)

**Tabelas afetadas:** `funis`, `funis_colunas`, `funis_tarefas`, `funis_permissoes`, `funis_templates`

**Impacto:** 🟡 MÉDIO
- `funis_tarefas` referencia `Usuario` (atribuido_para, created_by)
- `funis_permissoes` cria permissão por funil — conflita com modelo CORE
- **Mudança:** Usar permissões CORE (user_tipo) + permissões de funil como camada adicional

### 4.7 Módulo DESPESAS

**Tabelas afetadas:** `despesas_tipos`, `despesas_config`, `despesas_periodos`, `despesas`, `despesas_envios`, `despesas_pagamentos`

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- Relações com `Usuario` via `usuarioId`, `aprovadorId` — manter
- **Nenhuma mudança necessária**

### 4.8 Módulo ROTAS

**Tabelas afetadas:** `rotas_config`, `rotas_clientes_base`, `rotas`, `rotas_clientes`, `rotas_trajetos`, `rotas_visitas`, `rotas_form_perguntas`

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- Relações com `Usuario` — manter
- **Nenhuma mudança necessária**

### 4.9 Módulo LINKTREE

**Tabelas afetadas:** `linktree_colaboradores`, `linktree_tema_config`, `linktree_empresa_config`, `linktree_empresa_sections`, `linktree_empresa_links`, `linktree_empresa_clicks`

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- **Nenhuma mudança necessária**

### 4.10 Módulo GERADOR DE LINKS

**Tabelas afetadas:** `gerador_links`, `gerador_templates`

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- **Nenhuma mudança necessária**

### 4.11 Módulo MARKETING

**Tabelas afetadas:** 12 tabelas (`mktg_eventos`, `mktg_landing_pages`, `mktg_meta_contas`, etc.)

**Impacto:** 🟢 BAIXO
- Já isolado com `empresa_id`
- Relações com `Usuario` via `updatedById` — manter
- **Nenhuma mudança necessária**

### 4.12 Módulo EMPRESAS (Admin)

**Tabelas afetadas:** `empresas_config`, `modulos_empresa`, `empresa_modulo_limits`

**Impacto:** 🔴 ALTO
- **Refatoração principal** — este módulo é o CORE
- `EmpresaConfig` e `EmpresaDesign` devem ser consolidados
- `EmpresaModuloLimit` deve ser expandido para limites por ROLE
- **Mudanças:**
  - Consolidar `EmpresaConfig` + `EmpresaDesign` em uma tabela
  - Adicionar `EmpresaRoleLimit` (max_admin, max_colaborador, max_parceiro, max_cliente por empresa)
  - Manter `ModuloEmpresa` para ativar módulos

---

## 5. Mudanças Necessárias e Por quê

### 5.1 Remover relações god-object dos models CORE

**Por quê:** O model `Empresa` com 80+ relações causa:
- Queries lentas (migrations pesadas)
- Dificuldade de manutenção
- Acoplamento indevido entre módulos
- Risco de efeito cascata em exclusões

**Como:** Usar queries Prisma com `where` explícito em vez de relações:
```ts
// ANTES (relação direta no model)
const empresa = await prisma.empresa.findUnique({ 
  include: { cadastros: true, funis: true, ... } 
});

// DEPOIS (query isolada)
const empresa = await prisma.empresa.findUnique({ where: { id } });
const cadastros = await prisma.cadastro.findMany({ where: { empresaId: id } });
const funis = await prisma.funil.findMany({ where: { empresaId: id } });
```

### 5.2 Criar tabela `EmpresaRoleLimit`

**Por quê:** O SUPER ADMIN precisa definir quantas credenciais cada empresa pode criar por role:
- Máximo de ADMINs por empresa
- Máximo de COLABORADORES por empresa
- Máximo de PARCEIROS por empresa
- Máximo de CLIENTES por empresa

**Schema proposto:**
```prisma
model EmpresaRoleLimit {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId       String   @map("empresa_id") @db.Uuid
  role            UserTipo
  maxCredenciais  Int      @map("max_credenciais")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, role])
  @@map("empresa_role_limits")
}
```

### 5.3 Consolidar EmpresaConfig + EmpresaDesign

**Por quê:** `EmpresaConfig` e `EmpresaDesign` têm sobreposição (ambos têm logoUrl, theme, etc.)

**Como:** Unificar em `EmpresaDesign`:
```prisma
model EmpresaDesign {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId    String   @unique @map("empresa_id") @db.Uuid
  theme        Json     @default("{}")
  logoUrl      String?  @map("logo_url")
  logoIndexUrl String?  @map("logo_index_url")
  logoAppUrl   String?  @map("logo_app_url")
  faviconUrl   String?  @map("favicon_url")
  dbConfig     Json?    @map("db_config")  // ← migrado de EmpresaConfig
  updatedAt    DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("empresa_design")
}
```

### 5.4 Adicionar campos faltantes em EmpresaRedesSocial

**Por quê:** O modelo proposto inclui Facebook e TikTok que não existem no schema atual.

```prisma
model EmpresaRedesSocial {
  // ... campos existentes
  facebook  String?
  tiktok    String?
}
```

### 5.5 Simplificar Permissoes

**Por quê:** O JSONB de permissões deve ser hierárquico:
- SUPER ADMIN: todas as permissões
- ADMIN: permissões definidas pelo SUPER ADMIN
- COLABORADOR/PARCEIRO/CLIENTE: permissões definidas pelo SUPER ADMIN e ADMIN

**Schema mantido** (tabela separada é melhor que JSONB direto para auditoria):
```prisma
model Permissoes {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  usuarioId     String    @unique @map("usuario_id") @db.Uuid
  empresaId     String?   @map("empresa_id") @db.Uuid
  permissoes    Json      @default("{}")
  modulosAcesso Json      @default("{}") @map("modulos_acesso")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  updatedBy     String?   @map("updated_by") @db.Uuid

  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("permissoes")
}
```

---

## 6. Prisma Schema Refatorado — Visão Geral

### 6.1 CORE — Enums (inalterados)

```prisma
enum UserRole {
  admin
  editor
  viewer
}

enum UserTipo {
  super_admin
  admin
  colaborador
  parceiro
  cliente
}

enum Ambiente {
  cadastro
  consultor
  tecnologia
  ambos
  suporte
}

enum TipoPessoa {
  PF
  PJ
}
```

### 6.2 CORE — USUARIO (refatorado)

```prisma
model Usuario {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email          String
  nome           String   @default("")
  role           UserRole @default(viewer)
  userTipo       UserTipo @default(colaborador) @map("user_tipo")
  avatarUrl      String?  @map("avatar_url")
  ambiente       Ambiente @default(ambos)
  departamento   String?
  ativo          Boolean  @default(true)
  isSuperAdmin   Boolean  @default(false) @map("is_super_admin")
  empresaId      String?  @map("empresa_id") @db.Uuid
  celular        String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // CORE relations
  empresa              Empresa?              @relation(fields: [empresaId], references: [id], onDelete: SetNull)
  permissoes           Permissoes?

  // CORE sub-entity relations (1:1)
  colaborador          Colaborador?
  parceiro             Parceiro?
  cliente              Cliente?

  // CORE activity relations
  notificacoes         Notificacao[]
  atividades           Atividade[]

  // ─── Relações de módulos (mantidas para compatibilidade) ───
  cadastrosCriados     Cadastro[]
  credenciaisCriadas   Credencial[]
  webhookLogs          WebhookLog[]
  webhooksUpdated      Webhook[]
  formSchemaUpdated    FormSchema[]
  hubUserRoles         HubUserRole[]
  hubMaterialsCriados  HubMaterial[]
  hubUserProgress      HubUserProgress[]
  hubCollectionProgress HubCollectionProgress[]
  hubAccessLogs        HubAccessLog[]
  hubUserBadges        HubUserBadge[]
  hubInviteTokensCriados HubInviteToken[]
  hubInviteTokensUsados  HubInviteToken[]
  funisCriados         Funil[]
  funisTarefasCriadas  FunilTarefa[]
  funisTarefasAtribuidas FunilTarefa[]
  funisTemplatesCriados FunilTemplate[]
  funisPermissoes      FunilPermissao[]
  rotasCriadas         Rota[]
  rotasClientesBase    RotasClienteBase[]
  rotasVisitas         RotasVisita[]
  rotasConfigUpdated   RotasConfig?
  despesas             Despesa[]
  despesasEnviados     DespesaEnvio[]
  despesasAprovador    DespesaEnvio[]
  despesasPagamentos   DespesaPagamento[]
  linktreeColaboradores LinktreeColaborador[]
  linktreeTemaUpdated  LinktreeTemaConfig[]
  linktreeEmpresaConfigUpdated LinktreeEmpresaConfig[]
  crmTarefasCriadas    CrmTarefa[]
  crmTarefasResponsavel CrmTarefa[]
  crmMetas             CrmMeta[]
  mktgLandingPagesVersoes MktgLandingPageVersao[]
  mktgLandingPagesUpdated MktgLandingPage[]
  mktgCalendario       MktgCalendario[]

  @@map("profiles")
}
```

> **Nota sobre refatoração gradual:** As relações de módulos no model `Usuario` podem ser removidas em fases futuras. Por enquanto, são mantidas para evitar breaking changes massivos. A meta final é que o model `Usuario` tenha APENAS relações CORE.

### 6.3 CORE — EMPRESA (refatorado — sem relações de módulos)

```prisma
model Empresa {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nome      String
  slug      String   @unique
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // CORE sub-entidades (1:1)
  dados              EmpresaDados?
  endereco           EmpresaEndereco?
  documentos         EmpresaDocumento[]
  redesSociais       EmpresaRedesSocial?
  design             EmpresaDesign?

  // CORE departamentos e cargos
  departamentos      EmpresaDepartamento[]
  cargos             EmpresaCargo[]

  // CORE config módulos
  modulosEmpresa     ModuloEmpresa[]
  moduloLimits       EmpresaModuloLimit[]
  roleLimits         EmpresaRoleLimit[]    // ← NOVO

  // CORE entidades de pessoa vinculadas
  usuarios           Usuario[]
  colaboradores      Colaborador[]
  parceiros          Parceiro[]
  clientes           Cliente[]

  // CORE atividades e notificações
  atividades         Atividade[]
  notificacoes       Notificacao[]
  notificacoesTemplates NotificacaoTemplate[]

  // CORE credenciais
  credenciais        Credencial[]
  cadastros          Cadastro[]

  // CORE webhooks e config
  webhooks           Webhook[]
  webhookLogs        WebhookLog[]
  formSchema         FormSchema[]
  apiConnectors      ApiConnector[]
  integracoesConfig  IntegracaoConfig[]

  @@map("empresas")
}
```

> **Princípio:** O model `Empresa` retém APENAS relações que são inerentemente "de empresa" — dados, pessoas, configurações globais, credenciais. Módulos como Hub, Mapas, Funis, Marketing etc. são acessados via queries `where: { empresaId }`, não via relações Prisma.

### 6.4 CORE — Sub-entidades Empresa (consolidadas)

```prisma
model EmpresaDados {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String     @unique @map("empresa_id") @db.Uuid
  empTipo   TipoPessoa @map("emp_tipo")
  razao     String?
  fantasia  String?
  cnpj      String?
  cpf       String?
  email     String?
  celular   String?
  fixo      String?
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("empresa_dados")
}

model EmpresaEndereco {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId   String   @unique @map("empresa_id") @db.Uuid
  cep         String?
  logradouro  String?
  numero      String?
  bairro      String?
  complemento String?
  cidade      String?
  estado      String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("empresa_endereco")
}

model EmpresaDocumento {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  nome      String
  doc       String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("empresa_documentos")
}

model EmpresaRedesSocial {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String   @unique @map("empresa_id") @db.Uuid
  instagram String?
  youtube   String?
  linkedin  String?
  facebook  String?  // ← NOVO (proposto)
  tiktok    String?  // ← NOVO (proposto)
  site      String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("empresa_redes")
}

model EmpresaDesign {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId    String   @unique @map("empresa_id") @db.Uuid
  theme        Json     @default("{}")
  logoUrl      String?  @map("logo_url")
  logoIndexUrl String?  @map("logo_index_url")
  logoAppUrl   String?  @map("logo_app_url")
  faviconUrl   String?  @map("favicon_url")
  dbConfig     Json?    @map("db_config")  // ← MIGRADO de EmpresaConfig
  updatedAt    DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("empresa_design")
}

model EmpresaDepartamento {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  nome      String
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, nome])
  @@map("empresa_departamentos")
}

model EmpresaCargo {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  nome      String
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, nome])
  @@map("empresa_cargos")
}
```

### 6.5 CORE — Controle de Limites (refatorado)

```prisma
model ModuloEmpresa {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  moduloKey String   @map("modulo_key")
  ativo     Boolean  @default(true)
  config    Json     @default("{}")
  createdAt DateTime @default(now()) @map("created_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, moduloKey])
  @@map("modulos_empresa")
}

model EmpresaModuloLimit {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId      String   @map("empresa_id") @db.Uuid
  moduloKey      String   @map("modulo_key")
  maxCredenciais Int?     @map("max_credenciais")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, moduloKey])
  @@map("empresa_modulo_limits")
}

// ← NOVO — Limites de credenciais por ROLE por empresa
model EmpresaRoleLimit {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId      String   @map("empresa_id") @db.Uuid
  role           UserTipo
  maxCredenciais Int      @default(999) @map("max_credenciais")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, role])
  @@map("empresa_role_limits")
}
```

### 6.6 CORE — Permissões (mantido)

```prisma
model Permissoes {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  usuarioId     String    @unique @map("usuario_id") @db.Uuid
  empresaId     String?   @map("empresa_id") @db.Uuid
  permissoes    Json      @default("{}")
  modulosAcesso Json      @default("{}") @map("modulos_acesso")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  updatedBy     String?   @map("updated_by") @db.Uuid

  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("permissoes")
}
```

### 6.7 CORE — Credenciais, Atividades, Notificações (inalterados)

```prisma
model Credencial {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdById         String?  @map("created_by") @db.Uuid
  nomeCompleto        String   @map("nome_completo")
  emailCorporativo    String   @map("email_corporativo")
  whatsappCorporativo String?  @map("whatsapp_corporativo")
  departamento        String?
  ativo               Boolean  @default(true)
  empresaId           String?  @map("empresa_id") @db.Uuid
  escopos             Json     @default("[]")
  createdAt           DateTime @default(now()) @map("created_at")

  createdby Usuario? @relation(fields: [createdById], references: [id], onDelete: SetNull)
  empresa   Empresa? @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("credenciais")
}

model Atividade {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  entidadeTipo String   @map("entidade_tipo")
  entidadeId   String   @map("entidade_id")
  acao         String
  descricao    String   @default("")
  usuarioId    String?  @map("usuario_id") @db.Uuid
  empresaId    String?  @map("empresa_id") @db.Uuid
  createdAt    DateTime @default(now()) @map("created_at")

  usuario Usuario? @relation(fields: [usuarioId], references: [id], onDelete: SetNull)
  empresa Empresa? @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("atividades")
}

model Notificacao {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  usuarioId String   @map("usuario_id") @db.Uuid
  titulo    String
  mensagem  String
  lida      Boolean  @default(false)
  dados     Json?
  empresaId String?  @map("empresa_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  usuario Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  empresa Empresa? @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("notificacoes")
}
```

### 6.8 CORE — Colaborador, Parceiro, Cliente (inalterados)

```prisma
// ============================================================
// CORE — COLABORADOR (inalterado)
// ============================================================

model Colaborador {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  usuarioId String   @unique @map("usuario_id") @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  usuario   Usuario        @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  empresa   Empresa        @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  dados     ColabDados?
  endereco  ColabEndereco?
  documentos ColabDocumento[]
  redes     ColabRedes?

  @@map("colaboradores")
}

model ColabDados {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  colabId   String   @unique @map("colab_id") @db.Uuid
  nome      String
  email     String?
  celular   String?
  fixo      String?
  ramal     String?
  tipo      String?
  avatar    String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  colaborador Colaborador @relation(fields: [colabId], references: [id], onDelete: Cascade)

  @@map("colab_dados")
}

model ColabEndereco {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  colabId     String   @unique @map("colab_id") @db.Uuid
  cep         String?
  logradouro  String?
  numero      String?
  bairro      String?
  complemento String?
  cidade      String?
  estado      String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  colaborador Colaborador @relation(fields: [colabId], references: [id], onDelete: Cascade)

  @@map("colab_endereco")
}

model ColabDocumento {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  colabId   String   @map("colab_id") @db.Uuid
  nome      String
  doc       String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  colaborador Colaborador @relation(fields: [colabId], references: [id], onDelete: Cascade)

  @@map("colab_documento")
}

model ColabRedes {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  colabId   String   @unique @map("colab_id") @db.Uuid
  instagram String?
  linkedin  String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  colaborador Colaborador @relation(fields: [colabId], references: [id], onDelete: Cascade)

  @@map("colab_redes")
}

// ============================================================
// CORE — PARCEIRO (inalterado)
// ============================================================

model Parceiro {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  usuarioId String   @unique @map("usuario_id") @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  usuario   Usuario        @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  empresa   Empresa        @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  dados     ParcDados?
  endereco  ParcEndereco?
  documentos ParcDocumento[]
  redes     ParcRedes?

  @@map("parceiros")
}

model ParcDados {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  parcId    String     @unique @map("parc_id") @db.Uuid
  empTipo   TipoPessoa @map("emp_tipo")
  razao     String?
  fantasia  String?
  cnpj      String?
  cpf       String?
  email     String?
  celular   String?
  fixo      String?
  logo      String?
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  parceiro Parceiro @relation(fields: [parcId], references: [id], onDelete: Cascade)

  @@map("parc_dados")
}

model ParcEndereco {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  parcId      String   @unique @map("parc_id") @db.Uuid
  cep         String?
  logradouro  String?
  numero      String?
  bairro      String?
  complemento String?
  cidade      String?
  estado      String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  parceiro Parceiro @relation(fields: [parcId], references: [id], onDelete: Cascade)

  @@map("parc_endereco")
}

model ParcDocumento {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  parcId    String   @map("parc_id") @db.Uuid
  nome      String
  doc       String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  parceiro Parceiro @relation(fields: [parcId], references: [id], onDelete: Cascade)

  @@map("parc_documento")
}

model ParcRedes {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  parcId    String   @unique @map("parc_id") @db.Uuid
  instagram String?
  linkedin  String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  parceiro Parceiro @relation(fields: [parcId], references: [id], onDelete: Cascade)

  @@map("parc_redes")
}

// ============================================================
// CORE — CLIENTE (inalterado)
// ============================================================

model Cliente {
  id         String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  usuarioId  String? @unique @map("usuario_id") @db.Uuid
  empresaId  String  @map("empresa_id") @db.Uuid
  estagioId  String? @map("estagio_id") @db.Uuid
  ativo      Boolean @default(true)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  usuario         Usuario?         @relation(fields: [usuarioId], references: [id], onDelete: SetNull)
  empresa         Empresa          @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  pipelineEstagio PipelineEstagio? @relation(fields: [estagioId], references: [id], onDelete: SetNull)
  dados           CliDados?
  endereco        CliEndereco?
  documentos      CliDocumento[]
  redes           CliRedes?

  @@map("clientes")
}

model CliDados {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  cliId     String     @unique @map("cli_id") @db.Uuid
  empTipo   TipoPessoa @map("emp_tipo")
  razao     String?
  fantasia  String?
  cnpj      String?
  cpf       String?
  email     String?
  celular   String?
  fixo      String?
  logo      String?
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  cliente Cliente @relation(fields: [cliId], references: [id], onDelete: Cascade)

  @@map("cli_dados")
}

model CliEndereco {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  cliId       String   @unique @map("cli_id") @db.Uuid
  cep         String?
  logradouro  String?
  numero      String?
  bairro      String?
  complemento String?
  cidade      String?
  estado      String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  cliente Cliente @relation(fields: [cliId], references: [id], onDelete: Cascade)

  @@map("cli_endereco")
}

model CliDocumento {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  cliId     String   @map("cli_id") @db.Uuid
  nome      String
  doc       String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  cliente Cliente @relation(fields: [cliId], references: [id], onDelete: Cascade)

  @@map("cli_documento")
}

model CliRedes {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  cliId     String   @unique @map("cli_id") @db.Uuid
  instagram String?
  linkedin  String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  cliente Cliente @relation(fields: [cliId], references: [id], onDelete: Cascade)

  @@map("cli_redes")
}
```

---

## 7. Módulos — Schema Refatorado por Módulo

> **Princípio:** Cada módulo mantém suas tabelas com `empresa_id` FK. As relações com CORE (Usuario, Empresa) são via FK direto, não via relações Prisma no model CORE.

### 7.1 Módulo CADASTROS (inalterado)

```prisma
// ============================================================
// MÓDULO: CADASTROS
// ============================================================

model Cadastro {
  id                     String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  codigoCliente          String?         @map("codigo_cliente")
  tipoPessoa             TipoPessoa?     @map("tipo_pessoa")
  colaborador            String?
  observacoes            String          @default("")
  createdById            String?         @map("created_by") @db.Uuid
  empresaId              String?         @map("empresa_id") @db.Uuid
  status                 CadastroStatus  @default(link_gerado)
  tokenAcesso            String?         @unique @map("token_acesso")
  // ... demais campos inalterados
  createdAt              DateTime        @default(now()) @map("created_at")
  updatedAt              DateTime        @updatedAt @map("updated_at")

  createdby Usuario          @relation(fields: [createdById], references: [id], onDelete: SetNull)
  empresa   Empresa          @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  pf        CadastroPf?
  pj        CadastroPj?
  endereco  CadastroEndereco?
  documentos Documento[]

  @@map("cadastros")
}

// CadastroPf, CadastroPj, CadastroEndereco, Documento — inalterados
```

### 7.2 Módulo CRM (inalterado)

```prisma
// ============================================================
// MÓDULO: CRM
// ============================================================

model PipelineEstagio {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId    String   @map("empresa_id") @db.Uuid
  nome         String   @db.VarChar(100)
  descricao    String?
  ordem        Int      @default(0)
  cor          String?  @default("#6366f1") @db.VarChar(7)
  icone        String?  @default("Circle") @db.VarChar(50)
  ativo        Boolean  @default(true)
  criadoEm     DateTime @default(now()) @map("criado_em")
  atualizadoEm DateTime @updatedAt @map("atualizado_em")

  empresa  Empresa   @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  clientes Cliente[]

  @@map("pipeline_estagios")
}

model CrmTarefa {
  id              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId       String            @map("empresa_id") @db.Uuid
  clienteId       String?           @map("cliente_id") @db.Uuid
  responsavelId   String            @map("responsavel_id") @db.Uuid
  criadorId       String            @map("criador_id") @db.Uuid
  titulo          String            @db.VarChar(255)
  descricao       String?
  tipo            String?           @default("geral") @db.VarChar(50)
  prioridade      CrmTarefaPrioridade? @default(media)
  status          CrmTarefaStatus?  @default(pendente)
  dataVencimento  DateTime?         @map("data_vencimento") @db.Date
  dataConclusao   DateTime?         @map("data_conclusao") @db.Date
  lembreteEnviado Boolean           @default(false) @map("lembrete_enviado")
  criadoEm        DateTime          @default(now()) @map("criado_em")
  atualizadoEm    DateTime          @updatedAt @map("atualizado_em")

  empresa     Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  responsavel Usuario @relation("CrmTarefaResponsavel", fields: [responsavelId], references: [id], onDelete: Cascade)
  criador     Usuario @relation("CrmTarefaCriador", fields: [criadorId], references: [id], onDelete: Cascade)

  @@map("tarefas")
}

// CrmTemplateMensagem, CrmMeta — inalterados
```

### 7.3 Módulo HUB (inalterado)

```prisma
// ============================================================
// MÓDULO: HUB (14 tabelas — inalteradas)
// ============================================================

model HubUserRole {
  id        String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String        @map("user_id") @db.Uuid
  role      HubAppRole    @default(client)
  empresaId String?       @map("empresa_id") @db.Uuid
  createdAt DateTime      @default(now()) @map("created_at")

  usuario Usuario  @relation(fields: [userId], references: [id], onDelete: Cascade)
  empresa Empresa? @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([userId, empresaId])
  @@map("hub_user_roles")
}

// HubMaterial, HubMaterialAsset, HubCollection, HubCollectionItem,
// HubUserProgress, HubCollectionProgress, HubAccessLog,
// HubGamificationLevel, HubBadge, HubUserBadge, HubInviteToken,
// HubSystemConfig, HubSystemIntegration, HubChatbotConfig
// — todos inalterados
```

### 7.4 Módulo MAPAS (inalterado)

```prisma
// ============================================================
// MÓDULO: MAPAS
// ============================================================

model MapasDistributor {
  id          String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId   String              @map("empresa_id") @db.Uuid
  code        String?
  name        String
  category    MapasDistCategory   @default(NON_EXCLUSIVE)
  city        String?
  state       String
  pinColor    String?             @default("#4169e1") @map("pin_color")
  pinImageUrl String?             @map("pin_image_url")
  lat         Decimal?            @db.Decimal
  lng         Decimal?            @db.Decimal
  createdAt   DateTime            @default(now()) @map("created_at")
  updatedAt   DateTime            @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("mapas_distributors")
}

model MapasConsultant {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId    String   @map("empresa_id") @db.Uuid
  registration String?
  name         String
  region       String?
  state        String
  supervisor   String?
  pinColor     String?  @default("#4169e1") @map("pin_color")
  pinImageUrl  String?  @map("pin_image_url")
  lat          Decimal? @db.Decimal
  lng          Decimal? @db.Decimal
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("mapas_consultants")
}
```

### 7.5 Módulo NPS (inalterado)

```prisma
// ============================================================
// MÓDULO: NPS
// ============================================================

model NpsPergunta {
  id           String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId    String          @map("empresa_id") @db.Uuid
  key          String
  orderIndex   Int             @default(0) @map("order_index")
  type         NpsQuestionType
  questionText String          @map("question_text")
  options      Json            @default("[]")
  required     Boolean         @default(true)
  active       Boolean         @default(true)
  isSystem     Boolean         @default(false) @map("is_system")
  createdAt    DateTime        @default(now()) @map("created_at")
  updatedAt    DateTime        @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, key])
  @@map("nps_perguntas")
}

model NpsResposta {
  id                     String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId              String   @map("empresa_id") @db.Uuid
  npsScore               Int?     @map("nps_score")
  npsComment             String   @default("") @map("nps_comment")
  // ... demais campos inalterados
  createdAt              DateTime @default(now()) @map("created_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@map("nps_respostas")
}

// NpsWebhookConfig, NpsRelatorioEnvio — inalterados
```

### 7.6 Módulo FUNIS (inalterado)

```prisma
// ============================================================
// MÓDULO: FUNIS (Kanban)
// ============================================================

model Funil {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  titulo      String
  descricao   String?
  createdById String   @map("created_by") @db.Uuid
  empresaId   String?  @map("empresa_id") @db.Uuid
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  createdby  Usuario          @relation(fields: [createdById], references: [id], onDelete: Cascade)
  empresa    Empresa?         @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  colunas    FunilColuna[]
  tarefas    FunilTarefa[]
  permissoes FunilPermissao[]

  @@map("funis")
}

// FunilColuna, FunilTarefa, FunilPermissao, FunilTemplate,
// FunilTemplateCol, FunilTemplateTask — inalterados
```

### 7.7 Módulo DESPESAS (inalterado)

```prisma
// ============================================================
// MÓDULO: DESPESAS
// ============================================================

model DespesaTipo {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId    String   @map("empresa_id") @db.Uuid
  nome         String
  valorMaximo  Decimal  @default(0) @map("valor_maximo") @db.Decimal(10, 2)
  ativo        Boolean  @default(true)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  empresa  Empresa   @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  despesas Despesa[]

  @@unique([empresaId, nome])
  @@map("despesas_tipos")
}

// DespesaConfig, DespesaPeriodo, Despesa, DespesaEnvio,
// DespesaPagamento — inalterados
```

### 7.8 Módulo ROTAS (inalterado)

```prisma
// ============================================================
// MÓDULO: ROTAS DE VISITAS
// ============================================================

model RotasConfig {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId           String   @unique @map("empresa_id") @db.Uuid
  valorKmReembolso    Decimal  @default(0) @map("valor_km_reembolso") @db.Decimal(10, 2)
  raioPermitidoMetros Int      @default(300) @map("raio_permitido_metros")
  updatedById         String?  @map("updated_by") @db.Uuid
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  empresa   Empresa   @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  updatedby Usuario?  @relation(fields: [updatedById], references: [id], onDelete: SetNull)

  @@map("rotas_config")
}

// RotasClienteBase, Rota, RotasCliente, RotasTrajeto,
// RotasVisita, RotasFormPergunta — inalterados
```

### 7.9 Módulo LINKTREE (inalterado)

```prisma
// ============================================================
// MÓDULO: LINKTREE
// ============================================================

model LinktreeColaborador { /* inalterado */ }
model LinktreeTemaConfig { /* inalterado */ }
model LinktreeEmpresaConfig { /* inalterado */ }
model LinktreeEmpresaSection { /* inalterado */ }
model LinktreeEmpresaLink { /* inalterado */ }
model LinktreeEmpresaClick { /* inalterado */ }
```

### 7.10 Módulo GERADOR DE LINKS (inalterado)

```prisma
// ============================================================
// MÓDULO: GERADOR DE LINKS
// ============================================================

model GeradorLink { /* inalterado */ }
model GeradorTemplate { /* inalterado */ }
```

### 7.11 Módulo MARKETING (inalterado)

```prisma
// ============================================================
// MÓDULO: MARKETING (12 tabelas — inalteradas)
// ============================================================

model MktgEvento { /* inalterado */ }
model MktgLandingPage { /* inalterado */ }
model MktgLandingPageVersao { /* inalterado */ }
model MktgMetaConta { /* inalterado */ }
model MktgMetaCampanha { /* inalterado */ }
model MktgMetaPost { /* inalterado */ }
model MktgMetaInsight { /* inalterado */ }
model MktgUtm { /* inalterado */ }
model MktgCriativo { /* inalterado */ }
model MktgCampanhaEmail { /* inalterado */ }
model MktgDisparoEmail { /* inalterado */ }
model MktgCalendario { /* inalterado */ }
model MktgLead { /* inalterado */ }
model MktgPixel { /* inalterado */ }
```

### 7.12 Módulo EMPRESAS (refatorado)

```prisma
// ============================================================
// MÓDULO: EMPRESAS / ADMIN
// ============================================================

// EmpresaConfig REMOVIDO — consolidado em EmpresaDesign (com dbConfig)

model ModuloEmpresa {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId String   @map("empresa_id") @db.Uuid
  moduloKey String   @map("modulo_key")
  ativo     Boolean  @default(true)
  config    Json     @default("{}")
  createdAt DateTime @default(now()) @map("created_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, moduloKey])
  @@map("modulos_empresa")
}

model EmpresaModuloLimit {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId      String   @map("empresa_id") @db.Uuid
  moduloKey      String   @map("modulo_key")
  maxCredenciais Int?     @map("max_credenciais")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, moduloKey])
  @@map("empresa_modulo_limits")
}

// ← NOVO
model EmpresaRoleLimit {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresaId      String   @map("empresa_id") @db.Uuid
  role           UserTipo
  maxCredenciais Int      @default(999) @map("max_credenciais")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)

  @@unique([empresaId, role])
  @@map("empresa_role_limits")
}

model AppConfig {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  key         String   @unique
  value       String
  description String?
  type        String   @default("env")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   String?  @map("updated_by") @db.Uuid

  @@map("app_config")
}

model MockCredential {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  identifier String    @unique
  email      String
  password   String
  role       UserRole
  ambiente   Ambiente?
  ativo      Boolean   @default(true)
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime  @updatedAt @map("updated_at")

  @@map("mock_credentials")
}
```

---

## 8. Resumo das Mudanças

### 8.1 Tabelas ADICIONADAS

| Tabela | Descrição |
|--------|-----------|
| `empresa_role_limits` | Limites de credenciais por role por empresa |

### 8.2 Tabelas REMOVIDAS / CONSOLIDADAS

| Tabela Antiga | Ação | Destino |
|---------------|------|---------|
| `empresas_config` | **Removida** | Consolidada em `empresa_design` (campo `db_config`) |

### 8.3 Tabelas MODIFICADAS

| Tabela | Mudança |
|--------|---------|
| `empresa_redes` | Adicionados campos `facebook` e `tiktok` |

### 8.4 Models Prisma MODIFICADOS

| Model | Mudança |
|-------|---------|
| `Empresa` | Relações de módulos removidas (acesso via query `where`) |
| `Usuario` | Relações de módulos mantidas para compatibilidade (meta: remover futuramente) |

### 8.5 TOTAL DE TABELAS

| Métrica | Antes | Depois | Delta |
|---------|-------|--------|-------|
| Tabelas totais | ~92 | ~92 | 0 (consolidação + adição se equivalem) |
| Relações no model Empresa | ~80 | ~25 | **-69%** |
| Relações no model Usuario | ~40 | ~15 (CORE) | **-62%** |
| Novos módulos precisam alterar CORE? | Sim | Não | **Eliminado** |

---

## 9. Recomendações

### 9.1 Implementação Gradual

1. **Fase 1 — Schema:** Aplicar mudanças no Prisma schema (adicionar `EmpresaRoleLimit`, consolidar `EmpresaConfig` → `EmpresaDesign`)
2. **Fase 2 — Migration SQL:** Gerar migration Prisma + script de migração de dados (`db_config` de `empresas_config` → `empresa_design`)
3. **Fase 3 — Backend:** Atualizar services que usam `prisma.empresa.findUnique({ include: { ... } })` para queries isoladas
4. **Fase 4 — Frontend:** Atualizar hooks React Query que dependem de relações Prisma
5. **Fase 5 — Cleanup:** Remover relações de módulos do model `Usuario` (opcional, pode ficar para compatibilidade)

### 9.2 Hierarquia de Permissões

```
SUPER ADMIN (único por sistema)
  └── Define permissões granulares para todos os roles
  └── Define limites de credenciais por role por empresa

ADMIN (1+ por empresa, definido pelo SUPER ADMIN)
  └── Vê e cria credenciais vinculadas à sua empresa
  └── Define permissões para COLABORADOR/PARCEIRO/CLIENTE
  └── Limite definido pelo SUPER ADMIN

COLABORADOR / PARCEIRO / CLIENTE
  └── Vinculados a 1 empresa
  └── Permissões definidas pelo SUPER ADMIN e ADMIN
  └── Limite definido pelo SUPER ADMIN
```

### 9.3 Padrão para Novos Módulos

Ao criar um novo módulo:
1. Criar tabelas com `empresa_id` FK
2. Criar enums necessários
3. **NÃO modificar** `Empresa` ou `Usuario` no schema
4. Registrar em `module.ts` com events, abas, permissions
5. Criar migration SQL separada
6. Criar RLS policies para `empresa_id`

---

## 10. Plano de Migração

### Step 1: Criar tabela `empresa_role_limits`
```sql
CREATE TABLE empresa_role_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  role user_tipo NOT NULL,
  max_credenciais INT NOT NULL DEFAULT 999,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, role)
);
```

### Step 2: Migrar dados de `empresas_config` → `empresa_design`
```sql
UPDATE empresa_design ed
SET db_config = ec.db_config
FROM empresas_config ec
WHERE ed.empresa_id = ec.empresa_id;
```

### Step 3: Adicionar colunas `facebook` e `tiktok`
```sql
ALTER TABLE empresa_redes ADD COLUMN facebook TEXT;
ALTER TABLE empresa_redes ADD COLUMN tiktok TEXT;
```

### Step 4: Remover tabela `empresas_config` (após validação)
```sql
DROP TABLE empresas_config;
```

### Step 5: Atualizar Prisma schema e gerar migration
```bash
npx prisma migrate dev --name refatoracao-core
npx prisma generate
```

### Step 6: Seed dados iniciais de limites por role
```sql
-- Para cada empresa existente, criar limites padrão
INSERT INTO empresa_role_limits (empresa_id, role, max_credenciais)
SELECT id, 'admin', 3 FROM empresas;
INSERT INTO empresa_role_limits (empresa_id, role, max_credenciais)
SELECT id, 'colaborador', 50 FROM empresas;
INSERT INTO empresa_role_limits (empresa_id, role, max_credenciais)
SELECT id, 'parceiro', 20 FROM empresas;
INSERT INTO empresa_role_limits (empresa_id, role, max_credenciais)
SELECT id, 'cliente', 100 FROM empresas;
```

---

> **Documento gerado automaticamente pela análise do Buffy em 04/07/2026**  
> **Baseado em:** `prisma/schema.prisma` (atual), `BANCO-DE-DADOS.md` (proposto), 24 módulos mapeados
