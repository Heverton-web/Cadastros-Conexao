# Análise das Funções — Módulo Hub

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Funções do Módulo](#2-funções-do-módulo)
3. [Referências Técnicas](#3-referências-técnicas)

---

## 1. Visão Geral do Módulo

O módulo **Hub** é uma plataforma de treinamento e gamificação com 4 papéis (Admin, Gestor, Consultor, Distribuidor) e sistema completo de recompensas. Maior módulo em permissões (28) e tabelas (15).

| Aspecto | Detalhe |
|---|---|
| **Key** | `hub` |
| **Descrição** | Plataforma de treinamento e gamificação |
| **Ambientes** | cadastro, consultor, tecnologia |
| **Permissões** | 28 funções granulares (maior) |
| **Eventos** | 8 webhooks |
| **Rotas** | 18 páginas |
| **Design Config** | ✅ `/empresa/hub/design` |

---

## 2. Funções do Módulo

### Funções por Papel

#### Admin (7 funções)
| Função | Rota | Permissão |
|---|---|---|
| Dashboard Admin | `/hub/admin/dashboard` | `hub_gerenciar_config` |
| Gerenciar Materiais | `/hub/admin/materiais` | `hub_gerenciar_config` |
| Gerenciar Trilhas | `/hub/admin/trilhas` | `hub_gerenciar_config` |
| Gerenciar Badges | `/hub/admin/badges` | `hub_gerenciar_config` |
| BI Admin | `/hub/admin/analytics` | `hub_gerenciar_config` |
| Config. Chatbot | `/hub/admin/chatbot` | `hub_gerenciar_config` |
| Temas Hub | `/empresa/hub/tema` | `hub_gerenciar_config` |

#### Gestor (4 funções)
| Função | Rota | Permissão |
|---|---|---|
| Dashboard Gestor | `/hub/gestor/dashboard` | `hub_ver_analytics` |
| BI Gestor | `/hub/gestor/analytics` | `hub_ver_analytics` |
| Ranking Gestor | `/hub/gestor/ranking` | `hub_ver_analytics` |
| Badges Gestor | `/hub/gestor/conquistas` | `hub_ver_analytics` |

#### Consultor (3 funções)
| Função | Rota | Permissão |
|---|---|---|
| Dashboard Consultor | `/hub/consultor/dashboard` | `hub_ver_materiais` |
| Ranking Consultor | `/hub/consultor/ranking` | `hub_ver_materiais` |
| Conquistas Consultor | `/hub/consultor/conquistas` | `hub_ver_materiais` |

#### Distribuidor (2 funções)
| Função | Rota | Permissão |
|---|---|---|
| Dashboard Distribuidor | `/hub/distribuidor/dashboard` | `hub_ver_materiais` |
| Conquistas Distribuidor | `/hub/distribuidor/conquistas` | `hub_ver_materiais` |

#### Cliente (1 função)
| Função | Rota |
|---|---|
| Dashboard Cliente | `/hub/cliente/dashboard/$empresaId` |

---

### Funções Granulares (28)

**Grupo Materiais (8)**: `hub_ver_materiais`, `hub_criar_material`, `hub_editar_material`, `hub_excluir_material`, `hub_gerenciar_assets`, `hub_publicar_material`, `hub_ver_acessos_material`, `hub_exportar_materiais`

**Grupo Trilhas (6)**: `hub_ver_trilhas`, `hub_criar_trilha`, `hub_editar_trilha`, `hub_excluir_trilha`, `hub_gerenciar_itens_trilha`, `hub_compartilhar_trilha`

**Grupo Gamificação (4)**: `hub_ver_ranking`, `hub_gerenciar_badges`, `hub_gerenciar_niveis`, `hub_ver_conquistas`

**Grupo Usuários (4)**: `hub_ver_usuarios`, `hub_editar_usuario`, `hub_aprovar_usuario`, `hub_gerenciar_convites`

**Grupo Admin (6)**: `hub_ver_analytics`, `hub_gerenciar_config`, `hub_gerenciar_integracoes`, `hub_gerenciar_chatbot`, `hub_gerenciar_webhooks_hub`

---

### Eventos (8)

`material.acessado`, `material.concluido`, `trilha.concluida`, `gamification.level_up`, `badge.conquistado`, `convite.gerado`, `usuario.registrado`, `usuario.status_alterado`

---

## 3. Referências Técnicas

| Arquivo | Função |
|---|---|
| `src/features/hub/module.ts` | Definição do módulo, 4 papéis |
| `src/features/hub/permissions.ts` | 28 permissões |
| `src/features/hub/theme.css` | Tema CSS próprio |
| `supabase/migrations/00041_hub_module.sql` | 15 tabelas `hub_*` |
| `supabase/migrations/00042_hub_profiles_extension.sql` | Extensão profiles (hub_points, etc.) |
