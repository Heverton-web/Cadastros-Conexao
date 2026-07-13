---
name: lean-ctx
description: Força o agente a inspecionar arquivos usando análise estrutural em vez de leitura crua.
---

# Lean Context

Quando instruído a entender um arquivo ou diretório:

1. Use comandos locais de AST do TypeScript (`tsc --showConfig` ou parsers locais) para extrair interfaces.
2. Identifique os pontos de entrada de tipo no `tsconfig.json`.
3. Não leia corpos de funções a menos que precise editá-los diretamente.
