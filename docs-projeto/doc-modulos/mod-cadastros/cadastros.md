# Cadastros

> Gestão de cadastro de clientes PF/PJ

**Key:** `cadastros` | **Ícone:** `Users` | **Ambientes:** `cadastro, consultor, tecnologia, suporte`

---

## 1. Core do Módulo

O módulo de Cadastros permite ao consultor gerar links de cadastro para leads, que preenchem um formulário público com seus dados pessoais ou empresariais, endereços e documentos. O time de cadastro recebe as solicitações, analisa os dados fornecidos, aprova ou reprova cadastros individualmente — podendo até solicitar correções específicas por campo. Documentos anexados passam por aprovação independente. Um dashboard consolida o volume de cadastros por status, e relatórios oferecem visão agregada do desempenho da operação.

---

## 2. Estrutura do Módulo

```
src/features/cadastros/
├── module.ts
└── permissions.ts

src/features/clientes/
└── index.ts          # Types, CRUD e operações de negócio
```

| Diretório | Arquivos | Descrição |
|-----------|----------|-----------|
| `features/cadastros/` | 2 | Definição do módulo e permissões |
| `features/clientes/` | 1 | Serviço de dados, types e funções CRUD |

---

## 3. Rotas

| Rota | Componente | Descrição | Acesso |
|------|-----------|-----------|--------|
| `/cadastros/dashboard` | Dashboard | Resumo de cadastros por status com KPI cards e status breakdown | `ver_todos_cadastros` |
| `/cadastros/solicitacoes` | Solicitacoes | Lista de solicitações de cadastros (exclui aprovados), com filtros por status e consultor | `ver_todos_cadastros` ou `gerar_links` |
| `/cadastros/solicitacoes/$id` | ClienteDetalhe | Análise e aprovação de cadastro individual | `ver_todos_cadastros` |
| `/cadastros/clientes` | Clientes | Lista de clientes com cadastros aprovados — consultores veem apenas seus próprios | `ver_todos_cadastros` ou `gerar_links` |
| `/cadastros/consultor` | Consultor | Dashboard do consultor com filtros de status e geração de links | `gerar_links` |
| `/cadastros/consultor/clientes` | ConsultorClientes | Lista de clientes do consultor com cadastros aprovados | `gerar_links` |
| `/cadastros/relatorios` | Relatorios | Relatórios consolidados com filtros de período e status | `ver_relatorios` |
| `/pre-cadastro/$token` | PreCadastro | Formulário público preenchido pelo lead | Público (token) |
| `/empresa/cadastros/design` | ModuloDesignPage | Configuração de design do módulo | `gerenciar_config` |

---

## 4. Permissões

| Chave | Label | Descrição | Grupo |
|-------|-------|-----------|-------|
| `ver_todos_cadastros` | Ver todos os cadastros da empresa (se inativo, vê apenas os que criou) | Permite visualizar todos os cadastros do sistema | Escopo de Dados |
| `ver_relatorios` | Ver relatórios | Permite acessar a página de relatórios | Visualização |
| `visualizar_documento` | Visualizar arquivos dos documentos | Permite abrir e visualizar arquivos dos documentos | Visualização |
| `aprovar_cadastro` | Aprovar cadastro | Permite aprovar um cadastro (definir código do cliente) | Aprovação de Cadastro |
| `reprovar_cadastro` | Reprovar cadastro | Permite reprovar um cadastro | Aprovação de Cadastro |
| `solicitar_correcao_cadastro` | Solicitar correção de cadastro | Permite solicitar correção de um cadastro | Aprovação de Cadastro |
| `aprovar_documento` | Aprovar documento | Permite aprovar documentos anexados | Aprovação de Documentos |
| `reprovar_documento` | Reprovar documento | Permite reprovar documentos | Aprovação de Documentos |
| `solicitar_correcao_documento` | Solicitar correção de documento | Permite solicitar correção de documentos | Aprovação de Documentos |
| `aprovar_campo` | Aprovar campo | Permite aprovar campos individuais do formulário | Aprovação de Campos |
| `reprovar_campo` | Reprovar campo | Permite reprovar campos individuais | Aprovação de Campos |
| `solicitar_correcao_campo` | Solicitar correção de campo | Permite solicitar correção de campos | Aprovação de Campos |
| `gerenciar_credenciais` | Gerenciar credenciais (ver + ativar/inativar) | Acessar página de credenciais e ativar/inativar usuários | Credenciais |
| `gerenciar_credenciais_admin` | Gerenciar credenciais (criar/editar/deletar) | Criar, editar e deletar credenciais de acesso | Credenciais |
| `excluir_cadastro` | Excluir cadastro | Permite excluir cadastros permanentemente | Administração |
| `gerenciar_config` | Gerenciar configurações do sistema | Acessar configurações do sistema (variáveis, webhooks) | Administração |
| `gerar_links` | Gerar links de cadastro | Permite gerar links de cadastro para leads | Geração de Links |

