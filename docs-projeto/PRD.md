# 📋 PRD — Product Requirements Document

> **ERP Conexão** · Versão 1.0 · 04/07/2026
> **Produto:** Sistema de Gestão de Cadastros, CRM, NPS e Automações para Rede de Distribuidores

---

## 1. Product Overview

### 1.1 Visão do Produto

Plataforma **multi-tenant** unificada para gestão de cadastros de distribuidores e consultores, com módulos de CRM, pesquisa de satisfação (NPS), automação de processos (webhooks/notificações), marketing digital, gamificação (Hub) e ferramentas de produtividade.

### 1.2 Problema que Resolve

- **Fragmentação** entre sistemas de cadastro, CRM e pesquisa de satisfação
- **Processos manuais** de aprovação e comunicação com distribuidores
- **Falta de automação** em fluxos de mudança de status (link gerado → aprovado/reprovado)
- **Ausência de visão unificada** do relacionamento com o distribuidor
- **Multiplicidade de empresas** sem isolamento adequado de dados

### 1.3 Público-Alvo

| Persona | Perfil | Necessidades |
|---|---|---|
| **Super Admin** | Gestor do sistema (TI) | Configurar integrações, gerenciar empresas, monitorar logs, criar webhooks |
| **Admin de Empresa** | Gestor de distribuidores | Aprovar cadastros, gerenciar equipe, configurar módulos, ver relatórios |
| **Consultor** | Vendedor de campo | Criar cadastros, acompanhar comissões, acessar materiais do Hub |
| **Colaborador/Distribuidor** | Cliente final | Preencher cadastro, enviar documentos, responder pesquisas NPS |
| **Equipe de Marketing** | Gestor de campanhas | Criar landing pages, gerenciar UTMs, emails, anúncios Meta |

### 1.4 Diferenciais Competitivos

- ✅ **Multi-tenant real**: Isolamento total por empresa com RLS no banco
- ✅ **Automação flexível**: Webhooks + notificações + conectores de API orquestráveis
- ✅ **Modularidade**: 13 módulos independentes que podem ser ativados/desativados por empresa
- ✅ **Design System próprio**: Temas customizáveis por empresa com preset dark-gold
- ✅ **Pipeline completo**: Do pré-cadastro ao pós-venda (NPS + CRM)
- ✅ **Gamificação**: Hub com trilhas, badges e ranking para consultores

---

## 2. Features por Módulo

### 2.1 Cadastros (Core)

| Feature | Prioridade | Descrição |
|---|---|---|
| Pré-cadastro com link | P0 | Gerar link de compartilhamento para distribuidor preencher |
| Pipeline de aprovação | P0 | Fluxo: link_gerado → dados_enviados → em_análise → aprovado/reprovado |
| Suporte a PF/PJ | P0 | Formulários distintos para pessoa física e jurídica |
| OCR de documentos | P1 | Leitura automática de comprovantes via Tesseract.js |
| 2FA no pré-cadastro | P1 | Verificação em dois fatores por token |
| Correção e revisão | P0 | Solicitar correção de dados com campos específicos |
| Consulta CNPJ/CRO | P1 | Integração com APIs públicas de consulta |

### 2.2 NPS (Net Promoter Score)

| Feature | Prioridade | Descrição |
|---|---|---|
| Coleta de feedback | P0 | Pesquisa NPS + CSAT + matriz de avaliação |
| Análise de sentimento | P1 | Classificação automática (positivo/neutro/negativo) via léxico PT-BR |
| Relatórios por vendedor | P1 | Métricas agregadas por consultor |
| Configuração de perguntas | P0 | Perguntas dinâmicas configuráveis por empresa |
| Tema customizado | P1 | Personalização visual da pesquisa |

### 2.3 CRM

