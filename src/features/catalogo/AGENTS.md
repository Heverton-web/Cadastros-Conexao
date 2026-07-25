# AGENTS.md — Módulo Catálogo

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Visão Geral

Módulo de catálogo odontológico completo: produtos, loja, carrinho, checkout, orçamentos, pedidos, clientes, design, importação e workflows.

## Estrutura

```
src/features/catalogo/
├── module.ts              # Registro (rotas, eventos, nav, permissões)
├── permissions.ts         # 3 camadas: admin, colaborador, cliente
├── types/                 # TypeScript (700+ linhas)
├── schemas/               # Zod validation
├── services/              # Supabase data access (30+ arquivos)
├── hooks/                 # React Query hooks
│   └── useCatalogo.ts     # Principal (959 linhas)
├── components/            # UI
│   ├── admin/             # CRUD admin (produtos, forms)
│   └── design/            # Editor design loja
├── import/                # Importação CSV em massa
├── context/               # React contexts
├── lib/                   # Utilitários
└── styles/                # CSS
```

## Tabelas Principais

**Produtos:** `catalogo_implantes`, `catalogo_abutments`, `catalogo_kits`, `catalogo_componentes`, `catalogo_parafusos`, `catalogo_cicatrizadores`, `catalogo_chaves`, `catalogo_fresas`, `catalogo_complementares`, `catalogo_opcionais`

**Comércio:** `catalogo_pedidos`, `catalogo_pedido_itens`, `catalogo_orcamentos`, `catalogo_orcamento_itens`, `catalogo_clientes`, `catalogo_favoritos`, `catalogo_cupons`, `catalogo_promocionais`

**Estrutura:** `catalogo_categorias`, `catalogo_ips_conexoes`, `catalogo_ips_familias`, `catalogo_ips_linhas`

**Pivot (N:M):** `catalogo_implante_abutment`, `catalogo_implante_chaves`, `catalogo_kit_chaves`, `catalogo_kit_fresas`, etc.

**RLS ativo:** `catalogo_clientes`, `catalogo_pedidos`, `catalogo_pedido_itens`, `catalogo_favoritos`, `catalogo_orcamentos`, `catalogo_orcamento_itens`

## Hierarquia

```
Categoria → Conexão → Família → Linha → Implante
                                         ├→ Abutment
                                         ├→ Componente
                                         ├→ Parafuso → Chave
                                         └→ Cicatrizador

Kit → { Chaves, Fresas, Complementares, Opcionais } (N:M)
```

## Permissões

- **Admin:** `catalogo_gerenciar_produtos`, `catalogo_gerenciar_clientes`, `catalogo_gerenciar_pedidos`, etc.
- **Colaborador:** `catalogo_colab_criar_orcamento`, `catalogo_colab_ver_precos`, etc.
- **Cliente:** `catalogo_cliente_ver_produtos`, `catalogo_cliente_comprar`, etc.

## Rotas

| Rota | Descrição |
|---|---|
| `/catalogo` | Loja pública |
| `/catalogo/admin/*` | Painel admin |
| `/loja/$slug` | Loja por empresa |
| `/loja/$slug/login` | Login cliente |
| `/loja/$slug/pedidos` | Pedidos cliente |
| `/loja/$slug/favoritos` | Favoritos |
| `/loja/$slug/orcamento/$token` | Orçamento público |

## Eventos

Produto: `produto.criado`, `produto.atualizado`, `produto.removido`
Orçamento: `orcamento.criado`, `orcamento.enviado`, `orcamento.aprovado`, `orcamento.reprovado`, `orcamento.pedido_criado`
Pedido: `pedido.criado`, `pedido.pago`, `pedido.confirmado`, `pedido.enviado`, `pedido.entregue`, `pedido.cancelado`
Cliente: `cliente.credencial_criada`
Solicitação: `solicitacao_acesso.criada`, `solicitacao_acesso.aprovada`, `solicitacao_acesso.rejeitada`

## Regras de UI

- **PROIBIDO** `window.confirm()`, `window.alert()`, `window.prompt()`
- **OBRIGATÓRIO** `AlertDialog` (exclusões) ou `Dialog` (conteúdo)
- Dialogs: `DialogContent flex flex-col max-h-[85vh] overflow-hidden`
- Rotas admin: `RequirePermission` obrigatório

## Importação CSV

Pipeline: `FileParser → ColumnMapper → RowValidator → Executor`
Hooks: `useImportWizard`, `useFileParser`, `useColumnMapper`, `useRowValidator`, `useImportExecutor`

## Comandos

```bash
npm run build    # Verificar build
npm run lint     # Lint
npm run format   # Formatação
```

## Economia de Tokens

- **Lean-CTX:** ler assinaturas antes de corpos
- **Headroom:** comprimir logs de erro
- **Caveman:** respostas telegráficas
- Nunca ler arquivo inteiro sem necessidade
