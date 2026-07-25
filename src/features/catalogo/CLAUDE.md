# CLAUDE.md — Módulo Catálogo

## Visão Geral

Módulo completo de catálogo odontológico: produtos (implantes, abutments, kits, componentes, instrumentais), loja pública, carrinho, checkout, orçamentos, pedidos, clientes, design system da loja, importação em massa e workflows.

## Arquitetura

```
src/features/catalogo/
├── module.ts              # Registro do módulo (rotas, eventos, nav items)
├── permissions.ts         # 3 camadas: admin, colaborador, cliente
├── index.ts               # Barrel exports
├── onboarding.tsx         # Onboarding do módulo
├── types/                 # TypeScript types (700+ linhas)
│   ├── index.ts           # Tipos principais (produtos, estrutura, comercial)
│   ├── pedidos.ts         # Tipos de pedidos
│   ├── orcamentos.ts      # Tipos de orçamentos
│   └── clientes.ts        # Tipos de clientes
├── schemas/               # Validação Zod
│   ├── implantes.ts, kits.ts, componentes.ts, ...
├── services/              # Camada de dados (Supabase)
│   ├── implantes.service.ts, kits.service.ts, ...
│   ├── pedidos.service.ts, orcamentos.service.ts
│   ├── carrinho.service.ts, clientes.service.ts
├── hooks/                 # React Query hooks
│   ├── useCatalogo.ts     # Hook principal (959 linhas)
│   ├── useCatalogoEmpresa.ts, useCatalogoCliente.ts
├── components/            # UI
│   ├── admin/             # Admin CRUD (produtos, forms)
│   ├── design/            # Editor de design da loja
│   ├── CartDrawer.tsx, ProductCard.tsx, StoreLayout.tsx
├── import/                # Importação CSV em massa
│   ├── engine/            # Parser, mapper, validator, executor
│   ├── hooks/             # useImportWizard, useFileParser, etc.
├── context/               # React contexts
├── lib/                   # Utilitários (compressImage, dbError)
└── styles/                # Estilos CSS
```

## Tabelas Supabase

| Tabela | Descrição |
|---|---|
| `catalogo_implantes` | Produtos implante |
| `catalogo_abutments` | Abutments |
| `catalogo_kits` | Kits (composição N:M) |
| `catalogo_componentes` | Componentes |
| `catalogo_parafusos` / `catalogo_parafusos_retensao` | Parafusos |
| `catalogo_cicatrizadores` | Cicatrizadores |
| `catalogo_chaves`, `catalogo_fresas`, `catalogo_complementares`, `catalogo_opcionais` | Instrumentais |
| `catalogo_pedido_itens`, `catalogo_pedidos` | Pedidos |
| `catalogo_orcamentos`, `catalogo_orcamento_itens` | Orçamentos |
| `catalogo_clientes` | Clientes do catálogo |
| `catalogo_favoritos` | Favoritos |
| `catalogo_cupons` | Cupons de desconto |
| `catalogo_promocionais`, `catalogo_promocional_itens` | Pacotes promocionais |
| `catalogo_imagens_produto` | Imagens dos produtos |
| `catalogo_links_teste` | Links de teste (token) |
| `catalogo_grupo_desconto_categoria` | Grupos de desconto |
| `catalogo_design_config` | Design da loja |
| `catalogo_configuracoes` | Configurações gerais |
| `catalogo_solicitacoes_acesso` | Solicitações de acesso |
| `catalogo_*_tipos_*` | Tabelas auxiliares (tipos, famílias, linhas) |
| `catalogo_seq_proteticas`, `catalogo_seq_protetica_*` | Sequência protética |
| `catalogo_cps_tipos_workflows`, `catalogo_cps_etapas_workflows` | Workflows |

## Hierarquia de Produtos

```
Categoria → Conexão → Família → Linha → Implante
                                         ↓
                                    Abutment (tipo_reabilitacao → tipo_abutment)
                                         ↓
                                    Componente (tipo_componente)
                                         ↓
                                    Parafuso → Chave
                                         ↓
                                    Cicatrizador

Kit → { Chaves, Fresas, Complementares, Opcionais } (N:M)
```

## Permissões

- **Admin**: `catalogo_gerenciar_produtos`, `catalogo_gerenciar_clientes`, etc.
- **Colaborador**: `catalogo_colab_criar_orcamento`, `catalogo_colab_ver_precos`, etc.
- **Cliente**: `catalogo_cliente_ver_produtos`, `catalogo_cliente_comprar`, etc.

## Rotas

| Rota | Descrição |
|---|---|
| `/catalogo` | Loja pública |
| `/catalogo/admin/*` | Painel admin |
| `/loja/$slug` | Loja por empresa |
| `/loja/$slug/login` | Login cliente |
| `/loja/$slug/pedidos` | Pedidos cliente |
| `/loja/$slug/favoritos` | Favoritos cliente |
| `/loja/$slug/orcamento/$token` | Orçamento público |

## Eventos (Central de Ações)

Produto: `produto.criado`, `produto.atualizado`, `produto.removido`
Orçamento: `orcamento.criado`, `orcamento.enviado`, `orcamento.aprovado`, `orcamento.reprovado`, `orcamento.pedido_criado`
Pedido: `pedido.criado`, `pedido.pago`, `pedido.confirmado`, `pedido.enviado`, `pedido.entregue`, `pedido.cancelado`
Cliente: `cliente.credencial_criada`
Solicitação: `solicitacao_acesso.criada`, `solicitacao_acesso.aprovada`, `solicitacao_acesso.rejeitada`
Promoção: `promocional.criado`, `cupom.utilizado`

## Comandos

```bash
npm run build    # Verificar build
npm run lint     # Lint
npm run format   # Formatação
```

## Regras

- **RLS ativo** em `catalogo_clientes`, `catalogo_pedidos`, `catalogo_pedido_itens`, `catalogo_favoritos`, `catalogo_orcamentos`, `catalogo_orcamento_itens`
- Usar `RequirePermission` em todas as rotas admin
- Dialogs: `DialogContent flex flex-col max-h-[85vh] overflow-hidden`
- **PROIBIDO** `window.confirm()`, `window.alert()`
