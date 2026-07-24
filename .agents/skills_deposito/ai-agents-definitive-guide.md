---
name: ai-agents-definitive-guide
description: Blueprint p/ construir agentes IA com LangGraph — FSMs, ReAct, supervisor, hierárquico, swarm, HITL
---
# AI Agents: The Definitive Guide — Passos Operacionais

## 1. Finite State Machines (FSM) — Base Paradigma
### 1.1 FSM core vocab
1. Define **State**: snapshot do q sistema sabe (message list, routing hints, progress markers)
2. Define **Event**: algo q acontece desde ultima decisão (tool invocado, resultado retornado)
3. Implement **Guard**: check q decide qual transição tomar baseado em state + event
4. Implement **Action**: trabalho durante transição (invocar tool, append message, salvar checkpoint, pedir input humano)
5. Define **Termination**: condição q sinaliza fim do processo
6. Decompor task complexa em steps: topic ideation → outline gen → drafting → editing → SEO
7. Link cada state a tools especificas
8. Especificar **transitions**: q output de outline dispara drafting state

### 1.2 Hierarchical State Machines (HSM)
1. Identify **Superstate**: agrupa child states c/ políticas comuns (rate limits, safety filters, circuit breakers)
2. Define **Substates**: modos concretos dentro do superstate, herdam guards/actions do pai
3. Implement **History** marker: shallow (ultimo child) ou deep (nested grandchildren) — checkpoint p/ parte do graph
4. Use **Parallel region**: dois ou mais child regions q avançam independentemente (fan-out tool calls)
5. Entry do superstate → shared logic runs once; exit → cleanup runs once

### 1.3 Mapeamento FSM/HSM p/ LangGraph
1. **State schema**: parent graph's TypedDict = shared bus. Subgraphs declaram keys q leem/escrevem
2. **Subgraph = HSM superstate**: internal nodes = substates. Entry node runs on enter, exit edge returns to parent
3. **Guards/conditional edges**: parent-level enforces global policy (budget, safety). Child-level routes among PLAN/ACT/REFLECT
4. **History + checkpointing**: `MemorySaver()` + `thread_id`. Resume subgraph at last completed node
5. Use `state["working_last"]` marker p/ branch on re-enter

## 2. Structured Reasoning Methods
### 2.1 Chain of Thought (CoT)
1. Write system prompt c/ step-by-step instructions: "Begin by describing dataset. Next highlight patterns. Conclude with summary."
2. Bind tools (python_repl) p/ compute metrics, create charts
3. Create AgentExecutor via `create_openai_functions_agent(llm, tools, prompt)`
4. Set `return_intermediate_steps=True`, `handle_parsing_errors=True`
5. Inspect intermediate tool steps via `AgentActionMessageLog` p/ audit trail
6. Use CoT quando: transparencia, reliability, smaller models em tasks complexas

### 2.2 Tree of Thought (ToT)
1. **Thought generation**: smaller LLM proposer gera 3+ distinct approaches (branching paths)
2. **Pruning/reflection**: stronger LLM judge avalia cada option por criteria (clarity, originality, feasibility)
3. **Selection**: judge picks best option by index
4. **Execution**: tool-using researcher + smaller writer model executam path escolhido
5. LangGraph wiring: nodes = propose → reflect → research → draft. Edges = START→propose→reflect→research→draft→END
6. Use small generator LLM + stronger judge LLM + tool researcher + small writer
7. Handoff: node retorna `Command(goto=next_node, update=...)` p/ control shift
8. ToT substitui multi-agent architecture quando setup menor + cheaper resolve

### 2.3 ReAct (Reasoning + Action)
1. Define `AgentState(TypedDict)` c/ `messages: Annotated[Sequence[BaseMessage], add_messages]`
2. Bind tools ao LLM: `model.bind_tools(TOOLS)` — action space = A ∪ L (tools + language)
3. **Policy step**: `call_model` faz `model.invoke([SYSTEM_PROMPT] + state["messages"])`, retorna mensagem
4. **Tool execution**: `tool_node` itera `last.tool_calls`, executa `tool_fn.invoke(args)`, retorna `ToolMessage`
5. **Halting condition**: `should_continue` — se last msg tem tool_calls → continue, senao → end
6. Build graph: `StateGraph(AgentState)` → nodes("agent", call_model) + ("tools", tool_node) → conditional edge agent→tools|END → edge tools→agent
7. Compile: `graph.compile()`
8. Reasoning trace vira parte do state: c(t+1) = (c(t), a_hat(t))

