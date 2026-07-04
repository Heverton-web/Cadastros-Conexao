# Guia Completo: Arquitetura MiMoCode

## Visao Geral — A Analogy da Cozinha

Imagine que o modelo de IA e um **chef**. Os recursos abaixo sao os **ingredientes, ferramentas e receitas** que voce fornece para ele cozinhar bem.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CHEF (Modelo de IA)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   REGRAS    │  │  HABILIDADES│  │ FERRAMENTAS │              │
│  │  (Rules)    │  │  (Skills)   │  │   (MCPs)    │              │
│  │             │  │             │  │             │              │
│  │ O QUE NAO   │  │ COMO FAZER  │  │ O QUE USAR  │              │
│  │ FAZER       │  │ CADA TAREFA │  │ DE EXTERNO  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  RECEITAS   │  │  AUTOMACAO  │  │  MEMORIA    │              │
│  │ (Workflows) │  │   (Hooks)   │  │  (Memory)   │              │
│  │             │  │             │  │             │              │
│  │ PASSO A     │  │ ANTES/DEPOIS│  │ LEMBRA ENTRE│              │
│  │ PASSO       │  │ DE ACOES    │  │ SESSOES     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐                                │
│  │  DOCUMENTOS │  │  EQUIPE     │                                │
│  │ (AGENTS.md) │  │ (Subagents) │                                │
│  │             │  │             │                                │
│  │ CONTEXTO    │  │ AJUDANTES   │                                │
│  │ DO PROJETO  │  │ ESPECIALIST.│                                │
│  └─────────────┘  └─────────────┘                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. SKILLS — Habilidades Especificas

**O que e:** Um arquivo `.md` que ensina o modelo a fazer algo muito especifico.

**Como funciona:** Quando voce invoca a skill, TODO o conteudo dela e injetado no contexto do prompt.

**Analogia:** E como dar um **manual de instrucoes** para o chef antes dele comecar uma receita.

```
ARQUIVO: .agents/skills/design-frontend/SKILL.md

CONTEUDO:
- Regras inegociaveis (nao mexer em logica, so CSS)
- Mapa de substituicao de classes (ANTES → DEPOIS)
- Mobile-first obrigatorio
- Exemplos de como pensar

QUANDO USAR:
/design /funis/funil/$funilId

O QUE ACONTECE:
O modelo le TODO o SKILL.md e segue as instrucoes
```

**Exemplo de invocacao:**
```
Voce: /design /cadastros/dashboard

Sistema: [Invoca skill design-frontend]
Modelo: Leia o SKILL.md → aplique as substituicoes → reporte resultado
```

**Onde vivem:**
```
.agents/skills/
├── design-frontend/SKILL.md
├── documentar-modulo/SKILL.md
├── responsividade/SKILL.md
└── deploy-vps/SKILL.md
```

---

## 2. MCPs (Model Context Protocol) — Contexto Externo

**O que e:** Servidores que fornecem ferramentas externas ao modelo.

**Como funciona:** O modelo ganha acesso a APIs, bancos de dados, servicos que nao estao no chat.

**Analogia:** E como dar ao chef acesso a **um forno profissional, um liquidificador, uma balanca digital** — ferramentas que ele nao tem naturalmente.

```
ARQUIVO: .mimocode/mcp.json ou settings

EXEMPLO:
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}

O QUE ACONTECE:
O modelo ganha tools como:
- mcp__supabase__query (consultar banco)
- mcp__supabase__insert (inserir dados)
- mcp__github__create_issue (criar issue)
```

**Diferenca de skills:**
- Skills = instrucoes (o QUE fazer)
- MCPs = ferramentas (o QUE USAR para fazer)

---

## 3. RULES (Regras) — Guardrails

**O que e:** Instrucoes que o modelo DEVE seguir sempre, sem excecao.

**Como funciona:** Sao injetadas no system prompt e estao presentes em TODA a conversa.

**Analogia:** Sao as **regras da cozinha**: "nao use faca sem luva", "limpe sempre a bancada", "nao sirva comida fria".

```
ARQUIVO: AGENTS.md ou CLAUDE.md

EXEMPLO:
## Regras de UI
- NUNCA usar alertas nativos (window.alert, window.confirm)
- SEMPRE usar componentes modais (AlertDialog, Dialog)

## Regras de Deploy
- Deploy SOMENTE quando usuario disser "deploy"
- Build deve passar antes do push

O QUE ACONTECE:
Em TODA mensagem, o modelo le essas regras e as segue.
```

**Hierarquia de prioridade:**
```
1. Instrucoes do usuario (mais alta)
2. Regras do AGENTS.md
3. Regras do sistema (mais baixa)
```

---

## 4. HOOKS — Gatilhos Automaticos

**O que e:** Acoes que rodam ANTES ou DEPOIS de um evento.

**Como funciona:** Sao scripts que interceptam acoes do sistema.

**Analogia:** Sao como **alarmes e sensores**: quando algo acontece, algo automatico roda.

