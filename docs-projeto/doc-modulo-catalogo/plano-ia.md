## Objetivo

Entregar a plataforma **Conexão Implantes** navegável em React + TanStack Start, com o design system Dark Gold, as 5 páginas do blueprint conectadas por rotas, todas as 5 regras de negócio já implementadas no código e uma camada de dados **mock** que segue exatamente a tipagem das 24 tabelas, isolada num único módulo — pronta para ser trocada por chamadas ao Supabase depois.

## Arquitetura

- Stack: TanStack Start (já configurado). Sem `src/pages/` — tudo em `src/routes/`.
- Design system: injetar os tokens do `globals.css` (Dark Gold) em `src/styles.css` como variáveis nativas + utilitários `.bg-gradient-gold` / `.text-gradient-gold`, sem tocar no bloco `@theme` do shadcn (o tema fica intacto, conforme pedido).
- Favicon: copiar `user-uploads://favicon.png` para `public/favicon.png`, remover `public/favicon.ico`, atualizar `__root.tsx` (`<link rel=icon>`, title/description/OG para "Conexão Implantes").
- Camada de dados: `src/data/database.ts` (tipos das 24 tabelas) + `src/data/mock.ts` (dataset coerente cobrindo NP/GMF, Flex Gold, protocolos Hard/Soft, workflow digital, kit Master Flex com BOM misto). Um único ponto para trocar por Supabase.
- Repositório: `src/data/repo.ts` expõe funções assíncronas (`listImplantesAtivos`, `getImplanteDetalhe`, `listEtapasWorkflow`, `getKitBOM`, `toggleAtivo`, etc.). Hoje leem do mock; amanhã lêem do Supabase — as páginas não mudam.

## Estrutura de rotas (TanStack file-based)

```text
src/routes/
  __root.tsx                       (branding, favicon, meta OG globais)
  index.tsx                        (Home — hub Implantes/Componentes/Kits)
  catalogo.implantes.tsx           (grid de ProductCard, filtra linha.ativo===false)
  catalogo.componentes.tsx         (grid de workflows disponíveis)
  catalogo.kits.tsx                (grid de kits ativos)
  implantes.$sku.tsx               (ImplanteDetail + Timeline Hard/Soft)
  workflows.$id.tsx                (WorkflowDetail + Cross-sell obrigatório)
  kits.$sku.tsx                    (KitDetail + BOM Arco Exclusivo)
  admin.produtos.tsx               (ProdutosCrud com toggle ativo)
```

Cada rota define `head()` próprio (título/description/OG), `errorComponent` e `notFoundComponent` conforme padrão do template.

## Componentes

`src/components/`:

- `StoreLayout.tsx` — header sticky com nav (`Link` do TanStack, não `<a>`), busca, badge de carrinho.
- `AdminLayout.tsx` — sidebar dourada com nav para admin.
- `ProductCard.tsx` — recebe `corIdentificacao` (hex do banco) e aplica em `style={{ borderLeftColor }}` dinamicamente.
- `DataTable.tsx` — toggle Eye/EyeOff que chama `onToggle(sku, novoEstado)`.

## Regras de negócio (implementação exata)

1. **Filtro de cascata `ativo`** — em `repo.listImplantesAtivos()`: parte de `linhas.filter(l => l.ativo)`, deriva `linhaIds`, filtra `implantes.filter(i => linhaIds.has(i.linha_id) && i.ativo !== false)`. Idem para kits (`kits.ativo`). O toggle no `ProdutosCrud` atualiza o mock em memória e as listagens refletem imediatamente (via `queryClient.invalidateQueries` ou store leve em `zustand`-free — usaremos um `useSyncExternalStore` simples sobre o módulo mock, sem nova dependência).
2. **Cross-sell obrigatório** — em `WorkflowDetail`: ao clicar numa etapa, `repo.getFerramentasObrigatorias(acessorio_sku)` faz join em `acessorio_ferramental` filtrando `obrigatorio === true`. Se retornar ≥1, abre modal listando dinamicamente cada ferramenta (nome + SKU vindos de `chaves_ferramentais`), com CTAs "Apenas a peça" e "Levar peça + ferramenta". Nunca hardcode "Sonda"; o modal itera o array.
3. **BOM Arco Exclusivo** — em `KitDetail`: `repo.getKitBOM(kit_sku)` mapeia cada `kit_composicao` detectando qual FK está preenchida (`fresa_sku` | `chave_sku` | `acessorio_sku` | `instrumental_sku` | `implante_sku`), resolve `nome` na tabela correta e devolve `{ tipo, nome, sku, qtd }`. Uma função `resolveBOMItem(row)` centraliza o switch, garantindo que dá para adicionar novos tipos sem quebrar.
4. **Timeline Hard/Soft** — em `ImplanteDetail`: state `tipoOsso: 'Hard'|'Soft'`, itera `protocolos_fresagem.filter(p => p.implante_sku === sku && p.tipo_osso.startsWith(tipoOsso)).sort(ordem_uso)` e renderiza a timeline com o SKU e nome da fresa (join em `fresas`).
5. **UI dinâmica no ProductCard** — cor puxada de `familias.cor_identificacao` (hex string do banco) e aplicada via `style={{ borderLeftColor: cor, borderLeftWidth: 4 }}`. Sem classe estática.

## Preparação para Supabase (sem ativar agora)

- Todos os fetches passam por `src/data/repo.ts` retornando `Promise`.
- Um comentário no topo de `repo.ts` documenta o mapa "função → tabela/consulta Supabase" para a migração futura.
- `.env.example` com `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` comentados.
- Nenhuma dependência de Supabase adicionada agora — evita build vermelho até o Cloud ser ativado.

## Fora de escopo desta entrega

- Ativação do Lovable Cloud, criação das 24 tabelas, RLS, seeds SQL, constraint SQL do Arco Exclusivo (fica para o próximo turno, quando você aprovar).
- Carrinho/checkout reais, autenticação, dashboard admin além do CRUD de SKUs.
- Upload de imagens de implantes/kits — usaremos placeholders visuais (já no blueprint).

## Entregáveis

1. `src/styles.css` estendido com tokens Dark Gold + utilitários gold.
2. `public/favicon.png` + `__root.tsx` com branding "Conexão Implantes".
3. `src/data/{database.ts, mock.ts, repo.ts, store.ts}`.
4. `src/components/{StoreLayout, AdminLayout, ProductCard, DataTable}.tsx`.
5. 9 arquivos de rota listados acima, cada um com `head()` próprio.
6. README curto em `src/data/README.md` explicando como plugar Supabase.

Aprove para eu construir.
