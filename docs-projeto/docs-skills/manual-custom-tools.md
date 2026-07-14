# Manual de Criação de Custom Tools

Guia prático para criar ferramentas customizadas nos principais agentes de IA para programação.

---

## Sumário

1. [OpenCode](#1-opencode)
2. [MiMo Code](#2-mimo-code)
3. [Antigravity (Google)](#3-antigravity-google)
4. [Tabela Comparativa](#4-tabela-comparativa)
5. [Exemplo Prático: Tool de Gastos por Sessão](#5-exemplo-prático)

---

## 1. OpenCode

### Arquivo de Configuração

Tools são arquivos **TS/JS** em:

| Escopo | Caminho |
|---|---|
| Projeto | `.opencode/tools/*.ts` |
| Global | `~/.config/opencode/tools/*.ts` |

### Estrutura

```ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Descrição clara do que a tool faz",
  args: {
    param: tool.schema.string().describe("Descrição do parâmetro"),
  },
  async execute(args) {
    // Lógica em qualquer linguagem via Bun.$ ou subprocess
    const result = await Bun.$`node scripts/meu-script.mjs ${args.param}`.text()
    return result
  },
})
```

### Regras

- **Nome do arquivo** = nome da tool (ex: `gastos.ts` → tool `gastos`)
- Múltiplos exports: `<filename>_<exportname>`
- Se colidir com tool built-in, a custom tem precedência
- Schema via Zod (`tool.schema`)
- Pode executar scripts de qualquer linguagem via `Bun.$`

### Invocação

O LLM chama automaticamente quando identificar necessidade pelo `description` e `args`.

---

## 2. MiMo Code

MiMo Code é um **fork do OpenCode** pela Xiaomi — a API é essencialmente idêntica.

### Arquivo de Configuração

| Escopo | Caminho |
|---|---|
| Projeto | `.mimocode/tools/*.ts` |
| Global | `~/.config/mimocode/tools/*.ts` |

### Estrutura

```ts
import { tool } from "@mimocode/cli/plugin"

export default tool({
  description: "Descrição clara",
  args: {
    query: tool.schema.string().describe("SQL query"),
  },
  async execute(args) {
    return `Executed query: ${args.query}`
  },
})
```

### Diferenças do OpenCode

- Import de `@mimocode/cli/plugin` em vez de `@opencode-ai/plugin`
- Também suporta MCP servers via `mimocode.jsonc` seção `mcp`
- Todo o resto (naming, args schema, execução) é idêntico

---

## 3. Antigravity (Google)

**Não** tem sistema de plugin TS/JS como OpenCode. Usa **exclusivamente MCP (Model Context Protocol)**.

### Arquivo de Configuração

**Global apenas** (por enquanto):

```
~/.gemini/antigravity/mcp_config.json
```

### Estrutura

**1. Criar um MCP Server** em qualquer linguagem:

```python
# mcp_server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("MeuServico")

@mcp.tool()
def buscar_dados(query: str) -> str:
    """Descrição usada pelo LLM para entender quando chamar esta tool"""
    # Lógica aqui
    return f"Resultado para: {query}"

mcp.run()
```

**2. Registrar no JSON:**

```json
{
  "mcpServers": {
    "meu-servico": {
      "command": "python",
      "args": ["/caminho/absoluto/mcp_server.py"]
    }
  }
}
```

### SDKs Disponíveis

| Linguagem | Pacote |
|---|---|
| Python | `pip install mcp` (FastMCP) |
| TypeScript | `npm install @modelcontextprotocol/sdk` |
| Go | `github.com/mark3labs/mcp-go` |
| Java | `io.modelcontextprotocol:mcp` |

### Invocação

O agente descobre tools automaticamente via MCP handshake na inicialização.

### Limitações

- Requer servidor externo rodando (não é só criar um arquivo)
- Apenas configuração global (`~/.gemini/`), sem escopo por projeto
- Cada MCP server adiciona tokens ao contexto
- Per-workspace MCP ainda não é nativo

---

## 4. Tabela Comparativa

| Aspecto | OpenCode | MiMo Code | Antigravity |
|---|---|---|---|
| **Mecanismo** | Plugin TS/JS (`tool()`) | Plugin TS/JS (`tool()`) | MCP Server externo |
| **Config file** | `.opencode/tools/*.ts` | `.mimocode/tools/*.ts` | `~/.gemini/antigravity/mcp_config.json` |
| **Linguagem def** | TS/JS (executa qualquer lingua via Bun.$) | TS/JS (executa qualquer lingua) | Qualquer (Python, TS, Go, etc) |
| **Setup** | Criar 1 arquivo | Criar 1 arquivo | Criar server + registrar JSON |
| **Simplicidade** | Alta | Alta | Média |
| **Escopo** | Projeto e Global | Projeto e Global | Global apenas |
| **Contexto extra** | Mínimo | Mínimo | Adiciona ao contexto |
| **Args schema** | Zod (`tool.schema.string()`) | Zod (`tool.schema.string()`) | Type hints Python / JSON Schema |

---

## 5. Exemplo Prático

Tool de gastos por sessão implementada nos 3 sistemas:

### OpenCode / MiMo Code

```ts
// .opencode/tools/gastos.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Exibe gastos acumulados da sessão atual lendo .agents/session-cost.jsonl",
  args: {
    session_id: tool.schema.string().optional().describe("Filtrar por session_id"),
  },
  async execute(args) {
    const filter = args.session_id ? ` ${args.session_id}` : ""
    const result = await Bun.$`node scripts/gastos-sessao.mjs${filter}`.text()
    return result
  },
})
```

### Antigravity (MCP Server)

```python
# ~/mcp-servers/gastos-server.py
from mcp.server.fastmcp import FastMCP
import json, os

mcp = FastMCP("GastosSessao")

@mcp.tool()
def gastos_sessao(session_id: str = "") -> str:
    """Exibe gastos acumulados lendo .agents/session-cost.jsonl"""
    path = ".agents/session-cost.jsonl"
    if not os.path.exists(path):
        return "Nenhum registro de gastos encontrado."

    with open(path) as f:
        lines = [json.loads(l) for l in f if l.strip()]

    if session_id:
        lines = [l for l in lines if l.get("session_id") == session_id]

    total = sum(l.get("cost", 0) for l in lines)
    tokens_in = sum(l.get("tokens_in", 0) for l in lines)
    tokens_out = sum(l.get("tokens_out", 0) for l in lines)
    brl = total * 5.50

    return (
        f"Total: ${total:.4f} / R$ {brl:.4f}\n"
        f"Tokens: {tokens_in:,} in / {tokens_out:,} out\n"
        f"Sessões: {len(set(l.get('session_id','?') for l in lines))}\n"
        f"Ações: {len(lines)}"
    )

mcp.run()
```

Registro no `~/.gemini/antigravity/mcp_config.json`:
```json
{
  "mcpServers": {
    "gastos-sessao": {
      "command": "python",
      "args": ["/caminho/absoluto/gastos-server.py"]
    }
  }
}
```

---

> **Nota:** OpenCode também suporta MCP servers (via `opencode.json` seção `mcpServers`), então o exemplo MCP funciona nos 3. A diferença é que OpenCode/MiMo têm a camada extra de plugin TS/JS mais simples.