---

## 5. Defaults por Papel

| Permissão | Cadastro | Consultor | Tecnologia | Suporte |
|-----------|----------|-----------|------------|---------|
| `ver_todos_cadastros` | ✅ | ❌ | ❌ | ❌ |
| `aprovar_cadastro` | ✅ | ❌ | ❌ | ❌ |
| `reprovar_cadastro` | ✅ | ❌ | ❌ | ❌ |
| `solicitar_correcao_cadastro` | ✅ | ❌ | ❌ | ❌ |
| `aprovar_documento` | ✅ | ❌ | ❌ | ❌ |
| `reprovar_documento` | ✅ | ❌ | ❌ | ❌ |
| `solicitar_correcao_documento` | ✅ | ❌ | ❌ | ❌ |
| `aprovar_campo` | ✅ | ❌ | ❌ | ❌ |
| `reprovar_campo` | ✅ | ❌ | ❌ | ❌ |
| `solicitar_correcao_campo` | ✅ | ❌ | ❌ | ❌ |
| `visualizar_documento` | ✅ | ❌ | ❌ | ❌ |
| `excluir_cadastro` | ❌ | ❌ | ❌ | ❌ |
| `gerenciar_credenciais` | ❌ | ❌ | ✅ | ✅ |
| `gerenciar_credenciais_admin` | ❌ | ❌ | ✅ | ❌ |
| `gerenciar_config` | ❌ | ❌ | ❌ | ❌ |
| `gerar_links` | ❌ | ✅ | ❌ | ❌ |
| `ver_relatorios` | ✅ | ✅ | ❌ | ❌ |

---

## 6. Navegação (Sidebar)

| Label | Rota | Ícone | Permissão | Ordem |
|-------|------|-------|-----------|-------|
| Dashboard | `/cadastros/dashboard` | LayoutDashboard | `ver_todos_cadastros` | 1 |
| Solicitações | `/cadastros/solicitacoes` | Users | `ver_todos_cadastros` ou `gerar_links` | 2 |
| Clientes | `/cadastros/clientes` | Users | `ver_todos_cadastros` ou `gerar_links` | 3 |
| Consultor | `/cadastros/consultor` | UserCircle | `gerar_links` | 4 |
| Relatórios | `/cadastros/relatorios` | BarChart3 | `ver_relatorios` | 5 |

---

## 7. Eventos / Webhooks

| Chave | Label | Descrição | Tipo |
|-------|-------|-----------|------|
| `cadastro.criado` | Cadastro Criado | Dispara quando um novo cadastro é criado | `status_change` |
| `cadastro.aprovado` | Cadastro Aprovado | Dispara quando um cadastro é aprovado | `status_change` |
| `cadastro.reprovado` | Cadastro Reprovado | Dispara quando um cadastro é reprovado | `status_change` |
| `documento.aprovado` | Documento Aprovado | Dispara quando um documento é aprovado | `button_action` |
| `documento.reprovado` | Documento Reprovado | Dispara quando um documento é reprovado | `button_action` |
| `link.gerado` | Link Gerado | Dispara quando um link de cadastro é gerado | `button_action` |

