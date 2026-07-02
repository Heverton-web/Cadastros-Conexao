# Workflow: Módulo Completo

> Workflow automático que executa as 3 skills essenciais de um módulo em sequência usando subagentes assíncronos.

**Comando:** `/modulo-completo <nome_modulo>`  
**Exemplo:** `/modulo-completo cadastros`

---

## 1. Visão Geral

O workflow **Módulo Completo** orquestra a execução de três skills fundamentais para qualquer módulo do ERP Conexão:

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW MÓDULO COMPLETO                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  📄 DOC     │───▶│  🎨 DESIGN  │───▶│  📱 RESP    │         │
│  │  (5-10min)  │    │  (10-20min) │    │  (10-15min) │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  Subagentes: 3 (um por fase)                                   │
│  Modo: Assíncrono (sequencial)                                  │
│  Timeout: 600s por fase                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Fases do Workflow

### Fase 1: Documentação (`documentar-modulo`)

**Skill:** `.agents/skills/documentar-modulo/SKILL.md`  
**Trigger:** `/doc <modulo>`  
**Duração estimada:** 5-10 minutos

**O que faz:**
- Valida se o módulo existe em `src/features/<modulo>/`
- Mapeia estrutura completa do diretório
- Analisa rotas, permissões, nav items
- Extrai schema das tabelas Supabase
- Gera documentação completa em Markdown

**Saída:**  
`docs-projeto/doc-modulos/mod-<modulo>/<modulo>.md`

**Conteúdo do documento:**
1. Core do Módulo (descrição)
2. Estrutura do Diretório (árvore)
3. Rotas (tabela)
4. Permissões (tabela)
5. Defaults por Papel (tabela)
6. Navegação Sidebar (tabela)
7. Eventos/Webhooks (tabela)
8. Funcionalidades (tabela)
9. Dependências (tabelas Supabase e módulos)
10. Schema das Tabelas (SQL consolidado)
11. Notas

---

### Fase 2: Design Frontend (`design-frontend`)

**Skill:** `.agents/skills/design-frontend/SKILL.md`  
**Trigger:** `/design <rota>`  
**Duração estimada:** 10-20 minutos

**O que faz:**
- Lista todas as rotas do módulo
- Para cada rota, aplica classes do design system
- Substitui classes CSS existentes pelas classes do dashboard
- Mantém mobile-first em todas as referências

**Regras Inegociáveis:**
- NUNCA alterar lógica de negócio
- NUNCA criar novos elementos JSX
- NUNCA remover elementos existentes
- O ÚNICO ALTERADO É O `className`

**Classes Substituídas:**
- Container Principal
- Header (h1 + subtítulo)
- Botões de Ação
- Cards de Métricas
- Cards de Lista
- Skeleton Loading
- Empty State
- Filtros
- Modais (Dialog/AlertDialog)
- Ícones

---

### Fase 3: Responsividade (`responsividade`)

**Skill:** `.agents/skills/responsividade/SKILL.md`  
**Trigger:** `/responsividade <modulo>`  
**Duração estimada:** 10-15 minutos

**O que faz:**
- Analisa responsividade de todas as rotas
- Identifica padrões problemáticos (touch, hover, grids)
- Gera documento de análise completo
- Implementa correções automaticamente
- Valida TypeScript após cada edição

**Saída:**  
`docs-projeto/doc-responsividade/resp-<modulo>/cadastros.md`

**Conteúdo do documento:**
1. Objetivo
2. Rotas Analisadas
3. Framework de Responsividade (breakpoints)
4. Análise por Rota
5. Problemas Identificados (por severidade)
6. Plano de Correção (por fase)
7. Testes Pós-Implementação

---

## 3. Uso

### Via Comando (Recomendado)

```
/modulo-completo cadastros
/modulo-completo crm
/modulo-completo rotas
```

### Via Workflow Manual

```javascript
workflow({
  operation: "run",
  name: "modulo-completo",
  args: { modulo: "cadastros" }
})
```

### Modo Assíncrono (Background)

