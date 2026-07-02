---
nome: modulo-completo
categoria: Pipeline de modulo
gatilho: manual
base-teorica: workflow modulo-completo.mjs ( Documentacao → Design → Responsividade)
---

# Loop Modulo Completo

## Descricao

Loop que executa o pipeline completo de um modulo ERP (Documentacao, Design Frontend, Responsividade) e itera ate que todas as fases passem, o build compile, e o usuario confirme o visual.

## Use quando

Quando o usuario pedir para "rodar o modulo completo", "aplicar design e responsividade", ou "finalizar o modulo" — e o resultado precisa ser verificado e corrigido automaticamente ate ficar pronto.

## Entradas

1. **modulo** (obrigatorio): chave do modulo (ex: `funis`, `cadastros`, `crm`)
2. **confirmar_visual** (padrao: true): se true, o loop para apenas quando o usuario confirma que o design ficou bom

## Meta

Todas as condicoes verdadeiras:
- Documentacao gerada em `docs-projeto/doc-modulos/mod-<modulo>/<modulo>.md`
- Design frontend aplicado em todos os componentes do modulo
- Responsividade analisada e corrigida
- `npx tsc --noEmit` passa sem erros novos
- `npm run build` compila sem erros
- Usuario confirma que o visual ficou bom (se confirmar_visual = true)

## Verificacao (o check que manda)

A cada volta, RODE o check e COLE a saida na conversa:

- **Check:** 
  1. `npx tsc --noEmit` — deve sair sem erros novos (erros pre-existentes sao ignorados)
  2. `npm run build` — deve compilar sem erros
  3. Verificar se os arquivos foram gerados:
     - `test -f docs-projeto/doc-modulos/mod-<modulo>/<modulo>.md && echo "DOC_OK" || echo "DOC_FAIL"`
     - `git diff --stat src/features/<modulo>/` — deve mostrar alteracoes no design
  4. Perguntar ao usuario: "O visual ficou bom? Responda sim ou nao com detalhes"

- **Pronto =** tsc passa + build passa + arquivos existem + usuario responde "sim"

## Passos da volta

0. **Setup (1a volta):** pergunte ao usuario o nome do modulo. Fixe para a execucao inteira.
1. **Fase 1 — Documentacao:** execute a skill `documentar-modulo` para o modulo. Cole o resultado.
2. **Fase 2 — Design Frontend:** execute a skill `design-frontend` para o modulo. Cole o resultado.
3. **Fase 3 — Responsividade:** execute a skill `responsividade` para o modulo. Cole o resultado.
4. **Check TypeScript:** rode `npx tsc --noEmit`. Cole a saida. Se houver erros novos, corrija e volte ao passo 4.
5. **Check Build:** rode `npm run build`. Cole a saida. Se falhar, corrija e volte ao passo 5.
6. **Verificacao de arquivos:** confirme que os documentos foram gerados.
7. **Confirmacao visual:** pergunte ao usuario se o design ficou bom. Se nao, identifique o que precisa mudar e volte ao passo 2 (apenas Design Frontend).
8. **Registro:** salve o progresso em `loops/modulo-completo-<modulo>-progresso.md`.

## Estados de parada

- **sucesso:** tsc passa + build passa + arquivos existem + usuario confirma visual
- **sem-progresso:** 3 voltas sem ganho medivel (mesmos erros repetidos)
- **bloqueado:** erro que o agente nao consegue resolver sozinho (ex: dependencia quebrada, API externa fora)
- **esgotado:** atingiu 10 turnos ou R$ 50 em tokens

(Erro ou budget estourado NUNCA e sucesso.)

## Guardrails

- Teto: 10 turnos ou R$ 50
- Aprovação humana antes de: push para producao, modificacao de migrations, alteracao de permissoes
- NUNCA alterar logica de negocio — apenas CSS/Tailwind e documentacao
- NUNCA criar novos elementos JSX — apenas reaplicar classes

## Memoria / estado

Arquivo `loops/modulo-completo-<modulo>-progresso.md` com:
- Numero da volta atual
- Status de cada fase (success/failed/pending)
- Erros encontrados e como foram resolvidos
- Timestamp de cada volta

## Sub-loops

Nao se aplica — este e o loop principal.

## Por que funciona

- **Check externo:** tsc e build sao deterministicos, nao dependem de juizo do agente
- **Separacao de fases:** cada fase tem sua propria verificacao, facilitando isolar problemas
- **Confirmacao humana:** o usuario e o juiz final do visual, evitando reward hacking
- **Estado em disco:** progresso persiste entre voltas, permitindo contexto fresco
- **Reversao:** se uma volta piora algo, o diff mostra e pode ser revertido

## Como acionar

Loop curto/medio (cabe no contexto) — comando `/goal`:

> /goal Use o loop modulo-completo. Peca ao usuario o nome do modulo. Execute as 3 fases (Documentacao, Design Frontend, Responsividade) e itere ate que: (1) npx tsc --noEmit passe sem erros novos, (2) npm run build compile, (3) os documentos sejam gerados, (4) o usuario confirme que o visual ficou bom. Se o usuario dizer que nao ficou bom, corrija apenas o Design Frontend e refaca o check. Pare apos 10 turnos ou R$ 50.

## Metrica de saude

custo por mudanca aceita = tokens (ou R$) / numero de fases que sobreviveram a verificacao.

Um loop que roda 3 fases e todas passam de primeira = custo ideal.
Um que itera 5 vezes = investigar por que as fases iniciais falharam.
