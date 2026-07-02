# Subagentes no MiMoCode

## O que sao

Subagentes sao agentes filhos que voce spawna para executar tarefas especificas. Eles rodam em contexto isolado (ou compartilhado) e retornam um resultado.

## Como criar

Usando a tool `actor`:

```javascript
// Criar e bloquear ate terminar (sincrono)
actor({
  operation: "run",
  subagent_type": "general",    // ou "explore"
  description: "Analise do modulo X",
  prompt: "Leia os arquivos e retorne um resumo...",
  context: "none"               // none | state | full
})

// Criar em background (assincrono)
actor({
  operation: "spawn",
  subagent_type": "general",
  description: "Tarefa longa",
  prompt: "...",
  context: "state"
})
// Retorna actor_id imediatamente
```

## Tipos de subagente

| Tipo | Uso | Acesso a tools |
|------|-----|----------------|
| `general` | Tarefas gerais, multi-step | Todas (exceto change_directory) |
| `explore` | Exploracao rapida de codigo | Read-only (grep, glob, read, bash) |

## Contexto herdados

| Contexto | O que o subagente ve |
|----------|---------------------|
| `none` | Apenas o prompt que voce passou (limpo) |
| `state` | Checkpoint summaries (conhecimento basico) |
| `full` | Conversa inteira do pai (cache compartilhado) |

## Poder e utilidade

### 1. Paralelismo

```javascript
// Duas tarefas independentes rodando ao mesmo tempo
const resultado1 = await agent("Analise modulo A", { description: "..." })
const resultado2 = await agent("Analise modulo B", { description: "...", context: "full" })
```

### 2. Isolamento de contexto

- Subagente nao polui o contexto do pai
- Resultado volta so o necessario
- Conversa do pai fica leve mesmo com tarefas pesadas

### 3. Especializacao

- `explore`: rapido, read-only, bom para buscas
- `general`: completo, pode editar arquivos

### 4. Composicao

```javascript
// Workflow complexo = subagentes em sequencia/paralelo
const doc = await agent("Documente modulo X")
const design = await agent("Aplique design em X")
const resp = await agent("Corrija responsividade de X")
```

### 5. Comunicacao entre agentes

```javascript
// Enviar mensagem para um subagente ja rodando
actor({
  operation: "send",
  to_actor_id: "general-1",
  content: "Priorize o modulo funis"
})
```

## Diferenca entre `run` e `spawn`

| `run` | `spawn` |
|-------|---------|
| Bloqueia ate terminar | Retorna imediatamente |
| Resultado inline | Resultado via notification |
| Uso para tarefas sequenciais | Uso para tarefas paralelas |

## Bind com tasks

Para rastrear progresso:

```javascript
actor({
  operation: "run",
  subagent_type: "general",
  description: "Tarefa X",
  prompt: "...",
  task_id: "T1"  // vincula a task T1
})
```

## Exemplo pratico: Workflow Modulo Completo

Quando o workflow `modulo-completo` e executado, 3 subagentes sao criados:

1. `general-1` → Documentacao (bloqueou, retornou resultado)
2. `general-2` → Design Frontend (bloqueou, retornou resultado)
3. `general-3` → Responsividade (bloqueou, retornou resultado)

Cada um rodou em contexto isolado, leu a skill especifica, executou, e retornou um resumo.

## Operacoes disponiveis

| Operacao | Descricao |
|----------|-----------|
| `run` | Spawn e bloqueia ate completar |
| `spawn` | Spawn em background, retorna actor_id |
| `status` | Verifica status de um actor |
| `wait` | Bloqueia ate actor completar |
| `cancel` | Cancela um actor em execucao |
| `send` | Envia mensagem para actor |

## Contexto `full` vs `none`

- Use `context: "none"` quando o subagente precisa de foco (tarefa isolada)
- Use `context: "full"` quando precisa de historico completo (avaliacao, revisao)
- Use `context: "state"` quando precisa de conhecimento basico sem poluir contexto
