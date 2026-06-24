# Tabelas de Dados (Data Types)

**Projeto:** gestao-contratos-conexao
**Total de Data Types:** 26
**Ativos:** 12 | **Deletados:** 14
**Data Types que são Option Sets (vazios):** 3 (tipo_de_envio_de_link, tipo_de_envio_de_link1, tipo_de_envio_de_link2)

---

## Resumo da Arquitetura de Dados

### Tipo Central: `cliente`
O Data Type `cliente` é a entidade central do sistema. Ele agrega:
- **PF:** `_pf__clientes` (1:1)
- **PJ:** `clientes` (1:1)
- **Endereço:** `endere_os` (1:n)
- **Documentos:** `documentos` (1:1)
- **Log:** `log` (1:n)
- **Consultas:** `consultas_cnpj`, `consultas_cnpj1` (deleted)

### Hierarquia de Cliente
```
cliente (master)
├── _pf__clientes (PF - dados cadastrais)
│   └── tipo_de_cadastro (option)
├── clientes (PJ - dados cadastrais)
│   └── tipo_de_cadastro (option)
├── endere_os (endereço)
│   └── tipo_de_endere_o (option)
├── documentos (PDFs, imagens)
├── log (auditoria)
│   └── log_detalhes
├── consultas_cnpj (deleted)
└── consultas_cnpj1 (deleted)
```

### Fluxo de Cadastro
1. Consultor gera link → cliente acessa
2. Cliente preenche `pre_cadastro` (PF via `_pf__clientes` ou PJ via `clientes`)
3. Token de verificação enviado por email
4. Admin revisa em `cadastro` → aprova/corrige/reprova
5. Status tracking via `status_cadastro` (option set)

### Entidades de Evento
- `evento` — Inscrições landing pages (ativo)
- `evento_vip` — Inscrições VIP (deleted, mesmo schema de evento)
- `evento_apcd` — Inscrições APCD (deleted)
- `evento_vip1` — Inscrições VIP1 (deleted)

### Entidades de Contrato (legado)
- `contratos` (deleted)
- `contratos_dados_gerais` (deleted)
- `contratos_assinantes` (deleted)

### Outros
- `user` / `user1` — Usuários do sistema
- `tutoriais` — Tutoriais HTML
- `downloadcredenciais` — Log de downloads
- `buscas_cro` (deleted)
- `templates` / `pastas` (deleted)

---

## log
**Slug:** log | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| A. Quem realizou | text | |
| B. O que realizou | text | |
| C. Quando Realizou | text | |
| D. CLIENTE | custom.cliente | → cliente |
| A. LOG Detalhes | custom.log_detalhes | → log_detalhes |

## user
**Slug:** user | **Deleted:** não

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Nome Completo | text | |
| 02. Whatsapp | text | |
| C. Ativo? | boolean | |
| SENHA PADRAO | text | |
| SUPER ADMIN | boolean | |
| B. Departamento | option.tipo_de_credencial | → option set |
| A. Clientes | list of custom.cliente | → cliente |

## user1
**Slug:** user1 | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Nome Completo | text | |
| E. Ativo? | boolean | |
| B. Departamento | option.tipo_de_credencial | → option set |
| C. Funcao | option.tipo_de_usu_rio | → option set |
| D. Tipo de Acesso | option.tipo_de_acesso | → option set |
| A. Clientes | list of custom.cliente | → cliente |

## evento
**Slug:** evento | **Deleted:** não

| Campo | Tipo |
|-------|------|
| nome | text |
| cpf | text |
| email | text |
| whatsapp | text |
| cro | text |
| cidade | text |
| estado | text |
| tag | text |
| valor | number |
| confirmado | boolean |
| numero_sorteio | text |
| convidado_por | text |

## pastas
**Slug:** pastas | **Deleted:** sim

| Campo | Tipo |
|-------|------|
| 01. Nome | text |
| A. Template | list of text |

## cliente
**Slug:** cliente | **Deleted:** não

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Dados Cadastrais - PF | custom._pf__clientes | → _pf__clientes |
| 02. Dados Cadastrais - PJ | custom.clientes | → clientes |
| 03. Dados de Endereco | custom.endere_os | → endere_os |
| 04. Documentacao | custom.documentos | → documentos |
| A. Codigo Cliente | text | |
| B. Link de Acesso | text | |
| C. Colaborador | user | → user |
| D. Status Cadastro | option.status_cadastro | → option set |
| E. Nome Temporario | text | |
| F. Forma de Compartilhamento | option.tipo_de_envio_de_link | → option set |
| G. Tipo de Cadastro | option.tipo_de_cadastro | → option set |
| H. Revisado? | boolean | |
| I. Comentario Reprovacao | text | |
| J. Tipo de Acao | option.tipo_de_a__o_do_cliente | → option set |
| L. Codigo Cliente | text | |
| M. Data de criacao do link | date | |
| N. Data de finalizacao | date | |
| O. Data da consulta | text | |
| P. Consulta CNPJ realizada? | boolean | |
| Q. Consulta CRO realizada? | boolean | |
| R. Status verificacao token | boolean | |
| S. Token gerado | text | |
| AA. link_expira_em | date | |
| AB. token_expira_em | date | |
| celular_temp | text | |
| nome_cliente | text | |
| temp - email token | text | |

