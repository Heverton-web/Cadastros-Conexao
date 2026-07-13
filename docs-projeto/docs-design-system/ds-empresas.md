# Design System - Módulo Empresa

> Módulo: `empresas-core` | Versão: 1.0.0

## Sumário

1. [Visão Geral](#visão-geral)
2. [Rotas](#rotas)
3. [Abas](#abas)
4. [Nav Items](#nav-items)
5. [Design System Específico](#design-system-específico)

---

## Visão Geral

O módulo **Empresa** é responsável pelo gerenciamento de empresas, configurações globais e design system.

**Chave:** `empresas-core`
**Ícone:** `Building2`
**Descrição:** Gerenciamento de empresas

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/global/empresas` | Lista de empresas |
| `/empresa` | Dados da empresa |
| `/empresa/design` | Design da empresa |
| `/empresa/despesas-config` | Configuração de despesas |
| `/empresa/rotas/config` | Configuração de rotas |
| `/empresa/nps/tema` | Tema do NPS |
| `/empresa/nps/design` | Design do NPS |
| `/empresa/linktree/tema` | Tema do Linktree |
| `/empresa/linktree/design` | Design do Linktree |
| `/empresa/hub/chatbot` | Chatbot do Hub |
| `/empresa/hub/design` | Design do Hub |
| `/empresa/mapas/design` | Design dos Mapas |
| `/empresa/funis/design` | Design dos Funis |
| `/empresa/crm/design` | Design do CRM |
| `/empresa/cadastros/design` | Design dos Cadastros |
| `/empresa/cadastros/formulario` | Formulário dos Cadastros |
| `/empresa/despesas/design` | Design das Despesas |
| `/empresa/rotas/design` | Design das Rotas |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `empresa-banco` | Banco de Dados |
| `empresa-dados` | Dados da Empresa |
| `empresa-permissoes` | Permissões |
| `empresa-design` | Design |
| `empresa-branding` | Branding |
| `formularios` | Formulários |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `empresa-banco` | Banco de Dados | Database | `/empresa/banco` | 10 |
| `empresa-dados` | Dados da Empresa | Building2 | `/empresa` | 20 |
| `empresa-permissoes` | Permissões | Shield | `/empresa/permissoes` | 30 |
| `empresa-design` | Design | Palette | `/empresa/design` | 40 |
| `empresa-branding` | Branding | Image | `/empresa/branding` | 50 |
| `empresa-acoes` | Central de Ações | Webhook | `/empresa/acoes` | 60 |
| `empresa-despesas-config` | Despesas | Receipt | `/empresa/despesas-config` | 70 |
| `empresa-rotas-config` | Config. Rotas | Settings | `/empresa/rotas/config` | 80 |
| `empresa-nps-tema` | NPS Tema | Paintbrush | `/empresa/nps/tema` | 81 |
| `empresa-nps-design` | NPS Design | Palette | `/empresa/nps/design` | 82 |
| `empresa-linktree-tema` | Linktree Tema | Paintbrush | `/empresa/linktree/tema` | 83 |
| `empresa-linktree-design` | Linktree Design | Palette | `/empresa/linktree/design` | 84 |
| `empresa-hub-chatbot` | Hub Chatbot | Bot | `/empresa/hub/chatbot` | 85 |
| `empresa-hub-design` | Hub Design | Palette | `/empresa/hub/design` | 86 |
| `empresa-mapas-design` | Mapas Design | Palette | `/empresa/mapas/design` | 87 |
| `empresa-funis-design` | Funis Design | Palette | `/empresa/funis/design` | 88 |
| `empresa-crm-design` | CRM Design | Palette | `/empresa/crm/design` | 89 |
| `empresa-cadastros-design` | Cadastros Design | Palette | `/empresa/cadastros/design` | 90 |
| `empresa-despesas-design` | Despesas Design | Palette | `/empresa/despesas/design` | 91 |
| `empresa-rotas-design` | Rotas Design | Palette | `/empresa/rotas/design` | 92 |
| `empresa-cadastros-formulario` | Cadastros Form | FormInput | `/empresa/cadastros/formulario` | 93 |

---

## Design System Específico

### Configurações de Design

O módulo Empresa é o responsável por gerenciar o design system global do ERP. Ele permite configurar:

- **Cores** - Paleta de cores principal
- **Fontes** - Tipografia
- **Branding** - Logo e Favicon
- **Temas** - Configurações de tema por módulo

### Rotas de Design por Módulo

| Módulo | Rota de Design |
|--------|----------------|
| Cadastros | `/empresa/cadastros/design` |
| CRM | `/empresa/crm/design` |
| Despesas | `/empresa/despesas/design` |
| Funis | `/empresa/funis/design` |
| Hub | `/empresa/hub/design` |
| Mapas | `/empresa/mapas/design` |
| NPS | `/empresa/nps/design` |
| Linktree | `/empresa/linktree/design` |
| Rotas | `/empresa/rotas/design` |

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de configuração
- `Form` - Formulários de configuração
- `Tabs` - Abas de configuração
- `Button` - Ações

---

## Referências

- **Module:** `src/features/empresas/module.ts`
- **Routes:** `src/routes/empresa/`
