# Análise do Banco de Dados — Módulo Rotas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Módulo](#2-tabelas-do-módulo)
3. [Fluxo de uma Rota](#3-fluxo-de-uma-rota)
4. [Formulário Pós-Visita](#4-formulário-pós-visita)
5. [Integração com Google Maps](#5-integração-com-google-maps)
6. [RLS Policies](#6-rls-policies)
7. [Permissões do Módulo](#7-permissões-do-módulo)
8. [Rotas do Frontend](#8-rotas-do-frontend)
9. [Migrações Relacionadas](#9-migrações-relacionadas)
10. [Diagrama de Relacionamentos](#10-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Rotas** gerencia o **planejamento e execução de rotas de visitas a clientes** no ERP Conexão. Consultores de campo podem planejar suas rotas diárias/semanais/mensais, importar clientes de diversas fontes (CSV, Cadastros, CRM), executar visitas com geolocalização e registrar formulários pós-visita.

**Características da Arquitetura:**

- **7 tabelas** interligadas formando um ecossistema completo de rotas
- **3 fontes de clientes**: CSV (importação), Cadastros (módulo existente), CRM
- **Geolocalização**: todas as entidades com latitude/longitude para mapas e validação de raio
- **Validação de presença**: verifica se o consultor estava dentro do raio permitido durante a visita
- **Reembolso por KM**: cálculo automático de valor de reembolso baseado em distância percorrida
- **Formulário dinâmico**: perguntas customizáveis por empresa para o pós-visita
- **Google Maps API key** por empresa para renderização de mapas
- **Status tracking**: ciclo completo de status para rota, cliente na rota e visita

---

## 2. Tabelas do Módulo

### 2.1 `rotas_config` — Configuração por Empresa

Singleton por empresa — configurações financeiras e operacionais.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE UNIQUE` | Empresa (um registro por empresa) |
| `valor_km_reembolso` | `decimal(10,2) NOT NULL` | Valor do reembolso por KM rodado |
| `raio_permitido_metros` | `int NOT NULL DEFAULT 300` | Raio em metros para validar presença na visita |
| `google_maps_api_key` | `text NOT NULL DEFAULT ''` | Chave Google Maps para mapas |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

---

### 2.2 `rotas_clientes_base` — Base de Clientes

Catálogo de clientes que podem ser incluídos em rotas. Pode ser populado por CSV, importação do módulo Cadastros ou CRM.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `usuario_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Consultor responsável |
| `nome` | `text NOT NULL` | Nome do cliente |
| `telefone` | `text` | Telefone de contato |
| `cidade` | `text` | Cidade |
| `estado` | `text` | Estado (UF) |
| `bairro` | `text` | Bairro |
| `rua` | `text` | Logradouro |
| `numero` | `text` | Número |
| `cep` | `text` | CEP |
| `endereco_completo` | `text` | Endereço completo |
| `latitude` | `decimal(10,7)` | Latitude para geolocalização |
| `longitude` | `decimal(10,7)` | Longitude para geolocalização |
| `ticket_medio` | `decimal(10,2)` | Ticket médio do cliente |
| `categoria` | `text` | Categoria (classificação) |
| `ultima_visita` | `date` | Data da última visita |
| `fonte` | `text NOT NULL` | Fonte: `'csv'`, `'cadastros'` ou `'crm'` |
| `fonte_id` | `uuid` | ID da entidade de origem (cadastro ou crm) |
| `ativo` | `boolean NOT NULL` | Se está ativo |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `(empresa_id, usuario_id)`, `empresa_id`

---

### 2.3 `rotas` — Planejamento de Rotas

Cabeçalho de cada rota planejada.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `usuario_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Consultor |
| `titulo` | `text NOT NULL` | Título da rota |
| `data_rota` | `date NOT NULL` | Data da rota |
| `tipo` | `text NOT NULL` | Tipo: `'diaria'`, `'semanal'`, `'mensal'` |
| `status` | `text NOT NULL` | Status: `'planejada'`, `'em_execucao'`, `'realizada'`, `'nao_realizada'`, `'cancelada'` |
| `data_inicio` | `timestamptz` | Quando a execução começou |
| `data_fim` | `timestamptz` | Quando a execução terminou |
| `local_inicio` | `jsonb` | Coordenadas de início `{lat, lng}` |
| `local_fim` | `jsonb` | Coordenadas de fim `{lat, lng}` |
| `total_visitas` | `int` | Total de visitas planejadas |
| `total_km` | `decimal(10,2)` | KM total percorrido |
| `total_tempo_trajeto_min` | `int` | Tempo total em trânsito (minutos) |
| `valor_reembolso` | `decimal(10,2)` | Valor total de reembolso |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `(empresa_id, usuario_id)`, `data_rota`, `status`

---

### 2.4 `rotas_clientes` — Clientes na Rota

Relacionamento N:N entre rotas e clientes base, com ordem e status individual.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `rota_id` | `uuid FK → rotas.id ON DELETE CASCADE` | Rota |
| `cliente_base_id` | `uuid FK → rotas_clientes_base.id ON DELETE CASCADE` | Cliente base |
| `ordem` | `int NOT NULL` | Ordem de visita na rota |
| `status` | `text NOT NULL DEFAULT 'pendente'` | Status: `'pendente'`, `'em_trajeto'`, `'em_visita'`, `'visitado'`, `'nao_visitado'` |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Constraints:** `UNIQUE(rota_id, cliente_base_id)`

**Índice:** `rota_id`

---

### 2.5 `rotas_trajetos` — Registro de Trajetos

Registra cada deslocamento entre clientes durante a execução da rota.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `rota_id` | `uuid FK → rotas.id ON DELETE CASCADE` | Rota |
| `rota_cliente_id` | `uuid FK → rotas_clientes.id ON DELETE CASCADE` | Cliente destino |
| `origem_lat` | `decimal(10,7)` | Latitude de origem |
| `origem_lng` | `decimal(10,7)` | Longitude de origem |
| `destino_lat` | `decimal(10,7)` | Latitude de destino |
| `destino_lng` | `decimal(10,7)` | Longitude de destino |
| `distancia_km` | `decimal(10,2)` | Distância percorrida (KM) |
| `duracao_minutos` | `int` | Duração do trajeto (minutos) |
| `valor_reembolso` | `decimal(10,2)` | Valor de reembolso do trajeto |
| `data_inicio` | `timestamptz` | Início do trajeto |
| `data_fim` | `timestamptz` | Fim do trajeto |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `rota_id`, `rota_cliente_id`

---

### 2.6 `rotas_visitas` — Registro de Visitas

Registro detalhado de cada visita realizada, com geolocalização e formulário.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `rota_id` | `uuid FK → rotas.id ON DELETE CASCADE` | Rota |
| `rota_cliente_id` | `uuid FK → rotas_clientes.id ON DELETE CASCADE` | Cliente na rota |
| `cliente_base_id` | `uuid FK → rotas_clientes_base.id ON DELETE CASCADE` | Cliente base |
| `consultor_id` | `uuid FK → auth.users.id NOT NULL` | Consultor que realizou |
| `data_inicio` | `timestamptz NOT NULL` | Início da visita |
| `data_fim` | `timestamptz` | Fim da visita |
| `duracao_minutos` | `int` | Duração total |
| `local_inicio` | `jsonb` | Coordenadas de início `{lat, lng}` |
| `local_fim` | `jsonb` | Coordenadas de fim `{lat, lng}` |
| `dentro_raio` | `boolean DEFAULT true` | Se estava dentro do raio permitido |
| `formulario` | `jsonb NOT NULL` | Respostas do formulário pós-visita |
| `created_at` | `timestamptz` | Data de criação |

**Índices:** `rota_id`, `rota_cliente_id`

---

### 2.7 `rotas_form_perguntas` — Formulário Pós-Visita

Schema do formulário dinâmico que os consultores preenchem após cada visita.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `titulo` | `text NOT NULL` | Título/pergunta |
| `tipo` | `text NOT NULL` | Tipo: `'texto_curto'`, `'texto_longo'`, `'data'`, `'multipla_escolha'`, `'selecao'`, `'radio'` |
| `opcoes` | `text[]` | Opções (para choice/radio) |
| `obrigatorio` | `boolean NOT NULL DEFAULT true` | Se é obrigatório |
| `ordem` | `int NOT NULL` | Ordem no formulário |
| `ativo` | `boolean NOT NULL DEFAULT true` | Se está ativo |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índice:** `empresa_id`

---

## 3. Fluxo de uma Rota

### Ciclo de Vida da Rota

```
planejada → em_execucao → realizada
                │
                ├── cancelada
                └── nao_realizada
```

### Ciclo de Vida do Cliente na Rota

```
pendente → em_trajeto → em_visita → visitado
                                         │
                                    nao_visitado
```

### Fluxo Completo de Execução

1. **Planejamento**: Consultor cria rota, seleciona clientes da base, define ordem
2. **Início**: Consultor inicia a rota → status `em_execucao`, registra `data_inicio` e `local_inicio`
3. **Trajeto**: Sistema registra deslocamento entre clientes via GPS (origem → destino)
4. **Chegada**: Consultor chega no cliente → status `em_visita`, registra `local_inicio` da visita
5. **Visita**: Consultor realiza atendimento, preenche formulário pós-visita
6. **Finalização**: Visita concluída → status `visitado`, registra `local_fim`, verifica `dentro_raio`
7. **Repetir 3-6** para cada cliente na rota
8. **Finalizar rota**: Rota concluída → status `realizada`, calcula totais (KM, tempo, reembolso)

---

## 4. Formulário Pós-Visita

O formulário é dinâmico, configurado via tabela `rotas_form_perguntas`. Cada empresa pode criar suas próprias perguntas.

### Tipos de Pergunta

| Tipo | Descrição |
|---|---|
| `texto_curto` | Campo de texto de linha única |
| `texto_longo` | Textarea |
| `data` | Seletor de data |
| `multipla_escolha` | Checkboxes (múltipla seleção) |
| `selecao` | Select dropdown |
| `radio` | Radio buttons (seleção única) |

As respostas são armazenadas como `jsonb` na coluna `formulario` de `rotas_visitas`, no formato `{"pergunta_id": "resposta"}`.

---

## 5. Integração com Google Maps

A chave de API do Google Maps é armazenada em `rotas_config.google_maps_api_key` (adicionada na migração `20260630000002`). Cada empresa tem sua própria chave, permitindo:

- Renderização de mapas com as rotas traçadas
- Visualização dos pins dos clientes
- Cálculo de distâncias e tempos de trajeto (Google Maps Directions API)
- Validação de geolocalização

---

## 6. RLS Policies

### Estrutura Geral

Todas as **7 tabelas** do módulo seguem o **mesmo padrão de RLS**:

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `*_select_auth` | Qualquer autenticado (`USING (true)`) |
| `INSERT` | `*_insert_auth` | Qualquer autenticado (`WITH CHECK (true)`) |
| `UPDATE` | `*_update_auth` | Qualquer autenticado (`USING (true) WITH CHECK (true)`) |
| `DELETE` | `*_delete_auth` | Qualquer autenticado (`USING (true)`) |

> **Observação:** O módulo Rotas é o mais permissivo do sistema — não há filtro por `empresa_id` via RLS. O controle é delegado inteiramente ao frontend e às permissões da aplicação. As tabelas não têm acesso anônimo (apenas `authenticated`).

---

## 7. Permissões do Módulo

Definidas em `src/features/rotas/permissions.ts`.

### Lista de Permissões

| Chave | Label | Grupo | Descrição |
|---|---|---|---|
| `rotas_planejar` | Planejar rotas | Rotas | Criar e editar planejamento de rotas |
| `rotas_executar` | Executar rotas | Rotas | Iniciar e finalizar rotas e visitas |
| `rotas_configurar` | Configurar rotas | Administração | Configurar valor KM e raio permitido |
| `rotas_upload_base` | Upload base clientes | Administração | Fazer upload da base de clientes via CSV |
| `rotas_ver_relatorios` | Ver relatórios | Visualização | Visualizar relatórios de rotas |
| `rotas_form_config` | Configurar formulário | Administração | Configurar perguntas do formulário pós-visita |

### Defaults por Ambiente

| Ambiente | Planejar | Executar | Configurar | Upload | Relatórios | Form Config |
|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `consultor` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 8. Rotas do Frontend

### Páginas do Módulo (6 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/rotas` | `src/routes/rotas.tsx` | Planejamento de Rotas |
| `/rotas/$id` | `src/routes/rotas.$id.tsx` | Detalhe da rota + execução |
| `/rotas/config` | `src/routes/rotas.config.tsx` | Configurações (KM, raio, API key) |
| `/rotas/design` | `src/routes/rotas.design.tsx` | Design config |
| `/empresa/rotas-config` | `src/routes/empresa.rotas-config.tsx` | Config por empresa |
| `/empresa/rotas-design` | `src/routes/empresa.rotas-design.tsx` | Design por empresa |

### Estrutura de Componentes (20 arquivos)

```
src/features/rotas/
├── components/
│   ├── ClienteRotaCard.tsx         — Card do cliente na rota
│   ├── ConfigRotasPage.tsx         — Página de configuração
│   ├── DetalheRotaPage.tsx         — Detalhe da rota em execução
│   ├── FormularioPosVisita.tsx     — Formulário dinâmico pós-visita
│   ├── NovaRotaModal.tsx           — Modal de criação de rota
│   └── PlanejamentoRotasPage.tsx   — Página principal de planejamento
├── hooks/
│   ├── useClientesBase.ts          — Hook da base de clientes
│   ├── useRotaAtiva.ts             — Hook da rota em execução
│   └── useRotas.ts                 — Hook de listagem de rotas
├── lib/
│   └── geolocation.ts              — Utilitários de geolocalização
├── services/
│   ├── clientes-base.service.ts    — CRUD base de clientes
│   ├── config.service.ts           — Configurações
│   ├── form.service.ts             — Formulário pós-visita
│   ├── google-maps.service.ts      — Integração Google Maps
│   ├── rotas.service.ts            — CRUD rotas
│   └── trajetos.service.ts         — Trajetos
├── module.ts
├── permissions.ts
└── types.ts
```

---

## 9. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `20260629150000_rotas_module.sql` | 29/06/2026 | **CORE**: 7 tabelas (`rotas_config`, `rotas_clientes_base`, `rotas`, `rotas_clientes`, `rotas_trajetos`, `rotas_visitas`, `rotas_form_perguntas`), RLS, índices, triggers |
| `20260630000002_rotas_google_maps.sql` | 30/06/2026 | Adiciona `google_maps_api_key` à `rotas_config` para chave Google Maps por empresa |

---

## 10. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:1 (singleton)
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                            rotas_config                                       │
│  valor_km_reembolso │ raio_permitido_metros                                   │
│  google_maps_api_key                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                     rotas_clientes_base  [CATÁLOGO]                           │
│  id (PK) │ empresa_id │ usuario_id │ nome                                     │
│  endereço (rua, numero, cidade, estado, cep, bairro)                         │
│  latitude │ longitude │ ticket_medio │ categoria │ ultima_visita               │
│  fonte (csv/cadastros/crm) │ fonte_id │ ativo                                 │
└──────────────┬───────────────────────────────────────────────────────────────┘
               │ 1:N
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                               rotas                                           │
│  id (PK) │ empresa_id │ usuario_id │ titulo │ data_rota                       │
│  tipo (diaria/semanal/mensal) │ status (5 estados)                           │
│  data_inicio │ data_fim │ local_inicio │ local_fim  {lat, lng}               │
│  total_visitas │ total_km │ total_tempo_trajeto_min │ valor_reembolso          │
└──────────────┬───────────────────────────────────────────────────────────────┘
               │ 1:N
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                         rotas_clientes                                        │
│  rota_id │ cliente_base_id │ ordem │ status (5 estados)                      │
│  UNIQUE(rota_id, cliente_base_id)                                            │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │ 1:1
┌──────▼──────────────────────────────────────────────────────────────────────┐
│                     rotas_trajetos   [REGISTRO]                               │
│  rota_cliente_id │ origem_lat/lng │ destino_lat/lng                          │
│  distancia_km │ duracao_minutos │ valor_reembolso                            │
│  data_inicio │ data_fim                                                      │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────▼──────────────────────────────────────────────────────────────────────┐
│                       rotas_visitas    [REGISTRO]                             │
│  rota_cliente_id │ cliente_base_id │ consultor_id                            │
│  data_inicio │ data_fim │ duracao_minutos                                    │
│  local_inicio │ local_fim  {lat, lng}                                        │
│  dentro_raio (boolean) │ formulario (JSONB)                                  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                       rotas_form_perguntas  [SCHEMA]                          │
│  empresa_id │ titulo │ tipo (6 tipos) │ opcoes[] │ obrigatorio │ ordem       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Módulo Mais Complexo em Tabelas**: Com 7 tabelas, o Rotas é o módulo com maior número de entidades interligadas, formando um ecossistema completo de ponta a ponta.

2. **Duas Cadeias de Status**: O módulo gerencia duas cadeias de status paralelas — a rota em si (5 estados) e cada cliente dentro da rota (5 estados), permitindo granularidade durante a execução.

3. **Três Fontes de Clientes**: A base de clientes pode ser populada por:
   - **CSV**: upload de planilha
   - **Cadastros**: importação do módulo de cadastro existente (`fonte = 'cadastros'`)
   - **CRM**: importação do pipeline de CRM (`fonte = 'crm'`)

4. **Geolocalização Abrangente**: Praticamente todas as entidades têm campos de lat/lng, permitindo validação de presença, cálculo de distâncias e renderização em mapas.

5. **Validação de Raio**: A visita registra se o consultor estava dentro do raio permitido configurado (`rotas_config.raio_permitido_metros`), útil para compliance e auditoria.

6. **Reembolso Automático**: Com `valor_km_reembolso` configurado por empresa e `rotas_trajetos.distancia_km`, o sistema calcula automaticamente o reembolso de deslocamento.

7. **RLS Totalmente Aberto**: Diferente dos outros módulos que filtram por `empresa_id`, o Rotas libera todas as operações para qualquer autenticado — o controle é feito exclusivamente via permissões do frontend.

8. **Trigger update_updated_at**: O módulo define a função `update_updated_at_column()` que é reutilizada por vários triggers, mas difere do padrão `hub_update_updated_at()` usado em outros módulos.