## clientes (PJ)
**Slug:** clientes | **Deleted:** não

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Razao Social | text | |
| 01b. Nome Fantasia | text | |
| 02. Numero do CRO | text | |
| 02b. UF CRO | text | |
| 02c. Data emissao CRO / TPD | date | |
| 03. Numero de CPF | text | |
| 04. Numero de CNPJ | text | |
| 04b. Inscricao Estatual | text | |
| 04c. Data consulta | date | |
| 05. Telefone Fixo | text | |
| 06a. Celular 01 | text | |
| 06b. Celular 02 | text | |
| 07a. E-mail de Comunicacao | text | |
| 07b. E-mail de NF | text | |
| A. Tipo de Cadastro | option.tipo_de_cadastro | → option set |
| B. Cliente | custom.cliente | → cliente |

## contratos
**Slug:** contratos | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Titulo do Contrato | text | |
| 03. PDF | file | |
| descricao | text | |
| teste | text | |
| A. Dados Gerais | custom.contratos_dados_gerais | → contratos_dados_gerais |
| B. Assinantes | list of custom.contratos_assinantes | → contratos_assinantes |

## endere_os
**Slug:** endere_os | **Deleted:** não

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| CEP | text | |
| RUA | text | |
| BAIRRO | text | |
| CIDADE | text | |
| ESTADO | text | |
| NUMERO | text | |
| COMPLEMENTO | text | |
| A. Cliente | custom.cliente | → cliente |
| B. Tipo de Endereco | option.tipo_de_endere_o | → option set |

## templates
**Slug:** templates | **Deleted:** sim

| Campo | Tipo |
|-------|------|
| 01. Nome | text |
| 02. Conteudo | text |
| A. Pasta | text |

## tutoriais
**Slug:** tutoriais | **Deleted:** não

| Campo | Tipo |
|-------|------|
| nome | text |
| html | file |
| imagem | text |

## buscas_cro
**Slug:** buscas_cro | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Quem consultou | user | → user |
| 02. Quando consultou | date | |
| 03. Quanto custou | number | |

## documentos
**Slug:** documentos | **Deleted:** não

| Campo | Tipo |
|-------|------|
| 01a. CRO - FRENTE | file |
| 01b. CRO - VERSO | file |
| 02a. CNH - FRENTE | file |
| 02b. CNH - VERSO | file |
| 03. Endereco | file |
| 04. Contrato Social - PDF | file |
| 05. Declaracao - PDF | file |
| 06a. CNH Responsavel Tecnico - FRENTE | file |
| 06b. CNH Responsavel Tecnico - VERSO | file |
| A. Cliente | custom.cliente → cliente |

## evento_vip
**Slug:** evento_vip | **Deleted:** sim

| Campo | Tipo |
|-------|------|
| nome, cpf, email, whatsapp, cro, cidade, estado, tag, valor, confirmado, numero_sorteio, convidado_por | text/number/boolean |

## evento_apcd
**Slug:** evento_apcd | **Deleted:** sim

| Campo | Tipo |
|-------|------|
| apcd_nome, apcd_cpf, apcd_cro, apcd_tag, apcd_cidade, apcd_estado, apcd_whatsapp | text |

## evento_vip1
**Slug:** evento_vip1 | **Deleted:** sim
(Mesma estrutura de evento_apcd)

## log_detalhes
**Slug:** log_detalhes | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Local | text | |
| 02. Tipo de dispositivo | text | |
| 03. Tipo de navegador | text | |
| 04. Sistema operacional | text | |
| 05. Fingerprint Dispositivo | text | |
| A. LOG | custom.log | → log |

## _pf__clientes (PF)
**Slug:** _pf__clientes | **Deleted:** não

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Nome completo | text | |
| 01b. Data de Nascimento | date | |
| 02. Numero do CRO | text | |
| 02b. UF CRO | text | |
| 02c. Data emissao CRO / TPD | date | |
| 03. Numero de CPF | text | |
| 04. Telefone Fixo | text | |
| 05a. Celular 01 | text | |
| 05b. Celular 02 | text | |
| 06a. E-mail de Comunicacao | text | |
| 06b. E-mail de NF | text | |
| A. Tipo de Cadastro | option.tipo_de_cadastro | → option set |
| B. Cliente | custom.cliente | → cliente |

## consultas_cnpj
**Slug:** consultas_cnpj | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Data consulta | date | |
| 02. PDF Consulta | file | |
| A. Cliente | custom.cliente | → cliente |

## consultas_cnpj1
**Slug:** consultas_cnpj1 | **Deleted:** sim
(Mesma estrutura de consultas_cnpj)

## downloadcredenciais
**Slug:** downloadcredenciais | **Deleted:** não

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| data | text | |
| usuario | user | → user |

## contratos_assinantes
**Slug:** contratos_assinantes | **Deleted:** sim

| Campo | Tipo | Relacionamento |
|-------|------|----------------|
| 01. Tipo de Assinante | option.contrato_tipo_de_assinante | → option set |
| 02. Nome do Assinante | text | |
| 03. Razao Social do Assinante | text | |
| 04. CPF do assinante | text | |
| 05. CNPJ do assinante | text | |
| 06. Email Comunicacao | text | |
| 07. Whatsapp Comunicacao | text | |
| A. Contrato | text | |

## contratos_dados_gerais
**Slug:** contratos_dados_gerais | **Deleted:** sim

| Campo | Tipo |
|-------|------|
| 01. Nome do Contrato | text (deleted) |
| 02. Data de Inicio | date |
| 03. Data de Termino | date |
| A. Contrato | text |

## tipo_de_envio_de_link / tipo_de_envio_de_link1 / tipo_de_envio_de_link2
**Deleted:** sim
*Option sets registrados como data types — sem campos próprios.*
