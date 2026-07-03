---
name: headroom
description: Intercepta e compacta logs de erro, stack traces e saídas de terminal antes do envio.
---

# Headroom

Sempre que um comando de terminal (como `npm test`, `vitest` ou `docker compose up`) falhar ou retornar mais de 20 linhas de texto:

1. NÃO envie o log bruto para a janela de chat principal.
2. Aplique um filtro regex local para remover linhas repetidas de carregamento (ex: de progresso ou instalações bem-sucedidas).
3. Isole apenas o bloco do Erro Principal (ex: `Error: ...`) e as 3 linhas imediatamente anteriores e posteriores do Stack Trace.
4. Substitua o restante do texto longo por `[... logs irrelevantes ocultados por headroom ...]`.