```
EXEMPLO CONCEITUAL:

PRE-HOOK (antes de salvar arquivo):
→ Verificar se o arquivo segue o padrao de nomenclatura
→ Se nao, renomear automaticamente

POST-HOOK (depois de commit):
→ Rodar lint automaticamente
→ Atualizar documentacao

OUTRO EXEMPLO:
HOOK de checkpoint:
→ Quando o contexto fica grande, salva um checkpoint
→ compacta mensagens antigas
→ mantem a conversa leve
```

**Hooks que existem no MiMoCode:**
- `checkpoint-writer`: salva estado periodicamente
- `compaction`: compacta contexto quando fica grande
- `title`: gera titulo da sessao
- `summary`: gera resumo ao final

---

## 5. WORKFLOWS — Receitas (Passo a Passo)

**O que e:** Scripts JavaScript que orquestram multiplas tarefas em sequencia ou paralelo.

**Como funciona:** Um workflow define fases, e cada fase pode usar subagentes.

**Analogia:** E a **receita completa**: "primeiro corte os legumes, depois refogue, tempere, e sirva".

```
ARQUIVO: .mimocode/workflows/modulo-completo.mjs

EXEMPLO:
export default async function(args, ctx) {
  ctx.phase("Fase 1 — Documentacao")
  await agent("Documente o modulo " + args.modulo)
  
  ctx.phase("Fase 2 — Design")
  await agent("Aplique design em " + args.modulo)
  
  ctx.phase("Fase 3 — Responsividade")
  await agent("Corrija responsividade de " + args.modulo)
}

COMO USAR:
workflow({ operation: "run", name: "modulo-completo", args: { modulo: "funis" } })
```

**Workflows built-in:**
- `compose`: pipeline autonomo (brainstorm → design → implement → verify → review)
- `deep-research`: pesquisa profunda com fontes

---

## 6. SPECS — Especificacoes

**O que e:** Documentos que definem O QUE deve ser feito (nao COMO).

**Como funciona:** Servem de referencia para o modelo seguir durante a implementacao.

**Analogia:** E o **cardapio**: lista os pratos que precisam ser feitos, com ingredientes e modo de preparo.

```
EXEMPLO CONCEITUAL:

SPEC: Modulo Funis
- Descricao: Gerenciamento de funis Kanban
- Rotas: /funis/dashboard, /funis/funil/$id
- Permissoes: funis_ver_dashboard, funis_criar_funil
- Componentes: KanbanView, TaskCard, ColumnHeader

O MODELO USA ESSA SPEC PARA:
- Verificar se implementou tudo que foi pedido
- Validar se as permissoes estao corretas
- Confirmar que os componentes existem
```

---

## 7. AGENTS.md — Documento de Contexto do Projeto

**O que e:** Um arquivo que fornece contexto sobre o projeto inteiro.

**Como funciona:** E injetado no system prompt de TODA sessao.

**Analogia:** E o **cardapio do restaurante**: diz o tipo de comida, os pratos disponiveis, as regras da casa.

```
ARQUIVO: AGENTS.md (na raiz do projeto)

SECOES COMUNS:
## Regras de UI
- Componentes disponiveis
- Padroes de nomenclatura

## Regras de Arquitetura
- Multi-tenant por empresa_id
- Modulos independentes

## Skills Disponiveis
- Tabela de skills do projeto

## Regras de Deploy
- Como fazer deploy
```

**Diferenca de Rules:**
- Rules = regras especificas (nao faca X)
- AGENTS.md = contexto geral (o projeto e Y, use Z)

---

## 8. AGENTS (Agentes Personalizados) — Equipe Especializada

**O que e:** Definicoes de agentes com comportamentos e permissoes especificas.

**Como funciona:** Cada agente tem um `mode`, ferramentas permitidas, e regras proprias.

**Analogia:** Sao **cozinheiros especializados**: um so faz massas, outro so faz sobremesas, outro so faz carnes.

```
ARQUIVO: .mimocode/agents/ ou configuracao do sistema

EXEMPLO CONCEITUAL:

Agente "documentador":
- Mode: subagent
- Ferramentas: read, write, grep, glob
- Skill padrao: documentar-modulo
- Regra: so le e escreve documentacao

Agente "designer":
- Mode: subagent
- Ferramentas: read, edit, write
- Skill padrao: design-frontend
- Regra: so altera classNames, nunca logica

Agente "deployer":
- Mode: subagent
- Ferramentas: bash, read
- Skill padrao: deploy-vps
- Regra: so executa comandos de deploy
```

**Agentes built-in do MiMoCode:**
| Agente | Funcao |
|--------|--------|
| `build` | Agente principal, full access |
| `plan` | Read-only, so escreve em plans/ |
| `compose` | Orquestra workflows |
| `explore` | Busca rapida, read-only |
| `general` | Tarefas gerais |

---

## 9. SUBAGENTES — Ajudantes de Tarefa

**O que e:** Agentes temporarios criados para executar uma tarefa especifica.

**Como funciona:** Sao spawed via `actor`, rodam em contexto isolado, e retornam resultado.

