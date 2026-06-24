# Bubble Reverse Engineering — Squad de Skills

Squad autônomo de engenharia reversa para projetos **Bubble.io**. Analisa o JSON exportado do Bubble e gera documentação técnica completa de todos os domínios da aplicação (tabelas, páginas, workflows, option sets, API connectors, elementos reutilizáveis).

---

## Índice

- [Comandos](#comandos)
- [Pré-requisitos](#pré-requisitos)
- [Fluxo de Execução](#fluxo-de-execução)
- [Skills do Squad](#skills-do-squad)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Saída Esperada](#saída-esperada)
- [Exemplo de Uso](#exemplo-de-uso)

---

## Comandos

### `/bubble-tech-lead`

**Comando principal.** Dispara o pipeline autônomo completo de engenharia reversa.

```bash
/bubble-tech-lead
```

O que faz:
1. Faz o parse do `appBubble.json` (ou `project_bubble.json`)
2. Detecta automaticamente quais domínios existem no JSON
3. Cria tarefas (`tasks/task_*.md`) para cada domínio encontrado
4. Executa **todas** as skills em paralelo
5. Revisa as saídas automaticamente (com loop de correção de até 3 tentativas)
6. Compila os resultados em relatórios e documentos consolidados
7. Gera `INDICE.md`, relatórios por domínio e conclusões

**Regra:** O pipeline executa do início ao fim sem perguntar nada. Domínios ausentes no JSON geram documentos informando "Nenhum X encontrado" sem interromper o fluxo.

### Modo Eco (Economia de Tokens)

O pipeline suporta **Modo Eco** — sub-agentes recebem instruções em modo `caveman` e escrevem arquivos diretamente (sem round-trip de retorno). Status do orquestrador em `ultra`. Relatórios finais permanecem legíveis.

**Impacto:** ~79% menos tokens no pipeline interno, ~50% menos tokens na sessão completa.

**Referência:** `proj_reversa/references/dispatch_template_caveman.md`

### Originais das Skills

As skills comprimidas (`SKILL.md`) têm versão original preservada em `SKILL.original.md` para consulta.

## Modo Eco

O pipeline pode ser otimizado com 3 mudanças:

1. **Skills comprimidas** — `skills/*/SKILL.md` em caveman `full`. Originais em `SKILL.original.md`.
2. **Dispatches caveman** — Sub-agentes recebem instruções concisas. Template em `proj_reversa/references/dispatch_template_caveman.md`.
3. **Sub-agentes escrevem direto** — Em vez de retornar texto, escrevem arquivos e retornam só status.

### Comandos Individuais por Skill (execução manual)

Cada skill pode ser invocada separadamente caso queira processar apenas um domínio específico:

| Comando | Skill | O que faz |
|---------|-------|-----------|
| `/bubble-tabelas` | `bubble-tabelas` | Analisa Data Types do JSON |
| `/bubble-paginas` | `bubble-paginas` | Mapeia páginas e elementos visuais |
| `/bubble-workflows` | `bubble-workflows-backend` | Documenta workflows backend e de página |
| `/bubble-option-sets` | `bubble-option-sets` | Extrai Option Sets |
| `/bubble-api-connectors` | `bubble-api-connectors` | Documenta conectores de API |
| `/bubble-elementos-reutilizaveis` | `bubble-elementos-reutilizaveis` | Identifica componentes reutilizáveis |
| `/bubble-prd` | `bubble-prd` | Gera o PRD completo consolidando todas as saídas |

> **Nota:** Ao executar skills individuais, o pipeline não é completo — você precisa garantir que as dependências (JSON, saídas de outras skills) estejam disponíveis.

---

## Pré-requisitos

1. **JSON exportado do Bubble** — Arquivo `appBubble.json` (ou `project_bubble.json`) na raiz do projeto.
   - Deve ser um export válido do Bubble contendo ao menos um dos blocos: `pages`, `data_types`, `option_sets`, `api_connectors`, `backend_workflows`, `reusable_elements`.
   - Comentários `//` e `/* */` no JSON são tolerados (o squad os remove automaticamente).

2. **Ambiente de execução** — O squad é executado por um agente de IA compatível com skills (OpenCode, Claude Code, Gemini CLI, etc.).

---

## Fluxo de Execução

```
Usuário                          Squad (automático)
──────                          ──────────────────

   │
   ├─ Coloca appBubble.json na raiz
   │
   ├─ Executa: /bubble-tech-lead
   │                                │
   │                                ▼
   │                    ┌─────────────────────┐
   │                    │  FASE 0: Parse JSON │
   │                    │  - pages?           │
   │                    │  - data_types?      │
   │                    │  - option_sets?     │
   │                    │  - api_connectors?  │
   │                    │  - backend_wf?      │
   │                    │  - reusable_elem?   │
   │                    └─────────┬───────────┘
   │                              │
   │                    ┌─────────▼───────────┐
   │                    │  FASE 1: Criar      │
   │                    │  tasks/             │
   │                    └─────────┬───────────┘
   │                              │
   │                    ┌─────────▼───────────┐
   │                    │  FASE 2: Executar   │
   │                    │  skills em paralelo │
   │                    │                     │
   │                    │  ┌───────────────┐  │
   │                    │  │ bubble-tabelas│  │
   │                    │  ├───────────────┤  │
   │                    │  │ bubble-paginas│  │
   │                    │  ├───────────────┤  │
   │                    │  │ bubble-wf     │  │
   │                    │  ├───────────────┤  │
   │                    │  │ bubble-opt    │  │
   │                    │  ├───────────────┤  │
   │                    │  │ bubble-api    │  │
   │                    │  ├───────────────┤  │
   │                    │  │ bubble-elem   │  │
   │                    │  └───────────────┘  │
   │                    └─────────┬───────────┘
   │                              │
   │                    ┌─────────▼───────────┐
   │                    │  FASE 3: Revisão    │
   │                    │  automática         │
   │                    │  (loop 3x se falhar)│
   │                    └─────────┬───────────┘
   │                              │
   │                    ┌─────────▼───────────┐
   │                    │  FASE 4: Compilar   │
   │                    │  + relatórios       │
   │                    │  + índices          │
   │                    └─────────┬───────────┘
   │                              │
   ├─ Resultado pronto!            ◄──────────┘
   │
   ├─ INDICE.md
   ├─ pages_report.md
   ├─ workflows_report.md
   ├─ tables_report.md
   ├─ option_sets_report.md
   ├─ conclusoes_engenharia_reversa.md
   └─ ...
```

---

## Skills do Squad

| # | Skill | Responsabilidade | Plano de Referência |
|---|-------|-----------------|---------------------|
| 1 | `bubble-tech-lead` | Orquestrador autônomo do pipeline | `plano_squad_skills_engenharia_reversa.md` |
| 2 | `bubble-tabelas` | Data Types — campos, tipos, relacionamentos | `plano_engenharia_reversa_tabelas.md` |
| 3 | `bubble-paginas` | Páginas — layout, elementos, workflows | `plano_engenharia_reversa_paginas.md` |
| 4 | `bubble-workflows-backend` | Workflows backend e de página | `plano_engenharia_reversa_backend_workflows.md` |
| 5 | `bubble-option-sets` | Option Sets — valores e uso | `plano_engenharia_reversa_option_sets.md` |
| 6 | `bubble-api-connectors` | API Connectors — endpoints, auth | `plano_engenharia_reversa_api_connectors.md` |
| 7 | `bubble-elementos-reutilizaveis` | Elementos reutilizáveis | `plano_engenharia_reversa_elementos_reutilizaveis.md` |
| 8 | `bubble-prd` | PRD completo (consolidação) | `plano_engenharia_reversa_documentacao_completa.md` |

Cada skill está em `skills/<nome>/SKILL.md` e contém:
- **Execução autônoma**: instruções para rodar sem intervenção
- **Processamento**: fases detalhadas de análise
- **Validações**: checklist automático de qualidade
- **Casos especiais**: tratamento de bordas

---

## Estrutura do Projeto

```
bubble_reverse_engineering/
│
├── README.md                        ← Este arquivo
├── INDICE.md                        ← Índice navegável do projeto
├── conclusoes_engenharia_reversa.md ← Conclusões da análise
├── FINAL_INSTRUCTIONS.md            ← Notas finais
│
├── pages_report.md                  ← Relatório gerado: páginas
├── workflows_report.md              ← Relatório gerado: workflows
├── tables_report.md                 ← Relatório gerado: tabelas
├── option_sets_report.md            ← Relatório gerado: option sets
│
├── appBubble.json                   ← JSON de entrada (Bubble export)
│
├── skills/                          ← Definições das skills (8 agentes)
│   ├── bubble-tabelas/SKILL.md
│   ├── bubble-paginas/SKILL.md
│   ├── bubble-workflows-backend/SKILL.md
│   ├── bubble-option-sets/SKILL.md
│   ├── bubble-api-connectors/SKILL.md
│   ├── bubble-elementos-reutilizaveis/SKILL.md
│   ├── bubble-prd/SKILL.md
│   └── bubble-tech-lead/SKILL.md
│
├── tasks/                           ← Tarefas geradas pelo Tech Lead
│   ├── task_bubble-tabelas.md
│   ├── task_bubble-paginas.md
│   ├── task_bubble-workflows.md
│   ├── task_bubble-option-sets.md
│   └── task_bubble-api-connectors.md
│
└── proj_reversa/
    ├── references/
    │   ├── tasks-engenharia_reversa/  ← Planos de engenharia reversa
    │   ├── resultados/                ← Exemplos de resultado esperado
    │   └── appBubble.json
    ├── errados/                      ← Limpo (arquivos obsoletos removidos)
    └── scripts/                      ← Scripts auxiliares
```

---

## Saída Esperada

Após executar `/bubble-tech-lead`, os seguintes artefatos são gerados automaticamente:

### Relatórios por Domínio
| Arquivo | Conteúdo | Gerado se... |
|---------|----------|-------------|
| `pages_report.md` | Estrutura de páginas, elementos, workflows | `pages` existir no JSON |
| `workflows_report.md` | Workflows backend + página | Qualquer workflow existir |
| `tables_report.md` | Data Types com campos e tipos | `data_types` existir |
| `option_sets_report.md` | Option Sets com valores | `option_sets` existir |

### Documentos Consolidados
| Arquivo | Conteúdo |
|---------|----------|
| `INDICE.md` | Índice completo com links para todos os artefatos |
| `conclusoes_engenharia_reversa.md` | Sumário executivo, achados, próximos passos |

### Estrutura Interna (se gerado)
- `tables/<nome>.md` — Um arquivo por Data Type
- `pages/<nome>.md` — Um arquivo por página
- `workflows/<nome>.md` — Um arquivo por workflow
- `option_sets/<nome>.md` — Um arquivo por option set
- `documentacao_completa/PRD_DOCUMENTACAO_COMPLETA.md` — Documento mestre

---

## Exemplo de Uso

### 1. Preparar o JSON de entrada

Coloque o arquivo `appBubble.json` (exportado do Bubble) na raiz do projeto:

```
bubble_reverse_engineering/
└── appBubble.json
```

### 2. Executar o pipeline completo

Invoque o Tech Lead:

```
/bubble-tech-lead
```

O squad irá:
1. Parsear o JSON automaticamente
2. Detectar que existem `pages` e `workflows` (mas talvez não `data_types` nem `option_sets`)
3. Criar tasks apenas para os domínios encontrados
4. Executar `bubble-paginas` e `bubble-workflows-backend`
5. Para `bubble-tabelas` e `bubble-option-sets`: gerar "Nenhum X encontrado"
6 Revisar, compilar, gerar relatórios

### 3. Resultado

```
✅ Pipeline Concluído — Engenharia Reversa Bubble

Domínios Analisados:
- Páginas: ✅ 3 páginas documentadas
- Workflows: ✅ 2 workflows mapeados
- Tabelas: ⏳ Ausente no JSON (documentado)
- Option Sets: ⏳ Ausente no JSON (documentado)

Artefatos Gerados:
- pages_report.md ✅
- workflows_report.md ✅
- tables_report.md ✅
- option_sets_report.md ✅
- INDICE.md ✅
- conclusoes_engenharia_reversa.md ✅
```

### 4. Executar skill individual (opcional)

Caso queira apenas um domínio específico:

```
/bubble-paginas
```

Isso processa apenas as páginas sem executar o pipeline completo.

---

## Personalização

### Adicionar novo JSON de entrada
Substitua `appBubble.json` pelo novo export do Bubble e reexecute `/bubble-tech-lead`.

### Modificar plano de uma skill
Edite o `SKILL.md` correspondente em `skills/<nome>/` e o plano de referência em `proj_reversa/references/tasks-engenharia_reversa/`.

### Desabilitar um domínio
Remova o bloco correspondente do JSON de entrada. A skill detectará a ausência e documentará "Nenhum X encontrado".

---

## Referências

| Documento | Localização |
|-----------|-------------|
| Planos de engenharia reversa | `proj_reversa/references/tasks-engenharia_reversa/` |
| Exemplos de resultado esperado | `proj_reversa/references/resultados/` |
| Definições das skills | `skills/` |
| Tarefas do squad | `tasks/` |
| Índice completo | `INDICE.md` |
