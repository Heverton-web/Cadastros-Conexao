# Design System - Módulo NPS

> Módulo: `nps` | Versão: 1.0.0

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

O módulo **NPS** é responsável por pesquisas de satisfação e Net Promoter Score.

**Chave:** `nps`
**Ícone:** `ClipboardCheck`
**Descrição:** Pesquisas de satisfação e Net Promoter Score

---

## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| `nps_ver_dashboard` | Ver dashboard | nps |
| `nps_ver_respostas` | Ver respostas | nps |
| `nps_gerenciar_perguntas` | Gerenciar perguntas | nps |
| `nps_gerenciar_webhooks` | Gerenciar webhooks | nps |
| `nps_excluir_respostas` | Excluir respostas | nps |
| `nps_ver_relatorios` | Ver relatórios | nps |
| `nps_exportar_dados` | Exportar dados | nps |

### Defaults por Ambiente

| Ambiente | Permissões Padrão |
|----------|-------------------|
| `cadastro` | dashboard, respostas, perguntas, relatorios, exportar: true |
| `consultor` | Todas as permissões: false |
| `tecnologia` | Todas as permissões: true |
| `suporte` | Todas as permissões: false |

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/nps` | Lista de pesquisas |
| `/nps/survey` | Pesquisa NPS |
| `/nps/dashboard` | Dashboard NPS |
| `/nps/pesquisas` | Gerenciar perguntas |
| `/nps/preview` | Preview da pesquisa |
| `/nps/relatorios` | Relatórios de envio |

---

## Eventos

### Status Change

| Evento | Descrição |
|--------|-----------|
| `nps.resposta_recebida` | Dispara quando uma resposta é submetida |
| `nps.detrator_detectado` | Dispara quando nota NPS ≤ 6 |

### Button Action

| Evento | Descrição |
|--------|-----------|
| `nps.pesquisa_enviada` | Dispara quando pesquisas são disparadas |

---

## Abas

| Aba | Descrição |
|-----|-----------|
| `geral` | Configurações gerais do NPS |
| `permissoes` | Gerenciar permissões do módulo |
| `credenciais` | Credenciais com escopo no NPS |
| `eventos` | Eventos e webhooks do NPS |

---

## Nav Items

| ID | Label | Ícone | Rota | Ordem |
|----|-------|-------|------|-------|
| `nps-dashboard` | Dashboard NPS | ClipboardCheck | `/nps/dashboard` | 15 |
| `nps-pesquisas` | Gerenciar Perguntas | Settings | `/nps/pesquisas` | 16 |
| `nps-relatorios` | Relatórios Envio | FileText | `/nps/relatorios` | 17 |
| `nps-preview` | Preview da Pesquisa | Eye | `/nps/preview` | 18 |

---

## Design System Específico

### Estilos Customizados

O módulo NPS possui estilos CSS próprios para o survey público.

### Componentes Utilizados

- `PageHeader` - Cabeçalho de página
- `Card` - Cards de informações
- `Dialog` - Modais de edição
- `Badge` - Status de respostas
- `Button` - Ações

### Padrões de UI

#### Escala NPS

| Nota | Categoria | Cor |
|------|-----------|-----|
| 0-6 | Detrator | Vermelho (`#ef4444`) |
| 7-8 | Passivo | Amarelo (`#eab308`) |
| 9-10 | Promotor | Verde (`#22c55e`) |

#### Survey NPS

```tsx
<div className="flex gap-2">
  {Array.from({ length: 11 }, (_, i) => (
    <Button
      key={i}
      variant={nota === i ? "default" : "outline"}
      className={cn(
        "w-10 h-10",
        i <= 6 && nota === i && "bg-error hover:bg-error",
        i >= 7 && i <= 8 && nota === i && "bg-warning hover:bg-warning",
        i >= 9 && nota === i && "bg-success hover:bg-success"
      )}
      onClick={() => setNota(i)}
    >
      {i}
    </Button>
  ))}
</div>
```

#### Status de Resposta

| Status | Badge | Cor |
|--------|-------|-----|
| Recebida | `badge-default` | Gold |
| Processada | `badge-success` | Verde |
| Detrator | `badge-destructive` | Vermelho |

---

## Referências

- **Module:** `src/features/nps/module.ts`
- **Permissions:** `src/features/nps/permissions.ts`
- **Routes:** `src/routes/nps/`