---

## 8. Funcionalidades

| Flag | Ativo | Detalhe |
|------|-------|---------|
| Design Config | ✅ | `/empresa/cadastros/design` |
| Credenciais | ❌ | Desativado — funcionalidade gerenciada em `/empresa/permissoes` |
| Laboratório | ❌ | Desativado — funcionalidade Super Admin, não pertence ao módulo |
| Formulário | ❌ | Desativado — stub, sem implementação |
| Ações Customizadas | ❌ | Desativado — stub, sem implementação |
| API Connectors | ❌ | Desativado — stub, sem implementação |

---

## 9. Dependências

### Tabelas Supabase

| Tabela | Uso |
|--------|-----|
| `cadastros` | Tabela principal — dados gerais, status, token de acesso |
| `cadastros_pf` | Dados de Pessoa Física vinculados ao cadastro |
| `cadastros_pj` | Dados de Pessoa Jurídica vinculados ao cadastro |
| `cadastros_enderecos` | Endereços (empresa, entrega, cobrança) |

### Módulos Relacionados

| Módulo | Tipo de Relação |
|--------|-----------------|
| `empresas` | `empresa_id` é padrão multi-tenant da plataforma — toda tabela filtra por empresa via RLS |
| `documentos` | Documentos anexados ao cadastro passam por aprovação independente |
| `revisoes` | Revisão de campos individuais do formulário de cadastro |

### RPCs Utilizadas

| RPC | Uso |
|-----|-----|
| `limpar_links_expirados` | Remove links com prazo de validade expirado |
| `update_cadastro_from_precadastro` | Atualiza cadastro a partir do preenchimento público |

---

## 10. Schema das Tabelas

> Schema SQL consolidado das tabelas exclusivas do módulo. Colunas adicionadas via migrations estão incluídas.

### `cadastros`

