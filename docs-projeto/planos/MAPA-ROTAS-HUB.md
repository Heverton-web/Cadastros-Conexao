# Mapa de Rotas — Módulo HUB

## Total: 23 rotas

---

## 1. Rota Pública (sem login)

| Rota           | Componente     | Descrição                                                                                                   |
| -------------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| `/hub/cliente` | HubClientePage | Materiais para clientes. Acesso público, sem autenticação. Filtra materiais com `allowed_roles: ["client"]` |

---

## 2. Rotas Autenticadas — Qualquer perfil logado

| Rota                         | Componente            | Descrição                                                      |
| ---------------------------- | --------------------- | -------------------------------------------------------------- |
| `/hub/dashboard`             | HubDashboardPage      | Dashboard principal com materiais, trilhas, sidebar gamificada |
| `/hub/trilhas`               | HubTrilhasPage        | Lista de trilhas disponíveis                                   |
| `/hub/trilhas/$trilhaId`     | HubTrilhaDetailPage   | Detalhe da trilha com lista de materiais e progresso           |
| `/hub/materiais`             | HubMateriaisPage      | Lista de todos os materiais ativos                             |
| `/hub/materiais/$materialId` | HubMaterialDetailPage | Detalhe do material com viewer                                 |
| `/hub/ranking`               | HubRankingPage        | Ranking de XP dos usuários                                     |
| `/hub/conquistas`            | HubConquistasPage     | Badges e conquistas desbloqueados                              |

---

## 3. Rotas por Perfil de Parceiro (autenticado)

| Rota                | Componente          | Acesso                    | Filtro                           |
| ------------------- | ------------------- | ------------------------- | -------------------------------- |
| `/hub/consultor`    | HubConsultorPage    | Login via credenciais ERP | `allowed_roles: ["consultant"]`  |
| `/hub/distribuidor` | HubDistribuidorPage | Login via credenciais ERP | `allowed_roles: ["distributor"]` |

---

## 4. Rotas Admin — Empresa (autenticado, role admin)

| Rota                   | Componente         | Descrição                                                 |
| ---------------------- | ------------------ | --------------------------------------------------------- |
| `/hub/admin`           | HubAdminPage       | Hub de navegação com cards para sub-rotas                 |
| `/hub/admin/materiais` | AdminMateriaisPage | CRUD materiais (criar, editar, excluir, ativar/desativar) |
| `/hub/admin/trilhas`   | AdminTrilhasPage   | CRUD trilhas (criar, editar, excluir)                     |
| `/hub/admin/usuarios`  | AdminUsuariosPage  | Lista de usuários com ranking, editar/excluir             |
| `/hub/admin/analytics` | AdminAnalyticsPage | Métricas: materiais, trilhas, usuários, badges, top XP    |
| `/hub/admin/badges`    | AdminBadgesPage    | CRUD badges com ícones e recompensas                      |
| `/hub/admin/identity`  | AdminIdentityPage  | Nome do app e logo URL                                    |

---

## 5. Rotas Super Admin (exclusivas)

| Rota                 | Componente       | Descrição                                                            |
| -------------------- | ---------------- | -------------------------------------------------------------------- |
| `/hub/admin/themes`  | ThemeEditorPanel | Editor de 42+ tokens CSS + environment effects (blobs, glass, grain) |
| `/hub/admin/config`  | AdminConfigPage  | Configurações gerais do Hub                                          |
| `/hub/admin/chatbot` | AdminChatbotPage | Config webhook n8n para chatbot                                      |
| `/hub/webhooks`      | HubWebhooksPage  | Gerenciar webhooks do Hub                                            |

---

## 6. Rotas Gestor (leitura apenas)

| Rota                    | Componente    | Descrição                        |
| ----------------------- | ------------- | -------------------------------- |
| `/hub/gestor`           | HubGestorPage | Painel do gestor com abas        |
| `/hub/gestor/materiais` | HubGestorPage | Visualizar materiais (read-only) |
| `/hub/gestor/usuarios`  | HubGestorPage | Visualizar usuários (read-only)  |
| `/hub/gestor/trilhas`   | HubGestorPage | Visualizar trilhas (read-only)   |
| `/hub/gestor/analytics` | HubGestorPage | Analytics (read-only)            |

---

## Fluxo de Acesso por Role

```
Super Admin → /hub/admin/* (todas) + /hub/admin/themes + /hub/admin/config + /hub/admin/chatbot + /hub/webhooks
Admin       → /hub/admin/* (exceto themes, config, chatbot)
Gestor      → /hub/gestor/* (leitura)
Consultor   → /hub/consultor + /hub/dashboard + /hub/trilhas + /hub/ranking + /hub/conquistas
Distribuidor → /hub/distribuidor + /hub/dashboard + /hub/trilhas + /hub/ranking + /hub/conquistas
Cliente     → /hub/cliente (público)
```

## Arquivos de Rota (src/routes/)

```
hub.dashboard.tsx
hub.trilhas.tsx
hub.trilhas.$trilhaId.tsx
hub.materiais.tsx
hub.materiais.$materialId.tsx
hub.ranking.tsx
hub.conquistas.tsx
hub.consultor.tsx
hub.distribuidor.tsx
hub.cliente.tsx
hub.admin.tsx
hub.admin.materiais.tsx
hub.admin.trilhas.tsx
hub.admin.usuarios.tsx
hub.admin.analytics.tsx
hub.admin.badges.tsx
hub.admin.identity.tsx
hub.admin.themes.tsx
hub.admin.config.tsx
hub.admin.chatbot.tsx
hub.gestor.tsx
hub.gestor.materiais.tsx
hub.gestor.usuarios.tsx
hub.gestor.trilhas.tsx
hub.gestor.analytics.tsx
hub.webhooks.tsx
```
