# Design System - Documentação ERP Odonto

> Última atualização: 2026-07-13

## Sumário

Esta pasta contém a documentação completa do Design System do ERP Odonto.

---

## Arquivos Disponíveis

### Design System Global

| Arquivo | Descrição |
|---------|-----------|
| [ds-erp.md](./ds-erp.md) | Design System completo do ERP (tokens, cores, tipografia, componentes, etc.) |

### Design System por Módulo

| Arquivo | Módulo | Chave |
|---------|--------|-------|
| [ds-cadastros.md](./ds-cadastros.md) | Cadastros | `cadastros` |
| [ds-crm.md](./ds-crm.md) | CRM | `crm` |
| [ds-empresas.md](./ds-empresas.md) | Empresa | `empresas-core` |
| [ds-despesas.md](./ds-despesas.md) | Despesas | `despesas` |
| [ds-funis.md](./ds-funis.md) | Funis | `funis` |
| [ds-nps.md](./ds-nps.md) | NPS | `nps` |
| [ds-catalogo.md](./ds-catalogo.md) | Catálogo | `catalogo` |
| [ds-marketing.md](./ds-marketing.md) | Marketing | `marketing` |
| [ds-rotas.md](./ds-rotas.md) | Rotas | `rotas` |
| [ds-gerador-links.md](./ds-gerador-links.md) | Gerador de Links | `gerador-links` |
| [ds-linktree.md](./ds-linktree.md) | LinkTree | `linktree` |
| [ds-mapas.md](./ds-mapas.md) | Mapas | `mapas-interativos` |
| [ds-hub.md](./ds-hub.md) | Hub | `hub` |

---

## Estrutura de Cada Arquivo

Cada arquivo de design system de módulo contém:

1. **Visão Geral** - Descrição do módulo
2. **Permissões** - Lista de permissões com descrição
3. **Rotas** - Rotas disponíveis no módulo
4. **Eventos** - Eventos do módulo (status_change e button_action)
5. **Abas** - Abas de configuração do módulo
6. **Nav Items** - Itens de navegação lateral
7. **Design System Específico** - Estilos, componentes e padrões de UI

---

## Como Usar

### Para Desenvolvedores

1. Consulte `ds-erp.md` para entender o design system global
2. Consulte o arquivo do módulo específico para padrões de UI
3. Utilize os componentes documentados em `src/components/ui/`

### Para Designers

1. Referência principal: `ds-erp.md`
2. Tokens de cores, tipografia e espaçamento estão na seção "Tokens"
3. Padrões de componentes estão na seção "Componentes"

---

## Atualização dos Documentos

Para atualizar a documentação:

1. Altere o arquivo `module.ts` do módulo
2. Execute o script de geração de documentação
3. Ou edite manualmente o arquivo `.md` correspondente

---

## Convencções

- **Tokens CSS** - Seguem o padrão `--color-*`
- **Componentes** - Seguem o padrão shadcn/ui
- **Permissões** - Chaves em snake_case
- **Eventos** - Chaves em dot.notation (ex: `cadastro.criado`)