```sql
create table public.cadastros (
  id                      uuid primary key default gen_random_uuid(),
  codigo_cliente          text,
  tipo_pessoa             text check (tipo_pessoa in ('PF','PJ')),
  colaborador             text,
  observacoes             text default '',
  created_by              uuid references public.profiles(id),
  status                  text not null default 'link_gerado'
                          check (status in ('link_gerado','dados_enviados','em_analise','em_correcao','aprovado','reprovado')),
  token_acesso            text unique,
  nome_temporario         text,
  tipo_acao               text default 'solicitar_cadastro'
                          check (tipo_acao in ('solicitar_cadastro','atualizar_cadastro')),
  forma_compartilhamento  text check (forma_compartilhamento in ('whatsapp','email','copiar')),
  link_expiracao          timestamptz,
  data_criacao_link       timestamptz,
  data_finalizacao        timestamptz,
  comentario_reprovacao   text,
  revisado                boolean default false,
  consulta_cnpj_realizada boolean default false,
  consulta_cro_realizada  boolean default false,
  status_verificacao_token boolean default false,
  token_gerado            text,
  token_expiracao         timestamptz,
  email_token             text,
  lead_email              text,
  lead_whatsapp           text,
  lead_nome               text,
  data_consulta           timestamptz,
  link_acessado           boolean default false,
  inicio_preenchimento    timestamptz,
  "2fa_canal"             text,
  "2fa_contato"           text,
  "2fa_token"             text,
  "2fa_expiracao"         timestamptz,
  dados_extras            jsonb default '{}'::jsonb,
  campos_correcao         jsonb default '[]'::jsonb,
  revisoes                jsonb default '{}'::jsonb,
  is_demo                 boolean default false,
  empresa_id              uuid references public.empresas(id) on delete cascade,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `codigo_cliente` | `text` | | Código do cliente no Protheus (preenchido na aprovação) |
| `tipo_pessoa` | `text` | `CHECK ('PF','PJ')` | Tipo de pessoa: Física ou Jurídica |
| `colaborador` | `text` | | Nome do colaborador que gerou o link |
| `observacoes` | `text` | default `''` | Observações gerais |
| `created_by` | `uuid` | FK → `profiles.id` | Usuário que criou o cadastro |
| `status` | `text` | `NOT NULL`, `CHECK`, default `'link_gerado'` | Status do fluxo de cadastro |
| `token_acesso` | `text` | `UNIQUE` | Token público para acesso ao formulário |
| `nome_temporario` | `text` | | Nome preenchido antes do envio de dados |
| `tipo_acao` | `text` | `CHECK`, default `'solicitar_cadastro'` | Tipo de ação: solicitar ou atualizar cadastro |
| `forma_compartilhamento` | `text` | `CHECK` | Como o link será compartilhado (whatsapp/email/copiar) |
| `link_expiracao` | `timestamptz` | | Data de expiração do link |
| `data_criacao_link` | `timestamptz` | | Data de criação do link |
| `data_finalizacao` | `timestamptz` | | Data de aprovação/reprovação |
| `comentario_reprovacao` | `text` | | Motivo da reprovação ou correção |
| `revisado` | `boolean` | default `false` | Se o cadastro já foi revisado |
| `lead_email` | `text` | | E-mail do lead (preenchimento inicial) |
| `lead_whatsapp` | `text` | | WhatsApp do lead (preenchimento inicial) |
| `lead_nome` | `text` | | Nome do lead (preenchimento inicial) |
| `dados_extras` | `jsonb` | default `'{}'` | Campos customizados via form_schema |
| `campos_correcao` | `jsonb` | default `'[]'` | Lista de campos que precisam de correção |
| `revisoes` | `jsonb` | default `'{}'` | Status de revisão de cada campo (ok/reprovado/em_correcao) |
| `empresa_id` | `uuid` | FK → `empresas.id`, `ON DELETE CASCADE` | Multi-tenant: filtra por empresa via RLS |
| `created_at` | `timestamptz` | default `now()` | Data de criação |
| `updated_at` | `timestamptz` | default `now()` | Data da última atualização |

### `cadastros_pf`

```sql
create table public.cadastros_pf (
  id                uuid primary key default gen_random_uuid(),
  cadastro_id       uuid not null references public.cadastros(id) on delete cascade,
  nome              text not null,
  cpf               text,
  data_nascimento   date,
  cro               text,
  cro_uf            text,
  data_emissao_cro  date,
  email_comunicacao text,
  email_nf          text,
  tel_fixo          text,
  celular1          text,
  celular2          text,
  estado            text,
  empresa_id        uuid references public.empresas(id) on delete cascade,
  unique(cadastro_id)
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | Identificador único |
| `cadastro_id` | `uuid` | FK → `cadastros.id`, `ON DELETE CASCADE`, `UNIQUE` | Vínculo 1:1 com o cadastro |
| `nome` | `text` | `NOT NULL` | Nome completo |
| `cpf` | `text` | | CPF |
| `data_nascimento` | `date` | | Data de nascimento |
| `cro` | `text` | | CRO/TPD |
| `cro_uf` | `text` | | UF do CRO |
| `data_emissao_cro` | `date` | | Data de emissão do CRO |
| `email_comunicacao` | `text` | | E-mail de comunicação |
| `email_nf` | `text` | | E-mail para nota fiscal |
| `tel_fixo` | `text` | | Telefone fixo |
| `celular1` | `text` | | Celular principal |
| `celular2` | `text` | | Celular secundário |
| `estado` | `text` | | Estado (UF) |
| `empresa_id` | `uuid` | FK → `empresas.id` | Multi-tenant |

### `cadastros_pj`

```sql
create table public.cadastros_pj (
  id                  uuid primary key default gen_random_uuid(),
  cadastro_id         uuid not null references public.cadastros(id) on delete cascade,
  razao_social        text not null,
  nome_fantasia       text,
  cnpj                text,
  inscricao_estadual  text,
  cro                 text,
  cro_uf              text,
  data_emissao_cro    date,
  email_comunicacao   text,
  email_nf            text,
  tel_fixo            text,
  celular1            text,
  celular2            text,
  empresa_id          uuid references public.empresas(id) on delete cascade,
  unique(cadastro_id)
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | Identificador único |
| `cadastro_id` | `uuid` | FK → `cadastros.id`, `ON DELETE CASCADE`, `UNIQUE` | Vínculo 1:1 com o cadastro |
| `razao_social` | `text` | `NOT NULL` | Razão social |
| `nome_fantasia` | `text` | | Nome fantasia |
| `cnpj` | `text` | | CNPJ |
| `inscricao_estadual` | `text` | | Inscrição estadual |
| `cro` | `text` | | CRO/TPD |
| `cro_uf` | `text` | | UF do CRO |
| `data_emissao_cro` | `date` | | Data de emissão do CRO |
| `email_comunicacao` | `text` | | E-mail de comunicação |
| `email_nf` | `text` | | E-mail para nota fiscal |
| `tel_fixo` | `text` | | Telefone fixo |
| `celular1` | `text` | | Celular principal |
| `celular2` | `text` | | Celular secundário |
| `empresa_id` | `uuid` | FK → `empresas.id` | Multi-tenant |

### `cadastros_enderecos`

```sql
create type public.tipo_endereco as enum ('empresa', 'entrega', 'cobranca');

create table public.cadastros_enderecos (
  id              uuid primary key default gen_random_uuid(),
  cadastro_id     uuid not null references public.cadastros(id) on delete cascade,
  tipo_endereco   public.tipo_endereco not null default 'empresa',
  cep             text,
  rua             text,
  numero          text,
  bairro          text,
  complemento     text,
  cidade          text,
  estado          text,
  endereco_completo text,
  empresa_id      uuid references public.empresas(id) on delete cascade,
  unique(cadastro_id, tipo_endereco)
);
```

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | Identificador único |
| `cadastro_id` | `uuid` | FK → `cadastros.id`, `ON DELETE CASCADE` | Vínculo com o cadastro |
| `tipo_endereco` | `tipo_endereco` | `NOT NULL`, `DEFAULT 'empresa'` | Tipo: empresa, entrega ou cobrança |
| `cep` | `text` | | CEP |
| `rua` | `text` | | Logradouro |
| `numero` | `text` | | Número |
| `bairro` | `text` | | Bairro |
| `complemento` | `text` | | Complemento |
| `cidade` | `text` | | Cidade |
| `estado` | `text` | | Estado (UF) |
| `endereco_completo` | `text` | | Endereço formatado (gerado pelo frontend) |
| `empresa_id` | `uuid` | FK → `empresas.id` | Multi-tenant |

> **Constraint:** `UNIQUE(cadastro_id, tipo_endereco)` — cada cadastro pode ter no máximo 1 endereço de cada tipo.

---

## 11. Notas

- Fluxo de status segue ordem linear: `link_gerado → dados_enviados → em_analise → aprovado/reprovado/em_correcao`
- Ao solicitar correção, um novo token é gerado com expiração de 24h
- A tabela `cadastros` é a única camada de conexão entre os sub-módulos (clientes, consultor, relatorios)
- Multi-tenant: toda query filtra por `empresa_id` via RLS
- Permissão `excluir_cadastro` está desativada por padrão em todos os ambientes
- A rota `/cadastros/solicitacoes` exclui cadastros com status `aprovado` da listagem e dos filtros
- A rota `/cadastros/clientes` lista apenas cadastros com status `aprovado` (novos clientes da empresa)
- Consultores acessam `/cadastros/clientes` e veem apenas seus próprios clientes (filtra por `created_by`)
- A rota `/cadastros/consultor` não exibe filtro por status "Aprovados" — consultores usam `/cadastros/clientes` para isso
- Todas as rotas do módulo seguem o design system do dashboard: KPI cards com gradiente, status breakdown colorido, skeleton loading e empty state
