# Documentacao do Modulo Hub

**Data:** 2025-07-03
**Modulo:** Hub
**Chave:** `hub`
**Ambientes:** cadastro, consultor, tecnologia

---

## 📄 Visao Geral

O modulo **Hub** e uma plataforma completa de **treinamento e gamificacao** para o ERP Conexao. Ele permite que empresas criem, organizam e distribuam materiais de aprendizado (videos, PDFs, audios, imagens, HTML) organizados em trilhas (collections), com sistema de badges, niveis/patentes, ranking e convites para novos usuarios.

O modulo atua como um LMS (Learning Management System) integrado ao ecossistema ERP, com suporte a multi-idiomas (pt-br, en-us, es-es), integracoes AI (Gemini, OpenAI, Groq, OpenRouter) e chatbot via webhook.

**Proposito:** Centralizar treinamentos, engajar usuarios com gamificacao e acompanhar progresso atraves de analytics.

---

## 📁 Estrutura do Diretorio

```
src/features/hub/
├── module.ts              # Definicao do modulo (rotas, permissoes, eventos, nav items)
├── permissions.ts         # Chaves de permissoes do modulo
├── types.ts               # Tipos TypeScript e interfaces
├── constants.ts           # Constantes do modulo
├── index.ts               # Exports publicos
├── components/            # Componentes React
├── hooks/                 # Custom hooks
├── lib/                   # Utilitarios
├── pages/                 # Paginas/routes
└── services/              # Servicos de acesso ao banco
    ├── materials.ts       # CRUD de materiais e assets
    ├── collections.ts     # CRUD de colecoes (trilhas) e itens
    ├── progress.ts        # Progresso de usuarios e colecoes
    ├── gamification.ts    # Badges, niveis, ranking e pontos
    ├── invites.ts         # Gerenciamento de convites
    ├── config.ts          # Configuracoes do sistema
    ├── integrations.ts    # Integracoes AI
    └── chatbot.ts         # Config e envio de mensagens do chatbot
```

---

## 🛣️ Rotas

| Rota | Descricao |
|------|-----------|
| `/global/hub` | Dashboard global do Hub |
| `/empresa/hub/tema` | Configuracao de temas do Hub |
| `/hub/admin/dashboard` | Dashboard administrativo |
| `/hub/admin/materiais` | Gerenciamento de materiais |
| `/hub/admin/trilhas` | Gerenciamento de trilhas |
| `/hub/admin/analytics` | Analytics/Bi administrativo |
| `/hub/admin/badges` | Gerenciamento de badges |
| `/empresa/hub/chatbot` | Configuracao do chatbot |
| `/hub/gestor/dashboard` | Dashboard do gestor |
| `/hub/gestor/analytics` | Analytics do gestor |
| `/hub/gestor/ranking` | Ranking do gestor |
| `/hub/gestor/conquistas` | Conquistas do gestor |
| `/hub/consultor/dashboard` | Dashboard do consultor |
| `/hub/consultor/ranking` | Ranking do consultor |
| `/hub/consultor/conquistas` | Conquistas do consultor |
| `/hub/distribuidor/dashboard` | Dashboard do distribuidor |
| `/hub/distribuidor/conquistas` | Conquistas do distribuidor |
| `/hub/cliente/dashboard/$empresaId` | Dashboard do cliente |

---

## 🔐 Permissoes

### Materiais

| Chave | Label | Descricao |
|-------|-------|-----------|
| `hub_ver_materiais` | Ver materiais | Visualizar materiais de treinamento |
| `hub_criar_material` | Criar material | Criar novos materiais de treinamento |
| `hub_editar_material` | Editar material | Editar materiais existentes |
| `hub_excluir_material` | Excluir material | Excluir materiais de treinamento |
| `hub_gerenciar_assets` | Gerenciar arquivos | Gerenciar arquivos dos materiais |
| `hub_publicar_material` | Publicar material | Ativar/desativar materiais |
| `hub_ver_acessos_material` | Ver acessos | Visualizar acessos por material |
| `hub_exportar_materiais` | Exportar materiais | Exportar dados de materiais |

### Trilhas