| Feature | Prioridade | Descrição |
|---|---|---|
| Kanban de pipeline | P0 | Pipeline visual de vendas com drag-and-drop |
| Carteira de clientes | P0 | Gestão da base de clientes por consultor |
| BI e métricas | P1 | Dashboard com indicadores de desempenho |
| Transferência de carteira | P1 | Reatribuição de clientes entre consultores |
| Tarefas e lembretes | P1 | Sistema de tarefas vinculadas a clientes |

### 2.4 Funis

| Feature | Prioridade | Descrição |
|---|---|---|
| Kanban de tarefas | P0 | Gestão visual de tarefas por colunas |
| Templates de funil | P0 | Modelos pré-configurados de funis |
| Labels e filtros | P1 | Categorização e busca de tarefas |
| Comentários e anexos | P1 | Colaboração em tarefas |
| Automações | P1 | Regras de automação (mover tarefa, notificar, etc) |
| Notificações | P1 | Alertas sobre mudanças em tarefas |

### 2.5 Hub (Gamificação)

| Feature | Prioridade | Descrição |
|---|---|---|
| Trilhas de aprendizado | P0 | Conteúdo progressivo para consultores |
| Badges e conquistas | P0 | Sistema de reconhecimento |
| Ranking por gestor | P1 | Competição saudável entre consultores |
| Materiais de apoio | P0 | Central de recursos (PDF, vídeos, links) |
| Chatbot integrado | P1 | Assistente virtual para dúvidas |

### 2.6 Mapas

| Feature | Prioridade | Descrição |
|---|---|---|
| Mapa de distribuidores | P0 | Geolocalização no mapa do Brasil |
| Mapa de consultores | P0 | Visualização por estado e município |
| Gestão de entidades | P1 | CRUD de distribuidores e consultores no mapa |
| Insights geográficos | P1 | Métricas de presença por região |

### 2.7 Marketing

| Feature | Prioridade | Descrição |
|---|---|---|
| Landing pages | P1 | Criação de páginas de captura |
| Gerenciamento Meta Ads | P1 | Campanhas, anúncios, criativos |
| UTMs | P0 | Geração e rastreamento de parâmetros UTM |
| Email marketing | P1 | Campanhas de email |
| SEO | P1 | Otimização para buscadores |
| Calendário editorial | P1 | Planejamento de conteúdo |
| Gestão de leads | P0 | Captura e qualificação |
| Pixels de rastreamento | P1 | Meta Pixel e conversões |
| WhatsApp (Evolution API) | P1 | Disparo de mensagens via Evolution API |
| LinkTree | P1 | Página de links personalizada |

### 2.8 Despesas

| Feature | Prioridade | Descrição |
|---|---|---|
| Registro de despesas | P0 | Lançamento de despesas com OCR de comprovantes |
| Períodos de fechamento | P0 | Controle de meses abertos/fechados |
| Aprovação hierárquica | P1 | Fluxo de aprovação de despesas |
| Relatórios | P1 | Exportação de relatórios em PDF |

### 2.9 Rotas

| Feature | Prioridade | Descrição |
|---|---|---|
| Planejamento de rotas | P1 | Otimização de rotas com Google Maps |
| Base de clientes | P1 | Cadastro de clientes com endereço |
| Relatórios de visita | P1 | Registro de visitas realizadas |

### 2.10 Gerador de Links

| Feature | Prioridade | Descrição |
|---|---|---|
| Links personalizados | P0 | Geração de links com parâmetros UTM |
| Tracking de cliques | P1 | Contagem e relatório de cliques |
| Templates | P1 | Modelos de links reutilizáveis |
| QR Code | P0 | Geração automática de QR Code |

### 2.11 Infraestrutura Global

| Feature | Prioridade | Descrição |
|---|---|---|
| Multi-tenant | P0 | Isolamento completo por empresa_id |
| Webhooks | P0 | Disparo de webhooks por evento com placeholders dinâmicos |
| Notificações in-app | P0 | Sistema de notificações com polling |
| Permissionamento granular | P0 | Permissões por módulo + páginas + ações |
| Design System customizável | P1 | Tema por empresa com presets |
| API Connectors | P1 | Conectores de API externa |
| Central de Ações (Super Admin) | P0 | UI para configurar webhooks, notificações e conectores |

