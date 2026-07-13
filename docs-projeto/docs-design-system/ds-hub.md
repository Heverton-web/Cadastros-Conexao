# Design System - Módulo Hub

> Módulo: `hub` | Versão: 1.0.0

## Sumário

1. [Visão Geral](#visão-geral)
2. [Permissões](#permissões)
3. [Rotas](#rotas)
4. [Eventos](#eventos)
5. [Abas](#abas)
6. [Nav Items](#nav-items)
7. [Design System Específico](#design-system-específico)

---

## Visão Geral

O módulo **Hub** é uma plataforma de treinamento e gamificação para consultores e distribuidores.

**Chave:** `hub`
**Ícone:** `BookOpen`
**Descrição:** Plataforma de treinamento e gamificação

---

## Permissões

### Materiais

| Chave | Descrição |
|-------|-----------|
| `hub_ver_materiais` | Ver materiais |
| `hub_criar_material` | Criar material |
| `hub_editar_material` | Editar material |
| `hub_excluir_material` | Excluir material |
| `hub_gerenciar_assets` | Gerenciar assets |
| `hub_publicar_material` | Publicar material |
| `hub_ver_acessos_material` | Ver acessos ao material |
| `hub_exportar_materiais` | Exportar materiais |

### Trilhas

| Chave | Descrição |
|-------|-----------|
| `hub_ver_trilhas` | Ver trilhas |
| `hub_criar_trilha` | Criar trilha |
| `hub_editar_trilha` | Editar trilha |
| `hub_excluir_trilha` | Excluir trilha |
| `hub_gerenciar_itens_trilha` | Gerenciar itens da trilha |
| `hub_compartilhar_trilha` | Compartilhar trilha |

### Gamificação

| Chave | Descrição |
|-------|-----------|
| `hub_ver_ranking` | Ver ranking |
| `hub_gerenciar_badges` | Gerenciar badges |
| `hub_gerenciar_niveis` | Gerenciar níveis |
| `hub_ver_conquistas` | Ver conquistas |

### Usuários

| Chave | Descrição |
|-------|-----------|
| `hub_ver_usuarios` | Ver usuários |
| `hub_editar_usuario` | Editar usuário |
| `hub_aprovar_usuario` | Aprovar usuário |
| `hub_gerenciar_convites` | Gerenciar convites |

### Configurações

| Chave | Descrição |
|-------|-----------|
| `hub_ver_analytics` | Ver analytics |
| `hub_gerenciar_config` | Gerenciar configurações |
| `hub_gerenciar_integracoes` | Gerenciar integrações |
| `hub_gerenciar_chatbot` | Gerenciar chatbot |
| `hub_gerenciar_webhooks_hub` | Gerenciar webhooks |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `consultor` | ver_materiais, ver_ranking, ver_conquistas: true |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

### Admin

| Rota | Descrição |
|------|-----------|
| `/hub/admin/dashboard` | Dashboard administrativo |
| `/hub/admin/materiais` | Gerenciar materiais |
| `/hub/admin/trilhas` | Gerenciar trilhas |
| `/hub/admin/analytics` | Analytics |
| `/hub/admin/badges` | Gerenciar badges |

### Gestor

| Rota | Descrição |
|------|-----------|
| `/hub/gestor/dashboard` | Dashboard do gestor |
| `/hub/gestor/analytics` | Analytics do gestor |
| `/hub/gestor/ranking` | Ranking |
| `/hub/gestor/conquistas` | Conquistas |

### Consultor

| Rota | Descrição |
|------|-----------|
| `/hub/consultor/dashboard` | Dashboard do consultor |
| `/hub/consultor/ranking` | Ranking |
| `/hub/consultor/conquistas` | Conquistas |

### Distribuidor

| Rota | Descrição |
|------|-----------|
| `/hub/distribuidor/dashboard` | Dashboard do distribuidor |
| `/hub/distribuidor/conquistas` | Conquistas |

### Global

| Rota | Descrição |
|------|-----------|
| `/global/hub` | Hub global |
| `/empresa/hub/tema` | Configuração de temas |
| `/empresa/hub/chatbot` | Configuração do chatbot |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `material.acessado` | Quando um material é visualizado |
| `material.concluido` | Quando um material é concluído |
| `trilha.concluida` | Quando uma trilha é concluída |
| `gamification.level_up` | Quando um usuário sobe de nível |
| `badge.conquistado` | Quando um badge é desbloqueado |
| `usuario.registrado` | Quando um usuário se registra via convite |
| `usuario.status_alterado` | Quando status do usuário muda |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `convite.gerado` | Quando um convite é criado |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do Hub |
| `permissoes` | Gerenciar permissões do módulo |
| `credenciais` | Credenciais com escopo no Hub |
| `eventos` | Eventos e webhooks do Hub |
| `integracoes` | Integrações AI do Hub |
| `chatbot` | Configuração do chatbot |

---

## Nav Items

### Admin

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `hub-admin-dashboard` | Dash Admin | LayoutDashboard | `/hub/admin/dashboard` | 25 |
| `hub-admin-materiais` | Add Materiais | FileText | `/hub/admin/materiais` | 26 |
| `hub-admin-trilhas` | Add Trilhas | GraduationCap | `/hub/admin/trilhas` | 27 |
| `hub-admin-badges` | Add Badges | Trophy | `/hub/admin/badges` | 28 |
| `hub-admin-analytics` | BI Admin | BarChart3 | `/hub/admin/analytics` | 29 |
| `hub-admin-chatbot` | Config. Chatbot | Bot | `/hub/admin/chatbot` | 30 |

### Gestor

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `hub-gestor-dashboard` | Dash Gestor | LayoutDashboard | `/hub/gestor/dashboard` | 35 |
| `hub-gestor-analytics` | BI Gestor | BarChart3 | `/hub/gestor/analytics` | 36 |
| `hub-gestor-ranking` | Rank Gestor | Medal | `/hub/gestor/ranking` | 37 |
| `hub-gestor-conquistas` | Badges Gestor | Star | `/hub/gestor/conquistas` | 38 |

### Consultor

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `hub-consultor-dashboard` | Dash Consultor | LayoutDashboard | `/hub/consultor/dashboard` | 45 |
| `hub-consultor-ranking` | Rank Consultor | Medal | `/hub/consultor/ranking` | 46 |
| `hub-consultor-conquistas` | Badges Consultor | Star | `/hub/consultor/conquistas` | 47 |

### Distribuidor

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `hub-distribuidor-dashboard` | Dash Distribuidor | LayoutDashboard | `/hub/distribuidor/dashboard` | 55 |
| `hub-distribuidor-conquistas` | Badges Distribuidor | Star | `/hub/distribuidor/conquistas` | 56 |

### Global

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `hub-global-dashboard` | Hub | BookOpen | `/global/hub` | 60 |
| `hub-empresa-tema` | Temas Hub | Settings | `/empresa/hub/tema` | 61 |

---

## Design System Específico

### Estilos Customizados

O módulo Hub possui estilos CSS próprios em `src/features/hub/lib/hub-theme.css` e `src/features/hub/lib/badge-animations.css`.

### CSS Variables (Hub Theme)

```css
:root {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-card: #1e293b;
  --color-text-main: #f8fafc;
  --color-text-muted: #94a3b8;
  --color-accent: #c9a655;
  --color-accent-hover: #d4b366;
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
  --color-hover-scale: 1.02;
  --env-blob1-color: #c9a655;
  --env-blob2-color: #e8d48b;
  --env-blob3-color: #a8873a;
  --env-blob-opacity: 0.2;
  --env-blob-size: 18rem;
  --env-blob-blur: 64px;
  --env-glass-blur: 20px;
}
```

### Efeitos Especiais

#### Liquid Glass

```css
.liquid-glass {
  background: rgba(30, 41, 59, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
}
```

#### Liquid Glass Gold

```css
.liquid-glass-gold {
  background: rgba(201, 166, 85, 0.12);
  border: 1px solid rgba(201, 166, 85, 0.15);
  box-shadow: 0 4px 20px rgba(201, 166, 85, 0.08);
  backdrop-filter: blur(16px) saturate(160%);
}
```

#### Icon Box

```css
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(201, 166, 85, 0.2);
  color: var(--color-accent);
}

.icon-box-sm {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
}

.icon-box-lg {
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
}
```

### Animações de Badge

#### Confetti

```css
@keyframes confete-gold-1 {
  0% { transform: translate(0, 0) rotate(0) scale(1); opacity: 1; }
  100% { transform: translate(-30px, -60px) rotate(720deg) scale(0); opacity: 0; }
}

.confete-1 { animation: confete-gold-1 2.5s ease-out forwards; }
.confete-2 { animation: confete-gold-2 1.8s ease-out forwards; }
.confete-3 { animation: confete-gold-3 2.2s ease-out forwards; }
.confete-4 { animation: confete-gold-4 2s ease-out forwards; }
.confete-5 { animation: confete-gold-5 3s ease-out forwards; }
```

#### Badge Pop In

```css
@keyframes badge-pop-in {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  70% { transform: scale(0.95) rotate(-2deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

.animate-badge-pop {
  animation: badge-pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

#### Unlock Glow

```css
@keyframes unlock-glow {
  0% { box-shadow: 0 0 0 rgba(201, 166, 85, 0); }
  50% { box-shadow: 0 0 30px rgba(201, 166, 85, 0.6), 0 0 60px rgba(201, 166, 85, 0.3); }
  100% { box-shadow: 0 0 0 rgba(201, 166, 85, 0); }
}

.animate-unlock-glow {
  animation: unlock-glow 2s ease-in-out infinite;
}
```

#### Border Pulse

```css
@keyframes border-pulse-gold {
  0%, 100% { border-color: #c9a655; box-shadow: 0 0 5px rgba(201, 166, 85, 0.3); }
  50% { border-color: #e8d48b; box-shadow: 0 0 20px rgba(201, 166, 85, 0.6); }
}

.animate-border-pulse {
  animation: border-pulse-gold 2s ease-in-out infinite;
}
```

#### Shimmer Particle

```css
.shimmer-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, #fff8dc, #c9a655);
  border-radius: 50%;
  animation: shimmer-particle 2s linear infinite;
}
```

### Animações Gerais

```css
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob { animation: blob 7s infinite; }

.animate-fade-in { animation: fade-in 0.5s ease-out; }

.animate-slide-up { animation: slide-up 0.5s ease-out forwards; opacity: 0; }

.animate-shimmer { animation: shimmer 3s infinite; }
```

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de materiais e badges
- `Dialog` - Modais
- `Badge` - Badges de conquistas
- `Button` - Ações
- `LoadingState` - Carregamento
- `EmptyState` - Estado vazio

### Padrões de UI

#### Card de Material

```tsx
<Card className="liquid-glass-gold hover:scale-[1.02] transition-all">
  <CardHeader>
    <CardTitle>{material.titulo}</CardTitle>
    <CardDescription>{material.descricao}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo do material */}
  </CardContent>
</Card>
```

#### Badge de Conquista

```tsx
<div className="animate-badge-pop">
  <Badge variant="success">
    <Trophy size={14} /> {badge.nome}
  </Badge>
</div>
```

---

## Referências

- **Module:** `src/features/hub/module.ts`
- **Permissions:** `src/features/hub/permissions.ts`
- **Routes:** `src/routes/hub/`
- **Theme CSS:** `src/features/hub/lib/hub-theme.css`
- **Badge Animations:** `src/features/hub/lib/badge-animations.css`