| Chave | Label | Descricao |
|-------|-------|-----------|
| `hub_ver_trilhas` | Ver trilhas | Visualizar trilhas de aprendizado |
| `hub_criar_trilha` | Criar trilha | Criar novas trilhas |
| `hub_editar_trilha` | Editar trilha | Editar trilhas existentes |
| `hub_excluir_trilha` | Excluir trilha | Excluir trilhas |
| `hub_gerenciar_itens_trilha` | Gerenciar itens | Gerenciar materiais dentro das trilhas |
| `hub_compartilhar_trilha` | Compartilhar trilha | Compartilhar trilhas com outros |

### Gamificacao

| Chave | Label | Descricao |
|-------|-------|-----------|
| `hub_ver_ranking` | Ver ranking | Visualizar ranking de usuarios |
| `hub_gerenciar_badges` | Gerenciar badges | Criar e gerenciar badges |
| `hub_gerenciar_niveis` | Gerenciar niveis | Gerenciar niveis/patentes |
| `hub_ver_conquistas` | Ver conquistas | Visualizar badges conquistados |

### Usuarios

| Chave | Label | Descricao |
|-------|-------|-----------|
| `hub_ver_usuarios` | Ver usuarios | Visualizar usuarios do Hub |
| `hub_editar_usuario` | Editar usuario | Editar perfil de usuarios do Hub |
| `hub_aprovar_usuario` | Aprovar usuario | Aprovar ou rejeitar usuarios |
| `hub_gerenciar_convites` | Gerenciar convites | Criar e gerenciar convites |

### Admin

| Chave | Label | Descricao |
|-------|-------|-----------|
| `hub_ver_analytics` | Ver analytics | Visualizar analytics e metricas |
| `hub_gerenciar_config` | Gerenciar config | Gerenciar configuracoes do Hub |
| `hub_gerenciar_integracoes` | Gerenciar integracoes | Gerenciar integracoes AI |
| `hub_gerenciar_chatbot` | Gerenciar chatbot | Gerenciar config do chatbot |
| `hub_gerenciar_webhooks_hub` | Gerenciar webhooks | Gerenciar webhooks do Hub |

---

## 👥 Defaults por Papel