```javascript
workflow({
  operation: "run",
  name: "modulo-completo",
  args: { modulo: "cadastros" },
  async: true
})
```

---

## 4. Arquivos Gerados

| Fase | Caminho | Descrição |
|------|---------|-----------|
| Documentação | `docs-projeto/doc-modulos/mod-<modulo>/<modulo>.md` | Documentação completa do módulo |
| Design | (arquivos modificados in-place) | Classes CSS atualizadas |
| Responsividade | `docs-projeto/doc-responsividade/resp-<modulo>/cadastros.md` | Análise de responsividade |

---

## 5. Relatório de Saída

O workflow retorna um relatório estruturado:

```markdown
# Workflow Modulo Completo — cadastros

## Resultado

| Fase | Status |
|------|--------|
| 📄 Documentação | ✅ Concluído |
| 🎨 Design Frontend | ✅ Concluído |
| 📱 Responsividade | ✅ Concluído |

**Total:** 3/3 fases concluídas
**Tempo total:** 45.2s

## Arquivos Gerados

- Documentação: `docs-projeto/doc-modulos/mod-cadastros/cadastros.md`
- Análise de Responsividade: `docs-projeto/doc-responsividade/resp-cadastros/cadastros.md`
```

---

## 6. Módulos Disponíveis

```
admin, api-connectors, cadastros, clientes, consultor, credenciais,
crm, dashboard, demos, despesas, documentos, empresas, form-schema,
funis, hub, integracoes, linktree, mapas, marketing, nps, paytrack,
precadastro, relatorios, revisoes, rotas
```

---

## 7. Estrutura de Arquivos

```
erp-conexao/
├── .mimocode/
│   └── workflows/
│       └── modulo-completo.mjs          # Script do workflow
├── .claude/
│   └── commands/
│       └── modulo-completo.md           # Comando MiMo Code
├── .opencode/
│   └── commands/
│       └── modulo-completo.md           # Comando Open Code
├── .agents/
│   └── skills/
│       ├── documentar-modulo/
│       │   └── SKILL.md                 # Skill de documentação
│       ├── design-frontend/
│       │   └── SKILL.md                 # Skill de design
│       └── responsividade/
│           └── SKILL.md                 # Skill de responsividade
└── docs-projeto/
    └── doc-workflows/
        └── workflow-modulo-completo.md  # Este documento
```

---

## 8. Compatibilidade

### MiMo Code
- Comando: `/modulo-completo <modulo>`
- Localização: `.claude/commands/modulo-completo.md`

### Open Code
- Comando: `/modulo-completo <modulo>`
- Localização: `.opencode/commands/modulo-completo.md`

### Anti-Gravity
- Workflow via tool `workflow`
- Nome: `modulo-completo`

---

## 9. Tratamento de Erros

| Cenário | Comportamento |
|---------|---------------|
| Módulo não existe | Fase 1 falha, workflow continua |
| Skill falha | Fase marcada como failed, próximas executam |
| Erro TypeScript | Validação detecta, relata no documento |
| Timeout | Fase cancelada, workflow continua |

---

## 10. Personalização

### Executar apenas uma fase

Para executar apenas uma fase específica, use a skill diretamente:

```bash
# Apenas documentação
/doc cadastros

# Apenas design
/design /cadastros/consultor

# Apenas responsividade
/responsividade cadastros
```

### Executar múltiplos módulos

```bash
/modulo-completo cadastros
/modulo-completo crm
/modulo-completo rotas
```

---

## 11. Notas Técnicas

- **Subagentes:** Cada fase roda em um subagente isolado
- **Memória:** Subagentes não compartilham contexto entre si
- **Timeout:** 600 segundos por fase (10 minutos)
- **Retry:** Não há retry automático — falhas são reportadas
- **Logs:** Cada fase gera logs detalhados no relatório

---

## 12. Versão

| Campo | Valor |
|-------|-------|
| Versão | 1.0.0 |
| Data | 2026-07-02 |
| Autor | MiMo Code |
| Skills | documentar-modulo, design-frontend, responsividade |
