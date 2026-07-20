# GEMINI.md — Regras Globais

**Idioma:** PT-BR sempre.

## Economia de Tokens

- Respostas concisas, sem filler
- Tool calls agrupados em paralelo
- `grep` antes de `read`/`view_file`
- Nunca ler arquivo inteiro se só precisa de 10 linhas
- Usar `/clear` entre tarefas grandes

## Padrão de Resposta

- Sem greetings ("Claro, posso ajudar!")
- Sem re-emissão de arquivos inteiros
- Diffs cirúrgicos, não reescritas completas
- Explicações SOMENTE com "?" no prompt do usuário
