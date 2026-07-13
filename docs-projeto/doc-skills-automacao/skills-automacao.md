# Análise de Skills e Automação de Agentes — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** OpenCode + Skills

---

## 1. Skills Disponíveis (15)

| Skill | Descrição | Trigger |
|---|---|---|
| `criar-modulo` | Cria estrutura de novo módulo | `/modulo` |
| `criar-rota` | Cria rota protegida | `/rota` |
| `gerar-crud` | Operações CRUD | `/crud` |
| `criar-componente-modulo` | Componente React | `/componente` |
| `adicionar-permissao` | Permissão granular | `/permissao` |
| `gerenciar-nav-items` | Itens de navegação | `/nav` |
| `design-frontend` | Design system | `/design` |
| `responsividade` | Correção mobile-first | `/responsividade` |
| `deploy-vps` | Deploy completo | `/deploy` |
| `gerar-pagina` | Página completa | `/pagina` |
| `gerar-formulario` | Formulário RHF+Zod | `/formulario` |
| `gerar-modal` | Modal/Dialog | `/modal` |
| `criar-design-modulo` | Design config | `/design-modulo` |
| `validar-modulo` | Verificação | `/validar` |
| `loop` | Loop autônomo | `/loop` |

---

## 2. Sistema de Agentes

```
AGENTS.md
├── Regras de eficiência (Caveman, Lean-Ctx, Headroom)
├── Skills catalogadas
├── RTK (Real-Time Knowledge)
└── Deploy flow
```

### Habilidades dos Agentes

- **Caveman**: Comunicação ultra-compacta
- **Pre-flight check**: Validação antes de implementação
- **Headroom**: Filtro de logs longos
- **Lean-ctx**: Estratégia de contexto limitado

---

## 3. Configuração (opencode.json)

Arquivo de configuração na raiz do projeto para ferramenta OpenCode.

---

## 4. Estrutura de Skills

```
.agents/skills/<skill-name>/
├── SKILL.md      → Instruções da skill
└── (opcional)    → Assets da skill
```
