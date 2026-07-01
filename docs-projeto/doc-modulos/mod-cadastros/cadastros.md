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
| `/cadastros/dashboard` | Dashboard | Resumo de cadastros por status | `ver_todos_cadastros` |
| `/cadastros/solicitacoes` | Clientes | Lista de solicitacoes de cadastros da empresa | `ver_todos_cadastros` ou `gerar_links` |
| `/cadastros/solicitacoes/$id` | ClienteDetalhe | Análise e aprovação de cadastro | `ver_todos_cadastros` |
| `/cadastros/clientes` | Clientes | Lista de clientes com cadastros aprovados | `ver_todos_cadastros` ou `gerar_links` |
| `/cadastros/consultor` | Consultor | Gerar e gerenciar links de cadastro | `gerar_links` |
| `/cadastros/consultor/clientes` | ConsultorClientes | Lista de clientes do consultor com cadastros aprovados | `gerar_links` |
| `/cadastros/relatorios` | Relatorios | Relatórios consolidados | `ver_relatorios` |
| `/pre-cadastro/$token` | PreCadastro | Formulário público preenchido pelo lead | Público (token) |
| `/empresa/cadastros/design` | ModuloDesignPage | Configuração de design do módulo | `gerenciar_config` |

---

## 4. Permissões

| Chave | Label | Descrição | Grupo |
|-------|-------|-----------|-------|
| `ver_todos_cadastros` | Ver todos os cadastros da empresa | Permite visualizar todos os cadastros do sistema | Escopo de Dados |
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
| `excluir_cadastro` | Excluir cadastro | Permite excluir cadastros permanentemente | Administração |
| `gerar_links` | Gerar links de cadastro | Permite gerar links de cadastro para leads | Geração de Links |

> **Nota:** As permissões `gerenciar_credenciais`, `gerenciar_credenciais_admin` e `gerenciar_config` foram removidas deste módulo. Funcionalidade migrada para `/empresa/permissoes` e `/empresa/acoes`.

---

## 5. Defaults por Papel

Defaults configurados em `module.ts → registerPermissionDefaults()`. Valores iniciais aplicados automaticamente na criação de credenciais. O admin pode ajustar individualmente após a criação.

---

## 6. Navegação (Sidebar)

| Label | Rota | Ícone | Permissão | Ordem |
|-------|------|-------|-----------|-------|
| Dashboard | `/dashboard` | LayoutDashboard | `ver_todos_cadastros` | 1 |
| Clientes | `/clientes` | Users | `ver_todos_cadastros` ou `gerar_links` | 2 |
| Consultor | `/consultor` | UserCircle | `gerar_links` | 3 |
| Relatorios | `/relatorios` | BarChart3 | `ver_relatorios` | 4 |

---

## 7. Eventos / Webhooks

| Chave | Label | Descrição | Tipo |
|-------|-------|-----------|------|
| `cadastro.criado` | Cadastro Criado | Dispara quando um novo cadastro é criado | `status_change` |
| `cadastro.dados_enviados` | Cadastro Dados Enviados | Dispara quando um cadastro é enviado | `status_change` |
| `cadastro.aprovado` | Cadastro Aprovado | Dispara quando um cadastro é aprovado | `status_change` |
| `cadastro.reprovado` | Cadastro Reprovado | Dispara quando um cadastro é reprovado | `status_change` |
| `cadastro.solicitacao_correcao` | Cadastro Solicitacao Correcao | Dispara quando um cadastro é solicitado correção | `status_change` |
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

### RPCs Utilizadas

| RPC | Uso |
|-----|-----|
| `limpar_links_expirados` | Remove links com prazo de validade expirado |
| `update_cadastro_from_precadastro` | Atualiza cadastro a partir do preenchimento público |

---

## 10. Notas

- Fluxo de status segue ordem linear: `link_gerado → dados_enviados → em_analise → aprovado/reprovado/em_correcao`
- Ao solicitar correção, um novo token é gerado com expiração de 24h
- A tabela `cadastros` é a única camada de conexão entre os sub-módulos (clientes, consultor, relatorios)
- Multi-tenant: toda query filtra por `empresa_id` via RLS
- Permissão `excluir_cadastro` está desativada por padrão em todos os ambientes
