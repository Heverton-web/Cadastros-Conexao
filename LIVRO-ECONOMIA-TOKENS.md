# Economia de Tokens em IDEs Agênticas
### O Guia Definitivo para Maximizar Cada Centavo em IA Generativa

> *"O contexto é o novo petróleo. Quem gerencia bem, produz mais com menos."*

**Versão:** 1.0 | **Autor:** Equipe ERP Odonto | **Data:** Julho 2026

**Ferramentas cobertas:** Oh My Pi, OpenCode, MiMoCode, Antigravity, Freebuff, Claude Code, Cursor, Windsurf, Cline, Aider — qualquer IDE agêntica que use LLMs com contexto.

---

## Sumário

- [Parte 0 — O Harness: O Motor Por Trás da IDE](#parte-0--o-harness-o-motor-por-trás-da-ide)
  - [Capítulo 0.1: O que é um Harness Agêntico](#capítulo-01--o-que-é-um-harness-agêntico)
  - [Capítulo 0.2: O Fluxo Completo Input → Processamento → Output](#capítulo-02--o-fluxo-completo-input--processamento--output)
  - [Capítulo 0.3: O System Prompt — O DNA do Agente](#capítulo-03--o-system-prompt--o-dna-do-agente)
- [Parte I — Fundamentos](#parte-i--fundamentos)
  - [Capítulo 1: Anatomia de um Token](#capítulo-1--anatomia-de-um-token)
  - [Capítulo 2: A Janela de Contexto](#capítulo-2--a-janela-de-contexto)
  - [Capítulo 3: O Ciclo de Vida de uma Sessão](#capítulo-3--o-ciclo-de-vida-de-uma-sessão)
- [Parte II — Estratégias](#parte-ii--estratégias)
  - [Capítulo 4: Prompt Engineering para Agentes](#capítulo-4--prompt-engineering-para-agentes)
  - [Capítulo 5: Sistema de Skills](#capítulo-5--sistema-de-skills)
  - [Capítulo 6: Cache e Reutilização](#capítulo-6--cache-e-reutilização)
- [Parte III — Padrões](#parte-iii--padrões)
  - [Capítulo 7: Subagents e Delegação](#capítulo-7--subagents-e-delegação)
  - [Capítulo 8: MCP e Ferramentas](#capítulo-8--mcp-e-ferramentas)
  - [Capítulo 9: Gerenciamento de Estado](#capítulo-9--gerenciamento-de-estado)
- [Parte IV — Frameworks](#parte-iv--frameworks)
  - [Capítulo 10: Árvore de Decisão Universal](#capítulo-10--árvore-de-decisão-universal)
  - [Capítulo 11: Métricas e Rastreamento](#capítulo-11--métricas-e-rastreamento)
  - [Capítulo 12: Checklist Universal](#capítulo-12--checklist-universal)
- [Parte V — Rules e Commands](#parte-v--rules-e-commands)
  - [Capítulo 13: Rules — O Sistema de Regras](#capítulo-13--rules-o-sistema-de-regras)
  - [Capítulo 14: Commands — O Sistema de Comandos](#capítulo-14--commands-o-sistema-de-comandos)
- [Parte VI — Configurações Avançadas e Ocultas](#parte-vi--configurações-avançadas-e-ocultas)
  - [Capítulo 15: Configurações Secretas por IDE](#capítulo-15--o-que-ninguém-fala-configurações-secretas)
  - [Capítulo 16: Tuning de Performance](#capítulo-16--tuning-de-performance)
- [Parte VII — Aplicação Prática](#parte-vii--aplicação-prática)
  - [Capítulo 17: Guia por IDE — Setup Completo](#capítulo-17--guia-por-ide-setup-completo)
  - [Capítulo 18: Casos Reais — Antes e Depois](#capítulo-18--casos-reais-antes-e-depois)
- [Apêndices](#apêndices)
  - [A: Glossário Completo](#a--glossário-completo)
  - [B: Tabela de Custos por Modelo](#b--tabela-de-custos-por-modelo)
  - [C: Template de AGENTS.md Otimizado](#c--template-de-agentsmd-otimizado)
  - [D: Template de MCP Server](#d--template-de-mcp-server)
  - [E: Template de Skill](#e--template-de-skill)
---

# Parte 0 — O Harness: O Motor Por Trás da IDE

## Capítulo 0.1 — O que é um Harness Agêntico

### 0.1.1 Definição

Harness é **a camada de software entre você e o LLM**. Ele não é a IDE, não é o modelo, não é o framework — é o orquestrador que conecta tudo.

```
┌──────────────────────────────────────────────────────────────┐
│                         HARNESS                               │
│                                                               │
│  ┌─────────┐   ┌──────────────┐   ┌───────────────────┐     │
│  │   UI    │   │   Context    │   │    Tool Router     │     │
│  │(chat/   │   │   Manager    │   │    (executa tools, │     │
│  │ editor) │   │(gerencia o   │   │     retorna para   │     │
│  │         │   │ contexto)    │   │     o LLM)         │     │
│  └────┬────┘   └──────┬───────┘   └────────┬──────────┘     │
│       │               │                     │                 │
│       └───────────────┼─────────────────────┘                 │
│                       │                                       │
│                ┌──────▼───────┐                               │
│                │ LLM Gateway  │                               │
│                │(envia prompt │                               │
│                │ recebe resp) │                               │
│                └──────────────┘                               │
└──────────────────────────────────────────────────────────────┘
```

### 0.1.2 Harness vs IDE vs Framework

| Conceito | O que é | Exemplo |
|---|---|---|
| **IDE** | Interface completa (editor, terminal, chat) | VS Code, Cursor, Oh My Pi |
| **Harness** | O orquestrador que conecta UI + LLM + Tools | OpenCode, MiMoCode, Claude Code CLI |
| **Framework** | Bibliotecas para construir agentes | LangChain, CrewAI, AutoGen |
| **LLM** | O modelo de linguagem | Claude, GPT-4o, Gemini, DeepSeek |

A diferença crucial: **IDE e Harness podem ser a mesma coisa** (Oh My Pi é ambos), mas podem ser separados (VS Code + Cline = IDE + Harness).

### 0.1.3 Como cada IDE implementa o harness

| IDE/Framework | Tipo de Harness | Arquitetura |
|---|---|---|
| **Oh My Pi** | Integrado (IDE + Harness) | Node.js, comunicação via IPC, suporta múltiplos LLMs |
| **OpenCode** | CLI Harness | Go binary, TUI (terminal UI), config via `opencode.json` |
| **MiMoCode** | CLI Harness | Baseado em OpenCode, otimizado para MiMo models |
| **Antigravity** | CLI Harness | Go binary, TUI, similar ao OpenCode |
| **Freebuff** | CLI Harness | Go binary, TUI, fork do Antigravity |
| **Claude Code** | CLI Harness | Node.js, terminal, config via `settings.json` |
| **Cursor** | IDE integrado | Electron (VS Code fork), `.cursorrules` + `.cursor/` |
| **Windsurf** | IDE integrado | Electron, `.windsurfrules` |
| **Cline** | Extensão VS Code | TypeScript, `.clinerules` |
| **Aider** | CLI Harness | Python, `.aider.conf.yml` |

### 0.1.4 Componentes de um harness

Todo harness, independente da IDE, tem estes componentes:

```
1. CONTEXT MANAGER
   ├─ Monta o system prompt (regras + tools + contexto)
   ├─ Gerencia o histórico de mensagens
   ├─ Decide o que entra e o que sai do contexto
   └─ Aplica regras de compactação (/clear, /compact)

2. TOOL ROUTER
   ├─ Registra tools disponíveis (bash, read, edit, MCP, etc.)
   ├─ Valida argumentos das tool calls
   ├─ Executa as tools no ambiente correto
   └─ Retorna resultados ao LLM

3. LLM GATEWAY
   ├─ Monta a mensagem (system + histórico + input)
   ├─ Envia ao provedor (Anthropic, OpenAI, etc.)
   ├─ Processa streaming de resposta
   └─ Detecta tool calls na resposta

4. UI LAYER
   ├─ Interface de chat (input do usuário)
   ├─ Exibição de respostas e tool calls
   ├─ Comandos especiais (/clear, /compact)
   └─ Indicadores de status (tokens, custo)
```

---

## Capítulo 0.2 — O Fluxo Completo: Input → Processamento → Output

### 0.2.1 Diagrama de uma chamada completa

```
USUÁRIO digita: "Crie um componente Button"
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│  FASE 1: MONTAGEM DO CONTEXTO (harness)                  │
│                                                          │
│  System Prompt (montado pelo harness):                   │
│    ├─ Instruções base do modelo (~1-2K tokens)           │
│    ├─ Regras do projeto (AGENTS.md) (~1-3K tokens)       │
│    ├─ Skills ativas (~0-5K tokens)                       │
│    ├─ Descrição de tools disponíveis (~2-5K tokens)      │
│    └─ TOTAL: ~5-15K tokens                               │
│                                                          │
│  Histórico de mensagens:                                 │
│    ├─ Mensagens anteriores do usuário                    │
│    ├─ Respostas anteriores do modelo                     │
│    ├─ Resultados de tool calls anteriores                │
│    └─ TOTAL: varia (0 no início, cresce cada turno)      │
│                                                          │
│  Input atual:                                            │
│    ├─ "Crie um componente Button" (~10 tokens)           │
│    └─ Contexto adicional (se houver)                     │
└─────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│  FASE 2: ENVIO AO LLM (harness → provedor)               │
│                                                          │
│  Requisição HTTP POST:                                   │
│    ├─ model: "claude-sonnet-4-20250514"                  │
│    ├─ system: [system prompt]                            │
│    ├─ messages: [histórico + input]                      │
│    ├─ tools: [descrição de todas as tools]               │
│    ├─ max_tokens: 4096                                   │
│    └─ stream: true                                       │
│                                                          │
│  O provedor cobra por:                                   │
│    ├─ input tokens: system + messages + tools            │
│    └─ output tokens: o que o modelo gerar                │
└─────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│  FASE 3: PROCESSAMENTO DO LLM                            │
│                                                          │
│  O modelo decide (em uma chamada):                       │
│    ├─ Gerar texto de resposta                            │
│    ├─ Chamar uma ou mais tools                           │
│    └─ Ambos (texto + tool calls)                         │
│                                                          │
│  Se o modelo chama tools:                                │
│    ├─ O harness recebe os tool calls                     │
│    ├─ Executa as tools                                   │
│    ├─ Retorna os resultados ao LLM                       │
│    ├─ O LLM processa os resultados                       │
│    └─ Repete até o LLM parar de chamar tools             │
│                                                          │
│  CICLO: User → LLM → Tool → LLM → Tool → ... → Output   │
└─────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│  FASE 4: OUTPUT (harness → usuário)                       │
│                                                          │
│  O harness exibe:                                        │
│    ├─ Texto gerado pelo modelo                           │
│    ├─ Tool calls executados (e seus resultados)          │
│    ├─ Indicadores de uso (tokens, custo)                 │
│    └─ Status (concluído, erro, aguardando input)         │
└─────────────────────────────────────────────────────────┘
```

### 0.2.2 O ciclo de tool calls

A maioria das pessoas pensa que uma chamada ao LLM é: pergunta → resposta. Na realidade, em modo agente:

```
Turno 1: User pergunta → LLM decide usar grep → harness executa grep
Turno 2: Resultado do grep → LLM decide usar read → harness executa read
Turno 3: Resultado do read → LLM decide usar edit → harness executa edit
Turno 4: Resultado do edit → LLM decide usar bash(build) → harness executa
Turno 5: Resultado do build → LLM gera resposta final
```

**Cada "turno" acima é uma chamada separada ao LLM**, com o system prompt completo + histórico acumulado. Isso significa que uma tarefa "simples" pode consumir 5-10 chamadas ao LLM.

### 0.2.3 Onde os tokens são gastos em cada fase

| Fase | Tokens consumidos | Proporção típica |
|---|---|---|
| System prompt (TODAS as chamadas) | 5-15K × N chamadas | 30-50% |
| Histórico (acumula) | Cresce linearmente | 20-40% |
| Input do usuário | Pequeno | 1-5% |
| Output do modelo | Varia | 15-30% |
| Tools (descrição + resultado) | 2-10K por tool call | 10-25% |

### 0.2.4 Streaming: como a resposta chega em tempo real

O streaming não economiza tokens — ele **reduz latência perceptível**:

```
Sem streaming: Usuário espera 10 segundos → vê resposta completa
Com streaming: Usuário vê resposta aparecendo caractere por caractere
```

Por baixo, o LLM gera tokens sequencialmente. O harness recebe cada token via SSE (Server-Sent Events) e exibe imediatamente. O custo é o mesmo — a experiência é diferente.

### 0.2.5 Diferença entre modo chat e modo agente

| Aspecto | Modo Chat | Modo Agente |
|---|---|---|
| Tools disponíveis | Nenhuma ou limitadas | Todas (bash, read, edit, MCP, etc.) |
| Ciclo de execução | 1 chamada | N chamadas (ciclo de tool calls) |
| Contexto | Cresce devagar | Cresce rápido (outputs de tools) |
| Custo por interação | Baixo | Alto (múltiplas chamadas) |
| Capacidade | Responder perguntas | Executar ações no ambiente |

---

## Capítulo 0.3 — O System Prompt: O DNA do Agente

### 0.3.1 O que é o system prompt

O system prompt é o **conjunto de instruções que definem o comportamento do agente**. Ele é enviado ANTES de qualquer mensagem do usuário e é reenviado em TODAS as chamadas dentro de uma sessão.

```
┌─────────────────────────────────────────────┐
│            SYSTEM PROMPT (reenviado sempre)  │
├─────────────────────────────────────────────┤
│                                              │
│  1. ROLE & INSTRUCTIONS (~500-2K tokens)     │
│     "Você é um assistente de código..."      │
│     "Sempre responda em PT-BR..."            │
│                                              │
│  2. PROJECT RULES (~1-5K tokens)             │
│     AGENTS.md / CLAUDE.md / .cursorrules     │
│     Regras arquiteturais, UI, permissões     │
│                                              │
│  3. AVAILABLE TOOLS (~2-8K tokens)           │
│     Descrição JSON de cada tool              │
│     Schema de parâmetros                     │
│     Instruções de uso                        │
│                                              │
│  4. ACTIVE SKILLS (~0-3K tokens)             │
│     Skills carregadas no início da sessão    │
│                                              │
│  5. CONTEXT FILES (~0-5K tokens)             │
│     Arquivos de contexto do projeto          │
│     Ex: package.json, tsconfig.json          │
│                                              │
└─────────────────────────────────────────────┘
```

### 0.3.2 Onde fica o system prompt em cada IDE

| IDE | Onde definir regras | Arquivo/Config |
|---|---|---|
| **Oh My Pi** | `AGENTS.md` na raiz do projeto | `AGENTS.md` + `opencode.json` + `skills/` |
| **OpenCode** | `opencode.json` + `.opencode/rules/` | `opencode.json` + `rules/` + `skills/` |
| **MiMoCode** | Config do projeto | Similar ao OpenCode |
| **Antigravity** | Config do projeto | `antigravity.json` ou similar |
| **Freebuff** | Config do projeto | `freebuff.json` ou similar |
| **Claude Code** | `CLAUDE.md` na raiz + `~/.claude/` | `CLAUDE.md` + `settings.json` |
| **Cursor** | `.cursorrules` na raiz + `.cursor/` | `.cursorrules` + `.cursor/settings.json` |
| **Windsurf** | `.windsurfrules` na raiz | `.windsurfrules` |
| **Cline** | `.clinerules` na raiz | `.clinerules` |
| **Aider** | `.aider.conf.yml` + `CONVENTIONS.md` | `.aider.conf.yml` + `CONVENTIONS.md` |

### 0.3.3 Quanto custa o system prompt

O system prompt é o **maior vilão de consumo de tokens** porque é reenviado em CADA chamada:

```
System prompt: 8K tokens
Sessão com 10 tool calls (cada uma = 1 chamada ao LLM):
  Custo do system prompt = 8K × 10 = 80K tokens

Se o system prompt fosse 4K:
  Custo = 4K × 10 = 40K tokens (50% de economia)
```

**Regra de ouro:** cada 1K de system prompt × N chamadas da sessão = custo real.

### 0.3.4 O impacto de cada componente

| Componente | Tamanho típico | Impacto | Prioridade de otimização |
|---|---|---|---|
| Instruções base do modelo | 1-2K | Fixo (não controlamos) | NENHUMA |
| Regras do projeto (AGENTS.md) | 1-10K | ALTO (controlamos) | MÁXIMA |
| Descrição de tools | 2-8K | ALTO (controlamos) | ALTA |
| Skills ativas | 0-5K | MÉDIO | MÉDIA |
| Context files | 0-5K | MÉDIO | MÉDIA |

### 0.3.5 Como o system prompt é montado

Em IDEs agênticas, o system prompt é montado dinamicamente:

```
1. INSTRUÇÕES BASE (fixas, definidas pelo harness)
   "You are a helpful coding assistant..."

2. PROJECT RULES (lidas de arquivos)
   + read("AGENTS.md")           → append ao system prompt
   + read("CLAUDE.md")           → append
   + read(".cursorrules")        → append

3. TOOL DESCRIPTIONS (geradas automaticamente)
   + JSON schema de cada tool    → append
   + Instruções de uso de tools  → append

4. ACTIVE SKILLS (carregadas sob demanda)
   + read("skills/deploy/SKILL.md")  → append (se ativa)

5. CONTEXT FILES (configurados)
   + read("package.json")        → append (se configurado)
   + read("tsconfig.json")       → append
```

**Isso significa:** se você tem 10 regras no AGENTS.md + 5 skills carregadas + 3 context files, o system prompt pode chegar a 15-20K tokens — e isso é reenviado em CADA chamada.

---


# Parte I — Fundamentos

## Capítulo 1 — Anatomia de um Token

### 1.1 O que é um token (de verdade)

Um token **não** é uma palavra. Não é uma letra. É a unidade atômica que o tokenizer do modelo usa para comprimir texto. Dependendo do tokenizer:

| Texto | Tokens (aprox.) |
|---|---|
| `import React from 'react'` | 6 |
| ` useEffect(() => {` | 4 |
| `https://supabase.co` | 5 |
| `src/features/catalogo/services/pedidos.service.ts` | 12 |
| `npm run build` | 4 |
| `企业_id` | 3 |

**Regra prática:** código tem ~1.3 tokens por palavra. URLs e paths são caros. Strings longas de error são caríssimas.

### 1.2 Os 4 tipos de consumo de tokens

Em qualquer IDE agêntica, os tokens vêm de 4 fontes:

```
┌─────────────────────────────────────────────────────┐
│                   CUSTO TOTAL DA CHAMADA              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. SYSTEM PROMPT     (~3-8K tokens)                │
│     ├─ Instruções base do modelo                    │
│     ├─ AGENTS.md / CLAUDE.md / GEMINI.md            │
│     ├─ Regras do projeto                            │
│     └─ Descrições de tools                          │
│                                                      │
│  2. HISTÓRICO          (cresce a cada turno)         │
│     ├─ Todas as mensagens anteriores                │
│     ├─ Outputs de tools anteriores                  │
│     └─ Code snippets colados/gerados                │
│                                                      │
│  3. INPUT ATUAL        (a pergunta + contexto)       │
│     ├─ Pergunta do usuário                          │
│     ├─ Arquivos lidos via read/grep                 │
│     └─ Resultados de buscas                         │
│                                                      │
│  4. OUTPUT             (o que o modelo gera)         │
│     ├─ Texto de resposta                            │
│     ├─ Tool calls (JSON das chamadas)               │
│     └─ Code gerado/editado                          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 1.3 Onde o dinheiro vai

O custo real vem de algo que a maioria ignora: **o system prompt e o histórico são reenviados a CADA chamada**.

Exemplo real de uma sessão de 10 turnos:

```
Turno 1:  System(5K) + Pergunta(200)                =   5.200 tokens in
Turno 2:  System(5K) + Hist(2K) + Pergunta(200)     =   7.200 tokens in
Turno 3:  System(5K) + Hist(5K) + Pergunta(200)     =  10.200 tokens in
Turno 5:  System(5K) + Hist(15K) + Pergunta(200)    =  20.200 tokens in
Turno 10: System(5K) + Hist(40K) + Pergunta(200)    =  45.200 tokens in

TOTAL INPUT na sessão: ~180K tokens (só de enviar o mesmo system prompt 10x)
```

**Isso significa:** o system prompt de 5K tokens custa **50K tokens** numa sessão de 10 turnos — não 5K.

### 1.4 A regra de ouro

> **Cada token no system prompt custa N× ao longo da sessão, onde N = número de turnos.**

Isso torna o AGENTS.md um documento de altíssimo impacto. Um AGENTS.md com 10K tokens numa sessão de 20 turnos gasta **200K tokens** — equivalentes a ~67K palavras de input.

---

## Capítulo 2 — A Janela de Contexto

### 2.1 O que é a janela

A janela de contexto é o limite de tokens que o modelo "enxerga" de uma vez. Não é memória — é uma janela deslizante.

| Modelo | Janela | Tokens úteis* |
|---|---|---|
| Claude 3.5 Sonnet | 200K | ~160K |
| Claude 3 Opus | 200K | ~160K |
| GPT-4o | 128K | ~100K |
| GPT-4o-mini | 128K | ~100K |
| Gemini 1.5 Pro | 2M | ~1.5M |
| DeepSeek V3 | 128K | ~100K |

*Menos o overhead do system prompt + output reservado.

### 2.2 O que acontece quando a janela enche

Quando o contexto excede a janela, o modelo **recorta** mensagens antigas — geralmente do início. Isso significa:

- Instruções importantes do system prompt podem ser perdidas
- Contexto de arquivos lidos anteriormente some
- O modelo "esquece" o que você pediu 15 turnos atrás

**Em IDEs agênticas, isso se manifesta como:**
- O agente repete trabalho já feito
- Ignora regras definidas no início da sessão
- Gera código que viola padrões que ele próprio estabeleceu

### 2.3 O conceito de "densidade de contexto"

Nem todo token tem o mesmo valor. Algumas regras:

| Tipo de contexto | Prioridade | Exemplo |
|---|---|---|
| Instrução ativa | MÁXIMA | "Agora refactorize o componente X" |
| Regra arquitetural | ALTA | "Toda tabela precisa de empresa_id" |
| Código relevante | ALTA | O arquivo que estou editando |
| Código referenciado | MÉDIA | Outro módulo que importa este |
| Histórico de turns anteriores | BAIXA | O que fiz 10 turnos atrás |
| Output de tool irrelevante | NENHUMA | Listagem de diretório que já vi |

**Princípio:** se você não vai usar um token nos próximos 2 turnos, ele é desperdício.

### 2.4 O paradoxo do contexto

Existe uma tensão fundamental:

```
MAIS contexto → modelo entende melhor → mas custa mais
MENOS contexto → modelo esquece coisas → mas gasta menos
```

A solução não é minimizar contexto cegamente — é **maximizar a densidade de informação por token**.

---

## Capítulo 3 — O Ciclo de Vida de uma Sessão

### 3.1 As 5 fases de uma sessão agêntica

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  SETUP   │───▶│ EXPLORAÇÃO│───▶│EXECUÇÃO  │───▶│ VERIFICAÇÃO│──▶│ CLEANUP  │
│ (tokens │    │ (tokens   │    │ (tokens  │    │ (tokens   │    │ (tokens  │
│  fixos)  │    │  cresce)  │    │  pico)   │    │  moderado) │    │ zero)    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
   ~5-8K          +2-10K          +5-20K          +2-5K           +0
```

**Fase 1 — Setup (tokens fixos):**
- System prompt + AGENTS.md + regras do projeto
- Custo: 5-8K tokens, **reenviados a cada turno**
- Otimização: manter AGENTS.md o menor possível

**Fase 2 — Exploração (tokens crescem):**
- Leitura de arquivos, greps, glob
- Cada `read` adiciona tokens ao histórico
- Custo: 2-10K tokens dependendo do projeto
- Otimização: grep antes de read, ler assinaturas antes de corpos

**Fase 3 — Execução (tokens no pico):**
- Geração de código, tools calls, outputs longos
- É onde mais tokens são gastos
- Otimização: consolidar edits, usar subagents para paralelismo

**Fase 4 — Verificação (tokens moderados):**
- Build, testes, lint
- Output de ferramentas de build é caro (muitas linhas)
- Otimização: filtrar output, mostrar só erros

**Fase 5 — Cleanup (tokens zero):**
- `/clear` limpa o histórico
- Próxima sessão começa do zero
- Otimização: sempre limpar ao final de tarefas grandes

### 3.2 Onde a maioria desperdiça

Os 3 maiores vilões do consumo de tokens:

**Vilão 1 — Leitura sem objetivo:**
```
# RUIM
"Vou ler o arquivo para ver o que tem"

# BOM
"Vou ler a linha 42-60 do service.ts para ver a função X"
```

**Vilão 2 — Turnos desnecessários:**
```
# RUIM (5 turnos)
Turno 1: "Leia o arquivo X"        → model lê
Turno 2: "Agora leia Y"            → model lê
Turno 3: "Agora edite Z"           → model edita
Turno 4: "Agora rode o build"      → model roda
Turno 5: "Agora crie a migration"  → model cria

# BOM (1 turno)
"Leia X e Y, edite Z, rode build, crie migration"
```

**Vilão 3 — Contexto morto:**
```
# RUIM
Usuário lê 20 arquivos, depois faz UMA pergunta
→ Os 20 arquivos ficam no histórico para sempre

# BOM
Usuário lê 20 arquivos em sessão A
/usuário faz /clear
Usuário faz a pergunta em sessão B com contexto limpo
```

### 3.3 O ciclo ideal de economia

```
┌─────────────────────────────────────────────────┐
│           CICLO DE ECONOMIA DE TOKENS            │
│                                                  │
│  1. ANTES da tarefa:                             │
│     ├─ Qual skill se aplica?                     │
│     ├─ Já tenho contexto suficiente?             │
│     └─ Posso delegar a subagent?                 │
│                                                  │
│  2. DURANTE a tarefa:                            │
│     ├─ grep/read com alvo específico              │
│     ├─ Consolidar edits em batch                 │
│     ├─ Output telegráfico (caveman)              │
│     └─ Não re-emitir arquivos inteiros           │
│                                                  │
│  3. APÓS a tarefa:                               │
│     ├─ Verificar com build/teste                 │
│     ├─ /clear se sessão continua                 │
│     └─ Registrar learning se houve               │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

# Parte II — Estratégias

## Capítulo 4 — Prompt Engineering para Agentes

### 4.1 A diferença entre prompt normal e prompt de agente

Em聊天 normal, você envia uma mensagem e recebe uma resposta. Em agente, você envia uma mensagem que dispara uma **cadeia de ações** com tools.

Isso muda tudo:

| Prompt normal | Prompt de agente |
|---|---|
| "Explique X" | "Refatore X seguindo Y padrão" |
| Input → Output | Input → Ações → Verificação → Output |
| Tokens fixos | Tokens crescem com cada tool call |
| Resposta é o produto final | Resposta intermediária pode ser tool call |

### 4.2 Os 5 princípios de prompts eficientes

**Princípio 1 — Specificidade mata ambiguidade:**
```
RUIM:  "Melhore o código"
BOM:   "Extraia a lógica de validação do componente Form.tsx para um hook
        useValidation.ts, mantendo os mesmos tipos e interface pública"
```
Por quê: prompt vago → modelo explora mais arquivos → mais tools calls → mais tokens.

**Princípio 2 — Contexto mínimo necessário:**
```
RUIM:  "Leia todos os arquivos de services/ e me diga quais usam empresa_id"
BOM:   "grep 'empresa_id' em src/features/*/services/"
```
Por quê: grep retorna linhas específicas. read retorna arquivos inteiros.

**Princípio 3 — Boundaries explícitas:**
```
RUIM:  "Crie um módulo de pagamentos"
BOM:   "Crie módulo pagamentos em src/features/pagamentos/
        com: module.ts, permissions.ts, service.ts, types.ts
        Siga padrão do módulo cadastros.
        NÃO crie componentes UI — só backend logic."
```
Por quê: boundaries evitam que o modelo gere código desnecessário.

**Princípio 4 — Format output:**
```
RUIM:  "Verifique se há erros"
BOM:   "Rode npm run build e retorne APENAS linhas que contenham 'error' ou 'Error'"
```
Por quê: output de build tem centenas de linhas. Filtrar = menos tokens no histórico.

**Princípio 5 — Declarar não-fazeres:**
```
RUIM:  (sem restrições)
BOM:   "NÃO delete arquivos existentes. NÃO mude a interface pública.
        NÃO adicione dependências novas."
```
Por quê: restrições reduzemExploração do modelo = menos tools calls = menos tokens.

### 4.3 Padrões de prompts por tarefa

**Refatoração:**
```
"Refatore [ARQUIVO] para [OBJETIVO].
 Mantenha: [O QUE NÃO MUDAR].
 Contexto: [DEPENDÊNCIAS RELEVANTES]."
```

**Bug fix:**
```
"Bug: [COMPORTAMENTO ESPERADO] vs [COMPORTAMENTO ATUAL].
 Arquivo: [PATH] linha [N].
 Fix: [O QUE MUDAR].
 Verificar: [COMO CONFIRMAR QUE FUNCIONA]."
```

**Nova feature:**
```
"Criar [FEATURE] em [PATH].
 Padrão:参照 [ARQUIVO EXISTENTE SIMILAR].
 Escopo: [O QUE INCLUIR]. Fora do escopo: [O QUE NÃO FAZER]."
```

**Investigação:**
```
"Encontrar [O QUE] em [ONDE].
 Restrição: [LIMITES DA BUSCA].
 Retornar: [FORMATO DA RESPOSTA]."
```

---

## Capítulo 5 — Sistema de Skills

### 5.1 O que é uma skill

Uma skill é um **prompt especializado e persistente** que o agente pode carregar sob demanda. Em vez de colocar 500 linhas de instruções no AGENTS.md (carregado toda sessão), você coloca em um arquivo separado e carrega só quando necessário.

**Analogia:** AGENTS.md é o manual do usuário. Skills são os manuais de cada ferramenta da caixa.

### 5.2 Arquitetura de uma skill

```
.agents/skills/
├── deploy-vps/
│   ├── SKILL.md          ← Instruções (carregado sob demanda)
│   └── templates/        ← Templates auxiliares
├── criar-modulo/
│   └── SKILL.md
├── calcular-gastos-sessao/
│   └── SKILL.md
└── lean-ctx/
    └── SKILL.md
```

Estrutura típica de um SKILL.md:
```markdown
---
name: nome-da-skill
description: O que faz e quando ativar
---
# Nome da Skill
## Quando usar
## O que fazer (passo a passo)
## O que NÃO fazer
## Referências
```

### 5.3 Skills vs inline coding

| Abordagem | Tokens por sessão | Consistência | Manutenção |
|---|---|---|---|
| Tudo inline no AGENTS.md | ALTO (sempre carregado) | Baixa (cada sessão interpreta diferente) | Difícil (mexer em 300 linhas) |
| Skills sob demanda | BAIXO (carrega só quando precisa) | ALTA (instrução sempre a mesma) | Fácil (arquivo isolado) |

### 5.4 Quando criar uma skill

Crie uma skill quando:
- ✅ O procedimento é usado frequentemente
- ✅ Tem 10+ linhas de instrução
- ✅ Envolve múltiplos passos
- ✅ Precisa ser consistente entre sessões
- ❌ É uma regra simples (coloque no AGENTS.md)
- ❌ É específico de uma sessão (não precisa persistir)

### 5.5 Catálogo de skills universais

Toda IDE agêntica deveria ter estas skills:

| Skill | Propósito | Impacto |
|---|---|---|
| `deploy` | Pipeline de deploy completo | Evita setup manual toda vez |
| `cost-tracker` | Rastreamento de custos | Visibilidade do consumo |
| `lean-context` | Inspeção eficiente de código | Reduz 60-80% dos tokens de leitura |
| `pre-flight-check` | Verificação antes de mudanças | Evita retrabalho |
| `caveman` | Modo ultra-condensado | Reduz 50-70% dos tokens de output |
| `module-scaffold` | Geração de boilerplate | Consistência + velocidade |

---

## Capítulo 6 — Cache e Reutilização

### 6.1 O conceito de cache em agentes

Diferente de cache de software (Redis, CDN), cache em agentes é **evitar reconstruir informação que já existe**.

Os 3 níveis de cache:

```
Nível 1: CACHE DE CONHECIMENTO
  → Não ler o que já sei (regras no AGENTS.md)
  → Não buscar o que já foi buscado (grep antes de read)

Nível 2: CACHE DE CÓDIGO
  → Não reescrever o que já existe (usar templates/skills)
  → Não reinventar o padrão (参照 código existente)

Nível 3: CACHE DE SESSÃO
  → Não manter contexto morto (/clear regularmente)
  → Não reenviar o que não será usado (delegar a subagents)
```

### 6.2 Padrões de cache práticos

**Padrão 1 — Grep → Read → Edit (nunca Read → Read → Edit):**
```
# Sequência eficiente
1. grep "nomeDaFuncao" src/          → encontro o arquivo + linha
2. read "arquivo.ts:42-60"           → leio SÓ a função
3. edit "arquivo.ts#TAG:45-55"       → edito SÓ o que muda

# Sequência ineficiente
1. read "arquivo.ts"                 → leio arquivo inteiro (500 linhas)
2. read "outro.ts"                   → leio outro inteiro (300 linhas)
3. edit "arquivo.ts"                 → edito 10 linhas de 500
```

**Padrão 2 — Assinatura antes de corpo:**
```typescript
# Efficiente: leio interface (20 tokens) antes de decidir se preciso do corpo
grep "export.*interface.*Service" src/
read "service.ts:1-15"               ← só a interface

# Ineficiente: leio corpo inteiro (500 tokens) sem saber se é o que preciso
read "service.ts"                    ← arquivo inteiro
```

**Padrão 3 — Consolidar edits:**
```
# Efficiente: 1 write com tudo
write "novo-arquivo.ts" [conteúdo completo]

# Ineficiente: 5 edits incrementais
edit arquivo1: adicionar import
edit arquivo1: adicionar função
edit arquivo1: adicionar export
edit arquivo2: importar nova função
edit arquivo2: usar nova função
```

**Padrão 4 — Subagent para leitura pesada:**
```
# Efficiente: subagent lê 20 arquivos, retorna resumo de 200 tokens
task "Leia os 20 arquivos de services/ e retorne:
      1. Quais usam empresa_id
      2. Quais têm RLS
      3. Quais precisam de migration"

# Ineficiente: 20 reads inline no contexto principal
read service1.ts
read service2.ts
... (20x)
# 20K tokens de contexto permanentes
```

### 6.3 O paradoxo do cache

Cache demais também custa:
- Manter 100 regras no AGENTS.md = 5K tokens × N turnos
- Manter 10 skills carregadas = 10K tokens × N turnos
- Melhor: 10 regras essenciais + 30 skills sob demanda

**Regra:** se uma regra não é usada em 80% das sessões, ela não deveria estar no AGENTS.md.

---

# Parte III — Padrões

## Capítulo 7 — Subagents e Delegação

### 7.1 O que é subagent

Um subagent é um **agente isolado** com seu próprio system prompt, contexto e memória. Ele executa uma tarefa e retorna o resultado ao agente principal.

```
┌─────────────────────────────────────────┐
│           AGENTE PRINCIPAL               │
│  System prompt: 5K tokens               │
│  Contexto: cresce a cada turno          │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │Subagent A│  │Subagent B│  ← paralelos│
│  │ 5K prompt│  │ 5K prompt│            │
│  │ 2K tarefa│  │ 2K tarefa│            │
│  └──────────┘  └──────────┘            │
│       │              │                  │
│       ▼              ▼                  │
│  resultado A    resultado B  (resumidos)│
│  ~200 tokens    ~200 tokens            │
└─────────────────────────────────────────┘
```

### 7.2 Quando usar subagents

| Cenário | Usar subagent? | Por quê |
|---|---|---|
| 5 tarefas paralelas e independentes | ✅ SIM | Paralelismo real, cada um isolado |
| 1 tarefa sequencial longa | ❌ NÃO | Mais overhead que benefício |
| Leitura de muitos arquivos | ✅ SIM | Contexto de leitura não polui principal |
| Design inicial de arquitetura | ❌ NÃO | Subagent não tem contexto da conversa |
| Code review de diff grande | ✅ SIM | Isola análise sem crescer contexto principal |
| Edição cirúrgica em 1 arquivo | ❌ NÃO | Mais eficiente fazer inline |

### 7.3 O padrão de delegação eficiente

```
1. ESCOPO: O agente principal define o que precisa
2. ISOLAMENTO: Cada subagent tem tarefa autocontida
3. RESUMO: Subagent retorna resultado compacto
4. VERIFICAÇÃO: Agente principal valida antes de aceitar
```

### 7.4 Erros comuns

**Erro 1 — Subagent sem objetivo claro:**
```
# RUIM: "Analise o projeto"
# BOM:  "Liste todos os services que usam 'empresa_id' em
#        src/features/*/services/*.ts e retorne formato:
#        arquivo:qtd_usos"
```

**Erro 2 — Subagent delegando design:**
```
# RUIM: "Planeje a arquitetura do módulo pagamentos"
# (subagent não tem contexto da conversa, vai inventar coisas)

# BOM: Agente principal planeja → delega execução ao subagent
# "Crie os arquivos conforme este plano: [plano definido]"
```

**Erro 3 — Muitos subagents sequenciais:**
```
# RUIM: spawn A, espera A, spawn B, espera B, spawn C, espera C
# (3 round-trips sequenciais)

# BOM: spawn [A, B, C] em paralelo, espera todos
# (1 round-trip paralelo)
```

### 7.5 O custo real de subagents

Cada subagent gasta:
- System prompt: ~3-5K tokens (SEU system prompt, não o do principal)
- Tarefa: ~500-2K tokens
- Output: ~200-1K tokens

**Região de custo-benefício:**
- 1 subagent para tarefa simples: ❌ caro demais
- 3-5 subagents para tarefas paralelas: ✅ eficiente
- 10+ subagents: ⚠️ overhead de coordenação

---

## Capítulo 8 — MCP e Ferramentas

### 8.1 O que é MCP

MCP (Model Context Protocol) é um protocolo que permite a IDE agêntica conectar a **tools externas** — bancos de dados, APIs, filesystem, etc. Cada tool é uma function que o modelo pode chamar.

### 8.2 O custo oculto das tools

Cada tool call gera:
- **Input:** descrição da tool + schema JSON + argumentos
- **Output:** resultado (pode ser grande)

Exemplo real:
```json
// Input (descrição da tool) — ~200 tokens
{
  "name": "supabase_execute_sql",
  "description": "Execute raw SQL on Supabase...",
  "parameters": { "sql": "SELECT..." }
}

// Output (resultado) — pode ser 500-5000 tokens
[
  { "id": 1, "nome": "Item A", "empresa_id": "uuid..." },
  { "id": 2, "nome": "Item B", "empresa_id": "uuid..." },
  // ... 100+ linhas
]
```

### 8.3 Padrões de otimização de tools

**Padrão 1 — SELECT com limite:**
```sql
-- RUIM: retorna tudo
SELECT * FROM produtos WHERE empresa_id = 'xxx';

-- BOM: retorna só o necessário
SELECT id, nome, preco FROM produtos
WHERE empresa_id = 'xxx'
LIMIT 50;
```

**Padrão 2 — Filtrar output no prompt:**
```
"Rode SQL e retorne APENAS: nomes dos produtos com estoque < 10"
(não: "retorne tudo e eu analiso")
```

**Padrão 3 — Cache de schema:**
```
# Primeira vez: descreva a tabela completa
supabase_describe_table("produtos")  → 500 tokens

# Nas vezes seguintes: já sei o schema, não peça de novo
# Se precisar, grep no migration file (mais barato)
```

**Padrão 4 — Tools vs código inline:**
```
# Para queries simples: usar tool (mais seguro, tem validação)
supabase_execute_sql("SELECT count(*) FROM pedidos")

# Para queries complexas com múltiplas passes: script inline
# (evita 5 tool calls sequenciais)
```

---

## Capítulo 9 — Gerenciamento de Estado

### 9.1 O problema do estado em sessões longas

Sessões agênticas são **stateful** — cada turno adiciona ao histórico. Isso cria um problema fundamental:

```
Sessão de 30 turnos:
  Turno 1:  5K tokens (system + pergunta)
  Turno 15: 70K tokens (system + 14 turnos + pergunta)
  Turno 30: 150K tokens (system + 29 turnos + pergunta)

Se a janela é 200K: no turno 25+, o modelo começa a perder contexto antigo
```

### 9.2 Estratégias de gerenciamento

**Estratégia 1 — /clear periódico:**
```
# Regra: /clear após cada tarefa completa
# "Terminei o deploy. /clear. Próxima tarefa:..."
```

**Estratégia 2 — Sessão por tarefa:**
```
# Uma sessão = uma tarefa
# Tarefa 1: criar módulo → /clear
# Tarefa 2: testar módulo → /clear
# Tarefa 3: deploy → fim
```

**Estratégia 3 — Scratchpad persistente:**
```markdown
# Em vez de manter 30 turnos de contexto,
# resumir em scratchpad:

## O que foi feito
- Módulo pagamentos criado em src/features/pagamentos/
- Migration 00055 aplicada
- Build passando

## Pendente
- Adicionar testes
- Integrar com catálogo
```

**Estratégia 4 — Context windows por ferramenta:**

| Ferramenta | Como gerenciar |
|---|---|
| Oh My Pi | `/clear` + skills + subagents |
| OpenCode | `/clear` + context files otimizados |
| MiMoCode | Sessões curtas + scratchpad |
| Antigravity | Delegação + parallel tasks |
| Claude Code | `/clear` + compact flag |
| Cursor | .cursorrules lean + /compact |

### 9.3 O sinal de que precisa limpar

Sinais de que o contexto está poluído:
- O agente repete código já gerado
- Ignora regras definidas no início
- Gera soluções para problemas que já foram resolvidos
- Leva mais tokens que o normal para uma tarefa simples
- Respostas ficam vagas ou genéricas

**Ação:** `/clear` imediatamente.

---

# Parte IV — Frameworks

## Capítulo 10 — Árvore de Decisão Universal

### 10.1 Antes de começar QUALQUER tarefa

```
                    ┌─────────────────────┐
                    │  NOVA TAREFA CHEGOU  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Existe skill para    │──SIM──▶ Ler skill primeiro
                    │ isso?                │
                    └──────────┬──────────┘
                               │ NÃO
                    ┌──────────▼──────────┐
                    │ É tarefa paralela    │──SIM──▶ Delegar a subagent(s)
                    │ a outras?            │
                    └──────────┬──────────┘
                               │ NÃO
                    ┌──────────▼──────────┐
                    │ Já tenho contexto    │──SIM──▶ Executar inline
                    │ suficiente?          │
                    └──────────┬──────────┘
                               │ NÃO
                    ┌──────────▼──────────┐
                    │ Preciso ler código?  │──SIM──▶ grep → read alvo → edit
                    └──────────┬──────────┘
                               │ NÃO
                    ┌──────────▼──────────┐
                    │ Executar e verificar │
                    └─────────────────────┘
```

### 10.2 Durante a execução

```
┌─────────────────────────────────────────────────────┐
│                CHECKLIST DE EXECUÇÃO                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  □ Estou usando a tool mais leve possível?           │
│    (grep > read, glob > ls, edit > write)            │
│                                                      │
│  □ Li SÓ o que preciso?                              │
│    (assinatura antes de corpo, range antes de file)   │
│                                                      │
│  □ Consolidei edits?                                 │
│    (1 write > 5 edits incrementais)                  │
│                                                      │
│  □ Output está telegráfico?                          │
│    (sem explicações não solicitadas)                  │
│                                                      │
│  □ Contexto acumulado está prejudicando?             │
│    (se sim: /clear e recomeçar)                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 10.3 Após a tarefa

```
┌─────────────────────────────────────────────────────┐
│              CHECKLIST PÓS-TAREFA                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  □ Build/test passou?                                │
│    (SEMPRE rodar build após alterações)              │
│                                                      │
│  □ Preciso registrar learning?                       │
│    (se descobri regra nova ou bug, sim)              │
│                                                      │
│  □ Sessão continua ou /clear?                        │
│    (se tarefa seguinte é independente: /clear)       │
│                                                      │
│  □ Custo da sessão está razoável?                    │
│    (exibir [💰 Ação: R$ X | Sessão: R$ Y])         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Capítulo 11 — Métricas e Rastreamento

### 11.1 O que medir

| Métrica | O que revela | Como medir |
|---|---|---|
| Tokens por tarefa | Eficiência da abordagem | Contar input+output por ação |
| Custo por sessão | Impacto financeiro | tokens × preço do modelo |
| Turnos por tarefa | Complexidade da comunicação | Contar turnos até conclusão |
| Tools calls por tarefa | Exploração vs execução | Contar chamadas de tool |
| Taxa de /clear | Qualidade do contexto | Clears / turnos totais |

### 11.2 Benchmarking por tipo de tarefa

| Tipo de tarefa | Tokens esperados | Tempo esperado |
|---|---|---|
| Bug fix simples | 5K-15K | 1-3 turnos |
| Refatoração | 15K-40K | 3-8 turnos |
| Nova feature ( CRUD) | 30K-80K | 5-15 turnos |
| Módulo completo | 80K-200K | 15-30 turnos |
| Deploy | 20K-50K | 5-10 turnos |

Se você está gastando 2× esses valores, algo está errado na abordagem.

### 11.3 Onde rastrear custos

**Opção 1 — Arquivo compartilhado:**
```jsonl
{"ts":"...","action":"criar-modulo","model":"...","tokens_in":1200,"tokens_out":3400,"cost":0.0087}
```

**Opção 2 — Banco de dados:**
```sql
-- Tabela agentes_usage_log no Supabase
SELECT action, sum(cost) as total
FROM agentes_usage_log
WHERE created_at >= current_date
GROUP BY action;
```

**Opção 3 — Output no chat:**
```
[💰 Ação: R$ 0,0087 | Sessão: R$ 0,0423]
```

---

## Capítulo 12 — Checklist Universal

### 12.1 Setup inicial de qualquer IDE agêntica

```
□ Criar AGENTS.md mínimo (<100 linhas)
  ├─ Estrutura do projeto (3-5 linhas)
  ├─ Comandos essenciais (4 linhas)
  ├─ Regras arquiteturais (5-10 bullets)
  ├─ Regras de UI (se aplicável)
  └─ Economia de tokens (10-15 linhas)

□ Criar skills para procedimentos recorrentes
  ├─ deploy
  ├─ cost-tracker
  ├─ lean-context
  └─ procedimentos específicos do projeto

□ Configurar .gitignore para não versionar:
  ├─ .agents/session-cost.jsonl
  ├─ .agents/scratchpad.md
  └─ node_modules, dist, .env
```

### 12.2 Para cada sessão

```
INÍCIO:
□ Sessão anterior foi limpa? (/clear se necessário)
□ AGENTS.md está enxuto? (<100 linhas)
□ Skills relevantes estão disponíveis?

DURANTE:
□ grep antes de read
□ Assinatura antes de corpo
□ Edits consolidados
□ Output telegráfico
□ Subagents para paralelismo

FIM:
□ Build/test passou
□ /clear se sessão continua
□ Custo registrado
```

### 12.3 Anti-padrões universais

| Anti-padrão | Custo | Correção |
|---|---|---|
| AGENTS.md > 200 linhas | ~50K+ tokens/sessão | Comprimir para <100 linhas |
| Ler arquivo inteiro sem necessidade | 500-2000 tokens extras | grep → read com range |
| 5 turnos sequenciais para 1 tarefa | 5x o overhead de system prompt | Consolidar em 1-2 turnos |
| Não usar /clear | Contexto cresce indefinidamente | /clear entre tarefas |
| Output longo sem pedido | Output tokens caros | Telegráfico (caveman) |
| Subagent para tarefa simples | 5K+ tokens de overhead | Fazer inline |
| Não usar skills | Reinventar procedimento toda vez | Criar e usar skill |
| Delegar design a subagent | Subagent não tem contexto | Agente principal planeja |

---

# Apêndices

## A — Glossário

| Termo | Definição |
|---|---|
| **Token** | Unidade atômica de processamento de texto pelo modelo |
| **Context window** | Limite de tokens que o modelo processa de uma vez |
| **System prompt** | Instruções base carregadas em toda chamada |
| **Turno** | Uma troca: pergunta do usuário + resposta do modelo |
| **Tool call** | Chamada a uma function externa (bash, read, edit, etc.) |
| **Subagent** | Agente isolado com contexto próprio |
| **Skill** | Prompt especializado carregado sob demanda |
| **MCP** | Model Context Protocol — protocolo para tools externas |
| **AGENTS.md** | Arquivo de regras globais do projeto |
| **Scratchpad** | Memória persistente entre sessões |
| **Lean-CTX** | Estratégia de minimizar tokens de leitura |
| **Caveman** | Modo de output ultra-condensado |

## B — Tabela de Custos por Modelo (Referência — Julho 2026)

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) | Custo relativo |
|---|---|---|---|
| Claude 3.5 Sonnet | $3.00 | $15.00 | 1× (baseline) |
| Claude 3 Opus | $15.00 | $75.00 | 5× |
| Claude 3 Haiku | $0.25 | $1.25 | 0.08× |
| GPT-4o | $2.50 | $10.00 | 0.83× |
| GPT-4o-mini | $0.15 | $0.60 | 0.05× |
| Gemini 1.5 Pro | $1.25 | $5.00 | 0.42× |
| Gemini 2.0 Flash | $0.10 | $0.40 | 0.03× |
| DeepSeek V3 | $0.50 | $2.00 | 0.17× |

**Conversão USD → BRL:** multiplicar por ~5.50

**Cálculo de custo:**
```
custo = (tokens_in / 1_000_000 × input_price) + (tokens_out / 1_000_000 × output_price)
```

## C — Template de AGENTS.md Otimizado

```markdown
# AGENTS.md — [Nome do Projeto]

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Estrutura
- [Pasta principal] → [Tecnologia]
- [Pasta secundária] → [Descrição]

## Comandos
npm run dev / npm run build / npm run lint

## Regras de Arquitetura
- [Regra 1 — uma linha]
- [Regra 2 — uma linha]
- [Regra N]

## Regras de UI (se aplicável)
- [Proibido X, obrigatório Y]

## Economia de Tokens
- Skill-first: ler skill antes de tarefa complexa
- Lean-CTX: grep antes de read
- Subagents: delegar paralelismo
- /clear entre tarefas

## Deploy
Só quando pedido. Usar skill deploy-vps.
```

---


---

# Parte V — Rules e Commands

## Capítulo 13 — Rules: O Sistema de Regras

### 13.1 O que são rules

Rules são **instruções persistentes** que o harness injeta no system prompt. Elas definem o comportamento do agente, regras do projeto, limites e preferências.

```
┌─────────────────────────────────────────────┐
│            SYSTEM PROMPT                     │
├─────────────────────────────────────────────┤
│                                              │
│  INSTRUÇÕES BASE (fixas pelo harness)        │
│    ↓                                         │
│  RULES (injetadas de arquivos)    ← AQUI    │
│    ├─ AGENTS.md / CLAUDE.md                  │
│    ├─ .cursorrules / .windsurfrules          │
│    └─ .opencode/rules/                       │
│    ↓                                         │
│  TOOLS (descrições JSON)                     │
│    ↓                                         │
│  SKILLS (carregadas sob demanda)              │
│                                              │
└─────────────────────────────────────────────┘
```

### 13.2 Hierarquia de rules

Rules têm **prioridade** — mais específicas sobrescrevem mais gerais:

```
Nível 1: GLOBAL        (~/.config/ ou ~/.claude/)
  │      Ex: ~/.claude/CLAUDE.md
  │      Afeta: TODOS os projetos
  │
  ▼
Nível 2: PROJETO       (raiz do repo)
  │      Ex: AGENTS.md, .cursorrules
  │      Afeta: TUDO neste projeto
  │
  ▼
Nível 3: PASTA         (subdiretório)
  │      Ex: src/features/catalogo/AGENTS.md
  │      Afeta: Só esta pasta e filhos
  │
  ▼
Nível 4: SESSÃO        (temporário)
         Ex: instrução no chat desta sessão
         Afeta: Só esta sessão
```

### 13.3 Onde fica em cada IDE

| IDE | Global | Projeto | Pasta | Arquivo de config |
|---|---|---|---|---|
| **Oh My Pi** | `~/.config/opencode/` | `AGENTS.md` | `AGENTS.md` em subpasta | `opencode.json` |
| **OpenCode** | `~/.config/opencode/` | `AGENTS.md` + `opencode.json` | `AGENTS.md` | `opencode.json` |
| **MiMoCode** | similar ao OpenCode | `AGENTS.md` | `AGENTS.md` | config files |
| **Claude Code** | `~/.claude/CLAUDE.md` | `CLAUDE.md` | `CLAUDE.md` | `settings.json` |
| **Cursor** | `~/.cursorrules` | `.cursorrules` | `.cursorrules` | `.cursor/settings.json` |
| **Windsurf** | `~/.windsurfrules` | `.windsurfrules` | `.windsurfrules` | `.windsurf/` |
| **Cline** | `~/.clinerules` | `.clinerules` | `.clinerules` | `.cline/` |
| **Aider** | `~/.aider.conf.yml` | `.aider.conf.yml` | `CONVENTIONS.md` | `.aider.conf.yml` |

### 13.4 O que vai em rules vs o que vai em skills

| Conteúdo | Onde colocar | Por quê |
|---|---|---|
| Regra de 1 linha | Rule (AGENTS.md) | Sempre ativa, baixo custo |
| Regra arquitetural | Rule (AGENTS.md) | Importante em toda sessão |
| Procedimento de 10+ passos | Skill | Carregar só quando necessário |
| Template de código | Skill | Não precisa estar sempre no contexto |
| Comportamento de output | Rule (AGENTS.md) | Afeta todas as respostas |
| Pipeline de deploy | Skill | Usado raramente |

### 13.5 O custo oculto de rules

Cada rule no AGENTS.md é **reenviada em TODAS as chamadas**:

```
AGENTS.md com 200 linhas (~5K tokens):
  Sessão de 10 chamadas = 5K × 10 = 50K tokens de rules
  Sessão de 30 chamadas = 5K × 30 = 150K tokens de rules

AGENTS.md com 80 linhas (~2K tokens):
  Sessão de 10 chamadas = 2K × 10 = 20K tokens de rules
  Sessão de 30 chamadas = 2K × 30 = 60K tokens de rules
```

**Regra:** se uma rule não é usada em 80%+ das sessões, mova para skill.

### 13.6 Regras de performance para AGENTS.md

```
✅ FAZER (mantém AGENTS.md lean):
- Regras em 1 linha (bullet points)
- Referenciar skills em vez de descrever procedimentos
- Remover código de exemplo (ir para docs ou skills)
- Remover tabelas grandes (ir para skills)
- Usar "参照 existente" em vez de copiar código

❌ NÃO FAZER (incha o AGENTS.md):
- Code examples > 5 linhas
- Tabelas > 10 linhas
- Procedimentos multi-step
- Explicações detalhadas de como funciona
- Redundância (repetir em rules o que já está em skills)
```

---

## Capítulo 14 — Commands: O Sistema de Comandos

### 14.1 O que são commands

Commands são **instruções especiais** que o usuário digita no chat para controlar o harness. Eles NÃO vão para o LLM — são interceptados pelo harness.

```
USUÁRIO digita: /clear
  │
  ▼
HARNESS intercepta (não envia ao LLM)
  │
  ▼
HARNESS limpa o histórico de mensagens
  │
  ▼
Próxima mensagem começa com contexto limpo
```

### 14.2 Commands universais

| Command | O que faz | Quando usar |
|---|---|---|
| `/clear` | Limpa histórico | Entre tarefas, quando contexto está poluído |
| `/compact` | Comprime histórico | Quando janela está quase cheia |
| `/cost` | Mostra custo da sessão | Para verificar consumo |
| `/help` | Lista comandos disponíveis | Para descobrir opções |

### 14.3 Commands por IDE

**Oh My Pi:**
```
/clear          → Limpa sessão
/compact        → Comprime contexto
/commit         → Gera commit message
skill://nome    → Carrega skill
```

**OpenCode:**
```
/clear          → Limpa sessão
/compact        → Comprime contexto
/model          → Troca modelo
/cost           → Mostra custo
```

**Claude Code:**
```
/clear          → Limpa sessão
/compact        → Comprime contexto (flag)
/cost           → Mostra custo
/doctor         → Diagnóstico
/model          → Troca modelo
/permissions    → Gerencia permissões
```

**Cursor:**
```
/clear          → Limpa contexto
/compact        → Comprime
Cmd+K           → Inline edit
Cmd+L           → Chat
Cmd+I           → Composer
```

### 14.4 Criando commands customizados

Em algumas IDEs, você pode criar commands customizados:

**Oh My Pi (via skills):**
```markdown
# skills/meu-comando/SKILL.md
---
name: meu-comando
trigger: "meu-comando", "/mc"
---
# Meu Comando Customizado
Instruções do que fazer quando o comando é invocado...
```

**Claude Code (via settings.json):**
```json
{
  "customInstructions": {
    "/meu-comando": "Faça X, Y, Z quando este comando for invocado"
  }
}
```

### 14.5 Commands que economizam tokens

| Command | Economia | Como |
|---|---|---|
| `/clear` | 50-90% | Remove todo o histórico acumulado |
| `/compact` | 30-50% | Comprime histórico antigo em resumo |
| Trocar para modelo barato | 80-95% | Haiku/Flash para tarefas simples |
| Usar skill em vez de explicar | 40-60% | Skill já tem as instruções |

---

# Parte VI — Configurações Avançadas e Ocultas

## Capítulo 15 — O que Ninguém Fala: Configurações Secretas

### 15.1 Configurações ocultas do Claude Code

**`~/.claude/settings.json` (global):**
```json
{
  "permissions": {
    "allow": ["Bash(npm run build:*), "Read", "Write"],
    "deny": ["Bash(rm -rf *)"]
  },
  "env": {
    "CLAUDE_BASH_MAINTAIN_WORKING_DIR": "1"
  },
  "model": "claude-sonnet-4-20250514"
}
```

**`~/.claude/settings.local.json` (não versionado):**
```json
{
  "api_key": "sk-ant-...",
  "preferred_model": "claude-sonnet-4-20250514"
}
```

**Flags de ambiente:**
```bash
# Controlar max tokens de output
export CLAUDE_MAX_TOKENS=8192

# Modo não-interativo (para scripts)
export CLAUDE_NON_INTERACTIVE=1

# Manter working directory entre bash calls
export CLAUDE_BASH_MAINTAIN_WORKING_DIR=1
```

### 15.2 Configurações ocultas do OpenCode/MiMoCode

**`opencode.json` (raiz do projeto):**
```json
{
  "model": "opencode/hy3-free",
  "contextWindow": 200000,
  "maxTokens": 4096,
  "temperature": 0.7,
  "providers": {
    "anthropic": { "apiKey": "..." },
    "openai": { "apiKey": "..." }
  }
}
```

**`.opencode/rules/` (regras por arquivo):**
```
.opencode/
├── rules/
│   ├── 00-global.md      ← sempre carregado
│   ├── 10-frontend.md    ← carregado para arquivos frontend
│   └── 20-backend.md     ← carregado para arquivos backend
└── skills/
    └── deploy/
        └── SKILL.md
```

### 15.3 Configurações ocultas do Cursor

**`.cursor/settings.json`:**
```json
{
  "cursor.cpp.contextLines": 50,
  "cursor.chat.model": "claude-3.5-sonnet",
  "cursor.composer.model": "claude-3.5-sonnet",
  "cursor.codebase.indexing": true,
  "cursor.codebase.maxFileSize": 1000000
}
```

**`.cursorignore` (não indexar):**
```
node_modules/
dist/
*.min.js
*.map
.git/
```

**Codebase indexing:** o Cursor indexa seu projeto para encontrar código relevante. Arquivos muito grandes ou binários devem ser ignorados.

### 15.4 Configurações de modelo por tarefa

Em IDEs que suportam múltiplos modelos:

| Tipo de tarefa | Modelo recomendado | Custo | Quando |
---|---|---|---|
| Code generation complexo | Claude Sonnet / GPT-4o | Alto | Features, refatorações |
| Bug fix simples | Haiku / GPT-4o-mini | Baixo | Fixes pontuais |
| Leitura/grepping | Haiku / Flash | Muito baixo | Exploração de código |
| Deploy | Sonnet | Alto | Pipelines críticos |
| Documentação | Haiku / Flash | Baixo | READMEs, docs |

### 15.5 Temperature e parâmetros ocultos

| Parâmetro | O que faz | Quando alterar |
---|---|---|
| `temperature` (0-1) | Criatividade do output | 0 para código, 0.7 para brainstorm |
| `top_p` (0-1) | Diversidade de tokens | Raramente alterar |
| `max_tokens` | Limite de output | Aumentar para outputs longos |
| `stop` | Sequências que param geração | Raramente usar |

**Regra padrão:** deixe temperature=0 para código. Só mude se precisar de criatividade.

---

## Capítulo 16 — Tuning de Performance

### 16.1 Model selection inteligente

```
┌─────────────────────────────────────────────────┐
│          ÁRVORE DE SELEÇÃO DE MODELO             │
├─────────────────────────────────────────────────┤
│                                                  │
│  Tarefa simples? (grep, read, format)            │
│    ├─ SIM → Haiku/Flash/GPT-4o-mini (barato)    │
│    └─ NÃO ↓                                      │
│                                                  │
│  Tarefa de código? (write, edit, refactor)       │
│    ├─ SIM → Sonnet/GPT-4o/Gemini Pro            │
│    └─ NÃO ↓                                      │
│                                                  │
│  Tarefa crítica? (deploy, migration, arch)       │
│    ├─ SIM → Opus/GPT-4o (máxima qualidade)      │
│    └─ NÃO → Sonnet (default)                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 16.2 Rate limiting e retry

Provedores impõem limites de taxa:

| Provedor | Limite típico | Estratégia |
---|---|---|
| Anthropic | 4K TPM (tokens por minuto) | Espaçar chamadas |
| OpenAI | 10K TPM | Batch quando possível |
| Google | 32K TPM | Mais宽松 |

**Retry strategy:**
```
Tentativa 1: imediata
Tentativa 2: esperar 1s
Tentativa 3: esperar 5s
Tentativa 4: esperar 30s (backoff exponencial)
Tentativa 5: falhar e notificar usuário
```

### 16.3 Batch processing

Quando possível, agrupar operações:

```
# RUIM: 3 chamadas separadas
call 1: "Leia arquivo A"
call 2: "Leia arquivo B"
call 3: "Leia arquivo C"

# BOM: 1 chamada com as 3
call 1: "Leia arquivos A, B e C"
```

### 16.4 Caching de respostas

Alguns harnesses (como Oh My Pi) implementam cache de tool results:

```
Primeira chamada: grep "empresa_id" src/  → resultado cacheado
Segunda chamada:  grep "empresa_id" src/  → resultado do cache (0 tokens)
```

Isso não se aplica a chamadas ao LLM (sempre reenvia), mas a tool results sim.

---

# Parte VII — Aplicação Prática

## Capítulo 17 — Guia por IDE: Setup Completo

### 17.1 Oh My Pi — Setup

**Estrutura de arquivos:**
```
projeto/
├── AGENTS.md                    ← Regras globais do projeto
├── opencode.json                ← Config do harness
├── .gemini/
│   └── GEMINI.md               ← Regras específicas Gemini
└── .agents/
    ├── skills/
    │   ├── deploy-vps/
    │   │   └── SKILL.md
    │   └── criar-modulo/
    │       └── SKILL.md
    ├── session-cost.jsonl       ← Tracking de custos
    └── scratchpad.md            ← Memória entre sessões
```

**Configuração (`opencode.json`):**
```json
{
  "model": "opencode/hy3-free",
  "contextWindow": 200000,
  "providers": {
    "anthropic": { "apiKey": "sk-ant-..." }
  }
}
```

**AGENTS.md ideal (mínimo):**
```markdown
# AGENTS.md — Projeto X
**Idioma:** PT-BR. Direto ao ponto.
## Estrutura
- src/ → código fonte
## Comandos
npm run dev / build / lint
## Regras
- Regra 1
- Regra 2
## Economia de Tokens
- Skill-first, lean-ctx, /clear entre tarefas
```

### 17.2 OpenCode — Setup

**Estrutura:**
```
projeto/
├── AGENTS.md
├── opencode.json
└── .opencode/
    ├── rules/
    │   ├── 00-global.md
    │   └── 10-frontend.md
    └── skills/
        └── deploy/
            └── SKILL.md
```

**Comandos úteis:**
```bash
opencode                    # Iniciar sessão
opencode --model haiku      # Usar modelo específico
opencode --clear            # Limpar contexto
```

### 17.3 Claude Code — Setup

**Estrutura:**
```
projeto/
├── CLAUDE.md                ← Regras do projeto
└── .claude/
    └── settings.json        ← Config local

~/.claude/
├── CLAUDE.md                ← Regras globais
└── settings.json            ← Config global
```

**Configuração (`settings.json`):**
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Read", "Write"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

**Comandos:**
```bash
claude                      # Iniciar sessão
claude --model opus         # Modelo específico
claude --clear              # Limpar contexto
/compact                    # Comprimir contexto
/cost                       # Ver custo
/doctor                     # Diagnóstico
```

### 17.4 Cursor — Setup

**Estrutura:**
```
projeto/
├── .cursorrules             ← Regras do projeto
├── .cursorignore            ← Ignorar no index
└── .cursor/
    └── settings.json        ← Config
```

**`.cursorrules` ideal:**
```
You are a coding assistant.
Always respond in PT-BR.
Follow the existing code patterns.
Never use window.alert().
```

**Dicas:**
- Use `Cmd+K` para inline edits (mais barato que chat)
- Use `Cmd+L` para chat com contexto do arquivo
- Use `Cmd+I` para composer (múltiplos arquivos)
- Configure `.cursorignore` para não indexar `node_modules/`

### 17.5 Outras IDEs

| IDE | Arquivo de regra | Config | Command de limpeza |
|---|---|---|---|
| Windsurf | `.windsurfrules` | `.windsurf/` | `/clear` |
| Cline | `.clinerules` | `.cline/` | `/clear` |
| Aider | `.aider.conf.yml` | `.aider.conf.yml` | `/clear` |
| Antigravity | `AGENTS.md` | config files | `/clear` |
| Freebuff | `AGENTS.md` | config files | `/clear` |

---

## Capítulo 18 — Casos Reais: Antes e Depois

### 18.1 Caso 1: Criar módulo completo

**Antes (sem otimização):**
```
Tarefa: Criar módulo de pagamentos
Turnos: 25
Tokens: ~180K
Custo: ~R$ 0,45
Tempo: 45min

Problemas:
- AGENTS.md com 300 linhas (carregado 25x = 7.5K × 25 = 187K tokens de rules)
- Leu 15 arquivos inteiros sem necessidade
- 8 turnos para descobrir a estrutura do projeto
- Não usou skills (reinventou procedimento)
- Output longo com explicações desnecessárias
```

**Depois (com otimização):**
```
Tarefa: Criar módulo de pagamentos
Turnos: 8
Tokens: ~45K
Custo: ~R$ 0,11
Tempo: 15min

Otimizações:
- AGENTS.md com 80 linhas (carregado 8x = 2K × 8 = 16K tokens de rules)
- Usou skill criar-modulo (instruções prontas)
- grep para encontrar estrutura, não read
- Delegou leitura de 10 arquivos a subagent
- Output telegráfico (caveman mode)
```

**Economia: 75% menos tokens, 75% menos tempo, 75% menos custo.**

### 18.2 Caso 2: Bug fix

**Antes:**
```
Tarefa: Corrigir bug no componente X
Turnos: 12
Tokens: ~60K
Custo: ~R$ 0,15
```

**Depois:**
```
Tarefa: Corrigir bug no componente X
Turnos: 4
Tokens: ~15K
Custo: ~R$ 0,04

Otimizações:
- Prompt específico: "Bug em X linha Y, esperado Z, atual W"
- grep para localizar, read com range, edit cirúrgico
- Build para verificar (output filtrado)
```

**Economia: 75% menos tokens.**

### 18.3 Caso 3: Deploy

**Antes:**
```
Tarefa: Deploy para produção
Turnos: 15
Tokens: ~80K
Custo: ~R$ 0,20
```

**Depois:**
```
Tarefa: Deploy para produção
Turnos: 5
Tokens: ~25K
Custo: ~R$ 0,06

Otimizações:
- Usou skill deploy-vps (pipeline completo em 1 skill)
- Sem leitura desnecessária de arquivos
- Output mínimo (só status de cada step)
```

**Economia: 69% menos tokens.**

---

# Apêndices (Expandidos)

## A — Glossário Completo

| Termo | Definição |
|---|---|
| **Token** | Unidade atômica de processamento de texto pelo modelo |
| **Context window** | Limite de tokens que o modelo processa de uma vez |
| **System prompt** | Instruções base carregadas em toda chamada |
| **Harness** | Camada de software entre usuário e LLM |
| **Rule** | Instrução persistente injetada no system prompt |
| **Skill** | Prompt especializado carregado sob demanda |
| **Command** | Instrução especial interceptada pelo harness |
| **Tool call** | Chamada a uma function externa |
| **Subagent** | Agente isolado com contexto próprio |
| **MCP** | Model Context Protocol — protocolo para tools externas |
| **AGENTS.md** | Arquivo de regras globais do projeto |
| **CLAUDE.md** | Regras do projeto para Claude Code |
| **.cursorrules** | Regras do projeto para Cursor |
| **Lean-CTX** | Estratégia de minimizar tokens de leitura |
| **Caveman** | Modo de output ultra-condensado |
| **Streaming** | Entrega de resposta em tempo real (não economiza tokens) |
| **Temperature** | Parâmetro que控制a criatividade do modelo |
| **Top-p** | Parâmetro que控制a diversidade de tokens |
| **Max tokens** | Limite de tokens de output |
| **Rate limiting** | Restrição de taxa imposta pelo provedor |
| **TPM** | Tokens por minuto (medida de rate limit) |

## B — Tabela de Custos por Modelo (Referência — Julho 2026)

| Modelo | Input (1M tokens) | Output (1M tokens) | Custo relativo |
|---|---|---|---|
| Claude 3.5 Sonnet | $3.00 | $15.00 | 1× |
| Claude 3 Opus | $15.00 | $75.00 | 5× |
| Claude 3 Haiku | $0.25 | $1.25 | 0.08× |
| GPT-4o | $2.50 | $10.00 | 0.83× |
| GPT-4o-mini | $0.15 | $0.60 | 0.05× |
| Gemini 1.5 Pro | $1.25 | $5.00 | 0.42× |
| Gemini 2.0 Flash | $0.10 | $0.40 | 0.03× |
| DeepSeek V3 | $0.50 | $2.00 | 0.17× |
| MiMo v2.5 | $0.30 | $1.50 | 0.10× |
| MiMo v2.5 Pro | $0.80 | $4.00 | 0.27× |

**Conversão USD → BRL:** multiplicar por ~5.50

## C — Template de AGENTS.md Otimizado

```markdown
# AGENTS.md — [Nome do Projeto]

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Estrutura
- [Pasta principal] → [Tecnologia]
- [Pasta secundária] → [Descrição]

## Comandos
npm run dev / build / lint

## Regras de Arquitetura
- [Regra 1 — uma linha]
- [Regra 2 — uma linha]

## Regras de UI (se aplicável)
- [Proibido X, obrigatório Y]

## Economia de Tokens
- Skill-first: ler skill antes de tarefa complexa
- Lean-CTX: grep antes de read
- Subagents: delegar paralelismo
- /clear entre tarefas

## Deploy
Só quando pedido. Usar skill deploy-vps.
```

## D — Template de MCP Server

```typescript
// Exemplo mínimo de MCP server em TypeScript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "meu-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Registrar tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "minha_tool",
      description: "Faz algo específico",
      inputSchema: {
        type: "object",
        properties: {
          param1: { type: "string", description: "Parâmetro 1" }
        },
        required: ["param1"]
      }
    }
  ]
}));

// Executar tool
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "minha_tool") {
    const result = await executarLogica(args.param1);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
  throw new Error(`Tool desconhecida: ${name}`);
});

// Iniciar
const transport = new StdioServerTransport();
server.connect(transport);
```

## E — Template de Skill

```markdown
---
name: nome-da-skill
description: >
  Descrição curta de o que faz e quando ativar.
  Trigger: "palavra-chave1", "palavra-chave2"
---

# Nome da Skill

Descrição detalhada do propósito.

## Quando usar
- Quando o usuário disser X
- Quando a tarefa envolver Y

## Passo a passo
1. Primeiro faça A
2. Depois faça B
3. Verifique com C

## O que NÃO fazer
- Nunca fazer X
- Nunca assumir Y

## Referências
- Arquivo relevante: path/to/file
- Documentação: https://...
```

---

> *"Entenda o harness. Domine o contexto. Comande as rules. Economize cada token."*

> *"O melhor token é aquele que nunca foi gerado."*