**Analogia:** Sao **estagiarios** que voce chama para fazer uma tarefa e depois demite.

```
EXEMPLO:

const resultado = await actor({
  operation: "run",
  subagent_type: "general",
  description: "Documentar modulo funis",
  prompt: "Leia os arquivos e gere a documentacao...",
  context: "none"
})

// resultado = "Documentacao gerada com sucesso em docs-projeto/..."
```

**Diferenca de Agentes:**
- Agentes = definicoes permanentes com permissoes
- Subagentes = instancias temporarias para tarefas pontuais

---

## 10. MEMORY — Memoria Persistente

**O que e:** Arquivos markdown que salvam contexto entre sessoes.

**Como funciona:** O modelo le e escreve nesses arquivos para lembrar de coisas importantes.

**Analogia:** E o **caderninho do chef**: anota receitas favoritas, erros que cometeu, preferencias do cliente.

```
LOCAIS:
~/.claude/projects/<projeto>/memory/
├── MEMORY.md          (indice)
├── user/*.md          (preferencias do usuario)
├── feedback/*.md      (aprendizados)
├── project/*.md       (contexto do projeto)
└── reference/*.md     (referencias)

EXEMPLO:
O modelo salva:
- "O usuario prefere modal nativo, nao alertas"
- "O modulo funis usa tokens antigos, precisa converter"
- "Deploy so via VPS, nao Vercel"
```

---

## 11. TASKS — Itens de Trabalho Rastreados

**O que e:** Entidades com ID que rastreiam progresso de tarefas.

**Como funciona:** Cada tarefa tem status (open → in_progress → done/blocked).

**Analogia:** E o **pedido do cliente**: numero do pedido, status (preparando, pronto, entregue).

```
EXEMPLO:

// Criar tarefa
task({ operation: "create", summary: "Refatorar modulo funis" })
// Retorna: T1

// Marcar como em andamento
task({ operation: "start", id: "T1" })

// Marcar como concluida
task({ operation: "done", id: "T1" })
```

---

## Tabela Resumo

| Componente | O que e | Quando usar | Analogia |
|------------|---------|-------------|----------|
| **Skills** | Instrucoes especificas | Antes de tarefas complexas | Manual de instrucoes |
| **MCPs** | Ferramentas externas | Quando precisa de APIs externas | Forno, liquidificador |
| **Rules** | Guardrails fixos | Sempre (em toda conversa) | Regras da cozinha |
| **Hooks** | Gatilhos auto | Antes/depois de eventos | Alarmes e sensores |
| **Workflows** | Receitas multi-step | Tarefas complexas e sequenciais | Receita completa |
| **Specs** | O QUE fazer | Antes de implementar | Cardapio |
| **AGENTS.md** | Contexto do projeto | Sempre (em toda sessao) | Cardapio do restaurante |
| **Agents** | Definicoes permanentes | Quando precisa de especialistas | Cozinheiros especializados |
| **Subagentes** | Tarefas temporarias | Quando precisa delegar | Estagiarios |
| **Memory** | Memoria persistente | Entre sessoes | Caderninho |
| **Tasks** | Rastreamento | Para tarefas multi-step | Pedido do cliente |

---

## Como Tudo Conecta — Exemplo Real

```
USUARIO: "Rode o workflow completo para o modulo FUNIS"

1. AGENTS.md fornece contexto: "Projeto ERP multi-tenant, modulos independentes"

2. WORKFLOW e invocado: modulo-completo.mjs

3. FASE 1 — DOCUMENTACAO:
   → SUBAGENTE e criado (actor run)
   → SKILL documentar-modulo e injetada no contexto
   → Subagente le arquivos do modulo
   → Gera documento em docs-projeto/
   → Retorna resultado ao workflow

4. FASE 2 — DESIGN:
   → SUBAGENTE e criado
   → SKILL design-frontend e injetada
   → RULES dizem: "nao mexer em logica, so CSS"
   → Subagente aplica classes do design system
   → Retorna resultado

5. FASE 3 — RESPONSIVIDADE:
   → SUBAGENTE e criado
   → SKILL responsividade e injetada
   → Subagente analisa e corrige
   → Retorna resultado

6. HOOK checkpoint salva o estado

7. MEMORY atualiza: "Modulo funis documentado e estilizado"

8. TASK T1 marcada como done
```

---

## Resumo Visual

```
                    ┌─────────────────┐
                    │   USUARIO       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   AGENTS.md     │
                    │  (Contexto)     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐ ┌──▼───┐ ┌───────▼───────┐
     │    SKILLS       │ │ MCPs │ │    RULES      │
     │ (Habilidades)   │ │(Ext.)│ │ (Guardrails)  │
     └────────┬────────┘ └──┬───┘ └───────┬───────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │    WORKFLOWS    │
                    │  (Receitas)     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐ ┌──▼───┐ ┌───────▼───────┐
     │  SUBAGENTES     │ │HOOKS │ │    MEMORY     │
     │ (Estagiarios)   │ │(Auto)│ │ (Caderninho)  │
     └─────────────────┘ └──────┘ └───────────────┘
```
