---
name: bubble-tech-lead
description: >
  ORQUESTRADOR AUTÔNOMO. /bubble-tech-lead → pipeline completo engenharia reversa
  Bubble. Parse JSON, cria pasta projeto, executa skills paralelo, revisa, compila,
  entrega. Zero interrupções.
---

## REGRA: ZERO INTERRUPÇÕES

Skill autônomo. Quando iniciado:

- **NÃO** pergunte "deseja prosseguir?"
- **NÃO** espere confirmação entre fases
- **NÃO** pause para revisão manual
- Execute cada fase automaticamente
- Só resultado final visível ao usuário

## Pipeline Autônomo

```
FASE 0: Parse JSON + Criar pasta projeto
FASE 1: Criar tasks dentro da pasta
FASE 2: Executar skills paralelo (salvando na pasta projeto)
FASE 3: Revisão automática
FASE 4: Compilar e entregar na pasta projeto
```

## 1. Responsabilidades

- Parsear `appBubble.json` (ou path informado)
- Extrair nome projeto do JSON (ou derivar do nome arquivo)
- **Criar pasta `analise_<nome_projeto>/`** na raiz do workspace
- Identificar domínios presentes no JSON
- Criar tasks para cada skill dentro da pasta projeto
- Executar TODAS skills (cada uma salva na pasta projeto)
- Revisar entregas com critérios automáticos
- Loop correção automático (até 3 iterações)
- Consolidar documento mestre dentro da pasta projeto
- Gerar `INDICE.md`, `conclusoes_engenharia_reversa.md` na pasta projeto
- Informar usuário só no final, com caminho completo

## 2. FASE 0: Parse JSON + Criar Pasta

```python
import json, os, re

json_path = 'appBubble.json'  # ou path informado
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extrair nome projeto
nome_projeto = None
if 'app_version' in data:
    nome_projeto = data.get('app_name', data.get('name'))
if not nome_projeto:
    nome_projeto = re.sub(r'[\\/?%*:|"<>]', '', os.path.splitext(os.path.basename(json_path))[0])
if not nome_projeto or nome_projeto == 'appBubble':
    nome_projeto = 'gestao-contratos-conexao'

nome_projeto = nome_projeto.strip().replace(' ', '_').lower()
base_dir = f'analise_{nome_projeto}'
os.makedirs(f'{base_dir}/relatorios', exist_ok=True)
os.makedirs(f'{base_dir}/tasks', exist_ok=True)
os.makedirs(f'{base_dir}/documentacao_completa', exist_ok=True)
```

### Precedência nome projeto

1. JSON `app_name`
2. JSON `name`
3. Usuário passou `@caminho/arquivo.json` → derivar do nome arquivo
4. Fallback: `gestao-contratos-conexao`

### Estrutura criada

```
analise_<nome_projeto>/
├── relatorios/
│   ├── pages_report.md
│   ├── workflows_report.md
│   ├── tables_report.md
│   └── option_sets_report.md
├── tasks/
│   ├── task_bubble-tabelas.md
│   └── task_bubble-paginas.md
├── documentacao_completa/
│   └── PRD_DOCUMENTACAO_COMPLETA.md
├── INDICE.md
└── conclusoes_engenharia_reversa.md
```

## 3. FASE 1: Criar Tasks

Para cada domínio presente no JSON, gerar `{base_dir}/tasks/task_<dominio>.md`:

- Arquivo alvo (apontando `{base_dir}/relatorios/`)
- Processamento em fases
- Validações (checklist)
- Casos especiais

Só criar tasks para domínios encontrados no JSON.

## 4. FASE 2: Executar Skills

Executar TODAS skills cujo domínio existe no JSON, passando `output_dir={base_dir}/relatorios/`:

| Domínio             | Skill                            | Pasta saída                                      |
| ------------------- | -------------------------------- | ------------------------------------------------ |
| Tabelas             | `bubble-tabelas`                 | `{base_dir}/relatorios/tabelas/`                 |
| Páginas             | `bubble-paginas`                 | `{base_dir}/relatorios/paginas/`                 |
| Workflows           | `bubble-workflows-backend`       | `{base_dir}/relatorios/workflows/`               |
| Option Sets         | `bubble-option-sets`             | `{base_dir}/relatorios/option_sets/`             |
| API Connectors      | `bubble-api-connectors`          | `{base_dir}/relatorios/api_connectors/`          |
| Elem. Reutilizáveis | `bubble-elementos-reutilizaveis` | `{base_dir}/relatorios/elementos_reutilizaveis/` |

Cada skill cria sua subpasta e salva artefatos lá.

## 5. FASE 3: Revisão Automática

Validar saída de cada skill:

- [ ] Arquivo saída existe dentro de `{base_dir}/relatorios/`?
- [ ] Não vazio (ou "Nenhum ... encontrado" explícito)?
- [ ] Formato Markdown definido?

**Loop correção (máx 3 iterações):**

```
para cada skill:
  para iteração in [1, 2, 3]:
    executar skill → salva em {base_dir}/relatorios/<dominio>/
    validar saída
    se OK → aprovar, break
    se não → re-executar skill com feedback erro
  se após 3 ainda falhar:
    marcar como "limitação conhecida", continuar
```

## 6. FASE 4: Compilar e Entregar

### 6.1 Copiar relatórios raiz pasta

Relatórios em `{base_dir}/relatorios/<dominio>/` → consolidar:

- Manter subpastas com docs individuais

### 6.2 Gerar índices raiz pasta

- `{base_dir}/INDICE.md` com links todos artefatos
- `{base_dir}/conclusoes_engenharia_reversa.md`

### 6.3 Informar usuário

### Bônus — Modo Eco (caveman)

Pipeline suporta dispatches em modo caveman `full`/`ultra`:

- Dispatches sub-agente: prefixar com `caveman: full`
- Status updates orquestrador: `ultra`
- Relatórios finais: **NÃO** comprimir (entrega humana)
- Ver `AGENTS.md` para template dispatch caveman

## 7. Modelos Referência por Domínio

| Domínio             | Skill                            | Plano Referência                                                                                       |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Tabelas             | `bubble-tabelas`                 | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_tabelas.md`                 |
| Páginas             | `bubble-paginas`                 | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_paginas.md`                 |
| Workflows           | `bubble-workflows-backend`       | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_backend_workflows.md`       |
| Option Sets         | `bubble-option-sets`             | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_option_sets.md`             |
| API Connectors      | `bubble-api-connectors`          | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_api_connectors.md`          |
| Elem. Reutilizáveis | `bubble-elementos-reutilizaveis` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_elementos_reutilizaveis.md` |
| Doc Completa        | `bubble-prd`                     | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_documentacao_completa.md`   |

## 8. Critérios Revisão Automática

| Critério        | Como validar                                     |
| --------------- | ------------------------------------------------ |
| Completude      | Arquivo saída existe em `{base_dir}/relatorios/` |
| Clareza         | Linguagem objetiva PT-BR                         |
| Consistência    | Formato tabelas, cabeçalhos uniformes            |
| Rastreabilidade | IDs referenciáveis ao JSON original              |
