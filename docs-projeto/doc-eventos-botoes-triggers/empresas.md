# Análise de Eventos, Botões e Triggers — Módulo Empresa

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Empresa** (chave: `empresas-core`) gerencia as empresas no sistema multi-tenant. **Não possui eventos registrados** (`events: []`), mas é o módulo que **hospeda as rotas de configuração** da Central de Ações.

---

## 2. Eventos

**Nenhum evento registrado.** O módulo Empresa é um módulo de infraestrutura — gerencia dados da empresa, branding, permissões, design e configurações dos módulos.

### Abas do Módulo

| Aba | Descrição | Rota |
|---|---|---|
| Banco de Dados | Configurações de banco | `/empresa/banco` |
| Dados da Empresa | Perfil e informações | `/empresa` |
| Permissões | Credenciais e permissões | `/empresa/permissoes` |
| Design | Tema visual (cores, fontes) | `/empresa/design` |
| Branding | Marca (logo, favicon) | `/empresa/branding` |

### Nav Items de Configuração

O módulo registra **23 nav items**, muitos deles para design/config de outros módulos:

| Nav Item | Rota |
|---|---|
| Empresa (dados) | `/empresa` |
| Banco de Dados | `/empresa/banco` |
| Permissões | `/empresa/permissoes` |
| Design | `/empresa/design` |
| Branding | `/empresa/branding` |
| Central de Ações | `/empresa/acoes` |
| Despesas Config | `/empresa/despesas-config` |
| Rotas Config | `/empresa/rotas/config` |
| NPS Tema | `/empresa/nps/tema` |
| NPS Design | `/empresa/nps/design` |
| LinkTree Tema | `/empresa/linktree/tema` |
| LinkTree Design | `/empresa/linktree/design` |
| Hub Chatbot | `/empresa/hub/chatbot` |
| Hub Design | `/empresa/hub/design` |
| Mapas Design | `/empresa/mapas/design` |
| Funis Design | `/empresa/funis/design` |
| CRM Design | `/empresa/crm/design` |
| Cadastros Design | `/empresa/cadastros/design` |
| Despesas Design | `/empresa/despesas/design` |
| Rotas Design | `/empresa/rotas/design` |

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total — `/global/acoes` e `/global/empresas` |
| Admin de Empresa | `/empresa/acoes` — configura webhooks/notificações da sua empresa |
| Consultor | Sem acesso |
| TI | Sem acesso direto |

---

## 4. Onde Configurar

- **Rota principal**: `/empresa/acoes` (admin empresa) ou `/global/acoes` (super admin)
- **Seletor de Módulo**: "Empresa" no dropdown da Central de Ações

---

## 5. Observações

- O módulo Empresa **não gera eventos de domínio**, mas agrega a UI de configuração de eventos de todos os outros módulos
- A Central de Ações em `/empresa/acoes` é o ponto central de configuração
- O módulo serve como hub de configuração cross-módulo
- Todas as permissões são públicas (`permissionCheck: () => true`) — qualquer usuário logado vê os nav items
