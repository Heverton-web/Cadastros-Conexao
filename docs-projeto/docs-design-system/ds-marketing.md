# Design System - Módulo Marketing

> Módulo: `marketing` | Versão: 1.0.0

## Sumário

1. [Visão Geral](#visão-geral)
2. [Sub-módulos](#sub-módulos)
3. [Design System Específico](#design-system-específico)

---

## Visão Geral

O módulo **Marketing** é responsável pelo marketing digital e suas diversas ferramentas.

**Chave:** `marketing`
**Ícone:** `Megaphone`
**Descrição:** Modulo de Marketing Digital - Visao geral

---

## Sub-módulos

### 1. Dashboard

**Chave:** `marketing-dashboard`
**Rota:** `/marketing/dashboard`
**Descrição:** Dashboard geral de marketing

### 2. Leads

**Chave:** `marketing-leads`
**Rota:** `/marketing/leads`
**Descrição:** Gestão de leads

### 3. UTMs

**Chave:** `marketing-utms`
**Rota:** `/marketing/utms`
**Descrição:** Gerenciamento de UTMs

### 4. SEO

**Chave:** `marketing-seo`
**Rota:** `/marketing/seo`
**Descrição:** Otimização para mecanismos de busca

### 5. Pixels

**Chave:** `marketing-pixels`
**Rota:** `/marketing/pixels`
**Descrição:** Gerenciamento de pixels de rastreamento

### 6. Meta BM

**Chave:** `marketing-meta-bm`
**Rota:** `/marketing/meta-bm`
**Descrição:** Integração com Meta Business Manager

### 7. Landing Pages

**Chave:** `marketing-landing-pages`
**Rota:** `/marketing/landing-pages`
**Descrição:** Criação e gerenciamento de landing pages

### 8. Calendário Editorial

**Chave:** `marketing-calendario-editorial`
**Rota:** `/marketing/calendario-editorial`
**Descrição:** Calendário de publicações

### 9. Email Marketing

**Chave:** `marketing-email-marketing`
**Rota:** `/marketing/email-marketing`
**Descrição:** Campanhas de email marketing

### 10. WhatsApp

**Chave:** `marketing-whatsapp`
**Rota:** `/marketing/whatsapp`
**Descrição:** Integração com WhatsApp

### 11. Linktree

**Chave:** `marketing-linktree`
**Rota:** `/marketing/linktree`
**Descrição:** Página de links

### 12. Criativos

**Chave:** `marketing-criativos`
**Rota:** `/marketing/criativos`
**Descrição:** Criação de criativos

---

## Design System Específico

### Estilos Customizados

O módulo Marketing não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Table` - Tabelas de dados
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status
- `Button` - Ações
- `Input` - Campos de formulário
- `Select` - Seleções
- `Tabs` - Abas

### Padrões de UI

#### Cards de Métricas

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Card>
    <CardHeader>
      <CardDescription>Visitas</CardDescription>
      <CardTitle className="text-2xl">12.345</CardTitle>
    </CardHeader>
  </Card>
  <Card>
    <CardHeader>
      <CardDescription>Leads</CardDescription>
      <CardTitle className="text-2xl">1.234</CardTitle>
    </CardHeader>
  </Card>
  <Card>
    <CardHeader>
      <CardDescription>Conversões</CardDescription>
      <CardTitle className="text-2xl">456</CardTitle>
    </CardHeader>
  </Card>
  <Card>
    <CardHeader>
      <CardDescription>Receita</CardDescription>
      <CardTitle className="text-2xl text-success">R$ 123.456</CardTitle>
    </CardHeader>
  </Card>
</div>
```

#### Status de Campanha

| Status | Badge | Cor |
|--------|-------|-----|
| Ativa | `badge-success` | Verde |
| Pausada | `badge-warning` | Amarelo |
| Finalizada | `badge-secondary` | Cinza |
| Erro | `badge-destructive` | Vermelho |

#### Status de Email

| Status | Badge | Cor |
|--------|-------|-----|
| Enviado | `badge-success` | Verde |
| Agendado | `badge-default` | Gold |
| Rascunho | `badge-secondary` | Cinza |
| Erro | `badge-destructive` | Vermelho |

---

## Referências

- **Module:** `src/features/marketing/module.ts`
- **Sub-modules:** `src/features/marketing/*/module.ts`
- **Routes:** `src/routes/marketing/`
