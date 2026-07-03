---
name: pre-flight-check
description: Validação local obrigatória antes de qualquer modificação estrutural, refatoração de banco de dados ou deploy.
---

# Pre-flight Check

Antes de declarar uma tarefa como concluída, ou antes de rodar qualquer script de deploy (como `deploy_vps.py`), você DEVE seguir este protocolo rigoroso:

1. Execute o comando `npm run check:types` para garantir que nenhuma tipagem do TypeScript foi quebrada.
2. Execute o comando `npm run test:safe` para rodar a suíte de testes com o filtro Headroom ativo.
3. Se qualquer um dos comandos acima falhar:
   - Pare imediatamente o processo de deploy.
   - Corrija o erro localmente usando regras Lean-ctx.
   - NÃO tente adivinhar caminhos; leia o erro enxuto gerado pelo Headroom.