| Permissao | Cadastro | Consultor | Tecnologia | Suporte |
|-----------|----------|-----------|------------|---------|
| `hub_ver_materiais` | ✅ | ✅ | ✅ | ❌ |
| `hub_criar_material` | ✅ | ❌ | ✅ | ❌ |
| `hub_editar_material` | ✅ | ❌ | ✅ | ❌ |
| `hub_excluir_material` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_assets` | ✅ | ❌ | ✅ | ❌ |
| `hub_publicar_material` | ✅ | ❌ | ✅ | ❌ |
| `hub_ver_acessos_material` | ✅ | ❌ | ✅ | ❌ |
| `hub_exportar_materiais` | ✅ | ❌ | ✅ | ❌ |
| `hub_ver_trilhas` | ✅ | ❌ | ✅ | ❌ |
| `hub_criar_trilha` | ✅ | ❌ | ✅ | ❌ |
| `hub_editar_trilha` | ✅ | ❌ | ✅ | ❌ |
| `hub_excluir_trilha` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_itens_trilha` | ✅ | ❌ | ✅ | ❌ |
| `hub_compartilhar_trilha` | ✅ | ❌ | ✅ | ❌ |
| `hub_ver_ranking` | ✅ | ✅ | ✅ | ❌ |
| `hub_gerenciar_badges` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_niveis` | ✅ | ❌ | ✅ | ❌ |
| `hub_ver_conquistas` | ✅ | ✅ | ✅ | ❌ |
| `hub_ver_usuarios` | ✅ | ❌ | ✅ | ❌ |
| `hub_editar_usuario` | ✅ | ❌ | ✅ | ❌ |
| `hub_aprovar_usuario` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_convites` | ✅ | ❌ | ✅ | ❌ |
| `hub_ver_analytics` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_config` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_integracoes` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_chatbot` | ✅ | ❌ | ✅ | ❌ |
| `hub_gerenciar_webhooks_hub` | ✅ | ❌ | ✅ | ❌ |

**Legenda:** ✅ = Ativo por padrao | ❌ = Inativo por padrao

---

## 📋 Navegacao Sidebar

### Admin (visivel quando `hub_gerenciar_config = true`)

| ID | Label | Rota | Ordem |
|----|-------|------|-------|
| `hub-admin-dashboard` | Dash Admin | `/hub/admin/dashboard` | 25 |
| `hub-admin-materiais` | Add Materiais | `/hub/admin/materiais` | 26 |
| `hub-admin-trilhas` | Add Trilhas | `/hub/admin/trilhas` | 27 |
| `hub-admin-badges` | Add Badges | `/hub/admin/badges` | 28 |
| `hub-admin-analytics` | BI Admin | `/hub/admin/analytics` | 29 |
| `hub-admin-chatbot` | Config. Chatbot | `/hub/admin/chatbot` | 30 |
| `hub-empresa-tema` | Temas Hub | `/empresa/hub/tema` | 61 |

### Gestor (visivel quando `hub_ver_analytics = true` E `hub_gerenciar_config != true`)

| ID | Label | Rota | Ordem |
|----|-------|------|-------|
| `hub-gestor-dashboard` | Dash Gestor | `/hub/gestor/dashboard` | 35 |
| `hub-gestor-analytics` | BI Gestor | `/hub/gestor/analytics` | 36 |
| `hub-gestor-ranking` | Rank Gestor | `/hub/gestor/ranking` | 37 |
| `hub-gestor-conquistas` | Badges Gestor | `/hub/gestor/conquistas` | 38 |

### Consultor (visivel quando `hub_ver_materiais = true`, sem analytics nem config)

| ID | Label | Rota | Ordem |
|----|-------|------|-------|
| `hub-consultor-dashboard` | Dash Consultor | `/hub/consultor/dashboard` | 45 |
| `hub-consultor-ranking` | Rank Consultor | `/hub/consultor/ranking` | 46 |
| `hub-consultor-conquistas` | Badges Consultor | `/hub/consultor/conquistas` | 47 |

### Distribuidor (visivel quando `hub_ver_materiais = true`, sem analytics nem config)

| ID | Label | Rota | Ordem |
|----|-------|------|-------|
| `hub-distribuidor-dashboard` | Dash Distribuidor | `/hub/distribuidor/dashboard` | 55 |
| `hub-distribuidor-conquistas` | Badges Distribuidor | `/hub/distribuidor/conquistas` | 56 |

### Global

| ID | Label | Rota | Ordem |
|----|-------|------|-------|
| `hub-global-dashboard` | Hub | `/global/hub` | 60 |

---

## 📡 Eventos / Webhooks

| Chave | Label | Tipo | Descricao |
|-------|-------|------|-----------|
| `material.acessado` | Material Acessado | status_change | Quando um material e visualizado |
| `material.concluido` | Material Concluido | status_change | Quando um material e concluido |
| `trilha.concluida` | Trilha Concluida | status_change | Quando uma trilha e concluida |
| `gamification.level_up` | Level Up | status_change | Quando um usuario sobe de nivel |
| `badge.conquistado` | Badge Conquistado | status_change | Quando um badge e desbloqueado |
| `convite.gerado` | Convite Gerado | button_action | Quando um convite e criado |
| `usuario.registrado` | Usuario Registrado | status_change | Quando um usuario se registra via convite |
| `usuario.status_alterado` | Status Alterado | status_change | Quando status do usuario muda |

### Webhooks Disponiveis (para integracao externa)

| Evento | Label |
|--------|-------|
| `user.registered` | Usuario registrado |
| `user.invite_used` | Convite utilizado |
| `user.status_changed` | Status do usuario alterado |
| `material.accessed` | Material acessado |
| `material.completed` | Material concluido |
| `collection.completed` | Colecao concluida |
| `gamification.level_up` | Level-up (gamificacao) |
| `invite.generated` | Convite gerado |
| `invite.shared` | Convite compartilhado |

---

## ⚙️ Funcionalidades

| Funcionalidade | Descricao |
|----------------|-----------|
| Materiais | CRUD completo de materiais de treinamento (image, pdf, video, audio, html) |
| Assets | Gerenciamento de arquivos por idioma com controle de status (draft/review/published) |
| Trilhas | Organizacao de materiais em sequencias de aprendizado (collections) |
| Itens da Trilha | Adicao, remocao e reordenacao de materiais dentro de uma trilha |
| Progresso | Tracking de progresso individual por material e por trilha |
| Ranking | Ranking de usuarios por pontos acumulados (top 50) |
| Badges | Sistema de conquistas com triggers automaticos (material_completed, points_reached, streak_days, etc.) |
| Niveis | Sistema de patentes: Iniciante (0), Bronze (100), Prata (300), Ouro (600), Master (1000) |
| Pontuacao | Atribuicao de pontos por completar materiais, com acumulo no perfil do usuario |
| Convites | Geracao de tokens de convite com papel (role), validade e compartilhamento via WhatsApp |
| Multi-idioma | Suporte a pt-br, en-us, es-es para titulos e materiais |
| Configuracao | Tema dark customizavel por empresa, nome do app, logo |
| Integracoes AI | Chaves de API para Gemini, OpenAI, Groq e OpenRouter com toggle de ativacao |
| Chatbot | Chatbot via webhook configuravel por empresa, com controle de roles |
| Analytics | Dashboards de BI para admin e gestor |
| Acessos | Logs de acesso por material com dados do usuario |

---

## 🗄️ Tabelas do Banco de Dados

| Tabela | Descricao |
|--------|-----------|
| `hub_materials` | Materiais de treinamento |
| `hub_material_assets` | Arquivos/assets dos materiais por idioma |
| `hub_collections` | Trilhas (colecoes) de aprendizado |
| `hub_collection_items` | Itens das trilhas (relacao material-trilha) |
| `hub_user_progress` | Progresso de usuarios por material |
| `hub_collection_progress` | Progresso de usuarios por trilha |
| `hub_access_logs` | Logs de acesso aos materiais |
| `hub_gamification_levels` | Niveis/patentes de gamificacao |
| `hub_badges` | Badges disponiveis |
| `hub_user_badges` | Badges conquistados por usuario |
| `hub_invite_tokens` | Tokens de convite |
| `hub_system_config` | Configuracoes do sistema (tema, nome, logo) |
| `hub_system_integracoes` | Integracoes AI (chaves de API) |
| `hub_chatbot_config` | Configuracao do chatbot |

---

## 🔗 Dependencias

- **Supabase Client** — Acesso ao banco de dados (`~/core/supabase/client`)
- **Registry** — Sistema de registro de modulos, permissoes e nav items (`~/registry`)
- **Lucide React** — Icones (BookOpen, LayoutDashboard, GraduationCap, Trophy, Settings, Users, BarChart3, Bot, FileText, Medal, Star, Palette)
- **Sistema de Permissoes do ERP** — Integrado ao `registerPermission` e `registerPermissionDefaults`
- **Sistema de Navegacao** — Integrado ao `registerNavItem` para sidebar

---

## 📝 Notas Importantes

1. **Multi-tenant:** Todas as tabelas possuem coluna `empresa_id` para isolamento por empresa.
2. **Gamificacao:** O sistema de pontos e niveis e baseado em thresholds fixos configurados em `HUB_LEVEL_THRESHOLDS`.
3. **Integracoes AI:** O modulo suporta multiplos provedores (Gemini, OpenAI, Groq, OpenRouter) com toggle individual de ativacao.
4. **Chatbot:** Funciona via webhook — o modulo envia POST para a URL configurada e retorna a resposta.
5. **Convites:** Tokens sao gerados com UUID randomico (32 chars) e podem ter data de expiracao.
6. **Design Config:** O modulo possui rota dedicada `/empresa/hub/design` para configuracao visual.
7. **Credential Scopes:** O modulo suporta escopos de credenciais (`hasCredentialScopes: true`).
8. **Permissao de Admin:** A funcao `isAdmin` verifica `hub_gerenciar_config === true` — e o gate principal para acesso as rotas admin.
