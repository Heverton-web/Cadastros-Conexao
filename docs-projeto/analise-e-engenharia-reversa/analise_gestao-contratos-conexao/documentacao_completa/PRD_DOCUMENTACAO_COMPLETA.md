# Documentação do Projeto: gestao-contratos-conexao

_Engenharia reversa concluída em 2026-06-18_
_Fonte: `proj_reversa/references/appBubble.json`_

---

# Seção 1: Tabelas de Dados (Data Types)

**Total: 26 Data Types** (12 ativos, 14 deletados)

## Entidades Ativas

### user (Usuário do Sistema)

| Campo             | Tipo                      | Descrição                                       |
| ----------------- | ------------------------- | ----------------------------------------------- |
| 01. Nome Completo | text                      | Nome do usuário                                 |
| 02. Whatsapp      | text                      | WhatsApp para contato                           |
| C. Ativo?         | boolean                   | Conta ativa/inativa                             |
| SENHA PADRAO      | text                      | Senha padrão para novos usuários                |
| SUPER ADMIN       | boolean                   | Privilégios de admin                            |
| B. Departamento   | option.tipo_de_credencial | Tipo de credencial (Vendas/Cadastro/Tecnologia) |
| A. Clientes       | list of custom.cliente    | Clientes associados                             |

### cliente (Entidade Central - PF/PJ)

Agrega dados de pessoas físicas e jurídicas, documentos, endereços e status.

### _pf__clientes (Dados PF)

Nome, CPF, CRO, Data Nascimento, celulares, emails.

### clientes (Dados PJ)

Razão Social, CNPJ, CRO, Inscrição Estadual, contatos.

### endere_os

CEP, Rua, Bairro, Cidade, Estado, Número, Complemento.

### documentos

CRO Frente/Verso, CNH Frente/Verso, Endereço, Contrato Social, Declaração, CNH Resp. Técnico.

### evento / evento_vip / evento_apcd / evento_vip1

Inscrições para eventos com nome, CPF, email, WhatsApp, CRO.

### tutoriais

Tutoriais HTML com nome e imagem.

### downloadcredenciais

Log de downloads com data e usuário.

---

# Seção 2: Option Sets

**Total: 20 Option Sets** (15 ativos, 5 deletados)

### Domain: Cadastro

- `tipo_de_cadastro`: PF / PJ
- `status_cadastro`: Link Gerado → Dados Enviados → Em Análise → Em Correção → Aprovado → Reprovado
- `tipo_de_a__o_do_cliente`: Atualizar Cadastro / Solicitar Cadastro
- `tipo_de_endere_o`: Principal / Entrega
- `tipo_de_envio_de_link`: WhatsApp / Email / Copiar Link
- `tempo_expira__o_link`: 1 dia (48h) / 3 dias (96h) / 5 dias (146h) / 7 dias (168h)
- `tipo_de_consulta`: CNPJ / CRO
- `menu_setor_cadastro`: Principal / Consultas / Relatórios

### Domain: Credenciais

- `tipo_de_credencial`: Diretoria, Cadastro, Vendas, Tecnologia
- `tipo_de_usu_rio` (deleted): 12 tipos hierárquicos
- `tipo_de_acesso` (deleted): 8 níveis de permissão

### Domain: Auditoria

- `a__es_de_log`: 9 ações (Gerou Link → Reprovou Cadastro)

### Domain: Contratos (legado)

- `contrato_status`: Criado, Enviado, Pendente, Visualizado, Assinado
- `contrato_tipo_de_assinante`: PF / PJ
- `contrato_a__o_do_assinante`: Visualizado / Assinado

### Domain: Landing Pages

- `tipo_p_gina`: LP Convencional, LP VIP, Dashboard Inscritos (com links dinâmicos)

---

# Seção 3: Páginas

**Total: 19 Páginas**

## Fluxo de Navegação

