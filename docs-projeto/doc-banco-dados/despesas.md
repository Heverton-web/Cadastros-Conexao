# Análise do Banco de Dados — Módulo Despesas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tabelas do Módulo](#2-tabelas-do-módulo)
3. [Fluxo Completo de Despesas](#3-fluxo-completo-de-despesas)
4. [Ciclo de Períodos](#4-ciclo-de-períodos)
5. [RLS Policies](#5-rls-policies)
6. [Permissões do Módulo](#6-permissões-do-módulo)
7. [Rotas do Frontend](#7-rotas-do-frontend)
8. [Migrações Relacionadas](#8-migrações-relacionadas)
9. [Diagrama de Relacionamentos](#9-diagrama-de-relacionamentos)

---

## 1. Visão Geral

O módulo **Despesas** (oficialmente "Despesas em Rota") gerencia o ciclo completo de **lançamento, aprovação e pagamento de despesas** de consultores em rota no ERP Conexão. Ele permite que consultores lancem despesas com comprovantes, enviem lotes para aprovação, e que gestores/aprovadores acompanhem e aprovem/reprovem.

**Características da Arquitetura:**

- **6 tabelas** formando um pipeline completo (tipos → config → períodos → despesas → envios → pagamentos)
- **3 papéis**: Colaborador (lança), Aprovador (aprova/reprova), Financeiro (define pagamento)
- **Períodos de fechamento**: semanal, quinzenal ou mensal (configurável por empresa)
- **Tipos de despesa**: categorias com valor máximo configurável por empresa
- **Comprovantes**: suporte a upload ou link externo
- **Reembolso**: acompanhamento de pagamento por PIX, transferência ou dinheiro
- **Cadeia de status**: cada entidade tem seu próprio ciclo de estados

---

## 2. Tabelas do Módulo

### 2.1 `despesas_tipos` — Tipos de Despesa

Catálogo de categorias de despesa disponíveis para lançamento, configurável por empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `nome` | `text NOT NULL` | Nome do tipo (ex: "Combustível", "Pedágio") |
| `valor_maximo` | `decimal(10,2) NOT NULL` | Valor máximo permitido para reembolso |
| `ativo` | `boolean NOT NULL DEFAULT true` | Se está ativo para lançamento |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Constraints:** `UNIQUE(empresa_id, nome)` — nome único por empresa

**Índice:** `despesas_tipos_empresa_idx`

---

### 2.2 `despesas_config` — Configuração por Empresa

Singleton por empresa — define a frequência de fechamento de períodos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE UNIQUE` | Empresa (um por empresa) |
| `frequencia` | `text NOT NULL` | `'semanal'`, `'quinzenal'` ou `'mensal'` |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índice:** `despesas_config_empresa_idx`

---

### 2.3 `despesas_periodos` — Períodos de Fechamento

Períodos contábeis para agrupamento e fechamento de despesas.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `data_inicio` | `date NOT NULL` | Data de início do período |
| `data_fim` | `date NOT NULL` | Data de fim do período |
| `status` | `text NOT NULL` | Status: `'aberto'` ou `'fechado'` |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Constraints:** `UNIQUE(empresa_id, data_inicio, data_fim)` — períodos únicos no tempo

**Índices:** `empresa_id`, `(empresa_id, status)`

---

### 2.4 `despesas` — Despesas Individuais

Cada despesa lançada por um colaborador. É o coração do módulo.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `usuario_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Consultor que lançou |
| `periodo_id` | `uuid FK → despesas_periodos.id ON DELETE CASCADE` | Período de referência |
| `tipo_id` | `uuid FK → despesas_tipos.id ON DELETE RESTRICT` | Tipo de despesa |
| `data_despesa` | `date NOT NULL` | Data da despesa |
| `valor` | `decimal(10,2) NOT NULL CHECK (> 0)` | Valor (positivo obrigatório) |
| `descricao` | `text` | Descrição da despesa |
| `comprovante_url` | `text` | URL do comprovante (upload ou link) |
| `comprovante_tipo` | `text` | Tipo: `'upload'` ou `'link'` |
| `status` | `text NOT NULL` | Status: `'rascunho'`, `'pendente'`, `'aprovada'`, `'reprovada'`, `'paga'` |
| `comentario_reprovacao` | `text` | Motivo da reprovação |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índices:** `empresa_id`, `usuario_id`, `(empresa_id, usuario_id)`

---

### 2.5 `despesas_envios` — Envios para Aprovação

Lotes de despesas enviados por um colaborador para aprovação. Agrupa várias despesas de um período.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `usuario_id` | `uuid FK → auth.users.id ON DELETE CASCADE` | Colaborador que enviou |
| `periodo_id` | `uuid FK → despesas_periodos.id ON DELETE CASCADE` | Período |
| `total_despesas` | `int NOT NULL` | Quantidade de despesas no lote |
| `valor_total` | `decimal(10,2) NOT NULL` | Valor total do lote |
| `status` | `text NOT NULL` | Status: `'pendente'`, `'aprovado'`, `'reprovado'`, `'parcial'` |
| `aprovador_id` | `uuid FK → auth.users.id` | Quem aprovou/reprovou |
| `data_aprovacao` | `timestamptz` | Data da aprovação |
| `comentario` | `text` | Comentário do aprovador |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Constraints:** `UNIQUE(empresa_id, usuario_id, periodo_id)` — um envio por colaborador/período

**Índices:** `empresa_id`, `(empresa_id, status)`

---

### 2.6 `despesas_pagamentos` — Pagamentos

Registro de pagamento/reembolso de um envio aprovado.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `empresa_id` | `uuid FK → empresas.id ON DELETE CASCADE` | Empresa |
| `envio_id` | `uuid FK → despesas_envios.id ON DELETE CASCADE` | Envio aprovado |
| `valor` | `decimal(10,2) NOT NULL` | Valor pago |
| `forma_pagamento` | `text NOT NULL` | Forma: `'pix'`, `'transferencia'`, `'dinheiro'` |
| `data_pagamento` | `date NOT NULL` | Data do pagamento |
| `status` | `text NOT NULL` | Status: `'pendente'`, `'pago'`, `'cancelado'` |
| `comprovante_pagamento` | `text` | Comprovante do pagamento |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |

**Índice:** `despesas_pagamentos_empresa_idx`

---

## 3. Fluxo Completo de Despesas

### Cadeia de Status

```
DESPESA (individual):
  rascunho → pendente → aprovada → paga
                │
                └── reprovada

ENVIO (lote):
  pendente → aprovado → (pagamento)
       │         │
       │         └── parcial
       │
       └── reprovado

PAGAMENTO:
  pendente → pago
       │
       └── cancelado
```

### Fluxo de Ponta a Ponta

```
1. CONFIGURAÇÃO (Admin)
   ├── Define tipos de despesa com valor máximo
   ├── Define frequência (semanal/quinzenal/mensal)
   └── Gera períodos automaticamente

2. LANÇAMENTO (Colaborador)
   ├── Seleciona tipo, data, valor, descrição
   ├── Anexa comprovante (upload ou link)
   └── Salva como rascunho ou já como pendente

3. ENVIO (Colaborador)
   ├── Seleciona período fechado
   ├── Revisa todas as despesas do período
   └── Envia lote para aprovação

4. APROVAÇÃO (Aprovador/Gestor)
   ├── Visualiza despesas do lote
   ├── Pode aprovar total, reprovar ou aprovação parcial
   └── Comentário opcional

5. PAGAMENTO (Financeiro)
   ├── Define forma de pagamento (PIX/transferência/dinheiro)
   ├── Registra data do pagamento
   └── Anexa comprovante de pagamento
```

---

## 4. Ciclo de Períodos

Os períodos seguem a frequência configurada em `despesas_config.frequencia`:

| Frequência | Ciclo |
|---|---|
| `semanal` | Segunda a Domingo |
| `quinzenal` | Dias 1-15 e 16-28/29/30/31 |
| `mensal` | Dia 1 ao último dia do mês |

Cada período tem:
- **Status `aberto`**: colaboradores podem lançar e editar despesas
- **Status `fechado`**: não permite novos lançamentos, mas permite envio para aprovação

---

## 5. RLS Policies

### Estrutura Geral

Todas as **6 tabelas** seguem o mesmo padrão — RLS liberado para qualquer autenticado, **sem filtro por `empresa_id`**:

| Operação | Policy | Descrição |
|---|---|---|
| `SELECT` | `*_select_auth` | Qualquer autenticado (`USING (true)`) |
| `INSERT` | `*_insert_auth` | Qualquer autenticado (`WITH CHECK (true)`) |
| `UPDATE` | `*_update_auth` | Qualquer autenticado |
| `DELETE` | `*_delete_auth` | Qualquer autenticado |

> **Exceção:** `despesas_config` não tem policy de DELETE definida (singleton).

> **Observação:** Assim como Rotas e Mapas, o controle de acesso é delegado às permissões do frontend. Apenas usuários autenticados podem acessar (sem acesso anônimo).

---

## 6. Permissões do Módulo

Definidas em `src/features/despesas/permissions.ts`.

### Lista de Permissões

| Chave | Label | Grupo |
|---|---|---|
| `despesas_lancar` | Lançar despesas | Despesas |
| `despesas_enviar` | Enviar despesas | Despesas |
| `despesas_aprovar` | Aprovar despesas | Aprovação |
| `despesas_reprovar` | Reprovar despesas | Aprovação |
| `despesas_definir_pagamento` | Definir pagamento | Pagamento |
| `despesas_configurar` | Configurar despesas | Administração |
| `despesas_ver_relatorios` | Ver relatórios | Visualização |
| `despesas_ver_todas` | Ver todas as despesas | Visualização |

### Defaults por Ambiente

| Ambiente | Lançar | Enviar | Aprovar | Reprovar | Pagamento | Configurar | Relatórios | Ver Todas |
|---|---|---|---|---|---|---|---|---|
| `cadastro` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `consultor` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tecnologia` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `suporte` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 7. Rotas do Frontend

### Páginas do Módulo (7 rotas)

| Rota | Arquivo | Descrição |
|---|---|---|
| `/despesas` | `src/routes/despesas.tsx` | Minhas despesas (lançamento) |
| `/despesas/aprovacao` | `src/routes/despesas.aprovacao.tsx` | Aprovação de despesas |
| `/despesas/meus-relatorios` | `src/routes/despesas.meus-relatorios.tsx` | Meus relatórios/envios |
| `/despesas/relatorios` | `src/routes/despesas.relatorios.tsx` | Relatórios gerenciais |
| `/despesas/design` | `src/routes/despesas.design.tsx` | Design config |
| `/empresa/despesas-config` | `src/routes/empresa.despesas-config.tsx` | Configuração (tipos, períodos) |
| `/empresa/despesas-design` | `src/routes/empresa.despesas-design.tsx` | Design por empresa |

### Estrutura de Componentes (34 arquivos)

```
src/features/despesas/
├── components/
│   ├── admin/
│   │   ├── ConfigDespesasPage.tsx       — Página de configuração admin
│   │   ├── ConfigForm.tsx               — Formulário de config
│   │   ├── GerarPeriodosModal.tsx       — Modal de geração de períodos
│   │   ├── PeriodosTable.tsx            — Tabela de períodos
│   │   ├── RelatoriosDespesasPage.tsx   — Relatórios gerenciais
│   │   ├── TipoDespesaForm.tsx          — Formulário de tipo de despesa
│   │   └── TiposDespesaTable.tsx        — Tabela de tipos
│   ├── colaborador/
│   │   ├── EnviarDespesasModal.tsx      — Modal de envio para aprovação
│   │   ├── MeusRelatoriosPage.tsx       — Meus relatórios
│   │   ├── MinhasDespesasPage.tsx       — Minhas despesas
│   │   └── NovaDespesaModal.tsx         — Modal de nova despesa
│   ├── responsavel/
│   │   └── AprovacaoDespesasPage.tsx    — Página de aprovação
│   └── shared/
│       ├── ComprovanteViewer.tsx        — Visualizador de comprovante
│       ├── EmpresaSuperAdminSelector.tsx— Seletor de empresa
│       └── StatusBadge.tsx              — Badge de status
├── hooks/
│   ├── useDespesas.ts
│   ├── useDespesasConfig.ts
│   ├── useEmpresaSuperAdmin.ts
│   ├── useEnvios.ts
│   ├── usePagamento.ts
│   ├── usePeriodoAtual.ts
│   ├── usePeriodos.ts
│   ├── usePrazoEnvio.ts
│   └── useTiposDespesa.ts
├── services/
│   ├── config.service.ts
│   ├── despesas.service.ts
│   ├── envios.service.ts
│   ├── pagamentos.service.ts
│   ├── periodos.service.ts
│   └── tipos.service.ts
├── module.ts
├── permissions.ts
└── types.ts
```

---

## 8. Migrações Relacionadas

| Migration | Data | Descrição |
|---|---|---|
| `20260629130000_despesas_module.sql` | 29/06/2026 | **CORE**: 6 tabelas (`despesas_tipos`, `despesas_config`, `despesas_periodos`, `despesas`, `despesas_envios`, `despesas_pagamentos`), RLS, índices, triggers |

---

## 9. Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              empresas                                         │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:1 (singleton)
┌──▼──────────────────────────────────────┐
│          despesas_config                  │
│  frequencia (semanal/quinzenal/mensal)   │
└──────────────────────────────────────────┘

   │ 1:N
┌──▼──────────────────────────────────────┐
│          despesas_tipos                   │
│  nome │ valor_maximo │ ativo             │
│  UNIQUE(empresa_id, nome)                │
└──┬───────────────────────────────────────┘
   │
   │ 1:N
┌──▼──────────────────────────────────────┐
│          despesas_periodos                │
│  data_inicio │ data_fim │ status         │
│  (aberto/fechado)                        │
│  UNIQUE(empresa_id, data_inicio, data_fim)│
└──┬───────────────────────────────────────┘
   │
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                      despesas  [ENTIDADE CENTRAL]                            │
│  usuario_id │ periodo_id │ tipo_id                                          │
│  data_despesa │ valor │ descricao                                           │
│  comprovante_url │ comprovante_tipo (upload/link)                           │
│  status (rascunho/pendente/aprovada/reprovada/paga)                         │
│  comentario_reprovacao                                                      │
└──────────────────────────────────────────────────────────────────────────────┘

   │ N:1 (agrupado em)
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                      despesas_envios   [LOTE]                                │
│  usuario_id │ periodo_id                                                     │
│  total_despesas │ valor_total                                                │
│  status (pendente/aprovado/reprovado/parcial)                                │
│  aprovador_id │ data_aprovacao │ comentario                                  │
│  UNIQUE(empresa_id, usuario_id, periodo_id)                                  │
└──┬───────────────────────────────────────────────────────────────────────────┘
   │ 1:N
┌──▼──────────────────────────────────────────────────────────────────────────┐
│                    despesas_pagamentos   [FINANCEIRO]                         │
│  envio_id │ valor │ forma_pagamento (pix/transferencia/dinheiro)             │
│  data_pagamento │ status (pendente/pago/cancelado)                           │
│  comprovante_pagamento                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Finais

1. **Pipeline Completo**: O módulo Despesas implementa um pipeline de 3 estágios com papéis bem definidos:
   - **Colaborador**: lança despesas e envia lotes
   - **Aprovador/Gestor**: aprova ou reprova lotes
   - **Financeiro**: realiza pagamentos

2. **Períodos de Fechamento**: Diferente de outros módulos que trabalham com datas avulsas, o Despesas utiliza períodos contábeis (semanal/quinzenal/mensal) que organizam o fluxo de trabalho.

3. **Restrição ON DELETE RESTRICT**: A FK `tipo_id` em `despesas` usa `ON DELETE RESTRICT`, impedindo a exclusão de um tipo de despesa enquanto houver despesas vinculadas (diferente do padrão CASCADE usado nos demais módulos).

4. **Envios como Lote**: As despesas são enviadas em lotes (`despesas_envios`), não individualmente. Um envio agrupa todas as despesas de um colaborador em um período. O status `parcial` permite aprovação parcial do lote.

5. **Comprovantes Flexíveis**: Suporta dois tipos de comprovante — `upload` (arquivo enviado para storage) ou `link` (URL externa, ex: Google Drive).

6. **Tipos de Despesa por Empresa**: Cada empresa tem seu próprio catálogo de tipos de despesa com valor máximo, permitindo políticas de reembolso personalizadas.

7. **RLS Totalmente Aberto**: Assim como Rotas, o RLS não filtra por `empresa_id` — todo autenticado vê tudo. O controle é feito via permissões do frontend.

8. **Sem DML Público**: Diferente de NPS e Mapas, nenhuma tabela do módulo Despesas permite acesso anônimo — apenas `authenticated`.
