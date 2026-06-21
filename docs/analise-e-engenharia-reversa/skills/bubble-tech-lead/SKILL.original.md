---
name: bubble-tech-lead
description: >
  ORQUESTRADOR AUTÔNOMO. Ao ser invocado via /bubble-tech-lead, executa TODO o
  pipeline de engenharia reversa do Bubble do início ao fim, sem perguntar nada
  ao usuário. Parseia o JSON, cria pasta específica do projeto, executa TODAS
  as skills em paralelo, revisa, compila e entrega dentro da pasta do projeto.
---

## REGRA FUNDAMENTAL: ZERO INTERRUPÇÕES

Este skill é **completamente autônomo**. Quando iniciado:
- **NÃO** pergunte "deseja prosseguir?"
- **NÃO** espere confirmação do usuário entre fases
- **NÃO** pause para revisão manual
- Execute cada fase automaticamente e passe para a próxima
- O usuário só verá o resultado final

## Pipeline Autônomo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PIPELINE AUTÔNOMO (1 execução)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FASE 0: Parse JSON + Criar pasta do projeto                           │
│  ├─ Identificar domínios no JSON                                       │
│  ├─ Extrair nome do projeto (app_name, metadata ou nome do JSON)       │
│  └─ Criar pasta `analise_<nome_projeto>/`                               │
│                                                                         │
│  FASE 1: Criar tasks dentro da pasta do projeto                        │
│  ├─ Gerar task_*.md para cada domínio presente                         │
│  └─ Salvar em `analise_<projeto>/tasks/`                               │
│                                                                         │
│  FASE 2: Executar skills (paralelo, salvando na pasta do projeto)      │
│  ├─ Cada skill recebe `output_dir = analise_<projeto>/`                 │
│  ├─ Cada skill salva em `analise_<projeto>/relatorios/<dominio>/`       │
│  └─ Domínios ausentes geram "Nenhum X encontrado"                      │
│                                                                         │
│  FASE 3: Revisão automática                                            │
│  └─ Validar saídas dentro da pasta do projeto                           │
│                                                                         │
│  FASE 4: Compilar e entregar na pasta do projeto                       │
│  ├─ Consolidar em `analise_<projeto>/documentacao_completa/`            │
│  ├─ Gerar INDICE.md, conclusoes na raiz da pasta                       │
│  └─ Informar usuário com caminho completo                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 1. Responsabilidades

- Parsear `appBubble.json` (ou path informado) automaticamente
- Extrair nome do projeto do JSON (ou derivar do nome do arquivo)
- **Criar pasta `analise_<nome_projeto>/`** na raiz do workspace
- Identificar domínios presentes no JSON
- Criar tasks para cada skill dentro da pasta do projeto
- Executar TODAS as skills (cada uma salva na pasta do projeto)
- Revisar entregas com critérios automáticos
- Loop de correção automático (até 3 iterações)
- Consolidar documento mestre dentro da pasta do projeto
- Gerar `INDICE.md`, `conclusoes_engenharia_reversa.md` na pasta do projeto
- Informar usuário apenas no final, com caminho completo

## 2. FASE 0: Parse JSON + Criar Pasta do Projeto

```python
import json, os, re

json_path = 'appBubble.json'  # ou path informado pelo usuário
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extrair nome do projeto
nome_projeto = None
# Tenta obter de metadados comuns do Bubble
if 'app_version' in data:
    nome_projeto = data.get('app_name', data.get('name', None))
if not nome_projeto:
    # Fallback: derivar do nome do arquivo JSON
    nome_projeto = re.sub(r'[\\/?%*:|"<>]', '', os.path.splitext(os.path.basename(json_path))[0])
if not nome_projeto or nome_projeto == 'appBubble':
    nome_projeto = 'gestao-contratos-conexao'  # nome padrão

# Sanitizar nome
nome_projeto = nome_projeto.strip().replace(' ', '_').lower()

# Criar pasta raiz do projeto
base_dir = f'analise_{nome_projeto}'
os.makedirs(f'{base_dir}/relatorios', exist_ok=True)
os.makedirs(f'{base_dir}/tasks', exist_ok=True)
os.makedirs(f'{base_dir}/documentacao_completa', exist_ok=True)
```

### Regras para nome do projeto (em ordem de precedência)
1. Se o JSON tiver `app_name` → usar esse valor
2. Se o JSON tiver `name` → usar esse valor
3. Se o usuário passou `@caminho/arquivo.json` → derivar do nome do arquivo
4. Fallback: `gestao-contratos-conexao`

### Estrutura de pastas criada automaticamente

```
analise_<nome_projeto>/
├── relatorios/
│   ├── pages_report.md
│   ├── workflows_report.md
│   ├── tables_report.md
│   └── option_sets_report.md
├── tasks/
│   ├── task_bubble-tabelas.md
│   ├── task_bubble-paginas.md
│   └── ...
├── documentacao_completa/
│   └── PRD_DOCUMENTACAO_COMPLETA.md
├── INDICE.md
└── conclusoes_engenharia_reversa.md
```

## 3. FASE 1: Criar Tasks (automático, dentro da pasta)