```
                      ┌─────────────┐
                      │   index     │
                      │   (login)   │
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────────┐
              │              │                  │
       ┌──────▼──────┐ ┌─────▼──────┐  ┌───────▼────────┐
       │  consultor  │ │  cadastro  │  │  super_admin    │
       │  (Vendas)   │ │ (Cadastro) │  │  (Admin)        │
       └─────────────┘ └────────────┘  └───────┬─────────┘
                                               │
                                    ┌──────────┼──────────┐
                                    │          │          │
                              ┌─────▼──┐ ┌────▼───┐ ┌────▼────┐
                              │consultor│ │cadastro│ │credenciais│
                              └────────┘ └────────┘ └──────────┘

  (Páginas Públicas)
  pre_cadastro ← link compartilhado
  lp_evento* → lp_cadastro → lp_obrigado
  linktree
  encurtar_link_evento
```

## Páginas Administrativas

| Página       | Função                                                        |
| ------------ | ------------------------------------------------------------- |
| index        | Login com roteamento por credencial                           |
| consultor    | Dashboard com lista de clientes, geração de links             |
| cadastro     | Revisão, aprovação, correção e reprovação de cadastros        |
| pre_cadastro | Formulário público para coleta de dados + validação por token |
| credenciais  | Gestão de colaboradores                                       |
| super_admin  | Painel admin com CRUD de usuários                             |

## Landing Pages

| Página                  | Função                              |
| ----------------------- | ----------------------------------- |
| lp_evento               | Evento principal (APCD)             |
| lp_evento_vip           | Evento VIP                          |
| lp_evento_es            | Evento Espanha (ES)                 |
| lp_evento_pt            | Evento Portugal (PT)                |
| lp_cadastro             | Formulário de cadastro para eventos |
| lp_evento_lista         | Lista de inscritos com filtros      |
| lp_evento_lista_giselma | Lista específica para Giselma       |

## Utilitárias

| Página               | Função                                                       |
| -------------------- | ------------------------------------------------------------ |
| linktree             | Agregador de links (SAC, Instagram, LinkedIn, YouTube, Site) |
| encurtar_link_evento | Encurtador de URLs para campanhas                            |
| reset_pw             | Redefinição de senha                                         |
| lp_obrigado          | Confirmação pós-cadastro                                     |
| 404                  | Página de erro                                               |
| teste                | Página de testes                                             |

---

# Seção 4: Workflows

**Total: 0 Backend Workflows** (todos são page-level)

## Workflows de Página (destaques)

### Login (index)

```
ButtonClicked → LogOutOtherSessions → LogIn → Search(usuario) → ChangePage
```

Roteia por `tipo_de_credencial`: Vendas→consultor, Cadastro→cadastro, Tecnologia→credenciais, SuperAdmin→super_admin

### Pré-Cadastro (pre_cadastro)

```
ButtonClicked(PF) → NewThing(_pf__clientes + endere_os + documentos) → API → Show success
ButtonClicked(PJ) → NewThing(clientes + endere_os + documentos) → API → Show success
```

Fluxo com validação por token (válido/inválido/expirado/reenviado)

### Cadastro (revisão)

```
ButtonClicked(Aprovar) → ChangeThing → API → SendEmail
ButtonClicked(Corrigir) → SetCustomState → Show popup → ChangeThing → API → SendEmail
```

---

# Seção 5: Notas de Engenharia Reversa

1. **user_types vs data_types**: O Bubble armazena todos os tipos em `user_types`. Não há bloco `data_types` separado.
2. **Campos deletados**: Foram preservados na documentação para rastreabilidade histórica.
3. **Option sets como data types**: Três entradas (`tipo_de_envio_de_link`, `tipo_de_envio_de_link1`, `tipo_de_envio_de_link2`) são option sets registrados como data types — sem campos próprios.
4. **Apelido do projeto**: O `_id` do JSON é `gestao-contratos-conexao` — nome oficial do app no Bubble.
5. **Contratos descontinuados**: O módulo de contratos está deletado mas o schema foi preservado.

---

_Documento gerado automaticamente pelo Bubble Reverse Engineering Squad._
