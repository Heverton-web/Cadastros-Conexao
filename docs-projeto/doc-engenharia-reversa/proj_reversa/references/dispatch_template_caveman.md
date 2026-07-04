# Caveman Dispatch Template — Bubble Reverse Engineering

**Modo:** caveman `full` (instruções) / `ultra` (status)
**Regra:** Relatórios finais = modo normal. Pipeline interno = caveman.

---

## Dispatch Sub-Agente (caveman `full`)

```
caveman: full

Execute [skill-name] skill.
CRITICAL: Write output to files directly. No text return.
JSON: [json-path]
Parse: json.loads(content, strict=False) — duplicate keys.

Source: [JSON-TOP-KEY]
count: [N] entries.
Task: document all [N].
Return: markdown per entry.

Output dir: [output_dir]

Write:
  {output_dir}/relatorios/<dominio>/report.md (consolidated)
  {output_dir}/relatorios/<dominio>/<entry>.md (individual)
  {output_dir}/relatorios/<dominio>/resumo.md (index)

Validation:
  - All entries documented
  - IDs preserved
  - Deleted items flagged
```

### Exemplo Real — bubble-paginas

```
caveman: full

Execute bubble-paginas skill.
CRITICAL: Write files directly. No text return.
JSON: C:\path\to\appBubble.json
Parse: json.loads(content, strict=False)

Source: pages top-level key
19 entries total
Task: document all 19 pages — elements (recursive), workflows, popups

Output dir: C:\path\to\analise_projeto\relatorios

Write:
  paginas/pages_report.md (consolidated)
  paginas/resumo_paginas.md (index)
```

---

## Status Orquestrador (caveman `ultra`)

| Contexto      | Antes                                                                | Depois                              |
| ------------- | -------------------------------------------------------------------- | ----------------------------------- |
| Início Fase 2 | "FASE 2: Execute bubble-paginas skill (19 pages)"                    | "paginas: 19 → dispatch"            |
| Em andamento  | "FASE 2: Execute bubble-tabelas skill (26 user_types) — in_progress" | "tabelas: 26 utypes → in_progress"  |
| Concluído     | "FASE 2 completed — bubble-option-sets (20 option sets)"             | "opt_sets: 20 → done"               |
| Erro          | "ERROR: bubble-paginas failed on step 3 — invalid JSON path"         | "paginas: FAIL — invalid JSON path" |

---

## Task Files (caveman `full`)

```
# Task: bubble-<domain>

Domain: [desc] ([N] found)
JSON: [path]
Output: relatorios/<dominio>/

Pipeline:
1. Extract metadata (name, id, type)
2. Process entries recursively
3. Map relationships/hierarchy
4. Generate consolidated + individual reports

Validation:
- [ ] All [N] documented
- [ ] IDs unique
- [ ] Deleted flagged
```

---

## Regras de Uso

1. Prefixar dispatch com `caveman: full` — modo ativo durante resposta do sub-agente
2. Sub-agente escreve arquivos diretamente, retorna só `OK` / `FAIL: motivo`
3. Status logs em `ultra` — só orquestrador vê
4. Relatórios finais, PRD, README, Conclusões — **NUNCA** comprimir
5. Código em blocks — nunca comprimir
6. Auto-Clarity: se caveman criar ambiguidade técnica, reverter para normal naquele trecho
