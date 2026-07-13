# Design System - Módulo Gerador de Links

> Módulo: `gerador-links` | Versão: 1.0.0

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

O módulo **Gerador de Links** é responsável pela geração de links personalizados: WhatsApp, UTMs, Google Review, Maps, Waze e QR Code.

**Chave:** `gerador-links`
**Ícone:** `Link`
**Descrição:** Geração de links personalizados: WhatsApp, UTMs, Google Review, Maps, Waze e QR Code

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `lk_ver` | Ver links | gerador-links |
| `lk_gerar` | Gerar links | gerador-links |
| `lk_salvar` | Salvar links | gerador-links |
| `lk_editar` | Editar links | gerador-links |
| `lk_excluir` | Excluir links | gerador-links |
| `lk_gerenciar_templates` | Gerenciar templates | gerador-links |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | Todas as permissões: true |
| `tecnologia` | Todas as permissões: true |
| `consultor` | ver, gerar: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/ferramentas/links` | Dashboard |
| `/ferramentas/links/historico` | Histórico |
| `/ferramentas/links/templates` | Templates |
| `/ferramentas/links/whatsapp` | WhatsApp |
| `/ferramentas/links/utm` | UTM |
| `/ferramentas/links/google-review` | Google Review |
| `/ferramentas/links/maps` | Google Maps |
| `/ferramentas/links/waze` | Waze |
| `/ferramentas/links/qrcode` | QR Code |

---

## Eventos

### Button Action

| Evento | Descrição |
|--------|-----------|
| `link.gerado_whatsapp` | Quando um link do WhatsApp é gerado |
| `link.gerado_qrcode` | Quando um QR Code é gerado |

### Status Change

| Evento | Descrição |
|--------|-----------|
| `link.clicado` | Quando um link gerado é clicado (tracking) |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `eventos` | Eventos e webhooks do módulo |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `gerador-links-dashboard` | Dashboard | BarChart3 | `/ferramentas/links` | 10 |
| `gerador-links-historico` | Histórico | History | `/ferramentas/links/historico` | 15 |
| `gerador-links-templates` | Templates | LayoutTemplate | `/ferramentas/links/templates` | 16 |
| `gerador-links-whatsapp` | WhatsApp | MessageCircle | `/ferramentas/links/whatsapp` | 20 |
| `gerador-links-utm` | UTM | Link | `/ferramentas/links/utm` | 30 |
| `gerador-links-google-review` | Google Review | Star | `/ferramentas/links/google-review` | 40 |
| `gerador-links-maps` | Google Maps | MapPin | `/ferramentas/links/maps` | 50 |
| `gerador-links-waze` | Waze | Navigation | `/ferramentas/links/waze` | 60 |
| `gerador-links-qrcode` | QR Code | QrCode | `/ferramentas/links/qrcode` | 70 |

---

## Design System Específico

### Estilos Customizados

O módulo Gerador de Links não possui estilos CSS próprios. Utiliza o design system global do ERP Odonto.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Table` - Tabelas de links
- `Dialog` - Modais de edição
- `AlertDialog` - Confirmações
- `Badge` - Status de links
- `Button` - Ações
- `Input` - Campos de formulário

### Padrões de UI

#### Card de Link

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <MessageCircle size={18} /> WhatsApp
    </CardTitle>
    <CardDescription>Link para contato via WhatsApp</CardDescription>
  </CardHeader>
  <CardContent>
    <Input value={link} readOnly />
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" onClick={handleCopiar}>
      <Copy size={14} /> Copiar
    </Button>
    <Button variant="default" onClick={handleCompartilhar}>
      <Share2 size={14} /> Compartilhar
    </Button>
  </CardFooter>
</Card>
```

#### Status de Link

| Status | Badge | Cor |
|--------|-------|-----|
| Ativo | `badge-success` | Verde |
| Expirado | `badge-destructive` | Vermelho |
| Desativado | `badge-secondary` | Cinza |

---

## Referências

- **Module:** `src/features/gerador-links/module.ts`
- **Permissions:** `src/features/gerador-links/permissions.ts`
- **Routes:** `src/routes/ferramentas/links/`