---

## 3. User Stories (Principais)

### Fluxo de Cadastro
```
Como um consultor,
Quero gerar um link de pré-cadastro e enviar ao distribuidor,
Para que ele preencha seus dados e documentos online.
```
- Critério: Link expira em 7 dias
- Critério: Distribuidor recebe token 2FA por SMS/Email
- Critério: Admin recebe notificação quando dados são enviados

### Fluxo de Aprovação
```
Como um admin de empresa,
Quero revisar cadastros pendentes e aprovar ou reprovar,
Para garantir que apenas dados corretos entrem no sistema.
```
- Critério: Webhook dispara quando cadastro é aprovado
- Critério: Consultor recebe notificação do resultado

### Fluxo de Pesquisa NPS
```
Como um admin,
Quero enviar pesquisa NPS automaticamente após aprovação,
Para medir a satisfação do distribuidor.
```
- Critério: Pesquisa enviada 7 dias após aprovação
- Critério: Respostas alimentam dashboard de métricas

---

## 4. Métricas de Sucesso

| Métrica | Meta | Como medir |
|---|---|---|
| Taxa de conversão (pré-cadastro → aprovado) | >70% | Pipeline de status |
| Tempo médio de aprovação | <24h | Timestamps do cadastro |
| NPS médio dos distribuidores | >50 | Score NPS |
| Taxa de resposta NPS | >30% | Respostas / envios |
| Adoção de módulos por empresa | >60% | módulos_empresa ativos |
| Uptime da plataforma | >99.5% | Monitoramento |
| Tempo de deploy | <10min | CI/CD pipeline |

---

## 5. Roadmap

### Fase 1 — Atual (v1.0)
- ✅ Cadastros com pipeline completo
- ✅ NPS com survey personalizável
- ✅ Mapas com geolocalização
- ✅ Funis com Kanban
- ✅ Hub com gamificação
- ✅ CRM com pipeline de vendas
- ✅ Despesas com OCR
- ✅ Rotas com Google Maps
- ✅ Gerador de Links com QR Code
- ✅ Marketing (10 submódulos)
- ✅ Multi-tenant completo
- ✅ Webhooks e automações
- ✅ Permissionamento granular

### Fase 2 — Próximas (Q3 2026)
- ⬜ **Micro-frontends**: Cada módulo como remote entry independente
- ⬜ **Edge Functions**: Substituir webhooks client-side por serverless
- ⬜ **Cache server-side**: Redis via Supabase para dashboards
- ⬜ **Cron jobs**: Agendamento de tarefas recorrentes (pg_cron)
- ⬜ **Rate limiting**: Proteção contra abuso via RPC

### Fase 3 — Futuro (Q4 2026)
- ⬜ **Marketplace de módulos**: Terceiros criarem módulos independentes
- ⬜ **App mobile**: Versão nativa com React Native
- ⬜ **IA Generativa**: Assistente inteligente para consultores
- ⬜ **Offline-first**: Suporte a modo offline com sincronização
- ⬜ **White-label**: Empresas poderem rebrandear completamente

---

## 6. Restrições e Requisitos Não-Funcionais

| Requisito | Especificação |
|---|---|
| Performance | Lighthouse >80, FCP <2s, LCP <3s |
| Disponibilidade | 99.5% uptime (janela de deploy: horário comercial) |
| Segurança | RLS em 100% das tabelas, SECURITY DEFINER em funções críticas |
| Privacidade | Dados isolados por empresa_id, sem cross-tenant leak |
| Manutenibilidade | 0 acoplamento entre módulos de negócio |
| Escalabilidade | Horizontal via Docker Swarm (até 1000 empresas) |
| Responsividade | Mobile-first, breakpoints: base/sm/md/lg |
| Acessibilidade | WCAG 2.1 AA (em progresso) |

---

> **Documento gerado em:** 04/07/2026 | **Próxima revisão:** 04/08/2026