Para cada domínio presente no JSON, gerar `{base_dir}/tasks/task_<dominio>.md`:
- Arquivo alvo (apontando para `{base_dir}/relatorios/`)
- Processamento em fases
- Validações (checklist)
- Casos especiais

Só criar tasks para domínios realmente encontrados no JSON.

## 4. FASE 2: Executar Skills

Executar TODAS as skills cujo domínio existe no JSON, passando `output_dir={base_dir}/relatorios/`:

| Domínio | Skill | Pasta de saída |
|---------|-------|----------------|
| Tabelas | `bubble-tabelas` | `{base_dir}/relatorios/tabelas/` |
| Páginas | `bubble-paginas` | `{base_dir}/relatorios/paginas/` |
| Workflows | `bubble-workflows-backend` | `{base_dir}/relatorios/workflows/` |
| Option Sets | `bubble-option-sets` | `{base_dir}/relatorios/option_sets/` |
| API Connectors | `bubble-api-connectors` | `{base_dir}/relatorios/api_connectors/` |
| Elem. Reutilizáveis | `bubble-elementos-reutilizaveis` | `{base_dir}/relatorios/elementos_reutilizaveis/` |

Cada skill cria sua subpasta automaticamente e salva os artefatos lá.

## 5. FASE 3: Revisão Automática

Validar saída de cada skill contra:
- [ ] Arquivo de saída foi gerado dentro de `{base_dir}/relatorios/`?
- [ ] Não está vazio (ou tem "Nenhum ... encontrado" explícito)?
- [ ] Segue o formato Markdown definido?

**Loop de correção automático (máx 3 iterações):**
```
para cada skill:
  para iteração in [1, 2, 3]:
    executar skill → salva em {base_dir}/relatorios/<dominio>/
    validar saída
    se OK → aprovar, break
    se não → re-executar skill com feedback do erro
  se após 3 iterações ainda falhar:
    marcar como "limitação conhecida" e continuar
```

## 6. FASE 4: Compilar e Entregar (dentro da pasta do projeto)

### 6.1 Copiar relatórios para a raiz da pasta
Os relatórios gerados em `{base_dir}/relatorios/` são copiados/consolidados:
- `{base_dir}/relatorios/paginas/pages_report.md` → `{base_dir}/relatorios/pages_report.md`
- Manter subpastas com documentos individuais

### 6.2 Gerar índices na raiz da pasta
- `{base_dir}/INDICE.md` com links para todos os artefatos
- `{base_dir}/conclusoes_engenharia_reversa.md`

### 6.3 Informar usuário
```
## ✅ Pipeline Concluído — Engenharia Reversa Bubble

### Projeto: [nome_projeto]
### Pasta: analise_[nome_projeto]/

### Domínios Analisados
- [domínio 1] ✅ → relatorios/
- [domínio 2] ✅ → relatorios/
- [domínio 3] ⏳ (não presente no JSON)

### Artefatos Gerados
- analise_[projeto]/relatorios/pages_report.md ✅
- analise_[projeto]/relatorios/workflows_report.md ✅
- analise_[projeto]/relatorios/option_sets_report.md ✅
- analise_[projeto]/tasks/ ✅
- analise_[projeto]/INDICE.md ✅
- analise_[projeto]/conclusoes_engenharia_reversa.md ✅

### Limitações Conhecidas
- [se houver]
```

## 7. Modelos de Referência por Domínio

| Domínio | Skill | Plano de Referência |
|---------|-------|---------------------|
| Tabelas | `bubble-tabelas` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_tabelas.md` |
| Páginas | `bubble-paginas` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_paginas.md` |
| Workflows | `bubble-workflows-backend` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_backend_workflows.md` |
| Option Sets | `bubble-option-sets` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_option_sets.md` |
| API Connectors | `bubble-api-connectors` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_api_connectors.md` |
| Elem. Reutilizáveis | `bubble-elementos-reutilizaveis` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_elementos_reutilizaveis.md` |
| Documentação Completa | `bubble-prd` | `proj_reversa/references/tasks-engenharia_reversa/plano_engenharia_reversa_documentacao_completa.md` |

## 8. Critérios de Revisão Automática

| Critério | Como validar |
|----------|-------------|
| Completude | Arquivo de saída existe dentro de `{base_dir}/relatorios/` |
| Clareza | Linguagem objetiva PT-BR |
| Consistência | Formato de tabelas, cabeçalhos uniformes |
| Rastreabilidade | IDs referenciáveis ao JSON original |

## 9. Exemplo de Estrutura Gerada

Executando `/bubble-tech-lead @appBubble.json` com projeto "gestao-contratos-conexao":

```
analise_gestao-contratos-conexao/
├── INDICE.md
├── conclusoes_engenharia_reversa.md
├── tasks/
│   ├── task_bubble-paginas.md
│   └── task_bubble-option-sets.md
├── relatorios/
│   ├── pages_report.md
│   ├── workflows_report.md
│   ├── option_sets_report.md
│   ├── paginas/
│   │   └── reset_pw.md
│   └── option_sets/
│       ├── Cadastro_Departamento.md
│       └── ...
└── documentacao_completa/
    └── PRD_DOCUMENTACAO_COMPLETA.md
```