## 3. Human-in-the-Loop (HITL)
### 3.1 Approve/Reject Gate
1. Node gera ação proposta, armazena em state (ex: `proposed_request`)
2. Chama `interrupt(...)` c/ question + schema p/ human decision
3. Human retorna `{"action": "approve"}` ou `{"action": "revise", "update": {...}}`
4. `Command(goto="call_node")` p/ approved; `Command(goto="gate")` p/ revised loop
5. Side-effecting code (API calls) SEMPRE depois do interrupt, nunca no mesmo node

### 3.2 Review and Edit
1. LLM gera conteúdo (ex: summary), armazena em state
2. `interrupt(...)` c/ schema pedindo `edited_text` string
3. Resume c/ `Command(resume={"edited_text": "revision"})`
4. Node retorna state atualizado c/ human revision

### 3.3 Review Tool Calls
1. Wrapper `add_hitl(tool_obj)` intercepta chamada
2. `interrupt(request)` apresenta action_request + config (allow_accept/edit/respond)
3. Human response: `accept` → `tool_obj.invoke(input)`; `edit` → invoke c/ new args; `response` → retorna msg direto
4. Resume via `{"type": "accept"}`, `{"type": "edit", "args": {...}}`, ou `{"type": "response", "args": "..."}`

## 4. Supervisor Architecture
### 4.1 Helper: make_supervisor_node
1. Define `State(MessagesState)` c/ `next: str`
2. System prompt: "You are supervisor managing conversation between workers: {members}. Given request, respond with worker to act next. When finished, FINISH."
3. Use `llm.with_structured_output(Router)` p/ garantir routing schema
4. Router TypedDict: `next: Literal[*options]`
5. `Command(goto=goto, update={"next": goto})` — FINISH mapeia p/ END

### 4.2 Helper: make_react_worker_node
1. `create_react_agent(llm, tools=tools, prompt=prompt)` cria agente especializado
2. Node function invokes agent, extrai ultima msg content
3. `Command(update={"messages": [HumanMessage(content=content, name=name)]}, goto="supervisor")`

### 4.3 Build Research Team
1. Define roles (SEARCH_PROMPT, SCRAPER_PROMPT, EXA_PROMPT, PATENT_PROMPT)
2. Create specs dict c/ name, tools, prompt p/ cada worker
3. Instantiate workers via `make_react_worker_node`
4. Create supervisor: `make_supervisor_node(llm, members=["search","web_scraper",...])`
5. Build graph: register supervisor + worker nodes; edges: START→supervisor, cada worker→supervisor
6. Compile, run c/ `graph.stream({"messages": [("user", query)]}, {"recursion_limit": 100})`

## 5. Hierarchical Architecture
1. Build research team graph (subgraph)
2. Build writing team graph (subgraph)
3. Create "super graph": `StateGraph(State)` → nodes: supervisor, research_team, writing_team
4. Edge: START→supervisor; supervisor routes to research_team ou writing_team
5. Subgraphs retornam p/ supervisor via `Command(goto="supervisor")`
6. Run: supervisor decide qual team ativar, teams devolvem controle

## 6. Swarm Architecture
### 6.1 Handoff Tools
1. `to_writer = create_handoff_tool(agent_name="writer_assistant", description="...")`
2. `to_research = create_handoff_tool(agent_name="research_assistant", description="...")`
3. Customize: tool name, description, task args, filtered data passado

### 6.2 Agents Setup
1. research_assistant: `create_react_agent(model, tools=[search, scrape, to_writer], prompt="...", name="research_assistant")`
2. writer_assistant: `create_react_agent(model, tools=[to_research], prompt="...", name="writer_assistant")`
3. Role: researcher busca 3-5 sources, scraper extrai detalhes, handoff to writer
4. Writer: synthesizes answer c/ citations, pode handoff back p/ research

### 6.3 Swarm Build
1. `swarm = create_swarm(agents=[research_assistant, writer_assistant], default_active_agent="research_assistant").compile()`
2. Run: `swarm.stream({"messages": [{"role": "user", "content": query}]})`

## 7. Tabela Decisão Padrões
- **CoT**: step-by-step reasoning, math, planning, analysis. +reliability/transparency. -slower/verbose
- **ToT**: exploratory tasks, multiple solution paths, creative writing. +explores alternatives. -higher compute
- **ReAct**: research, coding, APIs needing reasoning+tool use. +audit trail, adaptive. -complex state mgmt
- **Supervisor**: small teams c/ clear boundaries. +simple, strong control. -central bottleneck
- **Hierarchical**: multi-team workflows. +modular, scalable. -harder debug
- **Swarm**: dynamic peer-to-peer collaboration. +flexible, natural back-forth. -less predictable
